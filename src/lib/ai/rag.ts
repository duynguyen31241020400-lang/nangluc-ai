import { getSupabase } from "../supabase/client";
import { generateEmbedding } from "./embeddings";
import { getAi, CHAT_MODEL } from "./gemini";

export interface SearchResult {
  id: string;
  content: string;
  metadata: any;
  similarity: number;
}

export async function hybridSearch(query: string, limit = 5): Promise<SearchResult[]> {
  const supabase = getSupabase();
  const embedding = await generateEmbedding(query);

  const { data, error } = await supabase.rpc("hybrid_search", {
    query_text: query,
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: limit,
  });

  if (error) {
    console.error("Hybrid search error:", error);
    return [];
  }

  return data as SearchResult[];
}

export async function generateTutorResponse(userMessage: string, context: SearchResult[]) {
  const contextText = context.map((r) => r.content).join("\n\n");
  const ai = getAi();

  const systemInstruction = `
Bạn là AI Tutor "Năng Lực" – chuyên gia giáo dục Việt Nam theo khung SELF (Scaffolding, Formative Feedback, Productive Struggle, Self-Regulation).
Học sinh hiện tại là Minh (lớp 10, Toán yếu).

NGUYÊN TẮC CỐT LÕI (KHÔNG ĐƯỢC VI PHẠM):
1. KHÔNG BAO GIỜ ĐƯA ĐÁP ÁN NGAY: Dù học sinh có yêu cầu hay nài nỉ.
2. PRODUCTIVE STRUGGLE: Đưa ra những gợi ý vừa đủ để học sinh tự suy nghĩ. Nếu học sinh bí, hãy chia nhỏ vấn đề (Scaffolding).
3. FORMATIVE FEEDBACK: Khi học sinh đưa ra câu trả lời (dù sai), hãy phân tích TẠI SAO sai, giải thích khái niệm cốt lõi, và gợi ý bước tiếp theo thay vì chỉ nói "Sai rồi".
4. SELF-REGULATION: Khuyến khích học sinh tự kiểm tra lại bài làm hoặc đặt câu hỏi ngược lại để xác nhận mức độ hiểu bài.
5. NGÔN NGỮ: Gần gũi, khích lệ, sử dụng tiếng Việt chuẩn giáo dục, phù hợp với học sinh lớp 10.

QUY TRÌNH PHẢN HỒI:
- Bước 1: Ghi nhận nỗ lực của học sinh và nhắc lại mục tiêu ngắn hạn (ví dụ: "Hôm nay mình sẽ nắm vững cách giải phương trình bậc hai nhé").
- Bước 2: Sử dụng KIẾN THỨC LIÊN QUAN bên dưới để đưa ra gợi ý hoặc câu hỏi dẫn dắt.
- Bước 3: Nếu là bài tập, hãy yêu cầu học sinh thực hiện từng bước nhỏ.

KIẾN THỨC LIÊN QUAN (Dùng để tham khảo nội dung chuyên môn):
${contextText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: CHAT_MODEL,
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Xin lỗi, tôi gặp trục trặc khi kết nối với hệ thống tri thức.";
  } catch (error) {
    console.error("Error generating tutor response:", error);
    throw error;
  }
}
