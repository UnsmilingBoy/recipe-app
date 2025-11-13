import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { SavedRecipesProvider } from "./context/SavedRecipesContext";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shaam Chie? - Your Recipe Assistant",
  description: "Ai Powered Recipe Assistant to find the perfect recipe for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} antialiased`}
      >
        <LanguageProvider>
          <SavedRecipesProvider>
            <Header />
            {children}
          </SavedRecipesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
