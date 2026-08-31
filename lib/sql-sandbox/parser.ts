import type {
  Expression,
  JoinClause,
  JoinType,
  OrderItem,
  SelectItem,
  SelectStatement,
  Statement,
  TableRef,
} from "./ast";
import { SqlSyntaxError, tokenize, type Token } from "./tokenizer";

/**
 * Analyse syntaxique par descente récursive.
 *
 * La précédence des opérateurs suit celle d'Oracle : OR le plus faible, puis
 * AND, puis NOT, puis les comparaisons, puis la concaténation, puis
 * l'arithmétique. C'est ce qui fait que `a = 1 OR b = 2 AND c = 3` se lit
 * `a = 1 OR (b = 2 AND c = 3)` — un point que l'examen teste directement.
 */
export class Parser {
  private i = 0;

  constructor(private readonly tokens: Token[]) {}

  static parse(sql: string): Statement {
    const parser = new Parser(tokenize(sql));
    const statement = parser.parseStatement();
    parser.sauterPointVirgule();
    if (!parser.fini()) {
      throw new SqlSyntaxError(
        `Jetons inattendus après la fin de la requête : « ${parser.regarder()?.value} »`,
        parser.regarder()?.position ?? 0,
      );
    }
    return statement;
  }

  /* ------------------------------ Outils ------------------------------ */

  private regarder(decalage = 0): Token | undefined {
    return this.tokens[this.i + decalage];
  }

  private fini(): boolean {
    return this.i >= this.tokens.length;
  }

  private avancer(): Token {
    const t = this.tokens[this.i];
    if (!t) throw new SqlSyntaxError("Fin de requête inattendue", 0);
    this.i++;
    return t;
  }

  private estMotCle(...mots: string[]): boolean {
    const t = this.regarder();
    return t?.type === "keyword" && mots.includes(t.upper);
  }

  private consommerMotCle(...mots: string[]): boolean {
    if (this.estMotCle(...mots)) {
      this.i++;
      return true;
    }
    return false;
  }

  private exigerMotCle(mot: string): void {
    if (!this.consommerMotCle(mot)) {
      const t = this.regarder();
      throw new SqlSyntaxError(
        `« ${mot} » attendu, trouvé « ${t?.value ?? "fin de requête"} »`,
        t?.position ?? 0,
      );
    }
  }

  private estPonctuation(signe: string): boolean {
    const t = this.regarder();
    return t?.type === "punctuation" && t.value === signe;
  }

  private consommerPonctuation(signe: string): boolean {
    if (this.estPonctuation(signe)) {
      this.i++;
      return true;
    }
    return false;
  }

  private exigerPonctuation(signe: string): void {
    if (!this.consommerPonctuation(signe)) {
      const t = this.regarder();
      throw new SqlSyntaxError(
        `« ${signe} » attendu, trouvé « ${t?.value ?? "fin de requête"} »`,
        t?.position ?? 0,
      );
    }
  }

  private sauterPointVirgule(): void {
    while (this.estPonctuation(";")) this.i++;
  }

  private nomIdentifiant(): string {
    const t = this.regarder();
    if (t?.type === "identifier") {
      this.i++;
      return t.upper;
    }
    if (t?.type === "quotedIdentifier") {
      this.i++;
      return t.value; // délimité : la casse compte
    }
    throw new SqlSyntaxError(
      `Nom attendu, trouvé « ${t?.value ?? "fin de requête"} »`,
      t?.position ?? 0,
    );
  }

  /* --------------------------- Instructions --------------------------- */

  parseStatement(): Statement {
    let gauche: Statement = this.parseSelect();

    while (this.estMotCle("UNION", "INTERSECT", "MINUS", "EXCEPT")) {
      const mot = this.avancer().upper;
      let op: "UNION" | "UNION ALL" | "INTERSECT" | "MINUS";
      if (mot === "UNION") {
        op = this.consommerMotCle("ALL") ? "UNION ALL" : "UNION";
      } else if (mot === "INTERSECT") {
        op = "INTERSECT";
      } else {
        op = "MINUS"; // MINUS et EXCEPT sont synonymes
      }
      const droite = this.parseSelect();
      gauche = { kind: "set", op, left: gauche, right: droite, orderBy: [] };
    }

    // Un ORDER BY final appartient à la requête composée, pas à sa dernière branche.
    if (gauche.kind === "set" && this.estMotCle("ORDER")) {
      gauche.orderBy = this.parseOrderBy();
    }

    return gauche;
  }

