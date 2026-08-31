# Dossier `docs/`

Ce dossier contient les **audits du système** et les **documents sources pédagogiques**.

Dernier audit en date : **[AUDIT-2026-08-31-C.md](./AUDIT-2026-08-31-C.md)** — banque anglaise
1Z0-071 reconstruite, doublons reformulés et rattachements de module corrigés, liens Oracle
assainis, 45 tests.

---

## Rapports d'audit

| Document | Contenu | Pour qui |
|---|---|---|
| **[AUDIT-SYSTEME.md](./AUDIT-SYSTEME.md)** | Audit complet : 58 constats classés par gravité, sur 10 domaines. Toutes les mesures sont vérifiées par exécution réelle. | Décideur + technique |
| **[ANALYSE-SOURCES-PEDAGOGIQUES.md](./ANALYSE-SOURCES-PEDAGOGIQUES.md)** | Analyse des 3 documents sources, de leur fiabilité et de leur propagation dans le code. | Contenu + juridique |
| **[REFERENTIEL-QUALITE-PREMIUM.md](./REFERENTIEL-QUALITE-PREMIUM.md)** | Normes applicables (OWASP ASVS 2, WCAG 2.2 AA, RGPD, Core Web Vitals), seuils chiffrés, *Definition of Done*. | Équipe + recette |
| **[PLAN-ACTION-PREMIUM.md](./PLAN-ACTION-PREMIUM.md)** | Feuille de route en 6 lots (62 j), correctifs prêts à appliquer, jalons opposables. | Pilotage |
| **[AUDIT-2026-08-30.md](./AUDIT-2026-08-30.md)** | Audit d'extension : 6 parcours, 45 sessions, 824 questions, 172 objectifs officiels. Trois erreurs de nomenclature corrigées. | Décideur + technique |
| **[AUDIT-2026-08-31.md](./AUDIT-2026-08-31.md)** | Intégration des six programmes officiels : 133 domaines, 455 objectifs, 57 sessions, 885 questions, 85 TP, 10 schémas. | Décideur + technique |
| **[AUDIT-2026-08-31-B.md](./AUDIT-2026-08-31-B.md)** | Analyse système : CVE critique du middleware, notation d'examen serveur, limitation de débit, tests et CI, 4 défauts de données corrigés. | Décideur + technique |
| **[AUDIT-2026-08-31-C.md](./AUDIT-2026-08-31-C.md)** | Banque anglaise reconstruite (67 doublons reformulés, 137 rattachements de module faux), 5 doublons français retirés, biais de position corrigé, liens Oracle assainis. | Contenu + technique |

**Ordre de lecture conseillé :** `AUDIT-2026-08-31-C.md` (état actuel) → `AUDIT-SYSTEME.md` §1 (synthèse d'origine) → `PLAN-ACTION-PREMIUM.md` (lot 0) → le reste selon le rôle.


### Audits antérieurs (conservés)

| Document | Date |
|---|---|
| [1z0-071-exam-blueprint.md](./1z0-071-exam-blueprint.md) | 20 août 2026 |
| [1z0-071-pdf-audit.md](./1z0-071-pdf-audit.md) | 20 août 2026 |
| [1z0-071-pdf-pair-audit.md](./1z0-071-pdf-pair-audit.md) | 20 août 2026 |
| [CORRECTIFS-APPLIQUES.md](./CORRECTIFS-APPLIQUES.md) | 24 août 2026 |
| [AUDIT-2026-08-25.md](./AUDIT-2026-08-25.md) | 25 août 2026 |

---

## Périmètre couvert au 30 août 2026

| Code | Certification | Sessions | Questions FR / EN |
|---|---|---|---|
| 1Z0-071 | Oracle Database SQL Certified Associate | 6 | 306 / 224 |
| 1Z0-082 | Administration I — ODBA 2019 Certified Professional | 6 | 88 / 88 |
| 1Z0-083 | Administration II — ODBA 2019 Certified Professional | 9 | 72 / 72 |
| 1Z0-084 | Performance Management and Tuning | 13 | 71 / 71 |
| 1Z0-076 | Data Guard Administration | 11 | 59 / 59 |
| 1Z0-078 | RAC, ASM and Grid Infrastructure | 12 | 65 / 65 |

**57 sessions · 173 chapitres · 520 blocs · 10 schémas · 85 travaux pratiques (37,8 h) · 885 questions · 133 domaines d'examen officiels · 455 objectifs détaillés.**

---

## Les 5 constats d'origine (23 août)

1. **L'examen blanc anglais se réussit sans connaissance.** La bonne réponse est l'option A dans **302 questions sur 320 (94,4 %)**, les options ne sont jamais permutées, le seuil de réussite est 63 %.
2. **La banque anglaise annonce 320 questions, en contient 224.** 96 doublons exacts.
3. **Tous les corrigés sont livrés au navigateur** et le score est calculé côté client : XP, examens et statistiques admin sont falsifiables.
4. **La version anglaise du cours est une pseudo-traduction** (40 rechercher/remplacer sur 4 075 lignes de français) — et l'anglais est la langue **par défaut**.
5. **Environ 41 énoncés proviennent d'un document d'*exam dump*** présent dans ce dossier — risque juridique pour l'éditeur **et** pour les apprenants.

Le point commun de ces cinq constats : ce sont des défauts de **finition et de contenu**, pas d'architecture. Ils se corrigent par ajouts, sans réécriture.

---

## Documents sources

| Fichier | Nature | Statut |
|---|---|---|
| `1Z0-071.pdf` | Recueil de type *exam dump* — 39 p., ~86 questions, **sans réponses** | 🔴 **À sortir du dépôt** — voir LEG-01 |
| `1Z0-071_COMPLETE_MASTER_EXAM_PREP_320_QUESTIONS_2026.docx` | Workbook original — 16 domaines, 320 questions annoncées (**224 uniques**) | 🟠 Base exploitable après assainissement |
| `réponses docx.pdf` | Corrigé français — 70 entrées numérotées de 1 à 194 | 🟠 Fragment orphelin, sans questionnaire correspondant |

> ⚠️ `.gitignore` exclut `/OCA/` avec la mention « *local exam source PDFs/DOCX (not published)* » — mais **pas `docs/`**. Les trois documents ci-dessus sont donc versionnés et suivront toute publication du dépôt.

---

## Traçabilité de l'audit

| Contrôle exécuté | Résultat |
|---|---|
| `tsc --noEmit` | ✅ 0 erreur |
| `next lint` | ⚠️ 8 avertissements `exhaustive-deps` |
| `next build` | ❌ échec hors ligne (Google Fonts) — ✅ succès après neutralisation temporaire |
| `npm audit` | ❌ 18 vulnérabilités : 1 critique (CVSS 9.1), 13 hautes, 4 modérées |
| Compilation Tailwind isolée | ❌ `text-success` / `bg-success` / `text-warning` → 0 règle générée |
| Analyse statistique des 558 questions | ❌ biais de position, doublons, corrigés exposés |
| Extraction et analyse des 3 documents sources | ❌ sources incohérentes entre elles |

Aucune modification n'a été laissée dans le dépôt : `app/layout.tsx`, temporairement modifié pour valider le build hors ligne, a été restauré à l'identique, et le dossier `.next/` généré a été supprimé.
