#let table-header(text) = {
  strong(text)
}


#figure(
  table(
    columns: (1fr, 1fr, 1fr),
    inset: 6pt,
    align: (right+ horizon, left + horizon, left + horizon),

    // Header row
    table-header([KPI]),
    table-header([Méthode de calcul]),
    table-header([Explication]),


    [*TTFB (cas du cache MISS)* [ms]],
    [TTFB = 400ms  → note = 10

    Chaque 200 ms supplémentaires, la note diminue de 1 point.
    ],[Les web core vitals avancent une échelle où les TTFB < 800ms sont bons, entre 800ms et 1.8s sont moyens et > 1.8s sont mauvais.],


    [*TTFB (cas du cache HIT)* [ms]],[TTFB = 400ms  → note = 10
    
    Chaque 200 ms supplémentaires, la note diminue de 1 point.],[],
    
    [*Ratio de compression* [%]],
    [100%  → note = 1],
    [La valeur obtenue représente le pourcentage du poids de l'image finale par raport à l'image de base. Plus le ratio est bas, plus la compression est efficace.], 


    [*TCO (coût total de propriété)* [CHF/an]],[],[],
    
    
    [*Niveau de gestion nécessaire de la part d’Antistatique* [1-4]], [],[],
    
    
    [*Friction d’intégration* [1-4]], [],[],
    
    
    [*Qualité de la documentation et de l'expérience développeur* [1-6]], [],[],
  ),
) 