  private parseSelect(): SelectStatement {
    // Une parenthèse peut envelopper une branche entière.
    if (this.estPonctuation("(")) {
      const sauvegarde = this.i;
      this.i++;
      if (this.estMotCle("SELECT")) {
        const interne = this.parseSelect();
        this.exigerPonctuation(")");
        return interne;
      }
      this.i = sauvegarde;
    }

    this.exigerMotCle("SELECT");

    const distinct = this.consommerMotCle("DISTINCT");
    if (!distinct) this.consommerMotCle("ALL");

    const items = this.parseSelectList();

    let from: TableRef | undefined;
    const joins: JoinClause[] = [];
    if (this.consommerMotCle("FROM")) {
      from = this.parseTableRef();
      // Forme historique : FROM a, b équivaut à un produit cartésien.
      while (this.consommerPonctuation(",")) {
        joins.push({ type: "cross", table: this.parseTableRef() });
      }
      let jointure = this.parseJoin();
      while (jointure) {
        joins.push(jointure);
        jointure = this.parseJoin();
      }
    }

    const where = this.consommerMotCle("WHERE") ? this.parseExpression() : undefined;

    const groupBy: Expression[] = [];
    if (this.consommerMotCle("GROUP")) {
      this.exigerMotCle("BY");
      do {
        groupBy.push(this.parseExpression());
      } while (this.consommerPonctuation(","));
    }

    const having = this.consommerMotCle("HAVING") ? this.parseExpression() : undefined;
    const orderBy = this.estMotCle("ORDER") ? this.parseOrderBy() : [];
    const { offset, limit } = this.parseRowLimit();

    return {
      kind: "select",
      distinct,
      items,
      from,
      joins,
      where,
      groupBy,
      having,
      orderBy,
      offset,
      limit,
    };
  }

  private parseSelectList(): SelectItem[] {
    const items: SelectItem[] = [];
    do {
      items.push(this.parseSelectItem());
    } while (this.consommerPonctuation(","));
    return items;
  }

  private parseSelectItem(): SelectItem {
    const t = this.regarder();

    // `*` seul, ou `alias.*`
    if (t?.type === "star") {
      this.i++;
      return { expression: { kind: "star" } };
    }
    if (
      (t?.type === "identifier" || t?.type === "quotedIdentifier") &&
      this.regarder(1)?.value === "." &&
      this.regarder(2)?.type === "star"
    ) {
      const table = this.nomIdentifiant();
      this.i += 2;
      return { expression: { kind: "star", table } };
    }

    const expression = this.parseExpression();

    // Alias, avec ou sans AS
    if (this.consommerMotCle("AS")) {
      return { expression, alias: this.nomAlias() };
    }
    const suivant = this.regarder();
    if (suivant?.type === "identifier" || suivant?.type === "quotedIdentifier") {
      return { expression, alias: this.nomAlias() };
    }
    return { expression };
  }

  private nomAlias(): string {
    const t = this.regarder();
    if (t?.type === "quotedIdentifier") {
      this.i++;
      return t.value;
    }
    return this.nomIdentifiant();
  }

  private parseTableRef(): TableRef {
    const name = this.nomIdentifiant();
    if (this.consommerMotCle("AS")) return { name, alias: this.nomAlias() };
    const suivant = this.regarder();
    if (suivant?.type === "identifier" || suivant?.type === "quotedIdentifier") {
      return { name, alias: this.nomAlias() };
    }
    return { name };
  }

  private parseJoin(): JoinClause | null {
    const naturel = this.estMotCle("NATURAL");
    const sauvegarde = this.i;
    if (naturel) this.i++;

    let type: JoinType = "inner";
    if (this.consommerMotCle("CROSS")) {
      type = "cross";
    } else if (this.consommerMotCle("INNER")) {
      type = "inner";
    } else if (this.consommerMotCle("LEFT")) {
      this.consommerMotCle("OUTER");
      type = "left";
    } else if (this.consommerMotCle("RIGHT")) {
      this.consommerMotCle("OUTER");
      type = "right";
    } else if (this.consommerMotCle("FULL")) {
      this.consommerMotCle("OUTER");
      type = "full";
    } else if (!this.estMotCle("JOIN")) {
      this.i = sauvegarde;
      return null;
    }

    this.exigerMotCle("JOIN");
    const table = this.parseTableRef();

    if (naturel) return { type, table, natural: true };
    if (type === "cross") return { type, table };

    if (this.consommerMotCle("ON")) {
      return { type, table, on: this.parseExpression() };
    }
    if (this.consommerMotCle("USING")) {
      this.exigerPonctuation("(");
      const using: string[] = [];
      do {
        using.push(this.nomIdentifiant());
      } while (this.consommerPonctuation(","));
      this.exigerPonctuation(")");
      return { type, table, using };
    }

    const t = this.regarder();
    throw new SqlSyntaxError(
      "Une jointure exige ON ou USING — sauf CROSS JOIN et NATURAL JOIN",
      t?.position ?? 0,
    );
  }

