"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MotionButton } from "../components/MotionPresets";
import { useLanguage } from "../context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            name: formData.name,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Success! Redirect to home page
      // Dispatch custom event to refresh UserNav
      window.dispatchEvent(new Event("user-login"));
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ email: "", password: "", name: "" });
  };

  const text = {
    en: {
      welcomeBack: "Welcome Back",
      createAccount: "Create Account",
      signInSubtitle: "Sign in to access your recipes",
      signUpSubtitle: "Sign up to start saving recipes",
      fullName: "Full Name",
      emailAddress: "Email Address",
      password: "Password",
      passwordPlaceholder: "At least 8 characters",
      passwordHint: "Must be at least 8 characters long",
      signingIn: "Signing in...",
      creatingAccount: "Creating account...",
      signIn: "Sign In",
      signUp: "Sign up",
      noAccount: "Don't have an account? ",
      hasAccount: "Already have an account? ",
      secureAuth: "Secure authentication with encrypted passwords",
    },
    fa: {
      welcomeBack: "خوش آمدید",
      createAccount: "ایجاد حساب کاربری",
      signInSubtitle: "وارد شوید تا به دستور پخت های خود دسترسی پیدا کنید",
      signUpSubtitle: "ثبت نام کنید تا شروع به ذخیره دستور پخت کنید",
      fullName: "نام کامل",
      emailAddress: "آدرس ایمیل",
      password: "رمز عبور",
      passwordPlaceholder: "حداقل 8 کاراکتر",
      passwordHint: "باید حداقل 8 کاراکتر باشد",
      signingIn: "در حال ورود...",
      creatingAccount: "در حال ایجاد حساب...",
      signIn: "ورود",
      signUp: "ثبت نام",
      noAccount: "حساب کاربری ندارید؟ ",
      hasAccount: "قبلاً حساب کاربری دارید؟ ",
      secureAuth: "احراز هویت امن با رمزهای عبور رمزگذاری شده",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin
                ? text[language].welcomeBack
                : text[language].createAccount}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin
                ? text[language].signInSubtitle
                : text[language].signUpSubtitle}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field (only for registration) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {text[language].fullName}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {text[language].emailAddress}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {text[language].password}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder={
                  isLogin ? "••••••••" : text[language].passwordPlaceholder
                }
              />
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {text[language].passwordHint}
                </p>
              )}
            </div>

            {/* Submit button */}
            <MotionButton
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r cursor-pointer from-primary to-primary-dark text-white py-3 rounded-lg font-semibold hover:from-primary-dark hover:to-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isLogin
                    ? text[language].signingIn
                    : text[language].creatingAccount}
                </span>
              ) : (
                <>
                  {isLogin
                    ? text[language].signIn
                    : text[language].createAccount}
                </>
              )}
            </MotionButton>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? text[language].noAccount : text[language].hasAccount}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary font-semibold hover:text-primary-dark dark:hover:text-primary-light transition-colors"
              >
                {isLogin ? text[language].signUp : text[language].signIn}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
          {text[language].secureAuth}
        </p>
      </motion.div>
    </div>
  );
}
