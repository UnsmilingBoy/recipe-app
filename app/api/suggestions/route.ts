import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, language } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Mock mode: if no API key is set, return sample suggestions
    if (!apiKey) {
      console.warn(
        "⚠️  GEMINI_API_KEY not set. Returning sample suggestions (mock mode)."
      );
      return NextResponse.json({
        suggestions: [
          "Classic Pasta Carbonara",
          "Creamy Mushroom Pasta",
          "Spicy Arrabbiata Pasta",
          "Pesto Pasta with Cherry Tomatoes",
          "Garlic Butter Pasta with Shrimp",
        ],
        mock: true,
      });
    }

    // Add language instruction
    const languageInstruction =
      language === "fa"
        ? "\n\nIMPORTANT: ALL recipe titles must ONLY be in Persian (Farsi) language."
        : "";

    const systemPrompt = `You are a professional chef assistant AI. 
The user will describe what they're looking for, and you must respond with EXACTLY 5 recipe suggestions.

RULES:
1. Return ONLY a JSON array with exactly 5 recipe title strings
2. Each title should be clear, appetizing, and related to the user's request
3. Titles MUST be diverse and offer variety - explore different cuisines, cooking methods, and styles
4. Be creative and think outside the box - suggest unique and unexpected variations
5. Format: ["Recipe 1", "Recipe 2", "Recipe 3", "Recipe 4", "Recipe 5"]
6. NO markdown, NO explanations, NO extra text - ONLY the JSON array
7. If the request is not food-related, still provide 5 creative food-related suggestions
8. IMPORTANT: Generate DIFFERENT suggestions each time, avoid repeating the same recipes

${languageInstruction}

Random seed: ${Math.random().toString(36).substring(7)}`;

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
      generationConfig: {
        temperature: 1.2,
        topP: 0.95,
        topK: 40,
      },
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

    let suggestions;
    try {
      suggestions = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw text:", rawText);
      return NextResponse.json(
        { error: "Invalid JSON response from Gemini", raw: rawText },
        { status: 500 }
      );
    }

    // Validate that we got an array of strings
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      return NextResponse.json(
        { error: "Invalid suggestions format" },
        { status: 500 }
      );
    }

    // Ensure we have exactly 5 suggestions
    const finalSuggestions = suggestions.slice(0, 5);

    return NextResponse.json({ suggestions: finalSuggestions });
  } catch (error) {
    console.error("API route error:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
