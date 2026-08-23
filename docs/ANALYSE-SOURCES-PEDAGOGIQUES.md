# Analyse des sources pédagogiques du dossier `docs/`

**Date :** 23 août 2026
**Objet :** Analyse du contenu, de la fiabilité et de l'exploitation des trois documents sources, et de leur relation avec les banques de questions de l'application.

---

## 1. Inventaire

| Fichier | Taille | Format | Nature réelle | Exploitable en l'état ? |
|---|---|---|---|---|
| `1Z0-071.pdf` | 1,50 Mo — 39 p. | PDF (Word 2019) | Recueil de questions d'examen type *dump*, **sans réponses** | ❌ **Non** — risque juridique |
| `1Z0-071_COMPLETE_MASTER_EXAM_PREP_320_QUESTIONS_2026.docx` | 60,8 Ko | DOCX | Workbook original de 320 questions + corrigés | ⚠️ **Partiellement** — défauts structurels majeurs |
| `réponses docx.pdf` | 143,6 Ko — 5 p. | PDF (Word 2019) | Tableau de réponses en français, pour une **autre** numérotation | ⚠️ **Fragment orphelin** |

**Constat d'ensemble : les trois documents ne se répondent pas.** Ils ne partagent ni numérotation, ni langue, ni périmètre. Aucun ne peut servir de référentiel unique, et deux d'entre eux ont été fusionnés dans le code sans réconciliation.

---

## 2. `1Z0-071.pdf` — recueil de type *exam dump*

### 2.1 Contenu mesuré

| Indicateur | Valeur |
|---|---|
| Pages | 39 |
| Questions numérotées détectées | **85** (n° 1 à 86) |
| Énoncés à réponses multiples (« Which two / three ») | **41** |
| Réponses fournies | **0** |
| Explications fournies | **0** |
| Producteur du PDF | Microsoft Word 2019 |
| Chiffrement / protection | Aucun |

### 2.2 En-tête du document

> « **Vendor: Oracle** — Exam Code: **1Z0-071** — Exam Name: Oracle Certified Associate (Database SQL) »
> Rubriques : *SQL Querying (SELECT)* · *Joins & Data Retrieval* · *Group Functions & Subqueries*

### 2.3 Nature

La combinaison — en-tête « Vendor / Exam Code », questions numérotées au format examen, aucune réponse, aucun corrigé, aucune progression pédagogique — correspond au format standard des documents de *braindump* redistribués sur les sites de « questions réelles ».

Les énoncés en sont d'ailleurs révélateurs : ils sont rédigés dans le style exact d'Oracle (« *Examine the structure of the BOOKS_TRANSACTIONS table* », « *Evaluate the following ALTER TABLE statement* », « *Which three statements are true regarding…* »).

### 2.4 Qualité intrinsèque du contenu

Prise isolément, la matière est **pertinente et bien ciblée**. Les thèmes couverts correspondent réellement au programme :

`SET UNUSED` · `FLASHBACK TABLE … TO BEFORE DROP` · `DROP TABLE … PURGE` · tables externes · `INSERT ALL` multi-tables · `WITH` (sous-requêtes corrélées complexes) · `EXISTS` corrélé · séquences en instance unique · `WHERE` vs `HAVING` · privilèges système vs objet · sous-requêtes mono-ligne et multi-lignes · `INTERSECT` / `UNION` / `MINUS` · `TRUNC(ROUND(156.00,-1),-1)` · formes normales · comportement par défaut d'`ORDER BY`.

Ce sont exactement les pièges que teste le 1Z0-071. **C'est précisément ce qui rend son usage tentant — et ce qui rend le problème sérieux.**

### 2.5 Exploitation dans le code — le point critique

L'analyse de similarité (seuil 0,85) entre les énoncés du PDF et ceux de `lib/quiz-data.ts` retourne **≈ 41 correspondances quasi verbatim**. Extrait :

