import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { getLocalizedModules } from "../lib/content-i18n";
import { curricula, allSessionIds } from "../lib/curricula";
import { certificationTracks } from "../lib/certification-tracks";
import { resolveNextStep } from "../lib/current-track";
import { defaultProgress } from "../lib/progress-types";

/**
 * Intégrité des redirections.
 *
 * Un lien mort ne casse rien à la compilation : il se voit en production,
 * quand un apprenant clique et tombe sur une page vide. Ces contrôles
 * reconstruisent la table des routes depuis l'arborescence `app/`, puis
 * confrontent **tous** les liens internes écrits dans le code.
 */

const RACINE = join(__dirname, "..");
const APP = join(RACINE, "app");

/* ------------------------------------------------------------------ */
/*  Table des routes, reconstruite depuis l'arborescence               */
/* ------------------------------------------------------------------ */

function fichiers(racine: string, filtre: (nom: string) => boolean): string[] {
  const sortie: string[] = [];
  const parcourir = (chemin: string) => {
    for (const entree of readdirSync(chemin)) {
      const complet = join(chemin, entree);
      if (statSync(complet).isDirectory()) parcourir(complet);
      else if (filtre(entree)) sortie.push(complet);
    }
  };
  parcourir(racine);
  return sortie;
}

/**
 * Chemin d'une page, tel que le navigateur le voit.
 *
 * Les groupes de routes `(app)` et `(marketing)` organisent les fichiers sans
 * apparaître dans l'URL — les retirer est indispensable, sans quoi aucune
 * route de l'espace connecté ne serait reconnue.
 */
function routeDuFichier(fichier: string): string {
  const segments = relative(APP, fichier).split(sep).slice(0, -1);
  const visibles = segments.filter((s) => !(s.startsWith("(") && s.endsWith(")")));
  return `/${visibles.join("/")}`.replace(/\/+$/, "") || "/";
}

const ROUTES = fichiers(APP, (nom) => nom === "page.tsx").map(routeDuFichier);

/** Motif d'une route, segments dynamiques compris. */
function motifDeRoute(route: string): RegExp {
  const corps = route
    .split("/")
    .map((segment) => {
      if (/^\[\.\.\..+\]$/.test(segment)) return ".+";
      if (/^\[.+\]$/.test(segment)) return "[^/]+";
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  return new RegExp(`^${corps}$`);
}

const MOTIFS = ROUTES.map(motifDeRoute);

/** Vrai si un chemin interne correspond à une page existante. */
function routeExiste(chemin: string): boolean {
  const sansParametres = chemin.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  return MOTIFS.some((motif) => motif.test(sansParametres));
}

test("l'arborescence expose bien les routes attendues", () => {
  for (const attendue of [
    "/",
    "/login",
    "/dashboard",
    "/courses",
    "/courses/[moduleId]",
    "/curriculum",
    "/curriculum/[sessionId]",
    "/quiz",
    "/exam",
    "/sandbox",
    "/reference",
    "/tracks",
    "/tracks/[trackId]",
    "/assistant",
  ]) {
    assert.ok(ROUTES.includes(attendue), `route absente : ${attendue}`);
  }
});

/* ------------------------------------------------------------------ */
/*  Tous les liens internes écrits dans le code                        */
/* ------------------------------------------------------------------ */

/** Un lien écrit en gabarit devient un motif : `${x}` vaut n'importe quoi. */
function cheminDuGabarit(brut: string): string {
  return brut.replace(/\$\{[^}]*\}/g, "x");
}

interface Lien {
  fichier: string;
  ligne: number;
  chemin: string;
}

function liensInternes(): Lien[] {
  const sortie: Lien[] = [];
  const sources = [
    ...fichiers(APP, (n) => n.endsWith(".tsx")),
    ...fichiers(join(RACINE, "components"), (n) => n.endsWith(".tsx")),
  ];

  // `href="/x"`, href={`/x/${y}`}, router.push("/x"), redirect("/x")
  const motifs = [
    /href="(\/[^"]*)"/g,
    /href=\{`(\/[^`]*)`\}/g,
    /(?:router\.(?:push|replace)|redirect)\(\s*"(\/[^"]*)"/g,
    /(?:router\.(?:push|replace)|redirect)\(\s*`(\/[^`]*)`/g,
  ];

  for (const fichier of sources) {
    const source = readFileSync(fichier, "utf-8");
    for (const motif of motifs) {
      motif.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = motif.exec(source))) {
        sortie.push({
          fichier: relative(RACINE, fichier),
          ligne: source.slice(0, m.index).split("\n").length,
          chemin: cheminDuGabarit(m[1]),
        });
      }
    }
  }
  return sortie;
}

