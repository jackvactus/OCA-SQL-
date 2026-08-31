import type { Locale } from "../i18n/locale";
import type { TrackId } from "../certification-tracks";
import { corpus, type Passage } from "./knowledge";

/**
 * Recherche dans le corpus : pondération TF-IDF, avec un poids fort sur le
 * titre et un bonus pour le parcours suivi.
 *
 * Ce n'est pas un modèle de langue, et c'est délibéré. Une réponse citée du
 * cours est vérifiable ; une réponse générée ne l'est pas. Sur un contenu de
 * certification, la première vaut mieux, même si elle est moins fluide.
 */

/** Mots trop fréquents pour discriminer quoi que ce soit. */
const VIDES = new Set([
  // français
  "le", "la", "les", "un", "une", "des", "du", "de", "d", "et", "ou", "que", "qui", "quoi",
  "quel", "quelle", "quels", "quelles", "est", "sont", "ce", "cet", "cette", "ces", "en",
  "dans", "sur", "pour", "par", "avec", "sans", "au", "aux", "il", "elle", "on", "je", "tu",
  "nous", "vous", "ils", "elles", "se", "sa", "son", "ses", "leur", "leurs", "plus", "moins",
  "pas", "ne", "n", "y", "a", "l", "s", "c", "quand", "comment", "pourquoi", "entre", "faire",
  "fait", "peut", "doit", "etre", "avoir", "quelle", "difference", "differences",
  // anglais
  "the", "a", "an", "of", "and", "or", "to", "in", "on", "for", "with", "without", "is",
  "are", "was", "were", "be", "been", "it", "its", "this", "that", "these", "those", "what",
  "which", "who", "whom", "how", "why", "when", "where", "do", "does", "did", "can", "could",
  "should", "would", "i", "you", "we", "they", "my", "your", "their", "between", "difference",
]);

/**
 * Mots-clés SQL que la liste des mots vides ne doit jamais retirer.
 *
 * `WHERE`, `WHEN`, `NOT`, `IN`, `ALL`, `ANY`, `SET`, `WITH`, `FROM`, `INTO`
 * sont aussi des mots courants de l'anglais. Les traiter comme tels revenait à
 * jeter la clause la plus importante du langage : « What is the difference
 * between WHERE and HAVING? » ne cherchait plus que « having ».
 */
const MOTS_SQL = new Set([
  "select", "from", "where", "group", "having", "order", "join", "on", "using",
  // « is » reste un mot vide : sa seule forme SQL, `IS NULL`, est toujours
  // accompagnée de `null`, qui suffit à retrouver le passage.
  "in", "not", "null", "between", "exists", "like", "all", "any", "some",
  "distinct", "union", "intersect", "minus", "case", "when", "then", "else",
  "end", "with", "into", "values", "set", "table", "view", "index", "key",
  "unique", "primary", "foreign", "check", "default", "constraint",
  "left", "right", "full", "outer", "inner", "cross", "natural",
  "fetch", "offset", "rows", "only", "asc", "desc", "dual",
  "insert", "update", "delete", "merge", "create", "alter", "drop", "truncate",
  "commit", "rollback", "savepoint", "grant", "revoke",
]);

/** Découpe en termes comparables : sans accent, sans ponctuation, sans mots vides. */
export function termes(texte: string): string[] {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9_*$]+/)
    .filter((mot) => mot.length >= 2 && (MOTS_SQL.has(mot) || !VIDES.has(mot)));
}

interface Indexe {
  passage: Passage;
  /** Occurrences par terme, corps et titre séparés. */
  corps: Map<string, number>;
  titre: Map<string, number>;
  longueur: number;
}

interface Index {
  documents: Indexe[];
  /** Nombre de documents contenant chaque terme. */
  frequenceDocument: Map<string, number>;
}

function compter(mots: string[]): Map<string, number> {
  const carte = new Map<string, number>();
  for (const mot of mots) carte.set(mot, (carte.get(mot) ?? 0) + 1);
  return carte;
}

const INDEX_CACHE = new Map<Locale, Index>();

function index(locale: Locale): Index {
  const memo = INDEX_CACHE.get(locale);
  if (memo) return memo;

  const documents: Indexe[] = corpus(locale).map((passage) => {
    const motsCorps = termes(passage.body);
    const motsTitre = termes(passage.title);
    return {
      passage,
      corps: compter(motsCorps),
      titre: compter(motsTitre),
      longueur: motsCorps.length + motsTitre.length,
    };
  });

  const frequenceDocument = new Map<string, number>();
  for (const doc of documents) {
    for (const terme of new Set([...doc.corps.keys(), ...doc.titre.keys()])) {
      frequenceDocument.set(terme, (frequenceDocument.get(terme) ?? 0) + 1);
    }
  }

  const construit = { documents, frequenceDocument };
  INDEX_CACHE.set(locale, construit);
  return construit;
}

export interface Resultat {
  passage: Passage;
  score: number;
  /** Termes de la question effectivement trouvés — sert à afficher le pourquoi. */
  correspondances: string[];
}

/**
 * Les meilleurs passages pour une question.
 *
 * @param track parcours suivi : ses passages sont favorisés, sans exclure les
 *              autres — une notion SQL reste utile à un candidat RAC.
 */
export function chercher(
  question: string,
  locale: Locale,
  track?: TrackId,
  limite = 4,
): Resultat[] {
  const requete = termes(question);
  if (requete.length === 0) return [];

  const { documents, frequenceDocument } = index(locale);
  const total = documents.length;
  const resultats: Resultat[] = [];

  for (const doc of documents) {
    let score = 0;
    const correspondances: string[] = [];

    for (const terme of new Set(requete)) {
      const df = frequenceDocument.get(terme);
      if (!df) continue;

      // IDF lissé : un terme présent partout ne départage rien.
      const idf = Math.log(1 + total / df);
      const dansCorps = doc.corps.get(terme) ?? 0;
      const dansTitre = doc.titre.get(terme) ?? 0;
      if (dansCorps === 0 && dansTitre === 0) continue;

      correspondances.push(terme);
      // Le titre pèse quatre fois : un passage intitulé « GROUP BY » traite du
      // sujet, un passage qui le mentionne au détour d'une phrase, non.
      score += idf * (Math.log(1 + dansCorps) + 4 * Math.log(1 + dansTitre));
    }

    if (score === 0) continue;

    // Sans normalisation, les passages les plus longs gagnent toujours.
    score /= Math.sqrt(Math.max(doc.longueur, 1));

    // Couvrir plusieurs termes de la question vaut mieux qu'en répéter un seul.
    score *= 1 + 0.5 * (correspondances.length / new Set(requete).size);

    if (track && doc.passage.track === track) score *= 1.25;

    resultats.push({ passage: doc.passage, score, correspondances });
  }

  resultats.sort((a, b) => b.score - a.score);

  // Un même titre peut apparaître dans plusieurs passages proches : on ne
  // propose pas deux fois la même source.
  const vus = new Set<string>();
  const retenus: Resultat[] = [];
  for (const r of resultats) {
    const cle = `${r.passage.href}|${r.passage.title}`;
    if (vus.has(cle)) continue;
    vus.add(cle);
    retenus.push(r);
    if (retenus.length >= limite) break;
  }
  return retenus;
}

/** Remise à zéro — réservée aux tests. */
export function resetIndex() {
  INDEX_CACHE.clear();
}
