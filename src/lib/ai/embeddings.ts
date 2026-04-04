import { getAi, EMBEDDING_MODEL } from "./gemini";

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const ai = getAi();
    const result = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: [text],
    });
    return result.embeddings[0].values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}
