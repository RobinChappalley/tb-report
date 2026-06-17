#import "../template.typ" : page-admin
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

#page-admin("Préambule")[
#set par(justify: true)
Ce travail de Bachelor (ci-après TB) est réalisé en fin de cursus d’études, en vue de l’obtention du titre de Bachelor of Science HES-SO en Ingénierie.

En tant que travail académique, son contenu, sans préjuger de sa valeur, n'engage ni la responsabilité de l'auteur ni celle du jury du travail de Bachelor et de l'École. 

Toute utilisation, même partielle, de ce TB doit être faite dans le respect du droit d’auteur.

HEIG-VD

Le Chef du Département

#vars.city, le #vars.date.display("[day]-[month]-[year]")




  
]
