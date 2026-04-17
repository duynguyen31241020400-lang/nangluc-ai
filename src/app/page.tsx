"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, BrainCircuit, Sparkles, Target } from "lucide-react";

const featureCards = [
  {
    title: "Đánh giá nhanh, đúng chỗ",
    description: "Assessment 6 câu giúp học sinh biết mình yếu đúng nhóm nào thay vì học lại cả chương.",
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe,transparent_38%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_45%,#f8fafc_100%)] text-slate-900">
      <div className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-black tracking-[0.18em] text-slate-900">LUMIQ AI</p>
            <p className="text-xs text-slate-500">Prototype học tập cá nhân hóa</p>
          </div>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Bắt đầu
          </Link>
        </div>
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col justify-center gap-12 px-6 py-16 lg:flex-row lg:items-center lg:gap-16">
        <div className="max-w-3xl flex-1">
          <div className="pointer-events-none absolute left-1/2 top-40 -z-10 hidden h-72 w-72 -translate-x-1/2 rounded-full bg-blue-300/25 blur-3xl sm:block" />
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Competition prototype for IU Startup Demo Day 2026
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Lumiq AI giúp học sinh lớp 10 biết mình yếu gì và học đúng chỗ.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Prototype này tập trung vào một flow rất hẹp nhưng đủ thuyết phục cho vòng thi:
            đánh giá đầu vào, gợi ý lộ trình Toán cá nhân hóa và tutor phản hồi theo đúng ngữ cảnh học của Minh.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Bắt đầu demo flow
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/learn/math"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              Xem thẳng personalized path
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <div className="rounded-full border border-white/80 bg-white/85 px-4 py-2 shadow-sm">6 câu chẩn đoán ngắn</div>
            <div className="rounded-full border border-white/80 bg-white/85 px-4 py-2 shadow-sm">1 current goal rõ ràng</div>
            <div className="rounded-full border border-white/80 bg-white/85 px-4 py-2 shadow-sm">Tutor bám đúng topic yếu</div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/80 border-t-4 border-t-blue-500 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-bold tracking-[0.24em] text-blue-600">01</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">First user</p>
              <p className="mt-2 text-lg font-bold">Học sinh lớp 10 yếu Toán</p>
            </div>
            <div className="rounded-3xl border border-white/80 border-t-4 border-t-blue-500 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-bold tracking-[0.24em] text-blue-600">02</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">First value</p>
              <p className="mt-2 text-lg font-bold">Biết đúng điểm yếu để học tập trung</p>
            </div>
            <div className="rounded-3xl border border-white/80 border-t-4 border-t-blue-500 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-bold tracking-[0.24em] text-blue-600">03</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Demo promise</p>
              <p className="mt-2 text-lg font-bold">Ít nhưng thật và mượt</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-5 text-white shadow-2xl shadow-blue-200">
            <div className="rounded-[1.6rem] bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Demo journey</p>
                  <h2 className="mt-2 text-2xl font-bold">1 learner, 1 subject, 1 believable loop</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Demo-ready
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {featureCards.map(({ title, description, icon: Icon }, index) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-200">Step {index + 1}</p>
                        <h3 className="mt-1 text-lg font-bold">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/70 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-700">Lumiq AI</p>
          <p>Prototype gọn, rõ, dễ gửi thử cho học sinh.</p>
        </div>
      </footer>
    </main>
  );
}
