# Login & Profile Pages - Quick Guide

## 🎉 What's Been Added

Three new pages have been created for user authentication and profile management:

### 1. **Login Page** (`/login`)

- Beautiful login/register form with toggle
- Email and password authentication
- Name field for registration
- Form validation
- Error handling
- Loading states
- Automatic redirect after login

### 2. **Profile Page** (`/profile`)

- View current user information
- Update name and email
- Change password
- Delete account (with confirmation)
- Protected route (requires login)

### 3. **User Navigation Component** (`<UserNav />`)

- Shows "Sign In" button when logged out
- Shows user avatar and dropdown when logged in
- Quick access to profile
- Logout functionality
- Can be added to any page

---

## 🚀 How to Use

### Adding User Navigation to Your Pages

Import and add `<UserNav />` to any page where you want to show login status:

```tsx
import UserNav from "./components/UserNav";

export default function YourPage() {
  return (
    <div>
      {/* Header with user navigation */}
      <header className="flex justify-between items-center p-4">
        <h1>Your App Name</h1>
        <UserNav />
      </header>

      {/* Rest of your content */}
    </div>
  );
}
```

### Example: Update Your Home Page

Open `app/page.tsx` and add the navigation:

```tsx
import UserNav from "./components/UserNav";

export default function Home() {
  return (
    <div>
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-orange-600">Recipe App</h1>
        <UserNav />
      </nav>

      {/* Your existing content */}
    </div>
  );
}
```

---

## 📍 Routes Available

- **`/login`** - Login and registration page
- **`/profile`** - User profile management (requires authentication)
- **`/`** - Home page (add `<UserNav />` here)

---

## 🎨 Features

### Login Page Features

✅ Toggle between login and register
✅ Email validation
✅ Password strength (min 8 characters)
✅ Real-time error messages
✅ Loading states with spinner
✅ Beautiful animations
✅ Responsive design

### Profile Page Features

✅ View user information
✅ Update name and email
✅ Change password securely
✅ Delete account with confirmation
✅ Success/error notifications
✅ Protected route (auto-redirect to login)

### User Navigation Features

✅ Shows login state
✅ User avatar with initial
✅ Dropdown menu
✅ Profile link
✅ Logout button
✅ Responsive (hides details on mobile)

---

## 🧪 Testing the Login System

1. **Start your dev server:**

   ```powershell
   npm run dev
   ```

2. **Navigate to login page:**

   - Go to `http://localhost:3000/login`

3. **Create an account:**

   - Enter your name, email, and password
   - Click "Create Account"
   - You'll be redirected to the home page

4. **Check your profile:**

   - Navigate to `http://localhost:3000/profile`
   - Update your information
   - Try changing your password

5. **Verify in Supabase:**
   - Go to Supabase dashboard → Table Editor → users
   - You should see your new user!

---

## 🔧 Client-Side Auth Utilities

Use these helper functions in your components (`lib/authClient.ts`):

```typescript
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  deleteAccount,
} from "@/lib/authClient";

// Login
const user = await loginUser("email@example.com", "password123");

// Register
const newUser = await registerUser(
  "email@example.com",
  "password123",
  "John Doe"
);

// Get current user
const currentUser = await getCurrentUser(); // Returns null if not logged in

// Update profile
const updated = await updateUser({ name: "New Name" });

// Logout
await logoutUser();

// Delete account
await deleteAccount();
```

---

## 🎯 Protecting Pages

To make a page require authentication:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/authClient";

export default function ProtectedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Protected content!</div>;
}
```

---

## 🎨 Customization

### Changing Colors

The login pages use Tailwind CSS with an orange/amber theme. To change colors:

1. Find classes like `from-orange-500 to-amber-500`
2. Replace with your preferred colors (e.g., `from-blue-500 to-indigo-500`)

### Styling the User Navigation

Edit `app/components/UserNav.tsx` to customize:

- Avatar styles
- Dropdown menu
- Button colors
- Animations

---

## 📚 Documentation

- **API Routes**: See `docs/USER_MANAGEMENT.md`
- **Supabase Setup**: See `docs/SUPABASE_SETUP.md`
- **Quick Reference**: See `docs/SUPABASE_QUICK_REFERENCE.md`

---

## ✅ Next Steps

1. ✅ Add `<UserNav />` to your home page
2. ✅ Test the login flow
3. ✅ Customize colors and styles
4. ✅ Protect routes that need authentication
5. ✅ Build your recipe features with user context!

---

## 🆘 Troubleshooting

**"Authentication required" errors?**

- Make sure you ran the database setup script
- Check that DATABASE_URL is set in `.env.local`
- Verify JWT_SECRET is set

**Can't login after registration?**

- Check browser console for errors
- Verify the user was created in Supabase Table Editor
- Clear cookies and try again

**Profile page redirects to login?**

- You need to login first at `/login`
- Cookies might have expired (7 day default)

---

Enjoy your new authentication system! 🎉
