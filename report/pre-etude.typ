#import "styles.typ": *
#import "@preview/oxdraw:0.1.0" : *

#page-titre()

#authentification()

#set page(
  paper: "a4",
  margin: (x: 1.8cm, y: 1.5cm),
  numbering: "1 of 1",
  number-align: center + top,
footer : context{ "HEIG-VD – COMEM  – " + doc-type + " - Avril 26" + " " + counter(page).display();

},
header: [
    #grid(
      columns: (1fr, 1fr),
      align: (left, right),
      gutter: 0pt,
      grid.cell(image("./assets/HEIG-VD_logotype-baseline_rouge-rvb.png", width: 3cm)),
    )
  ]
  
)

#let appendix(body) = {
  set heading(numbering: "1", supplement: [Annexe])
  counter(heading).update(0)
  body
}

#set heading(numbering: "1.")
#show: doc => conf(doc)

//Début du rapport

== Mandant



Antistatique est une agence web lausannoise spécialisée dans la conception, le développement et la maintenance de produits digitaux. L'équipe, composée de quatre designers et six développeurs, livre une vingtaine de projets par an, majoritairement pour des organisations publiques et parapubliques telles que l'Université de Lausanne, la Ville de Vernier ou la Cinémathèque suisse. Une part plus restreinte de l'activité concerne des mandats privés (stratégie de marque, campagnes marketing, développement sur mesure).

Cette typologie de clientèle implique une diversité importante de stacks techniques et d'infrastructures d'hébergement, chaque mandat reposant sur les contraintes propres au commanditaire. Pour travailler malgré cette hétérogénéité, l'équipe s'appuie sur les standards du web, qui constituent un socle commun à tous les projets, et entretient une veille technique active.



/* #oxdraw(
  read("diagrams/architecture.mmd"), 
  background: "#f0f8ff",
  overrides: (
    node_styles: (
      User: (fill: "#ffff99", stroke: "#333333", text: "#000000"),
      Client1: (fill: "#ff99ff", stroke: "#333333", text: "#000000"),
      Client2: (fill: "#ff99ff", stroke: "#333333", text: "#000000"),
      Nginx: (fill: "#ffb347", stroke: "#333333", text: "#000000"),
      ImgProxy: (fill: "#9999ff", stroke: "#333333", text: "#000000"),
      S3: (fill: "#99ff99", stroke: "#333333", text: "#000000"),
      LocalStorage: (fill: "#99ff99", stroke: "#333333", text: "#000000"),
      note1: (fill: "#eeeeee", stroke: "#333333", text: "#000000")
    )
  )
) */


//Mettre l'accent sur la culture d'entreprise, les valeurs et l'approche unique 





== Problématique
#question("Comment le mandant présente-t-il sa problématique dans son contexte?")
#objectif("Expliquer la problématique du mandant de manière structurée et contextualisée. Montrer en quoi les compétences en ingénierie des médias sont a priori pertinentes pour y répondre.")
#contenu-attendu("1 page. Résumé de la situation actuelle et des développements demandés par le mandant. À quel besoin devra répondre ce projet ? Quelles compétences seront nécessaires et pourquoi?")
Aujourd'hui, Antistatique est capable de livrer des images optimisées (format et poids) aux utilisateur finaux de ses clients. Le processus pour y parvenir varie selon la stack technologique et repose sur des tâches répétitives et fastidieuses.

L'agence exprime un besoin de standardiser la gestion des images. Bien que le processus actuel soit satisfaisant pour les clients et utilisateurs finaux, ce n'est pas une solution satisfaisante pour les développeurs. Sur chaque projet, le développeur front-end et le backend doivent se mettre d'accord sur comment gérer la livraison d'images adaptées à l'utilisateur final. Antistatique souhaite que cette responsabilité soit déleguée à une brique logicielle tierce, indépendante de la technologie utilisée.

Malgré la séparation des responsabilités, l'agence a besoin que la solution choisie n'altère ni l'expérience de développement de ses employés, ni l'expérience de rédaction de ses clients. Autrement dit, quand un client upload une image, il doit pouvoir continuer à le faire de la même manière, sans devoir apprendre à utiliser un nouvel outil. De même, les développeurs doivent pouvoir continuer à utiliser les outils et les processus qu'ils utilisent aujourd'hui pour intégrer les images dans les pages web.

Concernant l'hébergement, Antistatique souhaite que la solution s'adapte à n'importe quel type d'hébergment. La majorité de ses clients utilise l'hébergement mutualisé d'Infomaniak; dans ce cas, les images se trouvent sur le serveur du site web (@appendix-infomaniak-web-hosting), mais la solution doit pouvoir s'adapter en fonction d'où les images se trouvent.

