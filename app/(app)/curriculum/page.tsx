import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
  ListOrdered,
  Monitor,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseBlockView } from "@/components/course-blocks";
import { getSessionUser } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";
import {
  courseMeta,
  courseSessions,
  examTraps,
  executionOrder,
  keyPoints,
  totalMinutes,
  totalTopics,
  tr,
} from "@/lib/course-oca-sql";

export const metadata = {
  title: "Complete Oracle SQL curriculum",
  description: "Six progressive sessions covering the whole Oracle Database SQL 1Z0-071 syllabus.",
};

export default async function CurriculumPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const locale = getLocale();
  const t = dictionary[locale];
  const hours = Math.round((totalMinutes() / 60) * 10) / 10;

  return (
    <div className="mx-auto max-w-5xl space-y-10 p-4 lg:p-8">
      {/* En-tête */}
      <header>
        <Badge variant="secondary" className="gap-1.5">
          <ListOrdered className="h-3 w-3 text-primary" />
          {t.curriculum.badge}
        </Badge>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight lg:text-4xl">
          {tr(courseMeta.title, locale)}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{tr(courseMeta.subtitle, locale)}</p>

        <dl className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
          {[
            { icon: Layers, value: String(courseSessions.length), label: t.curriculum.sessions },
            { icon: BookOpen, value: String(totalTopics()), label: t.curriculum.topics },
            { icon: Clock, value: String(hours), label: t.curriculum.hours },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border/70 bg-card p-3 text-center">
              <stat.icon className="mx-auto h-4 w-4 text-primary" />
              <dd className="mt-1.5 text-xl font-bold tabular-nums">{stat.value}</dd>
              <dt className="text-[11px] text-muted-foreground">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </header>

      {/* Introduction générale */}
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.curriculum.intro}</CardTitle>
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

      {/* Les six sessions, dans l'ordre */}
      <section className="space-y-4">
        {courseSessions.map((session) => (
          <Link
            key={session.id}
            href={`/curriculum/${session.id}`}
            className="group block rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {String(session.number).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {t.curriculum.sessionLabel} {session.number}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    · {session.topics.length} {t.curriculum.topics} · {Math.round(session.estimatedMinutes / 60 * 10) / 10} {t.curriculum.hours}
                  </span>
                </div>
                <h2 className="mt-1 text-lg font-bold">{tr(session.title, locale)}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {tr(session.summary, locale)}
                </p>
                <ol className="mt-3 flex flex-wrap gap-1.5">
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
        ))}
      </section>

      {/* Synthèse */}
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
        <Link href="/curriculum/session-1">
          <Button className="gap-2">
            {t.curriculum.startSession} 1
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/quiz">
          <Button variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            {t.tracks.startQuiz}
          </Button>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">{t.curriculum.source}</p>
    </div>
  );
}
