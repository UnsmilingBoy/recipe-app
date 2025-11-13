"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Recipe } from "@/lib/recipeSchema";
import { getCurrentUser } from "@/lib/authClient";

interface SavedRecipesContextType {
  savedRecipes: Recipe[];
  saveRecipe: (recipe: Recipe) => Promise<void>;
  unsaveRecipe: (recipeTitle: string) => Promise<void>;
  isRecipeSaved: (recipeTitle: string) => boolean;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const SavedRecipesContext = createContext<SavedRecipesContextType | undefined>(
  undefined
);

export function SavedRecipesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchSavedRecipes = async () => {
    try {
      const response = await fetch("/api/saved-recipes");

      if (response.ok) {
        const data = await response.json();
        setSavedRecipes(data.recipes || []);
      } else if (response.status === 401) {
        // Not authenticated
        setSavedRecipes([]);
        setIsAuthenticated(false);
      } else {
        console.error("Failed to fetch saved recipes");
      }
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    }
  };

  const checkAuthAndLoadRecipes = async () => {
    try {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);

      if (user) {
        await fetchSavedRecipes();
      } else {
        setSavedRecipes([]);
      }
    } catch (error) {
      console.error("Failed to check auth:", error);
      setIsAuthenticated(false);
      setSavedRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication and load saved recipes
  useEffect(() => {
    checkAuthAndLoadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    await checkAuthAndLoadRecipes();
  };

  const saveRecipe = async (recipe: Recipe) => {
    if (!isAuthenticated) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch("/api/saved-recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipe }),
      });

      if (response.ok) {
        // Add to local state optimistically
        setSavedRecipes((prev) => {
          if (prev.some((r) => r.title === recipe.title)) {
            return prev;
          }
          return [recipe, ...prev];
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to save recipe");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      throw error;
    }
  };

  const unsaveRecipe = async (recipeTitle: string) => {
    if (!isAuthenticated) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch(
        `/api/saved-recipes?title=${encodeURIComponent(recipeTitle)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove from local state
        setSavedRecipes((prev) => prev.filter((r) => r.title !== recipeTitle));
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  };

  const isRecipeSaved = (recipeTitle: string) => {
    return savedRecipes.some((r) => r.title === recipeTitle);
  };

  return (
    <SavedRecipesContext.Provider
      value={{
        savedRecipes,
        saveRecipe,
        unsaveRecipe,
        isRecipeSaved,
        isLoading,
        refetch,
      }}
    >
      {children}
    </SavedRecipesContext.Provider>
  );
}

export function useSavedRecipes() {
  const context = useContext(SavedRecipesContext);
  if (context === undefined) {
    throw new Error(
      "useSavedRecipes must be used within a SavedRecipesProvider"
    );
  }
  return context;
}
