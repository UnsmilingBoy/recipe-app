"use client";

import { useState } from "react";
import { MotionInput, MotionButton } from "./MotionPresets";
import { Lightbulb } from "lucide-react";

interface ChatBoxProps {
  onRecipeRequest: (prompt: string) => void;
  onSuggestionsRequest: (prompt: string) => void;
  loading: boolean;
  language: "en" | "fa";
}

export default function ChatBox({
  onRecipeRequest,
  onSuggestionsRequest,
  loading,
  language,
}: ChatBoxProps) {
  const [prompt, setPrompt] = useState("");
  const [suggestionMode, setSuggestionMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      if (suggestionMode) {
        onSuggestionsRequest(prompt.trim());
      } else {
        onRecipeRequest(prompt.trim());
      }
    }
  };

  const text = {
    en: {
      placeholder:
        "What recipe are you looking for? (e.g., 'chicken curry for 4 people')",
      button: loading ? "Getting recipe..." : "Get Recipe",
      suggestButton: loading ? "Getting suggestions..." : "Get Suggestions",
      suggestionModeTooltip: "Suggestion Mode: Get 5 recipe ideas",
    },
    fa: {
      placeholder:
        "دنبال چه دستور پختی هستید؟ (مثلاً 'خورش قورمه سبزی برای ۴ نفر')",
      button: loading ? "در حال دریافت دستور پخت..." : "دریافت دستور پخت",
      suggestButton: loading
        ? "در حال دریافت پیشنهادها..."
        : "دریافت پیشنهادها",
      suggestionModeTooltip: "حالت پیشنهاد: دریافت ۵ ایده دستور پخت",
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
            className={`w-full py-4 md:text-lg rounded-2xl border-2 focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-zinc-900 dark:border-zinc-700 dark:focus:border-primary-dark ${
              language === "fa" ? "pr-6 pl-14" : "pl-6 pr-14"
            } ${
              suggestionMode
                ? "border-amber-400 dark:border-amber-500"
                : "border-gray-200"
            }`}
          />
          <button
            type="button"
            onClick={() => setSuggestionMode(!suggestionMode)}
            disabled={loading}
            title={text[language].suggestionModeTooltip}
            className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              language === "fa" ? "left-2" : "right-2"
            } ${
              suggestionMode
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-gray-500"
            }`}
          >
            <Lightbulb
              size={20}
              className={suggestionMode ? "fill-current" : ""}
            />
          </button>
        </div>
        <MotionButton
          type="submit"
          disabled={loading || !prompt.trim()}
          className={`px-8 py-4 text-white font-semibold rounded-2xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors dark:disabled:bg-zinc-700 ${
            suggestionMode
              ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
              : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {suggestionMode
            ? text[language].suggestButton
            : text[language].button}
        </MotionButton>
      </form>
    </div>
  );
}
