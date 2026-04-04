"use client";

import { motion } from "motion/react";
import { BookOpen, GraduationCap, Target, Zap } from "lucide-react";

export default function Home() {
  return (
    <main classname="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section classname="relative overflow-hidden bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div classname="mx-auto max-w-7xl">
          <motion.div initial="{{" opacity:="" 0,="" y:="" 20="" }}="" animate="{{" opacity:="" 1,="" y:="" 0="" }}="" transition="{{" duration:="" 0.5="" }}="" classname="text-center">
            <h1 classname="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Năng Lực <span classname="text-blue-600">AI</span>
            </h1>
            <p classname="mt-6 text-xl leading-8 text-slate-600 max-w-2xl mx-auto">
              Học tập thích ứng biết mục tiêu của bạn là gì, dạy bạn đủ để giành chiến thắng và xây dựng kiến thức để bạn làm chủ.
            </p>
            <div classname="mt-10 flex items-center justify-center gap-x-6">
              <a href="/assessment" classname="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all">
                Bắt đầu ngay
              </a>
              <button classname="text-sm font-semibold leading-6 text-slate-900 flex items-center gap-1">
                Tìm hiểu thêm <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section classname="py-24 sm:py-32">
        <div classname="mx-auto max-w-7xl px-6 lg:px-8">
          <div classname="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <featurecard icon="{&lt;Target" classname="h-6 w-6 text-blue-600"/>}
              title="Cá nhân hóa"
              description="Lộ trình học tập dựa trên năng lực thực tế của bạn."
            />
            <featurecard icon="{&lt;Zap" classname="h-6 w-6 text-blue-600"/>}
              title="Phản hồi tức thì"
              description="AI Tutor hỗ trợ giải đáp và gợi ý ngay khi bạn gặp khó khăn."
            />
            <featurecard icon="{&lt;BookOpen" classname="h-6 w-6 text-blue-600"/>}
              title="Chuẩn GDPT 2018"
              description="Nội dung bám sát khung năng lực giáo dục phổ thông mới nhất."
            />
            <featurecard icon="{&lt;GraduationCap" classname="h-6 w-6 text-blue-600"/>}
              title="Mục tiêu ngắn hạn"
              description="Chia nhỏ kiến thức giúp bạn đạt được những chiến thắng nhỏ mỗi ngày."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div classname="flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div classname="rounded-lg bg-blue-50 p-3 mb-4">{icon}</div>
      <h3 classname="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p classname="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
