import type {
  Expression,
  JoinClause,
  OrderItem,
  SelectStatement,
  Statement,
} from "./ast";
import {
  appliquerAgregat,
  comparer,
  estFonctionGroupe,
  estNul,
  FONCTIONS_MONO_LIGNE,
  SqlRuntimeError,
  versNombre,
  versTexte,
  type Valeur,
} from "./functions";
import { schema, type SchemaTable } from "./schema";

/**
 * Formes qu'Oracle accepte sans parenthèses. Elles restent des fonctions dans
 * le registre ; c'est seulement leur écriture nue qu'on autorise ici.
 */
const PSEUDO_COLONNES = new Set(["SYSDATE", "CURRENT_DATE", "SYSTIMESTAMP", "USER"]);

/**
 * Évaluation du sous-ensemble SQL du bac à sable.
 *
 * L'ordre d'exécution reproduit celui d'Oracle, et c'est le point pédagogique
 * principal : FROM et jointures, puis WHERE, puis GROUP BY, puis HAVING, puis
 * la projection, puis DISTINCT, puis ORDER BY, puis la limitation de lignes.
 * C'est pour cela qu'un alias du SELECT est utilisable dans ORDER BY et pas
 * dans WHERE, et qu'un agrégat est refusé dans WHERE.
 */

export interface Ligne {
  /** Valeurs indexées par « alias.colonne » et par « colonne ». */
  valeurs: Map<string, Valeur>;
  /** Colonnes dans l'ordre de la table, pour l'étoile. */
  ordre: { cle: string; entete: string }[];
}

export interface Resultat {
  columns: string[];
  rows: Valeur[][];
  rowCount: number;
}

function tableOuEchoue(nom: string): SchemaTable {
  const table = schema[nom.toLowerCase()];
  if (!table) {
    const disponibles = Object.keys(schema).join(", ");
    throw new SqlRuntimeError(
      `ORA-00942 : la table « ${nom} » n'existe pas. Tables disponibles : ${disponibles}`,
    );
  }
  return table;
}

function lignesDeTable(nom: string, alias: string | undefined): Ligne[] {
  const table = tableOuEchoue(nom);
  const prefixe = (alias ?? nom).toUpperCase();
  return table.data.map((donnees) => {
    const valeurs = new Map<string, Valeur>();
    const ordre: { cle: string; entete: string }[] = [];
    table.columns.forEach((colonne, i) => {
      valeurs.set(`${prefixe}.${colonne}`, donnees[i] as Valeur);
      // Le nom nu ne doit pas écraser une colonne homonyme d'une autre table :
      // la première rencontrée gagne, comme dans une jointure ambiguë.
      if (!valeurs.has(colonne)) valeurs.set(colonne, donnees[i] as Valeur);
      ordre.push({ cle: `${prefixe}.${colonne}`, entete: colonne });
    });
    return { valeurs, ordre };
  });
}

function ligneVide(nom: string, alias: string | undefined): Ligne {
  const table = tableOuEchoue(nom);
  const prefixe = (alias ?? nom).toUpperCase();
  const valeurs = new Map<string, Valeur>();
  const ordre: { cle: string; entete: string }[] = [];
  for (const colonne of table.columns) {
    valeurs.set(`${prefixe}.${colonne}`, null);
    if (!valeurs.has(colonne)) valeurs.set(colonne, null);
    ordre.push({ cle: `${prefixe}.${colonne}`, entete: colonne });
  }
  return { valeurs, ordre };
}

function fusionner(a: Ligne, b: Ligne): Ligne {
  const valeurs = new Map(a.valeurs);
  for (const [cle, v] of b.valeurs) {
    if (!valeurs.has(cle)) valeurs.set(cle, v);
  }
  return { valeurs, ordre: [...a.ordre, ...b.ordre] };
}

/** Colonnes portant le même nom des deux côtés — pour NATURAL JOIN. */
function colonnesCommunes(gauche: Ligne, droite: Ligne): string[] {
  const aGauche = new Set(gauche.ordre.map((o) => o.entete));
  return [...new Set(droite.ordre.map((o) => o.entete))].filter((c) => aGauche.has(c));
}

