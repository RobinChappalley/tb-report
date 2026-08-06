= Preuve de concept


== Cadre initial

Le projet Luxury Tribune était un projet en production idéal sur lequel intégrer imgproxy. Il s'agit d'un projet découplé (Wordpress headless et Next.js) avec plusieurs miliers d'images. Le projet est hébergé sur Vercel et utilise Vercel Images pour le traitement des images. Le but du PoC était de remplacer Vercel Images par imgproxy, afin de valider la faisabilité technique. Le traitement des images est centralisé dans un unique composant Next.js, ce qui, sur le papier, simplifie grandement l'intégration d'imgproxy.

Différents problèmes d'implémentation (détaillés en @blocage-technique) ont conduit a abandonner l'intégration sur Luxury Tribune et sur les projets Next.js en général. Le PoC a été recentré sur un projet WordPress (Eldora) pour valider l'intégration d'imgproxy.

=== Blocage technique <blocage-technique>
La signature HMAC des URLs imgproxy doit s'effectuer côté serveur, pour ne pas exposer la clé secrète au navigateur. Les React Server Components (RSC), introduits en Next.js 13, offrent cette capacité. Sauf que sur Luxury Tribune, comme sur la plupart des projets Next.js existants, les images étaient consommées dans des composants clients — une architecture courante pour la réactivité. Un composant serveur rendu à l'intérieur d'un composant client devient lui-même un composant client, ce qui rend impossible la signature sécurisée.
J'ai passé plusieurs semaines à explorer cette limite sans la comprendre vraiment. Gilles et Marc suggéraient que c'était "assez simple". Benoît, en discutant de la frontière serveur/client, m'a aidé à identifier le vrai problème. J'ai ensuite testé sur Next.js 14 et 16, pensant que l'architecture des RSC s'était clarifiée, sans succès.
Yann, développeur Next.js senior chez Antistatique, a proposé une piste alternative : utiliser les middlewares Next.js. Ces middlewares s'exécutent côté serveur avant le rendu et pourraient théoriquement intercepter et signer les URLs en transit. Cette approche n'a pas été explorée faute de temps, mais elle mérite investigation pour des projets futurs.
Face à ce blocage et au risque de perte de temps, j'ai pivoté vers Eldora, un projet Drupal offrant un écosystème d'images plus accessible et une itération plus rapide sur la PoC.

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

#raw("nginxproxy/nginx-proxy") est une image Docker spécialisée qui génère et recharge automatiquement la configuration Nginx en fonction des conteneurs actifs @NginxproxyREADMEmd58469cab4e7476a04ce3028a5f4df7a860db6e6f. Contrairement à l'image #raw("nginx:latest") standard, elle n'expose pas un fichier #raw("nginx.conf") modifiable : sa configuration est entièrement dérivée des variables d'environnement (#raw("VIRTUAL_HOST"), #raw("LETSENCRYPT_HOST"), etc.) que déclarent les autres conteneurs. Cette approche élimine la maintenance manuelle de la configuration lors de l'ajout de nouveaux services. 
Le fichier complet se trouve en annexe (@docker-compose.yaml).

*SCHEMA A METTRE*



=== Renouvellement automatique des certificats

Let's Encrypt émet des certificats valides 90 jours @CertificateLifetimeRationale. Le renouvellement est géré par #raw("nginxproxy/acme-companion"), qui reçoit les notifications de #raw("nginxproxy/nginx-proxy") et réeffectue la demande avant expiration @NginxproxyAcmecompanionAutomated. Le comportement n'a pas pu être vérifié en conditions réelles : la durée du PoC est inférieure au cycle de renouvellement. Avant une mise en production, il faudrait valider que le renouvellement s'opère correctement et que Nginx recharge sa configuration sans interruption de service.

