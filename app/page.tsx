"use client";

import { useState, useEffect, useRef } from "react";
import ChatBox from "./components/ChatBox";
import RecipeView from "./components/RecipeView";
import { MotionContainer } from "./components/MotionPresets";
import { Recipe } from "@/lib/recipeSchema";
import { useLanguage } from "./context/LanguageContext";
import Image from "next/image";

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [lastSuggestionsPrompt, setLastSuggestionsPrompt] = useState<
    string | null
  >(null);
  const { language } = useLanguage();

  const handleRecipeRequest = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setRecipe(null);
    setIsMock(false);
    setSuggestions(null);

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch recipe");
      }

      const data = await response.json();
      setRecipe(data.recipe);
      setIsMock(data.mock || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionsRequest = async (prompt: string) => {
    setSuggestionsLoading(true);
    setError(null);
    setRecipe(null);
    setSuggestions(null);
    setLastSuggestionsPrompt(prompt);

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch suggestions");
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSelectSuggestion = async (suggestion: string) => {
    await handleRecipeRequest(suggestion);
  };

  const handleShuffleSuggestions = async () => {
    if (lastSuggestionsPrompt) {
      await handleSuggestionsRequest(lastSuggestionsPrompt);
    }
  };

  const text = {
    en: {
      title: "🍳 Recipe Assistant",
      subtitle: "Get personalized recipes instantly",
      generating: "Creating your perfect recipe...",
      gettingSuggestions: "Finding recipe ideas for you...",
      selectSuggestion: "Select a recipe to view:",
      shuffleSuggestions: "Get New Ideas",
      error: "Error:",
    },
    fa: {
      title: "دستیار دستور پخت 🍳",
      subtitle: "دستور پخت های شخصی سازی شده",
      generating: "در حال ایجاد دستور پخت عالی شما...",
      gettingSuggestions: "در حال یافتن ایده‌های دستور پخت برای شما...",
      selectSuggestion: "یک دستور پخت را انتخاب کنید:",
      shuffleSuggestions: "ایده‌های جدید",
      error: "خطا:",
    },
  };

  const recipeRef = useRef<HTMLDivElement | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // When a recipe becomes available and loading is finished, scroll to the recipe
    if (recipe && !loading) {
      // Use a slight delay to ensure layout completed (helps with large content render)
      setTimeout(() => {
        if (recipeRef.current) {
          recipeRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 80);
    }
  }, [recipe, loading]);

  useEffect(() => {
    // When suggestions become available and loading is finished, scroll to suggestions
    if (suggestions && !suggestionsLoading) {
      setTimeout(() => {
        if (suggestionsRef.current) {
          suggestionsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 80);
    }
  }, [suggestions, suggestionsLoading]);

  return (
    <MotionContainer className="flex flex-col justify-center min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 pt-20">
      <div className="container mx-auto py-12 px-2">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <Image src={"/cook2.png"} alt="Cooking" width={400} height={400} />
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {text[language].title}
          </h1>
          <p className="md:text-lg text-gray-600 dark:text-gray-400">
            {text[language].subtitle}
          </p>
        </div>

        {/* Chat Box */}
        <ChatBox
          onRecipeRequest={handleRecipeRequest}
          onSuggestionsRequest={handleSuggestionsRequest}
          loading={loading || suggestionsLoading}
          language={language}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center mt-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {text[language].generating}
            </p>
          </div>
        )}

        {/* Suggestions Loading State */}
        {suggestionsLoading && (
          <div className="text-center mt-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {text[language].gettingSuggestions}
            </p>
          </div>
        )}

        {/* Suggestions Selection */}
        {suggestions && !suggestionsLoading && (
          <div className="max-w-3xl mx-auto mt-12" ref={suggestionsRef}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {text[language].selectSuggestion}
              </h2>
              <button
                onClick={handleShuffleSuggestions}
                disabled={suggestionsLoading}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                <span className="hidden sm:inline">
                  {text[language].shuffleSuggestions}
                </span>
              </button>
            </div>
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  disabled={loading}
                  className="p-4 bg-white dark:bg-zinc-800 border-2 border-amber-200 dark:border-amber-800 rounded-xl hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-lg transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {suggestion}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-3xl mx-auto mt-8 p-6 bg-red-50 border-l-4 border-red-500 dark:bg-red-900/20 dark:border-red-600">
            <p className="text-red-800 dark:text-red-200">
              <strong>{text[language].error}</strong> {error}
            </p>
          </div>
        )}

        {/* Recipe View */}
        {recipe && !loading && (
          <div className="mt-12" ref={recipeRef}>
            <RecipeView recipe={recipe} isMock={isMock} language={language} />
          </div>
        )}
      </div>
    </MotionContainer>
  );
}
