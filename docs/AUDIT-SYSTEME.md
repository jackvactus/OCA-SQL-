# Audit complet du système — OracleMaster (préparation 1Z0-071)

| | |
|---|---|
| **Périmètre** | Application Next.js 13 (App Router) complète : 34 routes, 18 routes d'API, base PostgreSQL, contenu pédagogique, documents sources `docs/` |
| **Date de l'audit** | 23 août 2026 |
| **Volume analysé** | 29 592 lignes (`app/`, `components/`, `lib/`, `hooks/`, `scripts/`, `db/`) + 3 documents sources |
| **Méthode** | Lecture exhaustive du code, exécution réelle de `tsc --noEmit`, `next lint`, `next build`, `npm audit`, compilation Tailwind, analyse statistique programmatique des banques de questions, extraction et analyse des PDF/DOCX |
| **Verdict global** | **Fondations saines, mais 12 défauts bloquants pour une mise en production « premium »** |

---

## 1. Synthèse pour décideur

L'architecture est **meilleure que la moyenne** pour un projet issu d'un générateur : séparation serveur/client propre, requêtes SQL systématiquement paramétrées, double vérification des droits admin (JWT *et* base), protection contre l'*open redirect*, verrou de ligne sur les mises à jour de progression, anti-*timing attack* sur le login. Le typage passe sans une seule erreur.

Le problème n'est pas la structure : **c'est que le produit ne tient pas ses promesses**.

Cinq constats mesurés, vérifiés, reproductibles :

1. **L'examen blanc anglais est réussi sans aucune connaissance.** Dans la banque anglaise, la bonne réponse est l'option **A dans 302 questions sur 320 (94,4 %)**. Les options ne sont jamais permutées. Le seuil de réussite affiché est 63 %. Stratégie « cocher A partout » → **94,4 %**.
2. **La banque anglaise annonce 320 questions, en contient 224.** 96 sont des doublons *exacts* (énoncé + options identiques).
3. **Toutes les bonnes réponses sont livrées au navigateur** (558 questions avec `correctIndexes` et `explanation`), le score est calculé côté client puis envoyé au serveur sans vérification. XP, historiques d'examens et statistiques du back-office sont falsifiables par une simple requête HTTP.
4. **La version anglaise du cours est un faux.** `lib/content-i18n.ts` applique 40 rechercher/remplacer à un corpus français de 4 075 lignes. Or `DEFAULT_LOCALE = "en"` : **l'expérience par défaut est la plus dégradée**.
5. **Risque juridique réel.** `docs/1Z0-071.pdf` est un document de type *exam dump* (en-tête « Vendor: Oracle — Exam Code: 1Z0-071 »). Environ 41 de ses énoncés sont repris quasi mot pour mot dans `lib/quiz-data.ts`.

S'y ajoutent 18 vulnérabilités de dépendances (dont une critique CVSS 9.1), aucune limitation de débit sur l'authentification, aucun test, aucune CI, aucune frontière d'erreur, et deux polices Google téléchargées à chaque page mais **jamais appliquées**.

**Aucun de ces points n'est un défaut d'architecture.** Ce sont des défauts de finition et de contenu — donc corrigeables sans réécriture.

### Tableau de bord

| Domaine | Note | Constat dominant |
|---|---|---|
| Architecture & typage | ⬤⬤⬤⬤◯ | Propre, cohérente, `tsc` sans erreur |
| Sécurité applicative | ⬤⬤◯◯◯ | Bonnes bases, mais 0 rate-limit, 0 en-tête de sécurité, secrets en dur |
| Dépendances | ⬤◯◯◯◯ | 18 vulnérabilités, 1 critique (CVSS 9.1) |
| Intégrité pédagogique | ⬤◯◯◯◯ | Biais de réponse à 94 %, 30 % de doublons, correction côté client |
| Internationalisation | ⬤◯◯◯◯ | Pseudo-traduction, 3 mécanismes concurrents, écrans mixtes FR/EN |
| Performance front | ⬤⬤◯◯◯ | 273 Ko sur `/dashboard`, polices inutilisées, images non optimisées |
| Design system | ⬤⬤◯◯◯ | 19 classes de couleur qui ne génèrent aucun CSS |
| Accessibilité | ⬤⬤◯◯◯ | Contrastes hors norme, noms accessibles manquants |
| Fiabilité & exploitation | ⬤◯◯◯◯ | 0 test, 0 CI, 0 frontière d'erreur, 0 supervision |
| Conformité / juridique | ⬤◯◯◯◯ | Contenu d'*exam dump*, RGPD non traité |

### Répartition des 58 constats

| Gravité | Nombre | Signification |
|---|---|---|
| **S1 — Critique** | 12 | Bloque une mise en production sérieuse |
| **S2 — Majeur** | 24 | Écart net avec une attente « premium » |
| **S3 — Modéré** | 17 | Dette technique à traiter |
| **S4 — Mineur** | 5 | Nettoyage |

---

## 2. Ce que l'audit a exécuté (traçabilité)

