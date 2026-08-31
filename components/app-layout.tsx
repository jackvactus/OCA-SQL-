"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  GraduationCap,
  Code2,
  Library,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Database,
  Flame,
  Trophy,
  Layers,
  History,
  Route,
  ListOrdered,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";
import { resetProgressStore } from "@/lib/progress-store";
import type { UserRole } from "@/lib/auth/jwt";
import { useLanguage } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { Assistant } from "@/components/assistant/assistant";

function useNavItems() {
  const { t } = useLanguage();
  const navItems = [
    { href: "/tracks", label: t.nav.tracks, icon: Route },
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/curriculum", label: t.nav.curriculum, icon: ListOrdered },
    { href: "/courses", label: t.nav.courses, icon: BookOpen },
    { href: "/quiz", label: t.nav.quiz, icon: Brain },
    { href: "/exam", label: t.nav.exam, icon: GraduationCap },
    { href: "/flashcards", label: t.nav.flashcards, icon: Layers },
    { href: "/sandbox", label: t.nav.sandbox, icon: Code2 },
    { href: "/assistant", label: t.nav.assistant, icon: Sparkles },
    { href: "/reference", label: t.nav.reference, icon: Library },
    { href: "/activity", label: t.nav.activity, icon: History },
  ];
  const adminNavItem = { href: "/admin", label: t.nav.admin, icon: ShieldCheck };
  return { navItems, adminNavItem };
}

export function AppLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { id: string; email: string; role: UserRole };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { navItems, adminNavItem } = useNavItems();
  const { progress, loaded } = useProgress();

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      resetProgressStore();
      router.push("/login");
      router.refresh();
    }
  };

  const level = Math.floor(progress.xp / 500) + 1;
  const xpInLevel = progress.xp % 500;
  const xpPercent = (xpInLevel / 500) * 100;
  const visibleNavItems = user.role === "admin" ? [...navItems, adminNavItem] : navItems;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
              <Image
                src="/oracle-db-icon.svg"
                alt="Application logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">{t.appShell.brand}</h1>
              <p className="text-xs text-muted-foreground">{t.appShell.brandTag}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User progress */}
          {loaded && (
            <div className="border-t border-border p-4">
              <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {t.appShell.level} {level}
                  </span>
                  <span className="text-xs text-muted-foreground">{progress.xp} XP</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-warning" />
                    {progress.streak} {t.appShell.days}
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5 text-primary" />
                    {progress.completedLessons.length} {t.appShell.lessonsShort}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/70 px-4 backdrop-blur lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Link
                href="/search"
                className="w-64 rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-muted-foreground transition-colors hover:border-primary block"
              >
                {t.nav.searchPlaceholder}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
            <div className="ml-1 hidden items-center gap-2 rounded-full border border-border/70 bg-card/70 py-1 pl-1 pr-3 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserCircle2 className="h-4 w-4" />
              </div>
              <span className="max-w-[10rem] truncate text-sm font-medium">{user.email}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              title={t.nav.logout}
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">{children}</main>
      </div>

      {/* Assistant : monté une fois pour tout l'espace connecté, en position
          fixe — il suit l'apprenant d'une page à l'autre sans se remonter. */}
      <Assistant />
    </div>
  );
}
