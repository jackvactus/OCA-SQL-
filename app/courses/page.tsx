"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { modules } from "@/lib/modules-data";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const { progress, loaded } = useProgress();

  // Group modules by category, preserving discovery order
  const grouped = useMemo(() => {
    const map = new Map<string, typeof modules>();
    for (const m of modules) {
      if (!map.has(m.category)) map.set(m.category, []);
      map.get(m.category)!.push(m);
    }
    return Array.from(map.entries());
  }, []);

  // Overall stats for the header
  const totals = useMemo(() => {
    const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
    const completed = modules.reduce(
      (s, m) =>
        s + m.lessons.filter((l) => progress.completedLessons.includes(l.id)).length,
      0,
    );
    const totalHours = modules.reduce((s, m) => s + m.estimatedHours, 0);
    const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    return { totalLessons, completed, totalHours, percent };
  }, [progress.completedLessons]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 lg:p-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 lg:p-8">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {modules.length} modules
              </Badge>
              <Badge variant="outline">{totals.totalLessons} leçons</Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {totals.totalHours}h
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              Modules de cours
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground lg:text-base">
              Parcourez les modules de préparation à la certification Oracle Database SQL
              1Z0-071. Suivez votre progression, complétez les leçons et maîtrisez chaque
              sujet à votre rythme.
            </p>
          </div>

          {/* Overall progress dial */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
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
                  strokeDasharray={`${(totals.percent / 100) * 97.4} 97.4`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-sm font-bold">
                {loaded ? `${totals.percent}%` : "—"}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Progression globale</p>
              <p className="text-muted-foreground">
                {totals.completed} / {totals.totalLessons} leçons complétées
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Sections by category */}
      {grouped.map(([category, mods], sectionIndex) => {
        const sectionCompleted = mods.reduce(
          (s, m) =>
            s +
            m.lessons.filter((l) => progress.completedLessons.includes(l.id)).length,
          0,
        );
        const sectionTotal = mods.reduce((s, m) => s + m.lessons.length, 0);
        const sectionPercent =
          sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0;

        return (
          <section
            key={category}
            className="animate-slide-up space-y-4"
            style={{ animationDelay: `${sectionIndex * 60}ms` }}
          >
            {/* Section header */}
            <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold tracking-tight lg:text-xl">
                  {category}
                </h2>
                <Badge variant="secondary">{mods.length} modules</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="hidden sm:inline">
                  {sectionCompleted} / {sectionTotal} leçons
                </span>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                    style={{ width: `${sectionPercent}%` }}
                  />
                </div>
                <span className="font-medium tabular-nums">{sectionPercent}%</span>
              </div>
            </div>

            {/* Module cards grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {mods.map((module, cardIndex) => {
                const totalLessons = module.lessons.length;
                const completedLessons = module.lessons.filter((l) =>
                  progress.completedLessons.includes(l.id),
                ).length;
                const percent =
                  totalLessons > 0
                    ? Math.round((completedLessons / totalLessons) * 100)
                    : 0;
                const isComplete = completedLessons === totalLessons && totalLessons > 0;
                const isStarted = completedLessons > 0 && !isComplete;

                return (
                  <Link
                    key={module.id}
                    href={`/courses/${module.id}`}
                    className="group block h-full"
                  >
                    <Card
                      className={cn(
                        "relative h-full overflow-hidden transition-all duration-300",
                        "hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg",
                        "animate-fade-in",
                        isComplete && "border-success/40",
                      )}
                      style={{ animationDelay: `${cardIndex * 50}ms` }}
                    >
                      {/* Accent bar */}
                      <div
                        className={cn(
                          "absolute inset-x-0 top-0 h-1 transition-opacity duration-300",
                          isComplete
                            ? "bg-success opacity-100"
                            : "bg-primary opacity-0 group-hover:opacity-100",
                        )}
                      />

                      <CardHeader className="space-y-3 pb-3">
                        {/* Top row: module number + category badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={cn(
                              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-transform duration-300 group-hover:scale-110",
                              isComplete
                                ? "bg-success/10 text-success"
                                : "bg-primary/10 text-primary",
                            )}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              module.number
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className="shrink-0 capitalize"
                          >
                            {module.category}
                          </Badge>
                        </div>

                        <CardTitle className="text-base leading-snug">
                          <span className="line-clamp-2">{module.title}</span>
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">
                          {module.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-1">
                        {/* Meta row */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />
                            {totalLessons} leçon{totalLessons > 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {module.estimatedHours}h
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {isComplete ? (
                                <span className="flex items-center gap-1 font-medium text-success">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Terminé
                                </span>
                              ) : isStarted ? (
                                <span className="font-medium text-primary">
                                  En cours
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Circle className="h-3 w-3" />
                                  Non commencé
                                </span>
                              )}
                            </span>
                            <span className="font-medium tabular-nums">
                              {completedLessons}/{totalLessons}
                            </span>
                          </div>
                          <Progress
                            value={percent}
                            className={cn(
                              "h-1.5",
                              isComplete && "[&>div]:bg-success",
                            )}
                          />
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-sm font-medium text-primary">
                            {isComplete
                              ? "Réviser"
                              : isStarted
                                ? "Continuer"
                                : "Commencer"}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1 px-2 text-xs opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1"
                          >
                            Ouvrir
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
