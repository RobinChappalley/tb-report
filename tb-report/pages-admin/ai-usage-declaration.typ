#import "../styles.typ" : page-admin
#import "../variables.typ" as vars

#let ai-tools = (
  ("Claude Opus 4.8", "6", "Traduction du rapport word en typst"),
  ("Qwen 3.6 plus", "5", "Retranscription du bilan intermédiaire"),
  ("Uniscribe","5","Retranscription de l'entretien avec Christian Stucki"),
  ("Gemini 3.1 Pro", "6", "Elaboration d'un script de test"),
  ("Claude Opus 4.8", "6", "Glissement du modèle besoin/KPI vers le modèle filtre/critères de décision pondérés"),
  ("Gemini 3.5 Flash", "1","Définition du titre" ),
  ("Gemini 3.1 Pro", "2", "Découpage de l'intégration à un projet existant"),


  // ajoute tes lignes ici au fil du TB
)

#page-admin("Déclaration relative à l'usage de l'intelligence artificielle générative")[
  #set par(justify: true)

  *ATTENTION* : Les rapports de TB qui ne sont pas accompagnés de cette
  page signée seront renvoyés sans évaluation.

  #v(0.5cm)

  Je, soussigné, #vars.author.name, atteste par la présente avoir utilisé,
  pour ce travail de Bachelor (TB), des outils d'intelligence artificielle
  générative (IA) uniquement à des fins de soutien, en conservant la
  maîtrise intellectuelle et la pleine responsabilité de son contenu. Plus
  précisément, j'atteste avoir eu recours aux outils d'IA suivants :

  + Appui rédactionnel : correction orthographique, reformulation à un
    niveau de langage approprié, synthèse, vérification de la cohérence
    globale du document.
  + Appui méthodologique : clarification des objectifs, structuration,
    organisation du plan, formulation des hypothèses, synthèse et
    comparaison de données.
  + Outil de réflexion : identification des enjeux ou des parties
    prenantes, exploration de concepts, identification et résumé de
    ressources pertinentes.
  + Outil de traduction.
  + Retranscription : fichiers audio ou vidéo, synthèse des données.
  + Autre, précisez

  #v(0.3cm)



  #v(0.2cm)

  #table(
    columns: (auto, auto, 1fr),
    align: left + horizon,
    table.header(
      [*Service utilisé*], [*But*], [*Chapitre / résultat concerné*],
    ),
    ..ai-tools.map(((service, but, chapitre)) => (
      [#service], [#but], [#chapitre],
    )).flatten()
  )

  #v(0.5cm)

  Par ma signature, j'atteste #underline[une absence totale] de recours aux outils
  d'IA pour les usages prohibés suivants :

  - *Usage en tant que source* : génération de contenu en déléguant la
    maîtrise intellectuelle, utilisation de contenus générés sans en
    assumer la responsabilité, reprise directe de contenus produits par l'IA.
  - *Atteinte à l'intégrité académique* : création de données fictives,
    utilisation de données falsifiées ou non référencées.
  - *Non-respect de la confidentialité : intégration de données
    confidentielles, sensibles ou appartenant à autrui, notamment à votre
    mandant.*

  #v(0.3cm)

  Je reconnais avoir pris connaissance du fait que toute atteinte à cette
  déclaration peut entraîner des conséquences académiques, allant jusqu'aux
  sanctions prévues par le règlement HES-SO sur la formation de base en cas
  de fraude (art. 36 et 37), incluant notamment l'attribution de la note 1.0
  au module concerné, l'invalidation du titre ou des sanctions
  disciplinaires (avertissement, exclusion temporaire ou définitive).

  #v(1cm)

  Nom : #vars.author.name #h(2cm) Date : #vars.date.display("[day]-[month]-[year]")

  #v(1cm)

  Signature #line(length: 40%, stroke: 0.1mm)
]

