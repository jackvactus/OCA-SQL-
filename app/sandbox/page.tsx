"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Code2,
  Play,
  Database,
  Table as TableIcon,
  History,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Terminal,
  FileCode,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  HR Schema (simulated Oracle HR sample schema)                     */
/* ------------------------------------------------------------------ */

type SchemaTable = {
  columns: string[];
  data: any[][];
};

const schema: Record<string, SchemaTable> = {
  employees: {
    columns: [
      "EMPLOYEE_ID",
      "FIRST_NAME",
      "LAST_NAME",
      "EMAIL",
      "PHONE_NUMBER",
      "HIRE_DATE",
      "JOB_ID",
      "SALARY",
      "COMMISSION_PCT",
      "MANAGER_ID",
      "DEPARTMENT_ID",
    ],
    data: [
      [100, "Steven", "King", "SKING", "515.123.4567", "2003-06-17", "AD_PRES", 24000, null, null, 90],
      [101, "Neena", "Kochhar", "NKOCHHAR", "515.123.4568", "2005-09-21", "AD_VP", 17000, null, 100, 90],
      [102, "Lex", "De Haan", "LDEHAAN", "515.123.4569", "2001-01-13", "AD_VP", 17000, null, 100, 90],
      [103, "Alexander", "Hunold", "AHUNOLD", "590.423.4567", "2006-01-03", "IT_PROG", 9000, null, 102, 60],
      [104, "Bruce", "Ernst", "BERNST", "590.423.4568", "2007-05-21", "IT_PROG", 6000, null, 103, 60],
      [107, "Diana", "Lorentz", "DLORENTZ", "590.423.5567", "2007-02-07", "IT_PROG", 4200, null, 103, 60],
      [124, "Kevin", "Mourgos", "KMOURGOS", "650.123.5234", "2007-11-16", "ST_MAN", 5800, null, 100, 50],
      [141, "Susan", "Mavris", "SMAVRIS", "515.123.7777", "2002-06-07", "HR_REP", 6500, null, 101, 40],
      [142, "Curtis", "Davies", "CDAVIES", "515.124.4369", "2002-01-24", "HR_REP", 3100, null, 101, 40],
      [143, "Randall", "Matos", "RMATOS", "515.124.4230", "2006-03-15", "ST_CLERK", 2600, null, 124, 50],
      [144, "Peter", "Vargas", "PVARGAS", "515.124.4169", "2006-07-09", "ST_CLERK", 2500, null, 124, 50],
      [149, "Eleni", "Zlotkey", "EZLOTKEY", "011.44.1344.4290", "2005-01-29", "SA_MAN", 10500, 0.2, 100, 80],
      [174, "Ellen", "Abel", "EABEL", "011.44.1644.429264", "2004-05-11", "SA_REP", 11000, 0.3, 149, 80],
      [176, "Jonathon", "Taylor", "JTAYLOR", "011.44.1644.429265", "2006-03-24", "SA_REP", 8600, 0.2, 149, 80],
      [200, "Jennifer", "Whalen", "JWHALEN", "515.123.4444", "2003-09-17", "AD_ASST", 4400, null, 101, 10],
      [201, "Michael", "Hartstein", "MHARTSTE", "515.123.5555", "2004-02-17", "MK_MAN", 13000, null, 100, 20],
      [202, "Pat", "Fay", "PFAY", "603.123.6666", "2005-08-17", "MK_REP", 6000, null, 201, 20],
      [205, "Shelley", "Higgins", "SHIGGINS", "515.123.8080", "2002-06-07", "AC_MGR", 12008, null, 101, 110],
      [206, "William", "Gietz", "WGIETZ", "515.123.8181", "2002-06-07", "AC_ACCOUNT", 8300, null, 205, 110],
    ],
  },
  departments: {
    columns: ["DEPARTMENT_ID", "DEPARTMENT_NAME", "MANAGER_ID", "LOCATION_ID"],
    data: [
      [10, "Administration", 200, 1700],
      [20, "Marketing", 201, 1800],
      [40, "Human Resources", 203, 2400],
      [50, "Shipping", 121, 1500],
      [60, "IT", 103, 1400],
      [80, "Sales", 145, 2500],
      [90, "Executive", 100, 1700],
      [110, "Accounting", 205, 1700],
    ],
  },
  jobs: {
    columns: ["JOB_ID", "JOB_TITLE", "MIN_SALARY", "MAX_SALARY"],
    data: [
      ["AD_PRES", "President", 20080, 40000],
      ["AD_VP", "Administration Vice President", 15000, 30000],
      ["AD_ASST", "Administration Assistant", 3000, 6000],
      ["IT_PROG", "Programmer", 4000, 10000],
      ["ST_MAN", "Stock Manager", 5500, 8500],
      ["ST_CLERK", "Stock Clerk", 2000, 5000],
      ["HR_REP", "Human Resources Representative", 4000, 9000],
      ["SA_MAN", "Sales Manager", 10000, 20080],
      ["SA_REP", "Sales Representative", 6000, 12008],
      ["MK_MAN", "Marketing Manager", 9000, 15000],
      ["MK_REP", "Marketing Representative", 4000, 9000],
      ["AC_MGR", "Accounting Manager", 8200, 16000],
      ["AC_ACCOUNT", "Public Accountant", 4200, 9000],
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Sample queries                                                     */
/* ------------------------------------------------------------------ */

const sampleQueries: { label: string; query: string; description: string }[] = [
  {
    label: "All employees",
    query: "SELECT * FROM employees",
    description: "Retrieve every row from the employees table",
  },
  {
    label: "High earners",
    query:
      "SELECT first_name, last_name, salary FROM employees WHERE salary > 10000",
    description: "Employees earning more than 10,000",
  },
  {
    label: "Top 5 salaries",
    query:
      "SELECT * FROM employees ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY",
    description: "Top 5 highest-paid employees",
  },
  {
    label: "All departments",
    query: "SELECT * FROM departments",
    description: "List every department",
  },
  {
    label: "Specific departments",
    query:
      "SELECT * FROM employees WHERE department_id IN (50, 60, 80)",
    description: "Employees in Shipping, IT, or Sales",
  },
  {
    label: "IT department",
    query:
      "SELECT first_name, last_name, email FROM employees WHERE department_id = 60",
    description: "Employees in the IT department",
  },
  {
    label: "Sales reps",
    query:
      "SELECT first_name, last_name, salary, commission_pct FROM employees WHERE job_id = 'SA_REP'",
    description: "All sales representatives",
  },
  {
    label: "No commission",
    query:
      "SELECT first_name, last_name FROM employees WHERE commission_pct IS NULL",
    description: "Employees with no commission",
  },
  {
    label: "Name search",
    query:
      "SELECT first_name, last_name FROM employees WHERE first_name LIKE 'S%'",
    description: "Employees whose first name starts with S",
  },
  {
    label: "Recent hires",
    query:
      "SELECT first_name, last_name, hire_date FROM employees ORDER BY hire_date DESC LIMIT 5",
    description: "5 most recently hired employees",
  },
];

/* ------------------------------------------------------------------ */
/*  SQL engine — tokenizer / parser / executor                         */
/* ------------------------------------------------------------------ */

type QueryResult =
  | { columns: string[]; rows: any[][]; rowCount: number; executionTime: number }
  | { error: string; executionTime: number };

/* Tokenizer -------------------------------------------------------- */

type Token =
  | { type: "keyword"; value: string }
  | { type: "ident"; value: string }
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "op"; value: string }
  | { type: "punct"; value: string }
  | { type: "star"; value: "*" };

const KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "ORDER",
  "BY",
  "ASC",
  "DESC",
  "LIMIT",
  "FETCH",
  "FIRST",
  "NEXT",
  "ROWS",
  "ROW",
  "ONLY",
  "AND",
  "OR",
  "IS",
  "NULL",
  "NOT",
  "IN",
  "LIKE",
  "AS",
]);

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = sql.length;

  while (i < len) {
    const ch = sql[i];

    // whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // line comment --
    if (ch === "-" && sql[i + 1] === "-") {
      while (i < len && sql[i] !== "\n") i++;
      continue;
    }

    // block comment /* */
    if (ch === "/" && sql[i + 1] === "*") {
      i += 2;
      while (i < len && !(sql[i] === "*" && sql[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    // string literal
    if (ch === "'") {
      i++;
      let str = "";
      while (i < len) {
        if (sql[i] === "'") {
          // escaped quote ''
          if (sql[i + 1] === "'") {
            str += "'";
            i += 2;
            continue;
          }
          i++;
          break;
        }
        str += sql[i];
        i++;
      }
      tokens.push({ type: "string", value: str });
      continue;
    }

    // number
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(sql[i + 1]))) {
      let num = "";
      while (i < len && /[0-9.]/.test(sql[i])) {
        num += sql[i];
        i++;
      }
      tokens.push({ type: "number", value: parseFloat(num) });
      continue;
    }

    // star
    if (ch === "*") {
      tokens.push({ type: "star", value: "*" });
      i++;
      continue;
    }

    // operators (multi-char first)
    const two = sql.slice(i, i + 2);
    if (two === ">=" || two === "<=" || two === "!=" || two === "<>") {
      tokens.push({ type: "op", value: two === "<>" ? "!=" : two });
      i += 2;
      continue;
    }
    if (ch === ">" || ch === "<" || ch === "=") {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    // punctuation
    if (ch === "(" || ch === ")" || ch === ",") {
      tokens.push({ type: "punct", value: ch });
      i++;
      continue;
    }

    // identifier / keyword
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = "";
      while (i < len && /[a-zA-Z0-9_]/.test(sql[i])) {
        ident += sql[i];
        i++;
      }
      const upper = ident.toUpperCase();
      if (KEYWORDS.has(upper)) {
        tokens.push({ type: "keyword", value: upper });
      } else {
        tokens.push({ type: "ident", value: ident });
      }
      continue;
    }

    throw new Error(`Unexpected character '${ch}' at position ${i}`);
  }

  return tokens;
}

/* AST types -------------------------------------------------------- */

type Condition =
  | { kind: "comparison"; column: string; op: string; value: any }
  | { kind: "in"; column: string; values: any[]; negate: boolean }
  | { kind: "isNull"; column: string; negate: boolean }
  | { kind: "like"; column: string; pattern: string; negate: boolean }
  | { kind: "and"; left: Condition; right: Condition }
  | { kind: "or"; left: Condition; right: Condition };

type ParsedQuery = {
  columns: string[] | "*";
  table: string;
  where: Condition | null;
  orderBy: { column: string; direction: "ASC" | "DESC" } | null;
  limit: number | null;
};

/* Parser ----------------------------------------------------------- */

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(offset = 0): Token | undefined {
    return this.tokens[this.pos + offset];
  }

  private next(): Token | undefined {
    return this.tokens[this.pos++];
  }

  private expectKeyword(kw: string): void {
    const t = this.next();
    if (!t || t.type !== "keyword" || t.value !== kw) {
      const got = t ? t.value : "end of input";
      throw new Error(`Expected keyword '${kw}' but got '${got}'`);
    }
  }

  private isKeyword(kw: string, offset = 0): boolean {
    const t = this.peek(offset);
    return !!t && t.type === "keyword" && t.value === kw;
  }

  parse(): ParsedQuery {
    this.expectKeyword("SELECT");

    // column list
    const columns = this.parseColumnList();

    this.expectKeyword("FROM");
    const table = this.parseTable();

    let where: Condition | null = null;
    if (this.isKeyword("WHERE")) {
      this.next();
      where = this.parseCondition();
    }

    let orderBy: { column: string; direction: "ASC" | "DESC" } | null = null;
    if (this.isKeyword("ORDER")) {
      this.next();
      this.expectKeyword("BY");
      const colTok = this.next();
      if (!colTok || (colTok.type !== "ident" && colTok.type !== "keyword")) {
        throw new Error("Expected column name after ORDER BY");
      }
      const column = colTok.value as string;
      let direction: "ASC" | "DESC" = "ASC";
      if (this.isKeyword("ASC") || this.isKeyword("DESC")) {
        direction = (this.next()!.value as "ASC" | "DESC");
      }
      orderBy = { column, direction };
    }

    let limit: number | null = null;
    if (this.isKeyword("FETCH")) {
      this.next();
      if (this.isKeyword("FIRST") || this.isKeyword("NEXT")) {
        this.next();
      } else {
        throw new Error("Expected FIRST or NEXT after FETCH");
      }
      const numTok = this.next();
      if (!numTok || numTok.type !== "number") {
        throw new Error("Expected row count after FETCH FIRST");
      }
      limit = numTok.value;
      if (this.isKeyword("ROWS") || this.isKeyword("ROW")) {
        this.next();
      }
      this.expectKeyword("ONLY");
    } else if (this.isKeyword("LIMIT")) {
      this.next();
      const numTok = this.next();
      if (!numTok || numTok.type !== "number") {
        throw new Error("Expected number after LIMIT");
      }
      limit = numTok.value;
    }

    // trailing semicolon
    if (this.peek() && (this.peek() as Token).type === "punct" && (this.peek() as Token).value === ";") {
      this.next();
    }

    if (this.peek() !== undefined) {
      throw new Error("Unexpected tokens at end of query");
    }

    return { columns, table, where, orderBy, limit };
  }

  private parseColumnList(): string[] | "*" {
    if (this.peek()?.type === "star") {
      this.next();
      return "*";
    }
    const cols: string[] = [];
    for (;;) {
      const t = this.next();
      if (!t || (t.type !== "ident" && t.type !== "keyword")) {
        throw new Error("Expected column name in SELECT list");
      }
      cols.push(t.value as string);
      // optional AS alias — skip it
      if (this.isKeyword("AS")) {
        this.next();
        const alias = this.next();
        if (!alias || (alias.type !== "ident" && alias.type !== "keyword")) {
          throw new Error("Expected alias after AS");
        }
      }
      if (this.peek()?.type === "punct" && (this.peek() as Token).value === ",") {
        this.next();
        continue;
      }
      break;
    }
    return cols;
  }

  private parseTable(): string {
    const t = this.next();
    if (!t || (t.type !== "ident" && t.type !== "keyword")) {
      throw new Error("Expected table name after FROM");
    }
    return t.value as string;
  }

  // WHERE condition — OR has lowest precedence, then AND
  private parseCondition(): Condition {
    return this.parseOr();
  }

  private parseOr(): Condition {
    let left = this.parseAnd();
    while (this.isKeyword("OR")) {
      this.next();
      const right = this.parseAnd();
      left = { kind: "or", left, right };
    }
    return left;
  }

  private parseAnd(): Condition {
    let left = this.parsePredicate();
    while (this.isKeyword("AND")) {
      this.next();
      const right = this.parsePredicate();
      left = { kind: "and", left, right };
    }
    return left;
  }

  private parsePredicate(): Condition {
    // parenthesised sub-condition
    if (this.peek()?.type === "punct" && (this.peek() as Token).value === "(") {
      this.next();
      const cond = this.parseCondition();
      const close = this.next();
      if (!close || close.type !== "punct" || close.value !== ")") {
        throw new Error("Expected ')' to close condition group");
      }
      return cond;
    }

    const colTok = this.next();
    if (!colTok || (colTok.type !== "ident" && colTok.type !== "keyword")) {
      throw new Error("Expected column name in WHERE clause");
    }
    const column = colTok.value as string;

    // IS NULL / IS NOT NULL
    if (this.isKeyword("IS")) {
      this.next();
      let negate = false;
      if (this.isKeyword("NOT")) {
        this.next();
        negate = true;
      }
      this.expectKeyword("NULL");
      return { kind: "isNull", column, negate };
    }

    // NOT IN / IN
    if (this.isKeyword("NOT")) {
      this.next();
      this.expectKeyword("IN");
      return { kind: "in", column, values: this.parseInList(), negate: true };
    }
    if (this.isKeyword("IN")) {
      this.next();
      return { kind: "in", column, values: this.parseInList(), negate: false };
    }

    // NOT LIKE / LIKE
    if (this.isKeyword("NOT")) {
      this.next();
      this.expectKeyword("LIKE");
      const pat = this.next();
      if (!pat || pat.type !== "string") {
        throw new Error("Expected string pattern after LIKE");
      }
      return { kind: "like", column, pattern: pat.value, negate: true };
    }
    if (this.isKeyword("LIKE")) {
      this.next();
      const pat = this.next();
      if (!pat || pat.type !== "string") {
        throw new Error("Expected string pattern after LIKE");
      }
      return { kind: "like", column, pattern: pat.value, negate: false };
    }

    // comparison operators
    const opTok = this.next();
    if (!opTok || opTok.type !== "op") {
      throw new Error(`Expected operator after column '${column}' in WHERE`);
    }
    const op = opTok.value;
    const valTok = this.next();
    if (!valTok) {
      throw new Error(`Expected value after '${op}' in WHERE`);
    }
    let value: any;
    if (valTok.type === "number") value = valTok.value;
    else if (valTok.type === "string") value = valTok.value;
    else if (valTok.type === "ident") {
      const up = valTok.value.toUpperCase();
      if (up === "NULL") value = null;
      else value = valTok.value;
    } else if (valTok.type === "keyword" && valTok.value === "NULL") {
      value = null;
    } else {
      throw new Error("Invalid value in WHERE clause");
    }
    return { kind: "comparison", column, op, value };
  }

  private parseInList(): any[] {
    const open = this.next();
    if (!open || open.type !== "punct" || open.value !== "(") {
      throw new Error("Expected '(' after IN");
    }
    const values: any[] = [];
    for (;;) {
      const t = this.next();
      if (!t) throw new Error("Unexpected end of input in IN list");
      if (t.type === "number") values.push(t.value);
      else if (t.type === "string") values.push(t.value);
      else if (t.type === "ident") values.push(t.value);
      else throw new Error("Invalid value in IN list");
      if (this.peek()?.type === "punct" && (this.peek() as Token).value === ",") {
        this.next();
        continue;
      }
      break;
    }
    const close = this.next();
    if (!close || close.type !== "punct" || close.value !== ")") {
      throw new Error("Expected ')' to close IN list");
    }
    return values;
  }
}

