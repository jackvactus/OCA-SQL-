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
  moduleId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
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
