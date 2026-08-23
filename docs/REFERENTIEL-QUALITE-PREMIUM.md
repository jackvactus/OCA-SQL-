# Référentiel qualité « plateforme premium »

**Date :** 23 août 2026
**Objet :** Normes applicables, seuils chiffrés et critères d'acceptation opposables. Ce document définit ce que « premium » veut dire pour ce produit — de façon mesurable, pas déclarative.

**Règle générale :** un critère marqué **obligatoire** bloque la mise en production. Un critère **recommandé** est un objectif de trajectoire.

---

## 1. Normes de référence retenues

| Domaine | Référentiel | Niveau visé |
|---|---|---|
| Sécurité applicative | **OWASP ASVS 4.0** | Niveau **2** (application traitant des données personnelles) |
| Vulnérabilités | **OWASP Top 10 2021** | Aucune occurrence A01–A10 non traitée |
| Dépendances | `npm audit` | **0** critique, **0** haute |
| Accessibilité | **WCAG 2.2** (et EN 301 549 pour l'UE) | Niveau **AA** |
| Performance web | **Core Web Vitals** | LCP < 2,5 s · INP < 200 ms · CLS < 0,1 (75ᵉ centile, mobile) |
| Qualité logicielle | **ISO/IEC 25010** | Maintenabilité, fiabilité, sécurité |
| Données personnelles | **RGPD** (UE 2016/679) | Conformité complète |
| Contenu de certification | **Oracle Certification Program Candidate Agreement** | Aucun contenu d'examen reproduit |
| Sémantique de version | **SemVer 2.0** | Versionnage du produit et des banques de questions |

---

## 2. Sécurité — critères d'acceptation

### 2.1 Authentification et sessions

| # | Critère | Statut actuel |
|---|---|---|
| **O** | Limitation de débit sur `/api/auth/login` et `/register` : ≤ 5 échecs / 15 min par IP **et** par e-mail | ❌ absent |
| **O** | Verrouillage temporaire progressif après échecs répétés | ❌ absent |
| **O** | Aucun secret, mot de passe ou clé dans le dépôt (vérifié par un scanner en CI) | ❌ `scripts/seed-admin.ts` |
| **O** | `SESSION_SECRET` ≥ 32 octets d'entropie, **vérifié au démarrage** | ❌ non vérifié |
| **O** | Hachage : bcrypt **cost ≥ 12** ou Argon2id (`m=19 MiB, t=2, p=1`) | ❌ cost 10 |
| **O** | Parcours complet de réinitialisation de mot de passe (jeton à usage unique, ≤ 30 min) | ❌ absent |
| **R** | Vérification de l'e-mail avant accès complet | ❌ absent |
| **R** | Mot de passe vérifié contre HIBP (*k-anonymity*, aucun envoi du mot de passe) | ❌ absent |
| **R** | Révocation de session (`jti` + liste de révocation, ou sessions en base) | ❌ JWT non révocable |
| **R** | « Déconnecter tous mes appareils » | ❌ absent |
| **R** | 2FA (TOTP) au moins pour les comptes `admin` | ❌ absent |
| ✅ | Anti-énumération par temps de réponse au login | ✅ **conforme** |
| ✅ | Cookie `httpOnly` + `sameSite` + `secure` en production | ✅ **conforme** |
| ✅ | Autorisations admin revérifiées en base, pas seulement dans le JWT | ✅ **conforme** |

### 2.2 En-têtes HTTP — tous obligatoires

| En-tête | Valeur cible |
|---|---|
| `Content-Security-Policy` | `default-src 'self'` ; `img-src 'self' data:` ; `style-src 'self' 'unsafe-inline'` ; `frame-ancestors 'none'` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| `X-Frame-Options` | `DENY` (redondance de `frame-ancestors`) |

> La CSP ci-dessus impose de **supprimer les images Unsplash distantes** (PERF-03) et d'**auto-héberger les polices** (PERF-04). Les deux sont de toute façon requis par ailleurs.

### 2.3 Entrées, données et API

| # | Critère | Statut |
|---|---|---|
| **O** | Requêtes SQL exclusivement paramétrées | ✅ **conforme** |
| **O** | Validation Zod du corps de **toutes** les routes mutatives | ⚠️ partiel (`login`/`register` ✅, `progress/*` en manuel, `admin/users/[id]` en manuel) |
| **O** | Paramètres d'URL de type UUID validés avant requête (renvoi d'un 404, pas d'une 500) | ❌ SEC-13 |
| **O** | Jokers `%` et `_` échappés dans les clauses `ILIKE` | ❌ SEC-12 |
| **O** | Aucune trace d'erreur ni détail interne renvoyé au client en production | ⚠️ non maîtrisé (aucune frontière d'erreur) |
| **O** | Endpoints publics : mis en cache **et** limités en débit | ❌ `/api/public/stats` |
| **R** | Vérification de l'en-tête `Origin` sur les requêtes mutatives | ❌ absent |

