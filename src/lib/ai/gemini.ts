import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const API_KEY_CANDIDATES = ["GEMINI_API_KEY", "Gemini_API_Key", "API_KEY", "NEXT_PUBLIC_GEMINI_API_KEY"] as const;

const NORMALIZED_API_KEY_CANDIDATES = new Set(API_KEY_CANDIDATES.map((key) => key.toLowerCase()));

function resolveApiKeyEntry() {
  for (const key of API_KEY_CANDIDATES) {
    const value = process.env[key];
    if (value) {
      return { apiKey: value, source: key };
    }
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (value && NORMALIZED_API_KEY_CANDIDATES.has(key.toLowerCase())) {
      return { apiKey: value, source: key };
    }
  }

  return { apiKey: undefined, source: null };
}

function resolveApiKey() {
  return resolveApiKeyEntry().apiKey;
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

export function getAiConfigSummary() {
  const { apiKey, source } = resolveApiKeyEntry();
  return {
    hasApiKey: Boolean(apiKey),
    apiKeySource: source,
  };
}
