import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Clock,
  Cloud,
  Code2,
  Database,
  Gauge,
  GraduationCap,
  History,
  Layers,
  Library,
  Radar,
  Server,
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
import { getLocalizedModules } from "@/lib/content-i18n";

// Mirrors the constants in app/(app)/exam/page.tsx — kept in sync manually
// since that file doesn't export them.
const EXAM_PASS_THRESHOLD = 63;
const EXAM_DURATION_MINUTES = 120;
const EXAM_FULL_QUESTIONS = 63;

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
  const localizedModules = getLocalizedModules(locale);
  const heroStats = buildHeroStats(t, questionBank.length);
  const chips = buildChips(t);
  const features = buildFeatures(t, locale, questionBank.length);

  // Barres du panneau héros : nombre réel de questions par module, normalisé
  // sur le module le mieux couvert. Aucune valeur n’est inventée.
  const perModule = localizedModules.map(
    (module) => questionBank.filter((question) => question.moduleId === module.id).length,
  );
  const maxPerModule = Math.max(1, ...perModule);
  const totalLessons = localizedModules.reduce((sum, module) => sum + module.lessons.length, 0);
  const multiAnswerShare = Math.round(
    (questionBank.filter((question) => question.correctIndexes.length > 1).length / questionBank.length) * 100,
  );
  const coverageBars = perModule.map((count) => Math.round((count / maxPerModule) * 100));

  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
  for (const q of questionBank) difficultyCounts[q.difficulty] += 1;
  const difficultyData = [
    { label: t.marketing.difficultyEasy, count: difficultyCounts.easy },
    { label: t.marketing.difficultyMedium, count: difficultyCounts.medium },
    { label: t.marketing.difficultyHard, count: difficultyCounts.hard },
  ];

  return (
    <div className="space-y-24 pb-24 lg:space-y-32">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-slate-100 dark:bg-[#04090b]">
        <Image
          src="/art/oracle-datacenter.svg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25 dark:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/95 via-slate-50/85 to-background dark:from-[#04090b]/80 dark:via-[#04090b]/55 dark:to-background" />
        <div className="bg-grid absolute inset-0 opacity-40 dark:opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="space-y-10">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] px-3 py-5 text-center lg:px-8 lg:py-8">
            <Image
              src="/art/oracle-sql.svg"
              alt=""
              fill
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-30 dark:opacity-45"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-100/92 via-slate-100/78 to-slate-100/48 dark:from-slate-950/85 dark:via-slate-950/60 dark:to-slate-950/45" />
            <Image
              src="/oracle-db-icon.svg"
              alt=""
              width={360}
              height={360}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] mix-blend-multiply dark:opacity-20 dark:mix-blend-screen"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50/20 via-slate-50/60 to-slate-50/20 dark:from-slate-950/10 dark:via-slate-950/35 dark:to-slate-950/10" />
            <div className="relative z-10">
            <Badge variant="secondary" className="gap-1.5 border-primary/20 bg-background/80 text-foreground backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white">
              <Database className="h-3 w-3 text-primary" />
              {t.marketing.heroBadge}
            </Badge>
            <h1 className="mx-auto mt-5 max-w-5xl font-display text-5xl font-bold leading-[1.04] text-foreground lg:text-7xl dark:text-white">
              {t.marketing.heroTitle1} <span className="text-primary">{t.marketing.heroTitleHighlight}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground dark:text-white/60">{t.marketing.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  {t.marketing.heroCtaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-border bg-background/70 text-foreground hover:bg-background dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:text-white">
                  {t.marketing.heroCtaSecondary}
                </Button>
              </Link>
            </div>
            </div>
          </div>

          <div className="relative mx-auto min-h-[300px] w-full max-w-5xl lg:-translate-y-2 lg:min-h-[390px]">
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/70 shadow-2xl shadow-sky-950/30 backdrop-blur">
              <Image
                src="/art/oracle-datacenter.svg"
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 1024px) 100vw, 64rem"
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-sky-950/70 via-slate-950/50 to-slate-950/90" />
              <div className="relative flex h-full flex-col justify-between gap-4 p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    {locale === "en" ? "1Z0-071 exam simulator" : "Simulateur d’examen 1Z0-071"}
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-white/70">
                    {locale === "en" ? "Real exam format" : "Format réel"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: `${EXAM_FULL_QUESTIONS}`, label: locale === "en" ? "Questions per session" : "Questions par session", tone: "text-white" },
                    { value: `${EXAM_DURATION_MINUTES} min`, label: locale === "en" ? "Timed duration" : "Durée chronométrée", tone: "text-sky-300" },
                    { value: `${EXAM_PASS_THRESHOLD}%`, label: locale === "en" ? "Pass threshold" : "Seuil de réussite", tone: "text-emerald-300" },
                    { value: `${questionBank.length}`, label: locale === "en" ? "Questions available" : "Questions disponibles", tone: "text-amber-300" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                      <p className={`text-xl font-bold tabular-nums ${item.tone}`}>{item.value}</p>
                      <p className="mt-1 text-xs text-white/60">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <div className="mb-2 flex items-center justify-between text-xs text-white/60">
                    <span>{locale === "en" ? "Questions per module" : "Questions par module"}</span>
                    <span className="text-sky-300">{localizedModules.length} {locale === "en" ? "modules" : "modules"}</span>
                  </div>
                  <div className="flex h-10 items-end gap-1.5" role="img" aria-label={locale === "en" ? "Distribution of questions across modules" : "Répartition des questions par module"}>
                    {coverageBars.map((height, index) => (
                      <span
                        key={index}
                        className="flex-1 rounded-t bg-gradient-to-t from-sky-500 to-emerald-300"
                        style={{ height: `${Math.max(height, 8)}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-xl border border-border bg-background p-3 shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white"><Database className="h-5 w-5" /></div>
              <div><p className="text-xs text-muted-foreground">{locale === "en" ? "Powered by" : "Propulsé par"}</p><p className="font-semibold">Oracle Database</p></div>
            </div>
          </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {heroStats.map((stat, index) => (
              <div
                key={stat.label}
                className="animate-slide-up rounded-xl border border-border/70 bg-background/80 p-4 text-center shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <stat.icon className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-2xl font-bold text-foreground dark:text-white">{stat.value}</p>
                <p className="text-xs text-muted-foreground dark:text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operations snapshot */}
      <section id="platform" className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BarChart3, value: `${questionBank.length}`, label: locale === "en" ? "Exam-style questions" : "Questions de type examen", tone: "text-sky-500" },
            { icon: Server, value: `${localizedModules.length}`, label: locale === "en" ? "Oracle SQL modules" : "Modules Oracle SQL", tone: "text-amber-500" },
            { icon: Layers, value: `${totalLessons}`, label: locale === "en" ? "Structured lessons" : "Leçons structurées", tone: "text-emerald-500" },
            { icon: Gauge, value: `${multiAnswerShare}%`, label: locale === "en" ? "Multi-answer questions" : "Questions à réponses multiples", tone: "text-red-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
              <item.icon className={`h-7 w-7 ${item.tone}`} />
              <div><p className="text-2xl font-bold tracking-tight">{item.value}</p><p className="text-xs text-muted-foreground">{item.label}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Oracle Database visual gallery */}
      <section id="syllabus" className="mx-auto max-w-7xl px-4 lg:px-8">
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
              src="/art/oracle-datacenter.svg"
              alt={locale === "en" ? "Oracle Database infrastructure" : "Infrastructure Oracle Database"}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <Image src="/oracle-logo.svg" alt="" aria-hidden="true" width={150} height={40} className="absolute bottom-5 left-5 h-auto w-28 opacity-95" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <div className="relative min-h-[124px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
              <Image
                src="/art/oracle-sql.svg"
                alt={locale === "en" ? "Oracle SQL editor and result set" : "Éditeur SQL Oracle et jeu de résultats"}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/35" />
              <Image src="/oracle-db-icon.svg" alt="" aria-hidden="true" width={56} height={56} className="absolute bottom-4 left-4 h-12 w-12 rounded-xl" />
            </div>
            <div className="relative min-h-[124px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
              <Image
                src="/art/oracle-cloud.svg"
                alt={locale === "en" ? "Oracle Cloud Infrastructure topology" : "Topologie Oracle Cloud Infrastructure"}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-sky-950/35" />
              <span className="absolute bottom-4 left-4 rounded-lg border border-white/20 bg-slate-950/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">SQL / Data / Cloud</span>
            </div>
          </div>
        </div>
      </section>

      {/* Oracle technology gallery */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary" className="gap-1.5">
              <Server className="h-3 w-3 text-primary" />
              Oracle technology
            </Badge>
            <h2 className="mt-4 text-2xl font-bold lg:text-3xl">
              {locale === "en" ? "See the world behind the queries" : "Découvrez l'univers derrière vos requêtes"}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {locale === "en"
                ? "From data center infrastructure to SQL development, connect every concept to production technology."
                : "De l'infrastructure des data centers au développement SQL, reliez chaque notion aux technologies de production."}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              src: "/art/oracle-database.svg",
              alt: locale === "en" ? "Oracle Database logo and server illustration" : "Logo Oracle Database et illustration serveur",
              label: locale === "en" ? "Oracle Database" : "Oracle Database",
              icon: Server,
            },
            {
              src: "/oracle-db-icon.svg",
              alt: locale === "en" ? "Oracle Database 19c technology icon" : "Icône technologie Oracle Database 19c",
              label: locale === "en" ? "Oracle Database 19c" : "Oracle Database 19c",
              icon: Code2,
            },
            {
              src: "/art/oracle-cloud.svg",
              alt: locale === "en" ? "Cloud infrastructure and data network" : "Infrastructure cloud et réseau de données",
              label: locale === "en" ? "Oracle Cloud Infrastructure" : "Oracle Cloud Infrastructure",
              icon: Cloud,
            },
          ].map((visual, index) => (
            <div
              key={visual.label}
              className="group relative min-h-[230px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-slate-950/80 p-5 text-white backdrop-blur-sm">
                <visual.icon className="h-4 w-4 text-red-300" />
                <span className="text-sm font-semibold">{visual.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live preview */}
      <section id="practice" className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="space-y-8">
          <div>
            <Badge variant="secondary" className="gap-1.5">
              <Radar className="h-3 w-3 text-primary" />
              {t.marketing.liveSectionBadge}
            </Badge>
            <h2 className="mt-4 text-2xl font-bold lg:text-3xl">{t.marketing.liveSectionTitle}</h2>
            <p className="mt-3 text-muted-foreground">{t.marketing.liveSectionDesc}</p>
            <div className="relative mt-6 h-40 overflow-hidden rounded-xl border border-border/70">
              <Image
                src="/art/oracle-datacenter.svg"
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
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

      {/* Certification syllabus */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge variant="secondary" className="gap-1.5"><BookOpen className="h-3 w-3 text-primary" /> 1Z0-071</Badge>
            <h2 className="mt-4 text-2xl font-bold lg:text-3xl">{locale === "en" ? "Oracle SQL certification syllabus" : "Programme de certification Oracle SQL"}</h2>
            <p className="mt-2 text-muted-foreground">{locale === "en" ? "A structured path from relational fundamentals to advanced Oracle SQL." : "Un parcours structuré des fondamentaux relationnels au SQL Oracle avancé."}</p>
          </div>
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">{locale === "en" ? "Explore all modules" : "Explorer tous les modules"}<ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {localizedModules.slice(0, 6).map((module) => (
            <Link key={module.id} href={`/courses/${module.id}`} className="group rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{String(module.number).padStart(2, "0")}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h3 className="mt-4 line-clamp-2 font-semibold">{module.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{module.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground"><span>{module.lessons.length} {locale === "en" ? "lessons" : "leçons"}</span><span>{module.estimatedHours}h</span></div>
            </Link>
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
            src="/art/oracle-cloud.svg"
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
