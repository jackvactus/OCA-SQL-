import type { CourseSession } from "./course-oca-sql";

/**
 * Cursus 1Z0-084 — sessions 11 à 13.
 *
 * Ces trois sessions couvrent les domaines officiels que les dix premières
 * n'abordaient pas : « Reducing the Cost of SQL Operations », « Using Real
 * Application Testing », et le détail de « Tuning the Buffer Cache » et
 * « Tuning PGA » (large table caching, Flash Cache, tablespaces temporaires).
 */
export const tuningSessionsB: CourseSession[] = [
  {
    id: "tun-session-11",
    number: 11,
    title: {
      fr: "Réduire le coût des opérations SQL",
      en: "Reducing the cost of SQL operations",
    },
    summary: {
      fr: "Une requête peut être parfaitement écrite et rester lente parce que les données sont mal rangées. Chaînage, migration, espace perdu, index inadaptés, absence de compression : autant de coûts que l'optimiseur subit sans pouvoir les corriger.",
      en: "A query can be perfectly written and still be slow because the data is badly laid out. Chaining, migration, wasted space, unsuitable indexes, no compression: costs the optimizer endures without being able to fix them.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "tun-11-1",
        number: "11.1",
        title: { fr: "Chaînage et migration de lignes", en: "Row chaining and row migration" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Deux phénomènes distincts sont souvent confondus, alors qu'ils n'ont ni la même cause ni le même remède. Le **chaînage** survient quand une ligne est trop grosse pour tenir dans un seul bloc : Oracle n'a pas le choix, il la répartit sur plusieurs blocs chaînés. La **migration** survient quand une ligne, mise à jour, ne tient plus dans son bloc d'origine : Oracle la déplace entièrement ailleurs et laisse un pointeur derrière elle.",
              en: "Two distinct phenomena are often confused, although they share neither cause nor remedy. **Chaining** happens when a row is too large to fit in one block: Oracle has no choice, it spreads the row across several chained blocks. **Migration** happens when an updated row no longer fits in its original block: Oracle moves it entirely elsewhere and leaves a pointer behind.",
            },
          },
          {
            kind: "figure",
            src: "/art/oracle-row-chaining.svg",
            alt: {
              fr: "Comparaison entre une ligne chaînée, répartie sur deux blocs, et une ligne migrée, déplacée avec un pointeur laissé en place",
              en: "Comparison between a chained row spread over two blocks and a migrated row moved elsewhere with a pointer left behind",
            },
            caption: {
              fr: "À gauche le chaînage : la ligne ne tient pas dans un bloc. À droite la migration : la ligne tenait, puis a grossi. Le second cas coûte deux lectures là où une suffisait.",
              en: "Left, chaining: the row does not fit in one block. Right, migration: the row used to fit, then grew. The second case costs two reads where one would do.",
            },
            width: 800,
            height: 420,
          },
          {
            kind: "table",
            title: { fr: "Distinguer les deux", en: "Telling them apart" },
            headers: [
              { fr: "", en: "" },
              { fr: "Chaînage", en: "Chaining" },
              { fr: "Migration", en: "Migration" },
            ],
            rows: [
              [
                { fr: "Cause", en: "Cause" },
                { fr: "Ligne plus grande qu'un bloc, ou plus de 255 colonnes", en: "Row larger than a block, or more than 255 columns" },
                { fr: "UPDATE qui fait grossir une ligne au-delà de l'espace libre du bloc", en: "An UPDATE growing a row beyond the block's free space" },
              ],
              [
                { fr: "Évitable ?", en: "Avoidable?" },
                { fr: "Non, sauf en changeant la taille de bloc ou le modèle", en: "No, unless you change the block size or the model" },
                { fr: "**Oui**, par un PCTFREE suffisant", en: "**Yes**, with an adequate PCTFREE" },
              ],
              [
                { fr: "Remède", en: "Remedy" },
                { fr: "Bloc plus grand, LOB hors ligne, découpage de la table", en: "Larger block, out-of-line LOBs, splitting the table" },
                { fr: "ALTER TABLE … MOVE, ou shrink, avec PCTFREE relevé", en: "ALTER TABLE … MOVE, or shrink, with PCTFREE raised" },
              ],
              [
                { fr: "Coût à la lecture", en: "Read cost" },
                { fr: "Inévitable", en: "Unavoidable" },
                { fr: "**Une lecture de bloc supplémentaire par ligne**", en: "**One extra block read per row**" },
              ],
            ],
          },
          {
            kind: "code",
            title: { fr: "Mesurer avant d'agir", en: "Measure before acting" },
            code: `-- 1. Le compteur global : lignes lues par pointeur de chainage ou migration
SELECT name, value FROM v$sysstat
WHERE  name = 'table fetch continued row';

-- 2. Recenser precisement les lignes concernees
@?/rdbms/admin/utlchain.sql          -- cree la table CHAINED_ROWS

ANALYZE TABLE commandes LIST CHAINED ROWS INTO chained_rows;

SELECT owner_name, table_name, COUNT(*) AS lignes
FROM   chained_rows GROUP BY owner_name, table_name;

-- 3. Statistiques de la table : CHAIN_CNT
SELECT table_name, num_rows, chain_cnt,
       ROUND(100 * chain_cnt / NULLIF(num_rows,0), 2) AS pct
FROM   user_tables WHERE table_name = 'COMMANDES';`,
            caption: {
              fr: "« table fetch continued row » qui progresse vite par rapport à « table fetch by rowid » est le signal. En dessous de 1 % des lignes, le jeu n'en vaut pas la chandelle.",
              en: "“table fetch continued row” growing fast relative to “table fetch by rowid” is the signal. Below 1 % of rows, it is not worth the effort.",
            },
          },
          {
            kind: "compare",
            title: { fr: "Réparer la migration", en: "Fixing migration" },
            wrong: `-- Reorganiser sans corriger PCTFREE :
-- le probleme revient en quelques semaines.
ALTER TABLE commandes MOVE;
ALTER INDEX commandes_pk REBUILD;`,
            right: `-- Corriger la CAUSE, puis reorganiser :
ALTER TABLE commandes PCTFREE 20;
ALTER TABLE commandes MOVE ONLINE;   -- 12.2+, sans blocage
-- MOVE ONLINE maintient les index : pas de REBUILD.
SELECT status FROM user_indexes WHERE table_name='COMMANDES';`,
            note: {
              fr: "PCTFREE réserve, dans chaque bloc, la place que les UPDATE futurs consommeront. Une table dont les colonnes se remplissent progressivement — un statut vide puis renseigné, un commentaire ajouté — mérite 20 à 30 %. Une table en insertion pure peut descendre à 0.",
              en: "PCTFREE reserves, in every block, the room future UPDATEs will consume. A table whose columns fill in gradually — an empty then populated status, a comment added later — deserves 20 to 30 %. An insert-only table can go down to 0.",
            },
          },
          {
            kind: "warning",
            title: { fr: "Le seuil des 255 colonnes", en: "The 255-column threshold" },
            body: {
              fr: "Une ligne de plus de 255 colonnes est **toujours** chaînée, quelle que soit sa taille : Oracle stocke les colonnes par tranches de 255 dans des morceaux de ligne distincts. Une table à 300 colonnes paiera une lecture supplémentaire dès qu'une requête touche une colonne au-delà de la 255ᵉ — placer les colonnes les plus consultées en tête du CREATE TABLE est alors une optimisation réelle.",
              en: "A row with more than 255 columns is **always** chained, whatever its size: Oracle stores columns in 255-column pieces in separate row chunks. A 300-column table pays an extra read as soon as a query touches a column beyond the 255th — putting the most-queried columns first in the CREATE TABLE is then a real optimisation.",
            },
          },
        ],
      },
      {
        id: "tun-11-2",
        number: "11.2",
        title: { fr: "Compacter les segments et récupérer l'espace", en: "Shrinking segments and reclaiming space" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Une table où l'on a supprimé la moitié des lignes occupe toujours autant de blocs : la high water mark, la limite haute jamais redescendue, ne bouge pas d'elle-même. Or un balayage complet lit **tous** les blocs jusqu'à cette limite, y compris les blocs devenus vides. Une table de 10 Go dont il ne reste que 1 Go de données se balaie encore en 10 Go.",
              en: "A table from which half the rows were deleted still occupies as many blocks: the high water mark, the high boundary that never comes back down, does not move by itself. Yet a full scan reads **every** block up to that mark, empty blocks included. A 10 GB table holding only 1 GB of data still scans as 10 GB.",
            },
          },
          {
            kind: "table",
            title: { fr: "Trois façons de récupérer l'espace", en: "Three ways to reclaim space" },
            headers: [
              { fr: "Méthode", en: "Method" },
              { fr: "En ligne ?", en: "Online?" },
              { fr: "Index", en: "Indexes" },
              { fr: "Prérequis", en: "Prerequisite" },
            ],
            rows: [
              [
                { fr: "ALTER TABLE … SHRINK SPACE", en: "ALTER TABLE … SHRINK SPACE" },
                { fr: "Oui", en: "Yes" },
                { fr: "Maintenus automatiquement", en: "Maintained automatically" },
                { fr: "ASSM + ROW MOVEMENT activé", en: "ASSM + ROW MOVEMENT enabled" },
              ],
              [
                { fr: "ALTER TABLE … MOVE ONLINE", en: "ALTER TABLE … MOVE ONLINE" },
                { fr: "Oui (12.2+)", en: "Yes (12.2+)" },
                { fr: "Maintenus", en: "Maintained" },
                { fr: "Espace libre équivalent à la table", en: "Free space equal to the table" },
              ],
              [
                { fr: "ALTER TABLE … MOVE", en: "ALTER TABLE … MOVE" },
                { fr: "Non — verrou exclusif", en: "No — exclusive lock" },
                { fr: "**Invalidés**, à reconstruire", en: "**Invalidated**, must be rebuilt" },
                { fr: "Espace libre équivalent", en: "Equivalent free space" },
              ],
            ],
          },
          {
            kind: "code",
            title: { fr: "Le shrink en deux temps", en: "The two-phase shrink" },
            code: `-- Prerequis absolus
SELECT segment_space_management FROM dba_tablespaces
WHERE  tablespace_name = 'USERS';        -- doit valoir AUTO
ALTER TABLE commandes ENABLE ROW MOVEMENT;

-- Phase 1 : compacter les lignes, SANS deplacer la high water mark.
-- En ligne, interruptible, faible impact.
ALTER TABLE commandes SHRINK SPACE COMPACT;

-- Phase 2 : abaisser la high water mark.
-- Verrou exclusif TRES bref -- a faire en periode creuse.
ALTER TABLE commandes SHRINK SPACE;

-- Table et tous ses index dependants
ALTER TABLE commandes SHRINK SPACE CASCADE;`,
            caption: {
              fr: "Découper en deux permet de faire le gros du travail en journée et de ne réserver que la seconde d'exclusivité à une fenêtre creuse.",
              en: "Splitting in two lets you do the bulk of the work during the day and reserve only the brief exclusive moment for a quiet window.",
            },
          },
          {
            kind: "code",
            title: { fr: "Combien y a-t-il à récupérer ?", en: "How much is there to reclaim?" },
            code: `-- Le Segment Advisor chiffre le gain AVANT d'agir
DECLARE
  tache  VARCHAR2(60) := 'advis_commandes';
  objet  NUMBER;
BEGIN
  DBMS_ADVISOR.CREATE_TASK('Segment Advisor', tache);
  DBMS_ADVISOR.CREATE_OBJECT(tache, 'TABLE', USER, 'COMMANDES', NULL, objet);
  DBMS_ADVISOR.SET_TASK_PARAMETER(tache, 'RECOMMEND_ALL', 'TRUE');
  DBMS_ADVISOR.EXECUTE_TASK(tache);
END;
/

SELECT o.attr2 AS objet, f.message, f.more_info
FROM   dba_advisor_findings f
       JOIN dba_advisor_objects o ON f.object_id = o.object_id
                                 AND f.task_name = o.task_name
WHERE  f.task_name = 'advis_commandes';

-- Recommandations produites par la tache automatique nocturne
SELECT tablespace_name, segment_name, recommendations, task_id
FROM   dba_advisor_sqlw_objects;`,
          },
          {
            kind: "warning",
            body: {
              fr: "`SHRINK SPACE` déplace des lignes : leurs ROWID changent. Toute application qui mémorise un ROWID entre deux transactions le verra devenir invalide — c'est précisément pourquoi `ENABLE ROW MOVEMENT` est un prérequis explicite plutôt qu'un comportement par défaut.",
              en: "`SHRINK SPACE` moves rows: their ROWIDs change. Any application caching a ROWID between transactions will find it invalid — which is exactly why `ENABLE ROW MOVEMENT` is an explicit prerequisite rather than default behaviour.",
            },
          },
        ],
      },
      {
        id: "tun-11-3",
        number: "11.3",
        title: { fr: "Options de performance des index et des tables", en: "Index and table performance options" },
        blocks: [
          {
            kind: "table",
            title: { fr: "Choisir le bon type d'index", en: "Choosing the right index type" },
            headers: [
              { fr: "Type", en: "Type" },
              { fr: "Quand", en: "When" },
              { fr: "Piège", en: "Pitfall" },
            ],
            rows: [
              [
                { fr: "B-tree", en: "B-tree" },
                { fr: "Le cas général : forte sélectivité, valeurs variées", en: "The general case: high selectivity, varied values" },
                { fr: "Bloc terminal chaud sur une clé croissante", en: "Hot trailing block on an ascending key" },
              ],
              [
                { fr: "Bitmap", en: "Bitmap" },
                { fr: "Faible cardinalité, entrepôt de données, lecture dominante", en: "Low cardinality, data warehouse, read-mostly" },
                { fr: "**Verrouille des milliers de lignes par DML** — proscrit en OLTP", en: "**Locks thousands of rows per DML** — banned in OLTP" },
              ],
              [
                { fr: "Reverse key", en: "Reverse key" },
                { fr: "Clé croissante très concurrente, notamment en RAC", en: "Highly concurrent ascending key, notably in RAC" },
                { fr: "Interdit les parcours par intervalle (BETWEEN, >)", en: "Rules out range scans (BETWEEN, >)" },
              ],
              [
                { fr: "Function-based", en: "Function-based" },
                { fr: "Prédicat sur une expression : UPPER(nom), TRUNC(date)", en: "Predicate on an expression: UPPER(name), TRUNC(date)" },
                { fr: "Exige QUERY REWRITE et une fonction DETERMINISTIC", en: "Requires QUERY REWRITE and a DETERMINISTIC function" },
              ],
              [
                { fr: "Composite", en: "Composite" },
                { fr: "Plusieurs colonnes filtrées ensemble", en: "Several columns filtered together" },
                { fr: "L'ordre des colonnes décide de son utilité", en: "Column order decides its usefulness" },
              ],
              [
                { fr: "Index-organized table", en: "Index-organized table" },
                { fr: "Accès quasi exclusivement par clé primaire", en: "Access almost exclusively by primary key" },
                { fr: "Segment de débordement si les lignes sont larges", en: "Overflow segment if rows are wide" },
              ],
            ],
          },
          {
            kind: "code",
            title: { fr: "L'index couvrant : éviter le retour à la table", en: "The covering index: avoiding the table visit" },
            code: `-- Chaque ligne trouvee dans l'index coute un acces supplementaire
-- a la table pour lire les colonnes manquantes.
SELECT client_id, montant FROM commandes WHERE statut = 'OUVERT';
-- INDEX RANGE SCAN + TABLE ACCESS BY INDEX ROWID

-- En ajoutant les colonnes projetees a l'index, la table n'est plus lue :
CREATE INDEX cmd_statut_i ON commandes(statut, client_id, montant);
-- INDEX RANGE SCAN seul -- le plan ne touche plus la table.`,
            caption: {
              fr: "Un index couvrant transforme deux structures lues en une seule. Le prix : un index plus gros et un DML légèrement plus lent. À réserver aux requêtes vraiment fréquentes.",
              en: "A covering index turns two structures read into one. The price: a bigger index and slightly slower DML. Reserve it for genuinely frequent queries.",
            },
          },
          {
            kind: "code",
            title: { fr: "Repérer les index inutiles et les index dégradés", en: "Spotting unused and degraded indexes" },
            code: `-- Un index jamais utilise coute a chaque INSERT, UPDATE et DELETE.
ALTER INDEX cmd_vieux_i MONITORING USAGE;
-- ... quelques semaines de production ...
SELECT index_name, table_name, monitoring, used, start_monitoring
FROM   v$object_usage;

-- 12.1+ : suivi permanent, sans activation manuelle
SELECT index_name, total_access_count, total_exec_count, last_used
FROM   dba_index_usage ORDER BY total_access_count;

-- Index degrade : trop de niveaux, trop de blocs supprimes
ANALYZE INDEX cmd_statut_i VALIDATE STRUCTURE;
SELECT name, height, lf_rows, del_lf_rows,
       ROUND(100 * del_lf_rows / NULLIF(lf_rows,0), 1) AS pct_supprime
FROM   index_stats;
-- Au-dela de 20 % d'entrees supprimees, un REBUILD se justifie.
ALTER INDEX cmd_statut_i REBUILD ONLINE;`,
          },
          {
            kind: "tip",
            title: { fr: "Index invisible : tester avant de supprimer", en: "Invisible index: test before dropping" },
            body: {
              fr: "Supprimer un index de 40 Go est irréversible en pratique — le reconstruire prendra des heures. Le rendre **invisible** produit le même effet pour l'optimiseur tout en le maintenant à jour : si une requête s'effondre, une seule commande le remet en service instantanément.",
              en: "Dropping a 40 GB index is irreversible in practice — rebuilding it will take hours. Making it **invisible** produces the same effect for the optimizer while keeping it maintained: if a query collapses, a single command brings it back instantly.",
            },
          },
          {
            kind: "code",
            code: `ALTER INDEX cmd_vieux_i INVISIBLE;
-- ... observer la production pendant une semaine ...
ALTER INDEX cmd_vieux_i VISIBLE;    -- retour immediat
DROP INDEX cmd_vieux_i;             -- seulement si rien n'a bouge

-- Le voir malgre tout, le temps d'un test :
ALTER SESSION SET optimizer_use_invisible_indexes = TRUE;`,
          },
        ],
      },
      {
        id: "tun-11-4",
        number: "11.4",
        title: { fr: "Compression de tables", en: "Table compression" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "La compression n'économise pas que du disque : des blocs plus denses signifient **moins de blocs lus** pour la même quantité de données, donc moins d'entrées-sorties et un buffer cache plus efficace. Sur un entrepôt, un balayage complet peut être deux à quatre fois plus rapide.",
              en: "Compression does not only save disk: denser blocks mean **fewer blocks read** for the same data, hence less I/O and a more effective buffer cache. On a warehouse, a full scan can be two to four times faster.",
            },
          },
          {
            kind: "table",
            headers: [
              { fr: "Mode", en: "Mode" },
              { fr: "S'applique à", en: "Applies to" },
              { fr: "Licence", en: "Licence" },
            ],
            rows: [
              [
                { fr: "ROW STORE COMPRESS BASIC", en: "ROW STORE COMPRESS BASIC" },
                { fr: "Chargements directs uniquement (INSERT /*+ APPEND */, CTAS)", en: "Direct-path loads only (INSERT /*+ APPEND */, CTAS)" },
                { fr: "Incluse en Enterprise Edition", en: "Included in Enterprise Edition" },
              ],
              [
                { fr: "ROW STORE COMPRESS ADVANCED", en: "ROW STORE COMPRESS ADVANCED" },
                { fr: "**Tout DML**, y compris les INSERT conventionnels", en: "**All DML**, conventional INSERTs included" },
                { fr: "Option Advanced Compression", en: "Advanced Compression option" },
              ],
              [
                { fr: "COLUMN STORE COMPRESS FOR QUERY", en: "COLUMN STORE COMPRESS FOR QUERY" },
                { fr: "Hybrid Columnar Compression — analytique", en: "Hybrid Columnar Compression — analytics" },
                { fr: "Exadata, ZFS, Pillar Axiom", en: "Exadata, ZFS, Pillar Axiom" },
              ],
              [
                { fr: "COLUMN STORE COMPRESS FOR ARCHIVE", en: "COLUMN STORE COMPRESS FOR ARCHIVE" },
                { fr: "Données froides, taux maximal", en: "Cold data, maximum ratio" },
                { fr: "Exadata, ZFS, Pillar Axiom", en: "Exadata, ZFS, Pillar Axiom" },
              ],
            ],
          },
          {
            kind: "compare",
            title: { fr: "Le piège de la compression BASIC", en: "The BASIC compression trap" },
            wrong: `-- La table est declaree compressee...
ALTER TABLE ventes ROW STORE COMPRESS BASIC;

-- ... mais l'application charge en INSERT classique :
INSERT INTO ventes VALUES (...);   -- NON compresse
-- Resultat : aucun gain, et une illusion de compression.`,
            right: `-- BASIC ne compresse qu'en chemin direct :
INSERT /*+ APPEND */ INTO ventes SELECT * FROM ventes_stg;
-- ou
CREATE TABLE ventes COMPRESS AS SELECT * FROM ventes_source;

-- Pour compresser aussi le DML ordinaire :
ALTER TABLE ventes ROW STORE COMPRESS ADVANCED;`,
            note: {
              fr: "Vérifiez toujours le résultat plutôt que la déclaration : `DBMS_COMPRESSION.GET_COMPRESSION_TYPE` indique, ligne par ligne, si elle est réellement compressée.",
              en: "Always check the outcome rather than the declaration: `DBMS_COMPRESSION.GET_COMPRESSION_TYPE` reports, row by row, whether it is actually compressed.",
            },
          },
          {
            kind: "code",
            title: { fr: "Estimer le gain avant de compresser", en: "Estimate the gain before compressing" },
            code: `DECLARE
  blocs_avant  PLS_INTEGER;
  blocs_apres  PLS_INTEGER;
  lignes       PLS_INTEGER;
  ratio        NUMBER;
  type_comp    VARCHAR2(100);
BEGIN
  DBMS_COMPRESSION.GET_COMPRESSION_RATIO(
    scratchtbsname => 'USERS',
    ownname        => USER,
    objname        => 'VENTES',
    subobjname     => NULL,
    comptype       => DBMS_COMPRESSION.COMP_ADVANCED,
    blkcnt_cmp     => blocs_apres,
    blkcnt_uncmp   => blocs_avant,
    row_cmp        => lignes,
    row_uncmp      => lignes,
    cmp_ratio      => ratio,
    comptype_str   => type_comp);
  DBMS_OUTPUT.PUT_LINE('Ratio estime : ' || ROUND(ratio, 2) || ' pour 1');
END;
/

-- Verifier a posteriori, ligne par ligne
SELECT DBMS_COMPRESSION.GET_COMPRESSION_TYPE(USER,'VENTES', ROWID) AS type_comp
FROM   ventes WHERE ROWNUM <= 5;`,
          },
        ],
      },
      {
        id: "tun-11-5",
        number: "11.5",
        title: { fr: "Diagnostiquer et résoudre les problèmes d'espace", en: "Diagnosing and resolving space issues" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Où part l'espace ?", en: "Where is the space going?" },
            code: `-- Occupation par tablespace, avec le vrai reste disponible
SELECT t.tablespace_name,
       ROUND(SUM(d.bytes)/1024/1024)                          AS alloue_mb,
       ROUND(SUM(d.maxbytes)/1024/1024)                       AS max_mb,
       ROUND(NVL(f.libre,0)/1024/1024)                        AS libre_mb,
       ROUND(100*(SUM(d.bytes)-NVL(f.libre,0))/SUM(d.bytes),1) AS pct_utilise
FROM   dba_data_files d
       JOIN dba_tablespaces t ON t.tablespace_name = d.tablespace_name
       LEFT JOIN (SELECT tablespace_name, SUM(bytes) AS libre
                  FROM dba_free_space GROUP BY tablespace_name) f
              ON f.tablespace_name = t.tablespace_name
GROUP BY t.tablespace_name, f.libre ORDER BY pct_utilise DESC;

-- Les segments les plus gros
SELECT owner, segment_name, segment_type,
       ROUND(bytes/1024/1024) AS mb
FROM   dba_segments ORDER BY bytes DESC FETCH FIRST 20 ROWS ONLY;

-- Espace reellement occupe par les lignes, par rapport a l'espace alloue
SELECT segment_name,
       ROUND(blocks * 8192 / 1024 / 1024)                        AS alloue_mb,
       ROUND(num_rows * avg_row_len / 1024 / 1024)               AS donnees_mb
FROM   user_tables t JOIN user_segments s ON s.segment_name = t.table_name
WHERE  num_rows > 0 ORDER BY 2 - 3 DESC;`,
          },
          {
            kind: "tip",
            title: { fr: "L'allocation reprenable", en: "Resumable space allocation" },
            body: {
              fr: "Un chargement de six heures qui échoue à la cinquième sur un ORA-01653 — plus d'espace — est une soirée perdue. Avec l'allocation reprenable, la session se **suspend** au lieu d'échouer, une alerte est levée, l'administrateur ajoute de l'espace, et le traitement reprend exactement où il s'était arrêté.",
              en: "A six-hour load that fails at the fifth hour on ORA-01653 — out of space — is a wasted evening. With resumable space allocation the session **suspends** instead of failing, an alert is raised, the administrator adds space, and processing resumes exactly where it stopped.",
            },
          },
          {
            kind: "code",
            code: `ALTER SESSION ENABLE RESUMABLE TIMEOUT 7200 NAME 'chargement_nuit';

-- Depuis une autre session : reperer la suspension
SELECT session_id, sql_text, error_number, suspend_time, status
FROM   dba_resumable;

-- Corriger, la session repart seule
ALTER DATABASE DATAFILE '/u01/oradata/users01.dbf' RESIZE 20G;

-- Declencher une action automatique a la suspension
-- (trigger AFTER SUSPEND ON DATABASE)`,
          },
          {
            kind: "table",
            title: { fr: "Les erreurs d'espace et leur lecture", en: "Space errors and how to read them" },
            headers: [
              { fr: "Erreur", en: "Error" },
              { fr: "Signification", en: "Meaning" },
              { fr: "Première action", en: "First action" },
            ],
            rows: [
              [
                { fr: "ORA-01653 / ORA-01654", en: "ORA-01653 / ORA-01654" },
                { fr: "Extension impossible pour une table ou un index", en: "Cannot extend a table or an index" },
                { fr: "Agrandir le fichier ou activer AUTOEXTEND", en: "Grow the file or enable AUTOEXTEND" },
              ],
              [
                { fr: "ORA-01555", en: "ORA-01555" },
                { fr: "Snapshot too old : l'undo nécessaire a été écrasé", en: "Snapshot too old: the needed undo was overwritten" },
                { fr: "Augmenter UNDO_RETENTION, ou l'undo tablespace", en: "Raise UNDO_RETENTION, or the undo tablespace" },
              ],
              [
                { fr: "ORA-01652", en: "ORA-01652" },
                { fr: "Le tablespace temporaire est plein — un tri déborde", en: "Temporary tablespace full — a sort spilled" },
                { fr: "Voir la session fautive, puis la PGA (session 13)", en: "Find the offending session, then look at PGA (session 13)" },
              ],
              [
                { fr: "ORA-30036", en: "ORA-30036" },
                { fr: "Extension impossible dans l'undo tablespace", en: "Cannot extend the undo tablespace" },
                { fr: "Transaction trop longue, ou undo sous-dimensionné", en: "Overlong transaction, or undersized undo" },
              ],
            ],
          },
        ],
      },
    ],
  },

  {
    id: "tun-session-12",
    number: 12,
    title: { fr: "Real Application Testing", en: "Real Application Testing" },
    summary: {
      fr: "Prouver l'effet d'un changement avant de le subir en production. SQL Performance Analyzer compare les instructions une par une ; Database Replay rejoue la charge entière, concurrence comprise.",
      en: "Prove the effect of a change before enduring it in production. SQL Performance Analyzer compares statements one by one; Database Replay replays the entire workload, concurrency included.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "tun-12-1",
        number: "12.1",
        title: { fr: "Le problème que RAT résout", en: "The problem RAT solves" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Une migration de version, un changement de paramètre d'optimiseur, un nouvel index, une collecte de statistiques : chacun peut améliorer quatre-vingt-dix-neuf requêtes et en détruire une — celle du traitement de clôture. Real Application Testing répond à la question que tout le monde se pose la veille d'une bascule : *qu'est-ce qui va casser ?*",
              en: "A version upgrade, an optimizer parameter change, a new index, a statistics gather: each can improve ninety-nine queries and destroy one — the one in the month-end batch. Real Application Testing answers the question everyone asks the night before a cutover: *what is going to break?*",
            },
          },
          {
            kind: "figure",
            src: "/art/oracle-rat-flow.svg",
            alt: {
              fr: "Chaîne Real Application Testing : capture de la charge en production, rejeu sur la base de test, comparaison des rapports avant et après",
              en: "Real Application Testing chain: workload capture in production, replay on the test database, comparison of before and after reports",
            },
            caption: {
              fr: "Deux outils, deux granularités : SQL Performance Analyzer travaille instruction par instruction, Database Replay rejoue la charge complète avec sa concurrence réelle.",
              en: "Two tools, two granularities: SQL Performance Analyzer works statement by statement, Database Replay replays the whole workload with its real concurrency.",
            },
            width: 800,
            height: 460,
          },
          {
            kind: "table",
            title: { fr: "Choisir l'outil", en: "Choosing the tool" },
            headers: [
              { fr: "", en: "" },
              { fr: "SQL Performance Analyzer", en: "SQL Performance Analyzer" },
              { fr: "Database Replay", en: "Database Replay" },
            ],
            rows: [
              [
                { fr: "Unité", en: "Unit" },
                { fr: "Une instruction SQL", en: "One SQL statement" },
                { fr: "La charge complète", en: "The complete workload" },
              ],
              [
                { fr: "Concurrence reproduite", en: "Concurrency reproduced" },
                { fr: "Non — exécution séquentielle", en: "No — sequential execution" },
                { fr: "**Oui**, y compris les verrous et les commits", en: "**Yes**, locks and commits included" },
              ],
              [
                { fr: "Répond à", en: "Answers" },
                { fr: "« Quels plans changent, et pour le meilleur ? »", en: "“Which plans change, and for the better?”" },
                { fr: "« Le système tient-il la charge après le changement ? »", en: "“Does the system hold up after the change?”" },
              ],
              [
                { fr: "Source", en: "Source" },
                { fr: "Un SQL Tuning Set", en: "A SQL Tuning Set" },
                { fr: "Une capture de charge sur disque", en: "A workload capture on disk" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Real Application Testing est une **option payante** de l'Enterprise Edition. SQL Tuning Sets, en revanche, font partie du Tuning Pack : on peut donc constituer et transporter un jeu d'instructions sans licence RAT, mais pas exécuter la comparaison automatisée.",
              en: "Real Application Testing is a **paid option** of Enterprise Edition. SQL Tuning Sets, however, belong to the Tuning Pack: you can therefore build and transport a statement set without a RAT licence, but not run the automated comparison.",
            },
          },
        ],
      },
      {
        id: "tun-12-2",
        number: "12.2",
        title: { fr: "SQL Tuning Sets : la matière première", en: "SQL Tuning Sets: the raw material" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Un SQL Tuning Set est un conteneur d'instructions, avec pour chacune son texte, son contexte d'exécution, ses variables de liaison et ses statistiques observées. C'est ce que l'on capture en production, ce que l'on transporte vers l'environnement de test, et ce que l'on soumet à SQL Performance Analyzer ou à SQL Tuning Advisor.",
              en: "A SQL Tuning Set is a container of statements, each with its text, execution context, bind variables and observed statistics. It is what you capture in production, transport to the test environment, and submit to SQL Performance Analyzer or SQL Tuning Advisor.",
            },
          },
          {
            kind: "code",
            title: { fr: "Constituer un jeu depuis AWR", en: "Building a set from AWR" },
            code: `EXEC DBMS_SQLTUNE.CREATE_SQLSET('sts_cloture', 'Charge de la cloture mensuelle');

DECLARE
  curseur DBMS_SQLTUNE.SQLSET_CURSOR;
BEGIN
  OPEN curseur FOR
    SELECT VALUE(p) FROM TABLE(
      DBMS_SQLTUNE.SELECT_WORKLOAD_REPOSITORY(
        begin_snap      => 4210,
        end_snap        => 4260,
        basic_filter    => 'parsing_schema_name = ''APPLI''',
        ranking_measure1=> 'elapsed_time',
        result_limit    => 500)) p;
  DBMS_SQLTUNE.LOAD_SQLSET('sts_cloture', curseur);
END;
/

-- Ce que contient le jeu
SELECT sql_id, plan_hash_value, executions,
       ROUND(elapsed_time/1e6, 2) AS secondes, buffer_gets
FROM   TABLE(DBMS_SQLTUNE.SELECT_SQLSET('sts_cloture'))
ORDER  BY elapsed_time DESC FETCH FIRST 15 ROWS ONLY;`,
          },
          {
            kind: "code",
            title: { fr: "Transporter le jeu vers la base de test", en: "Transporting the set to the test database" },
            code: `-- Sur la production : exporter dans une table intermediaire
EXEC DBMS_SQLTUNE.CREATE_STGTAB_SQLSET(table_name => 'STG_STS', schema_name => 'DBA_OUTIL');
EXEC DBMS_SQLTUNE.PACK_STGTAB_SQLSET( -
       sqlset_name => 'sts_cloture', sqlset_owner => USER, -
       staging_table_name => 'STG_STS', staging_schema_owner => 'DBA_OUTIL');

-- Data Pump transporte STG_STS vers la base de test, puis :
EXEC DBMS_SQLTUNE.UNPACK_STGTAB_SQLSET( -
       sqlset_name => '%', replace => TRUE, -
       staging_table_name => 'STG_STS', staging_schema_owner => 'DBA_OUTIL');`,
            caption: {
              fr: "On teste ainsi la charge réelle de la production sur une base qui n'est pas la production — c'est tout l'intérêt de la démarche.",
              en: "You thereby test production's real workload on a database that is not production — which is the whole point.",
            },
          },
        ],
      },
      {
        id: "tun-12-3",
        number: "12.3",
        title: { fr: "SQL Performance Analyzer", en: "SQL Performance Analyzer" },
        blocks: [
          {
            kind: "list",
            title: { fr: "La séquence en cinq temps", en: "The five-step sequence" },
            items: [
              { fr: "Créer la tâche SPA à partir du SQL Tuning Set", en: "Create the SPA task from the SQL Tuning Set" },
              { fr: "Exécuter une première fois : c'est la mesure **avant**", en: "Execute once: that is the **before** measurement" },
              { fr: "Appliquer le changement à évaluer — paramètre, index, statistiques, version", en: "Apply the change under evaluation — parameter, index, statistics, version" },
              { fr: "Exécuter une seconde fois : c'est la mesure **après**", en: "Execute a second time: that is the **after** measurement" },
              { fr: "Comparer les deux exécutions et lire le rapport de régressions", en: "Compare the two executions and read the regression report" },
            ],
          },
          {
            kind: "code",
            code: `DECLARE
  tache VARCHAR2(60);
BEGIN
  tache := DBMS_SQLPA.CREATE_ANALYSIS_TASK(
             sqlset_name => 'sts_cloture', task_name => 'spa_migration_19c');

  -- 1. Mesure AVANT
  DBMS_SQLPA.EXECUTE_ANALYSIS_TASK(
    task_name => 'spa_migration_19c',
    execution_type => 'TEST EXECUTE', execution_name => 'avant');

  -- 2. ... appliquer ici le changement a evaluer ...

  -- 3. Mesure APRES
  DBMS_SQLPA.EXECUTE_ANALYSIS_TASK(
    task_name => 'spa_migration_19c',
    execution_type => 'TEST EXECUTE', execution_name => 'apres');

  -- 4. Comparaison
  DBMS_SQLPA.EXECUTE_ANALYSIS_TASK(
    task_name => 'spa_migration_19c',
    execution_type => 'COMPARE PERFORMANCE',
    execution_params => DBMS_ADVISOR.ARGLIST(
      'execution_name1', 'avant',
      'execution_name2', 'apres',
      'comparison_metric', 'ELAPSED_TIME'));
END;
/

SELECT DBMS_SQLPA.REPORT_ANALYSIS_TASK(
         'spa_migration_19c', 'HTML', 'ALL', 'REGRESSED') FROM dual;`,
            caption: {
              fr: "`EXPLAIN PLAN` comme type d'exécution compare les plans sans rien exécuter — plus rapide, mais aveugle sur les temps réels. `TEST EXECUTE` exécute vraiment : c'est le seul mode qui mesure.",
              en: "`EXPLAIN PLAN` as execution type compares plans without running anything — faster, but blind to real timings. `TEST EXECUTE` really executes: it is the only mode that measures.",
            },
          },
          {
            kind: "tip",
            body: {
              fr: "Le rapport classe les instructions en trois catégories : améliorées, inchangées, **régressées**. Seule la troisième compte. Chaque régression est livrée avec les deux plans côte à côte, ce qui permet de décider immédiatement : accepter, poser une baseline sur l'ancien plan, ou renoncer au changement.",
              en: "The report sorts statements into three buckets: improved, unchanged, **regressed**. Only the third matters. Each regression comes with both plans side by side, which lets you decide immediately: accept, pin a baseline on the old plan, or drop the change.",
            },
          },
        ],
      },
      {
        id: "tun-12-4",
        number: "12.4",
        title: { fr: "Database Replay", en: "Database Replay" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "SPA ne dit rien de la concurrence : cent instructions rapides prises isolément peuvent s'effondrer quand elles s'exécutent ensemble sur les mêmes lignes. Database Replay capture **tout** le trafic client d'une période, y compris les temps de réflexion et l'ordre des commits, puis le rejoue à l'identique sur la base de test.",
              en: "SPA says nothing about concurrency: a hundred individually fast statements can collapse when they run together against the same rows. Database Replay captures **all** client traffic over a period, think times and commit ordering included, then replays it identically on the test database.",
            },
          },
          {
            kind: "code",
            title: { fr: "Capture en production", en: "Capture in production" },
            code: `-- 1. Un repertoire pour les fichiers de capture
CREATE DIRECTORY rep_capture AS '/u03/replay/capture';

-- 2. Filtrer ce que l'on ne veut pas capturer
EXEC DBMS_WORKLOAD_CAPTURE.ADD_FILTER( -
       fname => 'exclure_dba', fattribute => 'USER', fvalue => 'SYS');

-- 3. Demarrer -- l'ideal est de redemarrer la base juste avant,
--    pour capturer un etat de depart reproductible.
BEGIN
  DBMS_WORKLOAD_CAPTURE.START_CAPTURE(
    name => 'capture_cloture', dir => 'REP_CAPTURE',
    duration => 3600, default_action => 'INCLUDE');
END;
/
EXEC DBMS_WORKLOAD_CAPTURE.FINISH_CAPTURE;

SELECT id, name, status, start_time, end_time, dbtime, user_calls
FROM   dba_workload_captures;`,
          },
          {
            kind: "code",
            title: { fr: "Rejeu sur la base de test", en: "Replay on the test database" },
            code: `-- La base de test doit etre restauree au SCN de DEBUT de capture.
EXEC DBMS_WORKLOAD_REPLAY.PROCESS_CAPTURE('REP_CAPTURE');
EXEC DBMS_WORKLOAD_REPLAY.INITIALIZE_REPLAY( -
       replay_name => 'rejeu_19c', replay_dir => 'REP_CAPTURE');
EXEC DBMS_WORKLOAD_REPLAY.PREPARE_REPLAY(synchronization => 'SCN');

-- Cote systeme, lancer les clients de rejeu :
-- $ wrc system/mdp@test mode=replay replaydir=/u03/replay/capture

EXEC DBMS_WORKLOAD_REPLAY.START_REPLAY;

-- Rapport de divergences : erreurs nouvelles, resultats differents
SELECT DBMS_WORKLOAD_REPLAY.REPORT(replay_id => 21, format => 'HTML') FROM dual;

SELECT * FROM dba_workload_replay_divergence;`,
          },
          {
            kind: "warning",
            title: { fr: "Le point de restauration est la clé", en: "The restore point is the key" },
            body: {
              fr: "Le rejeu suppose que la base de test se trouve **exactement** dans l'état où était la production au démarrage de la capture. Sinon les mises à jour ne trouvent pas leurs lignes, les contraintes cèdent, et le rapport de divergences devient illisible. La méthode fiable : poser un point de restauration garanti juste avant `START_CAPTURE`, et y ramener la base de test par Flashback avant chaque rejeu.",
              en: "Replay assumes the test database is in **exactly** the state production was in when capture started. Otherwise updates cannot find their rows, constraints break, and the divergence report becomes unreadable. The reliable method: create a guaranteed restore point just before `START_CAPTURE`, and flash the test database back to it before every replay.",
            },
          },
          {
            kind: "table",
            title: { fr: "Lire le rapport de divergences", en: "Reading the divergence report" },
            headers: [
              { fr: "Divergence", en: "Divergence" },
              { fr: "Ce qu'elle signale", en: "What it signals" },
            ],
            rows: [
              [
                { fr: "Erreur nouvelle", en: "New error" },
                { fr: "Une instruction échoue au rejeu alors qu'elle réussissait — régression franche", en: "A statement fails on replay though it succeeded — a clear regression" },
              ],
              [
                { fr: "Erreur disparue", en: "Error gone" },
                { fr: "Souvent un état de départ différent, pas une amélioration", en: "Usually a different starting state, not an improvement" },
              ],
              [
                { fr: "Nombre de lignes différent", en: "Row count mismatch" },
                { fr: "Les données de test divergent de la production", en: "Test data has drifted from production" },
              ],
              [
                { fr: "Temps de rejeu supérieur au temps capturé", en: "Replay slower than capture" },
                { fr: "Le changement dégrade le débit sous concurrence", en: "The change degrades throughput under concurrency" },
              ],
            ],
          },
        ],
      },
    ],
  },

  {
    id: "tun-session-13",
    number: 13,
    title: {
      fr: "Caches avancés, PGA et tablespaces temporaires",
      en: "Advanced caches, PGA and temporary tablespaces",
    },
    summary: {
      fr: "Le détail de ce que la session 7 a survolé : diagnostiquer réellement le buffer cache et les entrées-sorties, exploiter le cache des grandes tables et le Flash Cache, puis maîtriser les zones de travail et le débordement en tablespace temporaire.",
      en: "The detail session 7 skimmed: genuinely diagnosing the buffer cache and I/O, exploiting large table caching and the Flash Cache, then mastering work areas and spilling to temporary tablespace.",
    },
    estimatedMinutes: 165,
    topics: [
      {
        id: "tun-13-1",
        number: "13.1",
        title: { fr: "Diagnostiquer le buffer cache et les entrées-sorties", en: "Diagnosing the buffer cache and I/O" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Ce qui occupe le cache, et ce qui le fait tourner", en: "What fills the cache, and what churns it" },
            code: `-- Les segments les plus presents en memoire
SELECT o.owner, o.object_name, o.object_type, COUNT(*) AS blocs,
       ROUND(COUNT(*) * 8192 / 1024 / 1024, 1) AS mb
FROM   v$bh b JOIN dba_objects o ON o.data_object_id = b.objd
WHERE  b.status != 'free'
GROUP  BY o.owner, o.object_name, o.object_type
ORDER  BY blocs DESC FETCH FIRST 15 ROWS ONLY;

-- Le rythme de renouvellement : un cache qui tourne trop vite
-- ne garde rien assez longtemps pour servir deux fois.
SELECT name, value FROM v$sysstat
WHERE  name IN ('physical reads','physical reads cache',
                'physical reads direct','db block gets',
                'consistent gets','free buffer requested',
                'free buffer inspected');`,
          },
          {
            kind: "table",
            title: { fr: "Les caches multiples", en: "The multiple caches" },
            headers: [
              { fr: "Pool", en: "Pool" },
              { fr: "Paramètre", en: "Parameter" },
              { fr: "À qui l'affecter", en: "What to put there" },
            ],
            rows: [
              [
                { fr: "DEFAULT", en: "DEFAULT" },
                { fr: "DB_CACHE_SIZE", en: "DB_CACHE_SIZE" },
                { fr: "Tout, par défaut", en: "Everything, by default" },
              ],
              [
                { fr: "KEEP", en: "KEEP" },
                { fr: "DB_KEEP_CACHE_SIZE", en: "DB_KEEP_CACHE_SIZE" },
                { fr: "Petites tables de référence lues sans cesse", en: "Small reference tables read constantly" },
              ],
              [
                { fr: "RECYCLE", en: "RECYCLE" },
                { fr: "DB_RECYCLE_CACHE_SIZE", en: "DB_RECYCLE_CACHE_SIZE" },
                { fr: "Gros segments balayés une fois, qui chasseraient le reste", en: "Large segments scanned once that would evict everything else" },
              ],
              [
                { fr: "nK", en: "nK" },
                { fr: "DB_nK_CACHE_SIZE", en: "DB_nK_CACHE_SIZE" },
                { fr: "Tablespaces d'une taille de bloc différente (tablespace transporté)", en: "Tablespaces with a different block size (transported tablespace)" },
              ],
            ],
          },
          {
            kind: "code",
            code: `-- Epingler une table de reference dans le pool KEEP
ALTER SYSTEM SET db_keep_cache_size = 256M;
ALTER TABLE devises STORAGE (BUFFER_POOL KEEP);

-- Verifier l'affectation
SELECT table_name, buffer_pool FROM user_tables
WHERE  buffer_pool != 'DEFAULT';

-- Diagnostiquer les entrees-sorties par fichier
SELECT f.file_name, s.phyrds, s.phywrts,
       ROUND(s.readtim / NULLIF(s.phyrds,0) * 10, 2) AS ms_par_lecture
FROM   v$filestat s JOIN dba_data_files f ON f.file_id = s.file#
ORDER  BY s.phyrds DESC FETCH FIRST 10 ROWS ONLY;

-- Et par fonction de la base : qui genere les E/S ?
SELECT function_name, small_read_megabytes, large_read_megabytes,
       small_write_megabytes, large_write_megabytes
FROM   v$iostat_function ORDER BY small_read_megabytes DESC;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Une latence supérieure à 10 ms par lecture sur un disque mécanique est normale ; sur du SSD ou une baie moderne, elle trahit une saturation ou un mauvais chemin d'accès. `DBMS_RESOURCE_MANAGER.CALIBRATE_IO` donne la référence objective de ce que le stockage sait faire — sans elle, on compare à une intuition.",
              en: "A latency above 10 ms per read on spinning disk is normal; on SSD or a modern array it betrays saturation or a bad access path. `DBMS_RESOURCE_MANAGER.CALIBRATE_IO` gives the objective reference of what the storage can do — without it you are comparing against a hunch.",
            },
          },
        ],
      },
      {
        id: "tun-13-2",
        number: "13.2",
        title: { fr: "Cache des grandes tables", en: "Large table caching" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Par défaut, un balayage complet d'une grosse table utilise la **lecture directe** : les blocs contournent le buffer cache et vont droit dans la PGA. C'est le bon choix pour un balayage unique — inutile de chasser tout le cache pour des données qu'on ne relira pas. Mais si la même table est balayée cent fois par heure, ce comportement fait relire cent fois le disque.",
              en: "By default a full scan of a large table uses **direct path read**: blocks bypass the buffer cache and go straight into the PGA. That is the right call for a one-off scan — no point evicting the whole cache for data you will not re-read. But if the same table is scanned a hundred times an hour, that behaviour re-reads the disk a hundred times.",
            },
          },
          {
            kind: "code",
            code: `-- Reserver un pourcentage du buffer cache aux grandes tables
-- 0   : desactive (defaut)
-- 1-99: part du cache reservee au cache des grandes tables
-- 100 : toute table balayee peut etre entierement mise en cache
ALTER SYSTEM SET db_big_table_cache_percent_target = 40 SCOPE=BOTH;

-- Exige un cache automatique
SHOW PARAMETER sga_target

-- Ce que le cache des grandes tables contient reellement
SELECT * FROM v$bt_scan_cache;
SELECT dataobj#, size_in_blks, temperature, policy, cached_in_mem
FROM   v$bt_scan_obj_temps ORDER BY temperature DESC;`,
            caption: {
              fr: "La colonne `temperature` mesure la fréquence de balayage : Oracle garde en mémoire les tables les plus chaudes et laisse les autres en lecture directe. La décision est automatique et révisée en continu.",
              en: "The `temperature` column measures scan frequency: Oracle keeps the hottest tables in memory and leaves the rest to direct path. The decision is automatic and continuously revised.",
            },
          },
          {
            kind: "tip",
            body: {
              fr: "En Real Application Clusters, le cache des grandes tables ne s'active que pour les bases en mode parallèle avec `PARALLEL_DEGREE_POLICY = AUTO` — il s'appuie alors sur l'affinité des fragments pour répartir la table entre les caches des nœuds. En mono-instance, aucune condition de ce genre.",
              en: "In Real Application Clusters, large table caching only kicks in for parallel databases with `PARALLEL_DEGREE_POLICY = AUTO` — it then relies on fragment affinity to spread the table across the nodes' caches. In single instance there is no such condition.",
            },
          },
        ],
      },
      {
        id: "tun-13-3",
        number: "13.3",
        title: { fr: "Database Smart Flash Cache", en: "Database Smart Flash Cache" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Le Flash Cache ajoute un **second niveau** de cache entre la mémoire et le disque, sur stockage flash. Un bloc évincé du buffer cache n'est pas perdu : il descend dans le flash, d'où il se relit en dizaines de microsecondes au lieu de millisecondes. C'est une extension du buffer cache, pas un remplacement.",
              en: "The Flash Cache adds a **second level** of cache between memory and disk, on flash storage. A block evicted from the buffer cache is not lost: it drops into flash, from which it re-reads in tens of microseconds rather than milliseconds. It is an extension of the buffer cache, not a replacement.",
            },
          },
          {
            kind: "code",
            code: `-- Reserve pour Oracle Linux et Solaris.
ALTER SYSTEM SET db_flash_cache_file = '/dev/flash_dev' SCOPE=SPFILE;
ALTER SYSTEM SET db_flash_cache_size = 200G SCOPE=SPFILE;
-- Deux fichiers et deux tailles sont admis (listes separees par des virgules).

-- Dimensionnement recommande : 2 a 10 fois DB_CACHE_SIZE.

-- Choisir ce qui y descend, objet par objet :
ALTER TABLE commandes STORAGE (FLASH_CACHE KEEP);    -- prioritaire
ALTER TABLE archives  STORAGE (FLASH_CACHE NONE);    -- jamais

-- Mesurer le gain
SELECT name, value FROM v$sysstat
WHERE  name LIKE 'flash cache%';
SELECT * FROM v$flashfilestat;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Chaque bloc placé dans le flash consomme aussi de la mémoire dans la SGA pour son en-tête de suivi : environ 100 octets par bloc en mono-instance, 200 en RAC. Un Flash Cache de 200 Go en blocs de 8 Ko représente 25 millions de blocs, soit **2,5 Go de SGA supplémentaires** rien qu'en métadonnées. Dimensionner le flash sans augmenter la SGA revient à rétrécir le buffer cache.",
              en: "Every block placed in flash also consumes SGA memory for its tracking header: about 100 bytes per block in single instance, 200 in RAC. A 200 GB Flash Cache in 8 KB blocks is 25 million blocks, that is **2.5 GB of extra SGA** in metadata alone. Sizing the flash without growing the SGA amounts to shrinking the buffer cache.",
            },
          },
        ],
      },
      {
        id: "tun-13-4",
        number: "13.4",
        title: { fr: "PGA et zones de travail", en: "PGA and work areas" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "La PGA est la mémoire privée des sessions : tri, hachage, création d'index, agrégation, tampons de chargement. Contrairement à la SGA, elle n'est pas partagée — et `PGA_AGGREGATE_TARGET` n'est pas une limite dure, seulement une cible que l'instance s'efforce de respecter.",
              en: "The PGA is the sessions' private memory: sorting, hashing, index builds, aggregation, load buffers. Unlike the SGA it is not shared — and `PGA_AGGREGATE_TARGET` is not a hard limit, only a target the instance tries to respect.",
            },
          },
          {
            kind: "table",
            title: { fr: "Les trois régimes d'une zone de travail", en: "The three regimes of a work area" },
            headers: [
              { fr: "Régime", en: "Regime" },
              { fr: "Ce qui se passe", en: "What happens" },
              { fr: "Coût", en: "Cost" },
            ],
            rows: [
              [
                { fr: "Optimal", en: "Optimal" },
                { fr: "L'opération tient entièrement en mémoire", en: "The operation fits entirely in memory" },
                { fr: "Aucun accès disque", en: "No disk access" },
              ],
              [
                { fr: "One-pass", en: "One-pass" },
                { fr: "Un seul passage par le disque temporaire", en: "A single trip through temporary disk" },
                { fr: "Acceptable pour un gros tri ponctuel", en: "Acceptable for a large one-off sort" },
              ],
              [
                { fr: "Multi-pass", en: "Multi-pass" },
                { fr: "Plusieurs passages par le disque", en: "Several trips through disk" },
                { fr: "**Catastrophique** — à corriger en priorité", en: "**Catastrophic** — fix it first" },
              ],
            ],
          },
          {
            kind: "code",
            code: `-- Repartition des executions par regime
SELECT low_optimal_size/1024 AS ko_min,
       optimal_executions, onepass_executions, multipasses_executions
FROM   v$sql_workarea_histogram
WHERE  total_executions > 0 ORDER BY low_optimal_size;

-- Chiffrer le gain d'une PGA plus grande
SELECT pga_target_for_estimate/1024/1024 AS cible_mb,
       pga_target_factor, estd_pga_cache_hit_percentage AS hit_pct,
       estd_overalloc_count
FROM   v$pga_target_advice ORDER BY pga_target_for_estimate;

-- Les sessions qui consomment le plus, en direct
SELECT s.sid, s.username, s.program,
       ROUND(p.pga_used_mem/1024/1024, 1)  AS utilise_mb,
       ROUND(p.pga_max_mem/1024/1024, 1)   AS max_mb
FROM   v$session s JOIN v$process p ON p.addr = s.paddr
ORDER  BY p.pga_used_mem DESC FETCH FIRST 10 ROWS ONLY;

-- 12c : une limite DURE, au-dela de laquelle les sessions sont arretees
ALTER SYSTEM SET pga_aggregate_limit = 8G;`,
            caption: {
              fr: "`estd_overalloc_count` doit valoir zéro à la cible retenue : une valeur non nulle signifie que l'instance devra dépasser sa cible, donc empiéter sur la mémoire du système.",
              en: "`estd_overalloc_count` must be zero at the chosen target: a non-zero value means the instance will have to exceed its target, and so encroach on system memory.",
            },
          },
          {
            kind: "tip",
            body: {
              fr: "Un traitement de chargement nocturne isolé n'a pas à dicter la taille de la PGA de toute l'instance. `ALTER SESSION SET workarea_size_policy = MANUAL` puis `sort_area_size` permet de donner une grande zone de travail à cette session-là, sans toucher au réglage global.",
              en: "A single nightly load job should not dictate the PGA size of the whole instance. `ALTER SESSION SET workarea_size_policy = MANUAL` then `sort_area_size` gives that one session a large work area without touching the global setting.",
            },
          },
        ],
      },
      {
        id: "tun-13-5",
        number: "13.5",
        title: { fr: "Tablespaces temporaires", en: "Temporary tablespaces" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Quand une zone de travail déborde, elle atterrit dans le tablespace temporaire. Un TEMP saturé n'est donc jamais la maladie : c'est le symptôme d'une PGA trop petite, d'un plan d'exécution inadapté, ou d'une requête qui trie des millions de lignes sans raison.",
              en: "When a work area spills, it lands in the temporary tablespace. A saturated TEMP is therefore never the disease: it is the symptom of an undersized PGA, an unsuitable execution plan, or a query sorting millions of rows for no reason.",
            },
          },
          {
            kind: "code",
            title: { fr: "Qui consomme le TEMP, en ce moment même", en: "Who is consuming TEMP right now" },
            code: `SELECT s.sid, s.serial#, s.username, s.sql_id,
       ROUND(u.blocks * 8192 / 1024 / 1024) AS mb_utilises,
       u.tablespace, u.segtype
FROM   v$session s JOIN v$tempseg_usage u ON u.session_addr = s.saddr
ORDER  BY u.blocks DESC;

-- Occupation globale, avec ce qui est libre mais pas encore rendu
SELECT tablespace_name,
       ROUND(tablespace_size/1024/1024)     AS taille_mb,
       ROUND(allocated_space/1024/1024)     AS alloue_mb,
       ROUND(free_space/1024/1024)          AS libre_mb
FROM   dba_temp_free_space;

-- Reduire un TEMP qui a gonfle sans jamais redescendre
ALTER TABLESPACE temp SHRINK SPACE KEEP 2G;`,
          },
          {
            kind: "list",
            title: { fr: "Les leviers, dans l'ordre", en: "The levers, in order" },
            items: [
              { fr: "Corriger la requête : un tri de dix millions de lignes est souvent un ORDER BY inutile ou un DISTINCT de trop", en: "Fix the query: a ten-million-row sort is often a needless ORDER BY or one DISTINCT too many" },
              { fr: "Vérifier le plan : un hash join dégénéré consomme bien plus qu'une jointure correctement estimée", en: "Check the plan: a degenerate hash join consumes far more than a properly estimated join" },
              { fr: "Augmenter PGA_AGGREGATE_TARGET si le régime multi-pass domine", en: "Raise PGA_AGGREGATE_TARGET if the multi-pass regime dominates" },
              { fr: "Créer un groupe de tablespaces temporaires pour répartir la charge entre plusieurs fichiers", en: "Create a temporary tablespace group to spread the load across several files" },
              { fr: "Affecter un TEMP dédié aux traitements de masse, distinct de celui des utilisateurs", en: "Give bulk jobs a dedicated TEMP, separate from the users' one" },
            ],
          },
          {
            kind: "code",
            code: `-- Un groupe : plusieurs tablespaces temporaires vus comme un seul
CREATE TEMPORARY TABLESPACE temp2 TEMPFILE '/u02/temp02.dbf' SIZE 8G
  TABLESPACE GROUP tmpgrp;
ALTER TABLESPACE temp TABLESPACE GROUP tmpgrp;
ALTER DATABASE DEFAULT TEMPORARY TABLESPACE tmpgrp;

-- Un TEMP dedie a l'utilisateur des traitements de nuit
ALTER USER batch TEMPORARY TABLESPACE temp_batch;

SELECT group_name, tablespace_name FROM dba_tablespace_groups;`,
            caption: {
              fr: "Dans un groupe, les sessions parallèles d'une même requête se répartissent entre les tablespaces membres : c'est le moyen le plus simple d'éviter qu'un seul fichier temporaire devienne le goulot d'étranglement.",
              en: "Within a group, the parallel sessions of one query spread across member tablespaces: it is the simplest way to stop a single temp file becoming the bottleneck.",
            },
          },
        ],
      },
    ],
  },
];
