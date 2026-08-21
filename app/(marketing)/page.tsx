import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Clock,
  Cloud,
  Code2,
  Database,
  GraduationCap,
  History,
  Layers,
  Library,
  Radar,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/modules-data";
import { quizQuestions } from "@/lib/quiz-data";
import { workbookQuizQuestions } from "@/lib/quiz-data-en-workbook";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary, type Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locale";
import { LiveStats } from "./live-stats";
import { DifficultyChart } from "./difficulty-chart";
import { SandboxPreview } from "./sandbox-preview";

// Mirrors the constants in app/(app)/exam/page.tsx — kept in sync manually
// since that file doesn't export them.
const EXAM_PASS_THRESHOLD = 63;
const EXAM_DURATION_MINUTES = 120;

function buildHeroStats(t: Dictionary, questionCount: number) {
  return [
    { icon: Layers, value: `${modules.length}`, label: t.marketing.statModules },
    { icon: Brain, value: `${questionCount}+`, label: t.marketing.statQuestions },
    { icon: Target, value: `${EXAM_PASS_THRESHOLD}%`, label: t.marketing.statPassThreshold },
    { icon: Clock, value: `${EXAM_DURATION_MINUTES} min`, label: t.marketing.statExamDuration },
  ];
}

function buildChips(t: Dictionary) {
  return [
    { icon: ShieldCheck, label: t.marketing.chip1 },
    { icon: Radar, label: t.marketing.chip2 },
    { icon: Code2, label: t.marketing.chip3 },
    { icon: History, label: t.marketing.chip4 },
  ];
}

function buildFeatures(t: Dictionary, locale: Locale, questionCount: number) {
  return [
    {
      icon: BookOpen,
      title: t.marketing.feature1Title,
      description:
        locale === "fr"
          ? `${modules.length} modules progressifs couvrant l'intégralité du programme 1Z0-071, avec exemples et pièges classiques.`
          : `${modules.length} progressive modules covering the entire 1Z0-071 syllabus, with examples and classic traps.`,
    },
    {
      icon: Brain,
      title: t.marketing.feature2Title,
      description:
        locale === "fr"
          ? `${questionCount}+ questions corrigées et expliquées pour ancrer chaque notion durablement.`
          : `${questionCount}+ reviewed, explained questions to lock in every concept for the long run.`,
    },
    {
      icon: GraduationCap,
      title: t.marketing.feature3Title,
      description:
        locale === "fr"
          ? `Conditions réelles : ${EXAM_DURATION_MINUTES} minutes, ${EXAM_PASS_THRESHOLD}% pour réussir, score détaillé par domaine.`
          : `Real conditions: ${EXAM_DURATION_MINUTES} minutes, ${EXAM_PASS_THRESHOLD}% to pass, a detailed score by domain.`,
    },
    { icon: Layers, title: t.marketing.feature4Title, description: t.marketing.feature4Desc },
    { icon: Code2, title: t.marketing.feature5Title, description: t.marketing.feature5Desc },
    { icon: Library, title: t.marketing.feature6Title, description: t.marketing.feature6Desc },
  ];
}

