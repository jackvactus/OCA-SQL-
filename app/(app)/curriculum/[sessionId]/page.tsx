import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Brain, Clock, ListOrdered } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseBlockView } from "@/components/course-blocks";
import { SessionReview } from "@/components/session-review";
import { SessionLabs } from "@/components/session-labs";
import { getSessionUser } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionary } from "@/lib/i18n/dictionary";
import { tr } from "@/lib/course-oca-sql";
import { allSessionIds, findSession } from "@/lib/curricula";

export function generateStaticParams() {
  return allSessionIds.map((sessionId) => ({ sessionId }));
}

export default async function CurriculumSessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const user = await getSessionUser();
  if (!user) return null;

  const found = findSession(params.sessionId);
  if (!found) notFound();
  const { curriculum, session, index } = found;
  const courseSessions = curriculum.sessions;

  const locale = getLocale();
  const t = dictionary[locale];
  const previous = index > 0 ? courseSessions[index - 1] : null;
  const next = index < courseSessions.length - 1 ? courseSessions[index + 1] : null;

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      <Link
        href="/curriculum"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.curriculum.backToCurriculum}
      </Link>

      <div className="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-10">
        <article className="min-w-0">
          {/* En-tête de session */}
          <header className="border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {curriculum.examCode} · {curriculum.shortLabel}
              </Badge>
              <Badge variant="secondary">
                {t.curriculum.sessionLabel} {session.number} / {courseSessions.length}
              </Badge>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {Math.round((session.estimatedMinutes / 60) * 10) / 10} {t.curriculum.hours}
              </span>
              <span className="text-xs text-muted-foreground">
                · {session.topics.length} {t.curriculum.topics}
              </span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight lg:text-4xl">
              {tr(session.title, locale)}
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {tr(session.summary, locale)}
            </p>
          </header>

          {/* Sommaire mobile */}
          <nav className="mt-6 rounded-xl border border-border/70 bg-muted/30 p-4 lg:hidden">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <ListOrdered className="h-3.5 w-3.5" />
              {t.curriculum.tocTitle}
            </p>
            <ol className="space-y-1">
              {session.topics.map((topic) => (
                <li key={topic.id}>
                  <a href={`#${topic.id}`} className="text-sm text-muted-foreground hover:text-primary">
                    <span className="font-mono font-semibold">{topic.number}</span> {tr(topic.title, locale)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Chapitres, dans l'ordre */}
          <div className="mt-8 space-y-12">
            {session.topics.map((topic) => (
              <section key={topic.id} id={topic.id} className="scroll-mt-24">
                <h2 className="flex items-baseline gap-3 border-b border-border/70 pb-2 text-xl font-bold">
                  <span className="font-mono text-base text-primary">{topic.number}</span>
                  {tr(topic.title, locale)}
                </h2>
                <div className="mt-5 space-y-5">
                  {topic.blocks.map((block, blockIndex) => (
                    <CourseBlockView key={blockIndex} block={block} locale={locale} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {session.labs && session.labs.length > 0 && (
            <SessionLabs labs={session.labs} locale={locale} />
          )}

          <SessionReview
            sessionId={session.id}
            keyTakeaways={session.keyTakeaways}
            selfCheck={session.selfCheck}
          />

          {/* Navigation entre sessions */}
          <nav className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            {previous ? (
              <Button asChild variant="outline" className="h-auto max-w-full justify-start gap-2 py-2.5 text-left">
                <Link href={`/curriculum/${previous.id}`} className="min-w-0">
                  <ArrowLeft className="h-4 w-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-[11px] text-muted-foreground">
                      {t.curriculum.previousSession}
                    </span>
                    <span className="block truncate text-sm font-medium">
                      {previous.number}. {tr(previous.title, locale)}
                    </span>
                  </span>
                </Link>
              </Button>
            ) : (
              <span />
            )}

            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link href="/quiz">
                <Brain className="h-4 w-4" />
                {t.curriculum.practise}
              </Link>
            </Button>

            {next ? (
              <Button asChild className="h-auto max-w-full justify-end gap-2 py-2.5 text-right">
                <Link href={`/curriculum/${next.id}`} className="min-w-0">
                  <span className="min-w-0">
                    <span className="block text-[11px] opacity-80">{t.curriculum.nextSession}</span>
                    <span className="block truncate text-sm font-medium">
                      {next.number}. {tr(next.title, locale)}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
            ) : (
              <span />
            )}
          </nav>
        </article>

        {/* Sommaire collant (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <ListOrdered className="h-3.5 w-3.5" />
              {t.curriculum.tocTitle}
            </p>
            <ol className="space-y-1 border-l border-border">
              {session.topics.map((topic) => (
                <li key={topic.id}>
                  <a
                    href={`#${topic.id}`}
                    className="-ml-px flex gap-2 border-l-2 border-transparent py-1.5 pl-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    <span className="font-mono text-xs font-semibold text-primary">{topic.number}</span>
                    <span>{tr(topic.title, locale)}</span>
                  </a>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-xl border border-border/70 bg-muted/30 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {t.curriculum.badge}
              </p>
              <ol className="mt-2 space-y-1">
                {courseSessions.map((other) => (
                  <li key={other.id}>
                    <Link
                      href={`/curriculum/${other.id}`}
                      className={`block truncate rounded-md px-2 py-1 text-xs transition-colors ${
                        other.id === session.id
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                      }`}
                    >
                      {other.number}. {tr(other.title, locale)}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
