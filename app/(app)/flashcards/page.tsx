"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Layers,
  RotateCcw,
  CheckCircle2,
  Brain,
  ChevronLeft,
  ChevronRight,
  Zap,
  Trophy,
  Calendar,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modules } from "@/lib/modules-data";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

// Collect every flashcard from every module/lesson into a flat list.
const allFlashcards = modules.flatMap((module) =>
  module.lessons.flatMap((lesson) =>
    lesson.flashcards.map((flashcard) => ({
      ...flashcard,
      moduleTitle: module.title,
      moduleId: module.id,
    })),
  ),
);

const allCategories = Array.from(
  new Set(allFlashcards.map((card) => card.category)),
).sort();

type Rating = {
  label: string;
  value: number;
  className: string;
  description: string;
};

const ratings: Rating[] = [
  {
    label: "Again",
    value: 0,
    className:
      "bg-rose-500 hover:bg-rose-600 text-white border-rose-500 hover:border-rose-600",
    description: "Didn't recall — show again soon",
  },
  {
    label: "Hard",
    value: 1,
    className:
      "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 hover:border-amber-600",
    description: "Recalled with difficulty",
  },
  {
    label: "Good",
    value: 2,
    className:
      "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600",
    description: "Recalled with some effort",
  },
  {
    label: "Easy",
    value: 3,
    className:
      "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 hover:border-emerald-600",
    description: "Recalled instantly",
  },
];