| `lib/quiz-data.ts` | Correspondance dans `1Z0-071.pdf` |
|---|---|
| `q122` — « Examine the business rule: Each student can take up multiple projects… » | identique |
| `q126` — « Which statement correctly grants a system privilege? » | identique |
| `q127` — « Which statement is true regarding external tables? » | identique |
| `q130` — « Which three statements are true regarding constraints? (Choose three.) » | identique |
| `q131` — « Which two statements are true regarding the EXISTS operator used in the correlated subquery? » | identique |
| `q136` — « Which three statements are true regarding the usage of the WITH clause… » | identique |
| `q1944` (l. 1944) — « Evaluate the following ALTER TABLE statement: ALTER TABLE orders SET UNUSED order_date; Which statement is true? » | **identique caractère pour caractère** |

Ces énoncés ont en outre été importés **deux fois** : `q2334` / `q2701` et `q2350` / `q2780` sont des doublons du même contenu.

### 2.6 Risques

| Risque | Portée |
|---|---|
| Violation de l'**Oracle Certification Program Candidate Agreement** | Éditeur de la plateforme |
| Atteinte au droit d'auteur | Éditeur |
| **Invalidation de la certification et bannissement du programme** | **Les apprenants** |
| Perte de crédibilité si le rapprochement est établi publiquement | Marque |

Le troisième point est le plus lourd : ce n'est pas l'éditeur qui en supporte la conséquence, mais les clients.

### 2.7 Recommandations

1. **Retirer `docs/1Z0-071.pdf` du dépôt** et l'ajouter à `.gitignore` — au même titre que `/OCA/`, déjà exclu pour cette raison exacte.
2. **Réécrire les ~41 énoncés concernés** de `lib/quiz-data.ts`. Le sujet testé reste légitime ; c'est la formulation qui doit être originale. Méthode : conserver le concept (« comportement de `SET UNUSED` »), changer le scénario, les tables, les valeurs et la formulation, et rédiger une explication propre.
3. **Conserver le document hors dépôt comme carte des sujets** : sa cartographie thématique est réellement utile pour vérifier la couverture du programme.

---

## 3. `1Z0-071_COMPLETE_MASTER_EXAM_PREP_320_QUESTIONS_2026.docx` — workbook original

### 3.1 Structure

| Élément | Valeur |
|---|---|
| Domaines | **16**, exactement 20 questions chacun |
| Questions annoncées | 320 |
| Questions **uniques** | **224** |
| Jeux d'options distincts | **157** |
| Examen final intégré | 78 questions supplémentaires |
| Corrigés | ✅ oui, avec explication d'une ligne |
| Sources citées | 6 URL (Oracle Learning + 4 sites de questions publics) |

Les 16 domaines :

1. Relational Database Concepts · 2. SELECT Statement & Basic Query Construction · 3. Restricting, Sorting, Operators & Substitution Variables · 4. Single-Row Functions · 5. Conversion & Conditional Expressions · 6. Group Functions & Aggregation · 7. Joins & Multiple-Table Queries · 8. Subqueries · 9. Set Operators · 10. DML & Transactions · 11. DDL, Constraints & Schema Objects · 12. Data Dictionary & Schema Metadata · 13. Views, Sequences, Synonyms & Indexes · 14. User Security, Privileges & Roles · 15. Advanced DML, Large Data Sets & Regular Expressions · 16. Time Zones, DATE/TIMESTAMP & Advanced Query Traps

**Cette architecture est excellente.** Elle couvre le programme officiel de manière équilibrée et se prête directement à un découpage par domaine. C'est le principal actif du document.

### 3.2 Ce que le document annonce

Le workbook s'ouvre sur un chapitre « **Audit of the Previous 200-Question Workbook** » :

> « *The previous file was not actually a 200-question bank: the same small group of basic questions was repeatedly recycled across sections… This replacement deliberately fixes that weakness: 16 domains, 20 independent questions per domain…* »

Et pose une « **Authenticity Rule** » :

> « *This workbook therefore uses public material only for style/topic analysis and does not reproduce confidential live-exam content.* »

**L'intention affichée est exactement la bonne.** Elle n'est pas tenue.

### 3.3 Défaut n° 1 — le recyclage dénoncé est reproduit

Dans **chaque** domaine, les questions 11 à 20 reprennent les questions 1 à 10.

Exemple, domaine 1 :