### 2.4 Dépendances

| # | Critère | Statut |
|---|---|---|
| **O** | `npm audit` : 0 critique, 0 haute | ❌ **1 critique, 13 hautes** |
| **O** | Framework maintenu (Next.js ≥ 14 LTS) | ❌ 13.5.1 |
| **O** | Vérification automatique des vulnérabilités en CI, bloquante | ❌ pas de CI |
| **R** | Mises à jour de sécurité automatisées (Dependabot / Renovate) | ❌ absent |

---

## 3. Intégrité pédagogique — critères propres à ce produit

Ce sont les critères qui différencient une plateforme de certification crédible d'un simple site de quiz. **Ils sont tous obligatoires.**

### 3.1 Banques de questions

| # | Critère | Seuil | Statut actuel |
|---|---|---|---|
| Q1 | **Aucun doublon exact** (énoncé + options identiques) | 0 | ❌ 96 (EN) + 3 (FR) |
| Q2 | **Répartition de la bonne réponse** | chaque position ∈ **[20 % ; 30 %]** | ❌ EN : A = 94,4 % · FR : B = 61 % |
| Q3 | **Score d'une stratégie constante** (« toujours A », « toujours B »…) | **< 35 %** | ❌ EN : 94,4 % · FR : 44,5 % |
| Q4 | **Options permutées à l'exécution**, à chaque tentative | obligatoire | ❌ jamais |
| Q5 | **Part de questions à réponses multiples** | **≥ 25 %** de chaque banque | ❌ EN : 0 % · ✅ FR : 27 % |
| Q6 | **Explication** présente et ≥ 80 caractères | 100 % | ⚠️ présentes, longueur non contrôlée |
| Q7 | **Une seule langue par banque** | 100 % | ❌ FR : 27 % en anglais |
| Q8 | **Couverture par domaine** | ≥ 20 questions / module | ❌ m17 : 9 · m18 : 7 |
| Q9 | **Index de bonne réponse dans les bornes** | 100 % | ✅ **conforme** |
| Q10 | **Cohérence « Choose N » ↔ nombre de bonnes réponses** | 100 % | ✅ **conforme** (0 écart) |
| Q11 | **Options distinctes au sein d'une question** (casse ignorée) | 100 % | ❌ `q165` |
| Q12 | **Origine tracée** (`source`, `reviewedAt`) | 100 % | ❌ champ absent |
| Q13 | **Aucun énoncé repris d'une source d'examen tierce** | 0 | ❌ ~41 énoncés |
| Q14 | **Difficulté calibrée** sur le taux de réussite réel observé | après 500 réponses | ❌ arbitraire |

### 3.2 Intégrité des évaluations

| # | Critère | Statut |
|---|---|---|
| **O** | Les corrigés **ne sont pas** livrés au navigateur avant soumission | ❌ 558 corrigés dans le bundle |
| **O** | La correction est effectuée **côté serveur** | ❌ côté client |
| **O** | L'API reçoit des **réponses**, jamais un score déjà calculé | ❌ reçoit le score |
| **O** | La session d'examen (questions tirées, horodatage) est tenue côté serveur | ❌ absente |
| **O** | Le temps écoulé est vérifié côté serveur | ❌ envoyé par le client |
| **R** | Détection d'anomalies (score parfait en < 60 s, cadence anormale) | ❌ absent |

### 3.3 Fidélité au domaine Oracle

| # | Critère | Statut |
|---|---|---|
| **O** | **Aucune syntaxe non-Oracle** enseignée ou acceptée (`LIMIT`, `TOP`, `AUTO_INCREMENT`, `IFNULL`…) | ❌ `LIMIT` proposé et accepté par le bac à sable |
| **O** | Le simulateur reflète le format réel : 63 questions / 120 min / 63 % | ✅ **conforme** |
| **R** | Le bac à sable couvre `JOIN`, `GROUP BY`, agrégats et sous-requêtes | ❌ tous refusés |
| **R** | Restitution du score **par domaine**, pas seulement globale | ⚠️ annoncée sur la page d'accueil, non implémentée |

