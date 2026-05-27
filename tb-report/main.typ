// main.typ — point d'entrée Typst généré à partir du template LaTeX
// Importe les variables, styles et la page de titre

#import "variables.typ": *
#import "styles.typ": *
#import "title_page.typ": *

// Affiche la page de titre (utilise la fonction définie dans styles.typ)
#page-titre(
  titre: title,
  sous-titre: subtitle,
  type-doc: doc-type,
  auteur: author,
  superviseurs: supervisors,
  type-projet: project-type,
  filiere: study,
  ville: city,
  date-doc: date,
)

// Page d'authentification (macro définie dans styles.typ)
#authentification()

// --- Table des matières et listes (à générer/peaufiner selon Typst)

// TODO: convertir abstract.tex, introduction.tex, examples.tex, conclusion.tex en .typ
// et les inclure ci-dessous. Exemples de structure :

// == Résumé
[// Insérer le contenu du résumé]
// == Table des matières
[// Utiliser la génération automatique de la table des matières selon le workflow Typst]

// == Contenu principal
// == Introduction
[// Insérer le contenu de introduction.typ]

// == Conclusion
[// Insérer le contenu de conclusion.typ]
