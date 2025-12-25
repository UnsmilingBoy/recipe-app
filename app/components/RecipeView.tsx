"use client";

import { Recipe } from "@/lib/recipeSchema";
import StepTile from "./StepTile";
import IngredientIcon from "./IngredientIcon";
import StepChatModal from "./StepChatModal";
import { motion } from "framer-motion";
import { BookmarkIcon, BookmarkCheck } from "lucide-react";
import { useSavedRecipes } from "../context/SavedRecipesContext";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/authClient";
import { useRouter } from "next/navigation";

interface RecipeViewProps {
  recipe: Recipe;
  isMock?: boolean;
  language: "en" | "fa";
}

export default function RecipeView({
  recipe,
  isMock,
  language,
}: RecipeViewProps) {
  const router = useRouter();
  const { saveRecipe, unsaveRecipe, isRecipeSaved } = useSavedRecipes();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setError] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<
    (typeof recipe.steps)[0] | null
  >(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isSaved = isRecipeSaved(recipe.title);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleSaveToggle = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isSaved) {
        await unsaveRecipe(recipe.title);
        setShowSaveToast(false);
      } else {
        await saveRecipe(recipe);
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 3000);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save recipe"
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenStepChat = (step: (typeof recipe.steps)[0]) => {
    setSelectedStep(step);
    setIsChatOpen(true);
  };

  const handleCloseStepChat = () => {
    setIsChatOpen(false);
    setSelectedStep(null);
  };

  const text = {
    en: {
      mockMode: "Mock Mode:",
      mockMessage: "No GEMINI_API_KEY found. Showing sample recipe.",
      servings: "servings",
      ingredients: "Ingredients",
      steps: "Steps",
      chefNotes: "Chef's Notes",
      saveRecipe: "Save Recipe",
      saved: "Saved",
      recipeSaved: "Recipe saved successfully!",
      saveFailed: "Failed to save recipe",
    },
    fa: {
      mockMode: "حالت نمایشی:",
      mockMessage: "کلید API یافت نشد. نمایش دستور پخت نمونه.",
      servings: "نفر",
      ingredients: "مواد لازم",
      steps: "مراحل تهیه",
      chefNotes: "نکات سرآشپز",
      saveRecipe: "ذخیره دستور",
      saved: "ذخیره شده",
      recipeSaved: "دستور با موفقیت ذخیره شد!",
      saveFailed: "ذخیره‌سازی ناموفق بود",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-4xl mx-auto p-2 space-y-8"
      dir={language === "fa" ? "rtl" : "ltr"}
    >
      {isMock && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-600">
          <p className="text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>{text[language].mockMode}</strong>{" "}
            {text[language].mockMessage}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex-1">
            {recipe.title}
          </h1>
          <button
            onClick={handleSaveToggle}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isSaved
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500"
                : "bg-primary/10 hover:bg-primary/20 text-primary border-2 border-primary/30 hover:border-primary"
            } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            title={isSaved ? text[language].saved : text[language].saveRecipe}
          >
            {isSaved ? (
              <>
                <BookmarkCheck size={20} />
                <span className="hidden sm:inline">{text[language].saved}</span>
              </>
            ) : (
              <>
                <BookmarkIcon size={20} />
                <span className="hidden sm:inline">
                  {text[language].saveRecipe}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Toast notification */}
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <BookmarkCheck size={20} />
            <span>{text[language].recipeSaved}</span>
          </motion.div>
        )}

        {/* Error notification */}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <span>{saveError}</span>
          </motion.div>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          {recipe.servings && (
            <span className="flex items-center gap-1">
              👥 {recipe.servings} {text[language].servings}
            </span>
          )}
          {recipe.totalTime && (
            <span className="flex items-center gap-1">
              ⏱️ {recipe.totalTime}
            </span>
          )}
        </div>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/30 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Ingredients Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {text[language].ingredients}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipe.ingredients.map((ingredient, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700"
            >
              <IngredientIcon icon={ingredient.icon} />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {ingredient.name}
                </div>
                {ingredient.quantity && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {ingredient.quantity}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {text[language].steps}
        </h2>
        <div className="space-y-4">
          {recipe.steps.map((step) => (
            <StepTile
              key={step.id}
              step={step}
              onAskQuestion={() => handleOpenStepChat(step)}
              language={language}
            />
          ))}
        </div>
      </div>

      {/* Notes */}
      {recipe.notes && (
        <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 dark:bg-amber-900/20 dark:border-amber-700">
          <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
            💡 {text[language].chefNotes}
          </h3>
          <p className="text-amber-800 dark:text-amber-200">{recipe.notes}</p>
        </div>
      )}

      {/* Step Chat Modal */}
      {selectedStep && (
        <StepChatModal
          step={selectedStep}
          isOpen={isChatOpen}
          onClose={handleCloseStepChat}
          language={language}
        />
      )}
    </motion.div>
  );
}
