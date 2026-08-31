"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Code2,
  Play,
  Database,
  Table as TableIcon,
  History,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Terminal,
  FileCode,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { ExternalResourceCards } from "@/components/external-resource-links";
import { PRACTICE_RESOURCES } from "@/lib/external-resources";
// Le moteur SQL vit dans lib/sql-sandbox : il est testé (50 cas) et n'a rien
// à faire dans un composant d'interface.
import { runQuery, schema, type QueryResult } from "@/lib/sql-sandbox";
import { sampleQueries, pickSample } from "@/lib/sql-sandbox/samples";
import { VoiceSql } from "@/components/voice/voice-sql";

/* ------------------------------------------------------------------ */
/*  Sample queries                                                     */
/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/*  Syntax highlighter (very lightweight, for display only)          */
/* ------------------------------------------------------------------ */

const SQL_KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "ORDER",
  "BY",
  "ASC",
  "DESC",
  "LIMIT",
  "FETCH",
  "FIRST",
  "NEXT",
  "ROWS",
  "ROW",
  "ONLY",
  "AND",
  "OR",
  "IS",
  "NULL",
  "NOT",
  "IN",
  "LIKE",
  "AS",
]);

function highlightSql(line: string): { text: string; cls: string }[] {
  // Split into tokens while keeping delimiters so we can colour them
  const parts: { text: string; cls: string }[] = [];
  const regex = /(\s+)|(--[^\n]*)|(\/\*[\s\S]*?\*\/)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([*,();=<>!]+|[<>]=|!=|<>)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) {
      parts.push({ text: line.slice(last, m.index), cls: "" });
    }
    const [match] = m;
    if (m[1]) {
      parts.push({ text: match, cls: "" });
    } else if (m[2] || m[3]) {
      parts.push({ text: match, cls: "text-emerald-400/70 italic" });
    } else if (m[4]) {
      parts.push({ text: match, cls: "text-amber-300" });
    } else if (m[5]) {
      parts.push({ text: match, cls: "text-orange-300" });
    } else if (m[6]) {
      const up = match.toUpperCase();
      if (SQL_KEYWORDS.has(up)) {
        parts.push({ text: match, cls: "text-sky-400 font-semibold" });
      } else {
        parts.push({ text: match, cls: "text-violet-300" });
      }
    } else if (m[7]) {
      parts.push({ text: match, cls: "text-pink-400" });
    } else {
      parts.push({ text: match, cls: "" });
    }
    last = m.index + match.length;
  }
  if (last < line.length) {
    parts.push({ text: line.slice(last), cls: "" });
  }
  return parts;
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

type HistoryEntry = {
  id: number;
  query: string;
  success: boolean;
  rowCount?: number;
  error?: string;
  timestamp: number;
};

