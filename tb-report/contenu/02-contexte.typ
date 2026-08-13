= Contexte
== Fragmentation du traitement d'images
Antistatique développe et maintient une vingtaine de projets web par an. Pour chaque mandat, l'agence analyse le besoin du client et sélectionne la stack technique la plus adapté: CMS traditionnels et headless (Drupal, WordPress), frameworks JavaScript modernes (Next.js). Cette démarche se traduit par une hétérogénéité technique  : la stack varie d'un projet à l'autre, par choix, selon le contexte de chaque mandat.
Dans cet environnement, chaque stack traite le sujet des images de manière autonome et cloisonnée :

 - Écosystème Next.js : Le composant natif #raw("next/image") fournit une expérience développeur efficace pour l'optimisation à la volée (redimensionnement, changement de format). Son fonctionnement optimal repose toutefois par défaut sur l'infrastructure serveur propriétaire de Vercel.
- Écosystèmes CMS (Drupal, WordPress) : Le traitement des images (redimensionnement, formats, jeux d'images réactives) est délégué à des modules internes. Antistatique a développé un module Drupal, Image Styles Builder, pour résoudre ce problème dans l'écosystème Drupal. Ce module répond à un besoin exprimé par les équipes frontend, qui peuvent déclarer les styles nécessaires et les transmettre aux développeurs backend pour génération des variantes d'images. Il démontre une volonté déjà existante chez Antistatique de standardiser la gestion des images mais dans ce cas limitée à un seul écosystème. @ImageStylesBuilder2022


#figure(
  image("../assets/figures/fragmentation.png"),
  caption:"Fragmentation du traitement d'images selon la stack technique"
)


== Problème d'indépendance technologique
Sur les projets Next.js, #raw("next/image") atteint sa pleine efficacité lorsqu'il est couplé à l'infrastructure Vercel @GettingStartedImage. Ce couplage pose une question d'indépendance technologique pour l'agence : la capacité à maintenir, faire évoluer ou migrer un projet ne devrait pas dépendre d'un unique fournisseur d'infrastructure.

Cette indépendance n'est cependant pas une contrainte absolue à respecter à tout prix mais un critère à mettre en balance avec d'autres facteurs (coût, performance, simplicité de mise en œuvre). C'est précisément l'objet du Benchmark réalisé dans le cadre de ce travail : comparer plusieurs architectures, y compris des solutions reposant sur des services tiers, en pondérant leurs avantages et inconvénients selon des critères objectifs.

== Enjeu de standardisation interne
Le premier mot du titre de ce travail — *standardiser* — situe l'enjeu principal. Il s'agit de définir un processus commun applicable à l'ensemble du parc applicatif de l'agence, indépendamment du CMS, du framework ou de l'hébergement utilisé.
Le bénéfice attendu ne se mesure pas prioritairement en termes financiers : les 4,51 millions d'images redimensionnées chez Vercel sur l'année écoulée ont coûté 557 CHF à Antistatique, soit 11.8 centimes par 1000 images transformées. Ce montant confirme que le coût brut du traitement d'image ne constitue pas, en soi, un poste de dépense significatif à l'échelle de l'agence.

Le gain visé est avant tout organisationnel. Une solution standardisée dispenserait les équipes de renégocier, à chaque nouveau projet, les règles de traitement des images (ratios, formats, stratégie de cache), et leur fournirait un outil unique à intégrer, quelle que soit la stack du projet. Ce gain en clarté et en confort de travail (l'expérience développeur) est difficile à chiffrer, mais représente un facteur d'adoption déterminant pour la pérennité de la solution.
== Sujet propice à un Travail de Bachelor
L'absence de gain financier direct distingue cette problématique des développements habituellement facturés à un client. Sa résolution demande un temps d'analyse comparative et d'expérimentation technique — comparaison d'architectures, prototypage, mesures de performance — difficile à caser dans le calendrier serré d'un mandat client. C'est cette nature exploratoire, combinée à un enjeu réel mais non urgent, qui a conduit Antistatique à confier cette problématique à un Travail de Bachelor.