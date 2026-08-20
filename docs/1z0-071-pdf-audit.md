# Audit du PDF 1Z0-071

Date de lecture : 2026-08-20

## Fichier analysé

- `docs/1Z0-071.pdf`
- 39 pages
- 99 questions numérotées détectées
- 288 lignes de propositions A-D détectées
- Aucun corrigé structuré détecté (`Answer:`, `Correct answer:`, `Explanation:`)

## Thèmes couverts

Le PDF contient des scénarios et questions Oracle SQL sur :

- `ALTER TABLE`, colonnes UNUSED et contraintes
- modèles relationnels et relations many-to-many
- `FLASHBACK TABLE ... BEFORE DROP`
- sous-requêtes corrélées et ordre d'évaluation
- privilèges système et privilèges objet
- clés primaires, clés étrangères, contraintes désactivées et déléguées
- jointures, agrégats, `COUNT`, `CASE`, `NULL`
- vues, index, séquences et objets de schéma
- DML avancé et mises à jour multi-colonnes
- sous-requêtes multi-colonnes
- fonctions de date et de fuseau horaire

## Décision d'intégration

Le PDF n'est pas importé comme banque corrigée : il ne fournit pas les réponses et plusieurs questions semblent être du contenu d'examen ou de banque d'examen dont l'origine et les droits ne sont pas vérifiables. Importer ces énoncés sans corrigé créerait un risque pédagogique élevé : réponses inventées, corrections erronées et apprentissage de contenu non autorisé.

Les thèmes ont été comparés à la banque anglaise issue du workbook. Les domaines importants sont déjà couverts par les 320 questions importées. Le PDF sert donc de checklist de couverture et de source de sujets à vérifier dans la documentation Oracle officielle, pas de source de copie des questions.

## Références de vérification

- Oracle SQL Language Reference : https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/
- Oracle Database SQL certification page : https://education.oracle.com/oracle-database-sql/pexam_1Z0-071

Les règles, la durée, le nombre de questions et le seuil de réussite peuvent évoluer. La fiche Oracle officielle reste la référence avant toute session d'examen.
