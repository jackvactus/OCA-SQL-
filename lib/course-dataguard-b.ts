import type { CourseSession } from "./course-oca-sql";

/**
 * Cursus 1Z0-076 — sessions 9 à 11.
 *
 * Ces trois sessions couvrent les domaines officiels que les huit premières
 * n'abordaient pas dans le détail : les charges de travail réellement prises
 * en charge par Active Data Guard, la résolution automatique réglable des
 * pannes avec les outils de diagnostic associés, et la connectivité client
 * étendue — services liés au rôle, FAN, TAF et Application Continuity.
 */
export const dataGuardSessionsB: CourseSession[] = [
  {
    id: "dg-session-9",
    number: 9,
    title: {
      fr: "Active Data Guard : charges prises en charge en lecture seule",
      en: "Active Data Guard: supported read-only workloads",
    },
    summary: {
      fr: "Une base de secours ouverte en lecture n'est pas une base en lecture seule ordinaire. Elle sait faire beaucoup plus qu'on ne le croit — et refuse certaines choses qu'on croit acquises.",
      en: "A standby opened for reading is not an ordinary read-only database. It can do far more than people assume — and refuses some things people take for granted.",
    },
    estimatedMinutes: 165,
    topics: [
      {
        id: "dg-9-1",
        number: "9.1",
        title: { fr: "La requête temps réel", en: "Real-time query" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Sans Active Data Guard, une base de secours physique fonctionne en exclusion mutuelle : soit elle applique le redo, soit elle est ouverte en lecture. Active Data Guard lève cette exclusion. La base sert des requêtes **pendant** qu'elle applique — et les données servies sont à jour à la seconde près, pas à l'heure près.",
              en: "Without Active Data Guard, a physical standby works under mutual exclusion: either it applies redo, or it is open for reading. Active Data Guard lifts that exclusion. The database serves queries **while** applying — and the data served is current to the second, not to the hour.",
            },
          },
          {
            kind: "code",
            title: { fr: "Ouvrir, appliquer, vérifier", en: "Open, apply, verify" },
            code: `-- 1. Arreter l'application, ouvrir, relancer l'application
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL;
ALTER DATABASE OPEN READ ONLY;
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE
  USING CURRENT LOGFILE DISCONNECT FROM SESSION;

-- 2. L'etat qui prouve qu'Active Data Guard est actif
SELECT database_role, open_mode FROM v$database;
-- PHYSICAL STANDBY | READ ONLY WITH APPLY

-- 3. Le retard reellement subi par une requete
SELECT name, value, unit, time_computed FROM v$dataguard_stats
WHERE  name IN ('apply lag', 'transport lag');`,
            caption: {
              fr: "`READ ONLY WITH APPLY` est la seule preuve fiable. `READ ONLY` seul signifie que l'application du redo est arrêtée : la base répond, mais avec des données qui vieillissent.",
              en: "`READ ONLY WITH APPLY` is the only reliable proof. Plain `READ ONLY` means redo apply is stopped: the database answers, but with data that is ageing.",
            },
          },
          {
            kind: "tip",
            title: { fr: "Garantir la fraîcheur : STANDBY_MAX_DATA_DELAY", en: "Guaranteeing freshness: STANDBY_MAX_DATA_DELAY" },
            body: {
              fr: "Un rapport financier ne doit pas être calculé sur des données vieilles de dix minutes sans que personne ne le sache. `STANDBY_MAX_DATA_DELAY` fixe le retard maximal toléré : au-delà, la requête **échoue** sur ORA-03172 plutôt que de renvoyer un résultat périmé. La valeur 0 exige une fraîcheur absolue et n'est possible qu'en application temps réel.",
              en: "A financial report must not be computed on ten-minute-old data without anyone knowing. `STANDBY_MAX_DATA_DELAY` sets the maximum tolerated lag: beyond it the query **fails** with ORA-03172 rather than returning stale results. A value of 0 demands absolute freshness and is only possible with real-time apply.",
            },
          },
          {
            kind: "code",
            code: `-- Tolerance de 30 secondes pour cette session
ALTER SESSION SET standby_max_data_delay = 30;

-- Fraicheur absolue : la requete attend que le redo valide soit applique
ALTER SESSION SET standby_max_data_delay = 0;

-- Attendre explicitement un SCN precis avant de lire
DECLARE
  scn NUMBER := 25498372;
BEGIN
  DBMS_STANDBY.SYNCHRONIZE_STANDBY_WITH_PRIMARY(timeout => 60);
END;
/`,
          },
        ],
      },
      {
        id: "dg-9-2",
        number: "9.2",
        title: { fr: "Ce qu'une base Active Data Guard sait faire", en: "What an Active Data Guard database can do" },
        blocks: [
          {
            kind: "table",
            title: { fr: "Les charges prises en charge", en: "Supported workloads" },
            headers: [
              { fr: "Fonctionnalité", en: "Feature" },
              { fr: "Disponible ?", en: "Available?" },
              { fr: "Précision", en: "Detail" },
            ],
            rows: [
              [
                { fr: "Requêtes de lecture, rapports, extractions", en: "Read queries, reports, extractions" },
                { fr: "Oui", en: "Yes" },
                { fr: "C'est l'usage principal", en: "The primary use" },
              ],
              [
                { fr: "Tables temporaires globales", en: "Global temporary tables" },
                { fr: "Oui", en: "Yes" },
                { fr: "Écriture autorisée, malgré la lecture seule — undo temporaire requis", en: "Writes allowed despite read-only — temporary undo required" },
              ],
              [
                { fr: "Séquences", en: "Sequences" },
                { fr: "Oui", en: "Yes" },
                { fr: "Uniquement en `SESSION` ou en `GLOBAL` avec 19c", en: "Only `SESSION` scope, or `GLOBAL` from 19c" },
              ],
              [
                { fr: "DML redirigé vers la principale (ADG Redirect)", en: "DML redirected to the primary (ADG Redirect)" },
                { fr: "Oui (19c)", en: "Yes (19c)" },
                { fr: "Transparent pour l'application, via un lien interne", en: "Transparent to the application, over an internal link" },
              ],
              [
                { fr: "Sauvegardes RMAN", en: "RMAN backups" },
                { fr: "Oui", en: "Yes" },
                { fr: "Y compris incrémentales avec suivi des blocs modifiés", en: "Including incrementals with block change tracking" },
              ],
              [
                { fr: "Collecte de statistiques", en: "Statistics gathering" },
                { fr: "Non directement", en: "Not directly" },
                { fr: "`DBMS_STATS` avec l'option de statistiques pour base de secours", en: "`DBMS_STATS` with the standby statistics option" },
              ],
              [
                { fr: "Création d'index, DDL", en: "Index creation, DDL" },
                { fr: "**Non**", en: "**No**" },
                { fr: "La structure est identique à la principale, par construction", en: "The structure is identical to the primary, by construction" },
              ],
            ],
          },
          {
            kind: "code",
            title: { fr: "Le DML redirigé de la 19c", en: "19c DML redirect" },
            code: `-- Cote base de secours, activer la redirection
ALTER SYSTEM SET adg_redirect_dml = TRUE SCOPE=BOTH;
-- ou, pour une seule session :
ALTER SESSION ENABLE ADG_REDIRECT_DML;

-- L'application croit ecrire sur la base de secours :
UPDATE preferences SET theme = 'sombre' WHERE user_id = 42;
COMMIT;

-- En realite le DML part sur la principale, y est valide,
-- puis revient par le redo. La session voit son propre changement.`,
            caption: {
              fr: "Utile pour les applications de reporting qui écrivent quelques lignes de traçabilité ou de préférences. Ce n'est pas un mécanisme d'écriture massive : chaque instruction fait un aller-retour réseau.",
              en: "Useful for reporting applications that write a few audit or preference rows. It is not a bulk write mechanism: every statement makes a network round trip.",
            },
          },
          {
            kind: "warning",
            body: {
              fr: "Les tables temporaires globales exigent l'**undo temporaire** (`TEMP_UNDO_ENABLED = TRUE`) : sans lui, écrire dans une table temporaire génère de l'undo ordinaire, impossible sur une base en lecture seule. C'est la cause n° 1 des ORA-16000 inattendus sur une base Active Data Guard.",
              en: "Global temporary tables require **temporary undo** (`TEMP_UNDO_ENABLED = TRUE`): without it, writing to a temporary table generates ordinary undo, which is impossible on a read-only database. It is the number-one cause of unexpected ORA-16000 on an Active Data Guard standby.",
            },
          },
        ],
      },
      {
        id: "dg-9-3",
        number: "9.3",
        title: { fr: "Diagnostiquer sur une base ouverte en lecture", en: "Diagnosing on a read-only standby" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Diagnostiquer une base de secours pose un problème particulier : les outils classiques écrivent leurs résultats dans la base, ce qu'une base en lecture seule interdit. Oracle a donc adapté chaque outil pour qu'il stocke ses données ailleurs — dans la principale, ou dans une zone dédiée.",
              en: "Diagnosing a standby raises a particular problem: the classic tools write their results into the database, which a read-only database forbids. Oracle therefore adapted each tool to store its data elsewhere — in the primary, or in a dedicated area.",
            },
          },
          {
            kind: "table",
            title: { fr: "Les outils de diagnostic disponibles", en: "Available diagnostic tools" },
            headers: [
              { fr: "Outil", en: "Tool" },
              { fr: "Comment il fonctionne côté secours", en: "How it works on the standby" },
            ],
            rows: [
              [
                { fr: "ASH", en: "ASH" },
                { fr: "Échantillonne normalement en mémoire ; `V$ACTIVE_SESSION_HISTORY` est exploitable", en: "Samples normally in memory; `V$ACTIVE_SESSION_HISTORY` is usable" },
              ],
              [
                { fr: "AWR pour base de secours", en: "Standby AWR" },
                { fr: "Les instantanés sont écrits dans la base **principale**, identifiés par DBID", en: "Snapshots are written into the **primary**, identified by DBID" },
              ],
              [
                { fr: "SQL Monitoring", en: "SQL Monitoring" },
                { fr: "Fonctionne, les données restant en mémoire", en: "Works, with the data staying in memory" },
              ],
              [
                { fr: "SQL Tuning Advisor", en: "SQL Tuning Advisor" },
                { fr: "S'exécute sur la principale à partir d'un jeu capturé sur le secours", en: "Runs on the primary from a set captured on the standby" },
              ],
              [
                { fr: "Journal d'alertes et traces", en: "Alert log and traces" },
                { fr: "Écrits dans l'ADR local, normalement", en: "Written to the local ADR, normally" },
              ],
            ],
          },
          {
            kind: "code",
            title: { fr: "AWR pour base de secours", en: "Standby AWR" },
            code: `-- Sur la PRINCIPALE : enregistrer la base de secours comme source
BEGIN
  DBMS_UMF.CONFIGURE_NODE('site_primaire');
  DBMS_UMF.CREATE_TOPOLOGY('topo_dg');
  DBMS_UMF.CONFIGURE_NODE('site_secours', 'lien_vers_secours');
  DBMS_UMF.ADD_NODE('topo_dg', 'site_secours');
  DBMS_WORKLOAD_REPOSITORY.REGISTER_REMOTE_DATABASE(node_name => 'site_secours');
END;
/

-- Instantane a la demande, cote secours
EXEC DBMS_WORKLOAD_REPOSITORY.CREATE_REMOTE_SNAPSHOT('site_secours');

-- Rapport
@?/rdbms/admin/awrrpti.sql   -- choisir le DBID de la base de secours`,
          },
          {
            kind: "code",
            title: { fr: "Le diagnostic du quotidien", en: "Everyday diagnosis" },
            code: `-- Etat complet de l'application, cote secours
SELECT process, status, thread#, sequence#, block#, blocks, delay_mins
FROM   v$managed_standby;

-- Debit de l'application, en direct
SELECT item, sofar, units, timestamp FROM v$recovery_progress
WHERE  item IN ('Active Apply Rate','Average Apply Rate',
                'Last Applied Redo','Redo Applied');

-- Les 20 derniers evenements Data Guard, tous severites confondues
SELECT severity, error_code, TO_CHAR(timestamp,'DD/MM HH24:MI') AS quand, message
FROM   v$dataguard_status ORDER BY timestamp DESC FETCH FIRST 20 ROWS ONLY;

-- Sessions bloquant l'application du redo par un verrou de lecture
SELECT s.sid, s.username, s.program, s.event, s.seconds_in_wait
FROM   v$session s WHERE s.event LIKE '%media recovery%';`,
          },
        ],
      },
    ],
  },

  {
    id: "dg-session-10",
    number: 10,
    title: {
      fr: "Résolution automatique des pannes et optimisation fine",
      en: "Automatic outage resolution and fine tuning",
    },
    summary: {
      fr: "Une liaison qui se coupe une seconde ne doit pas immobiliser la production trente secondes. Les délais de détection sont réglables depuis la 12.2 — encore faut-il savoir lesquels, et ce qu'on échange en les réglant.",
      en: "A link that drops for a second must not stall production for thirty. Detection timeouts have been tunable since 12.2 — provided you know which ones, and what you trade away by tuning them.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "dg-10-1",
        number: "10.1",
        title: { fr: "Résolution automatique réglable des pannes", en: "Tunable automatic outage resolution" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Quand une liaison réseau se dégrade sans se rompre franchement, la base principale reste bloquée à attendre un accusé de réception qui n'arrivera pas. Avant la 12.2, ces délais étaient figés dans le code. Ils sont aujourd'hui exposés en paramètres cachés réglables, ce qui permet d'adapter la détection à la qualité réelle du réseau.",
              en: "When a network link degrades without cleanly breaking, the primary stays blocked waiting for an acknowledgement that will never come. Before 12.2 those timeouts were hard-coded. They are now exposed as tunable hidden parameters, which lets detection be matched to the network's real quality.",
            },
          },
          {
            kind: "table",
            title: { fr: "Les trois délais qui comptent", en: "The three timeouts that matter" },
            headers: [
              { fr: "Paramètre", en: "Parameter" },
              { fr: "Ce qu'il détecte", en: "What it detects" },
              { fr: "Défaut", en: "Default" },
            ],
            rows: [
              [
                { fr: "_data_guard_max_io_time", en: "_data_guard_max_io_time" },
                { fr: "Blocage d'une entrée-sortie réseau ou disque du transport", en: "A stalled network or disk I/O in the transport" },
                { fr: "240 s", en: "240 s" },
              ],
              [
                { fr: "_data_guard_max_longio_time", en: "_data_guard_max_longio_time" },
                { fr: "Blocage d'une opération longue — création de fichier, archivage", en: "A stalled long operation — file creation, archiving" },
                { fr: "600 s", en: "600 s" },
              ],
              [
                { fr: "NET_TIMEOUT (LOG_ARCHIVE_DEST_n)", en: "NET_TIMEOUT (LOG_ARCHIVE_DEST_n)" },
                { fr: "Absence de réponse de la base de secours en transport synchrone", en: "No answer from the standby in synchronous transport" },
                { fr: "30 s", en: "30 s" },
              ],
            ],
          },
          {
            kind: "compare",
            title: { fr: "Régler NET_TIMEOUT : le compromis", en: "Setting NET_TIMEOUT: the trade-off" },
            wrong: `-- Trop court : une micro-coupure de 5 s casse
-- la liaison synchrone et fait basculer la
-- configuration en mode degrade plusieurs fois par jour.
ALTER SYSTEM SET log_archive_dest_2 =
  'SERVICE=orcl_sb SYNC AFFIRM NET_TIMEOUT=3
   DB_UNIQUE_NAME=orcl_sb';`,
            right: `-- Trop long : la production reste bloquee
-- 30 secondes sur chaque COMMIT pendant une panne.
-- Le bon reglage se deduit de la latence mesuree :
--   NET_TIMEOUT = 3 a 5 fois la latence maximale observee.
ALTER SYSTEM SET log_archive_dest_2 =
  'SERVICE=orcl_sb SYNC AFFIRM NET_TIMEOUT=10 REOPEN=30
   DB_UNIQUE_NAME=orcl_sb';`,
            note: {
              fr: "`REOPEN` complète le dispositif : il fixe le délai avant que la principale ne retente la destination après un échec. Trop court, il consomme du CPU en tentatives vaines ; trop long, il laisse l'écart se creuser.",
              en: "`REOPEN` completes the arrangement: it sets the delay before the primary retries the destination after a failure. Too short, it burns CPU on futile retries; too long, it lets the gap widen.",
            },
          },
          {
            kind: "code",
            title: { fr: "Constater le comportement réel", en: "Observing the real behaviour" },
            code: `-- Etat de chaque destination, avec l'erreur eventuelle
SELECT dest_id, dest_name, status, type, database_mode,
       recovery_mode, protection_mode, gap_status, error
FROM   v$archive_dest_status WHERE status != 'INACTIVE';

-- Historique des reprises de liaison
SELECT TO_CHAR(timestamp,'DD/MM HH24:MI:SS') AS quand, severity, message
FROM   v$dataguard_status
WHERE  message LIKE '%reconnect%' OR message LIKE '%NET_TIMEOUT%'
   OR  message LIKE '%error%'
ORDER  BY timestamp DESC FETCH FIRST 20 ROWS ONLY;

-- Combien de fois la configuration a-t-elle bascule en mode degrade ?
SELECT protection_mode, protection_level FROM v$database;`,
          },
        ],
      },
      {
        id: "dg-10-2",
        number: "10.2",
        title: { fr: "Optimiser le transport du redo", en: "Optimizing redo transport" },
        blocks: [
          {
            kind: "list",
            title: { fr: "Les leviers, du plus rentable au plus fin", en: "The levers, from most to least rewarding" },
            items: [
              { fr: "**SDU à 65535** dans sqlnet.ora et dans le descripteur : sur une liaison longue, le gain se compte en dizaines de pour cent", en: "**SDU at 65535** in sqlnet.ora and in the descriptor: on a long link the gain runs into tens of percent" },
              { fr: "**Tampons TCP** dimensionnés au produit bande passante × latence, côté système et côté Oracle Net", en: "**TCP buffers** sized to the bandwidth-delay product, at OS and Oracle Net level" },
              { fr: "**Compression du redo** si la liaison est plus étroite que le CPU n'est chargé", en: "**Redo compression** if the link is narrower than the CPU is busy" },
              { fr: "**FASTSYNC** plutôt que SYNC AFFIRM quand la garantie disque n'est pas exigée", en: "**FASTSYNC** rather than SYNC AFFIRM when the disk guarantee is not required" },
              { fr: "**MAX_CONNECTIONS** pour paralléliser le transport de l'archivage sur plusieurs sessions", en: "**MAX_CONNECTIONS** to parallelise archive transport across several sessions" },
              { fr: "**Far Sync** quand la latence rend le synchrone direct intenable", en: "**Far Sync** when latency makes direct synchronous untenable" },
            ],
          },
          {
            kind: "code",
            code: `# sqlnet.ora, des DEUX cotes
DEFAULT_SDU_SIZE = 65535
RECV_BUF_SIZE = 10485760
SEND_BUF_SIZE = 10485760

# tnsnames.ora : le descripteur porte les memes valeurs
ORCL_SB =
 (DESCRIPTION =
   (SDU = 65535)
   (SEND_BUF_SIZE = 10485760)(RECV_BUF_SIZE = 10485760)
   (ADDRESS = (PROTOCOL = TCP)(HOST = secours)(PORT = 1521))
   (CONNECT_DATA = (SERVICE_NAME = orcl_sb_DGMGRL)(SERVER = DEDICATED)))`,
            caption: {
              fr: "Le tampon se calcule ainsi : bande passante (octets/s) × latence aller-retour (s). Sur 1 Gbit/s à 40 ms, cela donne environ 5 Mo — un tampon par défaut de 64 Ko plafonne alors le débit à moins de 2 % du lien.",
              en: "The buffer is computed as: bandwidth (bytes/s) × round-trip latency (s). At 1 Gbit/s and 40 ms that gives about 5 MB — a default 64 KB buffer then caps throughput at under 2 % of the link.",
            },
          },
          {
            kind: "code",
            title: { fr: "Mesurer, puis décider", en: "Measure, then decide" },
            code: `-- Debit reel du transport, par destination
SELECT dest_id,
       ROUND(SUM(blocks * block_size) / 1024 / 1024)          AS mo_transmis,
       ROUND(SUM(blocks * block_size) / 1024 / 1024 /
             NULLIF(SUM((completion_time - first_time) * 86400), 0), 2) AS mo_par_seconde
FROM   v$archived_log
WHERE  completion_time > SYSDATE - 1 AND dest_id > 1
GROUP  BY dest_id;

-- Le redo produit par la principale : la cible a atteindre
SELECT TO_CHAR(first_time,'DD/MM HH24') AS heure,
       COUNT(*) AS journaux,
       ROUND(SUM(blocks * block_size)/1024/1024) AS mo
FROM   v$archived_log WHERE dest_id = 1 AND first_time > SYSDATE - 1
GROUP  BY TO_CHAR(first_time,'DD/MM HH24') ORDER BY 1;`,
          },
        ],
      },
      {
        id: "dg-10-3",
        number: "10.3",
        title: { fr: "Optimiser l'application du redo", en: "Optimizing redo apply" },
        blocks: [
          {
            kind: "table",
            title: { fr: "Redo Apply : ce qui limite le débit", en: "Redo Apply: what limits throughput" },
            headers: [
              { fr: "Symptôme", en: "Symptom" },
              { fr: "Cause", en: "Cause" },
              { fr: "Action", en: "Action" },
            ],
            rows: [
              [
                { fr: "MRP0 en `WAIT_FOR_LOG` en permanence", en: "MRP0 permanently in `WAIT_FOR_LOG`" },
                { fr: "Le transport ne suit pas — le problème est en amont", en: "Transport cannot keep up — the problem is upstream" },
                { fr: "Traiter le réseau, pas l'application", en: "Address the network, not the apply" },
              ],
              [
                { fr: "Attentes `parallel recovery` élevées", en: "High `parallel recovery` waits" },
                { fr: "Parallélisme insuffisant ou mal réparti", en: "Insufficient or badly spread parallelism" },
                { fr: "`PARALLEL n` sur le RECOVER, n = nombre de cœurs", en: "`PARALLEL n` on RECOVER, n = number of cores" },
              ],
              [
                { fr: "`db file parallel read` dominant", en: "`db file parallel read` dominant" },
                { fr: "Les entrées-sorties du secours saturent", en: "Standby I/O is saturated" },
                { fr: "Stockage plus rapide, ou moins de charge de lecture concurrente", en: "Faster storage, or less competing read load" },
              ],
              [
                { fr: "Écart qui grandit aux heures de rapport", en: "Gap growing during reporting hours" },
                { fr: "Active Data Guard : les requêtes concurrencent l'application", en: "Active Data Guard: queries compete with apply" },
                { fr: "Resource Manager, ou décaler les rapports", en: "Resource Manager, or shift the reports" },
              ],
            ],
          },
          {
            kind: "code",
            code: `-- Parallelisme de l'application
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE
  PARALLEL 8 USING CURRENT LOGFILE DISCONNECT;

-- Ce que les processus de recuperation attendent reellement
SELECT inst_id, event, total_waits,
       ROUND(time_waited_micro/1000/NULLIF(total_waits,0), 2) AS ms_moyen
FROM   gv$system_event
WHERE  event LIKE '%recovery%' OR event LIKE '%parallel%'
ORDER  BY time_waited_micro DESC FETCH FIRST 10 ROWS ONLY;

-- Sur une base de secours logique, SQL Apply se regle autrement
EXEC DBMS_LOGSTDBY.APPLY_SET('MAX_SERVERS', 24);
EXEC DBMS_LOGSTDBY.APPLY_SET('MAX_SGA', 512);
EXEC DBMS_LOGSTDBY.APPLY_SET('PREPARE_SERVERS', 4);
EXEC DBMS_LOGSTDBY.APPLY_SET('APPLY_SERVERS', 16);

SELECT name, value, unit FROM v$logstdby_stats;
SELECT type, high_scn, status FROM v$logstdby_process;`,
          },
          {
            kind: "tip",
            body: {
              fr: "En Active Data Guard, une base de secours a deux métiers concurrents : appliquer et servir. Un plan de Resource Manager qui plafonne les sessions de rapport à 60 % du CPU garantit que l'application du redo garde toujours de quoi travailler — c'est la seule façon de tenir un `apply lag` promis contractuellement.",
              en: "In Active Data Guard a standby has two competing jobs: applying and serving. A Resource Manager plan capping reporting sessions at 60 % of CPU guarantees redo apply always has room to work — the only way to hold a contractually promised `apply lag`.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "dg-session-11",
    number: 11,
    title: {
      fr: "Connectivité client et continuité applicative",
      en: "Client connectivity and application continuity",
    },
    summary: {
      fr: "Basculer la base ne sert à rien si les clients continuent de viser l'ancienne. Trois couches à empiler : le service lié au rôle, le descripteur qui connaît les deux sites, et le pilote qui rejoue la transaction interrompue.",
      en: "Switching the database is pointless if clients keep aiming at the old one. Three layers to stack: the role-bound service, the descriptor that knows both sites, and the driver that replays the interrupted transaction.",
    },
    estimatedMinutes: 165,
    topics: [
      {
        id: "dg-11-1",
        number: "11.1",
        title: { fr: "Le service lié au rôle", en: "The role-bound service" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "La règle est simple : **on ne se connecte jamais à un nom de base, on se connecte à un service**. Un service déclaré pour le rôle `PRIMARY` démarre du bon côté après chaque bascule, sans qu'aucun client ne soit reconfiguré. C'est la brique sans laquelle tout le reste est inutile.",
              en: "The rule is simple: **never connect to a database name, connect to a service**. A service declared for the `PRIMARY` role starts on the right side after every transition, with no client reconfigured. It is the brick without which everything else is pointless.",
            },
          },
          {
            kind: "code",
            title: { fr: "Sans Grid Infrastructure : le trigger DB_ROLE_CHANGE", en: "Without Grid Infrastructure: the DB_ROLE_CHANGE trigger" },
            code: `-- 1. Creer le service, identique des deux cotes
BEGIN
  DBMS_SERVICE.CREATE_SERVICE(
    service_name     => 'ventes_svc',
    network_name     => 'ventes_svc',
    failover_method  => 'BASIC',
    failover_type    => 'TRANSACTION',
    failover_retries => 30,
    failover_delay   => 3,
    aq_ha_notifications => TRUE);
END;
/

-- 2. Le demarrer uniquement si la base tient le role PRIMARY
CREATE OR REPLACE TRIGGER svc_selon_role
AFTER STARTUP ON DATABASE
DECLARE role_actuel VARCHAR2(30);
BEGIN
  SELECT database_role INTO role_actuel FROM v$database;
  IF role_actuel = 'PRIMARY' THEN
    DBMS_SERVICE.START_SERVICE('ventes_svc');
  END IF;
END;
/

-- 3. Reagir a la bascule elle-meme
CREATE OR REPLACE TRIGGER svc_bascule
AFTER DB_ROLE_CHANGE ON DATABASE
DECLARE role_actuel VARCHAR2(30);
BEGIN
  SELECT database_role INTO role_actuel FROM v$database;
  IF role_actuel = 'PRIMARY' THEN
    DBMS_SERVICE.START_SERVICE('ventes_svc');
  ELSE
    BEGIN DBMS_SERVICE.STOP_SERVICE('ventes_svc');
    EXCEPTION WHEN OTHERS THEN NULL; END;
  END IF;
END;
/`,
          },
          {
            kind: "code",
            title: { fr: "Avec Grid Infrastructure : srvctl fait tout", en: "With Grid Infrastructure: srvctl does it all" },
            code: `# Le role est un attribut du service : aucun trigger n'est necessaire.
$ srvctl add service -db orcl_pr -service ventes_svc \\
    -role PRIMARY \\
    -failovertype TRANSACTION -failovermethod BASIC \\
    -failoverretry 30 -failoverdelay 3 \\
    -notification TRUE -commit_outcome TRUE \\
    -clbgoal SHORT -rlbgoal SERVICE_TIME \\
    -replay_init_time 600 -retention 86400 -session_state dynamic

# Le meme service, declare a l'identique sur la base de secours
$ srvctl add service -db orcl_sb -service ventes_svc -role PRIMARY ...

$ srvctl config service -db orcl_pr -service ventes_svc
$ srvctl status service -db orcl_pr -service ventes_svc

# Un service reserve aux rapports, cote secours uniquement
$ srvctl add service -db orcl_sb -service rapports_svc -role PHYSICAL_STANDBY`,
            caption: {
              fr: "Deux services, deux rôles : `ventes_svc` suit la base principale, `rapports_svc` reste sur la base de secours ouverte en lecture. Les rapports ne migrent donc jamais vers la production.",
              en: "Two services, two roles: `ventes_svc` follows the primary, `rapports_svc` stays on the read-only standby. Reports therefore never migrate onto production.",
            },
          },
        ],
      },
      {
        id: "dg-11-2",
        number: "11.2",
        title: { fr: "Le descripteur de connexion", en: "The connect descriptor" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Un seul alias, les deux sites", en: "One alias, both sites" },
            code: `VENTES =
 (DESCRIPTION =
   (CONNECT_TIMEOUT = 10)      -- abandon d'une tentative
   (TRANSPORT_CONNECT_TIMEOUT = 3)
   (RETRY_COUNT = 20)          -- nombre de tours de la liste
   (RETRY_DELAY = 3)           -- pause entre deux tours, en secondes
   (ADDRESS_LIST =
     (LOAD_BALANCE = OFF)      -- l'ordre compte : site principal d'abord
     (ADDRESS = (PROTOCOL = TCP)(HOST = site-a-scan)(PORT = 1521))
     (ADDRESS = (PROTOCOL = TCP)(HOST = site-b-scan)(PORT = 1521)))
   (CONNECT_DATA = (SERVICE_NAME = ventes_svc)))`,
            caption: {
              fr: "`RETRY_COUNT` × `RETRY_DELAY` fixe la patience totale du client : 20 × 3 s donne une minute d'attente avant abandon, ce qui couvre largement la durée d'un switchover.",
              en: "`RETRY_COUNT` × `RETRY_DELAY` sets the client's total patience: 20 × 3 s gives one minute of waiting before giving up, which comfortably covers a switchover.",
            },
          },
          {
            kind: "warning",
            body: {
              fr: "`TRANSPORT_CONNECT_TIMEOUT` est indispensable : sans lui, un site injoignable au niveau TCP fait attendre le client le délai du système d'exploitation — souvent plus de deux minutes — avant même d'essayer la seconde adresse. C'est la cause la plus fréquente d'une bascule « qui a pris cinq minutes » alors que la base était prête en quinze secondes.",
              en: "`TRANSPORT_CONNECT_TIMEOUT` is essential: without it, a site unreachable at TCP level makes the client wait out the operating system timeout — often over two minutes — before even trying the second address. It is the most frequent cause of a failover that “took five minutes” when the database was ready in fifteen seconds.",
            },
          },
          {
            kind: "table",
            title: { fr: "Trois niveaux de reprise côté client", en: "Three levels of client recovery" },
            headers: [
              { fr: "Mécanisme", en: "Mechanism" },
              { fr: "Ce qui survit", en: "What survives" },
              { fr: "Ce que l'application doit faire", en: "What the application must do" },
            ],
            rows: [
              [
                { fr: "Descripteur multi-adresses", en: "Multi-address descriptor" },
                { fr: "La reconnexion trouve le nouveau site", en: "Reconnection finds the new site" },
                { fr: "Rouvrir la connexion et rejouer elle-même", en: "Reopen the connection and replay itself" },
              ],
              [
                { fr: "TAF — SELECT", en: "TAF — SELECT" },
                { fr: "La session, et un SELECT en cours de lecture", en: "The session, and a SELECT mid-fetch" },
                { fr: "Refaire tout DML en cours", en: "Redo any in-flight DML" },
              ],
              [
                { fr: "FAN + Fast Connection Failover", en: "FAN + Fast Connection Failover" },
                { fr: "Le pool est prévenu immédiatement, sans délai TCP", en: "The pool is notified at once, with no TCP timeout" },
                { fr: "Rien — le pool purge les connexions mortes", en: "Nothing — the pool purges dead connections" },
              ],
              [
                { fr: "Application Continuity", en: "Application Continuity" },
                { fr: "**La transaction en cours**, rejouée", en: "**The in-flight transaction**, replayed" },
                { fr: "Rien, si le pilote et le service sont bien configurés", en: "Nothing, given a correctly configured driver and service" },
              ],
            ],
          },
        ],
      },
      {
        id: "dg-11-3",
        number: "11.3",
        title: { fr: "FAN et Application Continuity", en: "FAN and Application Continuity" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Fast Application Notification renverse la logique : au lieu que le client découvre la panne en attendant un délai TCP, c'est la base qui **prévient** immédiatement les pools de connexions. Une connexion morte est purgée en quelques millisecondes plutôt qu'en deux minutes.",
              en: "Fast Application Notification inverts the logic: instead of the client discovering the failure by waiting out a TCP timeout, the database **notifies** the connection pools immediately. A dead connection is purged in milliseconds rather than two minutes.",
            },
          },
          {
            kind: "code",
            code: `-- Cote base : la notification doit etre activee sur le service
BEGIN
  DBMS_SERVICE.MODIFY_SERVICE(
    service_name        => 'ventes_svc',
    aq_ha_notifications => TRUE,
    failover_type       => 'TRANSACTION',
    failover_method     => 'BASIC',
    commit_outcome      => TRUE,
    failover_retries    => 30,
    failover_delay      => 3);
END;
/

-- Verifier ce qui est reellement en vigueur
SELECT name, aq_ha_notifications, failover_type, failover_method,
       commit_outcome, failover_retries, failover_delay
FROM   dba_services WHERE name = 'ventes_svc';`,
          },
          {
            kind: "text",
            body: {
              fr: "Application Continuity va plus loin encore. Le pilote enregistre chaque appel de la transaction en cours ; à la coupure, il rétablit la session sur la nouvelle base principale, rejoue la séquence enregistrée, et vérifie que le résultat est identique. Si la vérification échoue, l'erreur remonte — mais dans la grande majorité des cas, l'utilisateur ne voit rien.",
              en: "Application Continuity goes further still. The driver records every call of the in-flight transaction; on the break it re-establishes the session on the new primary, replays the recorded sequence, and verifies the outcome matches. If verification fails the error surfaces — but in the vast majority of cases the user sees nothing.",
            },
          },
          {
            kind: "list",
            title: { fr: "Les conditions à réunir", en: "The conditions to meet" },
            items: [
              { fr: "Service en `FAILOVER_TYPE = TRANSACTION` et `COMMIT_OUTCOME = TRUE`", en: "Service with `FAILOVER_TYPE = TRANSACTION` and `COMMIT_OUTCOME = TRUE`" },
              { fr: "Pilote compatible : JDBC Thin en mode Replay Driver, OCI 12.2+, ODP.NET managé", en: "Compatible driver: JDBC Thin in Replay Driver mode, OCI 12.2+, managed ODP.NET" },
              { fr: "Pool de connexions Oracle : UCP, WebLogic, ou un pool prenant en charge FAN", en: "An Oracle connection pool: UCP, WebLogic, or any FAN-aware pool" },
              { fr: "Un état de session `dynamic` — l'état statique n'est pas rejouable", en: "A `dynamic` session state — static state cannot be replayed" },
              { fr: "Aucune opération non rejouable dans la transaction : appel externe, écriture de fichier, envoi de message", en: "No non-replayable operation in the transaction: an external call, a file write, a message send" },
            ],
          },
          {
            kind: "code",
            title: { fr: "Vérifier qu'une transaction est effectivement rejouable", en: "Checking a transaction is actually replayable" },
            code: `-- Ce que la base a enregistre comme rejouable
SELECT sid, serial#,
       DECODE(BITAND(failover_type, 4), 4, 'TRANSACTION', 'AUTRE') AS type_bascule,
       failed_over
FROM   v$session WHERE service_name = 'ventes_svc';

-- Compteurs de rejeu : combien ont reussi, combien ont echoue
SELECT name, value FROM v$sysstat
WHERE  name LIKE 'cumulative%replay%' OR name LIKE '%failover%';

-- Marquer explicitement une frontiere de rejeu depuis l'application
-- (JDBC : beginRequest() / endRequest())`,
          },
          {
            kind: "tip",
            title: { fr: "Transparent Application Continuity, en 19c", en: "Transparent Application Continuity, in 19c" },
            body: {
              fr: "La 19c introduit une variante qui détecte seule les frontières de transaction et l'état de session, sans que l'application ait à poser `beginRequest`/`endRequest`. Elle s'active par `-failovertype AUTO` sur le service. C'est la seule voie réaliste pour des applications héritées qu'on ne peut plus modifier.",
              en: "19c introduces a variant that detects transaction boundaries and session state by itself, without the application having to place `beginRequest`/`endRequest`. It is enabled with `-failovertype AUTO` on the service. It is the only realistic path for legacy applications that can no longer be modified.",
            },
          },
        ],
      },
    ],
  },
];
