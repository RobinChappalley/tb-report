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
Les clés #raw("IMGPROXY_KEY") et #raw("IMGPROXY_SALT") sont injectées en variables d'environnement au démarrage du conteneur. Dans ce PoC, elles sont définies dans le #raw("docker-compose.yml") à titre de démonstration. Une mise en production exige :

- Stockage des secrets dans un gestionnaire dédié 
- Injection au démarrage sans exposition dans le fichier de composition
- Rotation périodique (impact sur les URL signées existantes, voir [4-6]).


== Implémentation sur un projet existant

La pré-étude prévoyait deux connecteurs (Drupal, Next.js). Le projet Eldora (WordPress) a été retenu pour le PoC, car il permet une validation complète en un seul écosystème et s'aligne avec le stack de test du benchmark (également en PHP). Ce recentrage réduit la démonstration empirique de l'agnosticité, mais approfondit l'implémentation réelle.

L'intégration repose sur la fonction #raw("imgproxy_url()") exposée dans StarterSite.php (classe Timber/Bedrock) et accessible en Twig sous le nom #raw("imgproxy()"). Les développeurs l'appellent manuellement dans les templates pour les images  (hero, featured images) en passant l'URL source et les opérations imgproxy souhaités (ex. rt:fit/q:75). 

En parallèle, un filtre WordPress sur le hook #raw("the_content") traite automatiquement tout HTML rendu contenant des balises #raw("<img src>") ou #raw("<source src>") — notamment les blocs Gutenberg éditoriaux — et remplace les URLs d'images par leurs équivalents proxifiés, sans modifier le contenu stocké en base. La signature HMAC est générée au rendu, pas à l'upload, ce qui permet la flexibilité : si la clé imgproxy change, seules les URLs générées après ce changement utiliseront la nouvelle signature, aucune migration de données n'est nécessaire.

== Choix d'implémentation

*Sécurisation via signature HMAC*

La signature HMAC a été retenue pour sécuriser l'accès à imgproxy. Contrairement à une restriction réseau (allowlist d'IP), elle protège la ressource indépendamment de la topologie — chaque requête porte sa preuve d'autorisation. Cela s'aligne avec l'objectif d'agnosticité : un changement d'hébergeur ou d'environnement n'impose pas de réviser les règles de filtrage. 
La documentation d'imgproxy recommande cette approche, ce qui justifie son adoption plutôt que de la contourner avec des contrôles réseau ad hoc.
Cela a un coût : la rotation de la clé secrète impose de la mettre à jour dans chaque projet client. Le PoC n'automatise pas ce processus, ce qui est acceptable pour une première version mais mériterait une amélioration (service centralisé de versionning).

*Absence de logique de fallback*

Le PoC ne couvre pas la gestion des erreurs lors de l'appel au service imgproxy. Actuellement, si le service est indisponible ou rejette une requête (timeout, erreur de traitement), la fonction #raw("image_proxy_url") retourne une URL invalide, ce qui provoque un lien cassé dans le rendu HTML et donc pas d'image affichée (@fallback-fail). 
#figure(
  image("../assets/figures/fallback-fail.png"),
  caption:("Exemple d'échec de fallback vers l'image originale")
)<fallback-fail>
Une logique de fallback vers l'image originale pourrait être implémentée en wrappant l'appel imgproxy dans un mécanisme try/catch et en retournant l'URL source en cas d'erreur. Cette implémentation n'a pas été validée sur le projet Eldora et reste en dehors du scope du PoC.
== Validation
Le déploiement sur le projet Eldora a permis de valider les points suivants :
-  *Affichage des images* : les images optimisées s'affichent correctement dans le navigateur sans erreur de rendu.
-  *Signature des URL* : les URLs générées contiennent bien le token HMAC, confirmant que la logique de signature fonctionne à la volée. (@poc-validation-1, encadrés en vert)

#figure(
  image("../assets/figures/poc-validation-1.png"),
  caption:("Points de validation concernant les images et la signature des URL")
)<poc-validation-1>

-  *Cache nginx* : les requêtes répétées vers la même image optimisée sont servies depuis le cache (@poc-validation-2, encadré violet), réduisant la charge sur imgproxy.
- *Format optimal* : les images sont servies dans le format le plus efficace supporté par le navigateur, en l'occurence l'AVIF (@poc-validation-2, encadré bleu) dans ce cas, confirmant que la négociation de contenu fonctionne correctement.

#figure(
  image("../assets/figures/poc-validation-2.png"),
  caption:("Points de validation concernant le cache et le format des images")
)<poc-validation-2>


== Limites et pistes

*Fallback en cas d'indisponibilité*

Si imgproxy tombe, les images ne s'affichent pas. Un fallback vers l'image brute directement depuis l'origin est nécessaire pour respecter la réversibilité client — si un client quitte l'agence, ses images doivent rester accessibles sans modification de code. Cela implique de configurer le routeur pour servir l'origin en cas d'erreur 5xx d'imgproxy.

*Test de charge*

Le PoC a été validé sur un petit volume d'images. Avant de déployer imgproxy pour tous les clients, il faudrait tester sous charge réelle (milliers de requêtes simultanées) pour dimensionner correctement la VM et confirmer que les performances restent acceptables. Un protocole de test devrait être établi.

*Renouvellement des certificats*

#raw("acme-companion") gère automatiquement le renouvellement des certificats SSL avant expiration. Cette mécanique n'a pas pu être entièrement validée durant le PoC faute de temps pour observer un cycle complet.

*Gestion centralisée des secrets*

Actuellement, les clés de signature et les variables d'environnement imgproxy sont gérées directement sur l'infrastructure. Pour une agence gérant plusieurs clients, une solution décentralisée par repo comme Infisical (self-hosted) permettrait de versionner, auditer et modifier les secrets sans compromettre l'agnosticité de la solution.

*Monitoring et alertes*

Le service repose sur une analyse manuelle des logs. En production, une sonde health-check simple (requête périodique vers une image test) et des alertes basiques (latence, taux d'erreur) renforceraient la robustesse opérationnelle.

regarder avec YG pour avoir les réponses à pk 
ça marche pas avec next


