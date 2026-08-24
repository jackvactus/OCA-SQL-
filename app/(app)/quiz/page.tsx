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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isAnswerCorrect, requiredAnswerCount } from "@/lib/quiz-data";
import { getQuestionBank } from "@/lib/quiz-banks";
import { certificationTracks, type TrackId } from "@/lib/certification-tracks";
import { curricula } from "@/lib/curricula";
import { tr } from "@/lib/course-oca-sql";
import { getLocalizedModules } from "@/lib/content-i18n";
import { drawQuestions } from "@/lib/quiz-shuffle";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

type Difficulty = "all" | "easy" | "medium" | "hard";
type Phase = "setup" | "question" | "feedback" | "results";

const difficultyConfig: Record<
  "easy" | "medium" | "hard",
  { fr: string; en: string; className: string }
> = {
  easy: {
    fr: "Facile",
    en: "Easy",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  medium: {
    fr: "Moyen",
    en: "Medium",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  hard: {
    fr: "Difficile",
    en: "Hard",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
};

export default function QuizPage() {
  const { progress, loaded, recordQuiz } = useProgress();
  const { locale, t } = useLanguage();
  const modules = getLocalizedModules(locale);

  const [selectedTrack, setSelectedTrack] = useState<TrackId>("oca-sql");
  const questionBank = getQuestionBank(selectedTrack, locale);

  // Le filtre « module » liste les modules du site pour OCA SQL, et les
  // sessions du cursus correspondant pour les deux parcours OCP.
  const scopeOptions =
    selectedTrack === "oca-sql"
      ? modules.map((m) => ({ id: m.id, label: `${m.number}. ${m.title}` }))
      : (curricula.find((c) => c.id === selectedTrack)?.sessions ?? []).map((session) => ({
          id: session.id,
          label: `${session.number}. ${tr(session.title, locale)}`,
        }));

  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("all");
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState(questionBank);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ questionId: string; correct: boolean }>
  >([]);
  const [recorded, setRecorded] = useState(false);

  const availableCount = useMemo(() => {
    return questionBank.filter((q) => {
      if (selectedModule !== "all" && q.moduleId !== selectedModule)
        return false;
      if (
        selectedDifficulty !== "all" &&
        q.difficulty !== selectedDifficulty
      )
        return false;
      return true;
    }).length;
  }, [questionBank, selectedModule, selectedDifficulty]);

  const startQuiz = useCallback(() => {
    const filtered = drawQuestions(
      questionBank.filter((q) => {
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
    setSelectedAnswers([]);
    setScore(0);
    setAnswers([]);
    setRecorded(false);
    setPhase("question");
  }, [questionBank, selectedModule, selectedDifficulty]);

  const current = questions[currentIndex];
  const needCount = current ? requiredAnswerCount(current) : 1;
  const isMulti = needCount > 1;
  const canSubmit =
    selectedAnswers.length === needCount ||
    (!isMulti && selectedAnswers.length === 1);

  const toggleMulti = useCallback(
    (idx: number) => {
      setSelectedAnswers((prev) => {
        if (prev.includes(idx)) return prev.filter((i) => i !== idx);
        if (prev.length >= needCount) return prev;
        return [...prev, idx];
      });
    },
    [needCount],
  );

  const handleSubmit = useCallback(() => {
    if (!current || !canSubmit) return;
    const correct = isAnswerCorrect(current, selectedAnswers);
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [
      ...prev,
      { questionId: current.id, correct },
    ]);
    setPhase("feedback");
  }, [current, selectedAnswers, canSubmit]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setPhase("results");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswers([]);
      setPhase("question");
    }
  }, [currentIndex, questions.length]);

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
    setSelectedAnswers([]);
    setScore(0);
    setAnswers([]);
    setRecorded(false);
  }, []);

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
        <div className="mb-8 text-center animate-fade-in">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">{t.quizPage.title}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t.quizPage.subtitle}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {questionBank.length} {t.quizPage.stats}{" "}
            {questionBank.filter((q) => q.correctIndexes.length > 1).length}{" "}
            {t.quizPage.statsMulti}
          </p>
        </div>

        {phase === "setup" && (
          <Card className="animate-slide-up border-2 border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-primary" />
                {t.quizPage.configure}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t.quizPage.track}
                </Label>
                <Select
                  value={selectedTrack}
                  onValueChange={(v) => {
                    setSelectedTrack(v as TrackId);
                    setSelectedModule("all");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {certificationTracks.map((track) => (
                      <SelectItem key={track.id} value={track.id}>
                        {track.examCode} — {track.shortLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {selectedTrack === "oca-sql" ? t.quizPage.module : t.quizPage.session}
                </Label>
                <Select
                  value={selectedModule}
                  onValueChange={setSelectedModule}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.quizPage.module} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t.quizPage.scopeAll}
                    </SelectItem>
                    {scopeOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.quizPage.difficulty}</Label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={(v) =>
                    setSelectedDifficulty(v as Difficulty)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.quizPage.difficulty} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.quizPage.difficultyAll}</SelectItem>
                    <SelectItem value="easy">{t.quizPage.easy}</SelectItem>
                    <SelectItem value="medium">{t.quizPage.medium}</SelectItem>
                    <SelectItem value="hard">{t.quizPage.hard}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Niveaux :</span>
                <Badge
                  variant="outline"
                  className={difficultyConfig.easy.className}
                >
                  Facile
                </Badge>
                <Badge
                  variant="outline"
                  className={difficultyConfig.medium.className}
                >
                  Moyen
                </Badge>
                <Badge
                  variant="outline"
                  className={difficultyConfig.hard.className}
                >
                  Difficile
                </Badge>
              </div>

              <div className="flex flex-col items-center gap-4 border-t pt-6 sm:flex-row sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {availableCount}
                  </span>{" "}
                  question{availableCount !== 1 ? "s" : ""} disponible
                  {availableCount !== 1 ? "s" : ""}
                </div>
                <Button
                  size="lg"
                  onClick={startQuiz}
                  disabled={availableCount === 0}
                  className="w-full sm:w-auto"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  {t.quizPage.start}
                </Button>
              </div>
              {availableCount === 0 && (
                <p className="text-center text-sm text-destructive">
                  {t.quizPage.noMatch}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {(phase === "question" || phase === "feedback") && current && (
          <div className="space-y-4">
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Question {currentIndex + 1} / {questions.length}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Score : {score}
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
                    {difficultyConfig[current.difficulty][locale]}
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    {current.topic}
                  </Badge>
                  {isMulti && (
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      {t.quizPage.selectPrompt} {needCount} {t.quizPage.answers}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-3 text-lg leading-relaxed">
                  {current.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isMulti ? (
                  <div className="space-y-3">
                    {current.options.map((option, idx) => {
                      const isCorrectOption =
                        current.correctIndexes.includes(idx);
                      const isSelectedOption = selectedAnswers.includes(idx);
                      const showCorrect =
                        phase === "feedback" && isCorrectOption;
                      const showIncorrect =
                        phase === "feedback" &&
                        isSelectedOption &&
                        !isCorrectOption;

                      return (
                        <label
                          key={idx}
                          className={cn(
                            "flex items-start gap-3 rounded-lg border p-3 transition-all duration-200",
                            phase === "question" && "cursor-pointer hover:bg-accent/5",
                            phase === "question" &&
                              isSelectedOption &&
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
                          <Checkbox
                            checked={isSelectedOption}
                            disabled={phase === "feedback"}
                            onCheckedChange={() =>
                              phase === "question" && toggleMulti(idx)
                            }
                            className="mt-1"
                          />
                          <span className="flex-1 text-sm leading-relaxed">
                            {option}
                          </span>
                          {showCorrect && (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                          )}
                          {showIncorrect && (
                            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedAnswers[0]?.toString() ?? ""}
                    onValueChange={(v) =>
                      phase === "question" && setSelectedAnswers([Number(v)])
                    }
                    className="gap-3"
                    disabled={phase === "feedback"}
                  >
                    {current.options.map((option, idx) => {
                      const isCorrectOption =
                        current.correctIndexes.includes(idx);
                      const isSelectedOption = selectedAnswers.includes(idx);
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
                              isSelectedOption &&
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
                )}

                {phase === "feedback" && (
                  <div className="animate-slide-up space-y-3">
                    <div
                      className={cn(
                        "flex items-start gap-3 rounded-lg p-4",
                        isAnswerCorrect(current, selectedAnswers)
                          ? "bg-emerald-50 dark:bg-emerald-950/30"
                          : "bg-rose-50 dark:bg-rose-950/30",
                      )}
                    >
                      {isAnswerCorrect(current, selectedAnswers) ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                      )}
                      <div className="space-y-1">
                        <p
                          className={cn(
                            "font-semibold",
                            isAnswerCorrect(current, selectedAnswers)
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-rose-700 dark:text-rose-400",
                          )}
                        >
                          {isAnswerCorrect(current, selectedAnswers)
                            ? "Correct !"
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
                        ? t.quizPage.seeResults
                        : locale === "en" ? "Next question" : "Question suivante"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {phase === "question" && (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                  >
                    Valider
                    {isMulti && (
                      <span className="ml-2 text-xs opacity-80">
                        ({selectedAnswers.length}/{needCount})
                      </span>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {phase === "results" && (
          <Card className="animate-scale-in border-2 border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">{t.quizPage.finished}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold gradient-text">
                  {scorePercent}%
                </div>
                <p className="mt-2 text-muted-foreground">
                  Score :{" "}
                  <span className="font-semibold text-foreground">
                    {score}
                  </span>{" "}
                  /{" "}
                  <span className="font-semibold text-foreground">
                    {questions.length}
                  </span>
                </p>
              </div>

              <div
                className={cn(
                  "rounded-lg p-4 text-center text-sm font-medium",
                  scorePercent >= 80
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : scorePercent >= 63
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
                )}
              >
                {scorePercent >= 80
                  ? t.quizPage.verdictHigh
                  : scorePercent >= 63
                    ? t.quizPage.verdictMid
                    : t.quizPage.verdictLow}
              </div>

              {loaded && (
                <p className="text-center text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">
                    +{score * 10} XP
                  </span>{" "}
                  · Total : {progress.xp} XP
                </p>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">{t.quizPage.detail}</p>
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

              <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={restart}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Nouveau quiz
                </Button>
                <Button size="lg" className="w-full" onClick={startQuiz}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t.quizPage.replay}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
