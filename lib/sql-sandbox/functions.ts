/**
 * Fonctions SQL du bac à sable.
 *
 * Le choix suit les domaines officiels 4 et 5 du 1Z0-071 : manipulation de
 * chaînes, de nombres et de dates, conversion et expressions conditionnelles.
 * Les comportements-pièges sont reproduits fidèlement — c'est précisément ce
 * qu'il faut pouvoir vérifier soi-même :
 *
 *  - toute arithmétique impliquant NULL vaut NULL ;
 *  - `SUBSTR` commence à 1, et un début négatif compte depuis la fin ;
 *  - `INSTR` renvoie 0 quand la sous-chaîne est absente, pas NULL ;
 *  - `NVL2(a, b, c)` renvoie b quand a n'est **pas** NULL ;
 *  - un second argument négatif de `ROUND`/`TRUNC` agit à gauche de la virgule.
 */

export type Valeur = string | number | boolean | null;

export class SqlRuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SqlRuntimeError";
  }
}

const JOURS_MS = 24 * 60 * 60 * 1000;

function estNul(v: Valeur): boolean {
  return v === null || v === undefined;
}

function versNombre(v: Valeur, fonction: string): number {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  throw new SqlRuntimeError(`ORA-01722 : valeur non numérique dans ${fonction}`);
}

function versTexte(v: Valeur): string {
  if (estNul(v)) return "";
  return String(v);
}

/** Une date du jeu d'exemple est stockée au format ISO court. */
function versDate(v: Valeur, fonction: string): Date {
  if (typeof v === "string") {
    const d = new Date(`${v}T00:00:00Z`);
    if (!Number.isNaN(d.getTime())) return d;
  }
  throw new SqlRuntimeError(`ORA-01858 : valeur de date invalide dans ${fonction}`);
}

function formaterDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Fonctions renvoyant une valeur par ligne. */
export const FONCTIONS_MONO_LIGNE: Record<string, (args: Valeur[]) => Valeur> = {
  // ---- Chaînes ----
  UPPER: ([a]) => (estNul(a) ? null : versTexte(a).toUpperCase()),
  LOWER: ([a]) => (estNul(a) ? null : versTexte(a).toLowerCase()),
  INITCAP: ([a]) =>
    estNul(a)
      ? null
      : versTexte(a)
          .toLowerCase()
          .replace(/(^|[^A-Za-z0-9])([a-z])/g, (_, sep, c) => sep + c.toUpperCase()),
  LENGTH: ([a]) => (estNul(a) ? null : versTexte(a).length),
  SUBSTR: ([a, debut, longueur]) => {
    if (estNul(a) || estNul(debut)) return null;
    const texte = versTexte(a);
    const d = versNombre(debut, "SUBSTR");
    // Position 1-based ; un début négatif compte depuis la fin.
    const index = d < 0 ? Math.max(texte.length + d, 0) : Math.max(d - 1, 0);
    if (estNul(longueur)) return texte.slice(index);
    const n = versNombre(longueur, "SUBSTR");
    return n <= 0 ? null : texte.slice(index, index + n);
  },
  INSTR: ([a, cherche, depuis]) => {
    if (estNul(a) || estNul(cherche)) return null;
    const debut = estNul(depuis) ? 0 : Math.max(versNombre(depuis, "INSTR") - 1, 0);
    // 0 quand la sous-chaîne est absente — jamais NULL.
    return versTexte(a).indexOf(versTexte(cherche), debut) + 1;
  },
  CONCAT: ([a, b]) => {
    if (estNul(a) && estNul(b)) return null;
    return versTexte(a) + versTexte(b);
  },
  TRIM: ([a]) => (estNul(a) ? null : versTexte(a).trim()),
  LTRIM: ([a]) => (estNul(a) ? null : versTexte(a).replace(/^\s+/, "")),
  RTRIM: ([a]) => (estNul(a) ? null : versTexte(a).replace(/\s+$/, "")),
  LPAD: ([a, n, c]) =>
    estNul(a) || estNul(n)
      ? null
      : versTexte(a).padStart(versNombre(n, "LPAD"), estNul(c) ? " " : versTexte(c)),
  RPAD: ([a, n, c]) =>
    estNul(a) || estNul(n)
      ? null
      : versTexte(a).padEnd(versNombre(n, "RPAD"), estNul(c) ? " " : versTexte(c)),
  REPLACE: ([a, cherche, remplace]) =>
    estNul(a) || estNul(cherche)
      ? null
      : versTexte(a).split(versTexte(cherche)).join(estNul(remplace) ? "" : versTexte(remplace)),

  // ---- Nombres ----
  ROUND: ([a, n]) => {
    if (estNul(a)) return null;
    const valeur = versNombre(a, "ROUND");
    const decimales = estNul(n) ? 0 : versNombre(n, "ROUND");
    const facteur = Math.pow(10, decimales);
    return Math.round(valeur * facteur) / facteur;
  },
  TRUNC: ([a, n]) => {
    if (estNul(a)) return null;
    // TRUNC sur une date ramène au début du jour.
    if (typeof a === "string" && /^\d{4}-\d{2}-\d{2}/.test(a)) return a.slice(0, 10);
    const valeur = versNombre(a, "TRUNC");
    const decimales = estNul(n) ? 0 : versNombre(n, "TRUNC");
    const facteur = Math.pow(10, decimales);
    return Math.trunc(valeur * facteur) / facteur;
  },
  MOD: ([a, b]) => {
    if (estNul(a) || estNul(b)) return null;
    const diviseur = versNombre(b, "MOD");
    return diviseur === 0 ? versNombre(a, "MOD") : versNombre(a, "MOD") % diviseur;
  },
  ABS: ([a]) => (estNul(a) ? null : Math.abs(versNombre(a, "ABS"))),
  CEIL: ([a]) => (estNul(a) ? null : Math.ceil(versNombre(a, "CEIL"))),
  FLOOR: ([a]) => (estNul(a) ? null : Math.floor(versNombre(a, "FLOOR"))),
  POWER: ([a, b]) =>
    estNul(a) || estNul(b) ? null : Math.pow(versNombre(a, "POWER"), versNombre(b, "POWER")),
  SIGN: ([a]) => (estNul(a) ? null : Math.sign(versNombre(a, "SIGN"))),
  SQRT: ([a]) => (estNul(a) ? null : Math.sqrt(versNombre(a, "SQRT"))),

  // ---- Dates ----
  SYSDATE: () => formaterDate(new Date()),
  CURRENT_DATE: () => formaterDate(new Date()),
  ADD_MONTHS: ([a, n]) => {
    if (estNul(a) || estNul(n)) return null;
    const d = versDate(a, "ADD_MONTHS");
    const jour = d.getUTCDate();
    d.setUTCMonth(d.getUTCMonth() + versNombre(n, "ADD_MONTHS"));
    // Oracle recale sur le dernier jour du mois si le jour n'existe pas.
    if (d.getUTCDate() < jour) d.setUTCDate(0);
    return formaterDate(d);
  },
  MONTHS_BETWEEN: ([a, b]) => {
    if (estNul(a) || estNul(b)) return null;
    const d1 = versDate(a, "MONTHS_BETWEEN");
    const d2 = versDate(b, "MONTHS_BETWEEN");
    const mois =
      (d1.getUTCFullYear() - d2.getUTCFullYear()) * 12 + (d1.getUTCMonth() - d2.getUTCMonth());
    return mois + (d1.getUTCDate() - d2.getUTCDate()) / 31;
  },
  LAST_DAY: ([a]) => {
    if (estNul(a)) return null;
    const d = versDate(a, "LAST_DAY");
    return formaterDate(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)));
  },
  EXTRACT: ([partie, a]) => {
    if (estNul(a) || estNul(partie)) return null;
    const d = versDate(a, "EXTRACT");
    switch (versTexte(partie).toUpperCase()) {
      case "YEAR": return d.getUTCFullYear();
      case "MONTH": return d.getUTCMonth() + 1;
      case "DAY": return d.getUTCDate();
      default: throw new SqlRuntimeError("EXTRACT accepte YEAR, MONTH ou DAY");
    }
  },

  // ---- Conversion et conditionnel ----
  TO_CHAR: ([a]) => (estNul(a) ? null : versTexte(a)),
  TO_NUMBER: ([a]) => (estNul(a) ? null : versNombre(a, "TO_NUMBER")),
  TO_DATE: ([a]) => (estNul(a) ? null : formaterDate(versDate(a, "TO_DATE"))),
  NVL: ([a, b]) => (estNul(a) ? (b ?? null) : a),
  // NVL2 renvoie b quand a n'est PAS nul : l'ordre surprend, il est exact.
  NVL2: ([a, b, c]) => (estNul(a) ? (c ?? null) : (b ?? null)),
  NULLIF: ([a, b]) => (a === b ? null : a),
  COALESCE: (args) => args.find((v) => !estNul(v)) ?? null,
  DECODE: (args) => {
    const [sujet, ...reste] = args;
    for (let i = 0; i + 1 < reste.length; i += 2) {
      // DECODE considère deux NULL comme égaux, contrairement à `=`.
      if (reste[i] === sujet || (estNul(reste[i]) && estNul(sujet))) return reste[i + 1];
    }
    return reste.length % 2 === 1 ? reste[reste.length - 1] : null;
  },
  GREATEST: (args) => (args.some(estNul) ? null : args.slice().sort(comparer).pop() ?? null),
  LEAST: (args) => (args.some(estNul) ? null : args.slice().sort(comparer)[0] ?? null),
};

