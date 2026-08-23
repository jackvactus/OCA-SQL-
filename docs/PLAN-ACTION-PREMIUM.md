# Plan d'action « plateforme premium »

**Date :** 23 août 2026
**Base :** [`AUDIT-SYSTEME.md`](./AUDIT-SYSTEME.md) · [`ANALYSE-SOURCES-PEDAGOGIQUES.md`](./ANALYSE-SOURCES-PEDAGOGIQUES.md) · [`REFERENTIEL-QUALITE-PREMIUM.md`](./REFERENTIEL-QUALITE-PREMIUM.md)

**Charge totale estimée : 62 jours-personne**, répartis en 6 lots livrables indépendamment.
Après le **lot 0** (2,5 j), les 6 défauts les plus graves sont éliminés. Après le **lot 2** (18 j cumulés), le produit est commercialisable.

---

## Vue d'ensemble

| Lot | Intitulé | Charge | Cumul | Conformité atteinte |
|---|---|---|---|---|
| **0** | Correctifs immédiats | 2,5 j | 2,5 j | 8 % → 25 % |
| **1** | Sécurité et conformité | 9 j | 11,5 j | → 48 % |
| **2** | Intégrité pédagogique | 15 j | 26,5 j | → 68 % |
| **3** | Qualité, tests, exploitation | 12 j | 38,5 j | → 80 % |
| **4** | Performance, design, accessibilité | 10 j | 48,5 j | → 88 % |
| **5** | Internationalisation réelle | 10 j | 58,5 j | → 93 % |
| **6** | Différenciation premium | 14 j | 72,5 j | → 96 % |

> Les lots 0 à 2 sont séquentiels. Les lots 3 à 6 peuvent être menés en parallèle par deux personnes.

---

## Lot 0 — Correctifs immédiats (2,5 j)

Six correctifs à fort impact, à risque quasi nul. **À appliquer avant toute autre chose.**

### 0.1 — Permuter les options à l'exécution *(0,5 j — annule PED-01 et PED-03)*

C'est la correction la plus rentable du plan : elle neutralise à elle seule le biais de 94,4 % de la banque anglaise, sans toucher aux données.

Créer `lib/quiz-shuffle.ts` :

```ts
import type { QuizQuestion } from "@/lib/types";

/** Permute les options d'une question et réindexe les bonnes réponses. */
export function shuffleOptions(q: QuizQuestion): QuizQuestion {
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correctIndexes: q.correctIndexes
      .map((c) => order.indexOf(c))
      .sort((a, b) => a - b),
  };
}
```

Puis l'appliquer au tirage :

```ts
// app/(app)/quiz/page.tsx — startQuiz()
const filtered = shuffle(questionBank.filter(…)).map(shuffleOptions);

// app/(app)/exam/page.tsx — startExam()
const selected = shuffle(questionBank).slice(0, count).map(shuffleOptions);
```

> ⚠️ Les composants doivent lire `current.options` et `current.correctIndexes` depuis l'objet **permuté** stocké dans l'état, jamais depuis la banque d'origine.

**Effet mesurable :** stratégie « toujours A » 94,4 % → ~25 %.

### 0.2 — Retirer `LIMIT` du bac à sable *(0,25 j — annule PED-09)*

`app/(app)/sandbox/page.tsx` :

1. Ligne 181 — remplacer l'exemple :
   ```diff
   - "SELECT first_name, last_name, hire_date FROM employees ORDER BY hire_date DESC LIMIT 5"
   + "SELECT first_name, last_name, hire_date FROM employees ORDER BY hire_date DESC FETCH FIRST 5 ROWS ONLY"
   ```
2. Ligne 213 — retirer `"LIMIT"` de `KEYWORDS`.
3. Lignes 437-441 — remplacer la branche `LIMIT` de l'analyseur par une erreur pédagogique :
   ```ts
   throw new Error(
     "LIMIT n'existe pas en Oracle SQL (syntaxe MySQL/PostgreSQL). " +
     "Utilisez : FETCH FIRST n ROWS ONLY."
   );
   ```

Le message devient lui-même un point d'apprentissage — c'est exactement le piège que teste l'examen.

### 0.3 — Rétablir les jetons de couleur et les polices *(0,25 j — annule UX-01 et PERF-02)*

`tailwind.config.ts` :