| N° | Énoncé | N° | Énoncé recyclé |
|---|---|---|---|
| 1 | Which **database** object stores relational data as rows and columns? | 11 | Which **schema** object stores relational data as rows and columns? |
| 2 | Which property is required of a primary key? | 12 | Which **additional rule** is required of a primary key? |
| 3 | Which constraint enforces a **parent-child** key relationship? | 13 | Which constraint enforces a **child-parent** key relationship? |
| 4 | What is a **candidate** key? | 14 | What is **a alternate** key? *(faute d'accord incluse)* |
| 5 | What is **normalization** mainly intended to reduce? | 15 | What is **relational normalization** mainly intended to reduce? |
| 6 | Which constraint can restrict values using a Boolean condition? | 16 | **strictement identique** |

Les options **et** l'explication sont conservées telles quelles. La question 14 demande « *What is a alternate key?* » mais son explication répond « *A candidate key is a minimal unique identifier* ».

Une fois les 96 doublons stricts retirés : **224 questions réelles pour 320 annoncées (−30 %)**.

### 3.4 Défaut n° 2 — la réponse est A dans 94,4 % des cas

Répartition mesurée sur les 320 corrigés :

| Lettre de la bonne réponse | A | B | C | D |
|---|---|---|---|---|
| Occurrences | **302** | 16 | 2 | 0 |
| Part | **94,4 %** | 5,0 % | 0,6 % | **0 %** |

Aucune bonne réponse n'est jamais D. Le distracteur en position D n'a donc **jamais** été utilisé de tout le document.

C'est le défaut le plus grave du workbook : la banque est inutilisable telle quelle pour un entraînement sérieux, et **elle a été importée sans correction** dans `lib/quiz-data-en-workbook.ts` (voir §5).

### 3.5 Défaut n° 3 — aucune question à réponses multiples

Les 320 questions sont à réponse unique. L'examen 1Z0-071 réel utilise massivement le format « choisir deux » / « choisir trois » — le PDF du §2 en contient à lui seul 41 exemples. Le workbook n'entraîne donc **pas au format réel**.

### 3.6 Défaut n° 4 — artefacts de génération non nettoyés

Le corps du document contient en clair des marqueurs internes d'outil d'IA :

```
fileciteturn0file0L41-L159      fileciteturn1file0L150-L304
citeturn1search0turn1search1   turn0search2   turn0search1turn0search3
```

Techniquement inoffensif, mais rédhibitoire pour un document distribué à des clients.

### 3.7 Ce qu'il faut conserver

- ✅ Le **découpage en 16 domaines**, aligné sur le programme officiel.
- ✅ Les **224 énoncés uniques**, tous originaux et pédagogiquement justes.
- ✅ La **checklist de maîtrise** finale (23 points, réellement exhaustive).
- ✅ La **grille de lecture du score** (70–78 : excellent / 66–69 : solide / 60–65 : limite / < 60 : poursuivre).
- ✅ La bibliographie Oracle Learning (deux URL officielles).

### 3.8 Recommandations

1. **Supprimer les 96 doublons** → base propre de 224 questions.
2. **Rééquilibrer la position des bonnes réponses** vers ~25 % par lettre, en permutant les options *et* en mettant à jour les index.
3. **Compléter chaque domaine** de 6 questions supplémentaires originales, dont au moins **4 à réponses multiples**, pour revenir à 20 par domaine → **320 questions réellement distinctes**.
4. **Recalibrer les difficultés** (actuellement 192 `medium` / 109 `easy` / 19 `hard`, attribuées en bloc).
5. **Nettoyer les artefacts** avant toute diffusion du DOCX.

---

## 4. `réponses docx.pdf` — tableau de réponses orphelin

### 4.1 Contenu

5 pages, un tableau à trois colonnes : « **Tableau des réponses corrigées** » → *Question · Réponse(s) · Explication*.

Extraits (après reconstruction via la table `/ToUnicode` du PDF — la police est sous-ensemblée) :

| Question | Réponse | Explication |
|---|---|---|
| NEW QUESTION 1 | C | Utilisation de `&table` une seule fois, les autres variables sont redemandées à chaque exécution |
| NEW QUESTION 2 | — | `SET UNUSED` marque une colonne comme inutilisée sans suppression immédiate |
| NEW QUESTION 5 | B, D | `UNIQUE` accepte plusieurs `NULL`, contraintes désactivables |
| NEW QUESTION 6 | C | `MINUS` retourne les lignes absentes de l'autre table |
| NEW QUESTION 25 | B | DDL = commit implicite |
| NEW QUESTION 89 | C | `FETCH FIRST X PERCENT` |
| NEW QUESTION 152 | D | `NATURAL JOIN` ambigu |

Le style est **bon** : réponses multiples correctement notées, explications courtes et exactes, vocabulaire technique juste. La qualité rédactionnelle n'est pas en cause.

### 4.2 Problème n° 1 — le document ne correspond à aucun autre

| Indicateur | Valeur |
|---|---|
| Entrées présentes | 71 |
| Numéros de question distincts | **70** |
| Plage de numérotation | **1 à 194** |
| Taux de couverture de sa propre plage | **36 %** |

Les numéros sautent : 1–11, puis 16, 20, 25, 26, 29, 30, 38, 40, 43, 44, 47, 48, 51, 54, 55, 60, 65, 67, 69, 70, 74, 77, 81, 84, 89, 94, 96, 100, 102… jusqu'à 194.

Or `1Z0-071.pdf` ne contient que **86 questions**. Ce corrigé référence donc un ensemble de **194 questions qui n'existe nulle part dans `docs/`**. Un doublon interne (« NEW QUESTION 10 » et « NEW QUESTION 10 (bis) ») confirme un assemblage manuel.

**Conclusion : ce fichier est le corrigé partiel d'un document absent.** Il n'est réconciliable ni avec le PDF du §2, ni avec le workbook du §3.

### 4.3 Problème n° 2 — coquilles techniques

Le PDF a été produit avec une police sous-ensemblée qui a perdu le glyphe **« A »**. Toutes les occurrences disparaissent, ce qui produit dans le fichier :

| Texte du PDF | Lecture réelle |
|---|---|
| `LTER TBLE correct` | `ALTER TABLE correct` |
| `DEFULT + NOT NULL valide` | `DEFAULT + NOT NULL valide` |
| `INTERVL adapté aux durées` | `INTERVAL adapté aux durées` |
| `NTURL JOIN ambigu` | `NATURAL JOIN ambigu` |
| `INSERT LL évalue toutes les conditions` | `INSERT ALL évalue toutes les conditions` |
| `CTS copie structure partielle` | `CTAS copie structure partielle` |
| `TO_CHR / TO_DTE correct` | `TO_CHAR / TO_DATE correct` |
| `uto-jointure nécessite alias` | `Auto-jointure nécessite alias` |
| `, E` (colonne réponse) | `A, E` |

**La réponse « A » est donc invisible dans toute la colonne des réponses.** Le document est illisible sans reconstruction.

### 4.4 Recommandations

1. Retrouver le questionnaire de 194 questions auquel ce corrigé se rapporte, ou **abandonner le document**.
2. Si conservé : **régénérer le PDF avec incorporation complète des polices**, ou mieux, le convertir en source structurée (CSV/JSON) plutôt qu'en PDF.
3. **Ne pas importer ce fichier en l'état** : 64 % de ses références sont introuvables.

---

## 5. Traçabilité : du document au code

### 5.1 Filiation constatée

```
docs/1Z0-071.pdf  ─── ~41 énoncés repris quasi verbatim ──►  lib/quiz-data.ts   (238 q.)
                                                              ▲
docs/…320_QUESTIONS_2026.docx ── import automatisé ──►  lib/quiz-data-en-workbook.ts (320 q.)
        (scripts/import-quiz-workbook.ps1)

docs/réponses docx.pdf ────────── aucun lien ─────────────►  (non exploité)
```

### 5.2 Défauts propagés du DOCX vers le code

L'import (`scripts/import-quiz-workbook.ps1`) a été **fidèle** — et c'est le problème : il a reproduit tous les défauts du document source, sans contrôle qualité.

| Défaut | Dans le DOCX | Dans `lib/quiz-data-en-workbook.ts` |
|---|---|---|
| Doublons exacts | 96 | **96** (`workbook-q6 = workbook-q16`, `q8 = q18`, `q9 = q19`, `q10 = q20`, `q22 = q32`…) |
| Bonne réponse en A | 302 / 320 | **302 / 320** (`correctIndexes: [0]`) |
| Réponses multiples | 0 | **0** |
| Difficultés arbitraires | oui | 192 `medium` / 109 `easy` / 19 `hard` |
| Jeux d'options distincts | 157 | **157** |

**Aucune vérification n'a été insérée entre le document et la production.** C'est le manque de contrôle le plus rentable à combler : une simple validation automatique (voir `REFERENTIEL-QUALITE-PREMIUM.md`, §5) aurait bloqué cet import.

### 5.3 Défauts propagés du PDF vers le code

| Défaut | Conséquence dans `lib/quiz-data.ts` |
|---|---|
| Énoncés en anglais | **48 questions en anglais + 16 mixtes** sur 238 dans une banque annoncée française (27 %) |
| Import effectué deux fois | doublons `q146 = q170`, `q150 = q167`, `q157 = q169` |
| Options recopiées telles quelles | `q165` propose deux options identiques à la casse près |
| Contenu d'*exam dump* | risque LEG-01 |

### 5.4 Ce que le code fait mieux que ses sources

À mettre au crédit du travail déjà réalisé sur `lib/quiz-data.ts` :

- **64 questions à réponses multiples** (27 %), format conforme à l'examen réel — le champ `correctIndexes: number[]` est bien conçu pour cela.
- **100 % des explications renseignées**, souvent avec un vrai raisonnement (« *TRUNCATE (DDL) : rapide, auto-commit, ne déclenche pas les triggers, pas de WHERE. DELETE (DML) : transactionnel…* »).
- **Aucune incohérence** entre la formulation « (Choose two/three) » et le nombre de bonnes réponses enregistrées — vérifié sur les deux banques, **0 écart**.
- **Aucun index de réponse hors limites** sur les 558 questions.
- Support de 4, 5 et 6 options (189 / 42 / 7 questions), comme l'examen réel.

C'est cette banque française — corrigée de son biais de position et de ses emprunts — qui doit servir de modèle de référence pour la refonte anglaise.

---

## 6. Synthèse et priorités

| Priorité | Action | Document concerné | Effort |
|---|---|---|---|
| **P0** | Sortir `1Z0-071.pdf` du dépôt, réécrire les ~41 énoncés repris dans `lib/quiz-data.ts` | PDF n° 1 | 3 j |
| **P0** | Rééquilibrer la position des bonnes réponses de la banque anglaise (94,4 % → ~25 %) | DOCX | 2 j |
| **P0** | Supprimer les 96 doublons de la banque anglaise | DOCX | 1 j |
| **P1** | Ajouter 96 questions originales, dont ≥ 60 à réponses multiples, pour revenir à 320 réelles | DOCX | 6 j |
| **P1** | Traduire en français les 64 questions anglaises de `lib/quiz-data.ts` (ou les basculer dans la banque anglaise) | PDF n° 1 | 2 j |
| **P2** | Mettre en place la validation automatique des banques (voir référentiel §5) | — | 1 j |
| **P2** | Statuer sur `réponses docx.pdf` : retrouver sa source ou l'écarter | PDF n° 2 | 0,5 j |
| **P3** | Nettoyer les artefacts de génération du DOCX avant toute diffusion | DOCX | 0,25 j |

---

## 7. Recommandation de gouvernance du contenu

Le problème de fond n'est pas la qualité des sources — elle est correcte — mais **l'absence de barrière entre une source et la production**. Trois mesures suffisent à l'éliminer durablement :

1. **Un seul format pivot.** Toute source (DOCX, PDF, saisie) est convertie en JSON validé par un schéma Zod, jamais importée directement en `.ts`.
2. **Une porte de qualité automatique** exécutée en CI, qui refuse toute banque violant les seuils du référentiel (biais de position, doublons, couverture, format).
3. **Une traçabilité par question.** Ajouter au type `QuizQuestion` un champ `source` (`"original" | "workbook-2026" | "instructor"`) et `reviewedAt`, afin que l'origine de chaque énoncé soit connue et auditable — condition nécessaire pour démontrer, en cas de contestation, que le contenu est original.
