"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { dictionary, type Dictionary } from "@/lib/i18n/dictionary";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

interface LanguageContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  locale: initialLocale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    // One year, readable by both client (for this toggle) and server
    // (getLocale() in server components) — same cookie, no API route.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    setLocaleState(next);
    // A full reload, not router.refresh(): every page on this site reads the
    // locale server-side via cookies() in several independent layouts/pages
    // (marketing layout, marketing page, app layout...). router.refresh()
    // only re-renders the current route's server tree and was unreliable
    // here — some sections kept the old language until a manual reload.
    // Reloading guarantees every server-rendered string reflects the new
    // cookie immediately.
    window.location.reload();
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, t: dictionary[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
