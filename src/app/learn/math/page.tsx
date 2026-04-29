"use client";

import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, CheckCircle2, Flame, SlidersHorizontal, X } from "lucide-react";
import ProgressTree, { type CompetencyNode } from "@/src/components/learning/ProgressTree";
import TutorChat from "@/src/components/learning/TutorChat";
import DotGrid from "@/src/components/ui/DotGrid";
import {
  DEMO_SCENARIOS,
  type AssessmentReport,
  type DemoScenarioId,
  buildLearnerContext,
  buildLearningNodes,
  getMasteryLabel,
} from "@/src/lib/data/competition";
import { getOrCreateDemoReport, loadScenarioReport } from "@/src/lib/demo-state";

export default function LearnMathPage() {
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [activeNode, setActiveNode] = useState<CompetencyNode | null>(null);
  const [showScenarioPopup, setShowScenarioPopup] = useState(false);

  useEffect(() => {
    const initialReport = getOrCreateDemoReport();
    const initialNodes = buildLearningNodes(initialReport);
    setReport(initialReport);
    setActiveNode(initialNodes[0]);
  }, []);

  const nodes = useMemo(() => {
    if (!report) {
      return [] as CompetencyNode[];
    }

    return buildLearningNodes(report);
  }, [report]);

  useEffect(() => {
    if (!nodes.length) {
      return;
    }

    setActiveNode((current) => {
      if (!current) {
        return nodes[0];
      }

      return nodes.find((item) => item.id === current.id) ?? nodes[0];
    });
  }, [nodes]);

  if (!report || !activeNode) {
    return null;
  }

  const learnerContext = buildLearnerContext(report, activeNode);
  const recommended = report.results.find((item) => item.competencyId === report.recommendedCompetencyId);

  return (
    <>
    <main className="min-h-screen bg-[#faf7ef] px-6 py-8 text-stone-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="relative flex flex-col gap-5 overflow-hidden rounded-[2rem] border border-stone-200 bg-[#fffdf7] p-5 shadow-sm ring-1 ring-stone-200 lg:flex-row lg:items-start lg:justify-between">
          <DotGrid className="opacity-40" />
          <div className="relative max-w-3xl">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-rose-900">
              <ArrowLeft className="h-4 w-4" />
              Quay lại landing
            </Link>
            <p className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.32em] text-stone-500">
              Chương II — Lộ trình
            </p>
            <div className="mt-3 scholarly-rule w-24" />
            <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
              Lộ trình cá nhân hóa của <em className="not-italic text-rose-900">{report.learner.name}</em>
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-stone-700">
              Đây là bản demo hẹp nhưng thật của Lumiq AI: assessment vừa chạy xong được chuyển thành current goal rõ ràng, và tutor sẽ bám vào đúng điểm yếu đó.
            </p>
          </div>
          <div className="relative rounded-2xl border border-rose-900/20 bg-rose-50/80 p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900">Prototype guardrail</p>
            <p className="mt-2 text-sm leading-6 text-stone-700">
              Chỉ demo 1 learner archetype, 1 môn Toán, và 2 trạng thái personalized output đủ để chứng minh có cá nhân hóa.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.1fr_1.05fr]">
          <section className="order-1 space-y-6">
            <div className="rounded-[2rem] border border-stone-200 bg-[#fffdf7] p-6 shadow-sm ring-1 ring-stone-200">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900">Seeded learner</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-stone-900">{report.learner.name} · {report.learner.grade}</h2>
                </div>
                <div className="inline-flex items-center rounded-2xl bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-800/15">
                  <Flame className="mr-1 h-3.5 w-3.5" /> 5-day streak
                </div>
              </div>

              <div className="mt-5 space-y-4 rounded-2xl bg-stone-50 p-5 text-sm text-stone-700 ring-1 ring-stone-200">
                <div>
                  <p className="font-display font-bold text-stone-900">Mục tiêu học tập</p>
                  <p className="mt-1 leading-6">{report.learner.target}</p>
                </div>
                <div>
                  <p className="font-display font-bold text-stone-900">Nhu cầu chính</p>
                  <p className="mt-1 leading-6">{report.learner.primaryNeed}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowScenarioPopup(true)}
              className="flex w-full items-center justify-between rounded-[2rem] border border-stone-200 bg-[#fffdf7] px-5 py-3.5 shadow-sm ring-1 ring-stone-200 transition hover:border-rose-900/40 hover:text-rose-900"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                <SlidersHorizontal className="h-4 w-4 text-rose-900" />
                Kịch bản demo
              </span>
              <span className="rounded-xl bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500 ring-1 ring-stone-200">
                {report.demoScenarioId
                  ? DEMO_SCENARIOS.find((s) => s.id === report.demoScenarioId)?.title
                  : "Chưa chọn"}
              </span>
            </button>

            <div className="relative overflow-hidden rounded-[2rem] border border-rose-900 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 p-6 text-[#faf7ef] shadow-xl shadow-stone-900/20">
              <DotGrid variant="light" />
              <div className="relative">
                <div className="flex items-center gap-2 text-rose-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.26em]">Current recommendation</span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-black text-balance">
                  Ưu tiên <em className="not-italic text-rose-300">{recommended?.title.toLowerCase()}</em> trước.
                </h2>
                <p className="mt-4 text-sm leading-7 text-stone-200">{report.coachNote}</p>
              </div>
            </div>
          </section>

          <section className="order-3 space-y-6 xl:order-2">
            <div className="rounded-[2rem] border border-stone-200 bg-[#fffdf7] p-6 shadow-sm ring-1 ring-stone-200">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-rose-900" />
                <h2 className="font-display text-lg font-bold">Progress tree theo kết quả assessment</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                Current goal sẽ nhảy theo chủ đề yếu nhất. Đây là chỗ quan trọng nhất để demo cho giám khảo thấy personalization thực sự tồn tại.
              </p>
              <div className="mt-6">
                <ProgressTree
                  nodes={nodes}
                  activeNodeId={activeNode.id}
                  onNodeClick={setActiveNode}
                />
              </div>
            </div>
          </section>

          <section className="order-2 space-y-6 xl:order-3">
            <div className="rounded-[2rem] border border-stone-200 bg-[#fffdf7] p-6 shadow-sm ring-1 ring-stone-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900">Active focus</p>
              <h2 className="mt-2 font-display text-2xl font-black text-stone-900">{activeNode.title}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <MetricCard label="Mastery hiện tại" value={`${Math.round(activeNode.mastery * 100)}%`} helper={recommended?.title === activeNode.title ? "Đây là chủ đề đang được ưu tiên." : "Đã có nền tương đối ổn hơn."} />
                <MetricCard label="Mức đánh giá" value={getMasteryLabel(report.results.find((item) => item.competencyId === activeNode.id)?.level ?? "average")} helper={activeNode.recommendedAction} />
              </div>
            </div>

            <TutorChat
                key={report.demoScenarioId ?? "assessment-flow"}
                activeNode={activeNode}
                learnerContext={learnerContext}
              />
          </section>
        </div>
      </div>
    </main>

    {showScenarioPopup && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm"
        onClick={() => setShowScenarioPopup(false)}
      >
        <div
          className="mx-4 w-full max-w-sm rounded-[2rem] border border-stone-200 bg-[#fffdf7] p-6 shadow-2xl ring-1 ring-stone-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-rose-900" />
              <h2 className="font-display text-lg font-bold">Kịch bản demo</h2>
            </div>
            <button
              onClick={() => setShowScenarioPopup(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Chứng minh current goal đổi theo kết quả assessment.
          </p>
          <div className="mt-4 space-y-3">
            {DEMO_SCENARIOS.map((scenario) => {
              const isActive = report.demoScenarioId === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => {
                    switchScenario(scenario.id, setReport, setActiveNode);
                    setShowScenarioPopup(false);
                  }}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    isActive
                      ? "border-rose-900 bg-rose-50 text-rose-900 ring-1 ring-rose-900/15"
                      : "border-stone-200 bg-stone-50 text-stone-700 hover:border-rose-900/40 hover:bg-rose-50/40"
                  }`}
                >
                  <p className="font-display text-sm font-bold">{scenario.title}</p>
                  <p className="mt-1 text-sm leading-6">{scenario.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    )}
  </>
  );
}

function switchScenario(
  id: DemoScenarioId,
  setReport: Dispatch<SetStateAction<AssessmentReport | null>>,
  setActiveNode: Dispatch<SetStateAction<CompetencyNode | null>>,
) {
  const nextReport = loadScenarioReport(id);
  const nextNodes = buildLearningNodes(nextReport);
  setReport(nextReport);
  setActiveNode(nextNodes[0]);
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-black text-stone-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-stone-600">{helper}</p>
    </div>
  );
}
