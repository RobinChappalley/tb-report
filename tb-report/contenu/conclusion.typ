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

Mon bilan personnel est mitigé. Le résultat technique est utile, mais moins abouti que ce que j’aurais souhaité. En rédigeant les perspectives pour Antistatique, j’ai pris conscience du nombre de sujets qui pourraient encore être approfondis : l’utilisation du service pendant le développement, son exploitation en production, l’intégration avec Next.js ou encore son adoption dans plusieurs projets. Le travail disposait toutefois d’un cadre de dix semaines. La démarche suivie me paraît finalement plus réussie que le résultat technique pris isolément.

Je suis fier d’avoir dépassé le stade de la comparaison théorique pour intégrer imgproxy dans un projet WordPress existant. Eldora possédait déjà son contenu, ses templates et ses différentes voies de rendu des images. L’intégration m’a donc confronté à un projet réel, avec des comportements que je n’avais pas tous anticipés. Le service reste à qualifier pour la production, mais les étapes nécessaires sont maintenant identifiées et la poursuite du travail me paraît réaliste.

La tentative d’intégration dans Luxury Tribune constitue la partie la plus frustrante du projet. J’ai consacré environ une semaine et demie à explorer des différences entre plusieurs versions de Next.js sans comprendre que mon modèle mental du problème était incomplet. Le blocage provenait de la frontière entre les composants serveurs et clients, et non de la version de Next.js ou d’une incompatibilité avec imgproxy.

Avec le recul, j’aurais dû solliciter plus tôt l’aide d’une personne maîtrisant Next.js. Mon erreur n’était pas de ne pas connaître immédiatement la réponse : je termine mes études et je ne peux pas déjà maîtriser toutes les technologies rencontrées. Elle était plutôt de ne pas avoir reconnu assez rapidement que l’investigation nécessitait un autre regard. Cette expérience a fait évoluer ma conception de l’autonomie. Être autonome ne signifie pas résoudre seul chaque problème, mais aussi savoir identifier le moment où demander de l’aide devient la manière la plus efficace d’avancer.

Cette période m’a également confronté à la difficulté de rendre visible le travail d’exploration. Une fois la cause du blocage connue, reproduire une partie des essais ou mettre en œuvre la solution pourrait ne demander que quelques heures. Le chemin qui permet d’identifier cette cause est beaucoup plus long. Cette différence reste frustrante, car le résultat final ne reflète pas directement le temps investi.

J’en retiens néanmoins qu’un travail d’ingénierie ne se mesure pas uniquement à la quantité de code produite ni au temps nécessaire pour reproduire une solution déjà connue. Écarter de fausses hypothèses, identifier une contrainte d’architecture et documenter une voie qui n’a pas abouti réduisent aussi l’incertitude pour la suite. Dans mon cas, cette exploration a permis de transformer un blocage mal compris en une exigence précise : une future intégration Next.js devra produire la signature dans un contexte exclusivement serveur. Une sollicitation plus rapide d’un spécialiste aurait cependant permis d’arriver à ce résultat de manière plus efficace.

Une autre difficulté a concerné la sélection des informations à faire apparaître dans le rapport. Comme j’avais suivi chaque étape du travail, certains éléments me semblaient évidents alors qu’ils ne le seraient pas nécessairement pour une personne extérieure au projet. À l’inverse, j’avais parfois envie de décrire une piste en détail parce qu’elle m’avait demandé beaucoup de temps, même lorsqu’elle contribuait peu à la compréhension du résultat final.

J’ai donc dû arbitrer en permanence entre deux risques : omettre une explication nécessaire ou noyer le raisonnement principal sous des détails techniques. J’ai essayé de conserver ce qui permet de comprendre les décisions, d’évaluer les résultats et d’en juger les limites, puis de déplacer certains éléments dans les annexes. Cet exercice m’a aussi obligé à distinguer l’importance d’une information pour le lecteur de l’effort que j’avais personnellement consacré à la produire.

