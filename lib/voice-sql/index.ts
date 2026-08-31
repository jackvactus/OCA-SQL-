import type { Locale } from "../i18n/locale";
import { runQuery } from "../sql-sandbox";
import {
  chercherValeur,
  colonnesDe,
  DISTINCT_MARQUEURS,
  GROUPE_MARQUEURS,
  INDEX_AGREGATS,
  INDEX_COLONNES,
  INDEX_LIKE,
  INDEX_OPERATEURS,
  INDEX_TABLES,
  MULTIPLICATEURS,
  NOMBRES,
  NON_NUL_MARQUEURS,
  normalise,
  NUL_MARQUEURS,
  REMPLISSAGE,
  TRI_ASC,
  TRI_DESC,
  TRI_MARQUEURS,
  indexer,
  tableConnue,
  type CibleColonne,
} from "./vocabulary";

/**
 * Dictée vers SQL.
 *
 * L'apprenant parle, le navigateur transcrit, ce module traduit, le bac à
 * sable exécute. Deux façons de dicter sont acceptées :
 *
 *  - **le SQL lu à voix haute** — « select étoile from employés où le salaire
 *    dépasse cinq mille » ;
 *  - **la question en langage courant** — « combien d'employés par
 *    département ».
 *
 * La traduction est déterministe et locale : aucun service externe, aucune
 * clé. Elle couvre un sous-ensemble assumé plutôt que de deviner — et quand
 * elle ne comprend pas, elle le dit et montre ce qu'elle a reconnu, au lieu de
 * produire une requête plausible mais fausse.
 *
 * Toute requête produite est **exécutée avant d'être rendue** : si le moteur
 * la refuse, le message d'erreur accompagne la proposition plutôt que de
 * laisser l'apprenant découvrir l'échec en cliquant.
 */

