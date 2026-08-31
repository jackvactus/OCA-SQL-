import type { QuizQuestion } from "./types";
import { enOcaQuestionsA } from "./quiz-data-en-oca";
import { enOcaQuestionsB } from "./quiz-data-en-oca-b";

/**
 * Banque anglaise du parcours 1Z0-071.
 *
 * Ce fichier n'est plus qu'un agrégateur : le contenu vit dans
 * `quiz-data-en-oca.ts` (domaines officiels 1 à 8) et
 * `quiz-data-en-oca-b.ts` (domaines 9 à 16).
 *
 * L'ancienne banque provenait du workbook
 * `docs/1Z0-071_COMPLETE_MASTER_EXAM_PREP_320_QUESTIONS_2026.docx`. L'analyse
 * du 31 août 2026 y a relevé quatre défauts structurels qui la rendaient
 * inexploitable en l'état :
 *
 *  1. **67 questions sur 224 étaient des doublons reformulés** — même jeu
 *     d'options, même clé, énoncé réécrit. La déduplication antérieure n'avait
 *     retiré que les doublons stricts.
 *  2. **À partir du cinquième module, chaque question renvoyait vers le mauvais
 *     module** : une question sur les opérateurs ensemblistes pointait vers le
 *     module DML, une question sur la sécurité vers le module de révision.
 *     137 questions sur 224 étaient concernées.
 *  3. **Les explications reformulaient la bonne réponse** sans jamais écarter
 *     les distracteurs — 45 caractères en moyenne, 224 sur 224 sous le seuil
 *     de 120 caractères.
 *  4. **Aucune question multi-réponses**, alors que l'examen réel en pose, et
 *     93 % des bonnes réponses en première position dans les données sources.
 *
 * S'y ajoutaient des questions factuellement cassées : `workbook-q31` demandait
 * les colonnes de `HR.DEPARTMENTS` alors que ses quatre options citaient
 * `hr.employees`, et `workbook-q14` interrogeait sur la clé alternative avec
 * l'explication de la clé candidate.
 *
 * La banque a donc été **réécrite**, domaine officiel par domaine officiel.
 * Le nom de l'export est conservé pour ne rien casser en aval.
 */
export const workbookQuizQuestions: QuizQuestion[] = [
  ...enOcaQuestionsA,
  ...enOcaQuestionsB,
];
