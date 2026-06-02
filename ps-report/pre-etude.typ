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

== Nouvelle version

Antistatique est une agence lausannoise fondée en 2008. Son coeur d'activité repose sur de la stratégie marketing, du branding et des solutions web. Son bureau principal se situe actuellement à la route de Genève 90B à Lausanne. Elle réalise principalement des projets pour des organisations publiques et parapubliques, parfois pour des clients privés. Une part notable de ses clients sont des agences immobilières, pour lesquels elle réalise des sites web de présentation de biens immobiliers. Parmi les autres récents projets marquants, on trouve par exemple la refonte complète du site de la fédération romande des consommateurs, une campagne de communication pour le Lausanne Hockey Club féminin ou la création d'un design system pour l'université de Lausanne.

Pour réaliser ses projets, l'agence s'appuie sur une équipe de 4 designers et 6 développeurs. Les principales technologies de développement web utilisées sont Drupal, Wordpress, Symfony et Next.js. Elle se positionne en tant que spécialiste du développement sur mesure front-end et back-end. L'équipe produit une vingtaine de nouveaux projets par an, tout en assurant la maintenance et le développement continud'une cinquantaine de sites déjà en production. 

Le fait de travailler avec des clients très différents, avec des besoins et des contraintes techniques variées, génère de grandes variations dans les processus de développement. Ces variations rendent la standardisation d'un processus compliquée : chaque projet a ses propres spécificités, et les développeurs doivent souvent adapter leur approche en fonction de la stack technologique utilisée. Par exemple, la manière dont les images sont gérées et optimisées peut varier considérablement d'un projet à l'autre, ce qui rend difficile la mise en place de bonnes pratiques communes à tous les projets. Certains projets de sites statiques ont une approche très simple avec quelques dizaines d'images dans le code source, alors que d'autres projets comprennent plusieurs miliers d'images, de nombreuses variantes pour chacune et un ajout d'images quotidien par les clients.

L'objectif principal de ce travail sera de proposer à l'agence des pistes de solution pour standardiser la gestion des images au sein de son workflow de développement.


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

Aujourd'hui, Antistatique est capable de livrer des images optimisées (format et poids) aux utilisateur finaux de ses clients. Le processus pour y parvenir varie selon la stack technologique et repose sur des tâches répétitives et fastidieuses.

L'agence exprime un besoin de standardiser la gestion des images. Bien que le processus actuel soit satisfaisant pour les clients et utilisateurs finaux, ce n'est pas une solution satisfaisante pour les développeurs. Sur chaque projet, le développeur front-end et le backend doivent se mettre d'accord sur comment gérer la livraison d'images adaptées à l'utilisateur final. Antistatique souhaite que cette responsabilité soit déleguée à une brique logicielle tierce, indépendante de la technologie utilisée.

Malgré la séparation des responsabilités, l'agence a besoin que la solution choisie n'altère ni l'expérience de développement de ses employés, ni l'expérience de rédaction de ses clients. Autrement dit, quand un client upload une image, il doit pouvoir continuer à le faire de la même manière, sans devoir apprendre à utiliser un nouvel outil. De même, les développeurs doivent pouvoir continuer à utiliser les outils et les processus qu'ils utilisent aujourd'hui pour intégrer les images dans les pages web.

Concernant l'hébergement, Antistatique souhaite que la solution s'adapte à n'importe quel type d'hébergment. La majorité de ses clients utilise l'hébergement mutualisé d'Infomaniak; dans ce cas, les images se trouvent sur le serveur du site web (@appendix-infomaniak-web-hosting), mais la solution doit pouvoir s'adapter en fonction d'où les images se trouvent.

Actuellement, la documentation d'Antistatique à propos de la gestion des images précise qu'il est nécessaire d'utiliser la balise picture (voir @appendix-antistatique-doc-images), mais ne contient pas d'information sur comment les différentes images qui seront appelées par cette balise doivent être créées. Ce vide documentaire laisse chaque développeur libre de définir sa propre approche, ce qui rend les pratiques difficiles à auditer, à faire évoluer ou à transférer d'un projet à l'autre.


