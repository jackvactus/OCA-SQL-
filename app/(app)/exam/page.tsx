import { ExamClient, type BankSizes } from "@/components/exam-client";
import { certificationTracks } from "@/lib/certification-tracks";
import { getQuestionBank } from "@/lib/quiz-banks";

/**
 * Page d'examen blanc.
 *
 * Elle est volontairement un composant **serveur** : elle calcule ici le
 * nombre de questions disponibles par parcours, et ne transmet que ces
 * chiffres au composant client. Les énoncés — et surtout leurs corrigés — ne
 * quittent plus le serveur avant la remise de la copie (constat PED-04 de
 * `docs/AUDIT-SYSTEME.md`).
 */
export default function ExamPage() {
  const bankSizes: BankSizes = Object.fromEntries(
    certificationTracks.map((track) => [
      track.id,
      {
        fr: getQuestionBank(track.id, "fr").length,
        en: getQuestionBank(track.id, "en").length,
      },
    ]),
  );

  return <ExamClient bankSizes={bankSizes} />;
}
