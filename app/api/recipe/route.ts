import { NextRequest, NextResponse } from "next/server";
import { RecipeSchema, SAMPLE_RECIPE } from "@/lib/recipeSchema";

export async function POST(request: NextRequest) {
  try {
    const { prompt, language } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Mock mode: if no API key is set, return sample recipe
    if (!apiKey) {
      console.warn(
        "⚠️  GEMINI_API_KEY not set. Returning sample recipe (mock mode)."
      );
      return NextResponse.json({
        recipe: SAMPLE_RECIPE,
        mock: true,
      });
    }

    // Add language instruction
    const languageInstruction =
      language === "fa"
        ? "\n\nIMPORTANT: ALL answers must ONLY be in Persian (Farsi) language. All text fields including title, ingredients, steps, tags, and notes MUST be in Persian."
        : "";

    // Build the system prompt that enforces JSON-only output
    const systemPrompt = `You are a professional chef assistant. When a user asks for a full complete recipe, include as many steps as needed as long as it has to be, respond ONLY with valid JSON in this exact schema:
{
  "title": "Recipe Name",
  "servings": 4,
  "totalTime": "30 mins",
  "tags": ["tag1", "tag2"],
  "ingredients": [
    { "name": "ingredient name", "quantity": "100g", "icon": "icon_name" }
  ],
  "steps": [
    { "id": 1, "title": "Step Title", "description": "Detailed step instructions", "duration": "5 mins", "ingredients": ["ingredient1", "ingredient2"] }
  ],
  "notes": "Optional notes"
}

For the "icon" field, use simple icon names like: pasta, garlic, oil, cheese, salt, pepper, tomato, onion, carrot, potato, chicken, beef, fish, egg, milk, butter, flour, sugar, water, lemon, herbs, spices.

DO NOT include any markdown, explanations, or extra text. Return ONLY the JSON object.${languageInstruction}`;

    // Use the direct REST API approach matching your curl command
    const payload = {
      contents: [
        {
          parts: [
            {
              text: systemPrompt + "\n\nUser request: " + prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        {
          error: `Gemini API Error (${response.status})`,
          details: errorText.substring(0, 200),
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Extract text from Gemini response
    const candidates = data?.candidates;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: "No response from Gemini" },
        { status: 500 }
      );
    }

    const rawText = candidates[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        { error: "Empty response from Gemini" },
        { status: 500 }
      );
    }

    // Try to extract JSON from the response (strip markdown if present)
    let jsonText = rawText.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    }

    let recipeData;
    try {
      recipeData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw text:", rawText);
      return NextResponse.json(
        { error: "Invalid JSON response from Gemini", raw: rawText },
        { status: 500 }
      );
    }

    // Validate with Zod
    const validatedRecipe = RecipeSchema.parse(recipeData);

    return NextResponse.json({ recipe: validatedRecipe });
  } catch (error) {
    console.error("API route error:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
