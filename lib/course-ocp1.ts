import type { CourseSession } from "./course-oca-sql";

/**
 * Cursus Oracle Database Administration I — examen 1Z0-082.
 *
 * L'ordre suit celui du cours officiel Oracle University « Oracle Database:
 * Administration Workshop », dont l'examen est directement issu : architecture,
 * instance, sécurité, stockage, réseau, déplacement de données.
 *
 * Le volet SQL de l'examen (17 domaines sur 23) n'est pas repris ici : il est
 * déjà couvert par le cursus OCA SQL, auquel la page de parcours renvoie.
 *
 * Les points de vigilance signalés proviennent des corrigés de `docs/OCA/`
 * (OCP.docx + Reponses.docx, 142 questions appariées).
 */
export const ocp1Sessions: CourseSession[] = [
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp1-session-1",
    number: 1,
    title: { fr: "Architecture Oracle Database", en: "Oracle Database architecture" },
    summary: {
      fr: "Instance et base, structures mémoire, processus d'arrière-plan, structures logiques et physiques. C'est le socle : la moitié des questions d'administration s'y rattachent.",
      en: "Instance and database, memory structures, background processes, logical and physical structures. This is the foundation: half the administration questions trace back to it.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "ocp1-1-1",
        number: "1.1",
        title: { fr: "Instance et base de données", en: "Instance and database" },
        blocks: [
          {
            kind: "figure",
            src: "/art/oracle-instance.svg",
            alt: {
              fr: "Architecture d'une instance Oracle : SGA, processus d'arriere-plan et fichiers de la base",
              en: "Oracle instance architecture: SGA, background processes and database files",
            },
            caption: {
              fr: "L'instance, ce sont la SGA et les processus. La base, ce sont les fichiers. Les deux sont distincts, et l'examen insiste sur cette separation.",
              en: "The instance is the SGA and the processes. The database is the files. They are distinct, and the exam insists on that separation.",
            },
            width: 900,
            height: 600,
          },
          {
            kind: "text",
            body: {
              fr: "Une base Oracle est un ensemble de fichiers sur disque. Une instance est un ensemble de structures mémoire et de processus qui permettent d'y accéder. Les deux sont distincts : une instance peut démarrer sans base montée, et une base peut être ouverte par plusieurs instances en configuration RAC.",
              en: "An Oracle database is a set of files on disk. An instance is a set of memory structures and processes that provide access to them. The two are distinct: an instance can start without a mounted database, and one database can be opened by several instances in a RAC configuration.",
            },
          },
          {
            kind: "table",
            title: { fr: "Les trois familles de fichiers", en: "The three file families" },
            headers: [
              { fr: "Fichier", en: "File" },
              { fr: "Rôle", en: "Purpose" },
              { fr: "Perte", en: "If lost" },
            ],
            rows: [
              [
                { fr: "Fichiers de données (datafiles)", en: "Data files" },
                { fr: "Contiennent les données et les objets de schéma", en: "Hold the data and schema objects" },
                { fr: "Restauration RMAN nécessaire", en: "RMAN restore required" },
              ],
              [
                { fr: "Fichiers de contrôle (control files)", en: "Control files" },
                { fr: "Décrivent la structure physique, le SCN, les points de reprise", en: "Describe the physical structure, the SCN, checkpoints" },
                { fr: "Base non montable — multiplexez-les", en: "Database cannot mount — multiplex them" },
              ],
              [
                { fr: "Fichiers de journalisation (redo logs)", en: "Online redo logs" },
                { fr: "Enregistrent toute modification avant écriture des données", en: "Record every change before data is written" },
                { fr: "Perte de transactions non écrites", en: "Loss of unwritten transactions" },
              ],
            ],
          },
          {
            kind: "tip",
            title: { fr: "Les quatre états au démarrage", en: "The four startup states" },
            body: {
              fr: "SHUTDOWN → NOMOUNT (instance démarrée, fichier de paramètres lu) → MOUNT (fichier de contrôle lu) → OPEN (datafiles et redo logs ouverts). On monte sans ouvrir pour renommer un datafile, activer ARCHIVELOG ou restaurer par RMAN.",
              en: "SHUTDOWN → NOMOUNT (instance started, parameter file read) → MOUNT (control file read) → OPEN (data files and redo logs opened). You mount without opening to rename a data file, enable ARCHIVELOG or restore with RMAN.",
            },
          },
        ],
      },
      {
        id: "ocp1-1-2",
        number: "1.2",
        title: { fr: "Structures mémoire : SGA et PGA", en: "Memory structures: SGA and PGA" },
        blocks: [
          {
            kind: "table",
            title: { fr: "Composants de la SGA (mémoire partagée)", en: "SGA components (shared memory)" },
            headers: [
              { fr: "Composant", en: "Component" },
              { fr: "Contenu", en: "Contents" },
            ],
            rows: [
              [
                { fr: "Database Buffer Cache", en: "Database Buffer Cache" },
                { fr: "Blocs de données récemment lus ou modifiés", en: "Recently read or modified data blocks" },
              ],
              [
                { fr: "Shared Pool", en: "Shared Pool" },
                { fr: "Library cache (plans SQL) et dictionary cache", en: "Library cache (SQL plans) and dictionary cache" },
              ],
              [
                { fr: "Redo Log Buffer", en: "Redo Log Buffer" },
                { fr: "Enregistrements de reprise en attente d'écriture", en: "Redo entries awaiting write" },
              ],
              [
                { fr: "Large Pool", en: "Large Pool" },
                { fr: "RMAN, serveur partagé, E/S parallèles", en: "RMAN, shared server, parallel I/O" },
              ],
              [
                { fr: "Java Pool / Streams Pool", en: "Java Pool / Streams Pool" },
                { fr: "JVM interne, capture et application de flux", en: "Internal JVM, stream capture and apply" },
              ],
            ],
          },
          {
            kind: "text",
            body: {
              fr: "La PGA est privée à chaque processus serveur : zone de tri, zone de hachage, informations de session. Elle n'est jamais partagée entre sessions, contrairement à la SGA.",
              en: "The PGA is private to each server process: sort area, hash area, session information. It is never shared between sessions, unlike the SGA.",
            },
          },
          {
            kind: "code",
            title: { fr: "Gestion automatique de la mémoire", en: "Automatic memory management" },
            code: `-- Gestion automatique complète (SGA + PGA)
ALTER SYSTEM SET MEMORY_TARGET     = 4G  SCOPE=SPFILE;
ALTER SYSTEM SET MEMORY_MAX_TARGET = 6G  SCOPE=SPFILE;

-- Ou gestion séparée, plus courante en production
ALTER SYSTEM SET SGA_TARGET             = 3G SCOPE=BOTH;
ALTER SYSTEM SET PGA_AGGREGATE_TARGET   = 1G SCOPE=BOTH;

-- Consultation
SELECT component, current_size, min_size, max_size FROM v$sga_dynamic_components;
SELECT name, value FROM v$pgastat WHERE name LIKE '%target%';`,
          },
          {
            kind: "warning",
            body: {
              fr: "MEMORY_TARGET (gestion automatique complète) est incompatible avec HugePages sous Linux et n'est pas recommandé sur les grosses instances. En pratique on fixe SGA_TARGET et PGA_AGGREGATE_TARGET séparément.",
              en: "MEMORY_TARGET (full automatic management) is incompatible with HugePages on Linux and is not recommended on large instances. In practice you set SGA_TARGET and PGA_AGGREGATE_TARGET separately.",
            },
          },
        ],
      },
      {
        id: "ocp1-1-3",
        number: "1.3",
        title: { fr: "Processus d'arrière-plan", en: "Background processes" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Processus", en: "Process" },
              { fr: "Mission", en: "Mission" },
            ],
            rows: [
              [
                { fr: "DBWn — Database Writer", en: "DBWn — Database Writer" },
                { fr: "Écrit les blocs modifiés du buffer cache vers les datafiles", en: "Writes dirty blocks from the buffer cache to data files" },
              ],
              [
                { fr: "LGWR — Log Writer", en: "LGWR — Log Writer" },
                { fr: "Écrit le redo log buffer dans les redo logs, à chaque COMMIT", en: "Writes the redo log buffer to the redo logs, on every COMMIT" },
              ],
              [
                { fr: "CKPT — Checkpoint", en: "CKPT — Checkpoint" },
                { fr: "Met à jour les en-têtes de datafiles et le fichier de contrôle", en: "Updates data file headers and the control file" },
              ],
              [
                { fr: "SMON — System Monitor", en: "SMON — System Monitor" },
                { fr: "Récupération d'instance, fusion d'espace libre, nettoyage des segments temporaires", en: "Instance recovery, free space coalescing, temporary segment cleanup" },
              ],
              [
                { fr: "PMON — Process Monitor", en: "PMON — Process Monitor" },
                { fr: "Nettoie après l'échec d'un processus utilisateur, libère verrous et ressources", en: "Cleans up after a failed user process, releases locks and resources" },
              ],
              [
                { fr: "ARCn — Archiver", en: "ARCn — Archiver" },
                { fr: "Copie les redo logs pleins vers les archives (mode ARCHIVELOG)", en: "Copies full redo logs to the archives (ARCHIVELOG mode)" },
              ],
              [
                { fr: "MMON / MMNL", en: "MMON / MMNL" },
                { fr: "Statistiques AWR, alertes générées par le serveur", en: "AWR statistics, server-generated alerts" },
              ],
            ],
          },
          {
            kind: "tip",
            title: { fr: "Le principe du write-ahead logging", en: "The write-ahead logging principle" },
            body: {
              fr: "LGWR écrit toujours AVANT DBWn. Un COMMIT n'attend pas l'écriture des blocs de données : il attend l'écriture du redo. C'est ce qui permet à SMON de rejouer les transactions validées après un arrêt brutal.",
              en: "LGWR always writes BEFORE DBWn. A COMMIT does not wait for data blocks to be written: it waits for the redo write. That is what lets SMON replay committed transactions after a crash.",
            },
          },
          {
            kind: "warning",
            title: { fr: "Récupération d'instance", en: "Instance recovery" },
            body: {
              fr: "Après un SHUTDOWN ABORT ou une panne, SMON effectue au démarrage suivant un roll forward (rejeu de tout le redo) puis un rollback des transactions non validées. La base s'ouvre dès la fin du roll forward : le rollback se poursuit en arrière-plan.",
              en: "After a SHUTDOWN ABORT or a crash, SMON performs a roll forward (replay of all redo) at the next startup, then rolls back uncommitted transactions. The database opens as soon as the roll forward completes: the rollback continues in the background.",
            },
          },
        ],
      },
      {
        id: "ocp1-1-4",
        number: "1.4",
        title: { fr: "Structures logiques et blocs", en: "Logical structures and blocks" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "La hiérarchie logique va du plus large au plus fin : base → tablespace → segment → extent → bloc Oracle. Un bloc Oracle est l'unité d'E/S minimale ; il regroupe plusieurs blocs du système de fichiers.",
              en: "The logical hierarchy goes from broadest to finest: database → tablespace → segment → extent → Oracle block. An Oracle block is the smallest I/O unit; it spans several file-system blocks.",
            },
          },
          {
            kind: "table",
            title: { fr: "Anatomie d'un bloc", en: "Anatomy of a block" },
            headers: [
              { fr: "Zone", en: "Area" },
              { fr: "Contenu", en: "Contents" },
            ],
            rows: [
              [
                { fr: "En-tête", en: "Header" },
                { fr: "Adresse du bloc (DBA), type de segment", en: "Block address (DBA), segment type" },
              ],
              [
                { fr: "Répertoire de tables et de lignes", en: "Table and row directory" },
                { fr: "Localise chaque ligne dans le bloc", en: "Locates each row within the block" },
              ],
              [
                { fr: "Espace libre", en: "Free space" },
                { fr: "Réservé aux insertions et aux mises à jour", en: "Reserved for inserts and updates" },
              ],
              [
                { fr: "Données de lignes", en: "Row data" },
                { fr: "Les lignes elles-mêmes", en: "The rows themselves" },
              ],
            ],
          },
          {
            kind: "warning",
            title: { fr: "Chaînage et migration de lignes", en: "Row chaining and migration" },
            body: {
              fr: "Une ligne trop grande pour un bloc est chaînée sur plusieurs blocs. Une ligne qui grossit au point de ne plus tenir dans son bloc est migrée ailleurs, l'ancien emplacement conservant un pointeur. Les deux dégradent les lectures : PCTFREE sert précisément à laisser la place aux mises à jour.",
              en: "A row too large for one block is chained across several blocks. A row that grows beyond its block is migrated elsewhere, the old slot keeping a pointer. Both hurt reads: PCTFREE exists precisely to leave room for updates.",
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp1-session-2",
    number: 2,
    title: { fr: "Gestion de l'instance", en: "Managing the instance" },
    summary: {
      fr: "Démarrage et arrêt, fichiers de paramètres, vues du dictionnaire et vues dynamiques, référentiel de diagnostic automatique et fichiers de trace.",
      en: "Startup and shutdown, parameter files, dictionary and dynamic performance views, the Automatic Diagnostic Repository and trace files.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "ocp1-2-1",
        number: "2.1",
        title: { fr: "Démarrage et arrêt", en: "Startup and shutdown" },
        blocks: [
          {
            kind: "code",
            code: `-- Démarrage progressif
STARTUP NOMOUNT;      -- lit le fichier de paramètres, alloue la SGA
ALTER DATABASE MOUNT; -- lit le fichier de contrôle
ALTER DATABASE OPEN;  -- ouvre datafiles et redo logs

STARTUP;              -- les trois étapes d'un coup
STARTUP RESTRICT;     -- réservé aux sessions ayant RESTRICTED SESSION
STARTUP FORCE;        -- SHUTDOWN ABORT puis STARTUP
STARTUP UPGRADE;      -- pour une mise à niveau`,
          },
          {
            kind: "table",
            title: { fr: "Les quatre modes d'arrêt", en: "The four shutdown modes" },
            headers: [
              { fr: "Mode", en: "Mode" },
              { fr: "Nouvelles connexions", en: "New connections" },
              { fr: "Attend les transactions", en: "Waits for transactions" },
              { fr: "Récupération au redémarrage", en: "Recovery on restart" },
            ],
            rows: [
              [
                { fr: "NORMAL", en: "NORMAL" },
                { fr: "Refusées", en: "Refused" },
                { fr: "Attend la déconnexion de tous", en: "Waits for everyone to disconnect" },
                { fr: "Non", en: "No" },
              ],
              [
                { fr: "TRANSACTIONAL", en: "TRANSACTIONAL" },
                { fr: "Refusées", en: "Refused" },
                { fr: "Attend la fin des transactions", en: "Waits for transactions to end" },
                { fr: "Non", en: "No" },
              ],
              [
                { fr: "IMMEDIATE", en: "IMMEDIATE" },
                { fr: "Refusées", en: "Refused" },
                { fr: "Annule les transactions en cours", en: "Rolls back active transactions" },
                { fr: "Non", en: "No" },
              ],
              [
                { fr: "ABORT", en: "ABORT" },
                { fr: "Refusées", en: "Refused" },
                { fr: "Non — arrêt immédiat", en: "No — immediate stop" },
                { fr: "**Oui**", en: "**Yes**" },
              ],
            ],
          },
          {
            kind: "tip",
            body: {
              fr: "NORMAL, TRANSACTIONAL et IMMEDIATE produisent un arrêt propre : les buffers sont écrits et un point de reprise est posé. Seul ABORT laisse la base dans un état nécessitant une récupération d'instance.",
              en: "NORMAL, TRANSACTIONAL and IMMEDIATE produce a clean shutdown: buffers are written and a checkpoint is taken. Only ABORT leaves the database needing instance recovery.",
            },
          },
        ],
      },
      {
        id: "ocp1-2-2",
        number: "2.2",
        title: { fr: "Fichiers de paramètres", en: "Parameter files" },
        blocks: [
          {
            kind: "code",
            code: `-- SPFILE (binaire, modifiable à chaud) vs PFILE (texte)
CREATE SPFILE FROM PFILE;
CREATE PFILE  FROM SPFILE;
CREATE SPFILE FROM MEMORY;

-- Les trois portées
ALTER SYSTEM SET open_cursors = 500 SCOPE=MEMORY;  -- session courante, perdu au redémarrage
ALTER SYSTEM SET open_cursors = 500 SCOPE=SPFILE;  -- persistant, actif au redémarrage
ALTER SYSTEM SET open_cursors = 500 SCOPE=BOTH;    -- les deux (défaut avec un SPFILE)

SHOW PARAMETER open_cursors;
SELECT name, value, isdefault, ismodified FROM v$parameter WHERE name = 'open_cursors';`,
          },
          {
            kind: "warning",
            body: {
              fr: "SCOPE=BOTH est le défaut quand l'instance a démarré avec un SPFILE ; avec un PFILE, seul SCOPE=MEMORY est accepté. Un paramètre statique (PROCESSES, DB_BLOCK_SIZE…) n'accepte que SCOPE=SPFILE et exige un redémarrage.",
              en: "SCOPE=BOTH is the default when the instance started from an SPFILE; with a PFILE, only SCOPE=MEMORY is accepted. A static parameter (PROCESSES, DB_BLOCK_SIZE…) only accepts SCOPE=SPFILE and requires a restart.",
            },
          },
        ],
      },
      {
        id: "ocp1-2-3",
        number: "2.3",
        title: { fr: "Dictionnaire et vues dynamiques", en: "Dictionary and dynamic views" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Famille", en: "Family" },
              { fr: "Nature", en: "Nature" },
              { fr: "Disponible dès", en: "Available from" },
            ],
            rows: [
              [
                { fr: "USER_ / ALL_ / DBA_", en: "USER_ / ALL_ / DBA_" },
                { fr: "Statique — décrit les objets, lue depuis SYSTEM", en: "Static — describes objects, read from SYSTEM" },
                { fr: "État OPEN", en: "OPEN state" },
              ],
              [
                { fr: "V$ (vues dynamiques)", en: "V$ (dynamic performance views)" },
                { fr: "Temps réel — issues de la mémoire et du fichier de contrôle", en: "Real time — from memory and the control file" },
                { fr: "NOMOUNT pour certaines, MOUNT pour d'autres", en: "NOMOUNT for some, MOUNT for others" },
              ],
              [
                { fr: "CDB_", en: "CDB_" },
                { fr: "Agrège les DBA_ de tous les conteneurs", en: "Aggregates DBA_ across all containers" },
                { fr: "OPEN, en multitenant", en: "OPEN, in multitenant" },
              ],
            ],
          },
          {
            kind: "code",
            code: `-- Disponibles dès NOMOUNT (lues en mémoire)
SELECT * FROM v$instance;
SELECT * FROM v$sga;
SELECT * FROM v$parameter;

-- Nécessitent MOUNT (lues dans le fichier de contrôle)
SELECT name, status FROM v$datafile;
SELECT * FROM v$log;

-- Nécessitent OPEN (le dictionnaire vit dans SYSTEM)
SELECT table_name FROM dba_tables;`,
          },
        ],
      },
      {
        id: "ocp1-2-4",
        number: "2.4",
        title: { fr: "Diagnostic : ADR, alert log et traces", en: "Diagnostics: ADR, alert log and traces" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "L'Automatic Diagnostic Repository est une arborescence de fichiers hors base — c'est essentiel : elle reste consultable même instance arrêtée. Elle couvre la base, mais aussi ASM, Oracle Clusterware et Oracle Net.",
              en: "The Automatic Diagnostic Repository is a file tree outside the database — which matters: it stays readable even when the instance is down. It covers the database, but also ASM, Oracle Clusterware and Oracle Net.",
            },
          },
          {
            kind: "code",
            code: `-- Emplacement de la racine ADR
SHOW PARAMETER diagnostic_dest;
SELECT name, value FROM v$diag_info;

-- adrci : l'outil en ligne de commande
adrci> show homes
adrci> show alert -tail -f
adrci> show incident
adrci> ips pack incident 12345 in /tmp   -- paquet de diagnostic pour le support`,
          },
          {
            kind: "warning",
            body: {
              fr: "La racine ADR se détermine dans cet ordre : le paramètre DIAGNOSTIC_DEST s'il est positionné, sinon la variable d'environnement ORACLE_BASE, sinon $ORACLE_HOME/log. L'ADR n'est pas stocké dans un schéma de la base — c'est précisément ce qui la rend consultable après un crash.",
              en: "The ADR base is resolved in this order: the DIAGNOSTIC_DEST parameter if set, otherwise the ORACLE_BASE environment variable, otherwise $ORACLE_HOME/log. The ADR is not stored in a database schema — which is exactly what makes it readable after a crash.",
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp1-session-3",
    number: 3,
    title: { fr: "Utilisateurs, privilèges, rôles et profils", en: "Users, privileges, roles and profiles" },
    summary: {
      fr: "Création et authentification des comptes, principe du moindre privilège, rôles, profils et quotas, analyse de privilèges.",
      en: "Creating and authenticating accounts, least privilege, roles, profiles and quotas, privilege analysis.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "ocp1-3-1",
        number: "3.1",
        title: { fr: "Comptes et authentification", en: "Accounts and authentication" },
        blocks: [
          {
            kind: "figure",
            src: "/art/oracle-security-privileges.svg",
            alt: {
              fr: "Utilisateurs, roles et privileges Oracle, et la facon dont les privileges se propagent",
              en: "Oracle users, roles and privileges, and how privileges propagate",
            },
            caption: {
              fr: "Un privilege systeme autorise une action, un privilege objet un acces. Un role n'est qu'un conteneur : il ne fait rien de plus que ce qu'il contient.",
              en: "A system privilege authorises an action, an object privilege an access. A role is only a container: it does nothing beyond what it holds.",
            },
            width: 900,
            height: 600,
          },
          {
            kind: "code",
            code: `CREATE USER marie IDENTIFIED BY "MotDePasse#2026"
  DEFAULT TABLESPACE users
  TEMPORARY TABLESPACE temp
  QUOTA 500M ON users
  PROFILE app_profile
  PASSWORD EXPIRE
  ACCOUNT UNLOCK;

ALTER USER marie QUOTA UNLIMITED ON users;
ALTER USER marie ACCOUNT LOCK;
ALTER USER marie IDENTIFIED EXTERNALLY;   -- authentification par le système
DROP USER marie CASCADE;                   -- CASCADE : supprime aussi ses objets`,
          },
          {
            kind: "table",
            title: { fr: "Modes d'authentification", en: "Authentication methods" },
            headers: [
              { fr: "Mode", en: "Method" },
              { fr: "Principe", en: "Principle" },
            ],
            rows: [
              [
                { fr: "Par mot de passe", en: "Password" },
                { fr: "Vérifié par la base, soumis au profil", en: "Verified by the database, subject to the profile" },
              ],
              [
                { fr: "Externe (OS)", en: "External (OS)" },
                { fr: "Délégué au système d'exploitation, préfixe OS_AUTHENT_PREFIX", en: "Delegated to the operating system, OS_AUTHENT_PREFIX prefix" },
              ],
              [
                { fr: "Globale", en: "Global" },
                { fr: "Annuaire d'entreprise, LDAP / Oracle Internet Directory", en: "Enterprise directory, LDAP / Oracle Internet Directory" },
              ],
              [
                { fr: "Administrative", en: "Administrative" },
                { fr: "SYSDBA, SYSOPER, SYSBACKUP, SYSDG, SYSKM — par fichier de mots de passe", en: "SYSDBA, SYSOPER, SYSBACKUP, SYSDG, SYSKM — via the password file" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Un compte sans quota sur un tablespace ne peut y créer aucun segment, même avec le privilège CREATE TABLE. À l'inverse, le privilège système UNLIMITED TABLESPACE annule tous les quotas : à éviter, il contredit le moindre privilège.",
              en: "An account with no quota on a tablespace cannot create any segment there, even with CREATE TABLE. Conversely, the UNLIMITED TABLESPACE system privilege overrides every quota: avoid it, it defeats least privilege.",
            },
          },
        ],
      },
      {
        id: "ocp1-3-2",
        number: "3.2",
        title: { fr: "Privilèges et rôles", en: "Privileges and roles" },
        blocks: [
          {
            kind: "code",
            code: `-- Privilèges système : agir sur la base
GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW TO marie;
GRANT CREATE ANY TABLE TO marie WITH ADMIN OPTION;

-- Privilèges objet : agir sur un objet précis
GRANT SELECT, INSERT ON hr.employees TO marie;
GRANT SELECT ON hr.employees TO marie WITH GRANT OPTION;

-- Rôles
CREATE ROLE app_lecteur;
GRANT SELECT ON hr.employees  TO app_lecteur;
GRANT SELECT ON hr.departments TO app_lecteur;
GRANT app_lecteur TO marie;

-- Rôle protégé par mot de passe, désactivé par défaut
CREATE ROLE app_admin IDENTIFIED BY "Secret#2026";
ALTER USER marie DEFAULT ROLE ALL EXCEPT app_admin;
SET ROLE app_admin IDENTIFIED BY "Secret#2026";`,
          },
          {
            kind: "table",
            title: { fr: "Deux différences à connaître", en: "Two differences worth knowing" },
            headers: [
              { fr: "", en: "" },
              { fr: "WITH ADMIN OPTION", en: "WITH ADMIN OPTION" },
              { fr: "WITH GRANT OPTION", en: "WITH GRANT OPTION" },
            ],
            rows: [
              [
                { fr: "S'applique à", en: "Applies to" },
                { fr: "Privilèges système et rôles", en: "System privileges and roles" },
                { fr: "Privilèges objet", en: "Object privileges" },
              ],
              [
                { fr: "Révocation en cascade", en: "Cascading revoke" },
                { fr: "Non — les octrois dérivés survivent", en: "No — derived grants survive" },
                { fr: "Oui — les octrois dérivés tombent", en: "Yes — derived grants are dropped" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Un privilège obtenu par un rôle ne suffit pas pour créer une vue ou une procédure : ces objets exigent un privilège accordé directement. C'est une question classique de l'examen.",
              en: "A privilege obtained through a role is not enough to create a view or a procedure: those objects require a directly granted privilege. This is a classic exam question.",
            },
          },
        ],
      },
      {
        id: "ocp1-3-3",
        number: "3.3",
        title: { fr: "Profils et politiques de mot de passe", en: "Profiles and password policy" },
        blocks: [
          {
            kind: "code",
            code: `CREATE PROFILE app_profile LIMIT
  -- Ressources
  SESSIONS_PER_USER          5
  CPU_PER_SESSION            UNLIMITED
  IDLE_TIME                  30
  CONNECT_TIME               480
  -- Mot de passe
  FAILED_LOGIN_ATTEMPTS      5
  PASSWORD_LOCK_TIME         1
  PASSWORD_LIFE_TIME         90
  PASSWORD_GRACE_TIME        7
  PASSWORD_REUSE_MAX         10
  PASSWORD_REUSE_TIME        365
  PASSWORD_VERIFY_FUNCTION   ora12c_verify_function;

ALTER USER marie PROFILE app_profile;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Les limites de mot de passe s'appliquent toujours. Les limites de ressources n'ont d'effet que si RESOURCE_LIMIT vaut TRUE — c'est le cas par défaut depuis la 12c. Le profil DEFAULT s'applique à tout compte sans profil explicite.",
              en: "Password limits always apply. Resource limits only take effect when RESOURCE_LIMIT is TRUE — the default since 12c. The DEFAULT profile applies to any account without an explicit profile.",
            },
          },
        ],
      },
      {
        id: "ocp1-3-4",
        number: "3.4",
        title: { fr: "Analyse de privilèges", en: "Privilege analysis" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Le paquetage DBMS_PRIVILEGE_CAPTURE enregistre les privilèges réellement exercés sur une période, afin de révoquer ceux qui ne servent jamais. C'est l'outil de mise en œuvre concrète du moindre privilège.",
              en: "The DBMS_PRIVILEGE_CAPTURE package records the privileges actually exercised over a period, so you can revoke the ones never used. It is the concrete tool for applying least privilege.",
            },
          },
          {
            kind: "code",
            code: `BEGIN
  DBMS_PRIVILEGE_CAPTURE.CREATE_CAPTURE(
    name        => 'analyse_app',
    description => 'Privileges reellement utilises par le schema APP',
    type        => DBMS_PRIVILEGE_CAPTURE.G_CONTEXT,
    condition   => 'SYS_CONTEXT(''USERENV'', ''SESSION_USER'') = ''APP''');
END;
/
EXEC DBMS_PRIVILEGE_CAPTURE.ENABLE_CAPTURE('analyse_app');
-- … laisser tourner la charge applicative …
EXEC DBMS_PRIVILEGE_CAPTURE.DISABLE_CAPTURE('analyse_app');
EXEC DBMS_PRIVILEGE_CAPTURE.GENERATE_RESULT('analyse_app');

SELECT * FROM dba_used_privs   WHERE capture = 'analyse_app';
SELECT * FROM dba_unused_privs WHERE capture = 'analyse_app';`,
          },
          {
            kind: "table",
            title: { fr: "Les quatre types de capture", en: "The four capture types" },
            headers: [
              { fr: "Type", en: "Type" },
              { fr: "Portée", en: "Scope" },
            ],
            rows: [
              [
                { fr: "G_DATABASE", en: "G_DATABASE" },
                { fr: "Toute la base, utilisateurs administratifs compris", en: "The whole database, including administrative users" },
              ],
              [
                { fr: "G_ROLE", en: "G_ROLE" },
                { fr: "Les privilèges obtenus via un ou plusieurs rôles donnés", en: "Privileges obtained through one or more given roles" },
              ],
              [
                { fr: "G_CONTEXT", en: "G_CONTEXT" },
                { fr: "Restreinte par une condition sur le contexte de session", en: "Restricted by a condition on the session context" },
              ],
              [
                { fr: "G_ROLE_AND_CONTEXT", en: "G_ROLE_AND_CONTEXT" },
                { fr: "Combinaison des deux précédentes", en: "Combination of the two above" },
              ],
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp1-session-4",
    number: 4,
    title: { fr: "Stockage : tablespaces, segments et undo", en: "Storage: tablespaces, segments and undo" },
    summary: {
      fr: "Tablespaces et fichiers de données, gestion de l'espace, compression, segments, et le tablespace UNDO qui sous-tend la cohérence en lecture.",
      en: "Tablespaces and data files, space management, compression, segments, and the UNDO tablespace behind read consistency.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "ocp1-4-1",
        number: "4.1",
        title: { fr: "Tablespaces et fichiers de données", en: "Tablespaces and data files" },
        blocks: [
          {
            kind: "code",
            code: `CREATE TABLESPACE ventes
  DATAFILE '/u01/oradata/ORCL/ventes01.dbf' SIZE 500M
  AUTOEXTEND ON NEXT 100M MAXSIZE 4G
  EXTENT MANAGEMENT LOCAL AUTOALLOCATE
  SEGMENT SPACE MANAGEMENT AUTO;

-- Agrandir
ALTER TABLESPACE ventes ADD DATAFILE '/u01/oradata/ORCL/ventes02.dbf' SIZE 500M;
ALTER DATABASE DATAFILE '/u01/oradata/ORCL/ventes01.dbf' RESIZE 1G;

-- États
ALTER TABLESPACE ventes READ ONLY;
ALTER TABLESPACE ventes OFFLINE NORMAL;
DROP  TABLESPACE ventes INCLUDING CONTENTS AND DATAFILES;`,
          },
          {
            kind: "table",
            title: { fr: "Tablespaces à connaître", en: "Tablespaces to know" },
            headers: [
              { fr: "Tablespace", en: "Tablespace" },
              { fr: "Rôle", en: "Purpose" },
            ],
            rows: [
              [
                { fr: "SYSTEM", en: "SYSTEM" },
                { fr: "Dictionnaire de données — jamais hors ligne", en: "Data dictionary — never taken offline" },
              ],
              [
                { fr: "SYSAUX", en: "SYSAUX" },
                { fr: "Composants auxiliaires : AWR, Text, Spatial", en: "Auxiliary components: AWR, Text, Spatial" },
              ],
              [
                { fr: "UNDO", en: "UNDO" },
                { fr: "Images avant modification, cohérence en lecture, ROLLBACK", en: "Before-images, read consistency, ROLLBACK" },
              ],
              [
                { fr: "TEMP", en: "TEMP" },
                { fr: "Tris, jointures par hachage, tables temporaires globales", en: "Sorts, hash joins, global temporary tables" },
              ],
            ],
          },
        ],
      },
      {
        id: "ocp1-4-2",
        number: "4.2",
        title: { fr: "Gestion de l'espace et compression", en: "Space management and compression" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Fonctions d'économie d'espace", en: "Space-saving features" },
            code: `-- Création différée de segment : aucun extent tant que la table est vide
CREATE TABLE archives (id NUMBER) SEGMENT CREATION DEFERRED;

-- Compression de base : chargements en masse uniquement
CREATE TABLE faits (…) COMPRESS BASIC;

-- Compression avancée : maintenue par les DML
CREATE TABLE faits (…) ROW STORE COMPRESS ADVANCED;

-- Réduction d'un segment fragmenté (nécessite le row movement)
ALTER TABLE commandes ENABLE ROW MOVEMENT;
ALTER TABLE commandes SHRINK SPACE COMPACT;   -- compacte sans déplacer la HWM
ALTER TABLE commandes SHRINK SPACE CASCADE;   -- compacte, abaisse la HWM, propage aux index

-- Allocation d'espace reprenable : suspend au lieu d'échouer
ALTER SESSION ENABLE RESUMABLE TIMEOUT 3600 NAME 'chargement nocturne';`,
          },
          {
            kind: "tip",
            body: {
              fr: "L'allocation reprenable transforme une erreur d'espace en suspension : la session attend que l'administrateur agrandisse le tablespace, puis reprend là où elle en était. Indispensable pour les chargements longs. La vue DBA_RESUMABLE liste les sessions suspendues.",
              en: "Resumable space allocation turns an out-of-space error into a suspension: the session waits for the administrator to extend the tablespace, then resumes where it stopped. Essential for long loads. The DBA_RESUMABLE view lists suspended sessions.",
            },
          },
        ],
      },
      {
        id: "ocp1-4-3",
        number: "4.3",
        title: { fr: "UNDO et cohérence en lecture", en: "UNDO and read consistency" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "L'undo stocke l'image d'une donnée avant modification. Il sert à trois choses : annuler une transaction (ROLLBACK), garantir qu'une requête voit la base telle qu'elle était à son démarrage (cohérence en lecture), et alimenter les technologies Flashback.",
              en: "Undo stores the before-image of modified data. It serves three purposes: rolling back a transaction, guaranteeing that a query sees the database as it was when it started (read consistency), and feeding the Flashback technologies.",
            },
          },
          {
            kind: "code",
            code: `SHOW PARAMETER undo_tablespace;
SHOW PARAMETER undo_retention;     -- en secondes

ALTER SYSTEM SET undo_retention = 3600 SCOPE=BOTH;
ALTER TABLESPACE undotbs1 RETENTION GUARANTEE;   -- l'undo prime sur les nouvelles transactions

SELECT tablespace_name, status, SUM(bytes)/1024/1024 AS mo
FROM   dba_undo_extents GROUP BY tablespace_name, status;`,
          },
          {
            kind: "warning",
            title: { fr: "ORA-01555 — snapshot too old", en: "ORA-01555 — snapshot too old" },
            body: {
              fr: "Une requête longue échoue quand l'undo dont elle a besoin a été écrasé par des transactions plus récentes. Trois leviers : augmenter UNDO_RETENTION, agrandir le tablespace undo, ou activer RETENTION GUARANTEE — cette dernière option faisant échouer les nouvelles transactions plutôt que d'écraser l'undo.",
              en: "A long-running query fails when the undo it needs has been overwritten by newer transactions. Three levers: raise UNDO_RETENTION, enlarge the undo tablespace, or enable RETENTION GUARANTEE — the last option failing new transactions rather than overwriting undo.",
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp1-session-5",
    number: 5,
    title: { fr: "Oracle Net Services", en: "Oracle Net Services" },
    summary: {
      fr: "Écouteur, méthodes de résolution de noms, serveur dédié et serveur partagé, diagnostic des connexions.",
      en: "The listener, name resolution methods, dedicated and shared server, connection troubleshooting.",
    },
    estimatedMinutes: 90,
    topics: [
      {
        id: "ocp1-5-1",
        number: "5.1",
        title: { fr: "L'écouteur", en: "The listener" },
        blocks: [
          {
            kind: "code",
            code: `lsnrctl start | stop | status | reload
lsnrctl services

-- Enregistrement dynamique auprès de l'écouteur
ALTER SYSTEM REGISTER;
SHOW PARAMETER local_listener;
SHOW PARAMETER service_names;`,
          },
          {
            kind: "tip",
            body: {
              fr: "L'enregistrement dynamique par PMON est le mode normal : l'instance déclare ses services à l'écouteur, sans SID_LIST dans listener.ora. Un enregistrement statique reste nécessaire pour se connecter à une instance arrêtée — typiquement pour un STARTUP à distance ou une duplication RMAN.",
              en: "Dynamic registration by PMON is the normal mode: the instance advertises its services to the listener, with no SID_LIST in listener.ora. Static registration is still needed to connect to a stopped instance — typically for a remote STARTUP or an RMAN duplicate.",
            },
          },
        ],
      },
      {
        id: "ocp1-5-2",
        number: "5.2",
        title: { fr: "Résolution de noms et modes serveur", en: "Name resolution and server modes" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Méthode", en: "Method" },
              { fr: "Principe", en: "Principle" },
            ],
            rows: [
              [
                { fr: "Easy Connect", en: "Easy Connect" },
                { fr: "hote:port/service — aucun fichier de configuration", en: "host:port/service — no configuration file" },
              ],
              [
                { fr: "Local naming", en: "Local naming" },
                { fr: "tnsnames.ora sur chaque poste client", en: "tnsnames.ora on each client" },
              ],
              [
                { fr: "Directory naming", en: "Directory naming" },
                { fr: "Annuaire LDAP centralisé", en: "Centralised LDAP directory" },
              ],
              [
                { fr: "External naming", en: "External naming" },
                { fr: "Service de noms tiers (NIS)", en: "Third-party naming service (NIS)" },
              ],
            ],
          },
          {
            kind: "compare",
            title: { fr: "Serveur dédié ou serveur partagé", en: "Dedicated or shared server" },
            wrong: `-- Serveur DÉDIÉ : un processus serveur par session.
-- Simple et prévisible, mais coûteux à forte concurrence.
-- La PGA est privée au processus.`,
            right: `-- Serveur PARTAGÉ : les sessions se partagent un pool de
-- processus via des dispatchers. La UGA migre dans la SGA
-- (Large Pool). Obligatoire pour certaines tâches : RMAN et
-- les travaux d'administration exigent un serveur dédié.`,
            note: {
              fr: "En serveur partagé, la zone globale utilisateur (UGA) quitte la PGA pour la SGA — d'où l'importance de dimensionner le Large Pool.",
              en: "In shared server mode, the User Global Area (UGA) moves from the PGA into the SGA — hence the importance of sizing the Large Pool.",
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp1-session-6",
    number: 6,
    title: { fr: "Déplacement de données", en: "Moving data" },
    summary: {
      fr: "Data Pump, SQL*Loader et tables externes : les trois voies d'entrée et de sortie des données.",
      en: "Data Pump, SQL*Loader and external tables: the three ways data comes in and goes out.",
    },
    estimatedMinutes: 120,
    topics: [
      {
        id: "ocp1-6-1",
        number: "6.1",
        title: { fr: "Data Pump", en: "Data Pump" },
        blocks: [
          {
            kind: "code",
            code: `-- Prérequis : un objet DIRECTORY et les privilèges dessus
CREATE DIRECTORY dp_dir AS '/u01/dumps';
GRANT READ, WRITE ON DIRECTORY dp_dir TO hr;

-- Export
expdp hr/mdp DIRECTORY=dp_dir DUMPFILE=hr.dmp LOGFILE=hr.log SCHEMAS=hr
expdp \\"/ as sysdba\\" DIRECTORY=dp_dir DUMPFILE=full%U.dmp FULL=Y PARALLEL=4

-- Import avec remappage
impdp hr/mdp DIRECTORY=dp_dir DUMPFILE=hr.dmp \\
  REMAP_SCHEMA=hr:hr_test REMAP_TABLESPACE=users:test_data

-- Import direct par lien de base, sans fichier intermédiaire
impdp hr/mdp NETWORK_LINK=prod_link SCHEMAS=hr

-- Estimer sans exporter
expdp hr/mdp DIRECTORY=dp_dir ESTIMATE_ONLY=Y SCHEMAS=hr`,
          },
          {
            kind: "tip",
            body: {
              fr: "Data Pump s'exécute côté serveur : les fichiers sont écrits dans le répertoire du serveur, pas du client. Les travaux sont reprenables — ATTACH permet de se rattacher à un travail en cours pour l'interroger, l'accélérer (PARALLEL) ou l'arrêter.",
              en: "Data Pump runs server-side: files are written to the server's directory, not the client's. Jobs are restartable — ATTACH lets you reconnect to a running job to query it, speed it up (PARALLEL) or stop it.",
            },
          },
        ],
      },
      {
        id: "ocp1-6-2",
        number: "6.2",
        title: { fr: "SQL*Loader et tables externes", en: "SQL*Loader and external tables" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Table externe : lire un fichier plat comme une table", en: "External table: read a flat file as a table" },
            code: `CREATE TABLE employes_ext (
  employe_id NUMBER,
  nom        VARCHAR2(50),
  salaire    NUMBER
)
ORGANIZATION EXTERNAL (
  TYPE ORACLE_LOADER
  DEFAULT DIRECTORY dp_dir
  ACCESS PARAMETERS (
    RECORDS DELIMITED BY NEWLINE
    BADFILE  dp_dir:'employes.bad'
    LOGFILE  dp_dir:'employes.log'
    FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
    MISSING FIELD VALUES ARE NULL
  )
  LOCATION ('employes.csv')
)
REJECT LIMIT UNLIMITED;

SELECT * FROM employes_ext;   -- lecture seule, relue à chaque requête`,
          },
          {
            kind: "table",
            title: { fr: "Choisir son outil", en: "Choosing the right tool" },
            headers: [
              { fr: "Besoin", en: "Need" },
              { fr: "Outil", en: "Tool" },
            ],
            rows: [
              [
                { fr: "Déplacer des objets entre bases Oracle", en: "Move objects between Oracle databases" },
                { fr: "Data Pump", en: "Data Pump" },
              ],
              [
                { fr: "Charger un fichier plat en masse", en: "Bulk-load a flat file" },
                { fr: "SQL*Loader (mode direct path)", en: "SQL*Loader (direct path)" },
              ],
              [
                { fr: "Interroger un fichier sans le charger", en: "Query a file without loading it" },
                { fr: "Table externe", en: "External table" },
              ],
              [
                { fr: "Transférer sans fichier intermédiaire", en: "Transfer with no intermediate file" },
                { fr: "Data Pump NETWORK_LINK", en: "Data Pump NETWORK_LINK" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Une table externe est en lecture seule : aucun INSERT, UPDATE ni DELETE, et aucun index possible. Le fichier est relu à chaque requête. Les deux prérequis sont l'objet DIRECTORY et le privilège READ dessus.",
              en: "An external table is read-only: no INSERT, UPDATE or DELETE, and no index. The file is re-read on every query. The two prerequisites are the DIRECTORY object and the READ privilege on it.",
            },
          },
        ],
      },
    ],
  },
];
