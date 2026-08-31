"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/components/language-provider";
import { useCurrentTrack } from "@/components/track-provider";
import { assistantStrings } from "@/lib/assistant/strings";
import type { AssistantExchange } from "@/lib/assistant/types";
import { AssistantOrb } from "./orb";
import { AssistantPanel } from "./panel";

/**
 * Assistant : le point lumineux, le panneau, et l'aller-retour réseau.
 *
 * Monté une fois dans la coquille de l'espace connecté, donc présent sur
 * toutes les pages. La question part avec son contexte — page, parcours,
 * langue — pour qu'une réponse puisse être ancrée sur le contenu réellement
 * consulté plutôt que sur une question hors sol.
 */
export function Assistant() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const { trackId } = useCurrentTrack();
  const s = assistantStrings(locale);

  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [exchanges, setExchanges] = useState<AssistantExchange[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ctrl/Cmd + K ouvre et ferme, Échap ferme. Un assistant qu'il faut viser à
  // la souris depuis un exercice au clavier ne sert pas.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const poser = useCallback(
    async (question: string) => {
      setPending(true);
      setError(null);
      setDraft("");
      try {
        const reponse = await fetch("/api/assistant/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, path: pathname, track: trackId, locale }),
        });

        if (reponse.status === 429) {
          setError(s.errorRate);
          return;
        }
        if (!reponse.ok) {
          setError(s.errorGeneric);
          return;
        }

        const echange = (await reponse.json()) as AssistantExchange;
        setExchanges((liste) => [...liste, echange]);
      } catch {
        setError(s.errorGeneric);
      } finally {
        setPending(false);
      }
    },
    [pathname, trackId, locale, s.errorGeneric, s.errorRate],
  );

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
      <div className="pointer-events-auto">
        <AssistantPanel
          id={panelId}
          open={open}
          exchanges={exchanges}
          pending={pending}
          error={error}
          draft={draft}
          s={s}
          onDraftChange={setDraft}
          onSubmit={poser}
          onClose={() => setOpen(false)}
          // N'efface que l'affichage : la transcription persistée reste
          // consultable, et seule la page d'audit peut la supprimer.
          onClear={() => {
            setExchanges([]);
            setError(null);
          }}
        />
      </div>
      <div className="pointer-events-auto">
        <AssistantOrb
          state={pending ? "thinking" : open ? "open" : "idle"}
          label={open ? s.close : s.open}
          shortcut={s.shortcut}
          panelId={panelId}
          onClick={() => setOpen((v) => !v)}
        />
      </div>
    </div>
  );
}
