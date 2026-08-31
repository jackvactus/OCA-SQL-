import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ExternalResource } from "@/lib/external-resources";
import { pickResource } from "@/lib/external-resources";
import type { Locale } from "@/lib/i18n/locale";

/**
 * Rend une liste de ressources externes.
 *
 * Deux règles tenues ici plutôt que répétées sur chaque page :
 *
 *  - `<Button asChild>` produit **une seule** ancre stylée en bouton. Écrire
 *    `<a><Button/></a>` créerait un bouton dans une ancre, que le navigateur
 *    reparente, ce qui casse la réconciliation React
 *    (voir `tests/html-nesting.test.ts`).
 *  - Chaque lien annonce aux lecteurs d'écran qu'il ouvre un nouvel onglet ;
 *    l'icône, purement décorative, leur est masquée.
 */
export function ExternalResourceLinks({
  resources,
  locale,
  newTabLabel,
  variant = "outline",
}: {
  resources: ExternalResource[];
  locale: Locale;
  /** Texte annonçant l'ouverture d'un onglet, déjà traduit. */
  newTabLabel: string;
  variant?: "outline" | "secondary" | "ghost";
}) {
  if (resources.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {resources.map((resource) => (
        <li key={resource.id}>
          <Button asChild variant={variant} size="sm" className="gap-1.5">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              title={pickResource(resource.description, locale)}
              aria-label={`${pickResource(resource.label, locale)} — ${newTabLabel}`}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              {pickResource(resource.label, locale)}
            </a>
          </Button>
        </li>
      ))}
    </ul>
  );
}

/**
 * Variante détaillée : le libellé **et** la phrase qui explique ce qu'on y
 * trouve. À utiliser quand la place le permet, pour éviter le lien nu.
 */
export function ExternalResourceCards({
  resources,
  locale,
  newTabLabel,
}: {
  resources: ExternalResource[];
  locale: Locale;
  newTabLabel: string;
}) {
  if (resources.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {resources.map((resource) => (
        <li key={resource.id}>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${pickResource(resource.label, locale)} — ${newTabLabel}`}
            className="group flex h-full flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold group-hover:text-primary">
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {pickResource(resource.label, locale)}
            </span>
            <span className="text-xs leading-relaxed text-muted-foreground">
              {pickResource(resource.description, locale)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
