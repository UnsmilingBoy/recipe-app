"use client";

import UserNav from "./UserNav";
import MenuButton from "./MenuButton";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
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
          className="flex items-center justify-center fixed inset-0 pointer-events-none"
        >
          <Image
            src="/logo2.png"
            alt="RecipeApp Logo"
            width={180}
            height={180}
            className="w-40 md:w-[180px] pointer-events-auto"
          />
        </Link>

        {/* Right: Menu Button */}
        <div className="flex items-center z-50">
          <MenuButton />
        </div>
      </div>
    </header>
  );
}
