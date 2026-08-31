/**
 * Analyse lexicale du sous-ensemble SQL du bac à sable.
 *
 * Volontairement séparée de l'analyse syntaxique : c'est la couche où se
 * traitent les particularités d'écriture d'Oracle — quotes doublées dans une
 * chaîne, identifiants entre guillemets, commentaires — et elle se teste seule.
 */

export type TokenType =
  | "keyword"
  | "identifier"
  | "quotedIdentifier"
  | "number"
  | "string"
  | "operator"
  | "punctuation"
  | "star";

export interface Token {
  type: TokenType;
  /** Texte tel qu'il apparaît, sans les délimiteurs pour une chaîne. */
  value: string;
  /** Forme normalisée en majuscules, pour les mots-clés et identifiants. */
  upper: string;
  position: number;
}

const KEYWORDS = new Set([
  "SELECT", "DISTINCT", "ALL", "FROM", "WHERE", "GROUP", "BY", "HAVING",
  "ORDER", "ASC", "DESC", "NULLS", "FIRST", "LAST", "AS",
  "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "OUTER", "CROSS", "NATURAL",
  "ON", "USING",
  "AND", "OR", "NOT", "IN", "IS", "NULL", "LIKE", "BETWEEN", "EXISTS",
  "UNION", "INTERSECT", "MINUS", "EXCEPT",
  "FETCH", "NEXT", "ROWS", "ROW", "ONLY", "OFFSET", "LIMIT",
  "CASE", "WHEN", "THEN", "ELSE", "END",
  "TRUE", "FALSE",
]);

const OPERATEURS_DOUBLES = ["<>", "!=", "<=", ">=", "||"];

export class SqlSyntaxError extends Error {
  constructor(message: string, readonly position: number) {
    super(message);
    this.name = "SqlSyntaxError";
  }
}

export function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const pousser = (type: TokenType, value: string, position: number) => {
    tokens.push({ type, value, upper: value.toUpperCase(), position });
  };

  while (i < sql.length) {
    const c = sql[i];

    // Espaces
    if (/\s/.test(c)) {
      i++;
      continue;
    }

    // Commentaire de fin de ligne
    if (c === "-" && sql[i + 1] === "-") {
      while (i < sql.length && sql[i] !== "\n") i++;
      continue;
    }

    // Commentaire de bloc
    if (c === "/" && sql[i + 1] === "*") {
      const fin = sql.indexOf("*/", i + 2);
      if (fin === -1) throw new SqlSyntaxError("Commentaire de bloc non fermé", i);
      i = fin + 2;
      continue;
    }

    // Chaîne littérale — deux quotes consécutives valent une quote
    if (c === "'") {
      let j = i + 1;
      let valeur = "";
      while (j < sql.length) {
        if (sql[j] === "'") {
          if (sql[j + 1] === "'") {
            valeur += "'";
            j += 2;
            continue;
          }
          break;
        }
        valeur += sql[j];
        j++;
      }
      if (j >= sql.length) throw new SqlSyntaxError("Chaîne non fermée", i);
      pousser("string", valeur, i);
      i = j + 1;
      continue;
    }

    // Identifiant délimité — sensible à la casse en Oracle
    if (c === '"') {
      const fin = sql.indexOf('"', i + 1);
      if (fin === -1) throw new SqlSyntaxError("Identifiant délimité non fermé", i);
      pousser("quotedIdentifier", sql.slice(i + 1, fin), i);
      i = fin + 1;
      continue;
    }

    // Nombre
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(sql[i + 1] ?? ""))) {
      let j = i;
      while (j < sql.length && /[0-9.]/.test(sql[j])) j++;
      pousser("number", sql.slice(i, j), i);
      i = j;
      continue;
    }

    // Identifiant ou mot-clé
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < sql.length && /[A-Za-z0-9_$#]/.test(sql[j])) j++;
      const mot = sql.slice(i, j);
      pousser(KEYWORDS.has(mot.toUpperCase()) ? "keyword" : "identifier", mot, i);
      i = j;
      continue;
    }

    // Étoile — distinguée pour que `SELECT *` se lise sans ambiguïté
    if (c === "*") {
      // Une étoile suivant un identifiant ou une parenthèse fermante est une
      // multiplication ; ailleurs, c'est la projection de toutes les colonnes.
      const precedent = tokens[tokens.length - 1];
      const estMultiplication =
        precedent !== undefined &&
        (precedent.type === "identifier" ||
          precedent.type === "number" ||
          precedent.value === ")");
      pousser(estMultiplication ? "operator" : "star", "*", i);
      i++;
      continue;
    }

    // Opérateur à deux caractères
    const deux = sql.slice(i, i + 2);
    if (OPERATEURS_DOUBLES.includes(deux)) {
      pousser("operator", deux, i);
      i += 2;
      continue;
    }

    if ("=<>+-/%".includes(c)) {
      pousser("operator", c, i);
      i++;
      continue;
    }

    if ("(),.;".includes(c)) {
      pousser("punctuation", c, i);
      i++;
      continue;
    }

    throw new SqlSyntaxError(`Caractère inattendu « ${c} »`, i);
  }

  return tokens;
}
