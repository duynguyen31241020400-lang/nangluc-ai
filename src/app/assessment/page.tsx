"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, Timer, CheckCircle2, BarChart3, ArrowRight } from "lucide-react";
import { DIAGNOSTIC_QUESTIONS, Question } from "@/src/lib/data/assessment";
import { cn } from "@/src/lib/utils";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export default function DiagnosticAssessment() {
  const [step, setStep] = useState<"intro" | "test" | "result">("intro");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<record<string, string="">>({});
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (step === "test" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && step === "test") {
      handleSubmit();
    }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate mastery levels
    const competencyScores: Record<string, {="" correct:="" number;="" total:="" number="" }=""> = {};
    
    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      if (!competencyScores[q.competencyId]) {
        competencyScores[q.competencyId] = { correct: 0, total: 0 };
      }
      competencyScores[q.competencyId].total += 1;
      if (answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        competencyScores[q.competencyId].correct += 1;
      }
    });

    const masteryData = Object.entries(competencyScores).map(([id, score]) => ({
      subject: id,
      mastery: (score.correct / score.total) * 100,
      fullMark: 100,
    }));

    setResults(masteryData);
    setStep("result");
  };

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100;

  if (step === "intro") {
    return (
      <div classname="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div initial="{{" opacity:="" 0,="" scale:="" 0.9="" }}="" animate="{{" opacity:="" 1,="" scale:="" 1="" }}="" classname="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
          <div classname="h-20 w-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <barchart3 classname="h-10 w-10 text-blue-600"/>
          </div>
          <h1 classname="text-3xl font-bold text-slate-900 mb-4">Đánh giá Năng lực Đầu vào</h1>
          <p classname="text-slate-600 mb-8 leading-relaxed">
            Chào Minh! Bài kiểm tra này giúp Năng Lực AI hiểu rõ trình độ hiện tại của bạn để xây dựng lộ trình học tập cá nhân hóa nhất. Đừng quá áp lực nhé!
          </p>
          <div classname="grid grid-cols-2 gap-4 mb-8 text-left">
            <div classname="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p classname="text-xs font-bold text-slate-400 uppercase mb-1">Số câu hỏi</p>
              <p classname="text-lg font-bold text-slate-900">{DIAGNOSTIC_QUESTIONS.length} câu</p>
            </div>
            <div classname="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p classname="text-xs font-bold text-slate-400 uppercase mb-1">Thời gian</p>
              <p classname="text-lg font-bold text-slate-900">20 phút</p>
            </div>
          </div>
          <button onclick="{()" ==""> setStep("test")}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            Bắt đầu Kiểm tra <chevronright classname="h-5 w-5"/>
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === "test") {
    return (
      <div classname="min-h-screen bg-slate-50 p-4 sm:p-8">
        <div classname="max-w-4xl mx-auto">
          {/* Header */}
          <div classname="flex items-center justify-between mb-6">
            <div classname="flex items-center gap-3">
              <div classname="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                {currentQuestionIdx + 1}
              </div>
              <div>
                <p classname="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Câu hỏi</p>
                <p classname="text-sm font-bold text-slate-900">{currentQuestionIdx + 1} / {DIAGNOSTIC_QUESTIONS.length}</p>
              </div>
            </div>
            <div classname="{cn(" "flex="" items-center="" gap-2="" px-4="" py-2="" rounded-full="" font-mono="" font-bold="" text-sm",="" timeleft="" <="" 300="" ?="" "bg-red-100="" text-red-600="" animate-pulse"="" :="" "bg-white="" text-slate-600="" shadow-sm"="" )}="">
              <timer classname="h-4 w-4"/>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress Bar */}
          <div classname="h-2 w-full bg-slate-200 rounded-full mb-8 overflow-hidden">
            <motion.div initial="{{" width:="" 0="" }}="" animate="{{" width:="" `${progress}%`="" }}="" classname="h-full bg-blue-600"/>
          </div>

          {/* Question Card */}
          <animatepresence mode="wait">
            <motion.div key="{currentQuestion.id}" initial="{{" opacity:="" 0,="" x:="" 20="" }}="" animate="{{" opacity:="" 1,="" x:="" 0="" }}="" exit="{{" opacity:="" 0,="" x:="" -20="" }}="" classname="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 min-h-[400px] flex flex-col">
              <div classname="flex-1">
                <span classname="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase mb-4">
                  {currentQuestion.competencyId}
                </span>
                <h2 classname="text-xl font-semibold text-slate-900 mb-8 leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.type === "multiple-choice" && (
                  <div classname="grid grid-cols-1 gap-4">
                    {currentQuestion.options?.map((option) => (
                      <button key="{option}" onclick="{()" ==""> handleAnswer(currentQuestion.id, option)}
                        className={cn(
                          "w-full text-left p-4 rounded-2xl border-2 transition-all",
                          answers[currentQuestion.id] === option
                            ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                            : "border-slate-100 hover:border-blue-200 text-slate-600"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "fill-in-the-blank" && (
                  <input type="text" value="{answers[currentQuestion.id]" ||="" ""}="" onchange="{(e)" ==""> handleAnswer(currentQuestion.id, e.target.value)}
                    placeholder="Nhập câu trả lời của bạn..."
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none transition-all text-lg"
                  />
                )}

                {currentQuestion.type === "short-essay" && (
                  <textarea value="{answers[currentQuestion.id]" ||="" ""}="" onchange="{(e)" ==""> handleAnswer(currentQuestion.id, e.target.value)}
                    placeholder="Viết câu trả lời ngắn gọn..."
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none transition-all text-lg min-h-[150px]"
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="mt-12 flex items-center justify-between">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIdx === 0}
                  className="flex items-center gap-2 text-slate-400 font-bold disabled:opacity-0 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" /> Quay lại
                </button>
                <button
                  onClick={nextQuestion}
                  className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  {currentQuestionIdx === DIAGNOSTIC_QUESTIONS.length - 1 ? "Hoàn thành" : "Tiếp theo"} 
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center mb-8">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Chúc mừng Minh!</h1>
            <p className="text-slate-600 mb-8">Bạn đã hoàn thành bài đánh giá. Dưới đây là phân tích năng lực của bạn.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Radar Chart */}
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Mastery"
                      dataKey="mastery"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Progress Bars */}
              <div className="space-y-6 text-left">
                {results.map((res: any) => (
                  <div key={res.subject}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-slate-700">{res.subject}</span>
                      <span className="text-sm font-bold text-blue-600">{Math.round(res.mastery)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${res.mastery}%` }}
                        className="h-full bg-blue-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-left">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Nhận xét từ AI Tutor
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Minh ơi, kết quả cho thấy bạn đang nắm khá vững phần **Tập hợp**, nhưng cần chú ý thêm về **Hàm số bậc hai**. Đừng lo, lộ trình của bạn đã được cập nhật để tập trung củng cố những phần này trước khi sang kiến thức mới!
              </p>
            </div>

            <button 
              onClick={() => window.location.href = "/learn/math"}
              className="mt-10 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              Vào Lộ trình Cá nhân hóa <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
