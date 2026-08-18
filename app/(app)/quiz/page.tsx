"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Target,
  Lightbulb,
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
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quizQuestions } from "@/lib/quiz-data";
import { modules } from "@/lib/modules-data";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

type Difficulty = "all" | "easy" | "medium" | "hard";
type Phase = "setup" | "question" | "feedback" | "results";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const difficultyConfig: Record<
  "easy" | "medium" | "hard",
  { label: string; className: string }
> = {
  easy: {
    label: "Easy",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  hard: {
    label: "Hard",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
};

export default function QuizPage() {
  const { progress, loaded, recordQuiz } = useProgress();

  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("all");
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState(quizQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ questionId: string; correct: boolean }>
  >([]);
  const [recorded, setRecorded] = useState(false);

  // Filtered question count for the setup screen preview
  const availableCount = useMemo(() => {
    return quizQuestions.filter((q) => {
      if (selectedModule !== "all" && q.moduleId !== selectedModule)
        return false;
      if (
        selectedDifficulty !== "all" &&
        q.difficulty !== selectedDifficulty
      )
        return false;
      return true;
    }).length;
  }, [selectedModule, selectedDifficulty]);

  const startQuiz = useCallback(() => {
    const filtered = shuffle(
      quizQuestions.filter((q) => {
        if (selectedModule !== "all" && q.moduleId !== selectedModule)
          return false;
        if (
          selectedDifficulty !== "all" &&
          q.difficulty !== selectedDifficulty
        )
          return false;
        return true;
      }),
    );
    if (filtered.length === 0) return;
    setQuestions(filtered);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
    setRecorded(false);
    setPhase("question");
  }, [selectedModule, selectedDifficulty]);

  const handleSubmit = useCallback(() => {
    if (selectedAnswer === null) return;
    const current = questions[currentIndex];
    const isCorrect = selectedAnswer === current.correctIndex;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [
      ...prev,
      { questionId: current.id, correct: isCorrect },
    ]);
    setPhase("feedback");
  }, [selectedAnswer, questions, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setPhase("results");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setPhase("question");
    }
  }, [currentIndex, questions.length]);

  // Record quiz result once when entering results
  useEffect(() => {
    if (phase === "results" && !recorded && loaded) {
      const quizId =
        selectedModule === "all"
          ? `quiz-all-${selectedDifficulty}`
          : `quiz-${selectedModule}-${selectedDifficulty}`;
      recordQuiz(quizId, score, questions.length);
      setRecorded(true);
    }
  }, [
    phase,
    recorded,
    loaded,
    recordQuiz,
    score,
    questions.length,
    selectedModule,
    selectedDifficulty,
  ]);

  const restart = useCallback(() => {
    setPhase("setup");
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
    setRecorded(false);
  }, []);

  const current = questions[currentIndex];
  const progressPercent = questions.length
    ? ((currentIndex + (phase === "feedback" || phase === "results" ? 1 : 0)) /
        questions.length) *
      100
    : 0;
  const scorePercent = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Quiz Practice</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Test your Oracle SQL knowledge with instant feedback
          </p>
        </div>

        {/* Setup Phase */}
        {phase === "setup" && (
          <Card className="animate-slide-up border-2 border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-primary" />
                Configure Your Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Module selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Module
                </Label>
                <Select
                  value={selectedModule}
                  onValueChange={setSelectedModule}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {modules.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.number}. {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Difficulty</Label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={(v) =>
                    setSelectedDifficulty(v as Difficulty)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty badges preview */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Levels:</span>
                <Badge
                  variant="outline"
                  className={difficultyConfig.easy.className}
                >
                  Easy
                </Badge>
                <Badge
                  variant="outline"
                  className={difficultyConfig.medium.className}
                >
                  Medium
                </Badge>
                <Badge
                  variant="outline"
                  className={difficultyConfig.hard.className}
                >
                  Hard
                </Badge>
              </div>

              {/* Available count + start */}
              <div className="flex flex-col items-center gap-4 border-t pt-6 sm:flex-row sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {availableCount}
                  </span>{" "}
                  question{availableCount !== 1 ? "s" : ""} available
                </div>
                <Button
                  size="lg"
                  onClick={startQuiz}
                  disabled={availableCount === 0}
                  className="w-full sm:w-auto"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Start Quiz
                </Button>
              </div>
              {availableCount === 0 && (
                <p className="text-center text-sm text-destructive">
                  No questions match your filters. Try a different
                  selection.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Question + Feedback Phases */}
        {(phase === "question" || phase === "feedback") && current && (
          <div className="space-y-4">
            {/* Progress + score bar */}
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Score: {score}
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            <Card
              key={current.id}
              className="animate-slide-up border-2 border-border/50 shadow-lg"
            >
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={difficultyConfig[current.difficulty].className}
                  >
                    {difficultyConfig[current.difficulty].label}
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    {current.topic}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-lg leading-relaxed">
                  {current.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={selectedAnswer?.toString() ?? ""}
                  onValueChange={(v) =>
                    phase === "question" && setSelectedAnswer(Number(v))
                  }
                  className="gap-3"
                  disabled={phase === "feedback"}
                >
                  {current.options.map((option, idx) => {
                    const isCorrectOption =
                      idx === current.correctIndex;
                    const isSelectedOption = selectedAnswer === idx;
                    const showCorrect =
                      phase === "feedback" && isCorrectOption;
                    const showIncorrect =
                      phase === "feedback" &&
                      isSelectedOption &&
                      !isCorrectOption;

                    return (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border p-3 transition-all duration-200",
                          "hover:bg-accent/5",
                          phase === "question" &&
                            selectedAnswer === idx &&
                            "border-primary bg-primary/5 ring-1 ring-primary",
                          showCorrect &&
                            "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                          showIncorrect &&
                            "border-rose-500 bg-rose-50 dark:bg-rose-950/30",
                          phase === "feedback" &&
                            !showCorrect &&
                            !showIncorrect &&
                            "opacity-60",
                        )}
                      >
                        <RadioGroupItem
                          value={idx.toString()}
                          id={`option-${idx}`}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={`option-${idx}`}
                          className="flex-1 cursor-pointer text-sm leading-relaxed"
                        >
                          {option}
                        </Label>
                        {showCorrect && (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500 animate-scale-in" />
                        )}
                        {showIncorrect && (
                          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500 animate-scale-in" />
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>

                {/* Feedback */}
                {phase === "feedback" && (
                  <div className="animate-slide-up space-y-3">
                    <div
                      className={cn(
                        "flex items-start gap-3 rounded-lg p-4",
                        selectedAnswer === current.correctIndex
                          ? "bg-emerald-50 dark:bg-emerald-950/30"
                          : "bg-rose-50 dark:bg-rose-950/30",
                      )}
                    >
                      {selectedAnswer === current.correctIndex ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                      )}
                      <div className="space-y-1">
                        <p
                          className={cn(
                            "font-semibold",
                            selectedAnswer === current.correctIndex
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-rose-700 dark:text-rose-400",
                          )}
                        >
                          {selectedAnswer === current.correctIndex
                            ? "Correct!"
                            : "Incorrect"}
                        </p>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                          <span>{current.explanation}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleNext}
                    >
                      {currentIndex + 1 >= questions.length
                        ? "See Results"
                        : "Next Question"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Submit */}
                {phase === "question" && (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                  >
                    Submit Answer
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Phase */}
        {phase === "results" && (
          <Card className="animate-scale-in border-2 border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score display */}
              <div className="text-center">
                <div className="text-5xl font-bold gradient-text">
                  {scorePercent}%
                </div>
                <p className="mt-2 text-muted-foreground">
                  You scored{" "}
                  <span className="font-semibold text-foreground">
                    {score}
                  </span>{" "}
                  out of{" "}
                  <span className="font-semibold text-foreground">
                    {questions.length}
                  </span>
                </p>
              </div>

              {/* Score message */}
              <div
                className={cn(
                  "rounded-lg p-4 text-center text-sm font-medium",
                  scorePercent >= 80
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : scorePercent >= 60
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
                )}
              >
                {scorePercent >= 80
                  ? "Excellent work! You're well prepared for the exam."
                  : scorePercent >= 60
                    ? "Good effort! Review the topics you missed and try again."
                    : "Keep practicing! Review the material and retry the quiz."}
              </div>

              {/* XP earned */}
              {loaded && (
                <p className="text-center text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">
                    +{score * 10} XP
                  </span>{" "}
                  earned · Total: {progress.xp} XP
                </p>
              )}

              {/* Question breakdown */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Question Breakdown</p>
                <div className="flex flex-wrap gap-2">
                  {answers.map((a, idx) => (
                    <div
                      key={a.questionId}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium",
                        a.correct
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
                      )}
                      title={`Question ${idx + 1}: ${a.correct ? "Correct" : "Incorrect"}`}
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={restart}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Quiz
                </Button>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={startQuiz}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry Same Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