| Contrôle | Résultat |
|---|---|
| `tsc --noEmit` | ✅ **0 erreur** |
| `next lint` | ⚠️ 8 avertissements `react-hooks/exhaustive-deps` |
| `next build` | ❌ **Échec** : dépendance réseau à `fonts.googleapis.com`. ✅ Succès après neutralisation temporaire des polices (fichier restauré à l'identique) |
| `npm audit` | ❌ **18 vulnérabilités** — 1 critique, 13 hautes, 4 modérées |
| Compilation Tailwind isolée | ❌ `.text-success`, `.bg-success`, `.text-warning` → **0 règle générée** |
| Analyse statistique des banques | ❌ Biais de position 94,4 % (EN) / 61 % (FR), 96 doublons exacts |
| Extraction `docs/*.pdf` + `.docx` | ❌ Sources incohérentes entre elles, contenu d'*exam dump* |

> Le build a été relancé après restauration de `app/layout.tsx` : **aucune modification n'a été laissée dans le dépôt.** Le dossier `.next/` généré a été supprimé.

---

## 3. Sécurité applicative

### 3.1 Ce qui est déjà bien fait — à préserver

Ces choix sont corrects et ne doivent pas être défaits lors des corrections :

- **Toutes** les requêtes SQL sont paramétrées (`$1`, `$2`…). Aucune concaténation de valeur utilisateur détectée.
- `lib/auth/password.ts` compare contre un `DUMMY_PASSWORD_HASH` quand l'e-mail est inconnu → le temps de réponse ne révèle pas si un compte existe.
- `lib/auth/session.ts:requireAdmin()` **relit le rôle et le statut actif en base** au lieu de faire confiance à la revendication du JWT → un admin rétrogradé perd ses droits immédiatement, même avec un cookie encore valide.
- Cookie `httpOnly` + `sameSite: lax` + `secure` en production.
- `lib/utils.ts:sanitizeRedirectPath()` bloque `//`, `://` et les chemins non relatifs → pas d'*open redirect* via `?next=`.
- `app/api/admin/users/[id]/route.ts` refuse qu'un admin modifie son propre rôle → pas d'auto-verrouillage.
- `app/api/auth/register/route.ts` s'appuie sur la contrainte d'unicité (code `23505`) au lieu d'un « vérifier puis insérer » → pas de fenêtre de concurrence.
- Les identifiants de leçon, de flashcard et de quiz envoyés par le client sont **validés contre les jeux de données réels** avant écriture.

### 3.2 Constats

#### SEC-01 — S1 — 18 vulnérabilités de dépendances, dont un contournement d'autorisation CVSS 9.1

`next@13.5.1` cumule à lui seul 31 avis de sécurité, dont **GHSA-f82v-jwr5-mffw — « Authorization Bypass in Next.js Middleware », CVSS 9.1 (critique)**. Cette faille permet de contourner un `middleware.ts` d'authentification via un en-tête HTTP forgé.

**Atténuation présente :** ce projet ne s'appuie pas *uniquement* sur le middleware. `app/(app)/layout.tsx` rappelle `getSessionUser()`, chaque page admin appelle `requireAdmin()`, et chaque route d'API vérifie la session. La défense en profondeur limite fortement l'impact réel — c'est un bon réflexe d'architecture, à saluer.

**Reste que** 13 autres vulnérabilités hautes s'appliquent (SSRF via Server Actions, empoisonnement de cache, XSS avec nonce CSP, DoS multiples), et que `postcss` et `zod` sont eux aussi vulnérables via l'arbre de `next`.

Autres paquets touchés : `lodash` (injection de code CVSS 8.1), `brace-expansion`, `minimatch`, `cross-spawn`, `flatted`, `js-yaml`, `nanoid`, `picomatch`, `ws`, `yaml`, `ajv`, `@babel/runtime`.

**Correction** — en deux temps :
1. Immédiat, sans rupture : `next@13.5.11` (`npm audit fix --force` le propose, `isSemVerMajor: false`) + `npm audit fix` pour les paquets transitifs.
2. Planifié : migration vers Next.js 15 (voir `PLAN-ACTION-PREMIUM.md`, lot 4).

#### SEC-02 — S1 — Identifiants administrateur en clair dans le dépôt

`scripts/seed-admin.ts` contient :

```ts
const ADMIN_EMAIL = "«redacted»";
const ADMIN_PASSWORD = "«redacted»";   // 7 caracteres, en clair
```

Trois problèmes cumulés :
- Le mot de passe fait **7 caractères**, soit moins que le minimum de 8 que l'application impose à ses propres utilisateurs (`lib/validation/auth.ts`).
- Il est **versionné**, donc connu de quiconque obtient le dépôt.
- Le script est **idempotent et re-promeut** : `on conflict (email) do update set role = 'admin', is_active = true`. Un compte désactivé par précaution redevient admin actif au prochain `npm run db:seed-admin`.

**Correction :** lire l'e-mail et le mot de passe depuis l'environnement, refuser un mot de passe faible, et — si le compte existe déjà — ne jamais réécrire le mot de passe silencieusement.

#### SEC-03 — S1 — Aucune limitation de débit sur l'authentification

`POST /api/auth/login` et `POST /api/auth/register` acceptent un nombre illimité de tentatives. Il n'existe ni compteur d'échecs, ni verrouillage temporaire, ni CAPTCHA, ni délai progressif.

Conséquences directes : force brute sur les mots de passe, bourrage d'identifiants (*credential stuffing*), création massive de comptes, et pollution de `activity_log` et de la table `users`.

C'est l'exigence **V2.2.1 de l'OWASP ASVS** et la faille **A07:2021 — Identification and Authentication Failures**.

**Correction :** limitation par IP *et* par e-mail (par ex. 5 échecs / 15 min), verrouillage exponentiel, et journalisation des tentatives échouées.

#### SEC-04 — S2 — Aucun en-tête de sécurité HTTP

`next.config.js` ne définit aucune fonction `headers()`. L'application est donc servie sans :

`Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options` / `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`.

Conséquences : *clickjacking* possible, aucune barrière contre l'injection de script, référent complet fuité vers Unsplash.

#### SEC-05 — S2 — Sessions JWT non révocables

`lib/auth/jwt.ts` émet un JWT de 7 jours. `clearSessionCookie()` ne fait qu'effacer le cookie **du navigateur courant** : le jeton lui-même reste valide jusqu'à expiration.

Un cookie volé (XSS sur un sous-domaine, poste partagé, sauvegarde de navigateur) donne **7 jours d'accès, sans moyen de coupure**. Il n'existe ni « déconnecter tous mes appareils », ni liste de révocation, ni `jti`.

*Nuance :* la relecture en base par `getSessionUser()` permet déjà de couper l'accès en désactivant le compte (`is_active = false`) — c'est un excellent filet de sécurité, mais c'est une mesure de dernier recours, pas une révocation de session.

#### SEC-06 — S2 — Parcours de compte incomplets

- **Mot de passe oublié** : le bouton de `app/(auth)/login/page.tsx` affiche un simple *toast*. Aucun parcours de réinitialisation n'existe. Un utilisateur qui oublie son mot de passe perd définitivement son compte et sa progression.
- **Vérification d'e-mail** : absente. N'importe quelle adresse, réelle ou non, crée un compte.
- **Double authentification** : absente.

#### SEC-07 — S2 — Politique de mot de passe et coût de hachage

- Minimum 8 caractères, **aucune** exigence complémentaire, **aucune** vérification contre les bases de mots de passe compromis (HIBP *k-anonymity*).
- `SALT_ROUNDS = 10`. L'OWASP recommande aujourd'hui **bcrypt ≥ 12**, ou Argon2id.

#### SEC-08 — S2 — Le lint ne peut pas bloquer un déploiement

```js
// next.config.js
eslint: { ignoreDuringBuilds: true }
```

Combiné à l'absence de CI (OPS-01), **aucune règle de qualité n'est opposable** : tout code part en production.

#### SEC-09 — S3 — Pas de vérification d'origine (CSRF défense en profondeur)

Les routes mutatives ne vérifient ni l'en-tête `Origin`, ni un jeton anti-CSRF. `SameSite=Lax` bloque l'essentiel des attaques inter-sites sur `POST`, ce qui rend le risque faible — mais c'est un point unique de défaillance.

#### SEC-10 — S3 — `SESSION_SECRET` non contraint

`getSecretKey()` vérifie la présence de la variable, jamais sa longueur ni son entropie. Un secret de 6 caractères est accepté et rend les jetons HS256 attaquables hors ligne. `.env.example` ne donne aucune indication de format.

#### SEC-11 — S3 — Endpoint public coûteux et non protégé

`app/api/public/stats/route.ts` est `force-dynamic`, non authentifié, non mis en cache, sans limitation de débit, et déclenche à chaque appel **trois agrégats plein-table** :

```sql
select count(*) from users;
select coalesce(sum(jsonb_array_length(completed_lessons)), 0) from user_progress;
select ... from activity_log where created_at > now() - interval '14 days' group by 1;
```

Chaque visiteur anonyme de la page d'accueil génère ces trois requêtes. C'est un facteur d'amplification exploitable.

**Correction :** `revalidate = 60` (ou cache applicatif), plus une limitation de débit.

#### SEC-12 — S3 — Jokers `LIKE` non échappés

`lib/admin.ts` interpole la recherche dans un `ilike '%' || $1 || '%'` sans neutraliser `%` et `_`. Ce **n'est pas** une injection SQL — le paramétrage est correct — mais une recherche `%%%%%%` provoque un balayage complet contrôlé par l'utilisateur, sur une table sans index trigramme.

#### SEC-13 — S3 — Identifiant non-UUID → erreur 500

`getUserById(params.id)` compare directement à une colonne `uuid`. Une URL `/admin/users/abc` provoque une erreur PostgreSQL `22P02 invalid input syntax for type uuid`, non interceptée. Faute de `error.tsx` (OPS-02), l'utilisateur voit un écran d'erreur brut au lieu d'un 404. Même comportement sur `PATCH /api/admin/users/[id]`.

#### SEC-14 — S4 — Filtre `action` non validé

`GET /api/admin/activity` transmet `searchParams.get("action")` tel quel à la clause `where a.action = $n`, sans le valider contre le type `ActivityAction`.

---

## 4. Intégrité pédagogique — le cœur du problème

C'est le domaine où l'écart avec une « plateforme premium » est le plus grand : **le produit livre ce qu'il ne promet pas, et ne mesure pas ce qu'il prétend mesurer.**

#### PED-01 — S1 — 94,4 % des bonnes réponses sont l'option A (banque anglaise)

Mesure exécutée sur `lib/quiz-data-en-workbook.ts` (320 questions, toutes à réponse unique) :

| Position de la bonne réponse | A | B | C | D |
|---|---|---|---|---|
| Nombre de questions | **302** | 16 | 2 | 0 |
| Part | **94,4 %** | 5,0 % | 0,6 % | 0 % |

Les options ne sont **jamais** permutées : `app/(app)/quiz/page.tsx` et `app/(app)/exam/page.tsx` mélangent l'ordre des *questions* (`shuffle(questionBank)`), jamais celui des *options*.

Le seuil de réussite affiché est de 63 % (`PASS_THRESHOLD`). Donc :

> **Un candidat qui coche systématiquement la première option, sans lire, obtient 94,4 % et « réussit » l'examen blanc.**

C'est un défaut qui **inverse la valeur du produit** : il donne une fausse confiance à l'apprenant avant un examen réel à 245 € (frais Oracle). C'est le constat n° 1 à corriger.

#### PED-02 — S1 — 96 doublons exacts sur 320 questions annoncées

Toujours sur la banque anglaise : 96 questions ont **exactement le même énoncé et exactement les mêmes options** qu'une autre. Il n'y a que **224 questions réelles**, et seulement **157 jeux d'options distincts**.

Le schéma est mécanique : dans chaque domaine, les questions 11 à 20 reproduisent les questions 1 à 10, parfois avec une variation cosmétique (« Which database object… » → « Which schema object… », « candidate key » → « alternate key » avec la même explication).

Ironie documentée : le workbook source ouvre sur un chapitre « *Audit of the Previous 200-Question Workbook* » qui reproche précisément ce défaut à la version antérieure — et le reproduit.

Or `app/(marketing)/page.tsx` affiche `${questionCount}+ questions corrigées et expliquées`, soit **« 320+ »**. L'annonce est inexacte.

#### PED-03 — S1 — Les options ne sont jamais permutées

Aucun mélange d'options dans le quiz ni dans l'examen. C'est ce qui rend PED-01 exploitable, et c'est aussi un défaut en soi : la mémorisation porte sur la *position* et non sur le contenu.

#### PED-04 — S1 — Toutes les réponses sont livrées au client, et le score n'est pas vérifié

`lib/quiz-data.ts` et `lib/quiz-data-en-workbook.ts` sont importés par des composants `"use client"`. Les **558 questions**, avec leurs `correctIndexes` **et** leurs `explanation`, sont donc téléchargées par le navigateur — soit environ **527 Ko bruts / 95 Ko gzip**.

Conséquence directe : n'importe quel apprenant peut ouvrir les outils de développement et lire le corrigé complet avant de commencer.

Pire, le score est calculé côté client puis simplement envoyé :

```ts
// app/(app)/exam/page.tsx
const score = examQuestions.reduce(…);
recordExam(score, examQuestions.length, timeTaken);
```

`POST /api/progress/exam` ne valide que la **cohérence arithmétique** (`0 ≤ score ≤ total`), jamais les réponses réelles. Une requête `curl` suffit à s'attribuer 63/63.

**Impact en cascade :** XP, niveaux, séries (*streaks*), historique d'examens, moyennes affichées dans `/admin`, et statistiques publiques de la page d'accueil sont **tous falsifiables**. Le tableau de bord de suivi vendu aux formateurs ne mesure rien de fiable.

**Correction :** le serveur doit tenir la session d'examen (questions tirées + horodatage), recevoir les *réponses* et non le score, corriger lui-même, et ne renvoyer les corrigés qu'après soumission.

#### PED-05 — S2 — Biais de position dans la banque française

`lib/quiz-data.ts`, 238 questions dont 174 à réponse unique :

| Position | A | B | C | D |
|---|---|---|---|---|
| Nombre | 20 | **106** | 26 | 22 |

61 % des questions à réponse unique ont B pour bonne réponse. Stratégie « cocher B partout » → **44,5 %**, soit 2,4 fois le hasard. Sous le seuil de 63 %, donc moins grave que PED-01, mais le biais est massif.

*À l'inverse, cette banque fait bien deux choses :* elle contient **64 questions à réponses multiples** (conformes au format réel de l'examen) et **100 % des explications sont renseignées**, souvent avec un vrai raisonnement pédagogique. C'est la base sur laquelle capitaliser.

