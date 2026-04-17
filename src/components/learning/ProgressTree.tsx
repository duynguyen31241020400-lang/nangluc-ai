"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import type { LearningNode } from "@/src/lib/data/competition";
import { cn } from "@/src/lib/utils";

export type CompetencyNode = LearningNode;

interface ProgressTreeProps {
  nodes: CompetencyNode[];
  activeNodeId?: LearningNode["id"];
  onNodeClick: (node: CompetencyNode) => void;
}

export default function ProgressTree({ nodes, activeNodeId, onNodeClick }: ProgressTreeProps) {
  return (
    <div className="space-y-5">
      {nodes.map((node, index) => {
        const isActiveCard = activeNodeId === node.id;
        const masteryPercent = Math.round(node.mastery * 100);
        const helperText = node.status === "available" ? "Học sau khi xong mục tiêu hiện tại." : node.recommendedAction;

        return (
          <button
            key={node.id}
            onClick={() => onNodeClick(node)}
            title={node.status === "available" ? "Học sau khi xong mục tiêu hiện tại" : undefined}
            className={cn(
              "group relative w-full rounded-[2rem] border p-5 text-left transition",
              isActiveCard
                ? "border-rose-900/20 bg-rose-50/80 shadow-xl shadow-rose-900/10 ring-1 ring-rose-900/10"
                : "border-stone-200 bg-[#fffdf7] shadow-sm ring-1 ring-stone-200 hover:border-rose-900/20 hover:bg-rose-50/30",
            )}
          >
            {index !== nodes.length - 1 ? (
              <span className="absolute left-8 top-[calc(100%+0.25rem)] h-6 w-px bg-stone-300" />
            ) : null}

            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-sm font-bold",
                  node.status === "completed" && "border-emerald-200 bg-emerald-50 text-emerald-800",
                  node.status === "active" && "border-rose-900 bg-rose-900 text-[#faf7ef]",
                  node.status === "available" && "border-stone-200 bg-stone-100 text-stone-600",
                )}
              >
                {node.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : node.status === "active" ? (
                  <Sparkles className="h-5 w-5" />
                ) : (
                  <span className="text-xs font-bold">{masteryPercent}%</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-900">{node.code}</p>
                    <h3 className="mt-1 font-display text-xl font-bold text-stone-900">{node.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-700">{node.description}</p>
                  </div>
                  <div className={cn(
                    "inline-flex shrink-0 rounded-2xl px-3 py-1 text-xs font-semibold ring-1",
                    node.status === "completed" && "bg-emerald-100 text-emerald-800 ring-emerald-800/15",
                    node.status === "active" && "bg-rose-100 text-rose-900 ring-rose-900/15",
                    node.status === "available" && "bg-stone-100 text-stone-600 ring-stone-200",
                  )}>
                    {node.isCurrentGoal ? "Current goal" : node.status === "completed" ? "Đã vững" : "Học sau"}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                    <span>Mastery</span>
                    <span className={cn(node.status === "active" && "text-rose-900")}>{masteryPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        node.status === "completed" ? "bg-emerald-700" : node.status === "active" ? "bg-rose-900" : "bg-stone-400",
                      )}
                      style={{ width: `${masteryPercent}%` }}
                    />
                  </div>
                  <p className="text-sm leading-6 text-stone-600">{helperText}</p>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
