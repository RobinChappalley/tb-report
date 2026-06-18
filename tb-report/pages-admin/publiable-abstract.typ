#import "../styles.typ" : page-admin
#import "../variables.typ" as vars


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
