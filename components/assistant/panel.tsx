"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { History, Loader2, Send, Sparkles, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AssistantExchange } from "@/lib/assistant/types";
import type { AssistantStrings } from "@/lib/assistant/strings";
import { ExchangeView } from "./transcript";

/**
 * Le panneau de discussion.
 *
 * Purement présentationnel : il ne connaît ni le réseau ni la persistance,
 * ce qui le rend lisible et testable à l'œil. L'orchestration vit dans
 * `assistant.tsx`.
 */
export function AssistantPanel({
  id,
  open,
  exchanges,
  pending,
  error,
  draft,
  s,
  onDraftChange,
  onSubmit,
  onClose,
  onClear,
}: {
  id: string;
  open: boolean;
  exchanges: AssistantExchange[];
  pending: boolean;
  error: string | null;
  draft: string;
  s: AssistantStrings;
  onDraftChange: (value: string) => void;
  onSubmit: (question: string) => void;
  onClose: () => void;
  onClear: () => void;
}) {
  const finRef = useRef<HTMLDivElement>(null);
  const champRef = useRef<HTMLTextAreaElement>(null);

  // Le fil défile vers le bas à chaque nouvel échange, et le champ prend le
  // focus à l'ouverture : sans cela, ouvrir le panneau demande un clic de plus.
  useEffect(() => {
    if (open) finRef.current?.scrollIntoView({ block: "end" });
  }, [open, exchanges.length, pending]);

  useEffect(() => {
    if (open) champRef.current?.focus();
  }, [open]);

  const envoyer = () => {
    const question = draft.trim();
    if (!question || pending) return;
    onSubmit(question);
  };

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="false"
      aria-label={s.title}
      // Le panneau reste monté — le fil de discussion et la position du
      // défilement survivent à une fermeture — mais l'affichage est piloté par
      // un style en ligne, PAS par l'attribut `hidden`.
      //
      // L'attribut seul ne suffisait pas : `[hidden] { display: none }` vient
      // de la feuille du navigateur, et la classe utilitaire `flex` est une
      // règle d'auteur, donc prioritaire. Le panneau restait affiché en
      // permanence et son calque interceptait les clics dans tout le coin
      // inférieur droit de chaque page.
      aria-hidden={!open}
      className={cn(
        "w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border",
        "bg-card shadow-2xl shadow-black/20 animate-scale-in",
      )}
      style={{
        display: open ? "flex" : "none",
        maxHeight: "min(32rem, calc(100vh - 8rem))",
      }}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between gap-2 border-b border-border bg-gradient-to-br from-primary/10 to-transparent px-4 py-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{s.title}</p>
            <p className="text-xs text-muted-foreground">{s.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {exchanges.length > 0 && (
            <Button variant="ghost" size="icon" className="h-7 w-7" title={s.clear} onClick={onClear}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" title={s.close} onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Fil */}
      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin px-3 py-3">
        {exchanges.length === 0 && !pending && (
          <div className="px-1 py-4">
            <p className="text-sm font-medium">{s.emptyTitle}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.emptyBody}</p>
            <div className="mt-3 space-y-1.5">
              {s.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSubmit(suggestion)}
                  className="w-full rounded-lg border border-border/70 bg-muted/30 px-2.5 py-2 text-left text-xs transition-colors hover:border-primary hover:bg-accent/10"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {exchanges.map((exchange) => (
          <ExchangeView key={exchange.id} exchange={exchange} s={s} />
        ))}

        {pending && (
          <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {s.thinking}
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-2.5 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <div ref={finRef} />
      </div>

      {/* Composeur */}
      <div className="border-t border-border bg-card px-3 py-2.5">
        <div className="flex items-end gap-2">
          <textarea
            ref={champRef}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              // Entrée envoie, Maj+Entrée passe à la ligne : c'est ce qu'on
              // attend d'un champ de discussion.
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                envoyer();
              }
            }}
            rows={1}
            placeholder={s.placeholder}
            aria-label={s.placeholder}
            className="max-h-28 min-h-[2.25rem] flex-1 resize-none rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none transition-colors focus:border-primary"
          />
          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            title={s.send}
            aria-label={s.send}
            disabled={pending || draft.trim().length === 0}
            onClick={envoyer}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground">{s.auditNote}</span>
          <Link
            href="/assistant"
            onClick={onClose}
            className="flex shrink-0 items-center gap-1 text-[11px] text-primary hover:underline"
          >
            <History className="h-3 w-3" />
            {s.auditLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
