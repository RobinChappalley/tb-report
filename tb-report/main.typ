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
  numbering: "1",
  number-align: center,
)
set heading(numbering: "1.1")

// ─── Numérotation des figures par chapitre ──────────────────
show heading.where(level: 1): it => {
  counter(figure.where(kind: image)).update(0)
  counter(figure.where(kind: table)).update(0)
  it
}

// ─── Pages liminaires ─────────────────────────────────────────
#include "pages-admin/title-page.typ"
#include "pages-admin/foreword.typ"
#include "pages-admin/thanks.typ"
#include "pages-admin/authenticity.typ"
#include "pages-admin/publiable-abstract.typ"
#include "contenu/00-table-of-contents.typ"

// ─── Contenu (chapitres) ────────────────────────────────────
#include "contenu/01-introduction.typ"

// ─── Pages officielles (style Arial obligatoire) ────────────
#show: page-officielle
#include "pages-admin/bachelor-thesis-conduct.typ"
#include "pages-admin/ai-usage-declaration.typ"
#include "pages-admin/confidentiality-declaration.typ"
#include "pages-admin/bilan-inter.typ"

// Remettre le style par défaut pour la suite si nécessaire
// (pas nécessaire si c'est la fin du document)