Actuellement, la documentation d'Antistatique à propos de la gestion des images précise qu'il est nécessaire d'utiliser la balise picture (voir @appendix-antistatique-doc-images), mais ne contient pas d'information sur comment les différentes images qui seront appelées par cette balise doivent être créées. Ce vide documentaire laisse chaque développeur libre de définir sa propre approche, ce qui rend les pratiques difficiles à auditer, à faire évoluer ou à transférer d'un projet à l'autre.


Dans ce contexte, les compétences de l'ingénieur de médias sont utiles pour proposer une solution technique adaptée aux besoins de l'entreprise, puisqu'il comprend les enjeux techniques, mais aussi les aspects liés à l'expérience développeur/rédacteur. Il s'agira aussi d'accompagner le changement et l'adoption de cette solution par les équipes de développement.



== Recherches
#question("Quelles sources ai-je identifiées pour comprendre la problématique? En quoi sont-elles pertinentes?")
#objectif("Exposer synthétiquement les recherches menées pour analyser la problématique")
#contenu-attendu("1-2 pages. Description de ce que vous avez appris, provenant de différentes sources, et qui vous a permis de mieux comprendre la problématique, de la contextualiser par rapport à l’écosystème de votre mandant et de la transformer en besoins")

Les recherches menées permettent de comprendre pourquoi Antistatique essaie de régler ce problème et d'amener des pistes de solutions.

La documentation de MDN sur les formats d'image avance que plus de 51% de la bande passante utilisée pour le web est consacrée au téléchargement d'images @MultimediaImagesLearn2026. L'intérêt pour les entreprises de réduire la taille des images est donc évident, que ce soit pour réduire les coûts d'hébergement ou pour améliorer les performances de leurs sites web. De plus, les moteurs de recherche prennent en compte la performance d'un site web dans leur algorithme de référencement, ce qui rend l'optimisation des images importante pour le SEO @BonnesPratiquesSEO.  Le support universel de la balise <picture> par les navigateurs depuis 2016 confirme l'importance d'une gestion adaptative des médias @HTMLPictureElement2026.

// La manière dont Antistatique résoud le problème de l'optimisation des images aujourd'hui est très manuelle et 

Pourtant, le processus actuel d'Antistatique souffre d'un couplage fort @CouplingCohesionSoftware : la transformation et la distribution des images dépendent intrinsèquement de la technologie choisie pour chaque projet (WordPress, Drupal, etc.). Découpler la gestion des images de la stack technique offrirait à l'agence une meilleure flexibilité face aux évolutions technologiques @ganapathyDiscoverBenefitsDecoupled2023. Liip, l'une des grandes agences web suisse, a lancé un service (Rokka) pour répondre à ce besoin et découpler la gestion des images de la technologie utilisée @switzerlandRokkaWebImages. Cela prouve qu'il existe une demande concrète pour ce type de service au sein du marché des agences web suisses.


Enfin, bien que le temps de configuration de ces outils par projet semble faible (1h pour intégrer le module dans Drupal selon un développeur), cette approche génère une dette technique. Dans l'ingénierie logicielle, ce type de configuration manuelle répétitive s'apparente au Toil,  @GoogleSREWhat comme une tâche sans valeur ajoutée durable. Avant de pouvoir automatiser un processus, il faut d'abord le standardiser @davenportProcessInnovationReengineering20xx. Définir une méthode unique pour toute l'agence permettrait de garantir une qualité d'image constante sur tous les sites, tout en évitant que la configuration ne dépende des habitudes techniques de chaque développeur.


#pagebreak()
== Besoins

#question("Qu’ai-je appris de l’analyse des sources identifiées? Quels liens ai-je établis entre plusieurs sources pour en tirer des conclusions utiles sur les besoins du mandant?")
#objectif("Exposer synthétiquement la traduction de la problématique en besoins clairs, précis et structurés. Montrer les liens entre la recherche documentaire, l’analyse et les besoins.")
#contenu-attendu("1-2 pages. Liste des besoins et argumentaire expliquant en quoi l’analyse menée à partir de vos recherches documentaires a permis de définir cette liste.")
== Besoins identifiés

L’analyse de la problématique met en évidence deux contraintes principales pour Antistatique. La première concerne la dépendance aux services tiers : l’agence souhaite conserver la maîtrise de la solution, de ses coûts et de son déploiement. La seconde concerne la diversité technique de ses projets : les sites maintenus par l’agence reposent sur des CMS, frameworks et hébergements différents.

