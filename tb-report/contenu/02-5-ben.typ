

#let table-header(text) = {
  strong(text)
}

= Benchmark

Ce chapitre compare trois familles d'architectures capables de centraliser le traitement et la livraison des images : un service SaaS, un service exécuté à la périphérie d'un réseau de diffusion de contenu (edge CDN) et un service auto-hébergé. Le benchmark poursuit deux objectifs. Il doit d'abord rendre visibles les compromis propres à chaque architecture, puis fournir une aide à la décision pour sélectionner la solution à approfondir dans la preuve de concept du chapitre suivant.

La comparaison ne constitue pas une étude exhaustive du marché. Chaque famille est représentée par un service concret afin de pouvoir réaliser des mesures reproductibles. Les conclusions portent donc sur les architectures telles qu'elles sont représentées par ces trois services, et non sur l'ensemble des produits disponibles dans chaque catégorie.

== Construction du modèle de comparaison

=== Architectures et services représentatifs

Les trois architectures retenues répondent toutes au principe de base du travail : recevoir l'URL d'une image source et retourner une version optimisée sans dépendre du CMS ou du framework qui l'appelle. Elles se distinguent surtout par l'emplacement du traitement, le degré de maîtrise laissé à Antistatique et la charge d'exploitation qui en découle (@architectures-benchmark).