test("tout lien interne écrit dans le code mène à une page existante", () => {
  const morts = liensInternes()
    .filter((lien) => !routeExiste(lien.chemin))
    .map((lien) => `${lien.fichier}:${lien.ligne} → ${lien.chemin}`);

  assert.deepEqual([...new Set(morts)], [], `Liens internes sans page :\n  ${morts.join("\n  ")}`);
});

test("aucune navigation ne passe par une adresse absolue de la production", () => {
  // Un lien écrit en dur vers https://oca-sql.vercel.app ou localhost sort de
  // l'application : il recharge la page, perd la session, et casse en
  // développement comme en préproduction.
  //
  // Le contrôle vise les seules formes de navigation. `metadataBase`, dans
  // `app/layout.tsx`, utilise légitimement `http://localhost:3000` comme
  // repli pour construire les URL absolues des métadonnées.
  const fautifs: string[] = [];
  const navigation =
    /(?:href=\{?["'`]|router\.(?:push|replace)\(\s*["'`]|redirect\(\s*["'`])(https?:\/\/(?:oca-sql\.vercel\.app|localhost:\d+)[^"'`]*)/g;

  for (const fichier of [
    ...fichiers(APP, (n) => n.endsWith(".tsx")),
    ...fichiers(join(RACINE, "components"), (n) => n.endsWith(".tsx")),
  ]) {
    const source = readFileSync(fichier, "utf-8");
    navigation.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = navigation.exec(source))) {
      fautifs.push(`${relative(RACINE, fichier)} → ${m[1]}`);
    }
  }
  assert.deepEqual(fautifs, []);
});

/* ------------------------------------------------------------------ */
/*  Les identifiants visés par les liens dynamiques                    */
/* ------------------------------------------------------------------ */

test("les modules ont des identifiants uniques et bien formés", () => {
  const modules = getLocalizedModules("fr");
  assert.ok(modules.length > 0);

  const ids = modules.map((m) => m.id);
  assert.deepEqual([...new Set(ids)], ids, "identifiants de module en double");
  for (const id of ids) {
    assert.match(id, /^m\d+$/, `identifiant de module inattendu : ${id}`);
  }
});

test("les leçons ont des identifiants uniques dans toute l'application", () => {
  // Les identifiants de leçon servent de clés de progression : un doublon
  // ferait passer deux leçons pour terminées d'un seul clic.
  const ids = getLocalizedModules("fr").flatMap((m) => m.lessons.map((l) => l.id));
  const doublons = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual([...new Set(doublons)], []);
});

test("aucun identifiant de leçon n'entre en collision avec un identifiant de session", () => {
  // `completedLessons` mélange les deux : une collision terminerait une
  // session de cursus en validant une leçon SQL.
  const lecons = new Set(getLocalizedModules("fr").flatMap((m) => m.lessons.map((l) => l.id)));
  const collisions = allSessionIds.filter((id) => lecons.has(id));
  assert.deepEqual(collisions, []);
});

test("les deux langues décrivent les mêmes modules et les mêmes leçons", () => {
  // Une divergence ferait pointer un lien valide en français vers un module
  // inexistant en anglais.
  const fr = getLocalizedModules("fr");
  const en = getLocalizedModules("en");
  assert.deepEqual(
    en.map((m) => m.id),
    fr.map((m) => m.id),
  );
  fr.forEach((module, i) => {
    assert.deepEqual(
      en[i].lessons.map((l) => l.id),
      module.lessons.map((l) => l.id),
      `leçons divergentes pour ${module.id}`,
    );
  });
});

/* ------------------------------------------------------------------ */
/*  La reprise du parcours                                             */
/* ------------------------------------------------------------------ */

const MODULES = getLocalizedModules("fr");

test("la reprise mène à une page existante pour chaque parcours, vide ou terminé", () => {
  const toutTermine = {
    ...defaultProgress,
    completedLessons: [...MODULES.flatMap((m) => m.lessons.map((l) => l.id)), ...allSessionIds],
  };

  for (const track of certificationTracks) {
    for (const [etat, progress] of [
      ["débutant", defaultProgress],
      ["terminé", toutTermine],
    ] as const) {
      for (const locale of ["fr", "en"] as const) {
        const etape = resolveNextStep(track.id, progress, locale, MODULES);
        assert.ok(
          routeExiste(etape.href),
          `${track.id} / ${etat} / ${locale} → ${etape.href} ne correspond à aucune page`,
        );
        assert.ok(etape.label.trim().length > 0, `${track.id} / ${etat} : intitulé vide`);
      }
    }
  }
});

