// !set document root: ../main.typ

#set text(
  lang: "fr"
)
= Benchmark


== Cadre initial
=== Besoins et matrice MoSCoW
Afin de choisir un service qui répond au besoin d'Antistatique, 3 formats de solutions ont été envisagés :
1. Un service SaaS
2. Un service edge
3. Un service auto-hébergé (self-hosted)

Ces différentes solutions amènement différents avantages, expliqués dans le tableau ci-dessous (@avantages-inconvenients).

#figure(
  table(columns: 3, 
  [Type de solution],[Avantage], [Inconvénient] , 
  [SaaS],[- Simplicité de mise en place
  - SDK existants],[ - Dépendance forte à un service externe
  - Coût élevé],
  [Edge],[Faible latence grâce à l'exécution sur des noeuds proches de l'utilisateur final],[ - Dépendance forte à un service externe
  - Besoin d'un accès important à l'hébergement du client],
  [Self-host],[
    - Contrôle total sur le service
    - Coût faible
    - Indépendance complète],[ - Complexité de mise en place
  - Maintenance du service], 
  align: (center,left, left),
  ),
  caption: [Avantages et inconvénients des différentes solutions envisagées],

  kind: table,
) <avantages-inconvenients>

Les trois architectures retenues — SaaS, Edge CDN, self-hosted — ont été sélectionnées car *aucune ne présente de limitation incompatible* avec les besoins d'Antistatique. La comparaison porte donc sur des critères de compromis (coûts, indépendance, maintenabilité) plutôt que sur une élimination préalable.


=== Matrice MoSCoW et KPI initiaux
Pour comparer les avantages et les inconvénients de chaque service, une matrice MoSCoW reprenant les besoins d'Antistatique a été créée. Des indicateurs de performance clé (KPI) ont été définis pour chaque besoin. (@moscow-matrix-v1). Suite à la définition de ces KPI, le but du benchmark était d'attribuer une valeur à chaque indicateur pour chaque service, de sorte à pouvoir comparer les services sur la base de critères objectifs.



#let table-header(text) = {
  strong(text)
}

#let priority-cell(label) = {
  let color = if label == "Must have" {
    (red.lighten(40%), red.darken(20%))
  } else if label == "Should have" {
    (orange.lighten(50%), orange.darken(10%))
  } else if label == "Could have" {
    (yellow.lighten(40%), orange.darken(30%))
  } else {
    (green.lighten(50%), green.darken(20%))
  }
  
  rect(
    fill: color.at(0),
    radius: 4pt,
    text(fill: color.at(1), weight: "medium", size: 9pt)[#label]
  )
}


#set text(size: 10pt)


#let kpi-style(cell) = {
  text(size: 8pt)[#cell] 
}
#figure(