#figure(
    table(
      columns: (0.8fr, 0.9fr, 1.8fr, 1.8fr),
      inset: 5pt,
      align: left + horizon,


      table-header([Nom]),
      table-header([Service testé]),
      table-header([Principe]),
      table-header([Compromis principal]),
      [SaaS],
      [Cloudinary],
      [Traitement et diffusion entièrement pris en charge par un fournisseur externe.],
      [Faible charge d'exploitation, mais dépendance au fournisseur et coût récurrent.],
      [Edge CDN],
      [Cloudflare Images],
      [Transformation au sein du réseau Cloudflare, à proximité des utilisateurs.],
      [Bonne couverture géographique, mais couplage à l'infrastructure Cloudflare.],
      [Auto-hébergée],
      [imgproxy],
      [Service déployé et administré par Antistatique, complété par un cache HTTP.],
      [Maîtrise de l'infrastructure et du coût, au prix d'une maintenance interne.],
    )
  ,
  caption: [Architectures représentées dans le benchmark],
  kind: table,
) <architectures-benchmark>

Un service a été choisi dans chaque catégorie selon trois conditions : 
1. La possibilité de l'évaluer sans investissement initial important 
2. L'existence d'une interface fondée sur des URL 
3. Une documentation suffisamment développée pour réaliser le benchmark dans les trois semaines prévues.
 
Ces conditions ont conduit à retenir un service représentatif de chaque famille d’architecture. Cloudinary a été sélectionné pour représenter le modèle SaaS, car il permet de récupérer des images distantes, de leur appliquer des transformations décrites dans l’URL, puis de les diffuser à travers son propre CDN, sans qu’Antistatique doive exploiter l’infrastructure correspondante @CloudinaryImageOptimization2026.

Cloudflare Images a été retenu pour représenter l’architecture edge CDN. Le service accepte également une image distante et des paramètres de transformation dans l’URL, mais son utilisation reste liée à une zone et à l’infrastructure Cloudflare. Il permet ainsi d’évaluer à la fois les avantages d’un traitement distribué géographiquement et le couplage propre à cette famille d’architecture @CloudflareImagesFeatures2026.

Enfin, imgproxy a été choisi pour représenter l’architecture auto-hébergée. Il fonctionne comme un serveur HTTP autonome, peut être déployé avec Docker et reçoit l’image source ainsi que les paramètres de traitement au moyen d’une URL. Il permet donc d’évaluer une solution dans laquelle Antistatique maîtrise le déploiement et les coûts, tout en assumant directement l’exploitation du service @ImgproxyDocumentation.

Cette sélection ne cherche pas à désigner le meilleur produit disponible dans chaque catégorie. Elle vise à disposer de trois implémentations suffisamment représentatives, documentées et accessibles pour comparer concrètement les compromis entre les architectures dans le temps imparti.

=== Premier modèle : un besoin associé à un KPI

La pré-étude avait identifié sept besoins, puis les avait priorisés au moyen d'une matrice MoSCoW. La première méthode envisagée consistait à traduire chaque besoin en un ou plusieurs indicateurs de performance clé (KPI). Une valeur aurait ensuite été attribuée à chaque service pour chaque KPI, avant d'additionner les notes afin d'identifier la meilleure solution (@modele-initial-benchmark).

#figure(
  {
    set text(size: 8.2pt)
    table(
      columns: (1.4fr, 2.4fr, 0.8fr),
      inset: 5pt,
      align: left + horizon,
      table-header([Besoin issu de la pré-étude]),
      table-header([Indicateurs initialement envisagés]),
      table-header([Priorité]),
      [Interopérabilité avec les stacks existantes et futures],
      [Nombre de dépendances ; intégration standard par URL ou intégration propriétaire.],
      [Must],
      [Centralisation de la logique d'optimisation],
      [Modification globale des paramètres ; distribution adaptative du format.],
      [Must],
      [Maîtrise du déploiement et des coûts],
      [Coût total de propriété ; niveau de gestion demandé à Antistatique.],
      [Must],
      [Disponibilité et robustesse],
      [SLA annoncé ; présence d'un mécanisme de fallback.],
      [Must],
      [Performance de livraison],
      [TTFB à cache froid ; TTFB à cache chaud ; ratio entre taille finale et taille originale.],
      [Should],
      [Faible charge d'intégration],
      [Friction d'intégration.],
      [Could],
      [Réversibilité pour les sites clients],
      [Aucun indicateur arrêté.],
      [Could],
    )
  },
  caption: [Première traduction des besoins en KPI],
  kind: table,
) <modele-initial-benchmark>

Ce premier modèle a servi de cadre exploratoire pour préparer les tests. Il reposait toutefois sur une hypothèse trop générale : tout besoin devait pouvoir être traduit en un KPI et contribuer au classement. Lors de la préparation du benchmark et de l'analyse des premiers résultats, plusieurs indicateurs se sont révélés peu discriminants ou inadaptés à la question posée.

L'agnosticité vis-à-vis des stacks et la centralisation, par exemple, ne décrivent pas un avantage relatif : elles définissent le type d'architecture recherché. Une solution qui ne les respecte pas se situe hors du périmètre plutôt qu'en bas d'un classement. Cette condition n'impose pas une indépendance totale vis-à-vis de tout fournisseur : le couplage propre aux architectures SaaS et edge reste évalué par les critères de coût, de gestion et d'intégration. À l'inverse, la disponibilité et la réversibilité dépendent en partie du mécanisme de fallback développé lors de l'intégration. Elles doivent être traitées comme des contraintes d'implémentation, car aucune des trois architectures n'empêche par principe de revenir à l'image originale.

=== Modèle finalement retenu

Le modèle a donc été révisé sans supprimer les besoins de la pré-étude. Leur rôle dans la décision a été clarifié en les répartissant en trois catégories (@modele-final-benchmark) :

- les besoins qui définissent le périmètre de la solution ;
- les contraintes qui devront être respectées lors de l'implémentation ;
- les critères de choix qui permettent effectivement de départager les architectures et auxquels sont associés des KPI.

#figure(
  {
    set text(size: 8.4pt)
    table(
      columns: (1fr, 1.35fr, 1.5fr, 2fr),
      inset: 5pt,
      align: left + horizon,
      table-header([Catégorie]),
      table-header([Besoin]),
      table-header([Rôle dans l'évaluation]),
      table-header([KPI retenus]),
      table.cell(rowspan: 2)[Périmètre],
      [Centralisation de la logique],
      [Objectif commun aux architectures comparées.],
      [Aucun : condition d'inclusion.],
      [Indépendance vis-à-vis de la stack],
      [Condition nécessaire pour entrer dans la comparaison.],
      [Aucun : condition d'inclusion.],
      table.cell(rowspan: 2)[Contrainte d'implémentation],
      [Disponibilité et robustesse],
      [À traiter par la stratégie de fallback et l'exploitation.],
      [Aucun dans le score du benchmark.],
      [Réversibilité],
      [À garantir en conservant l'accès à l'image originale.],
      [Aucun dans le score du benchmark.],
      table.cell(rowspan: 3)[Critère de choix],
      [Performance],
      [Comparer le comportement observé.],
      [TTFB de la première requête ; TTFB des requêtes répétées ; ratio de taille.],
      [Maîtrise du déploiement et des coûts],
      [Comparer la dépense directe et la charge d'exploitation.],
      [Coût direct annuel estimé ; niveau de gestion nécessaire.],
      [Charge d'intégration et DX],
      [Comparer l'effort et le confort d'intégration.],
      [Friction d'intégration ; qualité de la documentation et de la DX.],
    )
  },
  caption: [Répartition finale des besoins d'Antistatique],
  kind: table,
) <modele-final-benchmark>

Cette révision évite d'associer artificiellement une mesure à chaque besoin. Elle sépare aussi le choix de l'architecture de sa validation : le benchmark compare les critères discriminants, tandis que la preuve de concept vérifie ensuite qu'une implémentation réelle satisfait le périmètre et met en évidence les contraintes non résolues.

=== Pondération des critères de choix

Deux collaborateurs d'Antistatique ont réparti indépendamment 40 points entre les sept KPI. La pondération finale correspond à la moyenne de leurs deux propositions (@ponderation-kpi). Cette méthode réduit l'influence d'un jugement individuel et rend explicites les priorités de l'agence.

#figure(
  {
    set text(size: 8.5pt)
    table(
      columns: (2.2fr, 0.8fr, 0.8fr, 0.9fr, 0.8fr),
      inset: 5pt,
      align: (left, center, center, center, center),
      table-header([KPI]),
      table-header([Gilles]),
      table-header([Marc]),
      table-header([Poids final]),
      table-header([Part]),
      [TTFB de la première requête], [5], [2], [3,5], [8,75 %],
      [TTFB des requêtes répétées], [2], [1], [1,5], [3,75 %],
      [Ratio de taille], [5], [2], [3,5], [8,75 %],
      [Coût direct annuel estimé], [6], [12], [9], [22,5 %],
      [Niveau de gestion nécessaire], [8], [10], [9], [22,5 %],
      [Friction d'intégration], [5], [8], [6,5], [16,25 %],
      [Documentation et DX], [9], [5], [7], [17,5 %],
      [*Total*], [*40*], [*40*], [*40*], [*100 %*],
    )
  },
  caption: [Pondération des KPI par deux collaborateurs d'Antistatique],
  kind: table,
) <ponderation-kpi>

La performance représente ainsi 21,25 % du score, les coûts et l'exploitation 45 %, puis l'intégration et la DX 33,75 %. La pondération traduit le fait qu'Antistatique cherche d'abord une solution exploitable durablement, plutôt qu'un gain de quelques millisecondes obtenu au prix d'une charge de maintenance disproportionnée.

== Protocole d'évaluation

=== Échantillon et environnements de test

L'échantillon comprend douze images provenant de cas comparables aux contenus manipulés par l'agence : huit fichiers JPEG et quatre fichiers PNG, dont la taille varie de 1,5 à 16,6 Mo. Il s'agit d'un échantillon de convenance destiné à couvrir plusieurs formats et volumes, et non d'un échantillon statistiquement représentatif. Le détail des fichiers figure en annexe (@taille-images-benchmark).

Une instance WordPress hébergée chez Infomaniak a servi uniquement de serveur d'origine. Les images ont été déposées par FTP afin d'éviter la génération automatique de variantes par WordPress @Big_image_size_thresholdHookDeveloperWordPressorg2020. Les trois services ont ainsi reçu les mêmes fichiers sources.

Le script a été exécuté depuis quatre emplacements : un ordinateur à Lausanne, une VM Infomaniak à Genève et deux VM DigitalOcean situées à New York et à Singapour. Cette répartition permet d'observer l'effet de la distance entre le client, le service de traitement et le serveur d'origine.

Avant chaque série géographique, le chemin de l'image source a été renouvelé au moyen d'un horodatage. Les URL signées d'imgproxy ont également été régénérées. Une variante qui n'avait pas été demandée auparavant était donc utilisée dans chaque lieu de test.

=== Mesures techniques

Le script Bash présenté en annexe (@test-script-procedure) utilise #raw("curl") pour envoyer les requêtes et enregistrer le code HTTP, le type de contenu, la taille téléchargée, le temps jusqu'au premier octet et le temps total. L'option #raw("time_starttransfer") de #raw("curl") fournit la mesure utilisée pour le Time to First Byte (TTFB) @WriteOutEverything. Le TTFB mesure le délai entre le début de la requête et la réception du premier octet de la réponse @TimeFirstByte.

Pour chaque image et chaque lieu, onze requêtes séquentielles ont été effectuées. La première réponse HTTP 200 représente la première transformation d'une variante encore absente du cache. Les réponses suivantes mesurent le comportement lors de requêtes répétées. L'ordre des trois solutions était mélangé à chaque itération et une pause de 0,5 seconde séparait deux requêtes.

Le même en-tête #raw("Accept: image/avif,image/webp,image/apng,*/*;q=0.8") a été transmis aux trois services. Le mode automatique propre à chaque solution a été utilisé : #raw("f_auto") et #raw("q_auto") pour Cloudinary, #raw("f=auto") et #raw("q=auto") pour Cloudflare, puis la négociation de format activée par variables d'environnement pour imgproxy. Le test reproduit ainsi une utilisation par défaut réaliste. Il ne compare pas les encodeurs à qualité visuelle constante, car la notion de qualité automatique diffère d'un fournisseur à l'autre.

=== Coûts, exploitation et intégration

Le KPI financier est limité au *coût direct annuel estimé*. Il ne s'agit pas d'un coût total de propriété complet : le temps humain n'est pas converti en francs, car la charge de maintenance et la friction d'intégration sont déjà évaluées par deux KPI distincts. Monétiser ces heures dans le coût puis les noter une seconde fois aurait donné un poids excessif au même désavantage.

L'estimation est fondée sur le projet Luxury Tribune et sur une hypothèse de 950 000 transformations annuelles. Les temps de mise en place et d'intégration ont été estimés à partir des opérations nécessaires pendant le benchmark. Ils n'ont pas été chronométrés et servent uniquement à documenter l'ordre de grandeur de l'effort.

Les critères qualitatifs utilisent trois échelles ordinales : de 1 à 4 pour le niveau de gestion et la friction d'intégration, puis de 1 à 6 pour la documentation et la DX. Une valeur élevée représente une situation plus favorable. Les notes reposent sur la configuration effectivement réalisée et sur l'examen de la documentation officielle ; elles ne constituent pas une enquête auprès des développeurs d'Antistatique.

=== Traitement des données et calcul des scores

Les colonnes calculées présentes dans les CSV d’origine n’ont pas été réutilisées. Les résultats ont été recalculés à partir du temps jusqu’au premier octet, de la taille téléchargée et du code HTTP. Seules les réponses HTTP 200 ont été retenues.

Deux images ont systématiquement échoué chez Cloudinary. Afin d’éviter que ces échecs soient interprétés comme des fichiers de taille nulle et de comparer les trois solutions sur une base identique, les KPI techniques ont été calculés sur les dix images traitées avec succès par les trois services. La médiane a été retenue pour le TTFB, car elle est moins sensible aux valeurs extrêmes. Le ratio de taille a été calculé pour chaque image, puis moyenné sans pondération afin que chaque fichier contribue de manière égale.

Les KPI étant exprimés dans des unités différentes, leurs résultats ont été convertis sur une échelle commune allant de 1 à 10. Quelle que soit la nature du KPI, une note élevée représente toujours une situation favorable.

Le TTFB est évalué à partir de seuils fixes. Une valeur inférieure ou égale à 400 ms reçoit la note de 10. Au-delà, la note diminue d’un point par tranche de 200 ms, jusqu’à un minimum de 1. La même règle est appliquée aux premières requêtes et aux requêtes répétées.

Le ratio de taille est également évalué sur une échelle absolue. Une valeur de 100 %, correspondant à un fichier aussi lourd que l’original, reçoit la note de 1. Plus le fichier retourné est léger, plus la note augmente. Le coût direct annuel est en revanche normalisé relativement aux solutions comparées, aucun budget de référence n’ayant été défini par Antistatique. La solution la moins chère reçoit 10 et les autres notes sont calculées proportionnellement.

Les critères qualitatifs utilisent une échelle allant de 1 à 4 pour la facilité d’exploitation et la facilité d’intégration, puis de 1 à 6 pour la documentation et l’expérience développeur. Une valeur élevée représente déjà une situation favorable. Ces évaluations sont ensuite converties linéairement sur l’échelle commune de 1 à 10.

Enfin, chaque note normalisée est multipliée par le poids du KPI correspondant. Les résultats pondérés sont additionnés, puis divisés par la somme des poids afin d’obtenir une moyenne sur 10. Celle-ci est multipliée par 10 pour produire le score global sur 100. Les formules, les bornes, les grilles qualitatives et les valeurs intermédiaires sont présentées en annexe.


== Résultats

=== Contrôle des données

Le protocole a produit 1 584 observations, soit 12 images, 11 requêtes, 3 solutions et 4 lieux. imgproxy a retourné une réponse HTTP 200 pour toutes les observations. Cloudflare a retourné 527 réponses HTTP 200 et une redirection HTTP 307 ; la requête suivante vers la même image a fourni la première réponse 200. Cloudinary a renvoyé 88 erreurs HTTP 400, correspondant aux onze requêtes des deux images les plus lourdes, répétées dans les quatre lieux. La cause exacte de ces erreurs n'a pas été déterminée.

Ces erreurs ne sont pas incluses dans les temps ni dans les ratios de taille. Elles restent néanmoins un résultat du benchmark : dans la configuration testée, Cloudinary a traité dix images sur douze, contre douze sur douze pour les deux autres solutions.

Conformément au modèle finalement retenu, le taux de succès n’est pas transformé en un KPI supplémentaire, puisque la disponibilité et la robustesse ont été classées parmi les contraintes d’implémentation. Les erreurs observées chez Cloudinary restent néanmoins un résultat important du benchmark et doivent être prises en compte dans l’interprétation du classement.


=== Performances selon la localisation

La localisation influence surtout le comportement des requêtes répétées d'imgproxy (@ttfb-chaud-localisation). Le service auto-hébergé est le plus rapide depuis Lausanne et Genève, proches de la VM, mais son TTFB augmente à New York et à Singapour. Cloudinary et Cloudflare présentent une hausse plus limitée grâce à leur infrastructure distribuée. Les valeurs du tableau correspondent aux médianes calculées sur les dix images communes.

#figure(
  {
    set text(size: 8.7pt)
    table(
      columns: (1.2fr, 1fr, 1fr, 1fr),
      inset: 5pt,
      align: (left, center, center, center),
      table-header([Lieu]),
      table-header([Cloudinary]),
      table-header([Cloudflare]),
      table-header([imgproxy]),
      [Lausanne], [59 ms], [63 ms], [39 ms],
      [Genève], [64 ms], [65 ms], [32 ms],
      [New York], [95 ms], [90 ms], [303 ms],
      [Singapour], [122 ms], [108 ms], [479 ms],
    )
  },
  caption: [TTFB médian des requêtes répétées selon le lieu],
  kind: table,
) <ttfb-chaud-localisation>

=== Résultats agrégés

Sur les dix images communes, Cloudflare présente le TTFB médian le plus faible lors de la première requête, avec 1,38 seconde (@resultats-performance). Cloudinary présente la médiane la plus faible sur les requêtes répétées, avec 75 ms, suivi de Cloudflare à 83 ms. imgproxy atteint 219 ms lorsque les quatre lieux sont agrégés ; ce résultat reflète l'écart géographique observé précédemment.

imgproxy retourne les fichiers les plus légers, avec une taille moyenne égale à 23,00 % de l'original. Cloudinary atteint 35,84 % et Cloudflare 48,70 %. Cette mesure décrit la sortie produite par les réglages automatiques de chaque service. Elle ne démontre pas que les images ont une qualité visuelle équivalente.

#figure(
  {
    set text(size: 8.5pt)
    table(
      columns: (1.1fr, 1.3fr, 1.25fr, 1.1fr, 0.9fr),
      inset: 5pt,
      align: (left, center, center, center, center),
      table-header([Solution]),
      table-header([Première requête]),
      table-header([Requêtes répétées]),
      table-header([Ratio de taille]),
      table-header([Succès]),
      [Cloudinary], [4,21 s], [75 ms], [35,84 %], [10/12],
      [Cloudflare], [1,38 s], [83 ms], [48,70 %], [12/12],
      [imgproxy], [2,29 s], [219 ms], [23,00 %], [12/12],
    )
  },
  caption: [Résultats techniques agrégés du benchmark],
  kind: table,
) <resultats-performance>

Les trois mesures ne désignent donc pas un vainqueur unique. Cloudflare présente la plus faible médiane lors de la première transformation, Cloudinary lors des requêtes répétées et imgproxy produit les fichiers les plus petits. Le choix dépend nécessairement du poids accordé à ces avantages et aux critères non techniques.

=== Coût direct et effort estimé

Le plan Cloudinary retenu pour l'estimation coûte 89 USD par mois avec une facturation annuelle, soit 1 068 USD par an @CloudinaryPricing2026. Pour Cloudflare, l'hypothèse de 950 000 transformations uniques annuelles conduit au calcul suivant, sur la base de 5 000 transformations incluses chaque mois puis de 0,50 USD par millier @CloudflareImagesPricing2026 :

$ (950000 - 5000 times 12) / 1000 times 0.50 = 445 " USD/an" $

Les montants en dollars ont été convertis au cours de 1 USD = 0,8128 CHF publié par la Banque nationale suisse le 13 août 2026 @SwissNationalBankExchange2026. La VM utilisée pour imgproxy coûte 13,50 CHF par mois, soit 162 CHF par an.

#figure(
  {
    set text(size: 8.5pt)
    table(
      columns: (1fr, 1.7fr, 1.15fr, 0.9fr, 1fr),
      inset: 5pt,
      align: (left, left, center, center, center),
      table-header([Solution]),
      table-header([Base de calcul]),
      table-header([Coût direct annuel]),
      table-header([Mise en place]),
      table-header([Intégration d'un projet]),
      [Cloudinary], [1 068 USD/an], [868,07 CHF], [1 h], [2 h],
      [Cloudflare], [445 USD/an], [361,70 CHF], [2 h], [3 h],
      [imgproxy], [13,50 CHF/mois], [162,00 CHF], [8 h], [4 h],
    )
  },
  caption: [Coûts directs et efforts d'intégration estimés sur une année],
  kind: table,
) <resultats-couts>

L'estimation Cloudflare suppose que les 950 000 opérations correspondent à des transformations uniques facturables et que l'allocation gratuite est utilisée chaque mois. Pour Cloudinary, elle suppose que le plan retenu couvre le volume considéré. Ces hypothèses rendent les montants comparables, mais ne remplacent pas un devis contractuel.

=== Critères qualitatifs

Cloudinary et Cloudflare reçoivent la note brute maximale de 4 pour la facilité d’exploitation, car l’infrastructure testée est exploitée par le fournisseur. imgproxy reçoit la note 1 : Antistatique doit maintenir la VM, les conteneurs, le cache, les mises à jour de sécurité et la supervision.

La facilité d’intégration ne représente pas uniquement le nombre d’heures nécessaires. Cloudflare reçoit la note 1 en raison du couplage à une zone et à une configuration d’infrastructure Cloudflare. Cloudinary reçoit la note 2, car la construction des URL et les mécanismes utilisés restent propres au fournisseur. imgproxy reçoit la note 3 : l’intégration nécessite un helper, une variable d’environnement et la distribution de secrets HMAC, mais repose ensuite sur des URL HTTP génériques.

Enfin, Cloudinary reçoit la note maximale de 6 pour la documentation et l’expérience développeur. Cloudflare et imgproxy reçoivent chacun 5 : leurs documentations sont complètes, mais demandent davantage d’assemblage pour couvrir précisément le cas étudié. Les niveaux correspondant à chacune de ces échelles sont définis en annexe (@annexe-normalisation-kpi).


#figure(
  {
    set text(size: 8.7pt)
    table(
      columns: (1fr, 1.3fr, 1.3fr, 1.3fr),
      inset: 5pt,
      align: (left, center, center, center),
      table-header([Solution]),
      table-header([Facilité d’exploitation (1–4)]),
table-header([Facilité d’intégration (1–4)]),
table-header([Documentation/DX (1–6)]),
      [Cloudinary], [4], [2], [6],
      [Cloudflare], [4], [1], [5],
      [imgproxy], [1], [3], [5],
    )
  },
  caption: [Notes qualitatives attribuées aux trois solutions],
  kind: table,
) <notes-qualitatives>

== Décision

=== Matrice pondérée

Après normalisation, les notes et les poids définis avec Antistatique produisent la matrice de décision présentée dans le @matrice-decision. Les KPI techniques utilisent les dix images communes aux trois solutions.

#figure(
  {
    set text(size: 8.4pt)
    table(
      columns: (2fr, 0.75fr, 1fr, 1fr, 1fr),
      inset: 5pt,
      align: (left, center, center, center, center),
      table-header([KPI normalisé sur 10]),
      table-header([Poids]),
      table-header([Cloudinary]),
      table-header([Cloudflare]),
      table-header([imgproxy]),
   [Première requête], [3,5], [1,00], [5,11], [1,00],
[Requêtes répétées], [1,5], [10,00], [10,00], [10,00],
[Ratio de taille], [3,5], [6,77], [5,62], [7,93],
[Coût direct annuel], [9], [1,87], [4,48], [10,00],
[Facilité d’exploitation], [9], [10,00], [10,00], [1,00],
[Facilité d’intégration], [6,5], [4,00], [1,00], [7,00],
[Documentation et DX], [7], [10,00], [8,20], [8,20],
[*Score pondéré sur 100*], [*40*], [*61,3*], [*61,7*], [*62,0*],
    )
  },
  caption: [Matrice de décision normalisée et pondérée],
  kind: table,
) <matrice-decision>

imgproxy obtient le score le plus élevé, avec 62,0 points sur 100, devant Cloudflare à 61,7 et Cloudinary à 61,3. Seuls 0,7 point séparent les trois solutions, et l’écart entre imgproxy et Cloudflare n’est que de 0,3 point. La matrice indique donc que le choix d’imgproxy reste compatible avec les priorités définies par Antistatique, mais elle ne met pas en évidence un vainqueur incontestable. Une modification des poids ou des seuils pourrait facilement changer l’ordre obtenu.

=== Interprétation du choix

Le calendrier du projet imposait de commencer l’implémentation avant que le benchmark et son modèle de notation soient entièrement finalisés. imgproxy avait donc été retenu provisoirement en raison de son faible coût direct, de la maîtrise qu’il laisse à Antistatique et de son interface générique par URL. La matrice recalculée le place légèrement en tête et montre que cette décision reste défendable, sans permettre d’affirmer que le classement était connu au moment du choix initial.

Le résultat met surtout en évidence le compromis de l’architecture auto-hébergée. imgproxy est favorisé par son coût direct et par la faible taille des fichiers produits, mais pénalisé par sa charge d’exploitation et par le TTFB de la première requête. Les trois solutions satisfont en revanche le seuil retenu pour les requêtes répétées. La preuve de concept doit dès lors vérifier la déployabilité d’imgproxy, son intégration dans un projet existant et le fonctionnement du cache. Les questions de charge, de supervision et de fallback restent à traiter avant une adoption en production.

=== Limites du benchmark

Les résultats doivent être interprétés dans les limites suivantes :

- un seul service représente chaque famille d'architecture ;
- l'échantillon comprend douze images et les mesures ont été réalisées lors d'une seule campagne par lieu, sans test de charge ni requêtes concurrentes ;
- le ratio de taille compare les modes automatiques des fournisseurs sans mesure formalisée de la qualité visuelle ;
- les notes d'intégration et de documentation reposent sur l'expérience du benchmark, sans mesure de temps ni évaluation par un panel de développeurs ;
- les coûts dépendent des tarifs, du taux de change et du volume annuel retenus au moment de l'étude ;
- le modèle de décision a évolué pendant le travail au lieu d'être entièrement figé avant la collecte des données.

Le benchmark doit donc être lu comme une aide structurée à la décision dans le contexte d'Antistatique. Il fournit une justification traçable du choix approfondi dans la preuve de concept, mais pas une évaluation générale et définitive des trois architectures.