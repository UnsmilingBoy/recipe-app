"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import UserNav from "./UserNav";
import { MotionButton } from "./MotionPresets";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { toggleLanguage } = useLanguage();

  return (
    <header
      dir="ltr"
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md border-b border-white/20 dark:border-zinc-800/20"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: User Nav */}
        <div className="flex items-center z-50">
          <UserNav />
        </div>

        {/* Center: Logo or Site Name */}
        <Link
          href="/"
          className="flex items-center justify-center fixed inset-0"
        >
          <Image
            src="/logo2.png"
            alt="RecipeApp Logo"
            width={180}
            height={180}
            className="w-40 md:w-[180px]"
          />
        </Link>

        {/* Right: Language Toggle */}
        <div className="flex items-center">
          <MotionButton
            onClick={toggleLanguage}
            className="p-3 cursor-pointer bg-white/80 dark:bg-zinc-800/80 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200/50 dark:border-zinc-700/50 backdrop-blur-sm"
            title="Toggle Language"
          >
            <Languages size={20} />
          </MotionButton>
        </div>
      </div>
    </header>
  );
}
