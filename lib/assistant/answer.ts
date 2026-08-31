import { runQuery } from "../sql-sandbox";
import { chercher } from "./search";
import type { AssistantAnswer, AssistantContext, AssistantSource, AssistantSql } from "./types";

/**
 * Production de la réponse.
 *
 * L'assistant **cite le cours** : il cherche les passages qui traitent de la
 * question dans les 57 sessions, les 792 questions corrigées, les 455 objectifs
 * officiels et la référence, puis restitue le meilleur avec ses sources.
 *
 * Ce choix est délibéré. Un modèle de langue produirait des phrases plus
 * fluides, mais rien ne garantirait qu'elles soient vraies ; sur une
 * plateforme de certification, une affirmation fausse mais assurée coûte un
 * examen. Une citation du cours est vérifiable d'un clic.
 *
 * ---------------------------------------------------------------------------
 * POINT D'EXTENSION — brancher un modèle par-dessus
 * ---------------------------------------------------------------------------
 *
 * `chercher()` reste utile même avec un modèle : il fournit le contexte à
 * citer. La forme recommandée est la génération augmentée par recherche —
 * passer les passages au modèle et lui interdire de sortir de ce cadre :
 *
 *   const trouves = chercher(question, context.locale, context.track, 6);
 *   const contexte = trouves.map((r) => `${r.passage.title}\n${r.passage.body}`).join("\n\n---\n\n");
 *   const reponse = await fetch("https://…", {
 *     method: "POST",
 *     headers: {
 *       "content-type": "application/json",
 *       authorization: `Bearer ${process.env.ASSISTANT_API_KEY}`,
 *     },
 *     body: JSON.stringify({ question, contexte }),
 *   });
 *
 * La fonction s'exécute côté serveur : une clé lue dans `process.env`
 * n'atteint jamais le navigateur. Elle peut lever, la route traduit l'erreur.
 *
 * Contrat à tenir dans tous les cas : répondre dans `context.locale`, citer
 * ses sources, et dire qu'on ne sait pas plutôt que d'inventer.
 */

/** En dessous, la meilleure correspondance ne vaut pas mieux que du hasard. */
const SEUIL = 0.08;

/** Longueur maximale d'une citation, avant coupe sur une fin de phrase. */
const CITATION_MAX = 900;

/** Coupe proprement : on préfère finir sur une phrase que sur un mot tronqué. */
function citer(texte: string): string {
  const propre = texte.replace(/\n{3,}/g, "\n\n").trim();
  if (propre.length <= CITATION_MAX) return propre;

  const coupe = propre.slice(0, CITATION_MAX);
  const fin = Math.max(coupe.lastIndexOf(". "), coupe.lastIndexOf("\n"), coupe.lastIndexOf(" ; "));
  return `${(fin > CITATION_MAX * 0.5 ? coupe.slice(0, fin + 1) : coupe).trim()}…`;
}

/**
 * Une requête n'est proposée comme exécutable que si elle passe réellement
 * dans le moteur du bac à sable. Proposer un bouton « exécuter » qui échoue
 * sous les yeux de l'apprenant est pire que ne pas le proposer.
 */
function verifier(requete: string): AssistantSql | null {
  const nettoyee = requete.trim().replace(/;\s*$/, "");

  // Le cours illustre aussi des tables qui n'existent pas dans le schéma HR
  // simulé (`comm`, `emp`, vues d'administration). Un extrait qui ne tourne
  // pas n'est pas proposé du tout : un bouton « exécuter » qui échoue sous
  // les yeux de l'apprenant est pire que pas de bouton.
  if (!/^\s*(SELECT|WITH)\b/i.test(nettoyee)) return null;
  if (!/\bFROM\b/i.test(nettoyee)) return null;
  if (runQuery(nettoyee).error) return null;

  return { query: nettoyee, runnable: true };
}

export async function answerQuestion(
  question: string,
  context: AssistantContext,
): Promise<AssistantAnswer> {
  const en = context.locale === "en";
  // Douze résultats, pas quatre : les quatre premiers font les sources, et les
  // suivants servent uniquement à trouver un extrait SQL. La meilleure réponse
  // est souvent une question corrigée ou un point de contrôle, qui n'embarque
  // aucun code, alors qu'un passage de cours juste derrière en contient un.
  const trouves = chercher(question, context.locale, context.track, 12);

  if (trouves.length === 0 || trouves[0].score < SEUIL) {
    return {
      text: en
        ? "I could not find a passage in the course that answers this. Try naming the SQL clause or the Oracle concept directly — for example “GROUP BY”, “outer join”, “NULL in NOT IN”, “ORA-00934”. The reference page also lists the glossary and the single-row functions."
        : "Je n'ai pas trouvé dans le cours de passage qui réponde à cette question. Essayez de nommer directement la clause SQL ou la notion Oracle — par exemple « GROUP BY », « jointure externe », « NULL dans NOT IN », « ORA-00934 ». La page de référence contient aussi le glossaire et les fonctions mono-ligne.",
      sources: [
        {
          label: en ? "Reference — glossary and functions" : "Référence — glossaire et fonctions",
          href: "/reference",
          kind: "reference",
        },
      ],
      sql: [],
    };
  }

  const meilleur = trouves[0].passage;

  const sources: AssistantSource[] = trouves.slice(0, 4).map((r) => ({
    label: r.passage.title,
    href: r.passage.href,
    kind: r.passage.kind,
  }));

  // Deux extraits au plus : au-delà, la réponse devient un copier-coller du
  // cours et l'apprenant ferait mieux d'ouvrir la source.
  const sql: AssistantSql[] = [];
  const dejaVues = new Set<string>();
  for (const { passage } of trouves) {
    for (const requete of passage.sql.slice(0, 4)) {
      const verifiee = verifier(requete);
      if (!verifiee || dejaVues.has(verifiee.query)) continue;
      dejaVues.add(verifiee.query);
      if (sql.length === 0 && passage.sqlCaption) verifiee.caption = passage.sqlCaption;
      sql.push(verifiee);
      if (sql.length === 2) break;
    }
    if (sql.length === 2) break;
  }

  const entete = en
    ? `From the course — ${meilleur.title}:`
    : `D'après le cours — ${meilleur.title} :`;

  return {
    text: `${entete}\n\n${citer(meilleur.body)}`,
    sources,
    sql,
  };
}

/**
 * Vrai : l'assistant répond à partir du contenu de la plateforme, sans clé
 * d'API ni service externe.
 */
export function isAssistantConfigured(): boolean {
  return true;
}
