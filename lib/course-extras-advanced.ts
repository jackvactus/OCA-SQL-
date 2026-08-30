import type { SessionExtras } from "./course-extras";

/**
 * Points à retenir et questions de contrôle des trois cursus de
 * spécialisation : 1Z0-084 (Tuning), 1Z0-076 (Data Guard) et 1Z0-078
 * (Clusterware / ASM / RAC).
 *
 * Même principe que `lib/course-extras.ts` : les questions de contrôle sont
 * ouvertes, on y répond de tête avant de dévoiler la réponse, et elles portent
 * sur les points que les fiches d'examen officielles désignent comme les plus
 * discriminants.
 */
export const advancedSessionExtras: Record<string, SessionExtras> = {
  // ═══════════════════ 1Z0-084 — Performance Management and Tuning ═══════════
  "tun-session-1": {
    keyTakeaways: [
      { fr: "Sans objectif chiffré, on ne peut ni prouver un gain ni savoir quand s'arrêter.", en: "Without a quantified goal you can neither prove a gain nor know when to stop." },
      { fr: "DB time = temps CPU + temps d'attente des sessions utilisateur. Optimiser, c'est réduire DB time.", en: "DB time = CPU time + wait time of user sessions. Tuning means reducing DB time." },
      { fr: "Un ratio n'est pas un temps : un hit ratio de 99 % peut accompagner un système à genoux.", en: "A ratio is not a time: a 99 % hit ratio can accompany a system on its knees." },
      { fr: "Plus on optimise tôt dans le cycle de vie, moins cela coûte. La production est la phase la plus contrainte.", en: "The earlier in the lifecycle you tune, the cheaper it is. Production is the most constrained phase." },
      { fr: "Une seule modification à la fois, mesurée avant et après : sinon on ne sait pas ce qui a agi.", en: "One change at a time, measured before and after: otherwise you never know what worked." },
    ],
    selfCheck: [
      { question: { fr: "Pourquoi le buffer cache hit ratio est-il un mauvais indicateur ?", en: "Why is the buffer cache hit ratio a poor indicator?" }, answer: { fr: "Parce qu'il mesure une proportion de lectures logiques satisfaites en mémoire, pas un temps. Une jointure imbriquée qui relit mille fois le même bloc affiche un excellent ratio tout en saturant le CPU.", en: "Because it measures a proportion of logical reads satisfied in memory, not a time. A nested loop re-reading the same block a thousand times shows an excellent ratio while saturating the CPU." } },
      { question: { fr: "Quelle vue donne le modèle de temps au niveau d'une session ?", en: "Which view gives the time model at session level?" }, answer: { fr: "V$SESS_TIME_MODEL. V$SYS_TIME_MODEL donne le même modèle au niveau de l'instance entière.", en: "V$SESS_TIME_MODEL. V$SYS_TIME_MODEL gives the same model at instance level." } },
      { question: { fr: "Que signifie « DB time > temps écoulé » sur un rapport AWR ?", en: "What does “DB time > elapsed time” mean on an AWR report?" }, answer: { fr: "Que plusieurs sessions étaient actives en parallèle. C'est normal ; le rapport DB time / temps écoulé donne le nombre moyen de sessions actives.", en: "That several sessions were active in parallel. That is normal; the DB time to elapsed time ratio gives the average number of active sessions." } },
    ],
  },
  "tun-session-2": {
    keyTakeaways: [
      { fr: "AWR : un instantané par heure, conservé 8 jours par défaut. ASH : un échantillon par seconde.", en: "AWR: one snapshot per hour, kept 8 days by default. ASH: one sample per second." },
      { fr: "Un incident de trois minutes se dilue dans un instantané AWR ; ASH le voit encore.", en: "A three-minute incident dissolves in an AWR snapshot; ASH still sees it." },
      { fr: "ADDM tourne après chaque instantané et classe ses constats par part de DB time.", en: "ADDM runs after every snapshot and ranks findings by share of DB time." },
      { fr: "Une ligne de base AWR fige une période de référence, à l'abri de la purge automatique.", en: "An AWR baseline pins a reference period, exempt from automatic purging." },
      { fr: "AWR, ASH et ADDM relèvent du Diagnostics Pack : ils se facturent.", en: "AWR, ASH and ADDM belong to the Diagnostics Pack: they are licensed." },
    ],
    selfCheck: [
      { question: { fr: "Un pic de deux minutes a eu lieu hier. Quel outil l'analyse ?", en: "A two-minute spike happened yesterday. Which tool analyses it?" }, answer: { fr: "ASH, via DBA_HIST_ACTIVE_SESS_HISTORY. AWR et ADDM raisonnent sur des intervalles horaires où l'incident disparaît.", en: "ASH, through DBA_HIST_ACTIVE_SESS_HISTORY. AWR and ADDM reason on hourly intervals where the incident vanishes." } },
      { question: { fr: "Comment encadrer proprement un test de charge ?", en: "How do you properly bracket a load test?" }, answer: { fr: "Par deux appels à DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT, avant et après, puis un rapport AWR entre les deux identifiants.", en: "With two calls to DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT, before and after, then an AWR report between the two snapshot ids." } },
      { question: { fr: "Quelle proportion des échantillons ASH est conservée sur disque ?", en: "What proportion of ASH samples is persisted to disk?" }, answer: { fr: "Environ un sur dix : le tampon mémoire échantillonne chaque seconde, et un échantillon sur dix rejoint DBA_HIST_ACTIVE_SESS_HISTORY.", en: "About one in ten: the in-memory buffer samples every second, and one sample in ten is written to DBA_HIST_ACTIVE_SESS_HISTORY." } },
    ],
  },
  "tun-session-3": {
    keyTakeaways: [
      { fr: "« db file sequential read » = lecture d'UN bloc (index). « scattered » = lecture multiblocs (balayage).", en: "“db file sequential read” = ONE block (index). “scattered” = multi-block (full scan)." },
      { fr: "« log file sync » : trop de commits, ou stockage lent pour les redo logs.", en: "“log file sync”: too many commits, or slow redo log storage." },
      { fr: "V$SESSION donne l'attente en cours ; V$SESSION_EVENT cumule depuis la connexion.", en: "V$SESSION gives the current wait; V$SESSION_EVENT accumulates since connection." },
      { fr: "Les classes Idle et Network se filtrent en général avant analyse.", en: "The Idle and Network classes are usually filtered out before analysis." },
      { fr: "Une alerte avec état s'efface seule ; une alerte sans état doit être effacée à la main.", en: "A stateful alert clears itself; a stateless alert must be cleared by hand." },
    ],
    selfCheck: [
      { question: { fr: "Pourquoi « sequential read » désigne-t-il une lecture d'un seul bloc ?", en: "Why does “sequential read” refer to a single-block read?" }, answer: { fr: "Le nom décrit le parcours séquentiel de l'index, pas la lecture. Chaque descente lit un bloc à la fois. Le balayage multiblocs, lui, s'appelle « scattered read ».", en: "The name describes the sequential walk of the index, not the read. Each descent reads one block at a time. The multi-block scan is called “scattered read”." } },
      { question: { fr: "Quelle vue nomme directement la session bloquante ?", en: "Which view names the blocking session directly?" }, answer: { fr: "V$SESSION, colonne BLOCKING_SESSION — complétée par BLOCKING_INSTANCE en RAC.", en: "V$SESSION, column BLOCKING_SESSION — with BLOCKING_INSTANCE in RAC." } },
    ],
  },
  "tun-session-4": {
    keyTakeaways: [
      { fr: "Parse → optimisation → génération du plan → exécution → extraction. Un soft parse saute l'optimisation.", en: "Parse → optimization → plan generation → execution → fetch. A soft parse skips optimization." },
      { fr: "EXPLAIN PLAN prédit ; DBMS_XPLAN.DISPLAY_CURSOR constate. En diagnostic, seul le second fait foi.", en: "EXPLAIN PLAN predicts; DBMS_XPLAN.DISPLAY_CURSOR observes. For diagnosis, only the latter is authoritative." },
      { fr: "Un écart E-Rows / A-Rows d'un facteur dix signale une estimation de cardinalité fausse.", en: "An E-Rows / A-Rows gap of a factor of ten signals a wrong cardinality estimate." },
      { fr: "Plan adaptatif : correction PENDANT l'exécution. Réoptimisation : correction aux exécutions SUIVANTES.", en: "Adaptive plan: correction DURING execution. Reoptimization: correction on SUBSEQUENT executions." },
      { fr: "Une directive de plan porte sur des colonnes, pas sur une instruction.", en: "A plan directive applies to columns, not to a statement." },
    ],
    selfCheck: [
      { question: { fr: "Quel hint faut-il pour obtenir A-Rows dans un plan ?", en: "Which hint is needed to obtain A-Rows in a plan?" }, answer: { fr: "/*+ GATHER_PLAN_STATISTICS */, puis DBMS_XPLAN.DISPLAY_CURSOR au format 'ALLSTATS LAST'.", en: "/*+ GATHER_PLAN_STATISTICS */, then DBMS_XPLAN.DISPLAY_CURSOR with the 'ALLSTATS LAST' format." } },
      { question: { fr: "Comment savoir qu'un curseur sera réoptimisé ?", en: "How do you know a cursor will be reoptimized?" }, answer: { fr: "La colonne IS_REOPTIMIZABLE de V$SQL vaut Y : l'optimiseur a enregistré un écart de cardinalité et le corrigera au prochain hard parse.", en: "The IS_REOPTIMIZABLE column of V$SQL is Y: the optimizer recorded a cardinality gap and will correct it at the next hard parse." } },
      { question: { fr: "Pourquoi EXPLAIN PLAN peut-il mentir sur une requête à variables de liaison ?", en: "Why can EXPLAIN PLAN mislead on a query with bind variables?" }, answer: { fr: "Parce qu'il n'examine pas les valeurs des variables (pas de bind peeking) : il suppose une sélectivité moyenne, là où l'exécution réelle peut être très sélective ou pas du tout.", en: "Because it does not peek at the bind values: it assumes an average selectivity, where the real execution may be highly selective or not at all." } },
    ],
  },
  "tun-session-5": {
    keyTakeaways: [
      { fr: "AUTO_SAMPLE_SIZE depuis la 11g : précision d'un échantillon complet, coût d'un échantillon réduit.", en: "AUTO_SAMPLE_SIZE since 11g: the accuracy of a full sample at the cost of a reduced one." },
      { fr: "Sans histogramme, l'optimiseur suppose les valeurs uniformément réparties.", en: "Without a histogram the optimizer assumes values are evenly spread." },
      { fr: "Les statistiques étendues restituent la corrélation entre colonnes, que l'optimiseur ignore par défaut.", en: "Extended statistics restore correlation between columns, which the optimizer ignores by default." },
      { fr: "31 jours d'historique par défaut : RESTORE_TABLE_STATS annule une collecte qui a dégradé un plan.", en: "31 days of history by default: RESTORE_TABLE_STATS undoes a gather that degraded a plan." },
      { fr: "La tâche « auto optimizer stats collection » recollecte au-delà de 10 % de lignes modifiées.", en: "The “auto optimizer stats collection” task re-gathers beyond 10 % of rows changed." },
    ],
    selfCheck: [
      { question: { fr: "Une collecte de statistiques a dégradé un plan cette nuit. Que faire ?", en: "A statistics gather degraded a plan last night. What do you do?" }, answer: { fr: "DBMS_STATS.RESTORE_TABLE_STATS avec un horodatage antérieur à la collecte : l'historique de 31 jours permet de revenir en arrière immédiatement.", en: "DBMS_STATS.RESTORE_TABLE_STATS with a timestamp prior to the gather: the 31-day history lets you roll back immediately." } },
      { question: { fr: "Pourquoi VILLE='Lyon' AND DEPT=69 est-il mal estimé ?", en: "Why is CITY='Lyon' AND DEPT=69 badly estimated?" }, answer: { fr: "L'optimiseur multiplie deux sélectivités en supposant les prédicats indépendants. Ils sont en réalité totalement corrélés : un groupe de colonnes en statistiques étendues corrige l'estimation.", en: "The optimizer multiplies two selectivities assuming the predicates are independent. They are in fact fully correlated: an extended-statistics column group fixes the estimate." } },
    ],
  },
  "tun-session-6": {
    keyTakeaways: [
      { fr: "Le profil SQL corrige les estimations ; la baseline verrouille un ensemble de plans acceptés.", en: "A SQL profile corrects estimates; a baseline locks a set of accepted plans." },
      { fr: "SQL Tuning Advisor travaille sur UNE instruction, SQL Access Advisor sur une charge entière.", en: "SQL Tuning Advisor works on ONE statement, SQL Access Advisor on a whole workload." },
      { fr: "EVOLVE n'accepte un nouveau plan qu'après l'avoir prouvé meilleur.", en: "EVOLVE only accepts a new plan after proving it better." },
      { fr: "SQL Performance Analyzer compare une charge avant et après un changement, sans risque en production.", en: "SQL Performance Analyzer compares a workload before and after a change, with no production risk." },
    ],
    selfCheck: [
      { question: { fr: "Une migration change tous les plans. Comment s'en protéger ?", en: "An upgrade changes every plan. How do you protect against that?" }, answer: { fr: "Capturer les plans actuels en baselines avant la migration : l'optimiseur de la nouvelle version ne pourra utiliser un nouveau plan qu'après l'avoir prouvé meilleur par EVOLVE.", en: "Capture the current plans as baselines before the upgrade: the new version's optimizer can only use a new plan after EVOLVE proves it better." } },
      { question: { fr: "Un profil SQL fige-t-il le plan ?", en: "Does a SQL profile freeze the plan?" }, answer: { fr: "Non. Il fournit des facteurs de correction de cardinalité ; le plan peut encore évoluer si les données changent. Seule la baseline verrouille.", en: "No. It supplies cardinality correction factors; the plan can still evolve if the data changes. Only a baseline locks it." } },
    ],
  },
  "tun-session-7": {
    keyTakeaways: [
      { fr: "MEMORY_TARGET = AMM (SGA + PGA). SGA_TARGET seul = ASMM (SGA uniquement).", en: "MEMORY_TARGET = AMM (SGA + PGA). SGA_TARGET alone = ASMM (SGA only)." },
      { fr: "V$DB_CACHE_ADVICE chiffre le gain d'un cache plus grand : un tableau de décision, pas un ratio.", en: "V$DB_CACHE_ADVICE quantifies the gain of a larger cache: a decision table, not a ratio." },
      { fr: "Tris et hachages consomment la PGA ; leur débordement se voit dans V$SQL_WORKAREA_HISTOGRAM.", en: "Sorts and hashes consume PGA; spilling shows in V$SQL_WORKAREA_HISTOGRAM." },
      { fr: "ORA-04031 : shared pool trop petit, ou absence de variables de liaison.", en: "ORA-04031: shared pool too small, or missing bind variables." },
    ],
    selfCheck: [
      { question: { fr: "Comment distinguer un shared pool trop petit d'un défaut de variables de liaison ?", en: "How do you tell an undersized shared pool from missing bind variables?" }, answer: { fr: "En comparant les instructions de V$SQL : si des milliers de SQL_ID ne diffèrent que par une constante littérale, le problème est applicatif, pas mémoire.", en: "By comparing statements in V$SQL: if thousands of SQL_IDs differ only by a literal constant, the problem is in the application, not in memory." } },
      { question: { fr: "Que signale une exécution multipass dans V$SQL_WORKAREA_HISTOGRAM ?", en: "What does a multipass execution in V$SQL_WORKAREA_HISTOGRAM signal?" }, answer: { fr: "Que la zone de travail est très insuffisante : l'opération de tri ou de hachage passe plusieurs fois par le disque temporaire. C'est le pire cas, à corriger en priorité.", en: "That the work area is far too small: the sort or hash operation goes through temporary disk several times. It is the worst case and should be fixed first." } },
    ],
  },
  "tun-session-8": {
    keyTakeaways: [
      { fr: "CALIBRATE_IO mesure le stockage indépendamment de la charge SQL : une référence objective.", en: "CALIBRATE_IO measures storage independently of the SQL workload: an objective reference." },
      { fr: "« buffer busy waits » = bloc chaud. Le remède est structurel, jamais matériel.", en: "“buffer busy waits” = hot block. The remedy is structural, never hardware." },
      { fr: "« enq: TX » = conflit ligne à ligne ; « enq: TM » = verrou sur la définition de l'objet.", en: "“enq: TX” = row-level contention; “enq: TM” = lock on the object definition." },
      { fr: "V$SESSION.BLOCKING_SESSION désigne le coupable sans avoir à croiser V$LOCK.", en: "V$SESSION.BLOCKING_SESSION names the culprit without joining V$LOCK." },
    ],
    selfCheck: [
      { question: { fr: "Un index sur une clé croissante provoque des buffer busy waits. Pourquoi ?", en: "An ascending-key index causes buffer busy waits. Why?" }, answer: { fr: "Toutes les insertions visent le même bloc terminal de l'index. Un index inversé ou haché répartit les clés et supprime le point chaud.", en: "Every insert targets the same trailing index block. A reverse-key or hash index spreads the keys and removes the hot spot." } },
    ],
  },
  "tun-session-9": {
    keyTakeaways: [
      { fr: "Statspack est gratuit ; AWR exige le Diagnostics Pack. CONTROL_MANAGEMENT_PACK_ACCESS en garde l'usage.", en: "Statspack is free; AWR requires the Diagnostics Pack. CONTROL_MANAGEMENT_PACK_ACCESS guards its use." },
      { fr: "Trace 10046 : niveau 4 = variables de liaison, 8 = attentes, 12 = les deux.", en: "10046 trace: level 4 = bind variables, 8 = waits, 12 = both." },
      { fr: "tkprof met en forme la trace brute ; sans lui, elle est illisible.", en: "tkprof formats the raw trace; without it, the trace is unreadable." },
      { fr: "SQL Monitoring démarre seul au-delà de 5 s de CPU ou d'E/S, ou en exécution parallèle.", en: "SQL Monitoring starts by itself beyond 5 s of CPU or I/O, or on parallel execution." },
      { fr: "BEGIN_OPERATION / END_OPERATION suivent un batch entier comme une seule opération.", en: "BEGIN_OPERATION / END_OPERATION track a whole batch as a single operation." },
    ],
    selfCheck: [
      { question: { fr: "Une requête de 2 secondes doit être suivie par SQL Monitoring. Comment faire ?", en: "A 2-second query must be tracked by SQL Monitoring. How?" }, answer: { fr: "Ajouter le hint /*+ MONITOR */ : il force le suivi sous le seuil automatique de 5 secondes.", en: "Add the /*+ MONITOR */ hint: it forces tracking below the automatic 5-second threshold." } },
      { question: { fr: "Le Diagnostics Pack n'est pas acquis. Quelle instrumentation historique reste légale ?", en: "The Diagnostics Pack is not licensed. Which historical instrumentation remains legal?" }, answer: { fr: "Statspack, installé par spcreate.sql sous l'utilisateur PERFSTAT, avec des instantanés planifiés. Il faut aussi fixer CONTROL_MANAGEMENT_PACK_ACCESS à NONE pour éviter tout usage involontaire d'AWR.", en: "Statspack, installed through spcreate.sql under the PERFSTAT user, with scheduled snapshots. CONTROL_MANAGEMENT_PACK_ACCESS should also be set to NONE to avoid any inadvertent AWR use." } },
    ],
  },
  "tun-session-10": {
    keyTakeaways: [
      { fr: "In-Memory duplique les données au format colonne en mémoire ; le format ligne persiste sur disque.", en: "In-Memory duplicates data in column format in memory; the row format persists on disk." },
      { fr: "In-Memory excelle sur les balayages analytiques, reste inutile pour un accès par clé primaire.", en: "In-Memory excels at analytic scans, remains useless for a primary-key lookup." },
      { fr: "RESULT_CACHE_MODE = MANUAL par défaut : seul le hint met en cache.", en: "RESULT_CACHE_MODE = MANUAL by default: only the hint caches." },
      { fr: "Le result cache s'invalide au premier DML validé sur une table source.", en: "The result cache invalidates on the first committed DML against a source table." },
    ],
    selfCheck: [
      { question: { fr: "Pourquoi RESULT_CACHE_MODE = FORCE est-il déconseillé ?", en: "Why is RESULT_CACHE_MODE = FORCE discouraged?" }, answer: { fr: "Parce qu'il tente de mettre en cache toutes les requêtes, y compris celles dont le résultat change constamment. La contention sur le latch « Result Cache: RC Latch » dégrade alors l'ensemble de l'instance.", en: "Because it tries to cache every query, including those whose result changes constantly. Contention on the “Result Cache: RC Latch” latch then degrades the whole instance." } },
      { question: { fr: "In-Memory dispense-t-il de créer des index ?", en: "Does In-Memory remove the need for indexes?" }, answer: { fr: "Non. Il remplace avantageusement les index d'analyse, mais un accès à une ligne unique par clé primaire reste bien plus rapide par index B-tree.", en: "No. It advantageously replaces analytic indexes, but a single-row access by primary key remains far faster through a B-tree index." } },
    ],
  },

  // ═══════════════════ 1Z0-076 — Data Guard Administration ═══════════════════
  "dg-session-1": {
    keyTakeaways: [
      { fr: "Data Guard protège le SERVICE ; les sauvegardes protègent les DONNÉES. Les deux sont nécessaires.", en: "Data Guard protects the SERVICE; backups protect the DATA. Both are necessary." },
      { fr: "Physique = Redo Apply (MRP0). Logique = SQL Apply (LSP0). Instantanée = physique ouverte en écriture.", en: "Physical = Redo Apply (MRP0). Logical = SQL Apply (LSP0). Snapshot = physical opened read-write." },
      { fr: "Data Guard réplique aussi les erreurs logiques : un DROP TABLE arrive en quelques secondes.", en: "Data Guard also replicates logical errors: a DROP TABLE arrives within seconds." },
      { fr: "En multitenant, la configuration porte sur la CDB entière, jamais sur une PDB isolée.", en: "In multitenant, the configuration covers the whole CDB, never a single PDB." },
    ],
    selfCheck: [
      { question: { fr: "Un DROP TABLE accidentel vient d'être validé. Data Guard vous sauve-t-il ?", en: "An accidental DROP TABLE has just committed. Does Data Guard save you?" }, answer: { fr: "Non : la base de secours l'applique en quelques secondes. Seuls Flashback Table, Flashback Database, un point de restauration ou une sauvegarde permettent de revenir en arrière.", en: "No: the standby applies it within seconds. Only Flashback Table, Flashback Database, a restore point or a backup can rewind it." } },
      { question: { fr: "Comment tester une migration applicative sur des données réelles sans perdre la protection ?", en: "How do you test an application upgrade on real data without losing protection?" }, answer: { fr: "Convertir la base de secours en snapshot standby : elle s'ouvre en écriture, un point de restauration garanti est posé automatiquement, et elle continue de recevoir le redo. La reconversion rattrape tout.", en: "Convert the standby to a snapshot standby: it opens read-write, a guaranteed restore point is created automatically, and it keeps receiving redo. Converting back catches up on everything." } },
    ],
  },
  "dg-session-2": {
    keyTakeaways: [
      { fr: "Entrée statique dans listener.ora des deux côtés : PMON ne peut pas annoncer une instance arrêtée.", en: "A static listener.ora entry on both sides: PMON cannot advertise a stopped instance." },
      { fr: "Standby redo logs : n+1 groupes, de taille EXACTEMENT identique aux redo en ligne.", en: "Standby redo logs: n+1 groups, at EXACTLY the same size as the online redo logs." },
      { fr: "FORCE LOGGING, ARCHIVELOG et Flashback : trois prérequis non négociables.", en: "FORCE LOGGING, ARCHIVELOG and Flashback: three non-negotiable prerequisites." },
      { fr: "DUPLICATE … FOR STANDBY FROM ACTIVE DATABASE crée la base de secours sans sauvegarde préalable.", en: "DUPLICATE … FOR STANDBY FROM ACTIVE DATABASE creates the standby with no prior backup." },
      { fr: "DBMS_DBCOMP.DBCOMP prouve la fidélité de la réplique, bloc à bloc.", en: "DBMS_DBCOMP.DBCOMP proves the replica is faithful, block by block." },
    ],
    selfCheck: [
      { question: { fr: "Les standby redo logs font 100 Mo, les redo en ligne 200 Mo. Que se passe-t-il ?", en: "The standby redo logs are 100 MB, the online redo logs 200 MB. What happens?" }, answer: { fr: "RFS ne peut pas les utiliser : le transport bascule silencieusement en mode archive, et le mode temps réel — donc le zéro perte — est perdu sans message d'erreur explicite.", en: "RFS cannot use them: transport silently falls back to archive mode, and real-time apply — hence zero data loss — is lost with no explicit error." } },
      { question: { fr: "Comment vérifier qu'aucune archive ne manque côté secours ?", en: "How do you check that no archive is missing on the standby?" }, answer: { fr: "SELECT * FROM v$archive_gap : la vue doit être vide. Sinon FAL_SERVER n'a pas comblé l'écart et il faut transférer les fichiers manuellement.", en: "SELECT * FROM v$archive_gap: the view must be empty. Otherwise FAL_SERVER failed to close the gap and files must be shipped manually." } },
    ],
  },
  "dg-session-3": {
    keyTakeaways: [
      { fr: "DBA_LOGSTDBY_UNSUPPORTED se consulte AVANT de créer une base logique, jamais après.", en: "Check DBA_LOGSTDBY_UNSUPPORTED BEFORE creating a logical standby, never after." },
      { fr: "SQL Apply exige la journalisation supplémentaire des clés primaires et index uniques.", en: "SQL Apply requires supplemental logging of primary keys and unique indexes." },
      { fr: "INSTANTIATE_TABLE resynchronise une table divergente sans recréer la base.", en: "INSTANTIATE_TABLE resynchronises a diverged table without rebuilding the database." },
      { fr: "L'usage le plus solide d'une base logique reste la mise à niveau progressive.", en: "The most solid use of a logical standby remains the rolling upgrade." },
    ],
    selfCheck: [
      { question: { fr: "Pourquoi une base de secours logique peut-elle porter ses propres index ?", en: "Why can a logical standby carry its own indexes?" }, answer: { fr: "Parce qu'elle est ouverte en lecture-écriture et rejoue des instructions SQL, non des blocs. Sa structure physique peut donc diverger de celle de la principale.", en: "Because it is open read-write and replays SQL statements, not blocks. Its physical structure can therefore diverge from the primary's." } },
    ],
  },
  "dg-session-4": {
    keyTakeaways: [
      { fr: "Maximum Protection : zéro perte garantie, quitte à ARRÊTER la production. Deux bases de secours en pratique.", en: "Maximum Protection: guaranteed zero loss, even if it means STOPPING production. Two standbys in practice." },
      { fr: "FASTSYNC = SYNC NOAFFIRM : accusé de réception en mémoire, sans attendre le disque.", en: "FASTSYNC = SYNC NOAFFIRM: acknowledgement in memory, without waiting for disk." },
      { fr: "Active Data Guard : lire ET appliquer en même temps. C'est une option payante.", en: "Active Data Guard: read AND apply at the same time. It is a paid option." },
      { fr: "Far Sync : zéro perte à distance sans imposer la latence à chaque COMMIT.", en: "Far Sync: zero loss at distance without imposing latency on every COMMIT." },
      { fr: "PROTECTION_MODE = configuré ; PROTECTION_LEVEL = réellement assuré. Comparer les deux.", en: "PROTECTION_MODE = configured; PROTECTION_LEVEL = actually delivered. Compare the two." },
    ],
    selfCheck: [
      { question: { fr: "Site de secours à 6 000 km, exigence de zéro perte, COMMIT sous 5 ms. Quelle architecture ?", en: "Standby site 6,000 km away, zero-loss requirement, COMMIT under 5 ms. Which architecture?" }, answer: { fr: "Une instance Far Sync proche de la production, recevant le redo en SYNC, puis retransmettant en ASYNC vers la base de secours distante. Le COMMIT n'attend que le réseau local.", en: "A Far Sync instance close to production, receiving redo in SYNC, then forwarding in ASYNC to the remote standby. The COMMIT only waits for the local network." } },
      { question: { fr: "PROTECTION_MODE vaut MAXIMUM AVAILABILITY mais PROTECTION_LEVEL vaut RESYNCHRONIZATION. Que conclure ?", en: "PROTECTION_MODE reads MAXIMUM AVAILABILITY but PROTECTION_LEVEL reads RESYNCHRONIZATION. What do you conclude?" }, answer: { fr: "La configuration est dégradée : la liaison synchrone a été rompue et la base de secours rattrape son retard. Tant que les deux valeurs diffèrent, la garantie de zéro perte n'est pas assurée.", en: "The configuration is degraded: the synchronous link was broken and the standby is catching up. While the two values differ, the zero-loss guarantee does not hold." } },
    ],
  },
  "dg-session-5": {
    keyTakeaways: [
      { fr: "DG_BROKER_START = TRUE sur chaque base démarre le processus DMON.", en: "DG_BROKER_START = TRUE on each database starts the DMON process." },
      { fr: "Une fois le Broker actif, ne plus toucher LOG_ARCHIVE_DEST_n en SQL : il les réécrit.", en: "Once the Broker is active, stop touching LOG_ARCHIVE_DEST_n in SQL: it rewrites them." },
      { fr: "GLOBAL_DBNAME doit porter le suffixe _DGMGRL dans listener.ora.", en: "GLOBAL_DBNAME must carry the _DGMGRL suffix in listener.ora." },
      { fr: "VALIDATE DATABASE répond avant l'incident : « puis-je basculer, et que perdrais-je ? »", en: "VALIDATE DATABASE answers before the incident: “can I switch over, and what would I lose?”" },
    ],
    selfCheck: [
      { question: { fr: "Vous modifiez LOG_ARCHIVE_DEST_2 en SQL et le changement disparaît. Pourquoi ?", en: "You change LOG_ARCHIVE_DEST_2 in SQL and the change vanishes. Why?" }, answer: { fr: "Le Broker réécrit ces paramètres depuis sa propre configuration. Il faut passer par EDIT DATABASE … SET PROPERTY dans DGMGRL.", en: "The Broker rewrites those parameters from its own configuration. Use EDIT DATABASE … SET PROPERTY in DGMGRL instead." } },
      { question: { fr: "Quelle commande vérifier chaque mois pour prouver que la reprise fonctionne ?", en: "Which command should you run monthly to prove recovery works?" }, answer: { fr: "VALIDATE DATABASE dans DGMGRL, complétée idéalement par un switchover réel : c'est ce qui transforme un plan de reprise théorique en capacité vérifiée.", en: "VALIDATE DATABASE in DGMGRL, ideally completed by a real switchover: that is what turns a theoretical recovery plan into a verified capability." } },
    ],
  },
  "dg-session-6": {
    keyTakeaways: [
      { fr: "Switchover : planifié, sans perte, réversible. Failover : subi, perte possible, réinstanciation nécessaire.", en: "Switchover: planned, lossless, reversible. Failover: forced, possible loss, reinstatement needed." },
      { fr: "Sans Flashback, réinstancier l'ancienne principale signifie la recréer entièrement.", en: "Without Flashback, reinstating the former primary means rebuilding it entirely." },
      { fr: "L'observateur doit être sur un TROISIÈME site, sinon il ne peut rien arbitrer.", en: "The observer must sit on a THIRD site, otherwise it can arbitrate nothing." },
      { fr: "Depuis la 12.2, un point de restauration créé sur la principale est répliqué automatiquement.", en: "Since 12.2, a restore point created on the primary is replicated automatically." },
    ],
    selfCheck: [
      { question: { fr: "Après un failover, l'ancienne principale redémarre. Que faut-il faire ?", en: "After a failover, the former primary comes back up. What must you do?" }, answer: { fr: "REINSTATE DATABASE dans DGMGRL : avec Flashback activé, elle revient au SCN de divergence puis se resynchronise en quelques minutes comme nouvelle base de secours.", en: "REINSTATE DATABASE in DGMGRL: with Flashback enabled it rewinds to the divergence SCN then resynchronises in minutes as the new standby." } },
      { question: { fr: "L'observateur est seul survivant après une coupure réseau. Bascule-t-il ?", en: "The observer is the sole survivor after a network cut. Does it fail over?" }, answer: { fr: "Non : sans la base de secours, il n'y a pas de quorum. Une bascule dans ces conditions risquerait de créer deux bases principales simultanées.", en: "No: without the standby there is no quorum. Failing over in those conditions would risk creating two simultaneous primaries." } },
    ],
  },
  "dg-session-7": {
    keyTakeaways: [
      { fr: "Sauvegarder depuis la base de secours physique : la copie est bloc à bloc, donc restaurable sur la principale.", en: "Back up from the physical standby: the copy is block-for-block, so it restores the primary." },
      { fr: "Active Data Guard répare automatiquement un bloc corrompu depuis l'autre base.", en: "Active Data Guard automatically repairs a corrupt block from the other database." },
      { fr: "RECOVER … FROM SERVICE récupère par le réseau, sans passer par une sauvegarde.", en: "RECOVER … FROM SERVICE recovers over the network, without going through a backup." },
      { fr: "DBMS_ROLLING automatise la mise à niveau progressive : l'indisponibilité se réduit à un switchover.", en: "DBMS_ROLLING automates the rolling upgrade: downtime shrinks to a switchover." },
    ],
    selfCheck: [
      { question: { fr: "La base de secours a 4 jours de retard, les archives ont été purgées. Que faire ?", en: "The standby is 4 days behind and the archives have been purged. What do you do?" }, answer: { fr: "RECOVER STANDBY DATABASE FROM SERVICE <principale> : RMAN récupère les blocs manquants directement par le réseau, sans recréer la base de secours.", en: "RECOVER STANDBY DATABASE FROM SERVICE <primary>: RMAN fetches the missing blocks directly over the network, without rebuilding the standby." } },
    ],
  },
  "dg-session-8": {
    keyTakeaways: [
      { fr: "Transport lag élevé = réseau. Apply lag élevé = entrées-sorties du secours.", en: "High transport lag = network. High apply lag = standby I/O." },
      { fr: "Ajout d'un redo log et changement de mot de passe SYS : les deux exigent une action manuelle côté secours.", en: "Adding a redo log and changing the SYS password: both require manual action on the standby." },
      { fr: "ORA-16191 dans l'alert log = fichier de mots de passe désynchronisé.", en: "ORA-16191 in the alert log = out-of-step password file." },
      { fr: "Un service lié au rôle démarre du bon côté après une bascule, sans reconfigurer les clients.", en: "A role-bound service starts on the right side after a transition, with no client reconfiguration." },
      { fr: "TAF reconnecte ; Application Continuity rejoue la transaction interrompue.", en: "TAF reconnects; Application Continuity replays the interrupted transaction." },
    ],
    selfCheck: [
      { question: { fr: "Le transport s'est arrêté hier soir, juste après la rotation des mots de passe. Que vérifier ?", en: "Transport stopped last night, right after the password rotation. What do you check?" }, answer: { fr: "Le fichier de mots de passe côté secours : il doit être recopié depuis la principale. L'alert log de la principale porte ORA-16191.", en: "The standby's password file: it must be copied from the primary. The primary's alert log carries ORA-16191." } },
      { question: { fr: "Transport lag 0 s, apply lag 40 min. Où chercher ?", en: "Transport lag 0 s, apply lag 40 min. Where do you look?" }, answer: { fr: "Du côté de la base de secours : entrées-sorties du stockage, parallélisme du Redo Apply, ou charge de lecture concurrente si Active Data Guard est actif.", en: "On the standby side: storage I/O, Redo Apply parallelism, or competing read load if Active Data Guard is enabled." } },
    ],
  },

  // ═══════════════════ 1Z0-078 — Clusterware, ASM et RAC ═══════════════════
  "rac-session-1": {
    keyTakeaways: [
      { fr: "RAC protège du nœud, Data Guard du site, les sauvegardes de l'erreur logique. Trois risques, trois réponses.", en: "RAC protects against node failure, Data Guard against site loss, backups against logical error. Three risks, three answers." },
      { fr: "CSSD décide des évictions, CRSD gère les ressources, OHASD démarre la pile au boot.", en: "CSSD decides evictions, CRSD manages resources, OHASD starts the stack at boot." },
      { fr: "Le SCAN doit résoudre vers TROIS adresses par tourniquet DNS. /etc/hosts ne suffit pas.", en: "The SCAN must resolve to THREE addresses via round-robin DNS. /etc/hosts is not enough." },
      { fr: "cluvfy avant l'installation évite l'essentiel des échecs ; root.sh s'exécute nœud par nœud.", en: "cluvfy before installation prevents most failures; root.sh runs node by node." },
    ],
    selfCheck: [
      { question: { fr: "Pourquoi la VIP ne doit-elle pas être affectée avant l'installation ?", en: "Why must the VIP not be assigned before installation?" }, answer: { fr: "Parce que Clusterware doit pouvoir la prendre en charge lui-même et la déplacer sur un autre nœud en cas de panne. Une adresse déjà active côté système empêche cette prise en charge.", en: "Because Clusterware must be able to take it over itself and move it to another node on failure. An address already active at OS level prevents that takeover." } },
      { question: { fr: "Que se passe-t-il si root.sh est lancé en parallèle sur tous les nœuds ?", en: "What happens if root.sh is launched in parallel on every node?" }, answer: { fr: "La configuration est corrompue : le premier nœud initialise l'OCR et les voting disks, les suivants doivent s'y rattacher. En parallèle, plusieurs initialisations se télescopent.", en: "The configuration is corrupted: the first node initialises the OCR and voting disks, the others must join. In parallel, several initialisations collide." } },
    ],
  },
  "rac-session-2": {
    keyTakeaways: [
      { fr: "crsctl = la pile cluster. srvctl = les ressources Oracle. Si l'objet existerait sans Oracle, c'est crsctl.", en: "crsctl = the cluster stack. srvctl = Oracle resources. If the object would exist without Oracle, it is crsctl." },
      { fr: "Voting disks en nombre IMPAIR : il faut voir plus de la moitié pour rester dans le cluster.", en: "An ODD number of voting disks: you must see more than half to stay in the cluster." },
      { fr: "OCR sauvegardé toutes les 4 h ; OLR sauvegardé manuellement ; voting disks non sauvegardés.", en: "OCR backed up every 4 h; OLR backed up manually; voting disks not backed up." },
      { fr: "OHASD → CSSD → ASM → CRSD → VIP, listeners, instances, services : l'ordre explique les démarrages partiels.", en: "OHASD → CSSD → ASM → CRSD → VIPs, listeners, instances, services: the order explains partial startups." },
    ],
    selfCheck: [
      { question: { fr: "Une ressource reste OFFLINE après un démarrage. Par où commencer ?", en: "A resource stays OFFLINE after startup. Where do you start?" }, answer: { fr: "Par ses dépendances : crsctl stat res -t montre l'état de toute la chaîne. Une base ne démarre pas si son groupe de disques ASM n'est pas monté.", en: "With its dependencies: crsctl stat res -t shows the state of the whole chain. A database will not start if its ASM disk group is not mounted." } },
      { question: { fr: "Pourquoi l'OLR existe-t-il en plus de l'OCR ?", en: "Why does the OLR exist in addition to the OCR?" }, answer: { fr: "Parce qu'OHASD doit démarrer la pile locale avant que le stockage partagé — donc l'OCR — ne soit accessible. L'OLR fournit la configuration minimale nécessaire à cet amorçage.", en: "Because OHASD must start the local stack before shared storage — hence the OCR — is reachable. The OLR provides the minimal configuration needed for that bootstrap." } },
    ],
  },
  "rac-session-3": {
    keyTakeaways: [
      { fr: "ASM n'intercepte pas les E/S : il dit où sont les extents, puis s'efface.", en: "ASM does not intercept I/O: it says where the extents are, then steps aside." },
      { fr: "SYSASM administre, SYSDBA accède aux fichiers, SYSOPER démarre et arrête.", en: "SYSASM administers, SYSDBA accesses files, SYSOPER starts and stops." },
      { fr: "NORMAL = 2 copies, 2 groupes de pannes. HIGH = 3 copies, 3 groupes de pannes.", en: "NORMAL = 2 copies, 2 failure groups. HIGH = 3 copies, 3 failure groups." },
      { fr: "Un groupe de pannes doit correspondre à un vrai domaine de défaillance, pas à un découpage arbitraire.", en: "A failure group must map to a real failure domain, not an arbitrary split." },
      { fr: "Retrait et ajout de disque dans UNE instruction : un seul rééquilibrage au lieu de deux.", en: "Drop and add a disk in ONE statement: a single rebalance instead of two." },
    ],
    selfCheck: [
      { question: { fr: "Deux groupes de pannes sur la même baie physique : quel est le problème ?", en: "Two failure groups on the same physical array: what is the problem?" }, answer: { fr: "ASM croit répartir les copies sur deux domaines indépendants alors qu'ils tombent ensemble. La redondance est une illusion : la panne de la baie détruit les deux copies.", en: "ASM believes it is spreading copies across two independent domains when they fail together. Redundancy is an illusion: an array failure destroys both copies." } },
      { question: { fr: "Comment suivre l'avancement d'un rééquilibrage ?", en: "How do you follow a rebalance's progress?" }, answer: { fr: "V$ASM_OPERATION : colonnes SOFAR, EST_WORK et EST_MINUTES donnent l'avancement et une estimation du temps restant.", en: "V$ASM_OPERATION: the SOFAR, EST_WORK and EST_MINUTES columns give progress and an estimate of the remaining time." } },
    ],
  },
  "rac-session-4": {
    keyTakeaways: [
      { fr: "USABLE_FILE_MB, pas FREE_MB : c'est l'espace laissant encore la capacité de se reconstruire.", en: "USABLE_FILE_MB, not FREE_MB: that is the space that still leaves the ability to rebuild." },
      { fr: "ACFS étend ASM aux fichiers hors base, monté simultanément sur tous les nœuds.", en: "ACFS extends ASM to non-database files, mounted simultaneously on every node." },
      { fr: "Les alias donnent un nom lisible ; les modèles fixent la redondance par type de fichier.", en: "Aliases give a readable name; templates set redundancy per file type." },
      { fr: "asmcmd explore un groupe de disques comme un système de fichiers : lsdg, ls, du, cp.", en: "asmcmd browses a disk group like a file system: lsdg, ls, du, cp." },
    ],
    selfCheck: [
      { question: { fr: "USABLE_FILE_MB est négatif mais FREE_MB reste positif. Faut-il agir ?", en: "USABLE_FILE_MB is negative but FREE_MB is still positive. Should you act?" }, answer: { fr: "Oui, immédiatement. La redondance existe encore, mais le groupe n'a plus assez d'espace pour reconstruire après la perte d'un groupe de pannes : la prochaine panne de disque sera définitive.", en: "Yes, immediately. Redundancy still exists, but the group no longer has enough space to rebuild after losing a failure group: the next disk failure will be permanent." } },
    ],
  },
  "rac-session-5": {
    keyTakeaways: [
      { fr: "Cache Fusion transfère les blocs par l'INTERCONNEXION, pas par le disque. LMS en est le cœur.", en: "Cache Fusion ships blocks over the INTERCONNECT, not via disk. LMS is its heart." },
      { fr: "En RAC, toujours GV$ : V$ ne montre que l'instance locale.", en: "In RAC, always GV$: V$ shows only the local instance." },
      { fr: "UNDO_TABLESPACE et INSTANCE_NUMBER diffèrent par instance ; DB_NAME et CONTROL_FILES non.", en: "UNDO_TABLESPACE and INSTANCE_NUMBER differ per instance; DB_NAME and CONTROL_FILES do not." },
      { fr: "Un service définit les instances préférées et de repli : sans services, rien n'est isolable.", en: "A service defines preferred and available instances: without services, nothing can be isolated." },
      { fr: "SCAN : un seul nom côté client, quel que soit le nombre de nœuds, aujourd'hui et demain.", en: "SCAN: a single client-side name, whatever the number of nodes, today and tomorrow." },
    ],
    selfCheck: [
      { question: { fr: "Une requête de diagnostic sur V$SESSION ne montre rien d'anormal, pourtant l'application est bloquée. Pourquoi ?", en: "A diagnostic query on V$SESSION shows nothing wrong, yet the application is stuck. Why?" }, answer: { fr: "V$SESSION ne montre que le nœud local. La session bloquante est probablement sur une autre instance : il faut interroger GV$SESSION et regarder BLOCKING_INSTANCE.", en: "V$SESSION shows only the local node. The blocking session is probably on another instance: query GV$SESSION and look at BLOCKING_INSTANCE." } },
      { question: { fr: "Pourquoi ajouter un nœud ne demande-t-il aucune reconfiguration des clients ?", en: "Why does adding a node require no client reconfiguration?" }, answer: { fr: "Parce que les clients visent le nom SCAN, pas les nœuds. Le listener SCAN découvre le nouveau nœud et l'intègre à l'équilibrage automatiquement.", en: "Because clients target the SCAN name, not the nodes. The SCAN listener discovers the new node and includes it in balancing automatically." } },
    ],
  },
  "rac-session-6": {
    keyTakeaways: [
      { fr: "« gc cr block lost » = problème réseau matériel. À traiter avant toute analyse SQL.", en: "“gc cr block lost” = hardware network problem. Address it before any SQL analysis." },
      { fr: "Séquences en RAC : CACHE élevé et NOORDER. ORDER sérialise tout le cluster.", en: "Sequences in RAC: large CACHE and NOORDER. ORDER serialises the whole cluster." },
      { fr: "Une base RAC, une seule sauvegarde — mais les archives de TOUS les threads doivent être partagées.", en: "One RAC database, one backup — but the archives of ALL threads must be shared." },
      { fr: "opatchauto applique un correctif nœud par nœud, pendant que les autres servent.", en: "opatchauto patches node by node, while the others keep serving." },
      { fr: "Éviction = heartbeat réseau perdu (misscount 30 s) ou voting disks inaccessibles (disktimeout 200 s).", en: "Eviction = lost network heartbeat (misscount 30 s) or unreachable voting disks (disktimeout 200 s)." },
    ],
    selfCheck: [
      { question: { fr: "Un nœud est évincé toutes les nuits à 2 h. Où chercher en premier ?", en: "A node is evicted every night at 2 a.m. Where do you look first?" }, answer: { fr: "Dans ocssd.trc, pour savoir si c'est le heartbeat réseau ou le heartbeat disque. Puis dans le journal système : une sauvegarde nocturne saturant le réseau ou le stockage est la cause la plus fréquente.", en: "In ocssd.trc, to find out whether it is the network or the disk heartbeat. Then in the system log: a nightly backup saturating the network or storage is the most frequent cause." } },
      { question: { fr: "Pourquoi une éviction n'est-elle pas un défaut ?", en: "Why is an eviction not a defect?" }, answer: { fr: "Parce que le cluster préfère perdre un nœud plutôt que de risquer un split-brain, où deux nœuds écriraient simultanément sur les mêmes données. L'éviction est la protection qui fonctionne.", en: "Because the cluster would rather lose a node than risk a split brain, where two nodes would write to the same data simultaneously. Eviction is the protection working." } },
    ],
  },
};
