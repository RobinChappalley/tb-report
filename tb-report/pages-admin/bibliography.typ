#bibliography("../travail-bachelor.bib",
  style: "../assets/apa.csl",
  title: auto,
)
#outline(title: [Liste des figures], target: figure.where(kind: image))
#outline(title: [Liste des tableaux], target: figure.where(kind: table))
#show figure.where(kind: "annexe"): set figure(numbering: "1.1")
#outline(title: [Annexes], target: figure.where(kind: "annexe"))



#figure(
include("../annexes/test-procedure.typ"),
 caption: "Super procédure de test pour benchmarker les services d'optimisation d'images",
 supplement: [Annexe], 
 kind: "annexe"
)<annexe-test-procedure>

#figure(
table(read("../annexes/taille-images.csv")),
 caption: "Détail des images utilisées pour le benchmark",
 supplement: [Annexe], 
 kind: "annexe"
)<taille-images-benchmark>