/* ------------------------------ Expressions ------------------------------ */

interface Contexte {
  ligne: Ligne;
  /** Groupe courant, pour évaluer une fonction d'agrégat. */
  groupe?: Ligne[];
  /** Valeurs déjà projetées, pour qu'ORDER BY puisse viser un alias. */
  alias?: Map<string, Valeur>;
  /**
   * Ligne de la requête englobante.
   *
   * C'est ce qui distingue une sous-requête corrélée d'une sous-requête
   * ordinaire : `EXISTS (SELECT 1 FROM employees e WHERE e.department_id =
   * d.department_id)` doit pouvoir lire `d`, qui appartient à la requête
   * externe. Sans cette référence, l'identificateur est introuvable.
   */
  exterieur?: Ligne;
}

export function evaluer(expr: Expression, ctx: Contexte): Valeur {
  switch (expr.kind) {
    case "literal":
      return expr.value;

    case "column": {
      const cle = expr.table ? `${expr.table.toUpperCase()}.${expr.name}` : expr.name;
      if (ctx.alias?.has(cle)) return ctx.alias.get(cle)!;
      if (ctx.ligne.valeurs.has(cle)) return ctx.ligne.valeurs.get(cle)!;
      // La ligne interne prime ; la requête englobante ne sert qu'en secours.
      if (ctx.exterieur?.valeurs.has(cle)) return ctx.exterieur.valeurs.get(cle)!;

      // Pseudo-colonnes d'Oracle : SYSDATE, SYSTIMESTAMP, USER s'écrivent sans
      // parenthèses. Elles existent déjà comme fonctions sans argument ; sans
      // ce renvoi, `SELECT SYSDATE FROM dual` — la forme qu'emploie le cours —
      // échouait sur « identificateur non valide ».
      if (!expr.table && PSEUDO_COLONNES.has(expr.name)) {
        return FONCTIONS_MONO_LIGNE[expr.name]([]);
      }

      throw new SqlRuntimeError(
        `ORA-00904 : identificateur non valide « ${expr.table ? `${expr.table}.` : ""}${expr.name} »`,
      );
    }

    case "star":
      throw new SqlRuntimeError("« * » ne peut pas être utilisé dans cette expression");

    case "unary": {
      if (expr.op === "NOT") {
        const v = evaluer(expr.operand, ctx);
        // Trois états : NOT d'un inconnu reste inconnu.
        return estNul(v) ? null : !verite(v);
      }
      const v = evaluer(expr.operand, ctx);
      if (estNul(v)) return null;
      return expr.op === "-" ? -versNombre(v, "-") : versNombre(v, "+");
    }

    case "binary":
      return evaluerBinaire(expr, ctx);

    case "isNull": {
      const v = evaluer(expr.operand, ctx);
      return expr.negated ? !estNul(v) : estNul(v);
    }

    case "like": {
      const v = evaluer(expr.operand, ctx);
      const motif = evaluer(expr.pattern, ctx);
      if (estNul(v) || estNul(motif)) return null;
      const resultat = motifVersRegex(versTexte(motif)).test(versTexte(v));
      return expr.negated ? !resultat : resultat;
    }

    case "between": {
      const v = evaluer(expr.operand, ctx);
      const bas = evaluer(expr.low, ctx);
      const haut = evaluer(expr.high, ctx);
      if (estNul(v) || estNul(bas) || estNul(haut)) return null;
      const dedans = comparer(v, bas) >= 0 && comparer(v, haut) <= 0;
      return expr.negated ? !dedans : dedans;
    }

    case "in": {
      const v = evaluer(expr.operand, ctx);
      if (estNul(v)) return null;
      const candidats = expr.subquery
        ? colonneUnique(executerSelect(expr.subquery, ctx.ligne))
        : expr.values.map((e) => evaluer(e, ctx));
      // NOT IN devient inconnu dès qu'un NULL est présent : c'est la raison
      // pour laquelle NOT IN sur une sous-requête nullable ne rend rien.
      if (expr.negated && candidats.some(estNul)) return null;
      const trouve = candidats.some((c) => !estNul(c) && comparer(c, v) === 0);
      return expr.negated ? !trouve : trouve;
    }

    case "exists": {
      const resultat = executerSelect(expr.subquery, ctx.ligne);
      const present = resultat.rows.length > 0;
      return expr.negated ? !present : present;
    }

    case "subquery": {
      const resultat = executerSelect(expr.select, ctx.ligne);
      if (resultat.rows.length === 0) return null;
      if (resultat.rows.length > 1) {
        throw new SqlRuntimeError(
          "ORA-01427 : la sous-requête d'une ligne en renvoie plusieurs",
        );
      }
      return resultat.rows[0][0] ?? null;
    }

    case "case": {
      for (const branche of expr.branches) {
        if (verite(evaluer(branche.when, ctx))) return evaluer(branche.then, ctx);
      }
      return expr.else ? evaluer(expr.else, ctx) : null;
    }

    case "function":
      return evaluerFonction(expr, ctx);
  }
}

