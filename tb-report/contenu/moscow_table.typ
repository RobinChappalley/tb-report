#let table-header(text) = {
  strong(text)
}

#let priority-cell(label) = {
  let color = if text == "Must have" {
    (red.lighten(40%), red.darken(20%))
  } else if text == "Should Have" {
    (orange.lighten(50%), orange.darken(10%))
  } else if text == "Could Have" {
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

#table(
  columns: (auto,  1fr, 1fr, 1fr, auto),
  inset: 6pt,
  align: (left, auto, horizon, horizon, horizon, center),
  
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
  priority-cell[Must have],
  
  // Row 2: Standardisation
  [Standardisation de la logique d'optimisation],
  kpi-style[Possibilité de modifier les paramètres d'image globalement (sans code source)],
  kpi-style[Distribution adaptative du format],
  [],
  priority-cell[Must have],
  
  // Row 3: Maîtrise du déploiement
  [Maîtrise du déploiement et des coûts],
  kpi-style[TCO (CHF/an): coût fixe + variable],
  kpi-style[Niveau de gestion Antistatique (1–4)],
  [],
  priority-cell[Must have],
  
  // Row 4: Disponibilité
  [Disponibilité et robustesse],
  kpi-style[SLA (%) — données fournisseur],
  kpi-style[Présence d'un mécanisme de fallback (oui/non)],
  [],
  priority-cell[Must have],
  
  // Row 5: Faible charge d'intégration
  [Faible charge d'intégration pour les développeurs],
  kpi-style[Friction d'intégration (1–4)],
  [],
  [],
  priority-cell[Could Have],
  
  // Row 6: Réversibilité
  [Réversibilité pour les sites clients],
  [],
  [],
  [],
  priority-cell[Could Have],
  
  // Row 7: Temps de chargement
  [Garantie des temps de chargement optimisés],
  kpi-style[TTFB (cache hit) — ms],
  kpi-style[TTFB (cache miss) — ms],
  kpi-style[Ratio de compression (%)],
  priority-cell[Should Have],
)

// Legend
#v(10pt)
#text(9pt)[
  *Légende:* #h(5pt)
  #rect(fill: rgb(255, 230, 230), radius: 3pt)[#text(rgb(190, 40, 40), 8pt)[Must have]] #h(3pt)
  #rect(fill: rgb(255, 245, 220), radius: 3pt)[#text(rgb(220, 130, 0), 8pt)[Should Have]] #h(3pt)
  #rect(fill: rgb(255, 255, 210), radius: 3pt)[#text(rgb(180, 130, 0), 8pt)[Could Have]] #h(3pt)
  #rect(fill: rgb(230, 255, 230), radius: 3pt)[#text(rgb(50, 150, 50), 8pt)[Won't Have]]
]