Dans ce contexte, les compétences de l'ingénieur de médias sont utiles pour proposer une solution technique adaptée aux besoins de l'entreprise, puisqu'il comprend les enjeux techniques, mais aussi les aspects liés à l'expérience développeur/rédacteur. Il s'agira aussi d'accompagner le changement et l'adoption de cette solution par les équipes de développement.
#pagebreak()
== Nouvelle version
Aujourd'hui, Antistatique est capable de livrer des images optimisées à ses utilisateurs finaux. Cependant, le processus pour y parvenir varie selon la stack technologique et repose sur des tâches répétitives. 

Actuellement, lorsqu'une image est téléversée, elle est généralement stockée localement sur le serveur hébergeant le site. Ce fonctionnement couple l'optimisation et la livraison à la plateforme utilisée. La responsabilité de la transformation des images incombe au CMS (ou au framework). Par conséquent, les formats générés (comme WebP ou AVIF) dépendent directement des capacités natives de l'outil, des plugins installés et des librairies sous-jacentes du serveur (ex: ImageMagick). Cela crée une forte hétérogénéité technique d'un projet à l'autre.

À titre d'exemple, le flux de travail d'un développeur varie radicalement selon le projet. Sur un projet WordPress, il devra configurer des plugins spécifiques (comme WebP Express) ou écrire des fonctions PHP pour forcer la génération des différents formats au moment du téléversement. À l'inverse, sur un projet basé sur Next.js, il devra utiliser le composant natif #raw(str("<Image/>"),lang:"html") qui délègue l'optimisation à la volée au serveur Node.js. Ces paradigmes opposés empêchent toute mutualisation des connaissances.

Puisque la technologie diffère selon les mandats, il est impossible de définir une méthode unique pour traiter ces médias. Cette absence de standardisation se ressent dans la documentation interne de l'agence. Celle-ci suppose l'utilisation de la balise HTML #raw(str("<picture>"),lang:"html") (voir @appendix-antistatique-doc-images), mais n'explique pas comment générer les différentes sources appelées. Ce vide documentaire laisse les développeurs libres de définir leur propre approche, ce qui rend les pratiques difficiles à auditer, à maintenir ou à transférer d'un projet à l'autre.


Dans le but de standardiser ce processus, Antistatique souhaite découpler la gestion des images de la technologie utilisée. L'objectif est de déléguer l'optimisation et la livraison à une brique logicielle tierce. Ainsi, le stockage serait séparé du traitement : le CMS ou le framework devrait simplement fournir l'URL de l'image source, et le service tiers se chargerait de la transformer et de la distribuer de manière optimisée.


== Recherches


Les recherches menées permettent de comprendre pourquoi Antistatique essaie de régler ce problème et d'amener des pistes de solutions.

La documentation de MDN sur les formats d'image avance que plus de 51% de la bande passante utilisée pour le web est consacrée au téléchargement d'images @MultimediaImagesLearn2026. L'intérêt pour les entreprises de réduire la taille des images est donc évident, que ce soit pour réduire les coûts d'hébergement ou pour améliorer les performances de leurs sites web. De plus, les moteurs de recherche prennent en compte la performance d'un site web dans leur algorithme de référencement, ce qui rend l'optimisation des images importante pour le SEO @BonnesPratiquesSEO.  Le support universel de la balise <picture> par les navigateurs depuis 2016 confirme l'importance d'une gestion adaptative des médias @HTMLPictureElement2026.

// La manière dont Antistatique résoud le problème de l'optimisation des images aujourd'hui est très manuelle et 

Pourtant, le processus actuel d'Antistatique souffre d'un couplage fort @CouplingCohesionSoftware : la transformation et la distribution des images dépendent intrinsèquement de la technologie choisie pour chaque projet (WordPress, Drupal, etc.). Découpler la gestion des images de la stack technique offrirait à l'agence une meilleure flexibilité face aux évolutions technologiques @ganapathyDiscoverBenefitsDecoupled2023. Liip, l'une des grandes agences web suisse, a lancé un service (Rokka) pour répondre à ce besoin et découpler la gestion des images de la technologie utilisée @switzerlandRokkaWebImages. Cela prouve qu'il existe une demande concrète pour ce type de service au sein du marché des agences web suisses.


