"use client";

import * as React from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Brain,
  Library,
  FunctionSquare,
  ArrowRight,
  Clock,
  X,
  FileText,
  Code2,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { modules } from "@/lib/modules-data";
import { quizQuestions } from "@/lib/quiz-data";
import { glossary, oracleFunctions } from "@/lib/reference-data";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type ResultType = "course" | "lesson" | "quiz" | "glossary" | "function";

type FilterType = "all" | "courses" | "quizzes" | "glossary" | "functions";

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  description: string;
  link: string;
  context: string;
  category: string;
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const RECENT_SEARCHES_KEY = "oracle-master:recent-searches";
const MAX_RECENT = 6;

const FILTERS: { value: FilterType; label: string; icon: typeof Search }[] = [
  { value: "all", label: "All", icon: Search },
  { value: "courses", label: "Courses", icon: GraduationCap },
  { value: "quizzes", label: "Quizzes", icon: Brain },
  { value: "glossary", label: "Glossary", icon: Library },
  { value: "functions", label: "Functions", icon: FunctionSquare },
];

const TYPE_META: Record<
  ResultType,
  { label: string; icon: typeof Search; color: string }
> = {
  course: {
    label: "Course",
    icon: GraduationCap,
    color: "text-sky-400",
  },
  lesson: {
    label: "Lesson",
    icon: FileText,
    color: "text-emerald-400",
  },
  quiz: {
    label: "Quiz",
    icon: Brain,
    color: "text-amber-400",
  },
  glossary: {
    label: "Glossary",
    icon: Library,
    color: "text-violet-400",
  },
  function: {
    label: "Function",
    icon: FunctionSquare,
    color: "text-rose-400",
  },
};

const SUGGESTIONS = [
  "SELECT",
  "JOIN",
  "GROUP BY",
  "NVL",
  "subquery",
  "index",
  "TRUNCATE",
  "window function",
];

/* ------------------------------------------------------------------ */
/* Search logic                                                        */
/* ------------------------------------------------------------------ */

