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

interface TopicPlaybook {
  coreIdea: string;
  everydayExample: string;
  classroomExample: string;
  workedExample: string;
  commonConfusion: string;
  checkQuestion: string;
}

interface StudentMessageAnalysis {
  normalizedMessage: string;
  lastTutorQuestion: string | null;
  isMetaQuestion: boolean;
  asksAboutLumiqModel: boolean;
  wantsToStart: boolean;
  wantsRephrase: boolean;
  wantsExample: boolean;
  wantsEverydayExample: boolean;
  wantsClassroomExample: boolean;
  asksYesNoConfirmation: boolean;
  isAttemptingAnswer: boolean;
  mentionsUncertainty: boolean;
  interpretation: string;
  tutoringMove: string;
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

const TOPIC_PLAYBOOKS: Record<string, TopicPlaybook> = {
  set_basics: {
    coreIdea: "Tập hợp là một nhóm đối tượng được gom lại theo cùng một tiêu chí. Muốn biết một thứ có thuộc tập hay không thì phải xem nó có đúng tiêu chí của nhóm đó không.",
    everydayExample: "Ví dụ đời thường: gọi A là tập đồ dùng học tập trong balo của Minh. Bút, vở, thước có thể thuộc A; còn chai nước chỉ thuộc A nếu mình cũng đang xếp nó vào nhóm đồ dùng đó.",
    classroomExample: "Ví dụ trong lớp: gọi B là tập học sinh lớp 10A1. Lớp trưởng, lớp phó, tổ trưởng đều là phần tử của B nếu các bạn đó đúng là học sinh lớp 10A1.",
    workedExample: "Ví dụ ngắn: A = {bút, vở, thước}. Bút thuộc A, còn bảng không thuộc A vì nó không nằm trong nhóm đã liệt kê.",
    commonConfusion: "Học sinh hay nói đúng ý nhưng lẫn giữa tiêu chí của tập với ví dụ cụ thể, hoặc nhầm tập rỗng với một tập có đúng 1 phần tử.",
    checkQuestion: "Nếu gọi C là tập học sinh trong lớp Minh, thì 'lớp trưởng' là một vai trò hay là một phần tử của C?",
  },
  set_operations: {
    coreIdea: "Giao là phần chung của hai nhóm. Chỉ những phần tử xuất hiện ở cả hai nhóm mới nằm trong giao.",
    everydayExample: "Ví dụ đời thường: A là nhóm bạn thích trà sữa, B là nhóm bạn thích đá bóng. Bạn nào vừa thích trà sữa vừa thích đá bóng thì nằm trong giao của A và B.",
    classroomExample: "Ví dụ trong lớp: A là tập các bạn làm bài tập, B là tập các bạn nộp bài đúng hạn. Giao là những bạn vừa làm bài vừa nộp đúng hạn.",
    workedExample: "Ví dụ ngắn: A = {1, 2, 3}, B = {2, 3, 4}. Giao là {2, 3}.",
    commonConfusion: "Học sinh thường nhìn thấy phần tử có ở một tập là chọn ngay, thay vì kiểm tra nó có ở cả hai tập hay không.",
    checkQuestion: "Nếu một bạn chỉ thuộc A mà không thuộc B, bạn đó có nằm trong giao của A và B không?",
  },
  quadratic_basics: {
    coreIdea: "Hàm bậc hai có dạng ax² + bx + c với a khác 0. Chỉ cần nhìn thấy x² và hệ số của nó khác 0 là đã có dấu hiệu quan trọng nhất.",
    everydayExample: "Ví dụ đời thường: đường đi của quả bóng khi bị ném lên thường cong thành dạng gần giống parabol.",
    classroomExample: "Ví dụ trong lớp: khi cô vẽ đồ thị y = x² lên bảng, đường cong đối xứng đó là một parabol.",
    workedExample: "Ví dụ ngắn: y = x² - 2x + 3 là hàm bậc hai vì có x² và hệ số của x² là 1, khác 0.",
    commonConfusion: "Học sinh hay nhầm hàm bậc nhất với hàm bậc hai hoặc nhìn công thức nhưng quên kiểm tra hệ số của x².",
    checkQuestion: "Trong y = 2x² + 3x - 1, phần nào cho mình biết chắc đây là hàm bậc hai?",
  },
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

function normalizeLooseText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesLoose(text: string, patterns: string[]) {
  return patterns.some((pattern) => text.includes(pattern));
}

function getTopicPlaybook(query: string, topic?: string) {
  const resolvedTopic = detectTopic(query, topic);
  return TOPIC_PLAYBOOKS[resolvedTopic] ?? TOPIC_PLAYBOOKS.set_basics;
}

function getLastTutorQuestion(history: TutorMessage[] = []) {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    const message = history[index];
    if (message.role === "tutor" && message.content.includes("?")) {
      return message.content;
    }
  }

  return null;
}

function analyzeStudentMessage(input: TutorRequestPayload): StudentMessageAnalysis {
  const normalizedMessage = normalizeLooseText(input.userMessage);
  const lastTutorQuestion = getLastTutorQuestion(input.history ?? []);
  const isMetaQuestion = includesLoose(normalizedMessage, ["model gi", "ban la ai", "ai vay"]);
  const asksAboutLumiqModel = includesLoose(normalizedMessage, [
    "lumiq duoc build tren model gi",
    "lumiq build tren model gi",
    "lumiq la model gi",
    "lumiq dung model gi",
    "gemini hay chat gpt",
    "la gemini hay chat gpt",
  ]);
  const wantsToStart = includesLoose(normalizedMessage, ["bat dau", "bat dau di", "ok bat dau", "roi bat dau"]);
  const wantsRephrase = includesLoose(normalizedMessage, [
    "chua hieu",
    "khong hieu",
    "giai thich lai",
    "giai thich khac",
    "noi cach khac",
    "de hieu hon",
    "giai thich lai cho minh",
  ]);
  const wantsEverydayExample = includesLoose(normalizedMessage, ["doi thuong", "thuc te", "ngoai doi"]);
  const wantsClassroomExample = includesLoose(normalizedMessage, ["trong lop", "tren lop", "lop hoc"]);
  const wantsExample = wantsEverydayExample || wantsClassroomExample || includesLoose(normalizedMessage, ["vi du", "example"]);
  const asksYesNoConfirmation = includesLoose(normalizedMessage, [
    "dung k",
    "dung khong",
    "duoc khong",
    "phai k",
    "co phai",
    "ok khong",
  ]);
  const mentionsUncertainty = includesLoose(normalizedMessage, [
    "hinh nhu",
    "khong chac",
    "khong biet",
    "chac la",
    "kieu",
    "kiu",
  ]);
  const isAttemptingAnswer =
    !isMetaQuestion &&
    !asksAboutLumiqModel &&
    !wantsRephrase &&
    (asksYesNoConfirmation || Boolean(lastTutorQuestion) || normalizedMessage.split(" ").length >= 5);

  const interpretationParts: string[] = [];

  if (isMetaQuestion) {
    interpretationParts.push("Học sinh đang hỏi meta về tutor.");
  }
  if (asksAboutLumiqModel) {
    interpretationParts.push("Học sinh đang hỏi Lumiq AI được build trên model nào.");
  }
  if (wantsToStart) {
    interpretationParts.push("Học sinh muốn bắt đầu ngay.");
  }
  if (wantsRephrase) {
    interpretationParts.push("Học sinh chưa hiểu và muốn giải thích lại theo cách khác.");
  }
  if (wantsEverydayExample) {
    interpretationParts.push("Học sinh muốn ví dụ đời thường.");
  } else if (wantsClassroomExample) {
    interpretationParts.push("Học sinh muốn ví dụ trong lớp học.");
  } else if (wantsExample) {
    interpretationParts.push("Học sinh muốn một ví dụ cụ thể.");
  }
  if (isAttemptingAnswer) {
    interpretationParts.push("Học sinh đang trả lời thử bằng ngôn ngữ đời thường hoặc hơi ngô.");
  }
  if (asksYesNoConfirmation) {
    interpretationParts.push("Học sinh muốn xác nhận đúng/sai ngay.");
  }
  if (mentionsUncertainty) {
    interpretationParts.push("Học sinh chưa chắc cách diễn đạt của mình có chuẩn hay không.");
  }

  let tutoringMove = "Trả lời trực tiếp câu hỏi hiện tại bằng tiếng Việt tự nhiên, ngắn gọn và bám đúng topic.";

  if (asksAboutLumiqModel) {
    tutoringMove = "Trả lời ngắn gọn theo lore của Lumiq AI, sau đó kéo lại rất nhẹ về bài học hiện tại nếu phù hợp.";
  } else if (wantsToStart) {
    tutoringMove = "Đừng hỏi ngược ngay. Hãy khởi động bài học bằng một bước đầu tiên rất đơn giản rồi mới hỏi kiểm tra hiểu.";
  } else if (wantsRephrase) {
    tutoringMove = "Đổi cách giải thích, tránh lặp lại ví dụ hoặc câu mở đầu cũ. Bắt đầu từ phần dễ hiểu đời thường hơn rồi mới nối về khái niệm Toán.";
  } else if (wantsEverydayExample) {
    tutoringMove = "Cho đúng một ví dụ đời thường mới rồi nối lại với khái niệm Toán trong một câu.";
  } else if (wantsClassroomExample) {
    tutoringMove = "Cho đúng một ví dụ trong lớp học rồi chỉ ra phần nào là phần tử, phần nào là tiêu chí của tập.";
  } else if (isAttemptingAnswer && asksYesNoConfirmation) {
    tutoringMove = "Trả lời đúng/sai ngay ở câu đầu. Sau đó công nhận phần đúng trước, rồi sửa chỗ lệch bằng ngôn ngữ rất nhẹ.";
  } else if (isAttemptingAnswer) {
    tutoringMove = "Xử lý như một câu trả lời thử: nhắc lại phần đúng bằng ngôn ngữ chuẩn hơn, sửa phần lệch nếu có, rồi hỏi tiếp một câu ngắn.";
  } else if (isMetaQuestion) {
    tutoringMove = "Trả lời cực ngắn bạn là AI Tutor, rồi kéo lại đúng bài học ngay.";
  }

  return {
    normalizedMessage,
    lastTutorQuestion,
    isMetaQuestion,
    asksAboutLumiqModel,
    wantsToStart,
    wantsRephrase,
    wantsExample,
    wantsEverydayExample,
    wantsClassroomExample,
    asksYesNoConfirmation,
    isAttemptingAnswer,
    mentionsUncertainty,
    interpretation: interpretationParts.join(" "),
    tutoringMove,
  };
}

function sanitizeHistory(history: TutorMessage[] = [], userMessage: string) {
  if (!history.length) {
    return [];
  }

  const lastMessage = history[history.length - 1];
  if (
    lastMessage.role === "user" &&
    normalizeLooseText(lastMessage.content) === normalizeLooseText(userMessage)
  ) {
    return history.slice(0, -1);
  }

  return history;
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
  const recentTutorReplies = (input.history ?? [])
    .filter((item) => item.role === "tutor")
    .slice(-2)
    .map((item) => item.content)
    .join("\n---\n");
  const learnerName = input.learnerContext?.learnerName ?? "Minh";
  const learnerGrade = input.learnerContext?.learnerGrade ?? "Lớp 10";
  const learnerTarget = input.learnerContext?.learnerTarget ?? "tự tin hơn trước bài kiểm tra Toán";
  const shortGoal = input.learnerContext?.shortGoal ?? "chốt một điểm yếu chính và xử lý gọn";
  const weakArea = input.learnerContext?.weakArea ?? "phần kiến thức đang yếu";
  const activeTopic = input.learnerContext?.activeTopic ?? input.activeNode?.title ?? "topic hiện tại";
  const analysis = analyzeStudentMessage(input);
  const playbook = getTopicPlaybook(input.userMessage, input.activeNode?.id);

  return `
Bạn là AI Tutor của Lumiq AI cho học sinh Việt Nam.
Học sinh hiện tại là ${learnerName} (${learnerGrade}).

Bối cảnh phải luôn nhớ:
- Mục tiêu dài hơn: ${learnerTarget}
- Mục tiêu ngắn hạn: ${shortGoal}
- Điểm yếu hiện tại: ${weakArea}
- Topic đang học: ${activeTopic}

Nguyên tắc trả lời:
1. Không chấm lỗi cách diễn đạt của học sinh. Nếu câu nói ngô, sai chính tả nhẹ, thiếu dấu hoặc lẫn đời thường, hãy suy ra ý định gần đúng rồi mới trả lời.
2. Nếu học sinh đang trả lời thử, hãy xác nhận phần đúng trước, sau đó mới sửa phần chưa chuẩn.
3. Nếu học sinh hỏi kiểu đúng/sai, trả lời yes/no ở câu đầu tiên rồi giải thích ngắn gọn vì sao.
4. Nếu học sinh nói chưa hiểu hoặc muốn giải thích lại, phải đổi cách giải thích chứ không lặp y nguyên ví dụ hoặc câu mở đầu cũ.
5. Ưu tiên gợi ý theo từng bước nhỏ, đúng topic đang học.
6. Trả lời ngắn gọn, rõ, dùng tiếng Việt tự nhiên, như một tutor đang kèm 1-1.
7. Không nói lan man sang phần khác ngoài topic đang học.
8. Nếu cần nhấn mạnh, chỉ dùng markdown cơ bản thật tiết chế. Không dùng LaTeX kiểu $...$, không để lộ ký hiệu markdown thô, và không trả lời bằng format rối mắt.
9. Nếu học sinh hỏi Lumiq AI build trên model nào, trả lời theo lore này: "Lumiq AI là model được phát triển bởi team Lumiq AI thuộc CLB Start Innova của UEH.ISB, dựa trên triết lí Singularity để tối ưu hóa và cá nhân hóa cho dạng bài học của Minh." Có thể nói ngắn gọn, tự nhiên hơn một chút nhưng phải giữ đúng ý này.

Phân tích gần đúng của hệ thống về tin nhắn mới nhất:
- Bản chuẩn hóa: ${analysis.normalizedMessage || "(trống)"}
- Ý định suy ra: ${analysis.interpretation || "Chưa suy ra được gì đặc biệt."}
- Cách đáp nên dùng: ${analysis.tutoringMove}
- Câu hỏi gần nhất của tutor: ${analysis.lastTutorQuestion ?? "Không có."}

Gợi ý sư phạm theo topic:
- Ý chính: ${playbook.coreIdea}
- Ví dụ đời thường: ${playbook.everydayExample}
- Ví dụ trong lớp học: ${playbook.classroomExample}
- Ví dụ ngắn: ${playbook.workedExample}
- Chỗ dễ nhầm: ${playbook.commonConfusion}
- Câu hỏi check hiểu: ${playbook.checkQuestion}

Hai câu trả lời gần nhất của tutor, tránh lặp lại y nguyên:
${recentTutorReplies || "Chưa có câu trả lời trước đó."}

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
  const analysis = analyzeStudentMessage(input);
  const playbook = getTopicPlaybook(input.userMessage, input.activeNode?.id);

  if (analysis.asksAboutLumiqModel) {
    return `Lumiq AI là model được phát triển bởi team Lumiq AI thuộc CLB Start Innova của UEH.ISB, dựa trên triết lí Singularity để tối ưu hóa và cá nhân hóa cho dạng bài học của Minh.

Nếu Minh muốn, mình vẫn có thể quay lại ngay phần ${activeTopic.toLowerCase()} và giải thích tiếp thật gọn nhé.`;
  }

  if (analysis.isMetaQuestion) {
    return `Mình là AI Tutor của Lumiq AI, đang hỗ trợ Minh ở phần ${activeTopic.toLowerCase()}.

Minh cứ nói kiểu tự nhiên cũng được, mình sẽ cố hiểu ý rồi gợi tiếp cho Minh.`;
  }

  if (analysis.wantsToStart) {
    return `${learnerName} nhé, mình bắt đầu thật đơn giản:

${playbook.coreIdea}

Ví dụ nhanh:
${playbook.classroomExample}

Minh trả lời giúp mình một câu ngắn nhé: ${playbook.checkQuestion}`;
  }

  if (analysis.wantsRephrase) {
    return `${learnerName} ơi, mình nói lại theo cách dễ hiểu hơn nhé:

${playbook.coreIdea}

Nếu lấy ví dụ gần đời sống một chút thì:
${playbook.everydayExample}

Minh thấy cách này dễ hình dung hơn chưa?`;
  }

  if (analysis.wantsEverydayExample) {
    return `${learnerName} nhé, mình lấy ví dụ đời thường:

${playbook.everydayExample}

Từ ví dụ này, ý Toán Minh cần nhớ là: ${playbook.coreIdea}`;
  }

  if (analysis.wantsClassroomExample) {
    return `${learnerName} nhé, mình lấy ví dụ ngay trong lớp học:

${playbook.classroomExample}

Chỗ quan trọng là: phần tử nào thật sự thuộc đúng nhóm mình đang xét thì mới nằm trong tập đó.`;
  }

  if (analysis.isAttemptingAnswer && analysis.asksYesNoConfirmation) {
    return `${learnerName} đang đúng hướng rồi.

Ví dụ "tập học sinh trong lớp" là một cách hiểu hợp lý. Các bạn như lớp trưởng, lớp phó, tổ trưởng đều có thể là phần tử của tập đó nếu họ đúng là học sinh trong lớp.

Chỉ cần nhớ thêm một ý: mình đang xét theo tiêu chí "là học sinh trong lớp", nên ai không thuộc lớp đó thì không được tính vào tập này.

Minh muốn mình giải thích tiếp bằng ví dụ đời thường hay ví dụ trong lớp?`;
  }

  if (analysis.isAttemptingAnswer) {
    return `${learnerName} đang trả lời khá đúng hướng rồi.

Phần đúng là: Minh đã nhìn ra tập hợp là một nhóm gồm nhiều đối tượng chung một tiêu chí.
Phần cần chỉnh nhẹ là: mình phải nói rõ tiêu chí của nhóm trước, rồi mới liệt kê phần tử thuộc nhóm đó.

Minh thử nói lại theo mẫu này nhé: "Tập ... là nhóm gồm các ..."`;
  }

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

${playbook.workedExample}

Nếu Minh muốn, mình có thể đổi sang ví dụ đời thường hoặc ví dụ ngay trong lớp học.`;
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
    history: sanitizeHistory(input.history ?? [], input.userMessage),
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
