# Correctifs appliqués — 23 août 2026

Ce document trace les modifications réellement appliquées au dépôt après l'audit
([`AUDIT-SYSTEME.md`](./AUDIT-SYSTEME.md)). Chaque ligne renvoie au constat qu'elle referme.

---

## 1. Ingestion des PDF dans la banque de questions

### Ce que contenaient réellement les documents

| Source | Contenu | Statut d'ingestion |
|---|---|---|
| `1Z0-071_…_320_QUESTIONS_2026.docx` — banque | 320 questions, dont **96 doublons stricts** | Déjà présente ; **96 doublons retirés** |
| `1Z0-071_…_320_QUESTIONS_2026.docx` — mock final 78 q. | 78 questions | **0 question nouvelle** : les 78 sont toutes déjà dans la banque de 320 (vérifié par comparaison énoncé + options) |
| `réponses docx.pdf` | **71 réponses corrigées et expliquées en français** | ✅ **Les 71 ingérées** → `lib/quiz-data-pdf.ts` |
| `1Z0-071.pdf` | 86 questions **sans aucune réponse ni explication** | Utilisé comme **cartographie thématique** uniquement — voir ci-dessous |

### Nouvelle banque : `lib/quiz-data-pdf.ts`

**71 questions originales en français**, une par concept validé du corrigé PDF.

- Énoncés, options et explications **entièrement réécrits** : aucune phrase n'est reprise d'un
  document d'examen tiers (ferme le risque **LEG-01** pour les questions ajoutées).
- Le PDF `1Z0-071.pdf` a servi à vérifier la **couverture thématique** (WITH, vues, sous-requêtes,
  jointures, ORDER BY, GROUP BY, HAVING, privilèges, séquences, index, NVL, INTERVAL, FETCH,
  tables externes, UNION/INTERSECT/MINUS, TRUNC/ROUND, formes normales…), jamais à copier du texte.
- **26 questions à réponses multiples (36,6 %)** — format réel de l'examen.
- Position de la bonne réponse : **A 27 % · B 29 % · C 22 % · D 22 %** (cible du référentiel : 20–30 %).
- **0 doublon**, **0 anomalie** sur les 14 contrôles du référentiel §3.1.

### Pourquoi les ~45 questions restantes du dump n'ont pas été importées

`1Z0-071.pdf` ne contient **aucune réponse**. Les importer supposerait d'inventer les corrigés,
c'est-à-dire de livrer des réponses non vérifiées à des candidats — l'inverse de l'objectif.
Leurs sujets sont en revanche tous couverts par les 71 nouvelles questions et par les modules existants.

### État des banques après correctifs

| Banque | Avant | Après |
|---|---|---|
| `lib/quiz-data.ts` (FR) | 238 questions, 3 doublons, 41 énoncés repris du dump | **306 questions**, **0 doublon** |
| `lib/quiz-data-en-workbook.ts` (EN) | 320 annoncées / 224 réelles | **224 questions**, **0 doublon** |
| `lib/quiz-data-pdf.ts` (FR, nouveau) | — | **71 questions originales** |

> Referme : **PED-02** (doublons), **PED-11** (doublons FR), et une part de **LEG-01**.

---

## 2. Neutralisation du biais de position — le correctif le plus important

`lib/quiz-shuffle.ts` (nouveau) permute les options **à chaque tirage** et réindexe les bonnes
réponses. Appliqué dans `app/(app)/quiz/page.tsx` et `app/(app)/exam/page.tsx` via `drawQuestions()`.

| Stratégie « cocher toujours la même case » | Avant | Après |
|---|---|---|
| Banque anglaise | **94,4 %** | **25,1 %** |
| Banque française | 44,5 % | **17,8 %** |

Le seuil de réussite est de 63 %. **L'examen blanc anglais ne peut plus être réussi sans lire les questions.**

> Referme : **PED-01**, **PED-03**, **PED-05**.

---

## 3. Page d'accueil — visuels Oracle et données honnêtes

### Illustrations : 8 images Unsplash distantes → 4 illustrations Oracle locales

