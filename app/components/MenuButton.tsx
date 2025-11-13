"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, Languages, BookmarkIcon, Info, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSavedRecipes } from "../context/SavedRecipesContext";
import { getCurrentUser } from "@/lib/authClient";
import { MotionButton } from "./MotionPresets";

export default function MenuButton() {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const { savedRecipes } = useSavedRecipes();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle hover for desktop
  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }
  };

  // Handle click for mobile
  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleSavedRecipesClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/saved-recipes");
    }
    setIsOpen(false);
  };

  const handleAboutClick = () => {
    router.push("/about");
    setIsOpen(false);
  };

  const handleLanguageToggle = () => {
    toggleLanguage();
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    {
      icon: <BookmarkIcon size={18} />,
      label:
        language === "en"
          ? `Saved Recipes ${
              savedRecipes.length > 0 ? `(${savedRecipes.length})` : ""
            }`
          : `دستور‌های ذخیره‌شده ${
              savedRecipes.length > 0 ? `(${savedRecipes.length})` : ""
            }`,
      onClick: handleSavedRecipesClick,
      requiresAuth: true,
    },
    {
      icon: <Languages size={18} />,
      label: language === "en" ? `Language: English` : `زبان: فارسی`,
      onClick: handleLanguageToggle,
    },
    {
      icon: <Info size={18} />,
      label: language === "en" ? "About Developer" : "درباره توسعه‌دهنده",
      onClick: handleAboutClick,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MotionButton
        onClick={handleClick}
        className="p-3 cursor-pointer bg-white/80 dark:bg-zinc-800/80 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200/50 dark:border-zinc-700/50 backdrop-blur-sm flex items-center gap-2"
        title={language === "en" ? "Menu" : "منو"}
      >
        <Menu size={18} />
        {!isMobile && <ChevronDown size={14} className="opacity-70" />}
      </MotionButton>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Menu */}
          <div
            className={`absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full px-4 py-3 text-${
                  language === "en" ? "left" : "right"
                } text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-3 transition-colors ${
                  language === "en" ? "" : "flex-row-reverse"
                } ${
                  item.requiresAuth && !isLoggedIn
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.requiresAuth && !isLoggedIn && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {language === "en" ? "Login required" : "نیاز به ورود"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
