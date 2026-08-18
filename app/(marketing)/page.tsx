import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  Code2,
  Database,
  GraduationCap,
  History,
  Layers,
  Library,
  Radar,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/modules-data";
import { quizQuestions } from "@/lib/quiz-data";
import { LiveStats } from "./live-stats";
import { DifficultyChart } from "./difficulty-chart";

// Mirrors the constants in app/(app)/exam/page.tsx — kept in sync manually
// since that file doesn't export them.
const EXAM_PASS_THRESHOLD = 63;
const EXAM_DURATION_MINUTES = 100;

const heroStats = [
  { icon: Layers, value: `${modules.length}`, label: "Modules structurés" },
  { icon: Brain, value: `${quizQuestions.length}+`, label: "Questions corrigées" },
  { icon: Target, value: `${EXAM_PASS_THRESHOLD}%`, label: "Seuil de réussite" },
  { icon: Clock, value: `${EXAM_DURATION_MINUTES} min`, label: "Examen chronométré" },
];

const chips = [
  { icon: ShieldCheck, label: "Contenu 100% aligné 1Z0-071" },
  { icon: Radar, label: "Suivi de progression en temps réel" },
  { icon: Code2, label: "SQL Sandbox interactif" },
  { icon: History, label: "Historique d'activité complet" },
];

const features = [
  {
    icon: BookOpen,
    title: "Cours structurés",
    description: `${modules.length} modules progressifs couvrant l'intégralité du programme 1Z0-071, avec exemples et pièges classiques.`,
  },
  {
    icon: Brain,
    title: "Quiz adaptatif",
    description: `${quizQuestions.length}+ questions corrigées et expliquées pour ancrer chaque notion durablement.`,
  },
  {
    icon: GraduationCap,
    title: "Simulateur d'examen",
    description: `Conditions réelles : ${EXAM_DURATION_MINUTES} minutes, ${EXAM_PASS_THRESHOLD}% pour réussir, score détaillé par domaine.`,
  },
  {
    icon: Layers,
    title: "Flashcards SRS",
    description: "Révision espacée qui s'adapte à votre mémoire pour retenir sur le long terme.",
  },
  {
    icon: Code2,
    title: "SQL Sandbox",
    description: "Un espace pour écrire et tester vos propres requêtes SQL librement.",
  },
  {
    icon: Library,
    title: "Référence complète",
    description: "Glossaire et fonctions Oracle SQL toujours à portée de main.",
  },
];

export default function LandingPage() {
  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
  for (const q of quizQuestions) difficultyCounts[q.difficulty] += 1;
  const difficultyData = [
    { label: "Facile", count: difficultyCounts.easy },
    { label: "Moyen", count: difficultyCounts.medium },
    { label: "Difficile", count: difficultyCounts.hard },
  ];

  return (
    <div className="space-y-20 pb-20 lg:space-y-28">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#04090b]">
        <Image
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04090b]/90 via-[#04090b]/85 to-background" />
        <div className="bg-grid absolute inset-0 opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="gap-1.5 border-white/10 bg-white/10 text-white">
              <Database className="h-3 w-3 text-primary" />
              Plateforme de formation Oracle Database SQL
            </Badge>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white lg:text-6xl">
              Maîtrisez Oracle Database SQL —{" "}
              <span className="text-primary">Certification 1Z0-071</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/60">
              Cours interactifs, quiz adaptatif, simulateur d&apos;examen, flashcards et SQL sandbox
              réunis sur une seule plateforme. Chaque leçon, chaque quiz et chaque examen que vous
              complétez est suivi dans votre espace personnel.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Accéder à la plateforme
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur"
              >
                <stat.icon className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live preview */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="gap-1.5">
              <Radar className="h-3 w-3 text-primary" />
              Aperçu en direct
            </Badge>
            <h2 className="mt-4 text-2xl font-bold lg:text-3xl">
              Une plateforme pensée pour votre progression
            </h2>
            <p className="mt-3 text-muted-foreground">
              Chaque connexion, chaque leçon terminée et chaque quiz complété est enregistré dans un
              historique d&apos;activité complet — pas de données fictives, votre tableau de bord
              reflète votre progression réelle dès la première leçon.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {chips.map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 p-3 text-sm"
                >
                  <chip.icon className="h-4 w-4 shrink-0 text-primary" />
                  {chip.label}
                </div>
              ))}
            </div>
          </div>
          <LiveStats />
        </div>
      </section>

      {/* Modules grid */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold lg:text-3xl">Modules intégrés, expérience unifiée</h2>
          <p className="mt-2 text-muted-foreground">
            Une préparation complète, du premier cours au jour de l&apos;examen.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="animate-fade-in">
              <CardContent className="p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Visualization showcase */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Répartition des questions par difficulté</h3>
                  <Badge variant="outline">{quizQuestions.length} questions</Badge>
                </div>
                <DifficultyChart data={difficultyData} />
              </CardContent>
            </Card>
          </div>
          <div className="order-1 lg:order-2">
            <Badge variant="secondary" className="gap-1.5">
              <Brain className="h-3 w-3 text-primary" />
              Basé sur le contenu réel
            </Badge>
            <h2 className="mt-4 text-2xl font-bold lg:text-3xl">
              Des visualisations qui parlent à vos progrès
            </h2>
            <p className="mt-3 text-muted-foreground">
              La banque de questions est calibrée sur les trois niveaux de difficulté de l&apos;examen
              réel, pour que le quiz adaptatif et le simulateur reflètent fidèlement ce qui vous
              attend le jour J.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#04090b] p-8 text-center lg:p-14">
          <Image
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#04090b]/95 via-[#04090b]/80 to-[#04090b]/95" />
          <div className="relative">
            <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 text-2xl font-bold text-white lg:text-3xl">Prêt à commencer ?</h2>
            <p className="mx-auto mt-2 max-w-xl text-white/60">
              Créez votre compte en quelques secondes et retrouvez votre tableau de bord, votre
              progression et l&apos;historique complet de vos activités à chaque connexion.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Créer mon compte
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