#### PED-06 — S2 — La banque « française » est bilingue à 27 %

Sur 238 questions de `lib/quiz-data.ts` : **48 énoncés clairement en anglais**, **16 mixtes**, 174 en français. Exemples (`q122`, `q125` à `q137`…) :

> `q126: "Which statement correctly grants a system privilege?"`
> `q130: "Which three statements are true regarding constraints? (Choose three.)"`

Un apprenant francophone bascule sans prévenir dans un bloc anglais. Voir aussi LEG-01 : ces énoncés proviennent de l'*exam dump*.

#### PED-07 — S2 — Aucune question à réponses multiples en anglais

`lib/quiz-data-en-workbook.ts` : **0 question sur 320** attend plusieurs réponses. Or l'examen 1Z0-071 réel en comporte massivement — le PDF source contient à lui seul **41 énoncés « Which two / Which three »**. La simulation anglaise n'entraîne donc pas au format réel.

#### PED-08 — S2 — Le bac à sable SQL couvre une fraction du programme

`app/(app)/sandbox/page.tsx` implémente un analyseur SQL maison qui ne gère que `SELECT … FROM une_table [WHERE] [ORDER BY] [FETCH/LIMIT]`. Sont explicitement refusés :

- `JOIN` — « JOINs are not supported in this sandbox yet. »
- `GROUP BY` — « GROUP BY is not supported in this sandbox yet. »
- `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
- et, de fait : sous-requêtes, opérateurs ensemblistes, `CASE`, fonctions mono-ligne, `DUAL`, `MERGE`, DML, DDL.

Ces sujets représentent **la majorité du programme 1Z0-071**. Le bac à sable ne peut donc pas servir aux modules qui en auraient le plus besoin.

#### PED-09 — S2 — Le bac à sable enseigne une syntaxe invalide en Oracle

`app/(app)/sandbox/page.tsx:181`, exemple proposé en un clic à l'apprenant :

```sql
SELECT first_name, last_name, hire_date FROM employees ORDER BY hire_date DESC LIMIT 5
```

**`LIMIT` n'existe pas en Oracle SQL.** C'est de la syntaxe MySQL/PostgreSQL. La forme correcte, déjà présente dans un autre exemple du même fichier, est `FETCH FIRST 5 ROWS ONLY`.

`LIMIT` figure aussi dans la liste `KEYWORDS` de l'analyseur, qui l'accepte donc sans broncher. Une plateforme de certification Oracle **valide activement une réponse qui serait sanctionnée à l'examen**. À corriger en priorité : c'est peu coûteux et directement contraire à la mission du produit.

#### PED-10 — S3 — Couverture déséquilibrée entre modules

18 modules, 31 leçons, 85 flashcards, 34 exercices.

- **10 modules sur 18 n'ont qu'une seule leçon** (m5, m8, m11 à m18).
- Questions par module : de **7** (m18) et **9** (m17) à **54** (m4) et **53** (m10).
- `m14 / m14l1` est la seule leçon **sans aucun exercice**.
- `estimatedHours` n'est corrélé ni au nombre de leçons ni au volume de contenu (m11 : 1 leçon annoncée à 4 h).

#### PED-11 — S3 — Doublons et options ambiguës dans la banque française

- Doublons exacts : `q146 = q170`, `q150 = q167`, `q157 = q169`.
- `q165` propose deux options qui ne diffèrent que par la casse (`QTY` / `qty`) — l'apprenant voit deux réponses visuellement identiques.

#### PED-12 — S3 — Étiquettes de difficulté non calibrées

Banque anglaise : 192 `medium`, 109 `easy`, 19 `hard` — attribuées en bloc à l'import, sans lien avec la difficulté réelle. Les filtres de difficulté du quiz reposent donc sur une donnée arbitraire.

---

## 5. Internationalisation

#### I18N-01 — S1 — La version anglaise du cours est une pseudo-traduction

`lib/content-i18n.ts` :

```ts
const translations: Record<string, string> = { /* 40 entrées */ };
function localize(value: string): string {
  if (translations[value]) return translations[value];
  let result = value;
  for (const [source, target] of Object.entries(translations)) {
    if (source.length > 4 && result.includes(source)) result = result.replaceAll(source, target);
  }
  return result;
}
```

Quarante rechercher/remplacer sont appliqués à `lib/modules-data.ts` (4 075 lignes) et `lib/reference-data.ts`. Tout le reste — objectifs, contenus, tableaux, pièges, points clés — **reste en français**, avec quelques mots anglais insérés au milieu de phrases françaises.

Un apprenant anglophone reçoit donc un cours français partiellement mutilé.

#### I18N-02 — S2 — L'anglais est la langue par défaut

`lib/i18n/locale.ts` : `DEFAULT_LOCALE = "en"`. **Le parcours par défaut est donc celui du contenu le plus dégradé** — et il sert simultanément la banque de questions la plus défectueuse (PED-01, PED-02, PED-07). C'est la combinaison la plus défavorable possible pour un premier visiteur.

#### I18N-03 — S2 — Trois mécanismes de traduction concurrents

| Mécanisme | Où |
|---|---|
| Dictionnaire `t.` (`lib/i18n/dictionary.ts`) | `/dashboard` (44 usages), `/marketing` (51), `/admin` |
| Ternaires en ligne `en ? "…" : "…"` | `/flashcards`, `/courses`, `/courses/[moduleId]` |
| Chaînes en dur | `/sandbox` (**0 appel à `useLanguage`**) |

`app/(app)/flashcards/page.tsx` importe `useLanguage` et n'utilise **jamais** `t.`. `app/(app)/courses/page.tsx` l'utilise une seule fois.

Résultat visible sur `/sandbox`, dans un même écran :

> « **Mode pratique** », « **Conseil du jour** », « Combinez WHERE, ORDER BY et FETCH FIRST… », « **Prêt pour l'examen** »
> à côté de « **Copied** », « **Copy** », « Only SELECT statements are supported in this sandbox. »

#### I18N-04 — S2 — Le journal d'activité est en français en dur

`lib/activity-types.ts:ACTIVITY_ACTION_LABELS` et `app/(app)/activity/page.tsx:describeMetadata()` renvoient exclusivement du français (« Leçon terminée », « Score : », « Nouveau rôle : »). Les pages `/activity`, `/admin` et `/admin/activity` restent donc francophones même en anglais.

#### I18N-05 — S3 — Coût d'exécution de la pseudo-traduction

`localizeValue()` parcourt récursivement l'intégralité des 18 modules et applique jusqu'à 40 `replaceAll` par chaîne, **à chaque rendu**, y compris côté client (`/quiz`, `/flashcards`, `/search`, `/courses`).

---

## 6. Performance et architecture front

Sortie réelle de `next build` (34 routes) :

| Route | First Load JS | Budget premium visé |
|---|---|---|
| `/dashboard` | **273 Ko** | ≤ 170 Ko |
| `/quiz` | **224 Ko** | ≤ 170 Ko |
| `/search` | **200 Ko** | ≤ 170 Ko |
| `/` (accueil) | 196 Ko | ≤ 170 Ko |
| `/admin` | 196 Ko | ≤ 170 Ko |
| `/courses` | 178 Ko | |
| `/flashcards` | 173 Ko | |
| Socle partagé | 79,5 Ko | |
| Middleware | 34,8 Ko | |

#### PERF-01 — S2 — Le corpus pédagogique est embarqué dans les bundles client

Huit pages `"use client"` importent directement les gros modules de données :

| Page | Modules importés |
|---|---|
| `/search` | `content-i18n` + `quiz-data` + `quiz-data-en-workbook` + `reference-data` |
| `/quiz` | `quiz-data` + `quiz-data-en-workbook` + `content-i18n` |
| `/exam` | `quiz-data` + `quiz-data-en-workbook` |
| `/dashboard` | `content-i18n` + `quiz-data` |
| `/courses`, `/courses/[moduleId]`, `/flashcards`, `/reference` | `content-i18n` (+ `reference-data`) |

Poids des sources : `quiz-data.ts` 148,7 Ko (36,3 Ko gzip), `quiz-data-en-workbook.ts` 191,6 Ko (13,6 Ko), `modules-data.ts` 164,3 Ko (39,3 Ko), `reference-data.ts` 22,1 Ko (5,8 Ko) — **≈ 527 Ko bruts / 95 Ko gzip**.

C'est à la fois un problème de performance **et** la cause racine de PED-04 (fuite des corrigés).

#### PERF-02 — S2 — Deux polices Google téléchargées à chaque page, jamais appliquées

`app/layout.tsx` charge trois polices via `next/font/google` : Inter (`--font-sans`), JetBrains Mono (`--font-mono`), Playfair Display (`--font-display`).

Or `tailwind.config.ts` ne déclare que :

```ts
fontFamily: { display: ['var(--font-display)', 'serif'] }
```

**Preuve** — compilation Tailwind isolée de `app/globals.css` :

```css
.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,…}
.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,…}
.font-display{font-family:var(--font-display),serif}   /* ← la seule qui fonctionne */
```

`--font-sans` et `--font-mono` sont définies sur `<body>` mais **jamais référencées**. La règle `code { font-family: "JetBrains Mono", … }` de `globals.css` ne fonctionne pas non plus : `next/font` génère un nom de famille aléatoire (`__JetBrains_Mono_xxxxx`), pas `"JetBrains Mono"`.

Conséquences : deux fichiers de police téléchargés à chaque chargement pour rien, et le rendu typographique — élément central d'une perception « premium » — repose en réalité sur la pile système. **Le design voulu n'est pas celui qui s'affiche.**

Correction (2 lignes) :

```ts
fontFamily: {
  sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
  mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
  display: ['var(--font-display)', 'serif'],
},
```

#### PERF-03 — S2 — Images non optimisées et dépendance à Unsplash

`next.config.js` : `images: { unoptimized: true }`. Aucune image n'est redimensionnée, ni convertie en WebP/AVIF, ni servie en `srcset`.

Quatre visuels *hero* sont chargés depuis `images.unsplash.com` en 1200 à 1920 px (`app/(marketing)/page.tsx:115, 128, 257, 358` et `app/(auth)/auth-shell.tsx:34`), en `priority`. Ce sont les éléments LCP des deux pages les plus vues.

Trois conséquences : LCP dégradé sur mobile, indisponibilité totale du visuel si Unsplash est injoignable, et **transmission de l'adresse IP de chaque visiteur à un tiers sans base légale ni consentement** (voir LEG-03).

#### PERF-04 — S2 — Le build échoue sans accès à Google Fonts

Constaté pendant l'audit : sans résolution DNS de `fonts.googleapis.com`, `next build` échoue avec `Failed to fetch Inter from Google Fonts`. Une CI en réseau restreint, une panne Google Fonts ou une politique de proxy d'entreprise bloque donc tout déploiement. Aucune police n'est auto-hébergée.

#### PERF-05 — S3 — Rechargement complet de la table utilisateurs à chaque modification

`lib/admin.ts:updateUser()` se termine par :

```ts
const users = await listUsers();          // TOUTE la table + jointure + agrégat JSONB
return users.find((u) => u.id === targetId) ?? null;
```

Chaque bascule d'un interrupteur dans `/admin/users` recharge l'intégralité des utilisateurs pour n'en renvoyer qu'un.

#### PERF-06 — S3 — `/admin/users` sans pagination

`listUsers()` n'a ni `LIMIT` ni `OFFSET`, et la page rend une ligne par utilisateur. À quelques milliers de comptes, la page devient inexploitable. `/admin` charge lui aussi la liste complète pour n'en afficher que 8 (`users.slice(0, 8)`).

#### PERF-07 — S3 — Agrégats admin non mis en cache

`getAdminOverviewStats()` exécute à chaque affichage `count(*)` sur `activity_log`, `avg(jsonb_array_length(completed_lessons))` sur `user_progress`, et deux `group by` — sans cache ni index couvrant.

---

## 7. Design system et accessibilité

#### UX-01 — S2 — 19 classes de couleur ne produisent aucun CSS

`app/globals.css` définit `--success`, `--success-foreground`, `--warning`, `--warning-foreground` pour les deux thèmes. Mais `tailwind.config.ts` **ne les déclare pas** dans `theme.extend.colors`.

Les classes `text-success`, `bg-success/10`, `text-warning` sont utilisées **19 fois** dans 5 fichiers :

- `components/app-layout.tsx` — icône de série (flamme)
- `app/(marketing)/live-stats.tsx` — pastille « en direct »
- `app/(app)/dashboard/page.tsx`, `app/(app)/courses/page.tsx`, `app/(app)/reference/page.tsx`

**Preuve** — la CSS compilée contient `0` occurrence de `.text-success`, `.bg-success` et `.text-warning`. Ces éléments héritent donc de la couleur du parent : les indicateurs de succès et d'avertissement, prévus en vert et orange, s'affichent en gris.

Correction (4 lignes dans `tailwind.config.ts`) :

```ts
success: { DEFAULT: 'hsl(var(--success))', foreground: 'hsl(var(--success-foreground))' },
warning: { DEFAULT: 'hsl(var(--warning))', foreground: 'hsl(var(--warning-foreground))' },
```

#### UX-02 — S2 — L'éditeur SQL est hors norme WCAG

`app/(app)/sandbox/page.tsx:1123` :

```tsx
<textarea
  ref={textareaRef}
  placeholder="Enter a SQL query…  e.g. SELECT * FROM employees"
  className="… text-white/90 caret-sky-400 … placeholder:text-white/30"
