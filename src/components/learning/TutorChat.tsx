"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Send, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
    <section className="flex h-full min-h-[28rem] flex-col rounded-[2rem] border border-stone-200 bg-[#fffdf7] shadow-sm ring-1 ring-stone-200 sm:min-h-[34rem]">
      <div className="flex items-start justify-between gap-4 border-b border-stone-200 bg-stone-50/80 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-900 ring-1 ring-rose-900/15">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900">AI Tutor</p>
            <h2 className="font-display text-base font-bold text-stone-900">{activeNode.shortLabel}</h2>
            <p className="text-xs text-stone-500">Đang bám đúng topic Minh cần ưu tiên trước.</p>
          </div>
        </div>
        <div className="rounded-2xl bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
          {learnerContext.learnerName} · {learnerContext.learnerGrade}
        </div>
      </div>

      <div className="border-b border-stone-200 bg-[#fffdf7] px-5 py-3 text-sm text-stone-600">
        Điểm yếu hiện tại: <span className="font-semibold text-stone-900">{learnerContext.weakArea}</span>. Mục tiêu: <span className="font-semibold text-stone-900">{learnerContext.learnerTarget}</span>
      </div>

      <div ref={scrollRef} className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              "flex items-start gap-3",
              message.role === "user" && "justify-end",
            )}
          >
            {message.role === "tutor" ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-900 to-stone-900 text-[10px] font-bold tracking-[0.18em] text-[#faf7ef] shadow-sm">
                AI
              </div>
            ) : null}
            <div
              className={cn(
                "max-w-[82%] break-words rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm",
                message.role === "tutor"
                  ? "border border-stone-200 bg-stone-50 text-stone-700 ring-1 ring-stone-200"
                  : "bg-rose-900 text-[#faf7ef] shadow-xl shadow-rose-900/10 ring-1 ring-rose-900/20",
              )}
            >
              {message.role === "tutor" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="my-2 list-disc pl-5">{children}</ul>,
                    ol: ({ children }) => <ol className="my-2 list-decimal pl-5">{children}</ol>,
                    li: ({ children }) => <li className="my-1">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-stone-900">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => (
                      <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[0.95em] text-stone-800 ring-1 ring-stone-200">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
            {message.role === "user" ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-stone-100 text-stone-600 ring-1 ring-stone-200">
                <User className="h-4 w-4" />
              </div>
            ) : null}
          </div>
        ))}

        {isLoading ? (
          <div className="ml-12 flex items-center gap-1 text-sm text-stone-400">
            <span className="h-2 w-2 rounded-full bg-rose-300 animate-bounce" />
            <span className="h-2 w-2 rounded-full bg-rose-300 animate-bounce [animation-delay:120ms]" />
            <span className="h-2 w-2 rounded-full bg-rose-300 animate-bounce [animation-delay:240ms]" />
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-stone-200 p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2 shadow-inner ring-1 ring-stone-200">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={`Hỏi về ${activeNode.shortLabel.toLowerCase()} hoặc nhờ tutor gợi ý bước tiếp theo...`}
            className="h-11 flex-1 bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
            maxLength={500}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-900 text-[#faf7ef] transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {input.length >= 400 ? (
          <p className={cn("pt-2 pr-4 text-right text-[11px]", input.length >= 480 ? "text-amber-700" : "text-stone-400")}>
            {input.length}/500
          </p>
        ) : null}
      </form>
    </section>
  );
}