```ts
import defaultTheme from 'tailwindcss/defaultTheme';
// …
fontFamily: {
  sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
  mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
  display: ['var(--font-display)', 'serif'],
},
colors: {
  // … existant …
  success: { DEFAULT: 'hsl(var(--success))', foreground: 'hsl(var(--success-foreground))' },
  warning: { DEFAULT: 'hsl(var(--warning))', foreground: 'hsl(var(--warning-foreground))' },
},
```

Retirer aussi de `app/globals.css` la règle inopérante `code { font-family: "JetBrains Mono", … }` : `font-mono` suffit une fois le jeton déclaré.

**Effet :** 19 classes de couleur redeviennent fonctionnelles, et les deux polices déjà téléchargées sont enfin appliquées — gain visuel immédiat, coût nul.

### 0.4 — Neutraliser les identifiants admin en dur *(0,5 j — annule SEC-02)*

`scripts/seed-admin.ts` :

```ts
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Administrateur";

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env");
}
if (ADMIN_PASSWORD.length < 12) {
  throw new Error("ADMIN_PASSWORD doit contenir au moins 12 caractères");
}
```

Et cesser de réécrire silencieusement un compte existant : ne mettre à jour le mot de passe que si `--force` est passé explicitement.

**Puis, impérativement :** changer le mot de passe du compte administrateur historique s'il existe déjà en base.

### 0.5 — Réduire les vulnérabilités *(0,5 j — atténue SEC-01)*

```bash
npm i next@13.5.11        # correctif de la CVE CVSS 9.1, sans rupture majeure
npm audit fix             # paquets transitifs
npm audit                 # doit afficher 0 critique
```

Vérifier ensuite `npm run build` et `npm run typecheck`. La migration vers Next.js 15 est planifiée au lot 3.

### 0.6 — Aligner l'annonce marketing sur la réalité *(0,5 j — annule PED-02 côté communication)*

`app/(marketing)/page.tsx` et `app/(auth)/layout.tsx` affichent `${questionCount}+` sur la base de `bank.length`. Compter les questions **uniques** :

```ts
const uniqueCount = new Set(questionBank.map((q) => q.question.trim().toLowerCase())).size;
```

L'affichage passe de « 320+ » à « 224+ » pour l'anglais — jusqu'à ce que le lot 2 le ramène honnêtement à 320.

**Livrable du lot 0 :** examen blanc non triché, aucune syntaxe erronée enseignée, design conforme à son intention, aucun secret dans le dépôt, 0 vulnérabilité critique, communication exacte.

---

## Lot 1 — Sécurité et conformité (9 j)

| # | Tâche | Réf. | Charge |
|---|---|---|---|
| 1.1 | Limitation de débit sur `/login` et `/register` (5 échecs / 15 min par IP **et** par e-mail), verrouillage progressif | SEC-03 | 1,5 j |
| 1.2 | En-têtes de sécurité via `headers()` dans `next.config.js` (CSP, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`) | SEC-04 | 1 j |
| 1.3 | Parcours complet de réinitialisation de mot de passe (jeton à usage unique, 30 min, e-mail transactionnel) | SEC-06 | 2 j |
| 1.4 | Renforcement des mots de passe : bcrypt cost 12, contrôle HIBP, validation de `SESSION_SECRET` au démarrage | SEC-07, SEC-10 | 1 j |
| 1.5 | Pages légales : confidentialité, CGU, mentions légales — **publiques** (à ajouter à `PUBLIC_ONLY_PATHS`) | LEG-03 | 1 j |
| 1.6 | RGPD : purge d'`activity_log` (12 mois), anonymisation de l'IP à 30 j, suppression et export de compte en libre-service | LEG-02, LEG-03 | 2 j |
| 1.7 | Robustesse d'API : validation Zod partout, UUID validés (404 au lieu de 500), échappement `ILIKE`, cache + limitation sur `/api/public/stats` | SEC-11 à SEC-14 | 0,5 j |

**Exemple pour 1.7 — validation d'UUID :**

```ts
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
if (!UUID.test(params.id)) notFound();       // page
if (!UUID.test(params.id)) return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });  // API
```

**Exemple pour 1.7 — échappement des jokers :**

```ts
const escaped = search.replace(/[\\%_]/g, (c) => "\\" + c);
// … where u.email ilike '%' || $1 || '%' escape '\'
```

---

## Lot 2 — Intégrité pédagogique (15 j)

C'est le lot qui transforme le produit. **Sans lui, la plateforme mesure du bruit.**

### 2.1 — Correction côté serveur *(4 j — annule PED-04)*

Modèle cible :

```
POST /api/exam/start
  → le serveur tire les questions, les stocke en base (exam_sessions),
    renvoie les énoncés SANS correctIndexes ni explanation
