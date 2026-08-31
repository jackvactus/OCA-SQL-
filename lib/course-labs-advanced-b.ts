import type { Lab } from "./course-oca-sql";

/**
 * Travaux pratiques des douze sessions ajoutées pour couvrir l'intégralité
 * des programmes officiels 1Z0-084, 1Z0-076 et 1Z0-078.
 *
 * Chaque exercice se termine par un résultat observable, de sorte que
 * l'apprenant sache seul s'il a réussi.
 */
export const advancedSessionLabsB: Record<string, Lab[]> = {
  // ═══════════ 1Z0-084 ═══════════
  "tun-session-11": [
    {
      title: { fr: "Fabriquer des lignes migrées, puis les guérir", en: "Manufacture migrated rows, then cure them" },
      objective: {
        fr: "Provoquer la migration, la mesurer, corriger la cause, et vérifier que le compteur cesse de monter.",
        en: "Trigger migration, measure it, fix the cause, and check the counter stops rising.",
      },
      steps: [
        { fr: "Créer une table avec PCTFREE 0 et y insérer des lignes courtes.", en: "Create a table with PCTFREE 0 and insert short rows." },
        { fr: "Faire grossir toutes les lignes par un UPDATE, puis relever « table fetch continued row ».", en: "Grow every row with an UPDATE, then record “table fetch continued row”." },
        { fr: "Recenser les lignes migrées avec ANALYZE … LIST CHAINED ROWS.", en: "List the migrated rows with ANALYZE … LIST CHAINED ROWS." },
        { fr: "Relever PCTFREE à 30, réorganiser en ligne, refaire la mesure.", en: "Raise PCTFREE to 30, reorganise online, measure again." },
      ],
      expected: {
        fr: "CHAINED_ROWS se remplit après l'UPDATE, puis se vide après le MOVE. Le compteur cesse de progresser.",
        en: "CHAINED_ROWS fills after the UPDATE, then empties after the MOVE. The counter stops rising.",
      },
      code: `CREATE TABLE lab_mig (id NUMBER, texte VARCHAR2(2000)) PCTFREE 0;
INSERT INTO lab_mig SELECT ROWNUM, 'x' FROM all_objects WHERE ROWNUM <= 20000;
COMMIT;

SELECT value FROM v$sysstat WHERE name = 'table fetch continued row';
UPDATE lab_mig SET texte = RPAD('x', 1800, 'x');
COMMIT;

@?/rdbms/admin/utlchain.sql
ANALYZE TABLE lab_mig LIST CHAINED ROWS INTO chained_rows;
SELECT COUNT(*) FROM chained_rows;

ALTER TABLE lab_mig PCTFREE 30;
ALTER TABLE lab_mig MOVE ONLINE;
DELETE FROM chained_rows;
ANALYZE TABLE lab_mig LIST CHAINED ROWS INTO chained_rows;
SELECT COUNT(*) FROM chained_rows;   -- 0`,
      minutes: 30,
    },
    {
      title: { fr: "Abaisser la high water mark", en: "Lower the high water mark" },
      objective: {
        fr: "Constater qu'un DELETE ne rend pas l'espace, et qu'un SHRINK le rend vraiment.",
        en: "Observe that a DELETE does not give space back, and that a SHRINK really does.",
      },
      steps: [
        { fr: "Relever le nombre de blocs occupés par la table.", en: "Record the number of blocks the table occupies." },
        { fr: "Supprimer 90 % des lignes, valider, et relever de nouveau.", en: "Delete 90 % of the rows, commit, and record again." },
        { fr: "Activer ROW MOVEMENT, compacter puis abaisser la high water mark.", en: "Enable ROW MOVEMENT, compact then lower the high water mark." },
      ],
      expected: {
        fr: "Le nombre de blocs ne bouge pas après le DELETE, et chute après le SHRINK SPACE.",
        en: "The block count does not move after the DELETE, and drops after SHRINK SPACE.",
      },
      code: `SELECT blocks, num_rows FROM user_tables WHERE table_name = 'LAB_MIG';
DELETE FROM lab_mig WHERE MOD(id, 10) != 0;
COMMIT;
EXEC DBMS_STATS.GATHER_TABLE_STATS(USER, 'LAB_MIG');
SELECT blocks, num_rows FROM user_tables WHERE table_name = 'LAB_MIG';

ALTER TABLE lab_mig ENABLE ROW MOVEMENT;
ALTER TABLE lab_mig SHRINK SPACE COMPACT;
ALTER TABLE lab_mig SHRINK SPACE;
EXEC DBMS_STATS.GATHER_TABLE_STATS(USER, 'LAB_MIG');
SELECT blocks, num_rows FROM user_tables WHERE table_name = 'LAB_MIG';`,
      minutes: 25,
    },
    {
      title: { fr: "Estimer puis vérifier un taux de compression", en: "Estimate then verify a compression ratio" },
      objective: {
        fr: "Comparer l'estimation de DBMS_COMPRESSION au résultat réellement obtenu.",
        en: "Compare the DBMS_COMPRESSION estimate with the result actually obtained.",
      },
      steps: [
        { fr: "Estimer le ratio en mode ADVANCED sur une table volumineuse.", en: "Estimate the ADVANCED ratio on a large table." },
        { fr: "Créer une copie compressée par CTAS et comparer les tailles.", en: "Create a compressed copy with CTAS and compare sizes." },
        { fr: "Vérifier ligne par ligne le type de compression appliqué.", en: "Check the applied compression type row by row." },
      ],
      expected: {
        fr: "Le ratio réel est proche de l'estimation, et GET_COMPRESSION_TYPE confirme la compression.",
        en: "The real ratio is close to the estimate, and GET_COMPRESSION_TYPE confirms compression.",
      },
      code: `CREATE TABLE lab_src AS SELECT * FROM all_objects;
INSERT INTO lab_src SELECT * FROM lab_src;   -- doubler quelques fois
COMMIT;

CREATE TABLE lab_comp ROW STORE COMPRESS ADVANCED AS SELECT * FROM lab_src;
EXEC DBMS_STATS.GATHER_TABLE_STATS(USER,'LAB_SRC');
EXEC DBMS_STATS.GATHER_TABLE_STATS(USER,'LAB_COMP');

SELECT table_name, blocks FROM user_tables
WHERE  table_name IN ('LAB_SRC','LAB_COMP');

SELECT DBMS_COMPRESSION.GET_COMPRESSION_TYPE(USER,'LAB_COMP', ROWID) AS t
FROM   lab_comp WHERE ROWNUM <= 3;`,
      minutes: 25,
    },
  ],
  "tun-session-12": [
    {
      title: { fr: "Constituer et transporter un SQL Tuning Set", en: "Build and transport a SQL Tuning Set" },
      objective: {
        fr: "Capturer la charge d'un intervalle AWR et la rendre transportable vers une base de test.",
        en: "Capture the workload of an AWR interval and make it transportable to a test database.",
      },
      steps: [
        { fr: "Repérer deux identifiants d'instantanés encadrant une période chargée.", en: "Find two snapshot ids bracketing a busy period." },
        { fr: "Créer le jeu, le charger depuis AWR, et lister son contenu.", en: "Create the set, load it from AWR, and list its contents." },
        { fr: "L'empaqueter dans une table intermédiaire prête pour Data Pump.", en: "Pack it into a staging table ready for Data Pump." },
      ],
      expected: {
        fr: "Le jeu contient les instructions les plus coûteuses de l'intervalle, avec leurs plans et leurs statistiques.",
        en: "The set holds the interval's costliest statements, with their plans and statistics.",
      },
      code: `SELECT snap_id, begin_interval_time FROM dba_hist_snapshot
ORDER  BY snap_id DESC FETCH FIRST 10 ROWS ONLY;

EXEC DBMS_SQLTUNE.CREATE_SQLSET('sts_lab', 'Charge de test');
DECLARE c DBMS_SQLTUNE.SQLSET_CURSOR;
BEGIN
  OPEN c FOR SELECT VALUE(p) FROM TABLE(
    DBMS_SQLTUNE.SELECT_WORKLOAD_REPOSITORY(
      &debut, &fin, NULL, NULL, 'elapsed_time', NULL, NULL, NULL, 100)) p;
  DBMS_SQLTUNE.LOAD_SQLSET('sts_lab', c);
END;
/
SELECT sql_id, ROUND(elapsed_time/1e6,2) AS s, buffer_gets
FROM   TABLE(DBMS_SQLTUNE.SELECT_SQLSET('sts_lab'))
ORDER  BY elapsed_time DESC FETCH FIRST 10 ROWS ONLY;`,
      minutes: 30,
    },
    {
      title: { fr: "Mesurer l'impact d'un paramètre avec SPA", en: "Measure a parameter's impact with SPA" },
      objective: {
        fr: "Prouver, chiffres à l'appui, qu'un changement d'optimiseur améliore ou dégrade la charge.",
        en: "Prove with figures that an optimizer change improves or degrades the workload.",
      },
      steps: [
        { fr: "Créer la tâche SPA à partir du jeu, et exécuter la mesure « avant ».", en: "Create the SPA task from the set, and run the “before” measurement." },
        { fr: "Modifier OPTIMIZER_INDEX_COST_ADJ, puis exécuter la mesure « après ».", en: "Change OPTIMIZER_INDEX_COST_ADJ, then run the “after” measurement." },
        { fr: "Comparer et lire le rapport filtré sur les régressions.", en: "Compare and read the report filtered on regressions." },
      ],
      expected: {
        fr: "Le rapport classe les instructions en améliorées, inchangées et régressées, avec les deux plans côte à côte.",
        en: "The report sorts statements into improved, unchanged and regressed, with both plans side by side.",
      },
      code: `EXEC DBMS_SQLPA.CREATE_ANALYSIS_TASK(sqlset_name=>'sts_lab', task_name=>'spa_lab');
EXEC DBMS_SQLPA.EXECUTE_ANALYSIS_TASK('spa_lab','TEST EXECUTE','avant');

ALTER SYSTEM SET optimizer_index_cost_adj = 30;

EXEC DBMS_SQLPA.EXECUTE_ANALYSIS_TASK('spa_lab','TEST EXECUTE','apres');
BEGIN
  DBMS_SQLPA.EXECUTE_ANALYSIS_TASK('spa_lab','COMPARE PERFORMANCE',
    execution_params => DBMS_ADVISOR.ARGLIST(
      'execution_name1','avant','execution_name2','apres',
      'comparison_metric','ELAPSED_TIME'));
END;
/
SELECT DBMS_SQLPA.REPORT_ANALYSIS_TASK('spa_lab','TEXT','ALL','REGRESSED') FROM dual;

ALTER SYSTEM SET optimizer_index_cost_adj = 100;   -- remettre en etat`,
      minutes: 35,
    },
  ],
  "tun-session-13": [
    {
      title: { fr: "Voir ce qui occupe le buffer cache", en: "See what occupies the buffer cache" },
      objective: {
        fr: "Identifier les segments qui monopolisent la mémoire, puis en épingler un dans le pool KEEP.",
        en: "Identify the segments hogging memory, then pin one in the KEEP pool.",
      },
      steps: [
        { fr: "Lister les objets les plus présents dans V$BH.", en: "List the objects most present in V$BH." },
        { fr: "Créer un pool KEEP et y affecter une petite table de référence.", en: "Create a KEEP pool and assign a small reference table to it." },
        { fr: "Balayer une grosse table, puis vérifier que la table de référence est restée en mémoire.", en: "Scan a large table, then verify the reference table stayed in memory." },
      ],
      expected: {
        fr: "La table du pool KEEP conserve ses blocs, alors que les autres ont été évincés.",
        en: "The KEEP-pool table keeps its blocks while the others have been evicted.",
      },
      code: `SELECT o.object_name, COUNT(*) AS blocs
FROM   v$bh b JOIN dba_objects o ON o.data_object_id = b.objd
WHERE  b.status != 'free' GROUP BY o.object_name
ORDER  BY blocs DESC FETCH FIRST 10 ROWS ONLY;

ALTER SYSTEM SET db_keep_cache_size = 64M;
ALTER TABLE lab_ref STORAGE (BUFFER_POOL KEEP);
SELECT COUNT(*) FROM lab_ref;
SELECT COUNT(*) FROM lab_src;    -- gros balayage

SELECT o.object_name, COUNT(*) AS blocs
FROM   v$bh b JOIN dba_objects o ON o.data_object_id = b.objd
WHERE  b.status != 'free' AND o.object_name IN ('LAB_REF','LAB_SRC')
GROUP  BY o.object_name;`,
      minutes: 25,
    },
    {
      title: { fr: "Provoquer un débordement en TEMP, puis l'éliminer", en: "Force a TEMP spill, then eliminate it" },
      objective: {
        fr: "Passer une opération du régime multi-pass au régime optimal en agissant sur la PGA.",
        en: "Move an operation from multi-pass to optimal by acting on the PGA.",
      },
      steps: [
        { fr: "Réduire fortement la zone de travail de la session, puis lancer un gros tri.", en: "Sharply reduce the session's work area, then run a large sort." },
        { fr: "Observer la consommation dans V$TEMPSEG_USAGE et le régime dans l'histogramme.", en: "Watch consumption in V$TEMPSEG_USAGE and the regime in the histogram." },
        { fr: "Rétablir une zone de travail suffisante et relancer le même tri.", en: "Restore an adequate work area and re-run the same sort." },
      ],
      expected: {
        fr: "Le premier tri déborde en TEMP et apparaît en one-pass ou multi-pass ; le second reste optimal.",
        en: "The first sort spills to TEMP and shows as one-pass or multi-pass; the second stays optimal.",
      },
      code: `ALTER SESSION SET workarea_size_policy = MANUAL;
ALTER SESSION SET sort_area_size = 65536;
SELECT * FROM (SELECT * FROM lab_src ORDER BY object_name, object_id)
WHERE ROWNUM <= 10;

SELECT u.tablespace, ROUND(u.blocks*8192/1024/1024) AS mb, u.segtype
FROM   v$tempseg_usage u;

SELECT low_optimal_size/1024 AS ko, optimal_executions,
       onepass_executions, multipasses_executions
FROM   v$sql_workarea_histogram WHERE total_executions > 0;

ALTER SESSION SET workarea_size_policy = AUTO;`,
      minutes: 25,
    },
  ],

  // ═══════════ 1Z0-076 ═══════════
  "dg-session-9": [
    {
      title: { fr: "Refuser une réponse périmée", en: "Refuse a stale answer" },
      objective: {
        fr: "Constater que STANDBY_MAX_DATA_DELAY fait échouer la requête plutôt que de mentir.",
        en: "Observe that STANDBY_MAX_DATA_DELAY fails the query rather than lying.",
      },
      steps: [
        { fr: "Vérifier que la base de secours est en READ ONLY WITH APPLY.", en: "Check the standby is in READ ONLY WITH APPLY." },
        { fr: "Suspendre l'application du redo, puis attendre une minute.", en: "Suspend redo apply, then wait a minute." },
        { fr: "Fixer STANDBY_MAX_DATA_DELAY à 10 et interroger une table.", en: "Set STANDBY_MAX_DATA_DELAY to 10 and query a table." },
        { fr: "Relancer l'application et refaire la même requête.", en: "Restart apply and re-run the same query." },
      ],
      expected: {
        fr: "La requête échoue sur ORA-03172 pendant la suspension, et réussit dès que l'écart repasse sous le seuil.",
        en: "The query fails with ORA-03172 while apply is suspended, and succeeds as soon as the lag falls under the threshold.",
      },
      code: `SELECT database_role, open_mode FROM v$database;
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL;

ALTER SESSION SET standby_max_data_delay = 10;
SELECT COUNT(*) FROM hr.employees;      -- ORA-03172 attendu

ALTER DATABASE RECOVER MANAGED STANDBY DATABASE
  USING CURRENT LOGFILE DISCONNECT;
SELECT COUNT(*) FROM hr.employees;      -- succes`,
      minutes: 25,
    },
    {
      title: { fr: "Écrire depuis une base en lecture seule", en: "Write from a read-only database" },
      objective: {
        fr: "Faire fonctionner une table temporaire globale, puis le DML redirigé de la 19c.",
        en: "Get a global temporary table working, then 19c DML redirect.",
      },
      steps: [
        { fr: "Tenter d'écrire dans une table temporaire globale sans undo temporaire.", en: "Try writing to a global temporary table without temporary undo." },
        { fr: "Activer TEMP_UNDO_ENABLED et réessayer.", en: "Enable TEMP_UNDO_ENABLED and retry." },
        { fr: "Activer ADG_REDIRECT_DML et exécuter un UPDATE sur une table ordinaire.", en: "Enable ADG_REDIRECT_DML and run an UPDATE on an ordinary table." },
      ],
      expected: {
        fr: "La première tentative échoue, la seconde réussit, et l'UPDATE redirigé est visible sur la base principale.",
        en: "The first attempt fails, the second succeeds, and the redirected UPDATE is visible on the primary.",
      },
      code: `INSERT INTO gtt_travail VALUES (1, 'test');    -- ORA-16000 attendu

ALTER SESSION SET temp_undo_enabled = TRUE;
INSERT INTO gtt_travail VALUES (1, 'test');    -- succes
SELECT * FROM gtt_travail;

ALTER SESSION ENABLE ADG_REDIRECT_DML;
UPDATE hr.employees SET salary = salary WHERE employee_id = 100;
COMMIT;`,
      minutes: 25,
    },
  ],
  "dg-session-10": [
    {
      title: { fr: "Régler NET_TIMEOUT sur la latence mesurée", en: "Set NET_TIMEOUT from measured latency" },
      objective: {
        fr: "Remplacer une valeur choisie au hasard par une valeur déduite d'une mesure.",
        en: "Replace a value picked at random with one derived from a measurement.",
      },
      steps: [
        { fr: "Mesurer la latence aller-retour vers le site de secours sur plusieurs minutes.", en: "Measure round-trip latency to the standby site over several minutes." },
        { fr: "Fixer NET_TIMEOUT à trois à cinq fois le maximum observé.", en: "Set NET_TIMEOUT to three to five times the observed maximum." },
        { fr: "Relever l'historique des ruptures de liaison dans V$DATAGUARD_STATUS.", en: "Review the link-break history in V$DATAGUARD_STATUS." },
      ],
      expected: {
        fr: "Les basculements en mode dégradé disparaissent, sans allonger inutilement le blocage en cas de panne réelle.",
        en: "Degraded-mode transitions disappear, without needlessly lengthening the stall on a real outage.",
      },
      code: `-- $ ping -c 200 site_secours | tail -2

ALTER SYSTEM SET log_archive_dest_2 =
 'SERVICE=orcl_sb SYNC AFFIRM NET_TIMEOUT=10 REOPEN=30
  VALID_FOR=(ONLINE_LOGFILES,PRIMARY_ROLE) DB_UNIQUE_NAME=orcl_sb';

SELECT TO_CHAR(timestamp,'DD/MM HH24:MI') AS quand, severity, message
FROM   v$dataguard_status ORDER BY timestamp DESC FETCH FIRST 20 ROWS ONLY;

SELECT protection_mode, protection_level FROM v$database;`,
      minutes: 25,
    },
    {
      title: { fr: "Protéger l'application du redo des rapports", en: "Protect redo apply from reports" },
      objective: {
        fr: "Empêcher les requêtes Active Data Guard de faire grandir l'apply lag.",
        en: "Stop Active Data Guard queries growing the apply lag.",
      },
      steps: [
        { fr: "Relever l'apply lag pendant qu'une charge de rapports s'exécute.", en: "Record the apply lag while a reporting load runs." },
        { fr: "Créer un plan Resource Manager plafonnant le groupe de rapports.", en: "Create a Resource Manager plan capping the reporting group." },
        { fr: "Relancer la même charge et comparer l'apply lag.", en: "Re-run the same load and compare the apply lag." },
      ],
      expected: {
        fr: "L'apply lag reste stable alors qu'il grandissait auparavant sous la même charge.",
        en: "The apply lag stays stable where it previously grew under the same load.",
      },
      code: `SELECT name, value FROM v$dataguard_stats WHERE name = 'apply lag';

BEGIN
  DBMS_RESOURCE_MANAGER.CREATE_PENDING_AREA;
  DBMS_RESOURCE_MANAGER.CREATE_PLAN('plan_adg', 'Rapports plafonnes');
  DBMS_RESOURCE_MANAGER.CREATE_CONSUMER_GROUP('grp_rapports', 'Rapports');
  DBMS_RESOURCE_MANAGER.CREATE_PLAN_DIRECTIVE(
    'plan_adg', 'grp_rapports', mgmt_p1 => 40);
  DBMS_RESOURCE_MANAGER.CREATE_PLAN_DIRECTIVE(
    'plan_adg', 'OTHER_GROUPS', mgmt_p1 => 60);
  DBMS_RESOURCE_MANAGER.VALIDATE_PENDING_AREA;
  DBMS_RESOURCE_MANAGER.SUBMIT_PENDING_AREA;
END;
/
ALTER SYSTEM SET resource_manager_plan = 'plan_adg';`,
      minutes: 30,
    },
  ],
  "dg-session-11": [
    {
      title: { fr: "Un service qui suit le rôle, de bout en bout", en: "A role-following service, end to end" },
      objective: {
        fr: "Vérifier qu'après un switchover, l'application se reconnecte seule au bon site.",
        en: "Verify that after a switchover the application reconnects to the right site on its own.",
      },
      steps: [
        { fr: "Créer le service des deux côtés avec le rôle PRIMARY.", en: "Create the service on both sides with the PRIMARY role." },
        { fr: "Ouvrir une session cliente par l'alias multi-adresses.", en: "Open a client session through the multi-address alias." },
        { fr: "Réaliser un switchover, puis vérifier où tourne le service.", en: "Perform a switchover, then check where the service runs." },
      ],
      expected: {
        fr: "Le service a démarré du côté de la nouvelle base principale, et le client s'y reconnecte sans reconfiguration.",
        en: "The service started on the new primary's side, and the client reconnects there with no reconfiguration.",
      },
      code: `$ srvctl add service -db orcl_pr -service ventes_svc -role PRIMARY \\
    -failovertype TRANSACTION -commit_outcome TRUE -notification TRUE
$ srvctl add service -db orcl_sb -service ventes_svc -role PRIMARY \\
    -failovertype TRANSACTION -commit_outcome TRUE -notification TRUE

DGMGRL> SWITCHOVER TO 'orcl_sb';

$ srvctl status service -db orcl_sb -service ventes_svc
SQL> SELECT name, con_id FROM v$active_services WHERE name = 'ventes_svc';`,
      minutes: 35,
    },
    {
      title: { fr: "Mesurer l'effet de TRANSPORT_CONNECT_TIMEOUT", en: "Measure the effect of TRANSPORT_CONNECT_TIMEOUT" },
      objective: {
        fr: "Chronométrer une reconnexion avec et sans le paramètre, pour voir d'où vient le temps perdu.",
        en: "Time a reconnection with and without the parameter, to see where the lost time comes from.",
      },
      steps: [
        { fr: "Rendre le premier site injoignable au niveau réseau.", en: "Make the first site unreachable at network level." },
        { fr: "Chronométrer une connexion par un alias sans TRANSPORT_CONNECT_TIMEOUT.", en: "Time a connection through an alias without TRANSPORT_CONNECT_TIMEOUT." },
        { fr: "Ajouter le paramètre et rechronométrer.", en: "Add the parameter and time it again." },
      ],
      expected: {
        fr: "La connexion passe de plus d'une minute à quelques secondes, sans qu'aucune base n'ait changé.",
        en: "Connection time drops from over a minute to a few seconds, with no database change at all.",
      },
      code: `# $ time sqlplus appli/mdp@VENTES_SANS_TIMEOUT
# $ time sqlplus appli/mdp@VENTES_AVEC_TIMEOUT

VENTES_AVEC_TIMEOUT =
 (DESCRIPTION =
   (CONNECT_TIMEOUT=10)(TRANSPORT_CONNECT_TIMEOUT=3)
   (RETRY_COUNT=20)(RETRY_DELAY=3)
   (ADDRESS_LIST =
     (ADDRESS=(PROTOCOL=TCP)(HOST=site-a)(PORT=1521))
     (ADDRESS=(PROTOCOL=TCP)(HOST=site-b)(PORT=1521)))
   (CONNECT_DATA=(SERVICE_NAME=ventes_svc)))`,
      minutes: 25,
    },
  ],

  // ═══════════ 1Z0-078 ═══════════
  "rac-session-7": [
    {
      title: { fr: "Constater le découplage de Flex ASM", en: "Observe the Flex ASM decoupling" },
      objective: {
        fr: "Arrêter une instance ASM et vérifier que les bases du nœud continuent de tourner.",
        en: "Stop an ASM instance and verify the node's databases keep running.",
      },
      steps: [
        { fr: "Vérifier que le cluster est en mode Flex et relever la cardinalité.", en: "Check the cluster is in Flex mode and note the cardinality." },
        { fr: "Noter quelle instance ASM sert chaque base dans GV$ASM_CLIENT.", en: "Note which ASM instance serves each database in GV$ASM_CLIENT." },
        { fr: "Arrêter une instance ASM, puis réinterroger la vue.", en: "Stop one ASM instance, then re-query the view." },
      ],
      expected: {
        fr: "Les bases se sont rattachées à une autre instance ASM et n'ont subi aucune interruption.",
        en: "The databases reattached to another ASM instance and suffered no interruption.",
      },
      code: `$ asmcmd showclustermode
$ srvctl config asm | grep -i count

SQL> SELECT inst_id, instance_name, db_name, status FROM gv$asm_client;

$ srvctl stop asm -node node2 -force
SQL> SELECT inst_id, instance_name, db_name, status FROM gv$asm_client;
$ srvctl status database -d orcl -v

$ srvctl start asm -node node2`,
      minutes: 30,
    },
    {
      title: { fr: "Volume ADVM, ACFS et instantané", en: "ADVM volume, ACFS and snapshot" },
      objective: {
        fr: "Créer un système de fichiers en cluster de bout en bout, puis un point de retour instantané.",
        en: "Create a clustered file system end to end, then an instant rollback point.",
      },
      steps: [
        { fr: "Créer un volume dans un groupe de disques, puis le système de fichiers.", en: "Create a volume in a disk group, then the file system." },
        { fr: "Le déclarer au cluster pour qu'il soit monté partout automatiquement.", en: "Declare it to the cluster so it mounts everywhere automatically." },
        { fr: "Poser un instantané, modifier des fichiers, puis comparer.", en: "Take a snapshot, modify files, then compare." },
      ],
      expected: {
        fr: "Le système de fichiers est visible sur tous les nœuds, et l'instantané conserve l'état antérieur.",
        en: "The file system is visible on every node, and the snapshot preserves the earlier state.",
      },
      code: `ASMCMD> volcreate -G DATA -s 10G labvol
ASMCMD> volinfo -G DATA labvol
# mkfs -t acfs /dev/asm/labvol-123
$ srvctl add filesystem -d /dev/asm/labvol-123 -m /u02/lab -g DATA
$ srvctl start filesystem -d /dev/asm/labvol-123

# echo "avant" > /u02/lab/fichier.txt
# acfsutil snap create -w photo1 /u02/lab
# echo "apres" > /u02/lab/fichier.txt
# cat /u02/lab/.ACFS/snaps/photo1/fichier.txt   -- "avant"
# acfsutil snap info /u02/lab`,
      minutes: 35,
    },
  ],
  "rac-session-8": [
    {
      title: { fr: "Ajouter un thread de redo et un undo", en: "Add a redo thread and an undo tablespace" },
      objective: {
        fr: "Préparer une troisième instance et comprendre pourquoi elle refuse de démarrer sans ces deux objets.",
        en: "Prepare a third instance and understand why it refuses to start without those two objects.",
      },
      steps: [
        { fr: "Tenter de démarrer une instance sans thread : constater l'erreur.", en: "Try starting an instance with no thread: observe the error." },
        { fr: "Créer le thread 3 avec trois groupes, puis l'activer en PUBLIC.", en: "Create thread 3 with three groups, then enable it PUBLIC." },
        { fr: "Créer le tablespace d'annulation et le déclarer pour ce SID.", en: "Create the undo tablespace and declare it for that SID." },
      ],
      expected: {
        fr: "L'instance démarre, et V$THREAD montre trois threads activés et publics.",
        en: "The instance starts, and V$THREAD shows three enabled, public threads.",
      },
      code: `ALTER DATABASE ADD LOGFILE THREAD 3
  GROUP 31 ('+DATA','+FRA') SIZE 512M,
  GROUP 32 ('+DATA','+FRA') SIZE 512M,
  GROUP 33 ('+DATA','+FRA') SIZE 512M;
ALTER DATABASE ENABLE PUBLIC THREAD 3;

CREATE UNDO TABLESPACE undotbs3 DATAFILE '+DATA' SIZE 4G AUTOEXTEND ON;
ALTER SYSTEM SET undo_tablespace='UNDOTBS3' SID='orcl3' SCOPE=SPFILE;

$ srvctl add instance -d orcl -i orcl3 -n node3
$ srvctl start instance -d orcl -i orcl3

SELECT thread#, instance, status, enabled FROM v$thread;`,
      minutes: 30,
    },
    {
      title: { fr: "Repérer les divergences de paramètres", en: "Spot parameter divergences" },
      objective: {
        fr: "Trouver en une requête tous les paramètres qui diffèrent entre instances.",
        en: "Find every parameter that differs between instances in a single query.",
      },
      steps: [
        { fr: "Fixer volontairement OPEN_CURSORS différemment sur une instance.", en: "Deliberately set OPEN_CURSORS differently on one instance." },
        { fr: "Exécuter la requête de comparaison sur GV$PARAMETER.", en: "Run the comparison query on GV$PARAMETER." },
        { fr: "Rétablir une valeur commune avec SID='*'.", en: "Restore a common value with SID='*'." },
      ],
      expected: {
        fr: "La requête isole exactement le paramètre divergent, puis n'en renvoie plus après correction.",
        en: "The query isolates exactly the divergent parameter, then returns none after the fix.",
      },
      code: `ALTER SYSTEM SET open_cursors = 400 SID='orcl2' SCOPE=BOTH;

SELECT name, COUNT(DISTINCT value) AS valeurs,
       LISTAGG(inst_id || '=' || value, ' | ')
         WITHIN GROUP (ORDER BY inst_id) AS detail
FROM   gv$parameter WHERE isdefault = 'FALSE'
GROUP  BY name HAVING COUNT(DISTINCT value) > 1;

ALTER SYSTEM SET open_cursors = 800 SID='*' SCOPE=BOTH;`,
      minutes: 20,
    },
  ],
  "rac-session-9": [
    {
      title: { fr: "Observer l'équilibrage à la connexion", en: "Observe connect-time balancing" },
      objective: {
        fr: "Vérifier que le listener SCAN répartit réellement les connexions entre instances.",
        en: "Verify the SCAN listener really spreads connections between instances.",
      },
      steps: [
        { fr: "Ouvrir cinquante connexions successives par le nom SCAN.", en: "Open fifty successive connections through the SCAN name." },
        { fr: "Compter les sessions par instance dans GV$SESSION.", en: "Count sessions per instance in GV$SESSION." },
        { fr: "Changer CLBGOAL de LONG à SHORT et recommencer.", en: "Change CLBGOAL from LONG to SHORT and start over." },
      ],
      expected: {
        fr: "La répartition change de mode : par nombre de sessions en LONG, par temps de réponse en SHORT.",
        en: "The distribution changes mode: by session count under LONG, by response time under SHORT.",
      },
      code: `-- $ for i in $(seq 1 50); do sqlplus -s appli/mdp@VENTES <<< "exit"; done

SELECT inst_id, COUNT(*) AS sessions
FROM   gv$session WHERE service_name = 'ventes_svc'
GROUP  BY inst_id ORDER BY inst_id;

$ srvctl modify service -db orcl -service ventes_svc -clbgoal SHORT
SELECT service_name, inst_id, goal, service_time, throughput
FROM   gv$servicemetric WHERE service_name = 'ventes_svc';`,
      minutes: 25,
    },
    {
      title: { fr: "Vérifier qu'Application Continuity est réellement armé", en: "Verify Application Continuity is genuinely armed" },
      objective: {
        fr: "Distinguer une configuration déclarée d'une configuration qui fonctionne.",
        en: "Tell a declared configuration from one that actually works.",
      },
      steps: [
        { fr: "Contrôler les attributs du service dans DBA_SERVICES.", en: "Check the service attributes in DBA_SERVICES." },
        { fr: "Ouvrir une session, lancer une transaction longue, tuer l'instance.", en: "Open a session, start a long transaction, kill the instance." },
        { fr: "Vérifier FAILED_OVER dans GV$SESSION et les compteurs de rejeu.", en: "Check FAILED_OVER in GV$SESSION and the replay counters." },
      ],
      expected: {
        fr: "La session poursuit sur une autre instance, et les compteurs de rejeu ont progressé.",
        en: "The session continues on another instance, and the replay counters have advanced.",
      },
      code: `SELECT name, failover_type, failover_method, commit_outcome,
       aq_ha_notifications, session_state_consistency
FROM   dba_services WHERE name = 'ventes_svc';

$ srvctl stop instance -d orcl -i orcl1 -o abort

SELECT inst_id, sid, failed_over, failover_type FROM gv$session
WHERE  service_name = 'ventes_svc';

SELECT inst_id, name, value FROM gv$sysstat WHERE name LIKE '%replay%';`,
      minutes: 30,
    },
  ],
  "rac-session-10": [
    {
      title: { fr: "Relocaliser une base RAC One Node en ligne", en: "Relocate a RAC One Node database online" },
      objective: {
        fr: "Déplacer l'instance d'un nœud à l'autre sans qu'aucune session ne reçoive d'erreur.",
        en: "Move the instance from one node to another with no session receiving an error.",
      },
      steps: [
        { fr: "Ouvrir plusieurs sessions actives par le service applicatif.", en: "Open several active sessions through the application service." },
        { fr: "Lancer la relocalisation avec un délai de trente minutes.", en: "Start the relocation with a thirty-minute timeout." },
        { fr: "Suivre la coexistence des deux instances, puis vérifier l'état final.", en: "Follow the two instances coexisting, then check the final state." },
      ],
      expected: {
        fr: "Les sessions migrent progressivement, et l'ancienne instance s'arrête d'elle-même une fois vidée.",
        en: "Sessions migrate gradually, and the old instance stops by itself once emptied.",
      },
      code: `$ srvctl config database -d orcl | grep -i "type\\|candidate"
$ srvctl status database -d orcl -v

$ srvctl relocate database -d orcl -node node2 -timeout 30

SQL> SELECT inst_id, COUNT(*) FROM gv$session
     WHERE service_name='ventes_svc' GROUP BY inst_id;

$ srvctl status database -d orcl -v`,
      minutes: 30,
    },
  ],
  "rac-session-11": [
    {
      title: { fr: "Ouvrir une PDB sur un sous-ensemble d'instances", en: "Open a PDB on a subset of instances" },
      objective: {
        fr: "Répartir production et décisionnel sur des instances distinctes, et le rendre persistant.",
        en: "Split production and reporting across distinct instances, and make it persistent.",
      },
      steps: [
        { fr: "Ouvrir une PDB sur deux instances, une autre en lecture seule sur la troisième.", en: "Open one PDB on two instances, another read-only on the third." },
        { fr: "Vérifier la répartition dans GV$PDBS.", en: "Check the distribution in GV$PDBS." },
        { fr: "Mémoriser l'état, redémarrer une instance et vérifier qu'il est conservé.", en: "Save the state, restart an instance and verify it is preserved." },
      ],
      expected: {
        fr: "Après le redémarrage, chaque PDB retrouve exactement le mode d'ouverture mémorisé.",
        en: "After the restart each PDB regains exactly the saved open mode.",
      },
      code: `ALTER PLUGGABLE DATABASE pdb_ventes OPEN INSTANCES = ('orcl1','orcl2');
ALTER PLUGGABLE DATABASE pdb_bi OPEN READ ONLY INSTANCES = ('orcl3');

SELECT inst_id, con_id, name, open_mode FROM gv$pdbs ORDER BY con_id, inst_id;

ALTER PLUGGABLE DATABASE pdb_ventes SAVE STATE INSTANCES = ('orcl1','orcl2');
ALTER PLUGGABLE DATABASE pdb_bi SAVE STATE INSTANCES = ('orcl3');
SELECT con_name, instance_name, state FROM dba_pdb_saved_states;

$ srvctl stop instance -d orcl -i orcl3 -o immediate
$ srvctl start instance -d orcl -i orcl3
SELECT inst_id, con_id, name, open_mode FROM gv$pdbs WHERE inst_id = 3;`,
      minutes: 30,
    },
  ],
  "rac-session-12": [
    {
      title: { fr: "Simuler avant d'agir avec crsctl eval", en: "Simulate before acting with crsctl eval" },
      objective: {
        fr: "Vérifier l'effet d'un arrêt de serveur sans arrêter quoi que ce soit.",
        en: "Check the effect of stopping a server without stopping anything.",
      },
      steps: [
        { fr: "Lister les pools de serveurs et leur contenu actuel.", en: "List the server pools and their current membership." },
        { fr: "Simuler l'arrêt d'un serveur, et lire ce qui se déplacerait.", en: "Simulate stopping a server, and read what would move." },
        { fr: "Simuler l'activation d'une autre politique.", en: "Simulate activating another policy." },
      ],
      expected: {
        fr: "La sortie détaille chaque relocalisation prévue, sans qu'aucune ressource n'ait bougé.",
        en: "The output details every planned relocation, with no resource having moved.",
      },
      code: `$ srvctl config srvpool
$ srvctl status srvpool -detail
# crsctl status server -f

# crsctl eval stop server node2 -f
# crsctl eval relocate server node3 -to pool_prod
# crsctl eval activate policy heures_creuses

$ srvctl predict database -db orcl
$ srvctl status srvpool -detail`,
      minutes: 25,
    },
    {
      title: { fr: "Rendre une application hautement disponible", en: "Make an application highly available" },
      objective: {
        fr: "Déclarer un processus non Oracle comme ressource Clusterware, avec sa VIP.",
        en: "Declare a non-Oracle process as a Clusterware resource, with its VIP.",
      },
      steps: [
        { fr: "Créer une VIP applicative et lui donner les droits d'usage.", en: "Create an application VIP and grant usage rights." },
        { fr: "Écrire un script d'action gérant start, stop, check et clean.", en: "Write an action script handling start, stop, check and clean." },
        { fr: "Déclarer la ressource avec ses dépendances, la démarrer, puis la relocaliser.", en: "Declare the resource with its dependencies, start it, then relocate it." },
      ],
      expected: {
        fr: "L'application et sa VIP migrent ensemble sur l'autre nœud, et le contrôle de santé reste vert.",
        en: "The application and its VIP migrate together to the other node, and the health check stays green.",
      },
      code: `# $GRID_HOME/bin/appvipcfg create -network=1 \\
#     -ip=10.20.30.55 -vipname=vip_lab -user=root
# crsctl setperm resource vip_lab -u user:oracle:r-x

# crsctl add resource appli_lab -type cluster_resource \\
#   -attr "ACTION_SCRIPT=/u01/scripts/appli_lab.sh,
#          PLACEMENT=restricted, HOSTING_MEMBERS=node1 node2,
#          CHECK_INTERVAL=30, RESTART_ATTEMPTS=2,
#          START_DEPENDENCIES='hard(vip_lab) pullup(vip_lab)',
#          STOP_DEPENDENCIES='hard(vip_lab)'"

# crsctl start resource appli_lab
# crsctl status resource appli_lab -f
# crsctl relocate resource appli_lab -n node2`,
      minutes: 40,
    },
  ],
};
