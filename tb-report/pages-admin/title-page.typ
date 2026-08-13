// variables
#import "../variables.typ" as vars

#set par(justify: true)


#set heading(numbering: "1.1")
#show heading.where(level: 1): set heading(supplement: [Chapter])
#show heading.where(level: 1): it => {
  colbreak(weak: true)
  if it.numbering != none {
    v(3em)
    block(text(size: 20pt, [Chapter #counter(heading).display()]))
    v(1em)
  }
  block(text(size: 26pt, [#it.body]))
  v(1em)
}

#show outline: it => {
  show heading: pad.with(bottom: 1.25em)
  it
}

// Level 1 outline entries are bold and there is no fill.
//#show outline.entry.where(level: 1): set outline.entry(fill: none)
#show outline.entry.where(level: 1): set block(above: 1.35em)
#show outline.entry.where(level: 1): set text(weight: "bold")

// Level 2 and 3 outline entries have a bigger gap and a dot fill.
//#show outline.entry.where(level: 2).or(outline.entry.where(level: 3)): set outline.entry(
//  fill: repeat(justify: true, gap: 0.5em)[.],
//)


#show outline.entry.where(level: 2).or(outline.entry.where(level: 3)): it => link(
  it.element.location(),
  it.indented(
    gap: 1em,
    it.prefix(),
    it.body() + box(width: 1fr, inset: (left: 5pt), it.fill) + box(width: 1.5em, align(right, it.page())),
  ),
)

// Title Page
#page(numbering: none,
align(center)[
  #v(8em)
  #image("../assets/logos/heig-vd-baseline.pdf", width: 25%)
  #text(size: 17pt)[#smallcaps[#vars.project-type]]
  #v(4em)
  #text(size: 14pt)[Département : #smallcaps[#vars.department]]

  #text(size: 14pt)[Filière : #smallcaps[ #vars.faculty]]
  #line(length: 100%, stroke: 0.4mm)
  #v(.5em)
  #text(size: 16pt)[#vars.doc-type]\
  #v(1em)
  #text(size: 24pt, weight: "bold", hyphenate: false)[#vars.title]\
  #v(0.5em)
  #text(size: 14pt)[#smallcaps[#vars.subtitle]]
  #v(.5em)
  #line(length: 100%, stroke: 0.4mm)
  #v(3em)
  #grid(
    columns: (1fr, auto),
    align(left)[
      _Auteur:_\
      #vars.author.name
      #v(1em)
      Année académique : #text[#vars.academic-year]
    ],
    align(right)[
      #{
        for (title, name) in vars.supervisors {
          [
            #text(title + ":", style: "italic")\
            #name
            #v(1em)
          ]
        }
      }
    ],
  )
  #v(1fr)

  #text(size: 12pt)[#vars.city, le #vars.date.display("[day].[month].[year]")]
]
)