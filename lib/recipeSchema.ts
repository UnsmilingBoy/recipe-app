import { z } from "zod";

export const Ingredient = z.object({
  name: z.string(),
  quantity: z.string().optional(),
  icon: z.string().optional(),
});

export const Step = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string(),
  duration: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
});

export const RecipeSchema = z.object({
  title: z.string(),
  servings: z.number().optional(),
  totalTime: z.string().optional(),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(Ingredient),
  steps: z.array(Step),
  notes: z.string().optional(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

// A small example recipe used when no GEMINI API key is present (mock mode)
export const SAMPLE_RECIPE: Recipe = {
  title: "Simple Garlic Pasta",
  servings: 2,
  totalTime: "20 mins",
  tags: ["vegetarian", "quick"],
  ingredients: [
    { name: "spaghetti", quantity: "200g", icon: "pasta" },
    { name: "garlic cloves", quantity: "3", icon: "garlic" },
    { name: "olive oil", quantity: "2 tbsp", icon: "oil" },
    { name: "parmesan", quantity: "to taste", icon: "cheese" },
    { name: "salt", quantity: "to taste", icon: "salt" },
  ],
  steps: [
    {
      id: 1,
      title: "Boil pasta",
      description:
        "Cook spaghetti in salted boiling water until al dente (8-10 mins).",
    },
    {
      id: 2,
      title: "Prep garlic",
      description: "Thinly slice garlic cloves.",
      ingredients: ["garlic cloves"],
    },
    {
      id: 3,
      title: "Sizzle garlic",
      description:
        "Heat olive oil in a pan, add garlic and cook until fragrant and lightly golden.",
      ingredients: ["olive oil", "garlic cloves"],
    },
    {
      id: 4,
      title: "Combine",
      description:
        "Toss drained pasta with oil and garlic, top with parmesan and serve.",
      ingredients: ["spaghetti", "parmesan"],
    },
  ],
  notes: "A super-fast, tasty dish. Add chili flakes for heat.",
};
