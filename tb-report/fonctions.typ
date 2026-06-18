// ─── Tableau de champs à remplir (label : valeur) ────────────
// Ligne de label, champ vide souligné en regard.
#let fields-table(..rows) = {
  table(
    columns: (auto, 1fr),
    stroke: none,
    align: (left + horizon, left + bottom),
    row-gutter: 0.4cm,
    inset: (x: 8pt, y: 0pt),
    ..rows.pos().map(((label, value)) => (
      [#label],
      if value == "" {
        line(length: 100%, stroke: 0.1mm)
      } else {
        [#value]
      },
    )).flatten()
  )
}

// ─── Tableau de signatures ───────────────────────────────────
// Chaque entrée = (role, name, date).
// Gauche : rôle (gras) + date. Droite : "Nom et signature",
// puis le nom et un trait pour signer.
#let signatures-table(..rows) = {
  let entries = rows.pos()
  table(
    columns: (1fr, 2fr),
    stroke: none,
    inset: (x: 8pt, y: 0pt),
    row-gutter: 0.6cm,
    ..entries.map(((role, name, date)) => (
      // Colonne gauche : rôle + date
      block(below: 2cm)[
        #text(weight: "bold")[#role] \

        #text(8pt)[Date:  #date]
      ],
      // Colonne droite : libellé, nom, puis trait de signature
      [
        Nom et signature

        #text(8pt)[ #name]
        #line(length: 100%, stroke: 0.4pt)
      ],
    )).flatten()
  )
}



// ─── Option de confidentialité (case cochée) ─────────────────
#let confidentiality-option(checked: false, title: "", body) = {
  let marker = if checked { "◉" } else { "○" }
  let border-color = if checked { luma(200) } else { white }
  grid(
    columns: (1fr),
    column-gutter: 3mm,
    [
      #text(weight: "bold")[#marker #title]

      #body
    ],
  )
}

// ─── Case à cocher Oui / Non ─────────────────────────────────
#let confidentiality-checkbox(checked: false, label) = {
  let yes = checked == "oui" or checked == true
  grid(
    columns: (4mm, 5mm, 6mm, 5mm, 6mm, 1fr),
    column-gutter: 2mm,
    [],
    box(stroke: 0.5pt, inset: 0.5mm)[#text(8pt)[#if yes [☑] else [☐]]],
    text(8pt)[Oui],
    box(stroke: 0.5pt, inset: 0.5mm)[#text(8pt)[#if yes [☐] else [☑]]],
    text(8pt)[Non],
    label,
  )
}

