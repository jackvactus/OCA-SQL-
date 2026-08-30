import type { CourseSession } from "./course-oca-sql";

/**
 * Cursus Oracle Database 19c — Data Guard Administration (1Z0-076).
 *
 * L'ordre suit le cycle de vie réel d'une configuration : comprendre, préparer
 * le réseau, créer la base de secours, l'exploiter, la piloter par le Broker,
 * basculer, puis sauvegarder, corriger et optimiser.
 */
export const dataGuardSessions: CourseSession[] = [
  {
    id: "dg-session-1",
    number: 1,
    title: { fr: "Concepts et architecture", en: "Concepts and architecture" },
    summary: {
      fr: "Ce que Data Guard résout, ce qu'il ne résout pas, et les trois natures de base de secours. La confusion entre sauvegarde et haute disponibilité est la première chose à lever.",
      en: "What Data Guard solves, what it does not, and the three kinds of standby database. Clearing up the confusion between backup and high availability comes first.",
    },
    estimatedMinutes: 120,
    topics: [
      {
        id: "dg-1-1",
        number: "1.1",
        title: { fr: "Le principe : transporter et appliquer le redo", en: "The principle: ship and apply redo" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Data Guard maintient une ou plusieurs copies synchronisées d'une base de production. Le mécanisme tient en une phrase : la base principale transmet son redo à la base de secours, qui l'applique en continu. Tout le reste — modes de protection, Broker, bascules — n'est que la manière de configurer et de piloter cet échange.",
              en: "Data Guard maintains one or more synchronised copies of a production database. The mechanism fits in a sentence: the primary ships its redo to the standby, which applies it continuously. Everything else — protection modes, the Broker, role transitions — is just how you configure and drive that exchange.",
            },
          },
          {
            kind: "compare",
            title: { fr: "Sauvegarde ou Data Guard ?", en: "Backup or Data Guard?" },
            wrong: `-- Une sauvegarde RMAN protege les DONNEES.
-- Apres un sinistre : restaurer, recuperer, rouvrir.
-- Duree : des heures. Perte : jusqu'au dernier archive log.`,
            right: `-- Data Guard protege le SERVICE.
-- Apres un sinistre : basculer sur la base de secours.
-- Duree : des minutes, voire des secondes.
-- Perte : nulle en mode Maximum Protection.`,
            note: {
              fr: "Les deux sont complémentaires, jamais substituables. Data Guard réplique aussi les erreurs logiques : un DROP TABLE malheureux est appliqué sur la base de secours en quelques secondes. Seules les sauvegardes et Flashback protègent de cela.",
              en: "The two are complementary, never substitutes. Data Guard also replicates logical errors: an unfortunate DROP TABLE reaches the standby within seconds. Only backups and Flashback protect against that.",
            },
          },
          {
            kind: "table",
            title: { fr: "Les processus en jeu", en: "The processes involved" },
            headers: [
              { fr: "Processus", en: "Process" },
              { fr: "Côté", en: "Side" },
              { fr: "Rôle", en: "Role" },
            ],
            rows: [
              [
                { fr: "LGWR / TT", en: "LGWR / TT" },
                { fr: "Principale", en: "Primary" },
                { fr: "Écrit le redo et le transmet", en: "Writes the redo and ships it" },
              ],
              [
                { fr: "LNS (NSSn / NSAn)", en: "LNS (NSSn / NSAn)" },
                { fr: "Principale", en: "Primary" },
                { fr: "Transport synchrone ou asynchrone", en: "Synchronous or asynchronous transport" },
              ],
              [
                { fr: "RFS", en: "RFS" },
                { fr: "Secours", en: "Standby" },
                { fr: "Reçoit le redo et l'écrit dans les standby redo logs", en: "Receives redo and writes it to the standby redo logs" },
              ],
              [
                { fr: "MRP0", en: "MRP0" },
                { fr: "Secours physique", en: "Physical standby" },
                { fr: "Applique le redo (Redo Apply)", en: "Applies the redo (Redo Apply)" },
              ],
              [
                { fr: "LSP0", en: "LSP0" },
                { fr: "Secours logique", en: "Logical standby" },
                { fr: "Rejoue les instructions SQL (SQL Apply)", en: "Replays SQL statements (SQL Apply)" },
              ],
            ],
          },
        ],
      },
      {
        id: "dg-1-2",
        number: "1.2",
        title: { fr: "Les trois natures de base de secours", en: "The three kinds of standby" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Type", en: "Type" },
              { fr: "Mécanisme", en: "Mechanism" },
              { fr: "Usage", en: "Use" },
            ],
            rows: [
              [
                { fr: "Physique", en: "Physical" },
                { fr: "Redo Apply — copie bloc à bloc identique", en: "Redo Apply — block-for-block identical copy" },
                { fr: "Reprise après sinistre, lecture seule avec Active Data Guard", en: "Disaster recovery, read-only with Active Data Guard" },
              ],
              [
                { fr: "Logique", en: "Logical" },
                { fr: "SQL Apply — rejoue les instructions", en: "SQL Apply — replays statements" },
                { fr: "Reporting, index supplémentaires, mise à niveau progressive", en: "Reporting, extra indexes, rolling upgrade" },
              ],
              [
                { fr: "Instantanée (snapshot)", en: "Snapshot" },
                { fr: "Physique convertie, ouverte en écriture", en: "Converted physical, open read-write" },
                { fr: "Tests sur données réelles, puis retour à l'état de secours", en: "Testing on real data, then reverting to standby" },
              ],
            ],
          },
          {
            kind: "tip",
            title: { fr: "La base de secours instantanée", en: "The snapshot standby" },
            body: {
              fr: "Convertir une base de secours physique en instantanée l'ouvre en lecture-écriture pour des tests : un point de restauration garanti est posé automatiquement. Elle continue de recevoir le redo sans l'appliquer. La reconversion en base physique effectue un Flashback jusqu'au point posé, puis rattrape tout le redo accumulé.",
              en: "Converting a physical standby to a snapshot opens it read-write for testing: a guaranteed restore point is created automatically. It keeps receiving redo without applying it. Converting back flashes the database back to that point, then catches up on all accumulated redo.",
            },
          },
          {
            kind: "code",
            code: `-- Aller-retour vers une base de secours instantanée
DGMGRL> CONVERT DATABASE 'orcl_sb' TO SNAPSHOT STANDBY;
-- … tests destructifs sur données réelles …
DGMGRL> CONVERT DATABASE 'orcl_sb' TO PHYSICAL STANDBY;

SELECT database_role, open_mode FROM v$database;`,
          },
        ],
      },
      {
        id: "dg-1-3",
        number: "1.3",
        title: { fr: "Data Guard en environnement multitenant", en: "Data Guard in a multitenant environment" },
        blocks: [
          {
            kind: "warning",
            body: {
              fr: "La configuration Data Guard s'applique à la **CDB entière**, jamais à une PDB isolée : le redo est commun à tous les conteneurs. On ne peut donc pas répliquer une seule PDB par Data Guard — c'est le rôle du clone rafraîchissable ou de GoldenGate.",
              en: "A Data Guard configuration applies to the **whole CDB**, never to a single PDB: redo is shared by every container. You therefore cannot replicate one PDB alone with Data Guard — that is what a refreshable clone or GoldenGate is for.",
            },
          },
          {
            kind: "text",
            body: {
              fr: "Deux conséquences pratiques : brancher une PDB dans la CDB principale la réplique automatiquement, à condition que ses fichiers soient accessibles côté secours ou que STANDBY_PDB_SOURCE_FILE_DBLINK soit configuré ; et le paramètre ENABLED_PDBS_ON_STANDBY permet, à partir de la 19c, de choisir quelles PDB sont réellement maintenues sur la base de secours.",
              en: "Two practical consequences: plugging a PDB into the primary CDB replicates it automatically, provided its files are reachable on the standby side or STANDBY_PDB_SOURCE_FILE_DBLINK is configured; and from 19c the ENABLED_PDBS_ON_STANDBY parameter lets you choose which PDBs are actually maintained on the standby.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "dg-session-2",
    number: 2,
    title: { fr: "Préparer et créer une base de secours physique", en: "Preparing and creating a physical standby" },
    summary: {
      fr: "Le réseau d'abord, puis la préparation de la base principale, puis la duplication RMAN active. L'ordre compte : la plupart des échecs de création viennent du réseau, pas de RMAN.",
      en: "Networking first, then preparing the primary, then the active RMAN duplicate. Order matters: most creation failures come from the network, not from RMAN.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "dg-2-1",
        number: "2.1",
        title: { fr: "Oracle Net et bonnes pratiques Data Guard", en: "Oracle Net and Data Guard best practices" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Enregistrement statique — indispensable ici", en: "Static registration — mandatory here" },
            code: `# listener.ora, des DEUX côtés
SID_LIST_LISTENER =
  (SID_LIST =
    (SID_DESC =
      (GLOBAL_DBNAME = orcl_sb_DGMGRL)   -- suffixe requis par le Broker
      (ORACLE_HOME = /u01/app/oracle/product/19.0.0/dbhome_1)
      (SID_NAME = orcl_sb)))`,
            caption: {
              fr: "PMON ne peut pas annoncer une instance arrêtée : sans entrée statique, ni la duplication RMAN ni le Broker ne peuvent joindre la base de secours pour la démarrer.",
              en: "PMON cannot advertise a stopped instance: without a static entry, neither the RMAN duplicate nor the Broker can reach the standby to start it.",
            },
          },
          {
            kind: "tip",
            body: {
              fr: "Trois réglages réseau font la différence sur une liaison longue distance : augmenter SDU à 65535 dans sqlnet.ora, dimensionner les tampons TCP côté système, et poser DEFAULT_SDU_SIZE. Sur une liaison intercontinentale, un SDU par défaut peut à lui seul diviser le débit du transport par trois.",
              en: "Three network settings make the difference on a long-distance link: raising SDU to 65535 in sqlnet.ora, sizing the TCP buffers at OS level, and setting DEFAULT_SDU_SIZE. On an intercontinental link, a default SDU alone can cut transport throughput by a factor of three.",
            },
          },
        ],
      },
      {
        id: "dg-2-2",
        number: "2.2",
        title: { fr: "Préparer la base principale", en: "Preparing the primary" },
        blocks: [
          {
            kind: "code",
            code: `-- Prérequis non négociables
ALTER DATABASE FORCE LOGGING;          -- annule tout NOLOGGING applicatif
ALTER DATABASE ARCHIVELOG;             -- base montée
ALTER DATABASE FLASHBACK ON;           -- indispensable pour réinstancier après failover

SELECT force_logging, log_mode, flashback_on, dataguard_broker FROM v$database;

-- Standby redo logs : un groupe de PLUS que les online, même taille
ALTER DATABASE ADD STANDBY LOGFILE GROUP 11 '/u01/oradata/srl11.log' SIZE 200M;

-- Paramètres structurants
ALTER SYSTEM SET db_unique_name = 'orcl_pr' SCOPE=SPFILE;
ALTER SYSTEM SET log_archive_config = 'DG_CONFIG=(orcl_pr,orcl_sb)';
ALTER SYSTEM SET standby_file_management = AUTO;
ALTER SYSTEM SET db_file_name_convert = '/orcl_sb/','/orcl_pr/';
ALTER SYSTEM SET log_file_name_convert = '/orcl_sb/','/orcl_pr/';`,
          },
          {
            kind: "warning",
            title: { fr: "FORCE LOGGING et les améliorations 19c du NOLOGGING", en: "FORCE LOGGING and the 19c nologging enhancements" },
            body: {
              fr: "Une opération NOLOGGING ne génère pas assez de redo pour être rejouée : les blocs concernés deviennent illisibles sur la base de secours. FORCE LOGGING l'interdit globalement. La 19c introduit deux modes intermédiaires — STANDBY NOLOGGING FOR DATA AVAILABILITY et FOR LOAD PERFORMANCE — qui autorisent les chargements rapides tout en garantissant que la base de secours reste utilisable.",
              en: "A NOLOGGING operation does not generate enough redo to be replayed: the affected blocks become unreadable on the standby. FORCE LOGGING forbids it globally. 19c introduces two intermediate modes — STANDBY NOLOGGING FOR DATA AVAILABILITY and FOR LOAD PERFORMANCE — which allow fast loads while keeping the standby usable.",
            },
          },
        ],
      },
      {
        id: "dg-2-3",
        number: "2.3",
        title: { fr: "Créer la base de secours par RMAN", en: "Creating the standby with RMAN" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Duplication active — la méthode de référence", en: "Active duplicate — the reference method" },
            code: `# Côté secours : fichier de mots de passe copié depuis la principale,
# puis instance démarrée en NOMOUNT avec un pfile minimal.
$ rman TARGET sys/mdp@orcl_pr AUXILIARY sys/mdp@orcl_sb

RMAN> DUPLICATE TARGET DATABASE
        FOR STANDBY
        FROM ACTIVE DATABASE
        DORECOVER
        SPFILE
          SET db_unique_name         = 'orcl_sb'
          SET log_archive_config     = 'DG_CONFIG=(orcl_pr,orcl_sb)'
          SET fal_server             = 'orcl_pr'
          SET standby_file_management = 'AUTO'
          SET db_file_name_convert   = '/orcl_pr/','/orcl_sb/'
          SET log_file_name_convert  = '/orcl_pr/','/orcl_sb/'
        NOFILENAMECHECK;`,
            caption: {
              fr: "USING COMPRESSED BACKUPSET réduit fortement le volume transféré sur une liaison lente ; USING BACKUPSET SECTION SIZE parallélise les gros fichiers.",
              en: "USING COMPRESSED BACKUPSET sharply cuts the volume transferred over a slow link; USING BACKUPSET SECTION SIZE parallelises large files.",
            },
          },
          {
            kind: "code",
            title: { fr: "Démarrer l'application du redo, puis vérifier", en: "Start redo apply, then verify" },
            code: `ALTER DATABASE RECOVER MANAGED STANDBY DATABASE
  USING CURRENT LOGFILE DISCONNECT FROM SESSION;

-- Contrôles à faire dans cet ordre
SELECT process, status, sequence# FROM v$managed_standby;
SELECT name, value, unit FROM v$dataguard_stats;   -- apply lag, transport lag
SELECT * FROM v$archive_gap;                        -- doit être vide
SELECT message FROM v$dataguard_status ORDER BY timestamp DESC FETCH FIRST 10 ROWS ONLY;`,
          },
          {
            kind: "tip",
            title: { fr: "DBMS_DBCOMP : comparer les blocs des deux bases", en: "DBMS_DBCOMP: compare blocks across both databases" },
            body: {
              fr: "Introduite en 12.2, la procédure DBMS_DBCOMP.DBCOMP compare bloc à bloc la base principale et sa base de secours, et signale toute divergence. C'est le contrôle qui prouve — plutôt qu'il ne suppose — que la réplique est fidèle, notamment après un incident de transport ou une opération NOLOGGING suspecte.",
              en: "Introduced in 12.2, the DBMS_DBCOMP.DBCOMP procedure compares the primary and its standby block by block, and reports any divergence. It is the check that proves — rather than assumes — that the replica is faithful, particularly after a transport incident or a suspicious NOLOGGING operation.",
            },
          },
          {
            kind: "code",
            code: `-- Comparer un fichier, ou toute la base
BEGIN
  DBMS_DBCOMP.DBCOMP(
    datafile     => 'all',
    outfile      => 'dbcomp_orcl',
    block_dump   => TRUE);
END;
/`,
          },
        ],
      },
    ],
  },

  {
    id: "dg-session-3",
    number: 3,
    title: { fr: "Bases de secours logiques et instantanées", en: "Logical and snapshot standby databases" },
    summary: {
      fr: "Quand la copie identique ne suffit pas : SQL Apply, filtrage, index supplémentaires, et l'aller-retour vers une base ouverte en écriture pour les tests.",
      en: "When an identical copy is not enough: SQL Apply, filtering, extra indexes, and the round trip to a read-write database for testing.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "dg-3-1",
        number: "3.1",
        title: { fr: "Quand créer une base de secours logique", en: "When to create a logical standby" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Une base de secours logique n'est pas une copie physique : elle rejoue les instructions SQL déduites du redo. Elle est donc ouverte en lecture-écriture, peut porter ses propres index, ses propres vues matérialisées, et même des tables absentes de la principale. Le prix à payer : SQL Apply ne prend pas en charge tous les types de données.",
              en: "A logical standby is not a physical copy: it replays SQL statements derived from the redo. It is therefore open read-write, can carry its own indexes, its own materialized views, and even tables absent from the primary. The price: SQL Apply does not support every data type.",
            },
          },
          {
            kind: "code",
            code: `-- Vérifier AVANT de créer : ce qui ne sera pas répliqué
SELECT owner, table_name FROM dba_logstdby_unsupported;
SELECT * FROM dba_logstdby_skip;

-- Les lignes doivent être identifiables de manière unique
ALTER DATABASE ADD SUPPLEMENTAL LOG DATA (PRIMARY KEY, UNIQUE INDEX) COLUMNS;

-- Conversion depuis une base de secours physique
ALTER DATABASE RECOVER TO LOGICAL STANDBY orcl_lg;
ALTER DATABASE OPEN RESETLOGS;
ALTER DATABASE START LOGICAL STANDBY APPLY IMMEDIATE;

-- Filtrage : ne pas rejouer certains objets
EXEC DBMS_LOGSTDBY.SKIP('SCHEMA_DDL', 'TEMP_APP', '%');
EXEC DBMS_LOGSTDBY.SKIP('DML', 'TEMP_APP', '%');`,
          },
          {
            kind: "warning",
            body: {
              fr: "Vérifiez impérativement DBA_LOGSTDBY_UNSUPPORTED avant de vous engager. Si des tables critiques y figurent, elles ne seront jamais répliquées — et vous ne le découvrirez qu'après la bascule. La mise à niveau progressive (rolling upgrade) reste l'usage le plus solide de ce type de base.",
              en: "You must check DBA_LOGSTDBY_UNSUPPORTED before committing. If critical tables appear there, they will never be replicated — and you will only find out after switching over. The rolling upgrade remains the most solid use of this kind of standby.",
            },
          },
        ],
      },
      {
        id: "dg-3-2",
        number: "3.2",
        title: { fr: "Le filtrage de SQL Apply", en: "SQL Apply filtering" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Procédure", en: "Procedure" },
              { fr: "Effet", en: "Effect" },
            ],
            rows: [
              [
                { fr: "DBMS_LOGSTDBY.SKIP", en: "DBMS_LOGSTDBY.SKIP" },
                { fr: "Ignorer un schéma, une table ou un type d'instruction", en: "Skip a schema, a table or a statement type" },
              ],
              [
                { fr: "DBMS_LOGSTDBY.SKIP_ERROR", en: "DBMS_LOGSTDBY.SKIP_ERROR" },
                { fr: "Poursuivre malgré une erreur donnée plutôt que d'arrêter l'application", en: "Continue past a given error rather than halting apply" },
              ],
              [
                { fr: "DBMS_LOGSTDBY.INSTANTIATE_TABLE", en: "DBMS_LOGSTDBY.INSTANTIATE_TABLE" },
                { fr: "Resynchroniser une table divergente sans tout recréer", en: "Resynchronise a diverged table without rebuilding everything" },
              ],
              [
                { fr: "DBMS_LOGSTDBY.APPLY_SET", en: "DBMS_LOGSTDBY.APPLY_SET" },
                { fr: "Régler le parallélisme et la mémoire de SQL Apply", en: "Tune SQL Apply parallelism and memory" },
              ],
            ],
          },
        ],
      },
    ],
  },

  {
    id: "dg-session-4",
    number: 4,
    title: { fr: "Transport, Active Data Guard et modes de protection", en: "Transport, Active Data Guard and protection modes" },
    summary: {
      fr: "Le cœur du compromis : jusqu'où accepte-t-on de perdre des données, et à quel prix pour la production. Puis Far Sync et Real-Time Cascade, qui permettent d'avoir les deux.",
      en: "The heart of the trade-off: how much data are you willing to lose, and at what cost to production. Then Far Sync and Real-Time Cascade, which let you have both.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "dg-4-1",
        number: "4.1",
        title: { fr: "Les trois modes de protection", en: "The three protection modes" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Mode", en: "Mode" },
              { fr: "Transport", en: "Transport" },
              { fr: "Perte possible", en: "Possible loss" },
              { fr: "Si le secours est injoignable", en: "If the standby is unreachable" },
            ],
            rows: [
              [
                { fr: "Maximum Performance", en: "Maximum Performance" },
                { fr: "ASYNC", en: "ASYNC" },
                { fr: "Quelques transactions", en: "A few transactions" },
                { fr: "La production continue", en: "Production carries on" },
              ],
              [
                { fr: "Maximum Availability", en: "Maximum Availability" },
                { fr: "SYNC ou FASTSYNC", en: "SYNC or FASTSYNC" },
                { fr: "Aucune, tant que la liaison tient", en: "None, while the link holds" },
                { fr: "Bascule en mode dégradé, la production continue", en: "Degrades gracefully, production carries on" },
              ],
              [
                { fr: "Maximum Protection", en: "Maximum Protection" },
                { fr: "SYNC", en: "SYNC" },
                { fr: "**Aucune, jamais**", en: "**None, ever**" },
                { fr: "**La production s'arrête**", en: "**Production halts**" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Maximum Protection tient sa promesse littéralement : si aucune base de secours ne peut accuser réception, la base principale s'arrête plutôt que de risquer une perte. Ce mode exige donc au moins deux bases de secours en pratique. Beaucoup de configurations le choisissent sur le papier et le regrettent en production.",
              en: "Maximum Protection keeps its promise literally: if no standby can acknowledge, the primary shuts down rather than risk a loss. That mode therefore requires at least two standbys in practice. Many configurations pick it on paper and regret it in production.",
            },
          },
          {
            kind: "code",
            code: `-- Changer le mode : d'abord le transport, ensuite le mode
ALTER SYSTEM SET log_archive_dest_2 =
  'SERVICE=orcl_sb SYNC AFFIRM VALID_FOR=(ONLINE_LOGFILES,PRIMARY_ROLE)
   DB_UNIQUE_NAME=orcl_sb';

ALTER DATABASE SET STANDBY DATABASE TO MAXIMIZE AVAILABILITY;
SELECT protection_mode, protection_level FROM v$database;`,
          },
          {
            kind: "tip",
            title: { fr: "FASTSYNC : le compromis de la 12c", en: "FASTSYNC: the 12c compromise" },
            body: {
              fr: "SYNC NOAFFIRM — écrit FASTSYNC — attend que la base de secours ait reçu le redo en mémoire, sans attendre son écriture disque. On garde l'essentiel de la garantie du synchrone en réduisant nettement la latence subie par les COMMIT de production.",
              en: "SYNC NOAFFIRM — written FASTSYNC — waits for the standby to have received the redo in memory, without waiting for its disk write. You keep most of the synchronous guarantee while markedly cutting the latency production COMMITs suffer.",
            },
          },
        ],
      },
      {
        id: "dg-4-2",
        number: "4.2",
        title: { fr: "Active Data Guard", en: "Active Data Guard" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Sans Active Data Guard, une base de secours physique est soit ouverte en lecture seule, soit en train d'appliquer le redo — jamais les deux. Active Data Guard lève cette exclusion : la base sert des requêtes pendant qu'elle applique. C'est une option payante de l'Enterprise Edition.",
              en: "Without Active Data Guard, a physical standby is either open read-only or applying redo — never both. Active Data Guard lifts that exclusion: the database serves queries while it applies. It is a paid Enterprise Edition option.",
            },
          },
          {
            kind: "code",
            code: `ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL;
ALTER DATABASE OPEN READ ONLY;
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE
  USING CURRENT LOGFILE DISCONNECT;

SELECT database_role, open_mode FROM v$database;
-- PHYSICAL STANDBY / READ ONLY WITH APPLY`,
          },
          {
            kind: "list",
            title: { fr: "Ce qu'une instance Active Data Guard sait faire", en: "What an Active Data Guard instance can do" },
            items: [
              { fr: "Servir des requêtes en lecture, y compris de gros rapports", en: "Serve read queries, including heavy reports" },
              { fr: "Décharger les sauvegardes RMAN de la production", en: "Offload RMAN backups from production" },
              { fr: "Accueillir des tables temporaires globales, malgré la lecture seule", en: "Host global temporary tables, despite being read-only" },
              { fr: "Suivre des séquences en mode SESSION pour les applications de reporting", en: "Support SESSION-scoped sequences for reporting applications" },
              { fr: "Rediriger automatiquement les DML vers la principale (ADG Redirect, 19c)", en: "Automatically redirect DML to the primary (ADG Redirect, 19c)" },
            ],
          },
        ],
      },
      {
        id: "dg-4-3",
        number: "4.3",
        title: { fr: "Far Sync et Real-Time Cascade", en: "Far Sync and Real-Time Cascade" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Le dilemme intercontinental : le mode synchrone garantit zéro perte mais impose la latence du réseau à chaque COMMIT ; l'asynchrone est rapide mais accepte une perte. Far Sync le résout — une instance légère, sans fichiers de données, placée près de la production, reçoit le redo en synchrone puis le retransmet en asynchrone vers la base de secours distante.",
              en: "The intercontinental dilemma: synchronous mode guarantees zero loss but imposes network latency on every COMMIT; asynchronous is fast but accepts loss. Far Sync solves it — a lightweight instance with no data files, placed near production, receives redo synchronously then forwards it asynchronously to the remote standby.",
            },
          },
          {
            kind: "code",
            code: `-- Créer le fichier de contrôle Far Sync depuis la principale
ALTER DATABASE CREATE FAR SYNC INSTANCE CONTROLFILE AS '/tmp/farsync.ctl';

-- Sur l'instance Far Sync : ni datafile, ni redo apply.
-- Uniquement un fichier de contrôle et des standby redo logs.
SELECT database_role FROM v$database;   -- FAR SYNC

-- Chaîne : principale --SYNC--> Far Sync --ASYNC--> secours distant`,
          },
          {
            kind: "tip",
            title: { fr: "Real-Time Cascade", en: "Real-Time Cascade" },
            body: {
              fr: "Une base de secours peut retransmettre le redo vers une troisième base, ce qui allège la charge de transport de la principale. Depuis la 12c, la retransmission est immédiate — au fil de la réception, sans attendre la fin du fichier journal. Une configuration à trois niveaux devient ainsi presque aussi réactive qu'une configuration directe.",
              en: "A standby can forward redo on to a third database, which relieves the primary's transport load. Since 12c, forwarding is immediate — as redo arrives, without waiting for the log file to complete. A three-tier configuration therefore becomes almost as responsive as a direct one.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "dg-session-5",
    number: 5,
    title: { fr: "Data Guard Broker", en: "The Data Guard Broker" },
    summary: {
      fr: "Piloter la configuration comme un tout plutôt que base par base. Le Broker est aussi le prérequis du Fast-Start Failover.",
      en: "Driving the configuration as a whole rather than database by database. The Broker is also a prerequisite for Fast-Start Failover.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "dg-5-1",
        number: "5.1",
        title: { fr: "Mettre en place le Broker", en: "Setting up the Broker" },
        blocks: [
          {
            kind: "code",
            code: `-- Sur chaque base de la configuration
ALTER SYSTEM SET dg_broker_start = TRUE SCOPE=BOTH;
SHOW PARAMETER dg_broker_config_file;

-- Créer la configuration
$ dgmgrl sys/mdp@orcl_pr
DGMGRL> CREATE CONFIGURATION 'prod_dg' AS PRIMARY DATABASE IS 'orcl_pr'
          CONNECT IDENTIFIER IS orcl_pr;
DGMGRL> ADD DATABASE 'orcl_sb' AS CONNECT IDENTIFIER IS orcl_sb
          MAINTAINED AS PHYSICAL;
DGMGRL> ENABLE CONFIGURATION;

DGMGRL> SHOW CONFIGURATION;
DGMGRL> SHOW DATABASE VERBOSE 'orcl_sb';`,
          },
          {
            kind: "warning",
            body: {
              fr: "À partir du moment où le Broker gère la configuration, cessez de modifier LOG_ARCHIVE_DEST_n en SQL : le Broker les réécrit et vos changements disparaissent sans avertissement. Tout passe désormais par EDIT DATABASE … SET PROPERTY.",
              en: "Once the Broker manages the configuration, stop editing LOG_ARCHIVE_DEST_n in SQL: the Broker rewrites them and your changes vanish without warning. Everything now goes through EDIT DATABASE … SET PROPERTY.",
            },
          },
        ],
      },
      {
        id: "dg-5-2",
        number: "5.2",
        title: { fr: "VALIDATE : vérifier avant d'agir", en: "VALIDATE: check before acting" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Les commandes VALIDATE, introduites en 12.2", en: "The VALIDATE commands, introduced in 12.2" },
            code: `DGMGRL> VALIDATE DATABASE 'orcl_sb';
-- Rapporte : capacité à basculer, écarts de fichiers, redo manquant,
-- fichier de mots de passe, Flashback, standby redo logs, rôle des services.

DGMGRL> VALIDATE DATABASE 'orcl_sb' DATAFILE 7;
DGMGRL> VALIDATE DATABASE 'orcl_sb' SPFILE;
DGMGRL> VALIDATE NETWORK CONFIGURATION FOR ALL;
DGMGRL> VALIDATE STATIC CONNECT IDENTIFIER FOR 'orcl_sb';
DGMGRL> VALIDATE FAR_SYNC 'fs1' WHEN PRIMARY IS 'orcl_pr';`,
          },
          {
            kind: "tip",
            body: {
              fr: "VALIDATE DATABASE répond à la seule question qui compte avant un incident : « puis-je basculer maintenant, et que perdrais-je ? ». À exécuter régulièrement, pas seulement le jour du sinistre — c'est le contrôle qui transforme un plan de reprise théorique en capacité vérifiée.",
              en: "VALIDATE DATABASE answers the only question that matters before an incident: “can I switch over right now, and what would I lose?”. Run it regularly, not only on the day of the disaster — it is the check that turns a theoretical recovery plan into a verified capability.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "dg-session-6",
    number: 6,
    title: { fr: "Transitions de rôle et Flashback", en: "Role transitions and Flashback" },
    summary: {
      fr: "Switchover planifié, failover subi, Fast-Start Failover automatique, et le rôle décisif de Flashback Database pour réinstancier l'ancienne base principale.",
      en: "Planned switchover, forced failover, automatic Fast-Start Failover, and the decisive role of Flashback Database in reinstating the former primary.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "dg-6-1",
        number: "6.1",
        title: { fr: "Switchover et failover", en: "Switchover and failover" },
        blocks: [
          {
            kind: "compare",
            title: { fr: "Deux opérations très différentes", en: "Two very different operations" },
            wrong: `-- FAILOVER : subi, non planifie.
-- La principale est perdue ou injoignable.
-- Perte de donnees possible selon le mode de protection.
-- L'ancienne principale doit etre REINSTANCIEE ou recreee.
DGMGRL> FAILOVER TO 'orcl_sb';`,
            right: `-- SWITCHOVER : planifie, sans perte.
-- Les deux bases echangent leurs roles proprement.
-- L'ancienne principale devient base de secours,
-- sans aucune recreation.
DGMGRL> SWITCHOVER TO 'orcl_sb';`,
            note: {
              fr: "Un switchover se prépare et se répète : c'est l'opération à exercer périodiquement pour vérifier que la reprise fonctionne réellement. Un failover, lui, se subit.",
              en: "A switchover is prepared and rehearsed: it is the operation to exercise periodically to verify that recovery actually works. A failover, by contrast, is endured.",
            },
          },
          {
            kind: "code",
            code: `-- Avant toute bascule
DGMGRL> VALIDATE DATABASE 'orcl_sb';
DGMGRL> SHOW CONFIGURATION;   -- doit être SUCCESS

-- Après un failover, réinstancier l'ancienne principale.
-- Possible SANS la recréer si Flashback était activé.
DGMGRL> REINSTATE DATABASE 'orcl_pr';`,
          },
          {
            kind: "warning",
            title: { fr: "Pourquoi Flashback est indispensable", en: "Why Flashback is indispensable" },
            body: {
              fr: "Après un failover, l'ancienne base principale contient des transactions que la nouvelle n'a jamais reçues : elle a divergé. Sans Flashback Database, il faut la recréer intégralement — des heures sur un gros volume. Avec Flashback activé, REINSTATE la ramène au SCN de divergence puis la resynchronise en quelques minutes.",
              en: "After a failover, the former primary holds transactions the new one never received: it has diverged. Without Flashback Database you must rebuild it entirely — hours on a large volume. With Flashback enabled, REINSTATE rewinds it to the divergence SCN then resynchronises it in minutes.",
            },
          },
        ],
      },
      {
        id: "dg-6-2",
        number: "6.2",
        title: { fr: "Fast-Start Failover et l'observateur", en: "Fast-Start Failover and the observer" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Fast-Start Failover automatise la bascule : un processus tiers, l'observateur, surveille la principale et déclenche le failover si elle disparaît au-delà d'un délai. Il doit s'exécuter sur un **troisième** site — s'il partageait le sort de la principale, il ne pourrait rien décider.",
              en: "Fast-Start Failover automates the transition: a third-party process, the observer, watches the primary and triggers failover if it disappears beyond a threshold. It must run on a **third** site — sharing the primary's fate would leave it unable to decide anything.",
            },
          },
          {
            kind: "code",
            code: `DGMGRL> EDIT DATABASE 'orcl_pr' SET PROPERTY FastStartFailoverTarget = 'orcl_sb';
DGMGRL> EDIT CONFIGURATION SET PROTECTION MODE AS MAXAVAILABILITY;
DGMGRL> EDIT CONFIGURATION SET PROPERTY FastStartFailoverThreshold = 30;
DGMGRL> ENABLE FAST_START FAILOVER;

-- L'observateur, sur un TROISIÈME serveur
DGMGRL> START OBSERVER;
DGMGRL> SHOW FAST_START FAILOVER;
DGMGRL> SHOW OBSERVER;

-- Plusieurs observateurs depuis la 12.2, dont un seul est maître
DGMGRL> START OBSERVER 'obs_paris' IN BACKGROUND;`,
          },
          {
            kind: "table",
            title: { fr: "Conditions de déclenchement", en: "Trigger conditions" },
            headers: [
              { fr: "Condition", en: "Condition" },
              { fr: "Comportement", en: "Behaviour" },
            ],
            rows: [
              [
                { fr: "Principale injoignable au-delà du seuil", en: "Primary unreachable beyond the threshold" },
                { fr: "Failover automatique", en: "Automatic failover" },
              ],
              [
                { fr: "Appel applicatif à DBMS_DG.INITIATE_FS_FAILOVER", en: "Application call to DBMS_DG.INITIATE_FS_FAILOVER" },
                { fr: "Failover immédiat, sans attendre le seuil", en: "Immediate failover, without waiting for the threshold" },
              ],
              [
                { fr: "Conditions configurables : corruption, erreur de datafile", en: "Configurable conditions: corruption, data file error" },
                { fr: "ENABLE FAST_START FAILOVER CONDITION", en: "ENABLE FAST_START FAILOVER CONDITION" },
              ],
              [
                { fr: "Observateur seul survivant, sans la base de secours", en: "Observer alone, without the standby" },
                { fr: "Aucun failover — le quorum est perdu", en: "No failover — quorum is lost" },
              ],
            ],
          },
        ],
      },
      {
        id: "dg-6-3",
        number: "6.3",
        title: { fr: "Points de restauration répliqués", en: "Replicated restore points" },
        blocks: [
          {
            kind: "tip",
            body: {
              fr: "Depuis la 12.2, un point de restauration créé sur la base principale est automatiquement propagé à la base de secours, préfixé par son nom d'origine. On peut ainsi ramener les deux bases au même instant logique après une erreur applicative — un scénario impossible auparavant sans intervention manuelle des deux côtés.",
              en: "Since 12.2, a restore point created on the primary is automatically propagated to the standby, prefixed with its original name. You can therefore rewind both databases to the same logical instant after an application error — a scenario previously impossible without manual intervention on both sides.",
            },
          },
          {
            kind: "code",
            code: `-- Sur la principale
CREATE RESTORE POINT avant_release GUARANTEE FLASHBACK DATABASE;

-- Sur la base de secours, il apparaît seul
SELECT name, guarantee_flashback_database, replicated FROM v$restore_point;`,
          },
        ],
      },
    ],
  },

  {
    id: "dg-session-7",
    number: 7,
    title: { fr: "Sauvegarde, correctifs et mises à niveau", en: "Backup, patching and upgrades" },
    summary: {
      fr: "Décharger les sauvegardes sur la base de secours, réparer les blocs corrompus automatiquement, récupérer par le réseau, et mettre à niveau sans interruption.",
      en: "Offloading backups to the standby, repairing corrupt blocks automatically, recovering over the network, and upgrading without downtime.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "dg-7-1",
        number: "7.1",
        title: { fr: "Décharger les sauvegardes", en: "Offloading backups" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Une base de secours physique est une copie bloc à bloc : une sauvegarde prise sur elle est utilisable pour restaurer la principale. C'est l'un des retours sur investissement immédiats de Data Guard — la production ne subit plus la charge des sauvegardes.",
              en: "A physical standby is a block-for-block copy: a backup taken from it can restore the primary. That is one of Data Guard's immediate returns on investment — production no longer bears the backup load.",
            },
          },
          {
            kind: "code",
            code: `-- Suivi des blocs modifiés sur la base de secours : autorisé
-- depuis la 11g avec Active Data Guard.
ALTER DATABASE ENABLE BLOCK CHANGE TRACKING USING FILE '/u02/bct_sb.dbf';

RMAN> CONNECT TARGET sys/mdp@orcl_sb
RMAN> BACKUP DATABASE PLUS ARCHIVELOG;

-- Récupérer la PRINCIPALE depuis la base de secours, par le réseau,
-- sans aucune restauration de fichier :
RMAN> RECOVER DATABASE FROM SERVICE orcl_sb USING COMPRESSED BACKUPSET;

-- Resynchroniser une base de secours très en retard, en une commande :
RMAN> RECOVER STANDBY DATABASE FROM SERVICE orcl_pr;`,
          },
          {
            kind: "tip",
            title: { fr: "Récupération automatique de blocs", en: "Automatic Block Media Recovery" },
            body: {
              fr: "Avec Active Data Guard, un bloc corrompu détecté sur la principale est réparé automatiquement depuis la base de secours — et réciproquement — sans intervention ni interruption. La session qui a rencontré la corruption attend quelques instants puis poursuit. L'événement est tracé dans l'alert log.",
              en: "With Active Data Guard, a corrupt block found on the primary is automatically repaired from the standby — and vice versa — with no intervention and no downtime. The session that hit the corruption waits a moment then carries on. The event is traced in the alert log.",
            },
          },
        ],
      },
      {
        id: "dg-7-2",
        number: "7.2",
        title: { fr: "Mise à niveau progressive", en: "Rolling upgrade" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Une mise à niveau progressive réduit l'indisponibilité à la durée d'un switchover. Le principe : mettre à niveau la base de secours pendant que la production tourne, basculer, puis mettre à niveau l'ancienne principale devenue secours.",
              en: "A rolling upgrade cuts downtime to the length of a switchover. The principle: upgrade the standby while production runs, switch over, then upgrade the former primary, now the standby.",
            },
          },
          {
            kind: "table",
            headers: [
              { fr: "Méthode", en: "Method" },
              { fr: "Principe", en: "Principle" },
            ],
            rows: [
              [
                { fr: "DBMS_ROLLING", en: "DBMS_ROLLING" },
                { fr: "Automatise la conversion en secours logique transitoire, puis la mise à niveau — la méthode recommandée", en: "Automates conversion to a transient logical standby, then the upgrade — the recommended method" },
              ],
              [
                { fr: "Secours logique transitoire, manuel", en: "Manual transient logical standby" },
                { fr: "Même principe, piloté à la main", en: "Same principle, driven by hand" },
              ],
              [
                { fr: "Correctifs classiques", en: "Standard patching" },
                { fr: "Pour un Release Update sans changement de dictionnaire", en: "For a Release Update with no dictionary change" },
              ],
            ],
          },
          {
            kind: "code",
            code: `EXEC DBMS_ROLLING.INIT_PLAN(future_primary => 'orcl_sb');
EXEC DBMS_ROLLING.BUILD_PLAN;
EXEC DBMS_ROLLING.START_PLAN;
-- … mise à niveau du logiciel sur la future principale …
EXEC DBMS_ROLLING.SWITCHOVER;
EXEC DBMS_ROLLING.FINISH_PLAN;

SELECT revision, phase, status FROM dba_rolling_status;`,
          },
        ],
      },
    ],
  },

  {
    id: "dg-session-8",
    number: 8,
    title: { fr: "Optimisation, exploitation et continuité applicative", en: "Tuning, operations and application continuity" },
    summary: {
      fr: "Surveiller les écarts, optimiser le transport et l'application, gérer les changements structurels, et faire en sorte que les clients suivent la bascule sans erreur.",
      en: "Watching the lags, tuning transport and apply, handling structural changes, and making sure clients follow the switch without errors.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "dg-8-1",
        number: "8.1",
        title: { fr: "Mesurer et optimiser les écarts", en: "Measuring and tuning the lags" },
        blocks: [
          {
            kind: "code",
            code: `-- Les deux indicateurs qui comptent
SELECT name, value, time_computed FROM v$dataguard_stats
WHERE  name IN ('transport lag','apply lag','apply finish time');

SELECT process, status, thread#, sequence#, block#, blocks
FROM   v$managed_standby;

-- Débit de l'application
SELECT * FROM v$recovery_progress
WHERE  item IN ('Active Apply Rate','Average Apply Rate','Last Applied Redo');`,
          },
          {
            kind: "table",
            title: { fr: "Diagnostiquer un écart", en: "Diagnosing a lag" },
            headers: [
              { fr: "Symptôme", en: "Symptom" },
              { fr: "Cause probable", en: "Likely cause" },
              { fr: "Levier", en: "Lever" },
            ],
            rows: [
              [
                { fr: "Transport lag élevé, apply lag faible", en: "High transport lag, low apply lag" },
                { fr: "Réseau saturé ou mal réglé", en: "Saturated or misconfigured network" },
                { fr: "SDU, tampons TCP, compression du redo", en: "SDU, TCP buffers, redo compression" },
              ],
              [
                { fr: "Transport lag faible, apply lag élevé", en: "Low transport lag, high apply lag" },
                { fr: "La base de secours n'applique pas assez vite", en: "The standby cannot apply fast enough" },
                { fr: "Parallélisme du Redo Apply, entrées-sorties du secours", en: "Redo Apply parallelism, standby I/O" },
              ],
              [
                { fr: "Les deux élevés, par à-coups", en: "Both high, in bursts" },
                { fr: "Chargements de masse sur la principale", en: "Bulk loads on the primary" },
                { fr: "Planifier, ou passer en mode Maximum Performance", en: "Schedule them, or move to Maximum Performance" },
              ],
            ],
          },
          {
            kind: "code",
            code: `-- Régler le parallélisme de l'application
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE PARALLEL 8 DISCONNECT;

-- Compresser le redo transporté (option Advanced Compression)
ALTER SYSTEM SET log_archive_dest_2 =
  'SERVICE=orcl_sb ASYNC COMPRESSION=ENABLE DB_UNIQUE_NAME=orcl_sb';`,
          },
        ],
      },
      {
        id: "dg-8-2",
        number: "8.2",
        title: { fr: "Changements structurels sur la principale", en: "Structural changes on the primary" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Changement sur la principale", en: "Change on the primary" },
              { fr: "Intervention côté secours", en: "Action on the standby" },
            ],
            rows: [
              [
                { fr: "Ajout d'un fichier de données", en: "Adding a data file" },
                { fr: "Aucune, si STANDBY_FILE_MANAGEMENT = AUTO", en: "None, if STANDBY_FILE_MANAGEMENT = AUTO" },
              ],
              [
                { fr: "Ajout d'un groupe de redo logs", en: "Adding a redo log group" },
                { fr: "**Manuelle** — ajouter aussi un standby redo log", en: "**Manual** — add a standby redo log too" },
              ],
              [
                { fr: "Déplacement d'un fichier de données", en: "Moving a data file" },
                { fr: "Manuelle, sauf si les conversions de noms couvrent le cas", en: "Manual, unless the name conversions cover it" },
              ],
              [
                { fr: "Changement de mot de passe SYS", en: "Changing the SYS password" },
                { fr: "**Manuelle** — recopier le fichier de mots de passe", en: "**Manual** — copy the password file across" },
              ],
              [
                { fr: "Opération NOLOGGING", en: "NOLOGGING operation" },
                { fr: "Blocs illisibles — RECOVER … NONLOGGED BLOCK", en: "Unreadable blocks — RECOVER … NONLOGGED BLOCK" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "L'oubli du fichier de mots de passe est la panne la plus fréquente en exploitation : le transport du redo s'arrête net après un changement de mot de passe SYS, et l'erreur ORA-16191 n'apparaît que dans l'alert log de la principale. À vérifier systématiquement après toute rotation de mot de passe.",
              en: "Forgetting the password file is the most frequent operational failure: redo transport stops dead after a SYS password change, and the ORA-16191 error only shows in the primary's alert log. Check it systematically after any password rotation.",
            },
          },
        ],
      },
      {
        id: "dg-8-3",
        number: "8.3",
        title: { fr: "Connectivité client et continuité applicative", en: "Client connectivity and Application Continuity" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Basculer la base ne sert à rien si les clients continuent de viser l'ancienne. La réponse tient en deux mécanismes : un service dont le rôle est déclaré, et un descripteur de connexion listant les deux sites.",
              en: "Switching the database is pointless if clients keep aiming at the old one. The answer rests on two mechanisms: a service whose role is declared, and a connect descriptor listing both sites.",
            },
          },
          {
            kind: "code",
            code: `-- Un service qui ne démarre QUE sur la base ayant le rôle PRIMARY
BEGIN
  DBMS_SERVICE.CREATE_SERVICE(
    service_name => 'ventes_svc',
    network_name => 'ventes_svc',
    failover_method => 'BASIC', failover_type => 'SELECT',
    failover_retries => 30, failover_delay => 5);
END;
/
-- Déclenché par un trigger sur DB_ROLE_CHANGE, ou par srvctl -role PRIMARY

-- Côté client : les deux sites dans le même descripteur
VENTES =
 (DESCRIPTION =
   (CONNECT_TIMEOUT=10)(RETRY_COUNT=20)(RETRY_DELAY=3)
   (ADDRESS_LIST =
     (ADDRESS=(PROTOCOL=TCP)(HOST=site-a)(PORT=1521))
     (ADDRESS=(PROTOCOL=TCP)(HOST=site-b)(PORT=1521)))
   (CONNECT_DATA=(SERVICE_NAME=ventes_svc)))`,
          },
          {
            kind: "tip",
            title: { fr: "Application Continuity", en: "Application Continuity" },
            body: {
              fr: "Le basculement de connexion (TAF) reconnecte, mais l'application reçoit tout de même une erreur sur la transaction en cours. Application Continuity va plus loin : le pilote rejoue la transaction interrompue sur la nouvelle base principale, de façon transparente. Il exige un service configuré en FAILOVER_TYPE=TRANSACTION et un pilote compatible.",
              en: "Connection failover (TAF) reconnects, but the application still receives an error on the in-flight transaction. Application Continuity goes further: the driver replays the interrupted transaction on the new primary, transparently. It requires a service configured with FAILOVER_TYPE=TRANSACTION and a compatible driver.",
            },
          },
        ],
      },
    ],
  },
];
