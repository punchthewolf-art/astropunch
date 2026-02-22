"use client";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const links = [
    { name: "RoastMyResume", url: "https://roastmyresume.pro" },
    { name: "CopyPunch", url: "https://copypunch.pro" },
    { name: "SkillPunch", url: "https://skillpunch.pro" },
    { name: "GraphoPunch", url: "https://graphopunch.pro" },
  ];
  return (
    <footer className="w-full px-6 py-8 border-t border-white/10 mt-20">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <p className="text-sm text-gray-400">{t("footer.alsoTry")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((l) => (
            <a
              key={l.name}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-pink-400 transition-colors"
            >
              {l.name}
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-500">{t("footer.madeWith")}</p>
        <p className="text-xs text-gray-600">{t("footer.legal")}</p>
      </div>
    </footer>
  );
}
