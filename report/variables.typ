// ============================================================
// variables.typ — Variables globales du projet
// ============================================================

#let doc-type = "Rapport de pré-étude"
#let title = "Standardiser la gestion des images dans les projets web d'une agence"
#let subtitle = "Étude et conception d'une solution commune, indépendante des technologies utilisées"
#let author = (name: "Robin Chappalley", student-number: "")

#let project-type = "Travail de Bachelor (TB)"
#let study = "Ingénierie des médias"
#let date = datetime.today()
#let city = "Yverdon-les-Bains"

#let principal = "Antistatique"
#let principal-supervisor = "Marc Friederich"
#let principal-adress = "Rue de Genève 90b\n1004 Lausanne"
#let professor = "Loris Gavillet"

#let supervisors = (
  ("Professeur responsable", [#professor]),
  ("Mandant", [#principal, #principal-supervisor, \ #principal-adress]),
)
