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




#page-admin("Réusmé publiable")[
Département : #vars.department

Filière : #vars.faculty

Etudiant : #vars.author.name

Enseignant responsable : #vars.professor

#vars.project-type #vars.academic-year


   #let signataires = (
  ("Étudiant", vars.author.name),
  ("Enseignant responsable", vars.professor),
  ("Répondant externe", vars.principal-supervisor),
)

#table(
  columns: (auto, 1fr, 1fr),
  align: left + top,
  inset: 10pt,
  ..signataires.map(((role, nom)) => (
    [*#role* \ #nom],
    [Date et lieu :],
    [Signature :],
  )).flatten()
)

Le super contenu ira ici !

600 à 2000 caractères, espaces compris.]
