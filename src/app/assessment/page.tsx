"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Sparkles, Target } from "lucide-react";
import {
  DIAGNOSTIC_QUESTIONS,
  calculateAssessmentReport,
  getMasteryLabel,
} from "@/src/lib/data/competition";
import { saveAssessmentReport } from "@/src/lib/demo-state";
import DotGrid from "@/src/components/ui/DotGrid";

const TEST_DURATION_SECONDS = 8 * 60;
const OPTION_PREFIXES = ["A", "B", "C", "D"];

type Step = "intro" | "test" | "result";

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [report, setReport] = useState<ReturnType<typeof calculateAssessmentReport> | null>(null);

  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const handleSubmit = useCallback(() => {
    const nextReport = calculateAssessmentReport(answersRef.current);
    saveAssessmentReport(nextReport);
    setReport(nextReport);
    setStep("result");
  }, []);

  useEffect(() => {
    if (step !== "test") {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step === "test" && timeLeft === 0) {
      handleSubmit();
    }
  }, [step, timeLeft, handleSubmit]);

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100;
  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers],
  );

  function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function startTest() {
    answersRef.current = {};
    setAnswers({});
    setCurrentIndex(0);
    setTimeLeft(TEST_DURATION_SECONDS);
    setReport(null);
    setStep("test");
  }

  function goToLearnPath() {
    router.push("/learn/math");
  }

  if (step === "intro") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-stone-900 px-6 py-12 text-[#faf7ef]">
        <DotGrid variant="light" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-400 transition hover:text-[#faf7ef]"
            >
              <ChevronLeft className="h-4 w-4" />
              Quay lại trang chủ
            </Link>
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#faf7ef]/15 bg-[#faf7ef]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-300">
              <Sparkles className="h-3.5 w-3.5" />
              6 câu · 3 chủ đề · 1 output cá nhân hóa
            </div>
            <p className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.32em] text-stone-400">
              Chương I — Chẩn đoán
            </p>
            <div className="mt-3 h-px w-24 bg-rose-300/40" />
            <h1 className="mt-5 font-display text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Bài chẩn đoán <em className="not-italic text-rose-300">đầu vào</em> của Lumiq AI
            </h1>
            <p className="mt-5 text-lg leading-8 text-stone-300">
              Mục tiêu của demo không phải kiểm tra dài, mà là chỉ ra thật nhanh Minh đang yếu ở phần nào để chuyển ngay sang lộ trình học tập trung.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCard label="Số câu" value="6 câu" />
              <InfoCard label="Chủ đề" value="3 chủ đề" />
              <InfoCard label="Thời lượng" value="8 phút" />
              <InfoCard label="Tâm lý" value="Không tính điểm" />
            </div>
          </div>

          <div className="w-full max-w-xl rounded-[2rem] border border-[#faf7ef]/15 bg-[#faf7ef]/5 p-6 shadow-xl shadow-stone-950/40 backdrop-blur">
            <div className="rounded-2xl bg-[#faf7ef] px-6 py-8 text-stone-900">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-900 ring-1 ring-rose-900/20">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900">Seeded learner</p>
                  <h2 className="font-display text-2xl font-bold">Minh — lớp 10</h2>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-stone-100 p-5 ring-1 ring-stone-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Outcome</p>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-stone-700">
                  <li>Biết ngay chủ đề yếu nhất.</li>
                  <li>Nhận current goal để vào lộ trình học.</li>
                  <li>Tutor sau đó trả lời theo đúng topic vừa được khuyến nghị.</li>
                </ul>
              </div>

              <button
                onClick={startTest}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-900 px-6 py-4 text-base font-semibold text-[#faf7ef] shadow-xl shadow-rose-900/10 ring-1 ring-rose-900/40 transition hover:-translate-y-0.5 hover:bg-rose-800"
              >
                Bắt đầu assessment
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === "test") {
    return (
      <main className="min-h-screen bg-[#faf7ef] px-6 py-10 text-stone-900">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-stone-300 bg-[#fffdf7] p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
            <div className="flex flex-col gap-5 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900">Diagnostic flow</p>
                <h1 className="mt-2 font-display text-3xl font-black">Assessment của Minh</h1>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700">
                <Clock3 className="h-4 w-4 text-rose-900" />
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-900 ring-1 ring-rose-900/15">
                  Câu {currentIndex + 1}/{DIAGNOSTIC_QUESTIONS.length}
                </div>
                <div className="text-sm font-medium text-stone-500">
                  {answeredCount}/{DIAGNOSTIC_QUESTIONS.length} câu đã trả lời
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm text-stone-500">
                  <span>Tiến độ</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200">
                  <div className="h-full rounded-full bg-rose-900 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {DIAGNOSTIC_QUESTIONS.map((question, index) => {
                  const isCurrent = index === currentIndex;
                  const isAnswered = Boolean(answers[question.id]);

                  return (
                    <span
                      key={question.id}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        isCurrent
                          ? "bg-rose-900"
                          : isAnswered
                            ? "bg-rose-300"
                            : "bg-stone-300"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
              <div className="inline-flex rounded-2xl bg-[#faf7ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900 ring-1 ring-stone-200">
                {currentQuestion.competencyId.replace("_", " ")}
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-balance sm:text-3xl">{currentQuestion.question}</h2>
              <fieldset className="mt-6 space-y-3">
                <legend className="sr-only">Chọn một đáp án</legend>
                {currentQuestion.options.map((option, optionIndex) => {
                  const isActive = answers[currentQuestion.id] === option;
                  return (
                    <div key={option}>
                      <label
                        className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border px-5 py-4 text-left text-base transition ${
                          isActive
                            ? "border-rose-900 bg-rose-50 text-rose-900 shadow-sm ring-1 ring-rose-900/20"
                            : "border-stone-200 bg-[#fffdf7] text-stone-700 hover:border-rose-900/40 hover:bg-rose-50/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={option}
                          checked={isActive}
                          onChange={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option }))}
                          className="mt-1 h-4 w-4 flex-none accent-rose-900"
                        />
                        <span className="flex-1 leading-7">
                          <span className="mr-2 inline-flex min-w-7 items-center justify-center rounded-full bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-500">
                            {OPTION_PREFIXES[optionIndex] ?? optionIndex + 1}
                          </span>
                          {option}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </fieldset>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setCurrentIndex((current) => Math.max(current - 1, 0))}
                disabled={currentIndex === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-600 transition hover:border-stone-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4" />
                Quay lại
              </button>

              <button
                onClick={() => {
                  if (currentIndex === DIAGNOSTIC_QUESTIONS.length - 1) {
                    handleSubmit();
                    return;
                  }

                  setCurrentIndex((current) => Math.min(current + 1, DIAGNOSTIC_QUESTIONS.length - 1));
                }}
                disabled={!answers[currentQuestion.id]}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-900 px-6 py-3 text-sm font-semibold text-[#faf7ef] shadow-xl shadow-rose-900/10 ring-1 ring-rose-900/40 transition hover:-translate-y-0.5 hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {currentIndex === DIAGNOSTIC_QUESTIONS.length - 1 ? "Xem kết quả" : "Tiếp theo"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf7ef] px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] bg-[#fffdf7] p-8 shadow-sm ring-1 ring-stone-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800 ring-1 ring-emerald-800/15">
                <CheckCircle2 className="h-4 w-4" />
                Assessment completed
              </div>
              <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">Kết quả của {report.learner.name}</h1>
              <div className="mt-3 scholarly-rule w-24" />
              <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-700">{report.summary}</p>
            </div>
            <button
              onClick={goToLearnPath}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-900 px-6 py-4 text-sm font-semibold text-[#faf7ef] shadow-xl shadow-rose-900/10 ring-1 ring-rose-900/40 transition hover:-translate-y-0.5 hover:bg-rose-800"
            >
              Vào lộ trình cá nhân hóa
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {report.results.map((result) => (
              <div key={result.competencyId} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 ring-1 ring-stone-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900">{result.code}</p>
                    <h2 className="mt-2 font-display text-xl font-bold text-stone-900">{result.title}</h2>
                  </div>
                  <div className={`rounded-2xl px-3 py-1 text-xs font-semibold ${badgeClasses(result.level)}`}>
                    {getMasteryLabel(result.level)}
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
                  <div className={`h-full rounded-full ${masteryBarClasses(result.score)}`} style={{ width: `${result.score * 100}%` }} />
                </div>
                <p className="mt-3 text-sm text-stone-600">Đúng {result.correct}/{result.total} câu. {result.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-rose-900 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 p-8 text-[#faf7ef] shadow-xl shadow-stone-900/20">
            <DotGrid variant="light" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-rose-300">Current recommendation</p>
              <h2 className="mt-3 font-display text-3xl font-black text-balance sm:text-4xl">
                Ưu tiên <em className="not-italic text-rose-300">{report.results.find((item) => item.competencyId === report.recommendedCompetencyId)?.title.toLowerCase()}</em> trước.
              </h2>
              <p className="mt-4 text-base leading-7 text-stone-200">{report.coachNote}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-[#fffdf7] p-6 shadow-sm ring-1 ring-stone-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900">Why this matters</p>
            <div className="mt-3 scholarly-rule w-16" />
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
              <li>Minh không cần học lại cả chương mà chỉ tập trung một chủ đề trước.</li>
              <li>Current goal này sẽ được mang sang learning path để chứng minh có cá nhân hóa.</li>
              <li>Tutor chat sẽ nhận đúng topic đang yếu thay vì trả lời chung chung.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-40 flex-col justify-between rounded-2xl border border-[#faf7ef]/15 bg-[#faf7ef]/5 p-5 backdrop-blur">
      <p className="max-w-[10ch] text-[11px] font-semibold uppercase leading-5 tracking-[0.22em] text-rose-300">
        {label}
      </p>
      <p className="mt-4 font-display text-2xl font-bold leading-tight text-[#faf7ef] sm:text-3xl">{value}</p>
    </div>
  );
}

function badgeClasses(level: "weak" | "average" | "strong") {
  if (level === "weak") {
    return "bg-rose-100 text-rose-900 ring-1 ring-rose-900/20";
  }

  if (level === "average") {
    return "bg-amber-100 text-amber-800 ring-1 ring-amber-800/20";
  }

  return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-800/20";
}

function masteryBarClasses(score: number) {
  if (score >= 0.7) {
    return "bg-emerald-700";
  }

  if (score >= 0.4) {
    return "bg-amber-700";
  }

  return "bg-rose-900";
}
