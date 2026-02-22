"use client";
import { useLanguage } from "@/i18n/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "fr" : "en")}
      className="text-2xl hover:scale-110 transition-transform cursor-pointer"
      aria-label="Toggle language"
    >
      {lang === "en" ? "\u{1F1EB}\u{1F1F7}" : "\u{1F1EC}\u{1F1E7}"}
    </button>
  );
}
