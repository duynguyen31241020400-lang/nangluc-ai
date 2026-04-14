import type { LearningNode } from "@/src/lib/data/competition";
import { supabase } from "../supabase/client";
import { generateEmbedding } from "./embeddings";
import { CHAT_MODEL, getAi, getAiConfigSummary } from "./gemini";

export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

export interface TutorMessage {
  role: "user" | "tutor";
  content: string;
}

export interface TutorRequestPayload {
  userMessage: string;
  history?: TutorMessage[];
  activeNode?: Pick<LearningNode, "id" | "title" | "shortLabel" | "recommendedAction">;
  learnerContext?: {
    learnerName?: string;
    learnerGrade?: string;
    learnerTarget?: string;
    shortGoal?: string;
    weakArea?: string;
    activeTopic?: string;
    recommendedAction?: string;
  };
  context?: SearchResult[];
}

const FALLBACK_KNOWLEDGE: Record<string, SearchResult[]> = {
  set_basics: [
    {
      id: "kb-set-basics-1",
      content: "Tập số tự nhiên N có chứa số 0. Tập rỗng được ký hiệu là ∅ và khác với {∅} vì {∅} là một tập có một phần tử.",
      metadata: { source: "fallback", topic: "set_basics" },
      similarity: 0.92,
    },
  ],
  set_operations: [
    {
      id: "kb-set-operations-1",
      content: "Giao của hai tập hợp là phần chung. Khi đổi điều kiện 1 < x ≤ 5 sang khoảng hoặc đoạn, ta viết (1; 5].",
      metadata: { source: "fallback", topic: "set_operations" },
      similarity: 0.94,
    },
  ],
  quadratic_basics: [
    {
      id: "kb-quadratic-1",
      content: "Hàm số bậc hai có dạng y = ax² + bx + c với a khác 0. Hoành độ đỉnh được tính bằng -b / (2a).",
      metadata: { source: "fallback", topic: "quadratic_basics" },
      similarity: 0.95,
    },
  ],
};

const RETRYABLE_TUTOR_ERROR_PATTERNS = ["503", "UNAVAILABLE", "overloaded", "temporarily unavailable", "Service Unavailable"];
const RETRY_DELAYS_MS = [400, 1200];

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableTutorError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return RETRYABLE_TUTOR_ERROR_PATTERNS.some((pattern) => message.includes(pattern));
}

function getTutorModelCandidates() {
  const configuredFallbackModel = process.env.GEMINI_FALLBACK_CHAT_MODEL?.trim();
  const defaultFallbackModel = CHAT_MODEL === "gemini-2.5-flash" ? "gemini-2.5-flash-lite" : "gemini-2.5-flash";

  return Array.from(new Set([CHAT_MODEL, configuredFallbackModel, defaultFallbackModel].filter(Boolean))) as string[];
}

function detectTopic(query: string, topic?: string) {
  if (topic && FALLBACK_KNOWLEDGE[topic]) {
    return topic;
  }

  const normalized = query.toLowerCase();

  if (normalized.includes("hàm") || normalized.includes("parabol") || normalized.includes("đỉnh")) {
    return "quadratic_basics";
  }

  if (normalized.includes("giao") || normalized.includes("hợp") || normalized.includes("khoảng") || normalized.includes("đoạn")) {
    return "set_operations";
  }

  return "set_basics";
}

function buildFallbackContext(query: string, topic?: string, limit = 3): SearchResult[] {
  const resolvedTopic = detectTopic(query, topic);
  return (FALLBACK_KNOWLEDGE[resolvedTopic] ?? FALLBACK_KNOWLEDGE.set_basics).slice(0, limit);
}

export async function hybridSearch(query: string, topic?: string, limit = 3): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  if (!hasSupabaseConfig() || !supabase) {
    return buildFallbackContext(query, topic, limit);
  }

  try {
    const embedding = await generateEmbedding(query);
    const { data, error } = await supabase.rpc("hybrid_search", {
      query_text: query,
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: limit,
    });

    if (error || !data?.length) {
      return buildFallbackContext(query, topic, limit);
    }

    return data as SearchResult[];
  } catch (error) {
    console.error("Hybrid search fallback activated", error);
    return buildFallbackContext(query, topic, limit);
  }
}

function buildSystemInstruction(input: TutorRequestPayload) {
  const contextText = (input.context ?? []).map((item) => item.content).join("\n\n");
  const learnerName = input.learnerContext?.learnerName ?? "Minh";
  const learnerGrade = input.learnerContext?.learnerGrade ?? "Lớp 10";
  const learnerTarget = input.learnerContext?.learnerTarget ?? "tự tin hơn trước bài kiểm tra Toán";
  const shortGoal = input.learnerContext?.shortGoal ?? "chốt một điểm yếu chính và xử lý gọn";
  const weakArea = input.learnerContext?.weakArea ?? "phần kiến thức đang yếu";
  const activeTopic = input.learnerContext?.activeTopic ?? input.activeNode?.title ?? "topic hiện tại";

  return `
Bạn là AI Tutor của Lumiq AI cho học sinh Việt Nam.
Học sinh hiện tại là ${learnerName} (${learnerGrade}).

Bối cảnh phải luôn nhớ:
- Mục tiêu dài hơn: ${learnerTarget}
- Mục tiêu ngắn hạn: ${shortGoal}
- Điểm yếu hiện tại: ${weakArea}
- Topic đang học: ${activeTopic}

Nguyên tắc trả lời:
1. Không đưa đáp án trọn vẹn ngay nếu học sinh chưa thử.
2. Ưu tiên gợi ý theo từng bước nhỏ, đúng topic đang học.
3. Nếu có thể, nhắc lại sai lầm phổ biến và hỏi ngược để học sinh tự tiếp tục.
4. Trả lời ngắn gọn, rõ, dùng tiếng Việt tự nhiên.
5. Không nói lan man sang phần khác ngoài topic đang học.

Kiến thức để bám vào:
${contextText || "Không có knowledge base ngoài, hãy bám chặt vào active topic và learner context."}
  `.trim();
}

