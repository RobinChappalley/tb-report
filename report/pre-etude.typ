#import "styles.typ": *
#import "@preview/oxdraw:0.1.0" : *

#page-titre()

#authentification()

#set page(
  paper: "a4",
  margin: (x: 1.8cm, y: 1.5cm),
  numbering: "1 of 1",
  number-align: center + top,
footer : context{ "HEIG-VD – COMEM  – " + doc-type + " - Avril 26" + " " + counter(page).display();

},
header: [
    #grid(
      columns: (1fr, 1fr),
      align: (left, right),
      gutter: 0pt,
      grid.cell(image("./images/HEIG-VD_logotype-baseline_rouge-rvb.png", width: 3cm)),
    )
  ]
  
)

#let appendix(body) = {
  set heading(numbering: "A", supplement: [Annexe])
  counter(heading).update(0)
  body
}

#set heading(numbering: "1.")
#show: doc => conf(doc)

//Début du rapport

== Mandant



Antistatique est une agence web lausannoise spécialisée dans la conception, le développement et la maintenance de produits digitaux. L'équipe, composée de quatre designers et six développeurs, livre une vingtaine de projets par an, majoritairement pour des organisations publiques et parapubliques telles que l'Université de Lausanne, la Ville de Vernier ou la Cinémathèque suisse. Une part plus restreinte de l'activité concerne des mandats privés (stratégie de marque, campagnes marketing, développement sur mesure).

Cette typologie de clientèle implique une diversité importante de stacks techniques et d'infrastructures d'hébergement, chaque mandat reposant sur les contraintes propres au commanditaire. Pour travailler malgré cette hétérogénéité, l'équipe s'appuie sur les standards du web, qui constituent un socle commun à tous les projets, et entretient une veille technique active.



/* #oxdraw(
  read("diagrams/architecture.mmd"), 
  background: "#f0f8ff",
  overrides: (
    node_styles: (
      User: (fill: "#ffff99", stroke: "#333333", text: "#000000"),
      Client1: (fill: "#ff99ff", stroke: "#333333", text: "#000000"),
      Client2: (fill: "#ff99ff", stroke: "#333333", text: "#000000"),
      Nginx: (fill: "#ffb347", stroke: "#333333", text: "#000000"),
      ImgProxy: (fill: "#9999ff", stroke: "#333333", text: "#000000"),
      S3: (fill: "#99ff99", stroke: "#333333", text: "#000000"),
      LocalStorage: (fill: "#99ff99", stroke: "#333333", text: "#000000"),
      note1: (fill: "#eeeeee", stroke: "#333333", text: "#000000")
    )
  )
) */


//Mettre l'accent sur la culture d'entreprise, les valeurs et l'approche unique 





== Problématique
#question("Comment le mandant présente-t-il sa problématique dans son contexte?")
#objectif("Expliquer la problématique du mandant de manière structurée et contextualisée. Montrer en quoi les compétences en ingénierie des médias sont a priori pertinentes pour y répondre.")
#contenu-attendu("1 page. Résumé de la situation actuelle et des développements demandés par le mandant. À quel besoin devra répondre ce projet ? Quelles compétences seront nécessaires et pourquoi?")
Début mai 2026, l'agence compte :
- 5 projets next sur Vercel, qui utilisent le redimensionnement natif de Vercel. Sur l'année dernière, 2,406 milions de redimensionnements d'images ont été effectués
- X projets chez infomaniak qui utilise ....
- X projets chez ... qui utilise 
- 1 
Cette liste est non exhaustive et représente environ 80% de l'activité. Le problème est double: 

1.  Pour optmiser les performances et améliorer les SEO de ses clients, l'agence procède de plusieurs manières pour que l'image servie à l'utilisateur final soit la plus légère et dans un format accepté par son navigateur. Cette non-standardisation génère du travail supplémentaire, écrire de la documentation et adapter le workflow à chaque client/stack technologique. Antistatique n'a pas de moyen efficace pour valider que les formats générés sont réellement utilisés.

2.  Les solutions clés en main utilisées par l'agence la rend dépendante à des fournisseurs tiers. Ces fournisseurs facturent habituellement la bande passante et le nombre de requêtes traitées, ce qui rend les coûts d'hébergement difficiles à maîtriser. Bien qu'aujourd'hui les montants en jeu représentent quelques dizaines de francs par mois, avoir la totale maîtrise des coûts de la gestion des images peut être présenté comme un avantage concurentiel par Antistatique.