POST /api/exam/{id}/submit  { answers: Record<questionId, number[]> }
  → le serveur corrige, vérifie le temps écoulé, enregistre, renvoie le corrigé
```

Nouvelle table :

```sql
create table if not exists exam_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  question_ids jsonb not null,
  option_orders jsonb not null,        -- permutation appliquée, pour recorriger
  started_at timestamptz not null default now(),
  duration_seconds integer not null,
  submitted_at timestamptz,
  score integer,
  total integer
);
create index if not exists exam_sessions_user_idx on exam_sessions(user_id, started_at desc);
```

Effet dérivé : les corrigés quittent le bundle client, ce qui règle aussi une grande partie de PERF-01.

### 2.2 — Assainissement des banques *(6 j — annule PED-02, PED-05, PED-06, PED-07, PED-11, LEG-01)*

| Étape | Action | Charge |
|---|---|---|
| a | Supprimer les 96 doublons anglais et les 3 doublons français | 1 j |
| b | Rééquilibrer les positions de bonne réponse (script de permutation + relecture) | 1 j |
| c | Réécrire les ~41 énoncés issus de `1Z0-071.pdf` | 2 j |
| d | Traduire (ou déplacer) les 64 questions anglaises de la banque française | 1,5 j |
| e | Corriger `q165` (options identiques à la casse près) | 0,25 j |
| f | Ajouter les champs `source` et `reviewedAt` au type `QuizQuestion` | 0,25 j |

### 2.3 — Reconstitution du volume *(4 j — annule PED-07, PED-10)*

- **+96 questions anglaises originales**, dont **≥ 60 à réponses multiples**, pour revenir à 320 réelles.
- **+30 questions** pour les modules m17 (9 → 20) et m18 (7 → 20).
- Chaque nouvelle question : explication ≥ 80 caractères, `source: "original"`.

### 2.4 — Porte de qualité automatique *(1 j — prévention durable)*

`scripts/validate-questions.ts`, exécuté par la CI et bloquant :

```ts
// Contrôles appliqués aux deux banques (seuils : REFERENTIEL-QUALITE-PREMIUM.md §3.1)
// 1. aucun doublon exact (énoncé + options)
// 2. chaque position de bonne réponse ∈ [20 % ; 30 %]
// 3. score d'une stratégie constante < 35 %
// 4. ≥ 25 % de questions à réponses multiples
// 5. explication ≥ 80 caractères
// 6. une seule langue par banque
// 7. ≥ 20 questions par module
// 8. index de bonne réponse dans les bornes
// 9. options distinctes au sein d'une question
// 10. cohérence « Choose N » ↔ nombre de bonnes réponses
// 11. champ `source` renseigné
```

> **C'est la mesure la plus structurante du plan.** Elle rend impossible la réintroduction de l'ensemble des défauts PED-01 à PED-12, quel que soit le contributeur.

---

## Lot 3 — Qualité, tests et exploitation (12 j)

| # | Tâche | Réf. | Charge |
|---|---|---|---|
| 3.1 | Vitest + tests unitaires sur `lib/` : `auth/*`, `progress-types`, `validation`, correction, analyseur SQL du bac à sable — cible ≥ 80 % | OPS-01 | 4 j |
| 3.2 | Playwright : inscription → connexion → leçon → quiz → examen → admin | OPS-01 | 3 j |
| 3.3 | GitHub Actions bloquant : `typecheck` + `lint` + `test` + `build` + `audit` + validation des banques | OPS-01 | 1 j |
| 3.4 | `error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx` | OPS-02 | 1 j |
| 3.5 | Suivi d'erreurs (Sentry), journalisation structurée, `/api/health` | OPS-03 | 1,5 j |
| 3.6 | Migrations versionnées avec table de suivi et retour arrière | OPS-04 | 1 j |
| 3.7 | README opérationnel + `.env.example` documenté ; retrait de `eslint.ignoreDuringBuilds` ; correction des 8 avertissements `exhaustive-deps` | OPS-05, OPS-06, SEC-08 | 0,5 j |

---

## Lot 4 — Performance, design et accessibilité (10 j)

| # | Tâche | Réf. | Charge |
|---|---|---|---|
| 4.1 | Auto-héberger les 3 polices via `next/font/local` — supprime la dépendance réseau au build | PERF-02, PERF-04 | 0,5 j |
| 4.2 | Remplacer les 5 images Unsplash par des visuels locaux optimisés ; retirer `images.unoptimized` | PERF-03 | 1 j |
| 4.3 | Sortir le corpus pédagogique des bundles client (route handlers + `dynamic()`), viser ≤ 170 Ko partout | PERF-01 | 3 j |
| 4.4 | Accessibilité : nom accessible sur `<textarea>` SQL et boutons icône, contrastes conformes, lien d'évitement, `aria-live` sur quiz/examen/bac à sable, `enableSystem` | UX-02 à UX-06 | 2,5 j |
| 4.5 | Métadonnées par page, `metadataBase`, `opengraph-image`, `robots.ts`, `sitemap.ts`, `manifest.ts`, `hreflang` | SEO-01 à SEO-04 | 1,5 j |
| 4.6 | Pagination de `/admin/users`, correction de `updateUser()`, cache des agrégats admin | PERF-05 à PERF-07 | 1 j |
| 4.7 | `axe-core` + budget de bundle intégrés à la CI | — | 0,5 j |

**Note sur 4.2 :** l'auto-hébergement des images n'est pas un simple gain de performance — c'est un **prérequis de la CSP** (lot 1.2) et de la conformité RGPD (lot 1.6).

---

## Lot 5 — Internationalisation réelle (10 j)

| # | Tâche | Réf. | Charge |
|---|---|---|---|
| 5.1 | **Supprimer `lib/content-i18n.ts`.** Externaliser le contenu par locale : `lib/content/fr/modules.ts`, `lib/content/en/modules.ts` | I18N-01 | 1 j |
| 5.2 | Traduire réellement les 18 modules, 31 leçons, 85 flashcards, 34 exercices et le glossaire | I18N-01 | 6 j |
| 5.3 | Unifier le mécanisme : tout passe par le dictionnaire, suppression des ternaires `en ? :` et des chaînes en dur — en commençant par `/sandbox` (0 appel à `useLanguage`) et `/flashcards` | I18N-03 | 2 j |
| 5.4 | Traduire `ACTIVITY_ACTION_LABELS` et `describeMetadata()` | I18N-04 | 0,5 j |
| 5.5 | Règle ESLint interdisant les littéraux affichés hors dictionnaire | I18N-03 | 0,5 j |

> **Décision à prendre avant de démarrer ce lot.** Si la cible commerciale est francophone, il est plus rationnel de basculer `DEFAULT_LOCALE` sur `"fr"` (0,25 j) et de reporter la traduction anglaise. Traduire 4 000 lignes coûte 6 jours : cela ne se justifie que si le marché anglophone est visé. **Dans tous les cas, la pseudo-traduction actuelle doit disparaître** — livrer un cours français sous un drapeau anglais est pire que ne pas proposer l'anglais.

---

## Lot 6 — Différenciation premium (14 j)

Fonctionnalités qui distinguent réellement le produit une fois les fondations saines.

| # | Fonctionnalité | Valeur | Charge |
|---|---|---|---|
| 6.1 | **Score par domaine** à l'issue de l'examen, avec plan de révision ciblé | Promesse déjà faite sur la page d'accueil, non tenue | 2 j |
| 6.2 | **Bac à sable complet** : `JOIN`, `GROUP BY`, agrégats, sous-requêtes — via Oracle XE en conteneur ou un moteur SQL embarqué avec dialecte Oracle | Débloque 60 % du programme (PED-08) | 5 j |
| 6.3 | **Répétition espacée pilotée par les erreurs** : réinjecter automatiquement en flashcards les notions ratées au quiz | Boucle d'apprentissage fermée | 2 j |
| 6.4 | **Mode révision d'erreurs** : rejouer uniquement les questions manquées | Le plus demandé sur ce type de produit | 1 j |
| 6.5 | **Tableau de bord formateur** : cohortes, export CSV, alertes de décrochage | Ouvre le marché B2B | 3 j |
| 6.6 | **Activer les fonctions dormantes** : `study_time` et `bookmarks` existent en base et en API mais ne sont jamais appelées | Code déjà écrit, il ne manque que l'interface (OPS-08) | 1 j |

---

## Ordonnancement recommandé

```
Semaine 1     ██ Lot 0 (2,5 j)  ────────────► produit honnête et sûr
Semaines 1-3  ████████ Lot 1 (9 j)  ────────► conforme sécurité + RGPD
Semaines 3-6  ██████████████ Lot 2 (15 j) ──► COMMERCIALISABLE
Semaines 6-9  ████████████ Lot 3 (12 j)  ───► industrialisé          ┐ en
Semaines 6-9  ██████████ Lot 4 (10 j)  ─────► premium perçu          ┘ parallèle
Semaines 9-11 ██████████ Lot 5 (10 j)  ─────► bilingue réel
Semaines 11-14 ██████████████ Lot 6 (14 j) ─► différenciant
```

**Jalons opposables**

| Jalon | Condition de franchissement |
|---|---|
| **J1 — Honnêteté** (fin lot 0) | Stratégie constante < 35 % · 0 vulnérabilité critique · 0 secret au dépôt · 0 syntaxe non-Oracle |
| **J2 — Conformité** (fin lot 1) | Limitation de débit active · en-têtes de sécurité complets · pages légales publiées · purge RGPD opérationnelle |
| **J3 — Commercialisable** (fin lot 2) | Correction côté serveur · 0 doublon · 0 énoncé emprunté · porte de qualité en CI |
| **J4 — Industrialisé** (fin lots 3-4) | Couverture ≥ 80 % · CI bloquante · budgets de performance tenus · 0 violation axe *critical* |
| **J5 — Premium** (fin lots 5-6) | Bilingue réel · bac à sable complet · score par domaine · tableau de bord formateur |

---

## Ce que je peux prendre en charge directement

Par ordre de rentabilité, tout est prêt à être exécuté sur demande :

| # | Livrable | Charge | Impact |
|---|---|---|---|
| 1 | **Lot 0 intégral** — les 6 correctifs ci-dessus, appliqués et vérifiés (`typecheck`, `lint`, `build`) | 2,5 j | Le plus fort rapport valeur/effort de tout le plan |
| 2 | **`scripts/validate-questions.ts`** + intégration CI — la porte de qualité du §2.4 | 1 j | Empêche définitivement le retour de PED-01 à PED-12 |
| 3 | **Script d'assainissement des banques** : détection et suppression des doublons, rééquilibrage des positions, rapport avant/après | 1,5 j | 96 doublons + biais de position traités automatiquement |
| 4 | **Correction d'examen côté serveur** (§2.1) : table `exam_sessions`, routes `start` / `submit`, adaptation du client | 4 j | Rend les statistiques enfin fiables |
| 5 | **Socle de tests** : Vitest + Playwright + GitHub Actions bloquant | 4 j | Passe de 0 % à ~80 % de couverture sur `lib/` |
| 6 | **En-têtes de sécurité, limitation de débit, validation d'UUID, échappement `ILIKE`** | 2 j | Ferme SEC-03, SEC-04, SEC-12, SEC-13, SEC-14 |
| 7 | **Accessibilité et design system** : jetons de couleur, polices, contrastes, noms accessibles, `aria-live` | 2,5 j | Rend visible le soin déjà investi dans l'interface |
| 8 | **Réécriture des ~41 énoncés empruntés** en questions originales équivalentes | 2 j | Ferme le risque juridique LEG-01 |
| 9 | **Métadonnées, `robots.ts`, `sitemap.ts`, `manifest.ts`, image Open Graph** | 1,5 j | Rend le produit partageable et indexable |
| 10 | **README opérationnel et `.env.example` documenté** | 0,5 j | Rend le projet reprenable par un tiers |

**Recommandation :** commencer par le **lot 0** puis les livrables **2 et 3**. En 5 jours, les six défauts les plus graves disparaissent et **ne peuvent plus revenir** — c'est le meilleur point d'entrée du plan.
