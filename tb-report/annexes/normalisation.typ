#let table-header(text) = table.cell(
  fill: luma(235),
  inset: 6pt,
)[#strong(text)]

#set align(left + horizon)

Cette annexe décrit les règles utilisées pour convertir les différents KPI sur une échelle commune allant de 1 à 10. La note 10 représente toujours la situation la plus favorable et la note 1 la moins favorable. La méthode de normalisation varie selon la nature du KPI : certains sont évalués par rapport à des seuils fixes, tandis que d’autres sont comparés relativement aux valeurs obtenues pendant le benchmark.

#{
  set text(size: 8pt,)

  table(
    columns: (1.25fr, 1.45fr, 1fr),
    inset: 6pt,
    align: (
      left + horizon,
      left + horizon,
      left + horizon,
    ),

    table-header([KPI]),
    table-header([Méthode de normalisation]),
    table-header([Principe]),

    [*TTFB — première requête (cache MISS)* [ms]],
    [
      ≤ 400 ms → 10

      −1 point par 200 ms supplémentaires

      ≥ 2 200 ms → 1
    ],
    [Seuil absolu. Une valeur faible est favorable.],

    [*TTFB — requêtes répétées (cache HIT)* [ms]],
    [
      ≤ 400 ms → 10

      −1 point par 200 ms supplémentaires

      ≥ 2 200 ms → 1
    ],
    [Seuil absolu. Une valeur faible est favorable.],

    [*Ratio de taille finale* [%]],
    [
      0 % → 10

      100 % ou plus → 1

      Conversion linéaire
    ],
    [Référence absolue. Une valeur faible est favorable.],

    [*Coût direct annuel estimé* [CHF/an]],
    [
      Coût minimal → 10

      Autres valeurs proportionnelles

      Note minimale : 1
    ],
    [Normalisation relative. Une valeur faible est favorable.],

    [*Facilité d’exploitation* [1–4]],
    [
      1 → 1 ; 2 → 4

      3 → 7 ; 4 → 10
    ],
    [Échelle ordinale. Une valeur élevée est favorable.],

    [*Facilité d’intégration* [1–4]],
    [
      1 → 1 ; 2 → 4

      3 → 7 ; 4 → 10
    ],
    [Échelle ordinale. Une valeur élevée est favorable.],

    [*Documentation et expérience développeur* [1–6]],
    [
      1 → 1 ; 2 → 2,8 ; 3 → 4,6

      4 → 6,4 ; 5 → 8,2 ; 6 → 10
    ],
    [Échelle ordinale. Une valeur élevée est favorable.],
  )
}

#v(10pt)

*Normalisation du TTFB.*

Le TTFB n’est pas un Core Web Vital, mais une métrique permettant d’évaluer le temps nécessaire avant la réception du premier octet d’une réponse. À titre indicatif, web.dev considère qu’un TTFB inférieur ou égal à 800 ms est satisfaisant, qu’une valeur comprise entre 800 ms et 1,8 s doit être améliorée et qu’une valeur supérieure à 1,8 s est mauvaise @TimeFirstByte. Ces repères concernent principalement les requêtes de navigation et ne constituent pas une échelle de notation directement applicable au présent benchmark.

Afin de disposer d’une échelle plus exigeante et suffisamment discriminante pour les requêtes d’images, une cible interne de 400 ms a été retenue. Une mesure inférieure ou égale à cette valeur reçoit la note maximale de 10. Au-delà, la note diminue continuellement d’un point par tranche de 200 ms. Elle est plafonnée à 10 et ne peut pas être inférieure à 1.

Pour une mesure $T$ exprimée en millisecondes, la note est calculée comme suit :

$ N_"TTFB" = max(1, min(10, 10 - (T - 400) / 200)) $

Le calcul est continu : une augmentation de 100 ms entraîne par exemple une diminution de 0,5 point. La même règle est appliquée aux premières requêtes et aux requêtes répétées. Lorsque plusieurs solutions restent sous le seuil de 400 ms, elles reçoivent toutes la note de 10. Le KPI indique alors qu’elles satisfont toutes le niveau attendu et ne cherche pas à valoriser des écarts considérés comme peu déterminants.

#v(8pt)

*Normalisation du ratio de taille finale.*

Le ratio de taille finale représente le poids de l’image retournée par rapport au poids de l’image originale :

$ R = "taille de l’image retournée" / "taille de l’image originale" times 100 $

Une valeur de 100 % signifie que l’image retournée possède le même poids que l’image originale et qu’aucune réduction n’a été obtenue. Une valeur faible indique au contraire une réduction plus importante. L’intitulé « ratio de taille finale » est utilisé afin d’éviter l’ambiguïté de l’expression « ratio de compression », qui pourrait laisser penser qu’une valeur élevée est préférable.

