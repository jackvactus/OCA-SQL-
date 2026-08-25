export interface Lesson {
  id: string;
  title: string;
  duration: number;
  objectives: string[];
  content: LessonSection[];
  keyPoints: string[];
  flashcards: Flashcard[];
  exercises: Exercise[];
}

export interface LessonSection {
  type: "text" | "code" | "table" | "diagram" | "tip" | "warning" | "note";
  title?: string;
  body?: string;
  code?: string;
  caption?: string;
  headers?: string[];
  rows?: string[][];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface Exercise {
  id: string;
  prompt: string;
  starterCode?: string;
  solution: string;
  hint: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  lessons: Lesson[];
  estimatedHours: number;
}

export interface QuizQuestion {
  id: string;
  /**
   * Parcours auquel la question appartient. Absent ⇒ "oca-sql", pour rester
   * compatible avec les banques historiques.
   */
  track?: "oca-sql" | "ocp-dba-i" | "ocp-dba-ii";
  /** Module du site (m1…m18) ou session de cursus (`ocp1-session-3`…). */
  moduleId: string;
  question: string;
  options: string[];
  /** Index(es) of correct option(s). Length > 1 ⇒ question multi-réponses (choose N). */
  correctIndexes: number[];
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

/** Traduction anglaise d'une question, appliquee a l'execution selon la locale. */
export interface QuizQuestionTranslation {
  question: string;
  options: string[];
  explanation: string;
  topic?: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  example?: string;
}

export interface OracleFunction {
  name: string;
  category: string;
  syntax: string;
  description: string;
  example: string;
  result: string;
}
