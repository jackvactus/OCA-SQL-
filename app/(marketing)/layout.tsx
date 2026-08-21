import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const t = dictionary[getLocale()];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-card/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
              <Image
                src="/oracle-db-icon.svg"
                alt="OracleMaster"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
            </div>
            <span className="text-lg font-bold leading-none">{t.appShell.brand}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <Link href="/login">
              <Button variant="ghost">{t.marketing.login}</Button>
            </Link>
            <Link href="/register">
              <Button>{t.marketing.register}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/70 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground lg:px-8">
          {t.marketing.footer}
        </div>
      </footer>
    </div>
  );
}
