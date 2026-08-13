#import "@preview/codly:1.3.0": *
#show: codly-init
#import "@preview/codly-languages:0.1.1": *
#show figure: set block(breakable: true)


#codly(
  stroke: 0.5pt + rgb("#e2e8f0"),
  fill: rgb("#f8fafc"),
  number-format: n => text(fill: gray.lighten(30%), size: 6pt)[#n],
  languages: codly-languages,
  breakable: true,
)

#bibliography("../travail-bachelor.bib",
  style: "../assets/apa.csl",
  title: auto,
)
#outline(title: [Liste des figures], target: figure.where(kind: image))
#outline(title: [Liste des tableaux], target: figure.where(kind: table))
#show figure.where(kind: "annexe"): set figure(numbering: "1.1")
#outline(title: [Annexes], target: figure.where(kind: "annexe"))

#pagebreak()

#figure(
include("../annexes/test-procedure.typ"),
 caption: "Super procédure de test pour benchmarker les services d'optimisation d'images",
 supplement: [Annexe], 
 kind: "annexe"
)<annexe-test-procedure>

#pagebreak()

#let imagesizestable = csv("../annexes/taille-images.csv", delimiter:";")
#figure(
table(
  columns :3,
  inset: 6pt,
    ..imagesizestable.flatten(),
   ),
 caption: "Détail des images utilisées pour le benchmark",
 supplement: [Annexe], 
 kind: "annexe"
)<taille-images-benchmark>

#pagebreak()
#figure(
  raw(read("../annexes/test-script.sh"),block:true, lang: "bash"),
 caption: "Script de test pour comparer les services d'optimistation d'images",
 supplement: [Annexe], 
 kind: "annexe",
)<test-script-procedure>
#pagebreak()
#figure(
include("../annexes/normalisation.typ"),
 caption: "Calculs normalisés pour comparer les services d'optimisation d'images",
 supplement: [Annexe], 
 kind: "annexe"
)<annexe-normalisation-kpi>

#pagebreak()

#figure(
  raw(read("../annexes/docker-compose.yaml"), block:true, lang: "yaml"),
  caption: "Fichier Docker compose du PoC imgproxy",
  supplement: [Annexe],
  kind : "annexe"
)<docker-compose.yaml>

#pagebreak()

#figure(
  raw(read("../annexes/nginx.conf"), block:true, lang: "nginx"),
  caption: "Fichier de configuration nginx du PoC imgproxy",
  supplement: [Annexe],
  kind : "annexe"
)<nginx.conf>

