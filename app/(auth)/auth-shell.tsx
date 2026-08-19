"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft, BarChart3, Code2, Layers, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Layers,
    title: "18 modules structurés",
    description: "Programme complet couvrant l'intégralité du référentiel 1Z0-071.",
  },
  {
    icon: BarChart3,
    title: "Suivi & conformité",
    description: "Progression, XP et examens blancs suivis en continu, par utilisateur.",
  },
  {
    icon: Code2,
    title: "Pilotage en temps réel",
    description: "Tableau de bord, historique d'activité et sandbox SQL interactif.",
  },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — dark hero panel */}
      <div className="relative hidden overflow-hidden bg-[#0a1418] lg:block">
        <Image
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04090b]/90 via-[#0a1418]/50 to-[#04090b]/90" />
        <div className="bg-grid absolute inset-0 opacity-10" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-sm backdrop-blur">
              <Image
                src="/oracle-db-icon.svg"
                alt="OracleMaster"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
            </div>
            <span className="text-lg font-bold uppercase tracking-wide text-white">OracleMaster</span>
          </Link>

          <div className="max-w-lg">
            <h1 className="font-display text-4xl font-bold leading-[1.15] text-white xl:text-5xl">
              La plateforme de référence pour la certification{" "}
              <span className="text-primary">Oracle Database SQL</span>
            </h1>
            <p className="mt-5 text-lg text-white/60">
              Pilotez votre préparation de bout en bout — cours, quiz, examens blancs et sandbox SQL,
              avec chaque action suivie dans votre espace personnel.
            </p>

            <div className="mt-8 space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-primary">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{feature.title}</p>
                    <p className="text-sm text-white/50">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Certification Oracle · SQL 1Z0-071
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col bg-background">
        <div className="flex items-center justify-between p-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Basculer le thème"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-10">{children}</div>
      </div>
    </div>
  );
}
