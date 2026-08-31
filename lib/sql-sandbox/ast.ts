/**
 * Arbre syntaxique du sous-ensemble SQL du bac à sable.
 *
 * Le périmètre suit le programme officiel 1Z0-071 : projection et alias,
 * fonctions mono-ligne, fonctions de groupe avec GROUP BY et HAVING,
 * jointures, sous-requêtes scalaires et d'appartenance, opérateurs
 * ensemblistes, tri et limitation de lignes.
 */

export type Expression =
  | { kind: "column"; table?: string; name: string }
  | { kind: "literal"; value: string | number | null | boolean }
  | { kind: "star"; table?: string }
  | { kind: "binary"; op: string; left: Expression; right: Expression }
  | { kind: "unary"; op: string; operand: Expression }
  | { kind: "function"; name: string; args: Expression[]; distinct: boolean }
  | { kind: "case"; branches: { when: Expression; then: Expression }[]; else?: Expression }
  | { kind: "isNull"; operand: Expression; negated: boolean }
  | { kind: "in"; operand: Expression; values: Expression[]; subquery?: SelectStatement; negated: boolean }
  | { kind: "between"; operand: Expression; low: Expression; high: Expression; negated: boolean }
  | { kind: "like"; operand: Expression; pattern: Expression; negated: boolean }
  | { kind: "exists"; subquery: SelectStatement; negated: boolean }
  | { kind: "subquery"; select: SelectStatement };

export interface SelectItem {
  expression: Expression;
  alias?: string;
}

export type JoinType = "inner" | "left" | "right" | "full" | "cross";

export interface JoinClause {
  type: JoinType;
  table: TableRef;
  /** Condition explicite. Absente pour CROSS JOIN et pour USING. */
  on?: Expression;
  /** Colonnes communes, pour la forme USING. */
  using?: string[];
  /** Vrai pour NATURAL JOIN : les colonnes communes sont déduites. */
  natural?: boolean;
}

export interface TableRef {
  name: string;
  alias?: string;
}

export interface OrderItem {
  expression: Expression;
  direction: "ASC" | "DESC";
  /** `undefined` laisse la règle Oracle par défaut : NULLs en dernier en ASC. */
  nulls?: "FIRST" | "LAST";
}

export interface SelectStatement {
  kind: "select";
  distinct: boolean;
  items: SelectItem[];
  from?: TableRef;
  joins: JoinClause[];
  where?: Expression;
  groupBy: Expression[];
  having?: Expression;
  orderBy: OrderItem[];
  offset?: number;
  limit?: number;
}

export interface SetOperation {
  kind: "set";
  op: "UNION" | "UNION ALL" | "INTERSECT" | "MINUS";
  left: Statement;
  right: Statement;
  /** Le tri final d'une requête composée appartient à l'ensemble, pas aux branches. */
  orderBy: OrderItem[];
}

export type Statement = SelectStatement | SetOperation;
