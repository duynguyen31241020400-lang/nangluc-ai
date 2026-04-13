"use client";

import { CheckCircle2, LockOpen, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface CompetencyNode {
  id: string;
  code: string;
  title: string;
  shortLabel: string;
  mastery: number;
  status: "completed" | "active" | "available";
  description: string;
  recommendedAction: string;
  isCurrentGoal?: boolean;
}

interface ProgressTreeProps {
  nodes: CompetencyNode[];
  activeNodeId?: string;
  onNodeClick: (node: CompetencyNode) => void;
}

export default function ProgressTree({ nodes, activeNodeId, onNodeClick }: ProgressTreeProps) {
  return (
    <div className="space-y-5">
      {nodes.map((node, index) => {
        const isActiveCard = activeNodeId === node.id;
        const masteryPercent = Math.round(node.mastery * 100);

        return (
          <button
            key={node.id}
            onClick={() => onNodeClick(node)}
            className={cn(
              "group relative w-full rounded-[1.6rem] border p-5 text-left transition",
              isActiveCard
                ? "border-blue-300 bg-blue-50 shadow-lg shadow-blue-100"
                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40",
            )}
          >
            {index !== nodes.length - 1 ? (
              <span className="absolute left-8 top-[calc(100%+0.25rem)] h-6 w-px bg-slate-200" />
            ) : null}

            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "mt-1 flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-bold",
                  node.status === "completed" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                  node.status === "active" && "border-blue-200 bg-blue-600 text-white",
                  node.status === "available" && "border-slate-200 bg-slate-50 text-slate-600",
                )}
              >
                {node.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : node.status === "active" ? (
                  <Sparkles className="h-5 w-5" />
                ) : (
                  <LockOpen className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{node.code}</p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">{node.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{node.description}</p>
                  </div>
                  <div className={cn(
                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                    node.status === "completed" && "bg-emerald-100 text-emerald-700",
                    node.status === "active" && "bg-blue-100 text-blue-700",
                    node.status === "available" && "bg-slate-100 text-slate-600",
                  )}>
                    {node.isCurrentGoal ? "Current goal" : node.status === "completed" ? "Đã vững" : "Tiếp theo"}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    <span>Mastery</span>
                    <span>{masteryPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${masteryPercent}%` }} />
                  </div>
                  <p className="text-sm text-slate-500">{node.recommendedAction}</p>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