Ces contraintes conduisent à définir les besoins suivants.

=== 1. Interopérabilité avec les stacks existantes et futures

La solution doit pouvoir être utilisée indépendamment du CMS, du framework front-end ou de l’hébergement du projet. Ce besoin découle directement de la diversité des environnements techniques utilisés par l’agence. Une solution trop liée à une technologie précise déplacerait le problème au lieu de le résoudre : elle nécessiterait des adaptations spécifiques à chaque projet.

=== 2. Centralisation de la logique d’optimisation

Le traitement des images doit être centralisé afin que chaque projet ne réimplémente pas ses propres règles de compression, de redimensionnement et de conversion de formats. Ce besoin répond à un enjeu de maintenance : lorsqu’une règle évolue ou qu’un nouveau format devient pertinent, la mise à jour doit pouvoir être effectuée à un seul endroit plutôt que dans chaque codebase.

=== 3. Maîtrise du déploiement et des coûts

La solution ne doit pas enfermer l’agence dans un écosystème propriétaire fermé. Elle doit pouvoir être déployée sur une infrastructure cloud standard, avec des coûts compréhensibles et prévisibles. Ce besoin est important pour permettre à l’agence de conserver une marge de décision sur l’hébergement, l’évolution de la solution et son modèle d’exploitation.

=== 4. Disponibilité et robustesse

Comme la solution interviendrait dans la chaîne de livraison des images, elle ne doit pas introduire un point de défaillance critique. En cas d’indisponibilité du service d’optimisation, les images doivent rester accessibles, même sans traitement optimisé. Ce besoin est essentiel pour éviter qu’un problème sur la solution impacte fortement l’affichage des sites clients.

=== 5. Faible charge d’intégration pour les développeurs

La solution doit limiter au maximum le travail demandé aux développeurs lors de l’intégration dans un projet. L’objectif n’est pas de masquer totalement le fonctionnement du système, mais de rendre son usage suffisamment simple et standardisé pour qu’un nouveau développeur puisse l’adopter rapidement. 

=== 6. Réversibilité pour les sites clients

Dans le cas où un client quitte l’agence, le site doit continuer à fonctionner sans dépendre absolument de la solution mise en place par Antistatique. Le départ d’un client ne doit pas rendre ses images inaccessibles. La perte acceptable est celle de l’optimisation avancée, pas celle du contenu.

Ces besoins ne présupposent pas une solution technique unique. Ils servent de critères pour comparer plusieurs approches possibles, notamment une intégration par helpers, une approche par composant web, une réécriture HTML côté infrastructure ou un service d’optimisation d’images découplé. Le travail de Bachelor devra permettre d’évaluer ces pistes à partir de critères mesurables : performance, maintenabilité, facilité d’intégration et robustesse.


#pagebreak()

== Objectifs et livrables
Documentation sur comment utiliser, comment ça a été déployé et comment le mettre en place sur d'autres sites.
#question("Comment mon travail est-il organisé? ")
#objectif("Formuler clairement et synthétiquement les objectifs de développement, les tâches et les livrables associés, ainsi que la manière dont ces éléments s’articulent dans un planning crédible.")
#contenu-attendu("1-2 pages. Objectifs découpés en tâches et en livrables. Description synthétique des livrables. Planning crédible, dont on décrira les principales étapes directement dans le rapport, avec une version complète en annexe.")


Ce projet se structure autour de trois objectifs majeurs. 
=== Analyses
Dans un premier temps, une phase d'analyse critique permettra d'évaluer et de comparer les différentes stratégies centralisées de livraison de médias (solutions SaaS, optimisation via Edge CDN ou proxy auto-hébergé). Cette comparaison s'appuiera sur des critères stricts de coût, de performance et d'indépendance technologique. La procédure de tests ainsi que les résultats obtenus font parties des livrables qui seront rendus à l'issue du travail de bachelor. L'élaboration et la réalisation de ces tests est estimée à une durée de 3 semaines. Un site avec des images lourdes non compressées a déjà été mis en place pour servir de terrain de test.
=== Preuve de concept
Dans un second temps, le projet visera à déployer une preuve de concept (PoC) de la solution retenue, afin de valider sa capacité technique à traiter et distribuer des images à la volée sur un projet réel de l'agence. Le livrable associé comprendra le code source de la preuve de concept ainsi que la documentation de son déploiement, de manière à permettre à l'agence de la répliquer sur d'autres projets. Cette phase est estimée à une durée de 4 semaines, en incluant le temps nécessaire pour intégrer la solution dans un projet existant.
=== Connecteurs
Pour assurer l'utilisabilité de cette architecture, le dernier objectif consistera à développer des connecteurs légers (composants ou helpers) pour les stacks principales de l'agence, telles que Drupal et Next.js. Ces connecteurs auront pour but d'interfacer les CMS avec le service de traitement d'images de façon transparente, limitant ainsi la dette technique tout en centralisant la maintenance. Le code de ces différents connecteurs et la documentation associé font partie des livrables de cette dernière phase, estimée à une durée de 2 semaines. Le but est de se limiter à Drupal et Next.js, mais il est envisagable d'ajouter d'autres connecteurs si le temps le temps le permet.




