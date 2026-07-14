#let table-header(text) = {
  strong(text)
}


#figure(
  table(
    columns: (1fr, auto),
    inset: 6pt,
    align: (right+ horizon, left + horizon),

    // Header row
    table-header([KPI]),
    table-header([Méthode de calcul]),


    [*TTFB (cas du cache MISS)* [ms]],
    [TTFB = 400ms  → note = 10

    Chaque 200 ms supplémentaires, la note diminue de 1 point.
    ],
    [*TTFB (cas du cache HIT)* [ms]],[TTFB = 400ms  → note = 10
    
    Chaque 200 ms supplémentaires, la note diminue de 1 point.],
    [*Ratio de compression* [%]],[],
    [*TCO (coût total de propriété)* [CHF/an]],[],
    [*Niveau de gestion nécessaire de la part d’Antistatique* [1-4]], [],
    [*Friction d’intégration* [1-4]], [],
    [*Qualité de la documentation et de l'expérience développeur* [1-6]], [],
  ),
) 
