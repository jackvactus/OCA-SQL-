import type { CourseSession } from "./course-oca-sql";

/**
 * Cursus Oracle Database Administration II — examen 1Z0-083.
 *
 * L'ordre reprend celui des trois cours officiels Oracle University dont
 * l'examen est composé :
 *   1. Oracle Database: Managing Multitenant Architecture  → sessions 1 à 3
 *   2. Oracle Database: Backup and Recovery Workshop       → sessions 4 à 7
 *   3. Oracle Database: Deploy, Patch and Upgrade Workshop → session 8
 *   + surveillance et optimisation                         → session 9
 *
 * Les points de vigilance proviennent des corrigés de `docs/OCA/`
 * (OCP3.docx + Vendor.docx, 85 questions appariées à 100 %).
 */
export const ocp2Sessions: CourseSession[] = [
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp2-session-1",
    number: 1,
    title: { fr: "Architecture multitenant", en: "Multitenant architecture" },
    summary: {
      fr: "CDB, PDB, conteneur racine et semence. Comprendre ce qui est partagé et ce qui est local conditionne tout le reste de l'examen.",
      en: "CDB, PDB, root container and seed. Understanding what is shared and what is local drives everything else on the exam.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "ocp2-1-1",
        number: "1.1",
        title: { fr: "CDB, PDB et conteneurs", en: "CDB, PDB and containers" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Une base conteneur (CDB) héberge plusieurs bases enfichables (PDB). La CDB fournit une instance, des redo logs, un fichier de contrôle et un tablespace UNDO uniques ; chaque PDB apporte son propre dictionnaire, ses tablespaces et ses utilisateurs locaux. C'est ce partage qui réduit les coûts de consolidation.",
              en: "A container database (CDB) hosts several pluggable databases (PDBs). The CDB provides a single instance, redo logs, control file and UNDO tablespace; each PDB brings its own dictionary, tablespaces and local users. That sharing is what makes consolidation cheaper.",
            },
          },
          {
            kind: "table",
            title: { fr: "Les conteneurs d'une CDB", en: "The containers in a CDB" },
            headers: [
              { fr: "Conteneur", en: "Container" },
              { fr: "CON_ID", en: "CON_ID" },
              { fr: "Rôle", en: "Purpose" },
            ],
            rows: [
              [
                { fr: "CDB$ROOT", en: "CDB$ROOT" },
                { fr: "1", en: "1" },
                { fr: "Racine — métadonnées communes, utilisateurs communs", en: "Root — common metadata, common users" },
              ],
              [
                { fr: "PDB$SEED", en: "PDB$SEED" },
                { fr: "2", en: "2" },
                { fr: "Modèle en lecture seule, sert à créer les nouvelles PDB", en: "Read-only template used to create new PDBs" },
              ],
              [
                { fr: "PDB utilisateur", en: "User PDB" },
                { fr: "3 et au-delà", en: "3 and above" },
                { fr: "Les bases applicatives proprement dites", en: "The actual application databases" },
              ],
              [
                { fr: "Application root", en: "Application root" },
                { fr: "variable", en: "varies" },
                { fr: "Racine d'un conteneur applicatif, partage un schéma commun", en: "Root of an application container, sharing a common schema" },
              ],
            ],
          },
          {
            kind: "code",
            code: `-- Où suis-je ?
SHOW CON_NAME
SELECT SYS_CONTEXT('USERENV','CON_NAME') FROM DUAL;

-- Naviguer entre conteneurs
ALTER SESSION SET CONTAINER = pdb_ventes;
ALTER SESSION SET CONTAINER = CDB$ROOT;

-- Inventaire
SELECT con_id, name, open_mode, restricted FROM v$pdbs;
SELECT pdb_name, status FROM cdb_pdbs;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Les vues CDB_ agrègent les vues DBA_ de tous les conteneurs et portent une colonne CON_ID. Depuis une PDB, une vue CDB_ ne montre que le conteneur courant : seule la racine offre la vue d'ensemble.",
              en: "CDB_ views aggregate the DBA_ views of every container and carry a CON_ID column. From inside a PDB, a CDB_ view only shows the current container: only the root gives the full picture.",
            },
          },
        ],
      },
      {
        id: "ocp2-1-2",
        number: "1.2",
        title: { fr: "Ce qui est partagé, ce qui est local", en: "What is shared, what is local" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Élément", en: "Element" },
              { fr: "Portée", en: "Scope" },
            ],
            rows: [
              [
                { fr: "Instance, SGA, processus d'arrière-plan", en: "Instance, SGA, background processes" },
                { fr: "CDB — partagés", en: "CDB — shared" },
              ],
              [
                { fr: "Redo logs et fichier de contrôle", en: "Redo logs and control file" },
                { fr: "CDB — partagés", en: "CDB — shared" },
              ],
              [
                { fr: "Tablespace UNDO", en: "UNDO tablespace" },
                { fr: "CDB, sauf en mode local undo (recommandé)", en: "CDB, unless local undo mode (recommended)" },
              ],
              [
                { fr: "Tablespace TEMP", en: "TEMP tablespace" },
                { fr: "CDB par défaut, mais chaque PDB peut avoir le sien", en: "CDB by default, but each PDB can have its own" },
              ],
              [
                { fr: "Dictionnaire de données, SYSTEM, SYSAUX", en: "Data dictionary, SYSTEM, SYSAUX" },
                { fr: "PDB — locaux", en: "PDB — local" },
              ],
              [
                { fr: "Utilisateurs, rôles et objets applicatifs", en: "Users, roles and application objects" },
                { fr: "PDB — locaux (sauf objets communs)", en: "PDB — local (unless common objects)" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Le mode local undo (LOCAL_UNDO_ENABLED) donne à chaque PDB son propre tablespace undo. C'est un prérequis pour cloner une PDB à chaud, pour Flashback PDB et pour débrancher une PDB sans immobiliser la CDB. Il s'active depuis la racine, en mode UPGRADE.",
              en: "Local undo mode (LOCAL_UNDO_ENABLED) gives each PDB its own undo tablespace. It is a prerequisite for hot cloning a PDB, for Flashback PDB and for unplugging a PDB without freezing the CDB. It is enabled from the root, in UPGRADE mode.",
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp2-session-2",
    number: 2,
    title: { fr: "Créer et gérer les CDB et les PDB", en: "Creating and managing CDBs and PDBs" },
    summary: {
      fr: "Création, clonage, branchement et débranchement, états d'ouverture, conteneurs applicatifs.",
      en: "Creation, cloning, plugging and unplugging, open modes, application containers.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "ocp2-2-1",
        number: "2.1",
        title: { fr: "Créer une PDB", en: "Creating a PDB" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Depuis la semence", en: "From the seed" },
            code: `CREATE PLUGGABLE DATABASE pdb_ventes
  ADMIN USER pdbadmin IDENTIFIED BY "MotDePasse#2026"
  FILE_NAME_CONVERT = ('/u01/oradata/ORCL/pdbseed/', '/u01/oradata/ORCL/pdb_ventes/')
  STORAGE (MAXSIZE 20G)
  DEFAULT TABLESPACE ventes
    DATAFILE '/u01/oradata/ORCL/pdb_ventes/ventes01.dbf' SIZE 500M AUTOEXTEND ON;

ALTER PLUGGABLE DATABASE pdb_ventes OPEN;`,
          },
          {
            kind: "code",
            title: { fr: "Par clonage", en: "By cloning" },
            code: `-- Clone local (à chaud si le mode local undo est actif)
CREATE PLUGGABLE DATABASE pdb_test FROM pdb_ventes
  FILE_NAME_CONVERT = ('/pdb_ventes/', '/pdb_test/');

-- Clone distant, via un lien de base
CREATE PLUGGABLE DATABASE pdb_test FROM pdb_prod@prod_link;

-- Clone rafraîchissable : synchronisé périodiquement depuis la source
CREATE PLUGGABLE DATABASE pdb_report FROM pdb_prod@prod_link
  REFRESH MODE EVERY 60 MINUTES;`,
          },
          {
            kind: "tip",
            title: { fr: "La clause USER_TABLESPACES", en: "The USER_TABLESPACES clause" },
            body: {
              fr: "Lors d'une conversion non-CDB → PDB ou d'un clonage, USER_TABLESPACES permet de choisir les tablespaces embarqués : inclure une liste précise, ou tout prendre sauf certains (USER_TABLESPACES = ALL EXCEPT ('hr_data')). Les tablespaces exclus sont créés hors ligne, vides.",
              en: "During a non-CDB → PDB conversion or a clone, USER_TABLESPACES chooses which tablespaces come along: include a specific list, or take everything except some (USER_TABLESPACES = ALL EXCEPT ('hr_data')). Excluded tablespaces are created offline and empty.",
            },
          },
        ],
      },
      {
        id: "ocp2-2-2",
        number: "2.2",
        title: { fr: "Débrancher, brancher, migrer", en: "Unplug, plug, migrate" },
        blocks: [
          {
            kind: "code",
            code: `-- Débrancher : produit un manifeste XML (ou une archive .pdb)
ALTER PLUGGABLE DATABASE pdb_ventes CLOSE IMMEDIATE;
ALTER PLUGGABLE DATABASE pdb_ventes UNPLUG INTO '/u01/manifests/pdb_ventes.xml';
DROP PLUGGABLE DATABASE pdb_ventes KEEP DATAFILES;

-- Vérifier la compatibilité AVANT de brancher
SET SERVEROUTPUT ON
DECLARE ok BOOLEAN;
BEGIN
  ok := DBMS_PDB.CHECK_PLUG_COMPATIBILITY('/u01/manifests/pdb_ventes.xml', 'pdb_ventes');
  DBMS_OUTPUT.PUT_LINE(CASE WHEN ok THEN 'Compatible' ELSE 'Incompatible' END);
END;
/
SELECT * FROM pdb_plug_in_violations WHERE name = 'PDB_VENTES';

-- Brancher
CREATE PLUGGABLE DATABASE pdb_ventes USING '/u01/manifests/pdb_ventes.xml'
  COPY FILE_NAME_CONVERT = ('/ancien/', '/nouveau/');`,
          },
          {
            kind: "table",
            title: { fr: "Les trois clauses de fichiers", en: "The three file clauses" },
            headers: [
              { fr: "Clause", en: "Clause" },
              { fr: "Effet", en: "Effect" },
            ],
            rows: [
              [
                { fr: "COPY", en: "COPY" },
                { fr: "Copie les fichiers — la source reste intacte (défaut)", en: "Copies the files — the source stays intact (default)" },

              ],
              [
                { fr: "MOVE", en: "MOVE" },
                { fr: "Déplace les fichiers vers le nouvel emplacement", en: "Moves the files to the new location" },
              ],
              [
                { fr: "NOCOPY", en: "NOCOPY" },
                { fr: "Réutilise les fichiers en place — les plus rapides, mais destructif en cas d'erreur", en: "Reuses the files in place — fastest, but destructive if wrong" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Après un branchement, interrogez toujours PDB_PLUG_IN_VIOLATIONS. Une violation de type ERROR empêche l'ouverture normale ; la PDB s'ouvre alors en mode RESTRICTED, le temps de corriger l'écart de version, de jeu de caractères ou d'options.",
              en: "After plugging in, always query PDB_PLUG_IN_VIOLATIONS. An ERROR-level violation prevents a normal open; the PDB then opens in RESTRICTED mode until the version, character set or option mismatch is fixed.",
            },
          },
        ],
      },
      {
        id: "ocp2-2-3",
        number: "2.3",
        title: { fr: "États d'ouverture et démarrage", en: "Open modes and startup" },
        blocks: [
          {
            kind: "code",
            code: `ALTER PLUGGABLE DATABASE pdb_ventes OPEN READ WRITE;
ALTER PLUGGABLE DATABASE pdb_ventes OPEN READ ONLY;
ALTER PLUGGABLE DATABASE pdb_ventes OPEN RESTRICTED;
ALTER PLUGGABLE DATABASE ALL OPEN;
ALTER PLUGGABLE DATABASE ALL EXCEPT pdb_test OPEN;

-- Mémoriser l'état pour les redémarrages de la CDB
ALTER PLUGGABLE DATABASE pdb_ventes SAVE STATE;
SELECT con_name, state FROM dba_pdb_saved_states;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Sans SAVE STATE, un STARTUP de la CDB laisse toutes les PDB en MOUNTED : il faut les ouvrir à la main ou par un trigger de démarrage. SAVE STATE mémorise l'état voulu et le restaure automatiquement.",
              en: "Without SAVE STATE, a CDB STARTUP leaves every PDB in MOUNTED: you must open them manually or via a startup trigger. SAVE STATE records the intended state and restores it automatically.",
            },
          },
        ],
      },
      {
        id: "ocp2-2-4",
        number: "2.4",
        title: { fr: "Conteneurs applicatifs", en: "Application containers" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Un conteneur applicatif regroupe une racine applicative et des PDB applicatives partageant un même schéma de données. Il sert au SaaS : une seule définition de modèle, des données propres à chaque client.",
              en: "An application container groups an application root and application PDBs sharing one data schema. It targets SaaS: a single model definition, per-tenant data.",
            },
          },
          {
            kind: "code",
            code: `CREATE PLUGGABLE DATABASE app_root AS APPLICATION CONTAINER
  ADMIN USER appadm IDENTIFIED BY "MotDePasse#2026";
ALTER PLUGGABLE DATABASE app_root OPEN;

ALTER SESSION SET CONTAINER = app_root;
ALTER PLUGGABLE DATABASE APPLICATION facturation BEGIN INSTALL '1.0';
  CREATE TABLE factures (id NUMBER PRIMARY KEY, montant NUMBER) SHARING = METADATA;
  CREATE TABLE devises  (code CHAR(3) PRIMARY KEY, libelle VARCHAR2(50)) SHARING = DATA;
ALTER PLUGGABLE DATABASE APPLICATION facturation END INSTALL '1.0';

-- Propager la version aux PDB applicatives
ALTER SESSION SET CONTAINER = app_pdb_client1;
ALTER PLUGGABLE DATABASE APPLICATION facturation SYNC;`,
          },
          {
            kind: "table",
            title: { fr: "Les modes de partage", en: "Sharing modes" },
            headers: [
              { fr: "SHARING", en: "SHARING" },
              { fr: "Ce qui est partagé", en: "What is shared" },
            ],
            rows: [
              [
                { fr: "METADATA", en: "METADATA" },
                { fr: "La structure seule — chaque PDB a ses propres lignes", en: "The structure only — each PDB has its own rows" },
              ],
              [
                { fr: "DATA", en: "DATA" },
                { fr: "Structure et données, en lecture seule depuis les PDB", en: "Structure and data, read-only from the PDBs" },
              ],
              [
                { fr: "EXTENDED DATA", en: "EXTENDED DATA" },
                { fr: "Données communes, que chaque PDB peut compléter localement", en: "Common data each PDB may extend locally" },
              ],
              [
                { fr: "NONE", en: "NONE" },
                { fr: "Objet strictement local à la racine applicative", en: "Object strictly local to the application root" },
              ],
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp2-session-3",
    number: 3,
    title: { fr: "Sécurité en multitenant", en: "Security in multitenant" },
    summary: {
      fr: "Utilisateurs et rôles communs ou locaux, portée des privilèges, CONTAINER_DATA et chiffrement.",
      en: "Common and local users and roles, privilege scope, CONTAINER_DATA and encryption.",
    },
    estimatedMinutes: 90,
    topics: [
      {
        id: "ocp2-3-1",
        number: "3.1",
        title: { fr: "Utilisateurs communs et locaux", en: "Common and local users" },
        blocks: [
          {
            kind: "code",
            code: `-- Utilisateur COMMUN : créé depuis la racine, existe dans tous les conteneurs
ALTER SESSION SET CONTAINER = CDB$ROOT;
CREATE USER c##admin IDENTIFIED BY "MotDePasse#2026" CONTAINER = ALL;
GRANT CREATE SESSION TO c##admin CONTAINER = ALL;

-- Utilisateur LOCAL : n'existe que dans sa PDB
ALTER SESSION SET CONTAINER = pdb_ventes;
CREATE USER app_user IDENTIFIED BY "MotDePasse#2026" CONTAINER = CURRENT;`,
          },
          {
            kind: "table",
            headers: [
              { fr: "", en: "" },
              { fr: "Commun", en: "Common" },
              { fr: "Local", en: "Local" },
            ],
            rows: [
              [
                { fr: "Créé depuis", en: "Created from" },
                { fr: "CDB$ROOT uniquement", en: "CDB$ROOT only" },
                { fr: "Une PDB", en: "A PDB" },
              ],
              [
                { fr: "Nom", en: "Name" },
                { fr: "Préfixe C## ou U## (sauf comptes fournis par Oracle)", en: "C## or U## prefix (except Oracle-supplied accounts)" },
                { fr: "Libre", en: "Free" },
              ],
              [
                { fr: "Visible depuis", en: "Visible from" },
                { fr: "Tous les conteneurs", en: "Every container" },
                { fr: "Sa PDB seulement", en: "Its own PDB only" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "CONTAINER = ALL n'accorde pas un privilège « partout pour toujours » : une PDB branchée après coup ne reçoit pas rétroactivement les octrois communs antérieurs. Il faut les rejouer. Par ailleurs, un privilège accordé avec CONTAINER = CURRENT depuis la racine ne vaut que dans la racine.",
              en: "CONTAINER = ALL does not grant a privilege “everywhere forever”: a PDB plugged in later does not retroactively receive earlier common grants. They must be replayed. Also, a privilege granted with CONTAINER = CURRENT from the root only applies in the root.",
            },
          },
        ],
      },
      {
        id: "ocp2-3-2",
        number: "3.2",
        title: { fr: "CONTAINER_DATA et chiffrement", en: "CONTAINER_DATA and encryption" },
        blocks: [
          {
            kind: "code",
            code: `-- Restreindre ce qu'un utilisateur commun voit dans les vues CDB_ / V$
ALTER USER c##audit SET CONTAINER_DATA = (CDB$ROOT, pdb_ventes)
  FOR dba_users CONTAINER = CURRENT;

-- Chiffrement transparent : un portefeuille par PDB depuis la 12.2
ADMINISTER KEY MANAGEMENT SET KEYSTORE OPEN
  IDENTIFIED BY "MotDePasse#2026" CONTAINER = ALL;
ADMINISTER KEY MANAGEMENT SET KEY
  IDENTIFIED BY "MotDePasse#2026" WITH BACKUP CONTAINER = CURRENT;

CREATE TABLESPACE ventes_chiffre
  DATAFILE '/u01/oradata/ventes_enc01.dbf' SIZE 500M
  ENCRYPTION USING 'AES256' DEFAULT STORAGE (ENCRYPT);`,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp2-session-4",
    number: 4,
    title: { fr: "Stratégies de sauvegarde et RMAN", en: "Backup strategies and RMAN" },
    summary: {
      fr: "Vocabulaire de la sauvegarde, configuration persistante de RMAN, jeux de sauvegarde et copies d'image, sauvegardes incrémentales.",
      en: "Backup terminology, persistent RMAN configuration, backup sets and image copies, incremental backups.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "ocp2-4-1",
        number: "4.1",
        title: { fr: "Vocabulaire et prérequis", en: "Terminology and prerequisites" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Terme", en: "Term" },
              { fr: "Définition", en: "Definition" },
            ],
            rows: [
              [
                { fr: "RTO", en: "RTO" },
                { fr: "Durée maximale d'indisponibilité acceptée", en: "Maximum acceptable downtime" },
              ],
              [
                { fr: "RPO", en: "RPO" },
                { fr: "Volume de données que l'on accepte de perdre", en: "Amount of data you accept to lose" },
              ],
              [
                { fr: "Sauvegarde cohérente", en: "Consistent backup" },
                { fr: "Base arrêtée proprement — restaurable sans récupération", en: "Cleanly shut down — restorable without recovery" },
              ],
              [
                { fr: "Sauvegarde incohérente", en: "Inconsistent backup" },
                { fr: "Base ouverte — exige ARCHIVELOG et une récupération", en: "Open database — requires ARCHIVELOG and recovery" },
              ],
              [
                { fr: "Jeu de sauvegarde", en: "Backup set" },
                { fr: "Format propriétaire RMAN, compressible, saute les blocs vides", en: "RMAN proprietary format, compressible, skips empty blocks" },
              ],
              [
                { fr: "Copie d'image", en: "Image copy" },
                { fr: "Copie bloc à bloc, utilisable telle quelle par SWITCH", en: "Block-for-block copy, usable as-is via SWITCH" },
              ],
            ],
          },
          {
            kind: "code",
            title: { fr: "Passer en ARCHIVELOG", en: "Switching to ARCHIVELOG" },
            code: `SHUTDOWN IMMEDIATE;
STARTUP MOUNT;
ALTER DATABASE ARCHIVELOG;
ALTER DATABASE OPEN;

ARCHIVE LOG LIST;
ALTER SYSTEM SET db_recovery_file_dest_size = 50G SCOPE=BOTH;
ALTER SYSTEM SET db_recovery_file_dest = '/u02/fra' SCOPE=BOTH;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Le mode ARCHIVELOG est la condition de toute sauvegarde à chaud et de toute récupération à un point dans le temps. En NOARCHIVELOG, seule une sauvegarde base fermée est possible, et l'on perd toutes les transactions depuis cette sauvegarde.",
              en: "ARCHIVELOG mode is the precondition for any hot backup and any point-in-time recovery. In NOARCHIVELOG, only a cold backup is possible, and every transaction since that backup is lost.",
            },
          },
        ],
      },
      {
        id: "ocp2-4-2",
        number: "4.2",
        title: { fr: "Configurer RMAN", en: "Configuring RMAN" },
        blocks: [
          {
            kind: "code",
            code: `RMAN> SHOW ALL;

CONFIGURE RETENTION POLICY TO RECOVERY WINDOW OF 14 DAYS;
-- ou : CONFIGURE RETENTION POLICY TO REDUNDANCY 3;
CONFIGURE BACKUP OPTIMIZATION ON;
CONFIGURE CONTROLFILE AUTOBACKUP ON;
CONFIGURE DEVICE TYPE DISK PARALLELISM 4 BACKUP TYPE TO COMPRESSED BACKUPSET;
CONFIGURE CHANNEL DEVICE TYPE DISK FORMAT '/u02/backup/%U';
CONFIGURE ARCHIVELOG DELETION POLICY TO BACKED UP 2 TIMES TO DISK;
CONFIGURE ENCRYPTION FOR DATABASE ON;

-- Revenir au défaut
CONFIGURE RETENTION POLICY CLEAR;`,
          },
          {
            kind: "tip",
            body: {
              fr: "La configuration RMAN est persistante : elle vit dans le fichier de contrôle et s'applique à toutes les sessions suivantes. L'autobackup du fichier de contrôle est le réglage le plus important — sans lui, restaurer une base dont le fichier de contrôle est perdu devient une épreuve.",
              en: "RMAN configuration is persistent: it lives in the control file and applies to every later session. Control file autobackup is the single most important setting — without it, restoring a database whose control file is lost becomes an ordeal.",
            },
          },
        ],
      },
      {
        id: "ocp2-4-3",
        number: "4.3",
        title: { fr: "Exécuter les sauvegardes", en: "Running backups" },
        blocks: [
          {
            kind: "code",
            code: `-- Sauvegarde complète, archives comprises, purge des archives sauvegardées
BACKUP DATABASE PLUS ARCHIVELOG DELETE INPUT;

-- Incrémentale niveau 0 (base de la chaîne) puis niveau 1 différentielle
BACKUP INCREMENTAL LEVEL 0 DATABASE;
BACKUP INCREMENTAL LEVEL 1 DATABASE;

-- Incrémentale cumulative : depuis le dernier niveau 0
BACKUP INCREMENTAL LEVEL 1 CUMULATIVE DATABASE;

-- Stratégie à récupération incrémentale : une copie d'image tenue à jour
BACKUP INCREMENTAL LEVEL 1 FOR RECOVER OF COPY WITH TAG 'inc' DATABASE;
RECOVER COPY OF DATABASE WITH TAG 'inc';

-- Périmètres partiels
BACKUP TABLESPACE users;
BACKUP PLUGGABLE DATABASE pdb_ventes;
BACKUP CURRENT CONTROLFILE;`,
          },
          {
            kind: "table",
            title: { fr: "Différentielle ou cumulative", en: "Differential or cumulative" },
            headers: [
              { fr: "Type", en: "Type" },
              { fr: "Sauvegarde depuis", en: "Backs up since" },
              { fr: "Compromis", en: "Trade-off" },
            ],
            rows: [
              [
                { fr: "Différentielle (défaut)", en: "Differential (default)" },
                { fr: "Le dernier niveau 0 ou 1", en: "The last level 0 or 1" },
                { fr: "Sauvegarde rapide, restauration plus longue", en: "Fast backup, slower restore" },
              ],
              [
                { fr: "Cumulative", en: "Cumulative" },
                { fr: "Le dernier niveau 0", en: "The last level 0" },
                { fr: "Sauvegarde plus longue, restauration rapide", en: "Slower backup, fast restore" },
              ],
            ],
          },
          {
            kind: "tip",
            body: {
              fr: "Activez le suivi des blocs modifiés : RMAN cesse alors de lire toute la base pour une incrémentale et lit uniquement les blocs marqués. Le gain est spectaculaire sur les grosses bases.",
              en: "Enable block change tracking: RMAN then stops scanning the whole database for an incremental and reads only the flagged blocks. The gain is dramatic on large databases.",
            },
          },
          {
            kind: "code",
            code: `ALTER DATABASE ENABLE BLOCK CHANGE TRACKING
  USING FILE '/u02/fra/bct.dbf';
SELECT status, filename FROM v$block_change_tracking;`,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp2-session-5",
    number: 5,
    title: { fr: "Diagnostic et récupération", en: "Diagnosis and recovery" },
    summary: {
      fr: "Data Recovery Advisor, scénarios de perte, récupération complète et incomplète, récupération d'une PDB.",
      en: "Data Recovery Advisor, loss scenarios, complete and incomplete recovery, PDB recovery.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "ocp2-5-1",
        number: "5.1",
        title: { fr: "Diagnostiquer une panne", en: "Diagnosing a failure" },
        blocks: [
          {
            kind: "code",
            code: `RMAN> LIST FAILURE;
RMAN> LIST FAILURE 142 DETAIL;
RMAN> ADVISE FAILURE;
RMAN> REPAIR FAILURE PREVIEW;
RMAN> REPAIR FAILURE;

-- Contrôles
RMAN> VALIDATE DATABASE;
RMAN> VALIDATE CHECK LOGICAL DATABASE;
RMAN> RESTORE DATABASE PREVIEW;
RMAN> CROSSCHECK BACKUP;
RMAN> DELETE EXPIRED BACKUP;
RMAN> REPORT NEED BACKUP;
RMAN> REPORT OBSOLETE;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Le Data Recovery Advisor (LIST / ADVISE / REPAIR FAILURE) n'est pas disponible en Real Application Clusters, ni pour les bases de secours Data Guard. Sur ces configurations, le diagnostic reste manuel.",
              en: "The Data Recovery Advisor (LIST / ADVISE / REPAIR FAILURE) is not available on Real Application Clusters, nor for Data Guard standby databases. On those configurations, diagnosis stays manual.",
            },
          },
        ],
      },
      {
        id: "ocp2-5-2",
        number: "5.2",
        title: { fr: "Scénarios de récupération", en: "Recovery scenarios" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Perte d'un datafile non critique — base ouverte", en: "Losing a non-critical data file — database open" },
            code: `RMAN> SQL 'ALTER DATABASE DATAFILE 7 OFFLINE';
RMAN> RESTORE DATAFILE 7;
RMAN> RECOVER DATAFILE 7;
RMAN> SQL 'ALTER DATABASE DATAFILE 7 ONLINE';`,
          },
          {
            kind: "code",
            title: { fr: "Perte de SYSTEM ou UNDO — base fermée", en: "Losing SYSTEM or UNDO — database closed" },
            code: `RMAN> STARTUP MOUNT;
RMAN> RESTORE TABLESPACE system;
RMAN> RECOVER TABLESPACE system;
RMAN> ALTER DATABASE OPEN;`,
          },
          {
            kind: "code",
            title: { fr: "Récupération incomplète — jusqu'à un instant", en: "Incomplete recovery — to a point in time" },
            code: `RMAN> STARTUP MOUNT;
RMAN> RUN {
  SET UNTIL TIME "TO_DATE('2026-08-23 14:30:00','YYYY-MM-DD HH24:MI:SS')";
  RESTORE DATABASE;
  RECOVER DATABASE;
}
RMAN> ALTER DATABASE OPEN RESETLOGS;

-- Variantes : SET UNTIL SCN 1234567;  SET UNTIL SEQUENCE 512 THREAD 1;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Toute récupération incomplète impose un OPEN RESETLOGS, qui ouvre une nouvelle incarnation de la base. Enchaînez immédiatement par une sauvegarde complète : les sauvegardes antérieures deviennent difficilement exploitables.",
              en: "Every incomplete recovery requires an OPEN RESETLOGS, which starts a new database incarnation. Take a full backup immediately afterwards: earlier backups become hard to use.",
            },
          },
          {
            kind: "code",
            title: { fr: "Récupérer une seule PDB", en: "Recovering a single PDB" },
            code: `-- Sans immobiliser les autres PDB
RMAN> ALTER PLUGGABLE DATABASE pdb_ventes CLOSE;
RMAN> RESTORE PLUGGABLE DATABASE pdb_ventes;
RMAN> RECOVER PLUGGABLE DATABASE pdb_ventes;
RMAN> ALTER PLUGGABLE DATABASE pdb_ventes OPEN;

-- Point dans le temps propre à une PDB (exige le mode local undo)
RMAN> RUN {
  SET UNTIL SCN 1234567;
  RESTORE PLUGGABLE DATABASE pdb_ventes;
  RECOVER PLUGGABLE DATABASE pdb_ventes AUXILIARY DESTINATION '/u02/aux';
}
RMAN> ALTER PLUGGABLE DATABASE pdb_ventes OPEN RESETLOGS;`,
          },
        ],
      },
      {
        id: "ocp2-5-3",
        number: "5.3",
        title: { fr: "Récupération de blocs et fichier de contrôle", en: "Block and control file recovery" },
        blocks: [
          {
            kind: "code",
            code: `-- Corruption de blocs isolés : la base reste ouverte
RMAN> VALIDATE DATABASE;
SELECT * FROM v$database_block_corruption;
RMAN> RECOVER CORRUPTION LIST;
RMAN> RECOVER DATAFILE 5 BLOCK 1234;

-- Perte de tous les fichiers de contrôle
RMAN> STARTUP NOMOUNT;
RMAN> RESTORE CONTROLFILE FROM AUTOBACKUP;
RMAN> ALTER DATABASE MOUNT;
RMAN> RECOVER DATABASE;
RMAN> ALTER DATABASE OPEN RESETLOGS;`,
          },
          {
            kind: "tip",
            body: {
              fr: "La récupération de blocs (Block Media Recovery) ne réclame ni arrêt ni mise hors ligne : seuls les blocs corrompus sont indisponibles pendant l'opération. C'est la réponse aux erreurs ORA-01578.",
              en: "Block Media Recovery requires neither shutdown nor offline: only the corrupt blocks are unavailable during the operation. It is the answer to ORA-01578 errors.",
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp2-session-6",
    number: 6,
    title: { fr: "Technologies Flashback", en: "Flashback technologies" },
    summary: {
      fr: "Sept fonctions Flashback, ce qu'elles exigent — undo, corbeille, journaux flashback ou Flashback Data Archive — et quand les employer.",
      en: "Seven Flashback features, what each requires — undo, recycle bin, flashback logs or Flashback Data Archive — and when to use them.",
    },
    estimatedMinutes: 120,
    topics: [
      {
        id: "ocp2-6-1",
        number: "6.1",
        title: { fr: "Panorama et dépendances", en: "Overview and dependencies" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Fonction", en: "Feature" },
              { fr: "Repose sur", en: "Relies on" },
              { fr: "Usage", en: "Use" },
            ],
            rows: [
              [
                { fr: "Flashback Query", en: "Flashback Query" },
                { fr: "UNDO", en: "UNDO" },
                { fr: "Lire une table telle qu'elle était", en: "Read a table as it was" },
              ],
              [
                { fr: "Flashback Version Query", en: "Flashback Version Query" },
                { fr: "UNDO", en: "UNDO" },
                { fr: "Voir toutes les versions d'une ligne", en: "See every version of a row" },
              ],
              [
                { fr: "Flashback Transaction Query", en: "Flashback Transaction Query" },
                { fr: "UNDO + journalisation supplémentaire", en: "UNDO + supplemental logging" },
                { fr: "Identifier et défaire une transaction", en: "Identify and undo a transaction" },
              ],
              [
                { fr: "Flashback Table", en: "Flashback Table" },
                { fr: "UNDO + row movement", en: "UNDO + row movement" },
                { fr: "Ramener une table à un instant passé", en: "Rewind a table to a past instant" },
              ],
              [
                { fr: "Flashback Drop", en: "Flashback Drop" },
                { fr: "Corbeille", en: "Recycle bin" },
                { fr: "Récupérer une table supprimée", en: "Recover a dropped table" },
              ],
              [
                { fr: "Flashback Database", en: "Flashback Database" },
                { fr: "Journaux flashback (FRA)", en: "Flashback logs (FRA)" },
                { fr: "Ramener toute la base en arrière", en: "Rewind the whole database" },
              ],
              [
                { fr: "Flashback Data Archive", en: "Flashback Data Archive" },
                { fr: "Archive dédiée", en: "Dedicated archive" },
                { fr: "Historique de longue durée, conformité", en: "Long-term history, compliance" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Quatre fonctions dépendent de l'undo : leur horizon est donc limité par UNDO_RETENTION et la taille du tablespace undo. Seuls Flashback Database (journaux flashback) et Flashback Data Archive permettent de remonter très loin.",
              en: "Four features depend on undo: their horizon is therefore bounded by UNDO_RETENTION and the undo tablespace size. Only Flashback Database (flashback logs) and Flashback Data Archive let you go far back.",
            },
          },
        ],
      },
      {
        id: "ocp2-6-2",
        number: "6.2",
        title: { fr: "Mise en œuvre", en: "Putting it to work" },
        blocks: [
          {
            kind: "code",
            code: `-- Interroger le passé
SELECT * FROM employes AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '1' HOUR);
SELECT * FROM employes AS OF SCN 1234567;

-- Toutes les versions d'une ligne
SELECT versions_startscn, versions_endscn, versions_operation, salaire
FROM   employes VERSIONS BETWEEN SCN MINVALUE AND MAXVALUE
WHERE  employe_id = 100;

-- Ramener une table en arrière
ALTER TABLE employes ENABLE ROW MOVEMENT;
FLASHBACK TABLE employes TO TIMESTAMP (SYSTIMESTAMP - INTERVAL '30' MINUTE);

-- Récupérer une table supprimée
FLASHBACK TABLE employes TO BEFORE DROP RENAME TO employes_recup;

-- Base entière (nécessite ARCHIVELOG + journaux flashback)
ALTER DATABASE FLASHBACK ON;
SHUTDOWN IMMEDIATE; STARTUP MOUNT;
FLASHBACK DATABASE TO RESTORE POINT avant_migration;
ALTER DATABASE OPEN RESETLOGS;

-- Point de restauration garanti
CREATE RESTORE POINT avant_migration GUARANTEE FLASHBACK DATABASE;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Un point de restauration garanti retient les journaux flashback quoi qu'il arrive, même si la zone de récupération se remplit. C'est le filet de sécurité standard avant une migration : bien plus rapide qu'une restauration complète, mais surveillez l'espace de la FRA.",
              en: "A guaranteed restore point retains flashback logs no matter what, even if the recovery area fills up. It is the standard safety net before a migration: far faster than a full restore, but watch the FRA space.",
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp2-session-7",
    number: 7,
    title: { fr: "Duplication et transport de données", en: "Duplication and data transport" },
    summary: {
      fr: "Dupliquer une base par RMAN, transporter tablespaces et bases entières entre plateformes.",
      en: "Duplicating a database with RMAN, transporting tablespaces and whole databases across platforms.",
    },
    estimatedMinutes: 120,
    topics: [
      {
        id: "ocp2-7-1",
        number: "7.1",
        title: { fr: "Dupliquer une base", en: "Duplicating a database" },
        blocks: [
          {
            kind: "code",
            code: `-- Duplication active : depuis la base en fonctionnement, sans sauvegarde préalable
RMAN> CONNECT TARGET sys/mdp@prod AUXILIARY sys/mdp@dup
RMAN> DUPLICATE TARGET DATABASE TO dupdb
        FROM ACTIVE DATABASE
        USING COMPRESSED BACKUPSET
        SPFILE
          SET db_file_name_convert  '/prod/','/dup/'
          SET log_file_name_convert '/prod/','/dup/'
        NOFILENAMECHECK;

-- Duplication depuis les sauvegardes, à une date choisie
RMAN> DUPLICATE TARGET DATABASE TO dupdb
        UNTIL TIME "SYSDATE-1"
        BACKUP LOCATION '/u02/backup';

-- Dupliquer une seule PDB
RMAN> DUPLICATE PLUGGABLE DATABASE pdb_ventes TO cdb_test FROM ACTIVE DATABASE;`,
          },
          {
            kind: "warning",
            body: {
              fr: "L'instance auxiliaire doit être démarrée en NOMOUNT avec un fichier de mots de passe, et être joignable par l'écouteur — c'est le cas type où un enregistrement statique dans listener.ora reste indispensable. NOFILENAMECHECK s'impose quand la source et la cible partagent les mêmes chemins.",
              en: "The auxiliary instance must be started in NOMOUNT with a password file and be reachable through the listener — the classic case where a static listener.ora registration is still required. NOFILENAMECHECK is needed when source and target share the same paths.",
            },
          },
        ],
      },
      {
        id: "ocp2-7-2",
        number: "7.2",
        title: { fr: "Tablespaces transportables", en: "Transportable tablespaces" },
        blocks: [
          {
            kind: "code",
            code: `-- 1. Le jeu doit être autonome
EXEC DBMS_TTS.TRANSPORT_SET_CHECK('VENTES,VENTES_IDX', TRUE);
SELECT * FROM transport_set_violations;

-- 2. Passer en lecture seule
ALTER TABLESPACE ventes READ ONLY;

-- 3. Exporter les métadonnées
expdp system/mdp DIRECTORY=dp_dir DUMPFILE=meta.dmp TRANSPORT_TABLESPACES=ventes

-- 4. Copier les datafiles, convertir si l'endianness diffère
RMAN> CONVERT TABLESPACE ventes TO PLATFORM 'Linux x86 64-bit'
        FORMAT '/u02/transport/%U';

-- 5. Importer sur la cible
impdp system/mdp DIRECTORY=dp_dir DUMPFILE=meta.dmp \\
  TRANSPORT_DATAFILES='/u01/oradata/ventes01.dbf'

ALTER TABLESPACE ventes READ WRITE;`,
          },
          {
            kind: "tip",
            body: {
              fr: "Vérifiez l'endianness avant tout transport entre plateformes : SELECT platform_name, endian_format FROM v$transportable_platform. Si les deux formats diffèrent, RMAN CONVERT est obligatoire. Le jeu de caractères de la cible doit par ailleurs être compatible.",
              en: "Check endianness before any cross-platform transport: SELECT platform_name, endian_format FROM v$transportable_platform. If the two formats differ, RMAN CONVERT is mandatory. The target character set must also be compatible.",
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp2-session-8",
    number: 8,
    title: { fr: "Installation, correctifs et mise à niveau", en: "Installation, patching and upgrade" },
    summary: {
      fr: "Grid Infrastructure et Oracle Restart, création par DBCA, application de correctifs, mise à niveau d'une base et d'une CDB.",
      en: "Grid Infrastructure and Oracle Restart, DBCA creation, applying patches, upgrading a database and a CDB.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "ocp2-8-1",
        number: "8.1",
        title: { fr: "Installation et Oracle Restart", en: "Installation and Oracle Restart" },
        blocks: [
          {
            kind: "code",
            code: `# Le RPM de pré-installation : vérifie et prépare le système
yum install -y oracle-database-preinstall-19c
# → crée les comptes oracle, oinstall, dba ; règle les paramètres noyau et
#   les limites ; prépare l'accès aux périphériques ASM

# Oracle Restart : redémarre automatiquement instance, écouteur et ASM
srvctl status database -d ORCL
srvctl start  database -d ORCL
srvctl config database -d ORCL
srvctl modify database -d ORCL -startoption MOUNT
crsctl check has`,
          },
          {
            kind: "tip",
            body: {
              fr: "Avec Oracle Restart, gérez toujours les ressources par srvctl et non par SQL*Plus ou lsnrctl : un arrêt manuel serait interprété comme une panne et la ressource redémarrerait aussitôt.",
              en: "With Oracle Restart, always manage resources through srvctl rather than SQL*Plus or lsnrctl: a manual stop would be read as a failure and the resource would restart immediately.",
            },
          },
        ],
      },
      {
        id: "ocp2-8-2",
        number: "8.2",
        title: { fr: "Correctifs", en: "Patching" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Type", en: "Type" },
              { fr: "Contenu et rythme", en: "Contents and cadence" },
            ],
            rows: [
              [
                { fr: "Release Update (RU)", en: "Release Update (RU)" },
                { fr: "Correctifs et améliorations, trimestriel — la voie recommandée", en: "Fixes and enhancements, quarterly — the recommended path" },
              ],
              [
                { fr: "Release Update Revision (RUR)", en: "Release Update Revision (RUR)" },
                { fr: "Correctifs de régression sur un RU donné", en: "Regression fixes on a given RU" },
              ],
              [
                { fr: "One-off patch", en: "One-off patch" },
                { fr: "Correctif unitaire pour un bogue précis", en: "Single fix for one specific bug" },
              ],
            ],
          },
          {
            kind: "code",
            code: `opatch lsinventory
opatch prereq CheckConflictAgainstOHWithDetail -ph ./
opatch apply
datapatch -verbose      # applique le volet SQL, base ouverte

SELECT patch_id, action, status FROM dba_registry_sqlpatch;`,
          },
          {
            kind: "warning",
            body: {
              fr: "opatch traite les binaires ; datapatch traite le dictionnaire. Oublier datapatch laisse la base dans un état incohérent avec ses binaires — c'est l'erreur la plus fréquente après une application de correctif.",
              en: "opatch handles the binaries; datapatch handles the dictionary. Skipping datapatch leaves the database inconsistent with its binaries — the most common mistake after applying a patch.",
            },
          },
        ],
      },
      {
        id: "ocp2-8-3",
        number: "8.3",
        title: { fr: "Mise à niveau", en: "Upgrading" },
        blocks: [
          {
            kind: "code",
            code: `# 1. Contrôles préalables, sur l'ancienne version
$NEW_HOME/bin/dbupgrade -?
java -jar $NEW_HOME/rdbms/admin/preupgrade.jar TERMINAL TEXT
@preupgrade_fixups.sql

# 2. Mise à niveau
$NEW_HOME/bin/dbua                       # assistant graphique
$NEW_HOME/bin/dbupgrade -n 4             # ligne de commande, 4 processus

# 3. Après
@postupgrade_fixups.sql
utlrp.sql                                # recompile les objets invalides
SELECT comp_name, version, status FROM dba_registry;`,
          },
          {
            kind: "tip",
            body: {
              fr: "En multitenant, la mise à niveau peut être sélective : débrancher une PDB d'une CDB en ancienne version et la brancher dans une CDB déjà à jour met à niveau cette seule PDB. C'est la méthode la plus rapide pour migrer une application isolée.",
              en: "In multitenant, upgrades can be selective: unplugging a PDB from an older CDB and plugging it into an already-upgraded CDB upgrades that PDB alone. It is the fastest way to migrate a single application.",
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "ocp2-session-9",
    number: 9,
    title: { fr: "Surveillance et optimisation", en: "Monitoring and tuning" },
    summary: {
      fr: "Seuils, métriques et alertes, AWR et ADDM, conseillers, optimisation des instructions SQL.",
      en: "Thresholds, metrics and alerts, AWR and ADDM, advisors, SQL statement tuning.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "ocp2-9-1",
        number: "9.1",
        title: { fr: "Seuils, métriques et alertes", en: "Thresholds, metrics and alerts" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Une métrique est un compteur statistique rapporté à une unité (par seconde, par transaction). Un seuil déclenche une alerte quand la métrique le franchit. Les alertes sont générées par MMON, pas par SMON.",
              en: "A metric is a statistical counter expressed per unit (per second, per transaction). A threshold raises an alert when the metric crosses it. Alerts are generated by MMON, not SMON.",
            },
          },
          {
            kind: "table",
            title: { fr: "Deux natures d'alerte", en: "Two kinds of alert" },
            headers: [
              { fr: "Type", en: "Type" },
              { fr: "Comportement", en: "Behaviour" },
              { fr: "Où la consulter", en: "Where to see it" },
            ],
            rows: [
              [
                { fr: "Avec état (stateful)", en: "Stateful" },
                { fr: "S'efface automatiquement quand la cause disparaît", en: "Clears automatically when the cause goes away" },
                { fr: "DBA_OUTSTANDING_ALERTS, puis DBA_ALERT_HISTORY", en: "DBA_OUTSTANDING_ALERTS, then DBA_ALERT_HISTORY" },
              ],
              [
                { fr: "Sans état (stateless)", en: "Stateless" },
                { fr: "Événement ponctuel, jamais « résolu »", en: "One-off event, never “resolved”" },
                { fr: "DBA_ALERT_HISTORY directement", en: "DBA_ALERT_HISTORY directly" },
              ],
            ],
          },
          {
            kind: "code",
            code: `-- Régler un seuil d'occupation de tablespace
BEGIN
  DBMS_SERVER_ALERT.SET_THRESHOLD(
    metrics_id           => DBMS_SERVER_ALERT.TABLESPACE_PCT_FULL,
    warning_operator     => DBMS_SERVER_ALERT.OPERATOR_GE, warning_value => '85',
    critical_operator    => DBMS_SERVER_ALERT.OPERATOR_GE, critical_value => '95',
    observation_period   => 1, consecutive_occurrences => 1,
    instance_name        => NULL,
    object_type          => DBMS_SERVER_ALERT.OBJECT_TYPE_TABLESPACE,
    object_name          => 'VENTES');
END;
/
SELECT * FROM dba_outstanding_alerts;
SELECT * FROM dba_alert_history;`,
          },
          {
            kind: "warning",
            body: {
              fr: "STATISTICS_LEVEL doit valoir TYPICAL (valeur par défaut) ou ALL pour que les alertes et AWR fonctionnent. À BASIC, la collecte s'arrête. Contrairement à une idée répandue, ALL n'est pas requis : c'est TYPICAL qui suffit.",
              en: "STATISTICS_LEVEL must be TYPICAL (the default) or ALL for alerts and AWR to work. At BASIC, collection stops. Contrary to a common belief, ALL is not required: TYPICAL is enough.",
            },
          },
        ],
      },
      {
        id: "ocp2-9-2",
        number: "9.2",
        title: { fr: "AWR, ASH et ADDM", en: "AWR, ASH and ADDM" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Outil", en: "Tool" },
              { fr: "Ce qu'il apporte", en: "What it gives" },
            ],
            rows: [
              [
                { fr: "AWR", en: "AWR" },
                { fr: "Instantanés périodiques de statistiques, conservés dans SYSAUX", en: "Periodic statistics snapshots, kept in SYSAUX" },
              ],
              [
                { fr: "ASH", en: "ASH" },
                { fr: "Échantillonnage des sessions actives, à la seconde", en: "Active session sampling, once per second" },
              ],
              [
                { fr: "ADDM", en: "ADDM" },
                { fr: "Diagnostic automatique entre deux instantanés AWR", en: "Automatic diagnosis between two AWR snapshots" },
              ],
            ],
          },
          {
            kind: "code",
            code: `EXEC DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT;
EXEC DBMS_WORKLOAD_REPOSITORY.MODIFY_SNAPSHOT_SETTINGS(interval => 30, retention => 20160);

@?/rdbms/admin/awrrpt.sql     -- rapport AWR
@?/rdbms/admin/ashrpt.sql     -- rapport ASH
@?/rdbms/admin/addmrpt.sql    -- rapport ADDM

SELECT snap_id, begin_interval_time FROM dba_hist_snapshot ORDER BY snap_id DESC;`,
          },
          {
            kind: "tip",
            body: {
              fr: "ADDM s'exécute automatiquement après chaque instantané AWR et analyse l'intervalle qui vient de s'écouler. Il peut aussi être lancé à la demande sur n'importe quelle paire d'instantanés.",
              en: "ADDM runs automatically after every AWR snapshot and analyses the interval just elapsed. It can also be launched on demand over any pair of snapshots.",
            },
          },
        ],
      },
      {
        id: "ocp2-9-3",
        number: "9.3",
        title: { fr: "Optimiser une instruction SQL", en: "Tuning a SQL statement" },
        blocks: [
          {
            kind: "code",
            code: `-- Plan d'exécution
EXPLAIN PLAN FOR SELECT … ;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY_CURSOR('&sql_id', NULL, 'ALLSTATS LAST'));

-- SQL Tuning Advisor
DECLARE t VARCHAR2(64);
BEGIN
  t := DBMS_SQLTUNE.CREATE_TUNING_TASK(sql_id => '&sql_id', task_name => 'tache_1');
  DBMS_SQLTUNE.EXECUTE_TUNING_TASK('tache_1');
END;
/
SELECT DBMS_SQLTUNE.REPORT_TUNING_TASK('tache_1') FROM DUAL;

-- Statistiques : la première cause de mauvais plan
EXEC DBMS_STATS.GATHER_TABLE_STATS('HR','EMPLOYEES', cascade => TRUE);
EXEC DBMS_STATS.GATHER_SCHEMA_STATS('HR');`,
          },
          {
            kind: "tip",
            body: {
              fr: "Avant de suspecter l'optimiseur, vérifiez les statistiques. Un plan aberrant vient neuf fois sur dix de statistiques absentes ou périmées. SQL Plan Management (baselines) permet ensuite de figer un plan validé et d'empêcher toute régression.",
              en: "Before blaming the optimizer, check the statistics. A wild plan comes nine times out of ten from missing or stale statistics. SQL Plan Management (baselines) then lets you freeze a validated plan and prevent any regression.",
            },
          },
        ],
      },
    ],
  },
];