d'une part, les clients stockent leurs images avec leur hébergeur, soit plusieurs....? Aujourd'hui, l'agence gère les différentes tailles d'images comme suit : Des tailles fixes sont définies dans le code (3:2, 4:3, etc) ainsi que des formats (jpg, webp). Lorsqu'un client upload une image, un script s'exécute et génère les différentes tailles d'images. Ces images sont stockées chez l'hébergeur. Les développeurs front-end utilisent la balise Picture @HTMLPictureElement2026 avec dans l'ordre : 
1. Une image dans un format léger (avif ou webp) avec des règles CSS pour choisir la version

Le problème, c'est que c'est chiant d'écrire du code pour générer des tailels d'image. Et on sait pas quelles images sont vraiment utilisées au final, et lesquelles ne servent à rien. Il y a un script qui définit des ratios d'image présents dans la page et les différentes largeurs.

par exemple : @pictureTag





#pagebreak()

== Recherches

Dans le monde du web, il y a peu de littérature scientifique qui définit qu'une manière de faire est meilleure qu'une autre. Le développeur qui décide d'implémenter une solution plutôt qu'une autre fait des choix, en fonction de différentes contraintes, qu'il pondère pour choisir la solution la plus adaptée. 






2 points : 
- Importance d'avoir des images optimisées 
- Importance d'avoir un processus standardisé 

Sources communes du web: Doc MDN, https://web.dev/.

Pertinentes car très souvent mises à jour. Source faites par les gens qui font des navigateurs, élément qui est responsable du rendu des images

#question("Quelles sources ai-je identifiées pour comprendre la problématique? En quoi sont-elles pertinentes?")
#objectif("Exposer synthétiquement les recherches menées pour analyser la problématique")
#contenu-attendu("1-2 pages. Description de ce que vous avez appris, provenant de différentes sources, et qui vous a permis de mieux comprendre la problématique, de la contextualiser par rapport à l’écosystème de votre mandant et de la transformer en besoins")

#pagebreak()
== Besoins
Dans le cas d'Antistatique, il y a deux contraintes. 
- Être aussi indépendant que possible des fournisseurs, en maintenant le même niveau de disponibilité qu'actuellement.
- Avoir un produit qui s'adapte à toutes les stacks technologiques, actuelles et futures.



#question("Qu’ai-je appris de l’analyse des sources identifiées? Quels liens ai-je établis entre plusieurs sources pour en tirer des conclusions utiles sur les besoins du mandant?")
#objectif("Exposer synthétiquement la traduction de la problématique en besoins clairs, précis et structurés. Montrer les liens entre la recherche documentaire, l’analyse et les besoins.")
#contenu-attendu("1-2 pages. Liste des besoins et argumentaire expliquant en quoi l’analyse menée à partir de vos recherches documentaires a permis de définir cette liste.")
#pagebreak()

== Objectifs et livrables
Documentation sur comment utiliser, comment ça a été déployé et comment le mettre en place sur d'autres sites.
#question("Comment mon travail est-il organisé? ")
#table([

- semaine 1: 
- semaine 2:
- semaine 3:
- semaine 4: 
- semaine 5:
- semaine 6:
])
#objectif("Formuler clairement et synthétiquement les objectifs de développement, les tâches et les livrables associés, ainsi que la manière dont ces éléments s’articulent dans un planning crédible.")
#contenu-attendu("1-2 pages. Objectifs découpés en tâches et en livrables. Description synthétique des livrables. Planning crédible, dont on décrira les principales étapes directement dans le rapport, avec une version complète en annexe.")
#pagebreak()

== Compétences

=== Valeur ajoutée :
- Facilite l'onboarding de nouveau employés
- Permet à Antistatique de devenir indépendant des PAAS et de leurs changements de prix, de politique ou autre.


=== Compétences mobilisées :
- Technologie web
- Gestion de projet et du changement (adoption par les équipes)
- Développement d'application
- Intégration d'un service tiers au sein d'un processus existant

#question("Quelle est la valeur ajoutée pour le mandant de mon travail?")
#objectif("Démontrer la valeur ajoutée que votre travail apportera au mandant: la nature des tâches, leur complexité et leur diversité, en lien avec les compétences multidisciplinaires de l’ingénierie des médias.")
#contenu-attendu("1 page. Argumentaire permettant de comprendre en quoi votre travail apporte de la valeur ajoutée et quelle est cette valeur (technique, conceptuelle, analytique, marketing, autre)? Quel est le degré de mobilisation de vos compétences en ingénierie des médias?")
#pagebreak()

