"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  Info,
  Code2,
  Table as TableIcon,
  FileText,
  ChevronRight,
  Award,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { modules } from "@/lib/modules-data";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";
import type { Lesson, LessonSection } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Convert **bold** markers to <strong> tags and return sanitized HTML. */
function renderMarkdownBold(text: string): string {
  // Escape HTML-sensitive characters first to avoid injection from content
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Now restore **bold** → <strong>…</strong>
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/* ------------------------------------------------------------------ */
/* Content section renderer                                            */
/* ------------------------------------------------------------------ */

function ContentSection({ section }: { section: LessonSection }) {
  switch (section.type) {
    case "text":
      return (
        <div className="space-y-2">
          {section.title && (
            <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <FileText className="h-4 w-4 text-primary" />
              {section.title}
            </h3>
          )}
          <p
            className="text-[15px] leading-7 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: renderMarkdownBold(section.body ?? "") }}
          />
        </div>
      );

    case "code":
      return (
        <div className="space-y-2">
          {section.title && (
            <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Code2 className="h-4 w-4 text-primary" />
              {section.title}
            </h3>
          )}
          <div className="overflow-hidden rounded-lg border border-border bg-[#1e1e2e] shadow-sm">
            {section.caption && (
              <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-2 text-xs text-zinc-400">
                <Code2 className="h-3 w-3" />
                {section.caption}
              </div>
            )}
            <pre className="overflow-x-auto p-4 text-[13px] leading-6">
              <code className="font-mono text-zinc-200" style={{ fontFamily: "var(--font-mono), monospace" }}>
                {section.code}
              </code>
            </pre>
          </div>
        </div>
      );

    case "table":
      return (
        <div className="space-y-2">
          {section.title && (
            <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <TableIcon className="h-4 w-4 text-primary" />
              {section.title}
            </h3>
          )}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              {section.headers && section.headers.length > 0 && (
                <thead>
                  <tr className="bg-secondary/60">
                    {section.headers.map((h, i) => (
                      <th
                        key={i}
                        className="border-b border-border px-4 py-2.5 text-left font-semibold text-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {section.rows?.map((row, ri) => (
                  <tr
                    key={ri}
                    className={cn(
                      "transition-colors hover:bg-secondary/30",
                      ri % 2 === 1 && "bg-secondary/20",
                    )}
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="border-b border-border/60 px-4 py-2.5 align-top text-muted-foreground last:border-b-0"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "diagram":
      return (
        <div className="space-y-2">
          {section.title && (
            <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <TableIcon className="h-4 w-4 text-primary" />
              {section.title}
            </h3>
          )}
          <div className="overflow-hidden rounded-lg border border-border bg-secondary/40">
            <pre
              className="overflow-x-auto p-4 text-[13px] leading-5 text-foreground"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {section.body}
            </pre>
          </div>
        </div>
      );

    case "tip":
      return (
        <div className="rounded-lg border border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.08)] p-4">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--success))]" />
            <div className="space-y-1">
              {section.title && (
                <p className="text-sm font-semibold text-[hsl(var(--success))]">
                  {section.title}
                </p>
              )}
              <p
                className="text-sm leading-6 text-foreground/90"
                dangerouslySetInnerHTML={{ __html: renderMarkdownBold(section.body ?? "") }}
              />
            </div>
          </div>
        </div>
      );

    case "warning":
      return (
        <div className="rounded-lg border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.08)] p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--warning))]" />
            <div className="space-y-1">
              {section.title && (
                <p className="text-sm font-semibold text-[hsl(var(--warning))]">
                  {section.title}
                </p>
              )}
              <p
                className="text-sm leading-6 text-foreground/90"
                dangerouslySetInnerHTML={{ __html: renderMarkdownBold(section.body ?? "") }}
              />
            </div>
          </div>
        </div>
      );

    case "note":
      return (
        <div className="rounded-lg border border-primary/30 bg-primary/[0.06] p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="space-y-1">
              {section.title && (
                <p className="text-sm font-semibold text-primary">{section.title}</p>
              )}
              <p
                className="text-sm leading-6 text-foreground/90"
                dangerouslySetInnerHTML={{ __html: renderMarkdownBold(section.body ?? "") }}
              />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LessonDetailPage() {
  const params = useParams();
  const moduleId = params?.moduleId as string;
  const { progress, loaded, completeLesson } = useProgress();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Find the module
  const currentModule = useMemo(
    () => modules.find((m) => m.id === moduleId),
    [moduleId],
  );

  // Determine the active lesson: explicit state > first incomplete > first
  const activeLesson = useMemo<Lesson | null>(() => {
    if (!currentModule || currentModule.lessons.length === 0) return null;
    if (activeLessonId) {
      const found = currentModule.lessons.find((l) => l.id === activeLessonId);
      if (found) return found;
    }
    const firstIncomplete = currentModule.lessons.find(
      (l) => !progress.completedLessons.includes(l.id),
    );
    return firstIncomplete ?? currentModule.lessons[0];
  }, [currentModule, activeLessonId, progress.completedLessons]);

  const activeIndex = useMemo(() => {
    if (!currentModule || !activeLesson) return -1;
    return currentModule.lessons.findIndex((l) => l.id === activeLesson.id);
  }, [currentModule, activeLesson]);

  const prevLesson = activeIndex > 0 ? currentModule?.lessons[activeIndex - 1] : null;
  const nextLesson =
    currentModule && activeIndex >= 0 && activeIndex < currentModule.lessons.length - 1
      ? currentModule.lessons[activeIndex + 1]
      : null;

  const isCompleted = activeLesson
    ? progress.completedLessons.includes(activeLesson.id)
    : false;

  const completedCount = currentModule
    ? currentModule.lessons.filter((l) => progress.completedLessons.includes(l.id)).length
    : 0;
  const modulePercent =
    currentModule && currentModule.lessons.length > 0
      ? Math.round((completedCount / currentModule.lessons.length) * 100)
      : 0;

  /* ----------------------------- Not found ----------------------------- */
  if (!currentModule) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Module introuvable</h1>
        <p className="text-sm text-muted-foreground">
          Le module que vous recherchez n&apos;existe pas ou a été déplacé.
        </p>
        <Button asChild>
          <Link href="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux modules
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
      {/* Breadcrumb / back */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/courses"
          className="flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Modules
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{currentModule.title}</span>
      </div>

      {/* Module header */}
      <header className="mb-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="h-3 w-3" />
                Module {currentModule.number}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {currentModule.category}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              {currentModule.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {currentModule.description}
            </p>
          </div>

          {/* Module progress */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(modulePercent / 100) * 97.4} 97.4`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-xs font-bold tabular-nums">
                {loaded ? `${modulePercent}%` : "—"}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Progression du module</p>
              <p className="text-muted-foreground">
                {completedCount} / {currentModule.lessons.length} leçons
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* ----------------------------- Sidebar ----------------------------- */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                Leçons
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {completedCount} / {currentModule.lessons.length} complétées
              </p>
            </CardHeader>
            <ScrollArea className="h-[calc(100vh-320px)] min-h-[300px]">
              <div className="p-2">
                {currentModule.lessons.map((lesson, idx) => {
                  const done = progress.completedLessons.includes(lesson.id);
                  const isActive = activeLesson?.id === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={cn(
                        "group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200",
                        isActive
                          ? "bg-primary/10 ring-1 ring-primary/30"
                          : "hover:bg-secondary/60",
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                        ) : isActive ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {idx + 1}
                          </div>
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p
                          className={cn(
                            "text-sm font-medium leading-snug transition-colors",
                            isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                            done && "text-foreground",
                          )}
                        >
                          <span className="line-clamp-2">{lesson.title}</span>
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lesson.duration} min
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>
        </aside>

        {/* ----------------------------- Content ----------------------------- */}
        <main className="min-w-0 space-y-6">
          {activeLesson && (
            <>
              {/* Lesson header card */}
              <Card className="overflow-hidden">
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <BookOpen className="h-3 w-3" />
                      Leçon {activeIndex + 1} / {currentModule.lessons.length}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {activeLesson.duration} min
                    </Badge>
                    {isCompleted && (
                      <Badge className="gap-1 border-transparent bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">
                        <CheckCircle2 className="h-3 w-3" />
                        Terminé
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl leading-tight lg:text-3xl">
                    {activeLesson.title}
                  </CardTitle>
                </CardHeader>

                {/* Objectives */}
                {activeLesson.objectives.length > 0 && (
                  <CardContent className="border-t border-border pt-6">
                    <div className="space-y-3">
                      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        <Award className="h-4 w-4 text-primary" />
                        Objectifs pédagogiques
                      </h2>
                      <ul className="space-y-2">
                        {activeLesson.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span className="leading-6 text-foreground/90">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Content sections */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Contenu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {activeLesson.content.map((section, i) => (
                    <ContentSection key={i} section={section} />
                  ))}
                </CardContent>
              </Card>

              {/* Key points */}
              {activeLesson.keyPoints.length > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Points clés à retenir
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {activeLesson.keyPoints.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {i + 1}
                          </div>
                          <span className="text-sm leading-6 text-foreground/90">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Flashcards preview */}
              {activeLesson.flashcards.length > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Flashcards
                      <Badge variant="secondary" className="ml-1">
                        {activeLesson.flashcards.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {activeLesson.flashcards.map((card) => (
                        <div
                          key={card.id}
                          className="rounded-lg border border-border bg-secondary/20 p-4 transition-colors hover:border-primary/40"
                        >
                          <Badge variant="outline" className="mb-2 text-[10px] capitalize">
                            {card.category}
                          </Badge>
                          <p className="text-sm font-medium leading-6 text-foreground">
                            {card.front}
                          </p>
                          <div className="my-2 border-t border-dashed border-border" />
                          <p className="text-xs leading-5 text-muted-foreground">
                            {card.back}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Exercises */}
              {activeLesson.exercises.length > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Code2 className="h-5 w-5 text-primary" />
                      Exercices
                      <Badge variant="secondary" className="ml-1">
                        {activeLesson.exercises.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeLesson.exercises.map((ex, i) => (
                      <div
                        key={ex.id}
                        className="rounded-lg border border-border p-4 transition-colors hover:border-primary/30"
                      >
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                              {i + 1}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] capitalize",
                                ex.difficulty === "beginner" &&
                                  "border-[hsl(var(--success)/0.3)] text-[hsl(var(--success))]",
                                ex.difficulty === "intermediate" &&
                                  "border-[hsl(var(--warning)/0.4)] text-[hsl(var(--warning))]",
                                ex.difficulty === "advanced" &&
                                  "border-[hsl(var(--destructive)/0.3)] text-[hsl(var(--destructive))]",
                              )}
                            >
                              {ex.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-foreground/90">
                          {ex.prompt}
                        </p>
                        {ex.starterCode && (
                          <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-[#1e1e2e] p-3 text-[13px] leading-6">
                            <code className="font-mono text-zinc-200" style={{ fontFamily: "var(--font-mono), monospace" }}>
                              {ex.starterCode}
                            </code>
                          </pre>
                        )}
                        <div className="mt-3 flex items-start gap-2 rounded-md bg-secondary/40 p-2.5 text-xs text-muted-foreground">
                          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>
                            <span className="font-semibold text-foreground">Indice :</span>{" "}
                            {ex.hint}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Mark as complete */}
              <Card className="overflow-hidden">
                <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                        isCompleted
                          ? "bg-[hsl(var(--success)/0.15)]"
                          : "bg-primary/10",
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-[hsl(var(--success))]" />
                      ) : (
                        <Award className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {isCompleted ? "Leçon terminée !" : "Prêt à valider ?"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isCompleted
                          ? "Vous pouvez passer à la leçon suivante."
                          : "Marquez cette leçon comme terminée pour suivre votre progression."}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    disabled={isCompleted}
                    onClick={() => activeLesson && completeLesson(activeLesson.id)}
                    className={cn(
                      "w-full sm:w-auto",
                      isCompleted &&
                        "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]",
                    )}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Terminé
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Marquer comme terminé
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Prev / Next navigation */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
                {prevLesson ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto flex-1 justify-start py-4"
                  >
                    <Link
                      href={`/courses/${currentModule.id}`}
                      onClick={() => setActiveLessonId(prevLesson.id)}
                      className="flex items-center gap-3"
                    >
                      <ArrowLeft className="h-4 w-4 shrink-0 text-primary" />
                      <span className="flex flex-col items-start text-left">
                        <span className="text-xs text-muted-foreground">Précédent</span>
                        <span className="line-clamp-1 text-sm font-medium">
                          {prevLesson.title}
                        </span>
                      </span>
                    </Link>
                  </Button>
                ) : (
                  <div className="flex-1" />
                )}

                {nextLesson ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto flex-1 justify-end py-4"
                  >
                    <Link
                      href={`/courses/${currentModule.id}`}
                      onClick={() => setActiveLessonId(nextLesson.id)}
                      className="flex items-center justify-end gap-3"
                    >
                      <span className="flex flex-col items-end text-right">
                        <span className="text-xs text-muted-foreground">Suivant</span>
                        <span className="line-clamp-1 text-sm font-medium">
                          {nextLesson.title}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                    </Link>
                  </Button>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