function buildFallbackTutorResponse(input: TutorRequestPayload) {
  const learnerName = input.learnerContext?.learnerName ?? "Minh";
  const activeTopic = input.learnerContext?.activeTopic ?? input.activeNode?.title ?? "topic hiện tại";
  const weakArea = input.learnerContext?.weakArea ?? activeTopic;
  const recommendedAction = input.learnerContext?.recommendedAction ?? input.activeNode?.recommendedAction ?? "làm từng bước nhỏ rồi kiểm tra lại";
  const hint = (input.context ?? [])[0]?.content ?? "Bắt đầu từ khái niệm cốt lõi, làm 1 ví dụ mẫu rồi thử lại bằng lời của mình.";
  const normalizedMessage = input.userMessage.trim().toLowerCase();

  if (
    normalizedMessage.includes("vấn đề hiện tại") ||
    normalizedMessage.includes("điểm yếu") ||
    normalizedMessage.includes("trình độ") ||
    normalizedMessage.includes("mức nào")
  ) {
    return `${learnerName} đang ở mức cần củng cố thêm ở phần ${weakArea.toLowerCase()}.

Trong prototype này, mình chưa kết luận toàn bộ năng lực Toán của Minh, mà chỉ chốt phần đang yếu nhất để ưu tiên trước.

Điều đó có nghĩa là:
- Minh chưa chắc yếu toàn bộ môn Toán
- nhưng ở ${activeTopic.toLowerCase()}, Minh vẫn cần ôn lại nền tảng
- và bước nên làm ngay là: ${recommendedAction}

Nếu muốn, Minh hỏi tiếp theo kiểu "em đang hổng đúng khái niệm nào?" hoặc "cho em một ví dụ thật dễ trước" nhé.`;
  }

  if (
    normalizedMessage.includes("bạn có hiểu") ||
    normalizedMessage.includes("mình đang nói gì") ||
    normalizedMessage.includes("bạn hiểu")
  ) {
    return `Có, mình hiểu ý Minh.

Minh đang muốn một phản hồi bám đúng câu mình vừa hỏi, chứ không muốn nghe lặp lại cùng một block.

Trong phạm vi hiện tại, điều mình xác định được là ${weakArea.toLowerCase()} đang là điểm cần ưu tiên trước. Nếu Minh nói rõ "em chưa hiểu chỗ nào" hoặc gửi luôn bước đang làm dở, mình sẽ bám đúng chỗ đó để gợi tiếp.`;
  }

  if (
    normalizedMessage.includes("ví dụ") ||
    normalizedMessage.includes("example") ||
    normalizedMessage.includes("giải thích")
  ) {
    return `${learnerName} nhé, mình lấy một ví dụ rất gần với ${activeTopic.toLowerCase()}:

${hint}

Minh thử nói lại quy tắc này bằng lời của mình trước. Khi Minh gửi lại, mình sẽ dựa đúng cách Minh hiểu để sửa hoặc gợi tiếp.`;
  }

  return `${learnerName} ơi, mình đang giữ đúng trọng tâm là ${activeTopic.toLowerCase()} vì đây đang là điểm Minh cần xử lý trước.

Gợi ý nhanh:
- Nhớ lại ý chính: ${hint}
- Bước nên làm ngay: ${recommendedAction}
- Nếu Minh đang kẹt ở ${weakArea.toLowerCase()}, hãy thử nói lại đề bằng ngôn ngữ của mình trước khi tính tiếp.

  Minh thử gửi cho mình bước Minh đang làm dở, mình sẽ gợi tiếp đúng chỗ đó.`;
}

async function requestTutorModelResponse(model: string, input: TutorRequestPayload) {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model,
    contents: [
      ...input.history!.map((message) => `${message.role === "user" ? "Học sinh" : "Tutor"}: ${message.content}`),
      `Học sinh: ${input.userMessage}`,
    ].join("\n"),
    config: {
      temperature: 0.35,
      systemInstruction: buildSystemInstruction(input),
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error(`Gemini returned empty text for model ${model}.`);
  }

  return text;
}

export async function generateTutorResponse(input: TutorRequestPayload) {
  const safeInput = {
    ...input,
    context: input.context ?? [],
    history: input.history ?? [],
  };
  const aiConfig = getAiConfigSummary();
  const attemptedModels: string[] = [];

  try {
    if (!aiConfig.hasApiKey) {
      throw new Error("Missing Gemini API key in runtime environment.");
    }

    let lastError: unknown = null;

    for (const model of getTutorModelCandidates()) {
      attemptedModels.push(model);

      for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
        try {
          return await requestTutorModelResponse(model, safeInput);
        } catch (error) {
          lastError = error;

          if (!isRetryableTutorError(error) || attempt === RETRY_DELAYS_MS.length) {
            break;
          }

          await sleep(RETRY_DELAYS_MS[attempt]);
        }
      }
    }

    throw new Error(
      lastError instanceof Error
        ? `${lastError.message} | attemptedModels=${attemptedModels.join(",")}`
        : `Unknown Gemini error | attemptedModels=${attemptedModels.join(",")}`,
    );
  } catch (error) {
    console.error("Tutor response fallback activated", {
      model: CHAT_MODEL,
      attemptedModels,
      hasApiKey: aiConfig.hasApiKey,
      apiKeySource: aiConfig.apiKeySource,
      error: error instanceof Error ? error.message : String(error),
    });
    return buildFallbackTutorResponse(safeInput);
  }
}