Enfin, bien que le temps de configuration de ces outils par projet semble faible (1h pour intégrer le module dans Drupal selon un développeur), cette approche génère une dette technique. Dans l'ingénierie logicielle, ce type de configuration manuelle répétitive s'apparente au Toil,  @GoogleSREWhat comme une tâche sans valeur ajoutée durable. Avant de pouvoir automatiser un processus, il faut d'abord le standardiser @davenportProcessInnovationReengineering20xx. Définir une méthode unique pour toute l'agence permettrait de garantir une qualité d'image constante sur tous les sites, tout en évitant que la configuration ne dépende des habitudes techniques de chaque développeur.



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




== Objectifs et livrables

Ce projet se structure autour de trois objectifs majeurs. 
=== Analyses
Dans un premier temps, une phase d'analyse  permettra d'évaluer et de comparer les différentes stratégies centralisées de livraison de médias (solutions SaaS, optimisation via Edge CDN ou proxy auto-hébergé). Cette comparaison s'appuiera sur des critères stricts de coût, de performance et d'indépendance technologique. La procédure de tests ainsi que les résultats obtenus font parties des livrables qui seront rendus à l'issue du travail de bachelor. L'élaboration et la réalisation de ces tests est estimée à une durée de 3 semaines. Un site avec des images lourdes non compressées a déjà été mis en place pour servir de terrain de test.
=== Preuve de concept
Dans un second temps, le projet visera à déployer une preuve de concept (PoC) de la solution retenue, afin de valider sa capacité technique à traiter et distribuer des images à la volée sur un projet réel de l'agence. Le livrable associé comprendra le code source de la preuve de concept ainsi que la documentation de son déploiement, de manière à permettre à l'agence de la répliquer sur d'autres projets. Cette phase est estimée à une durée de 4 semaines, en incluant le temps nécessaire pour intégrer la solution dans un projet existant.
=== Connecteurs
Pour assurer l'utilisabilité de cette architecture, le dernier objectif consistera à développer des connecteurs légers (composants ou helpers) pour les stacks principales de l'agence, telles que Drupal et Next.js. Ces connecteurs auront pour but d'interfacer les CMS avec le service de traitement d'images de façon transparente, limitant ainsi la dette technique tout en centralisant la maintenance. Le code de ces différents connecteurs et la documentation associé font partie des livrables de cette dernière phase, estimée à une durée de 2 semaines. Le but est de se limiter à Drupal et Next.js, mais il est envisagable d'ajouter d'autres connecteurs si le temps le temps le permet.

=== Académique 
Sur le plan académique le rapport du travail de Bachelor sera le livrable principal, accompagné du résumé publiable, du poster académique, des posters teaser (A4 et A0) et du post linkedin prêt à l'emploi.

Une planification plus détaillé se trouve en annexe. @appendix-planning


== Valeur ajoutée pour le mandant
Pour Antistatique, ce projet représente une opportunnité de standardiser un processus technique essentiel. Cette standardisation permet de préparer la gestion des images à moyen terme. Si un nouveau format d'image plus performant émerge, il sera très facile de l'intégrer à la solution centralisée, sans nécessiter une refonte sur chaque projet. 

Dans le cas où un client a déjà beaucoup de contenu avec de nombreuses images mal optimisées, la solution pourrait permettre de livrer des images d'une qualité similaire mais d'un poids moindre. Cela peut être un argument de vente pour convaincre un client de faire appel à Antistatique pour la refonte de son service web, en lui proposant une amélioration des performances et du SEO grâce à une meilleure gestion des images.

Réaliser une analyse comparative des solutions du marché permettra à l'agence de choisir en se basant sur des critères objectifs et mesurables, plutôt que sur des considérations subjectives ou des recommandations de fournisseurs. 



== Compétences mobilisées

Pour mener ce projet à son terme, différentes compétences de l'ingénieur des médias sont nécessaires. Les compétences techniques sont centrales, notamment en ce qui concerne les technologies web, l'architecture logicielle et le développement d'application. Une compréhension fine du fonctionnement des différentes stacks technologiques, notamment les architectures découplées, est essentielle pour comprendre comme intégrer la solution de manière transparente pour les développeurs et les clients. 

Les compétences acquises en optimisation SEO sont aussi mobilisées pour comprendre les enjeux liés à la performance des sites web (Core Web Vitals) et à l'optimisation des images. Un enjeu d'écoconception peut également être identifié dans le cas d'un nouveau client qui ne sert pas du tout d'images optimisées à ses utilisateurs. 

