"use client";

import { MotionCard } from "./MotionPresets";
import { MessageCircleQuestion, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  id: number;
  title?: string;
  description: string;
  duration?: string;
  ingredients?: string[];
}

interface StepTileProps {
  step: Step;
  onAskQuestion?: () => void;
  language: "en" | "fa";
}

export default function StepTile({
  step,
  onAskQuestion,
  language,
}: StepTileProps) {
  const text = {
    en: { askQuestion: "Ask about this step" },
    fa: { askQuestion: "سوال درباره این مرحله" },
  };

  return (
    <MotionCard className="flex gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-800 dark:border-zinc-700 relative group">
      {/* Step Number Circle */}
      <div className="shrink-0">
        <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white font-bold text-xl rounded-full">
          {step.id}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 space-y-2">
        {step.title && (
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step.title}
          </h3>
        )}
        <p className="text-gray-700 leading-relaxed dark:text-gray-300">
          {step.description}
        </p>

        <div className="flex flex-wrap gap-3 items-center text-sm">
          {step.duration && (
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <span className="text-base">⏱️</span>
              {step.duration}
            </span>
          )}
          {step.ingredients && step.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {step.ingredients.map((ingredient, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md dark:bg-zinc-700 dark:text-gray-300"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ask Question Button */}
      {onAskQuestion && (
        <motion.button
          onClick={onAskQuestion}
          className="absolute top-4 left-4 p-2 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-colors duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 dark:shadow-blue-500/30"
          title={text[language].askQuestion}
          aria-label={text[language].askQuestion}
          whileHover={{
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.4 },
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <MessageCircleQuestion size={20} className="drop-shadow-lg" />
          </motion.div>

          {/* Sparkle effect */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Sparkles size={12} className="text-yellow-300" />
          </motion.div>
        </motion.button>
      )}
    </MotionCard>
  );
}
