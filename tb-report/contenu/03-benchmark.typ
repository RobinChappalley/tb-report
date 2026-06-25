// !set document root: ../main.typ

#set text(
  lang: "fr"
)
= Benchmark
Afin de choisir un service qui répond au besoin d'Antistatique, 3 formats de solutions ont été envisagés :
1. Un service SaaS
2. Un service edge
3. Un service self-host

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

== Choix des solutions
Une fois que les types de solutions à tester ont été définis, il a été nécessaire de sélectionner les services à tester pour chaque type de solution. Pour sélectionner un service, plusieurs critères ont été pris en compte, notamment :
1. L'existence d'un plan gratuit, pour pouvoir tester le service sans engager de frais
2. Le fonctionnement du service, avec des paramètres dans l'URL pour répondre au critère d'agnosticité avancé dans la pré-étude
3. La maturité de la documentation et l'adoption par la communauté (DX) pour une mise en place rapide respectant le temps prévu par le planning (3 semaines)

Plutôt que de comparer exhaustivement tous les acteurs d'une même catégorie (comme Imgix, Uploadcare Image CDN et Cloudinary pour le SaaS), un seul service représentatif répondant à ces 3 critères a été sélectionné pour chaque architecture. *Cloudinary* a été sélectionné pour le SaaS, *Cloudflare Images* pour l'edge et *Imgproxy* pour le self-host. Ce choix est justfié par leur position dominante sur le marché : Cloudinary est l'un des leaders de ce marché @datainteloImageOptimizationSoftware, tandis que Cloudflare absorbe plus de la moitié (58%) des des requêtes HTTP à travers le monde. @figure-top-cdns-html. 
#figure(
  image("../assets/figures/top-cdns-html.png"),
  caption:[Top CDN pour le HTML en 2025, @viggiano2025WebAlmanac2026]
  )<figure-top-cdns-html>


Concernant le choix d'imgproxy comme solution auto-hébergée, il est expliqué par sa popularité, sa communauté active (10K stars sur GitHub) et ses mises à jour fréquentes. Une mise à jour majeure est sortie au début du mois de mai 2026, preuve de la vitalité du projet. Aussi, imgproxy repose sur un modèle "Open Core", ce qui signifie que la plupart des fonctionnalités sont disponibles gratuitement, mais que certaines fonctionnalités avancées sont payantes. Cela permet de tester le service sans frais, tout en ayant la possibilité d'accéder à des fonctionnalités avancées si nécessaire. Cela permet aussi de garantir une viabilité économique à l'entreprise derrière le projet, ce qui est un gage de pérennité pour le service. À l'origine, le service a été développé par Evil Martians une société qui crée des outils pour les développeurs. Puis, une société dédiée uniquement à ce service a été créée @ImgproxyGoesSolo2023, grâce au succès important. Bien que cela ne soit pas une garantie de service à long terme, cela indique une équipe engagée et déterminée à faire vivre le service.
 
 Pour le cas concerné, seules les fonctionnalités de base sont nécessaires: Redimensionnement, optimisation de format, et modification de la qualité. Toutes ces fonctionnalités sont disponibles gratuitement. @ImgproxyDocumentation


=== Matrice MoSCoW
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

#set page(margin: 20mm)
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


== Procédure de test

La procédure de test a été divisée en 2 parties: Une partie technique, pour tester les performances des services et une seconde partie pour tester la facilité d'intégration et la documentation. Le but était de créer une procédure de test reproductible. La marche à suivre se trouve en annexe (@annexe-test-procedure). 

Pour avoir des images à tester, une instance de WordPress a été déployée sur l'hébergement mutualisé d'infomaniak. Il s'agissait surtout de profiter d'un serveur web ("inclus" dans une instance de WordPress) pour servir les images de test. Ainsi, toutes les extensions de base Wordpress ont été déasctivées. Les images ont été ajoutées en FTP pour éviter que Wordpress n'applique son redimensionnement de base @Big_image_size_thresholdHookDeveloperWordPressorg2020 .  12 images ont été utilsées pour les tests. Le détail des poids et des formats se trouve en annexe (@taille-images-benchmark), mais le but était d'avoir un échantillon représentatif des contenus téléchargés par les clients d'Antistatique

La partie technique a été réalisée en utilisant un script curl (@test-script-procedure) qui envoie des requêtes HTTP aux différentes URL à tester. Le script mesure le temps de réponse et la taille de l'image retournée. Il a été lancé 4 fois, depuis 4 endroits différents : un ordinateur portable à Lausanne, un petit serveur d'infomaniak à Genève, un petit serveur Digital Ocean à New York et un petit serveur Digital Ocean à Singapour. Le but en lançant le script depuis différents endroits était de mesurer l'impact de la localisation géographique sur les performances des services. Les résultats ont été enregistrés dans un fichier CSV pour être analysés par la suite. Pour avoir des valeurs représentatives, le script est lancé 11 fois pour chaque image: la première exécution sert à mesurer l'efficacité du service de redimensionnement et d'optimisation, tandis que les 10 exécutions suivantes servent à mesurer la performance du service de cache. Le but est de voir si le service est capable de mettre en cache les images redimensionnées et optimisées pour les servir plus rapidement lors des requêtes suivantes.

Concernant les formats testés, le choix a été fait de laisser les services dans leur mode "par défaut" (en précisant par exemple "format=auto") afin de voir quel format serait choisi pour chaque image. Le but était de valider le fait que les services choisissent le format le plus approprié pour chaque image. 

La partie plus théorique a été réalisée en lisant la documentation de chaque service et en analysant comment les services fonctionnent. Le but était de voir si la documentation était claire et si l'intégration était facile à réaliser. Lors de cette analyse, il est apparu que les KPI définis plus tôt n'étaient pas toujours pertinents pour évaluer la facilité d'intégration ou comparer les services entre eux. Le cas où toutes les solutions obtiennent le même résultat à un KPI est aussi apparu, ce qui le rend inutile pour décider du choix d'une solution. La première version des KPI avait le but de comparer des *services*, mais le but de ce benchmark est de comparer des *architectures* et d'identifier la plus adaptée pour Antistatique.
Il a donc été décidé de redéfinir des KPIs, plus pertinents et plus adaptés à la comparaison des services (@moscow-matrix-v2).


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
  caption: [Matrice MoSCoW, 2ème version],
  kind: table,
) <moscow-matrix-v2>

== Test de la solution Cloudinary
== Test de la solution Cloudflare images
== Test de la solution Imgproxy

== Qualité des images redimensionnées
== Résultats