table(
  columns: (auto,  1fr, 1fr, 1fr, auto),
  inset: 6pt,
  align: (left,  horizon, horizon, horizon, center),
  
  // Header row
  table-header([Nom]),
  table-header([KPI 1]),
  table-header([KPI 2]),
  table-header([KPI 3]),
  table-header([Priorité]),
  
  // Row 1: Interopérabilité
  [Interopérabilité avec les stacks existantes et futures],
  kpi-style[Nombre de dépendances requises (nombre)],
  kpi-style[Type d'intégration: standard (url http) / propriétaire (SDK)],
  [],
  priority-cell("Must have"),
  
  // Row 2: Standardisation
  [Standardisation de la logique d'optimisation],
  kpi-style[Possibilité de modifier les paramètres d'image globalement (sans code source)],
  kpi-style[Distribution adaptative du format],
  [],
  priority-cell("Must have"),
  
  // Row 3: Maîtrise du déploiement
  [Maîtrise du déploiement et des coûts],
  kpi-style[TCO (CHF/an): coût fixe + variable],
  kpi-style[Niveau de gestion Antistatique (1–4)],
  [],
  priority-cell("Must have"),
  
  // Row 4: Disponibilité
  [Disponibilité et robustesse],
  kpi-style[SLA (%) — données fournisseur],
  kpi-style[Présence d'un mécanisme de fallback (oui/non)],
  [],
  priority-cell("Must have"),

    
  // Row 5: Temps de chargement
  [Garantie des temps de chargement optimisés],
  kpi-style[TTFB (cache hit) — ms],
  kpi-style[TTFB (cache miss) — ms],
  kpi-style[Ratio de compression (%)],
  priority-cell("Should have"),

  
  // Row 6: Faible charge d'intégration
  [Faible charge d'intégration pour les développeurs],
  kpi-style[Friction d'intégration (1–4)],
  [],
  [],
  priority-cell("Could have"),
  
  // Row 7: Réversibilité
  [Réversibilité pour les sites clients],
  [],
  [],
  [],
  priority-cell("Could have"),
),
  caption: [Matrice MoSCoW, 1ère version],
  kind: table,
) <moscow-matrix-v1>

=== Choix des solutions
Une fois que les architectures à tester ont été définies, il a été nécessaire de sélectionner les services à tester pour chaque type de solution. Pour sélectionner un service, 3 critères ont été pris en compte :
1. L'existence d'un plan gratuit, pour pouvoir tester le service sans engager de frais
2. Le fonctionnement du service, avec des paramètres dans l'URL pour répondre au prérequis d'agnosticité avancé dans la pré-étude
3. La maturité de la documentation et l'adoption par la communauté (DX) pour une mise en place rapide respectant le temps prévu par le planning (3 semaines)

Plutôt que de comparer exhaustivement tous les acteurs d'une même catégorie (comme Imgix, Uploadcare Image CDN et Cloudinary pour le SaaS), un seul service représentatif répondant à ces 3 critères a été sélectionné pour chaque architecture. *Cloudinary* a été sélectionné pour le SaaS, *Cloudflare Images* pour l'edge et *Imgproxy* pour le self-host. Ce choix est justfié par leur position dominante sur le marché : Cloudinary est l'un des leaders de ce marché @datainteloImageOptimizationSoftware, tandis que Cloudflare absorbe plus de la moitié (58%) des des requêtes HTTP à travers le monde. @figure-top-cdns-html. 
#figure(
  image("../assets/figures/top-cdns-html.png"),
  caption:[Top CDN pour le HTML en 2025, @viggiano2025WebAlmanac2026]
  )<figure-top-cdns-html>


Concernant le choix d'imgproxy comme solution auto-hébergée, il est expliqué par sa popularité, sa communauté active (10K stars sur GitHub) et ses mises à jour fréquentes. Une mise à jour majeure est sortie au début du mois de mai 2026, preuve de la vitalité du projet. Aussi, imgproxy repose sur un modèle "Open Core", ce qui signifie que la plupart des fonctionnalités sont disponibles gratuitement, mais que certaines fonctionnalités avancées sont payantes. Cela permet de tester le service sans frais, tout en ayant la possibilité d'accéder à des fonctionnalités avancées si nécessaire. Cela permet aussi de garantir une viabilité économique à l'entreprise derrière le projet, ce qui est un gage de pérennité pour le service. À l'origine, le service a été développé par Evil Martians une société qui crée des outils pour les développeurs. Puis, une société dédiée uniquement à ce service a été créée @ImgproxyGoesSolo2023, grâce au succès important. Cette transition vers une entreprise spécialisée indique une viabilité économique suffisante pour assurer la continuité du service.
 
 Pour le cas concerné, seules les fonctionnalités de base sont nécessaires: Redimensionnement, optimisation de format, et modification de la qualité. Toutes ces fonctionnalités sont disponibles gratuitement. @ImgproxyDocumentation




=== Procédure de test

La procédure de test a été divisée en 2 parties: Une partie technique, pour tester les performances des services et une seconde partie pour tester le critère "charge d'intégration" et "maîtrise du déploiement et des coûts". Le but était de créer une procédure de test reproductible. La marche à suivre se trouve en annexe (@annexe-test-procedure). 

Pour avoir des images à tester, une instance de WordPress a été déployée sur l'hébergement mutualisé d'infomaniak. Il s'agissait surtout de profiter d'un serveur web ("inclus" dans une instance de WordPress) pour servir les images de test. Toutes les extensions de base Wordpress ont été déasctivées, pour se mettre dans la situation la plus facile à reproduire. Les images ont été ajoutées en FTP pour éviter que Wordpress n'applique son redimensionnement de base @Big_image_size_thresholdHookDeveloperWordPressorg2020 .  12 images ont été utilsées pour les tests. Le détail des poids et des formats se trouve en annexe (@taille-images-benchmark), mais le but était d'avoir un échantillon représentatif des contenus téléchargés par les clients d'Antistatique

La partie technique a été réalisée en utilisant un script bash et l'outil curl (@test-script-procedure) qui envoie des requêtes HTTP aux différentes URL à tester. Le script mesure le temps de réponse et la taille de l'image retournée. Il a été lancé 4 fois, depuis 4 endroits différents : un ordinateur portable à Lausanne, un petit serveur d'infomaniak à Genève, un petit serveur Digital Ocean à New York et un petit serveur Digital Ocean à Singapour. Le but en lançant le script depuis différents endroits était de mesurer l'impact de la localisation géographique sur les performances des services. Les résultats ont été enregistrés dans un fichier CSV pour être analysés par la suite. Pour avoir des valeurs représentatives, le script est lancé 11 fois pour chaque image: la première exécution sert à mesurer l'efficacité du service de redimensionnement et d'optimisation, tandis que les 10 exécutions suivantes servent à mesurer la performance du service de cache. Le but est de voir si le service est capable de mettre en cache les images redimensionnées et optimisées pour les servir plus rapidement lors des requêtes suivantes.

Concernant les formats testés, le choix a été fait de laisser les services dans leur mode "par défaut" (en précisant par exemple "format=auto") afin de voir quel format serait choisi pour chaque image. Le but était de valider le fait que les services choisissent le format le plus approprié pour chaque image. 

Le choix de l'outil curl pour réaliser ce test de performance se base sur deux raisons principales; premièrement, il s'agit d'un outil très répandu (>20 miliards d'installations @UsersCurlEverything) , très probablement installé sur les machines de test et peu gourmand en ressources. Deuxièmement, il permet de mesurer le temps de réponse d'une requête HTTP et la taille de la réponse @WriteOutEverything, ce qui est exactement ce qui est nécessaire pour ce benchmark.


En ce qui concerne les critères "charge d'intégration/DX" et "maîtrise du déploiement et des coûts",..


La partie plus théorique a été réalisée en lisant la documentation de chaque service et en analysant comment les services fonctionnent. Le but était de voir si la documentation était claire et si l'intégration était facile à réaliser. (WTF qu veut dire cett phr'ase?)


=== Méthode de calcul

Afin de pouvoir comparer les architectures entre elles, il est nécessaire de pouvoir comparer chaque point sur une échelle identique. Le choix de l'échelle a été fait de 1 à 10, où 10 est la meilleure note. Pour convertir les différentes valeurs de KPI en une note sur 10, chaque indicateur a été normalisé, au cas par cas selon le KPI. Cette normalisation se trouve en annexe (@annexe-normalisation-kpi).

Le coût total de propriété (Total Cost of Ownership, TCO) a été calculé en prenant le projet sur lequel la solution choisie allait être implémentée. Il s'agit du site luxury-tribune.com, qui est composé d'un Wordpress Headless, consommé par un frontend en Next.js. 

Pour estimer le nombre d'images contenues dans le site sans accès direct au serveur, l'analyse s'est basée sur l'API et le code source. L'API REST de WordPress recense 10 962 médias originaux. Du côté du code, le thème désactive les formats natifs du CMS pour imposer cinq recadrages sur mesure. L'ajout d'une image entraîne donc la création de six fichiers physiques (l'original et ses cinq déclinaisons), et porte le total stocké sur le serveur à près de 65 772 fichiers.

Pour évaluer les données obtenues de manière cohérente, une note a été attribuée à chaque service pour chaque KPI, en fonction du résultat obtenu. Cette note est comprise en 1 et 10 (10 est la meilleure note)




== Exécution des tests
=== Test de la solution Cloudinary
=== Test de la solution Cloudflare images
=== Test de la solution Imgproxy

=== Qualité des images redimensionnées
== Analyse des résultats et révision du modèle

=== Analyse des résultats bruts

=== Révision du modèle

Lors de cette analyse, il est apparu que les KPI définis plus tôt n'étaient pas toujours pertinents pour évaluer l'agnosticité ou comparer les services entre eux. Le cas où toutes les solutions obtiennent le même résultat à un KPI est aussi apparu, ce qui le rend inutile pour décider du choix d'une solution. La première version des KPI avait le but de comparer des *services*, mais le but de ce benchmark est de comparer des *architectures* et d'identifier la plus adaptée pour Antistatique.

Le modèle besoin/KPI associé s'est donc révélé inadapté tel quel : une partie des besoins relève de propriétés d'architecture non quantifiables, qu'aucun indicateur chiffré ne peut traduire fidèlement. Certains besoins sont également indispensables et élimineraient une solution d'office s'ils n'étaient pas respectés. La modèle a donc été révisé comme suit (@criteres-evaluation)

/* L'évaluation distingue donc 
Il a donc été décidé de redéfinir des KPIs, plus pertinents et plus adaptés à la comparaison des architectures (@moscow-matrix-v2) et d'utiliser les 3 services precédemment cités pour pouvoir comparer.
 */


#figure(
  table(
    columns: (1fr, 1fr, 1fr, 1fr, 1fr),
    inset: 6pt,
    align: (center+ horizon),

    // Header row
    table-header([Nom]),
    table-header([Catégorie]),
    table-header([KPI 1]),
    table-header([KPI 2]),
    table-header([KPI 3]),

    // Row 1: Périmètre
    [Centralisation de la logique d'optimisation],
    [Périmètre],
    table.cell(colspan: 3)[N/A],

    // Row 2: Prérequis
    [Agnosticité (indépendance vis-à-vis de la stack)],
    [Prérequis],
    table.cell(colspan: 3)[N/A],

    // Row 3: Critère 1
    [Performance],
    [Critère de choix],
    [*TTFB (cas du cache MISS)*[ms]], [*TTFB (cas du cache HIT)*[ms]], [*Ratio de compression* [%]],

    // Row 4: Critère 2
    [Maîtrise du déploiement et des coûts],
    [Critère de choix],
    [*TCO (coût total de propriété)*[CHF/an]], [*Niveau de gestion nécessaire de la part d’Antistatique* [1-4]], [],

    // Row 5: Critère 3
    [Charge d'intégration / DX],
    [Critère de choix],
    [*Friction d’intégration* [1-4]], [*Qualité de la documentation et de l'expérience développeur* [1-6]], [],

    // Row 6: Contrainte / Implémentation
    [Fiabilité, robustesse (Fallback)],
    [Contrainte d'implémentation],
 table.cell(colspan: 3)[N/A],

    [Réversibilité (Fallback)],
    [Contrainte d'implémentation],
 table.cell(colspan: 3)[N/A],

  ),
  caption: [Répartition des besoins d'Antistatique],
  kind: table,
) <criteres-evaluation>

Concernant le besoin de centraliser la logique, il représente le but originel de ce travail, à savoir se séparer d'un modèle ou chaque projet réimplémente ses règles d'optimisation d'images. Il définit donc le cadre dans lequel les différentes architectures sont comparées, en étant le socle commun à chaque architecture. 

Le besoin d'agnosticité est un prérequis indispensable pour qu'une architecture soit évaluable dans ce benchmark. Il n'est pas envisageable pour Antistatique de s'enfermer dans un écosystème propriétaire, pour des raisons de flexibilité et d'indépendance. Il est donc nécessaire que l'architecture choisie soit agnostique vis-à-vis de la stack utilisée par les clients d'Antistatique.

Les besoins de performance, de maîtrise du déploiement et des coûts et de la charge d'intégration, sont eux des critères mesurables pour chaque type de solution. Ils permettent de comparer les architectures entre elles et de choisir la plus adaptée pour l'agence.

Les différents niveaux des critères "Niveau de gestion nécessaire de la part d’Antistatique","Friction d’intégration" et "Qualité de la documentation et de l'expérience développeur" sont détaillés dans le tableau ci-dessous. (@details-criteres-evaluation)

#figure(
  table(

    columns: (1.5fr, auto, 3.5fr),
    align: (col, row) => (
      if col == 1 { center + horizon }
      else { left + horizon }
    ),
    stroke: 0.5pt + luma(150),
    fill: (col, row) => if row == 0 { luma(240) } else { none },
    
    // En-tête du tableau
    [*KPI*], [*Score*], [*Correspondance / Critère d'évaluation*],
    
    // 1. Niveau de gestion
    table.cell(rowspan: 4)[
      *Niveau de gestion nécessaire* \
      (de la part d'Antistatique)
    ],
    [1], [Maintenance complète (OS, Docker, failles de sécurité, monitoring des ressources CPU/RAM).],
    [2], [Maintenance d'infrastructure Serverless/Edge (mise à jour des workers, gestion des limites de requêtes).],
    [3], [Maintenance applicative légère (mises à jour de dépendances NPM/Composer pour les connecteurs).],
    [4], [Entièrement géré (SaaS pur, aucune action technique requise post-déploiement).],
    
    // 2. Friction d'intégration
    table.cell(rowspan: 4)[
      *Friction d'intégration*
    ],
    [1], [Couplage d'infrastructure requis (CNAME, reverse proxy dédié, configuration Edge complexe qui sort du code).],
    [2], [Dépendance logicielle forte (SDK lourd, couplage au framework, vendor lock-in potentiel au niveau du code).],
    [3], [Dépendance logicielle légère (variable d'environnement, helper générique, petit SDK agnostique).],
    [4], [Standards web purs (URL rewriting, attributs HTML natifs). Zéro dépendance, réversibilité totale.],

    
    // 3. Qualité de la doc / DX
    table.cell(rowspan: 5)[
      *Qualité de la documentation et de l'expérience développeur (DX)*
    ],
    [1--2], [Documentation absente ou de très mauvaise qualité.],
    [3], [Documentation lacunaire, exemples rares, peu de support.],
    [4], [Documentation acceptable, exemples partiels, support inégal.],
    [5], [Documentation complète et claire, quelques exemples, communauté présente.],
    [6], [Documentation exhaustive, exemples de code, tutoriels étape par étape, support actif.]

  ),
  caption: [Détails des échelles de notation pour les critères de choix],
  kind: table,
) <details-criteres-evaluation>

Enfin, il a été décidé que le point sur les besoins de fiabilité et de réversibilité seraient traités grâce à un fallback vers l'image originale. Ces points ne sont donc pas des critères de choix (aucune architecure n'empêche ce fonctionnement) mais des contraintes d'implémentation qui devront être respectées lors de l'intégration.


== Décision finale


