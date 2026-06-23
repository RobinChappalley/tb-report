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
Pour comparer les avantages et les inconvénients de chaque service, une matrice MoSCoW reprenant les besoins d'Antistatique a été créée. Des indicateurs de performance clé (KPI) ont été définis pour chaque besoin. (@moscow-matrix). 



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
  caption: [Matrice MoSCoW],
  kind: table,
) <moscow-matrix>


== Procédure de test
== Test de la solution Cloudinary
== Test de la solution Cloudflare images
== Test de la solution Imgproxy
== Résultats

#include "../pages-admin/bibliography.typ"