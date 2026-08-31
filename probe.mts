import { answerQuestion } from "./lib/assistant/answer";

const questions = [
  "Quelle est la différence entre WHERE et HAVING ?",
  "Pourquoi NOT IN ne renvoie rien avec un NULL ?",
  "Comment fonctionne une jointure externe ?",
  "A quoi sert NVL2 ?",
  "Qu'est-ce qu'un Data Guard broker ?",
  "asdkjhaskdjh zzz",
];
for (const q of questions) {
  const r = await answerQuestion(q, { path: "/", track: "oca-sql", locale: "fr" });
  console.log("=".repeat(70));
  console.log("Q:", q);
  console.log(r.text.slice(0, 260).replace(/\n/g, " | "));
  console.log("SOURCES:", r.sources.map((s) => s.label.slice(0, 55)).join(" // "));
  console.log("SQL:", r.sql.map((s) => `${s.runnable ? "OK" : "KO"} ${s.query.slice(0, 45)}`).join(" ~~ "));
}
