"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";

interface AstroResult {
  sign: string;
  ascendant: string;
  cosmicScore: number;
  powers: { name: string; description: string; emoji: string }[];
  traps: { name: string; description: string; emoji: string }[];
  prediction: string;
  compatibleJobs: string[];
  avoidJobs: string[];
}

export default function Home() {
  const { t } = useLanguage();
  const [birthdate, setBirthdate] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AstroResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthdate) return;
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("birthdate", birthdate);
      if (cvFile) formData.append("cv", cvFile);
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const shareText = result
    ? `My AstroPunch reading: I'm a ${result.sign} with ${result.ascendant} ascendant! Cosmic Score: ${result.cosmicScore}/100`
    : "";

  return (
    <>
      <StarField />
      <Header />
      <main className="relative z-10 min-h-screen pt-20">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto px-6 py-16">
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-12">
                <div className="text-6xl mb-6 animate-float">{"\u{1F52E}"}</div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {t("hero.title")} <span className="gradient-text">{t("hero.titleGradient")}</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-lg mx-auto">{t("hero.subtitle")}</p>
              </motion.div>

              <motion.form onSubmit={handleSubmit} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-8 space-y-6 glow-purple">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t("form.birthdate")}</label>
                  <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t("form.cv")}</label>
                  <div onClick={() => fileRef.current?.click()} className="w-full px-4 py-6 rounded-xl bg-white/5 border border-dashed border-white/20 text-center cursor-pointer hover:border-purple-500/50 transition">
                    <input ref={fileRef} type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="hidden" />
                    {cvFile ? <p className="text-purple-400">{t("form.cvUploaded")}: {cvFile.name}</p> : <p className="text-gray-500">{t("form.cvHint")}</p>}
                  </div>
                </div>
                <button type="submit" disabled={loading || !birthdate}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" /></svg>
                      {t("form.analyzing")}
                    </span>
                  ) : t("form.analyze")}
                </button>
              </motion.form>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                {(["f1", "f2", "f3", "f4"] as const).map((f, i) => (
                  <div key={f} className="glass rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">{["\u{2728}", "\u{1F4AB}", "\u{1F680}", "\u{1F3AF}"][i]}</div>
                    <h3 className="font-semibold text-sm mb-1">{t(`features.${f}title`)}</h3>
                    <p className="text-xs text-gray-400">{t(`features.${f}desc`)}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-6 py-16">
              <h2 className="text-3xl font-bold text-center mb-8 gradient-text">{t("result.title")}</h2>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="glass rounded-2xl p-6 text-center">
                  <p className="text-xs text-gray-400 uppercase mb-1">{t("result.sign")}</p>
                  <p className="text-2xl font-bold gradient-text">{result.sign}</p>
                </div>
                <div className="glass rounded-2xl p-6 text-center">
                  <p className="text-xs text-gray-400 uppercase mb-1">{t("result.ascendant")}</p>
                  <p className="text-2xl font-bold text-pink-400">{result.ascendant}</p>
                </div>
                <div className="glass rounded-2xl p-6 text-center">
                  <p className="text-xs text-gray-400 uppercase mb-1">{t("result.cosmicScore")}</p>
                  <p className="text-4xl font-black gradient-text">{result.cosmicScore}<span className="text-lg">/100</span></p>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 mb-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">{"\u{1F4AB}"} {t("result.powers")}</h3>
                <div className="space-y-3">
                  {result.powers.map((p, i) => (
                    <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                      <span className="text-2xl">{p.emoji}</span>
                      <div><p className="font-semibold">{p.name}</p><p className="text-sm text-gray-400">{p.description}</p></div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 mb-4">
                <h3 className="font-bold text-lg mb-4">{"\u{26A0}\u{FE0F}"} {t("result.traps")}</h3>
                <div className="space-y-3">
                  {result.traps.map((tr, i) => (
                    <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                      <span className="text-2xl">{tr.emoji}</span>
                      <div><p className="font-semibold">{tr.name}</p><p className="text-sm text-gray-400">{tr.description}</p></div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 mb-4">
                <h3 className="font-bold text-lg mb-3">{"\u{1F680}"} {t("result.prediction")}</h3>
                <p className="text-gray-300">{result.prediction}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold mb-3 text-green-400">{"\u{2705}"} {t("result.compatibleJobs")}</h3>
                  <ul className="space-y-2">{result.compatibleJobs.map((j, i) => <li key={i} className="text-sm text-gray-300">{j}</li>)}</ul>
                </div>
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold mb-3 text-red-400">{"\u{274C}"} {t("result.avoidJobs")}</h3>
                  <ul className="space-y-2">{result.avoidJobs.map((j, i) => <li key={i} className="text-sm text-gray-300">{j}</li>)}</ul>
                </div>
              </div>

              <div className="glass rounded-2xl p-8 text-center glow-purple mb-8">
                <h3 className="text-xl font-bold mb-2 gradient-text">{t("result.premium")}</h3>
                <p className="text-gray-400 text-sm mb-4">{t("result.premiumDesc")}</p>
                <button className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all cursor-pointer">
                  {t("result.premiumCta")} — {"\u20AC"}{t("result.premiumPrice")}
                </button>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=https://astropunch.pro`} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition">{t("result.shareTwitter")}</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https://astropunch.pro`} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition">{t("result.shareLinkedIn")}</a>
                <button onClick={() => { setResult(null); setBirthdate(""); setCvFile(null); }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition cursor-pointer">{t("result.newReading")}</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Footer />
      </main>
    </>
  );
}
