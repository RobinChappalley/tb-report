#import "../template.typ" : page-admin
#import "../variables.typ" as vars
#import "../fonctions.typ": *

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


// ─── Clause de confidentialité ───────────────────────────────
#page-admin("Confidentialité liée au Travail de Bachelor")[
  #fields-table(
    ("Diplômant :", vars.author.name),
    ("Titre du Travail de Bachelor :", vars.title),
     ("Enseignant responsable du TB :", vars.professor),
     ("Entreprise partenaire :", vars.principal),
  
  )

  #text(10pt)[
    Tous les TB sont déposés à la Bibliothèque de la HEIG-VD qui en gère
    l'archivage et la consultation. Quel que soit le niveau de confidentialité
    du TB, le nom du diplômant, le nom de l'enseignant responsable, le titre du
    TB et le résumé publiable figurent dans tous les documents de présentation
    des TB ainsi que sur la plateforme de consultation des TB
    (http://tb.heig-vd.ch). L'enseignant responsable veille à ce que le titre du
  TB et le résumé publiable soient rédigés conformément au niveau de
  confidentialité voulu.

  Les TB peuvent être soumis à un logiciel anti-plagiat. Dans ce cas, leur
  contenu sera traité de manière confidentielle.
  ]


  #confidentiality-option(
    checked: true,  // ← mettre true sur l'option choisie
    title: "Le TB n'est pas confidentiel",
     [
      #text(8pt)[
        Outre les informations mentionnées ci-dessus, les documents de présentation du TB
contiennent également le nom de l'entreprise partenaire, le résumé publiable et une affiche. Le
TB peut être consulté sur la plateforme des TB.
      ]
    ],   
  )

  #confidentiality-option(
    checked: false,
    title: "Le TB est confidentiel.",
     [
      #text(8pt)[
        Les conditions suivantes de diffusion des informations sont appliquées :
      ]

      #v(0.15cm)

      #text(8pt)[
        _Aucune consultation ou emprunt du TB n'est permis hormis par
        l'enseignant responsable du TB et le diplômé qui s'engagent à ne pas
        faire usage des informations mises à leur disposition. Le TB porte la
        mention « *confidentiel* »._
      ]

      #v(0.2cm)

      #confidentiality-checkbox(
        checked: false,  // ← true / false selon le cas
         [
          #text(8pt)[
            _Nous acceptons que le *nom de l'entreprise partenaire* figure dans
            les documents publiés (titre, résumé, affiche, etc.), ainsi que
            dans la plateforme de consultation des TB._
          ],
        ],
      )

      #v(0.1cm)

      #confidentiality-checkbox(
        checked: false,
         [
          #text(8pt)[
            _Nous acceptons que *l'affiche* du TB figure sur la plateforme de
            consultation des TB (l'affiche est au préalable validée par
            l'entreprise partenaire)._
          ],
        ],
      )

      #v(0.2cm)

      #text(8pt)[
        Dans tous les cas, un accord de confidentialité doit être signé par le
        diplômé, l'expert et toutes les personnes participant à l'évaluation
        du TB.
      ]
    ],
  )


  *Nous déclarons accepter les conditions de diffusion du Travail de Bachelor
  indiquées.*

  #v(0.3cm)

  #signatures-table(
    ("Diplômant", vars.author.name, vars.date.display("[day]-[month]-[year]")),
    ("Enseignant responsable", vars.professor, vars.date.display("[day]-[month]-[year]")),
    ("Entreprise partenaire", vars.principal, vars.date.display("[day]-[month]-[year]")),
  )

  #v(0.4cm)
  #set text(8pt, style: "italic")
  N.B. : Ce document fait partie intégrante du cahier des charges du TB.
  La forme masculine est utilisée comme genre neutre et désigne à la fois les
  hommes et les femmes.
]
