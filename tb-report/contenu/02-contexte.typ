= Contexte

== Un traitement d’images propre à chaque environnement technique

Antistatique développe et maintient une vingtaine de projets web par an. Pour chaque mandat, l’agence choisit les technologies en fonction des besoins du client. Ses projets reposent notamment sur Drupal, WordPress ou Next.js. Cette diversité résulte donc des choix effectués pour chaque mandat.

Le traitement des images constitue un besoin commun à ces différents environnements. Une image doit généralement être redimensionnée, convertie dans un format adapté, puis livrée dans une variante correspondant à son contexte d’affichage. La manière d’effectuer ces opérations varie toutefois selon la stack utilisée.

Dans Drupal, Antistatique a développé le module Image Styles Builder. Celui-ci permet aux équipes front-end de déclarer les styles nécessaires, puis aux développeurs back-end de produire les variantes correspondantes. Il fournit ainsi une méthode commune aux projets Drupal de l’agence. @ImageStylesBuilder2022

Dans WordPress, le traitement repose sur les fonctionnalités du CMS et sur du code propre à chaque projet. Les mécanismes de génération et d’utilisation des variantes sont donc adaptés à l’implémentation du site concerné.

Tous les projets Next.js d’Antistatique sont actuellement déployés sur Vercel. Le composant #raw("next/image") fournit aux développeurs une interface pour demander des images adaptées à leur contexte d’affichage. Dans l’architecture utilisée par l’agence, les transformations correspondantes sont exécutées par le service d’optimisation d’images de Vercel. Next.js permet également de connecter le composant à un autre service au moyen d’un chargeur personnalisé. @GettingStartedImage

Antistatique dispose ainsi de mécanismes fonctionnels dans ses différentes stacks. Leur portée varie cependant : Image Styles Builder fournit une base commune aux projets Drupal, les projets WordPress possèdent leur propre implémentation et les projets Next.js délèguent le traitement au service de Vercel. Les équipes doivent donc intégrer et maintenir plusieurs solutions pour répondre à un même besoin.

#figure(
image("../assets/figures/fragmentation.png"),
caption: [Mécanismes de traitement des images selon les stacks utilisées chez Antistatique],
)

== Périmètre de la standardisation

La gestion des images comprend deux niveaux susceptibles d’être standardisés.

Le premier concerne la définition des variantes : dimensions, ratios, recadrages et contextes d’affichage. Ces choix dépendent de la conception graphique, de la nature des contenus et des besoins propres à chaque projet.

Le second concerne leur exécution technique : récupération de l’image source, redimensionnement, conversion, mise en cache et livraison du résultat. Ces opérations remplissent des fonctions comparables d’un projet à l’autre, même lorsque les technologies utilisées diffèrent.

Le besoin exprimé par Antistatique porte sur ce second niveau. Chaque projet continuerait à définir les variantes requises et à sélectionner celle qui convient au contexte d’affichage. Un mécanisme partagé prendrait en charge leur génération et leur livraison. Les fichiers originaux pourraient rester sous la responsabilité de chaque application.

Cette répartition conserve la liberté nécessaire à la conception de chaque site tout en regroupant les opérations techniques récurrentes. Les développeurs seraient les premiers bénéficiaires de cette standardisation : ils disposeraient d’une interface commune et auraient moins de logique propre à chaque stack à mettre en place et à maintenir.

== Maîtrise du service utilisé par les projets Next.js

La situation actuelle des projets Next.js peut être examinée sous deux angles : le coût du service et la marge de manœuvre dont dispose Antistatique pour le remplacer.

D'août 2025 à août 2026, les données de facturation internes recensent 4,51 millions de transformations d’images pour un coût de 557 CHF. Ce montant place l’économie financière immédiate au second plan. Une infrastructure exploitée par Antistatique occasionnerait elle aussi des dépenses d’hébergement et de maintenance.

La maîtrise du service constitue un enjeu plus important. Une modification des tarifs ou des conditions d’utilisation de Vercel s’appliquerait directement aux projets concernés. Antistatique pourrait alors conserver le service ou migrer vers un autre mécanisme. Cette migration est techniquement possible, mais elle demanderait d’adapter les projets et d’exploiter une nouvelle solution.

Un service commun placé sous le contrôle de l’agence offrirait une autre base pour effectuer les transformations. Cette autonomie s’accompagnerait de nouvelles responsabilités, notamment pour le déploiement, la disponibilité, la sécurité et la maintenance du service. Elle doit donc être mise en balance avec le coût, les performances et la simplicité d’intégration des solutions existantes.

== Origine du besoin

Lors de la recherche d’un sujet de Travail de Bachelor, Gilles (CTO) a transmis une demande formulée en interne comme un besoin commençant à apparaître systématiquement dans les projets : disposer d’un « service self-hosted interne de redimensionnement des images à la volée ».

Cette demande associait deux attentes observées chez Antistatique : fournir aux différentes stacks un mécanisme de traitement commun et reprendre la maîtrise d’une fonction actuellement déléguée à Vercel dans les projets Next.js. L’auto-hébergement constituait l’orientation envisagée au départ. Son intérêt devait toutefois être apprécié au regard des contraintes d’exploitation qu’il ferait porter à l’agence.

== Problématique

Antistatique cherche ainsi à mutualiser un besoin technique actuellement résolu de plusieurs manières, tout en conservant la possibilité d’adapter les variantes d’images à chaque projet. Plusieurs architectures peuvent répondre à ce besoin, depuis un service exploité par l’agence jusqu’à une solution spécialisée fournie par un tiers. Chacune répartit différemment les responsabilités, les coûts et les contraintes techniques.

La problématique retenue est donc la suivante :

*Quelle architecture permettrait à Antistatique de centraliser le traitement et la livraison des images indépendamment des stacks employées, et quels compromis son adoption implique-t-elle en matière de performance, de coût, de maintenance et d’intégration ?*

#pagebreak()