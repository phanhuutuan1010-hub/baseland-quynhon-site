"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "vi" | "en";

export type Localized<T = string> = { vi: T; en: T };

const STORAGE_KEY = "bl-lang";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Pick the value for the active language out of a { vi, en } pair. */
  pick: <T>(field: Localized<T>) => T;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "vi" || stored === "en") setLangState(stored);
    } catch {
      // localStorage unavailable — fall back to default 'vi'
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore write failures (private browsing, etc.)
    }
  }, []);

  const pick = useCallback(
    <T,>(field: Localized<T>) => (lang === "en" ? field.en : field.vi),
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, pick }), [lang, setLang, pick]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