== Risques

Attention à "protéger" l'endpoint, sinon les gens vont se mettre à l'utiliser pour faire tout et n'importe quoi (créer une UI pour ajouter les sites autorisés ?)
#question("Quels sont les facteurs de risque du projet? Comment les prévenir et les atténuer s’ils surviennent ? ")
#objectif("Proposer une matrice des risques (risque, mesure de prévention, mesure de correction, degré) cohérente et pertinente en fonction du contexte du TB et du mandant")
#contenu-attendu("1 page Matrice des risques et commentaire court sur les points nécessitant davantage d’explications (Selon les contextes, certains risques ne sont pas évidents et doivent être expliqués).")
#pagebreak()

== Conclusion
#question("1-2 pages. En prenant du recul, qu’ai-je appris? Que ferai-je différemment? Quelles sont les limites de mon approche et du contexte dans lequel s’est déroulée cette pré-étude?")
#objectif("Démontrer des capacités d’analyse de son propre travail, des choix pris et de son évolution professionnelle.")
#contenu-attendu("Une première partie présente les principaux éléments découverts (analyse) et résume brièvement les limites, les défis et les choix effectués. Une deuxième partie, plus personnelle, rend compte, de manière réflexive, du déroulement de la pré-étude.")





#pagebreak()

#outline(target: heading.where(supplement: [Annexe]), title: [Annexes])

#show: appendix

== Code avec la balise picture <pictureTag>

#figure(
```html
<picture>
 <source type="image/webp" 
srcset="https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_256x154/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=cxoRUVZH 256w,
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_384x230/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=BBNjNnkT 384w, 
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_690x414/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=nAipFH2_ 690w, 
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_750x450/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=vHHT8gqI 750w, 
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_828x497/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=bLlh56QY 828w, 
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_1080x648/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=WE0s6VXz 1080w,
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_1400x840/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=GIDqcKq- 1400w, 
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_1920x1152/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=fhzMzAm0 1920w,
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_2048x1229/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=rQCkwrSh 2048w,
https://www.frc.ch/sites/default/files/styles/frc_webp_5_3_3840x2304/public/2026-04/pexels-szafran-32028869.jpg.webp?itok=VD7_Jvai 3840w"
sizes="(min-width: 1940px) 501px, (min-width: 1280px) calc(29.22vw - 60px), (min-width: 960px) calc(33.33vw - 76px), calc(33.13vw - 53px)">
  <source type="image/jpg" 
srcset="https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_256x154/public/2026-04/pexels-szafran-32028869.jpg?itok=z6eaPvTh 256w,
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_384x230/public/2026-04/pexels-szafran-32028869.jpg?itok=cTiVZoQS 384w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_690x414/public/2026-04/pexels-szafran-32028869.jpg?itok=tuQf6bTj 690w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_750x450/public/2026-04/pexels-szafran-32028869.jpg?itok=S1R2qZnN 750w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_828x497/public/2026-04/pexels-szafran-32028869.jpg?itok=FYkyOZlF 828w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_1080x648/public/2026-04/pexels-szafran-32028869.jpg?itok=O-lcvyzb 1080w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_1400x840/public/2026-04/pexels-szafran-32028869.jpg?itok=zp6U1OOz 1400w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_1920x1152/public/2026-04/pexels-szafran-32028869.jpg?itok=Ennm_aoY 1920w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_2048x1229/public/2026-04/pexels-szafran-32028869.jpg?itok=HVGzTVsG 2048w, 
 https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_3840x2304/public/2026-04/pexels-szafran-32028869.jpg?itok=7jCS1LeC 3840w" 
 sizes="(min-width: 1940px) 501px, (min-width: 1280px) calc(29.22vw - 60px), (min-width: 960px) calc(33.33vw - 76px), calc(33.13vw - 53px)">
  <img alt="champ de céréales" src="https://www.frc.ch/sites/default/files/styles/frc_jpg_5_3_750x450/public/2026-04/pexels-szafran-32028869.jpg?itok=S1R2qZnN" 
  sizes="(min-width: 1940px) 501px, (min-width: 1280px) calc(29.22vw - 60px), (min-width: 960px) calc(33.33vw - 76px), calc(33.13vw - 53px)" loading="eager" fetchpriority="high" class="object-cover object-center size-full">
</picture>
```,
caption: "Un exemple de code avec la balise picture")


#bibliography("travail-bachelor.bib")


