import type { CourseSession } from "./course-oca-sql";

/**
 * Cursus Oracle Database 19c — Clusterware, ASM et Real Application Clusters
 * (1Z0-078).
 *
 * L'ordre suit la pile réelle, du bas vers le haut : le cluster d'abord,
 * puis le stockage partagé, puis la base multi-instances qui s'appuie sur
 * les deux. Aborder RAC avant ASM revient à expliquer un étage avant ses
 * fondations.
 */
export const racSessions: CourseSession[] = [
  {
    id: "rac-session-1",
    number: 1,
    title: { fr: "Architecture du cluster et Grid Infrastructure", en: "Cluster architecture and Grid Infrastructure" },
    summary: {
      fr: "Ce qu'est un cluster Oracle, ce que Clusterware garantit, et comment installer Grid Infrastructure sans se tromper sur les prérequis réseau et stockage — d'où viennent la quasi-totalité des échecs d'installation.",
      en: "What an Oracle cluster is, what Clusterware guarantees, and how to install Grid Infrastructure without getting the network and storage prerequisites wrong — where nearly all installation failures come from.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "rac-1-1",
        number: "1.1",
        title: { fr: "Pourquoi un cluster", en: "Why a cluster" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Oracle Clusterware fait de plusieurs serveurs indépendants une ressource unique : il détecte les pannes de nœud, redémarre les ressources ailleurs, et — surtout — empêche deux nœuds de se croire seuls maîtres des mêmes données. Real Application Clusters s'appuie dessus pour faire tourner **plusieurs instances sur une seule base**.",
              en: "Oracle Clusterware turns several independent servers into one resource: it detects node failures, restarts resources elsewhere, and — above all — prevents two nodes from each believing they alone own the same data. Real Application Clusters builds on it to run **several instances against a single database**.",
            },
          },
          {
            kind: "compare",
            title: { fr: "Ne pas confondre les trois", en: "Do not confuse the three" },
            wrong: `-- Data Guard : plusieurs BASES, une seule active.
-- Protege du sinistre. Bascule en minutes.

-- Oracle Restart : UN seul serveur.
-- Redemarre les composants apres un arret. Aucune HA.`,
            right: `-- RAC : UNE base, plusieurs INSTANCES actives simultanement.
-- Protege de la panne de serveur. Bascule en secondes.
-- Ne protege NI du sinistre de site, NI de l'erreur logique.

-- En production serieuse : RAC + Data Guard + sauvegardes.`,
            note: {
              fr: "RAC et Data Guard répondent à des risques différents et se combinent. Une baie de disques unique reste un point de défaillance unique, quel que soit le nombre de nœuds.",
              en: "RAC and Data Guard address different risks and combine. A single disk array remains a single point of failure, however many nodes you have.",
            },
          },
          {
            kind: "table",
            title: { fr: "Les composants de Grid Infrastructure", en: "Grid Infrastructure components" },
            headers: [
              { fr: "Composant", en: "Component" },
              { fr: "Rôle", en: "Role" },
            ],
            rows: [
              [
                { fr: "CRS (Cluster Ready Services)", en: "CRS (Cluster Ready Services)" },
                { fr: "Gère les ressources de haut niveau : bases, services, listeners", en: "Manages high-level resources: databases, services, listeners" },
              ],
              [
                { fr: "CSS (Cluster Synchronization Services)", en: "CSS (Cluster Synchronization Services)" },
                { fr: "Appartenance au cluster, heartbeat, décision d'éviction", en: "Cluster membership, heartbeat, eviction decisions" },
              ],
              [
                { fr: "EVM (Event Manager)", en: "EVM (Event Manager)" },
                { fr: "Diffuse les événements du cluster (FAN)", en: "Publishes cluster events (FAN)" },
              ],
              [
                { fr: "OHASD", en: "OHASD" },
                { fr: "Démarre toute la pile au boot du serveur", en: "Starts the whole stack at server boot" },
              ],
              [
                { fr: "ASM", en: "ASM" },
                { fr: "Stockage partagé : OCR, voting disks, fichiers de la base", en: "Shared storage: OCR, voting disks, database files" },
              ],
            ],
          },
        ],
      },
      {
        id: "rac-1-2",
        number: "1.2",
        title: { fr: "Prérequis réseau : la source des échecs", en: "Network prerequisites: the source of failures" },
        blocks: [
          {
            kind: "table",
            title: { fr: "Adressage exigé par nœud", en: "Addressing required per node" },
            headers: [
              { fr: "Adresse", en: "Address" },
              { fr: "Nombre", en: "Count" },
              { fr: "Résolution", en: "Resolution" },
            ],
            rows: [
              [
                { fr: "Publique", en: "Public" },
                { fr: "1 par nœud", en: "1 per node" },
                { fr: "DNS ou /etc/hosts", en: "DNS or /etc/hosts" },
              ],
              [
                { fr: "Privée (interconnexion)", en: "Private (interconnect)" },
                { fr: "1 ou plus par nœud", en: "1 or more per node" },
                { fr: "Réseau dédié, jamais routé", en: "Dedicated network, never routed" },
              ],
              [
                { fr: "VIP", en: "VIP" },
                { fr: "1 par nœud", en: "1 per node" },
                { fr: "DNS, **non affectée** avant installation", en: "DNS, **not assigned** before installation" },
              ],
              [
                { fr: "SCAN", en: "SCAN" },
                { fr: "3 pour tout le cluster", en: "3 for the whole cluster" },
                { fr: "**DNS en tourniquet** sur un seul nom", en: "**Round-robin DNS** on a single name" },
              ],
            ],
          },
          {
            kind: "warning",
            body: {
              fr: "Le nom SCAN doit se résoudre vers **trois** adresses par tourniquet DNS. Le déclarer dans /etc/hosts ne fonctionne pas : un fichier hosts ne renvoie qu'une adresse, et l'installateur le refuse ou produit un cluster dégradé. C'est l'erreur la plus fréquente en installation manuelle.",
              en: "The SCAN name must resolve to **three** addresses via round-robin DNS. Declaring it in /etc/hosts does not work: a hosts file returns only one address, and the installer either rejects it or produces a degraded cluster. This is the most frequent manual-installation mistake.",
            },
          },
          {
            kind: "code",
            title: { fr: "Vérifier AVANT d'installer", en: "Verify BEFORE installing" },
            code: `# L'utilitaire de vérification de configuration cluster
$ ./runcluvfy.sh stage -pre crsinst -n node1,node2 -verbose

# Résolution SCAN : doit renvoyer 3 adresses
$ nslookup cluster-scan.exemple.local

# Interconnexion : dédiée, jumbo frames recommandées
$ ip link show eth1        # MTU 9000
$ ping -M do -s 8972 node2-priv

# Après installation
$ cluvfy stage -post crsinst -n node1,node2`,
          },
        ],
      },
      {
        id: "rac-1-3",
        number: "1.3",
        title: { fr: "Installer Grid Infrastructure 19c", en: "Installing Grid Infrastructure 19c" },
        blocks: [
          {
            kind: "list",
            title: { fr: "Déroulé de l'installation", en: "Installation sequence" },
            items: [
              { fr: "Depuis la 12.2, l'image d'installation est **décompressée directement dans le Grid Home** : il n'y a plus d'étape de copie", en: "Since 12.2 the install image is **unzipped directly into the Grid Home**: there is no copy step any more" },
              { fr: "`gridSetup.sh` configure, puis on exécute `root.sh` sur chaque nœud, **séquentiellement**, en commençant par le premier", en: "`gridSetup.sh` configures, then you run `root.sh` on each node, **sequentially**, starting with the first" },
              { fr: "L'OCR et les voting disks sont placés dans un groupe de disques ASM créé pendant l'installation", en: "The OCR and voting disks land in an ASM disk group created during installation" },
              { fr: "Une installation silencieuse par fichier de réponses est la seule reproductible", en: "A silent install driven by a response file is the only reproducible one" },
            ],
          },
          {
            kind: "code",
            code: `# Installation silencieuse
$ cd /u01/app/19.0.0/grid
$ unzip -q /stage/LINUX.X64_193000_grid_home.zip
$ ./gridSetup.sh -silent -responseFile /stage/gridsetup.rsp

# Puis, sur CHAQUE nœud, dans l'ordre :
# node1 : /u01/app/oraInventory/orainstRoot.sh ; /u01/app/19.0.0/grid/root.sh
# node2 : idem, seulement APRÈS la fin du node1

# Contrôle final
$ crsctl check cluster -all
$ crsctl stat res -t`,
          },
        ],
      },
    ],
  },

  {
    id: "rac-session-2",
    number: 2,
    title: { fr: "Administrer Clusterware : CRSCTL, SRVCTL, OCR et voting disks", en: "Administering Clusterware: CRSCTL, SRVCTL, OCR and voting disks" },
    summary: {
      fr: "Deux outils, deux périmètres — la confusion entre `crsctl` et `srvctl` est le premier réflexe à corriger. Puis la protection des deux fichiers sans lesquels le cluster ne démarre pas.",
      en: "Two tools, two scopes — confusing `crsctl` and `srvctl` is the first reflex to fix. Then protecting the two files without which the cluster will not start.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "rac-2-1",
        number: "2.1",
        title: { fr: "crsctl ou srvctl ?", en: "crsctl or srvctl?" },
        blocks: [
          {
            kind: "compare",
            wrong: `-- crsctl : la PILE cluster elle-meme.
-- Ressources de bas niveau, souvent en root.
# crsctl stop crs
# crsctl start cluster -all
# crsctl stat res -t -init`,
            right: `-- srvctl : les RESSOURCES Oracle du cluster.
-- Bases, instances, services, listeners, ASM, VIP.
-- En tant que proprietaire du logiciel, jamais root.
$ srvctl status database -d orcl
$ srvctl stop instance -d orcl -i orcl1
$ srvctl start service -d orcl -s ventes`,
            note: {
              fr: "Règle de tri : si l'objet existerait encore sans Oracle Database (le cluster, un nœud, l'OCR), c'est `crsctl`. Si c'est un objet Oracle (base, instance, service, listener), c'est `srvctl`.",
              en: "Rule of thumb: if the object would still exist without Oracle Database (the cluster, a node, the OCR), it is `crsctl`. If it is an Oracle object (database, instance, service, listener), it is `srvctl`.",
            },
          },
          {
            kind: "code",
            title: { fr: "Les commandes du quotidien", en: "Everyday commands" },
            code: `# État complet du cluster
# crsctl stat res -t
# crsctl check cluster -all
# crsctl query crs activeversion
# crsctl query crs softwareversion

# Arrêt et démarrage
# crsctl stop cluster -n node2      # un nœud
# crsctl stop cluster -all          # tout le cluster
# crsctl stop crs                   # la pile locale, y compris OHASD

# Démarrage automatique au boot
# crsctl disable crs
# crsctl enable crs
# crsctl config crs`,
          },
        ],
      },
      {
        id: "rac-2-2",
        number: "2.2",
        title: { fr: "OCR, OLR et voting disks", en: "OCR, OLR and voting disks" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Fichier", en: "File" },
              { fr: "Contenu", en: "Content" },
              { fr: "Sauvegarde", en: "Backup" },
            ],
            rows: [
              [
                { fr: "OCR", en: "OCR" },
                { fr: "Configuration du cluster : ressources, dépendances, profils", en: "Cluster configuration: resources, dependencies, profiles" },
                { fr: "Automatique toutes les 4 h, conservée 1 semaine", en: "Automatic every 4 h, kept for one week" },
              ],
              [
                { fr: "OLR", en: "OLR" },
                { fr: "Configuration **locale** d'un nœud, lue avant l'accès à l'OCR", en: "**Local** configuration of one node, read before the OCR is reachable" },
                { fr: "Manuelle — `ocrconfig -local -manualbackup`", en: "Manual — `ocrconfig -local -manualbackup`" },
              ],
              [
                { fr: "Voting disks", en: "Voting disks" },
                { fr: "Appartenance au cluster et arbitrage du quorum", en: "Cluster membership and quorum arbitration" },
                { fr: "**Pas de sauvegarde** — restauration par recréation", en: "**No backup** — restored by re-creation" },
              ],
            ],
          },
          {
            kind: "code",
            code: `# OCR
# ocrcheck
# ocrconfig -showbackup
# ocrconfig -add +DATA          # miroir : jusqu'à 5 copies
# ocrconfig -restore /u01/app/grid/cdata/backup00.ocr

# OLR
# ocrcheck -local
# ocrconfig -local -manualbackup

# Voting disks
# crsctl query css votedisk
# crsctl replace votedisk +CRSDG`,
          },
          {
            kind: "warning",
            title: { fr: "Le quorum n'est pas négociable", en: "Quorum is not negotiable" },
            body: {
              fr: "Un nœud doit voir **plus de la moitié** des voting disks pour rester dans le cluster. Avec 2 disques, en perdre un fait tomber tout le cluster : il faut donc toujours un nombre **impair** — 1, 3 ou 5. En redondance normale, ASM en place automatiquement 3.",
              en: "A node must see **more than half** the voting disks to stay in the cluster. With 2 disks, losing one brings the whole cluster down: you therefore always need an **odd** number — 1, 3 or 5. With normal redundancy, ASM places 3 automatically.",
            },
          },
        ],
      },
      {
        id: "rac-2-3",
        number: "2.3",
        title: { fr: "Nœuds, ressources et séquence de démarrage", en: "Nodes, resources and the startup sequence" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Les ressources du cluster sont liées par des dépendances : ASM avant la base, le listener avant les services. Comprendre cet ordre explique la plupart des démarrages partiels — une ressource reste OFFLINE parce que ce dont elle dépend n'est pas monté.",
              en: "Cluster resources are linked by dependencies: ASM before the database, the listener before the services. Understanding that order explains most partial startups — a resource stays OFFLINE because what it depends on is not mounted.",
            },
          },
          {
            kind: "list",
            title: { fr: "Séquence de démarrage", en: "Startup sequence" },
            items: [
              { fr: "OHASD démarre au boot du système", en: "OHASD starts at system boot" },
              { fr: "OHASD lance GPNPD, GIPCD, MDNSD puis CSSD", en: "OHASD launches GPNPD, GIPCD, MDNSD then CSSD" },
              { fr: "CSSD lit les voting disks et établit l'appartenance au cluster", en: "CSSD reads the voting disks and establishes cluster membership" },
              { fr: "L'instance ASM démarre et monte les groupes de disques", en: "The ASM instance starts and mounts the disk groups" },
              { fr: "CRSD lit l'OCR et démarre les ressources déclarées", en: "CRSD reads the OCR and starts the declared resources" },
              { fr: "Les VIP, listeners, instances puis services démarrent dans l'ordre des dépendances", en: "VIPs, listeners, instances then services start in dependency order" },
            ],
          },
          {
            kind: "code",
            title: { fr: "Ajouter ou retirer un nœud", en: "Adding or removing a node" },
            code: `# Ajouter un nœud
$ cluvfy stage -pre nodeadd -n node3
$ $GRID_HOME/addnode/addnode.sh -silent "CLUSTER_NEW_NODES={node3}" \\
    "CLUSTER_NEW_VIRTUAL_HOSTNAMES={node3-vip}"
# puis root.sh sur node3

# Retirer un nœud
$ srvctl stop instance -d orcl -i orcl3
# crsctl delete node -n node3`,
          },
        ],
      },
    ],
  },

  {
    id: "rac-session-3",
    number: 3,
    title: { fr: "ASM : architecture, groupes de disques et redondance", en: "ASM: architecture, disk groups and redundancy" },
    summary: {
      fr: "Le gestionnaire de volumes et le système de fichiers d'Oracle, en une instance. Comprendre la répartition automatique et les groupes de pannes évite les deux erreurs classiques : sous-dimensionner la redondance, et croire qu'ASM remplace une sauvegarde.",
      en: "Oracle's volume manager and file system, in a single instance. Understanding automatic striping and failure groups avoids the two classic mistakes: under-sizing redundancy, and believing ASM replaces a backup.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "rac-3-1",
        number: "3.1",
        title: { fr: "L'instance ASM", en: "The ASM instance" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "ASM est une instance Oracle sans base : elle a une SGA et des processus, mais aucun fichier de données. Elle ne sert jamais de requêtes utilisateur — elle indique aux instances de base **où** se trouvent les extents, puis s'efface : les entrées-sorties vont directement du serveur de base au disque.",
              en: "ASM is an Oracle instance with no database: it has an SGA and processes, but no data files. It never serves user queries — it tells database instances **where** the extents are, then steps aside: I/O goes straight from the database server to the disk.",
            },
          },
          {
            kind: "code",
            code: `$ export ORACLE_SID=+ASM1
$ sqlplus / as sysasm

SELECT instance_name, status FROM v$instance;
SELECT name, state, type, total_mb, free_mb,
       required_mirror_free_mb, usable_file_mb
FROM   v$asm_diskgroup;

SELECT group_number, disk_number, name, path, failgroup,
       mount_status, header_status, state, total_mb
FROM   v$asm_disk ORDER BY group_number, disk_number;`,
          },
          {
            kind: "table",
            title: { fr: "Trois privilèges, trois usages", en: "Three privileges, three uses" },
            headers: [
              { fr: "Privilège", en: "Privilege" },
              { fr: "Permet", en: "Allows" },
            ],
            rows: [
              [{ fr: "SYSASM", en: "SYSASM" }, { fr: "Administration complète : créer, monter, supprimer un groupe de disques", en: "Full administration: create, mount, drop a disk group" }],
              [{ fr: "SYSDBA", en: "SYSDBA" }, { fr: "Accès aux fichiers depuis une instance de base", en: "File access from a database instance" }],
              [{ fr: "SYSOPER", en: "SYSOPER" }, { fr: "Démarrer, arrêter, monter — sans modifier la configuration", en: "Start, stop, mount — without changing the configuration" }],
            ],
          },
        ],
      },
      {
        id: "rac-3-2",
        number: "3.2",
        title: { fr: "Groupes de disques, redondance et groupes de pannes", en: "Disk groups, redundancy and failure groups" },
        blocks: [
          {
            kind: "table",
            headers: [
              { fr: "Redondance", en: "Redundancy" },
              { fr: "Copies", en: "Copies" },
              { fr: "Groupes de pannes minimum", en: "Minimum failure groups" },
              { fr: "Tolère", en: "Tolerates" },
            ],
            rows: [
              [{ fr: "EXTERNAL", en: "EXTERNAL" }, { fr: "1", en: "1" }, { fr: "1", en: "1" }, { fr: "Rien — la baie assure la protection", en: "Nothing — the array provides protection" }],
              [{ fr: "NORMAL", en: "NORMAL" }, { fr: "2", en: "2" }, { fr: "2", en: "2" }, { fr: "La perte d'un groupe de pannes", en: "Loss of one failure group" }],
              [{ fr: "HIGH", en: "HIGH" }, { fr: "3", en: "3" }, { fr: "3", en: "3" }, { fr: "La perte de deux groupes de pannes", en: "Loss of two failure groups" }],
              [{ fr: "FLEX (12.2+)", en: "FLEX (12.2+)" }, { fr: "Variable par fichier", en: "Per-file" }, { fr: "3", en: "3" }, { fr: "Une redondance choisie base par base", en: "Redundancy chosen database by database" }],
            ],
          },
          {
            kind: "code",
            code: `CREATE DISKGROUP data NORMAL REDUNDANCY
  FAILGROUP baie_a DISK '/dev/oracleasm/disks/D1','/dev/oracleasm/disks/D2'
  FAILGROUP baie_b DISK '/dev/oracleasm/disks/D3','/dev/oracleasm/disks/D4'
  ATTRIBUTE 'au_size'          = '4M',
            'compatible.asm'   = '19.0.0.0',
            'compatible.rdbms' = '19.0.0.0';

ALTER DISKGROUP data ADD DISK '/dev/oracleasm/disks/D5' REBALANCE POWER 6;
ALTER DISKGROUP data DROP DISK data_0002;
ALTER DISKGROUP data MOUNT;`,
          },
          {
            kind: "tip",
            title: { fr: "Le sens des groupes de pannes", en: "What failure groups are for" },
            body: {
              fr: "Un groupe de pannes rassemble les disques qui tombent ensemble : une baie, un contrôleur, une armoire. ASM garantit que les copies d'un même extent ne se trouvent jamais dans le même groupe. Déclarer deux groupes de pannes sur la même baie physique donne une illusion de redondance — c'est l'erreur de conception la plus coûteuse.",
              en: "A failure group gathers disks that fail together: an array, a controller, a rack. ASM guarantees that copies of the same extent never sit in the same group. Declaring two failure groups on the same physical array gives an illusion of redundancy — the most expensive design mistake there is.",
            },
          },
        ],
      },
      {
        id: "rac-3-3",
        number: "3.3",
        title: { fr: "Rééquilibrage", en: "Rebalance operations" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Ajouter ou retirer un disque déclenche un rééquilibrage : ASM redistribue les extents pour que tous les disques portent une part proportionnelle. L'opération est en ligne — mais elle consomme des entrées-sorties, et sa vitesse se règle.",
              en: "Adding or removing a disk triggers a rebalance: ASM redistributes extents so that every disk carries a proportional share. The operation is online — but it consumes I/O, and its speed is tunable.",
            },
          },
          {
            kind: "code",
            code: `-- POWER : 0 (suspendu) à 1024. Défaut : ASM_POWER_LIMIT (1)
ALTER DISKGROUP data REBALANCE POWER 8;
ALTER DISKGROUP data REBALANCE POWER 0;      -- suspendre
ALTER DISKGROUP data REBALANCE POWER 8 WAIT; -- bloquer jusqu'à la fin

SELECT group_number, operation, state, power, actual,
       sofar, est_work, est_minutes
FROM   v$asm_operation;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Retirer un disque puis en ajouter un autre déclenche **deux** rééquilibrages successifs. Faire les deux dans une seule instruction n'en déclenche qu'un, deux fois plus rapide au total. Sur une grosse baie, l'écart se compte en heures.",
              en: "Dropping a disk then adding another triggers **two** successive rebalances. Doing both in a single statement triggers only one, twice as fast overall. On a large array the difference is measured in hours.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "rac-session-4",
    number: 4,
    title: { fr: "Fichiers ASM, ACFS et surveillance", en: "ASM files, ACFS and monitoring" },
    summary: {
      fr: "Nommage des fichiers, alias, modèles, puis le système de fichiers en cluster pour tout ce qui n'est pas une base — et les outils pour surveiller l'ensemble.",
      en: "File naming, aliases, templates, then the clustered file system for everything that is not a database — and the tools to monitor it all.",
    },
    estimatedMinutes: 150,
    topics: [
      {
        id: "rac-4-1",
        number: "4.1",
        title: { fr: "Noms de fichiers, alias et modèles", en: "File names, aliases and templates" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Les trois formes de nom", en: "The three name forms" },
            code: `-- 1. Nom complet, genere par ASM (jamais ecrit a la main)
+DATA/ORCL/DATAFILE/users.259.1129384501

-- 2. Alias : un nom lisible pointant vers le meme fichier
ALTER DISKGROUP data ADD ALIAS '+DATA/orcl/users01.dbf'
  FOR '+DATA/ORCL/DATAFILE/users.259.1129384501';

-- 3. Nom incomplet : ASM complete a la creation
CREATE TABLESPACE ventes DATAFILE '+DATA' SIZE 500M;`,
          },
          {
            kind: "text",
            body: {
              fr: "Les modèles (templates) définissent la redondance et la granularité de répartition par type de fichier. Un groupe de disques en redondance normale peut ainsi porter les fichiers de contrôle en HIGH et les fichiers de données en NORMAL, sans changer de groupe.",
              en: "Templates define redundancy and striping granularity per file type. A normal-redundancy disk group can therefore hold control files at HIGH and data files at NORMAL, without changing group.",
            },
          },
          {
            kind: "code",
            code: `ALTER DISKGROUP data ADD TEMPLATE ctl_haute
  ATTRIBUTE (HIGH FINE);

SELECT name, redundancy, stripe, system FROM v$asm_template
WHERE  group_number = 1;

-- Exploration en ligne de commande
$ asmcmd -p
ASMCMD> lsdg
ASMCMD> ls -l +DATA/ORCL/DATAFILE/
ASMCMD> du +DATA/ORCL
ASMCMD> lsof
ASMCMD> cp +DATA/orcl/users01.dbf /backup/users01.dbf`,
          },
        ],
      },
      {
        id: "rac-4-2",
        number: "4.2",
        title: { fr: "ACFS — le système de fichiers en cluster", en: "ACFS — the clustered file system" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "ASM ne stocke que des fichiers de base de données. ACFS étend le même stockage à tout le reste : binaires Oracle, fichiers d'export Data Pump, journaux applicatifs, fichiers d'échange entre nœuds. Il est monté simultanément sur tous les nœuds, avec instantanés et redimensionnement en ligne.",
              en: "ASM stores database files only. ACFS extends the same storage to everything else: Oracle binaries, Data Pump dump files, application logs, files shared between nodes. It mounts simultaneously on every node, with snapshots and online resizing.",
            },
          },
          {
            kind: "code",
            code: `-- 1. Un volume dans un groupe de disques
ASMCMD> volcreate -G DATA -s 20G acfsvol1
ASMCMD> volinfo -G DATA acfsvol1     # -> /dev/asm/acfsvol1-123

-- 2. Le système de fichiers
# mkfs -t acfs /dev/asm/acfsvol1-123
# mkdir /u02/acfs
# mount -t acfs /dev/asm/acfsvol1-123 /u02/acfs

-- 3. Le déclarer au cluster : monté partout, automatiquement
$ srvctl add filesystem -d /dev/asm/acfsvol1-123 -m /u02/acfs -g DATA
$ srvctl start filesystem -d /dev/asm/acfsvol1-123

-- Instantané en lecture-écriture, quasi instantané
# acfsutil snap create -w avant_maj /u02/acfs
# acfsutil size +10G /u02/acfs`,
          },
        ],
      },
      {
        id: "rac-4-3",
        number: "4.3",
        title: { fr: "Surveiller ASM", en: "Monitoring ASM" },
        blocks: [
          {
            kind: "code",
            code: `-- Espace réellement utilisable, redondance déduite
SELECT name, type, total_mb, free_mb,
       required_mirror_free_mb, usable_file_mb,
       ROUND(100 * (total_mb - free_mb) / total_mb, 1) AS pct_used
FROM   v$asm_diskgroup;

-- Répartition des E/S disque par disque
SELECT d.name, d.path, d.reads, d.writes,
       d.read_time, d.write_time
FROM   v$asm_disk d WHERE d.group_number = 1;

-- Clients connectés à l'instance ASM
SELECT instance_name, db_name, status FROM v$asm_client;`,
          },
          {
            kind: "warning",
            title: { fr: "USABLE_FILE_MB peut devenir négatif", en: "USABLE_FILE_MB can go negative" },
            body: {
              fr: "Cette colonne indique l'espace encore inscriptible **en conservant la capacité de reconstruire après la perte d'un groupe de pannes**. Une valeur négative signifie que le groupe est plein au point de ne plus pouvoir se réparer : la redondance est encore là, mais la prochaine panne de disque sera définitive. C'est le seuil d'alerte à surveiller, pas FREE_MB.",
              en: "This column shows how much can still be written **while keeping the ability to rebuild after losing a failure group**. A negative value means the group is so full it can no longer heal itself: redundancy is still there, but the next disk failure will be permanent. That is the threshold to alert on, not FREE_MB.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "rac-session-5",
    number: 5,
    title: { fr: "Real Application Clusters : Cache Fusion, services et connectivité", en: "Real Application Clusters: Cache Fusion, services and connectivity" },
    summary: {
      fr: "Comment plusieurs instances partagent une seule base sans se corrompre, comment on répartit la charge par services, et comment les clients suivent une panne de nœud sans erreur visible.",
      en: "How several instances share one database without corrupting it, how load is distributed through services, and how clients survive a node failure without a visible error.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "rac-5-1",
        number: "5.1",
        title: { fr: "Cache Fusion", en: "Cache Fusion" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Chaque instance a son propre buffer cache. Cache Fusion résout le problème que cela pose : quand l'instance 2 a besoin d'un bloc que l'instance 1 a modifié en mémoire, le bloc transite **par l'interconnexion**, pas par le disque. Un bloc maître (GRD) sait à tout instant quelle instance détient quelle version.",
              en: "Each instance has its own buffer cache. Cache Fusion solves the problem that creates: when instance 2 needs a block that instance 1 has modified in memory, the block travels **over the interconnect**, not via disk. A master directory (GRD) knows at all times which instance holds which version.",
            },
          },
          {
            kind: "table",
            title: { fr: "Les processus RAC", en: "RAC processes" },
            headers: [
              { fr: "Processus", en: "Process" },
              { fr: "Rôle", en: "Role" },
            ],
            rows: [
              [{ fr: "LMS", en: "LMS" }, { fr: "Transfère les blocs entre instances — le cœur de Cache Fusion", en: "Ships blocks between instances — the heart of Cache Fusion" }],
              [{ fr: "LMD", en: "LMD" }, { fr: "Gère les demandes de verrous globaux", en: "Manages global lock requests" }],
              [{ fr: "LMON", en: "LMON" }, { fr: "Surveille l'appartenance et pilote la reconfiguration", en: "Monitors membership and drives reconfiguration" }],
              [{ fr: "LCK0", en: "LCK0" }, { fr: "Verrous hors blocs de données (dictionnaire, bibliothèque)", en: "Non-data-block locks (dictionary, library cache)" }],
              [{ fr: "DIAG", en: "DIAG" }, { fr: "Capture les diagnostics lors d'un incident", en: "Captures diagnostics when an incident occurs" }],
            ],
          },
          {
            kind: "code",
            code: `-- Santé de l'interconnexion : le temps de transfert doit rester bas
SELECT inst_id, name, value FROM gv$sysstat
WHERE  name LIKE 'gc%receive time'
   OR  name LIKE 'gc%blocks received';

SELECT inst_id, event, total_waits,
       ROUND(time_waited_micro/1000/NULLIF(total_waits,0), 2) AS ms_moyen
FROM   gv$system_event
WHERE  event LIKE 'gc %' ORDER BY total_waits DESC FETCH FIRST 10 ROWS ONLY;

-- Interface réellement utilisée par l'interconnexion
SELECT inst_id, name_ksxpia, ip_ksxpia FROM gv$configured_interconnects;`,
          },
          {
            kind: "warning",
            body: {
              fr: "Un temps d'attente `gc cr block 2-way` supérieur à quelques millisecondes trahit presque toujours l'interconnexion : réseau partagé avec le trafic public, MTU non alignée, ou carte saturée. Chercher la cause côté SQL avant d'avoir vérifié le réseau fait perdre des jours.",
              en: "A `gc cr block 2-way` wait above a few milliseconds almost always points to the interconnect: a network shared with public traffic, a mismatched MTU, or a saturated card. Looking for the cause in SQL before checking the network wastes days.",
            },
          },
        ],
      },
      {
        id: "rac-5-2",
        number: "5.2",
        title: { fr: "Administrer une base RAC", en: "Administering a RAC database" },
        blocks: [
          {
            kind: "code",
            code: `# Vue d'ensemble
$ srvctl config database -d orcl
$ srvctl status database -d orcl -v

# Une instance à la fois
$ srvctl stop instance -d orcl -i orcl2 -o immediate
$ srvctl start instance -d orcl -i orcl2

# Politique de démarrage
$ srvctl modify database -d orcl -policy AUTOMATIC

-- Paramètres : certains DOIVENT différer par instance
ALTER SYSTEM SET undo_tablespace='UNDOTBS2' SID='orcl2' SCOPE=SPFILE;
ALTER SYSTEM SET open_cursors=500 SID='*' SCOPE=BOTH;

-- Chaque instance a son propre thread de redo et son propre undo
SELECT thread#, instance, status FROM v$thread;
SELECT inst_id, tablespace_name FROM gv$parameter
WHERE name = 'undo_tablespace';`,
          },
          {
            kind: "tip",
            title: { fr: "Les vues GV$", en: "The GV$ views" },
            body: {
              fr: "À chaque vue `V$` correspond une vue `GV$` qui agrège toutes les instances et ajoute une colonne `INST_ID`. En RAC, interroger `V$SESSION` ne montre que le nœud local — une source d'erreur permanente en diagnostic. Prendre le réflexe `GV$` dès le départ.",
              en: "Every `V$` view has a `GV$` counterpart that aggregates all instances and adds an `INST_ID` column. In RAC, querying `V$SESSION` shows only the local node — a permanent source of diagnostic error. Build the `GV$` reflex from day one.",
            },
          },
        ],
      },
      {
        id: "rac-5-3",
        number: "5.3",
        title: { fr: "Services, SCAN et basculement client", en: "Services, SCAN and client failover" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "Un service est l'unité de travail du RAC : il définit sur quelles instances une application s'exécute, où elle bascule, et comment ses ressources sont mesurées. Sans services, toutes les applications se connectent partout et rien n'est isolable.",
              en: "A service is RAC's unit of work: it defines which instances an application runs on, where it fails over, and how its resources are measured. Without services, every application connects everywhere and nothing can be isolated.",
            },
          },
          {
            kind: "code",
            code: `# Service préféré sur orcl1, repli sur orcl2
$ srvctl add service -d orcl -s ventes \\
    -preferred orcl1 -available orcl2 \\
    -failovertype TRANSACTION -failovermethod BASIC \\
    -commit_outcome TRUE -failoverretry 30 -failoverdelay 3 \\
    -notification TRUE -clbgoal SHORT -rlbgoal SERVICE_TIME
$ srvctl start service -d orcl -s ventes

# Déplacer un service sans coupure
$ srvctl relocate service -d orcl -s ventes -oldinst orcl1 -newinst orcl2

# Le SCAN : un seul nom pour tout le cluster
$ srvctl config scan
$ srvctl status scan_listener`,
          },
          {
            kind: "code",
            title: { fr: "Descripteur client — un seul nom, aucune reconfiguration", en: "Client descriptor — one name, no reconfiguration" },
            code: `VENTES =
 (DESCRIPTION =
   (CONNECT_TIMEOUT=10)(RETRY_COUNT=20)(RETRY_DELAY=3)
   (ADDRESS = (PROTOCOL = TCP)(HOST = cluster-scan)(PORT = 1521))
   (CONNECT_DATA = (SERVICE_NAME = ventes)))`,
            caption: {
              fr: "Le SCAN résout vers trois adresses en tourniquet ; chaque listener SCAN redirige vers le listener local de l'instance la moins chargée. Ajouter ou retirer un nœud ne change rien côté client — c'est tout l'intérêt.",
              en: "The SCAN resolves to three addresses round-robin; each SCAN listener redirects to the local listener of the least-loaded instance. Adding or removing a node changes nothing client-side — that is the whole point.",
            },
          },
          {
            kind: "table",
            title: { fr: "Trois niveaux de continuité", en: "Three levels of continuity" },
            headers: [
              { fr: "Mécanisme", en: "Mechanism" },
              { fr: "Ce qui survit", en: "What survives" },
            ],
            rows: [
              [{ fr: "TAF — BASIC / SELECT", en: "TAF — BASIC / SELECT" }, { fr: "La connexion, et un SELECT en cours de lecture", en: "The connection, and a SELECT mid-fetch" }],
              [{ fr: "FAN + Fast Connection Failover", en: "FAN + Fast Connection Failover" }, { fr: "Le pool de connexions est notifié immédiatement, sans attendre un délai TCP", en: "The connection pool is notified at once, without waiting for a TCP timeout" }],
              [{ fr: "Application Continuity", en: "Application Continuity" }, { fr: "**La transaction en cours**, rejouée de façon transparente", en: "**The in-flight transaction**, replayed transparently" }],
            ],
          },
        ],
      },
    ],
  },

  {
    id: "rac-session-6",
    number: 6,
    title: { fr: "Performance, sauvegarde, correctifs et dépannage", en: "Performance, backup, patching and troubleshooting" },
    summary: {
      fr: "Ce qui distingue vraiment l'exploitation d'un RAC : diagnostiquer le cache global, sauvegarder une base multi-instances, appliquer un correctif sans arrêt, et lire une éviction de nœud.",
      en: "What really sets RAC operations apart: diagnosing the global cache, backing up a multi-instance database, patching without downtime, and reading a node eviction.",
    },
    estimatedMinutes: 180,
    topics: [
      {
        id: "rac-6-1",
        number: "6.1",
        title: { fr: "Optimiser le cache global", en: "Tuning the global cache" },
        blocks: [
          {
            kind: "table",
            title: { fr: "Les attentes globales et leur signification", en: "Global waits and what they mean" },
            headers: [
              { fr: "Attente", en: "Wait" },
              { fr: "Signification", en: "Meaning" },
              { fr: "Piste", en: "Direction" },
            ],
            rows: [
              [
                { fr: "gc cr block 2-way", en: "gc cr block 2-way" },
                { fr: "Bloc cohérent reçu d'une autre instance — normal", en: "Consistent-read block received from another instance — normal" },
                { fr: "Ne s'inquiéter qu'au-delà de quelques ms", en: "Only worry beyond a few ms" },
              ],
              [
                { fr: "gc buffer busy acquire / release", en: "gc buffer busy acquire / release" },
                { fr: "Plusieurs instances se disputent le même bloc", en: "Several instances contend for the same block" },
                { fr: "Bloc chaud : séquence, index sur clé croissante", en: "Hot block: sequence, index on an ascending key" },
              ],
              [
                { fr: "gc current block busy", en: "gc current block busy" },
                { fr: "Bloc en cours de modification ailleurs", en: "Block being modified elsewhere" },
                { fr: "Partitionner l'application par service", en: "Partition the application by service" },
              ],
              [
                { fr: "gc cr block lost", en: "gc cr block lost" },
                { fr: "**Bloc perdu sur l'interconnexion**", en: "**Block lost on the interconnect**" },
                { fr: "Problème réseau matériel — à traiter en priorité", en: "Hardware network problem — top priority" },
              ],
            ],
          },
          {
            kind: "list",
            title: { fr: "Les remèdes classiques", en: "The classic remedies" },
            items: [
              { fr: "Séquences : `CACHE 1000 NOORDER` — une séquence `ORDER` sérialise tout le cluster", en: "Sequences: `CACHE 1000 NOORDER` — an `ORDER` sequence serialises the whole cluster" },
              { fr: "Index sur clé croissante : passer en index inversé ou haché pour éliminer le bloc chaud terminal", en: "Ascending-key indexes: switch to a reverse-key or hash index to remove the hot trailing block" },
              { fr: "Partitionner l'application par service, pour que chaque instance travaille sur ses propres blocs", en: "Partition the application by service, so each instance works on its own blocks" },
              { fr: "Augmenter `INITRANS` et `PCTFREE` sur les tables très concurrentes", en: "Raise `INITRANS` and `PCTFREE` on heavily concurrent tables" },
              { fr: "Vérifier l'interconnexion **avant** tout : MTU, réseau dédié, absence de perte de paquets", en: "Check the interconnect **first**: MTU, dedicated network, no packet loss" },
            ],
          },
        ],
      },
      {
        id: "rac-6-2",
        number: "6.2",
        title: { fr: "Sauvegarder et restaurer une base RAC", en: "Backing up and recovering a RAC database" },
        blocks: [
          {
            kind: "text",
            body: {
              fr: "La sauvegarde d'une base RAC ne diffère pas dans son principe : une seule base, donc une seule sauvegarde. Deux points changent réellement : chaque instance a son propre thread de redo, et les canaux RMAN peuvent être répartis sur plusieurs nœuds.",
              en: "Backing up a RAC database is no different in principle: one database, therefore one backup. Two things genuinely change: each instance has its own redo thread, and RMAN channels can be spread across nodes.",
            },
          },
          {
            kind: "code",
            code: `-- Paralléliser sur deux nœuds
RUN {
  ALLOCATE CHANNEL c1 DEVICE TYPE DISK CONNECT 'sys/mdp@orcl1';
  ALLOCATE CHANNEL c2 DEVICE TYPE DISK CONNECT 'sys/mdp@orcl2';
  BACKUP DATABASE PLUS ARCHIVELOG;
}

-- Les archives de TOUS les threads doivent être accessibles
-- lors de la récupération : les placer dans la FRA partagée.
SELECT thread#, sequence#, name FROM v$archived_log
WHERE  completion_time > SYSDATE - 1 ORDER BY thread#, sequence#;

-- Récupération : une seule instance monte la base
$ srvctl stop database -d orcl
SQL> STARTUP MOUNT;
RMAN> RESTORE DATABASE;
RMAN> RECOVER DATABASE;   -- rejoue les redo de tous les threads
SQL> ALTER DATABASE OPEN;
$ srvctl start database -d orcl`,
          },
        ],
      },
      {
        id: "rac-6-3",
        number: "6.3",
        title: { fr: "Correctifs progressifs et dépannage", en: "Rolling patches and troubleshooting" },
        blocks: [
          {
            kind: "code",
            title: { fr: "Correctif progressif : un nœud à la fois", en: "Rolling patch: one node at a time" },
            code: `# Vérifier que le correctif est applicable en mode progressif
$ opatch query -all /stage/patch/34765931 | grep -i rolling

$ opatchauto apply /stage/patch/34765931 -oh $GRID_HOME
# arrête la pile du nœud, applique, redémarre — les autres nœuds servent

$ opatch lspatches
$ crsctl query crs softwarepatch`,
          },
          {
            kind: "table",
            title: { fr: "Où chercher quand un nœud est évincé", en: "Where to look when a node is evicted" },
            headers: [
              { fr: "Fichier", en: "File" },
              { fr: "Ce qu'il révèle", en: "What it reveals" },
            ],
            rows: [
              [
                { fr: "$GRID_BASE/diag/crs/<nœud>/crs/trace/alert.log", en: "$GRID_BASE/diag/crs/<node>/crs/trace/alert.log" },
                { fr: "Journal d'alertes du cluster — le point de départ", en: "Cluster alert log — the starting point" },
              ],
              [
                { fr: "ocssd.trc", en: "ocssd.trc" },
                { fr: "Motif exact de l'éviction : heartbeat réseau ou disque", en: "Exact eviction reason: network or disk heartbeat" },
              ],
              [
                { fr: "crsd.trc", en: "crsd.trc" },
                { fr: "Échec de démarrage ou de bascule d'une ressource", en: "Resource start or failover failure" },
              ],
              [
                { fr: "Journal système (messages, journalctl)", en: "System log (messages, journalctl)" },
                { fr: "Panne matérielle, saturation mémoire, OOM killer", en: "Hardware failure, memory exhaustion, OOM killer" },
              ],
            ],
          },
          {
            kind: "warning",
            title: { fr: "Les deux causes d'éviction", en: "The two causes of eviction" },
            body: {
              fr: "Un nœud est évincé soit parce qu'il n'a plus répondu au heartbeat réseau au-delà de `misscount` (30 s par défaut), soit parce qu'il n'a plus atteint les voting disks au-delà de `disktimeout` (200 s). Le cluster préfère perdre un nœud plutôt que risquer un split-brain : cette éviction n'est pas un défaut, c'est la protection qui fonctionne.",
              en: "A node is evicted either because it stopped answering the network heartbeat beyond `misscount` (30 s by default), or because it stopped reaching the voting disks beyond `disktimeout` (200 s). The cluster would rather lose a node than risk a split brain: that eviction is not a defect, it is the protection working.",
            },
          },
          {
            kind: "code",
            code: `# crsctl get css misscount
# crsctl get css disktimeout
$ oclumon dumpnodeview -allnodes -last "00:15:00"
$ diagcollection.sh --collect --crs`,
          },
        ],
      },
    ],
  },
];