function evaluerBinaire(
  expr: Extract<Expression, { kind: "binary" }>,
  ctx: Contexte,
): Valeur {
  if (expr.op === "AND" || expr.op === "OR") {
    const g = evaluer(expr.left, ctx);
    const d = evaluer(expr.right, ctx);
    if (expr.op === "AND") {
      if (g === false || d === false) return false;
      if (estNul(g) || estNul(d)) return null;
      return verite(g) && verite(d);
    }
    if (g === true || d === true) return true;
    if (estNul(g) || estNul(d)) return null;
    return verite(g) || verite(d);
  }

  const g = evaluer(expr.left, ctx);
  const d = evaluer(expr.right, ctx);

  if (expr.op === "||") {
    // La concaténation traite NULL comme une chaîne vide — contrairement à
    // l'arithmétique, qui propage NULL.
    if (estNul(g) && estNul(d)) return null;
    return versTexte(g) + versTexte(d);
  }

  // Toute comparaison ou arithmétique avec NULL vaut NULL.
  if (estNul(g) || estNul(d)) return null;

  switch (expr.op) {
    case "=": return comparer(g, d) === 0;
    case "<>": return comparer(g, d) !== 0;
    case "<": return comparer(g, d) < 0;
    case ">": return comparer(g, d) > 0;
    case "<=": return comparer(g, d) <= 0;
    case ">=": return comparer(g, d) >= 0;
    case "+": return versNombre(g, "+") + versNombre(d, "+");
    case "-": return versNombre(g, "-") - versNombre(d, "-");
    case "*": return versNombre(g, "*") * versNombre(d, "*");
    case "/": {
      const diviseur = versNombre(d, "/");
      if (diviseur === 0) throw new SqlRuntimeError("ORA-01476 : division par zéro");
      return versNombre(g, "/") / diviseur;
    }
    case "%": return versNombre(g, "%") % versNombre(d, "%");
    default:
      throw new SqlRuntimeError(`Opérateur non pris en charge : ${expr.op}`);
  }
}

function evaluerFonction(
  expr: Extract<Expression, { kind: "function" }>,
  ctx: Contexte,
): Valeur {
  const nom = expr.name.toUpperCase();

  if (estFonctionGroupe(nom)) {
    if (!ctx.groupe) {
      throw new SqlRuntimeError(
        `ORA-00934 : ${nom} n'est pas autorisée ici — une fonction de groupe ne peut pas figurer dans WHERE`,
      );
    }
    const compteLignes = expr.args.length === 1 && expr.args[0].kind === "star";
    let valeurs: Valeur[] = compteLignes
      ? ctx.groupe.map(() => 1)
      : ctx.groupe.map((l) => evaluer(expr.args[0], { ligne: l }));
    if (expr.distinct) {
      const vus = new Set<string>();
      valeurs = valeurs.filter((v) => {
        const cle = JSON.stringify(v);
        if (vus.has(cle)) return false;
        vus.add(cle);
        return true;
      });
    }
    return appliquerAgregat(nom, valeurs, compteLignes);
  }

  const fonction = FONCTIONS_MONO_LIGNE[nom];
  if (!fonction) {
    throw new SqlRuntimeError(
      `ORA-00904 : « ${nom} » — fonction inconnue ou non prise en charge par ce bac à sable`,
    );
  }
  return fonction(expr.args.map((a) => evaluer(a, ctx)));
}

