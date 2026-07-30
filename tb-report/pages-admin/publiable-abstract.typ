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

== Contexte
L'agence web Antistatique réalise des plateformes sur mesure basées sur divers écosystèmes (WordPress, Drupal, Next.js). Pour alimenter le design adaptatif (_responsive design_), les CMS pré-génèrent actuellement jusqu'à plusieurs dizaines de variations de taille chaque fois qu'un client téléverse une image. Ce mécanisme consomme inutilement du stockage serveur pour des déclinaisons parfois jamais affichées et oblige l'agence à maintenir des configurations de redimensionnement spécifiques à chaque technologie.
== Objectif
Ce travail vise à standardiser le traitement des images au moyen d'une architecture agnostique. La première phase compare trois approches (SaaS, Edge CDN, proxy auto-hébergé). La deuxième déploie une preuve de concept sur un projet réel. La dernière phase fournit un connecteur permettant d'intégrer la solution dans l'écosystème WordPress de l'agence.
== Résultats
Le benchmark retient l'outil open-source ``` imgproxy```, placé derrière un serveur reverse-proxy Nginx configuré pour la mise en cache HTTP. Les images sont désormais générées uniquement à la demande de l'utilisateur final. L'architecture élimine la pré-génération d'images à l'upload, réduit l'espace disque consommé et garantit des coûts d'infrastructure prévisibles, indépendants du volume de médias transformés. En supprimant la configuration manuelle du redimensionnement sur chaque CMS, la solution améliore l'expérience développeur (DX) et fait gagner environ 1 heure d'intégration par projet.]