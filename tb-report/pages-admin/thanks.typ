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


#set par(justify: true)
#page-admin("Remerciements")[
Remercier les personnes qui ont contribué au projet, que ce soit par un soutien technique, des conseils, ou simplement en étant là pour écouter les difficultés rencontrées. C'est aussi l'occasion de remercier les enseignants et les encadrants pour leur accompagnement tout au long du projet.
]
