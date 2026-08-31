"use client";

import { Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type OrbState = "idle" | "thinking" | "open";

/**
 * Le point lumineux qui ouvre l'assistant.
 *
 * Trois couches superposées — halo, onde, cœur — animées à des rythmes
 * décalés (voir `app/globals.css`). L'objet reste un vrai `<button>` : il se
 * tabule, s'annonce aux lecteurs d'écran, et déclare l'état du panneau qu'il
 * commande. Les animations s'effacent sous `prefers-reduced-motion`.
 */
export function AssistantOrb({
  state,
  label,
  shortcut,
  panelId,
  onClick,
}: {
  state: OrbState;
  label: string;
  shortcut?: string;
  panelId: string;
  onClick: () => void;
}) {
  const ouvert = state === "open";
  const cherche = state === "thinking";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={ouvert}
      aria-controls={panelId}
      title={shortcut ? `${label} · ${shortcut}` : label}
      className={cn(
        "group relative flex h-14 w-14 items-center justify-center rounded-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
      )}
    >
      {/* Halo : la lueur diffuse qui respire. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full blur-md",
          "bg-gradient-to-br from-primary via-cyan-400 to-primary",
          !ouvert && "assistant-halo",
          ouvert && "opacity-60",
        )}
      />

      {/* Onde : elle part du centre et se dissipe. Inutile panneau ouvert. */}
      {!ouvert && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full border border-primary/50",
            cherche ? "assistant-spin border-t-transparent" : "assistant-ripple",
          )}
        />
      )}

      {/* Cœur : net, opaque, c'est lui qu'on vise du curseur. */}
      <span
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-full",
          "bg-gradient-to-br from-primary to-cyan-500 text-primary-foreground",
          "shadow-lg shadow-primary/30 ring-1 ring-white/20",
          "transition-transform duration-200 group-hover:scale-105 group-active:scale-95",
          !ouvert && !cherche && "assistant-core",
        )}
      >
        {ouvert ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </span>
    </button>
  );
}