#pagebreak()
#question("Quelle est la valeur ajoutée pour le mandant de mon travail?")
#objectif("Démontrer la valeur ajoutée que votre travail apportera au mandant: la nature des tâches, leur complexité et leur diversité, en lien avec les compétences multidisciplinaires de l’ingénierie des médias.")
#contenu-attendu("1 page. Argumentaire permettant de comprendre en quoi votre travail apporte de la valeur ajoutée et quelle est cette valeur (technique, conceptuelle, analytique, marketing, autre)? Quel est le degré de mobilisation de vos compétences en ingénierie des médias?")

== Valeur ajoutée pour le mandant
Pour Antistatique, ce projet représente une opportunnité de standardiser un processus technique essentiel. Cette standardisation permet de préparer la gestion des images des clients à court et à moyen terme. Si un nouveau format d'image plus performant émerge, il sera très facile de l'intégrer à la solution centralisée. 

Dans le cas où un client a déjà beaucoup de contenu avec de nombreuses images mal optimisées, la solution pourrait permettre de livrer des images d'une qualité similaire mais d'un poids moindre. Cela peut être un argument de vente pour convaincre un client de faire appel à Antistatique pour la refonte de son service web, en lui proposant une amélioration des performances et du SEO grâce à une meilleure gestion des images.

Réaliser une analyse comparative des solutions du marché permettra à l'agence de choisir en se basant sur des critères objectifs et mesurables, plutôt que sur des considérations subjectives ou des recommandations de fournisseurs. 



=== Compétences mobilisées :
- Technologie web
- Gestion de projet et du changement (adoption par les équipes)
- Développement d'application
- Intégration d'un service tiers au sein d'un processus existant


#pagebreak()

== Risques

Attention à "protéger" l'endpoint, sinon les gens vont se mettre à l'utiliser pour faire tout et n'importe quoi (créer une UI pour ajouter les sites autorisés ?)
#question("Quels sont les facteurs de risque du projet? Comment les prévenir et les atténuer s’ils surviennent ? ")
#objectif("Proposer une matrice des risques (risque, mesure de prévention, mesure de correction, degré) cohérente et pertinente en fonction du contexte du TB et du mandant")
#contenu-attendu("1 page Matrice des risques et commentaire court sur les points nécessitant davantage d’explications (Selon les contextes, certains risques ne sont pas évidents et doivent être expliqués).")
#pagebreak()

== Conclusion
#question("1-2 pages. En prenant du recul, qu’ai-je appris? Que ferai-je différemment? Quelles sont les limites de mon approche et du contexte dans lequel s’est déroulée cette pré-étude?")
#objectif("Démontrer des capacités d’analyse de son propre travail, des choix pris et de son évolution professionnelle.")
#contenu-attendu("Une première partie présente les principaux éléments découverts (analyse) et résume brièvement les limites, les défis et les choix effectués. Une deuxième partie, plus personnelle, rend compte, de manière réflexive, du déroulement de la pré-étude.")





#pagebreak()

#outline(target: figure.where(kind: "annexe"), title: [Annexes])

#show: appendix

#figure(
  image("./assets/infomaniak-web-hosting.png", width: 12cm),
  caption: "Capture d'écran d'Infomaniak sur l'hébergement web mutualisé", supplement: [Annexe], kind: "annexe")<appendix-infomaniak-web-hosting>


