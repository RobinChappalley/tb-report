#import "../styles.typ" : page-admin
#import "../variables.typ" as vars


#page-admin("Post LinkedIn")[
Chaque fois que j'ai lu le titre d'un travail de Bachelor, je l'ai trouvé long et incompréhensible. Je me suis dit que je ferai un titre clair, court, que n'importe qui pourrait comprendre. J'ai échoué. Mon titre est long, technique, et ne veut rien dire pour quelqu'un qui n'est pas dans le domaine. Mes parents décrochent après le troisième mot. Mais je suis fier de mon travail, et je veux partager ce que j'ai appris.

Quand on me demandait le sujet de mon travail, je répondais "l'optimisation d'images" au début. Sauf que chez Antistatique, les images étaient déjà bien optimisées. Le problème était ailleurs: chaque projet web (Drupal, Next, Wordpress) avait sa propre manière de gérer les images sans logique commune. Et ça, c'est un problème pour les développeurs; à chaque projet, il faut redéfinir la même logique. Et le jour où un nouveau format d'image performant sort, mettre à jour tous les projets devient un enfer. Le but de mon travail était donc de standardiser la manière dont les images sont optimisées et livrées au sein de l'agence, pour améliorer l'expérience développeur.

J'ai commencé par faire un benchmark de 3 architectures différentes : un SaaS (Cloudinary), un edge CDN (Cloudflare Images) et un proxy auto-hébergé (imgproxy). Impgroxy est rapidement sorti du lot, car il coûte le même prix, peu importe le volume d'images traitées. Mais aussi parce que c'est une solution open-source, facilement auto-hébergeable, qui n'enferme pas l'agence dans un SaaS. 

Une fois que l'architecture a été choisie, j'en ai fait une preuve de concept, dans des conditions proches de la production. J'ai suivi la documentation et j'ai mis en place imgproxy avec la signature des URLs pour que seuls les sites autorisés puissent utiliser le service.

Sur le papier, tout devait marcher "simplement", mais dans la pratique, il fallait en avoir le coeur net. J'ai donc connecté le service a un projet Wordpress (Eldora) de l'agence, pour confirmer la compatibilité. Quelques cafés plus tard, ça a marché. Un grand ouf de soulagement, je n'ai pas fait tout ça pour rien. En moyenne, les développeurs devraient gagner 1 heure par projet, mais surtout, le processus d'optimisation est centralisé, et donc plus facile à maintenir

J'aimerais sincèrement remercier Antistatique et particulièrement Marc Friederich pour la confiance qu'ils m'ont accordée dès le premier jour, l'accompagnement dont ils ont fait preuve et la liberté qu'ils m'ont laissée pour mener à bien ce travail. Merci également à mon professeur référent, Loris Gavillet, pour ses conseils, son regard critique et son soutien tout au long de ce projet.



PS: Le titre c'est "Standardisation de l’optimisation et de la livraison d’images au sein d’une agence web pour améliorer l'expérience développeur"
]
