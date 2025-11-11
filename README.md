# 🍳 AI Recipe Assistant

A beautiful Next.js app that uses **Google Gemini AI** to generate custom recipes with structured JSON responses. Users can request any recipe, and the app displays ingredients with icons and step-by-step instructions in elegant tile components.

**NEW:** Now includes full user authentication and profile management!

---

Live demo: https://sham-chie.vercel.app

## ✨ Features

### Recipe Features

- 💬 **Chat-based interface** – Ask for any recipe in natural language
- 🤖 **Gemini AI integration** – Powered by Google's Gemini 1.5 Flash model
- 📋 **Structured JSON responses** – Enforces consistent schema with Zod validation
- 🎨 **Beautiful UI** – Modern components with Tailwind CSS + Framer Motion
- 🍴 **Ingredient icons** – Visual emoji icons for common ingredients
- 📝 **Step tiles** – Clear, numbered step-by-step instructions
- 🎭 **Mock mode** – Works without API key for testing
- 🌍 **Bilingual support** – English and Persian (Farsi) interface

### User Management Features ✨ NEW

- 🔐 **Secure Authentication** – JWT-based auth with HTTP-only cookies
- 👤 **User Profiles** – Create and manage your account
- 🔑 **Password Management** – Secure password hashing with bcrypt
- 📝 **Profile Updates** – Change name, email, and password
- 🗑️ **Account Deletion** – Full control over your data
- 🌙 **Dark Mode** – Complete theme support across all pages
- 🎨 **Consistent Design** – Blue/purple gradient theme throughout

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A **Gemini API key** (free tier available at [Google AI Studio](https://aistudio.google.com/app/apikey))
- **PostgreSQL database** (we recommend [Supabase](https://supabase.com) - free tier available)

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:

   ```env
   # AI Recipe Generation
   GEMINI_API_KEY=your_gemini_api_key_here

   # Database (Supabase recommended)
   DATABASE_URL=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres

   # Authentication
   JWT_SECRET=your_secure_random_secret_key_here
   NODE_ENV=development
   ```

   > **Note**: If you don't have a Gemini API key, the app will run in **mock mode** for recipes.

3. **Set up the database**:

   See detailed guide in `docs/SUPABASE_SETUP.md` or follow the quick steps:

   - Create a [Supabase](https://supabase.com) account and project
   - Get your Connection Pooler URL from Settings → Database
   - Run the setup script in Supabase SQL Editor (copy from `scripts/setup-db.sql`)
   - Generate a secure JWT secret:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open in browser**:
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
│   │   ├── recipe/
│   │   │   └── route.ts          # API endpoint for Gemini
│   │   └── users/                # User management API routes
│   │       ├── register/route.ts # User registration
│   │       ├── login/route.ts    # User login
│   │       ├── logout/route.ts   # User logout
│   │       └── me/route.ts       # Get/update/delete user profile
│   ├── components/
│   │   ├── ChatBox.tsx           # User input component
│   │   ├── RecipeView.tsx        # Main recipe display
│   │   ├── StepTile.tsx          # Individual step card
│   │   ├── IngredientIcon.tsx    # Icon mapper
│   │   ├── UserNav.tsx           # User login/profile navigation
│   │   └── MotionPresets.tsx     # Framer Motion animations
│   ├── login/
│   │   └── page.tsx              # Login/register page
│   ├── profile/
│   │   └── page.tsx              # User profile management
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── lib/
│   ├── recipeSchema.ts           # Zod schema + types for recipes
│   ├── userSchema.ts             # Zod schema + types for users
│   ├── db.ts                     # PostgreSQL connection pool
│   ├── auth.ts                   # JWT utilities
│   ├── authClient.ts             # Client-side auth functions
│   └── middleware.ts             # Auth middleware
├── scripts/
│   └── setup-db.sql              # Database initialization script
├── docs/
│   ├── SUPABASE_SETUP.md         # Complete Supabase setup guide
│   ├── USER_MANAGEMENT.md        # API documentation
│   └── SUPABASE_QUICK_REFERENCE.md # Quick reference guide
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
| `DATABASE_URL`   | Yes\*\*  | PostgreSQL connection string (Supabase Connection Pooler recommended)               |
| `JWT_SECRET`     | Yes\*\*  | Secret key for JWT token signing (generate with crypto.randomBytes)                 |
| `NODE_ENV`       | No       | Set to `production` for production builds                                           |

\*If `GEMINI_API_KEY` is not provided, the app runs in **mock mode** for recipes.

\*\*Required for user authentication features. Recipe features work without authentication.

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

## � User Authentication

The app includes a complete user management system with:

- **Secure Registration & Login** at `/login`
- **Profile Management** at `/profile`
- **JWT-based Authentication** with HTTP-only cookies
- **Password Hashing** with bcrypt (10 rounds)
- **Protected Routes** with authentication middleware

### Quick Start with Authentication

1. **Register an account:**

   - Click "Sign In" button (top-left on home page)
   - Switch to "Sign up" tab
   - Enter name, email, and password (min 8 characters)

2. **Login:**

   - Enter your email and password
   - You'll be redirected to home page with your avatar showing

3. **Manage Profile:**
   - Click your avatar → "Profile Settings"
   - Update name, email, or password
   - Delete account if needed

### API Endpoints

All user management endpoints are under `/api/users`:

- `POST /api/users/register` - Create new account
- `POST /api/users/login` - Authenticate user
- `POST /api/users/logout` - Clear session
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `DELETE /api/users/me` - Delete account

See `docs/USER_MANAGEMENT.md` for complete API documentation.

---

## �🚀 Production Deployment

### Deploy to Vercel

1. **Set up Supabase** (if using authentication):

   - Create a Supabase project
   - Run the database setup script in SQL Editor
   - Get your Connection Pooler URL

2. **Push code to GitHub**

3. **Import project in [Vercel](https://vercel.com)**

4. **Add environment variables** in project settings:

   ```
   GEMINI_API_KEY=your_key
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_secure_secret
   NODE_ENV=production
   ```

5. **Deploy!**

### Important for Production

- Use **Connection Pooler** URL from Supabase (port 6543, not 5432)
- Generate a strong `JWT_SECRET` (32+ character random string)
- Enable SSL for database connections (already configured)
- Consider Supabase Pro for better performance and no auto-pause

### Build Locally

```bash
npm run build
npm start
```

---

## �📝 Example Prompts

Try these to see the app in action:

- "chicken tikka masala for 4"
- "quick vegetarian pasta under 20 minutes"
- "chocolate lava cake dessert"
- "healthy breakfast smoothie bowl"
- "spicy thai green curry"

### Bilingual Support

The app supports both English and Persian. Click the language toggle button (top-right) to switch between languages.

---

## 🐛 Troubleshooting

### Recipe Generation Issues

**"Invalid JSON response from Gemini"**

- The Gemini model occasionally returns markdown-wrapped JSON
- The API route strips markdown automatically
- If issues persist, try adjusting the temperature or using `gemini-1.5-pro`

**"No response from Gemini"**

- Check your API key is correct
- Ensure you have quota remaining (free tier limits)
- Check the Gemini API status

**Mock mode not working**

- Ensure `GEMINI_API_KEY` is NOT set in `.env.local`
- Restart the dev server

### Database Connection Issues

**"getaddrinfo ENOTFOUND" error**

- You're likely using the Direct Connection URL instead of Connection Pooler
- Get the Connection Pooler URL from Supabase (Settings → Database → Connection pooling)
- Port should be 6543, not 5432
- See `DB_CONNECTION_FIX.md` for detailed troubleshooting

**"Authentication required" errors**

- Make sure `DATABASE_URL` is set correctly in `.env.local`
- Verify `JWT_SECRET` is set
- Check that the database setup script was run successfully
- Restart the dev server after changing environment variables

**Database not connecting**

- Verify your Supabase project is active (free tier pauses after 7 days)
- Check Connection Pooler URL is correct
- Test connection in Supabase SQL Editor
- Ensure firewall isn't blocking PostgreSQL connections

### Authentication Issues

**Can't register/login**

- Verify database is set up correctly (check Supabase Table Editor for `users` table)
- Check browser console for specific error messages
- Ensure password is at least 8 characters
- Try clearing cookies and cache

**Profile not loading**

- Make sure you're logged in
- Check that JWT_SECRET matches between sessions
- Clear cookies and login again

For more help, see the documentation files in the `docs/` folder.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **AI:** Google Gemini 1.5 Flash
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT with HTTP-only cookies
- **Validation:** Zod
- **Password Hashing:** bcrypt
- **Icons:** Lucide React

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Improve documentation

---

## 🙏 Acknowledgments

- Google Gemini for powerful AI recipe generation
- Supabase for reliable PostgreSQL hosting
- Next.js team for an amazing framework
- All open source contributors

---

**Enjoy cooking with AI! 🍳✨**

For questions or issues, contact me: sepantashafizadeh@gmail.com
