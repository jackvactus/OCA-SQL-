import type { Lab } from "./course-oca-sql";

/**
 * Travaux pratiques des trois cursus de spécialisation.
 *
 * Les exercices de la session Tuning se font sur une instance simple. Ceux de
 * Data Guard supposent deux bases, et ceux de RAC un cluster à deux nœuds —
 * une paire de machines virtuelles suffit. Chaque exercice se termine par un
 * résultat observable, de sorte que l'apprenant sache seul s'il a réussi.
 */
export const advancedSessionLabs: Record<string, Lab[]> = {
  // ═══════════════════ 1Z0-084 — Tuning ═══════════════════
  "tun-session-1": [
    {
      title: { fr: "Lire le modèle de temps plutôt qu'un ratio", en: "Read the time model rather than a ratio" },
      objective: {
        fr: "Constater qu'un hit ratio élevé n'empêche pas un DB time dominé par le CPU.",
        en: "Observe that a high hit ratio does not prevent a DB time dominated by CPU.",
      },
      steps: [
        { fr: "Relever DB time et DB CPU dans V$SYS_TIME_MODEL.", en: "Record DB time and DB CPU in V$SYS_TIME_MODEL." },
        { fr: "Lancer une jointure cartésienne sur une petite table, qui relit sans cesse les mêmes blocs.", en: "Run a Cartesian join on a small table, which re-reads the same blocks endlessly." },
        { fr: "Relever à nouveau les deux valeurs, puis calculer le hit ratio.", en: "Record both values again, then compute the hit ratio." },
      ],
      expected: {
        fr: "Le hit ratio approche 100 % alors que DB CPU a explosé : le ratio n'a rien vu.",
        en: "The hit ratio approaches 100 % while DB CPU has exploded: the ratio saw nothing.",
      },
      code: `SELECT stat_name, value FROM v$sys_time_model
WHERE  stat_name IN ('DB time','DB CPU');

SELECT COUNT(*) FROM all_objects a, all_objects b
WHERE  ROWNUM <= 5000000;

SELECT 1 - (phy.value / (cur.value + con.value)) AS hit_ratio
FROM   v$sysstat phy, v$sysstat cur, v$sysstat con
WHERE  phy.name = 'physical reads'
  AND  cur.name = 'db block gets'
  AND  con.name = 'consistent gets';`,
      minutes: 20,
    },
  ],
  "tun-session-2": [
    {
      title: { fr: "Encadrer un test par deux instantanés AWR", en: "Bracket a test with two AWR snapshots" },
      objective: {
        fr: "Produire un rapport AWR ne couvrant QUE la période du test, au lieu d'une heure entière.",
        en: "Produce an AWR report covering ONLY the test period, instead of a whole hour.",
      },
      steps: [
        { fr: "Créer un instantané manuel et noter son identifiant.", en: "Create a manual snapshot and note its id." },
        { fr: "Exécuter la charge à mesurer.", en: "Run the workload to be measured." },
        { fr: "Créer un second instantané, puis générer le rapport entre les deux.", en: "Create a second snapshot, then generate the report between the two." },
      ],
      expected: {
        fr: "Le rapport porte sur quelques minutes : les indicateurs ne sont plus dilués.",
        en: "The report covers a few minutes: the indicators are no longer diluted.",
      },
      code: `EXEC DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT;
SELECT MAX(snap_id) FROM dba_hist_snapshot;
-- … charge de travail …
EXEC DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT;
@?/rdbms/admin/awrrpt.sql`,
      minutes: 25,
    },
    {
      title: { fr: "Retrouver un pic passé avec ASH", en: "Find a past spike with ASH" },
      objective: {
        fr: "Localiser à la seconde un incident qu'AWR ne voit pas.",
        en: "Locate an incident to the second that AWR cannot see.",
      },
      steps: [
        { fr: "Provoquer une charge intense pendant deux minutes, puis attendre.", en: "Create a heavy load for two minutes, then wait." },
        { fr: "Interroger V$ACTIVE_SESSION_HISTORY sur cet intervalle précis.", en: "Query V$ACTIVE_SESSION_HISTORY over that exact interval." },
        { fr: "Compter les échantillons par événement d'attente et par SQL_ID.", en: "Count samples per wait event and per SQL_ID." },
      ],
      expected: {
        fr: "L'événement dominant et le SQL_ID responsable apparaissent clairement, alors que le rapport AWR de l'heure ne montre rien.",
        en: "The dominant event and the SQL_ID responsible appear clearly, while the hourly AWR report shows nothing.",
      },
      code: `SELECT NVL(event,'ON CPU') AS evenement, sql_id, COUNT(*) AS echantillons
FROM   v$active_session_history
WHERE  sample_time BETWEEN SYSTIMESTAMP - INTERVAL '10' MINUTE
                       AND SYSTIMESTAMP
GROUP  BY NVL(event,'ON CPU'), sql_id
ORDER  BY echantillons DESC FETCH FIRST 10 ROWS ONLY;`,
      minutes: 20,
    },
  ],
  "tun-session-3": [
    {
      title: { fr: "Distinguer sequential read et scattered read", en: "Tell sequential read from scattered read apart" },
      objective: {
        fr: "Provoquer chacun des deux événements et vérifier lequel correspond à quoi.",
        en: "Trigger each of the two events and verify which corresponds to what.",
      },
      steps: [
        { fr: "Relever les compteurs des deux événements dans V$SESSION_EVENT.", en: "Record both event counters in V$SESSION_EVENT." },
        { fr: "Forcer un accès par index sur une seule ligne, puis relever.", en: "Force an index access on a single row, then record." },
        { fr: "Forcer un balayage complet de la même table, puis relever.", en: "Force a full scan of the same table, then record." },
      ],
      expected: {
        fr: "L'accès par index incrémente sequential read ; le balayage complet incrémente scattered read.",
        en: "The index access increments sequential read; the full scan increments scattered read.",
      },
      code: `ALTER SYSTEM FLUSH BUFFER_CACHE;
SELECT event, total_waits FROM v$session_event
WHERE  sid = SYS_CONTEXT('USERENV','SID')
  AND  event LIKE 'db file s%';

SELECT /*+ INDEX(e emp_pk) */ * FROM employees e WHERE employee_id = 100;
SELECT /*+ FULL(e) */ COUNT(*) FROM employees e;`,
      minutes: 20,
    },
  ],
  "tun-session-4": [
    {
      title: { fr: "Comparer E-Rows et A-Rows", en: "Compare E-Rows and A-Rows" },
      objective: {
        fr: "Voir de ses yeux une estimation de cardinalité fausse d'un facteur cent.",
        en: "See with your own eyes a cardinality estimate wrong by a factor of a hundred.",
      },
      steps: [
        { fr: "Créer une table avec deux colonnes totalement corrélées.", en: "Create a table with two fully correlated columns." },
        { fr: "Collecter les statistiques sans statistiques étendues.", en: "Gather statistics without extended statistics." },
        { fr: "Exécuter une requête filtrant sur les deux colonnes, avec GATHER_PLAN_STATISTICS.", en: "Run a query filtering on both columns, with GATHER_PLAN_STATISTICS." },
      ],
      expected: {
        fr: "E-Rows vaut une poignée de lignes, A-Rows plusieurs milliers : l'optimiseur a multiplié deux sélectivités indépendantes.",
        en: "E-Rows shows a handful of rows, A-Rows several thousand: the optimizer multiplied two independent selectivities.",
      },
      code: `CREATE TABLE lab_corr AS
SELECT MOD(ROWNUM,10) AS a, MOD(ROWNUM,10) AS b FROM all_objects
WHERE ROWNUM <= 50000;
EXEC DBMS_STATS.GATHER_TABLE_STATS(USER,'LAB_CORR');

SELECT /*+ GATHER_PLAN_STATISTICS */ COUNT(*) FROM lab_corr WHERE a = 3 AND b = 3;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY_CURSOR(NULL,NULL,'ALLSTATS LAST'));`,
      minutes: 25,
    },
  ],
  "tun-session-5": [
    {
      title: { fr: "Corriger l'estimation par statistiques étendues", en: "Fix the estimate with extended statistics" },
      objective: {
        fr: "Faire disparaître l'écart E-Rows / A-Rows de l'exercice précédent.",
        en: "Make the E-Rows / A-Rows gap from the previous lab disappear.",
      },
      steps: [
        { fr: "Créer un groupe de colonnes sur (a, b).", en: "Create a column group on (a, b)." },
        { fr: "Recollecter les statistiques de la table.", en: "Re-gather the table's statistics." },
        { fr: "Réexécuter la même requête et comparer le plan.", en: "Re-run the same query and compare the plan." },
      ],
      expected: {
        fr: "E-Rows rejoint A-Rows : l'optimiseur connaît désormais la corrélation.",
        en: "E-Rows meets A-Rows: the optimizer now knows about the correlation.",
      },
      code: `SELECT DBMS_STATS.CREATE_EXTENDED_STATS(USER,'LAB_CORR','(a,b)') FROM dual;
EXEC DBMS_STATS.GATHER_TABLE_STATS(USER,'LAB_CORR');

SELECT /*+ GATHER_PLAN_STATISTICS */ COUNT(*) FROM lab_corr WHERE a = 3 AND b = 3;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY_CURSOR(NULL,NULL,'ALLSTATS LAST'));`,
      minutes: 20,
    },
    {
      title: { fr: "Annuler une collecte de statistiques", en: "Undo a statistics gather" },
      objective: {
        fr: "Utiliser l'historique de 31 jours pour revenir sur une collecte malheureuse.",
        en: "Use the 31-day history to roll back an unfortunate gather.",
      },
      steps: [
        { fr: "Noter l'horodatage courant, puis recollecter les statistiques d'une table.", en: "Note the current timestamp, then re-gather a table's statistics." },
        { fr: "Restaurer les statistiques telles qu'elles étaient avant.", en: "Restore the statistics as they were before." },
        { fr: "Vérifier dans DBA_TAB_STATS_HISTORY que la restauration est enregistrée.", en: "Check in DBA_TAB_STATS_HISTORY that the restore is recorded." },
      ],
      expected: {
        fr: "Les statistiques antérieures sont revenues, sans avoir eu à les recollecter.",
        en: "The previous statistics are back, with no need to re-gather them.",
      },
      code: `SELECT DBMS_STATS.GET_STATS_HISTORY_RETENTION FROM dual;   -- 31
EXEC DBMS_STATS.GATHER_TABLE_STATS(USER,'LAB_CORR');
EXEC DBMS_STATS.RESTORE_TABLE_STATS(USER,'LAB_CORR', SYSTIMESTAMP - 1/24);
SELECT * FROM dba_tab_stats_history WHERE table_name = 'LAB_CORR';`,
      minutes: 15,
    },
  ],
  "tun-session-6": [
    {
      title: { fr: "Verrouiller un plan par une baseline", en: "Lock a plan with a baseline" },
      objective: {
        fr: "Empêcher l'optimiseur d'adopter un nouveau plan sans l'avoir prouvé meilleur.",
        en: "Stop the optimizer adopting a new plan without proving it better.",
      },
      steps: [
        { fr: "Exécuter une requête, relever son SQL_ID et son PLAN_HASH_VALUE.", en: "Run a query, note its SQL_ID and PLAN_HASH_VALUE." },
        { fr: "Charger le plan courant comme baseline acceptée.", en: "Load the current plan as an accepted baseline." },
        { fr: "Créer un index qui changerait le plan, puis réexécuter la requête.", en: "Create an index that would change the plan, then re-run the query." },
      ],
      expected: {
        fr: "Le plan initial est conservé, et la note du plan indique l'usage d'une SQL plan baseline.",
        en: "The original plan is kept, and the plan note reports that a SQL plan baseline was used.",
      },
      code: `SELECT sql_id, plan_hash_value FROM v$sql WHERE sql_text LIKE 'SELECT /* lab6 */%';

DECLARE n PLS_INTEGER;
BEGIN
  n := DBMS_SPM.LOAD_PLANS_FROM_CURSOR_CACHE(sql_id => '&sql_id');
END;
/
SELECT sql_handle, plan_name, enabled, accepted FROM dba_sql_plan_baselines;`,
      minutes: 30,
    },
  ],
  "tun-session-7": [
    {
      title: { fr: "Chiffrer le gain d'un buffer cache plus grand", en: "Quantify the gain of a larger buffer cache" },
      objective: {
        fr: "Remplacer l'intuition par le tableau de décision de V$DB_CACHE_ADVICE.",
        en: "Replace intuition with the decision table in V$DB_CACHE_ADVICE.",
      },
      steps: [
        { fr: "Vérifier que DB_CACHE_ADVICE est activé.", en: "Check that DB_CACHE_ADVICE is enabled." },
        { fr: "Faire tourner une charge de lecture représentative pendant plusieurs minutes.", en: "Run a representative read workload for several minutes." },
        { fr: "Lire les lectures physiques estimées pour chaque taille simulée.", en: "Read the estimated physical reads for each simulated size." },
      ],
      expected: {
        fr: "La courbe montre à partir de quelle taille le gain devient négligeable : c'est le point d'arrêt.",
        en: "The curve shows the size beyond which the gain becomes negligible: that is the stopping point.",
      },
      code: `SHOW PARAMETER db_cache_advice
ALTER SYSTEM SET db_cache_advice = ON;

SELECT size_for_estimate AS taille_mb, size_factor,
       estd_physical_reads, estd_physical_read_time
FROM   v$db_cache_advice
WHERE  name = 'DEFAULT' AND block_size = 8192
ORDER  BY size_for_estimate;`,
      minutes: 25,
    },
  ],
  "tun-session-8": [
    {
      title: { fr: "Fabriquer un bloc chaud, puis le refroidir", en: "Create a hot block, then cool it down" },
      objective: {
        fr: "Constater les buffer busy waits d'un index sur clé croissante, et l'effet d'un index inversé.",
        en: "Observe the buffer busy waits of an ascending-key index, and the effect of a reverse-key index.",
      },
      steps: [
        { fr: "Créer une table avec un index B-tree sur une séquence croissante.", en: "Create a table with a B-tree index on an ascending sequence." },
        { fr: "Insérer massivement depuis plusieurs sessions simultanées et relever les attentes.", en: "Insert heavily from several concurrent sessions and record the waits." },
        { fr: "Recréer l'index en REVERSE et refaire la mesure.", en: "Rebuild the index as REVERSE and measure again." },
      ],
      expected: {
        fr: "Les buffer busy waits chutent nettement après le passage en index inversé.",
        en: "Buffer busy waits drop markedly after switching to a reverse-key index.",
      },
      code: `CREATE TABLE lab_hot (id NUMBER, v VARCHAR2(100));
CREATE INDEX lab_hot_i ON lab_hot(id);
CREATE SEQUENCE lab_seq CACHE 20;

-- depuis plusieurs sessions simultanees
BEGIN FOR i IN 1..100000 LOOP
  INSERT INTO lab_hot VALUES (lab_seq.NEXTVAL, 'x'); COMMIT;
END LOOP; END;
/
SELECT event, total_waits FROM v$system_event WHERE event = 'buffer busy waits';
ALTER INDEX lab_hot_i REBUILD REVERSE;`,
      minutes: 30,
    },
  ],
  "tun-session-9": [
    {
      title: { fr: "Tracer une session et lire le rapport tkprof", en: "Trace a session and read the tkprof report" },
      objective: {
        fr: "Obtenir le détail parse / execute / fetch d'une instruction, avec ses attentes.",
        en: "Obtain the parse / execute / fetch breakdown of a statement, with its waits.",
      },
      steps: [
        { fr: "Activer la trace au niveau 12 sur la session courante.", en: "Enable level-12 tracing on the current session." },
        { fr: "Exécuter la requête à analyser, puis désactiver la trace.", en: "Run the query to analyse, then disable tracing." },
        { fr: "Localiser le fichier de trace et le mettre en forme par tkprof.", en: "Locate the trace file and format it with tkprof." },
      ],
      expected: {
        fr: "Le rapport montre les compteurs par phase, le temps écoulé et les événements d'attente.",
        en: "The report shows per-phase counters, elapsed time and wait events.",
      },
      code: `ALTER SESSION SET tracefile_identifier = 'lab_tune';
ALTER SESSION SET events '10046 trace name context forever, level 12';
-- … requête à analyser …
ALTER SESSION SET events '10046 trace name context off';

SELECT value FROM v$diag_info WHERE name = 'Default Trace File';
-- $ tkprof <fichier>.trc rapport.txt sys=no sort=prsela,exeela,fchela`,
      minutes: 30,
    },
    {
      title: { fr: "Suivre un batch avec Real-Time SQL Monitoring", en: "Track a batch with Real-Time SQL Monitoring" },
      objective: {
        fr: "Obtenir un rapport unique couvrant plusieurs instructions enchaînées.",
        en: "Obtain a single report covering several chained statements.",
      },
      steps: [
        { fr: "Ouvrir une opération de base de données nommée.", en: "Open a named database operation." },
        { fr: "Exécuter deux ou trois instructions longues.", en: "Run two or three long statements." },
        { fr: "Fermer l'opération et générer le rapport HTML.", en: "Close the operation and generate the HTML report." },
      ],
      expected: {
        fr: "Le rapport couvre l'ensemble du batch, et non chaque instruction séparément.",
        en: "The report covers the whole batch, not each statement separately.",
      },
      code: `VARIABLE eid NUMBER
EXEC DBMS_SQL_MONITOR.BEGIN_OPERATION(dbop_name => 'batch_nuit', dbop_eid => :eid);
-- … instructions du batch …
EXEC DBMS_SQL_MONITOR.END_OPERATION(dbop_name => 'batch_nuit', dbop_eid => :eid);

SELECT DBMS_SQL_MONITOR.REPORT_SQL_MONITOR(
         dbop_name => 'batch_nuit', type => 'HTML') FROM dual;`,
      minutes: 25,
    },
  ],
  "tun-session-10": [
    {
      title: { fr: "Mesurer le result cache", en: "Measure the result cache" },
      objective: {
        fr: "Constater le gain d'une requête mise en cache, puis son invalidation par un DML.",
        en: "Observe the gain of a cached query, then its invalidation by a DML.",
      },
      steps: [
        { fr: "Exécuter deux fois une agrégation coûteuse avec le hint RESULT_CACHE.", en: "Run a costly aggregation twice with the RESULT_CACHE hint." },
        { fr: "Vérifier la présence de l'entrée dans V$RESULT_CACHE_OBJECTS.", en: "Check the entry exists in V$RESULT_CACHE_OBJECTS." },
        { fr: "Modifier une ligne de la table source, valider, puis réinterroger la vue.", en: "Modify one row of the source table, commit, then query the view again." },
      ],
      expected: {
        fr: "La deuxième exécution est quasi instantanée ; après le DML validé, le statut passe à Invalid.",
        en: "The second run is near-instant; after the committed DML, the status becomes Invalid.",
      },
      code: `SELECT /*+ RESULT_CACHE */ department_id, AVG(salary)
FROM   employees GROUP BY department_id;

SELECT id, type, status, name FROM v$result_cache_objects
WHERE  type = 'Result';

UPDATE employees SET salary = salary WHERE ROWNUM = 1;
COMMIT;
SELECT id, status FROM v$result_cache_objects WHERE type = 'Result';`,
      minutes: 20,
    },
  ],

  // ═══════════════════ 1Z0-076 — Data Guard ═══════════════════
  "dg-session-1": [
    {
      title: { fr: "Aller-retour vers une base de secours instantanée", en: "Round trip to a snapshot standby" },
      objective: {
        fr: "Tester une modification destructrice sur des données réelles, puis tout annuler.",
        en: "Test a destructive change on real data, then undo everything.",
      },
      steps: [
        { fr: "Convertir la base de secours physique en base instantanée.", en: "Convert the physical standby to a snapshot standby." },
        { fr: "Supprimer une table, valider, puis constater la modification.", en: "Drop a table, commit, then observe the change." },
        { fr: "Reconvertir en base de secours physique et vérifier que la table est revenue.", en: "Convert back to a physical standby and check the table is back." },
      ],
      expected: {
        fr: "La table est de retour, et la base de secours a rattrapé tout le redo accumulé pendant les tests.",
        en: "The table is back, and the standby has caught up on all redo accumulated during the tests.",
      },
      code: `DGMGRL> CONVERT DATABASE 'orcl_sb' TO SNAPSHOT STANDBY;
SQL> SELECT database_role, open_mode FROM v$database;
SQL> DROP TABLE hr.employees PURGE;
DGMGRL> CONVERT DATABASE 'orcl_sb' TO PHYSICAL STANDBY;
SQL> SELECT COUNT(*) FROM hr.employees;`,
      minutes: 40,
    },
  ],
  "dg-session-2": [
    {
      title: { fr: "Créer une base de secours par duplication active", en: "Create a standby with an active duplicate" },
      objective: {
        fr: "Construire une base de secours complète sans sauvegarde préalable.",
        en: "Build a complete standby with no prior backup.",
      },
      steps: [
        { fr: "Préparer la base principale : FORCE LOGGING, standby redo logs, paramètres.", en: "Prepare the primary: FORCE LOGGING, standby redo logs, parameters." },
        { fr: "Copier le fichier de mots de passe et démarrer l'instance auxiliaire en NOMOUNT.", en: "Copy the password file and start the auxiliary instance in NOMOUNT." },
        { fr: "Lancer la duplication, puis démarrer l'application du redo.", en: "Run the duplicate, then start redo apply." },
      ],
      expected: {
        fr: "V$MANAGED_STANDBY montre MRP0 en APPLYING_LOG et V$ARCHIVE_GAP reste vide.",
        en: "V$MANAGED_STANDBY shows MRP0 as APPLYING_LOG and V$ARCHIVE_GAP stays empty.",
      },
      code: `RMAN> DUPLICATE TARGET DATABASE FOR STANDBY FROM ACTIVE DATABASE DORECOVER;
SQL> ALTER DATABASE RECOVER MANAGED STANDBY DATABASE
       USING CURRENT LOGFILE DISCONNECT FROM SESSION;
SQL> SELECT process, status, sequence# FROM v$managed_standby;
SQL> SELECT * FROM v$archive_gap;`,
      minutes: 60,
    },
    {
      title: { fr: "Prouver la fidélité de la réplique", en: "Prove the replica is faithful" },
      objective: {
        fr: "Comparer physiquement les deux bases plutôt que de supposer qu'elles sont identiques.",
        en: "Physically compare both databases rather than assuming they match.",
      },
      steps: [
        { fr: "Exécuter DBMS_DBCOMP.DBCOMP sur l'ensemble des fichiers.", en: "Run DBMS_DBCOMP.DBCOMP over all files." },
        { fr: "Lire le fichier de sortie produit dans le répertoire de trace.", en: "Read the output file produced in the trace directory." },
      ],
      expected: {
        fr: "Le rapport ne signale aucune divergence de bloc entre les deux bases.",
        en: "The report reports no block divergence between the two databases.",
      },
      code: `BEGIN
  DBMS_DBCOMP.DBCOMP(datafile => 'all', outfile => 'dbcomp_lab', block_dump => TRUE);
END;
/`,
      minutes: 25,
    },
  ],
  "dg-session-3": [
    {
      title: { fr: "Inventorier ce que SQL Apply ne sait pas répliquer", en: "Inventory what SQL Apply cannot replicate" },
      objective: {
        fr: "Vérifier AVANT de s'engager qu'aucune table critique n'est hors périmètre.",
        en: "Verify BEFORE committing that no critical table is out of scope.",
      },
      steps: [
        { fr: "Interroger DBA_LOGSTDBY_UNSUPPORTED sur la base principale.", en: "Query DBA_LOGSTDBY_UNSUPPORTED on the primary." },
        { fr: "Croiser le résultat avec la liste des tables métier.", en: "Cross the result with the list of business tables." },
        { fr: "Activer la journalisation supplémentaire et vérifier sa prise en compte.", en: "Enable supplemental logging and confirm it is in effect." },
      ],
      expected: {
        fr: "La liste des objets non pris en charge est connue, et V$DATABASE confirme la journalisation supplémentaire.",
        en: "The list of unsupported objects is known, and V$DATABASE confirms supplemental logging.",
      },
      code: `SELECT owner, table_name, column_name, data_type
FROM   dba_logstdby_unsupported ORDER BY owner, table_name;

ALTER DATABASE ADD SUPPLEMENTAL LOG DATA (PRIMARY KEY, UNIQUE INDEX) COLUMNS;

SELECT supplemental_log_data_min, supplemental_log_data_pk,
       supplemental_log_data_ui FROM v$database;`,
      minutes: 20,
    },
  ],
  "dg-session-4": [
    {
      title: { fr: "Changer de mode de protection", en: "Change the protection mode" },
      objective: {
        fr: "Comprendre l'ordre des opérations : le transport d'abord, le mode ensuite.",
        en: "Understand the order of operations: transport first, mode second.",
      },
      steps: [
        { fr: "Tenter de passer en Maximum Availability avec un transport ASYNC.", en: "Try switching to Maximum Availability with ASYNC transport." },
        { fr: "Passer la destination en SYNC AFFIRM, puis réessayer.", en: "Set the destination to SYNC AFFIRM, then retry." },
        { fr: "Comparer PROTECTION_MODE et PROTECTION_LEVEL dans V$DATABASE.", en: "Compare PROTECTION_MODE and PROTECTION_LEVEL in V$DATABASE." },
      ],
      expected: {
        fr: "La première tentative échoue ; après le passage en SYNC, les deux colonnes s'alignent.",
        en: "The first attempt fails; after switching to SYNC, both columns align.",
      },
      code: `ALTER DATABASE SET STANDBY DATABASE TO MAXIMIZE AVAILABILITY;   -- echec attendu

ALTER SYSTEM SET log_archive_dest_2 =
 'SERVICE=orcl_sb SYNC AFFIRM VALID_FOR=(ONLINE_LOGFILES,PRIMARY_ROLE)
  DB_UNIQUE_NAME=orcl_sb';
ALTER DATABASE SET STANDBY DATABASE TO MAXIMIZE AVAILABILITY;

SELECT protection_mode, protection_level FROM v$database;`,
      minutes: 30,
    },
  ],
  "dg-session-5": [
    {
      title: { fr: "Mettre la configuration sous Broker et la valider", en: "Put the configuration under the Broker and validate it" },
      objective: {
        fr: "Passer du pilotage manuel au pilotage centralisé, puis prouver que la bascule est possible.",
        en: "Move from manual to centralised control, then prove a transition is possible.",
      },
      steps: [
        { fr: "Activer DG_BROKER_START sur les deux bases.", en: "Enable DG_BROKER_START on both databases." },
        { fr: "Créer la configuration, ajouter la base de secours et l'activer.", en: "Create the configuration, add the standby and enable it." },
        { fr: "Exécuter VALIDATE DATABASE et VALIDATE NETWORK CONFIGURATION.", en: "Run VALIDATE DATABASE and VALIDATE NETWORK CONFIGURATION." },
      ],
      expected: {
        fr: "SHOW CONFIGURATION affiche SUCCESS et VALIDATE ne signale aucun manque.",
        en: "SHOW CONFIGURATION reports SUCCESS and VALIDATE flags nothing missing.",
      },
      code: `SQL> ALTER SYSTEM SET dg_broker_start = TRUE SCOPE=BOTH;

DGMGRL> CREATE CONFIGURATION 'lab_dg' AS PRIMARY DATABASE IS 'orcl_pr'
          CONNECT IDENTIFIER IS orcl_pr;
DGMGRL> ADD DATABASE 'orcl_sb' AS CONNECT IDENTIFIER IS orcl_sb MAINTAINED AS PHYSICAL;
DGMGRL> ENABLE CONFIGURATION;
DGMGRL> SHOW CONFIGURATION;
DGMGRL> VALIDATE DATABASE 'orcl_sb';
DGMGRL> VALIDATE NETWORK CONFIGURATION FOR ALL;`,
      minutes: 35,
    },
  ],
  "dg-session-6": [
    {
      title: { fr: "Répéter un switchover", en: "Rehearse a switchover" },
      objective: {
        fr: "Vérifier que la reprise fonctionne réellement, avant d'en avoir besoin.",
        en: "Verify that recovery actually works, before you need it.",
      },
      steps: [
        { fr: "Exécuter VALIDATE DATABASE sur la base de secours.", en: "Run VALIDATE DATABASE on the standby." },
        { fr: "Réaliser le switchover, puis vérifier les rôles des deux bases.", en: "Perform the switchover, then check both databases' roles." },
        { fr: "Refaire le switchover en sens inverse pour revenir à l'état initial.", en: "Switch back to return to the initial state." },
      ],
      expected: {
        fr: "Les deux bascules se terminent sans erreur, et SHOW CONFIGURATION affiche SUCCESS.",
        en: "Both transitions complete without error, and SHOW CONFIGURATION reports SUCCESS.",
      },
      code: `DGMGRL> VALIDATE DATABASE 'orcl_sb';
DGMGRL> SWITCHOVER TO 'orcl_sb';
DGMGRL> SHOW CONFIGURATION;
DGMGRL> SWITCHOVER TO 'orcl_pr';`,
      minutes: 45,
    },
    {
      title: { fr: "Failover puis réinstanciation", en: "Failover then reinstatement" },
      objective: {
        fr: "Constater que Flashback évite de recréer l'ancienne base principale.",
        en: "Observe that Flashback avoids rebuilding the former primary.",
      },
      steps: [
        { fr: "Vérifier que Flashback est activé sur les deux bases.", en: "Check Flashback is enabled on both databases." },
        { fr: "Arrêter brutalement la base principale, puis exécuter un failover.", en: "Abort the primary, then perform a failover." },
        { fr: "Redémarrer l'ancienne principale en MOUNT et lancer REINSTATE.", en: "Restart the former primary in MOUNT and run REINSTATE." },
      ],
      expected: {
        fr: "L'ancienne principale redevient base de secours en quelques minutes, sans duplication.",
        en: "The former primary becomes the standby again within minutes, with no duplicate.",
      },
      code: `SQL> SELECT flashback_on FROM v$database;
SQL> SHUTDOWN ABORT;
DGMGRL> FAILOVER TO 'orcl_sb';
SQL> STARTUP MOUNT;
DGMGRL> REINSTATE DATABASE 'orcl_pr';
DGMGRL> SHOW CONFIGURATION;`,
      minutes: 50,
    },
  ],
  "dg-session-7": [
    {
      title: { fr: "Décharger la sauvegarde sur la base de secours", en: "Offload the backup to the standby" },
      objective: {
        fr: "Prouver qu'une sauvegarde prise côté secours est utilisable pour la base principale.",
        en: "Prove a backup taken on the standby can be used for the primary.",
      },
      steps: [
        { fr: "Activer le suivi des blocs modifiés sur la base de secours.", en: "Enable block change tracking on the standby." },
        { fr: "Sauvegarder la base depuis la base de secours.", en: "Back up the database from the standby." },
        { fr: "Depuis la principale, lister la sauvegarde et vérifier qu'elle est utilisable.", en: "From the primary, list the backup and confirm it is usable." },
      ],
      expected: {
        fr: "RMAN sur la principale voit la sauvegarde et RESTORE DATABASE VALIDATE la reconnaît comme exploitable.",
        en: "RMAN on the primary sees the backup and RESTORE DATABASE VALIDATE recognises it as usable.",
      },
      code: `-- sur la base de secours
SQL> ALTER DATABASE ENABLE BLOCK CHANGE TRACKING USING FILE '/u02/bct_sb.dbf';
RMAN> CONNECT TARGET sys/mdp@orcl_sb CATALOG rman/mdp@cat
RMAN> BACKUP DATABASE PLUS ARCHIVELOG;

-- sur la principale
RMAN> CONNECT TARGET sys/mdp@orcl_pr CATALOG rman/mdp@cat
RMAN> LIST BACKUP SUMMARY;
RMAN> RESTORE DATABASE VALIDATE;`,
      minutes: 35,
    },
  ],
  "dg-session-8": [
    {
      title: { fr: "Reproduire l'erreur ORA-16191", en: "Reproduce the ORA-16191 error" },
      objective: {
        fr: "Provoquer la panne d'exploitation la plus fréquente, puis la corriger.",
        en: "Trigger the most frequent operational failure, then fix it.",
      },
      steps: [
        { fr: "Changer le mot de passe SYS sur la base principale uniquement.", en: "Change the SYS password on the primary only." },
        { fr: "Forcer un changement de fichier journal et surveiller l'alert log.", en: "Force a log switch and watch the alert log." },
        { fr: "Recopier le fichier de mots de passe, puis vérifier la reprise du transport.", en: "Copy the password file across, then check transport resumes." },
      ],
      expected: {
        fr: "ORA-16191 apparaît dans l'alert log, puis le transport repart dès le fichier recopié.",
        en: "ORA-16191 appears in the alert log, then transport resumes as soon as the file is copied.",
      },
      code: `SQL> ALTER USER sys IDENTIFIED BY nouveau_mdp;
SQL> ALTER SYSTEM SWITCH LOGFILE;
SQL> SELECT message FROM v$dataguard_status ORDER BY timestamp DESC FETCH FIRST 5 ROWS ONLY;
-- $ scp $ORACLE_HOME/dbs/orapworcl secours:$ORACLE_HOME/dbs/
SQL> SELECT name, value FROM v$dataguard_stats WHERE name = 'transport lag';`,
      minutes: 30,
    },
    {
      title: { fr: "Un service qui suit le rôle", en: "A service that follows the role" },
      objective: {
        fr: "Faire démarrer un service uniquement sur la base ayant le rôle PRIMARY.",
        en: "Make a service start only on the database holding the PRIMARY role.",
      },
      steps: [
        { fr: "Créer le service et un trigger sur DB_ROLE_CHANGE.", en: "Create the service and a DB_ROLE_CHANGE trigger." },
        { fr: "Réaliser un switchover.", en: "Perform a switchover." },
        { fr: "Vérifier de quel côté le service tourne après la bascule.", en: "Check which side the service runs on after the transition." },
      ],
      expected: {
        fr: "Le service a suivi le rôle : il tourne sur la nouvelle base principale, sans intervention.",
        en: "The service followed the role: it runs on the new primary, with no intervention.",
      },
      code: `CREATE OR REPLACE TRIGGER svc_role_change
AFTER DB_ROLE_CHANGE ON DATABASE
DECLARE r VARCHAR2(30);
BEGIN
  SELECT database_role INTO r FROM v$database;
  IF r = 'PRIMARY' THEN DBMS_SERVICE.START_SERVICE('ventes_svc');
  ELSE BEGIN DBMS_SERVICE.STOP_SERVICE('ventes_svc'); EXCEPTION WHEN OTHERS THEN NULL; END;
  END IF;
END;
/`,
      minutes: 30,
    },
  ],

  // ═══════════════════ 1Z0-078 — Clusterware, ASM et RAC ═══════════════════
  "rac-session-1": [
    {
      title: { fr: "Vérifier les prérequis avec cluvfy", en: "Check prerequisites with cluvfy" },
      objective: {
        fr: "Faire remonter les défauts de configuration AVANT de lancer l'installation.",
        en: "Surface configuration defects BEFORE launching the installation.",
      },
      steps: [
        { fr: "Exécuter la vérification préalable à l'installation sur les deux nœuds.", en: "Run the pre-installation check on both nodes." },
        { fr: "Vérifier que le nom SCAN résout bien vers trois adresses.", en: "Verify the SCAN name resolves to three addresses." },
        { fr: "Contrôler la MTU et l'absence de perte sur l'interconnexion.", en: "Check the MTU and the absence of loss on the interconnect." },
      ],
      expected: {
        fr: "cluvfy ne signale plus d'échec, et nslookup renvoie trois adresses pour le SCAN.",
        en: "cluvfy reports no failure, and nslookup returns three addresses for the SCAN.",
      },
      code: `$ ./runcluvfy.sh stage -pre crsinst -n node1,node2 -verbose
$ nslookup cluster-scan.exemple.local
$ ping -M do -s 8972 node2-priv
$ ip link show eth1`,
      minutes: 25,
    },
  ],
  "rac-session-2": [
    {
      title: { fr: "Distinguer crsctl de srvctl", en: "Tell crsctl from srvctl apart" },
      objective: {
        fr: "Ancrer la règle de tri par la pratique, sur les deux outils.",
        en: "Anchor the sorting rule through practice, on both tools.",
      },
      steps: [
        { fr: "Afficher l'état de toutes les ressources avec crsctl.", en: "Show the state of every resource with crsctl." },
        { fr: "Arrêter puis redémarrer une instance de base avec srvctl.", en: "Stop then restart a database instance with srvctl." },
        { fr: "Vérifier que crsctl reflète le changement.", en: "Check crsctl reflects the change." },
      ],
      expected: {
        fr: "L'instance passe à OFFLINE puis revient à ONLINE dans la sortie de crsctl.",
        en: "The instance goes OFFLINE then back ONLINE in the crsctl output.",
      },
      code: `# crsctl stat res -t
$ srvctl stop instance -d orcl -i orcl2 -o immediate
# crsctl stat res -t | grep orcl
$ srvctl start instance -d orcl -i orcl2`,
      minutes: 20,
    },
    {
      title: { fr: "Sauvegarder et inspecter l'OCR", en: "Back up and inspect the OCR" },
      objective: {
        fr: "Savoir où trouver les sauvegardes automatiques et comment en créer une à la demande.",
        en: "Know where the automatic backups live and how to create one on demand.",
      },
      steps: [
        { fr: "Vérifier l'intégrité de l'OCR et de l'OLR.", en: "Check OCR and OLR integrity." },
        { fr: "Lister les sauvegardes automatiques.", en: "List the automatic backups." },
        { fr: "Créer une sauvegarde manuelle de l'OLR.", en: "Create a manual OLR backup." },
      ],
      expected: {
        fr: "ocrcheck signale un OCR sain, et la liste montre des sauvegardes espacées de 4 heures.",
        en: "ocrcheck reports a healthy OCR, and the list shows backups four hours apart.",
      },
      code: `# ocrcheck
# ocrcheck -local
# ocrconfig -showbackup
# ocrconfig -local -manualbackup
# crsctl query css votedisk`,
      minutes: 20,
    },
  ],
  "rac-session-3": [
    {
      title: { fr: "Créer un groupe de disques en redondance normale", en: "Create a normal-redundancy disk group" },
      objective: {
        fr: "Voir l'effet des groupes de pannes sur l'espace réellement utilisable.",
        en: "See the effect of failure groups on the space actually usable.",
      },
      steps: [
        { fr: "Créer un groupe de disques avec deux groupes de pannes.", en: "Create a disk group with two failure groups." },
        { fr: "Comparer TOTAL_MB, FREE_MB et USABLE_FILE_MB.", en: "Compare TOTAL_MB, FREE_MB and USABLE_FILE_MB." },
        { fr: "Retirer un disque et observer le rééquilibrage.", en: "Drop a disk and watch the rebalance." },
      ],
      expected: {
        fr: "USABLE_FILE_MB est nettement inférieur à FREE_MB : la redondance réserve de l'espace.",
        en: "USABLE_FILE_MB is markedly below FREE_MB: redundancy reserves space.",
      },
      code: `CREATE DISKGROUP lab_dg NORMAL REDUNDANCY
  FAILGROUP fg_a DISK '/dev/oracleasm/disks/D1'
  FAILGROUP fg_b DISK '/dev/oracleasm/disks/D2';

SELECT name, type, total_mb, free_mb, required_mirror_free_mb, usable_file_mb
FROM   v$asm_diskgroup WHERE name = 'LAB_DG';

ALTER DISKGROUP lab_dg DROP DISK lab_dg_0001 REBALANCE POWER 4;
SELECT operation, state, power, sofar, est_work, est_minutes FROM v$asm_operation;`,
      minutes: 35,
    },
  ],
  "rac-session-4": [
    {
      title: { fr: "Surveiller l'espace réellement utilisable", en: "Monitor the space actually usable" },
      objective: {
        fr: "Comprendre pourquoi USABLE_FILE_MB, et non FREE_MB, doit déclencher l'alerte.",
        en: "Understand why USABLE_FILE_MB, not FREE_MB, must raise the alert.",
      },
      steps: [
        { fr: "Relever TOTAL_MB, FREE_MB et USABLE_FILE_MB d'un groupe en redondance normale.", en: "Record TOTAL_MB, FREE_MB and USABLE_FILE_MB of a normal-redundancy group." },
        { fr: "Remplir le groupe jusqu'à rendre USABLE_FILE_MB négatif.", en: "Fill the group until USABLE_FILE_MB goes negative." },
        { fr: "Explorer le contenu du groupe avec asmcmd.", en: "Explore the group's contents with asmcmd." },
      ],
      expected: {
        fr: "FREE_MB reste positif alors qu'USABLE_FILE_MB est déjà négatif : la reconstruction n'est plus possible.",
        en: "FREE_MB stays positive while USABLE_FILE_MB is already negative: rebuilding is no longer possible.",
      },
      code: `SELECT name, type, total_mb, free_mb,
       required_mirror_free_mb, usable_file_mb
FROM   v$asm_diskgroup;

$ asmcmd lsdg
$ asmcmd du +DATA/ORCL
$ asmcmd ls -l +DATA/ORCL/DATAFILE/`,
      minutes: 20,
    },
  ],
  "rac-session-5": [
    {
      title: { fr: "Observer Cache Fusion à l'œuvre", en: "Watch Cache Fusion at work" },
      objective: {
        fr: "Mesurer le transfert d'un bloc d'une instance à l'autre par l'interconnexion.",
        en: "Measure a block transfer from one instance to another over the interconnect.",
      },
      steps: [
        { fr: "Relever les statistiques « gc blocks received » sur les deux instances.", en: "Record the “gc blocks received” statistics on both instances." },
        { fr: "Modifier une ligne depuis l'instance 1, puis la lire depuis l'instance 2.", en: "Modify a row from instance 1, then read it from instance 2." },
        { fr: "Relever à nouveau les statistiques et l'attente « gc cr block 2-way ».", en: "Record the statistics and the “gc cr block 2-way” wait again." },
      ],
      expected: {
        fr: "Le compteur a augmenté et l'attente apparaît : le bloc a transité par le réseau, pas par le disque.",
        en: "The counter has grown and the wait appears: the block travelled over the network, not via disk.",
      },
      code: `SELECT inst_id, name, value FROM gv$sysstat
WHERE  name LIKE 'gc%blocks received' ORDER BY inst_id;

-- instance 1
UPDATE lab_rac SET v = v + 1 WHERE id = 1;
-- instance 2
SELECT * FROM lab_rac WHERE id = 1;

SELECT inst_id, event, total_waits FROM gv$system_event
WHERE  event LIKE 'gc cr block%' ORDER BY inst_id;`,
      minutes: 30,
    },
    {
      title: { fr: "Déplacer un service sans coupure", en: "Move a service without an outage" },
      objective: {
        fr: "Constater la différence entre relocate et un stop suivi d'un start.",
        en: "See the difference between relocate and a stop followed by a start.",
      },
      steps: [
        { fr: "Créer un service préféré sur orcl1, disponible sur orcl2.", en: "Create a service preferred on orcl1, available on orcl2." },
        { fr: "Ouvrir une session applicative connectée à ce service.", en: "Open an application session connected to that service." },
        { fr: "Déplacer le service par srvctl relocate service.", en: "Move the service with srvctl relocate service." },
      ],
      expected: {
        fr: "Les nouvelles connexions arrivent sur orcl2 sans que le service n'ait été indisponible.",
        en: "New connections land on orcl2 without the service ever being unavailable.",
      },
      code: `$ srvctl add service -d orcl -s lab_svc -preferred orcl1 -available orcl2
$ srvctl start service -d orcl -s lab_svc
$ srvctl status service -d orcl -s lab_svc
$ srvctl relocate service -d orcl -s lab_svc -oldinst orcl1 -newinst orcl2
$ srvctl status service -d orcl -s lab_svc`,
      minutes: 25,
    },
  ],
  "rac-session-6": [
    {
      title: { fr: "Provoquer et lire une éviction de nœud", en: "Trigger and read a node eviction" },
      objective: {
        fr: "Comprendre que l'éviction est une protection, et savoir où en lire le motif.",
        en: "Understand that eviction is a protection, and know where to read its reason.",
      },
      steps: [
        { fr: "Relever les valeurs de misscount et disktimeout.", en: "Record the misscount and disktimeout values." },
        { fr: "Couper l'interface d'interconnexion d'un nœud pendant plus de 30 secondes.", en: "Cut a node's interconnect interface for more than 30 seconds." },
        { fr: "Lire ocssd.trc et le journal d'alertes du cluster.", en: "Read ocssd.trc and the cluster alert log." },
      ],
      expected: {
        fr: "Le nœud est évincé et redémarre ; ocssd.trc nomme le heartbeat réseau comme motif.",
        en: "The node is evicted and reboots; ocssd.trc names the network heartbeat as the reason.",
      },
      code: `# crsctl get css misscount
# crsctl get css disktimeout
# ip link set eth1 down ; sleep 45 ; ip link set eth1 up
# tail -100 $GRID_BASE/diag/crs/$(hostname)/crs/trace/ocssd.trc
$ oclumon dumpnodeview -allnodes -last "00:10:00"`,
      minutes: 40,
    },
    {
      title: { fr: "Sauvegarder une base RAC en parallèle", en: "Back up a RAC database in parallel" },
      objective: {
        fr: "Répartir les canaux RMAN sur deux nœuds et vérifier la couverture des threads.",
        en: "Spread RMAN channels across two nodes and check thread coverage.",
      },
      steps: [
        { fr: "Allouer un canal par nœud et lancer la sauvegarde.", en: "Allocate one channel per node and run the backup." },
        { fr: "Vérifier que les archives des deux threads ont été sauvegardées.", en: "Check that the archives of both threads were backed up." },
      ],
      expected: {
        fr: "V$ARCHIVED_LOG montre des séquences sauvegardées pour les threads 1 et 2.",
        en: "V$ARCHIVED_LOG shows backed-up sequences for both thread 1 and thread 2.",
      },
      code: `RUN {
  ALLOCATE CHANNEL c1 DEVICE TYPE DISK CONNECT 'sys/mdp@orcl1';
  ALLOCATE CHANNEL c2 DEVICE TYPE DISK CONNECT 'sys/mdp@orcl2';
  BACKUP DATABASE PLUS ARCHIVELOG;
}
SELECT thread#, MIN(sequence#), MAX(sequence#) FROM v$archived_log
WHERE  backup_count > 0 GROUP BY thread#;`,
      minutes: 30,
    },
  ],
};
