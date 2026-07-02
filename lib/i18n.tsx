"use client";

// Hệ thống song ngữ VI/EN — mặc định tiếng Việt, lưu lựa chọn vào localStorage.

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "vi" | "en";

const STORAGE_KEY = "vduy-lang";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "vi",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "vi") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

// Nút chuyển ngôn ngữ dạng viên thuốc — nhúng được vào bất kỳ nav/bar nào.
export function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <span className="lngt" role="group" aria-label="Language">
      <button
        className={lang === "vi" ? "on" : ""}
        onClick={() => setLang("vi")}
        aria-pressed={lang === "vi"}
      >
        {compact ? "VI" : "🇻🇳 VI"}
      </button>
      <button
        className={lang === "en" ? "on" : ""}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
      >
        {compact ? "EN" : "🇬🇧 EN"}
      </button>
      <style>{`
        .lngt{display:inline-flex;gap:2px;background:rgba(127,127,127,.15);border-radius:100px;padding:3px;vertical-align:middle;}
        .lngt button{border:none;cursor:pointer;background:transparent;color:inherit;opacity:.6;font:inherit;font-size:11.5px;font-weight:800;letter-spacing:.5px;padding:5px 10px;border-radius:100px;transition:.2s;line-height:1;}
        .lngt button:hover{opacity:.9;}
        .lngt button.on{background:#fff;color:#0f1115;opacity:1;box-shadow:0 1px 6px rgba(0,0,0,.25);}
      `}</style>
    </span>
  );
}