function buildResults(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];
  const matches = (text: string | undefined | null) =>
    !!text && text.toLowerCase().includes(q);

  // Modules (courses)
  for (const mod of modules) {
    if (matches(mod.title) || matches(mod.description)) {
      results.push({
        id: `course-${mod.id}`,
        type: "course",
        title: mod.title,
        description: mod.description,
        link: `/courses/${mod.id}`,
        context: `Module ${mod.number} · ${mod.lessons.length} lessons · ${mod.estimatedHours}h`,
        category: mod.category,
      });
    }
  }

  // Lessons
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (matches(lesson.title)) {
        results.push({
          id: `lesson-${lesson.id}`,
          type: "lesson",
          title: lesson.title,
          description: lesson.objectives[0] ?? mod.description,
          link: `/courses/${mod.id}`,
          context: `${mod.title} · ${lesson.duration} min`,
          category: mod.category,
        });
      }
    }
  }

  // Quiz questions
  for (const qz of quizQuestions) {
    if (matches(qz.question) || matches(qz.topic)) {
      const mod = modules.find((m) => m.id === qz.moduleId);
      results.push({
        id: `quiz-${qz.id}`,
        type: "quiz",
        title: qz.question,
        description: qz.topic,
        link: "/quiz",
        context: mod ? `${mod.title}` : "Quiz",
        category: qz.difficulty,
      });
    }
  }

  // Glossary terms
  for (const term of glossary) {
    if (matches(term.term) || matches(term.definition)) {
      results.push({
        id: `glossary-${term.term}`,
        type: "glossary",
        title: term.term,
        description: term.definition,
        link: "/reference",
        context: term.category,
        category: term.category,
      });
    }
  }

  // Oracle functions
  for (const fn of oracleFunctions) {
    if (matches(fn.name) || matches(fn.description)) {
      results.push({
        id: `function-${fn.name}`,
        type: "function",
        title: fn.name,
        description: fn.description,
        link: "/reference",
        context: fn.category,
        category: fn.category,
      });
    }
  }

  return results;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [recent, setRecent] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load recent searches from localStorage after mount (avoid SSR mismatch)
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const recordRecent = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((r) => r !== trimmed)].slice(
        0,
        MAX_RECENT,
      );
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const removeRecent = useCallback((term: string) => {
    setRecent((prev) => {
      const next = prev.filter((r) => r !== term);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // Run search
  const handleSearch = useCallback(
    (term: string) => {
      setQuery(term);
      setActiveQuery(term);
      if (term.trim()) recordRecent(term);
    },
    [recordRecent],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch(query);
    },
    [query, handleSearch],
  );

  // Compute results
  const allResults = useMemo(() => buildResults(activeQuery), [activeQuery]);

  const filtered = useMemo(() => {
    if (filter === "all") return allResults;
    const map: Record<FilterType, ResultType[]> = {
      all: [],
      courses: ["course", "lesson"],
      quizzes: ["quiz"],
      glossary: ["glossary"],
      functions: ["function"],
    };
    const allowed = map[filter];
    return allResults.filter((r) => allowed.includes(r.type));
  }, [allResults, filter]);

  // Group results by type for display
  const grouped = useMemo(() => {
    const groups = new Map<ResultType, SearchResult[]>();
    for (const r of filtered) {
      if (!groups.has(r.type)) groups.set(r.type, []);
      groups.get(r.type)!.push(r);
    }
    // Preserve a sensible order
    const order: ResultType[] = ["course", "lesson", "quiz", "glossary", "function"];
    return order
      .filter((t) => groups.has(t))
      .map((t) => ({ type: t, items: groups.get(t)! }));
  }, [filtered]);

  // Counts per filter
  const counts = useMemo(() => {
    const c: Record<FilterType, number> = {
      all: allResults.length,
      courses: 0,
      quizzes: 0,
      glossary: 0,
      functions: 0,
    };
    for (const r of allResults) {
      if (r.type === "course" || r.type === "lesson") c.courses++;
      if (r.type === "quiz") c.quizzes++;
      if (r.type === "glossary") c.glossary++;
      if (r.type === "function") c.functions++;
    }
    return c;
  }, [allResults]);

  const hasQuery = activeQuery.trim().length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Search
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Find courses, quizzes, glossary terms, and Oracle functions across the
          entire platform.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={onSubmit} className="relative mb-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a lesson, function, term, quiz…"
            autoFocus
            className="h-14 rounded-full border-2 bg-card/60 pl-14 pr-32 text-base shadow-lg backdrop-blur-sm focus-visible:ring-primary/40"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => {
                  setQuery("");
                  setActiveQuery("");
                }}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="submit"
              className="h-10 rounded-full px-5"
              disabled={!query.trim()}
            >
              Search
            </Button>
          </div>
        </div>
      </form>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const active = filter === f.value;
          return (
            <Button
              key={f.value}
              variant={active ? "default" : "outline"}
              size="sm"
              className={cn(
                "gap-2 rounded-full",
                active && "shadow-md",
              )}
              onClick={() => setFilter(f.value)}
            >
              <Icon className="h-4 w-4" />
              {f.label}
              {counts[f.value] > 0 && (
                <Badge
                  variant={active ? "secondary" : "outline"}
                  className="ml-1 px-1.5 py-0 text-[10px]"
                >
                  {counts[f.value]}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Recent searches (only when no active query) */}
      {!hasQuery && mounted && recent.length > 0 && (
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Recent searches
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={clearRecent}
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((term) => (
              <div
                key={term}
                className="group flex items-center gap-1.5 rounded-full border border-border bg-card/50 py-1 pl-3 pr-1.5 text-sm transition-colors hover:border-primary/50 hover:bg-card"
              >
                <button
                  type="button"
                  className="text-foreground/80 group-hover:text-foreground"
                  onClick={() => handleSearch(term)}
                >
                  {term}
                </button>
                <button
                  type="button"
                  className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => removeRecent(term)}
                  aria-label={`Remove ${term}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {hasQuery && (
        <div className="space-y-8">
          {grouped.length === 0 ? (
            <EmptyState query={activeQuery} />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                result{filtered.length !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold text-foreground">
                  &ldquo;{activeQuery}&rdquo;
                </span>
              </p>

              {grouped.map((group) => {
                const meta = TYPE_META[group.type];
                const Icon = meta.icon;
                return (
                  <section key={group.type}>
                    <div className="mb-3 flex items-center gap-2">
                      <Icon className={cn("h-5 w-5", meta.color)} />
                      <h2 className="text-lg font-semibold">{meta.label}s</h2>
                      <Badge variant="secondary" className="text-xs">
                        {group.items.length}
                      </Badge>
                    </div>
                    <div className="grid gap-3">
                      {group.items.map((r) => (
                        <ResultCard key={r.id} result={r} query={activeQuery} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Default landing state (no query yet) */}
      {!hasQuery && (
        <div className="mt-6">
          {SUGGESTIONS.length > 0 && (
            <div className="text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                Try searching for
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      setQuery(s);
                      handleSearch(s);
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Browse cards */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <BrowseCard
              icon={GraduationCap}
              title="Courses"
              description={`${modules.length} modules with interactive lessons`}
              link="/courses"
              color="text-sky-400"
            />
            <BrowseCard
              icon={Brain}
              title="Quizzes"
              description={`${quizQuestions.length} practice questions`}
              link="/quiz"
              color="text-amber-400"
            />
            <BrowseCard
              icon={Library}
              title="Glossary"
              description={`${glossary.length} terms and definitions`}
              link="/reference"
              color="text-violet-400"
            />
            <BrowseCard
              icon={FunctionSquare}
              title="Oracle Functions"
              description={`${oracleFunctions.length} built-in functions`}
              link="/reference"
              color="text-rose-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result card                                                         */
/* ------------------------------------------------------------------ */

function ResultCard({
  result,
  query,
}: {
  result: SearchResult;
  query: string;
}) {
  const meta = TYPE_META[result.type];
  const Icon = meta.icon;

  return (
    <Link href={result.link} className="block">
      <Card className="group cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted",
              meta.color,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base leading-snug">
                <Highlight text={result.title} query={query} />
              </CardTitle>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              <Highlight text={result.description} query={query} />
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {meta.label}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {result.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {result.context}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Browse card                                                         */
/* ------------------------------------------------------------------ */

function BrowseCard({
  icon: Icon,
  title,
  description,
  link,
  color,
}: {
  icon: typeof Search;
  title: string;
  description: string;
  link: string;
  color: string;
}) {
  return (
    <Link href={link} className="block">
      <Card className="group cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted",
              color,
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="truncate text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </CardContent>
      </Card>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

function EmptyState({ query }: { query: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No results found</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t find anything matching{" "}
          <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>.
          Try a different keyword or browse the suggestions below.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {SUGGESTIONS.slice(0, 4).map((s) => (
            <Link key={s} href={`/search?q=${encodeURIComponent(s)}`}>
              <Badge
                variant="outline"
                className="cursor-pointer px-3 py-1 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {s}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Highlight helper                                                    */
/* ------------------------------------------------------------------ */

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  // Escape regex special characters
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark
            key={i}
            className="rounded bg-primary/20 px-0.5 text-foreground"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
