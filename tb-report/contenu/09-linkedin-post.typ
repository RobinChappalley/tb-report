#import "../styles.typ" : page-admin
#import "../variables.typ" as vars

#set page(
  paper: "a4",
  margin: (auto),
  header: [
    #grid(
      columns: (1fr, 1fr),
      align: (left, right),
      gutter: 0pt,
      grid.cell(image("../assets/logos/HEIG-VD_logotype-baseline_rouge-rvb.png", width: 3cm)),
    )
  ])

#page-admin("Post linkedin")[
  coucou le contenu de la page
]
