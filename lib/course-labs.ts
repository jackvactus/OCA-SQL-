import type { Lab } from "./course-oca-sql";

/**
 * Travaux pratiques, une série par session de cursus.
 *
 * Chaque exercice se fait sur une instance réelle — Oracle Database Express
 * Edition suffit pour la quasi-totalité — et se termine par un résultat
 * observable, de sorte que l'apprenant sache seul s'il a réussi.
 *
 * Le principe : on ne comprend pas une notion d'administration en la lisant.
 * On la comprend en provoquant l'erreur, puis en la corrigeant.
 */
export const sessionLabs: Record<string, Lab[]> = {
  // ═══════════════════ OCA SQL — 1Z0-071 ═══════════════════
  "session-1": [
    {
      title: { fr: "Prouver le COMMIT implicite du DDL", en: "Prove the implicit COMMIT of DDL" },
      objective: {
        fr: "Constater qu'une instruction DDL valide définitivement le DML en attente, et qu'un ROLLBACK ultérieur n'y peut rien.",
        en: "Observe that a DDL statement permanently commits pending DML, and that a later ROLLBACK cannot undo it.",
      },
      steps: [
        { fr: "Créer une table de test et y insérer une ligne, sans valider.", en: "Create a test table and insert one row, without committing." },
        { fr: "Exécuter un CREATE TABLE sur une seconde table.", en: "Run a CREATE TABLE on a second table." },
        { fr: "Exécuter ROLLBACK, puis compter les lignes de la première table.", en: "Run ROLLBACK, then count the rows in the first table." },
      ],
      expected: {
        fr: "La ligne est toujours là : le CREATE TABLE l'avait validée. Le compte renvoie 1.",
        en: "The row is still there: the CREATE TABLE committed it. The count returns 1.",
      },
      code: `CREATE TABLE lab_ddl (id NUMBER);
INSERT INTO lab_ddl VALUES (1);
CREATE TABLE lab_temoin (id NUMBER);   -- COMMIT implicite ici
ROLLBACK;
SELECT COUNT(*) FROM lab_ddl;          -- 1, et non 0`,
      minutes: 10,
    },
    {
      title: { fr: "Le piège CHAR contre VARCHAR2", en: "The CHAR versus VARCHAR2 trap" },
      objective: {
        fr: "Voir de ses yeux qu'un CHAR complété par des espaces ne se compare pas comme on l'attend.",
        en: "See for yourself that a blank-padded CHAR does not compare the way you expect.",
      },
      steps: [
        { fr: "Créer une table avec une colonne CHAR(10) et une colonne VARCHAR2(10).", en: "Create a table with a CHAR(10) column and a VARCHAR2(10) column." },
        { fr: "Y insérer la même valeur 'AB' dans les deux colonnes.", en: "Insert the same 'AB' value into both columns." },
        { fr: "Comparer les longueurs, puis comparer les deux colonnes entre elles.", en: "Compare the lengths, then compare the two columns with each other." },
      ],
      expected: {
        fr: "LENGTH renvoie 10 pour le CHAR et 2 pour le VARCHAR2. La comparaison directe échoue pourtant à renvoyer la ligne : Oracle applique la sémantique blank-padded seulement quand les deux opérandes sont des CHAR.",
        en: "LENGTH returns 10 for the CHAR and 2 for the VARCHAR2. Yet the direct comparison fails to return the row: Oracle applies blank-padded semantics only when both operands are CHAR.",
      },
      code: `CREATE TABLE lab_char (c CHAR(10), v VARCHAR2(10));
INSERT INTO lab_char VALUES ('AB', 'AB');
SELECT LENGTH(c), LENGTH(v) FROM lab_char;   -- 10 et 2
SELECT * FROM lab_char WHERE c = v;          -- aucune ligne`,
      minutes: 10,
    },
  ],
  "session-2": [
    {
      title: { fr: "WHERE ou HAVING : provoquer les deux erreurs", en: "WHERE or HAVING: trigger both errors" },
      objective: {
        fr: "Obtenir volontairement ORA-00934 puis ORA-00979, pour ne plus jamais confondre les deux clauses.",
        en: "Deliberately raise ORA-00934 then ORA-00979, so you never confuse the two clauses again.",
      },
      steps: [
        { fr: "Écrire une requête plaçant une fonction de groupe dans WHERE.", en: "Write a query placing a group function in WHERE." },
        { fr: "Écrire une requête projetant une colonne absente du GROUP BY.", en: "Write a query projecting a column missing from the GROUP BY." },
        { fr: "Corriger chacune des deux, et noter le numéro d'erreur associé.", en: "Fix both, noting the error number attached to each." },
      ],
      expected: {
        fr: "ORA-00934 « group function is not allowed here » pour la première, ORA-00979 « not a GROUP BY expression » pour la seconde.",
        en: "ORA-00934 “group function is not allowed here” for the first, ORA-00979 “not a GROUP BY expression” for the second.",
      },
      code: `-- Erreur 1 : ORA-00934
SELECT department_id FROM employees WHERE COUNT(*) > 5 GROUP BY department_id;

-- Erreur 2 : ORA-00979
SELECT department_id, last_name, AVG(salary) FROM employees GROUP BY department_id;`,
      minutes: 15,
    },
    {
      title: { fr: "Transformer une jointure externe en jointure interne", en: "Turn an outer join into an inner join" },
      objective: {
        fr: "Mesurer l'effet d'un filtre placé dans WHERE plutôt que dans ON sur une jointure externe.",
        en: "Measure what happens when a filter goes in WHERE rather than ON in an outer join.",
      },
      steps: [
        { fr: "Compter les services avec un LEFT JOIN vers les employés.", en: "Count departments with a LEFT JOIN to employees." },
        { fr: "Ajouter un filtre sur une colonne des employés dans la clause WHERE, puis recompter.", en: "Add a filter on an employee column in the WHERE clause, then recount." },
        { fr: "Déplacer ce même filtre dans la clause ON, et recompter une troisième fois.", en: "Move that same filter into the ON clause, and count a third time." },
      ],
      expected: {
        fr: "Le filtre dans WHERE fait chuter le compte au nombre de services peuplés ; dans ON, le compte initial est retrouvé.",
        en: "The filter in WHERE drops the count to the number of populated departments; in ON, the original count comes back.",
      },
      minutes: 15,
    },
  ],
  "session-3": [
    {
      title: { fr: "Une contrainte UNIQUE accepte plusieurs NULL", en: "A UNIQUE constraint accepts several NULLs" },
      objective: {
        fr: "Vérifier que la règle d'unicité ne s'applique qu'aux valeurs renseignées.",
        en: "Verify that the uniqueness rule only applies to supplied values.",
      },
      steps: [
        { fr: "Créer une table avec une colonne UNIQUE.", en: "Create a table with a UNIQUE column." },
        { fr: "Y insérer trois lignes dont la colonne vaut NULL.", en: "Insert three rows whose column is NULL." },
        { fr: "Tenter ensuite d'insérer deux fois la même valeur non nulle.", en: "Then try inserting the same non-null value twice." },
      ],
      expected: {
        fr: "Les trois NULL passent sans erreur. Le doublon non nul déclenche ORA-00001.",
        en: "The three NULLs go through without error. The non-null duplicate raises ORA-00001.",
      },
      code: `CREATE TABLE lab_unique (email VARCHAR2(50) UNIQUE);
INSERT INTO lab_unique VALUES (NULL);
INSERT INTO lab_unique VALUES (NULL);
INSERT INTO lab_unique VALUES (NULL);   -- accepte
INSERT INTO lab_unique VALUES ('a@b.c');
INSERT INTO lab_unique VALUES ('a@b.c'); -- ORA-00001`,
      minutes: 10,
    },
  ],
  "session-4": [
    {
      title: { fr: "Rendre une vue non modifiable", en: "Make a view non-updatable" },
      objective: {
        fr: "Identifier précisément ce qui fait basculer une vue de modifiable à non modifiable.",
        en: "Pinpoint exactly what tips a view from updatable to non-updatable.",
      },
      steps: [
        { fr: "Créer une vue simple sur une table, puis y exécuter un UPDATE.", en: "Create a simple view on a table, then run an UPDATE through it." },
        { fr: "Recréer la vue en y ajoutant un GROUP BY, puis retenter l'UPDATE.", en: "Recreate the view adding a GROUP BY, then retry the UPDATE." },
        { fr: "Consulter USER_UPDATABLE_COLUMNS pour les deux versions.", en: "Query USER_UPDATABLE_COLUMNS for both versions." },
      ],
      expected: {
        fr: "Le premier UPDATE réussit, le second échoue avec ORA-01732. La vue avec GROUP BY apparaît non modifiable dans le dictionnaire.",
        en: "The first UPDATE succeeds, the second fails with ORA-01732. The GROUP BY view shows as non-updatable in the dictionary.",
      },
      minutes: 15,
    },
  ],
  "session-5": [
    {
      title: { fr: "ROWNUM avant le tri : reproduire le piège", en: "ROWNUM before sorting: reproduce the trap" },
      objective: {
        fr: "Constater que ROWNUM et ORDER BY dans la même requête ne donnent pas le Top-N attendu.",
        en: "Observe that ROWNUM and ORDER BY in the same query do not give the expected Top-N.",
      },
      steps: [
        { fr: "Écrire la version naïve : WHERE ROWNUM <= 5 et ORDER BY salaire DESC.", en: "Write the naive version: WHERE ROWNUM <= 5 with ORDER BY salary DESC." },
        { fr: "Écrire la version correcte, avec le tri dans une sous-requête.", en: "Write the correct version, sorting inside a subquery." },
        { fr: "Comparer les deux jeux de résultats.", en: "Compare the two result sets." },
      ],
      expected: {
        fr: "La version naïve renvoie 5 lignes arbitraires ensuite triées. La version correcte renvoie les 5 vrais salaires les plus élevés.",
        en: "The naive version returns 5 arbitrary rows then sorts them. The correct version returns the 5 genuinely highest salaries.",
      },
      code: `-- Incorrect
SELECT last_name, salary FROM employees WHERE ROWNUM <= 5 ORDER BY salary DESC;

-- Correct
SELECT * FROM (SELECT last_name, salary FROM employees ORDER BY salary DESC)
WHERE ROWNUM <= 5;`,
      minutes: 10,
    },
  ],
  "session-6": [
    {
      title: { fr: "Séquence, trous et CURRVAL", en: "Sequence, gaps and CURRVAL" },
      objective: {
        fr: "Vérifier qu'un ROLLBACK ne restitue pas un numéro de séquence, et que CURRVAL exige un NEXTVAL préalable.",
        en: "Verify that a ROLLBACK does not return a sequence number, and that CURRVAL requires a prior NEXTVAL.",
      },
      steps: [
        { fr: "Créer une séquence puis interroger CURRVAL immédiatement.", en: "Create a sequence then query CURRVAL immediately." },
        { fr: "Appeler NEXTVAL, faire un ROLLBACK, puis rappeler NEXTVAL.", en: "Call NEXTVAL, run a ROLLBACK, then call NEXTVAL again." },
      ],
      expected: {
        fr: "CURRVAL échoue d'abord avec ORA-08002. Après le ROLLBACK, NEXTVAL renvoie 2 et non 1 : le numéro consommé est perdu.",
        en: "CURRVAL first fails with ORA-08002. After the ROLLBACK, NEXTVAL returns 2 and not 1: the consumed number is gone.",
      },
      code: `CREATE SEQUENCE lab_seq START WITH 1;
SELECT lab_seq.CURRVAL FROM DUAL;   -- ORA-08002
SELECT lab_seq.NEXTVAL FROM DUAL;   -- 1
ROLLBACK;
SELECT lab_seq.NEXTVAL FROM DUAL;   -- 2, le 1 est perdu`,
      minutes: 10,
    },
  ],

  // ═══════════════════ OCP I — 1Z0-082 ═══════════════════
  "ocp1-session-1": [
    {
      title: { fr: "Parcourir les quatre états de démarrage", en: "Walk through the four startup states" },
      objective: {
        fr: "Voir ce qui devient interrogeable à chaque étape, et pourquoi.",
        en: "See what becomes queryable at each step, and why.",
      },
      steps: [
        { fr: "Arrêter la base, puis démarrer en NOMOUNT et interroger V$INSTANCE puis DBA_TABLES.", en: "Shut down, then start NOMOUNT and query V$INSTANCE then DBA_TABLES." },
        { fr: "Monter la base et interroger V$DATAFILE.", en: "Mount the database and query V$DATAFILE." },
        { fr: "Ouvrir la base et réinterroger DBA_TABLES.", en: "Open the database and query DBA_TABLES again." },
      ],
      expected: {
        fr: "V$INSTANCE répond dès NOMOUNT, V$DATAFILE seulement après MOUNT, DBA_TABLES seulement après OPEN — le dictionnaire vivant dans SYSTEM.",
        en: "V$INSTANCE answers from NOMOUNT, V$DATAFILE only after MOUNT, DBA_TABLES only after OPEN — the dictionary living in SYSTEM.",
      },
      code: `SHUTDOWN IMMEDIATE;
STARTUP NOMOUNT;
SELECT status FROM v$instance;
SELECT COUNT(*) FROM dba_tables;      -- ORA-01219
ALTER DATABASE MOUNT;
SELECT name FROM v$datafile;
ALTER DATABASE OPEN;
SELECT COUNT(*) FROM dba_tables;      -- fonctionne`,
      minutes: 20,
    },
    {
      title: { fr: "Observer la récupération d'instance", en: "Watch instance recovery happen" },
      objective: {
        fr: "Provoquer un arrêt brutal et lire dans l'alert log le roll forward puis le rollback.",
        en: "Force a crash and read the roll forward then rollback in the alert log.",
      },
      steps: [
        { fr: "Sur une base de test, lancer un gros UPDATE sans valider.", en: "On a test database, start a large UPDATE without committing." },
        { fr: "Exécuter SHUTDOWN ABORT depuis une autre session.", en: "Run SHUTDOWN ABORT from another session." },
        { fr: "Redémarrer, puis lire l'alert log avec adrci.", en: "Restart, then read the alert log with adrci." },
      ],
      expected: {
        fr: "L'alert log mentionne « Beginning crash recovery », le roll forward, puis l'ouverture de la base. Les lignes non validées sont revenues à leur état d'origine.",
        en: "The alert log mentions “Beginning crash recovery”, the roll forward, then the database opening. Uncommitted rows are back to their original state.",
      },
      minutes: 25,
    },
  ],
  "ocp1-session-3": [
    {
      title: { fr: "Le quota manquant", en: "The missing quota" },
      objective: {
        fr: "Vérifier que CREATE TABLE ne suffit pas sans quota sur le tablespace visé.",
        en: "Verify that CREATE TABLE is not enough without a quota on the target tablespace.",
      },
      steps: [
        { fr: "Créer un utilisateur avec CREATE SESSION et CREATE TABLE, mais sans quota.", en: "Create a user with CREATE SESSION and CREATE TABLE, but no quota." },
        { fr: "Se connecter et tenter de créer une table puis d'y insérer une ligne.", en: "Connect and try to create a table then insert a row." },
        { fr: "Accorder un quota, puis réessayer.", en: "Grant a quota, then retry." },
      ],
      expected: {
        fr: "L'insertion échoue avec ORA-01950 « no privileges on tablespace ». Après le quota, tout passe.",
        en: "The insert fails with ORA-01950 “no privileges on tablespace”. After the quota, everything works.",
      },
      code: `CREATE USER lab_user IDENTIFIED BY "MotDePasse#2026";
GRANT CREATE SESSION, CREATE TABLE TO lab_user;
-- en tant que lab_user :
CREATE TABLE t (id NUMBER);
INSERT INTO t VALUES (1);          -- ORA-01950
-- en tant que DBA :
ALTER USER lab_user QUOTA 10M ON users;`,
      minutes: 15,
    },
    {
      title: { fr: "Privilège par rôle et création de vue", en: "Role-granted privilege and view creation" },
      objective: {
        fr: "Constater qu'un privilège obtenu par rôle ne permet pas de créer une vue.",
        en: "Observe that a privilege obtained through a role does not allow creating a view.",
      },
      steps: [
        { fr: "Accorder SELECT sur une table via un rôle, à un utilisateur qui a CREATE VIEW.", en: "Grant SELECT on a table through a role, to a user holding CREATE VIEW." },
        { fr: "Tenter de créer une vue sur cette table.", en: "Try to create a view on that table." },
        { fr: "Accorder le même SELECT directement, puis réessayer.", en: "Grant the same SELECT directly, then retry." },
      ],
      expected: {
        fr: "La première tentative échoue avec ORA-01031. Avec l'octroi direct, la vue se crée.",
        en: "The first attempt fails with ORA-01031. With the direct grant, the view is created.",
      },
      minutes: 20,
    },
  ],
  "ocp1-session-4": [
    {
      title: { fr: "Provoquer un ORA-01555", en: "Force an ORA-01555" },
      objective: {
        fr: "Reproduire le « snapshot too old » pour comprendre ce qui l'engendre, puis l'éliminer.",
        en: "Reproduce “snapshot too old” to understand what causes it, then eliminate it.",
      },
      steps: [
        { fr: "Réduire fortement UNDO_RETENTION et la taille du tablespace undo sur une base de test.", en: "Sharply reduce UNDO_RETENTION and the undo tablespace size on a test database." },
        { fr: "Lancer une requête longue sur une grosse table.", en: "Start a long-running query on a large table." },
        { fr: "Depuis une autre session, générer beaucoup de mises à jour sur cette même table.", en: "From another session, generate heavy updates on that same table." },
        { fr: "Activer RETENTION GUARANTEE et recommencer.", en: "Enable RETENTION GUARANTEE and start over." },
      ],
      expected: {
        fr: "La requête longue échoue avec ORA-01555. Avec RETENTION GUARANTEE, elle aboutit — mais les mises à jour peuvent désormais échouer faute d'espace.",
        en: "The long query fails with ORA-01555. With RETENTION GUARANTEE it completes — but the updates may now fail for lack of space.",
      },
      minutes: 30,
    },
  ],
  "ocp1-session-6": [
    {
      title: { fr: "Lire un fichier plat par table externe", en: "Read a flat file through an external table" },
      objective: {
        fr: "Mettre en place la chaîne complète : répertoire, privilège, définition, lecture.",
        en: "Put the whole chain in place: directory, privilege, definition, read.",
      },
      steps: [
        { fr: "Déposer un fichier CSV de trois lignes sur le serveur.", en: "Drop a three-line CSV file on the server." },
        { fr: "Créer l'objet DIRECTORY et accorder READ.", en: "Create the DIRECTORY object and grant READ." },
        { fr: "Définir la table externe, puis l'interroger.", en: "Define the external table, then query it." },
        { fr: "Tenter un INSERT dessus, et noter l'erreur.", en: "Attempt an INSERT on it, and note the error." },
      ],
      expected: {
        fr: "Le SELECT renvoie les trois lignes. L'INSERT échoue avec ORA-30657 : une table externe est en lecture seule.",
        en: "The SELECT returns the three rows. The INSERT fails with ORA-30657: an external table is read-only.",
      },
      minutes: 25,
    },
  ],

  // ═══════════════════ OCP II — 1Z0-083 ═══════════════════
  "ocp1-session-2": [
    {
      title: { fr: "SPFILE, PFILE et portées", en: "SPFILE, PFILE and scopes" },
      objective: {
        fr: "Distinguer par l'expérience ce que MEMORY, SPFILE et BOTH changent réellement.",
        en: "Tell apart, by experiment, what MEMORY, SPFILE and BOTH actually change.",
      },
      steps: [
        { fr: "Modifier open_cursors avec SCOPE=MEMORY, redémarrer, relire la valeur.", en: "Change open_cursors with SCOPE=MEMORY, restart, read the value back." },
        { fr: "Recommencer avec SCOPE=SPFILE, sans redémarrer, puis relire.", en: "Repeat with SCOPE=SPFILE, without restarting, then read back." },
        { fr: "Tenter de modifier un paramètre statique avec SCOPE=MEMORY.", en: "Try changing a static parameter with SCOPE=MEMORY." },
      ],
      expected: {
        fr: "MEMORY disparaît au redémarrage. SPFILE n'agit qu'après. Le paramètre statique refuse MEMORY avec ORA-02095.",
        en: "MEMORY vanishes on restart. SPFILE only takes effect afterwards. The static parameter rejects MEMORY with ORA-02095.",
      },
      code: `ALTER SYSTEM SET open_cursors = 500 SCOPE=MEMORY;
SHOW PARAMETER open_cursors;
SHUTDOWN IMMEDIATE; STARTUP;
SHOW PARAMETER open_cursors;                    -- revenu a l'ancienne valeur
ALTER SYSTEM SET processes = 400 SCOPE=MEMORY;  -- ORA-02095`,
      minutes: 20,
    },
    {
      title: { fr: "Explorer l'ADR avec adrci", en: "Explore the ADR with adrci" },
      objective: {
        fr: "Savoir retrouver seul une erreur passée, sans accès à la base.",
        en: "Be able to find a past error on your own, with no database access.",
      },
      steps: [
        { fr: "Lancer adrci et lister les homes disponibles.", en: "Launch adrci and list the available homes." },
        { fr: "Afficher la fin de l'alert log, puis lister les incidents.", en: "Show the tail of the alert log, then list incidents." },
        { fr: "Constituer un paquet de diagnostic pour le support.", en: "Build a diagnostic package for support." },
      ],
      expected: {
        fr: "L'alert log s'affiche instance arrêtée : c'est tout l'intérêt d'un référentiel hors base.",
        en: "The alert log displays with the instance down: that is the whole point of an out-of-database repository.",
      },
      code: `adrci
adrci> show homes
adrci> show alert -tail 50
adrci> show incident
adrci> ips pack incident 12345 in /tmp`,
      minutes: 20,
    },
  ],
  "ocp1-session-5": [
    {
      title: { fr: "Diagnostiquer trois erreurs de connexion", en: "Diagnose three connection errors" },
      objective: {
        fr: "Associer chaque code d'erreur réseau à sa cause réelle, sans tâtonner.",
        en: "Match each network error code to its real cause, without guesswork.",
      },
      steps: [
        { fr: "Se connecter avec un alias absent de tnsnames.ora.", en: "Connect using an alias missing from tnsnames.ora." },
        { fr: "Arrêter l'écouteur, puis retenter une connexion valide.", en: "Stop the listener, then retry a valid connection." },
        { fr: "Redémarrer l'écouteur, arrêter l'instance, retenter.", en: "Restart the listener, stop the instance, retry." },
      ],
      expected: {
        fr: "ORA-12154 pour l'alias inconnu, ORA-12541 « no listener », ORA-01034 « ORACLE not available ». Trois symptômes, trois causes distinctes.",
        en: "ORA-12154 for the unknown alias, ORA-12541 “no listener”, ORA-01034 “ORACLE not available”. Three symptoms, three distinct causes.",
      },
      minutes: 20,
    },
  ],
  "ocp2-session-1": [
    {
      title: { fr: "Cartographier une CDB", en: "Map out a CDB" },
      objective: {
        fr: "Voir concrètement ce qui est partagé et ce qui est local, conteneur par conteneur.",
        en: "See concretely what is shared and what is local, container by container.",
      },
      steps: [
        { fr: "Depuis CDB$ROOT, lister les conteneurs et leurs CON_ID.", en: "From CDB$ROOT, list the containers and their CON_ID." },
        { fr: "Comparer CDB_TABLESPACES vue de la racine puis d'une PDB.", en: "Compare CDB_TABLESPACES seen from the root then from a PDB." },
        { fr: "Vérifier le mode undo de la CDB.", en: "Check the CDB undo mode." },
      ],
      expected: {
        fr: "Depuis la racine, la vue couvre tous les conteneurs ; depuis la PDB, elle se limite au conteneur courant. Les redo logs n'existent qu'au niveau CDB.",
        en: "From the root the view spans every container; from the PDB it narrows to the current one. Redo logs exist only at CDB level.",
      },
      code: `SELECT con_id, name, open_mode FROM v$pdbs;
SELECT con_id, COUNT(*) FROM cdb_tablespaces GROUP BY con_id;
ALTER SESSION SET CONTAINER = pdb_ventes;
SELECT con_id, COUNT(*) FROM cdb_tablespaces GROUP BY con_id;  -- un seul con_id
SELECT property_value FROM database_properties
 WHERE property_name = 'LOCAL_UNDO_ENABLED';`,
      minutes: 20,
    },
  ],
  "ocp2-session-3": [
    {
      title: { fr: "Le piège de CONTAINER = ALL", en: "The CONTAINER = ALL trap" },
      objective: {
        fr: "Constater qu'un octroi CONTAINER = ALL n'atteint pas une PDB branchée après coup.",
        en: "Observe that a CONTAINER = ALL grant does not reach a PDB plugged in later.",
      },
      steps: [
        { fr: "Depuis la racine, créer un utilisateur commun et lui accorder CREATE SESSION CONTAINER = ALL.", en: "From the root, create a common user and grant it CREATE SESSION CONTAINER = ALL." },
        { fr: "Vérifier qu'il se connecte à une PDB existante.", en: "Verify it can connect to an existing PDB." },
        { fr: "Brancher une nouvelle PDB, puis retenter la connexion dessus.", en: "Plug in a new PDB, then retry the connection there." },
      ],
      expected: {
        fr: "La connexion échoue sur la PDB nouvellement branchée : l'octroi n'est pas rétroactif. Il faut le rejouer.",
        en: "The connection fails on the newly plugged PDB: the grant is not retroactive. It must be replayed.",
      },
      minutes: 25,
    },
  ],
  "ocp2-session-7": [
    {
      title: { fr: "Transporter un tablespace, étape par étape", en: "Transport a tablespace, step by step" },
      objective: {
        fr: "Dérouler la chaîne complète et provoquer volontairement l'erreur d'autonomie.",
        en: "Run the full chain and deliberately trigger the self-containment error.",
      },
      steps: [
        { fr: "Créer un tablespace, y placer une table dont l'index vit ailleurs.", en: "Create a tablespace, put in it a table whose index lives elsewhere." },
        { fr: "Exécuter DBMS_TTS.TRANSPORT_SET_CHECK et lire TRANSPORT_SET_VIOLATIONS.", en: "Run DBMS_TTS.TRANSPORT_SET_CHECK and read TRANSPORT_SET_VIOLATIONS." },
        { fr: "Déplacer l'index, revérifier, puis passer en lecture seule.", en: "Move the index, re-check, then set the tablespace read only." },
      ],
      expected: {
        fr: "La première vérification signale une violation : l'index sort du jeu. Une fois corrigée, la vue est vide et le transport peut commencer.",
        en: "The first check reports a violation: the index falls outside the set. Once fixed, the view is empty and the transport can begin.",
      },
      code: `EXEC DBMS_TTS.TRANSPORT_SET_CHECK('LAB_TS', TRUE);
SELECT * FROM transport_set_violations;
ALTER INDEX lab_idx REBUILD TABLESPACE lab_ts;
EXEC DBMS_TTS.TRANSPORT_SET_CHECK('LAB_TS', TRUE);
SELECT * FROM transport_set_violations;   -- vide
ALTER TABLESPACE lab_ts READ ONLY;`,
      minutes: 30,
    },
  ],
  "ocp2-session-2": [
    {
      title: { fr: "Cycle complet d'une PDB", en: "Full life cycle of a PDB" },
      objective: {
        fr: "Créer, cloner, débrancher, vérifier puis rebrancher une PDB — et lire les violations.",
        en: "Create, clone, unplug, check then plug a PDB back in — and read the violations.",
      },
      steps: [
        { fr: "Créer une PDB depuis PDB$SEED et l'ouvrir.", en: "Create a PDB from PDB$SEED and open it." },
        { fr: "La cloner, puis débrancher le clone vers un manifeste XML.", en: "Clone it, then unplug the clone to an XML manifest." },
        { fr: "Vérifier la compatibilité avec DBMS_PDB.CHECK_PLUG_COMPATIBILITY.", en: "Check compatibility with DBMS_PDB.CHECK_PLUG_COMPATIBILITY." },
        { fr: "Rebrancher, puis interroger PDB_PLUG_IN_VIOLATIONS.", en: "Plug it back in, then query PDB_PLUG_IN_VIOLATIONS." },
      ],
      expected: {
        fr: "La vérification renvoie TRUE et la vue des violations est vide. Si elle ne l'est pas, la PDB s'ouvre en RESTRICTED — c'est précisément le cas à savoir diagnostiquer.",
        en: "The check returns TRUE and the violations view is empty. If it is not, the PDB opens RESTRICTED — precisely the case you must know how to diagnose.",
      },
      minutes: 40,
    },
    {
      title: { fr: "L'oubli du SAVE STATE", en: "The forgotten SAVE STATE" },
      objective: {
        fr: "Comprendre pourquoi les PDB ne se rouvrent pas seules après un redémarrage de la CDB.",
        en: "Understand why PDBs do not reopen by themselves after a CDB restart.",
      },
      steps: [
        { fr: "Ouvrir une PDB en lecture-écriture, puis redémarrer la CDB.", en: "Open a PDB read-write, then restart the CDB." },
        { fr: "Constater son état dans V$PDBS.", en: "Check its state in V$PDBS." },
        { fr: "L'ouvrir, exécuter SAVE STATE, redémarrer à nouveau.", en: "Open it, run SAVE STATE, restart again." },
      ],
      expected: {
        fr: "Au premier redémarrage la PDB est MOUNTED. Après SAVE STATE, elle revient d'elle-même en READ WRITE.",
        en: "After the first restart the PDB is MOUNTED. After SAVE STATE, it comes back READ WRITE on its own.",
      },
      minutes: 20,
    },
  ],
  "ocp2-session-4": [
    {
      title: { fr: "Mesurer l'apport du block change tracking", en: "Measure what block change tracking brings" },
      objective: {
        fr: "Chiffrer le gain réel d'une sauvegarde incrémentale avec et sans suivi des blocs.",
        en: "Quantify the real gain of an incremental backup with and without block tracking.",
      },
      steps: [
        { fr: "Prendre une sauvegarde de niveau 0, puis modifier une petite partie des données.", en: "Take a level 0 backup, then change a small part of the data." },
        { fr: "Lancer une incrémentale de niveau 1 et relever la durée.", en: "Run a level 1 incremental and record the duration." },
        { fr: "Activer le block change tracking, refaire une modification comparable, relancer.", en: "Enable block change tracking, make a comparable change, run again." },
      ],
      expected: {
        fr: "La seconde incrémentale est nettement plus rapide : RMAN ne relit plus toute la base. V$BLOCK_CHANGE_TRACKING confirme l'activation.",
        en: "The second incremental is markedly faster: RMAN no longer rescans the whole database. V$BLOCK_CHANGE_TRACKING confirms it is enabled.",
      },
      code: `RMAN> BACKUP INCREMENTAL LEVEL 0 DATABASE;
-- modifier des donnees, puis :
RMAN> BACKUP INCREMENTAL LEVEL 1 DATABASE;
SQL> ALTER DATABASE ENABLE BLOCK CHANGE TRACKING USING FILE '/u02/fra/bct.dbf';
SQL> SELECT status, filename FROM v$block_change_tracking;`,
      minutes: 35,
    },
  ],
  "ocp2-session-5": [
    {
      title: { fr: "Perdre puis restaurer un datafile non critique", en: "Lose then restore a non-critical data file" },
      objective: {
        fr: "Réaliser une restauration base ouverte, sans immobiliser les utilisateurs.",
        en: "Perform a restore with the database open, without stopping users.",
      },
      steps: [
        { fr: "Sauvegarder la base, puis supprimer au niveau système un datafile applicatif.", en: "Back up the database, then delete an application data file at OS level." },
        { fr: "Provoquer une lecture sur la table concernée et lire l'erreur.", en: "Force a read on the affected table and read the error." },
        { fr: "Mettre le datafile hors ligne, restaurer, récupérer, remettre en ligne.", en: "Take the data file offline, restore, recover, bring it back online." },
      ],
      expected: {
        fr: "L'erreur initiale est ORA-01116 ou ORA-01110. Après la séquence, la table est de nouveau lisible, sans que la base ait été fermée.",
        en: "The initial error is ORA-01116 or ORA-01110. After the sequence the table reads again, with the database never having been closed.",
      },
      code: `RMAN> SQL 'ALTER DATABASE DATAFILE 7 OFFLINE';
RMAN> RESTORE DATAFILE 7;
RMAN> RECOVER DATAFILE 7;
RMAN> SQL 'ALTER DATABASE DATAFILE 7 ONLINE';`,
      minutes: 35,
    },
    {
      title: { fr: "Utiliser le Data Recovery Advisor", en: "Use the Data Recovery Advisor" },
      objective: {
        fr: "Laisser RMAN diagnostiquer une panne et proposer sa réparation, avant de l'appliquer.",
        en: "Let RMAN diagnose a failure and propose its repair, before applying it.",
      },
      steps: [
        { fr: "Provoquer une panne : supprimer un datafile ou corrompre un bloc.", en: "Cause a failure: delete a data file or corrupt a block." },
        { fr: "Exécuter LIST FAILURE puis ADVISE FAILURE.", en: "Run LIST FAILURE then ADVISE FAILURE." },
        { fr: "Lire le script proposé par REPAIR FAILURE PREVIEW avant de l'exécuter.", en: "Read the script proposed by REPAIR FAILURE PREVIEW before running it." },
      ],
      expected: {
        fr: "RMAN classe la panne par gravité et produit un script de réparation. PREVIEW permet de le relire — réflexe à conserver en production.",
        en: "RMAN ranks the failure by severity and produces a repair script. PREVIEW lets you read it first — a habit worth keeping in production.",
      },
      minutes: 25,
    },
  ],
  "ocp2-session-6": [
    {
      title: { fr: "Point de restauration garanti avant migration", en: "Guaranteed restore point before a migration" },
      objective: {
        fr: "Mettre en place le filet de sécurité standard, puis l'utiliser réellement.",
        en: "Put the standard safety net in place, then actually use it.",
      },
      steps: [
        { fr: "Vérifier que la base est en ARCHIVELOG et que le flashback est actif.", en: "Check the database is in ARCHIVELOG and flashback is on." },
        { fr: "Créer un point de restauration garanti, puis modifier massivement des données.", en: "Create a guaranteed restore point, then change data massively." },
        { fr: "Ramener la base au point de restauration et rouvrir en RESETLOGS.", en: "Rewind the database to the restore point and open with RESETLOGS." },
        { fr: "Surveiller l'occupation de la FRA pendant toute l'opération.", en: "Watch FRA usage throughout the operation." },
      ],
      expected: {
        fr: "Les données retrouvent leur état initial en quelques minutes, là où une restauration complète aurait pris des heures. La FRA se remplit visiblement tant que le point existe.",
        en: "Data returns to its original state in minutes, where a full restore would have taken hours. The FRA visibly fills while the restore point exists.",
      },
      code: `SELECT flashback_on, log_mode FROM v$database;
CREATE RESTORE POINT avant_migration GUARANTEE FLASHBACK DATABASE;
-- … operations risquees …
SHUTDOWN IMMEDIATE; STARTUP MOUNT;
FLASHBACK DATABASE TO RESTORE POINT avant_migration;
ALTER DATABASE OPEN RESETLOGS;
DROP RESTORE POINT avant_migration;   -- liberer la FRA`,
      minutes: 40,
    },
  ],
  "ocp2-session-8": [
    {
      title: { fr: "opatch sans datapatch : constater la panne", en: "opatch without datapatch: see the breakage" },
      objective: {
        fr: "Comprendre par l'exemple pourquoi les deux outils sont indissociables.",
        en: "Understand by example why the two tools are inseparable.",
      },
      steps: [
        { fr: "Appliquer un Release Update avec opatch, sur un environnement de test.", en: "Apply a Release Update with opatch, on a test environment." },
        { fr: "Redémarrer la base sans exécuter datapatch, puis interroger DBA_REGISTRY_SQLPATCH.", en: "Restart the database without running datapatch, then query DBA_REGISTRY_SQLPATCH." },
        { fr: "Exécuter datapatch puis utlrp.sql, et réinterroger.", en: "Run datapatch then utlrp.sql, and query again." },
      ],
      expected: {
        fr: "Avant datapatch, le correctif est absent de DBA_REGISTRY_SQLPATCH alors qu'opatch lsinventory le liste — l'écart révèle exactement l'oubli.",
        en: "Before datapatch, the patch is absent from DBA_REGISTRY_SQLPATCH while opatch lsinventory lists it — the gap reveals precisely the omission.",
      },
      minutes: 40,
    },
  ],
  "ocp2-session-9": [
    {
      title: { fr: "Poser un seuil et déclencher l'alerte", en: "Set a threshold and trigger the alert" },
      objective: {
        fr: "Voir le cycle complet d'une alerte avec état : apparition, puis effacement automatique.",
        en: "See the full life cycle of a stateful alert: it appears, then clears on its own.",
      },
      steps: [
        { fr: "Poser un seuil bas d'occupation sur un tablespace de test.", en: "Set a low usage threshold on a test tablespace." },
        { fr: "Remplir ce tablespace jusqu'à franchir le seuil.", en: "Fill that tablespace until the threshold is crossed." },
        { fr: "Consulter DBA_OUTSTANDING_ALERTS, puis libérer de l'espace.", en: "Query DBA_OUTSTANDING_ALERTS, then free some space." },
        { fr: "Reconsulter les deux vues d'alertes.", en: "Query both alert views again." },
      ],
      expected: {
        fr: "L'alerte apparaît dans DBA_OUTSTANDING_ALERTS, puis migre seule vers DBA_ALERT_HISTORY une fois l'espace libéré : c'est la définition d'une alerte avec état.",
        en: "The alert appears in DBA_OUTSTANDING_ALERTS, then moves by itself into DBA_ALERT_HISTORY once space is freed: that is the definition of a stateful alert.",
      },
      minutes: 30,
    },
    {
      title: { fr: "Statistiques périmées et plan aberrant", en: "Stale statistics and a wild plan" },
      objective: {
        fr: "Provoquer un mauvais plan d'exécution, puis le corriger par la collecte de statistiques.",
        en: "Cause a bad execution plan, then fix it by gathering statistics.",
      },
      steps: [
        { fr: "Créer une table, la remplir massivement, sans collecter de statistiques.", en: "Create a table, load it heavily, without gathering statistics." },
        { fr: "Exécuter une requête filtrante et lire son plan avec DBMS_XPLAN.", en: "Run a filtering query and read its plan with DBMS_XPLAN." },
        { fr: "Collecter les statistiques par DBMS_STATS, puis relire le plan.", en: "Gather statistics with DBMS_STATS, then read the plan again." },
      ],
      expected: {
        fr: "Le premier plan repose sur des estimations par défaut et choisit souvent un parcours complet. Après collecte, les cardinalités deviennent réalistes et le plan change.",
        en: "The first plan rests on default estimates and often picks a full scan. After gathering, cardinalities become realistic and the plan changes.",
      },
      code: `EXPLAIN PLAN FOR SELECT * FROM lab_stats WHERE col = 42;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
EXEC DBMS_STATS.GATHER_TABLE_STATS(USER, 'LAB_STATS');
EXPLAIN PLAN FOR SELECT * FROM lab_stats WHERE col = 42;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);`,
      minutes: 30,
    },
  ],
};
