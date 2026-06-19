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

Plutôt que de comparer exhaustivement tous les acteurs d'une même catégorie (comme Imgix, Uploadcare Image CDN et Cloudinary pour le SaaS), un seul service représentatif répondant à ces 3 critères a été sélectionné pour chaque architecture. *Cloudinary* a été sélectionné pour le SaaS, *Cloudflare Images* pour l'edge et *Imgproxy* pour le self-host. 
=== Matrice MoSCoW
Pour comparer les avantages et les inconvénients de chaque service, une matrice MoSCoW reprenant les besoins d'Antistatique a été créée. Des indicateurs de performance clé (KPI) ont été définis pour chaque besoin. (@moscow-matrix).

#figure(
  table(columns: 3, 
  [Besoin],[Avantage], [Inconvénient] , 
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
  caption: [Matrice MoSCoW],

  kind: table,
) <moscow-matrix>


== Procédure de test
== Test de la solution Cloudinary
== Test de la solution Cloudflare images
== Test de la solution Imgproxy
== Résultats