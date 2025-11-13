import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { Recipe } from "@/lib/recipeSchema";

interface SavedRecipe {
  id: number;
  user_id: number;
  recipe_data: Recipe;
  created_at: Date;
  updated_at: Date;
}

/**
 * GET /api/saved-recipes
 * Get all saved recipes for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user info
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get all saved recipes for this user
    const savedRecipes = await query<SavedRecipe>(
      "SELECT id, user_id, recipe_data, created_at, updated_at FROM saved_recipes WHERE user_id = $1 ORDER BY created_at DESC",
      [payload.userId]
    );

    // Return just the recipe data
    const recipes = savedRecipes.map((sr) => sr.recipe_data);

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved recipes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/saved-recipes
 * Save a new recipe for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user info
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get recipe data from request body
    const { recipe } = await request.json();

    if (!recipe || !recipe.title) {
      return NextResponse.json(
        { error: "Invalid recipe data" },
        { status: 400 }
      );
    }

    // Check if recipe is already saved
    const existing = await queryOne<SavedRecipe>(
      "SELECT id FROM saved_recipes WHERE user_id = $1 AND recipe_data->>'title' = $2",
      [payload.userId, recipe.title]
    );

    if (existing) {
      return NextResponse.json(
        { error: "Recipe already saved" },
        { status: 409 }
      );
    }

    // Save the recipe
    const result = await query<SavedRecipe>(
      "INSERT INTO saved_recipes (user_id, recipe_data) VALUES ($1, $2) RETURNING id, recipe_data, created_at",
      [payload.userId, JSON.stringify(recipe)]
    );

    return NextResponse.json(
      { message: "Recipe saved successfully", recipe: result[0].recipe_data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving recipe:", error);
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/saved-recipes
 * Delete a saved recipe for the authenticated user
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user info
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get recipe title from query params
    const { searchParams } = new URL(request.url);
    const recipeTitle = searchParams.get("title");

    if (!recipeTitle) {
      return NextResponse.json(
        { error: "Recipe title is required" },
        { status: 400 }
      );
    }

    // Delete the recipe
    const result = await query(
      "DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_data->>'title' = $2 RETURNING id",
      [payload.userId, recipeTitle]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
