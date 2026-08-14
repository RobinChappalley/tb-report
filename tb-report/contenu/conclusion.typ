= Conclusion

Le choix d’une solution de traitement d’images engage davantage qu’un outil : il détermine aussi la manière dont Antistatique souhaite intégrer, exploiter et faire évoluer un service partagé. Les résultats obtenus permettent désormais de prendre position sur cette décision et d’en proposer une trajectoire concrète.

== Réponse à la problématique et recommandation

Au terme de ce travail, Antistatique devrait poursuivre la mise en place d’un service mutualisé fondé sur imgproxy. Cette architecture répond directement au besoin initial : disposer d’un mécanisme de traitement d’images commun aux différentes stacks et placé sous le contrôle de l’agence.

Le faible écart entre les résultats du benchmark montre que cette recommandation ne découle pas d’une supériorité absolue d’imgproxy. Elle repose sur un choix d’orientation. Cloudinary privilégie la simplicité, Cloudflare la diffusion géographique et imgproxy la maîtrise du service. Dans le contexte d’Antistatique, cette maîtrise et la possibilité de partager une même infrastructure entre plusieurs projets justifient d’accepter une charge d’exploitation plus importante.

Le principal risque se situe désormais moins dans la capacité d’imgproxy à transformer des images que dans la manière dont Antistatique organisera ce service. Une infrastructure mutualisée devient un composant commun à plusieurs projets : elle doit avoir un responsable identifié, une procédure de maintenance, une supervision et des règles de disponibilité. Sans cette organisation, le recours à un fournisseur externe resterait plus rationnel. Avec elle, imgproxy peut devenir une brique de plateforme utile à l’ensemble de l’agence.

La standardisation devra également porter sur l’interface proposée aux projets. Si chaque application construit directement des URL propres à imgproxy, Antistatique remplacera en partie sa dépendance à Vercel par une dépendance à la syntaxe et aux mécanismes d’imgproxy. L’agence devrait plutôt définir son propre contrat de transformation : une manière commune d’indiquer la source, les dimensions ou le preset attendu, puis des adaptateurs chargés de produire l’URL signée correspondante.

Cette couche d’abstraction pourrait prendre la forme de bibliothèques partagées pour PHP et JavaScript, complétées par un point de signature exécuté côté serveur lorsque la stack l’exige. Les applications dépendraient alors d’une interface maîtrisée par Antistatique, tandis qu’imgproxy resterait une implémentation remplaçable. Une évolution ultérieure vers un service SaaS ou une architecture distribuée demanderait principalement d’adapter cette couche, plutôt que de reprendre chaque projet séparément.

== Perspectives pour Antistatique

Avant d’engager ce premier pilote, Antistatique devra définir la manière dont le service s’intègre à la phase de développement. Le PoC sur Eldora s’appuyait sur un projet déjà constitué et sur des images de production accessibles publiquement. Il n’a donc pas couvert le démarrage d’un nouveau projet, l’utilisation d’images disponibles uniquement dans un environnement local ni le travail lorsque l’instance partagée est indisponible.

Plusieurs approches pourraient être étudiées : exécuter une instance locale d’imgproxy avec le projet, mettre à disposition un environnement de développement partagé ou prévoir un repli vers les images originales ou des contenus temporaires. Ce choix devra également préciser comment les développeurs obtiennent la configuration et les secrets nécessaires, puis comment les erreurs de transformation leur sont présentées.

Cette réflexion fait partie intégrante de la standardisation recherchée. Une infrastructure performante en production n’améliorera réellement l’expérience développeur que si elle reste simple à initialiser, à utiliser et à diagnostiquer pendant toute la réalisation du projet. Ce fonctionnement devra donc être conçu et testé avec les développeurs avant de faire d’imgproxy un mécanisme commun aux nouveaux projets.


#figure(
  image("../assets/figures/timeline.png"),
caption:"Déploiement progressif d’imgproxy en trois phases",
)

Une fois ce mode de fonctionnement défini, la suite devrait commencer par un projet WordPress à risque maîtrisé, dans un environnement de préproduction. Le PoC fournit déjà les mécanismes nécessaires à cette première intégration. Cette étape permettrait de sécuriser les secrets, d’ajouter la supervision et le repli en cas de panne, puis d’observer le comportement du service sur une période plus longue.

Après cette première mise en situation, Antistatique pourrait intégrer imgproxy par défaut dans quelques nouveaux projets WordPress. Les nouvelles réalisations constituent un meilleur terrain d’adoption que les migrations motivées uniquement par une éventuelle économie. Elles permettent d’introduire directement l’interface commune et de mesurer le temps réellement économisé par rapport à une implémentation propre au projet.

L’intégration Next.js devrait constituer l’étape suivante. Le travail réalisé sur Luxury Tribune a permis d’identifier le point à résoudre : la signature doit être produite dans un contexte exclusivement serveur. La conception d’un adaptateur répondant à cette contrainte permettrait de vérifier que la même plateforme peut effectivement servir WordPress et Next.js. Une intégration avec Image Styles Builder pourrait ensuite être étudiée pour Drupal, afin de relier le service commun aux pratiques déjà établies dans cet écosystème.

La décision de généraliser imgproxy devrait finalement reposer sur son utilisation dans plusieurs projets représentatifs. Antistatique pourrait alors mesurer le temps d’intégration, le taux d’utilisation du cache, la disponibilité, le temps consacré à l’exploitation et le coût complet du service. Ces données permettraient de déterminer si la mutualisation produit réellement le gain organisationnel recherché.

Le principal apport de ce travail pour Antistatique réside donc dans la possibilité de poursuivre sans repartir de zéro. L’agence dispose d’une orientation architecturale, d’une première infrastructure, de mécanismes d’intégration et d’une liste précise des éléments à consolider. La suite recommandée consiste à transformer progressivement ce PoC en service de plateforme, puis à décider de sa généralisation à partir de son usage réel.

À terme, l’enjeu dépasse le choix d’imgproxy. La véritable standardisation sera atteinte lorsque Antistatique pourra faire évoluer ou remplacer son mécanisme de traitement d’images depuis un point commun, sans devoir reconstruire cette logique dans chaque projet.

== Bilan personnel

