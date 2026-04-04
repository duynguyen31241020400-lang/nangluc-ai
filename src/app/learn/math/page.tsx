"use client";

import { useState } from "react";
import TutorChat from "@/src/components/learning/TutorChat";
import ProgressTree, { CompetencyNode } from "@/src/components/learning/ProgressTree";
import { Trophy, Target, Flame } from "lucide-react";

// Mock data for Phase 4 (Will be replaced by Supabase fetch)
const MOCK_NODES: CompetencyNode[] = [
  { id: "1", code: "TOAN10.1", title: "Khái niệm Tập hợp", mastery: 1, status: "completed" },
  { id: "2", code: "TOAN10.2", title: "Các phép toán Tập hợp", mastery: 0.7, status: "available", isCurrentGoal: true },
  { id: "3", code: "TOAN10.3", title: "Bất phương trình bậc nhất", mastery: 0, status: "available" },
  { id: "4", code: "TOAN10.4", title: "Hệ bất phương trình", mastery: 0, status: "locked" },
  { id: "5", code: "TOAN10.5", title: "Hàm số bậc hai", mastery: 0, status: "locked" },
];

export default function LearnPage() {
  const [activeNode, setActiveNode] = useState<competencynode>(MOCK_NODES[1]);

  return (
    <div classname="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
      <div classname="max-w-7xl mx-auto">
        {/* Header */}
        <div classname="mb-8 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div classname="flex items-center gap-4">
            <div classname="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
              M
            </div>
            <div>
              <h1 classname="text-xl font-bold text-slate-900">Chào Minh!</h1>
              <p classname="text-slate-500 text-xs flex items-center gap-1">
                <flame classname="h-3 w-3 text-orange-500 fill-orange-500"/> 
                Chuỗi 5 ngày học tập
              </p>
            </div>
          </div>
          
          <div classname="flex items-center gap-6">
            <div classname="hidden md:flex flex-col items-end">
              <span classname="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Năng lực hiện tại</span>
              <div classname="flex items-center gap-2">
                <div classname="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div classname="h-full bg-green-500 w-[15%]"/>
                </div>
                <span classname="text-sm font-bold text-slate-900">15%</span>
              </div>
            </div>
            <div classname="bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100 flex items-center gap-2">
              <trophy classname="h-4 w-4 text-yellow-600"/>
              <span classname="text-xs font-bold text-yellow-700">1,250 XP</span>
            </div>
          </div>
        </div>

        <div classname="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Progress Tree */}
          <div classname="lg:col-span-5 xl:col-span-4 space-y-6">
            <div classname="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div classname="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <h2 classname="font-bold text-slate-800 flex items-center gap-2">
                  <target classname="h-5 w-5 text-blue-600"/>
                  Lộ trình Năng lực
                </h2>
                <span classname="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold uppercase">Toán 10</span>
              </div>
              <div classname="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                <progresstree nodes="{MOCK_NODES}" onnodeclick="{setActiveNode}" activenodeid="{activeNode.id}"/>
              </div>
            </div>

            {/* Short-term Win Card */}
            <div classname="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
              <div classname="relative z-10">
                <h3 classname="font-bold text-lg mb-1">Mục tiêu ngắn hạn</h3>
                <p classname="text-blue-100 text-sm mb-4">Hoàn thành "Các phép toán Tập hợp" để đạt 5/10 điểm giữa kỳ!</p>
                <div classname="bg-white/20 h-2 w-full rounded-full overflow-hidden">
                  <div classname="h-full bg-white w-[70%]"/>
                </div>
                <p classname="text-[10px] mt-2 text-blue-200 font-medium">Còn 3 bài tập nữa thôi, cố lên!</p>
              </div>
              <star classname="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 rotate-12"/>
            </div>
          </div>

          {/* Right Column: AI Tutor Chat */}
          <div classname="lg:col-span-7 xl:col-span-8 flex flex-col">
            <div classname="bg-white p-4 rounded-t-3xl border-x border-t border-slate-100 flex items-center justify-between">
              <div classname="flex items-center gap-3">
                <div classname="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <target classname="h-6 w-6 text-blue-600"/>
                </div>
                <div>
                  <h3 classname="font-bold text-slate-900 text-sm">{activeNode.title}</h3>
                  <p classname="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{activeNode.code}</p>
                </div>
              </div>
              <div classname="flex items-center gap-2">
                <span classname="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  {activeNode.status === "completed" ? "Đã hoàn thành" : "Đang học"}
                </span>
              </div>
            </div>
            <tutorchat/>
          </div>
        </div>
      </div>
    </div>
  );
}

function Star(props: any) {
  return (
    <svg {...props}="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokewidth="2" strokelinecap="round" strokelinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
