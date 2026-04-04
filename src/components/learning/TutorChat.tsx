"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Message {
  role: "user" | "tutor";
  content: string;
}

export default function TutorChat() {
  const [messages, setMessages] = useState<message[]>([
    {
      role: "tutor",
      content: "Chào Minh! Hôm nay chúng ta sẽ cùng nhau chinh phục môn Toán lớp 10 nhé. Bạn đang gặp khó khăn ở phần nào hay muốn bắt đầu với mục tiêu gì nào?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<htmldivelement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "tutor", content: data.response }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "tutor", content: "Rất tiếc, hệ thống đang bận một chút. Bạn thử lại sau nhé!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div classname="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div classname="bg-blue-600 p-4 flex items-center gap-3">
        <div classname="bg-white/20 p-2 rounded-lg">
          <sparkles classname="h-5 w-5 text-white"/>
        </div>
        <div>
          <h2 classname="text-white font-semibold leading-none">AI Tutor Năng Lực</h2>
          <p classname="text-blue-100 text-xs mt-1">Đang hỗ trợ: Minh (Lớp 10)</p>
        </div>
      </div>

      {/* Messages Area */}
      <div ref="{scrollRef}" classname="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-slate-50/50">
        <animatepresence initial="{false}">
          {messages.map((msg, idx) => (
            <motion.div key="{idx}" initial="{{" opacity:="" 0,="" y:="" 10,="" scale:="" 0.95="" }}="" animate="{{" opacity:="" 1,="" y:="" 0,="" scale:="" 1="" }}="" classname="{cn(" "flex="" items-start="" gap-3="" max-w-[85%]",="" msg.role="==" "user"="" ?="" "ml-auto="" flex-row-reverse"="" :="" "mr-auto"="" )}="">
              <div classname="{cn(" "p-2="" rounded-full="" flex-shrink-0",="" msg.role="==" "user"="" ?="" "bg-blue-100"="" :="" "bg-white="" border="" border-slate-200="" shadow-sm"="" )}="">
                {msg.role === "user" ? (
                  <user classname="h-4 w-4 text-blue-600"/>
                ) : (
                  <bot classname="h-4 w-4 text-blue-600"/>
                )}
              </div>
              <div classname="{cn(" "p-4="" rounded-2xl="" text-sm="" leading-relaxed="" whitespace-pre-wrap",="" msg.role="==" "user"="" ?="" "bg-blue-600="" text-white="" rounded-tr-none="" shadow-md"="" :="" "bg-white="" text-slate-800="" rounded-tl-none="" border="" border-slate-100="" shadow-sm"="" )}="">
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial="{{" opacity:="" 0="" }}="" animate="{{" opacity:="" 1="" }}="" classname="flex items-center gap-2 text-slate-400 text-xs ml-12">
            <loader2 classname="h-3 w-3 animate-spin"/>
            Năng Lực đang suy nghĩ...
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <form onsubmit="{handleSubmit}" classname="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
        <input type="text" value="{input}" onchange="{(e)" ==""> setInput(e.target.value)}
          placeholder="Nhập câu hỏi hoặc bài tập của bạn..."
          className="flex-1 bg-slate-50 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          disabled={isLoading}
        />
        <button type="submit" disabled="{isLoading" ||="" !input.trim()}="" classname="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-lg">
          <send classname="h-5 w-5"/>
        </button>
      </form>
    </div>
  );
}
