"use client";

import { useState } from "react";
import { MotionInput, MotionButton } from "./MotionPresets";

interface ChatBoxProps {
  onRecipeRequest: (prompt: string) => void;
  loading: boolean;
  language: "en" | "fa";
}

export default function ChatBox({
  onRecipeRequest,
  loading,
  language,
}: ChatBoxProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onRecipeRequest(prompt.trim());
    }
  };

  const text = {
    en: {
      placeholder:
        "What recipe are you looking for? (e.g., 'chicken curry for 4 people')",
      button: loading ? "Getting recipe..." : "Get Recipe",
    },
    fa: {
      placeholder:
        "دنبال چه دستور پختی هستید؟ (مثلاً 'خورش قورمه سبزی برای ۴ نفر')",
      button: loading ? "در حال دریافت دستور پخت..." : "دریافت دستور پخت",
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <MotionInput
            type="text"
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrompt(e.target.value)
            }
            placeholder={text[language].placeholder}
            disabled={loading}
            dir={language === "fa" ? "rtl" : "ltr"}
            className="w-full px-6 py-4 md:text-lg rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-zinc-900 dark:border-zinc-700 dark:focus:border-primary-dark"
          />
        </div>
        <MotionButton
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors dark:disabled:bg-zinc-700"
        >
          {text[language].button}
        </MotionButton>
      </form>
    </div>
  );
}