  private parseOrderBy(): OrderItem[] {
    this.exigerMotCle("ORDER");
    this.exigerMotCle("BY");
    const items: OrderItem[] = [];
    do {
      const expression = this.parseExpression();
      let direction: "ASC" | "DESC" = "ASC";
      if (this.consommerMotCle("DESC")) direction = "DESC";
      else this.consommerMotCle("ASC");

      let nulls: "FIRST" | "LAST" | undefined;
      if (this.consommerMotCle("NULLS")) {
        nulls = this.consommerMotCle("FIRST") ? "FIRST" : "LAST";
        if (nulls === "LAST") this.consommerMotCle("LAST");
      }
      items.push({ expression, direction, nulls });
    } while (this.consommerPonctuation(","));
    return items;
  }

  private parseRowLimit(): { offset?: number; limit?: number } {
    let offset: number | undefined;
    let limit: number | undefined;

    if (this.consommerMotCle("OFFSET")) {
      offset = this.nombreEntier("OFFSET");
      this.consommerMotCle("ROWS") || this.consommerMotCle("ROW");
    }
    if (this.consommerMotCle("FETCH")) {
      if (!this.consommerMotCle("FIRST")) this.exigerMotCle("NEXT");
      limit = this.nombreEntier("FETCH");
      this.consommerMotCle("ROWS") || this.consommerMotCle("ROW");
      this.consommerMotCle("ONLY");
    } else if (this.consommerMotCle("LIMIT")) {
      // LIMIT n'est pas de l'Oracle, mais le refuser sèchement n'apprend rien.
      throw new SqlSyntaxError(
        "LIMIT n'existe pas en Oracle : utilisez FETCH FIRST n ROWS ONLY",
        this.regarder(-1)?.position ?? 0,
      );
    }
    return { offset, limit };
  }

  private nombreEntier(contexte: string): number {
    const t = this.regarder();
    if (t?.type !== "number") {
      throw new SqlSyntaxError(`Nombre attendu après ${contexte}`, t?.position ?? 0);
    }
    this.i++;
    return Number(t.value);
  }

  /* ---------------------------- Expressions ---------------------------- */

  parseExpression(): Expression {
    return this.parseOr();
  }

  private parseOr(): Expression {
    let gauche = this.parseAnd();
    while (this.consommerMotCle("OR")) {
      gauche = { kind: "binary", op: "OR", left: gauche, right: this.parseAnd() };
    }
    return gauche;
  }

  private parseAnd(): Expression {
    let gauche = this.parseNot();
    while (this.consommerMotCle("AND")) {
      gauche = { kind: "binary", op: "AND", left: gauche, right: this.parseNot() };
    }
    return gauche;
  }

  private parseNot(): Expression {
    if (this.consommerMotCle("NOT")) {
      return { kind: "unary", op: "NOT", operand: this.parseNot() };
    }
    return this.parsePredicat();
  }

  private parsePredicat(): Expression {
    if (this.estMotCle("EXISTS")) {
      this.i++;
      this.exigerPonctuation("(");
      const sous = this.parseSelect();
      this.exigerPonctuation(")");
      return { kind: "exists", subquery: sous, negated: false };
    }

    const gauche = this.parseConcat();
    const negation = this.consommerMotCle("NOT");

    if (this.consommerMotCle("IS")) {
      const nie = this.consommerMotCle("NOT");
      this.exigerMotCle("NULL");
      return { kind: "isNull", operand: gauche, negated: nie };
    }

    if (this.consommerMotCle("IN")) {
      this.exigerPonctuation("(");
      if (this.estMotCle("SELECT")) {
        const sous = this.parseSelect();
        this.exigerPonctuation(")");
        return { kind: "in", operand: gauche, values: [], subquery: sous, negated: negation };
      }
      const values: Expression[] = [];
      do {
        values.push(this.parseExpression());
      } while (this.consommerPonctuation(","));
      this.exigerPonctuation(")");
      return { kind: "in", operand: gauche, values, negated: negation };
    }

    if (this.consommerMotCle("BETWEEN")) {
      const low = this.parseConcat();
      this.exigerMotCle("AND");
      const high = this.parseConcat();
      return { kind: "between", operand: gauche, low, high, negated: negation };
    }

    if (this.consommerMotCle("LIKE")) {
      return { kind: "like", operand: gauche, pattern: this.parseConcat(), negated: negation };
    }

    if (negation) {
      throw new SqlSyntaxError(
        "NOT doit être suivi de IN, BETWEEN, LIKE ou NULL",
        this.regarder()?.position ?? 0,
      );
    }

    const t = this.regarder();
    if (t?.type === "operator" && ["=", "<>", "!=", "<", ">", "<=", ">="].includes(t.value)) {
      this.i++;
      const op = t.value === "!=" ? "<>" : t.value;
      return { kind: "binary", op, left: gauche, right: this.parseConcat() };
    }

    return gauche;
  }

