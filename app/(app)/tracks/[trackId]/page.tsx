import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ExternalLink,
  GraduationCap,
  Info,
  Minus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSessionUser } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";
import { certificationTracks, getTrack, pick, trackCoverage } from "@/lib/certification-tracks";
import { getLocalizedModules } from "@/lib/content-i18n";
import { quizQuestions } from "@/lib/quiz-data";
import { workbookQuizQuestions } from "@/lib/quiz-data-en-workbook";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return certificationTracks.map((track) => ({ trackId: track.id }));
}

export default async function TrackDetailPage({ params }: { params: { trackId: string } }) {
  const user = await getSessionUser();
  if (!user) return null;

  const track = getTrack(params.trackId);
  if (!track) notFound();

  const locale = getLocale();
  const t = dictionary[locale];
  const modules = getLocalizedModules(locale);
  const moduleById = new Map(modules.map((module) => [module.id, module]));
  const bank = locale === "en" ? workbookQuizQuestions : quizQuestions;
  const coverage = trackCoverage(track);
  const available = track.status === "available";

  const uncovered = track.groups
    .flatMap((group) => group.domains)
    .filter((domain) => domain.moduleIds.length === 0);

  const linkedModuleIds = Array.from(
    new Set(track.groups.flatMap((group) => group.domains.flatMap((domain) => domain.moduleIds))),
  );
  const trackQuestionCount = bank.filter((question) => linkedModuleIds.includes(question.moduleId)).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 lg:p-8">
      <div>
        <Link
          href="/tracks"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.tracks.backToTracks}
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            {track.examCode}
          </Badge>
          <Badge variant={available ? "default" : "outline"}>
            {available ? t.tracks.badgeAvailable : t.tracks.badgeSyllabus}
          </Badge>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight lg:text-4xl">
          {pick(track.title, locale)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.tracks.certificationDelivered} : <span className="font-medium text-foreground">{track.certification}</span>
        </p>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{pick(track.summary, locale)}</p>
      </div>

      {/* Format de l'épreuve */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: t.tracks.examCode, value: track.examCode },
          { label: t.tracks.statQuestions, value: String(track.questions) },
          { label: t.tracks.statDuration, value: `${track.durationMinutes} min` },
          { label: t.tracks.statPass, value: `${track.passScorePercent} %` },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Couverture */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.tracks.coverage}</CardTitle>
          <CardDescription>
            {coverage.covered} {t.tracks.coveredDomains} {coverage.total}
            {trackQuestionCount > 0 && ` · ${trackQuestionCount} ${t.tracks.statQuestions}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={coverage.percent} className="h-2.5" />
          {available && (
            <div className="flex flex-wrap gap-2">
              <Link href="/curriculum">
                <Button size="sm" className="gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  {t.curriculum.badge}
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  {t.tracks.startLearning}
                </Button>
              </Link>
              <Link href="/quiz">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Brain className="h-3.5 w-3.5" />
                  {t.tracks.startQuiz}
                </Button>
              </Link>
              <Link href="/exam">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {t.tracks.startExam}
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Programme officiel */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold">{t.tracks.domainsTitle}</h2>
          <p className="mt-1.5 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            {t.tracks.domainsNote}
          </p>
        </div>

        {track.groups.map((group) => (
          <Card key={group.label.en}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{pick(group.label, locale)}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {group.domains.map((domain) => {
                  const covered = domain.moduleIds.length > 0;
                  return (
                    <li
                      key={domain.title}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                            covered
                              ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground",
                          )}
                          aria-hidden="true"
                        >
                          {covered ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                        </span>
                        <span className="min-w-0 text-sm font-medium">{domain.title}</span>
                        <span className="sr-only">
                          {covered ? t.tracks.covered : t.tracks.notCovered}
                        </span>
                      </div>
                      {covered ? (
                        <div className="flex flex-wrap gap-1.5">
                          {domain.moduleIds.map((moduleId) => {
                            const module = moduleById.get(moduleId);
                            if (!module) return null;
                            return (
                              <Link
                                key={moduleId}
                                href={`/courses/${moduleId}`}
                                title={`${t.tracks.openModule} — ${module.title}`}
                                className="inline-flex max-w-[15rem] items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary/60 hover:text-primary"
                              >
                                <span className="shrink-0 text-muted-foreground">
                                  {String(module.number).padStart(2, "0")}
                                </span>
                                <span className="truncate">{module.title}</span>
                                <ArrowRight className="h-3 w-3 shrink-0" />
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="rounded-lg border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground">
                          {t.tracks.notCovered}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Non couvert */}
      {uncovered.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/[0.05]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t.tracks.notCoveredTitle}</CardTitle>
            <CardDescription>{t.tracks.notCoveredDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-2">
              {uncovered.map((domain) => (
                <li
                  key={domain.title}
                  className="rounded-lg border border-border/70 bg-card px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {domain.title}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Ressources officielles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.tracks.officialTitle}</CardTitle>
          <CardDescription>{t.tracks.officialDesc}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <a href={track.officialExamUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              {t.tracks.officialExam} — {track.examCode}
            </Button>
          </a>
          <a href={track.officialLearningUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              {t.tracks.officialLearning}
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
