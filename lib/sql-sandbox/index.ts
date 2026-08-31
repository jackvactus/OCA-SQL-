import { Parser } from "./parser";
import { executer, type Resultat } from "./evaluate";
import { SqlRuntimeError, type Valeur } from "./functions";
import { SqlSyntaxError } from "./tokenizer";
import { schema } from "./schema";

export { schema } from "./schema";
export type { SchemaTable } from "./schema";
export type { Valeur } from "./functions";

export interface QueryResult {
  columns?: string[];
  rows?: Valeur[][];
  rowCount?: number;
  error?: string;
  /** Position du caractère fautif, pour souligner l'erreur dans l'éditeur. */
  errorPosition?: number;
  executionTime: number;
}

/** Instructions refusées, avec la raison plutôt qu'un simple rejet. */
const REFUS: { motif: RegExp; message: string }[] = [
  {
    motif: /^\s*(INSERT|UPDATE|DELETE|MERGE)\b/i,
    message:
      "Ce bac à sable est en lecture seule : le jeu de données est partagé et reste intact. Écrivez un SELECT pour interroger les tables.",
  },
  {
    motif: /^\s*(CREATE|ALTER|DROP|TRUNCATE|GRANT|REVOKE)\b/i,
    message:
      "Le DDL et le DCL ne sont pas exécutés ici : le schéma est fixe. Les tables disponibles sont listées à côté de l'éditeur.",
  },
];

/**
 * Exécute une requête sur le schéma HR simulé.
 *
 * Le moteur couvre le programme du 1Z0-071 : projection et alias, DISTINCT,
 * fonctions mono-ligne et de groupe, GROUP BY et HAVING, jointures internes,
 * externes, croisées, naturelles et USING, sous-requêtes, opérateurs
 * ensemblistes, tri avec NULLS FIRST/LAST, OFFSET et FETCH.
 *
 * Ce n'est pas une base Oracle : c'est une simulation fidèle sur un petit jeu
 * de données, faite pour vérifier une syntaxe et un raisonnement.
 */
export function runQuery(sql: string): QueryResult {
  const debut = performance.now();
  const texte = sql.trim();

  if (!texte) {
    return { error: "Requête vide. Écrivez une instruction SELECT.", executionTime: 0 };
  }

  for (const { motif, message } of REFUS) {
    if (motif.test(texte)) {
      return { error: message, executionTime: 0 };
    }
  }

  try {
    const resultat: Resultat = executer(Parser.parse(texte));
    return {
      columns: resultat.columns,
      rows: resultat.rows,
      rowCount: resultat.rowCount,
      executionTime: performance.now() - debut,
    };
  } catch (e) {
    if (e instanceof SqlSyntaxError) {
      return {
        error: `Erreur de syntaxe : ${e.message}`,
        errorPosition: e.position,
        executionTime: performance.now() - debut,
      };
    }
    if (e instanceof SqlRuntimeError) {
      return { error: e.message, executionTime: performance.now() - debut };
    }
    return {
      error: e instanceof Error ? e.message : "Erreur inconnue",
      executionTime: performance.now() - debut,
    };
  }
}

/** Tables du schéma simulé, pour l'exploration latérale. */
export function tablesDisponibles(): { name: string; columns: string[]; rowCount: number }[] {
  return Object.entries(schema).map(([name, table]) => ({
    name,
    columns: table.columns,
    rowCount: table.data.length,
  }));
}
