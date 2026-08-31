import type { CourseSession } from "./course-oca-sql";

/**
 * Cursus Oracle Database 19c — Performance Management and Tuning (1Z0-084).
 *
 * L'ordre suit la démarche de diagnostic réelle : d'abord la méthode et
 * l'instrumentation, puis l'analyse par les attentes, puis l'optimiseur et le
 * SQL, enfin l'instance et la concurrence. C'est délibéré — commencer par les
 * paramètres mémoire est l'erreur la plus répandue en optimisation.
 */
export const tuningSessions: CourseSession[] = [
  {
    id: "tun-session-1",
    number: 1,
    title: { fr: "Méthode d'optimisation", en: "Tuning methodology" },
    summary: {
      fr: "Avant tout outil : que mesure-t-on, dans quel ordre, et quand s'arrête-t-on. La plupart des échecs d'optimisation viennent d'un problème mal posé, pas d'un mauvais réglage.",
      en: "Before any tool: what do you measure, in what order, and when do you stop. Most tuning failures come from a badly framed problem, not a bad setting.",
    },
    estimatedMinutes: 120,
    topics: [
      {
        id: "tun-1-1",
        number: "1.1",
        title: { fr: "Poser le problème avant de l'optimiser", en: "Frame the problem before tuning it" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "« La base est lente » n'est pas un problème exploitable. Un problème exploitable désigne une opération, une population d'utilisateurs, un moment et un écart chiffré : « la clôture mensuelle passe de 20 à 90 minutes depuis le 3 du mois ». Sans cela, on optimise au hasard.",
              en: "“The database is slow” is not an actionable problem. An actionable problem names an operation, a population, a moment and a measured gap: “month-end close went from 20 to 90 minutes since the 3rd”. Without that, you tune at random.",
            },
          },
          {
            kind: "list",
            title: { fr: "Les cinq questions préalables", en: "The five preliminary questions" },
            items: [
              { fr: "Quelle opération précise est lente, et pour qui ?", en: "Which precise operation is slow, and for whom?" },
              { fr: "Depuis quand ? Qu'a-t-on changé à cette date ?", en: "Since when? What changed on that date?" },
              { fr: "Quelle est la durée attendue, contractuellement ou historiquement ?", en: "What duration is expected, contractually or historically?" },
              { fr: "Le problème est-il reproductible, ou intermittent ?", en: "Is the problem reproducible, or intermittent?" },
              { fr: "À quel niveau se situe-t-il : une instruction, une session, l'instance, le système ?", en: "At what level does it sit: one statement, one session, the instance, the system?" },
            ],
          },
          {
            kind: "warning",
            title: { fr: "La règle d'arrêt", en: "The stopping rule" },
            body: {
              fr: "L'optimisation s'arrête quand les niveaux de service sont atteints, pas quand le processeur sature. Continuer au-delà coûte plus qu'il ne rapporte, et introduit du risque sur un système qui fonctionnait.",
              en: "Tuning stops when the service levels are met, not when the CPU saturates. Going beyond costs more than it returns, and adds risk to a system that was working.",
            },
          },
        ],
      },
      {
        id: "tun-1-2",
        number: "1.2",
        title: { fr: "Le modèle de temps Oracle", en: "The Oracle time model" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Le modèle de temps décompose où la base passe réellement son temps. C'est le point d'entrée : il désigne le poste dominant avant qu'on ne formule la moindre hypothèse.",
              en: "The time model breaks down where the database actually spends its time. It is the entry point: it names the dominant component before you form any hypothesis.",
            },
          },
          {
            kind: "code",
            title: { fr: "Lire le modèle de temps", en: "Read the time model" },
            code: `SELECT stat_name, ROUND(value/1000000, 1) AS secondes
FROM   v$sys_time_model
ORDER  BY value DESC
FETCH FIRST 10 ROWS ONLY;

-- Les deux lignes qui structurent tout :
--   DB time      = temps total passé dans la base par les sessions actives
--   DB CPU       = la part de ce temps réellement sur processeur
-- La différence entre les deux, c'est de l'attente.`,
          },
          {
            kind: "tip",
            body: {
              fr: "DB time est l'unité de compte de toute l'optimisation Oracle. Une action ne vaut la peine que si elle réduit le DB time d'une part significative. C'est aussi ce qui permet de comparer deux problèmes entre eux et de prioriser.",
              en: "DB time is the unit of account for all Oracle tuning. An action is only worth taking if it cuts DB time by a meaningful share. It is also what lets you compare two problems and prioritise.",
            },
          },
        ],
      },
      {
        id: "tun-1-3",
        number: "1.3",
        title: { fr: "Les niveaux de diagnostic", en: "Levels of diagnosis" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Niveau", en: "Level" },
              { fr: "Outil principal", en: "Main tool" },
              { fr: "Symptôme typique", en: "Typical symptom" },
            ],
            rows: [
              [
                { fr: "Système", en: "System" },
                { fr: "Système d'exploitation, AWR", en: "Operating system, AWR" },
                { fr: "Tout est lent, y compris hors base", en: "Everything is slow, including outside the database" },
              ],
              [
                { fr: "Instance", en: "Instance" },
                { fr: "AWR, ADDM", en: "AWR, ADDM" },
                { fr: "Toute la base ralentit aux heures de pointe", en: "The whole database slows at peak hours" },
              ],
              [
                { fr: "Session", en: "Session" },
                { fr: "ASH, V$SESSION", en: "ASH, V$SESSION" },
                { fr: "Un traitement précis est lent, les autres non", en: "One job is slow, the others are not" },
              ],
              [
                { fr: "Instruction", en: "Statement" },
                { fr: "Plan d'exécution, SQL Tuning Advisor", en: "Execution plan, SQL Tuning Advisor" },
                { fr: "Une requête identifiée met trop de temps", en: "One identified query takes too long" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "On descend les niveaux, on ne les remonte pas. Optimiser une instruction alors que le disque est saturé ne donnera rien de durable ; à l'inverse, augmenter la mémoire pour compenser une requête sans index revient à payer du matériel pour masquer un défaut de conception.",
              en: "You go down the levels, never up. Tuning a statement while the disk is saturated yields nothing lasting; conversely, adding memory to compensate for an unindexed query means paying for hardware to hide a design flaw.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "tun-session-2",
    number: 2,
    title: { fr: "AWR, ASH et ADDM", en: "AWR, ASH and ADDM" },
    summary: {
      fr: "Les trois piliers de l'instrumentation Oracle : instantanés périodiques, échantillonnage à la seconde et diagnostic automatique. Savoir lequel employer, et quand.",
      en: "The three pillars of Oracle instrumentation: periodic snapshots, per-second sampling and automatic diagnosis. Knowing which to use, and when.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "tun-2-1",
        number: "2.1",
        title: { fr: "Automatic Workload Repository", en: "Automatic Workload Repository" },
        blocks: [
          {
            kind: "figure",
            src: "/art/oracle-tuning-awr.svg",
            alt: {
              fr: "Repartition du DB time par classe d'attente, et enchainement AWR, ASH, ADDM et conseillers",
              en: "DB time distribution by wait class, and the AWR, ASH, ADDM and advisor chain",
            },
            caption: {
              fr: "AWR echantillonne a l'heure, ASH a la seconde, ADDM classe par part de DB time, les conseillers chiffrent le gain. Quatre outils, une seule chaine.",
              en: "AWR samples hourly, ASH per second, ADDM ranks by share of DB time, the advisors quantify the gain. Four tools, one chain.",
            },
            width: 800,
            height: 600,
          },
          {
            kind: "text",
            body: {
              fr: "AWR photographie l'activité à intervalle régulier — une heure par défaut — et conserve l'historique dans SYSAUX, huit jours par défaut. Un rapport AWR compare deux instantanés : il donne des moyennes sur l'intervalle, jamais l'instant précis d'un incident.",
              en: "AWR photographs activity at a regular interval — hourly by default — and keeps the history in SYSAUX, eight days by default. An AWR report compares two snapshots: it gives averages over the interval, never the precise instant of an incident.",
            },
          },
          {
            kind: "code",
            code: `-- Réglages de collecte
EXEC DBMS_WORKLOAD_REPOSITORY.MODIFY_SNAPSHOT_SETTINGS(
       interval => 30, retention => 20160);   -- 30 min, 14 jours

EXEC DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT;

SELECT snap_id, begin_interval_time, end_interval_time
FROM   dba_hist_snapshot ORDER BY snap_id DESC FETCH FIRST 10 ROWS ONLY;

@?/rdbms/admin/awrrpt.sql        -- rapport entre deux instantanés
@?/rdbms/admin/awrsqrpt.sql      -- rapport centré sur un sql_id`,
          },
          {
            kind: "tip",
            title: { fr: "Lire un rapport AWR dans le bon ordre", en: "Read an AWR report in the right order" },
            body: {
              fr: "1. « DB time » et « Elapsed » en tête : si DB time est très inférieur au temps écoulé, la base n'est pas le problème. 2. « Top 10 Foreground Events » : où va le temps. 3. « SQL ordered by Elapsed Time » : quelles instructions le consomment. Le reste du rapport ne sert qu'à confirmer une hypothèse déjà formée.",
              en: "1. “DB time” and “Elapsed” at the top: if DB time is far below elapsed time, the database is not the problem. 2. “Top 10 Foreground Events”: where the time goes. 3. “SQL ordered by Elapsed Time”: which statements consume it. The rest of the report only confirms a hypothesis you already formed.",
            },
          },
        ],
      },
      {
        id: "tun-2-2",
        number: "2.2",
        title: { fr: "Active Session History", en: "Active Session History" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "ASH échantillonne les sessions actives une fois par seconde et conserve les échantillons en mémoire, un sous-ensemble étant écrit dans AWR. C'est le seul outil qui permette d'analyser un incident de trois minutes qu'un instantané horaire aurait lissé.",
              en: "ASH samples active sessions once per second and keeps the samples in memory, a subset being written to AWR. It is the only tool that lets you analyse a three-minute incident an hourly snapshot would have smoothed away.",
            },
          },
          {
            kind: "code",
            code: `-- Où le temps est passé sur les 15 dernières minutes
SELECT event, COUNT(*) AS echantillons,
       ROUND(100 * RATIO_TO_REPORT(COUNT(*)) OVER (), 1) AS pct
FROM   v$active_session_history
WHERE  sample_time > SYSTIMESTAMP - INTERVAL '15' MINUTE
GROUP  BY event ORDER BY echantillons DESC FETCH FIRST 10 ROWS ONLY;

-- Les instructions les plus coûteuses sur la même fenêtre
SELECT sql_id, COUNT(*) AS echantillons
FROM   v$active_session_history
WHERE  sample_time > SYSTIMESTAMP - INTERVAL '15' MINUTE AND sql_id IS NOT NULL
GROUP  BY sql_id ORDER BY echantillons DESC FETCH FIRST 5 ROWS ONLY;

@?/rdbms/admin/ashrpt.sql`,
          },
          {
            kind: "compare",
            title: { fr: "AWR ou ASH ?", en: "AWR or ASH?" },
            wrong: `-- Incident de 3 minutes hier a 14h12.
-- Chercher dans un rapport AWR de 13h a 14h :
-- le pic est noye dans 60 minutes de moyenne.`,
            right: `-- Interroger DBA_HIST_ACTIVE_SESS_HISTORY
-- sur la fenetre exacte :
SELECT event, COUNT(*)
FROM   dba_hist_active_sess_history
WHERE  sample_time BETWEEN TIMESTAMP '2026-08-24 14:10:00'
                       AND TIMESTAMP '2026-08-24 14:16:00'
GROUP  BY event ORDER BY 2 DESC;`,
            note: {
              fr: "AWR répond à « comment se comporte la base en général », ASH à « que s'est-il passé à cet instant ». Confondre les deux fait perdre des heures.",
              en: "AWR answers “how does the database behave in general”, ASH answers “what happened at that moment”. Confusing the two wastes hours.",
            },
          },
        ],
      },
      {
        id: "tun-2-3",
        number: "2.3",
        title: { fr: "Automatic Database Diagnostic Monitor", en: "Automatic Database Diagnostic Monitor" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "ADDM analyse automatiquement l'intervalle entre deux instantanés AWR, hiérarchise les problèmes par impact sur le DB time et propose des recommandations chiffrées. Il s'exécute seul après chaque instantané.",
              en: "ADDM automatically analyses the interval between two AWR snapshots, ranks problems by their impact on DB time and offers quantified recommendations. It runs by itself after every snapshot.",
            },
          },
          {
            kind: "code",
            code: `@?/rdbms/admin/addmrpt.sql

-- Ou par programme, sur une paire d'instantanés choisie
DECLARE t VARCHAR2(64) := 'addm_incident';
BEGIN
  DBMS_ADDM.ANALYZE_DB(t, 1420, 1424);
END;
/
SELECT DBMS_ADDM.GET_REPORT('addm_incident') FROM DUAL;

SELECT finding_name, impact_type, ROUND(impact*100,1) AS pct_db_time
FROM   dba_advisor_findings
WHERE  task_name = 'addm_incident' ORDER BY impact DESC;`,
          },
          {
            kind: "warning",
            body: {
              fr: "ADDM propose, il ne décide pas. Ses recommandations sont classées par impact estimé sur le DB time, mais il ignore votre contexte : une recommandation d'index peut dégrader des chargements de masse. Lisez toujours la justification avant d'appliquer.",
              en: "ADDM proposes, it does not decide. Its recommendations are ranked by estimated DB time impact, but it knows nothing of your context: an index recommendation can degrade bulk loads. Always read the rationale before applying.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "tun-session-3",
    number: 3,
    title: { fr: "Événements d'attente et surveillance", en: "Wait events and monitoring" },
    summary: {
      fr: "L'analyse par les attentes : la méthode qui remplace les hypothèses par des mesures. Classes d'attente, événements les plus fréquents, seuils et alertes.",
      en: "Wait-event analysis: the method that replaces guesses with measurements. Wait classes, the most frequent events, thresholds and alerts.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "tun-3-1",
        number: "3.1",
        title: { fr: "Les classes d'attente", en: "Wait classes" },
        blocks: [
          {
            kind: "table",
            title: { fr: "Ce que chaque classe indique", en: "What each class points to" },
            headers: [
              { fr: "Classe", en: "Class" },
              { fr: "Signification", en: "Meaning" },
            ],
            rows: [
              [
                { fr: "User I/O", en: "User I/O" },
                { fr: "Lectures de blocs sur disque — souvent un plan d'exécution à revoir", en: "Reading blocks from disk — often an execution plan to review" },
              ],
              [
                { fr: "System I/O", en: "System I/O" },
                { fr: "Écritures des processus d'arrière-plan : DBWn, LGWR, archivage", en: "Background process writes: DBWn, LGWR, archiving" },
              ],
              [
                { fr: "Concurrency", en: "Concurrency" },
                { fr: "Contention sur des structures internes — latches, buffers", en: "Contention on internal structures — latches, buffers" },
              ],
              [
                { fr: "Application", en: "Application" },
                { fr: "Verrous de ligne posés par l'application elle-même", en: "Row locks taken by the application itself" },
              ],
              [
                { fr: "Commit", en: "Commit" },
                { fr: "Attente de l'écriture du redo — typiquement des COMMIT trop fréquents", en: "Waiting for the redo write — typically over-frequent COMMITs" },
              ],
              [
                { fr: "Idle", en: "Idle" },
                { fr: "Sessions inactives — **à exclure de toute analyse**", en: "Idle sessions — **to be excluded from any analysis**" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "L'erreur la plus commune consiste à voir « SQL*Net message from client » en tête et à conclure à un problème réseau. Cet événement appartient à la classe Idle : il signifie que la base attend que le client lui envoie quelque chose. Il faut toujours filtrer sur wait_class != 'Idle'.",
              en: "The most common mistake is seeing “SQL*Net message from client” at the top and concluding there is a network problem. That event belongs to the Idle class: it means the database is waiting for the client to send something. Always filter on wait_class != 'Idle'.",
            },
          },
          {
            kind: "code",
            code: `SELECT wait_class, event, total_waits,
       ROUND(time_waited_micro/1000000, 1) AS secondes
FROM   v$system_event
WHERE  wait_class <> 'Idle'
ORDER  BY time_waited_micro DESC FETCH FIRST 10 ROWS ONLY;

-- Ce que fait chaque session en ce moment
SELECT sid, username, status, event, wait_class, seconds_in_wait, sql_id
FROM   v$session
WHERE  status = 'ACTIVE' AND wait_class <> 'Idle';`,
          },
        ],
      },
      {
        id: "tun-3-2",
        number: "3.2",
        title: { fr: "Les événements à savoir interpréter", en: "Events you must be able to read" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Événement", en: "Event" },
              { fr: "Cause habituelle", en: "Usual cause" },
              { fr: "Piste de correction", en: "Where to look" },
            ],
            rows: [
              [
                { fr: "db file sequential read", en: "db file sequential read" },
                { fr: "Lecture d'un bloc par index", en: "Single-block read through an index" },
                { fr: "Normal, sauf si massif : index inadapté ou trop sélectif", en: "Normal unless massive: wrong or over-selective index" },
              ],
              [
                { fr: "db file scattered read", en: "db file scattered read" },
                { fr: "Parcours complet de table", en: "Full table scan" },
                { fr: "Index manquant, ou statistiques périmées", en: "Missing index, or stale statistics" },
              ],
              [
                { fr: "log file sync", en: "log file sync" },
                { fr: "Attente de LGWR au COMMIT", en: "Waiting for LGWR at COMMIT" },
                { fr: "COMMIT trop fréquents, ou disque de redo lent", en: "Over-frequent COMMITs, or slow redo disk" },
              ],
              [
                { fr: "buffer busy waits", en: "buffer busy waits" },
                { fr: "Deux sessions veulent le même bloc", en: "Two sessions want the same block" },
                { fr: "Point chaud : séquence, index sur colonne croissante", en: "Hot spot: sequence, index on a monotonic column" },
              ],
              [
                { fr: "enq: TX - row lock contention", en: "enq: TX - row lock contention" },
                { fr: "Une session attend un verrou de ligne", en: "A session waits on a row lock" },
                { fr: "Transaction applicative trop longue", en: "Application transaction held too long" },
              ],
              [
                { fr: "latch: shared pool", en: "latch: shared pool" },
                { fr: "Analyse syntaxique excessive", en: "Excessive parsing" },
                { fr: "Absence de variables de liaison", en: "Missing bind variables" },
              ],
            ],
          },
        ],
      },
      {
        id: "tun-3-3",
        number: "3.3",
        title: { fr: "Seuils, métriques et alertes", en: "Thresholds, metrics and alerts" },
        blocks: [
          {
            kind: "code",
            code: `-- Poser un seuil sur une métrique
BEGIN
  DBMS_SERVER_ALERT.SET_THRESHOLD(
    metrics_id         => DBMS_SERVER_ALERT.CPU_TIME_PER_CALL,
    warning_operator   => DBMS_SERVER_ALERT.OPERATOR_GE, warning_value  => '8000',
    critical_operator  => DBMS_SERVER_ALERT.OPERATOR_GE, critical_value => '10000',
    observation_period => 5, consecutive_occurrences => 2,
    instance_name      => NULL,
    object_type        => DBMS_SERVER_ALERT.OBJECT_TYPE_SERVICE,
    object_name        => 'ventes_svc');
END;
/
SELECT * FROM dba_outstanding_alerts;
SELECT metric_name, value, metric_unit FROM v$sysmetric
WHERE  group_id = 2 ORDER BY metric_name;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Le paramètre consecutive_occurrences évite les fausses alertes : exiger deux périodes consécutives au-dessus du seuil élimine les pics d'une minute qui n'intéressent personne.",
              en: "The consecutive_occurrences parameter prevents false alarms: requiring two consecutive periods above the threshold filters out the one-minute spikes nobody cares about.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "tun-session-4",
    number: 4,
    title: { fr: "L'optimiseur et les plans d'exécution", en: "The optimizer and execution plans" },
    summary: {
      fr: "Comment Oracle choisit un plan, comment lire ce plan, et comment repérer l'écart entre ce qu'il estimait et ce qui s'est réellement produit.",
      en: "How Oracle picks a plan, how to read that plan, and how to spot the gap between what it estimated and what actually happened.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "tun-4-1",
        number: "4.1",
        title: { fr: "Le raisonnement de l'optimiseur", en: "How the optimizer reasons" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "L'optimiseur par coût énumère des plans possibles, estime pour chacun le nombre de lignes produites à chaque étape — la cardinalité — puis en déduit un coût. Il retient le plan le moins coûteux. Tout repose donc sur la justesse des cardinalités estimées.",
              en: "The cost-based optimizer enumerates candidate plans, estimates for each the number of rows produced at every step — the cardinality — and derives a cost. It keeps the cheapest plan. Everything therefore rests on the accuracy of the estimated cardinalities.",
            },
          },
          {
            kind: "table",
            title: { fr: "Méthodes d'accès", en: "Access methods" },
            headers: [
              { fr: "Méthode", en: "Method" },
              { fr: "Quand elle est pertinente", en: "When it makes sense" },
            ],
            rows: [
              [
                { fr: "TABLE ACCESS FULL", en: "TABLE ACCESS FULL" },
                { fr: "Forte proportion de lignes retenues — souvent au-delà de 5 à 10 %", en: "A large share of rows retained — often beyond 5 to 10%" },
              ],
              [
                { fr: "INDEX RANGE SCAN", en: "INDEX RANGE SCAN" },
                { fr: "Filtre sélectif sur une colonne indexée", en: "Selective filter on an indexed column" },
              ],
              [
                { fr: "INDEX UNIQUE SCAN", en: "INDEX UNIQUE SCAN" },
                { fr: "Accès par clé primaire ou contrainte unique", en: "Access by primary key or unique constraint" },
              ],
              [
                { fr: "INDEX FAST FULL SCAN", en: "INDEX FAST FULL SCAN" },
                { fr: "Toutes les colonnes voulues sont dans l'index", en: "Every wanted column is in the index" },
              ],
            ],
          },
          {
            kind: "table",
            title: { fr: "Méthodes de jointure", en: "Join methods" },
            headers: [
              { fr: "Méthode", en: "Method" },
              { fr: "Adaptée à", en: "Suited to" },
            ],
            rows: [
              [
                { fr: "NESTED LOOPS", en: "NESTED LOOPS" },
                { fr: "Peu de lignes à gauche, index efficace à droite", en: "Few rows on the left, efficient index on the right" },
              ],
              [
                { fr: "HASH JOIN", en: "HASH JOIN" },
                { fr: "Gros volumes, jointure d'égalité", en: "Large volumes, equality join" },
              ],
              [
                { fr: "SORT MERGE JOIN", en: "SORT MERGE JOIN" },
                { fr: "Jointure non-équi, ou données déjà triées", en: "Non-equi join, or already-sorted data" },
              ],
            ],
          },
        ],
      },
      {
        id: "tun-4-2",
        number: "4.2",
        title: { fr: "Lire un plan réel, pas estimé", en: "Read a real plan, not an estimated one" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Les trois façons d'obtenir un plan", en: "The three ways to get a plan" },
            code: `-- 1. Estimation seule, sans exécuter
EXPLAIN PLAN FOR SELECT … ;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

-- 2. Le plan RÉELLEMENT utilisé, depuis le cache
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY_CURSOR('&sql_id', NULL, 'ALLSTATS LAST'));

-- 3. Estimé ET réel côte à côte — la méthode de référence
ALTER SESSION SET STATISTICS_LEVEL = ALL;
SELECT /*+ GATHER_PLAN_STATISTICS */ … ;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY_CURSOR(NULL, NULL, 'ALLSTATS LAST'));`,
          },
          {
            kind: "warning",
            title: { fr: "EXPLAIN PLAN ment", en: "EXPLAIN PLAN lies" },
            body: {
              fr: "EXPLAIN PLAN n'exécute rien et ignore les valeurs réelles des variables de liaison : il peut afficher un plan que la base n'utilisera jamais. Pour diagnostiquer, employez toujours DISPLAY_CURSOR sur le curseur réellement exécuté.",
              en: "EXPLAIN PLAN executes nothing and ignores the real bind values: it can show a plan the database will never use. To diagnose, always use DISPLAY_CURSOR on the cursor that actually ran.",
            },
          },
          {
            kind: "tip",
            title: { fr: "La colonne qui compte : E-Rows contre A-Rows", en: "The column that matters: E-Rows versus A-Rows" },
            body: {
              fr: "Avec ALLSTATS LAST, le plan affiche E-Rows (estimé) et A-Rows (réel) par étape. Cherchez la première étape, de bas en haut, où l'écart dépasse un facteur 10 : c'est là que l'optimiseur s'est trompé, et tout ce qui suit en découle. Corriger cette étape corrige le plan.",
              en: "With ALLSTATS LAST, the plan shows E-Rows (estimated) and A-Rows (actual) per step. Find the first step, bottom-up, where the gap exceeds a factor of 10: that is where the optimizer went wrong, and everything above follows from it. Fix that step and you fix the plan.",
            },
          },
        ],
      },
      {
        id: "tun-4-3",
        number: "4.3",
        title: { fr: "Ce qui casse un plan", en: "What breaks a plan" },
        blocks: [
          {
            kind: "compare",
            title: { fr: "Fonction sur une colonne indexée", en: "Function on an indexed column" },
            wrong: `-- L'index sur hire_date ne peut pas servir :
SELECT * FROM employees
WHERE  TRUNC(hire_date) = DATE '2026-01-15';`,
            right: `-- Encadrer la colonne, laisser l'index utilisable :
SELECT * FROM employees
WHERE  hire_date >= DATE '2026-01-15'
  AND  hire_date <  DATE '2026-01-16';`,
            note: {
              fr: "Appliquer une fonction à une colonne indexée interdit l'usage de l'index — sauf à créer un index basé sur fonction. C'est la première cause de parcours complet inattendu.",
              en: "Applying a function to an indexed column rules out the index — unless you create a function-based index. It is the first cause of unexpected full scans.",
            },
          },
          {
            kind: "compare",
            title: { fr: "Conversion implicite de type", en: "Implicit type conversion" },
            wrong: `-- account_no est un VARCHAR2 : Oracle ajoute
-- un TO_NUMBER sur la COLONNE, l'index tombe.
SELECT * FROM accounts WHERE account_no = 12345;`,
            right: `-- Comparer avec le bon type :
SELECT * FROM accounts WHERE account_no = '12345';`,
            note: {
              fr: "Oracle convertit toujours la chaîne vers le nombre, donc la colonne. L'index devient inutilisable, sans aucun message d'erreur. Cherchez INTERNAL_FUNCTION dans le plan.",
              en: "Oracle always converts the string towards the number, hence the column. The index becomes unusable, with no error message at all. Look for INTERNAL_FUNCTION in the plan.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "tun-session-5",
    number: 5,
    title: { fr: "Statistiques de l'optimiseur", en: "Optimizer statistics" },
    summary: {
      fr: "La matière première de l'optimiseur. Neuf plans aberrants sur dix viennent de statistiques absentes, périmées ou trompeuses.",
      en: "The optimizer's raw material. Nine wild plans out of ten come from statistics that are missing, stale or misleading.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "tun-5-1",
        number: "5.1",
        title: { fr: "Collecter et contrôler", en: "Gather and control" },
        blocks: [
          {
            kind: "code",
            code: `EXEC DBMS_STATS.GATHER_TABLE_STATS('HR','EMPLOYEES', cascade => TRUE);
EXEC DBMS_STATS.GATHER_SCHEMA_STATS('HR', options => 'GATHER AUTO');

-- Ce que voit l'optimiseur
SELECT table_name, num_rows, blocks, last_analyzed, stale_stats
FROM   dba_tab_statistics WHERE owner = 'HR';

SELECT column_name, num_distinct, num_nulls, density, histogram
FROM   dba_tab_col_statistics WHERE table_name = 'EMPLOYEES';

-- Tâche automatique de collecte
SELECT client_name, status FROM dba_autotask_client;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Oracle collecte automatiquement les statistiques dans la fenêtre de maintenance nocturne, dès qu'une table a changé de plus de 10 %. Le problème classique est le chargement massif du matin : la table a triplé, la collecte n'aura lieu que la nuit suivante. Il faut alors collecter explicitement à la fin du chargement.",
              en: "Oracle gathers statistics automatically in the nightly maintenance window, as soon as a table has changed by more than 10%. The classic problem is the morning bulk load: the table has tripled, and gathering will only happen the following night. You must then gather explicitly at the end of the load.",
            },
          },
        ],
      },
      {
        id: "tun-5-2",
        number: "5.2",
        title: { fr: "Histogrammes et données inégales", en: "Histograms and skewed data" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Sans histogramme, l'optimiseur suppose les valeurs uniformément réparties. Si une colonne « statut » contient 98 % de 'CLOS' et 2 % d'autres valeurs, il estimera la même cardinalité pour toutes — et choisira un plan désastreux pour l'une des deux.",
              en: "Without a histogram, the optimizer assumes values are evenly spread. If a “status” column holds 98% 'CLOSED' and 2% other values, it will estimate the same cardinality for all — and pick a disastrous plan for one of them.",
            },
          },
          {
            kind: "code",
            code: `-- Constater l'inégalité
SELECT statut, COUNT(*) FROM commandes GROUP BY statut ORDER BY 2 DESC;

-- Collecter avec histogramme sur la colonne concernée
EXEC DBMS_STATS.GATHER_TABLE_STATS('APP','COMMANDES',
       method_opt => 'FOR COLUMNS SIZE AUTO statut');

SELECT column_name, histogram, num_buckets
FROM   dba_tab_col_statistics WHERE table_name = 'COMMANDES';`,
          },
          {
            kind: "warning",
            body: {
              fr: "Un histogramme sur une colonne interrogée par variable de liaison peut produire l'effet inverse : le plan dépend alors de la première valeur rencontrée. C'est le « bind peeking ». L'adaptive cursor sharing corrige ce défaut depuis la 11g, mais il faut savoir le reconnaître.",
              en: "A histogram on a column queried through a bind variable can backfire: the plan then depends on the first value seen. That is “bind peeking”. Adaptive cursor sharing has mitigated it since 11g, but you must be able to recognise it.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "tun-session-6",
    number: 6,
    title: { fr: "Conseillers et stabilité des plans", en: "Advisors and plan stability" },
    summary: {
      fr: "SQL Tuning Advisor, SQL Access Advisor, SQL Plan Management et Real Application Testing : automatiser le diagnostic, puis figer ce qui marche.",
      en: "SQL Tuning Advisor, SQL Access Advisor, SQL Plan Management and Real Application Testing: automate the diagnosis, then freeze what works.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "tun-6-1",
        number: "6.1",
        title: { fr: "SQL Tuning Advisor et SQL Access Advisor", en: "SQL Tuning Advisor and SQL Access Advisor" },
        blocks: [
          {
            kind: "code",
            code: `DECLARE t VARCHAR2(64);
BEGIN
  t := DBMS_SQLTUNE.CREATE_TUNING_TASK(sql_id => '&sql_id', task_name => 'tache_1');
  DBMS_SQLTUNE.EXECUTE_TUNING_TASK('tache_1');
END;
/
SELECT DBMS_SQLTUNE.REPORT_TUNING_TASK('tache_1') FROM DUAL;

-- Accepter un profil SQL proposé
EXEC DBMS_SQLTUNE.ACCEPT_SQL_PROFILE(task_name => 'tache_1', replace => TRUE);`,
          },
          {
            kind: "table",
            title: { fr: "Deux conseillers, deux périmètres", en: "Two advisors, two scopes" },
            headers: [
              { fr: "Conseiller", en: "Advisor" },
              { fr: "Analyse", en: "Analyses" },
              { fr: "Propose", en: "Proposes" },
            ],
            rows: [
              [
                { fr: "SQL Tuning Advisor", en: "SQL Tuning Advisor" },
                { fr: "Une instruction précise", en: "One specific statement" },
                { fr: "Profil SQL, statistiques, réécriture, index", en: "SQL profile, statistics, rewrite, index" },
              ],
              [
                { fr: "SQL Access Advisor", en: "SQL Access Advisor" },
                { fr: "Une charge de travail entière", en: "A whole workload" },
                { fr: "Index, vues matérialisées, partitionnement", en: "Indexes, materialized views, partitioning" },
              ],
            ],
          },
        ],
      },
      {
        id: "tun-6-2",
        number: "6.2",
        title: { fr: "SQL Plan Management", en: "SQL Plan Management" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Une baseline conserve un ensemble de plans acceptés pour une instruction. L'optimiseur ne peut adopter un nouveau plan qu'après l'avoir prouvé meilleur. C'est le filet de sécurité standard avant une mise à niveau ou un changement de statistiques.",
              en: "A baseline keeps a set of accepted plans for a statement. The optimizer may only adopt a new plan once it has proven it better. It is the standard safety net before an upgrade or a statistics change.",
            },
          },
          {
            kind: "code",
            code: `ALTER SYSTEM SET optimizer_capture_sql_plan_baselines = TRUE;

-- Charger depuis le cache
DECLARE n PLS_INTEGER;
BEGIN
  n := DBMS_SPM.LOAD_PLANS_FROM_CURSOR_CACHE(sql_id => '&sql_id');
END;
/
SELECT sql_handle, plan_name, enabled, accepted, fixed
FROM   dba_sql_plan_baselines;

-- Figer un plan connu bon
DECLARE n PLS_INTEGER;
BEGIN
  n := DBMS_SPM.ALTER_SQL_PLAN_BASELINE(
         sql_handle => '&handle', plan_name => '&plan',
         attribute_name => 'FIXED', attribute_value => 'YES');
END;
/`,
          },
          {
            kind: "tip",
            title: { fr: "Real Application Testing", en: "Real Application Testing" },
            body: {
              fr: "Avant une migration, SQL Performance Analyzer rejoue un SQL Tuning Set avant puis après le changement et classe les instructions par régression ou amélioration. Combiné aux baselines, il permet de migrer sans pari : on sait ce qui va régresser, et on l'a figé.",
              en: "Before a migration, SQL Performance Analyzer replays a SQL Tuning Set before and after the change and ranks statements by regression or improvement. Combined with baselines, it lets you migrate without gambling: you know what will regress, and you have pinned it.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "tun-session-7",
    number: 7,
    title: { fr: "Mémoire de l'instance", en: "Instance memory" },
    summary: {
      fr: "SGA et PGA, shared pool, buffer cache et zone de tri : ce qu'il faut régler, et surtout ce qu'il ne faut pas régler avant d'avoir corrigé le SQL.",
      en: "SGA and PGA, shared pool, buffer cache and sort area: what to tune, and above all what not to tune before the SQL is fixed.",
    },
    estimatedMinutes: 120,
    topics: [
      {
        id: "tun-7-1",
        number: "7.1",
        title: { fr: "Dimensionner par la mesure", en: "Size by measurement" },
        blocks: [
          {
            kind: "code",
            code: `-- Conseillers de dimensionnement : ce que gagnerait chaque taille
SELECT size_for_estimate, estd_physical_read_factor, estd_physical_reads
FROM   v$db_cache_advice WHERE name = 'DEFAULT' AND block_size = 8192;

SELECT shared_pool_size_for_estimate, estd_lc_time_saved
FROM   v$shared_pool_advice;

SELECT pga_target_for_estimate/1024/1024 AS mo, estd_pga_cache_hit_percentage
FROM   v$pga_target_advice;

SELECT component, current_size/1024/1024 AS mo, min_size/1024/1024 AS min_mo
FROM   v$sga_dynamic_components WHERE current_size > 0;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Les conseillers indiquent le gain attendu d'une taille donnée. Si la courbe est plate au-delà de la taille actuelle, ajouter de la mémoire ne servira à rien — le problème est ailleurs. Augmenter la SGA « au cas où » est le réflexe le plus coûteux et le moins efficace de l'optimisation.",
              en: "The advisors show the gain expected from a given size. If the curve is flat beyond the current size, adding memory will achieve nothing — the problem is elsewhere. Growing the SGA “just in case” is the most expensive and least effective reflex in tuning.",
            },
          },
        ],
      },
      {
        id: "tun-7-2",
        number: "7.2",
        title: { fr: "Shared pool et analyse syntaxique", en: "Shared pool and parsing" },
        blocks: [
          {
            kind: "compare",
            title: { fr: "La cause n° 1 de contention sur le shared pool", en: "The number one cause of shared pool contention" },
            wrong: `-- Chaque valeur produit une instruction differente,
-- donc un hard parse et une entree de plus dans le cache.
SELECT * FROM clients WHERE id = 1;
SELECT * FROM clients WHERE id = 2;
SELECT * FROM clients WHERE id = 3;`,
            right: `-- Une seule instruction partageable, un seul parse.
SELECT * FROM clients WHERE id = :id;`,
            note: {
              fr: "Sans variables de liaison, une application génère des milliers d'instructions uniques : le shared pool sature, les latches deviennent un point de contention, et le processeur part en analyse syntaxique plutôt qu'en travail utile.",
              en: "Without bind variables, an application generates thousands of unique statements: the shared pool saturates, latches become a contention point, and CPU goes into parsing rather than useful work.",
            },
          },
          {
            kind: "code",
            code: `-- Mesurer le rapport hard parse / exécutions
SELECT name, value FROM v$sysstat
WHERE  name IN ('parse count (total)', 'parse count (hard)', 'execute count');

-- Repérer les instructions non partageables
SELECT sql_text, COUNT(*) AS variantes
FROM   v$sql GROUP BY sql_text HAVING COUNT(*) > 1
ORDER  BY 2 DESC FETCH FIRST 10 ROWS ONLY;`,
          },
        ],
      },
    ],
  },

  {
    id: "tun-session-8",
    number: 8,
    title: { fr: "Entrées-sorties et concurrence", en: "I/O and concurrency" },
    summary: {
      fr: "Le dernier niveau : ce qui reste quand le SQL et la mémoire sont corrects — verrous, latches, points chauds et débit disque.",
      en: "The last level: what remains once SQL and memory are right — locks, latches, hot spots and disk throughput.",
    },
    estimatedMinutes: 120,
    topics: [
      {
        id: "tun-8-1",
        number: "8.1",
        title: { fr: "Verrous et blocages", en: "Locks and blocking" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Trouver qui bloque qui", en: "Find who blocks whom" },
            code: `SELECT s.sid, s.username, s.event, s.blocking_session,
       b.username AS bloqueur, s.seconds_in_wait, s.sql_id
FROM   v$session s LEFT JOIN v$session b ON b.sid = s.blocking_session
WHERE  s.blocking_session IS NOT NULL;

-- L'arbre complet des blocages
SELECT LEVEL, sid, username, event
FROM   v$session
START WITH blocking_session IS NULL AND sid IN (SELECT blocking_session FROM v$session)
CONNECT BY PRIOR sid = blocking_session;

-- En dernier recours
ALTER SYSTEM KILL SESSION '&sid,&serial' IMMEDIATE;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Un interblocage (ORA-00060) est détecté et résolu automatiquement par Oracle, qui annule l'une des deux instructions et écrit une trace. Ce n'est pas un problème de base : c'est un défaut d'ordre d'accès dans l'application. La trace indique les deux instructions en cause.",
              en: "A deadlock (ORA-00060) is detected and resolved automatically by Oracle, which rolls back one of the two statements and writes a trace. It is not a database problem: it is an access-order defect in the application. The trace names both statements involved.",
            },
          },
        ],
      },
      {
        id: "tun-8-2",
        number: "8.2",
        title: { fr: "Points chauds et entrées-sorties", en: "Hot spots and I/O" },
        blocks: [
          {
            kind: "code",
            code: `-- Fichiers les plus sollicités
SELECT f.file_name, s.phyrds, s.phywrts,
       ROUND(s.readtim/GREATEST(s.phyrds,1), 2) AS ms_par_lecture
FROM   v$filestat s JOIN dba_data_files f ON f.file_id = s.file#
ORDER  BY s.phyrds DESC FETCH FIRST 10 ROWS ONLY;

-- Segments les plus lus
SELECT object_name, statistic_name, value
FROM   v$segment_statistics
WHERE  statistic_name = 'physical reads'
ORDER  BY value DESC FETCH FIRST 10 ROWS ONLY;`,
          },
          {
            kind: "warning",
            title: { fr: "Le point chaud de la séquence", en: "The sequence hot spot" },
            body: {
              fr: "Une clé primaire alimentée par séquence produit un index dont toutes les insertions visent le même bloc de droite — d'où des « buffer busy waits » massifs en forte concurrence. Les parades : augmenter le CACHE de la séquence, ou passer l'index en reverse key, au prix de la perte des parcours par plage.",
              en: "A primary key fed by a sequence produces an index where every insert targets the same rightmost block — hence massive “buffer busy waits” under heavy concurrency. The remedies: raise the sequence CACHE, or make the index a reverse key, at the cost of losing range scans.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "tun-session-9",
    number: 9,
    title: { fr: "Statspack, traces et surveillance temps réel", en: "Statspack, tracing and real-time monitoring" },
    summary: {
      fr: "Les outils que l'on emploie quand AWR n'est pas disponible — Statspack — et ceux qui descendent au niveau de l'instruction : SQL Trace, tkprof, trace de l'optimiseur, et surveillance des opérations en cours.",
      en: "The tools you use when AWR is not available — Statspack — and those that go down to statement level: SQL Trace, tkprof, optimizer trace, and monitoring of running operations.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "tun-9-1",
        number: "9.1",
        title: { fr: "Statspack", en: "Statspack" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Statspack précède AWR et reste le seul outil de ce type disponible en Standard Edition, où le pack Diagnostic n'est pas licencié. Il fonctionne sur le même principe — des instantanés comparés deux à deux — mais tout est manuel : installation, collecte, purge.",
              en: "Statspack predates AWR and remains the only tool of its kind available in Standard Edition, where the Diagnostic pack is not licensed. It works on the same principle — snapshots compared pairwise — but everything is manual: installation, collection, purging.",
            },
          },
          {
            kind: "code",
            code: `-- Installation (schema PERFSTAT)
@?/rdbms/admin/spcreate.sql

-- Prendre un instantane
EXEC STATSPACK.SNAP;

-- Collecte automatique toutes les heures
@?/rdbms/admin/spauto.sql

-- Rapport entre deux instantanes
@?/rdbms/admin/spreport.sql

-- Purge
@?/rdbms/admin/sppurge.sql`,
          },
          {
            kind: "warning",
            title: { fr: "Une question de licence, pas de technique", en: "A licensing question, not a technical one" },
            body: {
              fr: "AWR, ASH et ADDM appartiennent au Diagnostics Pack, une option payante de l'Enterprise Edition. Les interroger sans licence constitue une infraction contractuelle, même si techniquement rien ne l'empêche. Statspack, lui, est libre d'usage. Le paramètre CONTROL_MANAGEMENT_PACK_ACCESS gouverne cet accès.",
              en: "AWR, ASH and ADDM belong to the Diagnostics Pack, a paid Enterprise Edition option. Querying them without a licence is a contractual breach, even though nothing technically prevents it. Statspack, by contrast, is free to use. The CONTROL_MANAGEMENT_PACK_ACCESS parameter governs that access.",
            },
          },
          {
            kind: "table",
            title: { fr: "Statspack ou AWR", en: "Statspack or AWR" },
            headers: [
              { fr: "", en: "" },
              { fr: "Statspack", en: "Statspack" },
              { fr: "AWR", en: "AWR" },
            ],
            rows: [
              [
                { fr: "Licence", en: "Licence" },
                { fr: "Incluse", en: "Included" },
                { fr: "Diagnostics Pack", en: "Diagnostics Pack" },
              ],
              [
                { fr: "Collecte", en: "Collection" },
                { fr: "Manuelle ou par tâche planifiée", en: "Manual or via a scheduled job" },
                { fr: "Automatique", en: "Automatic" },
              ],
              [
                { fr: "Stockage", en: "Storage" },
                { fr: "Schéma PERFSTAT, purge manuelle", en: "PERFSTAT schema, manual purge" },
                { fr: "SYSAUX, rétention gérée", en: "SYSAUX, managed retention" },
              ],
              [
                { fr: "Diagnostic automatique", en: "Automatic diagnosis" },
                { fr: "Aucun", en: "None" },
                { fr: "ADDM", en: "ADDM" },
              ],
              [
                { fr: "Échantillonnage de sessions", en: "Session sampling" },
                { fr: "Aucun", en: "None" },
                { fr: "ASH", en: "ASH" },
              ],
            ],
          },
        ],
      },
      {
        id: "tun-9-2",
        number: "9.2",
        title: { fr: "SQL Trace, tkprof et trace de l'optimiseur", en: "SQL Trace, tkprof and optimizer trace" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Là où AWR et ASH agrègent, la trace enregistre chaque appel : analyse syntaxique, exécution, extraction, attentes et valeurs de liaison. C'est l'outil du dernier recours, celui qui répond quand tous les autres restent muets — au prix d'un fichier volumineux et d'un surcoût mesurable.",
              en: "Where AWR and ASH aggregate, tracing records every call: parse, execute, fetch, waits and bind values. It is the last-resort tool, the one that answers when all the others stay silent — at the cost of a large file and measurable overhead.",
            },
          },
          {
            kind: "code",
            code: `-- Tracer sa propre session
ALTER SESSION SET tracefile_identifier = 'diag_lenteur';
ALTER SESSION SET timed_statistics = TRUE;
ALTER SESSION SET events '10046 trace name context forever, level 12';
-- … executer la charge …
ALTER SESSION SET events '10046 trace name context off';

-- Tracer une AUTRE session, sans y toucher
EXEC DBMS_MONITOR.SESSION_TRACE_ENABLE(session_id => 145, serial_num => 7823,
                                       waits => TRUE, binds => TRUE);

-- Tracer par service, module ou action
EXEC DBMS_MONITOR.SERV_MOD_ACT_TRACE_ENABLE(service_name => 'ventes_svc',
                                            module_name  => 'FACTURATION');

-- Retrouver le fichier, puis le mettre en forme
SELECT value FROM v$diag_info WHERE name = 'Default Trace File';
-- $ tkprof orcl_ora_12345.trc sortie.txt sys=no sort=prsela,exeela,fchela`,
          },
          {
            kind: "table",
            title: { fr: "Les niveaux de l'événement 10046", en: "The 10046 event levels" },
            headers: [
              { fr: "Niveau", en: "Level" },
              { fr: "Contenu", en: "Contents" },
            ],
            rows: [
              [
                { fr: "1", en: "1" },
                { fr: "Trace de base : instructions et temps", en: "Basic trace: statements and timings" },
              ],
              [
                { fr: "4", en: "4" },
                { fr: "Niveau 1 + valeurs des variables de liaison", en: "Level 1 + bind variable values" },
              ],
              [
                { fr: "8", en: "8" },
                { fr: "Niveau 1 + événements d'attente", en: "Level 1 + wait events" },
              ],
              [
                { fr: "12", en: "12" },
                { fr: "Liaisons **et** attentes — le niveau de diagnostic complet", en: "Binds **and** waits — the full diagnostic level" },
              ],
            ],
          },
          {
            kind: "tip",
            title: { fr: "Lire un rapport tkprof", en: "Reading a tkprof report" },
            body: {
              fr: "Triez par temps écoulé (sort=exeela,fchela) et regardez les trois premières instructions : elles concentrent presque toujours le problème. Comparez ensuite « rows » et « disk » : lire 500 000 blocs pour renvoyer 12 lignes désigne un index manquant, sans aucune ambiguïté.",
              en: "Sort by elapsed time (sort=exeela,fchela) and look at the first three statements: they almost always concentrate the problem. Then compare “rows” with “disk”: reading 500,000 blocks to return 12 rows points to a missing index, with no ambiguity at all.",
            },
          },
          {
            kind: "code",
            title: { fr: "Trace de l'optimiseur : pourquoi CE plan", en: "Optimizer trace: why THIS plan" },
            code: "ALTER SESSION SET events 'trace[rdbms.SQL_Optimizer.*] disk=high';\n-- … executer la requete …\nALTER SESSION SET events 'trace[rdbms.SQL_Optimizer.*] off';\n\n-- Le fichier montre les cardinalites estimees, les plans envisages\n-- et le cout retenu pour chacun : c'est la seule facon de comprendre\n-- pourquoi l'optimiseur a ecarte le plan que vous attendiez.",
          },
        ],
      },
      {
        id: "tun-9-3",
        number: "9.3",
        title: { fr: "Surveillance temps réel des opérations", en: "Real-time database operations monitoring" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Real-Time SQL Monitoring suit une instruction pendant son exécution, étape par étape, avec le pourcentage d'avancement. Elle se déclenche seule dès qu'une instruction dépasse cinq secondes de processeur ou d'entrées-sorties, ou qu'elle s'exécute en parallèle.",
              en: "Real-Time SQL Monitoring follows a statement while it runs, step by step, with a progress percentage. It kicks in by itself as soon as a statement exceeds five seconds of CPU or I/O, or runs in parallel.",
            },
          },
          {
            kind: "code",
            code: `-- Suivre une operation longue en cours
SELECT sql_id, status, elapsed_time/1000000 AS secondes,
       ROUND(100 * NVL(sofar,0) / NULLIF(totalwork,0), 1) AS pct
FROM   v$sql_monitor
WHERE  status = 'EXECUTING';

-- Rapport detaille, etape par etape
SELECT DBMS_SQLTUNE.REPORT_SQL_MONITOR(sql_id => '&sql_id', type => 'TEXT')
FROM   DUAL;

-- Nommer une operation composite pour la suivre d'un bloc
EXEC DBMS_SQL_MONITOR.BEGIN_OPERATION('cloture_mensuelle');
-- … plusieurs instructions …
EXEC DBMS_SQL_MONITOR.END_OPERATION('cloture_mensuelle');
SELECT * FROM v$sql_monitor WHERE dbop_name = 'cloture_mensuelle';`,
          },
          {
            kind: "tip",
            body: {
              fr: "C'est le seul outil qui réponde à « où en est mon traitement de nuit, et quand finira-t-il ». Le rapport indique l'étape en cours et la part déjà traitée — de quoi décider d'attendre ou d'interrompre, sans deviner. L'indicateur /*+ MONITOR */ force le suivi d'une instruction plus courte.",
              en: "It is the only tool that answers “where is my overnight job, and when will it finish”. The report shows the current step and the share already processed — enough to decide whether to wait or kill, without guessing. The /*+ MONITOR */ hint forces monitoring of a shorter statement.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "tun-session-10",
    number: 10,
    title: { fr: "In-Memory et Result Cache", en: "In-Memory and the Result Cache" },
    summary: {
      fr: "Les deux fonctionnalités qui changent l'ordre de grandeur plutôt que le pourcentage : le magasin de colonnes en mémoire pour l'analytique, et le cache de résultats pour les requêtes répétitives.",
      en: "The two features that change the order of magnitude rather than the percentage: the In-Memory column store for analytics, and the result cache for repetitive queries.",
    },
    estimatedMinutes: 120,
    topics: [
      {
        id: "tun-10-1",
        number: "10.1",
        title: { fr: "Le magasin de colonnes en mémoire", en: "The In-Memory column store" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Les données restent stockées en lignes sur disque, mais une copie en colonnes est maintenue en mémoire. Une requête analytique qui ne lit que trois colonnes sur quarante n'a plus à parcourir les lignes entières : c'est de là que viennent les gains d'un facteur dix ou davantage. Rien à changer dans le SQL — l'optimiseur choisit seul le format le plus favorable.",
              en: "Data stays stored row-wise on disk, but a columnar copy is maintained in memory. An analytic query reading three columns out of forty no longer has to walk whole rows: that is where the tenfold or greater gains come from. Nothing changes in the SQL — the optimizer picks the more favourable format by itself.",
            },
          },
          {
            kind: "code",
            code: `-- Activer le magasin colonnes en memoire
ALTER SYSTEM SET inmemory_size = 2G SCOPE=SPFILE;   -- statique : redemarrage

-- Peupler un objet, avec un niveau de compression et une priorite
ALTER TABLE ventes INMEMORY MEMCOMPRESS FOR QUERY HIGH PRIORITY HIGH;
ALTER TABLE ventes NO INMEMORY;                     -- retirer
ALTER TABLE ventes INMEMORY NO INMEMORY (commentaire);  -- exclure une colonne

-- Verifier le peuplement
SELECT segment_name, populate_status, bytes_not_populated
FROM   v$im_segments;

SELECT owner, table_name, inmemory, inmemory_priority, inmemory_compression
FROM   dba_tables WHERE inmemory = 'ENABLED';`,
          },
          {
            kind: "table",
            title: { fr: "Compression et priorité de peuplement", en: "Compression and population priority" },
            headers: [
              { fr: "Clause", en: "Clause" },
              { fr: "Effet", en: "Effect" },
            ],
            rows: [
              [
                { fr: "MEMCOMPRESS FOR DML", en: "MEMCOMPRESS FOR DML" },
                { fr: "Compression minimale, DML rapides", en: "Minimal compression, fast DML" },
              ],
              [
                { fr: "FOR QUERY LOW / HIGH", en: "FOR QUERY LOW / HIGH" },
                { fr: "Optimisé pour la vitesse d'interrogation", en: "Optimised for query speed" },
              ],
              [
                { fr: "FOR CAPACITY LOW / HIGH", en: "FOR CAPACITY LOW / HIGH" },
                { fr: "Optimisé pour loger davantage de données", en: "Optimised to fit more data" },
              ],
              [
                { fr: "PRIORITY CRITICAL … NONE", en: "PRIORITY CRITICAL … NONE" },
                { fr: "Ordre de peuplement au démarrage ; NONE peuple au premier accès", en: "Population order at startup; NONE populates on first access" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "INMEMORY_SIZE est un paramètre statique : il exige un redémarrage, et la mémoire est prise sur la SGA — pas ajoutée. Par ailleurs, In-Memory est une option payante de l'Enterprise Edition. Enfin, le magasin est volatil : après un redémarrage, il se repeuple selon les priorités déclarées, ce qui peut prendre du temps sur un gros volume.",
              en: "INMEMORY_SIZE is a static parameter: it requires a restart, and the memory is taken from the SGA — not added to it. In-Memory is also a paid Enterprise Edition option. Finally, the store is volatile: after a restart it repopulates according to the declared priorities, which can take a while on large volumes.",
            },
          },
        ],
      },
      {
        id: "tun-10-2",
        number: "10.2",
        title: { fr: "Le cache de résultats", en: "The result cache" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Le cache de résultats conserve le résultat complet d'une requête, pas ses blocs. Une requête d'agrégation relancée à l'identique renvoie instantanément, sans relire une seule ligne. Oracle invalide automatiquement l'entrée dès qu'une des tables sources est modifiée.",
              en: "The result cache keeps a query's complete result, not its blocks. An aggregation query run again identically returns instantly, without re-reading a single row. Oracle automatically invalidates the entry as soon as one of the source tables changes.",
            },
          },
          {
            kind: "code",
            code: `ALTER SYSTEM SET result_cache_max_size = 64M;
ALTER SYSTEM SET result_cache_mode = MANUAL;   -- MANUAL (defaut) ou FORCE

SELECT /*+ RESULT_CACHE */ region, SUM(montant)
FROM   ventes GROUP BY region;

SELECT name, type, status, row_count, scan_count
FROM   v$result_cache_objects;

EXEC DBMS_RESULT_CACHE.FLUSH;
SELECT * FROM v$result_cache_statistics;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Le cache de résultats est fait pour les tableaux de bord : une agrégation lourde sur des données qui changent peu, consultée par des dizaines d'utilisateurs. Il est contre-productif sur une table modifiée en permanence, où l'invalidation permanente coûte plus qu'elle ne rapporte. Le mode FORCE, qui l'applique à tout, est presque toujours une mauvaise idée.",
              en: "The result cache is made for dashboards: a heavy aggregation over rarely-changing data, consulted by dozens of users. It backfires on a constantly modified table, where permanent invalidation costs more than it saves. FORCE mode, which applies it to everything, is almost always a bad idea.",
            },
          },
        ],
      },
    ],
  },
];
