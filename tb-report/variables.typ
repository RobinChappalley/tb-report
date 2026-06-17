// ============================================================
// variables.typ — Variables globales du projet
// ============================================================

#let doc-type = "Rapport de travail de Bachelor"
#let title = "Standardiser la gestion des images dans les projets web d'une agence"
#let subtitle = "Étude et conception d'une solution commune, indépendante des technologies web utilisées"
#let author = (name: "Robin Chappalley")

#let project-type = "Travail de Bachelor"
#let date = datetime.today()
#let city = "Yverdon-les-Bains"

#let department = "COMEM+"
#let faculty = "Ingénierie des médias"

#let principal = "Antistatique"
#let principal-supervisor = "Marc Friederich"
#let principal-adress = "Rue de Genève 90b\n1004 Lausanne"
#let professor = "Loris Gavillet"

#let supervisors = (
  ("Professeur responsable", [#professor]),
  ("Mandant", [#principal, #principal-supervisor, \ #principal-adress]),
)

#let academic-year = str(datetime.today().year()-1) + "-" + str(datetime.today().year())