La note est calculée par interpolation linéaire entre 0 %, qui correspond théoriquement à 10, et 100 %, qui correspond à 1 :

$ N_R = max(1, min(10, 10 - 9 times R / 100)) $

Une image finale représentant 50 % du poids original obtient ainsi une note de 5,5. Lorsqu’une transformation produit un fichier plus lourd que l’original, le ratio dépasse 100 % et la note reste limitée à 1.

#v(8pt)

*Normalisation du coût direct annuel estimé.*

Le KPI financier correspond au coût direct annuel estimé et non à un coût total de propriété complet. Le temps consacré à l’intégration et à l’exploitation n’est pas converti en francs, car ces aspects sont déjà évalués par les KPI d’autonomie d’exploitation et de facilité d’intégration. Leur intégration dans le coût aurait pour effet de comptabiliser deux fois une partie du même désavantage.

Aucun seuil budgétaire absolu n’ayant été défini par Antistatique, le coût est normalisé relativement aux solutions comparées. La solution présentant le coût annuel le plus faible reçoit la note de 10. Les autres notes sont calculées proportionnellement :

$ N_i = max(1, 10 times C_"min" / C_i) $

Dans cette formule, $C_i$ représente le coût annuel de la solution évaluée et $C_"min"$ le coût annuel le plus faible observé. Par exemple, si le coût minimal est de 162 CHF et qu’une autre solution coûte 361,70 CHF, sa note est calculée de la manière suivante :

$ 10 times 162 / 361.70 = 4.48 $

Cette méthode rend les solutions comparables entre elles, mais elle ne signifie pas que la solution la moins chère est nécessairement abordable dans l’absolu. Elle reçoit 10 parce qu’elle constitue la meilleure valeur observée dans le périmètre du benchmark.

#v(8pt)

*Échelles d’attribution des notes qualitatives*

#figure(
  outlined: false,
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
      *Facilité d’exploitation* \
      (de la part d'Antistatique)
    ],
    [1], [Maintenance complète (OS, Docker, failles de sécurité, monitoring des ressources CPU/RAM).],
    [2], [Maintenance d'infrastructure Serverless/Edge (mise à jour des workers, gestion des limites de requêtes).],
    [3], [Maintenance applicative légère (mises à jour de dépendances NPM/Composer pour les connecteurs).],
    [4], [Entièrement géré (SaaS pur, infrastructure exploitée par le fournisseur ; seules la configuration et l’utilisation du service restent à la charge d’Antistatique).],
    
    // 2. Friction d'intégration
    table.cell(rowspan: 4)[
      *Facilité d'intégration*
    ],
    [1], [Couplage d'infrastructure requis (CNAME, reverse proxy dédié, configuration Edge complexe qui sort du code).],
    [2], [Dépendance logicielle forte (Mécanisme ou syntaxe propre au fournisseur impliquant une adaptation du code et limitant la réversibilité)],
    [3], [Dépendance logicielle légère (variable d'environnement, helper générique, petit SDK agnostique).],
    [4], [Standards web purs (URL rewriting, attributs HTML natifs). Dépendance technique minimale et réversibilité élevée.],

    
    // 3. Qualité de la doc / DX
    table.cell(rowspan: 6)[
      *Qualité de la documentation et de l'expérience développeur (DX)*
    ],
    [1], [Documentation absente ou inexistante.],
    [2], [Documentation de très mauvaise qualité.],
    [3], [Documentation lacunaire, exemples rares, peu de support.],
    [4], [Documentation acceptable, exemples partiels, support inégal.],
    [5], [Documentation complète et claire, quelques exemples, communauté présente.],
    [6], [Documentation exhaustive, exemples de code, tutoriels étape par étape, support actif.]

  ),
  caption: [Détails des échelles de notation pour les critères de choix],
  kind: table,
)

Ces évaluations reposent sur la configuration effectivement réalisée pendant le benchmark et sur l’examen de la documentation officielle. Elles représentent donc une appréciation structurée fondée sur une grille commune, mais ne constituent pas une mesure objective ni une enquête auprès d’un panel de développeurs.

#v(8pt)

*Calcul du score pondéré.*

Après normalisation, chaque note $N_i$ est multipliée par le poids $w_i$ attribué au KPI correspondant. Les résultats sont additionnés, puis divisés par la somme des poids. La moyenne obtenue sur 10 est enfin multipliée par 10 afin de produire un score global sur 100 :

$ S = 10 times (sum_i w_i N_i) / (sum_i w_i) $

Les calculs sont effectués à partir des valeurs non arrondies. Les notes intermédiaires sont affichées avec deux décimales et le score final avec une décimale.

Comme chaque KPI reçoit une note comprise entre 1 et 10, le score global est compris entre 10 et 100. Il constitue un indice de comparaison pondéré et ne doit pas être interprété comme un pourcentage de conformité.