export default function FlashcardsPage() {
  const { progress, loaded, updateFlashcard } = useProgress();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [queue, setQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [animating, setAnimating] = useState(false);

  // A card is "due" if its due date is in the past, or it has no progress yet.
  const isCardDue = useCallback(
    (cardId: string) => {
      const record = progress.flashcardProgress[cardId];
      if (!record) return true;
      return new Date(record.due).getTime() <= Date.now();
    },
    [progress.flashcardProgress],
  );

  // Stats computed across all cards (independent of the active category filter).
  const stats = useMemo(() => {
    const total = allFlashcards.length;
    let dueToday = 0;
    let learned = 0;
    for (const card of allFlashcards) {
      const record = progress.flashcardProgress[card.id];
      if (!record) {
        dueToday += 1;
        continue;
      }
      if (new Date(record.due).getTime() <= Date.now()) {
        dueToday += 1;
      }
      if (record.reps >= 3 && record.interval >= 1) {
        learned += 1;
      }
    }
    return { total, dueToday, learned };
  }, [progress.flashcardProgress]);

  // Cards due within the selected category, sorted: due first, then new.
  const dueCards = useMemo(() => {
    const filtered =
      selectedCategory === "all"
        ? allFlashcards
        : allFlashcards.filter((card) => card.category === selectedCategory);

    const due: typeof allFlashcards = [];
    const fresh: typeof allFlashcards = [];
    for (const card of filtered) {
      const record = progress.flashcardProgress[card.id];
      if (!record) {
        fresh.push(card);
      } else if (new Date(record.due).getTime() <= Date.now()) {
        due.push(card);
      }
    }
    // Due cards sorted by soonest due date first.
    due.sort((a, b) => {
      const da = new Date(progress.flashcardProgress[a.id].due).getTime();
      const db = new Date(progress.flashcardProgress[b.id].due).getTime();
      return da - db;
    });
    return [...due, ...fresh];
  }, [selectedCategory, progress.flashcardProgress]);

  const startSession = useCallback(() => {
    setQueue(dueCards.map((card) => card.id));
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
    setSessionStarted(true);
  }, [dueCards]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleRate = useCallback(
    (quality: number) => {
      const cardId = queue[currentIndex];
      if (!cardId) return;
      updateFlashcard(cardId, quality);
      setReviewedCount((count) => count + 1);

      // Brief flip-back animation before advancing to the next card.
      setAnimating(true);
      setIsFlipped(false);
      window.setTimeout(() => {
        if (currentIndex + 1 >= queue.length) {
          // Session complete — stay on last index; completion screen renders.
          setCurrentIndex(queue.length);
        } else {
          setCurrentIndex((i) => i + 1);
        }
        setAnimating(false);
      }, 250);
    },
    [queue, currentIndex, updateFlashcard],
  );

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, queue.length]);

  const restart = useCallback(() => {
    setSessionStarted(false);
    setQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
  }, []);

  const currentCard = useMemo(() => {
    if (!sessionStarted || currentIndex >= queue.length) return null;
    return allFlashcards.find((card) => card.id === queue[currentIndex]) ?? null;
  }, [sessionStarted, currentIndex, queue]);

  const currentRecord = currentCard
    ? progress.flashcardProgress[currentCard.id]
    : undefined;

  const sessionComplete = sessionStarted && currentIndex >= queue.length;
  const progressPercent = queue.length
    ? (reviewedCount / queue.length) * 100
    : 0;

  // Keyboard shortcuts: space/enter to flip, 1-4 to rate when flipped.
  useEffect(() => {
    if (!sessionStarted || sessionComplete || !currentCard) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped && !animating) {
        const num = Number(e.key);
        if (num >= 1 && num <= 4) {
          e.preventDefault();
          handleRate(ratings[num - 1].value);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    sessionStarted,
    sessionComplete,
    currentCard,
    isFlipped,
    animating,
    handleRate,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Flashcards</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Spaced repetition study — review what&apos;s due, learn what&apos;s
            new
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main study area */}
          <div className="space-y-6">
            {/* Setup screen */}
            {!sessionStarted && (
              <Card className="animate-slide-up border-2 border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Brain className="h-5 w-5 text-primary" />
                    Study Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Filter by category
                    </label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {allCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Due count summary */}
                  <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold leading-none">
                          {dueCards.length}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          card{dueCards.length !== 1 ? "s" : ""} ready to study
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/5 text-primary"
                    >
                      {selectedCategory === "all"
                        ? "All categories"
                        : selectedCategory}
                    </Badge>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={startSession}
                    disabled={dueCards.length === 0}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    {dueCards.length > 0
                      ? "Start Studying"
                      : "No Cards Due"}
                  </Button>
                  {dueCards.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                      You&apos;re all caught up! Come back later or switch
                      categories.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Study session */}
            {sessionStarted && !sessionComplete && currentCard && (
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted-foreground">
                      Card {currentIndex + 1} of {queue.length}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {reviewedCount} reviewed
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>

                {/* Flashcard with 3D flip */}
                <div
                  className="relative h-80 w-full cursor-pointer select-none sm:h-96"
                  style={{ perspective: "1200px" }}
                  onClick={handleFlip}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      handleFlip();
                    }
                  }}
                >
                  <div
                    className={cn(
                      "relative h-full w-full transition-transform duration-500 ease-out",
                      isFlipped ? "[transform:rotateY(180deg)]" : "",
                    )}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Front face (question) */}
                    <div
                      className="absolute inset-0 flex flex-col"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <Card className="flex h-full w-full flex-col border-2 border-border/50 bg-gradient-to-br from-card to-primary/5 shadow-xl">
                        <CardHeader className="shrink-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="font-normal">
                              {currentCard.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="font-normal text-muted-foreground"
                            >
                              {currentRecord ? "Due" : "New"}
                            </Badge>
                          </div>
                          <CardTitle className="mt-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                            <Brain className="h-4 w-4" />
                            Question
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col items-center justify-center text-center">
                          <p className="text-xl font-medium leading-relaxed sm:text-2xl">
                            {currentCard.front}
                          </p>
                          <p className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <RefreshCw className="h-3.5 w-3.5" />
                            Click to flip
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Back face (answer) */}
                    <div
                      className="absolute inset-0 flex flex-col"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <Card className="flex h-full w-full flex-col border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-card shadow-xl">
                        <CardHeader className="shrink-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="font-normal">
                              {currentCard.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-primary/30 bg-primary/10 text-primary"
                            >
                              Answer
                            </Badge>
                          </div>
                          <CardTitle className="mt-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4" />
                            Answer
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col items-center justify-center text-center">
                          <p className="text-lg leading-relaxed sm:text-xl">
                            {currentCard.back}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Navigation + rating controls */}
                <div className="space-y-4">
                  {/* Prev / Next nav (always available) */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Prev
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {isFlipped
                        ? "Rate your recall"
                        : "Flip the card to reveal the answer"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNext}
                      disabled={currentIndex >= queue.length - 1}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Rating buttons — only visible after flipping */}
                  <div
                    className={cn(
                      "grid grid-cols-2 gap-3 transition-all duration-300 sm:grid-cols-4",
                      isFlipped
                        ? "opacity-100"
                        : "pointer-events-none opacity-0",
                    )}
                  >
                    {ratings.map((rating) => (
                      <Button
                        key={rating.value}
                        variant="outline"
                        className={cn(
                          "flex flex-col gap-0.5 py-3 transition-all",
                          rating.className,
                        )}
                        onClick={() => handleRate(rating.value)}
                        disabled={animating}
                        title={rating.description}
                      >
                        <span className="text-sm font-semibold">
                          {rating.label}
                        </span>
                        <span className="text-[10px] opacity-80">
                          {rating.value}
                        </span>
                      </Button>
                    ))}
                  </div>

                  {/* Keyboard hint */}
                  <p className="text-center text-xs text-muted-foreground">
                    Shortcuts:{" "}
                    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                      Space
                    </kbd>{" "}
                    to flip ·{" "}
                    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                      1-4
                    </kbd>{" "}
                    to rate
                  </p>
                </div>
              </div>
            )}

            {/* Completion screen */}
            {sessionComplete && (
              <Card className="animate-scale-in border-2 border-border/50 shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
                    <Trophy className="h-10 w-10 text-emerald-500" />
                  </div>
                  <CardTitle className="text-2xl">Session Complete!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold gradient-text">
                      {reviewedCount}
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      card{reviewedCount !== 1 ? "s" : ""} reviewed this
                      session
                    </p>
                  </div>

                  {loaded && (
                    <p className="text-center text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">
                        +{reviewedCount * 5} XP
                      </span>{" "}
                      earned · Total: {progress.xp} XP
                    </p>
                  )}

                  <div className="rounded-lg bg-muted/40 p-4 text-center text-sm">
                    <p className="text-muted-foreground">
                      Great work! Spaced repetition helps move knowledge into
                      long-term memory. Review again when cards are due.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full"
                      onClick={restart}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Back to Setup
                    </Button>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={startSession}
                      disabled={dueCards.length === 0}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Study Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stats sidebar */}
          <aside className="space-y-4">
            <Card className="border-2 border-border/50 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Total cards */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Total cards</p>
                    <p className="text-xl font-bold">{stats.total}</p>
                  </div>
                </div>

                {/* Due today */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Calendar className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Due today</p>
                    <p className="text-xl font-bold">{stats.dueToday}</p>
                  </div>
                </div>

                {/* Learned */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Learned</p>
                    <p className="text-xl font-bold">{stats.learned}</p>
                  </div>
                </div>

                {/* Learning progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Mastery</span>
                    <span className="font-medium">
                      {stats.total > 0
                        ? Math.round((stats.learned / stats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={stats.total > 0 ? (stats.learned / stats.total) * 100 : 0}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category breakdown */}
            <Card className="border-2 border-border/50 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="h-5 w-5 text-primary" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {allCategories.map((category) => {
                  const total = allFlashcards.filter(
                    (card) => card.category === category,
                  ).length;
                  const due = allFlashcards.filter(
                    (card) =>
                      card.category === category && isCardDue(card.id),
                  ).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        selectedCategory === category
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-accent/5",
                      )}
                    >
                      <span className="font-medium">{category}</span>
                      <div className="flex items-center gap-2">
                        {due > 0 && (
                          <Badge
                            variant="outline"
                            className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          >
                            {due} due
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {total}
                        </span>
                      </div>
                    </button>
                  );
                })}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    selectedCategory === "all"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/5",
                  )}
                >
                  <span className="font-medium">All Categories</span>
                  <span className="text-xs text-muted-foreground">
                    {allFlashcards.length}
                  </span>
                </button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
