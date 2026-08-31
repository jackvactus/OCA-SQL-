"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, BookOpen, Check, Copy, ExternalLink, FileCode, Play, Sparkles, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AssistantExchange, AssistantSource, AssistantSql } from "@/lib/assistant/types";
import type { AssistantStrings } from "@/lib/assistant/strings";

/**
 * Rendu d'un échange : la question, la réponse, ses sources et son SQL.
 *
 * Le composant est partagé entre le panneau flottant et la page de
 * transcription, pour qu'un échange s'affiche exactement pareil aux deux
 * endroits — c'est la condition pour qu'une relecture d'audit fasse foi.
 */

const ICONES: Record<AssistantSource["kind"], typeof BookOpen> = {
  session: BookOpen,
  module: BookOpen,
  question: FileCode,
  reference: BookOpen,
  external: ExternalLink,
};

/** Un extrait SQL, copiable et — s'il tourne — exécutable dans le bac à sable. */
export function SqlBlock({ sql, s }: { sql: AssistantSql; s: AssistantStrings }) {
  const [copie, setCopie] = useState(false);

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(sql.query);
      setCopie(true);
      setTimeout(() => setCopie(false), 1500);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-muted/40">
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed">
        <code>{sql.query}</code>
      </pre>
      {sql.caption && (
        <p className="border-t border-border/50 px-3 py-2 text-xs text-muted-foreground">
          {sql.caption}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 border-t border-border/50 bg-card/50 px-2 py-2">
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={copier}>
          {copie ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copie ? s.copied : s.copy}
        </Button>
        {sql.runnable ? (
          // `asChild` : le lien EST le bouton. Un <button> imbriqué dans un <a>
          // est réécrit par le navigateur, et React échoue ensuite au démontage
          // sur « removeChild ».
          <Button asChild variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
            <Link href={`/sandbox?q=${encodeURIComponent(sql.query)}`}>
              <Play className="h-3.5 w-3.5" />
              {s.runInSandbox}
            </Link>
          </Button>
        ) : (
          <span className="px-2 text-xs text-muted-foreground">{s.notRunnable}</span>
        )}
      </div>
    </div>
  );
}

function SourceList({ sources, s }: { sources: AssistantSource[]; s: AssistantStrings }) {
  if (sources.length === 0) return null;
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {s.sources}
      </p>
      <ul className="space-y-1">
        {sources.map((source, i) => {
          const Icon = ICONES[source.kind] ?? BookOpen;
          const externe = source.kind === "external";
          return (
            <li key={`${source.href}-${i}`}>
              <Link
                href={source.href}
                {...(externe ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-start gap-1.5 text-xs text-primary hover:underline"
              >
                <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{source.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ExchangeView({
  exchange,
  s,
  showMeta = false,
}: {
  exchange: AssistantExchange & { path?: string | null };
  s: AssistantStrings;
  showMeta?: boolean;
}) {
  const indisponible = exchange.answer.unavailable === true;

  return (
    <div className="space-y-3">
      {/* Question */}
      <div className="flex justify-end">
        <div className="flex max-w-[85%] items-start gap-2">
          <div className="rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
            {exchange.question}
          </div>
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <User className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Réponse */}
      <div className="flex items-start gap-2">
        <div
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            indisponible ? "bg-warning/15 text-warning" : "bg-primary/10 text-primary",
          )}
        >
          {indisponible ? <AlertTriangle className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "rounded-2xl rounded-tl-sm border px-3 py-2 text-sm",
              indisponible
                ? "border-warning/40 bg-warning/5 text-muted-foreground"
                : "border-border/70 bg-card",
            )}
          >
            {indisponible && (
              <span className="mb-1.5 inline-block rounded border border-warning/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
                {s.unavailableBadge}
              </span>
            )}
            <p className="whitespace-pre-wrap leading-relaxed">{exchange.answer.text}</p>
            <SourceList sources={exchange.answer.sources} s={s} />
          </div>

          {exchange.answer.sql.length > 0 && (
            <div className="mt-2 space-y-2">
              {exchange.answer.sql.map((sql, i) => (
                <SqlBlock key={i} sql={sql} s={s} />
              ))}
            </div>
          )}

          {showMeta && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {new Date(exchange.createdAt).toLocaleString()}
              {exchange.path ? ` · ${s.auditContext} ${exchange.path}` : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