export default function LandingPage() {
  const locale = getLocale();
  const t = dictionary[locale];
  const questionBank = locale === "en" ? workbookQuizQuestions : quizQuestions;
  const heroStats = buildHeroStats(t, questionBank.length);
  const chips = buildChips(t);
  const features = buildFeatures(t, locale, questionBank.length);

  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
  for (const q of questionBank) difficultyCounts[q.difficulty] += 1;
  const difficultyData = [
    { label: t.marketing.difficultyEasy, count: difficultyCounts.easy },
    { label: t.marketing.difficultyMedium, count: difficultyCounts.medium },
    { label: t.marketing.difficultyHard, count: difficultyCounts.hard },
  ];

  return (
    <div className="space-y-20 pb-20 lg:space-y-28">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-slate-50 dark:bg-[#04090b]">
        <Image
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1920&auto=format&fit=crop"
          alt="Oracle Database server infrastructure"
          fill
          priority
          className="object-cover opacity-25 dark:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/95 via-slate-50/85 to-background dark:from-[#04090b]/80 dark:via-[#04090b]/55 dark:to-background" />
        <div className="bg-grid absolute inset-0 opacity-40 dark:opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="gap-1.5 border-primary/20 bg-background/80 text-foreground backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white">
              <Database className="h-3 w-3 text-primary" />
              {t.marketing.heroBadge}
            </Badge>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-foreground lg:text-6xl dark:text-white">
              {t.marketing.heroTitle1} <span className="text-primary">{t.marketing.heroTitleHighlight}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground dark:text-white/60">{t.marketing.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  {t.marketing.heroCtaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  {t.marketing.heroCtaSecondary}
                </Button>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/70 bg-background/75 p-4 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <stat.icon className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-2xl font-bold text-foreground dark:text-white">{stat.value}</p>
                <p className="text-xs text-muted-foreground dark:text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oracle Database visual gallery */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-7 max-w-2xl">
          <Badge variant="secondary" className="gap-1.5">
            <Database className="h-3 w-3 text-primary" />
            Oracle Database
          </Badge>
          <h2 className="mt-4 text-2xl font-bold lg:text-3xl">{t.marketing.visualTitle}</h2>
          <p className="mt-3 text-muted-foreground">{t.marketing.visualDesc}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop"
              alt="Oracle Database data center servers"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <Image src="/oracle-logo.svg" alt="Oracle" width={150} height={40} className="absolute bottom-5 left-5 h-auto w-28 opacity-95" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <div className="relative min-h-[124px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1560732488-6b0df240254a?q=80&w=900&auto=format&fit=crop"
                alt="Database monitoring screens"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/35" />
              <Image src="/oracle-db-icon.svg" alt="Oracle Database" width={56} height={56} className="absolute bottom-4 left-4 h-12 w-12 rounded-xl" />
            </div>
            <div className="relative min-h-[124px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop"
                alt="SQL and database technology"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-sky-950/35" />
              <span className="absolute bottom-4 left-4 rounded-lg border border-white/20 bg-slate-950/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">SQL / Data / Cloud</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live preview */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="gap-1.5">
              <Radar className="h-3 w-3 text-primary" />
              {t.marketing.liveSectionBadge}
            </Badge>
            <h2 className="mt-4 text-2xl font-bold lg:text-3xl">{t.marketing.liveSectionTitle}</h2>
            <p className="mt-3 text-muted-foreground">{t.marketing.liveSectionDesc}</p>
            <div className="relative mt-6 h-40 overflow-hidden rounded-xl border border-border/70">
              <Image
                src="https://images.unsplash.com/photo-1554306274-f23873d9a26c?q=80&w=1200&auto=format&fit=crop"
                alt="Oracle Database operations room"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04090b]/80 via-[#04090b]/10 to-transparent" />
              <p className="absolute bottom-3 left-4 text-sm font-medium text-white/90">
                {t.marketing.imageCaption}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {chips.map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 p-3 text-sm"
                >
                  <chip.icon className="h-4 w-4 shrink-0 text-primary" />
                  {chip.label}
                </div>
              ))}
            </div>
          </div>
          <LiveStats t={t} />
        </div>
      </section>

      {/* Modules grid */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold lg:text-3xl">{t.marketing.modulesTitle}</h2>
          <p className="mt-2 text-muted-foreground">{t.marketing.modulesSubtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="animate-fade-in">
              <CardContent className="p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SQL Sandbox preview */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="gap-1.5">
              <Code2 className="h-3 w-3 text-primary" />
              {t.marketing.sandboxBadge}
            </Badge>
            <h2 className="mt-4 text-2xl font-bold lg:text-3xl">{t.marketing.sandboxTitle}</h2>
            <p className="mt-3 text-muted-foreground">{t.marketing.sandboxDesc}</p>
          </div>
          <SandboxPreview t={t} />
        </div>
      </section>

      {/* Visualization showcase */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">{t.marketing.vizCardTitle}</h3>
                  <Badge variant="outline">
                    {questionBank.length} {t.marketing.vizQuestionsCount}
                  </Badge>
                </div>
                <DifficultyChart data={difficultyData} />
              </CardContent>
            </Card>
          </div>
          <div className="order-1 lg:order-2">
            <Badge variant="secondary" className="gap-1.5">
              <Brain className="h-3 w-3 text-primary" />
              {t.marketing.vizBadge}
            </Badge>
            <h2 className="mt-4 text-2xl font-bold lg:text-3xl">{t.marketing.vizTitle}</h2>
            <p className="mt-3 text-muted-foreground">{t.marketing.vizDesc}</p>
          </div>
        </div>
      </section>

      {/* Oracle certification paths */}
      <section className="relative overflow-hidden bg-slate-100 py-16 dark:bg-[#04090b] lg:py-20">
        <Image
          src="/oracle-logo.svg"
          alt=""
          width={220}
          height={58}
          className="absolute right-8 top-8 w-44 opacity-10 lg:right-16 lg:top-12 lg:w-56"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-100/95 to-slate-100 dark:from-[#04090b] dark:via-[#04090b]/95 dark:to-[#04090b]" />
        <div className="bg-grid absolute inset-0 opacity-40 dark:opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="gap-1.5 border-primary/20 bg-background/80 text-foreground backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white">
              <Award className="h-3 w-3 text-primary" />
              {t.marketing.certificationBadge}
            </Badge>
            <h2 className="mt-4 text-2xl font-bold text-foreground lg:text-3xl dark:text-white">{t.marketing.certificationTitle}</h2>
            <p className="mt-3 text-muted-foreground dark:text-white/60">{t.marketing.certificationDesc}</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: Database, title: t.marketing.certificationSqlTitle, description: t.marketing.certificationSqlDesc, active: true },
              { icon: GraduationCap, title: t.marketing.certificationJavaTitle, description: t.marketing.certificationJavaDesc, active: false },
              { icon: Cloud, title: t.marketing.certificationOciTitle, description: t.marketing.certificationOciDesc, active: false },
            ].map((path) => (
              <div
                key={path.title}
                  className={`flex flex-col gap-3 rounded-xl border p-5 backdrop-blur ${path.active ? "border-primary/60 bg-primary/10" : "border-border/70 bg-background/70 dark:border-white/10 dark:bg-white/5"}`}
              >
                <path.icon className="h-6 w-6 text-primary" />
                <p className="font-semibold text-foreground dark:text-white">{path.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground dark:text-white/60">{path.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#04090b] p-8 text-center lg:p-14">
          <Image
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#04090b]/85 via-[#04090b]/45 to-[#04090b]/85" />
          <div className="relative">
            <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 text-2xl font-bold text-white lg:text-3xl">{t.marketing.ctaTitle}</h2>
            <p className="mx-auto mt-2 max-w-xl text-white/60">{t.marketing.ctaDesc}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  {t.marketing.ctaButton}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
