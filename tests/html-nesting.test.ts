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

interface Balise {
  nom: string;
  fermante: boolean;
  autoFermante: boolean;
  tag: string;
  ligne: number;
}

/**
 * Blanchit les commentaires en conservant les sauts de ligne, donc la
 * numérotation. Sans cela, un exemple de code écrit dans un commentaire
 * — « <a><Button/></a> créerait un bouton dans une ancre » — était compté
 * comme une infraction réelle.
 */
function sansCommentaires(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, (bloc) => bloc.replace(/[^\n]/g, " "));
}

/**
 * Découpe un fichier en balises JSX.
 *
 * Les alternatives du motif neutralisent ce qui pourrait imiter une balise :
 * chaînes entre guillemets, apostrophes ou accents graves, et expressions
 * entre accolades (un niveau d'imbrication).
 */
function balises(source: string): Balise[] {
  const sortie: Balise[] = [];
  const motif =
    /<(\/?)([A-Za-z][\w.]*)((?:[^<>{}"'`]|"[^"]*"|'[^']*'|`[^`]*`|\{(?:[^{}]|\{[^{}]*\})*\})*?)(\/?)>/g;
  const texte = sansCommentaires(source);
  let m: RegExpExecArray | null;
  while ((m = motif.exec(texte))) {
    sortie.push({
      nom: m[2],
      fermante: m[1] === "/",
      autoFermante: m[4] === "/",
      tag: m[0],
      ligne: source.slice(0, m.index).split("\n").length,
    });
  }
  return sortie;
}

const ANCRES = new Set(["a", "Link"]);
const BOUTONS = new Set(["button", "Button"]);

/**
 * Un bouton imbriqué dans une ancre, **à n'importe quelle profondeur**.
 *
 * La première version de ce contrôle ne regardait que la ligne suivant
 * immédiatement l'ancre, et cherchait `asChild` dans une fenêtre de huit
 * lignes. Elle a laissé passer deux cas réels :
 *
 *  - `<Link><Card>…<Button/>…</Card></Link>` sur la page des cours, où le
 *    bouton est enfoui à quatre niveaux — c'est précisément là que l'erreur
 *    `removeChild` se déclenchait en ouvrant un cours ;
 *  - `<a><Button/></a>` sur la page des parcours, où la fenêtre de huit lignes
 *    atteignait le bouton *suivant*, correctement écrit en `asChild`, ce qui
 *    suffisait à désarmer le contrôle.
 *
 * D'où ce parcours par pile : on suit la profondeur d'ancre et on signale tout
 * bouton ouvert à l'intérieur.
 */
test("aucun <button> n'est imbriqué dans une ancre", () => {
  const fautifs: string[] = [];

  for (const racine of RACINES) {
    for (const fichier of fichiersTsx(racine)) {
      const source = readFileSync(fichier, "utf-8");
      let profondeur = 0;

      for (const balise of balises(source)) {
        if (ANCRES.has(balise.nom)) {
          if (balise.autoFermante) continue;
          if (balise.fermante) profondeur = Math.max(0, profondeur - 1);
          else profondeur++;
          continue;
        }
        if (!BOUTONS.has(balise.nom) || balise.fermante) continue;

        // `asChild` fait rendre l'ancre elle-même : le bouton disparaît du DOM.
        if (/\basChild\b/.test(balise.tag)) continue;
        if (profondeur > 0) fautifs.push(`${fichier}:${balise.ligne}`);
      }
    }
  }

  assert.deepEqual(
    fautifs,
    [],
    "Bouton imbriqué dans une ancre — utiliser <Button asChild><Link…>…</Link></Button>, " +
      `ou un <span> quand la carte entière est déjà cliquable :\n  ${fautifs.join("\n  ")}`,
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

/**
 * L'attribut `hidden` ne peut pas masquer un élément qui porte aussi une
 * classe d'affichage.
 *
 * `[hidden] { display: none }` vient de la feuille du navigateur ; une classe
 * utilitaire comme `flex` est une règle d'auteur, donc prioritaire. Le panneau
 * de l'assistant restait ainsi affiché en permanence, et son calque
 * interceptait les clics dans tout le coin inférieur droit de chaque page :
 * les boutons situés dessous ne répondaient plus.
 *
 * La forme correcte est un style en ligne, qui l'emporte sur toute classe.
 */
test("aucun élément masqué par `hidden` ne porte de classe d'affichage", () => {
  const fautifs: string[] = [];
  const AFFICHAGE = /\b(flex|grid|block|inline-flex|inline-block|table)\b/;

  for (const racine of RACINES) {
    for (const fichier of fichiersTsx(racine)) {
      const source = readFileSync(fichier, "utf-8");
      for (const balise of balises(source)) {
        if (balise.fermante || !/\shidden=\{/.test(balise.tag)) continue;
        const classe = /className=(?:\{([\s\S]*?)\}|"([^"]*)")/.exec(balise.tag);
        if (!classe) continue;
        const valeur = classe[1] ?? classe[2] ?? "";
        if (AFFICHAGE.test(valeur) && !/\bstyle=/.test(balise.tag)) {
          fautifs.push(`${fichier}:${balise.ligne}`);
        }
      }
    }
  }

  assert.deepEqual(
    fautifs,
    [],
    `\`hidden\` neutralisé par une classe d'affichage — piloter \`display\` en style en ligne :\n  ${fautifs.join("\n  ")}`,
  );
});
