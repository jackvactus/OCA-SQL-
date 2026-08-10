"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Library,
  Search,
  FunctionSquare,
  BookOpen,
  Code2,
  Copy,
  CheckCircle2,
  Filter,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { glossary, oracleFunctions } from "@/lib/reference-data";
import { cn } from "@/lib/utils";

// Derive unique category lists preserving first-seen order.
const glossaryCategories = Array.from(
  new Set(glossary.map((item) => item.category)),
);
const functionCategories = Array.from(
  new Set(oracleFunctions.map((item) => item.category)),
);

// Map a category to a deterministic accent color so badges stay consistent.
const categoryColors: Record<string, string> = {
  // Glossary
  Sécurité: "bg-rose-500/15 text-rose-500 border-rose-500/30",
  Fonctions: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  SQL: "bg-sky-500/15 text-sky-500 border-sky-500/30",
  Standard: "bg-slate-500/15 text-slate-500 border-slate-500/30",
  Types: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  JOIN: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  Contraintes: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  Structure: "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
  TCL: "bg-teal-500/15 text-teal-500 border-teal-500/30",
  Subquery: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
  Séquence: "bg-fuchsia-500/15 text-fuchsia-500 border-fuchsia-500/30",
  Dictionnaire: "bg-purple-500/15 text-purple-500 border-purple-500/30",
  Catégorie: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  SELECT: "bg-sky-500/15 text-sky-500 border-sky-500/30",
  Agrégation: "bg-lime-500/15 text-lime-500 border-lime-500/30",
  Performance: "bg-red-500/15 text-red-500 border-red-500/30",
  "Set Operator": "bg-pink-500/15 text-pink-500 border-pink-500/30",
  Opérateur: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  Analytic: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  "Pseudo-colonne": "bg-stone-500/15 text-stone-500 border-stone-500/30",
  Objet: "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
  DDL: "bg-rose-500/15 text-rose-500 border-rose-500/30",
  DQL: "bg-sky-500/15 text-sky-500 border-sky-500/30",
  Général: "bg-slate-500/15 text-slate-500 border-slate-500/30",
  "Récupération": "bg-red-500/15 text-red-500 border-red-500/30",
  Concept: "bg-stone-500/15 text-stone-500 border-stone-500/30",
  Table: "bg-zinc-500/15 text-zinc-500 border-zinc-500/30",
  // Functions
  NULL: "bg-rose-500/15 text-rose-500 border-rose-500/30",
  Conditionnel: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  Caractères: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  Numérique: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  Date: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  Conversion: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
  Regex: "bg-fuchsia-500/15 text-fuchsia-500 border-fuchsia-500/30",
  Analytique: "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
};

function colorForCategory(category: string): string {
  return (
    categoryColors[category] ??
    "bg-primary/15 text-primary border-primary/30"
  );
}

// Small reusable copy button used next to code examples.
function CopyButton({ value, label = "Copier" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context); ignore silently.
    }
  }, [value]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
      aria-label={label}
    >
      {copied ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          Copié
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </Button>
  );
}