export interface VoiceSqlResult {
  /** Transcription telle que le navigateur l'a rendue. */
  transcript: string;
  /** Requête produite, ou `null` si rien n'a pu être construit. */
  sql: string | null;
  /** Comment la phrase a été lue. */
  mode: "dictee" | "question" | null;
  /** Ce qui a été reconnu, à afficher pour que l'apprenant vérifie. */
  compris: string[];
  /** Explication quand `sql` vaut `null`, ou quand la requête ne s'exécute pas. */
  message?: string;
  /** Vrai quand la requête a été exécutée sans erreur. */
  valide?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Nombres écrits en toutes lettres                                   */
/* ------------------------------------------------------------------ */

/** Articles indistinguables d'un numéral à l'oreille. */
const ARTICLES = new Set(["un", "une", "one"]);

/**
 * « cinq mille » → 5000.
 *
 * La reconnaissance vocale rend le plus souvent des chiffres, mais pas
 * toujours, et jamais pour les petits nombres (« les cinq premiers »).
 *
 * Le français impose deux traitements particuliers : « quatre-vingt » vaut 80
 * et non 4 + 20, et « et » se glisse dans « vingt et un ».
 */
export function motsVersNombres(mots: string[]): string[] {
  const source = mots
    .join(" ")
    // Un seul jeton, connu de la table : écrire « 80 » ici couperait le
    // nombre en deux et « quatre-vingt-dix » aurait donné 80 puis 10.
    .replace(/\bquatre vingts?\b/g, "quatrevingt")
    .replace(/\b(vingt|trente|quarante|cinquante|soixante) et\b/g, "$1")
    .split(" ")
    .filter(Boolean);

  const sortie: string[] = [];
  let total = 0;
  let courant = 0;
  let enCours = false;

  const vider = () => {
    if (!enCours) return;
    sortie.push(String(total + courant));
    total = 0;
    courant = 0;
    enCours = false;
  };

  for (const mot of source) {
    const valeur = NOMBRES[mot];

    // « une » est un article bien plus souvent qu'un nombre. Le convertir en
    // « 1 » détruisait « qui ont une commission », qui cessait d'être reconnu
    // comme un test de non-nullité pour devenir une limitation de lignes.
    // Il ne compte que soudé à un autre nombre : « vingt et un ».
    if (ARTICLES.has(mot) && !enCours) {
      sortie.push(mot);
      continue;
    }

    if (valeur === undefined) {
      vider();
      sortie.push(mot);
      continue;
    }
    enCours = true;
    if (MULTIPLICATEURS.has(mot)) {
      if (valeur === 1000) {
        total += (courant === 0 ? 1 : courant) * 1000;
        courant = 0;
      } else {
        courant = (courant === 0 ? 1 : courant) * valeur;
      }
      continue;
    }
    courant += valeur;
  }
  vider();
  return sortie;
}

/* ------------------------------------------------------------------ */
/*  Balayage en atomes                                                 */
/* ------------------------------------------------------------------ */

type Atome =
  | { type: "table"; valeur: string }
  | { type: "colonne"; valeur: CibleColonne }
  | { type: "operateur"; valeur: string }
  | { type: "agregat"; valeur: { fonction: string; colonne?: string } }
  | { type: "like"; valeur: "prefixe" | "suffixe" | "contient" }
  | { type: "nul"; negatif: boolean }
  | { type: "tri"; valeur: "ASC" | "DESC" }
  | { type: "triMarqueur" }
  | { type: "groupe" }
  | { type: "distinct" }
  | { type: "nombre"; valeur: number }
  | { type: "mot"; valeur: string };

const INDEX_TRI = indexer([
  { phrases: TRI_DESC, valeur: "DESC" as const },
  { phrases: TRI_ASC, valeur: "ASC" as const },
]);
const INDEX_TRI_MARQUEUR = indexer([{ phrases: TRI_MARQUEURS, valeur: true }]);
const INDEX_GROUPE = indexer([{ phrases: GROUPE_MARQUEURS, valeur: true }]);
const INDEX_NUL = indexer([
  { phrases: NON_NUL_MARQUEURS, valeur: false },
  { phrases: NUL_MARQUEURS, valeur: true },
]);
const INDEX_DISTINCT = indexer([{ phrases: DISTINCT_MARQUEURS, valeur: true }]);

/** Essaie chaque table de phrases à la position donnée, la plus longue d'abord. */
function atomeA(mots: string[], i: number): { atome: Atome; taille: number } | null {
  const essai = <T>(
    entrees: { mots: string[]; valeur: T }[],
    faire: (valeur: T) => Atome,
  ): { atome: Atome; taille: number } | null => {
    for (const entree of entrees) {
      if (entree.mots.every((mot, k) => mots[i + k] === mot)) {
        return { atome: faire(entree.valeur), taille: entree.mots.length };
      }
    }
    return null;
  };

  // L'ordre départage les phrases de longueur égale. Les marqueurs les plus
  // spécifiques passent devant : « au moins » doit être lu comme `>=`, pas
  // comme le tri « les moins élevés ».
  return (
    essai(INDEX_LIKE, (v) => ({ type: "like", valeur: v })) ??
    essai(INDEX_OPERATEURS, (v) => ({ type: "operateur", valeur: v })) ??
    essai(INDEX_AGREGATS, (v) => ({ type: "agregat", valeur: v })) ??
    essai(INDEX_TRI, (v) => ({ type: "tri", valeur: v })) ??
    essai(INDEX_TRI_MARQUEUR, () => ({ type: "triMarqueur" })) ??
    essai(INDEX_NUL, (v) => ({ type: "nul", negatif: v })) ??
    essai(INDEX_DISTINCT, () => ({ type: "distinct" })) ??
    essai(INDEX_COLONNES, (v) => ({ type: "colonne", valeur: v })) ??
    essai(INDEX_TABLES, (v) => ({ type: "table", valeur: v })) ??
    essai(INDEX_GROUPE, () => ({ type: "groupe" })) ??
    null
  );
}

export function balayer(texte: string): Atome[] {
  const mots = motsVersNombres(normalise(texte).split(" ").filter(Boolean));
  const atomes: Atome[] = [];

  for (let i = 0; i < mots.length; ) {
    if (/^-?\d+(\.\d+)?$/.test(mots[i])) {
      atomes.push({ type: "nombre", valeur: Number(mots[i]) });
      i += 1;
      continue;
    }
    const trouve = atomeA(mots, i);
    if (trouve) {
      atomes.push(trouve.atome);
      i += trouve.taille;
      continue;
    }
    atomes.push({ type: "mot", valeur: mots[i] });
    i += 1;
  }
  return atomes;
}

/* ------------------------------------------------------------------ */
/*  Colonnes et valeurs                                                */
/* ------------------------------------------------------------------ */

/**
 * Ramène une colonne sur la table réellement interrogée.
 *
 * « les départements triés par nom » visait `last_name`, qui n'existe pas dans
 * `departments` : la requête échouait sur ORA-00904. Le mot « nom » désigne en
 * fait `department_name`. On rapproche donc par le suffixe sémantique — nom,
 * identifiant, salaire, date — qui est ce que le locuteur a en tête.
 *
 * Renvoie `null` quand aucune correspondance n'existe : mieux vaut abandonner
 * la clause et le dire que produire une requête invalide.
 */
function resoudreColonne(cible: CibleColonne, table: string): string | null {
  const colonnes = colonnesDe(table);
  if (colonnes.includes(cible.column)) return cible.column;

  const suffixe = cible.column.split("_").pop() ?? cible.column;
  return colonnes.find((c) => c === suffixe || c.endsWith(`_${suffixe}`)) ?? null;
}

/** Met une valeur en forme SQL, en retrouvant sa casse dans le jeu de données. */
function litteral(brut: string | number, colonne: string): string {
  if (typeof brut === "number") return String(brut);

  const connues = chercherValeur(brut);
  const exacte = connues.find((v) => v.column === colonne) ?? connues[0];
  const valeur = exacte ? exacte.valeur : brut;
  return `'${valeur.replace(/'/g, "''")}'`;
}

/* ------------------------------------------------------------------ */
/*  Construction depuis une question en langage courant                */
/* ------------------------------------------------------------------ */

interface Condition {
  texte: string;
  description: string;
}

function construireQuestion(atomes: Atome[], locale: Locale): VoiceSqlResult {
  const compris: string[] = [];
  const ignores: string[] = [];
  const en = locale === "en";

  /* -------- table -------- */
  const tableAtome = atomes.find((a) => a.type === "table");
  const premiereColonne = atomes.find((a) => a.type === "colonne");
  const table =
    (tableAtome?.type === "table" && tableAtome.valeur) ||
    (premiereColonne?.type === "colonne" && premiereColonne.valeur.table) ||
    "employees";
  compris.push(`FROM ${table}`);

  const resoudre = (cible: CibleColonne): string | null => {
    const colonne = resoudreColonne(cible, table);
    if (!colonne) ignores.push(cible.column);
    return colonne;
  };

  /* -------- regroupement -------- */
  let groupBy: string | null = null;
  for (let i = 0; i < atomes.length - 1; i++) {
    if (atomes[i].type !== "groupe") continue;
    const suivant = atomes[i + 1];
    if (suivant.type === "colonne") {
      groupBy = resoudre(suivant.valeur);
    } else if (suivant.type === "table" && suivant.valeur !== table) {
      // « par département » quand on interroge employees : la colonne de
      // rattachement porte le nom de la table au singulier, suffixé _id.
      const candidate = `${suivant.valeur.replace(/s$/, "")}_id`;
      if (colonnesDe(table).includes(candidate)) groupBy = candidate;
    }
    if (groupBy) {
      compris.push(`GROUP BY ${groupBy}`);
      break;
    }
  }

  /* -------- projection -------- */
  const indexAgregat = atomes.findIndex((a) => a.type === "agregat");
  const projection: string[] = [];
  if (groupBy) projection.push(groupBy);

  if (indexAgregat >= 0) {
    const { fonction, colonne: implicite } = (
      atomes[indexAgregat] as Extract<Atome, { type: "agregat" }>
    ).valeur;

    // Une colonne mentionnée après l'agrégat en est l'argument — sauf si c'est
    // celle du regroupement : « combien d'employés par département » compte des
    // lignes, il ne compte pas des départements.
    const apres = atomes.slice(indexAgregat + 1).find(
      (a): a is Extract<Atome, { type: "colonne" }> => a.type === "colonne",
    );
    const argument =
      implicite ??
      (apres && resoudreColonne(apres.valeur, table) !== groupBy
        ? resoudreColonne(apres.valeur, table)
        : null);

    const expression = fonction === "COUNT" && !argument ? "COUNT(*)" : `${fonction}(${argument ?? "*"})`;
    projection.push(expression);
    compris.push(expression);
  }

  /* -------- conditions -------- */
  const conditions: Condition[] = [];
  for (let i = 0; i < atomes.length; i++) {
    const atome = atomes[i];

    // « sans commission » / « qui ont une commission »
    if (atome.type === "nul") {
      const suivant = atomes[i + 1];
      if (suivant?.type === "colonne") {
        const colonne = resoudre(suivant.valeur);
        if (colonne) {
          const texte = `${colonne} IS ${atome.negatif ? "" : "NOT "}NULL`;
          conditions.push({ texte, description: texte });
        }
        i += 1;
      }
      continue;
    }

    if (atome.type !== "colonne") continue;
    const colonne = resoudre(atome.valeur);
    if (!colonne) continue;
    const suivant = atomes[i + 1];
    if (!suivant) continue;

    /* --- colonne + opérateur + valeur --- */
    if (suivant.type === "operateur" || suivant.type === "nombre" || suivant.type === "mot") {
      // Sans opérateur explicite, « département 50 » et « département Sales »
      // se lisent comme une égalité : c'est ainsi qu'on parle.
      const operateur = suivant.type === "operateur" ? suivant.valeur : "=";
      const valeurAtome = suivant.type === "operateur" ? atomes[i + 2] : suivant;
      if (!valeurAtome) continue;

      const brut =
        valeurAtome.type === "nombre"
          ? valeurAtome.valeur
          : valeurAtome.type === "mot"
            ? valeurAtome.valeur
            : null;
      if (brut === null) continue;

      // Une valeur textuelle inconnue du jeu de données n'est pas une valeur :
      // c'est un mot de la phrase. « les employés du département » ne doit pas
      // produire `department_id = 'du'`.
      const connues = typeof brut === "string" ? chercherValeur(brut) : [];
      if (typeof brut === "string" && connues.length === 0) continue;

      // « les employés du département Sales » : la valeur appartient à une
      // autre table. Plutôt que d'échouer, on produit la sous-requête — c'est
      // exactement la forme que le programme officiel enseigne.
      const externe = connues.find((v) => v.table !== table);
      if (externe && operateur === "=") {
        const cle = `${externe.table.replace(/s$/, "")}_id`;
        if (colonnesDe(table).includes(cle) && colonnesDe(externe.table).includes(cle)) {
          const texte =
            `${cle} = (SELECT ${cle} FROM ${externe.table}` +
            ` WHERE ${externe.column} = '${externe.valeur.replace(/'/g, "''")}')`;
          conditions.push({ texte, description: `${externe.column} = ${externe.valeur}` });
          i += suivant.type === "operateur" ? 2 : 1;
          continue;
        }
      }

      const texte = `${colonne} ${operateur} ${litteral(brut, colonne)}`;
      conditions.push({ texte, description: texte });
      i += suivant.type === "operateur" ? 2 : 1;
      continue;
    }

    /* --- colonne + « commence par » + valeur --- */
    if (suivant.type === "like") {
      const valeurAtome = atomes[i + 2];
      if (valeurAtome?.type !== "mot" && valeurAtome?.type !== "nombre") continue;
      const brut = String(valeurAtome.valeur).toUpperCase();
      const motif =
        suivant.valeur === "prefixe"
          ? `${brut}%`
          : suivant.valeur === "suffixe"
            ? `%${brut}`
            : `%${brut}%`;
      const texte = `${colonne} LIKE '${motif}'`;
      conditions.push({ texte, description: texte });
      i += 2;
      continue;
    }

    if (suivant.type === "nul") {
      const texte = `${colonne} IS ${suivant.negatif ? "" : "NOT "}NULL`;
      conditions.push({ texte, description: texte });
      i += 1;
    }
  }

  /* -------- tri -------- */
  let orderBy: string | null = null;
  const indexTri = atomes.findIndex((a) => a.type === "triMarqueur" || a.type === "tri");
  if (indexTri >= 0) {
    const sens =
      atomes.slice(indexTri).find(
        (a): a is Extract<Atome, { type: "tri" }> => a.type === "tri",
      )?.valeur ?? "ASC";
    const cible =
      atomes.slice(indexTri).find(
        (a): a is Extract<Atome, { type: "colonne" }> => a.type === "colonne",
      ) ??
      atomes.find((a): a is Extract<Atome, { type: "colonne" }> => a.type === "colonne");
    const colonne = cible ? resoudre(cible.valeur) : null;
    if (colonne) {
      orderBy = `${colonne} ${sens}`;
      compris.push(`ORDER BY ${orderBy}`);
    }
  }

  /* -------- limitation -------- */
  //
  // Dans une condition, le nombre suit toujours un opérateur (« dépasse
  // 5000 ») ou une colonne (« département 50 »). Un nombre qui ne suit ni l'un
  // ni l'autre compte des lignes : « les 5 salaires les plus élevés ».
  let limite: number | null = null;
  for (let i = 0; i < atomes.length; i++) {
    const atome = atomes[i];
    if (atome.type !== "nombre") continue;
    const precedent = atomes[i - 1];
    if (precedent && (precedent.type === "operateur" || precedent.type === "colonne" || precedent.type === "like")) {
      continue;
    }
    limite = atome.valeur;
    compris.push(`FETCH FIRST ${limite} ROWS ONLY`);
    break;
  }

  /* -------- assemblage -------- */
  const distinct = atomes.some((a) => a.type === "distinct");

  if (projection.length === 0) {
    const citees = atomes
      .filter((a): a is Extract<Atome, { type: "colonne" }> => a.type === "colonne")
      .map((a) => resoudreColonne(a.valeur, table))
      .filter((c): c is string => c !== null);
    const utiles = [...new Set(citees)];
    projection.push(...(utiles.length > 0 ? utiles : ["*"]));
  }

  const lignes = [`SELECT ${distinct ? "DISTINCT " : ""}${projection.join(", ")}`, `FROM ${table}`];
  if (conditions.length > 0) lignes.push(`WHERE ${conditions.map((c) => c.texte).join("\n  AND ")}`);
  if (groupBy) lignes.push(`GROUP BY ${groupBy}`);
  if (orderBy) lignes.push(`ORDER BY ${orderBy}`);
  if (limite !== null) lignes.push(`FETCH FIRST ${limite} ROWS ONLY`);

  for (const condition of conditions) compris.push(`WHERE ${condition.description}`);

  // Une phrase où rien n'a été reconnu produirait « SELECT * FROM employees »,
  // ce qui donnerait l'illusion d'avoir été comprise.
  const reconnu =
    conditions.length > 0 ||
    projection[0] !== "*" ||
    groupBy !== null ||
    orderBy !== null ||
    tableAtome !== undefined;

  if (!reconnu) {
    return {
      transcript: "",
      sql: null,
      mode: null,
      compris: [],
      message: en
        ? "Nothing recognisable in what was said. Name a table (employees, departments, jobs) and a condition — for example “employees whose salary is over 5000”."
        : "Rien de reconnaissable dans ce qui a été dit. Nommez une table (employés, départements, postes) et une condition — par exemple « les employés dont le salaire dépasse 5000 ».",
    };
  }

  const message =
    ignores.length > 0
      ? en
        ? `Ignored, absent from ${table}: ${[...new Set(ignores)].join(", ")}.`
        : `Ignoré, absent de ${table} : ${[...new Set(ignores)].join(", ")}.`
      : undefined;

  return { transcript: "", sql: lignes.join("\n"), mode: "question", compris, message };
}

/* ------------------------------------------------------------------ */
/*  SQL dicté mot à mot                                                */
/* ------------------------------------------------------------------ */

/** Mots parlés qui deviennent des symboles ou des mots-clés SQL. */
const DICTEE: [RegExp, string][] = [
  [/\b(selectionne(r|z)?|select)\b/g, "SELECT"],
  [/\b(etoile|asterisque|star|asterisk)\b/g, "*"],
  [/\b(depuis la table|dans la table|de la table|from|depuis)\b/g, "FROM"],
  [/\b(ou bien|or)\b/g, "OR"],
  [/\b(where|ou|quand)\b/g, "WHERE"],
  [/\b(group by|regroupe par|groupe par)\b/g, "GROUP BY"],
  [/\b(order by|trie par|classe par)\b/g, "ORDER BY"],
  [/\b(having)\b/g, "HAVING"],
  [/\b(and|et)\b/g, "AND"],
  [/\b(descendant|decroissant|desc)\b/g, "DESC"],
  [/\b(ascendant|croissant|asc)\b/g, "ASC"],
  [/\b(different de|difference de)\b/g, "!="],
  [/\b(superieur ou egal a)\b/g, ">="],
  [/\b(inferieur ou egal a)\b/g, "<="],
  [/\b(superieur a|plus grand que|greater than)\b/g, ">"],
  [/\b(inferieur a|plus petit que|less than)\b/g, "<"],
  [/\b(egal a|egale|equals|equal)\b/g, "="],
  [/\b(virgule|comma)\b/g, ","],
  [/\b(point virgule|semicolon)\b/g, ";"],
  [/\b(parenthese ouvrante|open paren)\b/g, "("],
  [/\b(parenthese fermante|close paren)\b/g, ")"],
  [/\b(n est pas nul|is not null)\b/g, "IS NOT NULL"],
  [/\b(est nul|is null)\b/g, "IS NULL"],
];

/** Vrai quand la phrase commence par un verbe de requête : c'est du SQL dicté. */
export function ressembleADuSqlDicte(texte: string): boolean {
  return /^(select|selectionne|selectionner|selectionnez)\b/.test(normalise(texte));
}

function construireDictee(texte: string, locale: Locale): VoiceSqlResult {
  const en = locale === "en";
  let sortie = ` ${normalise(texte)} `;
  for (const [motif, remplacement] of DICTEE) {
    sortie = sortie.replace(motif, remplacement);
  }

  // Les noms de tables et de colonnes sont dictés en français : on les rend à
  // leur identifiant réel, sans quoi la requête viserait « employés ».
  const mots = motsVersNombres(sortie.split(/\s+/).filter(Boolean));
  const resultat: string[] = [];
  const compris: string[] = [];
  let dansLaProjection = true;

  for (let i = 0; i < mots.length; ) {
    const mot = mots[i];

    // Les déterminants n'ont pas d'équivalent en SQL. Les laisser produisait
    // « SELECT le last_name AND le salary FROM les employees ».
    if (REMPLISSAGE.has(mot)) {
      i += 1;
      continue;
    }
    if (mot === "FROM") dansLaProjection = false;

    // Dans la liste des colonnes, « et » sépare — il ne conjoint pas.
    if (mot === "AND" && dansLaProjection) {
      resultat.push(",");
      i += 1;
      continue;
    }

    const trouve = atomeA(mots, i);
    if (trouve?.atome.type === "table") {
      resultat.push(trouve.atome.valeur);
      compris.push(`table : ${trouve.atome.valeur}`);
      i += trouve.taille;
      continue;
    }
    if (trouve?.atome.type === "colonne") {
      resultat.push(trouve.atome.valeur.column);
      compris.push(`colonne : ${trouve.atome.valeur.column}`);
      i += trouve.taille;
      continue;
    }

    resultat.push(mot);
    i += 1;
  }

  const sql = resultat
    .join(" ")
    .replace(/\s+([,;)])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!/\bFROM\b/.test(sql)) {
    return {
      transcript: texte,
      sql: null,
      mode: null,
      compris,
      message: en
        ? "The dictated query has no FROM clause. Say the table after “from” — for example “select star from employees”."
        : "La requête dictée n'a pas de clause FROM. Dites la table après « from » — par exemple « select étoile from employés ».",
    };
  }