/* Executor --------------------------------------------------------- */

function resolveColumnIndex(tableColumns: string[], name: string): number {
  const idx = tableColumns.findIndex(
    (c) => c.toUpperCase() === name.toUpperCase()
  );
  if (idx === -1) {
    throw new Error(`Column '${name}' does not exist in table`);
  }
  return idx;
}

function compareValues(a: any, b: any): number {
  if (a === null && b === null) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

function likeToRegex(pattern: string): RegExp {
  // Translate SQL LIKE to RegExp: % -> .*, _ -> .
  let regex = "";
  for (const ch of pattern) {
    if (ch === "%") regex += ".*";
    else if (ch === "_") regex += ".";
    else if (/[.*+?^${}()|[\]\\]/.test(ch)) regex += "\\" + ch;
    else regex += ch;
  }
  return new RegExp("^" + regex + "$", "i");
}

function evaluateCondition(cond: Condition, row: any[], columns: string[]): boolean {
  switch (cond.kind) {
    case "and":
      return evaluateCondition(cond.left, row, columns) && evaluateCondition(cond.right, row, columns);
    case "or":
      return evaluateCondition(cond.left, row, columns) || evaluateCondition(cond.right, row, columns);
    case "comparison": {
      const idx = resolveColumnIndex(columns, cond.column);
      const cell = row[idx];
      const target = cond.value;
      if (target === null) {
        // column = NULL  →  always false (use IS NULL)
        return cond.op === "!=" ? cell !== null : false;
      }
      const cmp = compareValues(cell, target);
      switch (cond.op) {
        case "=": return cmp === 0;
        case "!=": return cmp !== 0;
        case ">": return cmp > 0;
        case "<": return cmp < 0;
        case ">=": return cmp >= 0;
        case "<=": return cmp <= 0;
        default: throw new Error(`Unsupported operator '${cond.op}'`);
      }
    }
    case "in": {
      const idx = resolveColumnIndex(columns, cond.column);
      const cell = row[idx];
      const found = cond.values.some((v) => compareValues(cell, v) === 0);
      return cond.negate ? !found : found;
    }
    case "isNull": {
      const idx = resolveColumnIndex(columns, cond.column);
      const isNull = row[idx] === null;
      return cond.negate ? !isNull : isNull;
    }
    case "like": {
      const idx = resolveColumnIndex(columns, cond.column);
      const cell = row[idx];
      if (cell === null) return false;
      const re = likeToRegex(cond.pattern);
      const match = re.test(String(cell));
      return cond.negate ? !match : match;
    }
    default:
      return false;
  }
}

function executeQuery(sql: string): QueryResult {
  const start = performance.now();
  try {
    const trimmed = sql.trim();
    if (!trimmed) {
      return { error: "Empty query. Enter a SELECT statement.", executionTime: 0 };
    }

    const upper = trimmed.toUpperCase();
    if (!upper.startsWith("SELECT")) {
      return {
        error:
          "Only SELECT statements are supported in this sandbox. DML/DDL is not allowed.",
        executionTime: 0,
      };
    }

    // Reject GROUP BY / JOIN / aggregate functions for now
    if (/\bGROUP\s+BY\b/i.test(trimmed)) {
      return {
        error:
          "GROUP BY is not supported in this sandbox yet. Try a simpler SELECT query.",
        executionTime: 0,
      };
    }
    if (/\bJOIN\b/i.test(trimmed)) {
      return {
        error:
          "JOINs are not supported in this sandbox yet. Query a single table.",
        executionTime: 0,
      };
    }
    if (/\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(trimmed)) {
      return {
        error:
          "Aggregate functions (COUNT, SUM, AVG, MIN, MAX) are not supported in this sandbox yet.",
        executionTime: 0,
      };
    }

    const tokens = tokenize(trimmed);
    const parser = new Parser(tokens);
    const parsed = parser.parse();

    const table = schema[parsed.table.toLowerCase()];
    if (!table) {
      const available = Object.keys(schema).join(", ");
      return {
        error: `Table '${parsed.table}' does not exist. Available tables: ${available}`,
        executionTime: 0,
      };
    }

    // Filter rows
    let rows = table.data;
    if (parsed.where) {
      rows = rows.filter((r) =>
        evaluateCondition(parsed.where!, r, table.columns)
      );
    }

    // Order by
    if (parsed.orderBy) {
      const orderCol = parsed.orderBy.column;
      const idx = resolveColumnIndex(table.columns, orderCol);
      const dir = parsed.orderBy.direction === "DESC" ? -1 : 1;
      rows = [...rows].sort((a, b) => dir * compareValues(a[idx], b[idx]));
    }

    // Limit
    if (parsed.limit !== null) {
      rows = rows.slice(0, parsed.limit);
    }

    // Project columns
    let resultColumns: string[];
    let resultRows: any[][];

    if (parsed.columns === "*") {
      resultColumns = table.columns;
      resultRows = rows.map((r) => [...r]);
    } else {
      resultColumns = parsed.columns;
      const indices = parsed.columns.map((c) =>
        resolveColumnIndex(table.columns, c)
      );
      resultRows = rows.map((r) => indices.map((i) => r[i]));
    }

    const executionTime = performance.now() - start;
    return {
      columns: resultColumns,
      rows: resultRows,
      rowCount: resultRows.length,
      executionTime,
    };
  } catch (err: any) {
    return {
      error: err?.message ?? "Failed to parse query",
      executionTime: performance.now() - start,
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Syntax highlighter (very lightweight, for display only)          */
/* ------------------------------------------------------------------ */

const SQL_KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "ORDER",
  "BY",
  "ASC",
  "DESC",
  "LIMIT",
  "FETCH",
  "FIRST",
  "NEXT",
  "ROWS",
  "ROW",
  "ONLY",
  "AND",
  "OR",
  "IS",
  "NULL",
  "NOT",
  "IN",
  "LIKE",
  "AS",
]);

function highlightSql(line: string): { text: string; cls: string }[] {
  // Split into tokens while keeping delimiters so we can colour them
  const parts: { text: string; cls: string }[] = [];
  const regex = /(\s+)|(--[^\n]*)|(\/\*[\s\S]*?\*\/)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([*,();=<>!]+|[<>]=|!=|<>)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) {
      parts.push({ text: line.slice(last, m.index), cls: "" });
    }
    const [match] = m;
    if (m[1]) {
      parts.push({ text: match, cls: "" });
    } else if (m[2] || m[3]) {
      parts.push({ text: match, cls: "text-emerald-400/70 italic" });
    } else if (m[4]) {
      parts.push({ text: match, cls: "text-amber-300" });
    } else if (m[5]) {
      parts.push({ text: match, cls: "text-orange-300" });
    } else if (m[6]) {
      const up = match.toUpperCase();
      if (SQL_KEYWORDS.has(up)) {
        parts.push({ text: match, cls: "text-sky-400 font-semibold" });
      } else {
        parts.push({ text: match, cls: "text-violet-300" });
      }
    } else if (m[7]) {
      parts.push({ text: match, cls: "text-pink-400" });
    } else {
      parts.push({ text: match, cls: "" });
    }
    last = m.index + match.length;
  }
  if (last < line.length) {
    parts.push({ text: line.slice(last), cls: "" });
  }
  return parts;
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

type HistoryEntry = {
  id: number;
  query: string;
  success: boolean;
  rowCount?: number;
  error?: string;
  timestamp: number;
};

export default function SandboxPage() {
  const [query, setQuery] = useState<string>(
    "SELECT * FROM employees ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY;"
  );
  const [result, setResult] = useState<QueryResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTable, setActiveTable] = useState<string>("employees");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const historyIdRef = useRef(0);

  const lineCount = useMemo(() => query.split("\n").length, [query]);

  const runQuery = useCallback(() => {
    const res = executeQuery(query);
    setResult(res);
    historyIdRef.current += 1;
    const entry: HistoryEntry = {
      id: historyIdRef.current,
      query: query.trim(),
      success: !("error" in res),
      rowCount: "rowCount" in res ? res.rowCount : undefined,
      error: "error" in res ? res.error : undefined,
      timestamp: Date.now(),
    };
    setHistory((h) => [entry, ...h].slice(0, 50));
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runQuery();
    }
    // Tab inserts spaces instead of moving focus
    if (e.key === "Tab") {
      e.preventDefault();
      const t = e.currentTarget;
      const start = t.selectionStart;
      const end = t.selectionEnd;
      const newValue = t.value.slice(0, start) + "  " + t.value.slice(end);
      setQuery(newValue);
      requestAnimationFrame(() => {
        t.selectionStart = t.selectionEnd = start + 2;
      });
    }
  };

  const loadSample = (q: string) => {
    setQuery(q);
    setResult(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const copyQuery = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  const clearEditor = () => {
    setQuery("");
    setResult(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const clearHistory = () => setHistory([]);

  // Auto-run the default query on first mount so the page isn't empty
  useEffect(() => {
    runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isError = result && "error" in result;
  const isSuccess = result && !("error" in result);

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
                  <Terminal className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    SQL Sandbox
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Practice Oracle SQL queries against a simulated HR schema
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <Database className="h-3 w-3" />
                HR Schema
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <TableIcon className="h-3 w-3" />
                {Object.keys(schema).length} Tables
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Code2 className="h-3 w-3" />
                Mode pratique
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: editor + results (2/3) */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="overflow-hidden border-border/60">
              <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-background to-background px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Conseil du jour</p>
                    <p className="text-sm text-muted-foreground">
                      Combinez WHERE, ORDER BY et FETCH FIRST pour répondre aux exercices Oracle les plus fréquents.
                    </p>
                  </div>
                  <Badge variant="secondary">Prêt pour l’examen</Badge>
                </div>
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/60 bg-muted/30 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <CardTitle className="ml-2 flex items-center gap-2 text-sm font-medium">
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                    query.sql
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyQuery}
                    className="h-8 gap-1.5 text-xs"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearEditor}
                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={runQuery}
                    className="h-8 gap-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm hover:from-sky-600 hover:to-blue-700"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Execute
                    <kbd className="ml-1 hidden rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium sm:inline">
                      Ctrl+↵
                    </kbd>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Editor area */}
                <div className="relative flex bg-[#0d1117] font-mono text-sm leading-relaxed">
                  {/* line numbers */}
                  <div
                    aria-hidden
                    className="select-none border-r border-white/5 bg-[#0d1117] py-4 pl-4 pr-3 text-right text-white/25"
                  >
                    {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
                      <div key={i} className="h-[1.6em]">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  {/* highlighted overlay + textarea */}
                  <div className="relative flex-1">
                    {/* syntax-highlighted preview */}
                    <pre
                      aria-hidden
                      className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words py-4 pl-4 pr-4 text-transparent"
                    >
                      {query.split("\n").map((line, i) => (
                        <div key={i} className="min-h-[1.6em]">
                          {highlightSql(line).map((p, j) => (
                            <span key={j} className={p.cls}>
                              {p.text}
                            </span>
                          ))}
                        </div>
                      ))}
                    </pre>
                    <textarea
                      ref={textareaRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoCorrect="off"
                      placeholder="Enter a SQL query…  e.g. SELECT * FROM employees"
                      className="relative h-64 w-full resize-y bg-transparent py-4 pl-4 pr-4 font-mono text-sm leading-relaxed text-white/90 caret-sky-400 outline-none placeholder:text-white/30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results card */}
            <Card className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/60 bg-muted/30 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  {isError ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TableIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                  {isError
                    ? "Error"
                    : isSuccess
                    ? `Result${result && "rowCount" in result ? ` · ${result.rowCount} row${result.rowCount === 1 ? "" : "s"}` : ""}`
                    : "Results"}
                </CardTitle>
                {isSuccess && result && "executionTime" in result && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {result.executionTime < 1
                      ? "<1"
                      : result.executionTime.toFixed(1)}
                    ms
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {!result && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                    <TableIcon className="h-10 w-10 opacity-40" />
                    <p className="text-sm">
                      Run a query to see results here
                    </p>
                  </div>
                )}

                {isError && result && (
                  <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-destructive">
                          Query failed
                        </p>
                        <p className="mt-1 break-words font-mono text-xs text-destructive/80">
                          {result.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isSuccess && result && !("error" in result) && (
                  <ScrollArea className="h-[420px] scrollbar-thin">
                    {result.rows.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                        <CheckCircle2 className="h-8 w-8 opacity-40" />
                        <p className="text-sm">
                          Query executed successfully — 0 rows returned
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader className="sticky top-0 z-10">
                          <TableRow className="border-border/60 bg-muted/40 hover:bg-muted/40">
                            {result.columns.map((col) => (
                              <TableHead
                                key={col}
                                className="h-10 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                              >
                                {col}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.rows.map((row, ri) => (
                            <TableRow
                              key={ri}
                              className="border-border/40 hover:bg-muted/30"
                            >
                              {row.map((cell, ci) => (
                                <TableCell
                                  key={ci}
                                  className={cn(
                                    "whitespace-nowrap py-2.5 font-mono text-xs",
                                    cell === null
                                      ? "italic text-muted-foreground/50"
                                      : typeof cell === "number"
                                      ? "text-right text-sky-600 dark:text-sky-300"
                                      : "text-foreground/90"
                                  )}
                                >
                                  {cell === null
                                    ? "NULL"
                                    : typeof cell === "number"
                                    ? cell.toLocaleString()
                                    : String(cell)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: schema + samples + history (1/3) */}
          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader className="border-b border-border/60 bg-muted/30 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  Reference
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="schema" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border/60 bg-transparent p-0">
                    <TabsTrigger
                      value="schema"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Schema
                    </TabsTrigger>
                    <TabsTrigger
                      value="samples"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Samples
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      History
                    </TabsTrigger>
                  </TabsList>

                  {/* Schema tab */}
                  <TabsContent value="schema" className="mt-0">
                    <div className="p-3">
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {Object.keys(schema).map((t) => (
                          <Button
                            key={t}
                            size="sm"
                            variant={
                              activeTable === t ? "default" : "outline"
                            }
                            onClick={() => setActiveTable(t)}
                            className="h-7 gap-1.5 px-2.5 text-xs"
                          >
                            <TableIcon className="h-3 w-3" />
                            {t}
                          </Button>
                        ))}
                      </div>
                      <ScrollArea className="h-[340px] scrollbar-thin">
                        <div className="rounded-lg border border-border/50">
                          <div className="border-b border-border/50 bg-muted/30 px-3 py-2">
                            <div className="flex items-center gap-2">
                              <TableIcon className="h-3.5 w-3.5 text-sky-500" />
                              <span className="font-mono text-xs font-semibold uppercase tracking-wide">
                                {activeTable}
                              </span>
                              <Badge
                                variant="secondary"
                                className="ml-auto text-[10px]"
                              >
                                {schema[activeTable].data.length} rows
                              </Badge>
                            </div>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border/40 hover:bg-transparent">
                                <TableHead className="h-8 w-1/3 py-1.5 pl-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  Column
                                </TableHead>
                                <TableHead className="h-8 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  Sample
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {schema[activeTable].columns.map((col, ci) => {
                                const sample =
                                  schema[activeTable].data[0]?.[ci] ?? null;
                                return (
                                  <TableRow
                                    key={col}
                                    className="border-border/30 hover:bg-muted/20"
                                  >
                                    <TableCell className="py-1.5 pl-3 pr-2 font-mono text-xs font-medium text-foreground/90">
                                      {col}
                                    </TableCell>
                                    <TableCell className="py-1.5 pr-3 font-mono text-xs text-muted-foreground">
                                      {sample === null
                                        ? "NULL"
                                        : typeof sample === "number"
                                        ? sample.toLocaleString()
                                        : String(sample)}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* Samples tab */}
                  <TabsContent value="samples" className="mt-0">
                    <ScrollArea className="h-[380px] scrollbar-thin">
                      <div className="space-y-1.5 p-3">
                        {sampleQueries.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => loadSample(s.query)}
                            className="group w-full rounded-lg border border-border/50 bg-card/50 p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-foreground">
                                {s.label}
                              </span>
                              <Code2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                            </div>
                            <p className="mb-1.5 mt-0.5 text-[11px] leading-snug text-muted-foreground">
                              {s.description}
                            </p>
                            <code className="block overflow-x-auto whitespace-pre rounded bg-muted/40 px-2 py-1.5 font-mono text-[11px] leading-relaxed text-sky-600 dark:text-sky-300">
                              {s.query}
                            </code>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* History tab */}
                  <TabsContent value="history" className="mt-0">
                    <ScrollArea className="h-[380px] scrollbar-thin">
                      <div className="p-3">
                        {history.length === 0 ? (
                          <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                            <History className="h-8 w-8 opacity-40" />
                            <p className="text-xs">No queries executed yet</p>
                          </div>
                        ) : (
                          <>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {history.length} entr{history.length === 1 ? "y" : "ies"}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearHistory}
                                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                                Clear
                              </Button>
                            </div>
                            <div className="space-y-1.5">
                              {history.map((h) => (
                                <button
                                  key={h.id}
                                  onClick={() => loadSample(h.query)}
                                  className="group w-full rounded-lg border border-border/50 bg-card/50 p-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent/5"
                                >
                                  <div className="flex items-center gap-2">
                                    {h.success ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                    ) : (
                                      <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                                    )}
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(h.timestamp).toLocaleTimeString()}
                                    </span>
                                    {h.success && h.rowCount !== undefined && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-auto text-[10px]"
                                      >
                                        {h.rowCount} row{h.rowCount === 1 ? "" : "s"}
                                      </Badge>
                                    )}
                                  </div>
                                  <code className="mt-1 block overflow-x-auto whitespace-pre rounded bg-muted/40 px-2 py-1 font-mono text-[11px] leading-relaxed text-foreground/80">
                                    {h.query}
                                  </code>
                                  {!h.success && h.error && (
                                    <p className="mt-1 truncate text-[10px] text-destructive/70">
                                      {h.error}
                                    </p>
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
