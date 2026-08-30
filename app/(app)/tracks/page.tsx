import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, Clock, ExternalLink, ListChecks, Route, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSessionUser } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";
import { certificationTracks, pick, trackCoverage } from "@/lib/certification-tracks";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Certification tracks — OracleMaster",
  description:
    "Choose between Oracle Database SQL (1Z0-071), Oracle Database Administration I (1Z0-082) and Administration II (1Z0-083).",
};

const ACCENTS: Record<string, { ring: string; chip: string; icon: string; bar: string }> = {
  primary: {
    ring: "hover:border-primary/60 focus-visible:ring-primary/40",
    chip: "bg-primary/10 text-primary border-primary/25",
    icon: "bg-primary/10 text-primary",
    bar: "[&>div]:bg-primary",
  },
  sky: {
    ring: "hover:border-sky-500/60 focus-visible:ring-sky-500/40",
    chip: "bg-sky-500/10 text-sky-600 border-sky-500/25 dark:text-sky-300",
    icon: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
    bar: "[&>div]:bg-sky-500",
  },
  amber: {
    ring: "hover:border-amber-500/60 focus-visible:ring-amber-500/40",
    chip: "bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-300",
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    bar: "[&>div]:bg-amber-500",
  },

  rose: {
    ring: "hover:border-rose-500/60 focus-visible:ring-rose-500/40",
    chip: "bg-rose-500/10 text-rose-600 border-rose-500/25 dark:text-rose-300",
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
    bar: "[&>div]:bg-rose-500",
  },
  violet: {
    ring: "hover:border-violet-500/60 focus-visible:ring-violet-500/40",
    chip: "bg-violet-500/10 text-violet-600 border-violet-500/25 dark:text-violet-300",
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
    bar: "[&>div]:bg-violet-500",
  },
  teal: {
    ring: "hover:border-teal-500/60 focus-visible:ring-teal-500/40",
    chip: "bg-teal-500/10 text-teal-600 border-teal-500/25 dark:text-teal-300",
    icon: "bg-teal-500/10 text-teal-600 dark:text-teal-300",
    bar: "[&>div]:bg-teal-500",
  },
};

export default async function TracksPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const locale = getLocale();
  const t = dictionary[locale];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 lg:p-8">
      <header className="max-w-3xl">
        <Badge variant="secondary" className="gap-1.5">
          <Route className="h-3 w-3 text-primary" />
          Oracle Database
        </Badge>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight lg:text-4xl">{t.tracks.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.tracks.subtitle}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {certificationTracks.map((track, index) => {
          const accent = ACCENTS[track.accent] ?? ACCENTS.primary;
          const coverage = trackCoverage(track);
          const available = track.status === "available";

          return (
            <Card
              key={track.id}
              className={cn(
                "group animate-slide-up flex flex-col overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                accent.ring,
              )}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <CardContent className="flex flex-1 flex-col gap-5 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", accent.icon)}>
                    {available ? <BadgeCheck className="h-6 w-6" /> : <ListChecks className="h-6 w-6" />}
                  </div>
                  <Badge variant="outline" className={cn("shrink-0 font-medium", accent.chip)}>
                    {available ? t.tracks.badgeAvailable : t.tracks.badgeSyllabus}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {track.shortLabel} · {track.examCode}
                  </p>
                  <h2 className="mt-1.5 text-xl font-bold leading-tight">{pick(track.title, locale)}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pick(track.summary, locale)}</p>
                </div>

                <dl className="grid grid-cols-3 gap-2 rounded-xl border border-border/70 bg-muted/40 p-3 text-center">
                  <div>
                    <dt className="sr-only">{t.tracks.statQuestions}</dt>
                    <dd className="text-lg font-bold tabular-nums">{track.questions}</dd>
                    <p className="text-[11px] text-muted-foreground">{t.tracks.statQuestions}</p>
                  </div>
                  <div className="border-x border-border/70">
                    <dt className="sr-only">{t.tracks.statDuration}</dt>
                    <dd className="text-lg font-bold tabular-nums">{track.durationMinutes}</dd>
                    <p className="text-[11px] text-muted-foreground">{t.tracks.statDuration}</p>
                  </div>
                  <div>
                    <dt className="sr-only">{t.tracks.statPass}</dt>
                    <dd className="text-lg font-bold tabular-nums">{track.passScorePercent}%</dd>
                    <p className="text-[11px] text-muted-foreground">{t.tracks.statPass}</p>
                  </div>
                </dl>

                <div>
                  <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">{t.tracks.coverage}</span>
                    <span className="font-semibold tabular-nums">{coverage.percent}%</span>
                  </div>
                  <Progress value={coverage.percent} className={cn("h-2", accent.bar)} />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {coverage.covered} {t.tracks.coveredDomains} {coverage.total}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{t.tracks.audience} : </span>
                  {pick(track.audience, locale)}
                </p>

                <div className="mt-auto pt-1">
                  <Link href={`/tracks/${track.id}`} className="block">
                    <Button className="w-full gap-2" variant={available ? "default" : "outline"}>
                      {t.tracks.chooseCta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/20 bg-primary/[0.04]">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">{t.tracks.officialTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t.tracks.officialDesc}</p>
              <p className="mt-2 text-xs text-muted-foreground">{t.tracks.honesty}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href="https://education.oracle.com/oracle-certification-path/pFamily_32"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Oracle University
              </Button>
            </a>
            <Link href="/courses">
              <Button size="sm" variant="ghost" className="gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                {t.tracks.startLearning}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        {locale === "en"
          ? "Exam formats and syllabus wording come from the official Oracle University exam pages."
          : "Les formats d’épreuve et les intitulés de programme proviennent des fiches d’examen officielles Oracle University."}
      </p>
    </div>
  );
}
