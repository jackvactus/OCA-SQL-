import type { Bilingual, SelfCheck } from "./course-oca-sql";

/**
 * Points à retenir et questions de contrôle, une entrée par session de cursus.
 *
 * Séparé des fichiers de cours pour garder ceux-ci lisibles. La fusion est
 * faite dans `lib/curricula.ts`.
 *
 * Les questions de contrôle ne sont pas des QCM : ce sont des questions
 * ouvertes auxquelles on répond de tête avant de dévoiler la réponse. Elles
 * portent volontairement sur les points que les corrigés de `docs/OCA/`
 * signalent comme les plus discriminants.
 */
export interface SessionExtras {
  keyTakeaways: Bilingual[];
  selfCheck: SelfCheck[];
}

export const sessionExtras: Record<string, SessionExtras> = {
  // ═══════════════════ OCA SQL — 1Z0-071 ═══════════════════
  "session-1": {
    keyTakeaways: [
      { fr: "DML, DDL, DCL, TCL : seul le DML est transactionnel. DDL et DCL déclenchent un COMMIT implicite.", en: "DML, DDL, DCL, TCL: only DML is transactional. DDL and DCL fire an implicit COMMIT." },
      { fr: "DUAL sert à évaluer une expression sans table réelle : une ligne, une colonne.", en: "DUAL evaluates an expression without a real table: one row, one column." },
      { fr: "CHAR complète avec des espaces, VARCHAR2 non — d'où des comparaisons qui échouent.", en: "CHAR blank-pads, VARCHAR2 does not — hence comparisons that unexpectedly fail." },
      { fr: "Les fonctions mono-ligne renvoient une valeur par ligne ; elles s'imbriquent de l'intérieur vers l'extérieur.", en: "Single-row functions return one value per row; they nest from the inside out." },
      { fr: "NVL(2 arguments), NVL2(3), COALESCE(n), NULLIF(2) : quatre outils, quatre signatures.", en: "NVL (2 arguments), NVL2 (3), COALESCE (n), NULLIF (2): four tools, four signatures." },
    ],
    selfCheck: [
      { question: { fr: "Pourquoi un ROLLBACK après un CREATE TABLE ne restaure-t-il pas les INSERT qui le précédaient ?", en: "Why does a ROLLBACK after a CREATE TABLE not restore the INSERTs that came before it?" }, answer: { fr: "Parce que le DDL déclenche un COMMIT implicite avant et après son exécution : les INSERT ont déjà été validés définitivement.", en: "Because DDL fires an implicit COMMIT before and after it runs: the INSERTs were already committed for good." } },
      { question: { fr: "Quelle différence entre NVL(x, y) et NVL2(x, y, z) ?", en: "What is the difference between NVL(x, y) and NVL2(x, y, z)?" }, answer: { fr: "NVL renvoie y si x est NULL, sinon x. NVL2 renvoie y si x n'est PAS NULL, et z si x est NULL — l'ordre est contre-intuitif.", en: "NVL returns y when x is NULL, otherwise x. NVL2 returns y when x is NOT NULL, and z when x is NULL — the order is counter-intuitive." } },
      { question: { fr: "TO_CHAR(salaire, '999') affiche ####. Que s'est-il passé ?", en: "TO_CHAR(salary, '999') displays ####. What happened?" }, answer: { fr: "Le masque n'a que trois positions et la valeur en demande davantage. Oracle remplit alors toute la largeur de dièses. Il faut allonger le modèle.", en: "The mask has only three positions and the value needs more. Oracle then fills the whole width with hashes. Lengthen the model." } },
    ],
  },
  "session-2": {
    keyTakeaways: [
      { fr: "NULL n'est égal à rien : = NULL ne renvoie jamais rien, seul IS NULL fonctionne.", en: "NULL equals nothing: = NULL never returns a row, only IS NULL works." },
      { fr: "WHERE filtre les lignes avant regroupement, HAVING filtre les groupes après.", en: "WHERE filters rows before grouping, HAVING filters groups after." },
      { fr: "Toute colonne du SELECT non agrégée doit figurer dans le GROUP BY.", en: "Every non-aggregated SELECT column must appear in the GROUP BY." },
      { fr: "Les fonctions de groupe ignorent les NULL, sauf COUNT(*) qui compte des lignes.", en: "Group functions ignore NULLs, except COUNT(*) which counts rows." },
      { fr: "LEFT JOIN conserve la table de gauche ; en syntaxe historique, (+) se place du côté qui peut manquer.", en: "LEFT JOIN keeps the left table; in the legacy syntax, (+) goes on the side that may be missing." },
    ],
    selfCheck: [
      { question: { fr: "Pourquoi COUNT(*) et COUNT(commission) donnent-ils des résultats différents ?", en: "Why do COUNT(*) and COUNT(commission) give different results?" }, answer: { fr: "COUNT(*) compte les lignes, y compris celles où commission est NULL. COUNT(commission) ne compte que les valeurs renseignées.", en: "COUNT(*) counts rows, including those where commission is NULL. COUNT(commission) only counts non-null values." } },
      { question: { fr: "Dans une jointure externe, où placer un filtre sur la table optionnelle pour ne pas perdre de lignes ?", en: "In an outer join, where do you put a filter on the optional table so you do not lose rows?" }, answer: { fr: "Dans la clause ON. Placé dans le WHERE, il élimine les lignes où la table optionnelle est NULL et transforme la jointure externe en jointure interne.", en: "In the ON clause. Placed in the WHERE, it removes rows where the optional table is NULL and turns the outer join into an inner join." } },
      { question: { fr: "Pourquoi NATURAL JOIN est-il risqué en production ?", en: "Why is NATURAL JOIN risky in production?" }, answer: { fr: "Il joint sur toutes les colonnes de même nom. L'ajout d'une colonne commune, plus tard, change silencieusement le sens de la requête.", en: "It joins on every same-named column. Adding a common column later silently changes the meaning of the query." } },
    ],
  },
  "session-3": {
    keyTakeaways: [
      { fr: "Une table n'a qu'une clé primaire, mais peut avoir plusieurs clés étrangères et plusieurs contraintes UNIQUE.", en: "A table has one primary key, but may have several foreign keys and several UNIQUE constraints." },
      { fr: "UNIQUE tolère plusieurs NULL ; PRIMARY KEY n'en tolère aucun.", en: "UNIQUE tolerates several NULLs; PRIMARY KEY tolerates none." },
      { fr: "CHECK n'accepte ni fonction non déterministe (SYSDATE), ni sous-requête, ni pseudo-colonne.", en: "CHECK accepts no non-deterministic function (SYSDATE), no subquery and no pseudocolumn." },
      { fr: "ALTER TABLE … ADD (colonne type) — sans le mot-clé COLUMN, contrairement à DROP COLUMN.", en: "ALTER TABLE … ADD (column type) — without the COLUMN keyword, unlike DROP COLUMN." },
      { fr: "DELETE est annulable, TRUNCATE et DROP sont du DDL donc auto-validés.", en: "DELETE is reversible; TRUNCATE and DROP are DDL and therefore auto-committed." },
    ],
    selfCheck: [
      { question: { fr: "Vous devez garantir qu'un couple de colonnes est unique et jamais NULL. Deux solutions ?", en: "You must guarantee a column pair is unique and never NULL. Two solutions?" }, answer: { fr: "Une clé primaire composite sur les deux colonnes, ou une contrainte UNIQUE sur le couple assortie de NOT NULL sur chaque colonne.", en: "A composite primary key on both columns, or a UNIQUE constraint on the pair plus NOT NULL on each column." } },
      { question: { fr: "Quelle différence entre TRUNCATE et DELETE sans WHERE ?", en: "What is the difference between TRUNCATE and DELETE without a WHERE?" }, answer: { fr: "TRUNCATE est du DDL : rapide, auto-validé, ne déclenche pas les triggers, abaisse la HWM. DELETE est du DML : annulable, déclenche les triggers, laisse la HWM en place.", en: "TRUNCATE is DDL: fast, auto-committed, does not fire triggers, resets the HWM. DELETE is DML: reversible, fires triggers, leaves the HWM in place." } },
      { question: { fr: "Une contrainte peut-elle être désactivée temporairement ?", en: "Can a constraint be disabled temporarily?" }, answer: { fr: "Oui : ALTER TABLE … DISABLE CONSTRAINT, puis ENABLE. Pratique courante pour les chargements de masse. ENABLE VALIDATE revérifie les données existantes.", en: "Yes: ALTER TABLE … DISABLE CONSTRAINT, then ENABLE. Common practice for bulk loads. ENABLE VALIDATE re-checks existing data." } },
    ],
  },
  "session-4": {
    keyTakeaways: [
      { fr: "Une vue n'est modifiable que si elle est simple : une table, sans GROUP BY, DISTINCT, ROWNUM ni fonction de groupe.", en: "A view is only updatable when simple: one table, no GROUP BY, DISTINCT, ROWNUM or group function." },
      { fr: "WITH CHECK OPTION empêche de faire sortir une ligne du périmètre de la vue.", en: "WITH CHECK OPTION prevents pushing a row outside the view's scope." },
      { fr: "Un opérateur ensembliste n'admet qu'un ORDER BY, après la dernière requête.", en: "A set operator allows only one ORDER BY, after the last query." },
      { fr: "MINUS dépend de l'ordre des requêtes ; UNION et INTERSECT non.", en: "MINUS depends on query order; UNION and INTERSECT do not." },
      { fr: "Une fonction analytique conserve toutes les lignes, contrairement à GROUP BY.", en: "An analytic function keeps every row, unlike GROUP BY." },
    ],
    selfCheck: [
      { question: { fr: "RANK, DENSE_RANK et ROW_NUMBER : quelle différence sur une égalité ?", en: "RANK, DENSE_RANK and ROW_NUMBER: what differs on a tie?" }, answer: { fr: "RANK laisse un trou (1, 1, 3), DENSE_RANK n'en laisse pas (1, 1, 2), ROW_NUMBER n'a jamais d'ex æquo (1, 2, 3).", en: "RANK leaves a gap (1, 1, 3), DENSE_RANK does not (1, 1, 2), ROW_NUMBER never ties (1, 2, 3)." } },
      { question: { fr: "Que fait MERGE en une seule instruction ?", en: "What does MERGE do in a single statement?" }, answer: { fr: "Un « upsert » : ON définit la correspondance, WHEN MATCHED met à jour, WHEN NOT MATCHED insère. Une seule lecture de la source.", en: "An upsert: ON defines the match, WHEN MATCHED updates, WHEN NOT MATCHED inserts. A single pass over the source." } },
      { question: { fr: "UNION ou UNION ALL : lequel est plus rapide, et pourquoi ?", en: "UNION or UNION ALL: which is faster, and why?" }, answer: { fr: "UNION ALL, car il ne déduplique pas et évite donc le tri que UNION doit effectuer.", en: "UNION ALL, because it does not deduplicate and therefore avoids the sort UNION must perform." } },
    ],
  },
  "session-5": {
    keyTakeaways: [
      { fr: "Une sous-requête non corrélée s'exécute une fois ; une corrélée est réévaluée par ligne.", en: "A non-correlated subquery runs once; a correlated one is re-evaluated per row." },
      { fr: "Une sous-requête dans le SELECT doit être scalaire : au plus une ligne, une colonne.", en: "A subquery in the SELECT must be scalar: at most one row, one column." },
      { fr: "= , > , < seuls exigent une sous-requête mono-ligne ; IN, ANY et ALL acceptent plusieurs lignes.", en: "= , > , < alone require a single-row subquery; IN, ANY and ALL accept several rows." },
      { fr: "Les CTE se lisent de haut en bas et peuvent se référencer entre elles.", en: "CTEs read top to bottom and can reference one another." },
      { fr: "ROWNUM est affecté avant le tri : il faut trier dans une sous-requête, puis limiter.", en: "ROWNUM is assigned before sorting: sort in a subquery first, then limit." },
    ],
    selfCheck: [
      { question: { fr: "Quelle erreur produit une sous-requête mono-ligne qui renvoie plusieurs lignes ?", en: "Which error does a single-row subquery raise when it returns several rows?" }, answer: { fr: "ORA-01427 : single-row subquery returns more than one row. La parade est IN, ANY ou ALL.", en: "ORA-01427: single-row subquery returns more than one row. The fix is IN, ANY or ALL." } },
      { question: { fr: "Que signifie > ALL (sous-requête) ?", en: "What does > ALL (subquery) mean?" }, answer: { fr: "Supérieur à toutes les valeurs renvoyées, c'est-à-dire supérieur au maximum. > ANY signifie au contraire supérieur au minimum.", en: "Greater than every returned value, i.e. greater than the maximum. > ANY conversely means greater than the minimum." } },
      { question: { fr: "Écrivez les 5 employés les mieux payés, sans FETCH FIRST.", en: "Write the top 5 highest-paid employees, without FETCH FIRST." }, answer: { fr: "SELECT * FROM (SELECT * FROM employes ORDER BY salaire DESC) WHERE ROWNUM <= 5 — le tri doit précéder l'affectation de ROWNUM.", en: "SELECT * FROM (SELECT * FROM employees ORDER BY salary DESC) WHERE ROWNUM <= 5 — sorting must precede ROWNUM assignment." } },
    ],
  },
  "session-6": {
    keyTakeaways: [
      { fr: "CURRVAL n'est disponible qu'après un NEXTVAL dans la même session.", en: "CURRVAL is only available after a NEXTVAL in the same session." },
      { fr: "Une séquence laisse des trous : un ROLLBACK ne restitue pas le numéro consommé.", en: "A sequence leaves gaps: a ROLLBACK does not give the consumed number back." },
      { fr: "USER_ (mes objets), ALL_ (ceux auxquels j'accède), DBA_ (tous).", en: "USER_ (my objects), ALL_ (those I can access), DBA_ (everything)." },
      { fr: "Les noms d'objets sont stockés en MAJUSCULES dans le dictionnaire.", en: "Object names are stored in UPPERCASE in the dictionary." },
      { fr: "PRIMARY KEY et UNIQUE créent automatiquement leur index — inutile d'en ajouter un.", en: "PRIMARY KEY and UNIQUE automatically create their index — no need to add one." },
    ],
    selfCheck: [
      { question: { fr: "WHERE table_name = 'employes' ne renvoie rien dans USER_TABLES. Pourquoi ?", en: "WHERE table_name = 'employees' returns nothing in USER_TABLES. Why?" }, answer: { fr: "Les noms sont stockés en majuscules : il faut 'EMPLOYES', sauf si la table a été créée entre guillemets doubles.", en: "Names are stored in uppercase: use 'EMPLOYEES', unless the table was created inside double quotes." } },
      { question: { fr: "Vos requêtes filtrent sur UPPER(nom) et l'index sur nom n'est pas utilisé. Que faire ?", en: "Your queries filter on UPPER(name) and the index on name is not used. What do you do?" }, answer: { fr: "Créer un index basé sur fonction : CREATE INDEX … ON employes (UPPER(nom)).", en: "Create a function-based index: CREATE INDEX … ON employees (UPPER(name))." } },
      { question: { fr: "Quelle différence entre TIMESTAMP WITH TIME ZONE et WITH LOCAL TIME ZONE ?", en: "What differs between TIMESTAMP WITH TIME ZONE and WITH LOCAL TIME ZONE?" }, answer: { fr: "Le premier conserve le décalage tel qu'il a été saisi. Le second normalise au fuseau de la base et restitue dans celui de la session.", en: "The first keeps the offset exactly as entered. The second normalises to the database zone and renders in the session zone." } },
    ],
  },

  // ═══════════════════ OCP I — 1Z0-082 ═══════════════════
  "ocp1-session-1": {
    keyTakeaways: [
      { fr: "Instance = mémoire + processus ; base = fichiers. Les deux sont distincts.", en: "Instance = memory + processes; database = files. The two are distinct." },
      { fr: "LGWR écrit toujours avant DBWn : c'est le write-ahead logging.", en: "LGWR always writes before DBWn: that is write-ahead logging." },
      { fr: "Un COMMIT attend l'écriture du redo, jamais celle des blocs de données.", en: "A COMMIT waits for the redo write, never for the data blocks." },
      { fr: "Après un crash, SMON fait un roll forward puis un rollback ; la base s'ouvre dès la fin du roll forward.", en: "After a crash, SMON rolls forward then rolls back; the database opens as soon as the roll forward ends." },
      { fr: "PCTFREE réserve l'espace des futures mises à jour et prévient la migration de lignes.", en: "PCTFREE reserves room for future updates and prevents row migration." },
    ],
    selfCheck: [
      { question: { fr: "Différence entre chaînage et migration de lignes ?", en: "Difference between row chaining and row migration?" }, answer: { fr: "Le chaînage concerne une ligne trop grande pour un bloc dès l'insertion. La migration concerne une ligne qui grossit et déménage, laissant un pointeur dans son bloc d'origine.", en: "Chaining is a row too large for one block at insert time. Migration is a row that grows and moves, leaving a pointer in its original block." } },
      { question: { fr: "Pourquoi monter la base sans l'ouvrir ?", en: "Why mount the database without opening it?" }, answer: { fr: "Pour renommer ou restaurer un datafile, activer le mode ARCHIVELOG, ou effectuer une récupération RMAN — toutes opérations qui exigent le fichier de contrôle mais pas les datafiles ouverts.", en: "To rename or restore a data file, enable ARCHIVELOG mode, or run an RMAN recovery — all needing the control file but not open data files." } },
      { question: { fr: "PGA ou SGA : où vit la zone de tri d'une session ?", en: "PGA or SGA: where does a session's sort area live?" }, answer: { fr: "Dans la PGA, privée au processus serveur — sauf en mode serveur partagé, où la UGA migre dans la SGA (Large Pool).", en: "In the PGA, private to the server process — except in shared server mode, where the UGA moves into the SGA (Large Pool)." } },
    ],
  },
  "ocp1-session-2": {
    keyTakeaways: [
      { fr: "Seul SHUTDOWN ABORT impose une récupération d'instance au redémarrage.", en: "Only SHUTDOWN ABORT forces instance recovery at the next startup." },
      { fr: "SCOPE=MEMORY (volatile), SPFILE (au redémarrage), BOTH (les deux).", en: "SCOPE=MEMORY (volatile), SPFILE (at restart), BOTH (both)." },
      { fr: "Un paramètre statique n'accepte que SCOPE=SPFILE et exige un redémarrage.", en: "A static parameter only accepts SCOPE=SPFILE and requires a restart." },
      { fr: "Les vues V$ sont lisibles dès NOMOUNT ; les vues DBA_ exigent OPEN.", en: "V$ views are readable from NOMOUNT; DBA_ views require OPEN." },
      { fr: "L'ADR vit hors base : il reste consultable instance arrêtée.", en: "The ADR lives outside the database: it stays readable when the instance is down." },
    ],
    selfCheck: [
      { question: { fr: "Où Oracle place-t-il la racine ADR si DIAGNOSTIC_DEST n'est pas défini ?", en: "Where does Oracle put the ADR base when DIAGNOSTIC_DEST is not set?" }, answer: { fr: "Dans ORACLE_BASE si la variable existe, sinon dans $ORACLE_HOME/log.", en: "In ORACLE_BASE when that variable exists, otherwise in $ORACLE_HOME/log." } },
      { question: { fr: "Pourquoi SELECT sur DBA_TABLES échoue-t-il en état MOUNT ?", en: "Why does a SELECT on DBA_TABLES fail in MOUNT state?" }, answer: { fr: "Le dictionnaire de données réside dans le tablespace SYSTEM, qui n'est ouvert qu'à l'état OPEN.", en: "The data dictionary lives in the SYSTEM tablespace, which is only opened in the OPEN state." } },
      { question: { fr: "Quel outil consulter l'alert log en ligne de commande ?", en: "Which tool reads the alert log from the command line?" }, answer: { fr: "adrci, avec show alert -tail -f. Il permet aussi de lister les incidents et de constituer un paquet de diagnostic (ips pack).", en: "adrci, with show alert -tail -f. It also lists incidents and builds a diagnostic package (ips pack)." } },
    ],
  },
  "ocp1-session-3": {
    keyTakeaways: [
      { fr: "Sans quota sur un tablespace, aucun segment n'y est créable, même avec CREATE TABLE.", en: "Without a quota on a tablespace, no segment can be created there, even with CREATE TABLE." },
      { fr: "WITH ADMIN OPTION porte sur les privilèges système ; WITH GRANT OPTION sur les privilèges objet.", en: "WITH ADMIN OPTION applies to system privileges; WITH GRANT OPTION to object privileges." },
      { fr: "Révoquer un privilège objet donné WITH GRANT OPTION casse la chaîne ; pour WITH ADMIN OPTION, non.", en: "Revoking an object privilege granted WITH GRANT OPTION cascades; with WITH ADMIN OPTION, it does not." },
      { fr: "Un privilège reçu via un rôle ne permet pas de créer une vue ou une procédure.", en: "A privilege received through a role does not allow creating a view or a procedure." },
      { fr: "Les limites de mot de passe d'un profil s'appliquent toujours ; les limites de ressources dépendent de RESOURCE_LIMIT.", en: "A profile's password limits always apply; resource limits depend on RESOURCE_LIMIT." },
    ],
    selfCheck: [
      { question: { fr: "Quels types d'analyse DBMS_PRIVILEGE_CAPTURE propose-t-il ?", en: "Which analysis types does DBMS_PRIVILEGE_CAPTURE offer?" }, answer: { fr: "G_DATABASE (toute la base, administratifs compris), G_ROLE (via des rôles donnés), G_CONTEXT (selon une condition de session) et G_ROLE_AND_CONTEXT.", en: "G_DATABASE (whole database, administrative users included), G_ROLE (through given roles), G_CONTEXT (by a session condition) and G_ROLE_AND_CONTEXT." } },
      { question: { fr: "Pourquoi éviter le privilège UNLIMITED TABLESPACE ?", en: "Why avoid the UNLIMITED TABLESPACE privilege?" }, answer: { fr: "Il annule tous les quotas, sur tous les tablespaces : c'est l'inverse du moindre privilège. Préférez des quotas explicites.", en: "It overrides every quota on every tablespace: the opposite of least privilege. Prefer explicit quotas." } },
      { question: { fr: "Comment un rôle protégé par mot de passe s'active-t-il ?", en: "How is a password-protected role activated?" }, answer: { fr: "Il n'est pas dans les rôles par défaut : la session doit l'activer explicitement par SET ROLE nom IDENTIFIED BY mot_de_passe.", en: "It is not among the default roles: the session must enable it explicitly with SET ROLE name IDENTIFIED BY password." } },
    ],
  },
  "ocp1-session-4": {
    keyTakeaways: [
      { fr: "SYSTEM ne peut jamais être mis hors ligne ; SYSAUX héberge AWR.", en: "SYSTEM can never be taken offline; SYSAUX hosts AWR." },
      { fr: "L'undo sert au ROLLBACK, à la cohérence en lecture et aux technologies Flashback.", en: "Undo serves ROLLBACK, read consistency and the Flashback technologies." },
      { fr: "ORA-01555 signale un undo écrasé avant la fin d'une requête longue.", en: "ORA-01555 means undo was overwritten before a long query finished." },
      { fr: "RETENTION GUARANTEE fait échouer les nouvelles transactions plutôt que d'écraser l'undo.", en: "RETENTION GUARANTEE fails new transactions rather than overwriting undo." },
      { fr: "SHRINK SPACE exige le row movement ; CASCADE propage aux index dépendants.", en: "SHRINK SPACE requires row movement; CASCADE propagates to dependent indexes." },
    ],
    selfCheck: [
      { question: { fr: "Trois leviers contre ORA-01555 ?", en: "Three levers against ORA-01555?" }, answer: { fr: "Augmenter UNDO_RETENTION, agrandir le tablespace undo, ou activer RETENTION GUARANTEE — cette dernière option ayant un coût sur les nouvelles transactions.", en: "Raise UNDO_RETENTION, enlarge the undo tablespace, or enable RETENTION GUARANTEE — the last option costing new transactions." } },
      { question: { fr: "À quoi sert l'allocation reprenable ?", en: "What is resumable space allocation for?" }, answer: { fr: "À suspendre une opération à court d'espace au lieu de la faire échouer : l'administrateur agrandit le tablespace et la session reprend. Indispensable sur les chargements longs.", en: "To suspend an out-of-space operation instead of failing it: the administrator extends the tablespace and the session resumes. Essential for long loads." } },
      { question: { fr: "Différence entre COMPRESS BASIC et ROW STORE COMPRESS ADVANCED ?", en: "Difference between COMPRESS BASIC and ROW STORE COMPRESS ADVANCED?" }, answer: { fr: "BASIC ne compresse que les chargements en chemin direct. ADVANCED maintient la compression lors des DML ordinaires, au prix d'une licence supplémentaire.", en: "BASIC only compresses direct-path loads. ADVANCED maintains compression through ordinary DML, at the cost of an extra licence." } },
    ],
  },
  "ocp1-session-5": {
    keyTakeaways: [
      { fr: "L'enregistrement dynamique par PMON est le mode normal ; le statique sert aux instances arrêtées.", en: "Dynamic registration by PMON is the normal mode; static registration serves stopped instances." },
      { fr: "Easy Connect ne demande aucun fichier de configuration : hote:port/service.", en: "Easy Connect needs no configuration file: host:port/service." },
      { fr: "En serveur partagé, la UGA quitte la PGA pour le Large Pool de la SGA.", en: "In shared server mode, the UGA leaves the PGA for the SGA's Large Pool." },
      { fr: "RMAN et les tâches d'administration exigent une connexion en serveur dédié.", en: "RMAN and administration tasks require a dedicated server connection." },
    ],
    selfCheck: [
      { question: { fr: "Dans quel cas un enregistrement statique dans listener.ora reste-t-il indispensable ?", en: "When is a static listener.ora registration still required?" }, answer: { fr: "Pour se connecter à une instance arrêtée : STARTUP à distance, ou instance auxiliaire d'une duplication RMAN, qui démarre en NOMOUNT.", en: "To connect to a stopped instance: a remote STARTUP, or the auxiliary instance of an RMAN duplicate, which starts in NOMOUNT." } },
      { question: { fr: "Quelle commande vérifie les services publiés par l'écouteur ?", en: "Which command checks the services published by the listener?" }, answer: { fr: "lsnrctl services, ou lsnrctl status pour une vue synthétique.", en: "lsnrctl services, or lsnrctl status for a summary view." } },
    ],
  },
  "ocp1-session-6": {
    keyTakeaways: [
      { fr: "Data Pump s'exécute côté serveur : les fichiers sont écrits dans le DIRECTORY du serveur.", en: "Data Pump runs server-side: files are written to the server's DIRECTORY." },
      { fr: "Un objet DIRECTORY et le privilège READ sont les deux prérequis d'une table externe.", en: "A DIRECTORY object and the READ privilege are the two prerequisites of an external table." },
      { fr: "Une table externe est en lecture seule et sans index : le fichier est relu à chaque requête.", en: "An external table is read-only and index-free: the file is re-read on every query." },
      { fr: "NETWORK_LINK transfère directement entre deux bases, sans fichier intermédiaire.", en: "NETWORK_LINK transfers directly between two databases, with no intermediate file." },
    ],
    selfCheck: [
      { question: { fr: "Quelles permissions faut-il pour lire un fichier plat par table externe ?", en: "Which permissions are needed to read a flat file through an external table?" }, answer: { fr: "Un objet DIRECTORY pointant sur le répertoire du serveur, et le privilège READ dessus (WRITE en plus pour les fichiers journaux et de rejet).", en: "A DIRECTORY object pointing at the server directory, and the READ privilege on it (plus WRITE for log and bad files)." } },
      { question: { fr: "Comment reprendre un travail Data Pump interrompu ?", en: "How do you resume an interrupted Data Pump job?" }, answer: { fr: "En s'y rattachant avec ATTACH=nom_du_job, puis CONTINUE_CLIENT. Les travaux Data Pump sont reprenables par conception.", en: "By reconnecting with ATTACH=job_name, then CONTINUE_CLIENT. Data Pump jobs are restartable by design." } },
    ],
  },

  // ═══════════════════ OCP II — 1Z0-083 ═══════════════════
  "ocp2-session-1": {
    keyTakeaways: [
      { fr: "Une CDB partage instance, redo logs et fichier de contrôle ; chaque PDB a son dictionnaire.", en: "A CDB shares the instance, redo logs and control file; each PDB has its own dictionary." },
      { fr: "CDB$ROOT porte le CON_ID 1, PDB$SEED le 2, les PDB utilisateur 3 et au-delà.", en: "CDB$ROOT is CON_ID 1, PDB$SEED is 2, user PDBs are 3 and above." },
      { fr: "Le mode local undo conditionne le clonage à chaud, Flashback PDB et le PITR d'une PDB.", en: "Local undo mode is what enables hot cloning, Flashback PDB and PDB point-in-time recovery." },
      { fr: "Depuis une PDB, une vue CDB_ ne montre que le conteneur courant.", en: "From inside a PDB, a CDB_ view only shows the current container." },
    ],
    selfCheck: [
      { question: { fr: "Qu'est-ce qui reste au niveau de la CDB et ne peut pas être propre à une PDB ?", en: "What stays at CDB level and cannot belong to a single PDB?" }, answer: { fr: "L'instance, la SGA, les processus, les redo logs et le fichier de contrôle. TEMP et UNDO peuvent, eux, devenir locaux.", en: "The instance, SGA, processes, redo logs and control file. TEMP and UNDO, by contrast, can become local." } },
      { question: { fr: "Comment savoir dans quel conteneur on se trouve ?", en: "How do you know which container you are in?" }, answer: { fr: "SHOW CON_NAME en SQL*Plus, ou SELECT SYS_CONTEXT('USERENV','CON_NAME') FROM DUAL.", en: "SHOW CON_NAME in SQL*Plus, or SELECT SYS_CONTEXT('USERENV','CON_NAME') FROM DUAL." } },
    ],
  },
  "ocp2-session-2": {
    keyTakeaways: [
      { fr: "Après un branchement, PDB_PLUG_IN_VIOLATIONS doit toujours être interrogée.", en: "After plugging in, PDB_PLUG_IN_VIOLATIONS must always be queried." },
      { fr: "Une violation de niveau ERROR force l'ouverture en mode RESTRICTED.", en: "An ERROR-level violation forces a RESTRICTED open." },
      { fr: "COPY (défaut), MOVE et NOCOPY décident du sort des fichiers au branchement.", en: "COPY (default), MOVE and NOCOPY decide what happens to the files when plugging in." },
      { fr: "Sans SAVE STATE, un STARTUP de la CDB laisse les PDB en MOUNTED.", en: "Without SAVE STATE, a CDB STARTUP leaves the PDBs in MOUNTED." },
      { fr: "SHARING = METADATA partage la structure ; DATA partage aussi les lignes, en lecture seule.", en: "SHARING = METADATA shares the structure; DATA also shares the rows, read-only." },
    ],
    selfCheck: [
      { question: { fr: "À quoi sert la clause USER_TABLESPACES ?", en: "What is the USER_TABLESPACES clause for?" }, answer: { fr: "À choisir les tablespaces embarqués lors d'une conversion non-CDB → PDB ou d'un clonage : liste explicite, ou ALL EXCEPT. Les exclus sont créés hors ligne et vides.", en: "To choose which tablespaces come along in a non-CDB → PDB conversion or a clone: an explicit list, or ALL EXCEPT. Excluded ones are created offline and empty." } },
      { question: { fr: "Comment vérifier qu'une PDB pourra être branchée avant de la brancher ?", en: "How do you check a PDB can be plugged in before plugging it?" }, answer: { fr: "DBMS_PDB.CHECK_PLUG_COMPATIBILITY sur le manifeste XML, puis lecture de PDB_PLUG_IN_VIOLATIONS.", en: "DBMS_PDB.CHECK_PLUG_COMPATIBILITY on the XML manifest, then read PDB_PLUG_IN_VIOLATIONS." } },
      { question: { fr: "Qu'est-ce qu'un clone rafraîchissable ?", en: "What is a refreshable clone?" }, answer: { fr: "Une PDB clonée d'une source distante et resynchronisée périodiquement (REFRESH MODE EVERY n MINUTES). Elle reste en lecture seule entre deux rafraîchissements.", en: "A PDB cloned from a remote source and periodically resynchronised (REFRESH MODE EVERY n MINUTES). It stays read-only between refreshes." } },
    ],
  },
  "ocp2-session-3": {
    keyTakeaways: [
      { fr: "Un utilisateur commun se crée depuis CDB$ROOT et porte le préfixe C## ou U##.", en: "A common user is created from CDB$ROOT and carries the C## or U## prefix." },
      { fr: "CONTAINER = ALL n'agit pas rétroactivement sur les PDB branchées plus tard.", en: "CONTAINER = ALL does not act retroactively on PDBs plugged in later." },
      { fr: "CONTAINER_DATA restreint ce qu'un utilisateur commun voit dans les vues CDB_ et V$.", en: "CONTAINER_DATA restricts what a common user sees in CDB_ and V$ views." },
      { fr: "Depuis la 12.2, chaque PDB peut disposer de son propre portefeuille de chiffrement.", en: "Since 12.2, each PDB can have its own encryption keystore." },
    ],
    selfCheck: [
      { question: { fr: "Peut-on créer un utilisateur local depuis CDB$ROOT ?", en: "Can you create a local user from CDB$ROOT?" }, answer: { fr: "Non. Un utilisateur local se crée obligatoirement depuis la PDB concernée. Depuis la racine, seuls les utilisateurs communs sont créables.", en: "No. A local user must be created from inside its PDB. From the root, only common users can be created." } },
      { question: { fr: "Un privilège accordé CONTAINER = CURRENT depuis la racine s'applique où ?", en: "A privilege granted CONTAINER = CURRENT from the root applies where?" }, answer: { fr: "Dans la racine seulement. Pour qu'il vaille partout, il faut CONTAINER = ALL.", en: "In the root only. For it to apply everywhere, use CONTAINER = ALL." } },
    ],
  },
  "ocp2-session-4": {
    keyTakeaways: [
      { fr: "ARCHIVELOG est la condition de toute sauvegarde à chaud et de tout PITR.", en: "ARCHIVELOG is the precondition for any hot backup and any PITR." },
      { fr: "L'autobackup du fichier de contrôle est le réglage RMAN le plus important.", en: "Control file autobackup is the single most important RMAN setting." },
      { fr: "Différentielle : depuis le dernier niveau 0 ou 1. Cumulative : depuis le dernier niveau 0.", en: "Differential: since the last level 0 or 1. Cumulative: since the last level 0." },
      { fr: "Le block change tracking évite de relire toute la base lors d'une incrémentale.", en: "Block change tracking avoids rescanning the whole database for an incremental." },
      { fr: "La configuration RMAN est persistante : elle vit dans le fichier de contrôle.", en: "RMAN configuration is persistent: it lives in the control file." },
    ],
    selfCheck: [
      { question: { fr: "Jeu de sauvegarde ou copie d'image : que choisir, et pourquoi ?", en: "Backup set or image copy: which one, and why?" }, answer: { fr: "Le jeu de sauvegarde compresse et saute les blocs vides — plus compact. La copie d'image est utilisable immédiatement par SWITCH, sans restauration — plus rapide à remettre en service.", en: "A backup set compresses and skips empty blocks — more compact. An image copy can be used immediately via SWITCH, with no restore — faster to bring back online." } },
      { question: { fr: "Comment améliorer le débit de lecture d'une sauvegarde RMAN compressée ?", en: "How do you improve the read throughput of a compressed RMAN backup?" }, answer: { fr: "Activer l'E/S asynchrone et augmenter le multiplexage RMAN, ainsi que la taille des tampons d'E/S bande le cas échéant.", en: "Enable asynchronous I/O and raise RMAN multiplexing, plus tape I/O buffer size where relevant." } },
      { question: { fr: "Que fait RECOVER COPY OF DATABASE WITH TAG ?", en: "What does RECOVER COPY OF DATABASE WITH TAG do?" }, answer: { fr: "Il applique une incrémentale de niveau 1 sur une copie d'image existante, la maintenant à jour en continu. C'est la stratégie à récupération incrémentale.", en: "It applies a level 1 incremental onto an existing image copy, keeping it continuously current. That is the incrementally updated backup strategy." } },
    ],
  },
  "ocp2-session-5": {
    keyTakeaways: [
      { fr: "Le Data Recovery Advisor n'est disponible ni en RAC, ni sur une base de secours.", en: "The Data Recovery Advisor is available neither on RAC nor on a standby database." },
      { fr: "Un datafile non critique se restaure base ouverte, après mise hors ligne.", en: "A non-critical data file is restored with the database open, after taking it offline." },
      { fr: "SYSTEM et UNDO exigent une base en MOUNT.", en: "SYSTEM and UNDO require the database in MOUNT." },
      { fr: "Toute récupération incomplète se termine par OPEN RESETLOGS et impose une sauvegarde complète.", en: "Every incomplete recovery ends with OPEN RESETLOGS and requires a full backup afterwards." },
      { fr: "La récupération de blocs se fait base ouverte, sans mise hors ligne.", en: "Block media recovery runs with the database open, with nothing taken offline." },
    ],
    selfCheck: [
      { question: { fr: "Quel enchaînement RMAN pour restaurer après la perte de tous les fichiers de contrôle ?", en: "Which RMAN sequence restores after losing every control file?" }, answer: { fr: "STARTUP NOMOUNT, RESTORE CONTROLFILE FROM AUTOBACKUP, ALTER DATABASE MOUNT, RECOVER DATABASE, ALTER DATABASE OPEN RESETLOGS.", en: "STARTUP NOMOUNT, RESTORE CONTROLFILE FROM AUTOBACKUP, ALTER DATABASE MOUNT, RECOVER DATABASE, ALTER DATABASE OPEN RESETLOGS." } },
      { question: { fr: "Que faut-il pour un PITR d'une seule PDB ?", en: "What is required for a single-PDB PITR?" }, answer: { fr: "Le mode local undo, et une destination auxiliaire (AUXILIARY DESTINATION) où RMAN monte une instance temporaire. Les autres PDB restent disponibles.", en: "Local undo mode, and an AUXILIARY DESTINATION where RMAN builds a temporary instance. The other PDBs stay available." } },
      { question: { fr: "Après RESTORE DATABASE PREVIEW, qu'apprend-on ?", en: "What does RESTORE DATABASE PREVIEW tell you?" }, answer: { fr: "Quelles sauvegardes RMAN utiliserait, sans rien restaurer. C'est le contrôle à faire avant toute opération réelle.", en: "Which backups RMAN would use, without restoring anything. It is the check to run before any real operation." } },
    ],
  },
  "ocp2-session-6": {
    keyTakeaways: [
      { fr: "Quatre fonctions Flashback dépendent de l'undo : leur horizon est borné par UNDO_RETENTION.", en: "Four Flashback features depend on undo: their horizon is bounded by UNDO_RETENTION." },
      { fr: "Flashback Database repose sur les journaux flashback, pas sur l'undo.", en: "Flashback Database relies on flashback logs, not on undo." },
      { fr: "Flashback Table exige ENABLE ROW MOVEMENT au préalable.", en: "Flashback Table requires ENABLE ROW MOVEMENT beforehand." },
      { fr: "Un point de restauration garanti retient les journaux même si la FRA se remplit.", en: "A guaranteed restore point retains the logs even if the FRA fills up." },
      { fr: "Flashback Data Archive est la seule voie pour un historique de longue durée.", en: "Flashback Data Archive is the only route to long-term history." },
    ],
    selfCheck: [
      { question: { fr: "Vous devez pouvoir revenir en arrière avant une migration risquée. Quelle méthode, et pourquoi ?", en: "You need a way back before a risky migration. Which method, and why?" }, answer: { fr: "Un point de restauration garanti puis FLASHBACK DATABASE : bien plus rapide qu'une restauration complète, à condition de surveiller l'espace de la FRA.", en: "A guaranteed restore point then FLASHBACK DATABASE: far faster than a full restore, provided you watch the FRA space." } },
      { question: { fr: "Quelle fonction Flashback ne dépend ni de l'undo ni des journaux flashback ?", en: "Which Flashback feature depends neither on undo nor on flashback logs?" }, answer: { fr: "Flashback Drop, qui s'appuie sur la corbeille — et Flashback Data Archive, qui dispose de son propre stockage d'historique.", en: "Flashback Drop, which relies on the recycle bin — and Flashback Data Archive, which has its own history store." } },
    ],
  },
  "ocp2-session-7": {
    keyTakeaways: [
      { fr: "L'instance auxiliaire d'une duplication démarre en NOMOUNT, avec fichier de mots de passe.", en: "The auxiliary instance of a duplicate starts in NOMOUNT, with a password file." },
      { fr: "NOFILENAMECHECK s'impose quand source et cible partagent les mêmes chemins.", en: "NOFILENAMECHECK is required when source and target share the same paths." },
      { fr: "Un jeu de tablespaces transportables doit être autonome — DBMS_TTS.TRANSPORT_SET_CHECK.", en: "A transportable tablespace set must be self-contained — DBMS_TTS.TRANSPORT_SET_CHECK." },
      { fr: "Le tablespace doit passer en READ ONLY le temps du transport.", en: "The tablespace must go READ ONLY for the duration of the transport." },
      { fr: "Endianness différente entre plateformes ⇒ RMAN CONVERT obligatoire.", en: "Different endianness across platforms ⇒ RMAN CONVERT is mandatory." },
    ],
    selfCheck: [
      { question: { fr: "Comment vérifier la compatibilité de deux plateformes avant un transport ?", en: "How do you check two platforms are compatible before a transport?" }, answer: { fr: "SELECT platform_name, endian_format FROM v$transportable_platform. Si les formats diffèrent, RMAN CONVERT est requis.", en: "SELECT platform_name, endian_format FROM v$transportable_platform. If formats differ, RMAN CONVERT is required." } },
      { question: { fr: "Duplication active ou depuis les sauvegardes : quand choisir laquelle ?", en: "Active duplicate or from backups: when do you pick which?" }, answer: { fr: "Active si la source est joignable et la charge réseau acceptable, sans sauvegarde préalable. Depuis les sauvegardes si l'on veut épargner la production ou dupliquer à une date passée.", en: "Active when the source is reachable and network load acceptable, with no prior backup. From backups when sparing production or duplicating to a past date." } },
    ],
  },
  "ocp2-session-8": {
    keyTakeaways: [
      { fr: "Le RPM de pré-installation crée les comptes et groupes et règle les paramètres noyau.", en: "The preinstall RPM creates the accounts and groups and sets kernel parameters." },
      { fr: "Sous Oracle Restart, gérez les ressources par srvctl, jamais à la main.", en: "Under Oracle Restart, manage resources with srvctl, never by hand." },
      { fr: "opatch traite les binaires ; datapatch traite le dictionnaire. Les deux sont nécessaires.", en: "opatch handles the binaries; datapatch handles the dictionary. Both are needed." },
      { fr: "Les Release Updates trimestriels sont la voie de correction recommandée.", en: "Quarterly Release Updates are the recommended patching path." },
      { fr: "Débrancher une PDB et la brancher dans une CDB plus récente la met à niveau.", en: "Unplugging a PDB and plugging it into a newer CDB upgrades it." },
    ],
    selfCheck: [
      { question: { fr: "Vous avez appliqué un RU par opatch, la base démarre mais des objets sont invalides. Qu'avez-vous oublié ?", en: "You applied an RU with opatch, the database starts but objects are invalid. What did you skip?" }, answer: { fr: "datapatch, qui applique le volet SQL du correctif au dictionnaire. Puis utlrp.sql pour recompiler les objets invalides.", en: "datapatch, which applies the SQL part of the patch to the dictionary. Then utlrp.sql to recompile invalid objects." } },
      { question: { fr: "Comment vérifier les correctifs SQL réellement appliqués ?", en: "How do you check which SQL patches were actually applied?" }, answer: { fr: "SELECT patch_id, action, status FROM dba_registry_sqlpatch. opatch lsinventory ne montre, lui, que le volet binaire.", en: "SELECT patch_id, action, status FROM dba_registry_sqlpatch. opatch lsinventory only shows the binary side." } },
    ],
  },
  "ocp2-session-9": {
    keyTakeaways: [
      { fr: "Les alertes sont générées par MMON, pas par SMON.", en: "Alerts are generated by MMON, not SMON." },
      { fr: "Une alerte avec état s'efface seule et rejoint DBA_ALERT_HISTORY ; une alerte sans état y va directement.", en: "A stateful alert clears itself and moves to DBA_ALERT_HISTORY; a stateless alert goes there directly." },
      { fr: "STATISTICS_LEVEL doit valoir TYPICAL ou ALL — TYPICAL suffit, contrairement à une idée reçue.", en: "STATISTICS_LEVEL must be TYPICAL or ALL — TYPICAL is enough, contrary to a common belief." },
      { fr: "ADDM s'exécute automatiquement après chaque instantané AWR.", en: "ADDM runs automatically after every AWR snapshot." },
      { fr: "Un plan aberrant vient neuf fois sur dix de statistiques absentes ou périmées.", en: "A wild execution plan comes nine times out of ten from missing or stale statistics." },
    ],
    selfCheck: [
      { question: { fr: "Où consulter une alerte d'espace qui s'est résolue toute seule ?", en: "Where do you find a space alert that resolved on its own?" }, answer: { fr: "Dans DBA_ALERT_HISTORY : les alertes avec état quittent DBA_OUTSTANDING_ALERTS dès que la cause disparaît.", en: "In DBA_ALERT_HISTORY: stateful alerts leave DBA_OUTSTANDING_ALERTS as soon as the cause is gone." } },
      { question: { fr: "AWR, ASH, ADDM : lequel pour quoi ?", en: "AWR, ASH, ADDM: which for what?" }, answer: { fr: "AWR conserve des instantanés périodiques, ASH échantillonne les sessions actives à la seconde, ADDM diagnostique automatiquement l'intervalle entre deux instantanés.", en: "AWR keeps periodic snapshots, ASH samples active sessions every second, ADDM automatically diagnoses the interval between two snapshots." } },
      { question: { fr: "Comment figer un plan d'exécution validé ?", en: "How do you freeze a validated execution plan?" }, answer: { fr: "Par SQL Plan Management : créer une baseline acceptée pour l'instruction, ce qui empêche l'optimiseur de régresser vers un plan moins bon.", en: "Through SQL Plan Management: create an accepted baseline for the statement, preventing the optimizer from regressing to a worse plan." } },
    ],
  },
};
