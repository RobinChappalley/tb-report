= Contexte
== Fragmentation du traitement d'images
Antistatique développe et maintient une vingtaine de projets web par an, reposant sur des piles technologiques hétérogènes : CMS traditionnels et headless (Drupal, WordPress), frameworks JavaScript modernes (Next.js) ou frameworks PHP (Symfony). Cette diversité découle directement des contraintes imposées par chaque mandant — hébergement institutionnel, exigences de sécurité, préférences techniques héritées de projets antérieurs.
Dans cet environnement, chaque stack traite le sujet des images de manière autonome et cloisonnée :

 - Écosystème Next.js : Le composant natif next/image fournit une expérience développeur efficace pour l'optimisation à la volée (redimensionnement, changement de format). Son fonctionnement optimal repose toutefois par défaut sur l'infrastructure serveur propriétaire de Vercel (Vercel, s. d.). Lorsqu'un projet Next.js est déployé en dehors de cette plateforme — situation fréquente chez Antistatique pour des raisons d'hébergement imposées par le client —, ce mécanisme perd son efficacité native.
- Écosystèmes CMS (Drupal, WordPress) : Le traitement des images (redimensionnement, formats, jeux d'images réactives) est délégué à des modules internes ou des extensions tierces, dont la configuration et les capacités varient d'un CMS à l'autre.
- Projets Symfony et développements sur mesure : Les traitements d'image sont le plus souvent implémentés manuellement, projet par projet, sans réutilisation systématique du code entre mandats.

Cette fragmentation a une conséquence directe sur le fonctionnement de l'agence : à chaque nouveau projet, les équipes de développement redéfinissent — souvent depuis zéro — les règles de redimensionnement, les ratios d'images, les formats cibles et les stratégies de mise en cache. La documentation interne actuelle d'Antistatique se limite à recommander l'usage de la balise <picture> (voir Annexe 3), sans définir comment les variantes d'images qu'elle référence doivent être générées. Ce vide documentaire laisse chaque développeur libre de définir sa propre approche.
[ FIGURE 2.1 — À réaliser ]
Titre : Fragmentation actuelle des pipelines de traitement d'images chez Antistatique

Contenu suggéré :
Colonne 1 (Next.js) — icône Vercel — flèche vers "Optimisation native (dépendante de l'hébergement)"
Colonne 2 (Drupal) — icône Drupal — flèche vers "Module de traitement interne"
Colonne 3 (WordPress) — icône WordPress — flèche vers "Plugin tiers"
Colonne 4 (Symfony / sur mesure) — flèche vers "Script ad hoc"

Sous chaque colonne : "Configuration propre, non réutilisable"
== Problème d'indépendance technologique
Sur les projets Next.js, #raw("next/image") atteint sa pleine efficacité lorsqu'il est couplé à l'infrastructure Vercel @GettingStartedImage. Ce couplage pose une question d'indépendance technologique pour l'agence : la capacité à maintenir, faire évoluer ou migrer un projet ne devrait pas dépendre d'un unique fournisseur d'infrastructure.

Cette indépendance n'est cependant pas une contrainte absolue à respecter à tout prix mais un critère à mettre en balance avec d'autres facteurs (coût, performance, simplicité de mise en œuvre). C'est précisément l'objet du Benchmark réalisé dans le cadre de ce travail : comparer plusieurs architectures, y compris des solutions reposant sur des services tiers, en pondérant leurs avantages et inconvénients selon des critères objectifs.

== Enjeu de standardisation interne
Le premier mot du titre de ce travail — *standardiser* — situe l'enjeu principal. Il s'agit de définir un processus commun applicable à l'ensemble du parc applicatif de l'agence, indépendamment du CMS, du framework ou de l'hébergement utilisé.
Le bénéfice attendu ne se mesure pas prioritairement en termes financiers : les 4,51 millions d'images redimensionnées chez Vercel sur l'année écoulée ont coûté 557 CHF à Antistatique, soit 11.8 centimes par 1000 images transformées. Ce montant confirme que le coût brut du traitement d'image ne constitue pas, en soi, un poste de dépense significatif à l'échelle de l'agence.

Le gain visé est avant tout organisationnel. Une solution standardisée dispenserait les équipes de renégocier, à chaque nouveau projet, les règles de traitement des images (ratios, formats, stratégie de cache), et leur fournirait un outil unique à intégrer, quelle que soit la stack du projet. Ce gain en clarté et en confort de travail (l'expérience développeur) est difficile à chiffrer, mais représente un facteur d'adoption déterminant pour la pérennité de la solution.
== Sujet propice à un Travail de Bachelor
L'absence de gain financier direct distingue cette problématique des développements habituellement facturés à un client. Sa résolution demande un temps d'analyse comparative et d'expérimentation technique — comparaison d'architectures, prototypage, mesures de performance — difficile à caser dans le calendrier serré d'un mandat client. C'est cette nature exploratoire, combinée à un enjeu réel mais non urgent, qui a conduit Antistatique à confier cette problématique à un Travail de Bachelor.