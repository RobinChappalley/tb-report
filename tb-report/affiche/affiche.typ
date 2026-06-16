// ============================================================
// AFFICHE.TYP — Assemblage final
// ============================================================

#import "styles.typ": *
#import "variables.typ": *

// --- Configuration de la page ---
#set page(
  paper: "a4",
  margin: (top: 1.5cm, bottom: 1.5cm, left: 1.5cm, right: 1.5cm),
  footer: [
    #line(length: 100%, stroke: 0.5pt)
    #v(6pt)
    #grid.footer(
      repeat:false,
      children:(
        columns: (1fr, auto),
        align: (left + top, right + top),
        gutter: 20pt,
        [
          #meta-line("Auteur :", auteur)
          #meta-line("Répondant externe :", repondant)
          #meta-line("Prof. responsable :", professeur)
          #meta-line("Sujet proposé par :", proposant)
      ],
      [
        #align(right)[
          #image("assets/logo-hesso.png", height: 35pt)
          #v(4pt)
          #style-footer[Haute École Spécialisée]
          #style-footer[de Suisse occidentale]
          #v(4pt)
          #style-footer[HEIG-VD © #annee, filière #filiere]
        ]
      ], 
      ))
  ]
)

#set par(justify: true)

// ============================================================
// EN-TÊTE
// ============================================================
#grid(
  columns: (1fr, auto),
  align: (left + horizon, right + horizon),
  image("/tb-report/affiche/assets/logo-HEIG-VD.svg", height: 40pt),
  style-heading[Travail de Bachelor #annee]
)

#v(8pt)
#line(length: 100%, stroke: 1pt + color-heading)
#v(16pt)

// ============================================================
// TITRE
// ============================================================
#align(center)[
  #style-title(titre)
]

#v(20pt)

// ============================================================
// CORPS EN 2 COLONNES
// ============================================================
#columns(2, gutter: 16pt)[

  // --- Colonne gauche ---
  #section("Contexte", texte-contexte)

  // Image principale
  #if image-principale != none {
    image-principale
  } else {
    image-placeholder(h: 120pt)
  }

  #v(12pt)
  #section("Description", texte-description)

  #colbreak()

  // --- Colonne droite ---
  #section("Objectifs", texte-objectifs)

  // Image secondaire
  #if image-secondaire != none {
    image-secondaire
  } else {
    image-placeholder(h: 100pt)
  }

  #v(12pt)
  #section("Résultats", texte-resultats)
]


