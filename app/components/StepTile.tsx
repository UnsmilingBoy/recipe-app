"use client";

import { MotionCard } from "./MotionPresets";
import { MessageCircleQuestion } from "lucide-react";

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
        <button
          onClick={onAskQuestion}
          className="absolute top-4 left-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          title={text[language].askQuestion}
          aria-label={text[language].askQuestion}
        >
          <MessageCircleQuestion size={20} />
        </button>
      )}
    </MotionCard>
  );
}
