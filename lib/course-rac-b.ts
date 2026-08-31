import type { CourseSession } from "./course-oca-sql";

/**
 * Cursus 1Z0-078 — sessions 7 à 12.
 *
 * Ces six sessions couvrent les domaines officiels que les six premières
 * n'abordaient pas : Flex ASM et les sujets avancés d'Oracle CloudFS,
 * l'installation et l'administration d'une base RAC, la haute disponibilité
 * des connexions, RAC One Node et la qualité de service, le multitenant en
 * cluster, puis les Flex Clusters, la gestion par politiques et la haute
 * disponibilité applicative.
 */
export const racSessionsB: CourseSession[] = [
  {
    id: "rac-session-7",
    number: 7,
    title: { fr: "Flex ASM et Oracle CloudFS avancé", en: "Flex ASM and advanced Oracle CloudFS" },
    summary: {
      fr: "Depuis la 12c, une instance ASM n'est plus obligatoire sur chaque nœud : les bases se connectent à distance. Et ACFS n'est plus un simple système de fichiers partagé — il chiffre, audite, réplique et étiquette.",
      en: "Since 12c, an ASM instance is no longer required on every node: databases connect remotely. And ACFS is no longer a mere shared file system — it encrypts, audits, replicates and tags.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "rac-7-1",
        number: "7.1",
        title: { fr: "Flex ASM : le problème qu'il résout", en: "Flex ASM: the problem it solves" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Dans un cluster classique, chaque nœud porte sa propre instance ASM, et les bases de ce nœud en dépendent entièrement. Si l'instance ASM tombe, **toutes** les instances de base du nœud tombent avec elle : une panne locale devient une indisponibilité complète du nœud. Flex ASM casse ce couplage — une instance de base peut se connecter à l'instance ASM d'un **autre** nœud, par le réseau ASM.",
              en: "In a classic cluster every node carries its own ASM instance, and that node's databases depend on it entirely. If the ASM instance goes down, **every** database instance on the node goes with it: a local failure becomes a full node outage. Flex ASM breaks that coupling — a database instance can connect to **another** node's ASM instance, over the ASM network.",
            },
          },
          {
            kind: "figure",
            src: "/art/oracle-flex-asm.svg",
            alt: {
              fr: "Comparaison entre ASM classique, une instance par nœud, et Flex ASM où trois instances ASM servent un nombre quelconque de nœuds par le réseau ASM",
              en: "Comparison between classic ASM with one instance per node and Flex ASM where three ASM instances serve any number of nodes over the ASM network",
            },
            caption: {
              fr: "En Flex ASM, le nombre d'instances ASM (cardinalité, 3 par défaut) est indépendant du nombre de nœuds. Un nœud sans instance ASM locale reste pleinement opérationnel.",
              en: "In Flex ASM the number of ASM instances (cardinality, 3 by default) is independent of the number of nodes. A node with no local ASM instance stays fully operational.",
            },
            width: 800,
            height: 460,
          },
          {
            kind: "table",
            title: { fr: "Ce que Flex ASM change", en: "What Flex ASM changes" },
            headers: [
              { fr: "", en: "" },
              { fr: "ASM classique", en: "Classic ASM" },
              { fr: "Flex ASM", en: "Flex ASM" },
            ],
            rows: [
              [
                { fr: "Instances ASM", en: "ASM instances" },
                { fr: "Une par nœud, obligatoirement", en: "One per node, mandatorily" },
                { fr: "Cardinalité fixée — 3 par défaut, ALL possible", en: "A set cardinality — 3 by default, ALL possible" },
              ],
              [
                { fr: "Perte de l'instance ASM locale", en: "Loss of the local ASM instance" },
                { fr: "**Toutes les bases du nœud tombent**", en: "**Every database on the node goes down**" },
                { fr: "Les bases se rattachent à une autre instance ASM", en: "Databases reattach to another ASM instance" },
              ],
              [
                { fr: "Réseau", en: "Network" },
                { fr: "Interconnexion privée seule", en: "Private interconnect only" },
                { fr: "Réseau ASM, éventuellement dédié", en: "An ASM network, optionally dedicated" },
              ],
              [
                { fr: "Montée en charge", en: "Scalability" },
                { fr: "Limitée par le nombre d'instances ASM", en: "Bounded by the number of ASM instances" },
                { fr: "Des dizaines de nœuds pour trois instances ASM", en: "Dozens of nodes for three ASM instances" },
              ],
            ],
          },
          {
            kind: "code",
            title: { fr: "Vérifier, configurer, exploiter", en: "Check, configure, operate" },
            code: `# Flex ASM est-il actif ?
$ asmcmd showclustermode
ASM cluster : Flex mode enabled

$ srvctl config asm
$ srvctl status asm -detail

# Changer la cardinalite : nombre d'instances ASM a maintenir
$ srvctl modify asm -count 4
$ srvctl modify asm -count ALL      # une instance par noeud

# Le reseau ASM
$ srvctl config asmnetwork
$ oifcfg getif                       # public / cluster_interconnect / asm

-- Quelles bases sont servies par quelle instance ASM ?
SELECT inst_id, instance_name, db_name, status, con_id
FROM   gv$asm_client ORDER BY inst_id;

-- Combien de connexions chaque instance ASM porte-t-elle ?
SELECT inst_id, COUNT(*) AS clients FROM gv$asm_client GROUP BY inst_id;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Flex ASM exige `COMPATIBLE.ASM` à 12.1 ou plus sur tous les groupes de disques, et une Grid Infrastructure elle-même en 12.1+. Un groupe de disques resté en compatibilité 11.2 empêche l'activation du mode Flex — et le message d'erreur ne le dit pas clairement.",
              en: "Flex ASM requires `COMPATIBLE.ASM` at 12.1 or higher on every disk group, and a Grid Infrastructure itself at 12.1+. A disk group left at 11.2 compatibility blocks Flex mode — and the error message does not say so clearly.",
            },
          },
          {
            kind: "code",
            code: `-- Verifier la compatibilite de chaque groupe
SELECT name, compatibility AS compat_asm, database_compatibility AS compat_rdbms
FROM   v$asm_diskgroup;

-- La relever -- operation IRREVERSIBLE
ALTER DISKGROUP data SET ATTRIBUTE 'compatible.asm' = '19.0.0.0';
ALTER DISKGROUP data SET ATTRIBUTE 'compatible.rdbms' = '19.0.0.0';`,
          },
        ],
      },
      {
        id: "rac-7-2",
        number: "7.2",
        title: { fr: "ASM Dynamic Volume Manager et volumes", en: "ASM Dynamic Volume Manager and volumes" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "ADVM transforme un groupe de disques ASM en gestionnaire de volumes générique : il expose des périphériques blocs `/dev/asm/<volume>-<n>` que le système d'exploitation utilise comme n'importe quel disque. C'est la couche sur laquelle ACFS s'appuie — et elle hérite gratuitement de la répartition et de la redondance d'ASM.",
              en: "ADVM turns an ASM disk group into a general-purpose volume manager: it exposes block devices `/dev/asm/<volume>-<n>` that the operating system uses like any disk. It is the layer ACFS sits on — and it inherits ASM's striping and redundancy for free.",
            },
          },
          {
            kind: "code",
            code: `-- Le pilote doit etre charge
$ acfsdriverstate installed
$ acfsdriverstate loaded
$ acfsdriverstate version

-- Creer un volume dans un groupe de disques
ASMCMD> volcreate -G DATA -s 50G --redundancy mirror acfsvol1
ASMCMD> volinfo -G DATA acfsvol1
ASMCMD> volenable -G DATA acfsvol1
ASMCMD> volresize -G DATA -s 80G acfsvol1
ASMCMD> voldisable -G DATA acfsvol1
ASMCMD> voldelete -G DATA acfsvol1

-- En SQL, depuis l'instance ASM
ALTER DISKGROUP data ADD VOLUME acfsvol2 SIZE 20G;
SELECT volume_name, volume_device, size_mb, state, usage
FROM   v$asm_volume;
SELECT volume_name, reads, writes, read_time, write_time
FROM   v$asm_volume_stat;`,
          },
          {
            kind: "tip",
            body: {
              fr: "La taille d'un volume ADVM est toujours arrondie au multiple supérieur de l'unité d'allocation du volume, elle-même dérivée de l'AU du groupe de disques. Demander 50 Go peut donc en donner 50,25 : c'est normal, et `volinfo` affiche la taille réellement allouée.",
              en: "An ADVM volume's size is always rounded up to a multiple of the volume allocation unit, itself derived from the disk group's AU. Asking for 50 GB may therefore give 50.25: that is normal, and `volinfo` shows the size actually allocated.",
            },
          },
        ],
      },
      {
        id: "rac-7-3",
        number: "7.3",
        title: { fr: "ACFS : instantanés, chiffrement, audit", en: "ACFS: snapshots, encryption, auditing" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Instantanés", en: "Snapshots" },
            code: `# Un instantane est quasi instantane et n'occupe d'abord aucun espace :
# seules les differences ulterieures consomment.
# acfsutil snap create -w avant_maj /u02/acfs      # lecture-ecriture
# acfsutil snap create      photo_j1 /u02/acfs      # lecture seule
# acfsutil snap info /u02/acfs
# acfsutil snap delete avant_maj /u02/acfs

# Instantanes automatiques, selon une politique
# acfsutil snap policy add -f hebdo -n 8 /u02/acfs

# Convertir un instantane en lecture seule vers lecture-ecriture
# acfsutil snap convert -w photo_j1 /u02/acfs

# Remonter le systeme de fichiers a l'etat d'un instantane
# acfsutil snap dup apply /u02/acfs`,
            caption: {
              fr: "Un instantané en lecture-écriture posé avant une mise à jour applicative donne un retour arrière en quelques secondes, là où une restauration de sauvegarde prendrait des heures.",
              en: "A read-write snapshot taken before an application upgrade gives a rollback in seconds, where restoring a backup would take hours.",
            },
          },
          {
            kind: "code",
            title: { fr: "Chiffrement au repos", en: "Encryption at rest" },
            code: `# 1. Initialiser le magasin de cles (une fois par cluster)
# acfsutil encr init -p

# 2. Activer le chiffrement sur le systeme de fichiers
# acfsutil encr set -a AES -k 256 /u02/acfs
# acfsutil encr on  /u02/acfs

# 3. Chiffrer un sous-arbre seulement
# acfsutil encr on /u02/acfs/donnees_sensibles

# 4. Verifier
# acfsutil encr info -v /u02/acfs

# Renouveler la cle sans interruption de service
# acfsutil encr rekey -v /u02/acfs`,
          },
          {
            kind: "code",
            title: { fr: "Audit et étiquetage", en: "Auditing and tagging" },
            code: `# Audit : qui a lu ou modifie quoi
# acfsutil audit init
# acfsutil audit enable /u02/acfs
# acfsutil audit info /u02/acfs
# acfsutil audit read -m /u02/acfs

# Etiquetage : marquer des fichiers pour les traiter en lot.
# Les etiquettes servent notamment a definir ce qui est replique.
# acfsutil tag set     compta /u02/acfs/factures
# acfsutil tag info -r /u02/acfs
# acfsutil tag unset   compta /u02/acfs/factures/2019`,
            caption: {
              fr: "L'étiquetage n'est pas cosmétique : c'est le mécanisme qui permet de répliquer, chiffrer ou auditer un sous-ensemble de fichiers défini par un critère métier plutôt que par une arborescence.",
              en: "Tagging is not cosmetic: it is the mechanism that lets you replicate, encrypt or audit a subset of files defined by a business criterion rather than by a directory tree.",
            },
          },
        ],
      },
      {
        id: "rac-7-4",
        number: "7.4",
        title: { fr: "Réplication ACFS et haute disponibilité NFS", en: "ACFS replication and NFS high availability" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "La réplication ACFS entretient une copie d'un système de fichiers sur un cluster distant, en transmettant les changements en continu. Depuis la 12.2, elle s'appuie sur les instantanés plutôt que sur un journal : le site de secours est cohérent à chaque instant, et le mécanisme supporte des interruptions réseau sans repartir de zéro.",
              en: "ACFS replication maintains a copy of a file system on a remote cluster, streaming changes continuously. Since 12.2 it is snapshot-based rather than log-based: the standby site is consistent at every instant, and the mechanism survives network outages without starting over.",
            },
          },
          {
            kind: "code",
            code: `# Sur le site de SECOURS : preparer la destination
# acfsutil repl init standby -u oracle -m /u02/acfs_sb \\
#     -c site_primaire /u02/acfs_sb

# Sur le site PRIMAIRE : demarrer la replication
# acfsutil repl init primary -m /u02/acfs \\
#     -s oracle@site_secours -m /u02/acfs_sb -i 15m /u02/acfs

# Suivi
# acfsutil repl info -c -v /u02/acfs
# acfsutil repl info -s    /u02/acfs      # statistiques de transfert

# Bascule et retour
# acfsutil repl failover /u02/acfs_sb
# acfsutil repl reverse  /u02/acfs_sb
# acfsutil repl pause  /u02/acfs
# acfsutil repl resume /u02/acfs
# acfsutil repl terminate primary /u02/acfs`,
          },
          {
            kind: "tip",
            title: { fr: "Haute disponibilité NFS", en: "NFS high availability" },
            body: {
              fr: "ACFS peut être exporté en NFS depuis le cluster, avec une adresse virtuelle gérée par Clusterware : si le nœud exportateur tombe, la VIP HANFS migre et les clients NFS ne voient qu'une brève suspension. C'est la façon de fournir un partage de fichiers hautement disponible sans matériel spécialisé.",
              en: "ACFS can be exported over NFS from the cluster, with a virtual address managed by Clusterware: if the exporting node fails, the HANFS VIP migrates and NFS clients see only a brief stall. It is how you provide a highly available file share without specialised hardware.",
            },
          },
          {
            kind: "code",
            code: `# 1. Une VIP dediee a l'export
$ srvctl add havip -id hanfs1 -address 10.20.30.44 -netnum 1
$ srvctl start havip -id hanfs1

# 2. L'export lui-meme, rattache a cette VIP
$ srvctl add exportfs -name export_compta -id hanfs1 \\
    -path /u02/acfs/compta -options "rw,sync,no_root_squash"
$ srvctl start exportfs -name export_compta

$ srvctl status havip -id hanfs1
$ srvctl status exportfs -name export_compta`,
          },
        ],
      },
    ],
  },

  {
    id: "rac-session-8",
    number: 8,
    title: { fr: "Installer et administrer une base RAC", en: "Installing and administering a RAC database" },
    summary: {
      fr: "Une base RAC est une seule base avec plusieurs instances. Tout ce qui est unique — fichiers de données, fichier de contrôle — est partagé ; tout ce qui est par instance — thread de redo, undo, numéro d'instance — doit être déclaré séparément.",
      en: "A RAC database is one database with several instances. Everything unique — data files, control file — is shared; everything per-instance — redo thread, undo, instance number — must be declared separately.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "rac-8-1",
        number: "8.1",
        title: { fr: "Installer le logiciel et créer la base", en: "Installing the software and creating the database" },
        blocks: [
          {
            kind: "list",
            title: { fr: "L'ordre des opérations", en: "The order of operations" },
            items: [
              { fr: "Grid Infrastructure d'abord, sur tous les nœuds — la base en dépend", en: "Grid Infrastructure first, on every node — the database depends on it" },
              { fr: "Vérifier le cluster : `cluvfy stage -pre dbinst -n node1,node2`", en: "Verify the cluster: `cluvfy stage -pre dbinst -n node1,node2`" },
              { fr: "Installer le logiciel Oracle Database en mode cluster, sous l'utilisateur `oracle`", en: "Install the Oracle Database software in cluster mode, as the `oracle` user" },
              { fr: "Créer la base par DBCA en choisissant « Oracle Real Application Clusters database »", en: "Create the database with DBCA, choosing “Oracle Real Application Clusters database”" },
              { fr: "Vérifier après coup : `srvctl status database`, `crsctl stat res -t`", en: "Verify afterwards: `srvctl status database`, `crsctl stat res -t`" },
            ],
          },
          {
            kind: "code",
            code: `# Installation silencieuse du logiciel, sur tous les noeuds a la fois
$ cd $ORACLE_HOME
$ unzip -q /stage/LINUX.X64_193000_db_home.zip
$ ./runInstaller -silent -responseFile /stage/db_install.rsp \\
    oracle.install.option=INSTALL_DB_SWONLY \\
    oracle.install.db.CLUSTER_NODES=node1,node2

# Creation de la base en cluster, sans interface graphique
$ dbca -silent -createDatabase \\
    -templateName General_Purpose.dbc \\
    -gdbName orcl -sid orcl \\
    -sysPassword ... -systemPassword ... \\
    -storageType ASM -diskGroupName DATA \\
    -recoveryGroupName FRA \\
    -nodelist node1,node2 \\
    -databaseType MULTIPURPOSE \\
    -characterSet AL32UTF8 \\
    -createAsContainerDatabase true -numberOfPDBs 1 -pdbName pdb1 \\
    -redoLogFileSize 512 -automaticMemoryManagement false \\
    -totalMemory 8192 -emConfiguration NONE

$ srvctl config database -d orcl
$ srvctl status database -d orcl -v`,
          },
          {
            kind: "code",
            title: { fr: "Convertir une base mono-instance en RAC", en: "Converting a single-instance database to RAC" },
            code: `# Methode recommandee : rconfig, pilote par un fichier XML
$ cp $ORACLE_HOME/assistants/rconfig/sampleXMLs/ConvertToRAC_AdminManaged.xml .
# Renseigner : SourceDBHome, TargetDBHome, noeuds, groupe de disques ASM

# 1. Verification a blanc -- Convert verify="ONLY"
$ rconfig ConvertToRAC_AdminManaged.xml

# 2. Conversion reelle -- Convert verify="YES"
$ rconfig ConvertToRAC_AdminManaged.xml

# Alternative : DBCA en mode conversion, ou conversion manuelle
# (CLUSTER_DATABASE=TRUE, threads et undo par instance, puis srvctl add)`,
            caption: {
              fr: "`rconfig` déplace au besoin les fichiers vers ASM, ajoute les threads de redo et les tablespaces d'annulation, puis enregistre la base auprès de Clusterware. La vérification à blanc n'écrit rien : c'est toujours par elle qu'on commence.",
              en: "`rconfig` moves files to ASM if needed, adds redo threads and undo tablespaces, then registers the database with Clusterware. The dry run writes nothing: it is always where you start.",
            },
          },
        ],
      },
      {
        id: "rac-8-2",
        number: "8.2",
        title: { fr: "Threads de redo et tablespaces d'annulation", en: "Redo threads and undo tablespaces" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Chaque instance écrit son propre flux de redo, appelé **thread**. Chaque instance gère aussi ses propres transactions, donc son propre **tablespace d'annulation**. Ce sont les deux structures qu'on oublie systématiquement en ajoutant un nœud — et l'instance refuse alors de démarrer.",
              en: "Each instance writes its own redo stream, called a **thread**. Each instance also manages its own transactions, hence its own **undo tablespace**. These are the two structures systematically forgotten when adding a node — and the instance then refuses to start.",
            },
          },
          {
            kind: "code",
            code: `-- Ajouter un thread pour une troisieme instance
ALTER DATABASE ADD LOGFILE THREAD 3
  GROUP 31 ('+DATA','+FRA') SIZE 512M,
  GROUP 32 ('+DATA','+FRA') SIZE 512M,
  GROUP 33 ('+DATA','+FRA') SIZE 512M;
ALTER DATABASE ENABLE PUBLIC THREAD 3;

-- Son tablespace d'annulation
CREATE UNDO TABLESPACE undotbs3 DATAFILE '+DATA' SIZE 8G AUTOEXTEND ON;
ALTER SYSTEM SET undo_tablespace = 'UNDOTBS3' SID = 'orcl3' SCOPE = SPFILE;

-- Etat des threads
SELECT thread#, instance, status, enabled, groups, sequence#
FROM   v$thread;

-- Quel undo pour quelle instance ?
SELECT inst_id, value FROM gv$parameter WHERE name = 'undo_tablespace';

-- Journaux de toutes les instances
SELECT inst_id, group#, thread#, sequence#, bytes/1024/1024 AS mb, status
FROM   gv$log ORDER BY inst_id, thread#, group#;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Un thread doit être **PUBLIC** pour qu'une instance quelconque puisse s'en emparer. Un thread privé est réservé à une instance nommée : c'est utile en gestion par administrateur, mais cela bloque une base gérée par politique où les instances se déplacent entre serveurs.",
              en: "A thread must be **PUBLIC** for any instance to claim it. A private thread is reserved to a named instance: useful under administrator management, but it blocks a policy-managed database where instances move between servers.",
            },
          },
        ],
      },
      {
        id: "rac-8-3",
        number: "8.3",
        title: { fr: "Paramètres d'initialisation en cluster", en: "Initialization parameters in a cluster" },
        blocks: [
          {
            kind: "table",
            title: { fr: "Trois familles de paramètres", en: "Three families of parameters" },
            headers: [
              { fr: "Famille", en: "Family" },
              { fr: "Exemples", en: "Examples" },
              { fr: "Règle", en: "Rule" },
            ],
            rows: [
              [
                { fr: "Identiques obligatoirement", en: "Necessarily identical" },
                { fr: "DB_NAME, DB_BLOCK_SIZE, CONTROL_FILES, DB_UNIQUE_NAME, COMPATIBLE", en: "DB_NAME, DB_BLOCK_SIZE, CONTROL_FILES, DB_UNIQUE_NAME, COMPATIBLE" },
                { fr: "Ils décrivent la base unique — une divergence empêche le démarrage", en: "They describe the single database — a mismatch prevents startup" },
              ],
              [
                { fr: "Uniques obligatoirement", en: "Necessarily unique" },
                { fr: "INSTANCE_NUMBER, THREAD, UNDO_TABLESPACE, INSTANCE_NAME", en: "INSTANCE_NUMBER, THREAD, UNDO_TABLESPACE, INSTANCE_NAME" },
                { fr: "Ils identifient l'instance — deux instances ne peuvent les partager", en: "They identify the instance — two instances cannot share them" },
              ],
              [
                { fr: "Libres", en: "Free" },
                { fr: "SGA_TARGET, PGA_AGGREGATE_TARGET, OPEN_CURSORS, PROCESSES", en: "SGA_TARGET, PGA_AGGREGATE_TARGET, OPEN_CURSORS, PROCESSES" },
                { fr: "Peuvent différer, par exemple si un nœud est plus gros", en: "May differ, for instance if one node is larger" },
              ],
            ],
          },
          {
            kind: "code",
            code: `-- Le SPFILE est UNIQUE et partage, sur ASM.
SHOW PARAMETER spfile
-- +DATA/ORCL/PARAMETERFILE/spfile.271.1129384501

-- SID='*' : pour toutes les instances
ALTER SYSTEM SET open_cursors = 800 SID = '*' SCOPE = BOTH;

-- SID='orcl2' : pour cette instance seulement
ALTER SYSTEM SET sga_target = 24G SID = 'orcl2' SCOPE = SPFILE;

-- Voir les differences entre instances, d'un coup d'oeil
SELECT name, COUNT(DISTINCT value) AS valeurs_distinctes,
       LISTAGG(inst_id || '=' || SUBSTR(value,1,20), ' | ')
         WITHIN GROUP (ORDER BY inst_id) AS detail
FROM   gv$parameter
WHERE  isdefault = 'FALSE'
GROUP  BY name HAVING COUNT(DISTINCT value) > 1
ORDER  BY name;

-- Le contenu reel du SPFILE, y compris les valeurs par instance
SELECT sid, name, value FROM v$spparameter
WHERE  isspecified = 'TRUE' ORDER BY sid, name;`,
            caption: {
              fr: "La requête sur `GV$PARAMETER` est le premier réflexe quand une instance se comporte différemment des autres : elle montre en une fois toutes les divergences non voulues.",
              en: "The `GV$PARAMETER` query is the first reflex when one instance behaves differently from the others: it shows every unintended divergence at once.",
            },
          },
        ],
      },
      {
        id: "rac-8-4",
        number: "8.4",
        title: { fr: "Démarrage, arrêt et politiques", en: "Startup, shutdown and policies" },
        blocks: [
          {
            kind: "code",
            code: `# Toute la base
$ srvctl start database -d orcl
$ srvctl stop  database -d orcl -o immediate

# Une instance
$ srvctl start instance -d orcl -i orcl2
$ srvctl stop  instance -d orcl -i orcl2 -o transactional

# Etat detaille
$ srvctl status database -d orcl -v
$ srvctl config database -d orcl -a

# Politique de demarrage au boot du cluster
$ srvctl modify database -d orcl -policy AUTOMATIC   # demarrage auto
$ srvctl modify database -d orcl -policy MANUAL      # a la demande
$ srvctl modify database -d orcl -policy NORESTART   # jamais redemarree

# Ordre d'arret dans un cluster : services, instances, puis la pile
$ srvctl stop service -d orcl -s ventes_svc
$ srvctl stop database -d orcl
# crsctl stop cluster -all`,
          },
          {
            kind: "tip",
            body: {
              fr: "`-o transactional` attend la fin des transactions en cours avant d'arrêter l'instance, sans en accepter de nouvelles. Combiné à un `srvctl relocate service` préalable, il permet d'arrêter un nœud pour maintenance sans qu'aucun utilisateur ne reçoive d'erreur.",
              en: "`-o transactional` waits for in-flight transactions to finish before stopping the instance, while accepting no new ones. Combined with a prior `srvctl relocate service`, it lets you take a node down for maintenance without a single user receiving an error.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "rac-session-9",
    number: 9,
    title: {
      fr: "Haute disponibilité des connexions et des applications",
      en: "High availability of connections and applications",
    },
    summary: {
      fr: "Un cluster à quatre nœuds ne sert à rien si le client met deux minutes à s'apercevoir qu'un nœud est tombé. Équilibrage à la connexion, à l'exécution, notification immédiate, puis rejeu transparent de la transaction.",
      en: "A four-node cluster is useless if the client takes two minutes to notice a node is down. Connect-time balancing, run-time balancing, immediate notification, then transparent replay of the transaction.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "rac-9-1",
        number: "9.1",
        title: { fr: "Équilibrage à la connexion", en: "Connect-time load balancing" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Deux équilibrages coexistent et se complètent. Le **client** répartit ses tentatives entre les adresses du descripteur ; le **serveur** redirige ensuite vers l'instance la moins chargée. Le premier évite qu'un site injoignable bloque tout, le second évite qu'un nœud croule pendant qu'un autre dort.",
              en: "Two balancing mechanisms coexist and complement each other. The **client** spreads its attempts across the descriptor's addresses; the **server** then redirects to the least-loaded instance. The first stops an unreachable site blocking everything, the second stops one node buckling while another idles.",
            },
          },
          {
            kind: "code",
            title: { fr: "Côté client : LOAD_BALANCE et FAILOVER", en: "Client side: LOAD_BALANCE and FAILOVER" },
            code: `VENTES =
 (DESCRIPTION =
   (CONNECT_TIMEOUT = 10)(TRANSPORT_CONNECT_TIMEOUT = 3)
   (RETRY_COUNT = 20)(RETRY_DELAY = 3)
   (ADDRESS_LIST =
     (LOAD_BALANCE = ON)     -- ordre aleatoire des adresses
     (FAILOVER = ON)         -- essayer la suivante en cas d'echec
     (ADDRESS = (PROTOCOL = TCP)(HOST = cluster-scan)(PORT = 1521)))
   (CONNECT_DATA =
     (SERVICE_NAME = ventes_svc)
     (FAILOVER_MODE =
       (TYPE = SELECT)       -- poursuivre un SELECT en cours
       (METHOD = BASIC)      -- reconnexion a la demande
       (RETRIES = 30)(DELAY = 3))))`,
            caption: {
              fr: "Avec un SCAN, une seule adresse suffit : le tourniquet DNS fait déjà l'équilibrage entre les trois adresses SCAN. `LOAD_BALANCE` reste utile quand on liste plusieurs clusters ou plusieurs sites.",
              en: "With a SCAN, a single address is enough: round-robin DNS already balances across the three SCAN addresses. `LOAD_BALANCE` stays useful when listing several clusters or sites.",
            },
          },
          {
            kind: "code",
            title: { fr: "Côté serveur : le but d'équilibrage", en: "Server side: the balancing goal" },
            code: `# CLBGOAL -- comment le listener SCAN choisit l'instance a la CONNEXION
#   SHORT : s'appuyer sur le Load Balancing Advisory
#           (connexions courtes, pool de connexions)
#   LONG  : repartir par nombre de sessions
#           (connexions longues, clients persistants)
$ srvctl modify service -db orcl -service ventes_svc -clbgoal SHORT

# RLBGOAL -- comment le pool repartit le TRAVAIL entre connexions ouvertes
#   SERVICE_TIME : privilegier le temps de reponse (OLTP)
#   THROUGHPUT   : privilegier le debit (traitements de masse)
$ srvctl modify service -db orcl -service ventes_svc -rlbgoal SERVICE_TIME

-- Ce que le Load Balancing Advisory publie reellement
SELECT service_name, inst_id, goal, service_time, throughput,
       cpu_percent, flags
FROM   gv$servicemetric ORDER BY service_name, inst_id;`,
          },
          {
            kind: "table",
            title: { fr: "Choisir CLBGOAL et RLBGOAL", en: "Choosing CLBGOAL and RLBGOAL" },
            headers: [
              { fr: "Type d'application", en: "Application type" },
              { fr: "CLBGOAL", en: "CLBGOAL" },
              { fr: "RLBGOAL", en: "RLBGOAL" },
            ],
            rows: [
              [
                { fr: "Application web, pool de connexions", en: "Web application, connection pool" },
                { fr: "SHORT", en: "SHORT" },
                { fr: "SERVICE_TIME", en: "SERVICE_TIME" },
              ],
              [
                { fr: "Client lourd, session ouverte toute la journée", en: "Thick client, session open all day" },
                { fr: "LONG", en: "LONG" },
                { fr: "Aucun (pas de pool)", en: "None (no pool)" },
              ],
              [
                { fr: "Traitement par lots, extraction massive", en: "Batch job, bulk extraction" },
                { fr: "SHORT", en: "SHORT" },
                { fr: "THROUGHPUT", en: "THROUGHPUT" },
              ],
              [
                { fr: "Rapports décisionnels, requêtes longues", en: "Decision-support reports, long queries" },
                { fr: "LONG", en: "LONG" },
                { fr: "THROUGHPUT", en: "THROUGHPUT" },
              ],
            ],
          },
        ],
      },
      {
        id: "rac-9-2",
        number: "9.2",
        title: { fr: "FAN et Fast Connection Failover", en: "FAN and Fast Connection Failover" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Sans FAN, un client dont le nœud tombe attend l'expiration du délai TCP — de trente secondes à plusieurs minutes selon le système — avant de comprendre. FAN publie l'événement immédiatement : le pool de connexions purge les connexions mortes en quelques millisecondes et redirige les nouvelles demandes.",
              en: "Without FAN, a client whose node fails waits out the TCP timeout — thirty seconds to several minutes depending on the OS — before understanding. FAN publishes the event immediately: the connection pool purges dead connections in milliseconds and redirects new requests.",
            },
          },
          {
            kind: "table",
            title: { fr: "Les événements FAN", en: "FAN events" },
            headers: [
              { fr: "Événement", en: "Event" },
              { fr: "Émis quand", en: "Emitted when" },
              { fr: "Ce que le pool fait", en: "What the pool does" },
            ],
            rows: [
              [
                { fr: "SERVICE — down", en: "SERVICE — down" },
                { fr: "Le service s'arrête sur toutes les instances", en: "The service stops on every instance" },
                { fr: "Ferme toutes les connexions de ce service", en: "Closes every connection for that service" },
              ],
              [
                { fr: "SERVICEMEMBER — down", en: "SERVICEMEMBER — down" },
                { fr: "Le service s'arrête sur une instance", en: "The service stops on one instance" },
                { fr: "Ferme les connexions de cette instance seulement", en: "Closes that instance's connections only" },
              ],
              [
                { fr: "INSTANCE — down", en: "INSTANCE — down" },
                { fr: "Une instance disparaît", en: "An instance disappears" },
                { fr: "Purge et redistribue", en: "Purges and redistributes" },
              ],
              [
                { fr: "NODE — down", en: "NODE — down" },
                { fr: "Un nœud est évincé", en: "A node is evicted" },
                { fr: "Purge tout ce qui venait de ce nœud", en: "Purges everything from that node" },
              ],
              [
                { fr: "SERVICE — up", en: "SERVICE — up" },
                { fr: "Le service redémarre quelque part", en: "The service restarts somewhere" },
                { fr: "Rééquilibre en y ouvrant des connexions", en: "Rebalances by opening connections there" },
              ],
            ],
          },
          {
            kind: "code",
            code: `# Activer les notifications sur le service
$ srvctl modify service -db orcl -service ventes_svc -notification TRUE

-- Verifier ce qui est reellement publie
SELECT name, aq_ha_notifications, clb_goal, goal, failover_type
FROM   dba_services WHERE name = 'ventes_svc';

# Observer les evenements en direct, depuis un noeud
$ oclumon dumpnodeview -allnodes -last "00:05:00"

# Le callout : declencher un script maison a chaque evenement FAN
# Deposer un executable dans $GRID_HOME/racg/usrco/
# Il recoit l'evenement en argument et peut alerter, tracer, reagir.`,
          },
          {
            kind: "warning",
            body: {
              fr: "FAN n'a d'effet que si le client sait l'écouter : un pool JDBC générique, une connexion `DriverManager` nue ou un pool applicatif maison ignorent purement et simplement les événements. Il faut UCP, WebLogic, ODP.NET, ou un pilote OCI configuré — sinon la notification est publiée dans le vide.",
              en: "FAN only matters if the client listens: a generic JDBC pool, a bare `DriverManager` connection or a home-grown pool simply ignore the events. You need UCP, WebLogic, ODP.NET, or a configured OCI driver — otherwise the notification is published into the void.",
            },
          },
        ],
      },
      {
        id: "rac-9-3",
        number: "9.3",
        title: { fr: "TAF, Application Continuity et repli dynamique", en: "TAF, Application Continuity and dynamic fallback" },
        blocks: [
          {
            kind: "compare",
            title: { fr: "TAF contre Application Continuity", en: "TAF versus Application Continuity" },
            wrong: `-- TAF : la session est retablie,
-- mais la transaction en cours est PERDUE.
-- L'application recoit ORA-25402 et doit
-- refaire elle-meme son travail.
FAILOVER_MODE = (TYPE = SELECT)(METHOD = BASIC)`,
            right: `-- Application Continuity : le pilote rejoue
-- les appels enregistres sur la nouvelle instance
-- et verifie que le resultat est identique.
-- L'utilisateur ne voit rien.
$ srvctl modify service -db orcl -service ventes_svc \\
    -failovertype TRANSACTION -commit_outcome TRUE \\
    -replay_init_time 600 -retention 86400 \\
    -session_state dynamic -failoverretry 30`,
            note: {
              fr: "TAF suffit pour une application de consultation. Dès qu'il y a des écritures — une commande validée, un paiement — seul Application Continuity évite le doublon ou la perte, parce qu'il sait si le COMMIT est passé grâce à `COMMIT_OUTCOME`.",
              en: "TAF is enough for a read-only application. As soon as there are writes — an order placed, a payment — only Application Continuity avoids the duplicate or the loss, because `COMMIT_OUTCOME` tells it whether the COMMIT went through.",
            },
          },
          {
            kind: "list",
            title: { fr: "Ce qui empêche un rejeu", en: "What prevents a replay" },
            items: [
              { fr: "Un appel externe pendant la transaction : `UTL_HTTP`, `UTL_SMTP`, `UTL_FILE`", en: "An external call during the transaction: `UTL_HTTP`, `UTL_SMTP`, `UTL_FILE`" },
              { fr: "Un état de session non restituable — `session_state static` sans que ce soit vrai", en: "Non-restorable session state — `session_state static` when it is not actually true" },
              { fr: "Une transaction plus longue que `replay_init_time`", en: "A transaction longer than `replay_init_time`" },
              { fr: "Un résultat divergent au rejeu : l'erreur remonte plutôt que de mentir", en: "A divergent result on replay: the error surfaces rather than lying" },
              { fr: "Un pilote non compatible, ou un pool qui ne pose pas les frontières de requête", en: "An incompatible driver, or a pool that does not set request boundaries" },
            ],
          },
          {
            kind: "code",
            title: { fr: "Colocalisation et services de repli dynamiques", en: "Colocation tag and dynamic fallback services" },
            code: `# Etiquette de colocalisation : router vers l'instance qui detient
# deja les donnees d'un locataire, pour eviter les transferts Cache Fusion.
# Le client transmet l'etiquette a la connexion ; le listener route
# toutes les sessions portant la meme etiquette vers la meme instance.
# (Propriete COLOCATION_TAG du pool de connexions.)

# Services de repli dynamiques : un service qui, si son instance
# preferee est indisponible, demarre ailleurs -- et REVIENT
# automatiquement des que l'instance preferee est retablie.
$ srvctl add service -db orcl -service ventes_svc \\
    -preferred orcl1 -available orcl2,orcl3 \\
    -failback YES -notification TRUE

$ srvctl config service -db orcl -service ventes_svc | grep -i failback`,
            caption: {
              fr: "Sans `-failback`, un service déplacé par une panne reste sur le nœud de repli indéfiniment — et la répartition prévue ne revient jamais d'elle-même.",
              en: "Without `-failback`, a service moved by a failure stays on the fallback node indefinitely — and the intended distribution never returns by itself.",
            },
          },
          {
            kind: "code",
            title: { fr: "Vérifier que tout est en place", en: "Verifying it all holds together" },
            code: `-- Configuration reelle du service
SELECT name, failover_type, failover_method, failover_retries,
       failover_delay, commit_outcome, aq_ha_notifications,
       clb_goal, goal, session_state_consistency
FROM   dba_services WHERE name = 'ventes_svc';

-- Sessions ayant reellement bascule
SELECT inst_id, sid, service_name, failed_over, failover_type, failover_method
FROM   gv$session WHERE failed_over = 'YES';

-- Compteurs de rejeu au niveau de l'instance
SELECT inst_id, name, value FROM gv$sysstat
WHERE  name LIKE '%replay%' OR name LIKE '%failover%'
ORDER  BY inst_id, name;`,
          },
        ],
      },
    ],
  },

  {
    id: "rac-session-10",
    number: 10,
    title: { fr: "RAC One Node et qualité de service", en: "RAC One Node and quality of service" },
    summary: {
      fr: "Toutes les bases n'ont pas besoin de plusieurs instances actives. RAC One Node donne la haute disponibilité sans la complexité du cluster actif-actif ; QoS Management arbitre les ressources entre applications quand elles se disputent le même serveur.",
      en: "Not every database needs several active instances. RAC One Node delivers high availability without the complexity of active-active; QoS Management arbitrates resources between applications competing for the same server.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "rac-10-1",
        number: "10.1",
        title: { fr: "RAC One Node : une instance, plusieurs nœuds", en: "RAC One Node: one instance, several nodes" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Une base RAC One Node n'a qu'**une seule instance active à la fois**, mais elle est enregistrée sur plusieurs nœuds du cluster. En cas de panne, Clusterware la redémarre ailleurs ; pour une maintenance planifiée, on la **déplace en ligne** sans coupure grâce à la migration progressive des sessions.",
              en: "A RAC One Node database has only **one active instance at a time**, but it is registered on several cluster nodes. On failure Clusterware restarts it elsewhere; for planned maintenance you **relocate it online** with no outage, thanks to gradual session migration.",
            },
          },
          {
            kind: "table",
            title: { fr: "Trois niveaux, trois compromis", en: "Three levels, three trade-offs" },
            headers: [
              { fr: "", en: "" },
              { fr: "Mono-instance", en: "Single instance" },
              { fr: "RAC One Node", en: "RAC One Node" },
              { fr: "RAC", en: "RAC" },
            ],
            rows: [
              [
                { fr: "Instances actives", en: "Active instances" },
                { fr: "1", en: "1" },
                { fr: "1", en: "1" },
                { fr: "n", en: "n" },
              ],
              [
                { fr: "Reprise après panne de nœud", en: "Node failure recovery" },
                { fr: "Aucune", en: "None" },
                { fr: "Redémarrage ailleurs — quelques minutes", en: "Restart elsewhere — a few minutes" },
                { fr: "Instantanée, les autres servent déjà", en: "Instant, the others already serve" },
              ],
              [
                { fr: "Maintenance sans coupure", en: "Maintenance without downtime" },
                { fr: "Non", en: "No" },
                { fr: "Oui, par relocalisation en ligne", en: "Yes, by online relocation" },
                { fr: "Oui", en: "Yes" },
              ],
              [
                { fr: "Montée en charge horizontale", en: "Horizontal scaling" },
                { fr: "Non", en: "No" },
                { fr: "Non", en: "No" },
                { fr: "Oui", en: "Yes" },
              ],
              [
                { fr: "Complexité applicative", en: "Application complexity" },
                { fr: "Nulle", en: "None" },
                { fr: "Nulle — pas de Cache Fusion", en: "None — no Cache Fusion" },
                { fr: "Réelle : blocs chauds, séquences, affinité", en: "Real: hot blocks, sequences, affinity" },
              ],
            ],
          },
          {
            kind: "code",
            code: `# Etat d'une base RAC One Node
$ srvctl config database -d orcl | grep -i "type\\|candidate"
Type: RACOneNode
Candidate servers: node1,node2,node3

# Relocalisation EN LIGNE, avec 30 minutes pour vider les sessions
$ srvctl relocate database -d orcl -node node2 -timeout 30
$ srvctl status database -d orcl -v

# Convertir RAC One Node -> RAC (plusieurs instances actives)
$ srvctl convert database -d orcl -dbtype RAC
# ... puis ajouter thread de redo et undo pour la nouvelle instance ...

# Convertir RAC -> RAC One Node
$ srvctl convert database -d orcl -dbtype RACONENODE -instance orcl1

# Convertir une base mono-instance en RAC One Node, via DBCA
$ dbca -silent -convertToRACOneNode -sourceDB orcl \\
    -serviceName ventes_svc -nodelist node1,node2`,
            caption: {
              fr: "Pendant une relocalisation, les deux instances coexistent brièvement : l'ancienne finit ses transactions pendant que la nouvelle accepte les connexions. C'est ce recouvrement qui rend l'opération transparente.",
              en: "During a relocation the two instances briefly coexist: the old one finishes its transactions while the new one accepts connections. That overlap is what makes the operation transparent.",
            },
          },
          {
            kind: "warning",
            body: {
              fr: "La relocalisation en ligne exige un service correctement configuré avec FAN et, idéalement, Application Continuity. Sans cela, les sessions restées sur l'ancienne instance à l'expiration du délai sont **tuées** : le mécanisme est transparent pour l'infrastructure, pas pour une application mal outillée.",
              en: "Online relocation requires a properly configured service with FAN and, ideally, Application Continuity. Without it, sessions still on the old instance when the timeout expires are **killed**: the mechanism is transparent for the infrastructure, not for a poorly equipped application.",
            },
          },
        ],
      },
      {
        id: "rac-10-2",
        number: "10.2",
        title: { fr: "Qualité de service : l'objectif", en: "Quality of Service: the objective" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Quand plusieurs applications partagent un cluster, l'une d'elles finit toujours par affamer les autres — souvent un traitement de masse qui monopolise le CPU au moment où les commandes affluent. QoS Management renverse la logique : au lieu de régler des paramètres, on déclare un **objectif de temps de réponse** par classe de travail, et le système ajuste les ressources pour le tenir.",
              en: "When several applications share a cluster, one of them always ends up starving the others — often a batch job hogging the CPU exactly when orders pour in. QoS Management inverts the logic: instead of tuning parameters you declare a **response-time objective** per class of work, and the system adjusts resources to meet it.",
            },
          },
          {
            kind: "list",
            title: { fr: "Comment QoS procède", en: "How QoS proceeds" },
            items: [
              { fr: "Classer le travail : chaque classe est reconnue par le service, le module ou l'action de la session", en: "Classify the work: each class is recognised by the session's service, module or action" },
              { fr: "Déclarer un objectif de temps de réponse par classe, et un rang de criticité", en: "Declare a response-time objective per class, and a criticality rank" },
              { fr: "Mesurer en continu le temps de réponse réellement obtenu", en: "Continuously measure the response time actually achieved" },
              { fr: "Recommander un ajustement quand un objectif est menacé : parts de CPU, ouverture de connexions, déplacement de serveur", en: "Recommend an adjustment when an objective is at risk: CPU shares, connection allocation, server relocation" },
              { fr: "Appliquer, en mode automatique, ou laisser l'administrateur décider en mode recommandation", en: "Apply, in automatic mode, or leave the administrator to decide in recommendation mode" },
            ],
          },
          {
            kind: "table",
            title: { fr: "Les leviers dont QoS dispose", en: "The levers QoS has" },
            headers: [
              { fr: "Levier", en: "Lever" },
              { fr: "Effet", en: "Effect" },
            ],
            rows: [
              [
                { fr: "Parts de CPU (Resource Manager)", en: "CPU shares (Resource Manager)" },
                { fr: "Redistribue le processeur entre groupes de consommateurs", en: "Redistributes the processor between consumer groups" },
              ],
              [
                { fr: "Allocation de connexions", en: "Connection allocation" },
                { fr: "Oriente les nouvelles connexions vers les instances les moins sollicitées", en: "Steers new connections to the least-loaded instances" },
              ],
              [
                { fr: "Déplacement de serveur entre pools", en: "Server move between pools" },
                { fr: "Ajoute un serveur au pool en difficulté, en le prenant à un pool moins critique", en: "Adds a server to the struggling pool, taken from a less critical one" },
              ],
              [
                { fr: "Memory Guard", en: "Memory Guard" },
                { fr: "Empêche un nœud de se noyer : ferme les services d'un nœud menacé de saturation mémoire", en: "Stops a node drowning: closes services on a node at risk of memory exhaustion" },
              ],
            ],
          },
          {
            kind: "code",
            code: `# QoS s'administre par Enterprise Manager, ou par qosctl en ligne de commande.
$ qosctl qosadmin -listqosconfig
$ qosctl qosadmin -setpolicyset -file politique_prod.xml
$ qosctl qosadmin -activatepolicy heures_ouvrees

# Le serveur QoS fait partie de Grid Infrastructure
$ srvctl status qosmserver
$ srvctl start  qosmserver

-- Memory Guard s'appuie sur le Cluster Health Monitor
$ oclumon dumpnodeview -n node2 -last "00:10:00" | head -40`,
          },
          {
            kind: "warning",
            body: {
              fr: "QoS Management exige un cluster géré par **politiques** avec des pools de serveurs, des bases enregistrées auprès du serveur QoS, et le Grid Infrastructure Management Repository actif. Sur un cluster géré par administrateur, la plupart des leviers sont inopérants : la fonctionnalité s'installe, mais ne peut rien déplacer.",
              en: "QoS Management requires a **policy-managed** cluster with server pools, databases registered with the QoS server, and an active Grid Infrastructure Management Repository. On an administrator-managed cluster most levers are inert: the feature installs, but can move nothing.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "rac-session-11",
    number: 11,
    title: { fr: "Architecture multitenant en environnement RAC", en: "Multitenant architecture in a RAC environment" },
    summary: {
      fr: "Une CDB en cluster ajoute une dimension : chaque PDB peut être ouverte sur un sous-ensemble des instances seulement. Cela devient un outil de répartition — et une source de confusion si on ne suit pas les services.",
      en: "A clustered CDB adds a dimension: each PDB can be open on a subset of the instances only. That becomes a distribution tool — and a source of confusion if you do not follow the services.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "rac-11-1",
        number: "11.1",
        title: { fr: "Ce que le cluster change au multitenant", en: "What the cluster changes for multitenant" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Élément", en: "Element" },
              { fr: "Hors RAC", en: "Outside RAC" },
              { fr: "En RAC", en: "In RAC" },
            ],
            rows: [
              [
                { fr: "CDB", en: "CDB" },
                { fr: "Une instance", en: "One instance" },
                { fr: "n instances, une base — comme toute base RAC", en: "n instances, one database — like any RAC database" },
              ],
              [
                { fr: "PDB", en: "PDB" },
                { fr: "Ouverte ou fermée", en: "Open or closed" },
                { fr: "**Ouverte instance par instance**", en: "**Open on an instance-by-instance basis**" },
              ],
              [
                { fr: "Service par défaut", en: "Default service" },
                { fr: "Un par PDB", en: "One per PDB" },
                { fr: "Un par PDB, actif sur les instances où elle est ouverte", en: "One per PDB, active where the PDB is open" },
              ],
              [
                { fr: "Undo", en: "Undo" },
                { fr: "Local ou partagé", en: "Local or shared" },
                { fr: "Local recommandé — un tablespace par PDB **et** par instance", en: "Local recommended — one tablespace per PDB **and** per instance" },
              ],
            ],
          },
          {
            kind: "code",
            code: `-- Ouvrir une PDB partout
ALTER PLUGGABLE DATABASE pdb_ventes OPEN INSTANCES = ALL;

-- Ou seulement sur deux instances : les rapports d'un cote,
-- la production de l'autre.
ALTER PLUGGABLE DATABASE pdb_ventes OPEN INSTANCES = ('orcl1','orcl2');
ALTER PLUGGABLE DATABASE pdb_bi     OPEN READ ONLY INSTANCES = ('orcl3');

-- Ou est ouverte chaque PDB, et dans quel mode ?
SELECT inst_id, con_id, name, open_mode, restricted, total_size/1024/1024 AS mb
FROM   gv$pdbs ORDER BY con_id, inst_id;

-- Rendre l'etat d'ouverture persistant apres un redemarrage
ALTER PLUGGABLE DATABASE pdb_ventes SAVE STATE INSTANCES = ('orcl1','orcl2');
SELECT con_name, instance_name, state FROM dba_pdb_saved_states;`,
            caption: {
              fr: "`SAVE STATE` est indispensable : sans lui, une PDB revient fermée après le redémarrage d'une instance, et le service associé ne démarre pas — le symptôme classique du « ça marchait avant le reboot ».",
              en: "`SAVE STATE` is essential: without it a PDB comes back closed after an instance restart, and the associated service does not start — the classic “it worked before the reboot” symptom.",
            },
          },
          {
            kind: "code",
            title: { fr: "Undo local en cluster", en: "Local undo in a cluster" },
            code: `-- Le mode undo local est un prerequis du clonage a chaud,
-- du Flashback PDB et de la restauration a un instant donne d'une PDB.
SELECT property_name, property_value FROM database_properties
WHERE  property_name = 'LOCAL_UNDO_ENABLED';

-- Le passage se fait en mode UPGRADE, une seule fois
SHUTDOWN IMMEDIATE;
STARTUP UPGRADE;
ALTER DATABASE LOCAL UNDO ON;
SHUTDOWN IMMEDIATE;
STARTUP;

-- En RAC : chaque PDB obtient un tablespace d'annulation
-- PAR INSTANCE. Oracle les cree automatiquement.
SELECT con_id, tablespace_name, status FROM cdb_tablespaces
WHERE  contents = 'UNDO' ORDER BY con_id;`,
          },
        ],
      },
      {
        id: "rac-11-2",
        number: "11.2",
        title: { fr: "Services de PDB et pools de serveurs", en: "PDB services and server pools" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Le service par défaut d'une PDB porte son nom et suit son état d'ouverture. Il ne faut jamais s'en servir en production : on crée des services applicatifs explicites, dont on maîtrise les instances préférées, la politique de bascule et le comportement du pool.",
              en: "A PDB's default service carries its name and follows its open state. Never use it in production: create explicit application services whose preferred instances, failover policy and pool behaviour you control.",
            },
          },
          {
            kind: "code",
            code: `# Service applicatif rattache a une PDB, sur deux instances
$ srvctl add service -db orcl -service commandes_svc -pdb pdb_ventes \\
    -preferred orcl1 -available orcl2 \\
    -failovertype TRANSACTION -commit_outcome TRUE \\
    -notification TRUE -clbgoal SHORT -rlbgoal SERVICE_TIME
$ srvctl start service -db orcl -service commandes_svc

# Sur un cluster gere par POLITIQUES : rattacher a un pool de serveurs
$ srvctl add service -db orcl -service bi_svc -pdb pdb_bi \\
    -serverpool pool_decisionnel -cardinality SINGLETON

$ srvctl config service -db orcl -service commandes_svc
$ srvctl status service -db orcl -service commandes_svc

-- Ce que la base voit de ses services
SELECT inst_id, name, pdb, network_name, failover_type
FROM   gv$active_services WHERE con_id > 2 ORDER BY inst_id, name;`,
          },
          {
            kind: "tip",
            title: { fr: "Correctifs et relocalisation automatisés de PDB", en: "Automated PDB patching and relocation" },
            body: {
              fr: "En cluster, une PDB se déplace d'une CDB à une autre par `CREATE PLUGGABLE DATABASE … RELOCATE`, avec un temps de coupure de l'ordre de la seconde. C'est le mécanisme qui permet de corriger une CDB : on relocalise ses PDB vers une CDB déjà corrigée, on met à jour la CDB vidée, puis on ramène les PDB. La disponibilité applicative est préservée du début à la fin.",
              en: "In a cluster a PDB moves from one CDB to another with `CREATE PLUGGABLE DATABASE … RELOCATE`, with downtime of the order of a second. It is the mechanism that lets you patch a CDB: relocate its PDBs to an already-patched CDB, upgrade the emptied CDB, then bring the PDBs back. Application availability is preserved throughout.",
            },
          },
          {
            kind: "code",
            code: `-- Depuis la CDB cible, deja corrigee
CREATE PLUGGABLE DATABASE pdb_ventes FROM pdb_ventes@lien_cdb_source
  RELOCATE AVAILABILITY MAX
  FILE_NAME_CONVERT = ('+DATA/CDB1/','+DATA/CDB2/');

ALTER PLUGGABLE DATABASE pdb_ventes OPEN INSTANCES = ALL;
ALTER PLUGGABLE DATABASE pdb_ventes SAVE STATE INSTANCES = ALL;

-- AVAILABILITY MAX : les sessions de l'ancienne PDB sont
-- redirigees vers la nouvelle a la fin du transfert.`,
          },
        ],
      },
    ],
  },

  {
    id: "rac-session-12",
    number: 12,
    title: {
      fr: "Flex Clusters, gestion par politiques et haute disponibilité applicative",
      en: "Flex Clusters, policy-based management and application high availability",
    },
    summary: {
      fr: "Comment un cluster grandit sans que sa configuration devienne ingérable : nœuds feuilles, catégories de serveurs, politiques activables — et comment y héberger une application qui n'est pas une base de données.",
      en: "How a cluster grows without its configuration becoming unmanageable: leaf nodes, server categories, activatable policies — and how to host an application there that is not a database.",
    },
    estimatedMinutes: 165,
    topics: [
      {
        id: "rac-12-1",
        number: "12.1",
        title: { fr: "Flex Clusters : nœuds concentrateurs et nœuds feuilles", en: "Flex Clusters: hub and leaf nodes" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Dans un cluster standard, chaque nœud accède directement au stockage partagé — ce qui devient coûteux et fragile au-delà de quelques dizaines de nœuds. Un Flex Cluster distingue deux rôles : les **nœuds concentrateurs** (hub), reliés au stockage comme dans un cluster classique, et les **nœuds feuilles** (leaf), qui n'y accèdent pas et dépendent d'un concentrateur.",
              en: "In a standard cluster every node reaches shared storage directly — which becomes costly and fragile beyond a few dozen nodes. A Flex Cluster distinguishes two roles: **hub nodes**, attached to storage as in a classic cluster, and **leaf nodes**, which have no storage access and depend on a hub.",
            },
          },
          {
            kind: "table",
            headers: [
              { fr: "", en: "" },
              { fr: "Nœud concentrateur (hub)", en: "Hub node" },
              { fr: "Nœud feuille (leaf)", en: "Leaf node" },
            ],
            rows: [
              [
                { fr: "Accès au stockage partagé", en: "Shared storage access" },
                { fr: "Direct", en: "Direct" },
                { fr: "Aucun", en: "None" },
              ],
              [
                { fr: "Accès à l'OCR et aux voting disks", en: "OCR and voting disk access" },
                { fr: "Oui", en: "Yes" },
                { fr: "Non — passe par un concentrateur", en: "No — goes through a hub" },
              ],
              [
                { fr: "Peut héberger une instance de base", en: "Can host a database instance" },
                { fr: "Oui", en: "Yes" },
                { fr: "Non", en: "No" },
              ],
              [
                { fr: "Usage", en: "Use" },
                { fr: "Bases RAC, instances ASM", en: "RAC databases, ASM instances" },
                { fr: "Serveurs d'application, traitements sans stockage partagé", en: "Application servers, jobs with no shared storage" },
              ],
              [
                { fr: "Perte du nœud", en: "Node loss" },
                { fr: "Éviction classique, reconfiguration du cluster", en: "Classic eviction, cluster reconfiguration" },
                { fr: "Sans effet sur le quorum", en: "No effect on quorum" },
              ],
            ],
          },
          {
            kind: "code",
            code: `# Mode du cluster
$ crsctl get cluster mode status
$ crsctl get cluster configuration

# Role de chaque noeud
$ crsctl get node role config -all
$ crsctl get node role status -all

# Changer le role d'un noeud (redemarrage de la pile requis)
# crsctl set node role leaf -node node5
# crsctl stop crs ; crsctl start crs

# Nombre de concentrateurs autorises
$ crsctl get cluster hubsize
# crsctl set cluster hubsize 8`,
          },
          {
            kind: "warning",
            body: {
              fr: "Le mode Flex Cluster est **désactivé par défaut** depuis la 12.2 et les nœuds feuilles sont dépréciés en 19c au profit d'autres approches. Le sujet reste au programme de l'examen : il faut savoir ce qu'est un nœud feuille, ce qu'il ne peut pas faire, et pourquoi sa perte n'affecte pas le quorum.",
              en: "Flex Cluster mode is **disabled by default** since 12.2 and leaf nodes are deprecated in 19c in favour of other approaches. The topic stays on the exam syllabus: you must know what a leaf node is, what it cannot do, and why losing one does not affect quorum.",
            },
          },
        ],
      },
      {
        id: "rac-12-2",
        number: "12.2",
        title: { fr: "Gestion par politiques", en: "Policy-based management" },
        blocks: [
          {
            kind: "compare",
            title: { fr: "Deux façons de gouverner un cluster", en: "Two ways of governing a cluster" },
            wrong: `-- GESTION PAR ADMINISTRATEUR
-- On nomme explicitement les noeuds :
-- l'instance orcl1 tourne sur node1, point.
-- Ajouter un noeud impose de reconfigurer
-- chaque base a la main.
$ srvctl add instance -d orcl -i orcl3 -n node3`,
            right: `-- GESTION PAR POLITIQUES
-- On declare un besoin : "cette base veut
-- entre 2 et 4 serveurs". Clusterware choisit
-- lesquels, et reequilibre tout seul.
$ srvctl add srvpool -serverpool pool_prod \\
    -min 2 -max 4 -importance 10
$ srvctl add database -d orcl -serverpool pool_prod`,
            note: {
              fr: "La gestion par politiques est indispensable dès que le cluster dépasse quelques nœuds, et elle est un prérequis de QoS Management. En contrepartie, on ne sait plus a priori quelle instance tourne où — ce qui suppose que les services soient correctement configurés.",
              en: "Policy-based management becomes essential beyond a few nodes, and it is a prerequisite for QoS Management. In exchange you no longer know up front which instance runs where — which assumes services are properly configured.",
            },
          },
          {
            kind: "code",
            title: { fr: "Pools, catégories et politiques", en: "Pools, categories and policies" },
            code: `# Pools de serveurs, avec une importance qui les departage
$ srvctl add srvpool -serverpool pool_prod  -min 2 -max 4 -importance 10
$ srvctl add srvpool -serverpool pool_recette -min 1 -max 2 -importance 3
$ srvctl config srvpool
$ srvctl status srvpool -detail

# Categorisation : decrire les serveurs par leurs ATTRIBUTS
# crsctl add category gros_serveurs \\
#     -attr "EXPRESSION='(MEMORY_SIZE > 128000) AND (CPU_COUNT > 32)'"
# crsctl status category
# crsctl status server -f          # attributs de chaque serveur

# Rattacher un pool a une categorie plutot qu'a des noms de machines
$ srvctl modify srvpool -serverpool pool_prod -category gros_serveurs

# Jeux de politiques : plusieurs repartitions, activables a la demande
# crsctl status policyset
# crsctl modify policyset -attr "LAST_ACTIVATED_POLICY=nuit"
# crsctl eval activate policy nuit          # simulation, sans rien changer
# crsctl modify policy nuit -attr "..."`,
          },
          {
            kind: "tip",
            title: { fr: "L'évaluation de scénarios hypothétiques", en: "What-if command evaluation" },
            body: {
              fr: "`crsctl eval` répond à « que se passerait-il si… » sans rien exécuter : arrêter un serveur, activer une politique, déplacer une ressource. Sur un cluster de production, c'est le moyen de vérifier qu'une opération de maintenance ne va pas déclencher une cascade de relocalisations imprévues.",
              en: "`crsctl eval` answers “what would happen if…” without executing anything: stopping a server, activating a policy, moving a resource. On a production cluster it is how you check that a maintenance operation will not trigger a cascade of unforeseen relocations.",
            },
          },
          {
            kind: "code",
            code: `# crsctl eval stop server node2 -f
# crsctl eval relocate server node3 -to pool_prod
# crsctl eval activate policy heures_creuses
# srvctl predict database -db orcl
# srvctl predict service -db orcl -service ventes_svc`,
          },
        ],
      },
      {
        id: "rac-12-3",
        number: "12.3",
        title: { fr: "Rendre une application hautement disponible", en: "Making an application highly available" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Clusterware ne sert pas qu'aux bases Oracle. Toute application — un serveur d'application, un ordonnanceur, un processus maison — peut y être déclarée comme **ressource** : Clusterware la démarre, la surveille, la redémarre en cas d'échec et la relocalise si le nœud tombe. Il suffit de fournir un script d'action qui sait faire trois choses : démarrer, arrêter, dire si c'est vivant.",
              en: "Clusterware is not only for Oracle databases. Any application — an application server, a scheduler, a home-grown process — can be declared there as a **resource**: Clusterware starts it, monitors it, restarts it on failure and relocates it if the node dies. All you provide is an action script that can do three things: start, stop, say whether it is alive.",
            },
          },
          {
            kind: "code",
            title: { fr: "Une VIP applicative, puis la ressource", en: "An application VIP, then the resource" },
            code: `# 1. Une adresse virtuelle qui suivra l'application
# $GRID_HOME/bin/appvipcfg create -network=1 \\
#     -ip=10.20.30.55 -vipname=vip_appli -user=root

# crsctl setperm resource vip_appli -u user:oracle:r-x

# 2. La ressource applicative, dependante de sa VIP
# crsctl add resource appli_metier -type cluster_resource \\
#   -attr "ACTION_SCRIPT=/u01/scripts/appli_metier.sh,
#          PLACEMENT=restricted,
#          HOSTING_MEMBERS=node1 node2,
#          CHECK_INTERVAL=30,
#          RESTART_ATTEMPTS=2,
#          START_DEPENDENCIES='hard(vip_appli) pullup(vip_appli)',
#          STOP_DEPENDENCIES='hard(vip_appli)'"

# crsctl start  resource appli_metier
# crsctl status resource appli_metier -f
# crsctl relocate resource appli_metier -n node2`,
            caption: {
              fr: "`hard(vip_appli)` signifie que l'application ne démarre pas sans sa VIP ; `pullup` démarre automatiquement la VIP si elle est arrêtée. Ce sont ces dépendances qui font la différence entre un redémarrage qui marche et un redémarrage qui échoue silencieusement.",
              en: "`hard(vip_appli)` means the application will not start without its VIP; `pullup` automatically starts the VIP if it is down. Those dependencies are the difference between a restart that works and one that fails silently.",
            },
          },
          {
            kind: "code",
            title: { fr: "Le script d'action : le contrat", en: "The action script: the contract" },
            code: `#!/bin/bash
# Clusterware appelle ce script avec start, stop, check ou clean.
# Code de retour 0 = succes, tout autre = echec.
case "$1" in
  start)
    /u01/appli/bin/demarrer.sh >> /u01/appli/log/crs.log 2>&1
    exit $? ;;
  stop)
    /u01/appli/bin/arreter.sh >> /u01/appli/log/crs.log 2>&1
    exit $? ;;
  check)
    # Verifier que le service repond VRAIMENT, pas seulement
    # que le processus existe : un processus zombie repond a pgrep.
    curl -sf http://localhost:8080/health > /dev/null
    exit $? ;;
  clean)
    pkill -9 -f appli_metier
    exit 0 ;;
esac`,
          },
          {
            kind: "table",
            title: { fr: "Les attributs de placement", en: "Placement attributes" },
            headers: [
              { fr: "PLACEMENT", en: "PLACEMENT" },
              { fr: "Comportement", en: "Behaviour" },
            ],
            rows: [
              [
                { fr: "balanced", en: "balanced" },
                { fr: "Clusterware choisit le nœud le moins chargé", en: "Clusterware picks the least-loaded node" },
              ],
              [
                { fr: "favored", en: "favored" },
                { fr: "Préfère les nœuds de `HOSTING_MEMBERS`, mais accepte les autres", en: "Prefers `HOSTING_MEMBERS` nodes, but accepts others" },
              ],
              [
                { fr: "restricted", en: "restricted" },
                { fr: "**Uniquement** les nœuds de `HOSTING_MEMBERS`", en: "**Only** the `HOSTING_MEMBERS` nodes" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Un `check` qui se contente de tester la présence du processus produit une haute disponibilité illusoire : une application bloquée mais vivante ne sera jamais redémarrée. Le contrôle doit interroger le service comme le ferait un utilisateur — une requête HTTP, une connexion, une transaction de test.",
              en: "A `check` that merely tests for the process gives illusory high availability: a hung but living application will never be restarted. The check must query the service the way a user would — an HTTP request, a connection, a test transaction.",
            },
          },
        ],
      },
    ],
  },
];
