import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Le HTML interdit le contenu interactif à l'intérieur d'une ancre. Un
 * `<button>` écrit dans un `<a>` est donc **reparenté par le navigateur** au
 * moment du parsing : le DOM réel cesse de correspondre à l'arbre rendu côté
 * serveur, et la première réconciliation — typiquement une navigation — casse
 * sur
 *
 *     Failed to execute 'removeChild' on 'Node':
 *     The node to be removed is not a child of this node.
 *
 * Trente occurrences existaient dans l'application. La forme correcte est le
 * motif `asChild` de Radix, qui produit une seule ancre stylée en bouton :
 *
 *     <Button asChild variant="outline">
 *       <Link href="/quiz">…</Link>
 *     </Button>
 */

const RACINES = ["app", "components"];

function fichiersTsx(racine: string): string[] {
  const sortie: string[] = [];
  const parcourir = (chemin: string) => {
    for (const entree of readdirSync(chemin)) {
      const complet = join(chemin, entree);
      if (statSync(complet).isDirectory()) parcourir(complet);
      else if (entree.endsWith(".tsx")) sortie.push(complet);
    }
  };
  parcourir(racine);
  return sortie;
}

/**
 * Ouvre une ancre sans la refermer sur la même ligne.
 *
 * Le `$` de l'expression est indispensable : quand les attributs sont répartis
 * sur plusieurs lignes, la ligne ne contient que `<a` ou `<Link`. Sans lui, ces
 * cas passaient entre les mailles — c'est ainsi que cinq ancres fautives de la
 * page d'un parcours ont d'abord échappé au contrôle.
 */
function ouvreAncre(ligne: string): boolean {
  const nu = ligne.trim();
  if (!/^<(a|Link)(\s|>|$)/.test(nu)) return false;
  if (nu.endsWith("/>")) return false;
  return !nu.includes("</a>") && !nu.includes("</Link>");
}

test("aucun <button> n'est imbriqué dans une ancre", () => {
  const fautifs: string[] = [];

  for (const racine of RACINES) {
    for (const fichier of fichiersTsx(racine)) {
      const lignes = readFileSync(fichier, "utf-8").split("\n");
      for (let i = 0; i < lignes.length; i++) {
        if (!ouvreAncre(lignes[i])) continue;

        // Trouver la fin de la balise ouvrante, puis la première ligne utile.
        let j = i;
        while (j < lignes.length && !lignes[j].trimEnd().endsWith(">")) j++;
        j++;
        while (j < lignes.length && lignes[j].trim() === "") j++;
        if (j >= lignes.length) continue;

        const enfant = lignes[j].trim();
        if (/^<Button(\s|>)/.test(enfant) || /^<button(\s|>)/.test(enfant)) {
          // `asChild` peut être sur la même ligne ou sur l'une des suivantes,
          // quand les propriétés sont réparties sur plusieurs lignes.
          const bloc = lignes.slice(j, j + 8).join(" ");
          if (!/\basChild\b/.test(bloc)) {
            fautifs.push(`${fichier}:${j + 1} (ancre ouverte ligne ${i + 1})`);
          }
        }
      }
    }
  }

  assert.deepEqual(
    fautifs,
    [],
    `Bouton imbriqué dans une ancre — utiliser <Button asChild><Link…>…</Link></Button> :\n  ${fautifs.join("\n  ")}`,
  );
});

test("aucune ancre n'est imbriquée dans une autre ancre", () => {
  const fautifs: string[] = [];

  for (const racine of RACINES) {
    for (const fichier of fichiersTsx(racine)) {
      const lignes = readFileSync(fichier, "utf-8").split("\n");
      let profondeur = 0;
      for (let i = 0; i < lignes.length; i++) {
        const nu = lignes[i].trim();
        const seul = /^<(a|Link)(\s|>|$)/.test(nu) && (nu.includes("</a>") || nu.includes("</Link>"));
        if (seul) {
          if (profondeur > 0) fautifs.push(`${fichier}:${i + 1}`);
          continue;
        }
        if (ouvreAncre(lignes[i])) {
          if (profondeur > 0) fautifs.push(`${fichier}:${i + 1}`);
          profondeur++;
        } else if (/^<\/(a|Link)>/.test(nu) && profondeur > 0) {
          profondeur--;
        }
      }
    }
  }

  assert.deepEqual(fautifs, [], `Ancres imbriquées :\n  ${fautifs.join("\n  ")}`);
});
