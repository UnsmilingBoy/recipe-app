"use client";

import { useState, useEffect, useRef } from "react";
import ChatBox from "./components/ChatBox";
import RecipeView from "./components/RecipeView";
import { MotionContainer, MotionButton } from "./components/MotionPresets";
import { Recipe } from "@/lib/recipeSchema";
import { Languages } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [language, setLanguage] = useState<"en" | "fa">("fa");

  // Apply Persian font to body when language changes
  useEffect(() => {
    if (language === "fa") {
      document.body.classList.add("vazirmatn-font");
    } else {
      document.body.classList.remove("vazirmatn-font");
    }
  }, [language]);

  const handleRecipeRequest = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setRecipe(null);
    setIsMock(false);

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

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fa" : "en");
  };

  const text = {
    en: {
      title: "🍳 Recipe Assistant",
      subtitle: "Get personalized recipes instantly",
      generating: "Creating your perfect recipe...",
      error: "Error:",
    },
    fa: {
      title: "دستیار دستور پخت 🍳",
      subtitle: "دستور پخت های شخصی سازی شده",
      generating: "در حال ایجاد دستور پخت عالی شما...",
      error: "خطا:",
    },
  };

  const recipeRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <MotionContainer className="flex flex-col justify-center min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Language Toggle Button */}

      <MotionButton
        onClick={toggleLanguage}
        className="gap-2 p-3 cursor-pointer fixed top-5 right-5 bg-white dark:bg-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-zinc-700"
      >
        <Languages />
      </MotionButton>

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
          loading={loading}
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