  const apresFrom = sql.split(/\bFROM\b/)[1]?.trim().split(/\s+/)[0];
  if (apresFrom && !tableConnue(apresFrom.toLowerCase())) {
    return {
      transcript: texte,
      sql,
      mode: "dictee",
      compris,
      message: en
        ? `“${apresFrom}” is not a table of the sandbox schema. Available: employees, departments, jobs, dual.`
        : `« ${apresFrom} » n'est pas une table du schéma du bac à sable. Disponibles : employees, departments, jobs, dual.`,
    };
  }

  return { transcript: texte, sql, mode: "dictee", compris };
}

/* ------------------------------------------------------------------ */
/*  Point d'entrée                                                     */
/* ------------------------------------------------------------------ */

export function voiceToSql(transcript: string, locale: Locale = "fr"): VoiceSqlResult {
  const propre = transcript.trim();
  if (!propre) {
    return {
      transcript,
      sql: null,
      mode: null,
      compris: [],
      message: locale === "en" ? "Nothing was heard." : "Rien n'a été entendu.",
    };
  }

  const brut = ressembleADuSqlDicte(propre)
    ? construireDictee(propre, locale)
    : construireQuestion(balayer(propre), locale);

  const resultat: VoiceSqlResult = { ...brut, transcript: propre };
  if (!resultat.sql) return resultat;

  // Vérification avant de rendre la main : une requête proposée puis refusée
  // au clic est plus décourageante qu'un refus annoncé.
  const execution = runQuery(resultat.sql);
  resultat.valide = !execution.error;
  // Un message déjà posé par la traduction est plus utile que l'erreur du
  // moteur : « clients n'est pas une table, voici les tables disponibles »
  // vaut mieux qu'un ORA-00942 brut.
  if (execution.error && !resultat.message) resultat.message = execution.error;

  return resultat;
}
