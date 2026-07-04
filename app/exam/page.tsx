"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { quizQuestions } from "@/lib/quiz-data";
import { useProgress } from "@/hooks/use-progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Flag,
  RotateCcw,
  Trophy,
  Target,
  BookOpen,
  Lightbulb,
  X,
} from "lucide-react";

type ExamPhase = "setup" | "exam" | "review" | "results";

interface ExamQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

const PASS_THRESHOLD = 63;
const FULL_EXAM_MINUTES = 100;
const FULL_EXAM_QUESTIONS = 63;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function ExamPage() {
  const { recordExam } = useProgress();

  const [phase, setPhase] = useState<ExamPhase>("setup");
  const [questionCount, setQuestionCount] = useState<number>(63);
  const [customCount, setCustomCount] = useState<string>("");
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer effect
  useEffect(() => {
    if (phase !== "exam") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startExam = useCallback(() => {
    let count = questionCount;
    if (count === -1) {
      const parsed = parseInt(customCount, 10);
      if (isNaN(parsed) || parsed < 1) return;
      count = Math.min(parsed, quizQuestions.length);
    }
    const selected = shuffle(quizQuestions).slice(0, count);
    const minutes = Math.ceil((count / FULL_EXAM_QUESTIONS) * FULL_EXAM_MINUTES);
    setExamQuestions(selected);
    setAnswers({});
    setMarkedForReview(new Set());
    setCurrentIndex(0);
    setTimeRemaining(minutes * 60);
    setStartTime(Date.now());
    setPhase("exam");
  }, [questionCount, customCount]);

  const selectAnswer = useCallback((qIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  }, []);

  const toggleMark = useCallback((qIndex: number) => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(qIndex)) next.delete(qIndex);
      else next.add(qIndex);
      return next;
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1));
  }, [examQuestions.length]);

  const handleSubmitExam = useCallback(() => {
    setEndTime(Date.now());
    setPhase("review");
  }, []);

  const finishExam = useCallback(() => {
    const timeTaken = Math.round((endTime - startTime) / 1000);
    const score = examQuestions.reduce(
      (acc, q, i) => (answers[i] === q.correctIndex ? acc + 1 : acc),
      0,
    );
    recordExam(score, examQuestions.length, timeTaken);
    setPhase("results");
  }, [endTime, startTime, examQuestions, answers, recordExam]);

  const retakeExam = useCallback(() => {
    setPhase("setup");
    setExamQuestions([]);
    setAnswers({});
    setMarkedForReview(new Set());
    setCurrentIndex(0);
    setTimeRemaining(0);
  }, []);

  const score = examQuestions.reduce(
    (acc, q, i) => (answers[i] === q.correctIndex ? acc + 1 : acc),
    0,
  );
  const scorePercent = examQuestions.length
    ? Math.round((score / examQuestions.length) * 100)
    : 0;
  const passed = scorePercent >= PASS_THRESHOLD;
  const timeTaken = Math.round((endTime - startTime) / 1000);
  const answeredCount = Object.keys(answers).length;
  const lowTime = timeRemaining <= 300 && phase === "exam";

  // ===================== SETUP SCREEN =====================
  if (phase === "setup") {
    const presets = [20, 40, 63];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Oracle 1Z0-071 Exam Simulator
            </h1>
            <p className="text-muted-foreground">
              Practice under real exam conditions. 100 minutes, 63 questions, 63%
              to pass.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Exam Configuration
              </CardTitle>
              <CardDescription>
                Choose the number of questions for your practice exam. Time is
                scaled proportionally to the real exam.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Number of Questions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {presets.map((n) => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className={cn(
                        "rounded-lg border-2 p-4 text-center transition-all",
                        questionCount === n
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      <div className="text-2xl font-bold">{n}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.ceil((n / FULL_EXAM_QUESTIONS) * FULL_EXAM_MINUTES)}{" "}
                        min
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setQuestionCount(-1)}
                    className={cn(
                      "rounded-lg border-2 p-4 text-center transition-all",
                      questionCount === -1
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className="text-2xl font-bold">Custom</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Up to {quizQuestions.length}
                    </div>
                  </button>
                </div>
              </div>

              {questionCount === -1 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Custom Question Count
                  </h3>
                  <input
                    type="number"
                    min={1}
                    max={quizQuestions.length}
                    value={customCount}
                    onChange={(e) => setCustomCount(e.target.value)}
                    placeholder={`Enter 1-${quizQuestions.length}`}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-muted/50 p-4">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm font-medium">
                    {questionCount === -1
                      ? Math.ceil(
                          (Math.min(
                            parseInt(customCount, 10) || 1,
                            quizQuestions.length,
                          ) /
                            FULL_EXAM_QUESTIONS) *
                            FULL_EXAM_MINUTES,
                        )
                      : Math.ceil(
                          (questionCount / FULL_EXAM_QUESTIONS) *
                            FULL_EXAM_MINUTES,
                        )}{" "}
                    minutes
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Time limit
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <Target className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm font-medium">{PASS_THRESHOLD}%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Pass score
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <BookOpen className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm font-medium">
                    {questionCount === -1
                      ? Math.min(
                          parseInt(customCount, 10) || 1,
                          quizQuestions.length,
                        )
                      : questionCount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Questions
                  </div>
                </div>
              </div>

              <Button
                onClick={startExam}
                size="lg"
                className="w-full"
                disabled={questionCount === -1 && (!customCount || parseInt(customCount, 10) < 1)}
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Start Exam
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-sm">Timed</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Real exam pressure with countdown timer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Flag className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-sm">Mark for Review</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Flag questions to revisit before submitting
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-sm">Detailed Review</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Full explanations for every question
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ===================== EXAM SCREEN =====================
  if (phase === "exam" && examQuestions.length > 0) {
    const currentQ = examQuestions[currentIndex];
    const isAnswered = answers[currentIndex] !== undefined;
    const isMarked = markedForReview.has(currentIndex);
    const progressPercent = (answeredCount / examQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        {/* Header with timer */}
        <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              <div>
                <h1 className="font-semibold text-sm">1Z0-071 Exam Simulator</h1>
                <p className="text-xs text-muted-foreground">
                  Question {currentIndex + 1} of {examQuestions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Progress
                  value={progressPercent}
                  className="w-24 hidden sm:block"
                />
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  {answeredCount}/{examQuestions.length} answered
                </Badge>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg tabular-nums",
                  lowTime
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse"
                    : "bg-primary/10 text-primary",
                )}
              >
                <Clock className="w-5 h-5" />
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar - Question Navigation */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Question Navigator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-5 gap-2">
                    {examQuestions.map((_, i) => {
                      const answered = answers[i] !== undefined;
                      const marked = markedForReview.has(i);
                      const isCurrent = i === currentIndex;
                      return (
                        <button
                          key={i}
                          onClick={() => goToQuestion(i)}
                          className={cn(
                            "relative aspect-square rounded-md text-xs font-medium transition-all border-2",
                            isCurrent && "ring-2 ring-primary ring-offset-1",
                            marked && !answered && "border-amber-500 bg-amber-50 dark:bg-amber-950/30",
                            marked && answered && "border-amber-500 bg-amber-100 dark:bg-amber-900/40",
                            !marked && answered && "border-green-500 bg-green-50 dark:bg-green-950/30",
                            !marked && !answered && "border-border bg-background hover:border-primary/50",
                          )}
                        >
                          {i + 1}
                          {marked && (
                            <Flag className="absolute -top-1 -right-1 w-3 h-3 text-amber-500 fill-amber-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <Separator />
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-50 dark:bg-green-950/30" />
                      <span className="text-muted-foreground">Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/30" />
                      <span className="text-muted-foreground">Marked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-border bg-background" />
                      <span className="text-muted-foreground">Unanswered</span>
                    </div>
                  </div>
                  <Separator />
                  <Button
                    onClick={handleSubmitExam}
                    variant="default"
                    className="w-full"
                    size="sm"
                  >
                    Submit Exam
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Question Area */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">
                          Question {currentIndex + 1}
                        </Badge>
                        <Badge
                          variant={
                            currentQ.difficulty === "easy"
                              ? "secondary"
                              : currentQ.difficulty === "medium"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {currentQ.difficulty}
                        </Badge>
                        <Badge variant="outline">{currentQ.topic}</Badge>
                      </div>
                      <CardTitle className="text-lg leading-relaxed pt-2">
                        {currentQ.question}
                      </CardTitle>
                    </div>
                    <Button
                      variant={isMarked ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleMark(currentIndex)}
                      className="shrink-0"
                    >
                      <Flag
                        className={cn(
                          "w-4 h-4 mr-1",
                          isMarked && "fill-current",
                        )}
                      />
                      {isMarked ? "Marked" : "Mark"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[currentIndex]?.toString()}
                    onValueChange={(val) =>
                      selectAnswer(currentIndex, parseInt(val, 10))
                    }
                    className="space-y-3"
                  >
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = answers[currentIndex] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={cn(
                            "flex items-start space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30 hover:bg-muted/30",
                          )}
                          onClick={() => selectAnswer(currentIndex, optIdx)}
                        >
                          <RadioGroupItem
                            value={optIdx.toString()}
                            id={`q-${currentIndex}-opt-${optIdx}`}
                            className="mt-0.5"
                          />
                          <label
                            htmlFor={`q-${currentIndex}-opt-${optIdx}`}
                            className="text-sm leading-relaxed cursor-pointer flex-1"
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {option}
                          </label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  {currentIndex + 1} / {examQuestions.length}
                </div>
                {currentIndex === examQuestions.length - 1 ? (
                  <Button onClick={handleSubmitExam}>
                    Review & Submit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={goNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================== REVIEW SCREEN =====================
  if (phase === "review" && examQuestions.length > 0) {
    const answeredCount = Object.keys(answers).length;
    const markedCount = markedForReview.size;
    const unansweredCount = examQuestions.length - answeredCount;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
              <AlertCircle className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Review Before Submitting</h1>
            <p className="text-muted-foreground text-sm">
              Check your answers before final submission. You cannot change
              answers after submitting.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Exam Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {answeredCount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Answered
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">
                    {markedCount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Marked for Review
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">
                    {unansweredCount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Unanswered
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time remaining</span>
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">All Questions</CardTitle>
              <CardDescription>
                Click any question to jump back and change your answer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {examQuestions.map((q, i) => {
                    const answered = answers[i] !== undefined;
                    const marked = markedForReview.has(i);
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentIndex(i);
                          setPhase("exam");
                        }}
                        className="w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:bg-muted/50"
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                            answered
                              ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
                          )}
                        >
                          {answered ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">
                              Q{i + 1}
                            </span>
                            {marked && (
                              <Badge
                                variant="outline"
                                className="text-amber-600 border-amber-500 text-xs"
                              >
                                <Flag className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                                Marked
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {q.question}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground shrink-0">
                          {answered
                            ? `Answer: ${String.fromCharCode(65 + answers[i])}`
                            : "Not answered"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {unansweredCount > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                You have {unansweredCount} unanswered{" "}
                {unansweredCount === 1 ? "question" : "questions"}. There is no
                penalty for guessing on the real exam.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setPhase("exam")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Exam
            </Button>
            <Button size="lg" className="flex-1" onClick={finishExam}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit Final Answers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ===================== RESULTS SCREEN =====================
  if (phase === "results" && examQuestions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score Header */}
          <Card className="mb-6 overflow-hidden">
            <div
              className={cn(
                "p-8 text-center text-white",
                passed
                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                  : "bg-gradient-to-br from-red-500 to-rose-600",
              )}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur mb-4">
                {passed ? (
                  <Trophy className="w-10 h-10" />
                ) : (
                  <X className="w-10 h-10" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {passed ? "Congratulations!" : "Keep Practicing"}
              </h1>
              <p className="text-white/80 text-lg mb-4">
                {passed ? "You passed the exam!" : "You did not pass this time"}
              </p>
              <div className="text-6xl font-bold mb-2">{scorePercent}%</div>
              <p className="text-white/80">
                {score} out of {examQuestions.length} correct
              </p>
            </div>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <Target className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">
                    Pass threshold
                  </div>
                  <div className="font-semibold">{PASS_THRESHOLD}%</div>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">Time taken</div>
                  <div className="font-semibold font-mono">
                    {formatTime(timeTaken)}
                  </div>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">Correct</div>
                  <div className="font-semibold">
                    {score} / {examQuestions.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Review */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Detailed Review
              </CardTitle>
              <CardDescription>
                Review each question with the correct answer and explanation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {examQuestions.map((q, i) => {
                    const userAnswer = answers[i];
                    const isCorrect = userAnswer === q.correctIndex;
                    const wasAnswered = userAnswer !== undefined;
                    return (
                      <div
                        key={q.id}
                        className={cn(
                          "rounded-lg border-2 p-4",
                          isCorrect
                            ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/10"
                            : "border-red-500/50 bg-red-50/50 dark:bg-red-950/10",
                        )}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={cn(
                              "flex items-center justify-center w-7 h-7 rounded-full shrink-0",
                              isCorrect
                                ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
                            )}
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-medium">
                                Question {i + 1}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {q.topic}
                              </Badge>
                              <Badge
                                variant={
                                  q.difficulty === "easy"
                                    ? "secondary"
                                    : q.difficulty === "medium"
                                      ? "default"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {q.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium leading-relaxed">
                              {q.question}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 ml-10">
                          {q.options.map((option, optIdx) => {
                            const isUserAnswer = userAnswer === optIdx;
                            const isCorrectAnswer = q.correctIndex === optIdx;
                            return (
                              <div
                                key={optIdx}
                                className={cn(
                                  "flex items-start gap-2 rounded-md p-2 text-sm",
                                  isCorrectAnswer &&
                                    "bg-green-100 dark:bg-green-950/30",
                                  isUserAnswer &&
                                    !isCorrectAnswer &&
                                    "bg-red-100 dark:bg-red-950/30",
                                  !isCorrectAnswer &&
                                    !isUserAnswer &&
                                    "opacity-60",
                                )}
                              >
                                <span className="font-medium shrink-0">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span className="flex-1">{option}</span>
                                {isCorrectAnswer && (
                                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <X className="w-4 h-4 text-red-600 shrink-0" />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {!wasAnswered && (
                          <div className="ml-10 mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <Circle className="w-3 h-3" />
                            Not answered
                          </div>
                        )}

                        <div className="ml-10 mt-3 flex items-start gap-2 rounded-md bg-blue-50 dark:bg-blue-950/20 p-3">
                          <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setPhase("review")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Review
            </Button>
            <Button size="lg" className="flex-1" onClick={retakeExam}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Exam
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