J’ai aujourd’hui l’impression que le rapport peut être compris sans explication supplémentaire, mais seul le retour de personnes qui n’ont pas suivi le projet permettra de confirmer que le niveau de détail est adapté. Cette incertitude reflète aussi mon expérience encore limitée dans la rédaction de documents techniques de cette ampleur. J’en retiens que transmettre un travail demande de se représenter les connaissances du lecteur, et pas uniquement de maîtriser soi-même le sujet. Lors d’un prochain projet, je chercherais à obtenir plus tôt des retours extérieurs sur la structure et sur le niveau d’explication, plutôt que d’attendre la version presque achevée pour vérifier si le raisonnement se suffit à lui-même.

#figure(
  image("../assets/figures/marc-robin.png", height:15%),
  caption:"Robin discutant avec Marc lors d'un meeting hebdomadaire"
)

La remise en question du modèle de benchmark représente un autre apprentissage important. J’étais initialement parti d’un modèle associant chaque besoin à un KPI. Cette structure me semblait rigoureuse, mais je l’avais adoptée sans avoir suffisamment vérifié si elle correspondait réellement à la décision à prendre. En avançant, j’ai constaté que certains besoins définissaient le périmètre de la solution ou des contraintes d’implémentation et ne pouvaient pas être transformés de manière pertinente en notes.

Les discussions avec l’intelligence artificielle ont joué un rôle dans cette remise en question. Elles m’ont permis de confronter mes hypothèses, de faire apparaître certaines incohérences et de mieux formuler ce qui ne fonctionnait pas dans le premier modèle. L’outil n’a toutefois pas pris la décision à ma place. Il m’a fourni un interlocuteur avec lequel tester mon raisonnement ; la responsabilité d’abandonner le premier modèle, d’en construire un autre et de vérifier sa cohérence m’appartenait.

Je suis particulièrement satisfait d’avoir accepté de revenir sur un travail dans lequel j’avais déjà investi du temps. J’ai compris qu’une hypothèse ou une méthode qui paraît juste à un moment donné peut devoir être révisée le lendemain à la lumière de nouvelles observations. Modifier son approche ne signifie pas que le travail précédent était inutile. Dans ce cas, le premier modèle a permis de faire apparaître ses propres limites et de construire une méthode plus adaptée. Cet apprentissage dépasse le cadre du benchmark : défendre une décision d’ingénierie demande de pouvoir la remettre en cause lorsque les faits ne la soutiennent plus.

La rédaction du rapport m’a également permis de découvrir Typst. Sa prise en main et la configuration initiale m’ont demandé un investissement important. J’ai notamment mis en place la gestion des figures, des tableaux, des références croisées et la synchronisation des sources ajoutées dans Zotero. Une fois ce fonctionnement établi, j’ai pu me concentrer davantage sur le contenu sans devoir reprendre manuellement la mise en forme à chaque modification.

Le format textuel de Typst m’a aussi permis de versionner le rapport avec Git, de comparer les modifications et de revenir facilement à un état précédent. Cette manière de travailler m’a semblé beaucoup plus adaptée à mon fonctionnement que celle d’un traitement de texte classique. La prévisualisation rapide et l’automatisation ont compensé le temps consacré à l’apprentissage initial. Typst correspond également à plusieurs valeurs présentes chez Antistatique : l’outil est open source et conserve le document dans des fichiers texte contrôlés par leur auteur. Cette découverte constitue pour moi un apport durable du Travail de Bachelor.

Si je devais recommencer ce projet, je conserverais la démarche générale, mais je solliciterais plus rapidement une expertise extérieure face à un blocage persistant. Je chercherais également à tester plus tôt les hypothèses d’architecture les plus risquées et à mieux limiter le temps consacré à une piste avant de réévaluer sa pertinence.

Ce travail ne m’a pas conduit jusqu’à un service prêt à être généralisé chez Antistatique. Il m’a en revanche appris à construire puis à réviser une méthode d’évaluation, à faire évoluer un PoC face à un blocage, à distinguer ce qui a été démontré de ce qui reste à vérifier et à documenter honnêtement les limites d’un résultat. Mon principal apprentissage réside dans cette évolution de posture : avancer ne consiste pas à défendre le plan initial jusqu’au bout, mais à savoir le modifier lorsque la compréhension du problème progresse.
