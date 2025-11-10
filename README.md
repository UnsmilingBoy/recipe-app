# 🍳 AI Recipe Assistant

A beautiful Next.js app that uses **Google Gemini AI** to generate custom recipes with structured JSON responses. Users can request any recipe, and the app displays ingredients with icons and step-by-step instructions in elegant tile components.

---

## ✨ Features

- 💬 **Chat-based interface** – Ask for any recipe in natural language
- 🤖 **Gemini AI integration** – Powered by Google's Gemini 1.5 Flash model
- 📋 **Structured JSON responses** – Enforces consistent schema with Zod validation
- 🎨 **Beautiful UI** – Modern components with Tailwind CSS
- 🍴 **Ingredient icons** – Visual emoji icons for common ingredients
- 📝 **Step tiles** – Clear, numbered step-by-step instructions
- 🌙 **Dark mode support** – Automatic theme switching
- 🎭 **Mock mode** – Works without API key for testing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A **Gemini API key** (free tier available at [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   > **Note**: If you don't have a Gemini API key, the app will run in **mock mode** and return a sample recipe.

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 How It Works

### 1. User Input

Users type a recipe request in the chat box:

```
"chicken curry for 4 people"
"quick vegetarian pasta"
"chocolate cake"
```

### 2. API Route (`/api/recipe`)

- Sends the prompt to Gemini AI with a strict system prompt
- Enforces JSON-only responses (no markdown, no extra text)
- Validates response against Zod schema

### 3. JSON Schema

The app expects this exact structure:

```json
{
  "title": "Recipe Name",
  "servings": 4,
  "totalTime": "30 mins",
  "tags": ["tag1", "tag2"],
  "ingredients": [
    {
      "name": "ingredient name",
      "quantity": "100g",
      "icon": "icon_name"
    }
  ],
  "steps": [
    {
      "id": 1,
      "title": "Step Title",
      "description": "Detailed instructions",
      "duration": "5 mins",
      "ingredients": ["ingredient1", "ingredient2"]
    }
  ],
  "notes": "Optional chef's notes"
}
```

### 4. Component Rendering

- **RecipeView**: Main container
- **IngredientIcon**: Maps icon names to emojis (pasta → 🍝, garlic → 🧄, etc.)
- **StepTile**: Numbered cards with descriptions and related ingredients

---

## 📁 Project Structure

```
recipe-app/
├── app/
│   ├── api/
│   │   └── recipe/
│   │       └── route.ts          # API endpoint for Gemini
│   ├── components/
│   │   ├── ChatBox.tsx           # User input component
│   │   ├── RecipeView.tsx        # Main recipe display
│   │   ├── StepTile.tsx          # Individual step card
│   │   └── IngredientIcon.tsx    # Icon mapper
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── lib/
│   └── recipeSchema.ts           # Zod schema + types
├── .env.local                    # Environment variables (create this)
├── package.json
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

| Variable         | Required | Description                                                                         |
| ---------------- | -------- | ----------------------------------------------------------------------------------- |
| `GEMINI_API_KEY` | No\*     | Your Google Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey) |

\*If not provided, the app runs in **mock mode** with a sample recipe.

### Icon Mapping

The app includes emoji icons for common ingredients. To add more icons, edit `app/components/IngredientIcon.tsx`:

```tsx
const iconMap: Record<string, string> = {
  pasta: "🍝",
  garlic: "🧄",
  // Add your custom mappings here
  basil: "🌿",
  shrimp: "🦐",
};
```

---

## 🎨 Customization

### Styling

- The app uses **Tailwind CSS** for styling
- Modify `app/globals.css` for global theme changes
- Dark mode is automatically supported

### Gemini Model

To use a different Gemini model, edit `app/api/recipe/route.ts`:

```typescript
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
```

### Temperature & Tokens

Adjust in `app/api/recipe/route.ts`:

```typescript
generationConfig: {
  temperature: 0.7,  // Lower = more focused, Higher = more creative
  maxOutputTokens: 2048,
}
```

---

## 🧪 Testing

### Without API Key (Mock Mode)

1. Don't set `GEMINI_API_KEY`
2. Run `npm run dev`
3. Submit any prompt → Get sample recipe

### With API Key

1. Set `GEMINI_API_KEY` in `.env.local`
2. Run `npm run dev`
3. Try prompts like:
   - "Italian carbonara"
   - "vegan tacos for 6"
   - "quick breakfast ideas"

---

## 🚀 Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` to environment variables in project settings
4. Deploy!

### Build Locally

```bash
npm run build
npm start
```

---

## 📝 Example Prompts

Try these to see the app in action:

- "chicken tikka masala for 4"
- "quick vegetarian pasta under 20 minutes"
- "chocolate lava cake dessert"
- "healthy breakfast smoothie bowl"
- "spicy thai green curry"

---

## 🐛 Troubleshooting

### "Invalid JSON response from Gemini"

- The Gemini model occasionally returns markdown-wrapped JSON
- The API route strips markdown automatically
- If issues persist, try adjusting the temperature or using `gemini-1.5-pro`

### "No response from Gemini"

- Check your API key is correct
- Ensure you have quota remaining (free tier limits)
- Check the Gemini API status

### Mock mode not working

- Ensure `GEMINI_API_KEY` is NOT set in `.env.local`
- Restart the dev server

---

**Enjoy cooking with AI! 🍳✨**
