"use client";

import { useLanguage } from "../context/LanguageContext";
import { MotionContainer } from "../components/MotionPresets";
import { Github, Globe, Code2, Heart, Mail } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div
      className="min-h-screen pt-24 pb-12 px-4"
      dir={language === "en" ? "ltr" : "rtl"}
    >
      <MotionContainer>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {language === "en" ? "About Developer" : "درباره توسعه‌دهنده"}
            </h1>
            <div className="flex flex-col gap-2">
              <Image
                src={"/developer.jpg"}
                width={200}
                height={200}
                alt="Developer"
                className="mx-auto rounded-full w-40 sm:w-[200px]"
              />
              <p className="text-2xl">UnsmilingBoy</p>
            </div>
          </div>

          {/* About the Project */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-4">
              <Code2 size={28} className="text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === "en" ? "About This Project" : "درباره این پروژه"}
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {language === "en"
                ? "ShamChie is an AI-powered recipe generator that helps you discover and create delicious recipes based on the ingredients you have. Built with Next.js 15, and integrated with Google's Gemini AI, this application provides a seamless and modern cooking experience."
                : "شام چیه یک برنامه تولید دستور پخت مبتنی بر هوش مصنوعی است که به شما کمک می‌کند دستورهای خوشمزه را بر اساس مواد موجود کشف و ایجاد کنید. این برنامه با Next.js 15 و Gemini AI گوگل ساخته شده است."}
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                {language === "en"
                  ? "AI-powered recipe generation with Google Gemini"
                  : "تولید دستور پخت با هوش مصنوعی"}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                {language === "en"
                  ? "Bilingual support (English & Persian)"
                  : "پشتیبانی از دو زبان (انگلیسی و فارسی)"}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                {language === "en"
                  ? "User authentication with Google OAuth"
                  : "احراز هویت کاربر با Google OAuth"}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                {language === "en"
                  ? "Save and manage your favorite recipes"
                  : "ذخیره و مدیریت دستورهای مورد علاقه"}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                {language === "en"
                  ? "Beautiful animations with Framer Motion"
                  : "انیمیشن‌های زیبا با Framer Motion"}
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {language === "en" ? "Tech Stack" : "تکنولوژی‌های استفاده شده"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Next.js 15",
                "TypeScript",
                "Tailwind CSS",
                "PostgreSQL",
                "Framer Motion",
                "Google Gemini AI",
                "JWT Auth",
              ].map((tech, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gray-100 dark:bg-zinc-700 rounded-lg text-center font-medium text-gray-800 dark:text-gray-200"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Links */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
              {language === "en" ? "Connect With Me" : "ارتباط با من"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-zinc-700 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors">
                <Mail size={24} className="text-gray-700 dark:text-gray-300" />
                <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                  sepantashafizadeh@gmail.com
                </span>
              </div>
              <a
                href="https://github.com/UnsmilingBoy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-zinc-700 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              >
                <Github
                  size={24}
                  className="text-gray-700 dark:text-gray-300"
                />
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  GitHub
                </span>
              </a>
              <a
                href="https://sham-chie.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-zinc-700 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              >
                <Globe size={24} className="text-gray-700 dark:text-gray-300" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {language === "en" ? "Live Demo" : "نسخه آنلاین"}
                </span>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
            <p className="flex items-center justify-center gap-2">
              {language === "en" ? "Made with" : "ساخته شده با"}{" "}
              <Heart size={16} className="text-red-500 fill-red-500" />{" "}
              {language === "en" ? "by" : "توسط"}{" "}
              <span className="font-semibold text-primary">UnsmilingBoy</span>
            </p>
          </div>
        </div>
      </MotionContainer>
    </div>
  );
}
