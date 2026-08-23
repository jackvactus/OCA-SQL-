# Dossier `docs/`

Ce dossier contient **l'audit complet du système** (23 août 2026) et les **documents sources pédagogiques**.

---

## Rapports d'audit

| Document | Contenu | Pour qui |
|---|---|---|
| **[AUDIT-SYSTEME.md](./AUDIT-SYSTEME.md)** | Audit complet : 58 constats classés par gravité, sur 10 domaines. Toutes les mesures sont vérifiées par exécution réelle. | Décideur + technique |
| **[ANALYSE-SOURCES-PEDAGOGIQUES.md](./ANALYSE-SOURCES-PEDAGOGIQUES.md)** | Analyse des 3 documents sources, de leur fiabilité et de leur propagation dans le code. | Contenu + juridique |
| **[REFERENTIEL-QUALITE-PREMIUM.md](./REFERENTIEL-QUALITE-PREMIUM.md)** | Normes applicables (OWASP ASVS 2, WCAG 2.2 AA, RGPD, Core Web Vitals), seuils chiffrés, *Definition of Done*. | Équipe + recette |
| **[PLAN-ACTION-PREMIUM.md](./PLAN-ACTION-PREMIUM.md)** | Feuille de route en 6 lots (62 j), correctifs prêts à appliquer, jalons opposables. | Pilotage |

**Ordre de lecture conseillé :** `AUDIT-SYSTEME.md` §1 (synthèse) → `PLAN-ACTION-PREMIUM.md` (lot 0) → le reste selon le rôle.


### Audits antérieurs (conservés)

| Document | Date |
|---|---|
| [1z0-071-exam-blueprint.md](./1z0-071-exam-blueprint.md) | 20 août 2026 |
| [1z0-071-pdf-audit.md](./1z0-071-pdf-audit.md) | 20 août 2026 |
| [1z0-071-pdf-pair-audit.md](./1z0-071-pdf-pair-audit.md) | 20 août 2026 |

---

## Les 5 constats à retenir

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
