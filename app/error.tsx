"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Frontière d'erreur de l'application.
 *
 * Sans ce fichier, Next.js remplace toute erreur — y compris une erreur de
 * composant serveur survenue pendant une navigation côté client — par le
 * message générique « une exception côté client s'est produite », qui
 * n'apprend rien. Ici l'erreur réelle est affichée et journalisée.
 * (Constat OPS-02 de `docs/AUDIT-SYSTEME.md`.)
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[OracleMaster] Erreur non gérée :", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-destructive/30 bg-destructive/[0.04] p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>

        <h1 className="mt-4 text-xl font-bold">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n’a pas pu être affichée. Vous pouvez réessayer sans perdre votre progression.
        </p>

        <pre className="mt-4 max-h-40 overflow-auto rounded-lg border border-border/70 bg-muted/50 p-3 text-left text-xs leading-relaxed text-muted-foreground">
          {error.message || "Erreur inconnue"}
          {error.digest ? `\n\nRéférence : ${error.digest}` : ""}
        </pre>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Réessayer
          </Button>
          <a href="/dashboard">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Tableau de bord
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
