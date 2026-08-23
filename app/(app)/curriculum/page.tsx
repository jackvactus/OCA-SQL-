import Link from "next/link";
import { ArrowRight, BookOpen, Clock, GraduationCap, Layers, ListOrdered, Monitor, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseBlockView } from "@/components/course-blocks";
import { CurriculumProgress, SessionDoneBadge } from "@/components/session-review";
import { getSessionUser } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";
import { courseMeta, examTraps, executionOrder, keyPoints, tr } from "@/lib/course-oca-sql";
import { curricula, curriculumStats } from "@/lib/curricula";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Curricula",
  description:
    "Three complete curricula: Oracle Database SQL (1Z0-071), Administration I (1Z0-082) and Administration II (1Z0-083).",
};

const ACCENT: Record<string, { badge: string; num: string; ring: string }> = {
  primary: {
    badge: "bg-primary/10 text-primary border-primary/25",
    num: "bg-primary/10 text-primary",
    ring: "hover:border-primary/50",
  },
  sky: {
    badge: "bg-sky-500/10 text-sky-600 border-sky-500/25 dark:text-sky-300",
    num: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
    ring: "hover:border-sky-500/50",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-300",
    num: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    ring: "hover:border-amber-500/50",
  },
};

export default async function CurriculumPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const locale = getLocale();
  const t = dictionary[locale];

  const totals = curricula.reduce(
    (acc, curriculum) => {
      const stats = curriculumStats(curriculum);
      return {
        sessions: acc.sessions + stats.sessions,
        topics: acc.topics + stats.topics,
        hours: Math.round((acc.hours + stats.hours) * 10) / 10,
      };
    },
    { sessions: 0, topics: 0, hours: 0 },
  );

  return (
    <div className="mx-auto max-w-5xl space-y-12 p-4 lg:p-8">
      <header>
        <Badge variant="secondary" className="gap-1.5">
          <ListOrdered className="h-3 w-3 text-primary" />
          {t.curriculum.badge}
        </Badge>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight lg:text-4xl">
          {locale === "en" ? "Oracle Database curricula" : "Cursus Oracle Database"}
        </h1>
        <p className="text-pretty mt-3 max-w-2xl text-muted-foreground">
          {locale === "en"
            ? "Three complete curricula, each following the order of the official Oracle University course the exam is built from."
            : "Trois cursus complets, chacun suivant l’ordre du cours officiel Oracle University dont l’examen est issu."}
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
          {[
            { icon: Layers, value: String(totals.sessions), label: t.curriculum.sessions },
            { icon: BookOpen, value: String(totals.topics), label: t.curriculum.topics },
            { icon: Clock, value: String(totals.hours), label: t.curriculum.hours },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border/70 bg-card p-3 text-center">
              <stat.icon className="mx-auto h-4 w-4 text-primary" />
              <dd className="mt-1.5 text-xl font-bold tabular-nums">{stat.value}</dd>
              <dt className="text-[11px] text-muted-foreground">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </header>

      {/* Les trois cursus */}
      {curricula.map((curriculum) => {
        const accent = ACCENT[curriculum.accent] ?? ACCENT.primary;
        const stats = curriculumStats(curriculum);

        return (
          <section key={curriculum.id} className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <Badge variant="outline" className={cn("font-mono text-xs", accent.badge)}>
                  {curriculum.examCode} · {curriculum.shortLabel}
                </Badge>
                <h2 className="mt-2 text-2xl font-bold">{tr(curriculum.title, locale)}</h2>
                <p className="text-pretty mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {tr(curriculum.subtitle, locale)}
                </p>
              </div>
              <div className="shrink-0 space-y-2">
                <p className="text-xs text-muted-foreground">
                  {stats.sessions} {t.curriculum.sessions} · {stats.topics} {t.curriculum.topics} ·{" "}
                  {stats.hours} {t.curriculum.hours}
                </p>
                <CurriculumProgress sessionIds={curriculum.sessions.map((s) => s.id)} />
              </div>
            </div>

            <ol className="space-y-3">
              {curriculum.sessions.map((session) => (
                <li key={session.id}>
                  <Link
                    href={`/curriculum/${session.id}`}
                    className={cn(
                      "group block rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-5",
                      accent.ring,
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold",
                          accent.num,
                        )}
                      >
                        {String(session.number).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="flex items-center gap-2 font-bold leading-tight">
                          {tr(session.title, locale)}
                          <SessionDoneBadge sessionId={session.id} />
                        </h3>
                        <p className="text-pretty mt-1 text-sm leading-relaxed text-muted-foreground">
                          {tr(session.summary, locale)}
                        </p>
                        <ol className="mt-2.5 flex flex-wrap gap-1.5">
                          {session.topics.map((topic) => (
                            <li
                              key={topic.id}
                              className="rounded-lg border border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              <span className="font-mono font-semibold">{topic.number}</span>{" "}
                              {tr(topic.title, locale)}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      {/* Introduction générale OCA */}
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.curriculum.intro}</CardTitle>
          <CardDescription>1Z0-071</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" />
              {t.curriculum.objectives}
            </h3>
            <ul className="space-y-1.5">
              {courseMeta.objectives[locale].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Monitor className="h-4 w-4 text-primary" />
              {t.curriculum.environment}
            </h3>
            <ul className="space-y-1.5">
              {courseMeta.environment[locale].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Synthèse d'examen */}
      <section className="space-y-5">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <GraduationCap className="h-5 w-5 text-primary" />
          {t.curriculum.synthesis}
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t.curriculum.keyPoints}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {keyPoints.map((point, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{tr(point, locale)}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t.curriculum.orderTitle}</CardTitle>
              <CardDescription>
                {locale === "en"
                  ? "This order explains why a SELECT alias works in ORDER BY but never in WHERE."
                  : "Cet ordre explique pourquoi un alias du SELECT fonctionne dans ORDER BY mais jamais dans WHERE."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {executionOrder.map((step, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{tr(step, locale)}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t.curriculum.trapsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {examTraps.map((trap, index) => (
              <CourseBlockView
                key={index}
                locale={locale}
                block={{ kind: "compare", wrong: trap.wrong, right: trap.right, note: trap.note }}
              />
            ))}
          </CardContent>
        </Card>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/tracks">
          <Button variant="outline" className="gap-2">
            {t.tracks.backToTracks}
          </Button>
        </Link>
        <Link href="/quiz">
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" />
            {t.tracks.startQuiz}
          </Button>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">{t.curriculum.source}</p>
    </div>
  );
}
