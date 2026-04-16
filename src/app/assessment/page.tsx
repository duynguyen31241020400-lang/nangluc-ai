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

  // Mirror answers into a ref so handleSubmit can read the latest value
  // without being recreated on every keystroke (avoids stale-closure warning).
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
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Quay lại trang chủ
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-blue-200">
              <Sparkles className="h-4 w-4" />
              Assessment 6 câu, 3 competency, 1 output cá nhân hóa
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Bài chẩn đoán đầu vào của Lumiq AI
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Mục tiêu của demo không phải kiểm tra dài, mà là chỉ ra thật nhanh Minh đang yếu ở phần nào để chuyển ngay sang lộ trình học tập trung.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCard label="Số câu" value="6 câu" />
              <InfoCard label="Competency" value="3 nhóm" />
              <InfoCard label="Thời lượng" value="8 phút" />
              <InfoCard label="Tâm lý" value="Không tính điểm" />
            </div>
          </div>

          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-950/40 backdrop-blur">
            <div className="rounded-[1.5rem] bg-white px-6 py-8 text-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-700">Seeded learner</p>
                  <h2 className="text-2xl font-bold">Minh - lớp 10</h2>
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Outcome</p>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                  <li>Biết ngay competency yếu nhất.</li>
                  <li>Nhận current goal để vào lộ trình học.</li>
                  <li>Tutor sau đó trả lời theo đúng topic vừa được khuyến nghị.</li>
                </ul>
              </div>

              <button
                onClick={startTest}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
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
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Diagnostic flow</p>
                <h1 className="mt-2 text-3xl font-black">Assessment của Minh</h1>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                <Clock3 className="h-4 w-4 text-blue-600" />
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  Câu {currentIndex + 1}/{DIAGNOSTIC_QUESTIONS.length}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  {answeredCount}/{DIAGNOSTIC_QUESTIONS.length} câu đã trả lời
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Tiến độ</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
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
                          ? "bg-blue-600"
                          : isAnswered
                            ? "bg-blue-200"
                            : "bg-slate-200"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-slate-100 bg-slate-50 p-6 sm:p-8">
              <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
                {currentQuestion.competencyId.replace("_", " ")}
              </div>
              <h2 className="mt-4 text-2xl font-bold leading-tight text-balance">{currentQuestion.question}</h2>
              <fieldset className="mt-6 space-y-3">
                <legend className="sr-only">Chọn một đáp án</legend>
                {currentQuestion.options.map((option, optionIndex) => {
                  const isActive = answers[currentQuestion.id] === option;
                  return (
                    <div key={option}>
                      <label
                        className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border px-5 py-4 text-left text-base transition ${
                          isActive
                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={option}
                          checked={isActive}
                          onChange={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option }))}
                          className="mt-1 h-4 w-4 flex-none accent-blue-600"
                        />
                        <span className="flex-1 leading-7">
                          <span className="mr-2 inline-flex min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Assessment completed
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight">Kết quả của {report.learner.name}</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">{report.summary}</p>
            </div>
            <button
              onClick={goToLearnPath}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Vào lộ trình cá nhân hóa
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {report.results.map((result) => (
              <div key={result.competencyId} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{result.code}</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">{result.title}</h2>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(result.level)}`}>
                    {getMasteryLabel(result.level)}
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className={`h-full rounded-full ${masteryBarClasses(result.score)}`} style={{ width: `${result.score * 100}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-600">Đúng {result.correct}/{result.total} câu. {result.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-100">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Current recommendation</p>
            <h2 className="mt-3 text-3xl font-black text-balance">
              Ưu tiên {report.results.find((item) => item.competencyId === report.recommendedCompetencyId)?.title.toLowerCase()} trước.
            </h2>
            <p className="mt-4 text-base leading-7 text-blue-50">{report.coachNote}</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Why this matters</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <li>Minh không cần học lại cả chương mà chỉ tập trung một competency trước.</li>
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function badgeClasses(level: "weak" | "average" | "strong") {
  if (level === "weak") {
    return "bg-rose-100 text-rose-700";
  }

  if (level === "average") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-emerald-100 text-emerald-700";
}

function masteryBarClasses(score: number) {
  if (score >= 0.7) {
    return "bg-emerald-500";
  }

  if (score >= 0.4) {
    return "bg-amber-500";
  }

  return "bg-rose-500";
}
