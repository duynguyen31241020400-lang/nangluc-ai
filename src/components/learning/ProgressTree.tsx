"use client";

import { motion } from "motion/react";
import { CheckCircle2, Circle, Lock, Star } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface CompetencyNode {
  id: string;
  code: string;
  title: string;
  mastery: number; // 0 to 1
  status: "locked" | "available" | "completed";
  isCurrentGoal?: boolean;
}

interface ProgressTreeProps {
  nodes: CompetencyNode[];
  onNodeClick: (node: CompetencyNode) => void;
  activeNodeId?: string;
}

export default function ProgressTree({ nodes, onNodeClick, activeNodeId }: ProgressTreeProps) {
  return (
    <div classname="relative py-8 flex flex-col items-center gap-12">
      {/* Connection Line */}
      <div classname="absolute top-0 bottom-0 w-1 bg-slate-200 left-1/2 -translate-x-1/2 z-0"/>

      {nodes.map((node, index) => (
        <motion.div key="{node.id}" initial="{{" opacity:="" 0,="" x:="" index="" %="" 2="==" 0="" ?="" -20="" :="" 20="" }}="" animate="{{" opacity:="" 1,="" x:="" 0="" }}="" transition="{{" delay:="" index="" *="" 0.1="" }}="" classname="relative z-10 flex flex-col items-center group">
          {/* Node Circle */}
          <button onclick="{()" ==""> node.status !== "locked" && onNodeClick(node)}
            className={cn(
              "h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-4",
              node.status === "completed" 
                ? "bg-green-500 border-green-200 text-white" 
                : node.status === "available"
                ? "bg-white border-blue-500 text-blue-600 hover:scale-110"
                : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed",
              activeNodeId === node.id && "ring-4 ring-blue-300 ring-offset-2 scale-110"
            )}
          >
            {node.status === "completed" ? (
              <checkcircle2 classname="h-8 w-8"/>
            ) : node.status === "locked" ? (
              <lock classname="h-6 w-6"/>
            ) : (
              <star classname="{cn(&#34;h-8" w-8",="" node.iscurrentgoal="" &&="" "animate-pulse")}=""/>
            )}
          </button>

          {/* Label */}
          <div classname="{cn(" "absolute="" top-1="" 2="" -translate-y-1="" 2="" w-48="" px-4="" py-2="" rounded-xl="" bg-white="" shadow-sm="" border="" border-slate-100="" transition-all",="" index="" %="" 2="==" 0="" ?="" "right-20="" text-right"="" :="" "left-20="" text-left",="" node.status="==" "locked"="" ?="" "opacity-50"="" :="" "group-hover:shadow-md"="" )}="">
            <p classname="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{node.code}</p>
            <h4 classname="text-sm font-semibold text-slate-800 leading-tight">{node.title}</h4>
            {node.status === "completed" && (
              <p classname="text-[10px] text-green-600 font-medium mt-1">Đã làm chủ 100%</p>
            )}
            {node.status === "available" && (
              <div classname="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial="{{" width:="" 0="" }}="" animate="{{" width:="" `${node.mastery="" *="" 100}%`="" }}="" classname="h-full bg-blue-500"/>
              </div>
            )}
          </div>

          {/* Dopamine Feedback for Current Goal */}
          {node.isCurrentGoal && (
            <motion.div initial="{{" scale:="" 0="" }}="" animate="{{" scale:="" [1,="" 1.2,="" 1]="" }}="" transition="{{" repeat:="" infinity,="" duration:="" 2="" }}="" classname="absolute -top-2 -right-2 bg-yellow-400 text-white p-1 rounded-full shadow-sm">
              <star classname="h-3 w-3 fill-current"/>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
