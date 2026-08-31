import { schema } from "../sql-sandbox/schema";

/**
 * Vocabulaire de la dictée : ce que l'apprenant peut dire, et ce que ça vise
 * dans le schéma HR.
 *
 * Tout est bilingue et sans accent : le texte dicté passe par `normalise()`
 * avant d'être confronté à ces tables, et les entrées subissent le même
 * traitement au chargement du module. On peut donc écrire « date d'embauche »
 * ici et faire correspondre « date d embauche » là.
 *
 * Les correspondances sont cherchées **de la plus longue à la plus courte** :
 * sans cela « nom du departement » serait reconnu comme « nom », et la
 * requête viserait la mauvaise colonne.
 */

/** Retire accents, apostrophes et ponctuation ; réduit les espaces. */
export function normalise(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’`]/g, " ")
    .replace(/[.,;!?:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ------------------------------------------------------------------ */
/*  Tables                                                             */
/* ------------------------------------------------------------------ */

export const TABLE_SYNONYMES: Record<string, string[]> = {
  employees: [
    "employes", "employe", "employee", "employees",
    "salaries", "salarie", "personnel", "staff", "workers", "worker", "people", "gens",
  ],
  departments: [
    "departements", "departement", "department", "departments",
    "services", "service", "divisions",
  ],
  jobs: ["postes", "poste", "emplois", "emploi", "metiers", "metier", "jobs", "job", "fonctions"],
};

/* ------------------------------------------------------------------ */
/*  Colonnes                                                           */
/* ------------------------------------------------------------------ */

/** Une colonne visée, avec la table à laquelle elle appartient. */
export interface CibleColonne {
  table: string;
  column: string;
}

const COLONNE_SYNONYMES: { phrases: string[]; cible: CibleColonne }[] = [
  // employees
  { phrases: ["identifiant employe", "numero employe", "id employe", "employee id", "employee number"],
    cible: { table: "employees", column: "employee_id" } },
  { phrases: ["prenom", "prenoms", "first name", "given name"],
    cible: { table: "employees", column: "first_name" } },
  { phrases: ["nom de famille", "last name", "surname", "family name", "nom"],
    cible: { table: "employees", column: "last_name" } },
  { phrases: ["adresse mail", "courriel", "email", "mail", "e mail"],
    cible: { table: "employees", column: "email" } },
  { phrases: ["numero de telephone", "telephone", "phone number", "phone"],
    cible: { table: "employees", column: "phone_number" } },
  { phrases: ["date d embauche", "date embauche", "embauche", "hire date", "date hired", "start date"],
    cible: { table: "employees", column: "hire_date" } },
  { phrases: ["identifiant du poste", "code du poste", "job id"],
    cible: { table: "employees", column: "job_id" } },
  // « gagner » désigne le salaire aussi naturellement que le mot lui-même :
  // « les employés qui gagnent au moins 10000 » ne nommait aucune colonne et
  // produisait un SELECT * sans filtre.
  { phrases: ["salaire", "salaires", "remuneration", "paye", "gagnent", "gagne", "gagner",
              "salary", "pay", "wage", "wages", "earn", "earns", "earning"],
    cible: { table: "employees", column: "salary" } },
  { phrases: ["pourcentage de commission", "taux de commission", "commission pct", "commission"],
    cible: { table: "employees", column: "commission_pct" } },
  { phrases: ["responsable", "manager", "chef", "superieur", "boss", "manager id"],
    cible: { table: "employees", column: "manager_id" } },

  // departments
  { phrases: ["nom du departement", "nom de departement", "nom du service", "department name"],
    cible: { table: "departments", column: "department_name" } },
  { phrases: ["identifiant du departement", "numero de departement", "department id"],
    cible: { table: "departments", column: "department_id" } },
  { phrases: ["localisation", "lieu", "location", "location id"],
    cible: { table: "departments", column: "location_id" } },

  // jobs
  { phrases: ["intitule du poste", "titre du poste", "intitule", "job title"],
    cible: { table: "jobs", column: "job_title" } },
  { phrases: ["salaire minimum", "minimum salary", "min salary"],
    cible: { table: "jobs", column: "min_salary" } },
  { phrases: ["salaire maximum", "maximum salary", "max salary"],
    cible: { table: "jobs", column: "max_salary" } },

  // Ambigu par nature : « departement » est une colonne dans employees et une
  // table ailleurs. La résolution tranche selon la table retenue.
  { phrases: ["departement", "department", "service"],
    cible: { table: "employees", column: "department_id" } },
  { phrases: ["poste", "emploi", "fonction", "job"],
    cible: { table: "employees", column: "job_id" } },
];

/* ------------------------------------------------------------------ */
/*  Opérateurs, agrégats, tri                                          */
/* ------------------------------------------------------------------ */

export const OPERATEURS: { phrases: string[]; operateur: string }[] = [
  { phrases: ["superieur ou egal a", "au moins egal a", "au moins", "greater than or equal to", "at least", "no less than"], operateur: ">=" },
  { phrases: ["inferieur ou egal a", "au plus", "less than or equal to", "at most", "no more than"], operateur: "<=" },
  { phrases: ["strictement superieur a", "superieure a", "superieur a", "plus grand que", "plus eleve que", "plus de", "plus que", "depasse", "depassent", "au dessus de", "greater than", "more than", "above", "over", "exceeds", "exceed"], operateur: ">" },
  { phrases: ["strictement inferieur a", "inferieure a", "inferieur a", "plus petit que", "moins eleve que", "moins de", "moins que", "en dessous de", "less than", "fewer than", "below", "under"], operateur: "<" },
  { phrases: ["different de", "differente de", "n est pas egal a", "pas egal a", "autre que", "not equal to", "different from", "other than"], operateur: "!=" },
  { phrases: ["est egal a", "egal a", "egale a", "egaux a", "vaut", "valent", "equal to", "equals", "is exactly"], operateur: "=" },
];

/**
 * Un agrégat, et la colonne qu'il sous-entend quand la formule la contient.
 *
 * « le salaire moyen » nomme la fonction ET son argument : sans `colonne`, le
 * mot « salaire » était avalé par la phrase de l'agrégat et la requête
 * produisait `AVG(department_id)`.
 */
export const AGREGATS: { phrases: string[]; fonction: string; colonne?: string }[] = [
  { phrases: ["combien", "nombre de", "nombre d", "compte le nombre", "how many", "count of", "number of"], fonction: "COUNT" },
  { phrases: ["salaire moyen", "average salary", "mean salary"], fonction: "AVG", colonne: "salary" },
  { phrases: ["masse salariale", "total salary", "total payroll"], fonction: "SUM", colonne: "salary" },
  { phrases: ["salaire le plus eleve", "highest salary", "top salary"], fonction: "MAX", colonne: "salary" },
  { phrases: ["salaire le plus bas", "lowest salary"], fonction: "MIN", colonne: "salary" },
  { phrases: ["moyenne du", "moyenne des", "moyenne de", "moyenne", "average", "mean"], fonction: "AVG" },
  { phrases: ["somme des", "somme du", "somme", "total des", "total du", "sum of", "sum", "total"], fonction: "SUM" },
  { phrases: ["le plus eleve", "la plus elevee", "le plus haut", "le maximum", "maximum", "highest", "largest", "max"], fonction: "MAX" },
  { phrases: ["le plus bas", "la plus basse", "le minimum", "minimum", "lowest", "smallest", "min"], fonction: "MIN" },
];

export const TRI_DESC = [
  "decroissant", "decroissante", "descendant", "du plus grand au plus petit", "du plus eleve au moins eleve",
  "les plus eleves", "les plus elevees", "les mieux payes", "descending", "highest first", "biggest first",
];

export const TRI_ASC = [
  "croissant", "croissante", "ascendant", "du plus petit au plus grand",
  "les moins eleves", "les moins payes", "ascending", "lowest first",
];

export const TRI_MARQUEURS = [
  "trie par", "tries par", "triee par", "classe par", "classee par", "ordonne par", "ordonnee par",
  "par ordre de", "par ordre du", "sorted by", "ordered by", "order by", "sort by",
];

export const GROUPE_MARQUEURS = [
  "par", "pour chaque", "group by", "grouped by", "for each", "per",
];

export const NUL_MARQUEURS = [
  "sans", "qui n ont pas de", "qui n a pas de", "qui n ont pas", "n ont pas de", "sans aucune", "without", "with no", "no",
];

export const NON_NUL_MARQUEURS = [
  "qui ont une", "qui ont un", "qui ont de", "qui touchent une", "avec une", "avec un", "with a", "with an", "who have a", "having a",
];

export const LIKE_MARQUEURS: { phrases: string[]; forme: "prefixe" | "suffixe" | "contient" }[] = [
  { phrases: ["commence par", "commencent par", "commencant par", "starts with", "starting with", "begins with"], forme: "prefixe" },
  { phrases: ["se termine par", "se terminent par", "finit par", "finissent par", "ends with", "ending with"], forme: "suffixe" },
  { phrases: ["contient", "contiennent", "contenant", "contains", "containing", "includes"], forme: "contient" },
];

/** Déterminants et liaisons sans valeur en SQL, retirés de la dictée. */
export const REMPLISSAGE = new Set([
  "le", "la", "les", "l", "du", "de", "des", "d", "un", "une", "au", "aux",
  "the", "a", "an", "of",
]);

export const DISTINCT_MARQUEURS = ["distinct", "distincts", "distinctes", "differents", "differentes", "uniques", "unique", "sans doublon", "sans doublons"];

/* ------------------------------------------------------------------ */
/*  Nombres écrits en toutes lettres                                   */
/* ------------------------------------------------------------------ */

export const NOMBRES: Record<string, number> = {
  zero: 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7,
  huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14,
  quinze: 15, seize: 16, vingt: 20, vingts: 20, trente: 30, quarante: 40,
  cinquante: 50, soixante: 60, cent: 100, cents: 100, mille: 1000,
  // Jeton produit par la réécriture de « quatre-vingt », qui vaut 80 et non
  // 4 x 20 : le laisser en deux mots donnait 24.
  quatrevingt: 80,
  zero_en: 0, one: 1, two: 2, three: 3, four: 4, five: 5, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
};

/** Multiplicateurs : ils agissent sur ce qui précède au lieu de s'ajouter. */
export const MULTIPLICATEURS = new Set(["cent", "cents", "mille", "hundred", "thousand"]);

/* ------------------------------------------------------------------ */
/*  Index prêts à l'emploi                                             */
/* ------------------------------------------------------------------ */

export interface EntreePhrase<T> {
  /** Phrase normalisée, découpée en mots. */
  mots: string[];
  valeur: T;
}

/** Construit un index trié du plus long au plus court. */
export function indexer<T>(entrees: { phrases: string[]; valeur: T }[]): EntreePhrase<T>[] {
  const sortie: EntreePhrase<T>[] = [];
  for (const { phrases, valeur } of entrees) {
    for (const phrase of phrases) {
      const mots = normalise(phrase).split(" ").filter(Boolean);
      if (mots.length > 0) sortie.push({ mots, valeur });
    }
  }
  return sortie.sort((a, b) => b.mots.length - a.mots.length);
}

export const INDEX_TABLES = indexer(
  Object.entries(TABLE_SYNONYMES).map(([table, phrases]) => ({ phrases, valeur: table })),
);

export const INDEX_COLONNES = indexer(
  COLONNE_SYNONYMES.map(({ phrases, cible }) => ({ phrases, valeur: cible })),
);

export const INDEX_OPERATEURS = indexer(
  OPERATEURS.map(({ phrases, operateur }) => ({ phrases, valeur: operateur })),
);

export const INDEX_AGREGATS = indexer(
  AGREGATS.map(({ phrases, fonction, colonne }) => ({ phrases, valeur: { fonction, colonne } })),
);

export const INDEX_LIKE = indexer(
  LIKE_MARQUEURS.map(({ phrases, forme }) => ({ phrases, valeur: forme })),
);

/* ------------------------------------------------------------------ */
/*  Valeurs réellement présentes dans le schéma                        */
/* ------------------------------------------------------------------ */

/**
 * Valeurs textuelles du jeu de données, indexées en minuscules.
 *
 * Sert à retrouver la casse d'origine : la reconnaissance vocale rend
 * « sales », la table contient « Sales ». Écrire la valeur telle qu'elle est
 * stockée évite d'apprendre à l'élève un `UPPER()` défensif dont il n'a pas
 * besoin ici.
 */
const VALEURS = (() => {
  const index = new Map<string, { table: string; column: string; valeur: string }[]>();
  for (const [table, def] of Object.entries(schema)) {
    def.columns.forEach((colonne, i) => {
      for (const ligne of def.data) {
        const valeur = ligne[i];
        if (typeof valeur !== "string") continue;
        const cle = normalise(valeur);
        if (!cle) continue;
        const liste = index.get(cle) ?? [];
        if (!liste.some((e) => e.table === table && e.column === colonne)) {
          liste.push({ table, column: colonne.toLowerCase(), valeur });
        }
        index.set(cle, liste);
      }
    });
  }
  return index;
})();

/** Retrouve une valeur du jeu de données à partir de sa forme dictée. */
export function chercherValeur(texte: string) {
  return VALEURS.get(normalise(texte)) ?? [];
}

/** Colonnes d'une table, en minuscules. */
export function colonnesDe(table: string): string[] {
  return (schema[table]?.columns ?? []).map((c) => c.toLowerCase());
}

/** Vrai si la table existe dans le schéma simulé. */
export function tableConnue(nom: string): boolean {
  return Object.prototype.hasOwnProperty.call(schema, nom);
}
