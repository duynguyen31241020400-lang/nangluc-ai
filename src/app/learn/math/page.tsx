"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquare, Plus, SlidersHorizontal } from "lucide-react";
import TutorChat, {
  buildTutorGreeting,
  type ChatMessage,
} from "@/src/components/learning/TutorChat";
import {
  DEMO_SCENARIOS,
  type AssessmentReport,
  type DemoScenarioId,
  type LearningNode,
  buildLearnerContext,
  buildLearningNodes,
  buildScenarioReport,
} from "@/src/lib/data/competition";
import { getOrCreateDemoReport } from "@/src/lib/demo-state";
import { cn } from "@/src/lib/utils";

interface ChatSession {
  id: string;
  title: string;
  scenarioLabel: string;
  report: AssessmentReport;
  activeNode: LearningNode;
  messages: ChatMessage[];
}

function createChatSession(report: AssessmentReport, sequence: number): ChatSession {
  const activeNode = buildLearningNodes(report)[0];
  const learnerContext = buildLearnerContext(report, activeNode);
  const scenarioLabel =
    DEMO_SCENARIOS.find((scenario) => scenario.id === report.demoScenarioId)?.title ?? "Assessment";

  return {
    id: `${report.demoScenarioId ?? "assessment"}-${Date.now()}-${sequence}`,
    title: `Đoạn chat ${sequence}`,
    scenarioLabel,
    report,
    activeNode,
    messages: [
      {
        role: "tutor",
        content: buildTutorGreeting(learnerContext),
      },
    ],
  };
}

export default function LearnMathPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    const initialSession = createChatSession(getOrCreateDemoReport(), 1);
    setSessions([initialSession]);
    setActiveSessionId(initialSession.id);
  }, []);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? sessions[0],
    [activeSessionId, sessions],
  );

  const updateActiveMessages = useCallback(
    (nextMessages: ChatMessage[] | ((current: ChatMessage[]) => ChatMessage[])) => {
      if (!activeSessionId) {
        return;
      }

      setSessions((currentSessions) =>
        currentSessions.map((session) => {
          if (session.id !== activeSessionId) {
            return session;
          }

          return {
            ...session,
            messages:
              typeof nextMessages === "function"
                ? nextMessages(session.messages)
                : nextMessages,
          };
        }),
      );
    },
    [activeSessionId],
  );

  function addScenarioSession(id: DemoScenarioId) {
    const nextSession = createChatSession(buildScenarioReport(id), sessions.length + 1);
    setSessions((current) => [...current, nextSession]);
    setActiveSessionId(nextSession.id);
  }

  if (!activeSession) {
    return null;
  }

  const learnerContext = buildLearnerContext(activeSession.report, activeSession.activeNode);

  return (
    <main className="flex h-screen overflow-hidden bg-[#faf7ef] text-stone-900">
      <aside className="hidden w-72 shrink-0 border-r border-stone-200 bg-stone-950 text-stone-100 md:flex md:flex-col">
        <div className="border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-200">
            <MessageSquare className="h-4 w-4 text-rose-200" />
            Hội thoại demo
          </div>
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {sessions.map((session) => {
            const isActive = session.id === activeSession.id;
            return (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={cn(
                  "w-full rounded-2xl px-3 py-3 text-left transition",
                  isActive
                    ? "bg-stone-800 text-white ring-1 ring-white/10"
                    : "text-stone-300 hover:bg-stone-900 hover:text-white",
                )}
              >
                <span className="block truncate text-sm font-semibold">{session.title}</span>
                <span className="mt-1 block truncate text-xs text-stone-400">
                  {session.scenarioLabel} · {session.activeNode.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/10 p-3 text-xs text-stone-400">
          Luân chuyển tạm trong phiên hiện tại.
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col px-3 py-3 sm:px-5 sm:py-5">
        <div className="md:hidden">
          <div className="custom-scrollbar flex gap-2 overflow-x-auto pb-3">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition",
                  session.id === activeSession.id
                    ? "bg-stone-950 text-white ring-stone-950"
                    : "bg-[#fffdf7] text-stone-600 ring-stone-200",
                )}
              >
                {session.title}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <TutorChat
            activeNode={activeSession.activeNode}
            learnerContext={learnerContext}
            messages={activeSession.messages}
            onMessagesChange={updateActiveMessages}
          />
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 px-2 pt-3 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1 font-semibold text-stone-600">
            <SlidersHorizontal className="h-3.5 w-3.5 text-rose-900" />
            Đổi kịch bản:
          </span>
          {DEMO_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => addScenarioSession(scenario.id)}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold text-rose-900 transition hover:bg-rose-50"
            >
              <Plus className="h-3.5 w-3.5" />
              {scenario.title}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
