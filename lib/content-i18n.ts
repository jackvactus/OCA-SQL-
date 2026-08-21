import type { GlossaryTerm, Module, OracleFunction } from "./types";
import { modules } from "./modules-data";
import { glossary, oracleFunctions } from "./reference-data";
import type { Locale } from "./i18n/locale";

// Human-readable source strings are localized here; SQL/code values stay unchanged.
const translations: Record<string, string> = {
  "Fondamentaux": "Fundamentals",
  "Fonctions": "Functions",
  "Contraintes": "Constraints",
  "Agrégation": "Aggregation",
  "Séquence": "Sequence",
  "Dictionnaire": "Data Dictionary",
  "Catégorie": "Category",
  "Objet": "Object",
  "Structure": "Structure",
  "Performance": "Performance",
  "Sécurité": "Security",
  "Général": "General",
  "Révision finale exhaustive 1Z0-071": "Comprehensive 1Z0-071 Final Review",
  "Sécurité Oracle : utilisateurs, privilèges et rôles": "Oracle Security: Users, Privileges and Roles",
  "Transactions TCL et cohérence des données": "TCL Transactions and Data Consistency",
  "Commandes SQL*Plus et SQLcl": "SQL*Plus and SQLcl Commands",
  "Le modèle relationnel": "The relational model",
  "Concepts essentiels": "Essential concepts",
  "Terminologie relationnelle vs SQL": "Relational terminology vs SQL",
  "Objectifs pédagogiques": "Learning objectives",
  "Points clés à retenir": "Key takeaways",
  "Indice :": "Hint:",
  "Leçon terminée !": "Lesson completed!",
  "Prêt à valider ?": "Ready to complete?",
  "Vous pouvez passer à la leçon suivante.": "You can move on to the next lesson.",
  "Marquez cette leçon comme terminée pour suivre votre progression.": "Mark this lesson as complete to track your progress.",
  "Clé primaire": "Primary key",
  "Clé étrangère": "Foreign key",
  "Ligne / Row": "Row",
  "Colonne / Column": "Column",
  "Type de données": "Data type",
  "Identifiant unique de chaque ligne": "Unique identifier for each row",
  "Référence vers une autre table": "Reference to another table",
};

function localize(value: string): string {
  if (translations[value]) return translations[value];
  let result = value;
  for (const [source, target] of Object.entries(translations)) {
    if (source.length > 4 && result.includes(source)) result = result.replaceAll(source, target);
  }
  return result;
}

function localizeValue(value: unknown, key?: string): unknown {
  if (typeof value === "string") return key === "code" || key === "starterCode" || key === "solution" ? value : localize(value);
  if (Array.isArray(value)) return value.map((item) => localizeValue(item, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [entryKey, localizeValue(entryValue, entryKey)]));
  }
  return value;
}

export function getLocalizedModules(locale: Locale): Module[] {
  return locale === "en" ? (localizeValue(modules) as Module[]) : modules;
}

export function getLocalizedGlossary(locale: Locale): GlossaryTerm[] {
  return locale === "en" ? (localizeValue(glossary) as GlossaryTerm[]) : glossary;
}

export function getLocalizedFunctions(locale: Locale): OracleFunction[] {
  return locale === "en" ? (localizeValue(oracleFunctions) as OracleFunction[]) : oracleFunctions;
}