// A clickable category filter rendered as a badge.
function CategoryFilter({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        Catégories
      </div>
      <button
        type="button"
        onClick={() => onSelect("all")}
        className={cn(
          "rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          active === "all"
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
        )}
      >
        Toutes
      </button>
      <Separator orientation="vertical" className="h-5" />
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = active === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(isActive ? "all" : category)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all",
                isActive
                  ? colorForCategory(category)
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ReferencePage() {
  const [glossarySearch, setGlossarySearch] = useState("");
  const [glossaryCategory, setGlossaryCategory] = useState("all");
  const [functionSearch, setFunctionSearch] = useState("");
  const [functionCategory, setFunctionCategory] = useState("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filteredGlossary = useMemo(() => {
    const query = glossarySearch.trim().toLowerCase();
    return glossary.filter((item) => {
      const matchesCategory =
        glossaryCategory === "all" || item.category === glossaryCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        item.term.toLowerCase().includes(query) ||
        item.definition.toLowerCase().includes(query) ||
        (item.example?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [glossarySearch, glossaryCategory]);

  const filteredFunctions = useMemo(() => {
    const query = functionSearch.trim().toLowerCase();
    return oracleFunctions.filter((item) => {
      const matchesCategory =
        functionCategory === "all" || item.category === functionCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.syntax.toLowerCase().includes(query) ||
        item.example.toLowerCase().includes(query) ||
        item.result.toLowerCase().includes(query)
      );
    });
  }, [functionSearch, functionCategory]);

  const toggleExpanded = useCallback((name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 lg:p-8">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="relative space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Library className="h-3 w-3" />
              Référence
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {glossary.length} termes · {oracleFunctions.length} fonctions
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Glossaire &amp; Fonctions Oracle
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Recherchez rapidement parmi les termes SQL et les fonctions Oracle
            couverts par la certification 1Z0-071. Filtrez par catégorie et
            copiez les exemples d&apos;un seul clic.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="glossary" className="space-y-4">
        <TabsList className="h-11 w-full sm:w-auto">
          <TabsTrigger value="glossary" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Glossaire
          </TabsTrigger>
          <TabsTrigger value="functions" className="gap-2">
            <FunctionSquare className="h-4 w-4" />
            Fonctions Oracle
          </TabsTrigger>
        </TabsList>

        {/* Glossary tab */}
        <TabsContent value="glossary" className="space-y-4">
          {/* Sticky search + filters */}
          <div className="sticky top-0 z-10 -mx-4 space-y-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder="Rechercher un terme ou une définition..."
                className="pl-9"
                aria-label="Rechercher dans le glossaire"
              />
            </div>
            <CategoryFilter
              categories={glossaryCategories}
              active={glossaryCategory}
              onSelect={setGlossaryCategory}
            />
            <p className="text-xs text-muted-foreground">
              {filteredGlossary.length} terme
              {filteredGlossary.length > 1 ? "s" : ""} trouvé
              {filteredGlossary.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Terms list */}
          {filteredGlossary.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <Library className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium">Aucun terme trouvé</p>
                <p className="text-xs text-muted-foreground">
                  Essayez un autre mot-clé ou réinitialisez les filtres.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredGlossary.map((item) => (
                <Card
                  key={item.term}
                  className="animate-fade-in overflow-hidden transition-colors hover:border-primary/40"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base font-semibold leading-tight">
                        {item.term}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0",
                          colorForCategory(item.category),
                        )}
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {item.definition}
                    </p>
                    {item.example && (
                      <div className="space-y-1.5">
                        <Separator />
                        <div className="group relative rounded-lg border border-border bg-muted/40 p-3">
                          <div className="absolute right-1.5 top-1.5">
                            <CopyButton value={item.example} />
                          </div>
                          <pre className="overflow-x-auto pr-16 text-xs leading-relaxed">
                            <code className="font-mono text-foreground/90">
                              {item.example}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Oracle functions tab */}
        <TabsContent value="functions" className="space-y-4">
          {/* Sticky search + filters */}
          <div className="sticky top-0 z-10 -mx-4 space-y-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={functionSearch}
                onChange={(e) => setFunctionSearch(e.target.value)}
                placeholder="Rechercher une fonction, une syntaxe, un exemple..."
                className="pl-9"
                aria-label="Rechercher dans les fonctions Oracle"
              />
            </div>
            <CategoryFilter
              categories={functionCategories}
              active={functionCategory}
              onSelect={setFunctionCategory}
            />
            <p className="text-xs text-muted-foreground">
              {filteredFunctions.length} fonction
              {filteredFunctions.length > 1 ? "s" : ""} trouvé
              {filteredFunctions.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Functions grid */}
          {filteredFunctions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <FunctionSquare className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium">Aucune fonction trouvée</p>
                <p className="text-xs text-muted-foreground">
                  Essayez un autre mot-clé ou réinitialisez les filtres.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFunctions.map((fn) => {
                const isOpen = expanded[fn.name] ?? false;
                return (
                  <Card
                    key={fn.name}
                    className="animate-fade-in flex flex-col overflow-hidden transition-colors hover:border-primary/40"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <FunctionSquare className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="font-mono text-base font-semibold">
                            {fn.name}
                          </CardTitle>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0",
                            colorForCategory(fn.category),
                          )}
                        >
                          {fn.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3">
                      {/* Syntax */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <Code2 className="h-3.5 w-3.5" />
                          Syntaxe
                        </div>
                        <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                          <pre className="overflow-x-auto text-xs leading-relaxed">
                            <code className="font-mono text-foreground/90">
                              {fn.syntax}
                            </code>
                          </pre>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">
                        {fn.description}
                      </p>

                      {/* Example + result (always visible, expandable for detail) */}
                      <div className="mt-auto space-y-2 pt-1">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              <Code2 className="h-3.5 w-3.5" />
                              Exemple
                            </span>
                            <CopyButton value={fn.example} />
                          </div>
                          <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                            <pre className="overflow-x-auto text-xs leading-relaxed">
                              <code className="font-mono text-foreground/90">
                                {fn.example}
                              </code>
                            </pre>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            Résultat
                          </div>
                          <p className="rounded-lg border border-success/20 bg-success/5 px-2.5 py-2 text-xs font-medium text-success">
                            {fn.result}
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(fn.name)}
                          className="h-7 w-full justify-center text-xs text-muted-foreground hover:text-foreground"
                        >
                          {isOpen ? "Réduire" : "Voir plus de détails"}
                        </Button>

                        {isOpen && (
                          <div className="animate-fade-in space-y-2 rounded-lg border border-border bg-card p-3 text-xs">
                            <div>
                              <span className="font-semibold text-foreground">
                                Fonction :
                              </span>{" "}
                              <span className="font-mono text-primary">
                                {fn.name}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">
                                Catégorie :
                              </span>{" "}
                              {fn.category}
                            </div>
                            <Separator />
                            <div>
                              <span className="font-semibold text-foreground">
                                Syntaxe complète :
                              </span>
                              <pre className="mt-1 overflow-x-auto">
                                <code className="font-mono text-muted-foreground">
                                  {fn.syntax}
                                </code>
                              </pre>
                            </div>
                            <Separator />
                            <div>
                              <span className="font-semibold text-foreground">
                                Description :
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {fn.description}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