/** Interprète une valeur comme un booléen SQL. NULL n'est pas vrai. */
function verite(v: Valeur): boolean {
  return v === true || (typeof v === "number" && v !== 0);
}

function motifVersRegex(motif: string): RegExp {
  let sortie = "^";
  for (const c of motif) {
    if (c === "%") sortie += ".*";
    else if (c === "_") sortie += ".";
    else sortie += c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`${sortie}$`, "i");
}

function colonneUnique(resultat: Resultat): Valeur[] {
  if (resultat.columns.length !== 1) {
    throw new SqlRuntimeError(
      "ORA-00913 : la sous-requête d'un IN doit renvoyer une seule colonne",
    );
  }
  return resultat.rows.map((r) => r[0]);
}

/* ------------------------------- Exécution ------------------------------- */

function appliquerJointure(gauche: Ligne[], jointure: JoinClause): Ligne[] {
  const droite = lignesDeTable(jointure.table.name, jointure.table.alias);
  const sortie: Ligne[] = [];

  if (jointure.type === "cross") {
    for (const g of gauche) for (const d of droite) sortie.push(fusionner(g, d));
    return sortie;
  }

  // NATURAL et USING se ramènent à une égalité sur les colonnes nommées.
  let colonnes = jointure.using;
  if (jointure.natural && gauche.length > 0 && droite.length > 0) {
    colonnes = colonnesCommunes(gauche[0], droite[0]);
    if (colonnes.length === 0) {
      throw new SqlRuntimeError(
        "ORA-00933 : NATURAL JOIN sans colonne de même nom des deux côtés",
      );
    }
  }

  const correspond = (g: Ligne, d: Ligne): boolean => {
    if (colonnes) {
      return colonnes.every((c) => {
        const vg = g.valeurs.get(c) ?? null;
        const vd = d.valeurs.get(c) ?? null;
        return !estNul(vg) && !estNul(vd) && comparer(vg, vd) === 0;
      });
    }
    if (!jointure.on) return true;
    return verite(evaluer(jointure.on, { ligne: fusionner(g, d) }));
  };

  const droiteAppariee = new Set<number>();
  for (const g of gauche) {
    let apparie = false;
    droite.forEach((d, index) => {
      if (correspond(g, d)) {
        sortie.push(fusionner(g, d));
        apparie = true;
        droiteAppariee.add(index);
      }
    });
    if (!apparie && (jointure.type === "left" || jointure.type === "full")) {
      sortie.push(fusionner(g, ligneVide(jointure.table.name, jointure.table.alias)));
    }
  }

  if (jointure.type === "right" || jointure.type === "full") {
    const gabarit = gauche[0];
    droite.forEach((d, index) => {
      if (droiteAppariee.has(index)) return;
      const vide: Ligne = gabarit
        ? {
            valeurs: new Map([...gabarit.valeurs.keys()].map((k) => [k, null as Valeur])),
            ordre: gabarit.ordre,
          }
        : { valeurs: new Map(), ordre: [] };
      sortie.push(fusionner(vide, d));
    });
  }

  return sortie;
}

function trier(lignes: { ligne: Ligne; alias: Map<string, Valeur> }[], tri: OrderItem[]) {
  if (tri.length === 0) return lignes;
  return [...lignes].sort((a, b) => {
    for (const item of tri) {
      const va = evaluer(item.expression, { ligne: a.ligne, groupe: [a.ligne], alias: a.alias });
      const vb = evaluer(item.expression, { ligne: b.ligne, groupe: [b.ligne], alias: b.alias });
      const sens = item.direction === "DESC" ? -1 : 1;

      // Par défaut Oracle place les NULL en dernier en ASC, en premier en DESC.
      const aNul = estNul(va);
      const bNul = estNul(vb);
      if (aNul || bNul) {
        if (aNul && bNul) continue;
        const nullsEnPremier =
          item.nulls === "FIRST" || (item.nulls === undefined && item.direction === "DESC");
        if (aNul) return nullsEnPremier ? -1 : 1;
        return nullsEnPremier ? 1 : -1;
      }

      const c = comparer(va, vb) * sens;
      if (c !== 0) return c;
    }
    return 0;
  });
}

