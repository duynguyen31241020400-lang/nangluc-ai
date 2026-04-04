"use client";

import { MessageSquare } from "lucide-react";
import { motion } from "motion/react";

export default function FeedbackButton() {
  return (
    <motion.button whilehover="{{" scale:="" 1.1="" }}="" whiletap="{{" scale:="" 0.9="" }}="" onclick="{()" ==""> alert("Cảm ơn bạn! Hãy gửi góp ý cho chúng tôi qua email: feedback@nangluc.ai")}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center group"
      aria-label="Gửi phản hồi"
    >
      <messagesquare classname="h-6 w-6"/>
      <span classname="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-sm font-bold whitespace-nowrap">
        Góp ý
      </span>
    </motion.button>
  );
}
