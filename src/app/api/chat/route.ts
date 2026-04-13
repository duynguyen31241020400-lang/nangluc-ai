import { NextResponse } from "next/server";
import { generateTutorResponse, hybridSearch, type TutorMessage } from "@/src/lib/ai/rag";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      message?: string;
      history?: TutorMessage[];
      activeNode?: {
        id?: string;
        title?: string;
        shortLabel?: string;
        recommendedAction?: string;
      };
      learnerContext?: {
        learnerName?: string;
        learnerGrade?: string;
        learnerTarget?: string;
        shortGoal?: string;
        weakArea?: string;
        activeTopic?: string;
        recommendedAction?: string;
      };
    };

    const message = payload.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const activeNode =
      payload.activeNode?.id &&
      payload.activeNode.title &&
      payload.activeNode.shortLabel &&
      payload.activeNode.recommendedAction
        ? {
            id: payload.activeNode.id,
            title: payload.activeNode.title,
            shortLabel: payload.activeNode.shortLabel,
            recommendedAction: payload.activeNode.recommendedAction,
          }
        : undefined;

    const searchPrompt = `${activeNode?.title ?? ""} ${payload.learnerContext?.weakArea ?? ""} ${message}`.trim();
    const context = await hybridSearch(searchPrompt, activeNode?.id, 3);
    const response = await generateTutorResponse({
      userMessage: message,
      history: payload.history,
      activeNode,
      learnerContext: payload.learnerContext,
      context,
    });

    return NextResponse.json({
      response,
      sources: context.map((item) => ({ id: item.id, metadata: item.metadata })),
    });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json(
      {
        response: "Mình vẫn đang giữ đúng current goal của Minh, nhưng API vừa lỗi một nhịp. Minh thử gửi lại câu hỏi hoặc nói bước đang làm dở nhé.",
      },
      { status: 200 },
    );
  }
}
