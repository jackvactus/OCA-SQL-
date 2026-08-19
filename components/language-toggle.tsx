"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
      aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
      title={locale === "fr" ? "Switch to English" : "Passer en français"}
    >
      <span className="text-xs font-bold">{locale === "fr" ? "FR" : "EN"}</span>
    </Button>
  );
}
