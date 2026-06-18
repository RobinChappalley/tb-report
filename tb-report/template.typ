// template.typ
#import "variables.typ" as vars

#let rapport-tb(body) = {
  // --- Métadonnées du document ---
  set document(title: vars.title, author: vars.author.name)

  // --- Mise en page ---
  set page(
    paper: "a4",
    margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm), // à ajuster sur le Word
    numbering: "1",
    number-align: center,
  )

  // --- Texte ---
  set text(
    lang: "fr",
    font: "Arial",   // à vérifier selon le template Word
    size: 11pt,
  )

  set par(justify: true, leading: 0.65em)

  // --- Titres ---
  set heading(numbering: "1.1")
  show heading.where(level: 1): it => {
    set text(size: 16pt, weight: "bold")
    block(above: 1.4em, below: 0.8em, it)
  }
  show heading.where(level: 2): it => {
    set text(size: 13pt, weight: "bold")
    block(above: 1.1em, below: 0.6em, it)
  }

  // --- Figures ---
  show figure.caption: set text(size: 9pt, style: "italic")

  // --- Code ---
  show raw.where(block: true): it => block(
    fill: luma(245),
    inset: 8pt,
    radius: 4pt,
    width: 100%,
    it,
  )

set figure(numbering: n => {
  let chapter = counter(heading.where(level: 1)).get().first()
  numbering("1.1", chapter, n)
})

// 2. Reset du compteur de figures à chaque nouveau chapitre
show heading.where(level: 1): it => {
  counter(figure.where(kind: image)).update(0)
  counter(figure.where(kind: table)).update(0)
  it
}

  body// 1. Format : numérotation des figures basée sur le chapitre (heading niveau 1)

}

#let page-admin(titre, body) = {
  page(numbering: none)[
    #heading(numbering: none, outlined: true)[#titre]
    #body
  ]
}


