import type { SessionExtras } from "./course-extras";

/**
 * Points à retenir et questions de contrôle des douze sessions ajoutées
 * pour couvrir l'intégralité des programmes officiels 1Z0-084, 1Z0-076
 * et 1Z0-078.
 */
export const advancedSessionExtrasB: Record<string, SessionExtras> = {
  // ═══════════ 1Z0-084 — sessions 11 à 13 ═══════════
  "tun-session-11": {
    keyTakeaways: [
      { fr: "Chaînage : la ligne ne tient pas dans un bloc — inévitable. Migration : la ligne a grossi — évitable par PCTFREE.", en: "Chaining: the row does not fit in a block — unavoidable. Migration: the row grew — avoidable with PCTFREE." },
      { fr: "Au-delà de 255 colonnes, une ligne est toujours chaînée, quelle que soit sa taille.", en: "Beyond 255 columns a row is always chained, whatever its size." },
      { fr: "Un DELETE ne fait pas redescendre la high water mark : un balayage lit toujours les blocs vides.", en: "A DELETE does not lower the high water mark: a scan still reads the empty blocks." },
      { fr: "SHRINK SPACE COMPACT en journée, SHRINK SPACE en heure creuse : le verrou exclusif ne dure alors qu'un instant.", en: "SHRINK SPACE COMPACT during the day, SHRINK SPACE off-peak: the exclusive lock then lasts only a moment." },
      { fr: "La compression BASIC ne s'applique qu'aux chargements directs ; ADVANCED couvre tout le DML.", en: "BASIC compression only applies to direct-path loads; ADVANCED covers all DML." },
      { fr: "Un index invisible se teste sans risque : une commande le remet en service.", en: "An invisible index can be tested risk-free: one command puts it back in service." },
    ],
    selfCheck: [
      { question: { fr: "« table fetch continued row » augmente vite. Comment savoir s'il s'agit de chaînage ou de migration ?", en: "“table fetch continued row” is rising fast. How do you tell chaining from migration?" }, answer: { fr: "Par ANALYZE TABLE … LIST CHAINED ROWS, puis en comparant la longueur moyenne des lignes à la taille utile du bloc : si AVG_ROW_LEN reste largement inférieur, c'est de la migration, et PCTFREE est le remède.", en: "With ANALYZE TABLE … LIST CHAINED ROWS, then comparing average row length to the block's usable size: if AVG_ROW_LEN stays well below it, it is migration, and PCTFREE is the remedy." } },
      { question: { fr: "Une table déclarée COMPRESS BASIC n'occupe pas moins d'espace. Pourquoi ?", en: "A table declared COMPRESS BASIC takes no less space. Why?" }, answer: { fr: "Parce que l'application charge en INSERT conventionnel. BASIC ne compresse qu'en chemin direct — INSERT /*+ APPEND */ ou CTAS. Il faut passer en ADVANCED, ou changer le mode de chargement.", en: "Because the application loads with conventional INSERTs. BASIC only compresses on direct path — INSERT /*+ APPEND */ or CTAS. Switch to ADVANCED, or change the load method." } },
      { question: { fr: "Pourquoi ENABLE ROW MOVEMENT est-il exigé avant un SHRINK ?", en: "Why is ENABLE ROW MOVEMENT required before a SHRINK?" }, answer: { fr: "Parce que le compactage déplace physiquement les lignes : leur ROWID change. Oracle exige un consentement explicite, car toute application mémorisant un ROWID entre deux transactions cesserait de fonctionner.", en: "Because compaction physically moves rows: their ROWIDs change. Oracle demands explicit consent, because any application caching a ROWID between transactions would break." } },
    ],
  },
  "tun-session-12": {
    keyTakeaways: [
      { fr: "SPA compare instruction par instruction ; Database Replay rejoue la charge entière avec sa concurrence.", en: "SPA compares statement by statement; Database Replay replays the whole workload with its concurrency." },
      { fr: "Le SQL Tuning Set est la matière première : capturé depuis AWR, transporté par Data Pump.", en: "The SQL Tuning Set is the raw material: captured from AWR, transported by Data Pump." },
      { fr: "SPA : TEST EXECUTE mesure vraiment, EXPLAIN PLAN se contente de comparer les plans.", en: "SPA: TEST EXECUTE really measures, EXPLAIN PLAN merely compares plans." },
      { fr: "Seule la catégorie « régressées » du rapport SPA mérite qu'on s'y arrête.", en: "Only the “regressed” bucket of the SPA report deserves attention." },
      { fr: "Database Replay exige une base de test ramenée au SCN exact du début de capture.", en: "Database Replay requires a test database rewound to the exact capture-start SCN." },
      { fr: "RAT est une option payante ; les SQL Tuning Sets relèvent du Tuning Pack.", en: "RAT is a paid option; SQL Tuning Sets belong to the Tuning Pack." },
    ],
    selfCheck: [
      { question: { fr: "SPA annonce que toutes les instructions s'améliorent. Peut-on migrer sereinement ?", en: "SPA reports that every statement improves. Can you migrate with confidence?" }, answer: { fr: "Pas encore : SPA exécute les instructions isolément et ne dit rien de la concurrence. Un plan qui passe d'un index scan à un balayage complet peut être plus rapide seul et saturer les E/S quand cinquante sessions le lancent ensemble. C'est Database Replay qui répond.", en: "Not yet: SPA runs statements in isolation and says nothing about concurrency. A plan switching from an index scan to a full scan can be faster alone and saturate I/O when fifty sessions run it together. Database Replay is what answers that." } },
      { question: { fr: "Le rapport de rejeu signale des centaines d'erreurs nouvelles. Première hypothèse ?", en: "The replay report shows hundreds of new errors. First hypothesis?" }, answer: { fr: "La base de test n'était pas au bon état de départ. Les UPDATE ne trouvent pas leurs lignes, les contraintes d'unicité cèdent. Il faut poser un point de restauration garanti avant la capture et y ramener la base de test par Flashback avant chaque rejeu.", en: "The test database was not in the right starting state. UPDATEs cannot find their rows, unique constraints break. Create a guaranteed restore point before the capture and flash the test database back to it before every replay." } },
    ],
  },
  "tun-session-13": {
    keyTakeaways: [
      { fr: "V$BH croisé avec DBA_OBJECTS montre exactement ce qui occupe le buffer cache.", en: "V$BH joined to DBA_OBJECTS shows exactly what occupies the buffer cache." },
      { fr: "KEEP pour les petites tables lues sans cesse, RECYCLE pour les gros segments balayés une fois.", en: "KEEP for small constantly-read tables, RECYCLE for large once-scanned segments." },
      { fr: "DB_BIG_TABLE_CACHE_PERCENT_TARGET met en cache les grandes tables les plus « chaudes » plutôt que de les relire en lecture directe.", en: "DB_BIG_TABLE_CACHE_PERCENT_TARGET caches the hottest large tables instead of re-reading them by direct path." },
      { fr: "Le Flash Cache consomme de la SGA : environ 100 octets par bloc suivi, 200 en RAC.", en: "The Flash Cache consumes SGA: about 100 bytes per tracked block, 200 in RAC." },
      { fr: "Une exécution multi-pass dans V$SQL_WORKAREA_HISTOGRAM est le pire cas : à corriger en priorité.", en: "A multi-pass execution in V$SQL_WORKAREA_HISTOGRAM is the worst case: fix it first." },
      { fr: "Un TEMP saturé n'est jamais la maladie : c'est le symptôme d'une PGA trop petite ou d'un plan inadapté.", en: "A saturated TEMP is never the disease: it is the symptom of an undersized PGA or an unsuitable plan." },
    ],
    selfCheck: [
      { question: { fr: "Que doit valoir ESTD_OVERALLOC_COUNT à la cible PGA retenue ?", en: "What must ESTD_OVERALLOC_COUNT be at the chosen PGA target?" }, answer: { fr: "Zéro. Une valeur non nulle signifie que l'instance devra dépasser sa cible pour servir les sessions, donc empiéter sur la mémoire du système d'exploitation — avec un risque de swap.", en: "Zero. A non-zero value means the instance will have to exceed its target to serve sessions, and so encroach on operating system memory — with a swapping risk." } },
      { question: { fr: "On alloue 200 Go de Flash Cache sans toucher à la SGA. Que se passe-t-il ?", en: "You allocate 200 GB of Flash Cache without touching the SGA. What happens?" }, answer: { fr: "Les en-têtes de suivi consomment environ 2,5 Go de SGA. Comme la SGA n'a pas grandi, cette mémoire est prise sur le buffer cache : on rétrécit le cache de premier niveau pour gagner un cache de second niveau, ce qui peut dégrader les performances.", en: "Tracking headers consume about 2.5 GB of SGA. Since the SGA did not grow, that memory comes out of the buffer cache: you shrink the first-level cache to gain a second-level one, which can degrade performance." } },
      { question: { fr: "À quoi sert un groupe de tablespaces temporaires ?", en: "What is a temporary tablespace group for?" }, answer: { fr: "À répartir les zones de travail d'une même requête parallèle sur plusieurs fichiers temporaires, ce qui évite qu'un seul fichier devienne le goulot d'étranglement. Un utilisateur ou la base entière peut y être rattaché comme à un tablespace ordinaire.", en: "To spread one parallel query's work areas across several temp files, stopping a single file becoming the bottleneck. A user or the whole database can be attached to it like an ordinary tablespace." } },
    ],
  },

  // ═══════════ 1Z0-076 — sessions 9 à 11 ═══════════
  "dg-session-9": {
    keyTakeaways: [
      { fr: "READ ONLY WITH APPLY est la seule preuve qu'Active Data Guard est réellement actif.", en: "READ ONLY WITH APPLY is the only proof Active Data Guard is genuinely active." },
      { fr: "STANDBY_MAX_DATA_DELAY fait échouer la requête plutôt que de renvoyer des données périmées.", en: "STANDBY_MAX_DATA_DELAY fails the query rather than returning stale data." },
      { fr: "Tables temporaires globales : autorisées, mais elles exigent TEMP_UNDO_ENABLED.", en: "Global temporary tables: allowed, but they require TEMP_UNDO_ENABLED." },
      { fr: "ADG Redirect (19c) renvoie le DML vers la principale, de façon transparente.", en: "ADG Redirect (19c) sends DML back to the primary, transparently." },
      { fr: "AWR pour base de secours écrit ses instantanés dans la base principale, identifiés par DBID.", en: "Standby AWR writes its snapshots into the primary, identified by DBID." },
    ],
    selfCheck: [
      { question: { fr: "Une écriture dans une table temporaire globale échoue avec ORA-16000 sur la base de secours. Pourquoi ?", en: "Writing to a global temporary table fails with ORA-16000 on the standby. Why?" }, answer: { fr: "Parce que TEMP_UNDO_ENABLED est à FALSE : l'écriture génère alors de l'undo ordinaire, impossible sur une base ouverte en lecture seule. L'undo temporaire résout le problème.", en: "Because TEMP_UNDO_ENABLED is FALSE: the write then generates ordinary undo, which is impossible on a read-only database. Temporary undo solves it." } },
      { question: { fr: "Comment garantir qu'un rapport ne s'exécute jamais sur des données de plus de dix secondes ?", en: "How do you guarantee a report never runs on data more than ten seconds old?" }, answer: { fr: "ALTER SESSION SET standby_max_data_delay = 10 : au-delà, la requête échoue sur ORA-03172 plutôt que de renvoyer un résultat périmé sans que personne ne le sache.", en: "ALTER SESSION SET standby_max_data_delay = 10: beyond that the query fails with ORA-03172 rather than silently returning a stale result." } },
    ],
  },
  "dg-session-10": {
    keyTakeaways: [
      { fr: "NET_TIMEOUT se règle à 3 à 5 fois la latence maximale observée, pas au hasard.", en: "NET_TIMEOUT is set to 3–5 times the maximum observed latency, not at random." },
      { fr: "REOPEN fixe le délai avant nouvelle tentative après un échec de destination.", en: "REOPEN sets the delay before retrying a destination after a failure." },
      { fr: "Tampon TCP = bande passante × latence aller-retour. 64 Ko par défaut plafonne un lien rapide et lointain.", en: "TCP buffer = bandwidth × round-trip latency. A default 64 KB caps a fast, distant link." },
      { fr: "MRP0 bloqué en WAIT_FOR_LOG signale un problème de transport, pas d'application.", en: "MRP0 stuck in WAIT_FOR_LOG signals a transport problem, not an apply problem." },
      { fr: "En Active Data Guard, un plan Resource Manager protège l'application du redo des requêtes de rapport.", en: "In Active Data Guard, a Resource Manager plan protects redo apply from reporting queries." },
    ],
    selfCheck: [
      { question: { fr: "La configuration bascule en mode dégradé plusieurs fois par jour, sans panne réseau réelle. Que suspecter ?", en: "The configuration degrades several times a day, with no real network outage. What do you suspect?" }, answer: { fr: "Un NET_TIMEOUT trop court : une micro-coupure de quelques secondes suffit alors à rompre la liaison synchrone. Il faut mesurer la latence réelle et le porter à trois à cinq fois le maximum observé.", en: "A NET_TIMEOUT that is too short: a few seconds' glitch is then enough to break the synchronous link. Measure real latency and raise it to three to five times the observed maximum." } },
      { question: { fr: "Transport lag nul, apply lag qui grandit chaque matin de 8 h à 10 h. Cause probable ?", en: "Zero transport lag, apply lag growing every morning from 8 to 10. Likely cause?" }, answer: { fr: "Active Data Guard : les requêtes de rapport lancées à l'ouverture concurrencent l'application du redo pour le CPU et les entrées-sorties. Un plan Resource Manager plafonnant les sessions de rapport rétablit la priorité.", en: "Active Data Guard: reporting queries launched at opening time compete with redo apply for CPU and I/O. A Resource Manager plan capping reporting sessions restores the priority." } },
    ],
  },
  "dg-session-11": {
    keyTakeaways: [
      { fr: "On ne se connecte jamais à un nom de base : on se connecte à un service lié au rôle.", en: "Never connect to a database name: connect to a role-bound service." },
      { fr: "Sans Grid Infrastructure, un trigger DB_ROLE_CHANGE remplace l'attribut -role de srvctl.", en: "Without Grid Infrastructure, a DB_ROLE_CHANGE trigger replaces srvctl's -role attribute." },
      { fr: "TRANSPORT_CONNECT_TIMEOUT évite d'attendre le délai du système avant d'essayer le second site.", en: "TRANSPORT_CONNECT_TIMEOUT avoids waiting out the OS timeout before trying the second site." },
      { fr: "TAF reconnecte, Application Continuity rejoue. La différence compte dès qu'il y a des écritures.", en: "TAF reconnects, Application Continuity replays. The difference matters as soon as there are writes." },
      { fr: "Un appel externe dans une transaction la rend non rejouable.", en: "An external call inside a transaction makes it non-replayable." },
    ],
    selfCheck: [
      { question: { fr: "La bascule prend quinze secondes côté base, mais cinq minutes côté application. Où chercher ?", en: "Failover takes fifteen seconds on the database, five minutes on the application. Where do you look?" }, answer: { fr: "Dans le descripteur de connexion : sans TRANSPORT_CONNECT_TIMEOUT, le client attend le délai TCP du système — souvent plus de deux minutes — avant même d'essayer la seconde adresse. RETRY_COUNT et RETRY_DELAY complètent le réglage.", en: "In the connect descriptor: without TRANSPORT_CONNECT_TIMEOUT the client waits out the OS TCP timeout — often over two minutes — before even trying the second address. RETRY_COUNT and RETRY_DELAY complete the setting." } },
      { question: { fr: "Pourquoi COMMIT_OUTCOME est-il indispensable à Application Continuity ?", en: "Why is COMMIT_OUTCOME essential to Application Continuity?" }, answer: { fr: "Parce qu'après une coupure, le pilote doit savoir si le COMMIT a été validé avant la panne. Sans cette information, rejouer risquerait de dupliquer la transaction ; ne pas rejouer risquerait de la perdre.", en: "Because after a break the driver must know whether the COMMIT went through before the failure. Without it, replaying risks duplicating the transaction; not replaying risks losing it." } },
    ],
  },

  // ═══════════ 1Z0-078 — sessions 7 à 12 ═══════════
  "rac-session-7": {
    keyTakeaways: [
      { fr: "Flex ASM découple les bases des instances ASM : une base peut se connecter à l'ASM d'un autre nœud.", en: "Flex ASM decouples databases from ASM instances: a database can connect to another node's ASM." },
      { fr: "Cardinalité 3 par défaut, quel que soit le nombre de nœuds. ALL revient au comportement classique.", en: "Cardinality 3 by default, whatever the node count. ALL restores classic behaviour." },
      { fr: "Flex ASM exige COMPATIBLE.ASM ≥ 12.1 sur tous les groupes de disques.", en: "Flex ASM requires COMPATIBLE.ASM ≥ 12.1 on every disk group." },
      { fr: "ADVM expose des volumes /dev/asm/… ; ACFS est le système de fichiers posé dessus.", en: "ADVM exposes /dev/asm/… volumes; ACFS is the file system placed on top." },
      { fr: "ACFS chiffre, audite, réplique et étiquette — l'étiquetage sert à cibler les trois autres.", en: "ACFS encrypts, audits, replicates and tags — tagging is what targets the other three." },
      { fr: "La haute disponibilité NFS repose sur une HAVIP gérée par Clusterware.", en: "NFS high availability rests on a Clusterware-managed HAVIP." },
    ],
    selfCheck: [
      { question: { fr: "L'activation de Flex ASM échoue sans message clair. Que vérifier en premier ?", en: "Enabling Flex ASM fails with no clear message. What do you check first?" }, answer: { fr: "L'attribut COMPATIBLE.ASM de chaque groupe de disques : un seul groupe resté en 11.2 suffit à bloquer le mode Flex. Le relever est irréversible, donc à décider en connaissance de cause.", en: "The COMPATIBLE.ASM attribute of every disk group: a single group left at 11.2 is enough to block Flex mode. Raising it is irreversible, so decide deliberately." } },
      { question: { fr: "Que se passe-t-il pour une base quand l'instance ASM de son nœud disparaît, en Flex ASM ?", en: "What happens to a database when its node's ASM instance disappears, under Flex ASM?" }, answer: { fr: "Elle se rattache automatiquement à une autre instance ASM du cluster par le réseau ASM, et continue de fonctionner. En ASM classique, toutes les bases du nœud seraient tombées.", en: "It automatically reattaches to another ASM instance in the cluster over the ASM network and keeps running. Under classic ASM every database on the node would have gone down." } },
    ],
  },
  "rac-session-8": {
    keyTakeaways: [
      { fr: "Grid Infrastructure d'abord, base ensuite. cluvfy stage -pre dbinst avant d'installer.", en: "Grid Infrastructure first, database second. cluvfy stage -pre dbinst before installing." },
      { fr: "Chaque instance a son thread de redo et son tablespace d'annulation — les deux oublis classiques.", en: "Each instance has its redo thread and undo tablespace — the two classic omissions." },
      { fr: "Un thread doit être PUBLIC pour qu'une instance quelconque puisse s'en emparer.", en: "A thread must be PUBLIC for any instance to claim it." },
      { fr: "SPFILE unique et partagé sur ASM ; SID='*' pour toutes, SID='orcl2' pour une seule.", en: "A single SPFILE shared on ASM; SID='*' for all, SID='orcl2' for one." },
      { fr: "rconfig convertit une base mono-instance en RAC ; toujours commencer par la vérification à blanc.", en: "rconfig converts a single-instance database to RAC; always start with the dry run." },
    ],
    selfCheck: [
      { question: { fr: "Une instance ajoutée refuse de démarrer. Quels deux objets vérifier immédiatement ?", en: "A newly added instance refuses to start. Which two objects do you check at once?" }, answer: { fr: "Son thread de redo — existe-t-il, est-il activé et PUBLIC ? — et son tablespace d'annulation, désigné par UNDO_TABLESPACE avec le bon SID dans le SPFILE.", en: "Its redo thread — does it exist, is it enabled and PUBLIC? — and its undo tablespace, named by UNDO_TABLESPACE with the right SID in the SPFILE." } },
      { question: { fr: "Comment repérer d'un coup toutes les divergences de paramètres entre instances ?", en: "How do you spot every parameter divergence between instances at once?" }, answer: { fr: "Une requête sur GV$PARAMETER groupée par nom, en ne gardant que les paramètres dont COUNT(DISTINCT value) dépasse 1. C'est le premier réflexe quand une instance se comporte différemment des autres.", en: "A query on GV$PARAMETER grouped by name, keeping only parameters whose COUNT(DISTINCT value) exceeds 1. It is the first reflex when one instance behaves differently." } },
    ],
  },
  "rac-session-9": {
    keyTakeaways: [
      { fr: "Deux équilibrages : le client répartit ses tentatives, le serveur redirige vers l'instance la moins chargée.", en: "Two balancings: the client spreads its attempts, the server redirects to the least-loaded instance." },
      { fr: "CLBGOAL SHORT pour un pool de connexions, LONG pour des sessions ouvertes toute la journée.", en: "CLBGOAL SHORT for a connection pool, LONG for sessions open all day." },
      { fr: "RLBGOAL SERVICE_TIME en OLTP, THROUGHPUT pour les traitements de masse.", en: "RLBGOAL SERVICE_TIME for OLTP, THROUGHPUT for bulk jobs." },
      { fr: "FAN ne sert à rien si le client ne sait pas l'écouter : il faut UCP, WebLogic, ODP.NET ou OCI.", en: "FAN is useless if the client cannot listen: you need UCP, WebLogic, ODP.NET or OCI." },
      { fr: "Sans -failback, un service déplacé par une panne ne revient jamais de lui-même.", en: "Without -failback, a service moved by a failure never returns on its own." },
    ],
    selfCheck: [
      { question: { fr: "Le service est configuré en Application Continuity mais les transactions ne sont jamais rejouées. Que vérifier ?", en: "The service is configured for Application Continuity but transactions are never replayed. What do you check?" }, answer: { fr: "Le pilote et le pool d'abord : un pool JDBC générique ignore FAN et ne pose pas les frontières de requête. Ensuite la transaction elle-même : un appel UTL_HTTP ou UTL_FILE la rend non rejouable.", en: "The driver and pool first: a generic JDBC pool ignores FAN and sets no request boundaries. Then the transaction itself: a UTL_HTTP or UTL_FILE call makes it non-replayable." } },
      { question: { fr: "À quoi sert l'étiquette de colocalisation ?", en: "What is the colocation tag for?" }, answer: { fr: "À router vers la même instance toutes les sessions qui travaillent sur les mêmes données — celles d'un locataire par exemple. Les blocs restent alors dans un seul buffer cache, ce qui réduit les transferts Cache Fusion.", en: "To route to the same instance every session working on the same data — one tenant's, for instance. Blocks then stay in a single buffer cache, which cuts Cache Fusion transfers." } },
    ],
  },
  "rac-session-10": {
    keyTakeaways: [
      { fr: "RAC One Node : une seule instance active, mais enregistrée sur plusieurs nœuds.", en: "RAC One Node: a single active instance, but registered on several nodes." },
      { fr: "La relocalisation en ligne fait coexister brièvement les deux instances — c'est ce qui la rend transparente.", en: "Online relocation briefly runs both instances — that is what makes it transparent." },
      { fr: "RAC One Node ne monte pas en charge horizontalement : il donne la disponibilité, pas la puissance.", en: "RAC One Node does not scale horizontally: it gives availability, not capacity." },
      { fr: "QoS déclare un objectif de temps de réponse par classe de travail, et ajuste les ressources pour le tenir.", en: "QoS declares a response-time objective per work class, and adjusts resources to meet it." },
      { fr: "QoS exige un cluster géré par politiques, des pools de serveurs et le GIMR actif.", en: "QoS requires a policy-managed cluster, server pools and an active GIMR." },
    ],
    selfCheck: [
      { question: { fr: "Une relocalisation RAC One Node tue des sessions à l'expiration du délai. Comment l'éviter ?", en: "A RAC One Node relocation kills sessions when the timeout expires. How do you avoid that?" }, answer: { fr: "En configurant le service avec FAN et Application Continuity : les sessions migrent alors d'elles-mêmes vers la nouvelle instance pendant la fenêtre de recouvrement, au lieu d'attendre d'être coupées.", en: "By configuring the service with FAN and Application Continuity: sessions then migrate to the new instance during the overlap window instead of waiting to be cut." } },
      { question: { fr: "QoS est installé mais ne déplace jamais rien. Pourquoi ?", en: "QoS is installed but never moves anything. Why?" }, answer: { fr: "Le cluster est probablement géré par administrateur. La plupart des leviers de QoS — déplacement de serveur entre pools notamment — supposent une gestion par politiques avec des pools de serveurs déclarés.", en: "The cluster is probably administrator-managed. Most QoS levers — server moves between pools in particular — assume policy-based management with declared server pools." } },
    ],
  },
  "rac-session-11": {
    keyTakeaways: [
      { fr: "En RAC, une PDB s'ouvre instance par instance : OPEN INSTANCES = ('orcl1','orcl2').", en: "In RAC a PDB opens instance by instance: OPEN INSTANCES = ('orcl1','orcl2')." },
      { fr: "SAVE STATE est indispensable : sans lui, la PDB revient fermée après un redémarrage.", en: "SAVE STATE is essential: without it the PDB comes back closed after a restart." },
      { fr: "L'undo local donne à chaque PDB un tablespace d'annulation par instance.", en: "Local undo gives each PDB one undo tablespace per instance." },
      { fr: "Ne jamais utiliser le service par défaut d'une PDB en production : créer des services explicites.", en: "Never use a PDB's default service in production: create explicit services." },
      { fr: "RELOCATE AVAILABILITY MAX déplace une PDB entre CDB avec une coupure de l'ordre de la seconde.", en: "RELOCATE AVAILABILITY MAX moves a PDB between CDBs with about a second of downtime." },
    ],
    selfCheck: [
      { question: { fr: "Après le redémarrage d'une instance, un service applicatif ne démarre pas. Première piste ?", en: "After an instance restart an application service does not start. First lead?" }, answer: { fr: "La PDB est revenue fermée sur cette instance, faute de SAVE STATE. Le service, rattaché à la PDB, ne peut donc pas démarrer. DBA_PDB_SAVED_STATES montre ce qui a été mémorisé.", en: "The PDB came back closed on that instance, for lack of SAVE STATE. The service, attached to the PDB, therefore cannot start. DBA_PDB_SAVED_STATES shows what was recorded." } },
      { question: { fr: "Comment corriger une CDB sans interrompre les applications de ses PDB ?", en: "How do you patch a CDB without interrupting its PDBs' applications?" }, answer: { fr: "En relocalisant les PDB vers une CDB déjà corrigée par CREATE PLUGGABLE DATABASE … RELOCATE AVAILABILITY MAX, en mettant à niveau la CDB vidée, puis en ramenant les PDB. La coupure se limite à la bascule de chaque PDB.", en: "By relocating the PDBs to an already-patched CDB with CREATE PLUGGABLE DATABASE … RELOCATE AVAILABILITY MAX, upgrading the emptied CDB, then bringing the PDBs back. Downtime is limited to each PDB's switch." } },
    ],
  },
  "rac-session-12": {
    keyTakeaways: [
      { fr: "Nœud concentrateur : accès direct au stockage. Nœud feuille : aucun, et pas d'instance de base.", en: "Hub node: direct storage access. Leaf node: none, and no database instance." },
      { fr: "La perte d'un nœud feuille n'affecte pas le quorum du cluster.", en: "Losing a leaf node does not affect cluster quorum." },
      { fr: "Gestion par administrateur : on nomme les nœuds. Par politiques : on déclare un besoin.", en: "Administrator-managed: you name the nodes. Policy-managed: you declare a need." },
      { fr: "La catégorisation décrit les serveurs par leurs attributs, pas par leurs noms de machine.", en: "Categorisation describes servers by their attributes, not by their host names." },
      { fr: "crsctl eval répond à « que se passerait-il si… » sans rien exécuter.", en: "crsctl eval answers “what would happen if…” without executing anything." },
      { fr: "Un check qui teste seulement la présence du processus produit une haute disponibilité illusoire.", en: "A check that only tests for the process gives illusory high availability." },
    ],
    selfCheck: [
      { question: { fr: "Pourquoi la perte d'un nœud feuille n'entraîne-t-elle pas de reconfiguration du cluster ?", en: "Why does losing a leaf node not trigger a cluster reconfiguration?" }, answer: { fr: "Parce qu'un nœud feuille n'accède ni à l'OCR ni aux voting disks : il ne participe pas au quorum. Il ne peut donc pas provoquer de split-brain, et sa disparition n'oblige à rien renégocier.", en: "Because a leaf node reaches neither the OCR nor the voting disks: it takes no part in quorum. It therefore cannot cause a split brain, and its disappearance forces no renegotiation." } },
      { question: { fr: "Vous devez arrêter un serveur d'un cluster géré par politiques. Que faire avant ?", en: "You must stop a server in a policy-managed cluster. What do you do first?" }, answer: { fr: "Exécuter crsctl eval stop server pour simuler l'opération : la sortie montre quelles ressources se déplaceraient et vers où, ce qui permet de vérifier qu'aucune cascade imprévue ne va se déclencher.", en: "Run crsctl eval stop server to simulate it: the output shows which resources would move and where, letting you verify no unforeseen cascade will fire." } },
    ],
  },
};
