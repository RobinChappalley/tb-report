= Preuve de concept


== Cadre initial

preuve ? succès ? but ? état avant de commencer? 

un seul composant next-> monstre simple, projet idéal (coût en images, bcp d'image, idée de base du tb)
== Déploiement d'imgproxy
=== Choix d'une instance mutualisée

Une instance unique traite les images de l'ensemble des projets, plutôt qu'une instance par client. Ce choix, arrêté avec le CTO d'Antistatique, réduit la charge de maintenance : une seule VM à mettre à jour, un seul certificat à renouveler, une seule configuration de cache. Il a pour contrepartie un point de défaillance unique et une absence d'isolation entre projets.

=== Infrastructure

Le service est déployé sur une VM Infomaniak Public Cloud, 4 vCPU et 8 Go de RAM.
Ce dimensionnement n'a pas été établi par un test de charge, faute de temps. Il repose sur l'hypothèse que le cache Nginx placé devant imgproxy absorbe l'essentiel du trafic : seules les requêtes en cache miss atteignent imgproxy, les suivantes étant servies comme des fichiers statiques. Le facteur limitant attendu est donc le nombre de transformations simultanées lors de la montée en cache d'un nouveau projet, et non le trafic en régime établi. Cette hypothèse reste à valider (voir [4-6]).

=== Architecture conteneurisée

Le déploiement s'appuie sur quatre conteneurs Docker orchestrés par Docker Compose (@roles-conteneurs) :

#figure(
  table(
  columns: (auto, 1fr),
  inset: 6pt,
  stroke: 0.5pt + black,
  align: left + horizon,
  
  [*Conteneur*], [*Rôle*],
  [*nginx-proxy*], [Reverse proxy frontal (ports 80/443), terminaison TLS, routage vers nginx-cache],
  [*acme-companion*], [Demande et renouvellement automatique des certificats Let's Encrypt auprès de la CA],
  [*nginx-cache*], [Cache HTTP des réponses imgproxy, routage interne vers imgproxy],
  [*imgproxy*], [Traitement des images (redimensionnement, optimisation, conversion de formats)],
),
caption:[Conteneurs et rôles dans le PoC imgproxy],
  kind:table
)<roles-conteneurs>

_nginxproxy/nginx-proxy_ est une image Docker spécialisée qui génère et recharge automatiquement la configuration Nginx en fonction des conteneurs actifs. Contrairement à l'image nginx:latest standard, elle n'expose pas un nginx.conf modifiable : sa configuration est entièrement dérivée des variables d'environnement (VIRTUAL_HOST, LETSENCRYPT_HOST, etc.) que déclarent les autres conteneurs. Cette approche élimine la maintenance manuelle de la configuration lors de l'ajout de nouveaux services.

*SCHEMA A METTRE*

Le passage en HTTPS est une contrainte de la signature des URL : le secret HMAC ne doit pas circuler en clair.


=== Renouvellement automatique des certificats

Let's Encrypt émet des certificats valides 90 jours. Le renouvellement est géré par acme-companion, qui reçoit les notifications de nginx-proxy et réeffectue la demande avant expiration. Le comportement n'a pas pu être vérifié en conditions réelles : la durée du PoC est inférieure au cycle de renouvellement. 
La documentation de l'image Docker indique que nginx-proxy recharge automatiquement sa configuration après un renouvellement. Cette affirmation reste à confirmer avant une mise en production (voir [4-6]).


=== Secrets et variables d'environnement
Les clés IMGPROXY_KEY et IMGPROXY_SALT sont injectées en variables d'environnement au démarrage du conteneur. Dans ce PoC, elles sont définies dans le docker-compose.yml à titre de démonstration. Une mise en production exige :

- stockage des secrets dans un gestionnaire dédié (HashiCorp Vault, Docker Secrets, ou équivalent chez l'hébergeur) ;
- injection au démarrage sans exposition dans le fichier de composition ;
- rotation périodique (impact sur les URL signées existantes, voir [4-6]).


== Implémentation sur un projet existant

La pré-étude prévoyait deux connecteurs (Drupal, Next.js). Le projet Eldora (WordPress, PHP) a été retenu pour le PoC, car il permet une validation complète en un seul écosystème et s'aligne avec le stack de test du benchmark (également en PHP). Ce recentrage réduit la démonstration empirique de l'agnosticité, mais approfondit l'implémentation réelle.

L'intégration repose sur la fonction imgproxy_url() exposée dans StarterSite.php (classe Timber/Bedrock) et accessible en Twig sous le nom imgproxy(). Les développeurs l'appellent manuellement dans les templates pour les images critiques (hero, featured images) en passant l'URL source et les opérations imgproxy souhaités (ex. rt:fit/q:75). 
En parallèle, un filtre WordPress sur le hook #raw("the_content") traite automatiquement tout HTML rendu contenant des balises #raw("<img src>") ou #raw("<source src>") — notamment les blocs Gutenberg éditoriaux — et remplace les URLs d'images par leurs équivalents proxifiés, sans modifier le contenu stocké en base. La signature HMAC est générée au rendu, pas à l'upload, ce qui permet la flexibilité : si la clé imgproxy change, seules les URLs générées après ce changement utiliseront la nouvelle signature — aucune migration de données n'est nécessaire.

== Choix d'implémentation

*Sécurisation via signature HMAC*

La signature HMAC a été retenue pour sécuriser l'accès à imgproxy. Contrairement à une restriction réseau (allowlist d'IP), elle protège la ressource indépendamment de la topologie — chaque requête porte sa preuve d'autorisation. Cela s'aligne avec l'objectif d'agnosticité : un changement d'hébergeur ou d'environnement n'impose pas de réviser les règles de filtrage. 
La documentation d'imgproxy recommande cette approche, ce qui justifie son adoption plutôt que de la contourner avec des contrôles réseau ad hoc.
Le coût : la rotation de la clé secrète impose de la mettre à jour dans chaque projet client. Le PoC n'automatise pas ce processus, ce qui est acceptable pour une première version mais mériterait une amélioration (service centralisé de versionning).

== Validation

== Limites et pistes

regarder avec YG pour avoir les réponses à pk 
ça marche pas avec next