export function executerSelect(select: SelectStatement, exterieur?: Ligne): Resultat {
  // 1. FROM et jointures
  let lignes: Ligne[] = select.from
    ? lignesDeTable(select.from.name, select.from.alias)
    : [{ valeurs: new Map(), ordre: [] }]; // SELECT sans FROM, comme sur DUAL
  for (const jointure of select.joins) {
    lignes = appliquerJointure(lignes, jointure);
  }

  // 2. WHERE — avant tout regroupement, d'où l'interdiction des agrégats
  if (select.where) {
    lignes = lignes.filter((ligne) => verite(evaluer(select.where!, { ligne, exterieur })));
  }

  // 3. GROUP BY
  const contientAgregat = select.items.some((item) => utiliseAgregat(item.expression));
  let groupes: { representant: Ligne; membres: Ligne[] }[];

  if (select.groupBy.length > 0) {
    const paquets = new Map<string, Ligne[]>();
    for (const ligne of lignes) {
      const cle = JSON.stringify(select.groupBy.map((e) => evaluer(e, { ligne, exterieur })));
      if (!paquets.has(cle)) paquets.set(cle, []);
      paquets.get(cle)!.push(ligne);
    }
    groupes = [...paquets.values()].map((membres) => ({ representant: membres[0], membres }));
  } else if (contientAgregat || (select.having && utiliseAgregat(select.having))) {
    // Agrégat sans GROUP BY : toute la table forme un groupe unique.
    groupes = [{ representant: lignes[0] ?? { valeurs: new Map(), ordre: [] }, membres: lignes }];
  } else {
    groupes = lignes.map((ligne) => ({ representant: ligne, membres: [ligne] }));
  }

  // 4. HAVING
  if (select.having) {
    groupes = groupes.filter((g) =>
      verite(evaluer(select.having!, { ligne: g.representant, groupe: g.membres, exterieur })),
    );
  }

  // 5. Projection
  const entetes: string[] = [];
  const projetees: { ligne: Ligne; valeurs: Valeur[]; alias: Map<string, Valeur> }[] = [];
  let entetesFiges = false;

  for (const groupe of groupes) {
    const ctx: Contexte = { ligne: groupe.representant, groupe: groupe.membres, exterieur };
    const valeurs: Valeur[] = [];
    const alias = new Map<string, Valeur>();

    for (const item of select.items) {
      if (item.expression.kind === "star") {
        const filtre = item.expression.table?.toUpperCase();
        for (const colonne of groupe.representant.ordre) {
          if (filtre && !colonne.cle.startsWith(`${filtre}.`)) continue;
          if (!entetesFiges) entetes.push(colonne.entete);
          valeurs.push(groupe.representant.valeurs.get(colonne.cle) ?? null);
        }
        continue;
      }
      const valeur = evaluer(item.expression, ctx);
      const entete = item.alias ?? etiquette(item.expression);
      if (!entetesFiges) entetes.push(entete);
      valeurs.push(valeur);
      alias.set(entete, valeur);
      if (item.alias) alias.set(item.alias, valeur);
    }
    entetesFiges = true;
    projetees.push({ ligne: groupe.representant, valeurs, alias });
  }

  // 6. DISTINCT
  let finales = projetees;
  if (select.distinct) {
    const vus = new Set<string>();
    finales = finales.filter((p) => {
      const cle = JSON.stringify(p.valeurs);
      if (vus.has(cle)) return false;
      vus.add(cle);
      return true;
    });
  }

  // 7. ORDER BY — après la projection, donc un alias y est visible
  finales = trier(
    finales.map((p) => ({ ligne: p.ligne, alias: p.alias, valeurs: p.valeurs })),
    select.orderBy,
  ) as typeof finales;

  // 8. OFFSET puis FETCH
  let rows = finales.map((p) => p.valeurs);
  if (select.offset) rows = rows.slice(select.offset);
  if (select.limit !== undefined) rows = rows.slice(0, select.limit);

  return { columns: entetes, rows, rowCount: rows.length };
}