test("la reprise vise le parcours demandé, pas le SQL par défaut", () => {
  // C'est le défaut d'origine : le bouton « continuer » ramenait tout le monde
  // sur /courses, c'est-à-dire les modules SQL.
  for (const curriculum of curricula) {
    if (curriculum.id === "oca-sql") continue;
    const etape = resolveNextStep(curriculum.id, defaultProgress, "fr", MODULES);
    assert.ok(
      etape.href.startsWith("/curriculum/"),
      `${curriculum.id} renvoie vers ${etape.href}`,
    );
    const sessionId = etape.href.slice("/curriculum/".length);
    assert.ok(
      curriculum.sessions.some((s) => s.id === sessionId),
      `${etape.href} ne correspond à aucune session de ${curriculum.id}`,
    );
  }
});

test("la reprise du SQL avance module par module", () => {
  const premier = resolveNextStep("oca-sql", defaultProgress, "fr", MODULES);
  assert.equal(premier.href, `/courses/${MODULES[0].id}`);
  assert.equal(premier.complete, false);

  // Premier module terminé : la reprise doit désigner le deuxième.
  const apresPremier = {
    ...defaultProgress,
    completedLessons: MODULES[0].lessons.map((l) => l.id),
  };
  assert.equal(
    resolveNextStep("oca-sql", apresPremier, "fr", MODULES).href,
    `/courses/${MODULES[1].id}`,
  );

  // Tout terminé : la vue d'ensemble, signalée comme telle.
  const tout = {
    ...defaultProgress,
    completedLessons: MODULES.flatMap((m) => m.lessons.map((l) => l.id)),
  };
  const fini = resolveNextStep("oca-sql", tout, "fr", MODULES);
  assert.equal(fini.href, "/courses");
  assert.equal(fini.complete, true);
});

test("une session de cursus terminée ne bloque pas la progression", () => {
  const cursus = curricula.find((c) => c.id !== "oca-sql")!;
  const progression = {
    ...defaultProgress,
    completedLessons: [cursus.sessions[0].id],
  };
  const etape = resolveNextStep(cursus.id, progression, "fr", MODULES);
  assert.equal(etape.href, `/curriculum/${cursus.sessions[1].id}`);
});

test("un parcours inconnu renvoie au choix des parcours, sans deviner", () => {
  // @ts-expect-error — on éprouve volontairement une valeur hors du type.
  const etape = resolveNextStep("parcours-inexistant", defaultProgress, "fr", MODULES);
  assert.equal(etape.href, "/tracks");
  assert.ok(routeExiste(etape.href));
});

/* ------------------------------------------------------------------ */
/*  La page des modules                                                */
/* ------------------------------------------------------------------ */

const PAGE_COURS = readFileSync(join(APP, "(app)", "courses", "page.tsx"), "utf-8");
const PAGE_MODULE = readFileSync(join(APP, "(app)", "courses", "[moduleId]", "page.tsx"), "utf-8");

test("la page des modules signale qu'on est hors de son parcours et offre le retour", () => {
  assert.match(PAGE_COURS, /horsParcours/);
  assert.match(PAGE_COURS, /resolveNextStep/);
  assert.match(PAGE_COURS, /repriseParcours\.href/);
});

test("un module inconnu affiche un message et un retour, sans planter", () => {
  assert.match(PAGE_MODULE, /if \(!currentModule\)/);
  assert.match(PAGE_MODULE, /Module introuvable|Module not found/);
  assert.match(PAGE_MODULE, /href="\/courses"/);
});

test("la leçon ouverte est portée par l'URL", () => {
  // Les flèches « précédent » et « suivant » pointaient toutes deux vers la
  // page elle-même : le bouton Retour quittait le module, et copier le lien
  // ramenait à la première leçon non terminée.
  assert.match(PAGE_MODULE, /\?lesson=\$\{prevLesson\.id\}/);
  assert.match(PAGE_MODULE, /\?lesson=\$\{nextLesson\.id\}/);
  assert.match(PAGE_MODULE, /addEventListener\("popstate"/);
  assert.match(PAGE_MODULE, /history\.pushState/);
});
