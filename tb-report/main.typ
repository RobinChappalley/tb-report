// main.typ
#import "styles.typ": header-commun, page-officielle, page-admin
#import "variables.typ": *

// ─── Configuration globale (style par défaut de Typst) ─────
#set page(
  paper: "a4",
  header: header-commun,
  footer: context [
    #set text(size: 9pt, fill: gray)
    #h(1fr) // rien à gauche
    #h(1fr) // rien à droite
  ],
  margin: (top: 3cm),
  number-align: center,
  )


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
#include "pages-admin/foreword.typ"
#include "pages-admin/thanks.typ"
#include "pages-admin/authenticity.typ"
#include "pages-admin/publiable-abstract.typ"


// ─── Contenu (chapitres) ────────────────────────────────────
#set page(
    footer: context [
      #set text(size: 10pt, fill: gray)
      #align(center, counter(page).display())
    ]
  )
#set heading(numbering: "1-1")
#include "contenu/00-table-of-contents.typ"
#include "contenu/01-introduction.typ"
#include "contenu/02-contexte.typ"
#include "contenu/03-benchmark.typ"
#include "contenu/04-poc.typ"
#include "contenu/conclusion.typ"
#include "contenu/09-linkedin-post.typ"

#include "pages-admin/bibliography.typ"
#set heading(numbering: none)

// ─── Pages officielles (style Arial obligatoire) ────────────
#show: page-officielle
#include "pages-admin/bachelor-thesis-conduct.typ"
#include "pages-admin/ai-usage-declaration.typ"
#include "pages-admin/confidentiality-declaration.typ"
#include "pages-admin/bilan-inter.typ"

// Remettre le style par défaut pour la suite si nécessaire
// (pas nécessaire si c'est la fin du document)