function utiliseAgregat(expr: Expression): boolean {
  switch (expr.kind) {
    case "function":
      return estFonctionGroupe(expr.name) || expr.args.some(utiliseAgregat);
    case "binary":
      return utiliseAgregat(expr.left) || utiliseAgregat(expr.right);
    case "unary":
      return utiliseAgregat(expr.operand);
    case "case":
      return (
        expr.branches.some((b) => utiliseAgregat(b.when) || utiliseAgregat(b.then)) ||
        (expr.else ? utiliseAgregat(expr.else) : false)
      );
    case "isNull":
      return utiliseAgregat(expr.operand);
    case "like":
      return utiliseAgregat(expr.operand) || utiliseAgregat(expr.pattern);
    case "between":
      return (
        utiliseAgregat(expr.operand) || utiliseAgregat(expr.low) || utiliseAgregat(expr.high)
      );
    case "in":
      return utiliseAgregat(expr.operand) || expr.values.some(utiliseAgregat);
    default:
      return false;
  }
}

/** En-tête par défaut d'une colonne calculée, comme Oracle la produirait. */
function etiquette(expr: Expression): string {
  switch (expr.kind) {
    case "column":
      return expr.name;
    case "function":
      return `${expr.name}(${expr.args.map(etiquette).join(",")})`;
    case "literal":
      return expr.value === null ? "NULL" : String(expr.value);
    case "binary":
      return `${etiquette(expr.left)}${expr.op}${etiquette(expr.right)}`;
    default:
      return "EXPR";
  }
}

export function executer(statement: Statement): Resultat {
  if (statement.kind === "select") return executerSelect(statement);

  const gauche = executer(statement.left);
  const droite = executer(statement.right);

  if (gauche.columns.length !== droite.columns.length) {
    throw new SqlRuntimeError(
      `ORA-01789 : le nombre de colonnes diffère entre les deux requêtes (${gauche.columns.length} et ${droite.columns.length})`,
    );
  }

  const cle = (r: Valeur[]) => JSON.stringify(r);
  let rows: Valeur[][];

  switch (statement.op) {
    case "UNION ALL":
      rows = [...gauche.rows, ...droite.rows];
      break;
    case "UNION": {
      const vus = new Set<string>();
      rows = [...gauche.rows, ...droite.rows].filter((r) => {
        if (vus.has(cle(r))) return false;
        vus.add(cle(r));
        return true;
      });
      break;
    }
    case "INTERSECT": {
      const aDroite = new Set(droite.rows.map(cle));
      const vus = new Set<string>();
      rows = gauche.rows.filter((r) => {
        if (!aDroite.has(cle(r)) || vus.has(cle(r))) return false;
        vus.add(cle(r));
        return true;
      });
      break;
    }
    case "MINUS": {
      const aDroite = new Set(droite.rows.map(cle));
      const vus = new Set<string>();
      rows = gauche.rows.filter((r) => {
        if (aDroite.has(cle(r)) || vus.has(cle(r))) return false;
        vus.add(cle(r));
        return true;
      });
      break;
    }
  }

  // Le résultat prend les en-têtes de la première requête, comme en Oracle.
  if (statement.orderBy.length > 0) {
    const colonnes = gauche.columns;
    rows = [...rows].sort((a, b) => {
      for (const item of statement.orderBy) {
        const cible = item.expression;
        const index =
          cible.kind === "column"
            ? colonnes.findIndex((c) => c.toUpperCase() === cible.name.toUpperCase())
            : cible.kind === "literal" && typeof cible.value === "number"
              ? cible.value - 1
              : -1;
        if (index < 0) {
          throw new SqlRuntimeError(
            "ORA-00904 : ORDER BY d'une requête composée doit viser une colonne de la première requête, ou sa position",
          );
        }
        const sens = item.direction === "DESC" ? -1 : 1;
        const c = comparer(a[index], b[index]) * sens;
        if (c !== 0) return c;
      }
      return 0;
    });
  }

  return { columns: gauche.columns, rows, rowCount: rows.length };
}
