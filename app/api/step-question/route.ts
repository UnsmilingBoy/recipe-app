import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const { question, step, language } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Invalid question" }, { status: 400 });
    }

    if (!step) {
      return NextResponse.json(
        { error: "Step data required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const languageInstruction =
      language === "fa"
        ? "\n\nIMPORTANT: Your response must be in Persian (Farsi) language."
        : "";

    const systemPrompt = `You are a professional chef assistant helping users understand cooking steps better.

Context: The user is following a recipe step and has a question about it.

Recipe Step Information:
- Step Number: ${step.id}
${step.title ? `- Step Title: ${step.title}` : ""}
- Description: ${step.description}
${step.duration ? `- Duration: ${step.duration}` : ""}
${
  step.ingredients && step.ingredients.length > 0
    ? `- Ingredients Used: ${step.ingredients.join(", ")}`
    : ""
}

Your task:
1. Answer the user's question about this specific cooking step
2. Be concise but helpful (2-4 sentences)
3. Focus on practical cooking advice
4. If the question is unrelated to cooking, politely redirect to the recipe step

${languageInstruction}`;

    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    const answer = completion.choices[0]?.message?.content;

    if (!answer) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Step question API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
