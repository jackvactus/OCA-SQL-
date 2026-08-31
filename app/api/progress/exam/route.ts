import { NextResponse } from "next/server";

/**
 * Route retirée.
 *
 * Elle acceptait un score transmis par le navigateur (`{ score, total, time }`)
 * et l'enregistrait tel quel : n'importe qui pouvait déclarer un sans-faute
 * d'un simple appel `fetch`. C'est le constat PED-04 de
 * `docs/AUDIT-SYSTEME.md`.
 *
 * La correction se fait désormais côté serveur, dans `POST /api/exam/submit`,
 * à partir des questions tirées et mémorisées par `POST /api/exam/start`.
 *
 * La route est conservée le temps qu'un onglet resté ouvert sur l'ancienne
 * version cesse de l'appeler ; elle répond 410 plutôt que de disparaître, pour
 * que la cause soit lisible dans les journaux.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Cette route n'enregistre plus de score. La correction est faite par le serveur : utilisez /api/exam/submit.",
    },
    { status: 410 },
  );
}
