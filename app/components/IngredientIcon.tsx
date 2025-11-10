"use client";

import { motion } from "framer-motion";

interface IngredientIconProps {
  icon?: string;
}

const iconMap: Record<string, string> = {
  pasta: "🍝",
  garlic: "🧄",
  oil: "🫒",
  cheese: "🧀",
  salt: "🧂",
  pepper: "🌶️",
  tomato: "🍅",
  onion: "🧅",
  carrot: "🥕",
  potato: "🥔",
  chicken: "🍗",
  beef: "🥩",
  fish: "🐟",
  egg: "🥚",
  milk: "🥛",
  butter: "🧈",
  flour: "🌾",
  sugar: "🍬",
  water: "💧",
  lemon: "🍋",
  herbs: "🌿",
  spices: "✨",
  rice: "🍚",
  bread: "🍞",
  avocado: "🥑",
  mushroom: "🍄",
  broccoli: "🥦",
  corn: "🌽",
  peas: "🫛",
  beans: "🫘",
  nuts: "🥜",
  honey: "🍯",
  chocolate: "🍫",
  vanilla: "🌼",
  cinnamon: "🟤",
  ginger: "🫚",
  coconut: "🥥",
  pineapple: "🍍",
  strawberry: "🍓",
  apple: "🍎",
  banana: "🍌",
  orange: "🍊",
  grapes: "🍇",
  melon: "🍉",
  peach: "🍑",
  cherry: "🍒",
  blueberry: "🫐",
  mango: "🥭",
  kiwi: "🥝",
  lime: "🍈",
  pear: "🍐",
  plum: "🪴",
  wine: "🍷",
  beer: "🍺",
  coffee: "☕",
  tea: "🍵",
};

export default function IngredientIcon({ icon }: IngredientIconProps) {
  const emoji = icon ? iconMap[icon.toLowerCase()] || "🍴" : "🍴";

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="w-12 h-12 flex items-center justify-center text-3xl bg-gray-50 rounded-lg dark:bg-zinc-700"
    >
      {emoji}
    </motion.div>
  );
}
