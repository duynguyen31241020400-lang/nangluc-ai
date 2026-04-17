"use client";

import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, CheckCircle2, Flame, Target } from "lucide-react";
import ProgressTree, { type CompetencyNode } from "@/src/components/learning/ProgressTree";
import TutorChat from "@/src/components/learning/TutorChat";
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_42%,#f8fafc_100%)] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-5 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700">
              <ArrowLeft className="h-4 w-4" />
              Quay lại landing
            </Link>
            <h1 className="mt-3 text-4xl font-black tracking-tight">Lộ trình cá nhân hóa của {report.learner.name}</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              Đây là bản demo hẹp nhưng thật của Lumiq AI: assessment vừa chạy xong được chuyển thành current goal rõ ràng, và tutor sẽ bám vào đúng điểm yếu đó.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-blue-100 bg-blue-50/70 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Prototype guardrail</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Chỉ demo 1 learner archetype, 1 môn Toán, và 2 trạng thái personalized output đủ để chứng minh có cá nhân hóa.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.1fr_1.05fr]">
          <section className="order-1 space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-blue-700">Seeded learner</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">{report.learner.name} - {report.learner.grade}</h2>
                </div>
                <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <Flame className="mr-1 inline h-3.5 w-3.5" /> 5-day streak
                </div>
              </div>

              <div className="mt-5 space-y-4 rounded-[1.5rem] bg-slate-50 p-5 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-900">Mục tiêu học tập</p>
                  <p className="mt-1 leading-6">{report.learner.target}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Nhu cầu chính</p>
                  <p className="mt-1 leading-6">{report.learner.primaryNeed}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold">Đổi trạng thái personalized output</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Hai kịch bản dưới đây giúp team rehearsal nhanh và chứng minh rõ current goal đổi theo kết quả assessment.
              </p>
              <div className="mt-4 space-y-3">
                {DEMO_SCENARIOS.map((scenario) => {
                  const isActive = report.demoScenarioId === scenario.id;
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => switchScenario(scenario.id, setReport, setActiveNode)}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        isActive
                          ? "border-blue-300 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50/60"
                      }`}
                    >
                      <p className="text-sm font-semibold">{scenario.title}</p>
                      <p className="mt-1 text-sm leading-6">{scenario.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-100">
              <div className="flex items-center gap-2 text-blue-100">
                <CheckCircle2 className="h-5 w-5" />
                Current recommendation
              </div>
              <h2 className="mt-3 text-3xl font-black text-balance">Ưu tiên {recommended?.title.toLowerCase()} trước.</h2>
              <p className="mt-4 text-sm leading-7 text-blue-50">{report.coachNote}</p>
            </div>
          </section>

          <section className="order-3 space-y-6 xl:order-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold">Progress tree theo kết quả assessment</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
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
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Active focus</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">{activeNode.title}</h2>
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
    <div className="rounded-[1.5rem] bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p>
    </div>
  );
}
