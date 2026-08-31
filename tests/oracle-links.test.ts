import { test } from "node:test";
import assert from "node:assert/strict";

import { certificationTracks } from "../lib/certification-tracks";

/**
 * Contrôles sur les liens sortants vers Oracle.
 *
 * Ils ne peuvent pas prouver qu'une page existe — cela demanderait un accès
 * réseau — mais ils verrouillent tout ce qui est vérifiable hors ligne : le
 * protocole, le domaine, la forme canonique de l'URL d'examen, et surtout
 * l'absence de deux liens identiques sur des parcours différents, qui est le
 * signe d'un identifiant recopié plutôt que vérifié.
 */

const DOMAINES = ["education.oracle.com", "mylearn.oracle.com", "docs.oracle.com"];

function hote(url: string): string {
  return new URL(url).hostname;
}

test("tous les liens Oracle sont en HTTPS et sur un domaine Oracle", () => {
  for (const track of certificationTracks) {
    const liens = [track.officialExamUrl, track.officialDocsUrl, track.officialLearningUrl].filter(
      (u): u is string => Boolean(u),
    );
    for (const url of liens) {
      assert.ok(url.startsWith("https://"), `${track.examCode} : ${url} n'est pas en HTTPS`);
      assert.ok(
        DOMAINES.includes(hote(url)),
        `${track.examCode} : ${hote(url)} n'est pas un domaine Oracle attendu`,
      );
    }
  }
});

test("l'URL d'examen suit la forme canonique et porte le bon code", () => {
  for (const track of certificationTracks) {
    const url = track.officialExamUrl;
    assert.equal(hote(url), "education.oracle.com", `${track.examCode} : mauvais domaine`);
    assert.ok(
      url.endsWith(`/pexam_${track.examCode}`),
      `${track.examCode} : l'URL devrait se terminer par /pexam_${track.examCode} — ${url}`,
    );
    // Le segment de titre doit être en minuscules, sans espace ni accent.
    const slug = new URL(url).pathname.split("/").filter(Boolean)[0];
    assert.ok(
      /^[a-z0-9-]+$/.test(slug),
      `${track.examCode} : segment de titre non canonique « ${slug} »`,
    );
  }
});

test("l'URL de documentation pointe un manuel Oracle Database 19c", () => {
  for (const track of certificationTracks) {
    const url = track.officialDocsUrl;
    assert.ok(
      url.startsWith("https://docs.oracle.com/en/database/oracle/oracle-database/19/"),
      `${track.examCode} : ${url} n'est pas un manuel 19c`,
    );
    assert.ok(url.endsWith("/"), `${track.examCode} : le raccourci de manuel doit finir par /`);
  }
});

test("aucun lien n'est recopié d'un parcours à l'autre", () => {
  // Un identifiant de catalogue partagé par plusieurs parcours trahit une
  // valeur devinée : c'est exactement le défaut trouvé le 31 août 2026, où le
  // même identifiant MyLearn servait aux trois spécialisations.
  for (const champ of ["officialExamUrl", "officialLearningUrl", "officialDocsUrl"] as const) {
    const vus = new Map<string, string>();
    for (const track of certificationTracks) {
      const url = track[champ];
      if (!url) continue;
      const deja = vus.get(url);
      assert.equal(
        deja,
        undefined,
        `${champ} identique pour ${deja} et ${track.examCode} : ${url}`,
      );
      vus.set(url, track.examCode);
    }
  }
});

test("chaque parcours expose au moins deux ressources officielles", () => {
  for (const track of certificationTracks) {
    const liens = [track.officialExamUrl, track.officialDocsUrl, track.officialLearningUrl].filter(
      Boolean,
    );
    assert.ok(liens.length >= 2, `${track.examCode} : seulement ${liens.length} ressource(s)`);
  }
});
