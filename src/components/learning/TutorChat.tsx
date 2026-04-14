"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import type { LearningNode } from "@/src/lib/data/competition";
import { cn } from "@/src/lib/utils";

interface LearnerContext {
  learnerName: string;
  learnerGrade: string;
  learnerTarget: string;
  shortGoal: string;
  weakArea: string;
  activeTopic: string;
  recommendedAction: string;
}

interface Message {
  role: "user" | "tutor";
  content: string;
}

interface TutorChatProps {
  activeNode: LearningNode;
  learnerContext: LearnerContext;
}

function buildGreeting(context: LearnerContext) {
  return `Chào ${context.learnerName}! Hiện tại mình đang bám vào ${context.activeTopic.toLowerCase()} vì đây là chỗ Minh cần ưu tiên nhất. Mục tiêu ngắn hạn là: ${context.shortGoal}`;
}

function buildFocusNudge(context: LearnerContext, node: LearningNode) {
  return `Đã chuyển sang ${node.title.toLowerCase()}. Mình sẽ giữ câu trả lời bám đúng topic này và nhắc Minh tập trung vào: ${context.recommendedAction}`;
}

export default function TutorChat({ activeNode, learnerContext }: TutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "tutor",
      content: buildGreeting(learnerContext),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousNodeId = useRef(activeNode.id);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (previousNodeId.current === activeNode.id) {
      return;
    }

    previousNodeId.current = activeNode.id;
    setMessages((current) => [
      ...current,
      {
        role: "tutor",
        content: buildFocusNudge(learnerContext, activeNode),
      },
    ]);
  }, [activeNode, learnerContext]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const nextHistory = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-6),
          activeNode,
          learnerContext,
        }),
      });

      const data = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: "tutor",
          content: data.response ?? "Mình vừa mất kết nối ngắn, nhưng vẫn đang bám vào đúng topic của Minh.",
        },
      ]);
    } catch (error) {
      console.error("Tutor chat error", error);
      setMessages((current) => [
        ...current,
        {
          role: "tutor",
          content: `Mình chưa lấy được phản hồi từ API nên tạm nhắc Minh tập trung vào ${activeNode.shortLabel.toLowerCase()} trước nhé.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex h-full min-h-[38rem] flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-700">AI Tutor</p>
            <h2 className="text-lg font-bold text-slate-900">Đang bám topic: {activeNode.shortLabel}</h2>
          </div>
        </div>
        <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          {learnerContext.learnerName} - {learnerContext.learnerGrade}
        </div>
      </div>

      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">
        Điểm yếu hiện tại: <span className="font-semibold text-slate-900">{learnerContext.weakArea}</span>. Mục tiêu: <span className="font-semibold text-slate-900">{learnerContext.learnerTarget}</span>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              "flex items-start gap-3",
              message.role === "user" && "justify-end",
            )}
          >
            {message.role === "tutor" ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Bot className="h-4 w-4" />
              </div>
            ) : null}
            <div
              className={cn(
                "max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm",
                message.role === "tutor"
                  ? "rounded-tl-md border border-slate-200 bg-slate-50 text-slate-700"
                  : "rounded-tr-md bg-blue-600 text-white",
              )}
            >
              {message.content}
            </div>
            {message.role === "user" ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <User className="h-4 w-4" />
              </div>
            ) : null}
          </div>
        ))}

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Lumiq AI đang dựng gợi ý tiếp theo cho Minh...
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 shadow-inner">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={`Hỏi về ${activeNode.shortLabel.toLowerCase()} hoặc nhờ tutor gợi ý bước tiếp theo...`}
            className="h-11 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}
