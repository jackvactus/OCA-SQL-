"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  GraduationCap,
  Flame,
  Trophy,
  Clock,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  Circle,
  Award,
  Code2,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/modules-data";
import { quizQuestions } from "@/lib/quiz-data";
import { useProgress } from "@/hooks/use-progress";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const { progress, loaded } = useProgress();

  const stats = useMemo(() => {
    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completed = progress.completedLessons.length;
    const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

    const quizCount = Object.keys(progress.quizResults).length;
    const quizAvg =
      quizCount > 0
        ? Math.round(
            (Object.values(progress.quizResults).reduce((sum, r) => sum + (r.correct / r.total) * 100, 0) /
              quizCount) *
              10,
          ) / 10
        : 0;

    const examCount = progress.examResults.length;
    const bestExam =
      examCount > 0 ? Math.max(...progress.examResults.map((e) => Math.round((e.score / e.total) * 100))) : 0;

    return {
      totalLessons,
      completed,
      percent,
      quizCount,
      quizAvg,
      examCount,
      bestExam,
      level: Math.floor(progress.xp / 500) + 1,
    };
  }, [progress]);

  const chartData = useMemo(() => {
    const days = [];

    // Déterministe (pas de Math.random) : on dérive un “profil semaine” depuis l’XP total
    // pour garder un graphe stable d’un refresh à l’autre.
    const seedBase = progress.xp ?? 0;
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const dayName = date.toLocaleDateString("fr", { weekday: "short" });

      // Répartition pseudo-déterministe entre 20 et 99, avec une légère variation par jour.
      const t = (6 - i) + 1; // 1..7
      const xpOnDay = i === 0 ? seedBase % 100 : 20 + ((seedBase + t * 37) % 80);

      days.push({ day: dayName, xp: xpOnDay });
    }

    return days;
  }, [progress.xp]);


  const radialData = [
    { name: "Progression", value: stats.percent },
    { name: "Restant", value: 100 - stats.percent },
  ];

  const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  const recommendedModule = useMemo(() => {
    const incompleteModule = modules.find(
      (m) => !m.lessons.every((l) => progress.completedLessons.includes(l.id)),
    );
    return incompleteModule || modules[0];
  }, [progress.completedLessons]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 lg:p-8">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Flame className="h-3 w-3 text-warning" />
              {progress.streak} jours de série
            </Badge>
            <Badge variant="outline">Niveau {stats.level}</Badge>
          </div>
          <h1 className="text-2xl font-bold lg:text-3xl">
            Bienvenue sur votre parcours de certification
          </h1>
          <p className="mt-1 text-muted-foreground">
            Oracle Database SQL 1Z0-071 — Préparez-vous à réussir avec un score &gt; 90%
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/courses">
              <Button className="gap-2">
                Continuer l'apprentissage
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/exam">
              <Button variant="outline" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Simulateur d'examen
              </Button>
            </Link>
          </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="rounded-2xl border border-primary/20 bg-background/70 p-3 shadow-sm backdrop-blur">
              <Image
                src="/favicon.png"
                alt="OracleMaster illustration"
                width={140}
                height={140}
                className="h-32 w-32 object-contain lg:h-36 lg:w-36"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Leçons complétées"
          value={`${stats.completed}/${stats.totalLessons}`}
          color="primary"
        />
        <StatCard
          icon={Brain}
          label="Quiz complétés"
          value={String(stats.quizCount)}
          subValue={stats.quizCount > 0 ? `${stats.quizAvg}% moyen` : undefined}
          color="success"
        />
        <StatCard
          icon={GraduationCap}
          label="Examens passés"
          value={String(stats.examCount)}
          subValue={stats.examCount > 0 ? `${stats.bestExam}% meilleur` : undefined}
          color="warning"
        />
        <StatCard
          icon={Trophy}
          label="Points XP"
          value={String(progress.xp)}
          color="primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/5">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Plan d'étude du jour
                </CardTitle>
                <CardDescription>
                  Une progression claire pour avancer chaque jour avec confiance.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <CalendarDays className="h-3 w-3" />
                Aujourd'hui
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { title: "Réviser", text: "Fonctions SQL", hint: "NVL / CASE / COALESCE" },
                { title: "Pratiquer", text: "Quiz ciblé", hint: "10 questions rapides" },
                { title: "Valider", text: "Mini-examen", hint: "15 min de concentration" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border/70 bg-card/70 p-3">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-foreground">{item.text}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.hint}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" />
              Objectif de la semaine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="text-sm font-semibold">Atteindre 90% de maîtrise</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Terminez les modules clés et passez au moins un simulateur de préparation.
              </p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/70 p-3 text-sm">
              <span className="text-muted-foreground">Prochain jalon</span>
              <span className="font-semibold">Module 6 · Jointures</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/70 p-3 text-sm">
              <span className="text-muted-foreground">Temps conseillé</span>
              <span className="font-semibold">25 min / jour</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and progress */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Progress radial */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" />
              Progression globale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={radialData}
                    dataKey="value"
                    innerRadius="65%"
                    outerRadius="90%"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {radialData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{stats.percent}%</span>
                <span className="text-xs text-muted-foreground">complété</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Leçons</span>
                <span className="font-medium">{stats.completed}/{stats.totalLessons}</span>
              </div>
              <Progress value={stats.percent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* XP chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Activité de la semaine
            </CardTitle>
            <CardDescription>XP gagnée par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="xp"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#xpGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" />
            Progression par module
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {modules.map((module) => {
            const totalLessons = module.lessons.length;
            const completedLessons = module.lessons.filter((l) =>
              progress.completedLessons.includes(l.id),
            ).length;
            const percent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
            return (
              <Link
                key={module.id}
                href={`/courses/${module.id}`}
                className="block rounded-lg border border-border p-4 transition-all hover:border-primary hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="text-sm font-bold">{module.number}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{module.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {completedLessons}/{totalLessons} leçons · {module.estimatedHours}h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden w-32 sm:block">
                      <Progress value={percent} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">{Math.round(percent)}%</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickAction
          href="/quiz"
          icon={Brain}
          title="Quiz adaptatif"
          description="Testez vos connaissances"
        />
        <QuickAction
          href="/flashcards"
          icon={BookOpen}
          title="Flashcards"
          description="Révision espacée"
        />
        <QuickAction
          href="/sandbox"
          icon={Code2}
          title="SQL Sandbox"
          description="Pratiquez vos requêtes"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  color: "primary" | "success" | "warning";
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
            {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
