import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getAi(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY / API_KEY. Please set it in your environment variables.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
    });
  }
  return aiInstance;
}

export const CHAT_MODEL = "gemini-3.1-pro-preview";
export const EMBEDDING_MODEL = "gemini-embedding-2-preview";
