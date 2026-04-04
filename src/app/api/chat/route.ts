import { NextResponse } from "next/server";
import { hybridSearch, generateTutorResponse } from "@/src/lib/ai/rag";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Search Knowledge Base
    const context = await hybridSearch(message);

    // 2. Generate AI Response using RAG
    const response = await generateTutorResponse(message, context);

    return NextResponse.json({
      response,
      sources: context.map(c => ({ id: c.id, metadata: c.metadata }))
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