  private parseConcat(): Expression {
    let gauche = this.parseAdditif();
    while (this.regarder()?.value === "||") {
      this.i++;
      gauche = { kind: "binary", op: "||", left: gauche, right: this.parseAdditif() };
    }
    return gauche;
  }

  private parseAdditif(): Expression {
    let gauche = this.parseMultiplicatif();
    while (this.regarder()?.type === "operator" && ["+", "-"].includes(this.regarder()!.value)) {
      const op = this.avancer().value;
      gauche = { kind: "binary", op, left: gauche, right: this.parseMultiplicatif() };
    }
    return gauche;
  }

  private parseMultiplicatif(): Expression {
    let gauche = this.parseUnaire();
    while (
      this.regarder()?.type === "operator" &&
      ["*", "/", "%"].includes(this.regarder()!.value)
    ) {
      const op = this.avancer().value;
      gauche = { kind: "binary", op, left: gauche, right: this.parseUnaire() };
    }
    return gauche;
  }

  private parseUnaire(): Expression {
    const t = this.regarder();
    if (t?.type === "operator" && (t.value === "-" || t.value === "+")) {
      this.i++;
      return { kind: "unary", op: t.value, operand: this.parseUnaire() };
    }
    return this.parsePrimaire();
  }

  private parsePrimaire(): Expression {
    const t = this.regarder();
    if (!t) throw new SqlSyntaxError("Expression attendue", 0);

    if (t.type === "number") {
      this.i++;
      return { kind: "literal", value: Number(t.value) };
    }
    if (t.type === "string") {
      this.i++;
      return { kind: "literal", value: t.value };
    }
    if (t.type === "keyword" && t.upper === "NULL") {
      this.i++;
      return { kind: "literal", value: null };
    }
    if (t.type === "keyword" && (t.upper === "TRUE" || t.upper === "FALSE")) {
      this.i++;
      return { kind: "literal", value: t.upper === "TRUE" };
    }
    if (t.type === "keyword" && t.upper === "CASE") {
      return this.parseCase();
    }

    if (this.consommerPonctuation("(")) {
      if (this.estMotCle("SELECT")) {
        const sous = this.parseSelect();
        this.exigerPonctuation(")");
        return { kind: "subquery", select: sous };
      }
      const interne = this.parseExpression();
      this.exigerPonctuation(")");
      return interne;
    }

    if (t.type === "identifier" || t.type === "quotedIdentifier") {
      // Appel de fonction
      if (this.regarder(1)?.value === "(" && this.regarder(1)?.type === "punctuation") {
        const name = t.upper;
        this.i += 2;
        const distinct = this.consommerMotCle("DISTINCT");
        const args: Expression[] = [];
        if (this.regarder()?.type === "star") {
          this.i++;
          args.push({ kind: "star" });
        } else if (!this.estPonctuation(")")) {
          do {
            args.push(this.parseExpression());
          } while (this.consommerPonctuation(","));
        }
        this.exigerPonctuation(")");
        return { kind: "function", name, args, distinct };
      }

      // Colonne, éventuellement qualifiée
      const premier = this.nomIdentifiant();
      if (this.estPonctuation(".")) {
        this.i++;
        const second = this.nomIdentifiant();
        return { kind: "column", table: premier, name: second };
      }
      return { kind: "column", name: premier };
    }

    throw new SqlSyntaxError(`Expression inattendue « ${t.value} »`, t.position);
  }

  private parseCase(): Expression {
    this.exigerMotCle("CASE");
    const branches: { when: Expression; then: Expression }[] = [];

    // Forme simple : CASE expr WHEN valeur THEN …
    let sujet: Expression | undefined;
    if (!this.estMotCle("WHEN")) sujet = this.parseExpression();

    while (this.consommerMotCle("WHEN")) {
      const condition = this.parseExpression();
      this.exigerMotCle("THEN");
      const resultat = this.parseExpression();
      branches.push({
        when: sujet ? { kind: "binary", op: "=", left: sujet, right: condition } : condition,
        then: resultat,
      });
    }

    const sinon = this.consommerMotCle("ELSE") ? this.parseExpression() : undefined;
    this.exigerMotCle("END");
    return { kind: "case", branches, else: sinon };
  }
}