#figure(
```html
<picture>
 <source type="image/webp" 
srcset="https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_256x154/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=cxoRUVZH 256w,
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_384x230/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=BBNjNnkT 384w, 
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_690x414/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=nAipFH2_ 690w, 
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_750x450/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=vHHT8gqI 750w, 
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_828x497/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=bLlh56QY 828w, 
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_1080x648/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=WE0s6VXz 1080w,
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_1400x840/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=GIDqcKq- 1400w, 
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_1920x1152/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=fhzMzAm0 1920w,
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_2048x1229/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=rQCkwrSh 2048w,
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_3840x2304/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=VD7_Jvai 3840w"
sizes="(min-width: 1940px) 501px, (min-width: 1280px) calc(29.22vw - 60px), (min-width: 960px) calc(33.33vw - 76px), calc(33.13vw - 53px)">
  <source type="image/jpg" 
srcset="https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_256x154/public/2026-04/pexels-szafran-32028869.jpg?itok=z6eaPvTh 256w,
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_384x230/public/2026-04/pexels-szafran-32028869.jpg?itok=cTiVZoQS 384w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_690x414/public/2026-04/pexels-szafran-32028869.jpg?itok=tuQf6bTj 690w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_750x450/public/2026-04/pexels-szafran-32028869.jpg?itok=S1R2qZnN 750w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_828x497/public/2026-04/pexels-szafran-32028869.jpg?itok=FYkyOZlF 828w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_1080x648/public/2026-04/pexels-szafran-32028869.jpg?itok=O-lcvyzb 1080w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_1400x840/public/2026-04/pexels-szafran-32028869.jpg?itok=zp6U1OOz 1400w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_1920x1152/public/2026-04/pexels-szafran-32028869.jpg?itok=Ennm_aoY 1920w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_2048x1229/public/2026-04/pexels-szafran-32028869.jpg?itok=HVGzTVsG 2048w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_3840x2304/public/2026-04/pexels-szafran-32028869.jpg?itok=7jCS1LeC 3840w" 
 sizes="(min-width: 1940px) 501px, (min-width: 1280px) calc(29.22vw - 60px), (min-width: 960px) calc(33.33vw - 76px), calc(33.13vw - 53px)">
  <img alt="champ de céréales" src="https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_750x450/public/2026-04/pexels-szafran-32028869.jpg?itok=S1R2qZnN" 
  sizes="(min-width: 1940px) 501px, (min-width: 1280px) calc(29.22vw - 60px), (min-width: 960px) calc(33.33vw - 76px), calc(33.13vw - 53px)" loading="eager" fetchpriority="high" class="object-cover object-center size-full">
</picture>
```,
caption: "Un exemple de code avec la balise picture", supplement: [Annexe], kind: "annexe")<appendix-pictureTag>

#figure(
raw(read("assets/images.md", encoding: "utf8"), block:true, lang: "markdown"),
 caption: "Extrait de la documentation d'Antistatique sur les pratiques à adopter pour concernant les images", supplement: [Annexe], kind: "annexe"
)<appendix-antistatique-doc-images>


#bibliography("travail-bachelor.bib", style:"apa")
#pagebreak()

1.  Pour optmiser les performances et améliorer les SEO de ses clients, l'agence procède de plusieurs manières pour que l'image servie à l'utilisateur final soit la plus légère et dans un format accepté par son navigateur. Cette non-standardisation génère du travail supplémentaire, écrire de la documentation et adapter le workflow à chaque client/stack technologique. Antistatique n'a pas de moyen efficace pour valider que les formats générés sont réellement utilisés.

2.  Les solutions clés en main utilisées par l'agence la rend dépendante à des fournisseurs tiers. Ces fournisseurs facturent habituellement la bande passante et le nombre de requêtes traitées, ce qui rend les coûts d'hébergement difficiles à maîtriser. Bien qu'aujourd'hui les montants en jeu représentent quelques dizaines de francs par mois, avoir la totale maîtrise des coûts de la gestion des images peut être présenté comme un avantage concurentiel par Antistatique.



d'une part, les clients stockent leurs images avec leur hébergeur, soit plusieurs....? Aujourd'hui, l'agence gère les différentes tailles d'images comme suit : Des tailles fixes sont définies dans le code (3:2, 4:3, etc) ainsi que des formats (jpg, webp). Lorsqu'un client upload une image, un script s'exécute et génère les différentes tailles d'images. Ces images sont stockées chez l'hébergeur. Les développeurs front-end utilisent la balise Picture @HTMLPictureElement2026 avec dans l'ordre : 
1. Une image dans un format léger (avif ou webp) avec des règles CSS pour choisir la version

Le problème, c'est que c'est chiant d'écrire du code pour générer des tailels d'image. Et on sait pas quelles images sont vraiment utilisées au final, et lesquelles ne servent à rien. Il y a un script qui définit des ratios d'image présents dans la page et les différentes largeurs.

