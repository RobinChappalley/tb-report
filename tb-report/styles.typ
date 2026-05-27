// ============================================================
// styles.typ — Styles partagés pour le rapport de pré-étude
// HEIG-VD – COMEM – Ingénierie des médias
// ============================================================


// ------------------------------------------------------------
// VARIABLES GLOBALES (à adapter par projet)
// ------------------------------------------------------------
#import "variables.typ": *


// ------------------------------------------------------------
// CONFIGURATION TYPOGRAPHIQUE GLOBALE
// Applique via : #show: doc => conf(doc)
// ------------------------------------------------------------

#let conf(doc) = {
  set page(
    paper: "a4",
    margin: (auto),
    header: [
      #grid(
        columns: (1fr, 1fr),
        align: (left, right),
        gutter: 0pt,
        grid.cell(
          image("assets/HEIG-VD_logotype-baseline_rouge-rvb.png", width: 3cm)
        ),
      )
    ],
    footer: context [
      #set text(size: 9pt, fill: gray)
      #h(1fr)
      HEIG-VD – COMEM – #doc-type
      #h(1fr)
      #counter(page).display()
    ],
  )

  set text(font: "Arial", size: 11pt, lang: "fr")
  set par(justify: true)
  set heading(numbering: "1.1")

  // Heading niveau 1 : style "chapitre"
  show heading.where(level: 1): set heading(supplement: [Chapitre])
  show heading.where(level: 1): it => {
    colbreak(weak: true)
    if it.numbering != none {
      v(3em)
      block(text(size: 20pt, [Chapitre #counter(heading).display()]))
      v(1em)
    }
    block(text(size: 26pt, [#it.body]))
    v(1em)
  }

  // Heading niveau 2
  show heading.where(level: 2): it => {
    set text(size: 14pt, weight: "bold")
    block(above: 1.2em, below: 0.8em, it.body)
  }

  // Heading niveau 3
  show heading.where(level: 3): it => {
    set text(size: 12pt, weight: "bold", style: "italic")
    block(above: 1em, below: 0.5em, it.body)
  }

  // Table des matières
  show outline: it => {
    show heading: pad.with(bottom: 1.25em)
    it
  }
  show outline.entry.where(level: 1): set block(above: 1.35em)
  show outline.entry.where(level: 1): set text(weight: "bold")
  show outline.entry.where(level: 2).or(outline.entry.where(level: 3)): it => link(
    it.element.location(),
    it.indented(
      gap: 1em,
      it.prefix(),
      it.body() + box(width: 1fr, inset: (left: 5pt), it.fill) + box(width: 1.5em, align(right, it.page())),
    ),
  )

  // Remplacement de "Liste" par "Code" pour les figures de code
  show figure.where(kind: raw): set figure(supplement: [Code])

  doc
}


// ------------------------------------------------------------
// COMPOSANT : PAGE DE TITRE
// Usage : #page-titre()  ou  #page-titre(titre: "Mon titre", ...)
// ------------------------------------------------------------

#let page-titre(
  titre: title,
  sous-titre: subtitle,
  type-doc: doc-type,
  auteur: author,
  superviseurs: supervisors,
  type-projet: project-type,
  filiere: study,
  ville: city,
  date-doc: date,
) = {
  set page(header: none, footer: none, margin: (auto))

  align(center)[
    #v(8em)
    #text(size: 17pt)[#smallcaps[#type-projet\ #filiere]]
    #v(2em)
    #image("assets/HEIG-VD_logotype-baseline_rouge-rvb.png", width: 25%)
    #v(2em)
    #text(size: 14pt)[#smallcaps[Bachelor COMEM - HEIG-VD]]
    #v(2em)
    #line(length: 100%, stroke: 0.4mm)
    #v(.5em)
    #text(size: 16pt)[#type-doc]\
    #v(1em)
    #text(size: 24pt, weight: "bold")[#titre]\
    #v(0.5em)
    #text(size: 14pt)[#smallcaps[#sous-titre]]
    #v(.5em)
    #line(length: 100%, stroke: 0.4mm)
    #v(3em)
    #grid(
      columns: (45%, 45%),
      align(left)[
        _Auteur :_\
        #auteur.name\
        #auteur.student-number
      ],
      align(right)[
        #{
          for (t, n) in superviseurs {
            [
              #text(t + " :", style: "italic")\
              #n
              #v(1em)
            ]
          }
        }
      ],
    )
    #v(1fr)
    #text(size: 12pt)[#ville, le #date-doc.display("[day] [month] [year]")]
  ]
}


// ------------------------------------------------------------
// COMPOSANT : PAGE D'AUTHENTIFICATION
// Usage : #authentification()  ou  #authentification(nom: "Prénom Nom")
// ------------------------------------------------------------

#let authentification(
  nom: author.name,
  ville: city,
) = {
  set page(
    paper: "a4",
    margin: (auto),
    header: [
      #grid(
        columns: (1fr, 1fr),
        align: (left, right),
        gutter: 0pt,
        grid.cell(
          image("assets/HEIG-VD_logotype-baseline_rouge-rvb.png", width: 3cm)
        ),
      )
    ],
    footer: none,
  )

  [= Authentification]
  v(2cm)

  [J'atteste par la présente avoir réalisé ce travail et n'avoir utilisé aucune autre source que celles expressément mentionnées.]

  v(2cm)
  [== #nom]
  v(2cm)
  line(length: 50%, stroke: 0.1mm)

  [== Signature]
  v(2cm)
  line(length: 50%, stroke: 0.1mm)

  [== #ville, le]
  v(2cm)
  line(length: 50%, stroke: 0.1mm)

}


// ------------------------------------------------------------
// COMPOSANTS SÉMANTIQUES pour le contenu du rapport
// Extraits de la structure du canevas Word
// ------------------------------------------------------------

// Bloc "Question" affiché avant chaque section
#let question(contenu) = block(
  fill: rgb("#f0f4f8"),
  inset: 10pt,
  radius: 3pt,
  width: 100%,
  below: 1em,
  text(style: "italic")[*Question :* #contenu],
)

// Bloc "Objectif"
#let objectif(contenu) = block(
  below: 0.8em,
  [*Objectif :* #contenu],
)

// Bloc "Contenu attendu" (guide rédactionnel, à retirer en version finale)
#let contenu-attendu(contenu) = block(
  fill: rgb("#fafafa"),
  stroke: (left: 2pt + rgb("#aaaaaa")),
  inset: (left: 10pt, top: 6pt, bottom: 6pt, right: 6pt),
  width: 100%,
  below: 1em,
  text(fill: rgb("#666666"), size: 10pt)[*Contenu attendu :* #contenu],
)

// Encadré IMPORTANT (pour notes éditoriales)
#let important(contenu) = block(
  fill: rgb("#fff4e5"),
  stroke: (left: 3pt + rgb("#ff9900")),
  inset: 12pt,
  width: 100%,
  radius: 2pt,
  below: 1.2em,
  [*IMPORTANT* \ #contenu],
)