/** Fonctions de groupe. `COUNT(*)` reçoit les lignes, pas des valeurs. */
export const FONCTIONS_GROUPE = new Set([
  "COUNT", "SUM", "AVG", "MIN", "MAX", "STDDEV", "VARIANCE", "LISTAGG",
]);

export function estFonctionGroupe(nom: string): boolean {
  return FONCTIONS_GROUPE.has(nom.toUpperCase());
}

/**
 * Applique une fonction de groupe.
 *
 * Toutes ignorent les NULL, sauf `COUNT(*)` qui compte des lignes — c'est
 * exactement ce qui fait diverger `COUNT(*)` et `COUNT(colonne)`.
 */
export function appliquerAgregat(nom: string, valeurs: Valeur[], compteLignes: boolean): Valeur {
  const n = nom.toUpperCase();
  if (n === "COUNT") {
    return compteLignes ? valeurs.length : valeurs.filter((v) => !estNul(v)).length;
  }

  const utiles = valeurs.filter((v) => !estNul(v));
  if (utiles.length === 0) return null;

  switch (n) {
    case "SUM":
      return utiles.reduce<number>((s, v) => s + versNombre(v, "SUM"), 0);
    case "AVG":
      return utiles.reduce<number>((s, v) => s + versNombre(v, "AVG"), 0) / utiles.length;
    case "MIN":
      return utiles.slice().sort(comparer)[0];
    case "MAX":
      return utiles.slice().sort(comparer)[utiles.length - 1];
    case "STDDEV":
    case "VARIANCE": {
      const nombres = utiles.map((v) => versNombre(v, n));
      const moyenne = nombres.reduce((s, v) => s + v, 0) / nombres.length;
      const variance =
        nombres.reduce((s, v) => s + (v - moyenne) ** 2, 0) / Math.max(nombres.length - 1, 1);
      return n === "VARIANCE" ? variance : Math.sqrt(variance);
    }
    case "LISTAGG":
      return utiles.map(versTexte).join(",");
    default:
      throw new SqlRuntimeError(`Fonction de groupe inconnue : ${nom}`);
  }
}

/** Ordre de tri d'Oracle : nombres entre eux, puis comparaison textuelle. */
export function comparer(a: Valeur, b: Valeur): number {
  if (estNul(a) && estNul(b)) return 0;
  if (estNul(a)) return 1;
  if (estNul(b)) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

export { estNul, versNombre, versTexte, JOURS_MS };
