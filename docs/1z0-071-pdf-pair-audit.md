# Audit croisé des PDF 1Z0-071

Date de vérification : 2026-08-20

## Documents

| Fichier | Pages | Questions ou entrées détectées |
| --- | ---: | ---: |
| `1Z0-071.pdf` | 39 | 99 questions numérotées (`01` à `99`) |
| `réponses docx.pdf` | 5 | 48 entrées de corrigé environ, avec références de `1` à `194` |

## Résultat de la comparaison

Les deux PDF ne forment pas une paire question/réponse cohérente.

- Le premier document contient des questions numérotées de `01` à `99`.
- Le second contient des entrées comme `NEW QUESTION 100`, `102`, `105`, `110`, `194`, qui n'existent pas dans le premier PDF.
- Le second document ne contient pas le texte des questions, uniquement une lettre de réponse et une explication courte.
- Les numéros communs ne suffisent pas à établir une correspondance : le contenu et la numérotation du corrigé proviennent manifestement d'une autre série.
- Le premier PDF ne contient pas de corrigé complet exploitable.

## Décision

Le corrigé `réponses docx.pdf` n'est pas fusionné automatiquement avec `1Z0-071.pdf`. Une fusion par numéro pourrait attribuer une réponse correcte à une question différente et dégrader la préparation à l'examen.

La banque anglaise importée depuis le workbook reste la source active de l'application, avec ses questions, réponses et explications associées dans chaque même bloc source.

## Ce qui est nécessaire pour une intégration correcte

Pour intégrer ce second corrigé proprement, il faut fournir l'une des choses suivantes :

1. le PDF ou document contenant les questions correspondant aux références `NEW QUESTION 1` à `NEW QUESTION 194` ;
2. une version du corrigé où chaque entrée contient le texte complet de la question et ses options ;
3. un identifiant stable commun aux deux documents, différent du simple numéro de question.

Sans cette correspondance, les réponses ne doivent pas être injectées dans la banque de questions.
