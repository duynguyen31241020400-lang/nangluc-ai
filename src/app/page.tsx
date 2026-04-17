"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, BrainCircuit, Sparkles, Target } from "lucide-react";
import DotGrid from "@/src/components/ui/DotGrid";

const featureCards = [
  {
    title: "Đánh giá nhanh, đúng chỗ",
    description: "Assessment 6 câu giúp học sinh biết mình yếu đúng chủ đề nào thay vì học lại cả chương.",
    icon: Target,
  },
  {
    title: "Lộ trình tập trung",
    description: "Sau khi chẩn đoán, Lumiq AI đẩy current goal rõ ràng để người học biết hôm nay cần làm gì trước.",
    icon: CheckCircle2,
  },
  {
    title: "Tutor theo ngữ cảnh",
    description: "Tutor phản hồi dựa trên topic đang học, điểm yếu hiện tại và mục tiêu ngắn hạn của Minh.",
    icon: BrainCircuit,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf7ef] text-stone-900">
      <div className="sticky top-0 z-30 border-b border-stone-200 bg-[#faf7ef]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-stone-900">
              Lumiq<span className="text-rose-900">.</span>AI
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
              Học tập cá nhân hóa
            </p>
          </div>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-2xl bg-rose-900 px-5 py-2.5 text-sm font-semibold text-[#faf7ef] shadow-sm ring-1 ring-rose-900/40 transition hover:bg-rose-800"
          >
            Bắt đầu
          </Link>
        </div>
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col justify-center gap-12 px-6 py-16 lg:flex-row lg:items-center lg:gap-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <DotGrid className="opacity-40" />
        </div>

        <div className="relative max-w-3xl flex-1">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-[#faf7ef]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-900 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            IU Startup Demo Day 2026
          </div>

          <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.32em] text-stone-500">
            Tập san học tập — Số 01
          </p>
          <div className="mt-3 scholarly-rule w-24" />

          <h1 className="mt-5 font-display text-5xl font-black leading-[1.02] tracking-tight text-balance text-stone-900 sm:text-6xl lg:text-7xl">
            Học sinh lớp 10 <em className="not-italic text-rose-900">biết mình yếu gì</em> và học đúng chỗ.
          </h1>

          <p className="drop-cap mt-8 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
            Prototype này tập trung vào một flow rất hẹp nhưng đủ thuyết phục cho vòng thi: đánh giá đầu vào, gợi ý lộ trình Toán cá nhân hóa, và tutor phản hồi theo đúng ngữ cảnh học của Minh.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-900 px-7 py-4 text-base font-semibold text-[#faf7ef] shadow-xl shadow-rose-900/10 ring-1 ring-rose-900/40 transition hover:-translate-y-0.5 hover:bg-rose-800"
            >
              Bắt đầu demo flow
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/learn/math"
              className="inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-[#faf7ef] px-7 py-4 text-base font-semibold text-stone-800 transition hover:border-rose-900 hover:text-rose-900"
            >
              Xem thẳng personalized path
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-stone-700">
            <div className="rounded-2xl border border-stone-300 bg-[#faf7ef] px-4 py-2 shadow-sm ring-1 ring-stone-200">6 câu chẩn đoán ngắn</div>
            <div className="rounded-2xl border border-stone-300 bg-[#faf7ef] px-4 py-2 shadow-sm ring-1 ring-stone-200">1 current goal rõ ràng</div>
            <div className="rounded-2xl border border-stone-300 bg-[#faf7ef] px-4 py-2 shadow-sm ring-1 ring-stone-200">Tutor bám đúng topic yếu</div>
          </div>

          <div className="mt-12 scholarly-rule" />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "First user", title: "Học sinh lớp 10 yếu Toán", num: "I" },
              { label: "First value", title: "Biết đúng điểm yếu để học tập trung", num: "II" },
              { label: "Demo promise", title: "Ít nhưng thật và mượt", num: "III" },
            ].map(({ label, title, num }) => (
              <div
                key={label}
                className="rounded-2xl border border-stone-300 bg-[#fffdf7] p-5 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:border-rose-900/30 hover:shadow-md"
              >
                <p className="font-display text-2xl font-bold text-rose-900">{num}.</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900">{label}</p>
                <p className="mt-2 font-display text-xl font-bold text-stone-900">{title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex-1">
          <div className="overflow-hidden rounded-[2rem] border border-stone-300 bg-stone-900 p-5 text-[#faf7ef] shadow-xl shadow-stone-900/20">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 p-6">
              <DotGrid variant="light" />
              <div className="relative flex items-center justify-between border-b border-[#faf7ef]/15 pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-rose-300">Demo journey</p>
                  <h2 className="mt-2 font-display text-2xl font-bold">Một học sinh. Một môn. Một vòng lặp đáng tin.</h2>
                </div>
                <div className="rounded-2xl border border-[#faf7ef]/15 bg-[#faf7ef]/5 px-3 py-1 text-xs font-semibold text-amber-300">
                  Demo-ready
                </div>
              </div>

              <div className="relative mt-6 space-y-4">
                {featureCards.map(({ title, description, icon: Icon }, index) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-[#faf7ef]/10 bg-[#faf7ef]/5 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-900/30 text-rose-200 ring-1 ring-rose-300/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-300">Chương {String(index + 1).padStart(2, "0")}</p>
                        <h3 className="mt-1 font-display text-lg font-bold">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-stone-300">{description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-300 bg-[#faf7ef]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display font-bold text-stone-900">Lumiq<span className="text-rose-900">.</span>AI</p>
          <p>Prototype gọn, rõ, dễ gửi thử cho học sinh.</p>
        </div>
      </footer>
    </main>
  );
}