export default function SandboxPage() {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState<string>(
    "SELECT * FROM employees ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY;"
  );
  const [result, setResult] = useState<QueryResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTable, setActiveTable] = useState<string>("employees");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const historyIdRef = useRef(0);

  const lineCount = useMemo(() => query.split("\n").length, [query]);

  // `sql` explicite pour exécuter une requête qui vient d'arriver — celle que
  // l'assistant passe par l'URL — sans attendre le rendu suivant : `query`
  // serait encore l'ancienne valeur au moment de l'appel.
  const executerRequete = useCallback(
    (sql?: string) => {
      const source = sql ?? query;
      const res = runQuery(source);
      setResult(res);
      historyIdRef.current += 1;
      const entry: HistoryEntry = {
        id: historyIdRef.current,
        query: source.trim(),
        success: !("error" in res),
        rowCount: "rowCount" in res ? res.rowCount : undefined,
        error: "error" in res ? res.error : undefined,
        timestamp: Date.now(),
      };
      setHistory((h) => [entry, ...h].slice(0, 50));

      if (source.trim()) {
        fetch("/api/progress/sandbox-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: source.trim() }),
        }).catch(() => {
          // best-effort activity logging, ignore failures
        });
      }
    },
    [query],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      executerRequete();
    }
    // Tab inserts spaces instead of moving focus
    if (e.key === "Tab") {
      e.preventDefault();
      const t = e.currentTarget;
      const start = t.selectionStart;
      const end = t.selectionEnd;
      const newValue = t.value.slice(0, start) + "  " + t.value.slice(end);
      setQuery(newValue);
      requestAnimationFrame(() => {
        t.selectionStart = t.selectionEnd = start + 2;
      });
    }
  };

  const loadSample = (q: string) => {
    setQuery(q);
    setResult(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  /**
   * Charge une requête dans l'éditeur **et l'exécute**.
   *
   * Utilisée par la dictée vocale : la requête traduite est déjà vérifiée par
   * `voiceToSql`, et voir immédiatement le résultat est ce qui fait le lien
   * entre la phrase prononcée et le SQL correspondant.
   */
  const chargerRequete = useCallback(
    (sql: string) => {
      setQuery(sql);
      executerRequete(sql);
    },
    [executerRequete],
  );

  const copyQuery = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  const clearEditor = () => {
    setQuery("");
    setResult(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const clearHistory = () => setHistory([]);

  // Au montage : soit la requête transmise par l'assistant (/sandbox?q=…),
  // soit l'exemple par défaut pour que la page ne s'ouvre pas vide.
  //
  // Le paramètre est lu ici plutôt que par `useSearchParams` : la valeur ne
  // participe pas au rendu serveur, donc aucune divergence d'hydratation sur
  // le contenu de l'éditeur. Il est ensuite retiré de l'URL, sinon un
  // rafraîchissement écraserait ce que l'apprenant vient d'écrire.
  useEffect(() => {
    const transmise = new URLSearchParams(window.location.search).get("q");
    if (transmise) {
      setQuery(transmise);
      executerRequete(transmise);
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      executerRequete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isError = result && "error" in result;
  const isSuccess = result && !("error" in result);

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
                  <Terminal className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    SQL Sandbox
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Practice Oracle SQL queries against a simulated HR schema
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <Database className="h-3 w-3" />
                HR Schema
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <TableIcon className="h-3 w-3" />
                {Object.keys(schema).length} Tables
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Code2 className="h-3 w-3" />
                {t.sandboxPage.mode}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: editor + results (2/3) */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="overflow-hidden border-border/60">
              <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-background to-background px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{t.sandboxPage.tipTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.sandboxPage.tipBody}
                    </p>
                  </div>
                  <Badge variant="secondary">{t.sandboxPage.examReady}</Badge>
                </div>
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/60 bg-muted/30 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <CardTitle className="ml-2 flex items-center gap-2 text-sm font-medium">
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                    query.sql
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyQuery}
                    className="h-8 gap-1.5 text-xs"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? t.sandboxPage.copied : t.sandboxPage.copy}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearEditor}
                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => executerRequete()}
                    className="h-8 gap-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm hover:from-sky-600 hover:to-blue-700"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Execute
                    <kbd className="ml-1 hidden rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium sm:inline">
                      Ctrl+↵
                    </kbd>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Editor area */}
                <div className="relative flex bg-[#0d1117] font-mono text-sm leading-relaxed">
                  {/* line numbers */}
                  <div
                    aria-hidden
                    className="select-none border-r border-white/5 bg-[#0d1117] py-4 pl-4 pr-3 text-right text-white/25"
                  >
                    {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
                      <div key={i} className="h-[1.6em]">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  {/* highlighted overlay + textarea */}
                  <div className="relative flex-1">
                    {/* syntax-highlighted preview */}
                    <pre
                      aria-hidden
                      className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words py-4 pl-4 pr-4 text-transparent"
                    >
                      {query.split("\n").map((line, i) => (
                        <div key={i} className="min-h-[1.6em]">
                          {highlightSql(line).map((p, j) => (
                            <span key={j} className={p.cls}>
                              {p.text}
                            </span>
                          ))}
                        </div>
                      ))}
                    </pre>
                    <textarea
                      ref={textareaRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoCorrect="off"
                      placeholder="Enter a SQL query…  e.g. SELECT * FROM employees"
                      className="relative h-64 w-full resize-y bg-transparent py-4 pl-4 pr-4 font-mono text-sm leading-relaxed text-white/90 caret-sky-400 outline-none placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* Commande vocale : parler, voir la traduction, exécuter. */}
                <div className="border-t border-border/60 bg-muted/20 p-3">
                  <VoiceSql onQuery={chargerRequete} />
                </div>
              </CardContent>
            </Card>

            {/* Results card */}
            <Card className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/60 bg-muted/30 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  {isError ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TableIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                  {isError
                    ? "Error"
                    : isSuccess
                    ? `Result${result && "rowCount" in result ? ` · ${result.rowCount} row${result.rowCount === 1 ? "" : "s"}` : ""}`
                    : "Results"}
                </CardTitle>
                {isSuccess && result && "executionTime" in result && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {result.executionTime < 1
                      ? "<1"
                      : result.executionTime.toFixed(1)}
                    ms
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {!result && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                    <TableIcon className="h-10 w-10 opacity-40" />
                    <p className="text-sm">
                      Run a query to see results here
                    </p>
                  </div>
                )}

                {isError && result && (
                  <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-destructive">
                          Query failed
                        </p>
                        <p className="mt-1 break-words font-mono text-xs text-destructive/80">
                          {result.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isSuccess && result?.rows && result.columns && (
                  <ScrollArea className="h-[420px] scrollbar-thin">
                    {result.rows.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                        <CheckCircle2 className="h-8 w-8 opacity-40" />
                        <p className="text-sm">
                          Query executed successfully — 0 rows returned
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader className="sticky top-0 z-10">
                          <TableRow className="border-border/60 bg-muted/40 hover:bg-muted/40">
                            {result.columns!.map((col) => (
                              <TableHead
                                key={col}
                                className="h-10 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                              >
                                {col}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.rows!.map((row, ri) => (
                            <TableRow
                              key={ri}
                              className="border-border/40 hover:bg-muted/30"
                            >
                              {row.map((cell, ci) => (
                                <TableCell
                                  key={ci}
                                  className={cn(
                                    "whitespace-nowrap py-2.5 font-mono text-xs",
                                    cell === null
                                      ? "italic text-muted-foreground/50"
                                      : typeof cell === "number"
                                      ? "text-right text-sky-600 dark:text-sky-300"
                                      : "text-foreground/90"
                                  )}
                                >
                                  {cell === null
                                    ? "NULL"
                                    : typeof cell === "number"
                                    ? cell.toLocaleString()
                                    : String(cell)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: schema + samples + history (1/3) */}
          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader className="border-b border-border/60 bg-muted/30 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  Reference
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="schema" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border/60 bg-transparent p-0">
                    <TabsTrigger
                      value="schema"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Schema
                    </TabsTrigger>
                    <TabsTrigger
                      value="samples"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Samples
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      History
                    </TabsTrigger>
                  </TabsList>

                  {/* Schema tab */}
                  <TabsContent value="schema" className="mt-0">
                    <div className="p-3">
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {Object.keys(schema).map((t) => (
                          <Button
                            key={t}
                            size="sm"
                            variant={
                              activeTable === t ? "default" : "outline"
                            }
                            onClick={() => setActiveTable(t)}
                            className="h-7 gap-1.5 px-2.5 text-xs"
                          >
                            <TableIcon className="h-3 w-3" />
                            {t}
                          </Button>
                        ))}
                      </div>
                      <ScrollArea className="h-[340px] scrollbar-thin">
                        <div className="rounded-lg border border-border/50">
                          <div className="border-b border-border/50 bg-muted/30 px-3 py-2">
                            <div className="flex items-center gap-2">
                              <TableIcon className="h-3.5 w-3.5 text-sky-500" />
                              <span className="font-mono text-xs font-semibold uppercase tracking-wide">
                                {activeTable}
                              </span>
                              <Badge
                                variant="secondary"
                                className="ml-auto text-[10px]"
                              >
                                {schema[activeTable].data.length} rows
                              </Badge>
                            </div>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border/40 hover:bg-transparent">
                                <TableHead className="h-8 w-1/3 py-1.5 pl-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  Column
                                </TableHead>
                                <TableHead className="h-8 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  Sample
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {schema[activeTable].columns.map((col, ci) => {
                                const sample =
                                  schema[activeTable].data[0]?.[ci] ?? null;
                                return (
                                  <TableRow
                                    key={col}
                                    className="border-border/30 hover:bg-muted/20"
                                  >
                                    <TableCell className="py-1.5 pl-3 pr-2 font-mono text-xs font-medium text-foreground/90">
                                      {col}
                                    </TableCell>
                                    <TableCell className="py-1.5 pr-3 font-mono text-xs text-muted-foreground">
                                      {sample === null
                                        ? "NULL"
                                        : typeof sample === "number"
                                        ? sample.toLocaleString()
                                        : String(sample)}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* Samples tab */}
                  <TabsContent value="samples" className="mt-0">
                    <ScrollArea className="h-[380px] scrollbar-thin">
                      <div className="space-y-1.5 p-3">
                        {sampleQueries.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => loadSample(s.query)}
                            className="group w-full rounded-lg border border-border/50 bg-card/50 p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-foreground">
                                {pickSample(s.label, locale)}
                              </span>
                              <Code2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                            </div>
                            <p className="mb-1.5 mt-0.5 text-[11px] leading-snug text-muted-foreground">
                              {pickSample(s.description, locale)}
                            </p>
                            <code className="block overflow-x-auto whitespace-pre rounded bg-muted/40 px-2 py-1.5 font-mono text-[11px] leading-relaxed text-sky-600 dark:text-sky-300">
                              {s.query}
                            </code>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* History tab */}
                  <TabsContent value="history" className="mt-0">
                    <ScrollArea className="h-[380px] scrollbar-thin">
                      <div className="p-3">
                        {history.length === 0 ? (
                          <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                            <History className="h-8 w-8 opacity-40" />
                            <p className="text-xs">No queries executed yet</p>
                          </div>
                        ) : (
                          <>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {history.length} entr{history.length === 1 ? "y" : "ies"}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearHistory}
                                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                                Clear
                              </Button>
                            </div>
                            <div className="space-y-1.5">
                              {history.map((h) => (
                                <button
                                  key={h.id}
                                  onClick={() => loadSample(h.query)}
                                  className="group w-full rounded-lg border border-border/50 bg-card/50 p-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent/5"
                                >
                                  <div className="flex items-center gap-2">
                                    {h.success ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                    ) : (
                                      <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                                    )}
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(h.timestamp).toLocaleTimeString()}
                                    </span>
                                    {h.success && h.rowCount !== undefined && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-auto text-[10px]"
                                      >
                                        {h.rowCount} row{h.rowCount === 1 ? "" : "s"}
                                      </Badge>
                                    )}
                                  </div>
                                  <code className="mt-1 block overflow-x-auto whitespace-pre rounded bg-muted/40 px-2 py-1 font-mono text-[11px] leading-relaxed text-foreground/80">
                                    {h.query}
                                  </code>
                                  {!h.success && h.error && (
                                    <p className="mt-1 truncate text-[10px] text-destructive/70">
                                      {h.error}
                                    </p>
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/*
          Ce bac à sable simule un sous-ensemble d'Oracle SQL sur des données
          d'exemple : il ne remplace pas un vrai moteur. Le lien ci-dessous mène
          à une console en ligne, pour ce que la simulation ne couvre pas.
        */}
        <section aria-labelledby="ressources-bac-a-sable" className="border-t border-border/60 pt-6">
          <h2 id="ressources-bac-a-sable" className="mb-1 text-sm font-semibold">
            {locale === "en" ? "Run real SQL" : "Exécuter du vrai SQL"}
          </h2>
          <p className="mb-3 text-xs text-muted-foreground">
            {locale === "en"
              ? "This sandbox simulates a subset of Oracle SQL on sample data. For anything it does not cover, use a real engine."
              : "Ce bac à sable simule un sous-ensemble d'Oracle SQL sur des données d'exemple. Pour ce qu'il ne couvre pas, passez par un vrai moteur."}
          </p>
          <ExternalResourceCards
            locale={locale}
            newTabLabel={locale === "en" ? "opens a new tab" : "ouvre un nouvel onglet"}
            resources={PRACTICE_RESOURCES}
          />
        </section>
      </div>
    </div>
  );
}
