import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  GraduationCap,
  Layers,
  Library,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/modules-data";
import { quizQuestions } from "@/lib/quiz-data";

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
    description: "Conditions réelles d'examen avec chronomètre et score détaillé par domaine.",
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
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 lg:px-8 lg:py-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 lg:p-12">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="gap-1">
              <ShieldCheck className="h-3 w-3 text-primary" />
              Suivi de progression personnalisé
            </Badge>
            <h1 className="mt-4 text-3xl font-bold leading-tight lg:text-5xl">
              Réussissez votre certification{" "}
              <span className="gradient-text">Oracle Database SQL 1Z0-071</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Cours interactifs, quiz adaptatif, simulateur d&apos;examen, flashcards et SQL sandbox
              réunis sur une seule plateforme. Chaque leçon, chaque quiz et chaque examen que vous
              complétez est suivi dans votre espace personnel.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Créer un compte gratuit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  J&apos;ai déjà un compte
                </Button>
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Progression sauvegardée en continu
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Historique complet de vos activités
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Accessible depuis n&apos;importe quel appareil
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-red-500/10 to-red-600/10 p-8 shadow-sm backdrop-blur">
              <Image
                src="/oracle-db-icon.svg"
                alt="OracleMaster"
                width={160}
                height={160}
                className="h-40 w-40 object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold lg:text-3xl">Tout ce qu&apos;il faut pour réussir</h2>
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

      {/* CTA */}
      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-8 text-center lg:p-12">
        <TrendingUp className="mx-auto h-8 w-8 text-primary" />
        <h2 className="mt-3 text-2xl font-bold lg:text-3xl">Prêt à commencer ?</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
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
      </section>
    </div>
  );
}
