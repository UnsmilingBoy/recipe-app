"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/lib/authClient";
import { PublicUser } from "@/lib/userSchema";
import { User, LogOut, LogIn } from "lucide-react";
import { MotionButton } from "./MotionPresets";
import { useLanguage } from "../context/LanguageContext";

export default function UserNav() {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadUser();
  }, [pathname]); // Re-check user when route changes

  useEffect(() => {
    // Listen for custom login event
    const handleUserLogin = () => {
      loadUser();
    };

    window.addEventListener("user-login", handleUserLogin);
    return () => window.removeEventListener("user-login", handleUserLogin);
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setShowDropdown(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-gray-400">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <MotionButton
        onClick={() => router.push("/login")}
        className="p-3 cursor-pointer bg-white/80 dark:bg-zinc-800/80 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200/50 dark:border-zinc-700/50 backdrop-blur-sm"
      >
        <LogIn size={18} />
        <span className="hidden sm:inline ml-2 font-medium">
          {language === "en" ? "Sign In" : "ورود"}
        </span>
      </MotionButton>
    );
  }

  const handleProfileButton = () => {
    // On small screens (Tailwind 'sm' breakpoint = 640px) navigate directly to /profile
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 640px)").matches
    ) {
      router.push("/profile");
      return;
    }

    setShowDropdown((s) => !s);
  };

  return (
    <div className="relative">
      <button
        onClick={handleProfileButton}
        className="flex items-center gap-3 md:px-4 md:py-2 cursor-pointer md:bg-white md:dark:bg-zinc-800 md:border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-primary-dark hover:shadow-md transition-all"
      >
        <div className="w-11 h-11 md:w-8 md:h-8 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-2 z-20">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>

            <button
              onClick={() => {
                setShowDropdown(false);
                router.push("/profile");
              }}
              className="w-full px-4 py-2 cursor-pointer text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2 transition-colors"
            >
              <User size={16} />
              <span>
                {language === "en" ? "Profile Settings" : "تنظیمات پروفایل"}
              </span>
            </button>

            <div className="border-t border-gray-100 dark:border-zinc-700 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 cursor-pointer text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                <span>{language === "en" ? "Sign Out" : "خروج"}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