/>
```

- **Aucun nom accessible** : ni `<label>`, ni `aria-label`, ni `aria-labelledby`. Un lecteur d'écran annonce « zone de saisie » sans plus. → WCAG 2.2 **4.1.2** (Nom, rôle, valeur).
- `placeholder:text-white/30` sur fond très sombre donne un rapport de contraste d'environ **2,2:1**, très en deçà du **4,5:1** exigé par WCAG 2.2 **1.4.3** (AA).
- Les couleurs sont figées en `white/…` quel que soit le thème : en thème clair, le composant reste sombre, hors du système de jetons.

#### UX-03 — S3 — Boutons icône sans nom accessible

Vérifiés manuellement :

- `components/app-layout.tsx:184` — ouverture/fermeture du menu latéral : **aucun** `aria-label`, ni `aria-expanded`, ni `aria-controls`.
- `components/app-layout.tsx:206` — bascule de thème : **aucun** `aria-label`.

Incohérence notable : `components/theme-toggle.tsx` et `app/(auth)/auth-shell.tsx` fournissent tous deux un `aria-label` pour la **même** fonction. Le composant `ThemeToggle` existe déjà — il suffit de l'employer partout.

#### UX-04 — S3 — Aucune annonce des changements dynamiques

Une seule région `aria-live` dans l'ensemble de l'application. Ne sont annoncés ni le retour de correction du quiz, ni le score final de l'examen, ni le résultat ou l'erreur du bac à sable, ni le passage à la question suivante.

#### UX-05 — S3 — Navigation clavier et structure

Pas de lien d'évitement (« Aller au contenu ») alors que la barre latérale compte 9 liens à franchir à chaque page. `<main>` n'est présent que sur 3 gabarits.

#### UX-06 — S3 — La préférence système de thème est ignorée

`components/theme-provider.tsx` : `defaultTheme="light"`, `enableSystem={false}`. Un utilisateur en thème sombre système reçoit un écran clair.

#### UX-07 — S3 — Libellés en dur en anglais dans `/search`

`app/(app)/search/page.tsx:355` : `placeholder="Search for a lesson, function, term, quiz…"`, affiché tel quel en français.

#### Points positifs

`<html lang={locale}>` est correctement piloté par la locale. Les composants shadcn/ui reposent sur Radix, qui apporte gratuitement la gestion du focus, `aria-*` et la navigation clavier des menus, dialogues et onglets. Les images ont toutes un `alt`.

---

## 8. Fiabilité et exploitation

#### OPS-01 — S1 — Aucun test, aucune intégration continue

Recherche exhaustive : **0** fichier `*.test.*` ou `*.spec.*`, **0** configuration Jest / Vitest / Playwright, **0** dossier `.github/`.

29 592 lignes, une logique d'authentification, un moteur de répétition espacée, un analyseur SQL maison et un simulateur d'examen — sans un seul test de non-régression. Combiné à SEC-08 (`ignoreDuringBuilds`), rien ne s'oppose à un déploiement cassé.

#### OPS-02 — S2 — Aucune frontière d'erreur

Aucun `error.tsx`, `global-error.tsx`, `not-found.tsx` ni `loading.tsx` dans `app/`.

Toute exception serveur (base indisponible, UUID invalide — SEC-13, timeout) produit l'écran d'erreur générique de Next.js. Aucun état de chargement n'est prévu pour les pages serveur qui interrogent la base (`/admin`, `/activity`, `/admin/users/[id]`).

#### OPS-03 — S2 — Aucune observabilité

Pas de journalisation structurée, pas de suivi d'erreurs (Sentry ou équivalent), pas d'APM, pas de sonde `/api/health`. En production, une panne ne serait détectée que par un signalement utilisateur.

#### OPS-04 — S3 — Migrations non versionnées

`scripts/migrate.ts` exécute `db/schema.sql` en bloc. Le fichier est idempotent (`create table if not exists`, `add column if not exists`), ce qui est un bon réflexe, mais il n'existe ni numérotation, ni table de suivi, ni procédure de retour arrière. Faire évoluer un type de colonne ou une contrainte deviendra rapidement risqué.

#### OPS-05 — S3 — Configuration d'environnement sous-documentée

`.env.example` contient deux lignes vides (`DATABASE_URL=`, `SESSION_SECRET=`). Aucune indication de format, de longueur minimale, de mode SSL, ni de variable d'URL publique (nécessaire pour `metadataBase`, les liens d'e-mail, le sitemap).

#### OPS-06 — S3 — README inexploitable

`README.md` contient un titre et un badge. Ni prérequis, ni installation, ni procédure de migration, ni création de l'admin, ni déploiement, ni architecture.

#### OPS-07 — S3 — Pool PostgreSQL inadapté au *serverless*

`lib/db.ts` crée un `Pool({ max: 5 })` mémorisé dans `global.__pgPool`. Le commentaire sur l'initialisation paresseuse est juste et bien pensé. Mais la cible de déploiement est Netlify (`netlify.toml`, `@netlify/plugin-nextjs`) : chaque instance de fonction possède son propre `global`. À 20 instances concurrentes → 100 connexions, au-delà de la limite par défaut de PostgreSQL (100). Aucune configuration SSL n'est prévue non plus, alors que la plupart des Postgres gérés l'imposent.

#### OPS-08 — S4 — Code mort

Cinq routes d'API sur 18 ne sont appelées par aucun client :

| Route | Statut |
|---|---|
| `GET /api/auth/me` | jamais appelée (`getSessionUser()` est utilisé côté serveur) |
| `GET /api/admin/activity` | jamais appelée (la page utilise `listAllActivity()` en direct) — et ses filtres `action`/`q` ne sont donc jamais exercés |
| `GET /api/admin/users` | jamais appelée |
| `POST /api/progress/study-time` | `addStudyTime()` n'est appelé nulle part |
| `POST /api/progress/bookmark` | `toggleBookmark()` n'est appelé nulle part |

En conséquence, les colonnes `user_progress.study_time` et `user_progress.bookmarks` ne sont **jamais** ni écrites ni lues par l'interface. Le temps d'étude affiché vaut toujours 0 et la fonction « signets » n'existe pas dans l'interface.

#### OPS-09 — S4 — Constantes dupliquées

`app/(marketing)/page.tsx` :

```ts
// Mirrors the constants in app/(app)/exam/page.tsx — kept in sync manually
const EXAM_PASS_THRESHOLD = 63;
const EXAM_DURATION_MINUTES = 120;
```

Le commentaire est honnête, la solution ne l'est pas : à exporter depuis un module partagé.

#### OPS-10 — S3 — Croissance non bornée des données

`user_progress.exam_results` est un tableau JSONB auquel chaque examen ajoute une entrée, sans plafond ni archivage. `activity_log` croît indéfiniment sans purge (voir aussi LEG-02).

---

## 9. Conformité, données personnelles et juridique

> Cette section décrit des risques factuels. Elle ne constitue pas un avis juridique ; une validation par un conseil est recommandée avant toute commercialisation.

#### LEG-01 — S1 — Contenu issu d'un *exam dump* intégré au produit

`docs/1Z0-071.pdf` (39 pages, 1,5 Mo) porte l'en-tête :

> « Vendor: **Oracle** — Exam Code: **1Z0-071** — Exam Name: Oracle Certified Associate (Database SQL) »

Il contient environ **86 questions numérotées** au format examen (dont 41 « Which two / Which three »), **sans réponses ni explications** — la signature classique d'un document de *braindump*.

L'analyse de similarité montre **≈ 41 énoncés repris quasi mot pour mot** dans `lib/quiz-data.ts` (`q122`, `q125`–`q137`, etc.). Exemple, identique caractère pour caractère :

> `"Evaluate the following ALTER TABLE statement: ALTER TABLE orders SET UNUSED order_date; Which statement is true?"`

Reproduire des questions d'examen Oracle expose à : violation de l'**Oracle Certification Program Candidate Agreement**, atteinte au droit d'auteur, et — pour les apprenants — invalidation de leur certification et bannissement du programme. Le risque augmente considérablement dès lors que la plateforme est commercialisée.

**Point à souligner :** le workbook DOCX du même dossier énonce explicitement une « Authenticity Rule » et affirme n'utiliser les sources publiques **que** pour l'analyse de style, sans reproduire de contenu confidentiel. Cette intention est la bonne. **Elle n'est simplement pas respectée par `lib/quiz-data.ts`.**

**Correction :** retirer du dépôt les 41 énoncés concernés et les réécrire (voir `PLAN-ACTION-PREMIUM.md`, lot 2), sortir `docs/1Z0-071.pdf` du dépôt.

#### LEG-02 — S1 — Données personnelles collectées sans cadre

`db/schema.sql` :

```sql
create table if not exists activity_log (
  …
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);
```

`lib/activity.ts` enregistre l'**adresse IP** et l'**agent utilisateur** à chaque connexion, déconnexion, leçon terminée, quiz, examen, flashcard, signet et requête du bac à sable. En droit européen, ce sont des **données à caractère personnel**.

Or : aucune durée de conservation, aucune purge, aucune information des personnes, aucune base légale documentée, aucun registre de traitement.

De plus, `POST /api/progress/sandbox-query` journalise **le texte des requêtes SQL saisies** (500 caractères), c'est-à-dire une saisie libre pouvant contenir n'importe quoi.

#### LEG-03 — S2 — Aucune page légale, aucun parcours RGPD

Absents : politique de confidentialité, CGU, CGV, mentions légales, information cookies, et surtout **tout parcours de suppression ou d'export de compte** (RGPD art. 15, 17 et 20). Les seules pages publiques sont `/`, `/login` et `/register` (`middleware.ts:PUBLIC_ONLY_PATHS`).

À noter également : les images Unsplash (PERF-03) transmettent l'IP de chaque visiteur à un tiers dès la page d'accueil, avant toute interaction.

#### LEG-04 — S2 — Les PDF sources sont versionnés

`.gitignore` ignore bien `/OCA/` avec le commentaire « *local exam source PDFs/DOCX (not published)* » — l'intention est correcte. Mais `docs/` **n'est pas ignoré** : les trois documents, dont l'*exam dump*, sont donc dans le dépôt et suivront toute publication ou tout transfert de celui-ci.

#### LEG-05 — S3 — Artefacts de génération laissés dans le document source

`docs/1Z0-071_COMPLETE_MASTER_EXAM_PREP_320_QUESTIONS_2026.docx` contient en clair des marqueurs internes d'outil d'IA :

```
fileciteturn0file0L41-L159   citeturn1search0turn1search1   turn0search2
```

Sans conséquence technique, mais rédhibitoire si le document est distribué tel quel à des clients.

---

## 10. Référencement et distribution

| Réf. | Gravité | Constat |
|---|---|---|
| **SEO-01** | S2 | Un seul `export const metadata`, dans `app/layout.tsx`. Les 15 pages partagent le même titre et la même description. |
| **SEO-02** | S2 | Pas de `metadataBase`, pas d'`opengraph-image`, pas de carte Twitter → tout partage sur les réseaux affiche un aperçu vide. |
| **SEO-03** | S2 | Aucun `app/robots.ts`, `app/sitemap.ts` ni `app/manifest.ts`. |
| **SEO-04** | S3 | Aucune balise `hreflang` malgré le bilinguisme FR/EN. |

---

## 11. Récapitulatif des constats bloquants (S1)

| # | Réf. | Constat | Effort estimé |
|---|---|---|---|
| 1 | PED-01 | Bonne réponse = A dans 94,4 % de la banque anglaise | 2 j |
| 2 | PED-02 | 96 doublons exacts sur 320 questions annoncées | 3 j |
| 3 | PED-03 | Options jamais permutées | 0,5 j |
| 4 | PED-04 | Corrigés livrés au client + score non vérifié | 4 j |
| 5 | I18N-01 | Version anglaise = pseudo-traduction par rechercher/remplacer | 8 j |
| 6 | SEC-01 | 18 vulnérabilités, dont CVSS 9.1 | 0,5 j (palliatif) |
| 7 | SEC-02 | Identifiants admin en clair dans le dépôt | 0,5 j |
| 8 | SEC-03 | Aucune limitation de débit sur l'authentification | 1 j |
| 9 | OPS-01 | Aucun test, aucune CI | 5 j |
| 10 | LEG-01 | Énoncés d'*exam dump* intégrés au produit | 3 j |
| 11 | LEG-02 | IP et agent utilisateur conservés sans cadre | 2 j |
| 12 | PED-09 | Le bac à sable enseigne `LIMIT`, invalide en Oracle | 0,25 j |

**Total S1 ≈ 30 jours-personne.** Le détail, l'ordonnancement et les lots figurent dans [`PLAN-ACTION-PREMIUM.md`](./PLAN-ACTION-PREMIUM.md).

---

## 12. Documents liés

| Document | Contenu |
|---|---|
| [`ANALYSE-SOURCES-PEDAGOGIQUES.md`](./ANALYSE-SOURCES-PEDAGOGIQUES.md) | Analyse détaillée des trois documents de `docs/` et de leur exploitation dans le code |
| [`REFERENTIEL-QUALITE-PREMIUM.md`](./REFERENTIEL-QUALITE-PREMIUM.md) | Normes applicables, seuils chiffrés et critères d'acceptation |
| [`PLAN-ACTION-PREMIUM.md`](./PLAN-ACTION-PREMIUM.md) | Feuille de route en 6 lots, correctifs prêts à appliquer, estimations |
