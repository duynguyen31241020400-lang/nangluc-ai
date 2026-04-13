"use client";

import { MessageSquareText } from "lucide-react";

export default function FeedbackButton() {
  return (
    <button
      type="button"
      onClick={() => window.alert("Ghi chú nhanh cho team: kiểm tra demo script, checklist môi trường và ảnh sản phẩm trước khi rehearsal.")}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-slate-300 transition hover:-translate-y-0.5"
      aria-label="Nhắc demo checklist"
    >
      <MessageSquareText className="h-4 w-4" />
      Demo checklist
    </button>
  );
}
