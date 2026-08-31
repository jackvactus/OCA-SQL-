/**
 * Limitation de débit à fenêtre glissante, en mémoire.
 *
 * Couvre le constat SEC-03 de `docs/AUDIT-SYSTEME.md` : les routes
 * d'authentification acceptaient un nombre illimité de tentatives, ce qui rend
 * une attaque par force brute triviale malgré bcrypt.
 *
 * Limite volontairement assumée : l'état vit dans le processus. Derrière
 * plusieurs instances, chacune applique sa propre fenêtre — la protection est
 * donc divisée par le nombre d'instances. C'est suffisant pour freiner une
 * attaque automatisée depuis une seule adresse ; une protection réellement
 * distribuée demanderait Redis ou le pare-feu applicatif de l'hébergeur.
 */

interface Fenetre {
  /** Horodatages des tentatives retenues, en millisecondes. */
  hits: number[];
  /** Fin du blocage en cours, en millisecondes, ou 0. */
  blockedUntil: number;
}

const buckets = new Map<string, Fenetre>();

/** Au-delà, on purge les entrées expirées pour éviter une fuite mémoire. */
const PURGE_THRESHOLD = 5_000;

function purge(now: number) {
  for (const [key, f] of buckets) {
    if (f.blockedUntil > now) continue;
    if (f.hits.length === 0 || now - f.hits[f.hits.length - 1] > 3_600_000) {
      buckets.delete(key);
    }
  }
}

export interface RateLimitOptions {
  /** Nombre de tentatives autorisées dans la fenêtre. */
  limit: number;
  /** Largeur de la fenêtre, en millisecondes. */
  windowMs: number;
  /** Durée du blocage une fois la limite franchie. Par défaut : `windowMs`. */
  blockMs?: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Tentatives encore disponibles dans la fenêtre. */
  remaining: number;
  /** Secondes à attendre avant de réessayer, quand `ok` vaut `false`. */
  retryAfterSeconds: number;
}

/**
 * Enregistre une tentative pour `key` et indique si elle est autorisée.
 *
 * L'appel compte la tentative : il faut donc l'invoquer une seule fois par
 * requête, avant tout traitement coûteux.
 */
export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const { limit, windowMs } = options;
  const blockMs = options.blockMs ?? windowMs;
  const now = Date.now();

  if (buckets.size > PURGE_THRESHOLD) purge(now);

  let f = buckets.get(key);
  if (!f) {
    f = { hits: [], blockedUntil: 0 };
    buckets.set(key, f);
  }

  if (f.blockedUntil > now) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((f.blockedUntil - now) / 1000),
    };
  }

  const debut = now - windowMs;
  f.hits = f.hits.filter((t) => t > debut);
  f.hits.push(now);

  if (f.hits.length > limit) {
    f.blockedUntil = now + blockMs;
    f.hits = [];
    return { ok: false, remaining: 0, retryAfterSeconds: Math.ceil(blockMs / 1000) };
  }

  return { ok: true, remaining: limit - f.hits.length, retryAfterSeconds: 0 };
}

/**
 * Adresse de l'appelant, telle que la voit l'application.
 *
 * Derrière un proxy de confiance, `x-forwarded-for` porte la vraie adresse en
 * première position. On ne retient que celle-là : les suivantes sont ajoutées
 * par les intermédiaires et un client peut en forger.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "inconnu";
}

/** Réponse normalisée quand la limite est franchie. */
export function tooManyRequests(retryAfterSeconds: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: {
      "content-type": "application/json",
      "retry-after": String(retryAfterSeconds),
    },
  });
}

/** Remise à zéro — réservée aux tests. */
export function resetRateLimits() {
  buckets.clear();
}
