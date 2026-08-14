// main.typ
#import "styles.typ": header-commun, page-officielle, page-admin
#import "variables.typ": *

// ─── Configuration globale (style par défaut de Typst) ─────
#let page-base = (
  paper: "a4",
  header: context {
    if counter(page).get().first() > 1 {
      header-commun
    }
  },
  margin: (top: 3cm),
  number-align: center,
  
)
#set page(
  ..page-base,
  footer: context [
    #set text(size: 9pt, fill: gray)
    #h(1fr) // rien à gauche
    #h(1fr) // rien à droite
  ],
  )
#set par(leading: 0.9em,)

#set document(
  title: "Travail de Bachelor",
)

#set text(
  lang: "fr"
)
// ─── Numérotation des figures par chapitre ──────────────────
// 1. Format : numérotation des figures basée sur le chapitre (heading niveau 1)
#set figure(numbering: n => {
  let chapter = counter(heading.where(level: 1)).get().first()
  numbering("1.1", chapter, n)
})

// 2. Reset du compteur de figures à chaque nouveau chapitre
#show heading.where(level: 1): it => {
  counter(figure.where(kind: image)).update(0)
  counter(figure.where(kind: table)).update(0)
  it
}

#set par(justify: true)
// ─── Pages liminaires ─────────────────────────────────────────

#include "pages-admin/title-page.typ"
#include "contenu/00-table-of-contents.typ"
#include "pages-admin/foreword.typ"
#include "pages-admin/thanks.typ"
#include "pages-admin/authenticity.typ"
#include "pages-admin/publiable-abstract.typ"



// ─── Contenu (chapitres) ────────────────────────────────────
#set page(
      footer: context [
      #set text(size: 10pt, fill: gray)
      #align(center, counter(page).display())
    ],
    ..page-base,
  )
#set heading(numbering: "1.1")
#include "contenu/01-introduction.typ"
#include "contenu/02-contexte.typ"
#include "contenu/03-benchmark.typ"
#include "contenu/04-poc.typ"
#include "contenu/conclusion.typ"

#pagebreak()
#include "pages-admin/bibliography.typ"



#set heading(numbering: none)


// ─── Pages officielles (style Arial obligatoire) ────────────
#show: page-officielle
#include "pages-admin/bachelor-thesis-conduct.typ"
#include "pages-admin/ai-usage-declaration.typ"

#include "contenu/07-A4-Poster.typ"
#include "contenu/08-A0-Poster.typ"
#include "contenu/09-linkedin-post.typ"

#include "pages-admin/confidentiality-declaration.typ"
#include "pages-admin/bilan-inter.typ"