---

## 4. Accessibilité — WCAG 2.2 niveau AA

| Critère WCAG | Exigence | Statut |
|---|---|---|
| **1.4.3** Contraste minimum | ≥ 4,5:1 (texte), ≥ 3:1 (texte large et éléments d'interface) | ❌ `placeholder:text-white/30` ≈ 2,2:1 |
| **1.4.11** Contraste des éléments non textuels | ≥ 3:1 | ⚠️ à vérifier (jetons `success`/`warning` non générés) |
| **2.1.1** Clavier | Toute fonction accessible au clavier | ⚠️ partiel |
| **2.4.1** Contourner des blocs | Lien d'évitement obligatoire | ❌ absent |
| **2.4.2** Titre de page | Titre unique et descriptif par page | ❌ un seul `metadata` global |
| **2.4.7** Visibilité du focus | Focus visible partout | ✅ via Radix / shadcn |
| **3.1.1 / 3.1.2** Langue | `lang` de la page et des passages | ⚠️ page ✅, passages FR dans une page EN ❌ |
| **4.1.2** Nom, rôle, valeur | Nom accessible sur tout contrôle | ❌ `<textarea>` SQL, 2 boutons icône |
| **4.1.3** Messages d'état | `aria-live` sur les retours dynamiques | ❌ 1 seule région |

**Objectif de vérification :** 0 violation `axe-core` de niveau *serious* ou *critical* sur les 15 pages, contrôlé en CI.

---

## 5. Performance — budgets opposables

| Métrique | Budget | Actuel |
|---|---|---|
| **First Load JS** — toute page | **≤ 170 Ko** | ❌ `/dashboard` 273 · `/quiz` 224 · `/search` 200 · `/` 196 · `/admin` 196 |
| **First Load JS** — socle partagé | ≤ 100 Ko | ✅ 79,5 Ko |
| **Middleware** | ≤ 50 Ko | ✅ 34,8 Ko |
| **LCP** (mobile, 75ᵉ centile) | < 2,5 s | ❌ non mesuré, images distantes non optimisées |
| **INP** | < 200 ms | non mesuré |
| **CLS** | < 0,1 | non mesuré |
| Données pédagogiques dans le bundle client | **0 Ko** (chargement à la demande) | ❌ ≈ 95 Ko gzip |
| Polices auto-hébergées | 100 % | ❌ 3 polices distantes, **2 jamais appliquées** |
| Images servies en AVIF/WebP responsive | 100 % | ❌ `unoptimized: true` |
| Requêtes SQL par affichage de page | ≤ 3 | ❌ `/admin` : 6+, non mises en cache |

---

## 6. Fiabilité et exploitation

| # | Critère | Statut |
|---|---|---|
| **O** | Couverture de tests : **≥ 80 %** sur `lib/` (auth, progression, correction, validation) | ❌ 0 % |
| **O** | Tests de bout en bout sur les parcours critiques : inscription → connexion → leçon → quiz → examen → admin | ❌ 0 |
| **O** | CI bloquante : `typecheck` + `lint` + `test` + `build` + `audit` | ❌ absente |
| **O** | `eslint.ignoreDuringBuilds` retiré de `next.config.js` | ❌ actif |
| **O** | `error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx` présents | ❌ aucun |
| **O** | Suivi des erreurs en production (Sentry ou équivalent) | ❌ absent |
| **O** | Sonde de santé `/api/health` (base + application) | ❌ absente |
| **O** | Migrations versionnées, réversibles, avec table de suivi | ❌ script unique |
| **O** | README opérationnel : prérequis, installation, migration, seed, déploiement | ❌ 2 lignes |
| **R** | Journalisation structurée avec identifiant de corrélation | ❌ absente |
| **R** | Sauvegarde PostgreSQL testée et restauration vérifiée | non documenté |
| **R** | Pool de connexions adapté au *serverless* (pooler externe) | ❌ `max: 5` par instance |

---

## 7. Conformité RGPD

| # | Critère | Statut |
|---|---|---|
| **O** | Politique de confidentialité accessible **sans authentification** | ❌ |
| **O** | CGU / CGV et mentions légales | ❌ |
| **O** | Registre des traitements | ❌ |
| **O** | Durée de conservation définie et **appliquée** pour `activity_log` (recommandé : 12 mois, IP anonymisée à 30 j) | ❌ conservation illimitée |
| **O** | Suppression de compte en libre-service (art. 17) | ❌ |
| **O** | Export des données personnelles (art. 20) | ❌ |
| **O** | Aucune ressource tierce chargée avant consentement (Unsplash, Google Fonts) | ❌ 5 images distantes + 3 polices |
| **O** | Minimisation : ne journaliser l'IP que si un besoin de sécurité le justifie, et la tronquer | ❌ IP complète sur **chaque** action |
| **R** | Contenu des requêtes du bac à sable non conservé, ou anonymisé | ❌ conservé en clair (500 car.) |

---

## 8. Contenu et propriété intellectuelle

| # | Critère | Statut |
|---|---|---|
| **O** | Aucun énoncé reproduit depuis une source d'examen tierce | ❌ ~41 énoncés |
| **O** | Aucun document d'*exam dump* dans le dépôt | ❌ `docs/1Z0-071.pdf` |
| **O** | Origine documentée pour chaque question (champ `source`) | ❌ |
| **O** | Mentions marketing vérifiables (« 320+ questions » ⇒ 320 questions **uniques**) | ❌ 224 réelles |
| **R** | Mention de non-affiliation à Oracle Corporation en pied de page | ❌ |
| **R** | Revue pédagogique documentée par un formateur certifié | non documenté |

---

## 9. Référencement et partage

| # | Critère | Statut |
|---|---|---|
| **O** | `metadata` (titre + description) **par page** | ❌ 1 seul, global |
| **O** | `metadataBase` défini | ❌ |
| **O** | `opengraph-image` + carte Twitter | ❌ |
| **O** | `app/robots.ts` et `app/sitemap.ts` | ❌ |
| **R** | `app/manifest.ts` (PWA installable) | ❌ |
| **R** | `hreflang` FR/EN | ❌ |
| **R** | Données structurées `Course` (schema.org) | ❌ |

---

## 10. Définition de « terminé » (*Definition of Done*)

Une évolution n'est considérée comme livrable que si **tous** ces points sont vrais :

- [ ] `npm run typecheck` — 0 erreur
- [ ] `npm run lint` — 0 erreur, 0 avertissement
- [ ] `npm test` — vert, couverture non dégradée
- [ ] `npm run build` — succès **hors ligne** (aucune dépendance réseau au build)
- [ ] `npm audit` — 0 critique, 0 haute
- [ ] Validation automatique des banques de questions — vert (§3.1)
- [ ] `axe-core` — 0 violation *serious* / *critical* sur les pages touchées
- [ ] Budget First Load JS respecté sur les routes touchées
- [ ] Toute chaîne visible passe par le dictionnaire i18n — 0 chaîne en dur
- [ ] Aucun secret ajouté au dépôt
- [ ] Toute nouvelle donnée personnelle est documentée avec sa durée de conservation

---

## 11. Tableau de bord de conformité

| Domaine | Critères obligatoires | Conformes | Taux |
|---|---|---|---|
| Sécurité — authentification | 6 | 0 | **0 %** |
| Sécurité — en-têtes HTTP | 6 | 0 | **0 %** |
| Sécurité — entrées & API | 6 | 1 | **17 %** |
| Sécurité — dépendances | 3 | 0 | **0 %** |
| Intégrité pédagogique | 14 + 5 | 3 | **16 %** |
| Accessibilité AA | 9 | 1 | **11 %** |
| Performance | 9 | 2 | **22 %** |
| Fiabilité & exploitation | 9 | 0 | **0 %** |
| RGPD | 8 | 0 | **0 %** |
| Propriété intellectuelle | 4 | 0 | **0 %** |
| Référencement | 5 | 0 | **0 %** |
| **Global** | **84** | **7** | **8 %** |

> Ce taux n'est pas un jugement sur le travail accompli : l'application **fonctionne**, son architecture est saine et son typage est irréprochable. Il mesure l'écart entre un prototype abouti et un produit commercialisable — écart qui se comble par des ajouts, non par une réécriture.

La trajectoire chiffrée pour passer de 8 % à > 90 % figure dans [`PLAN-ACTION-PREMIUM.md`](./PLAN-ACTION-PREMIUM.md).
