import type { QuizQuestion } from './types';

/**
 * Banque anglaise issue du workbook de préparation
 * (`docs/1Z0-071_COMPLETE_MASTER_EXAM_PREP_320_QUESTIONS_2026.docx`).
 *
 * Le document source annonçait 320 questions mais en contenait 96 en double
 * strict (énoncé ET options identiques) : dans chaque domaine, les questions
 * 11 à 20 reprenaient les questions 1 à 10. Les doublons ont été retirés — il
 * reste 224 questions réellement distinctes.
 *
 * La position de la bonne réponse est fortement déséquilibrée dans la source
 * (A dans 94 % des cas). Elle est neutralisée à l'exécution par
 * `shuffleOptions()` (`lib/quiz-shuffle.ts`), qui permute les options à chaque
 * tirage. Voir `docs/AUDIT-SYSTEME.md`, constats PED-01 à PED-03.
 */
export const workbookQuizQuestions: QuizQuestion[] = [
  {
    "id": "workbook-q1",
    "moduleId": "m1",
    "question": "Which database object stores relational data as rows and columns?",
    "options": [
      "Table",
      "Sequence",
      "Synonym",
      "Role"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A table stores relational rows and columns.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q2",
    "moduleId": "m1",
    "question": "Which property is required of a primary key?",
    "options": [
      "It may contain NULL",
      "It uniquely identifies each row",
      "It must be a foreign key",
      "It must sort rows"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "A primary key uniquely identifies each row and cannot be NULL.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q3",
    "moduleId": "m1",
    "question": "Which constraint enforces a parent-child key relationship?",
    "options": [
      "CHECK",
      "UNIQUE",
      "FOREIGN KEY",
      "DEFAULT"
    ],
    "correctIndexes": [
      2
    ],
    "explanation": "A foreign key enforces referential integrity.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q4",
    "moduleId": "m1",
    "question": "What is a candidate key?",
    "options": [
      "Any index",
      "A minimal attribute set that uniquely identifies a row",
      "Any foreign key",
      "A view key"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "A candidate key is a minimal unique identifier.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q5",
    "moduleId": "m1",
    "question": "What is normalization mainly intended to reduce?",
    "options": [
      "Redundancy and anomalies",
      "SQL keywords",
      "Network traffic",
      "Password length"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Normalization reduces unnecessary redundancy and update anomalies.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q6",
    "moduleId": "m1",
    "question": "Which constraint can restrict values using a Boolean condition?",
    "options": [
      "CHECK",
      "UNIQUE",
      "FOREIGN KEY",
      "INDEX"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CHECK defines a condition that values must satisfy.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q7",
    "moduleId": "m1",
    "question": "Which relationship describes one department with many employees?",
    "options": [
      "One-to-one",
      "One-to-many",
      "Many-to-many only",
      "Zero-to-zero"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "One department can relate to many employee rows.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q8",
    "moduleId": "m1",
    "question": "Which design best represents a many-to-many relationship?",
    "options": [
      "Junction table with two foreign keys",
      "Comma-separated IDs",
      "One sequence",
      "One synonym"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "An associative/junction table is the normal relational design.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q9",
    "moduleId": "m1",
    "question": "What does a column data type define?",
    "options": [
      "Allowed value/storage semantics",
      "User privilege",
      "Join order",
      "Primary key name"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "The data type defines what values and storage semantics apply.",
    "topic": "Relational Database Concepts",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q10",
    "moduleId": "m1",
    "question": "Which statement about a foreign key is true?",
    "options": [
      "It can reference a key in the same table",
      "It must be named ID",
      "It is always a primary key",
      "It automatically sorts rows"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Self-referencing foreign keys are valid.",
    "topic": "Relational Database Concepts",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q11",
    "moduleId": "m1",
    "question": "Which schema object stores relational data as rows and columns?",
    "options": [
      "Table",
      "Sequence",
      "Synonym",
      "Role"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A table stores relational rows and columns.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q12",
    "moduleId": "m1",
    "question": "Which additional rule is required of a primary key?",
    "options": [
      "It may contain NULL",
      "It uniquely identifies each row",
      "It must be a foreign key",
      "It must sort rows"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "A primary key uniquely identifies each row and cannot be NULL.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q13",
    "moduleId": "m1",
    "question": "Which constraint enforces a child-parent key relationship?",
    "options": [
      "CHECK",
      "UNIQUE",
      "FOREIGN KEY",
      "DEFAULT"
    ],
    "correctIndexes": [
      2
    ],
    "explanation": "A foreign key enforces referential integrity.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q14",
    "moduleId": "m1",
    "question": "What is a alternate key?",
    "options": [
      "Any index",
      "A minimal attribute set that uniquely identifies a row",
      "Any foreign key",
      "A view key"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "A candidate key is a minimal unique identifier.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q15",
    "moduleId": "m1",
    "question": "What is relational normalization mainly intended to reduce?",
    "options": [
      "Redundancy and anomalies",
      "SQL keywords",
      "Network traffic",
      "Password length"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Normalization reduces unnecessary redundancy and update anomalies.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q17",
    "moduleId": "m1",
    "question": "Which relationship describes one branch with many accounts?",
    "options": [
      "One-to-one",
      "One-to-many",
      "Many-to-many only",
      "Zero-to-zero"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "One department can relate to many employee rows.",
    "topic": "Relational Database Concepts",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q21",
    "moduleId": "m2",
    "question": "Which query returns all columns from HR.EMPLOYEES?",
    "options": [
      "SELECT ALL FROM hr.employees",
      "SELECT * FROM hr.employees",
      "GET * hr.employees",
      "SELECT columns FROM hr.employees"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "The asterisk selects all columns.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q22",
    "moduleId": "m2",
    "question": "Which operator concatenates character expressions in Oracle?",
    "options": [
      "+",
      "||",
      "&&",
      "CONCAT+"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "Oracle uses || for concatenation.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q23",
    "moduleId": "m2",
    "question": "What does DISTINCT do in a SELECT result?",
    "options": [
      "Removes duplicate result rows",
      "Deletes table duplicates",
      "Sorts rows",
      "Groups rows"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DISTINCT affects the result set, not stored data.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q24",
    "moduleId": "m2",
    "question": "Which clause identifies the source row set?",
    "options": [
      "SELECT",
      "FROM",
      "WHERE",
      "HAVING"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "FROM identifies the table or row source.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q25",
    "moduleId": "m2",
    "question": "Which alias reference is valid?",
    "options": [
      "SELECT e.employee_id FROM employees e",
      "SELECT employees.e.employee_id FROM employees e",
      "SELECT e:employee_id FROM employees e",
      "SELECT alias.e.employee_id FROM employees e"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A table alias is referenced as alias.column.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "hard"
  },
  {
    "id": "workbook-q26",
    "moduleId": "m2",
    "question": "Which query correctly concatenates first and last names with a space?",
    "options": [
      "SELECT first_name || ' ' || last_name FROM employees",
      "SELECT first_name + last_name FROM employees",
      "SELECT first_name AND last_name FROM employees",
      "SELECT CONCAT(first_name,last_name,' ') ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "|| performs character concatenation.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q27",
    "moduleId": "m2",
    "question": "Which expression can be selected from DUAL?",
    "options": [
      "2+3",
      "FROM 2+3",
      "GET 2+3",
      "VALUE 2+3"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DUAL is commonly used to evaluate expressions.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q28",
    "moduleId": "m2",
    "question": "Which alias can be used in ORDER BY?",
    "options": [
      "SELECT salary*12 annual_salary FROM employees ORDER BY annual_salary",
      "SELECT salary*12 annual_salary FROM employees WHERE annual_salary>100000",
      "SELECT salary*12 AS FROM employees",
      "SELECT salary annual salary FROM employees"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A select-list alias can be referenced by ORDER BY.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q29",
    "moduleId": "m2",
    "question": "Which query returns unique department IDs?",
    "options": [
      "SELECT DISTINCT department_id FROM employees",
      "SELECT department_id DISTINCT FROM employees",
      "SELECT UNIQUE ROW department_id FROM employees",
      "SELECT ONLY department_id FROM employees"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DISTINCT removes duplicate result rows.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q30",
    "moduleId": "m2",
    "question": "Which statement about a SELECT expression is correct?",
    "options": [
      "It may contain functions and arithmetic",
      "It can contain only stored columns",
      "It cannot contain literals",
      "It always changes data"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "The select list can contain columns, literals, functions and expressions.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q31",
    "moduleId": "m2",
    "question": "Which query returns all columns from HR.DEPARTMENTS?",
    "options": [
      "SELECT ALL FROM hr.employees",
      "SELECT * FROM hr.employees",
      "GET * hr.employees",
      "SELECT columns FROM hr.employees"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "The asterisk selects all columns.",
    "topic": "SELECT Statement & Basic Query Construction",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q41",
    "moduleId": "m3",
    "question": "Which clause filters individual rows?",
    "options": [
      "WHERE",
      "HAVING",
      "GROUP BY",
      "ORDER BY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "WHERE filters rows before grouping.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q42",
    "moduleId": "m3",
    "question": "Which operator tests an inclusive range?",
    "options": [
      "BETWEEN",
      "RANGE",
      "WITHIN",
      "INCLUSIVE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "BETWEEN includes both endpoints.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q43",
    "moduleId": "m3",
    "question": "Which predicate tests NULL?",
    "options": [
      "= NULL",
      "IS NULL",
      "NULL =",
      "IS = NULL"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "Use IS NULL or IS NOT NULL.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q44",
    "moduleId": "m3",
    "question": "Which LIKE wildcard matches exactly one character?",
    "options": [
      "%",
      "_",
      "*",
      "?"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "Underscore matches one character.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q45",
    "moduleId": "m3",
    "question": "Which LIKE wildcard matches zero or more characters?",
    "options": [
      "%",
      "_",
      "*",
      "?"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Percent matches zero or more characters.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q46",
    "moduleId": "m3",
    "question": "Which logical operator has higher precedence than OR?",
    "options": [
      "AND",
      "OR",
      "FROM",
      "ORDER BY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "AND is evaluated before OR unless parentheses change the order.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q47",
    "moduleId": "m3",
    "question": "What is the default ORDER BY direction?",
    "options": [
      "ASC",
      "DESC",
      "RANDOM",
      "INSERTION"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Ascending is the default.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q48",
    "moduleId": "m3",
    "question": "Which command defines a SQL*Plus substitution variable?",
    "options": [
      "DEFINE",
      "DECLARE TABLE",
      "CREATE VARIABLE ONLY",
      "SET VARIABLE TABLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DEFINE creates a substitution variable in SQL*Plus-style environments.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q49",
    "moduleId": "m3",
    "question": "Which symbol references a substitution variable?",
    "options": [
      "&",
      "@",
      "#",
      "$"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "&name references a substitution variable.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q50",
    "moduleId": "m3",
    "question": "Which command controls display of old/new substitution text?",
    "options": [
      "VERIFY",
      "SHOWSQL",
      "PRINTQUERY",
      "DISPLAYSQL"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "VERIFY controls substitution text display.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q51",
    "moduleId": "m3",
    "question": "Which clause filters individual records?",
    "options": [
      "WHERE",
      "HAVING",
      "GROUP BY",
      "ORDER BY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "WHERE filters rows before grouping.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q53",
    "moduleId": "m3",
    "question": "Which predicate tests missing values?",
    "options": [
      "= NULL",
      "IS NULL",
      "NULL =",
      "IS = NULL"
    ],
    "correctIndexes": [
      1
    ],
    "explanation": "Use IS NULL or IS NOT NULL.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q57",
    "moduleId": "m3",
    "question": "What is the default sorting direction?",
    "options": [
      "ASC",
      "DESC",
      "RANDOM",
      "INSERTION"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Ascending is the default.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q58",
    "moduleId": "m3",
    "question": "Which command defines a SQL client parameter?",
    "options": [
      "DEFINE",
      "DECLARE TABLE",
      "CREATE VARIABLE ONLY",
      "SET VARIABLE TABLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DEFINE creates a substitution variable in SQL*Plus-style environments.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q59",
    "moduleId": "m3",
    "question": "Which symbol references a parameter?",
    "options": [
      "&",
      "@",
      "#",
      "$"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "&name references a substitution variable.",
    "topic": "Restricting, Sorting, Operators & Substitution Variables",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q61",
    "moduleId": "m4",
    "question": "Which function converts text to uppercase?",
    "options": [
      "UPPER",
      "LOWER",
      "INITCAP",
      "CASEUP"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "UPPER returns uppercase text.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q62",
    "moduleId": "m4",
    "question": "Which function converts text to lowercase?",
    "options": [
      "LOWER",
      "DOWN",
      "LCASEONLY",
      "MINUSCASE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "LOWER returns lowercase text.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q63",
    "moduleId": "m4",
    "question": "Which function returns character length?",
    "options": [
      "LENGTH",
      "SIZE",
      "CHARCOUNT",
      "LENONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "LENGTH returns character length.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q64",
    "moduleId": "m4",
    "question": "Which function extracts a substring?",
    "options": [
      "SUBSTR",
      "MIDSTR",
      "SLICE",
      "EXTRACTTEXT"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "SUBSTR returns a substring.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q65",
    "moduleId": "m4",
    "question": "Which function finds a substring position?",
    "options": [
      "INSTR",
      "POSITIONAL",
      "LOCATEONLY",
      "FINDPOS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "INSTR returns the position of a substring.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q66",
    "moduleId": "m4",
    "question": "Which function rounds a number?",
    "options": [
      "ROUND",
      "ROUNDER",
      "PRECISION",
      "FIX"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ROUND rounds to a specified precision.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q67",
    "moduleId": "m4",
    "question": "Which function truncates a number without rounding?",
    "options": [
      "TRUNC",
      "CUT",
      "DROPDEC",
      "FIXNUM"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "TRUNC removes digits without rounding.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q68",
    "moduleId": "m4",
    "question": "Which function returns a division remainder?",
    "options": [
      "MOD",
      "REMAIN",
      "DIVREM",
      "REST"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "MOD returns the remainder.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q69",
    "moduleId": "m4",
    "question": "Which function returns the last day of a month?",
    "options": [
      "LAST_DAY",
      "END_MONTH",
      "MONTH_END",
      "LASTDATE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "LAST_DAY returns the final day of the month.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q70",
    "moduleId": "m4",
    "question": "Which function adds months to a DATE?",
    "options": [
      "ADD_MONTHS",
      "MONTH_ADD",
      "DATEPLUSMONTH",
      "INC_MONTH"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ADD_MONTHS adds a specified number of months.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q71",
    "moduleId": "m4",
    "question": "Which function converts employee names to uppercase?",
    "options": [
      "UPPER",
      "LOWER",
      "INITCAP",
      "CASEUP"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "UPPER returns uppercase text.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q72",
    "moduleId": "m4",
    "question": "Which function converts employee names to lowercase?",
    "options": [
      "LOWER",
      "DOWN",
      "LCASEONLY",
      "MINUSCASE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "LOWER returns lowercase text.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q76",
    "moduleId": "m4",
    "question": "Which function rounds a salary?",
    "options": [
      "ROUND",
      "ROUNDER",
      "PRECISION",
      "FIX"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ROUND rounds to a specified precision.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q77",
    "moduleId": "m4",
    "question": "Which function truncates a salary without rounding?",
    "options": [
      "TRUNC",
      "CUT",
      "DROPDEC",
      "FIXNUM"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "TRUNC removes digits without rounding.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q79",
    "moduleId": "m4",
    "question": "Which function returns the last day of a billing month?",
    "options": [
      "LAST_DAY",
      "END_MONTH",
      "MONTH_END",
      "LASTDATE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "LAST_DAY returns the final day of the month.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q80",
    "moduleId": "m4",
    "question": "Which function adds billing months to a date value?",
    "options": [
      "ADD_MONTHS",
      "MONTH_ADD",
      "DATEPLUSMONTH",
      "INC_MONTH"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ADD_MONTHS adds a specified number of months.",
    "topic": "Single-Row Functions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q81",
    "moduleId": "m5",
    "question": "Which function converts character data to DATE?",
    "options": [
      "TO_DATE",
      "TO_CHAR",
      "TO_NUMBER",
      "DATEVALUE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "TO_DATE converts text to DATE using a format model.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q82",
    "moduleId": "m5",
    "question": "Which function converts DATE to character data?",
    "options": [
      "TO_CHAR",
      "TO_DATE",
      "DATE_TEXT",
      "CHAR_DATE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "TO_CHAR formats a date as text.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q83",
    "moduleId": "m5",
    "question": "Which function converts character data to NUMBER?",
    "options": [
      "TO_NUMBER",
      "TO_INT",
      "NUMBERVALUE",
      "NUM"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "TO_NUMBER converts character data to NUMBER.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q84",
    "moduleId": "m5",
    "question": "Which format model represents a four-digit year?",
    "options": [
      "YYYY",
      "YY",
      "YEAR4",
      "Y4"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "YYYY is the four-digit year format.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q85",
    "moduleId": "m5",
    "question": "Which format model represents a two-digit month?",
    "options": [
      "MM",
      "MONTH2",
      "MON2",
      "M2"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "MM represents a numeric month with two digits.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q86",
    "moduleId": "m5",
    "question": "Which expression returns High when salary exceeds 10000?",
    "options": [
      "CASE WHEN salary>10000 THEN 'High' ELSE 'Standard' END",
      "IF salary>10000 'High'",
      "CASE salary>10000 THEN High",
      "DECODE salary>10000"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Searched CASE supports conditional output.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q87",
    "moduleId": "m5",
    "question": "Which function performs equality-based conditional mapping?",
    "options": [
      "DECODE",
      "MAPVALUE",
      "SWITCHSQL",
      "CASEONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DECODE compares an expression to search values.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q88",
    "moduleId": "m5",
    "question": "What does NULLIF(a,b) return when a=b?",
    "options": [
      "NULL",
      "a",
      "b",
      "0"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "NULLIF returns NULL when the expressions are equal.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q89",
    "moduleId": "m5",
    "question": "Which function returns the first non-NULL expression?",
    "options": [
      "COALESCE",
      "FIRSTVALUEONLY",
      "NVLONLY",
      "FIRST_NOT_NULL"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "COALESCE returns the first non-NULL expression.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q90",
    "moduleId": "m5",
    "question": "Which function returns expr2 when expr1 is NULL?",
    "options": [
      "NVL",
      "NULLCASE",
      "REPLACE",
      "IFNULL2ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "NVL replaces a NULL with the second expression.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q91",
    "moduleId": "m5",
    "question": "Which function converts a text date to a date value?",
    "options": [
      "TO_DATE",
      "TO_CHAR",
      "TO_NUMBER",
      "DATEVALUE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "TO_DATE converts text to DATE using a format model.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q92",
    "moduleId": "m5",
    "question": "Which function converts a date value to a text date?",
    "options": [
      "TO_CHAR",
      "TO_DATE",
      "DATE_TEXT",
      "CHAR_DATE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "TO_CHAR formats a date as text.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q93",
    "moduleId": "m5",
    "question": "Which function converts a text date to NUMBER?",
    "options": [
      "TO_NUMBER",
      "TO_INT",
      "NUMBERVALUE",
      "NUM"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "TO_NUMBER converts character data to NUMBER.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q96",
    "moduleId": "m5",
    "question": "Which expression returns High when commission_pct exceeds 10000?",
    "options": [
      "CASE WHEN salary>10000 THEN 'High' ELSE 'Standard' END",
      "IF salary>10000 'High'",
      "CASE salary>10000 THEN High",
      "DECODE salary>10000"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Searched CASE supports conditional output.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q98",
    "moduleId": "m5",
    "question": "What does NULLIF(a,b) return when the expressions match?",
    "options": [
      "NULL",
      "a",
      "b",
      "0"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "NULLIF returns NULL when the expressions are equal.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q100",
    "moduleId": "m5",
    "question": "Which function returns 0 when commission_pct is NULL?",
    "options": [
      "NVL",
      "NULLCASE",
      "REPLACE",
      "IFNULL2ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "NVL replaces a NULL with the second expression.",
    "topic": "Conversion & Conditional Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q101",
    "moduleId": "m6",
    "question": "Which function counts all rows?",
    "options": [
      "COUNT(*)",
      "COUNT(column)",
      "SUM(column)",
      "ROWCOUNT(column)"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "COUNT(*) counts rows regardless of NULL values in individual columns.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q102",
    "moduleId": "m6",
    "question": "Which function counts only non-NULL values in a column?",
    "options": [
      "COUNT(column)",
      "COUNT(*)",
      "SUM(column)",
      "COUNT(NULLONLY)"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "COUNT(column) ignores NULL values.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q103",
    "moduleId": "m6",
    "question": "Which clause creates aggregate groups?",
    "options": [
      "GROUP BY",
      "ORDER BY",
      "HAVING",
      "GROUP ROWS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "GROUP BY forms groups for aggregate reporting.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q104",
    "moduleId": "m6",
    "question": "Which clause filters groups?",
    "options": [
      "HAVING",
      "WHERE",
      "AFTER GROUP",
      "FILTER ROW"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "HAVING filters grouped results.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q105",
    "moduleId": "m6",
    "question": "Which function returns the highest value?",
    "options": [
      "MAX",
      "HIGH",
      "TOP",
      "GREATESTROW"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "MAX returns the maximum.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q106",
    "moduleId": "m6",
    "question": "Which function returns the lowest value?",
    "options": [
      "MIN",
      "LOW",
      "BOTTOM",
      "LEASTROW"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "MIN returns the minimum.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q107",
    "moduleId": "m6",
    "question": "Which function calculates an arithmetic mean?",
    "options": [
      "AVG",
      "MEAN",
      "AVERAGE_ROW",
      "MID"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "AVG calculates the arithmetic mean.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q108",
    "moduleId": "m6",
    "question": "Which query is valid?",
    "options": [
      "SELECT department_id,SUM(salary) FROM employees GROUP BY department_id",
      "SELECT department_id,SUM(salary) FROM employees GROUP BY salary",
      "SELECT department_id,SUM(salary) FROM employees WHERE SUM(salary)>10000 GROUP BY department_id",
      "SELECT department_id FROM employees GROUP SUM(salary)"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "The nonaggregate selected column is grouped.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "hard"
  },
  {
    "id": "workbook-q109",
    "moduleId": "m6",
    "question": "Which expression counts distinct department IDs?",
    "options": [
      "COUNT(DISTINCT department_id)",
      "DISTINCT COUNT(department_id)",
      "GROUPCOUNT(department_id)",
      "COUNT(UNIQUE department_id)"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "COUNT(DISTINCT ...) counts unique non-NULL values.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q110",
    "moduleId": "m6",
    "question": "Which query filters departments with total salary above 100000?",
    "options": [
      "SELECT department_id,SUM(salary) FROM employees GROUP BY department_id HAVING SUM(salary)>100000",
      "SELECT department_id,SUM(salary) FROM employees WHERE SUM(salary)>100000 GROUP BY department_id",
      "SELECT department_id FROM employees HAVING salary>100000",
      "SELECT department_id,SUM(salary) FROM employees GROUP BY SUM(salary)"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Aggregate conditions belong in HAVING.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q120",
    "moduleId": "m6",
    "question": "Which query filters departments with total commission_pct above 10000?",
    "options": [
      "SELECT department_id,SUM(salary) FROM employees GROUP BY department_id HAVING SUM(salary)>100000",
      "SELECT department_id,SUM(salary) FROM employees WHERE SUM(salary)>100000 GROUP BY department_id",
      "SELECT department_id FROM employees HAVING salary>100000",
      "SELECT department_id,SUM(salary) FROM employees GROUP BY SUM(salary)"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Aggregate conditions belong in HAVING.",
    "topic": "Group Functions & Aggregation",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q121",
    "moduleId": "m7",
    "question": "Which join returns only matching rows?",
    "options": [
      "INNER JOIN",
      "LEFT JOIN",
      "FULL JOIN",
      "CROSS JOIN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "INNER JOIN returns rows satisfying the join condition.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q122",
    "moduleId": "m7",
    "question": "Which join preserves all rows from the left table?",
    "options": [
      "LEFT OUTER JOIN",
      "INNER JOIN",
      "CROSS JOIN",
      "RIGHT JOIN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "LEFT OUTER JOIN preserves left rows.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q123",
    "moduleId": "m7",
    "question": "Which join preserves unmatched rows from both sides?",
    "options": [
      "FULL OUTER JOIN",
      "INNER JOIN",
      "LEFT JOIN only",
      "CROSS JOIN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "FULL OUTER JOIN preserves both sides.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q124",
    "moduleId": "m7",
    "question": "Which join creates every possible row combination?",
    "options": [
      "CROSS JOIN",
      "INNER JOIN",
      "SELF JOIN",
      "NATURAL JOIN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CROSS JOIN creates a Cartesian product.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q125",
    "moduleId": "m7",
    "question": "What is a self join?",
    "options": [
      "Joining a table to itself using aliases",
      "Joining without a condition",
      "Joining databases",
      "Joining a table to a sequence"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A self join uses multiple aliases of one table.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q126",
    "moduleId": "m7",
    "question": "What is a non-equijoin?",
    "options": [
      "A join using a range or non-equality predicate",
      "A join using only =",
      "A Cartesian product",
      "A join without FROM"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Non-equijoins use predicates such as BETWEEN or <.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q127",
    "moduleId": "m7",
    "question": "Which clause normally specifies an ANSI join condition?",
    "options": [
      "ON",
      "WITH",
      "WHEREONLY",
      "JOINWHERE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ON defines the join condition.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q128",
    "moduleId": "m7",
    "question": "Which syntax joins on a same-named column?",
    "options": [
      "JOIN ... USING(column_name)",
      "JOIN ... SAME(column_name)",
      "JOIN ... MATCH(column_name)",
      "JOIN ... EQUALS(column_name)"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USING names a common join column.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q129",
    "moduleId": "m7",
    "question": "What can happen when a join predicate is omitted?",
    "options": [
      "A Cartesian product",
      "Automatic deletion",
      "Automatic grouping",
      "Automatic commit only"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Without a join predicate, all combinations may be produced.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q130",
    "moduleId": "m7",
    "question": "Which relationship is a typical employee-to-manager query?",
    "options": [
      "Self join on manager_id to employee_id",
      "Cross join only",
      "Set operator",
      "Sequence join"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Managers are represented by another row in EMPLOYEES.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q132",
    "moduleId": "m7",
    "question": "Which join preserves all rows from the right table?",
    "options": [
      "LEFT OUTER JOIN",
      "INNER JOIN",
      "CROSS JOIN",
      "RIGHT JOIN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "LEFT OUTER JOIN preserves left rows.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q140",
    "moduleId": "m7",
    "question": "Which relationship is a typical customer-to-supervisor query?",
    "options": [
      "Self join on manager_id to employee_id",
      "Cross join only",
      "Set operator",
      "Sequence join"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Managers are represented by another row in EMPLOYEES.",
    "topic": "Joins & Multiple-Table Queries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q141",
    "moduleId": "m8",
    "question": "What is a single-row subquery?",
    "options": [
      "A subquery returning at most one row",
      "A one-column query only",
      "A one-table query only",
      "A query without WHERE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A single-row subquery returns at most one row.",
    "topic": "Subqueries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q142",
    "moduleId": "m8",
    "question": "Which operator is suitable for a subquery returning multiple values?",
    "options": [
      "IN",
      "= only",
      "IS",
      "BETWEEN only"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "IN can compare against multiple returned values.",
    "topic": "Subqueries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q143",
    "moduleId": "m8",
    "question": "Which operator tests whether a subquery returns at least one row?",
    "options": [
      "EXISTS",
      "FOUND",
      "PRESENT",
      "HASROW"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "EXISTS tests for existence of a row.",
    "topic": "Subqueries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q144",
    "moduleId": "m8",
    "question": "What is a correlated subquery?",
    "options": [
      "It references a value from the outer query",
      "It always returns one row",
      "It has no WHERE",
      "It cannot use aggregates"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A correlated subquery depends on the current outer row.",
    "topic": "Subqueries",
    "difficulty": "hard"
  },
  {
    "id": "workbook-q145",
    "moduleId": "m8",
    "question": "What must a scalar subquery return?",
    "options": [
      "One column and at most one row",
      "Multiple rows",
      "Two columns",
      "No columns"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A scalar subquery produces one value.",
    "topic": "Subqueries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q146",
    "moduleId": "m8",
    "question": "Which operator means greater than every value returned?",
    "options": [
      "> ALL",
      "> ANY",
      "> IN",
      "> EXISTS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "> ALL requires the value to exceed every returned value.",
    "topic": "Subqueries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q147",
    "moduleId": "m8",
    "question": "Which operator means greater than at least one returned value?",
    "options": [
      "> ANY",
      "> ALL",
      "> IN",
      "> EXISTS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "> ANY requires the comparison to succeed for at least one value.",
    "topic": "Subqueries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q148",
    "moduleId": "m8",
    "question": "Which query finds employees earning above the company average?",
    "options": [
      "WHERE salary > (SELECT AVG(salary) FROM employees)",
      "WHERE salary > AVG(salary)",
      "WHERE salary > SELECT AVG(salary)",
      "HAVING salary > AVG(salary)"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "The scalar subquery computes the average.",
    "topic": "Subqueries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q149",
    "moduleId": "m8",
    "question": "What is a subquery in the FROM clause commonly called?",
    "options": [
      "Inline view",
      "Scalar view only",
      "Correlated table",
      "Set table"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A subquery in FROM is an inline view.",
    "topic": "Subqueries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q150",
    "moduleId": "m8",
    "question": "What happens if a scalar comparison receives multiple rows?",
    "options": [
      "Oracle raises a single-row subquery error",
      "It chooses the first row",
      "It chooses MAX",
      "It ignores extras"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A scalar comparison cannot accept multiple rows.",
    "topic": "Subqueries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q158",
    "moduleId": "m8",
    "question": "Which query finds departments earning above the department average?",
    "options": [
      "WHERE salary > (SELECT AVG(salary) FROM employees)",
      "WHERE salary > AVG(salary)",
      "WHERE salary > SELECT AVG(salary)",
      "HAVING salary > AVG(salary)"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "The scalar subquery computes the average.",
    "topic": "Subqueries",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q161",
    "moduleId": "m9",
    "question": "Which operator combines results and removes duplicates?",
    "options": [
      "UNION",
      "UNION ALL",
      "INTERSECT",
      "MINUS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "UNION removes duplicate result rows.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q162",
    "moduleId": "m9",
    "question": "Which operator keeps duplicates?",
    "options": [
      "UNION ALL",
      "UNION",
      "INTERSECT",
      "MINUS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "UNION ALL preserves duplicates.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q163",
    "moduleId": "m9",
    "question": "Which operator returns common rows?",
    "options": [
      "INTERSECT",
      "UNION",
      "MINUS",
      "JOIN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "INTERSECT returns the intersection.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q164",
    "moduleId": "m9",
    "question": "Which operator returns rows in the first query but not the second?",
    "options": [
      "MINUS",
      "UNION",
      "INTERSECT",
      "JOIN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "MINUS performs set difference.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q165",
    "moduleId": "m9",
    "question": "What must corresponding set-operator SELECT lists have?",
    "options": [
      "Same number of expressions with compatible data types",
      "Same column names only",
      "Same table names",
      "Same aliases"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Set operands must be union-compatible.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q166",
    "moduleId": "m9",
    "question": "Which query can union employee IDs with department IDs?",
    "options": [
      "SELECT employee_id FROM employees UNION SELECT department_id FROM departments",
      "SELECT employee_id,first_name FROM employees UNION SELECT department_id FROM departments",
      "SELECT employee_id FROM employees UNION SELECT department_name FROM departments",
      "SELECT employee_id FROM employees JOIN SELECT department_id FROM departments"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Both queries return one compatible numeric expression.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q167",
    "moduleId": "m9",
    "question": "Where should ORDER BY normally appear in a compound query?",
    "options": [
      "At the end of the complete compound query",
      "Between every component",
      "Before UNION only",
      "Never"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "The final ORDER BY sorts the compound result.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q168",
    "moduleId": "m9",
    "question": "Which set operator is order-sensitive?",
    "options": [
      "MINUS",
      "UNION",
      "UNION ALL",
      "INTERSECT"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A MINUS B differs from B MINUS A.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q169",
    "moduleId": "m9",
    "question": "Which operation is best for finding IDs in both current and archive tables?",
    "options": [
      "INTERSECT",
      "MINUS",
      "UNION ALL",
      "CROSS JOIN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "INTERSECT returns common IDs.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q170",
    "moduleId": "m9",
    "question": "Which operation is best for combining two lists while preserving duplicates?",
    "options": [
      "UNION ALL",
      "UNION",
      "INTERSECT",
      "MINUS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "UNION ALL retains duplicates.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q176",
    "moduleId": "m9",
    "question": "Which query can union customer IDs with branch IDs?",
    "options": [
      "SELECT employee_id FROM employees UNION SELECT department_id FROM departments",
      "SELECT employee_id,first_name FROM employees UNION SELECT department_id FROM departments",
      "SELECT employee_id FROM employees UNION SELECT department_name FROM departments",
      "SELECT employee_id FROM employees JOIN SELECT department_id FROM departments"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Both queries return one compatible numeric expression.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q179",
    "moduleId": "m9",
    "question": "Which operation is best for finding IDs in both active and history tables?",
    "options": [
      "INTERSECT",
      "MINUS",
      "UNION ALL",
      "CROSS JOIN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "INTERSECT returns common IDs.",
    "topic": "Set Operators",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q181",
    "moduleId": "m10",
    "question": "Which statement adds rows?",
    "options": [
      "INSERT",
      "UPDATE",
      "ALTER",
      "GRANT"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "INSERT adds rows.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q182",
    "moduleId": "m10",
    "question": "Which statement changes existing values?",
    "options": [
      "UPDATE",
      "INSERT",
      "CREATE",
      "GRANT"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "UPDATE modifies existing rows.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q183",
    "moduleId": "m10",
    "question": "Which statement removes selected rows?",
    "options": [
      "DELETE",
      "DROP",
      "ALTER",
      "REMOVE TABLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DELETE removes rows meeting its predicate.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q184",
    "moduleId": "m10",
    "question": "Which command makes DML changes permanent?",
    "options": [
      "COMMIT",
      "SAVEPOINT",
      "ROLLBACK",
      "REVOKE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "COMMIT permanently applies the transaction.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q185",
    "moduleId": "m10",
    "question": "Which command undoes uncommitted work?",
    "options": [
      "ROLLBACK",
      "COMMIT",
      "GRANT",
      "CREATE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ROLLBACK reverses uncommitted changes.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q186",
    "moduleId": "m10",
    "question": "What is a SAVEPOINT?",
    "options": [
      "A transaction rollback marker",
      "A backup table",
      "A privilege",
      "A view"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "SAVEPOINT marks a point for partial rollback.",
    "topic": "DML & Transactions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q187",
    "moduleId": "m10",
    "question": "What does DELETE without WHERE do?",
    "options": [
      "Deletes all rows",
      "Drops the table",
      "Deletes one row",
      "Does nothing"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "All rows qualify when WHERE is absent.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q188",
    "moduleId": "m10",
    "question": "What does UPDATE without WHERE do?",
    "options": [
      "Updates all rows using the SET expression",
      "Updates one row",
      "Drops the table",
      "Does nothing"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Without WHERE, every row is eligible.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q189",
    "moduleId": "m10",
    "question": "Which statement can insert query results into a table?",
    "options": [
      "INSERT INTO target SELECT ...",
      "COPY SELECT",
      "ADD FROM",
      "MOVE ROWS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "INSERT INTO ... SELECT inserts a query result.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q190",
    "moduleId": "m10",
    "question": "Which statement can synchronize target rows with a source?",
    "options": [
      "MERGE",
      "UNION",
      "VIEW",
      "INDEX"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "MERGE supports conditional update/insert logic.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q191",
    "moduleId": "m10",
    "question": "Which statement adds records?",
    "options": [
      "INSERT",
      "UPDATE",
      "ALTER",
      "GRANT"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "INSERT adds rows.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q193",
    "moduleId": "m10",
    "question": "Which statement removes selected records?",
    "options": [
      "DELETE",
      "DROP",
      "ALTER",
      "REMOVE TABLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DELETE removes rows meeting its predicate.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q200",
    "moduleId": "m10",
    "question": "Which statement can synchronize destination records with a input?",
    "options": [
      "MERGE",
      "UNION",
      "VIEW",
      "INDEX"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "MERGE supports conditional update/insert logic.",
    "topic": "DML & Transactions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q201",
    "moduleId": "m11",
    "question": "Which statement creates a table?",
    "options": [
      "CREATE TABLE",
      "MAKE TABLE",
      "NEW TABLE",
      "BUILD TABLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CREATE TABLE creates a table.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q202",
    "moduleId": "m11",
    "question": "Which statement adds a column?",
    "options": [
      "ALTER TABLE ... ADD",
      "UPDATE TABLE ... ADD",
      "INSERT COLUMN",
      "CREATE COLUMN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ALTER TABLE ADD changes table structure.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q203",
    "moduleId": "m11",
    "question": "Which statement modifies a column definition?",
    "options": [
      "ALTER TABLE ... MODIFY",
      "UPDATE ... MODIFY",
      "CHANGE COLUMN",
      "ALTER COLUMN TABLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ALTER TABLE MODIFY changes eligible column properties.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q204",
    "moduleId": "m11",
    "question": "Which statement removes a table object?",
    "options": [
      "DROP TABLE",
      "DELETE TABLE",
      "CLEAR TABLE",
      "REMOVE TABLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DROP TABLE removes the object and its data.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q205",
    "moduleId": "m11",
    "question": "Which constraint forbids NULL?",
    "options": [
      "NOT NULL",
      "UNIQUE",
      "DEFAULT",
      "CHECK only"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "NOT NULL requires a value.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q206",
    "moduleId": "m11",
    "question": "Which constraint supplies a value when omitted on INSERT?",
    "options": [
      "DEFAULT",
      "CHECK",
      "UNIQUE",
      "FOREIGN KEY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DEFAULT supplies a default expression/value.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q207",
    "moduleId": "m11",
    "question": "Which object generates sequential numeric values?",
    "options": [
      "SEQUENCE",
      "VIEW",
      "INDEX",
      "SYNONYM"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Sequences generate numeric values.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q208",
    "moduleId": "m11",
    "question": "Which object is an alternate name for another object?",
    "options": [
      "SYNONYM",
      "SEQUENCE",
      "INDEX",
      "ROLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A synonym provides an alternate name.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q209",
    "moduleId": "m11",
    "question": "Which object stores a query definition?",
    "options": [
      "VIEW",
      "SEQUENCE",
      "INDEX",
      "ROLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A normal view stores a query definition.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q210",
    "moduleId": "m11",
    "question": "Which option makes a view read-only?",
    "options": [
      "WITH READ ONLY",
      "NO DML",
      "IMMUTABLE",
      "READ LOCK"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "WITH READ ONLY prevents DML through the view.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q211",
    "moduleId": "m11",
    "question": "Which statement creates a customer table?",
    "options": [
      "CREATE TABLE",
      "MAKE TABLE",
      "NEW TABLE",
      "BUILD TABLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CREATE TABLE creates a table.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q212",
    "moduleId": "m11",
    "question": "Which statement adds a attribute?",
    "options": [
      "ALTER TABLE ... ADD",
      "UPDATE TABLE ... ADD",
      "INSERT COLUMN",
      "CREATE COLUMN"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ALTER TABLE ADD changes table structure.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q213",
    "moduleId": "m11",
    "question": "Which statement modifies a attribute definition?",
    "options": [
      "ALTER TABLE ... MODIFY",
      "UPDATE ... MODIFY",
      "CHANGE COLUMN",
      "ALTER COLUMN TABLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ALTER TABLE MODIFY changes eligible column properties.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q214",
    "moduleId": "m11",
    "question": "Which statement removes a customer table schema object?",
    "options": [
      "DROP TABLE",
      "DELETE TABLE",
      "CLEAR TABLE",
      "REMOVE TABLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DROP TABLE removes the object and its data.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q217",
    "moduleId": "m11",
    "question": "Which schema object generates sequential numeric values?",
    "options": [
      "SEQUENCE",
      "VIEW",
      "INDEX",
      "SYNONYM"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Sequences generate numeric values.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q218",
    "moduleId": "m11",
    "question": "Which schema object is an alternate name for another schema object?",
    "options": [
      "SYNONYM",
      "SEQUENCE",
      "INDEX",
      "ROLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A synonym provides an alternate name.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q219",
    "moduleId": "m11",
    "question": "Which schema object stores a query definition?",
    "options": [
      "VIEW",
      "SEQUENCE",
      "INDEX",
      "ROLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A normal view stores a query definition.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q220",
    "moduleId": "m11",
    "question": "Which option makes a reporting view read-only?",
    "options": [
      "WITH READ ONLY",
      "NO DML",
      "IMMUTABLE",
      "READ LOCK"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "WITH READ ONLY prevents DML through the view.",
    "topic": "DDL, Constraints & Schema Objects",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q221",
    "moduleId": "m12",
    "question": "Which view lists objects owned by the current user?",
    "options": [
      "USER_OBJECTS",
      "ALL_OBJECTS_ONLY",
      "DBA_DATABASE",
      "USER_USERS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_OBJECTS describes the current user's objects.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q222",
    "moduleId": "m12",
    "question": "Which view lists tables accessible to the current user?",
    "options": [
      "ALL_TABLES",
      "USER_TABLE_LIST",
      "ACCESS_TABLES",
      "DBA_TABLES_ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ALL_TABLES describes accessible tables subject to privileges.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q223",
    "moduleId": "m12",
    "question": "Which view lists tables owned by the current user?",
    "options": [
      "USER_TABLES",
      "ALL_TABLES",
      "DBA_TABLES",
      "TABLE_OWNER"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_TABLES lists the user's tables.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q224",
    "moduleId": "m12",
    "question": "Which view describes columns of accessible tables?",
    "options": [
      "ALL_TAB_COLUMNS",
      "ALL_COLUMNS_ONLY",
      "USER_FIELDS",
      "DBA_FIELDS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ALL_TAB_COLUMNS exposes column metadata.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q225",
    "moduleId": "m12",
    "question": "Which view describes columns in the current user's tables?",
    "options": [
      "USER_TAB_COLUMNS",
      "USER_FIELDS",
      "TABLE_COLUMNS",
      "DBA_COLUMNS_ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_TAB_COLUMNS describes the user's table columns.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q226",
    "moduleId": "m12",
    "question": "Which view is commonly used for indexes owned by the current user?",
    "options": [
      "USER_INDEXES",
      "USER_KEYS",
      "INDEX_LIST",
      "MY_INDEXES"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_INDEXES describes the user's indexes.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q227",
    "moduleId": "m12",
    "question": "Which view is commonly used for sequences owned by the current user?",
    "options": [
      "USER_SEQUENCES",
      "USER_GENERATORS",
      "SEQUENCE_TABLE",
      "MY_SEQUENCES"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_SEQUENCES describes sequences.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q228",
    "moduleId": "m12",
    "question": "Which view is commonly used for views owned by the current user?",
    "options": [
      "USER_VIEWS",
      "USER_SELECTS",
      "VIEW_TABLE",
      "MY_VIEWS_ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_VIEWS describes the user's views.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q229",
    "moduleId": "m12",
    "question": "Which prefix usually denotes accessible-object dictionary views?",
    "options": [
      "ALL_",
      "ACCESS_",
      "GLOBAL_",
      "ANY_"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ALL_ views generally describe accessible objects.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q230",
    "moduleId": "m12",
    "question": "Which prefix usually denotes administrative dictionary views?",
    "options": [
      "DBA_",
      "ADMIN_",
      "SYSALL_",
      "GLOBAL_"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DBA_ views are administrative and require suitable privileges.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q231",
    "moduleId": "m12",
    "question": "Which view lists objects created by the reporting user?",
    "options": [
      "USER_OBJECTS",
      "ALL_OBJECTS_ONLY",
      "DBA_DATABASE",
      "USER_USERS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_OBJECTS describes the current user's objects.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q232",
    "moduleId": "m12",
    "question": "Which view lists tables available to the session to the reporting user?",
    "options": [
      "ALL_TABLES",
      "USER_TABLE_LIST",
      "ACCESS_TABLES",
      "DBA_TABLES_ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ALL_TABLES describes accessible tables subject to privileges.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q233",
    "moduleId": "m12",
    "question": "Which view lists tables created by the reporting user?",
    "options": [
      "USER_TABLES",
      "ALL_TABLES",
      "DBA_TABLES",
      "TABLE_OWNER"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_TABLES lists the user's tables.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q234",
    "moduleId": "m12",
    "question": "Which view describes columns of available to the session tables?",
    "options": [
      "ALL_TAB_COLUMNS",
      "ALL_COLUMNS_ONLY",
      "USER_FIELDS",
      "DBA_FIELDS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ALL_TAB_COLUMNS exposes column metadata.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q235",
    "moduleId": "m12",
    "question": "Which view describes columns in the reporting user's tables?",
    "options": [
      "USER_TAB_COLUMNS",
      "USER_FIELDS",
      "TABLE_COLUMNS",
      "DBA_COLUMNS_ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_TAB_COLUMNS describes the user's table columns.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q236",
    "moduleId": "m12",
    "question": "Which view is commonly used for indexes created by the reporting user?",
    "options": [
      "USER_INDEXES",
      "USER_KEYS",
      "INDEX_LIST",
      "MY_INDEXES"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_INDEXES describes the user's indexes.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q237",
    "moduleId": "m12",
    "question": "Which view is commonly used for sequences created by the reporting user?",
    "options": [
      "USER_SEQUENCES",
      "USER_GENERATORS",
      "SEQUENCE_TABLE",
      "MY_SEQUENCES"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_SEQUENCES describes sequences.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q238",
    "moduleId": "m12",
    "question": "Which view is commonly used for views created by the reporting user?",
    "options": [
      "USER_VIEWS",
      "USER_SELECTS",
      "VIEW_TABLE",
      "MY_VIEWS_ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "USER_VIEWS describes the user's views.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q239",
    "moduleId": "m12",
    "question": "Which prefix usually denotes available to the session-object dictionary views?",
    "options": [
      "ALL_",
      "ACCESS_",
      "GLOBAL_",
      "ANY_"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ALL_ views generally describe accessible objects.",
    "topic": "Data Dictionary & Schema Metadata",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q241",
    "moduleId": "m13",
    "question": "Which expression returns the next sequence value?",
    "options": [
      "seq.NEXTVAL",
      "seq.NEXT",
      "NEXT(seq)",
      "seq.NEWVAL"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "NEXTVAL returns the next sequence value.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q242",
    "moduleId": "m13",
    "question": "Which expression returns the current sequence value after NEXTVAL has been used?",
    "options": [
      "seq.CURRVAL",
      "seq.CURRENT",
      "CURR(seq)",
      "seq.VALUE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CURRVAL returns the current sequence value in the session after initialization.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q243",
    "moduleId": "m13",
    "question": "Which sequence clause defines the starting value?",
    "options": [
      "START WITH",
      "BEGIN AT",
      "INITIAL",
      "FIRST"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "START WITH defines the initial value.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q244",
    "moduleId": "m13",
    "question": "Which sequence clause defines the increment?",
    "options": [
      "INCREMENT BY",
      "STEP",
      "ADD BY",
      "INCREASE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "INCREMENT BY defines the step.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q245",
    "moduleId": "m13",
    "question": "Which option allows a sequence to cycle?",
    "options": [
      "CYCLE",
      "LOOP",
      "REPEAT",
      "WRAP"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CYCLE enables cycling according to sequence limits.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q246",
    "moduleId": "m13",
    "question": "Which statement creates a synonym?",
    "options": [
      "CREATE SYNONYM",
      "CREATE ALIAS",
      "MAKE SYNONYM",
      "CREATE OBJECT NAME"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CREATE SYNONYM creates an alternate object name.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q247",
    "moduleId": "m13",
    "question": "Which statement creates a public synonym?",
    "options": [
      "CREATE PUBLIC SYNONYM",
      "CREATE SYNONYM PUBLIC ONLY",
      "CREATE GLOBAL ALIAS",
      "PUBLIC NAME"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CREATE PUBLIC SYNONYM requires appropriate privileges.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q248",
    "moduleId": "m13",
    "question": "Which object can improve access performance for suitable predicates?",
    "options": [
      "INDEX",
      "SYNONYM",
      "VIEW",
      "ROLE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Indexes can provide efficient access paths.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q249",
    "moduleId": "m13",
    "question": "Which index is based on an expression?",
    "options": [
      "Function-based index",
      "View index",
      "Formula view",
      "Expression table"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A function-based index indexes an expression result.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q250",
    "moduleId": "m13",
    "question": "Which statement drops an index?",
    "options": [
      "DROP INDEX index_name",
      "DELETE INDEX index_name",
      "REMOVE INDEX",
      "ALTER INDEX DELETE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DROP INDEX removes the index object.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q251",
    "moduleId": "m13",
    "question": "Which expression returns the next order_invoice sequence value?",
    "options": [
      "seq.NEXTVAL",
      "seq.NEXT",
      "NEXT(seq)",
      "seq.NEWVAL"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "NEXTVAL returns the next sequence value.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q252",
    "moduleId": "m13",
    "question": "Which expression returns the current order_invoice sequence value after NEXTVAL has been used?",
    "options": [
      "seq.CURRVAL",
      "seq.CURRENT",
      "CURR(seq)",
      "seq.VALUE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CURRVAL returns the current sequence value in the session after initialization.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q253",
    "moduleId": "m13",
    "question": "Which order_invoice sequence clause defines the starting value?",
    "options": [
      "START WITH",
      "BEGIN AT",
      "INITIAL",
      "FIRST"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "START WITH defines the initial value.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q254",
    "moduleId": "m13",
    "question": "Which order_invoice sequence clause defines the increment?",
    "options": [
      "INCREMENT BY",
      "STEP",
      "ADD BY",
      "INCREASE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "INCREMENT BY defines the step.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q255",
    "moduleId": "m13",
    "question": "Which option allows a order_invoice sequence to cycle?",
    "options": [
      "CYCLE",
      "LOOP",
      "REPEAT",
      "WRAP"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CYCLE enables cycling according to sequence limits.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q259",
    "moduleId": "m13",
    "question": "Which customer index is based on an expression?",
    "options": [
      "Function-based index",
      "View index",
      "Formula view",
      "Expression table"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "A function-based index indexes an expression result.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q260",
    "moduleId": "m13",
    "question": "Which statement drops an customer index?",
    "options": [
      "DROP INDEX index_name",
      "DELETE INDEX index_name",
      "REMOVE INDEX",
      "ALTER INDEX DELETE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DROP INDEX removes the index object.",
    "topic": "Views, Sequences, Synonyms & Indexes",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q261",
    "moduleId": "m14",
    "question": "Which privilege permits a user to establish a database session?",
    "options": [
      "CREATE SESSION",
      "CONNECT DATABASE",
      "LOGIN",
      "START SESSION"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CREATE SESSION permits connection.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q262",
    "moduleId": "m14",
    "question": "Which is an object privilege?",
    "options": [
      "SELECT ON employees",
      "CREATE SESSION",
      "CREATE TABLE",
      "ALTER USER"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "SELECT on a specific table is an object privilege.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q263",
    "moduleId": "m14",
    "question": "Which is a system privilege?",
    "options": [
      "CREATE TABLE",
      "SELECT ON employees",
      "UPDATE ON orders",
      "DELETE ON orders"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CREATE TABLE is a system privilege.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q264",
    "moduleId": "m14",
    "question": "Which command grants SELECT on a table?",
    "options": [
      "GRANT SELECT ON employees TO alice",
      "GIVE SELECT employees TO alice",
      "ALLOW SELECT employees",
      "PERMIT SELECT"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "GRANT is the correct syntax.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q265",
    "moduleId": "m14",
    "question": "Which command removes an object privilege?",
    "options": [
      "REVOKE SELECT ON employees FROM alice",
      "DELETE SELECT FROM alice",
      "DENY SELECT",
      "REMOVE ACCESS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "REVOKE removes a granted privilege.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q266",
    "moduleId": "m14",
    "question": "What is a role?",
    "options": [
      "A named collection of privileges",
      "A table alias",
      "A sequence",
      "A view"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Roles group privileges for easier management.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q267",
    "moduleId": "m14",
    "question": "What does WITH GRANT OPTION permit for an object privilege?",
    "options": [
      "Regranting that object privilege to others",
      "Creating users",
      "Dropping the database",
      "Altering the table definition automatically"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "WITH GRANT OPTION allows the grantee to grant the object privilege onward.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q268",
    "moduleId": "m14",
    "question": "What does WITH ADMIN OPTION permit for a role/system privilege?",
    "options": [
      "Granting the role/system privilege onward",
      "Dropping tables",
      "Creating indexes automatically",
      "Changing NLS settings"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "WITH ADMIN OPTION permits administrative regranting.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q269",
    "moduleId": "m14",
    "question": "Which principle gives users only required access?",
    "options": [
      "Least privilege",
      "Maximum privilege",
      "Open access",
      "Shared privilege"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Least privilege minimizes unnecessary access.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q270",
    "moduleId": "m14",
    "question": "Which privilege is appropriate for a reporting account that only reads one table?",
    "options": [
      "SELECT on the required table",
      "DBA",
      "DROP ANY TABLE",
      "SYS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Least privilege favors only the required SELECT access.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q280",
    "moduleId": "m14",
    "question": "Which privilege is appropriate for a analytics account that only reads one table?",
    "options": [
      "SELECT on the required table",
      "DBA",
      "DROP ANY TABLE",
      "SYS"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Least privilege favors only the required SELECT access.",
    "topic": "User Security, Privileges & Roles",
    "difficulty": "hard"
  },
  {
    "id": "workbook-q281",
    "moduleId": "m15",
    "question": "Which statement synchronizes source and target rows?",
    "options": [
      "MERGE",
      "UNION",
      "VIEW",
      "INDEX"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "MERGE supports conditional update/insert logic.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q282",
    "moduleId": "m15",
    "question": "Which MERGE clause defines matching logic?",
    "options": [
      "ON",
      "MATCH BY",
      "USING ONLY",
      "WHEREONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ON defines the match condition.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q283",
    "moduleId": "m15",
    "question": "Which MERGE branch handles matched rows?",
    "options": [
      "WHEN MATCHED THEN UPDATE",
      "WHEN SAME THEN INSERT",
      "MATCHED SELECT",
      "IF MATCHED"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "WHEN MATCHED can perform an update.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q284",
    "moduleId": "m15",
    "question": "Which MERGE branch handles unmatched source rows?",
    "options": [
      "WHEN NOT MATCHED THEN INSERT",
      "WHEN ABSENT THEN UPDATE",
      "NOT FOUND SELECT",
      "NEW ROWS ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "WHEN NOT MATCHED can insert source rows.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q285",
    "moduleId": "m15",
    "question": "Which DML feature can return affected values?",
    "options": [
      "RETURNING",
      "OUTPUT ONLY",
      "SEND",
      "RETURN ROWS ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Oracle DML supports RETURNING in appropriate contexts.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q286",
    "moduleId": "m15",
    "question": "Which feature inserts rows into multiple target tables from one source?",
    "options": [
      "Multi-table INSERT",
      "UNION INSERT",
      "MULTI COPY",
      "INSERT GROUP"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Oracle supports multi-table INSERT statements.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q287",
    "moduleId": "m15",
    "question": "Which predicate tests a regular expression?",
    "options": [
      "REGEXP_LIKE",
      "LIKE_REGEX",
      "REGEX_MATCH",
      "PATTERN_SQL"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "REGEXP_LIKE is the regex predicate.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "hard"
  },
  {
    "id": "workbook-q288",
    "moduleId": "m15",
    "question": "Which function extracts a regex-matching substring?",
    "options": [
      "REGEXP_SUBSTR",
      "REGEXP_EXTRACT_ONLY",
      "SUBSTR_REGEX",
      "REGEXP_TEXT"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "REGEXP_SUBSTR returns a matching substring.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q289",
    "moduleId": "m15",
    "question": "Which function replaces text using a regular expression?",
    "options": [
      "REGEXP_REPLACE",
      "REGEX_CHANGE",
      "REPLACE_REGEX",
      "REGEXP_EDIT"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "REGEXP_REPLACE performs regex-based replacement.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "hard"
  },
  {
    "id": "workbook-q290",
    "moduleId": "m15",
    "question": "Which function returns the position of a regex match?",
    "options": [
      "REGEXP_INSTR",
      "REGEX_POSITION",
      "INSTR_REGEX",
      "REGEXP_LOCATE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "REGEXP_INSTR returns a match position.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q291",
    "moduleId": "m15",
    "question": "Which statement synchronizes input and destination records?",
    "options": [
      "MERGE",
      "UNION",
      "VIEW",
      "INDEX"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "MERGE supports conditional update/insert logic.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q293",
    "moduleId": "m15",
    "question": "Which MERGE branch handles matched records?",
    "options": [
      "WHEN MATCHED THEN UPDATE",
      "WHEN SAME THEN INSERT",
      "MATCHED SELECT",
      "IF MATCHED"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "WHEN MATCHED can perform an update.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q294",
    "moduleId": "m15",
    "question": "Which MERGE branch handles unmatched source records?",
    "options": [
      "WHEN NOT MATCHED THEN INSERT",
      "WHEN ABSENT THEN UPDATE",
      "NOT FOUND SELECT",
      "NEW ROWS ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "WHEN NOT MATCHED can insert source rows.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q296",
    "moduleId": "m15",
    "question": "Which feature inserts records into multiple target datasets from one source?",
    "options": [
      "Multi-table INSERT",
      "UNION INSERT",
      "MULTI COPY",
      "INSERT GROUP"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Oracle supports multi-table INSERT statements.",
    "topic": "Advanced DML, Large Data Sets & Regular Expressions",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q301",
    "moduleId": "m16",
    "question": "Which type stores date and time without time-zone information?",
    "options": [
      "DATE",
      "TIMESTAMP WITH TIME ZONE",
      "TIMESTAMP WITH LOCAL TIME ZONE",
      "TIMEZONE_ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DATE stores date/time fields without a time-zone component.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q302",
    "moduleId": "m16",
    "question": "Which type stores time-zone information with the value?",
    "options": [
      "TIMESTAMP WITH TIME ZONE",
      "DATE",
      "TIMESTAMP",
      "TIME"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "TIMESTAMP WITH TIME ZONE stores time-zone information.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q303",
    "moduleId": "m16",
    "question": "Which type normalizes storage and displays in the session time zone?",
    "options": [
      "TIMESTAMP WITH LOCAL TIME ZONE",
      "DATE",
      "TIMESTAMP",
      "TIMEZONE DATE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "TIMESTAMP WITH LOCAL TIME ZONE normalizes storage and presents by session time zone.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "hard"
  },
  {
    "id": "workbook-q304",
    "moduleId": "m16",
    "question": "Which function returns the current timestamp in the session time zone?",
    "options": [
      "CURRENT_TIMESTAMP",
      "SERVER_TIMESTAMP",
      "NOWSESSION",
      "SYSDATE_TZ"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "CURRENT_TIMESTAMP returns a timestamp with time zone.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "hard"
  },
  {
    "id": "workbook-q305",
    "moduleId": "m16",
    "question": "Which function returns the database time zone?",
    "options": [
      "DBTIMEZONE",
      "DATABASE_TZ_ONLY",
      "SESSIONZONE",
      "TZDATABASE"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DBTIMEZONE returns the database time zone.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "hard"
  },
  {
    "id": "workbook-q306",
    "moduleId": "m16",
    "question": "Which function returns the session time zone?",
    "options": [
      "SESSIONTIMEZONE",
      "CURRENT_TZ",
      "SESSION_ZONE_ONLY",
      "USER_TZ"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "SESSIONTIMEZONE returns the session time zone.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "hard"
  },
  {
    "id": "workbook-q307",
    "moduleId": "m16",
    "question": "Which expression adds one day to a DATE?",
    "options": [
      "hire_date + 1",
      "ADD_DAY(hire_date,1)",
      "hire_date + INTERVAL '1' YEAR",
      "DATEADDONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "For DATE arithmetic, 1 represents one day.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q308",
    "moduleId": "m16",
    "question": "Which function adds one month to a date?",
    "options": [
      "ADD_MONTHS(hire_date,1)",
      "hire_date + 1 month",
      "MONTHPLUS(hire_date,1)",
      "hire_date + INTERVAL '1' DAY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ADD_MONTHS is the standard month arithmetic function.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "easy"
  },
  {
    "id": "workbook-q309",
    "moduleId": "m16",
    "question": "Which clause skips rows for pagination?",
    "options": [
      "OFFSET",
      "SKIP ROWS",
      "PAGE OFFSET ONLY",
      "START AT"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "OFFSET skips a specified number of rows.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q310",
    "moduleId": "m16",
    "question": "Which syntax returns the first 5 rows after sorting?",
    "options": [
      "ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY",
      "LIMIT 5",
      "TOP 5",
      "FIRST 5"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "Oracle supports the row-limiting FETCH FIRST clause.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q311",
    "moduleId": "m16",
    "question": "Which type stores timestamp value and time without time-zone information?",
    "options": [
      "DATE",
      "TIMESTAMP WITH TIME ZONE",
      "TIMESTAMP WITH LOCAL TIME ZONE",
      "TIMEZONE_ONLY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "DATE stores date/time fields without a time-zone component.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "medium"
  },
  {
    "id": "workbook-q318",
    "moduleId": "m16",
    "question": "Which function adds one month to a timestamp value?",
    "options": [
      "ADD_MONTHS(hire_date,1)",
      "hire_date + 1 month",
      "MONTHPLUS(hire_date,1)",
      "hire_date + INTERVAL '1' DAY"
    ],
    "correctIndexes": [
      0
    ],
    "explanation": "ADD_MONTHS is the standard month arithmetic function.",
    "topic": "Time Zones, DATE/TIMESTAMP & Advanced Query Traps",
    "difficulty": "easy"
  }
];
