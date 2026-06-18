// style.typ — Styles partagés pour le Travail de Bachelor
// HEIG-VD – COMEM – Ingénierie des médias
#import "variables.typ": *

// ─── HEADER COMMUN (logo HEIG-VD aligné à gauche) ───────────
#let header-commun = [
  #grid(
    columns: (1fr, 1fr),
    align: (left, right),
    gutter: 0pt,
    grid.cell(image("assets/logos/HEIG-VD_logotype-baseline_rouge-rvb.png", width: 3cm)),
  )
]

// ─── STYLE POUR LES PAGES OFFICIELLES (Arial, marges imposées) ──
#let page-officielle(body) = {
  set text(font: "Arial", size: 11pt, lang: "fr")
  set par(justify: true, leading: 0.65em)
  set page(
    margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
    header: header-commun,
    footer: none, // les pages officielles définissent leur propre footer
  )
  body
}

// ─── PAGE ADMIN (pour les pages liminaires : titre en TdM, pas de numéro) ──
#let page-admin(titre, body) = {
  page(numbering: none, outlined: true)[
    #heading(numbering: none, outlined: true)[#titre]
    #body
  ]
}