=== Secrets et variables d'environnement
Les clés #raw("IMGPROXY_KEY") et #raw("IMGPROXY_SALT") sont injectées en dur au démarrage du conteneur. Dans ce PoC, elles sont définies dans le fichier #raw("docker-compose.yaml") à titre de démonstration. Cette approche expose les secrets dans le contrôle de version et ne respecte pas les bonnes pratiques de gestion des identifiants en production.

Une mise en production exige un gestionnaire de secrets dédié @AreSecretsManagers2025 (par ex. Infisical) qui permet de versionner, auditer et distribuer les identifiants sans les exposer dans les fichiers de configuration. De plus, la rotation périodique des clés doit être automatisée : actuellement, chaque rotation impose une intervention manuelle sur l'infrastructure et invalide toutes les URLs signées antérieures, ce qui complique la maintenabilité. Une solution auto-hébergée comme Infisical permettrait de centraliser la gestion des secrets et d'automatiser la rotation, tout en conservant l'agnosticité du service.


== Implémentation sur un projet existant

La pré-étude prévoyait deux connecteurs (Drupal, Next.js). Le projet Eldora (WordPress) a été retenu pour le PoC, car il permet une validation complète en un seul écosystème (PHP) et s'aligne avec le stack de test du benchmark (également en PHP). Ce recentrage réduit la démonstration empirique de l'agnosticité, mais approfondit l'implémentation réelle.

L'intégration repose sur la fonction #raw("imgproxy_url()") exposée dans StarterSite.php (classe Bedrock) et accessible en Twig sous le nom #raw("imgproxy()"). Les développeurs l'appellent manuellement dans les templates pour les images  (hero, featured images) en passant l'URL source et les opérations imgproxy souhaités (ex. rt:fit/q:75). 

En parallèle, un filtre WordPress sur le hook #raw("the_content") traite automatiquement tout HTML rendu contenant des balises #raw("<img src>") ou #raw("<source src>") — notamment les blocs Gutenberg éditoriaux — et remplace les URLs d'images par leurs équivalents proxifiés, sans modifier le contenu stocké en base. La signature HMAC est générée au rendu, pas à l'upload, ce qui permet la flexibilité : si la clé imgproxy change, seules les URLs générées après ce changement utiliseront la nouvelle signature, aucune migration de données n'est nécessaire.

== Choix d'implémentation

*Sécurisation via signature HMAC*

La signature HMAC a été retenue pour sécuriser l'accès à imgproxy. Contrairement à une restriction réseau (allowlist d'IP), elle protège la ressource indépendamment de la topologie: chaque requête porte sa preuve d'autorisation. Cela s'aligne avec l'objectif d'agnosticité : un changement d'hébergeur ou d'environnement n'impose pas de réviser les règles de filtrage. 
La documentation d'imgproxy recommande cette approche, ce qui justifie son adoption plutôt que de la contourner avec des contrôles réseau ad hoc.
Cela a un coût : la rotation de la clé secrète impose de la mettre à jour dans chaque projet client (voir limitations en 4-2-5).



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

Si imgproxy tombe, les images ne s'affichent pas. Un fallback vers l'image source est nécessaire pour garantir la continuité de service si imgproxy devient indisponible. Sans ce mécanisme, l'agence s'expose à un point de défaillance unique : toute interruption d'imgproxy rend invisibles les images du client. De plus, cela respecte le principe de réversibilité : si un client résilie son contrat, ses images doivent rester accessibles sans modification de code. 

*Test de charge*

Le PoC a été validé sur un petit volume d'images. Avant de déployer imgproxy pour tous les clients, il faudrait tester sous charge réelle (milliers de requêtes simultanées) pour dimensionner correctement la VM et confirmer que les performances restent acceptables. Un protocole de test devrait être établi.


*Monitoring et alertes*

En cas de problème, le service repose sur une analyse manuelle des logs. En production, une sonde health-check simple (requête périodique vers une image test) et des alertes basiques (latence, taux d'erreur) renforceraient la robustesse opérationnelle.