Pour que la solution proposée soit adpotée par les équipes de développement, il est nécessaire de faire un produit qui tient compte de l'expérience développeur (DX). Les compétences en UX design sont donc mobilisées pour comprendre les besoins et les contraintes des développeurs, et pour concevoir une solution qui s'intègre de manière fluide dans leur workflow.

Les compétences en gestion de projet et du changement sont importantes pour accompagner l'adoption de la solution par les équipes de développement de l'agence.






== Risques



=== Matrice des risques

#figure(
  align(center)[
    #table(
      columns: (1fr, 1.2fr, 1.2fr, 1.2fr),
      stroke: 0.5pt + black,
      fill: (col, row) => {
        if row == 0 or col == 0 { rgb("#e6e6e6") }
        else {
          let impact = col - 1
          let probability = row - 1
          let score = (probability + 1) * (impact + 1)
          if score <= 2 { rgb("#d4edda") }
          else if score <= 4 { rgb("#fff3cd") }
          else if score <= 6 { rgb("#f8d7da") }
          else { rgb("#d63031") }
        }
      },
      
      // En-têtes
      align: center + horizon,
      text(weight: "bold", size: 10pt)[Probabilité ➡️  \ Impact ⬇️ ],
      text(weight: "bold", size: 10pt)[Faible (1)],
      text(weight: "bold", size: 10pt)[Moyen (2)],
      text(weight: "bold", size: 10pt)[Élevé (3)],
      
      // Ligne Faible
      text(weight: "bold", size: 10pt)[Faible],
      text(size: 9pt, )[],
      text(size: 9pt, )[- Les développeurs sont très occupés et n'ont pas le temps de valider la bonne DX de la solution (1)],
      text(size: 9pt, )[- La solution fonctionne sur un site avec peu d'images, mais sur un vrai site client en production, elle ne tient pas la charge et rend le site lent (2)],
      
      // Ligne Moyen
      text(weight: "bold", size: 10pt)[Moyen],
      text(size: 9pt, )[],
      text(size: 9pt, )[- La solution issue du benchmark n'est pas compatible avec les soltions d'hébergement utilisées par les clients de l'agence (3)],
      text(size: 9pt, )[],
      
      // Ligne Élevé
      text(weight: "bold", size: 10pt)[Élevé],
      text(size: 9pt, )[- L'agence n'est pas capable de fournir des données représentatives sur les statistiques de trafic, ce qui mène à des tests torp éloignés de la réalité (4)
      - Un problème de sécurité majeur est découvert sur la solution choisie (5)
      - Les bonnes pratiques de sécurité ne sont pas suivies, ce qui  rend le service de redimensionnement des images exposés à tout le monde sur le web (6)],
      text(size: 9pt, )[],
      text(size: 9pt, )[],
    )
  ],
  kind: "figure",
  supplement: [Figure],
  caption: [Matrice des risques (Probabilité × Impact)]
)

#v(1.5em)


=== Mitigation des risques

#figure(
  table(
  columns: (1.5fr, 0.5fr, 2fr),
  stroke: 0.5pt + black,
  fill: (col, row) => if row == 0 { rgb("#e6e6e6") } else { none },
  align: (left, center, center, center, left),
  inset: 8pt,
  
  // En-têtes
  text(weight: "bold")[Risque],
  text(weight: "bold")[Score],
  text(weight: "bold")[Plan d'atténuation],
  
  // À compléter avec les risques du projet

  [Développeurs occupés (1)],
  [2\ Faible],
  [Planifier les demandes de retour longtemps à l'avance. Itérer souvent, pour avoir des petits retours et rester dans la bonne direction],
  
  [Staging vs Production (2)],
  [3\ Modéré],
  [Utiliser une copie d'un environnment de production pour les tests de charge. Ev. travailler sur un vrai projet que l'agence réalise actuellement.],
  
  [Intégration impossible (3)],
  [4\ Modéré],
  [Choisir une autre solution du benchmark, compatible avec les hébergements utilisés par les clients de l'agence],
  
  [Donnes de trafic inexactes(4)],
  [3\ Modéré],
  [Analyser un maximum de données disponibles, ne pas se contenter d'extrapoler à partir de données d'un seul site ],
  
  [Problème de sécurité majeur (5)],
  [3\ Modéré],
  [Changer de solution ou prendre une ancienne version stable],
  
  [Mauvaise configuration de la sécurité (6)],
  [3\ Modéré],
  [Protéger le service avec une URL signée],
  ),
  kind: "figure",  supplement: [Figure],
  caption: [Tableau de mitigation des risques]

)

#pagebreak()

== Conclusion

Lors de cette phase de pré-étude, j'ai compris comment une agence web utilise les compétences que j'ai accquises durant la formation au quotidien, pour réaliser des projets. J'ai par exemple découvert qu'il était possible d'utiliser Wordpress comme CMS Headless et de générer un site avec une autre technologie, par exemple Next.js. J'ai appris qu'arriver sur une base de code existante et comprendre comment tout fonctionne, quelle entité est responsable de quoi, sur un outil que je ne connais pas (Drupal) est un défi en soi, qui demande de la patience et de la curiosité. J'ai aussi compris que les enjeux techniques ne sont pas les seuls à prendre en compte dans un projet, et que l'expérience développeur est un aspect important à considérer pour que la solution soit adoptée par les équipes de développement.

J'ai souvent été confronté à une situation dans laquelle je devais arbitrer un choix, je n'arrivais pas à trouver des arguments pertinents. J'ai donc voulu tester les différentes options pour avoir une base comparative, mais je me suis rendu compte que cela faisait plutôt partie de la réalisation du travail que de la pré-étude, en raison du temps à disposition. Les informations sur le contexte m'ont parfois manquées, mais j'ai pu compter sur Antistatique pour mes les fournir et mieux comprendre les outils et la marge manoeuvre à disposition. 

L'une des limites de cette pré-étude est que le problème que j'essaie de résoudre n'est pas critique pour l'entreprise aujourd'hui. Étant novice dans le domaine, comprendre le problème et ce qui doit être résolu n'a pas été simple. Le problème est étendu et se retrouve en quelques minutes dans les quotidien des développeurs. Cela implique que les gains apportés par la solution ne seront pas forcément perceptible pour eux, ni pour les utilisateur finaux. Mon travail consiste plus à anticiper l'avenir et s'inscrire dans une démarche d'amélioration continue que dans la résolution d'un problème aigu.


À titre personnel, j'ai découvert le monde du web en entreprise et j'ai apprécié être inclus dans le day-to-day de l'agence, participer aux réunions d'équipe et aux discussions techniques. J'ai apprécié la liberté qui m'a été donnée par l'agence et la confiance qu'ils m'ont témoignée pour mener à bien ce projet. J'en étais convaincu, mais j'ai vu la force des  profils pluridisciplinaires des ingénieurs des médias; mis à part mon manque d'expérience, j'ai toujours été à même de comprendre les enjeux de telle ou telle solution technique, son impact sur le SEO des clients et l'intérêt que cela représente pour l'agence.


Je me réjouis de passer à la partie de l'implémentation et d'expérimenter les différentes pistes de solutions identifiées lors de la phase d'analyse. Cela me permettra d'avancer de de manière plus concrète. Et je me réjouis aussi de pouvoir répondre à la question "pourquoi as-tu fait ce choix ?" avec des vrais chiffres de performance, de coût et d'expérience développeur.




#pagebreak()

#outline(target: figure.where(kind: "annexe"), title: [Annexes])

#show: appendix
 #figure(
  raw(read("assets/system-prompt.md", encoding: "utf8"), block:true, lang: "markdown"),
  caption: "System prompt utilisé pour les interactions avec Mammouth AI", supplement: [Annexe], kind: "annexe")<appendix-mammouth-system-prompt>


#figure(
  image("assets/infomaniak-web-hosting.png", width: 12cm),
  caption: "Capture d'écran d'Infomaniak sur l'hébergement web mutualisé", supplement: [Annexe], kind: "annexe")<appendix-infomaniak-web-hosting>



#figure(
raw(read("assets/images.md", encoding: "utf8"), block:true, lang: "markdown"),
 caption: "Extrait de la documentation d'Antistatique sur les pratiques à adopter pour concernant les images", supplement: [Annexe], kind: "annexe"
)<appendix-antistatique-doc-images>

#figure(
image("assets/planning.pdf"),
 caption: "Planning détaillé du projet", supplement: [Annexe], kind: "annexe"
)<appendix-planning>




#bibliography("travail-bachelor.bib", style:"apa")