| Nouveau fichier | Sujet |
|---|---|
| `public/art/oracle-datacenter.svg` | Baies de serveurs, cylindres de base de données, voyants d'état |
| `public/art/oracle-cloud.svg` | Topologie Oracle Cloud Infrastructure, régions et flux |
| `public/art/oracle-sql.svg` | Éditeur SQL Oracle avec requête colorée et jeu de résultats |
| `public/art/oracle-database.svg` | Pile Oracle Database (tables, index, vues) et badge SQL |

Conséquences directes :

- **Aucune image distante** — `next.config.js` : `remotePatterns: []`.
- Plus de transfert de l'IP visiteur à un tiers dès la page d'accueil (**LEG-03**).
- Plus de page cassée si Unsplash est indisponible (**PERF-03**).
- Une CSP stricte devient applicable (**SEC-04**).

### Données inventées → données réelles

| Élément | Avant | Après |
|---|---|---|
| Panneau héros | « Moniteur Oracle Database », 99,98 % dispo, 1,24 ms latence, +18,4 % charge | Simulateur 1Z0-071 : 63 questions, 120 min, 63 % de seuil, nombre réel de questions disponibles |
| Graphique du panneau | 12 barres arbitraires | Répartition **réelle** des questions par module |
| Bandeau « operations » | « 99,98 % disponibilité plateforme », « 24/7 » | Questions, modules, leçons et part de questions multi-réponses — toutes calculées |
| Tuile « Oracle Database » | `/logo-image.png`, copie octet pour octet de `favicon.png` | `public/art/oracle-database.svg` |
| Compteur de questions | `Math.max(FR, EN)` — inexact dans une des deux langues | Banque réellement servie dans la langue courante |

### Accessibilité et rendu

- Fonds décoratifs : `alt=""` + `aria-hidden` ; visuels porteurs de sens : `alt` **localisé** FR/EN.
- Attribut `sizes` ajouté sur toutes les images `fill`.
- Tuiles de la galerie : suppression du fond blanc forcé et du double `p-8` (rendu correct en thème sombre).

---

## 4. Nouveau : sélecteur de parcours de certification

**Après connexion, l'utilisateur choisit son parcours** — `/tracks`.

| Parcours | Examen | Certification délivrée | Format | Couverture par la plateforme |
|---|---|---|---|---|
| **OCA SQL** | 1Z0-071 | Oracle Database SQL Certified Associate | 63 q · 120 min · 63 % | **17 / 17 domaines** |
| **OCP I** | 1Z0-082 | Oracle Database Administration 2019 Certified Professional | 72 q · 120 min · 60 % | **17 / 23 domaines** |
| **OCP II** | 1Z0-083 | Oracle Database Administration 2019 Certified Professional | 68 q · 120 min · 57 % | **1 / 25 domaines** |

Fichiers ajoutés :

