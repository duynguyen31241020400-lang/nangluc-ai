import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function resolveApiKey() {
  return process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

export function getAi(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = resolveApiKey();
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY / API_KEY. Please set it in your environment variables.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
    });
  }
  return aiInstance;
}

export const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-2.5-flash";
export const EMBEDDING_MODEL = "gemini-embedding-2-preview";

export function hasAiConfig() {
  return Boolean(resolveApiKey());
}
