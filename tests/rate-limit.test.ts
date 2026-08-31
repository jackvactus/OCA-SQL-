import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { rateLimit, clientIp, resetRateLimits } from "../lib/rate-limit";

beforeEach(() => resetRateLimits());

test("les tentatives sous la limite passent", () => {
  for (let i = 0; i < 5; i++) {
    const r = rateLimit("cle-a", { limit: 5, windowMs: 60_000 });
    assert.equal(r.ok, true, `tentative ${i + 1} refusée`);
  }
});

test("la tentative au-delà de la limite est refusée avec un délai", () => {
  for (let i = 0; i < 5; i++) rateLimit("cle-b", { limit: 5, windowMs: 60_000 });
  const r = rateLimit("cle-b", { limit: 5, windowMs: 60_000 });
  assert.equal(r.ok, false);
  assert.ok(r.retryAfterSeconds > 0);
});

test("le compteur reste attaché à sa clé", () => {
  for (let i = 0; i < 6; i++) rateLimit("cle-c", { limit: 5, windowMs: 60_000 });
  const autre = rateLimit("cle-d", { limit: 5, windowMs: 60_000 });
  assert.equal(autre.ok, true, "une clé bloquée ne doit pas en bloquer une autre");
});

test("une fois bloquée, la clé le reste jusqu'à l'expiration", () => {
  const opts = { limit: 2, windowMs: 60_000, blockMs: 60_000 };
  rateLimit("cle-e", opts);
  rateLimit("cle-e", opts);
  assert.equal(rateLimit("cle-e", opts).ok, false);
  assert.equal(rateLimit("cle-e", opts).ok, false, "le blocage doit persister");
});

test("la fenêtre glisse : d'anciennes tentatives cessent de compter", async () => {
  const opts = { limit: 2, windowMs: 40, blockMs: 40 };
  rateLimit("cle-f", opts);
  rateLimit("cle-f", opts);
  assert.equal(rateLimit("cle-f", opts).ok, false);
  await new Promise((r) => setTimeout(r, 80));
  assert.equal(rateLimit("cle-f", opts).ok, true, "la fenêtre aurait dû se vider");
});

test("le décompte restant est exact", () => {
  const opts = { limit: 3, windowMs: 60_000 };
  assert.equal(rateLimit("cle-g", opts).remaining, 2);
  assert.equal(rateLimit("cle-g", opts).remaining, 1);
  assert.equal(rateLimit("cle-g", opts).remaining, 0);
});

test("clientIp retient la première adresse de x-forwarded-for", () => {
  const r = new Request("https://exemple.test", {
    headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1, 10.0.0.2" },
  });
  assert.equal(clientIp(r), "203.0.113.7");
});

test("clientIp bascule sur x-real-ip, puis sur une valeur par défaut", () => {
  assert.equal(
    clientIp(new Request("https://exemple.test", { headers: { "x-real-ip": "198.51.100.4" } })),
    "198.51.100.4",
  );
  assert.equal(clientIp(new Request("https://exemple.test")), "inconnu");
});