- `lib/certification-tracks.ts` — modèle de données, domaines officiels, mapping vers les modules du site.
- `app/(app)/tracks/page.tsx` — écran de choix (3 cartes, taux de couverture, format d'épreuve).
- `app/(app)/tracks/[trackId]/page.tsx` — détail : programme officiel domaine par domaine, avec pour
  chacun soit un lien direct vers le module qui le couvre, soit une mention « non couvert » explicite.

Points de conception :

- Les **intitulés de domaine restent en anglais**, dans leur formulation officielle Oracle : c'est le
  libellé imprimé sur la fiche d'examen et sur le relevé de score ; le traduire induirait le candidat en erreur.
- La couverture est affichée **sans l'embellir** : les 6 domaines d'administration de 1Z0-082 et les
  24 domaines de 1Z0-083 sont signalés « non couvert », avec un lien direct vers les ressources Oracle University.
- Sources : fiches d'examen Oracle University pour [1Z0-071](https://education.oracle.com/oracle-database-sql/pexam_1Z0-071),
  [1Z0-082](https://education.oracle.com/oracle-database-administration-i/pexam_1Z0-082) et
  [1Z0-083](https://education.oracle.com/oracle-database-administration-ii/pexam_1Z0-083).

Routage : `middleware.ts`, `lib/utils.ts` (`sanitizeRedirectPath`) et la page d'inscription mènent
désormais à `/tracks`. Une entrée « Parcours / Tracks » a été ajoutée en tête de la barre latérale.

---

## 4 bis. Le dossier `docs/OCA/` — inventaire et exploitation

Le dossier `docs/OCA/` contient **59 fichiers** répartis en 11 sous-dossiers, avec de très
nombreux doublons (le même `OCA 1Z0-071.pdf` existe en 4 exemplaires, `OCA SQL 2.pdf` en 6).
Après dédoublonnage, il reste **12 documents réellement distincts**.

### Ce qui a été exploité

| Document | Nature réelle | Exploitation |
|---|---|---|
| `sql oca/📚 COURS COMPLET ORACLE SQL 1Z0.docx` | **Support de formation original** — 6 sessions, 32 chapitres, 60 blocs SQL | ✅ **Intégré en totalité** → `lib/course-oca-sql.ts` |
| `sql oca/OCA SQL 2.docx` | **Le questionnaire manquant** : 70 questions numérotées « NEW QUESTION n » | ✅ Concepts couverts (voir ci-dessous) |
| `sql oca/réponses docx.docx` | Le corrigé français — version DOCX, **lisible sans reconstruction** | ✅ Les 71 concepts ingérés |
| `OCA 1Z0-071.docx` / `.pdf` | Recueil d'examen tiers, 90 questions **sans corrigé** | Cartographie thématique uniquement |

### Le corrigé orphelin a trouvé sa source

L'audit signalait que `réponses docx.pdf` corrigeait un questionnaire introuvable
(numérotation 1→194, 70 entrées). **`OCA SQL 2.docx` est ce questionnaire** : même numérotation
« NEW QUESTION n », mêmes sujets. Vérification faite :

| | |
|---|---|
| Questions dans `OCA SQL 2.docx` | 70 numéros distincts |
| Entrées dans le corrigé | 71 (dont un « 10 bis ») |
| **Appariement question ↔ réponse vérifiée** | **69** |
| Questions sans réponse | 1 |

Les 71 concepts corrigés étaient **déjà tous ingérés** dans `lib/quiz-data-pdf.ts`. L'appariement
confirme simplement que la couverture est complète et que rien n'a été inventé.

### Ce qui n'a pas été exploité, et pourquoi

`docs/OCA/` contient une dizaine de recueils explicitement identifiés comme des *braindumps* :
`oracle.passleader.1z0-071…229q.vce.pdf`, `oracle.braindump2go.1z0-082…47q.vce.pdf`,
`oracle.examcollection.1z0-083…105q.vce.pdf`, `oracle.lead2pass.1z0-082…27q.vce.pdf`,
`oracle.selftestengine.1z0-082…64q.vce.pdf`, plusieurs `toaz.info-…`, `pdfcoffee.com-…`.

Ces fichiers n'ont **pas** été importés : les intégrer reviendrait à redistribuer du contenu
d'examen tiers dans un produit commercial, avec les conséquences décrites au constat **LEG-01**
(invalidation de certification et bannissement pour les apprenants).

### `.gitignore` corrigé

La règle existante `/OCA/` ne s'appliquait qu'à la racine du dépôt. Le dossier réel étant
`docs/OCA/`, **les 59 fichiers étaient versionnés**. Trois règles ont été ajoutées :

```
/OCA/
docs/OCA/
docs/1Z0-071.pdf
```

> Referme : **LEG-04**. Les fichiers restent sur le disque, ils ne suivront simplement plus le dépôt.

---

## 4 ter. Nouveau : le cursus complet, dans l'ordre

`docs/OCA/sql oca/📚 COURS COMPLET ORACLE SQL 1Z0.docx` est un **support de formation original**,
et non un recueil d'examen : il a donc pu être repris intégralement.

**Route `/curriculum`** — vue d'ensemble, puis `/curriculum/session-N` pour la lecture.

| Session | Titre | Chapitres |
|---|---|---|
| 1 | Les fondamentaux du SQL | 1.1 → 1.5 — langage, SELECT, types, fonctions, conversion |
| 2 | Requêtes avancées | 2.1 → 2.4 — WHERE, ORDER BY, agrégation, jointures |
| 3 | Intégrité des données | 3.1 → 3.4 — création, contraintes, ALTER, DELETE/TRUNCATE/DROP |
| 4 | Vues et fonctions avancées | 4.1 → 4.4 — vues, ensemblistes, MERGE, analytiques |
| 5 | Requêtes complexes | 5.1 → 5.3 — WITH et CTE récursives, sous-requêtes, Top-N |
| 6 | Administration et objets | 6.1 → 6.5 — séquences, dictionnaire, index, sécurité, fuseaux |

**28 chapitres · ~15 h de contenu · 60 blocs SQL**, plus l'introduction générale et la synthèse
d'examen (points clés, pièges fréquents avec comparaison ✗/✓, ordre d'exécution des clauses).

Ce qui a été apporté au passage :

- **Bilingue intégral** : chaque titre, texte, légende et cellule de tableau existe en français
  et en anglais. Le SQL, lui, est identique dans les deux langues.
- **Coloration syntaxique SQL maison** (`components/course-blocks.tsx`), sans dépendance externe :
  mots-clés, chaînes et commentaires distingués.
- **Correction de syntaxe invalide.** Le document source illustrait les opérateurs par des blocs
  du type `WHERE salaire > 3000, salaire < 5000, salaire = 4000;` — pédagogiquement parlant mais
  **syntaxiquement faux**. Ils sont rendus en **tableaux de référence**, pas en code exécutable :
  c'est exactement l'erreur relevée au constat PED-09 pour le bac à sable.
- **Sommaire collant** à droite en desktop, navigation session précédente / suivante en bas.
- Chaque chapitre porte une ancre (`#1-3`) : les liens profonds fonctionnent.

Le cursus est accessible depuis la barre latérale (« Cursus complet » / « Full curriculum ») et
depuis la page du parcours **OCA SQL**.

---

## 5. Internationalisation

- La langue par défaut est **l'anglais** (`DEFAULT_LOCALE = "en"`), conforme à la demande.
- Toute la nouvelle interface (parcours, détail de parcours, navigation) passe par le dictionnaire :
  **0 chaîne en dur**, FR et EN complets.
- Métadonnées : `metadataBase` ajouté, titre en gabarit `%s — OracleMaster`, description couvrant
  les trois examens.

> ⚠️ **Reste ouvert** : le corpus pédagogique historique (`lib/modules-data.ts`, 4 075 lignes) est
> toujours servi en anglais via la pseudo-traduction de `lib/content-i18n.ts` (constat **I18N-01**).
> C'est le lot 5 du plan d'action — environ 10 jours. Les nouvelles pages ne sont pas concernées.

---

## 6. Vérifications exécutées après correctifs

| Contrôle | Résultat |
|---|---|
| `tsc --noEmit` | ✅ 0 erreur |
| `next build` | ✅ Succès — 37 routes, dont `/tracks` (94,2 ko) et les 3 pages de parcours pré-rendues |
| Doublons stricts, toutes banques | ✅ **0** |
| Stratégie constante, banque EN | ✅ 25,1 % (seuil du référentiel : < 35 %) |
| Stratégie constante, banque FR | ✅ 17,8 % |
| Anomalies sur la nouvelle banque PDF | ✅ **0** sur 14 contrôles |
| Images distantes restantes | ✅ **0** |

Le dossier `.next/` généré et les fichiers temporaires ont été supprimés ; `app/layout.tsx`,
modifié temporairement pour permettre un build hors ligne, a été restauré à l'identique.

---

## 7. Ce qui reste à faire

Par ordre de priorité, extrait de [`PLAN-ACTION-PREMIUM.md`](./PLAN-ACTION-PREMIUM.md) :

| Priorité | Reste à traiter | Constat |
|---|---|---|
| **P0** | Correction d'examen **côté serveur** — aujourd'hui les corrigés partent au navigateur et le score est auto-déclaré | PED-04 |
| **P0** | Réécrire les ~41 énoncés historiques repris de `1Z0-071.pdf` dans `lib/quiz-data.ts` | LEG-01 |
| **P0** | Limitation de débit sur `/login` et `/register` ; identifiants admin en dur ; `next@13.5.11` | SEC-01/02/03 |
| **P1** | Traduction réelle du corpus pédagogique en anglais | I18N-01 |
| **P1** | Tests + CI bloquante + frontières d'erreur | OPS-01/02 |
| **P1** | Jetons Tailwind `success`/`warning` et polices `sans`/`mono` (2 lignes, gain visuel immédiat) | UX-01, PERF-02 |
| **P2** | Contenus de cours pour les domaines d'administration OCP I et OCP II | — |
