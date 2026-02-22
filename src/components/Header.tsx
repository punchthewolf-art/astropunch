"use client";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { motion } from "framer-motion";

export default function Header() {
  const { t } = useLanguage();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-black/50 fixed top-0 z-50"
    >
      <a href="/" className="flex items-center gap-2">
        <span className="text-2xl">{"\u{1F52E}"}</span>
        <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {t("header.title")}
        </span>
      </a>
      <LanguageToggle />
    </motion.header>
  );
}
