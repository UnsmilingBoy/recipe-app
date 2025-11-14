"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSavedRecipes } from "../context/SavedRecipesContext";
import { useLanguage } from "../context/LanguageContext";
import { getCurrentUser } from "@/lib/authClient";
import RecipeView from "../components/RecipeView";
import { BookmarkIcon, Trash2, ChefHat } from "lucide-react";
import { MotionContainer, MotionCard } from "../components/MotionPresets";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SavedRecipesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
    savedRecipes,
    unsaveRecipe,
    isLoading: recipesLoading,
  } = useSavedRecipes();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [deletingRecipe, setDeletingRecipe] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleDeleteRecipe = async (
    e: React.MouseEvent,
    recipeTitle: string
  ) => {
    e.stopPropagation();
    setDeletingRecipe(recipeTitle);

    try {
      await unsaveRecipe(recipeTitle);
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    } finally {
      setDeletingRecipe(null);
    }
  };

  if (isLoading || recipesLoading) {
    return <LoadingSpinner />;
  }

  if (savedRecipes.length === 0) {
    return (
      <MotionContainer className="min-h-screen flex flex-col justify-center pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-6 bg-gray-100 dark:bg-zinc-800 rounded-full">
              <BookmarkIcon size={48} className="text-gray-400" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {language === "en"
              ? "No Saved Recipes"
              : "دستور پخت ذخیره‌شده‌ای وجود ندارد"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {language === "en"
              ? "Start creating recipes and save your favorites here!"
              : "شروع به ساخت دستور پخت کنید و محبوب‌های خود را اینجا ذخیره کنید!"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            {language === "en" ? "Create Recipe" : "ساخت دستور پخت"}
          </button>
        </div>
      </MotionContainer>
    );
  }

  if (selectedRecipe !== null) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <MotionContainer>
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedRecipe(null)}
              className="mb-6 text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
              ←{" "}
              {language === "en"
                ? "Back to Saved Recipes"
                : "بازگشت به دستورها"}
            </button>
            <RecipeView
              recipe={savedRecipes[selectedRecipe]}
              language={language}
            />
          </div>
        </MotionContainer>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-12 px-4"
      dir={language === "en" ? "ltr" : "rtl"}
    >
      <MotionContainer>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookmarkIcon size={32} className="text-primary" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {language === "en" ? "Saved Recipes" : "دستور‌های ذخیره‌شده"}
            </h1>
            <span className="text-gray-500 dark:text-gray-400 text-lg">
              ({savedRecipes.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((recipe, index) => (
              <MotionCard
                key={index}
                className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ChefHat size={24} className="text-primary" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {recipe.title}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => handleDeleteRecipe(e, recipe.title)}
                      disabled={deletingRecipe === recipe.title}
                      className={`p-2 hover:bg-red-50 cursor-pointer dark:hover:bg-red-900/20 rounded-lg transition-colors ${
                        deletingRecipe === recipe.title
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title={language === "en" ? "Remove" : "حذف"}
                    >
                      <Trash2
                        size={18}
                        className={`text-red-600 dark:text-red-400 ${
                          deletingRecipe === recipe.title ? "animate-pulse" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    {recipe.servings && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          {language === "en" ? "Servings:" : "تعداد نفرات:"}
                        </span>{" "}
                        {recipe.servings}
                      </p>
                    )}
                    {recipe.totalTime && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          {language === "en" ? "Time:" : "زمان:"}
                        </span>{" "}
                        {recipe.totalTime}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        {language === "en" ? "Ingredients:" : "مواد:"}
                      </span>{" "}
                      {recipe.ingredients.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        {language === "en" ? "Steps:" : "مراحل:"}
                      </span>{" "}
                      {recipe.steps.length}
                    </p>
                  </div>

                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recipe.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedRecipe(index)}
                    className="w-full py-2 bg-primary cursor-pointer hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                  >
                    {language === "en" ? "View Recipe" : "مشاهده دستور"}
                  </button>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </MotionContainer>
    </div>
  );
}
