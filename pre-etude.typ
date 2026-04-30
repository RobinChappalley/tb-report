#import "styles.typ": *

#page-titre()

#authentification()

#set page(
  paper: "a4",
  margin: (x: 1.8cm, y: 1.5cm),
  numbering: "1 of 1",
  number-align: center + top,
footer : context{ "HEIG-VD – COMEM  – Rapport de pré-étude - Avril 26" + " " + counter(page).display();

},
header: [
    #grid(
      columns: (1fr, 1fr),
      align: (left, right),
      gutter: 0pt,
      grid.cell(image("images/HEIG-VD_logotype-baseline_rouge-rvb.png", width: 3cm)),
    )
  ]
  
)
#show: doc => conf(doc)

//Début du rapport

== Antistatique

Antistatique est une agence web basée à Lausanne. Elle propose différents services, du design de sites web jusqu'au développement web et à la maintenance. TODO----- son approche unique est.... Avec une équipe de 4 designers et 6 développeurs, l'agence réalise X projets par année,principalement pour des organisation publiques ou parapubliques, comme l'université de Lausanne, la Ville de Vernier ou la cinémathèque Suisse. Elle accompagne aussi des entreprises privées pour de la stratégie de marque, des campagnes marketing et du développement web sur mesure.



//Mettre l'accent sur la culture d'entreprise, les valeurs et l'approche unique 



#objectif("Permettre au lecteur d'entrer pleinement dans le contexte et de situer précisément la problématique.")
#contenu-attendu("1/2 page. Description du contexte professionnel (taille et organisation de l’entreprise/du service, activité, rôle du la mandant, situation du marché, etc.) en lien direct avec le sujet.")


== Problématique

== Recherches

== Recherches

== Besoins

== Objectifs et livrables

== Compétences

== Risques

== Conclusion





#pagebreak()

#bibliography("travail-bachelor.bib")