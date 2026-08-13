

 #set text(lang: "fr", hyphenate: true)
#set par(justify: true)

#let table-header(text) = {
  strong(text)
}


= Preuve de concept
À l’issue du benchmark, imgproxy a été retenu comme la solution à approfondir. L’écart limité avec les autres architectures ne suffisait toutefois pas à garantir sa pertinence dans un projet réel. La preuve de concept vise donc à vérifier trois éléments : la possibilité de déployer et de sécuriser le service sur une infrastructure maîtrisée par Antistatique, le fonctionnement d’un cache placé devant imgproxy et l’intégration de la génération des URL dans un projet existant.

Cette étape constitue une validation fonctionnelle, et non une qualification pour la production. Le dimensionnement de l’infrastructure, la résistance à la charge, la supervision, la haute disponibilité et le comportement en cas de panne ne font pas partie des éléments validés.

== Choix initial de Luxury Tribune

Luxury Tribune a été retenu comme premier terrain d’expérimentation, car il constituait la cible réelle envisagée pour l’intégration d’imgproxy. Ce site d’actualité consacré au secteur du luxe est exploité en production et destiné notamment à des abonnés payants. Ses articles reposent fortement sur la photographie, ce qui rend la qualité visuelle et la continuité d’affichage particulièrement importantes.

Le projet utilise une architecture découplée composée d’un CMS WordPress headless et d’une application Next.js hébergée sur Vercel. Le traitement des images repose actuellement sur Vercel Images, qui a réalisé environ 950 000 transformations pour ce projet durant l’année précédente. Ce volume réel a déjà servi de référence pour l’estimation des coûts dans le benchmark (voir section 3.2).

Le remplacement de Vercel Images poursuit deux objectifs. Le premier consiste à réduire la dépendance de la chaîne de traitement d’images envers un service propriétaire intégré à l’écosystème Vercel et sur lequel Antistatique dispose de peu de contrôle. Le second consiste à utiliser un service indépendant du framework et de l’hébergeur, afin de partager une même stratégie de traitement entre plusieurs projets. Le projet pouvait continuer à être hébergé sur Vercel : l’objectif était de découpler le traitement des images, et non nécessairement de migrer l’ensemble de l’application.

Enfin, Luxury Tribune centralise l’affichage de ses images dans un composant Next.js commun. Cette centralisation laissait initialement penser que le remplacement de Vercel Images pourrait être réalisé dans un nombre limité de points d’intégration.

=== Blocage technique <blocage-technique>

La configuration du PoC prévoyait d’activer la vérification HMAC afin que seuls les projets possédant le secret puissent créer de nouvelles transformations. Ce choix, détaillé à la section @signature-url, imposait de conserver la clé et le sel exclusivement côté serveur.

Sur Luxury Tribune, le composant d’image était directement importé par un fichier marqué avec la directive #raw("'use client'"). Selon la documentation de Next.js, les imports et les composants directement rendus depuis cette frontière sont intégrés au bundle client. Le composant ne pouvait donc pas embarquer la clé HMAC ni effectuer directement une opération dépendant de ce secret. @NextServerClientComponents

Les premiers essais ont été orientés vers une éventuelle incompatibilité entre les versions de Next.js, avec des vérifications sur les versions 13, 14 et 16. Cette hypothèse provenait d’une compréhension encore incomplète de la frontière entre composants serveurs et composants clients. La disponibilité limitée d’un spécialiste Next.js au moment des essais a également retardé l’identification de la cause. Après environ une semaine et demie de travail, son analyse a permis de rattacher le blocage à l’organisation des composants de Luxury Tribune plutôt qu’à imgproxy ou à une version particulière de Next.js.

Deux familles de solutions ont alors été évoquées : revoir la frontière entre composants serveurs et clients, ou déplacer la signature derrière un traitement exécuté exclusivement côté serveur. Aucune de ces possibilités n’a été conçue ni testée dans le cadre du PoC. Leur faisabilité et leur coût d’intégration ne peuvent donc pas être évalués dans ce rapport.

Ce résultat ne démontre pas une incompatibilité générale entre imgproxy et Next.js. Il montre uniquement que l’intégration directe envisagée dans le composant existant de Luxury Tribune ne permettait pas de conserver le secret côté serveur. Compte tenu du temps restant, la décision a été prise de poursuivre la validation fonctionnelle sur un projet dont le rendu était assuré en PHP.


=== Pivot vers un projet WordPress
Après environ une semaine et demie consacrée à Luxury Tribune, le PoC a été réorienté vers Eldora. Ce site de restauration collective repose sur WordPress, Timber et Twig et contient de nombreuses photographies culinaires et institutionnelles.

Ce choix était principalement pragmatique. La logique de signature développée pour le benchmark existait déjà en PHP et pouvait donc être réutilisée. Par ailleurs, un développeur ayant récemment travaillé sur Eldora était présent dans l’agence au moment du pivot, ce qui facilitait la compréhension du projet et limitait le temps nécessaire à sa prise en main.

L’intégration a été réalisée uniquement dans l’environnement local d’Eldora. Les images utilisées étaient toutefois celles du site de production, accessibles publiquement par imgproxy. Ce changement de terrain a permis de poursuivre la validation du déploiement, de la signature, du cache et de l’intégration dans WordPress. Il ne permet en revanche pas de considérer l’agnosticité complète de la solution comme validée.

== Déploiement d'imgproxy
=== Choix d'une instance mutualisée
L’architecture envisagée repose sur un service imgproxy commun à plusieurs projets, plutôt que sur un déploiement indépendant pour chaque client. Le terme « mutualisé » désigne ici le partage du service, du cache et de son exploitation entre plusieurs projets. Il ne désigne pas simplement le fait que la VM soit hébergée dans le Public Cloud d’Infomaniak.

Ce choix, discuté avec le CTO d’Antistatique, réduit le nombre d’installations à maintenir : une infrastructure à mettre à jour, un point d’entrée HTTPS et une configuration de cache commune. Il permet également de concentrer les réponses déjà transformées dans un même cache Nginx.

Cette centralisation introduit en contrepartie un point de défaillance commun et ne garantit pas l’isolation des ressources entre les projets. Le PoC repose sur une seule instance d’imgproxy, mais il ne détermine pas le nombre d’instances qui serait nécessaire en production. Une éventuelle réplication devra être étudiée à partir d’un test de charge.

=== Infrastructure

Le service a été déployé sur une VM du Public Cloud d’Infomaniak. Ce prestataire a été retenu parce qu’Antistatique travaille déjà régulièrement avec lui, qu’il s’agit d’un fournisseur suisse connu de l’agence et qu’une VM pouvait y être mise à disposition rapidement.

La VM dispose de 4 vCPU et de 8 Go de mémoire vive. Ces valeurs ne résultent pas d’un calcul de capacité ni d’un test de charge. Elles constituent un dimensionnement initial choisi pour mettre en œuvre le PoC, avec la possibilité d’augmenter les ressources si des limites apparaissaient.

L’hypothèse de départ est que le cache Nginx placé devant imgproxy absorbe une grande partie des requêtes répétées. Une image absente du cache doit être téléchargée et transformée par imgproxy, alors qu’une requête ultérieure identique peut être servie directement par Nginx. La charge la plus importante est donc attendue lors de la mise en cache de nouvelles images ou de nouvelles variantes. Cette hypothèse a été vérifiée fonctionnellement par l’observation de réponses #raw("MISS") puis #raw("HIT"), mais elle n’a pas été validée sous charge concurrente.

=== Architecture conteneurisée

Le déploiement s'appuie sur quatre conteneurs Docker orchestrés par Docker Compose (@roles-conteneurs) :

#figure(
  table(
  columns: (auto, 1fr),
  inset: 6pt,
  stroke: 0.5pt + black,
  align: left + horizon,
  
  [*Conteneur*], [*Rôle*],
  [*nginx-proxy*], [Reverse proxy frontal (ports 80/443), terminaison TLS, routage vers nginx-cache],
  [*acme-companion*], [Demande et renouvellement automatique des certificats Let's Encrypt auprès de la CA],
  [*nginx-cache*], [Cache HTTP des réponses imgproxy, routage interne vers imgproxy],
  [*imgproxy*], [Traitement des images (redimensionnement, optimisation, conversion de formats)],
),
caption:[Conteneurs et rôles dans le PoC imgproxy],
  kind:table
)<roles-conteneurs>

Docker Compose a été retenu parce que le PoC repose sur une seule VM et sur plusieurs services aux responsabilités distinctes. Cette séparation permet de faire évoluer le traitement des images, le cache et la gestion du point d’entrée HTTPS sans les réunir dans un même conteneur.

#raw("nginxproxy/nginx-proxy") observe les métadonnées des conteneurs et génère automatiquement la configuration des hôtes exposés à partir de leurs variables d’environnement. La politique de cache reste, quant à elle, définie dans le fichier #raw("nginx.conf") (@nginx.conf) monté dans le conteneur #raw("nginx-cache") . Cette automatisation réduit la configuration manuelle du reverse proxy, sans supprimer les opérations de maintenance et de supervision nécessaires. @NginxproxyREADMEmd58469cab4e7476a04ce3028a5f4df7a860db6e6f


=== Mise en cache et négociation de contenu
imgproxy effectue les transformations à la demande. Sans cache externe, les requêtes successives portant sur une même source et sur les mêmes paramètres atteindraient toutes le service de traitement. Le conteneur #raw("nginx-cache") est donc placé entre le point d’entrée public et imgproxy.

Lorsqu’une requête correspond à une réponse déjà enregistrée, Nginx la renvoie directement sans solliciter imgproxy : il s’agit d’un #raw("cache HIT"). Dans le cas contraire, Nginx transmet la requête à imgproxy, récupère l’image transformée, la retourne au navigateur et l’enregistre pour les requêtes suivantes : il s’agit d’un #raw("cache MISS"). Ce mécanisme limite le nombre de transformations et constitue une propriété centrale de l’architecture mutualisée.

#figure(
  image("../assets/figures/schema-imgproxy-cache.png"),
  caption:("Chemin d’une requête d’image et fonctionnement du cache Nginx"),
)<architecture-poc>

Pour le PoC, l’espace disque consacré au cache a été limité à 1 Go. Une réponse mise en cache reste valide pendant 30 jours, tandis qu’une entrée qui n’a pas été utilisée pendant 7 jours peut être supprimée. Ces valeurs n’ont pas été établies à partir du trafic ou du volume d’images des projets : elles ont uniquement servi à vérifier le fonctionnement du mécanisme. Elles ne constituent donc pas une recommandation de production.

Une même URL peut par ailleurs produire des formats différents selon les capacités annoncées par le navigateur dans l’en-tête HTTP #raw("Accept"). La configuration Nginx convertit cet en-tête en l’une des catégories #raw("jxl"), #raw("avif"), #raw("webp") ou #raw("standard"), puis ajoute cette valeur à la clé de cache. Une réponse AVIF et une réponse JPEG ou WebP correspondant à la même URL sont ainsi enregistrées séparément. Cette distinction évite qu’un format mis en cache pour un navigateur compatible soit ensuite servi à un navigateur qui ne le prend pas en charge. La documentation d’imgproxy recommande effectivement d’intégrer le format accepté dans la clé lorsqu’une négociation de contenu est utilisée. @ImgproxyExternalCache



=== Renouvellement automatique des certificats TLS

Let's Encrypt émet des certificats valides 90 jours @CertificateLifetimeRationale. Le renouvellement est géré par #raw("nginxproxy/acme-companion"), qui reçoit les notifications de #raw("nginxproxy/nginx-proxy") et réeffectue la demande avant expiration @NginxproxyAcmecompanionAutomated. Le comportement n'a pas pu être vérifié en conditions réelles : la durée du PoC est inférieure au cycle de renouvellement. Avant une mise en production, il faudrait valider que le renouvellement s'opère correctement et que Nginx recharge sa configuration sans interruption de service.

#figure(
  image("../assets/figures/sequence-diagram-acme.png"),
  caption:("Schéma du renouvellement automatique des certificats Let's Encrypt via acme-companion")
)

=== Exposition publique et signature des URL <signature-url>
Le service de traitement doit être accessible depuis les navigateurs, puisque ce sont eux qui demandent directement les images à son URL publique. Dans le PoC, le conteneur imgproxy n’expose aucun port directement sur la VM : seul le point d’entrée Nginx est accessible depuis Internet. Cette isolation réseau empêche de contacter directement le conteneur, mais elle ne suffit pas à contrôler l’utilisation du point d’entrée public.

Une URL imgproxy contient à la fois l’adresse de l’image source et les opérations à effectuer, par exemple ses dimensions, son mode de redimensionnement et sa qualité. Si ces URL étaient acceptées sans vérification, un tiers pourrait modifier librement ces paramètres ou la source. En générant un grand nombre de combinaisons différentes, il provoquerait autant de #raw("cache MISS") et forcerait imgproxy à télécharger et à transformer de nouvelles images. Le service pourrait alors être utilisé gratuitement par un site tiers ou être soumis à une consommation excessive de processeur, de mémoire et de bande passante.

#figure(
  {
    set text(size: 8.3pt)

    table(
      columns: (1.2fr, 2fr, 2.5fr),
      inset: 5pt,
      align: (left, left, left),

      table-header([Approche]),
      table-header([Principe]),
      table-header([Adéquation au PoC]),

      [*Service privé ou allowlist d’IP*],
      [Autoriser uniquement les serveurs applicatifs à contacter le service.],
      [Les requêtes proviennent des navigateurs des visiteurs, dont les adresses sont inconnues. Les images devraient donc transiter par chaque serveur applicatif, ce qui ajouterait de la charge et du couplage.],

      [*Jeton HTTP fixe*],
      [Exiger un secret dans l’en-tête #raw("Authorization").],
      [Le secret ne peut pas être placé dans le navigateur. Nginx pourrait l’ajouter entre le cache et imgproxy, mais cela empêcherait seulement le contournement de Nginx, pas les requêtes arbitraires vers le point d’entrée public.],

      [*Limitation du débit*],
      [Limiter le nombre de requêtes accepté pendant une période donnée.],
      [Elle réduit l’impact d’un trafic excessif, mais ne distingue pas les transformations autorisées des autres.],

      [*URL signées*],
      [Autoriser uniquement les chemins possédant une signature HMAC valide.],
      [Le service reste directement accessible aux navigateurs et compatible avec le cache, tandis que seuls les serveurs possédant la clé peuvent créer de nouvelles transformations.],
    )
  },
  caption: [Mécanismes envisagés pour contrôler l’accès au service],
  kind: table,
)

La signature HMAC permet de conserver un point d’entrée public sans autoriser n’importe quel utilisateur à créer de nouvelles transformations. Le CMS construit d’abord le chemin complet de l’URL, puis calcule une signature HMAC-SHA256 à l’aide d’une clé et d’un sel partagés avec imgproxy. Le service recalcule cette signature lorsqu’il reçoit la requête. Toute modification de la source ou des paramètres change le résultat du calcul et entraîne le rejet de l’URL. @ImgproxySigningURL

Le navigateur reçoit uniquement l’URL finale. Il peut demander l’image sans connaître le secret, tandis que Nginx peut continuer à mettre cette URL en cache. Ce mécanisme est également indépendant de l’adresse IP et de l’hébergeur du projet qui génère la signature, ce qui correspond à l’objectif de standardisation entre plusieurs stacks.

#figure(
  image("../assets/figures/signature-explanation.png"),
  caption:("Génération et vérification d’une URL signée avec HMAC"),
)<signature-explanation>

La signature HMAC a donc été retenue comme mécanisme principal. Les autres contrôles ne sont pas nécessairement exclus : une mise en production pourrait combiner les URL signées avec une restriction des domaines sources, des presets limitant les opérations autorisées et une limitation du débit. Ces protections complémentaires n’ont pas été configurées dans le PoC. imgproxy fournit notamment les options #raw("IMGPROXY_ALLOWED_SOURCES"), #raw("IMGPROXY_ALLOWED_PROCESSING_OPTIONS") et #raw("IMGPROXY_SECRET") à cet effet. @ImgproxyConfigurationOptions

Une URL signée ne constitue pas une authentification de l’utilisateur qui la demande. Une URL valide observée dans une page peut être copiée et réutilisée telle quelle par un tiers. La signature empêche sa modification et la création de nouvelles variantes, mais pas la réutilisation d’une transformation déjà autorisée. Cette propriété est acceptable pour les images publiques visées par le PoC. Si certaines images devaient être protégées, une durée d’expiration ou un contrôle d’accès supplémentaire serait nécessaire.


=== Secrets et variables d'environnement
Une véritable paire clé/sel a été inscrite dans le fichier #raw("docker-compose.yaml"), puis enregistrée dans le dépôt Git afin d’accélérer la réalisation du PoC. Sa suppression du fichier courant ne suffit pas à supprimer sa présence dans l’historique. Cette paire doit donc être considérée comme compromise et remplacée avant toute réutilisation du service.

En production, les secrets devront être injectés depuis un mécanisme extérieur au dépôt et distribués uniquement aux projets autorisés. Un gestionnaire tel qu’Infisical constitue une possibilité, mais cet outil n’a pas été évalué dans le cadre du travail et ne peut pas être présenté comme la solution retenue.

Le PoC envisageait initialement une paire commune à tous les projets. Ce modèle simplifie la configuration, mais la compromission d’un projet imposerait alors de mettre à jour tous les autres. Une paire distincte par projet faciliterait la révocation individuelle, sans toutefois assurer une isolation des ressources au sein de l’instance partagée.

imgproxy accepte plusieurs paires clé/sel simultanément. Une nouvelle paire peut donc être ajoutée, distribuée aux projets concernés, puis l’ancienne retirée après une période de transition. La politique de distribution, de rotation et de révocation reste à définir avant une mise en production. @ImgproxyConfigurationOptions





== Implémentation sur Eldora

L’intégration dans Eldora repose sur deux mécanismes complémentaires. Cette combinaison n’avait pas été prévue dès le début : elle résulte d’un problème observé pendant les essais.

Le premier mécanisme est la fonction #raw("imgproxy_url()"), ajoutée à la classe #raw("StarterSite") et exposée dans Twig sous le nom #raw("imgproxy()"). Elle permet aux développeurs de générer explicitement une URL imgproxy dans les templates pour les images structurelles du site, par exemple les images principales ou les images associées à une page. Les opérations de transformation peuvent alors être indiquées directement lors de l’appel.

Les valeurs #raw("fit") et #raw("q:75") utilisées pendant le PoC  avaient pour seul objectif de rendre les paramètres visibles dans l’URL et de vérifier leur transmission jusqu’à imgproxy. Elles ne doivent donc pas être interprétées comme des valeurs recommandées. 

Cette première intégration ne couvrait cependant pas toutes les images. Pendant les essais, plusieurs images ne passaient pas par le helper Twig, car elles provenaient du contenu éditorial de WordPress et n’étaient pas directement rendues dans les templates. Cette observation a conduit à ajouter un second mécanisme fondé sur le filtre WordPress #raw("the_content").

Le filtre analyse le HTML produit pour le contenu éditorial et remplace les URL présentes dans les attributs #raw("src") et #raw("srcset") des éléments #raw("<img>") et #raw("<source>"). Il couvre ainsi notamment les images insérées dans les blocs Gutenberg. Les descripteurs du #raw("srcset") sont conservés : WordPress continue de proposer ses variantes responsives, tandis qu’imgproxy assure leur récupération, leur optimisation et la négociation du format.

Le remplacement intervient uniquement lors du rendu de la page. Les URL originales restent enregistrées dans WordPress et aucune migration de la base de données n’est nécessaire. Cette propriété facilite la désactivation ultérieure de l’intégration, même si elle ne constitue pas à elle seule un mécanisme automatique de repli pendant une panne.

L’environnement local d’Eldora n’étant pas accessible depuis la VM imgproxy, les URL locales ont été associées à l’origine publique du site de production. imgproxy pouvait ainsi récupérer les fichiers sources réels tout en laissant l’intégration WordPress dans l’environnement local.

Le fonctionnement des deux mécanismes est vérifié dans la section suivante.. Le filtre ne couvre toutefois que le HTML passant par #raw("the_content"). Les images définies dans des feuilles de style, produites en JavaScript ou stockées dans des champs rendus par d’autres mécanismes nécessiteraient une intégration complémentaire.



== Validation
La validation a été réalisée depuis l’environnement local d’Eldora, avec les images du site de production et le service imgproxy déployé sur la VM. Plusieurs pages ont été parcourues jusqu’à environ trois niveaux dans l’arborescence. Cette démarche confirme le fonctionnement des mécanismes observés, mais ne constitue ni un test automatisé ni une campagne exhaustive de non-régression.

#figure(
  {
    set text(size: 8.2pt)

    table(
      columns: (1.2fr, 2.5fr, 2fr),
      inset: 5pt,
      align: (left, left, left),

      table-header([Point vérifié]),
      table-header([Observation]),
      table-header([Conclusion]),

      [*Déploiement et HTTPS*],
      [Le domaine public d’imgproxy a répondu en HTTPS avec une réponse 200.],
      [Le déploiement et l’émission initiale du certificat fonctionnent. Le renouvellement n’est pas validé.],

      [*Intégration WordPress*],
      [Une image générée depuis un template Twig et des images provenant du contenu WordPress ont été servies par imgproxy.],
      [Les deux voies d’intégration fonctionnent dans l’environnement testé.],

      [*Signature HMAC*],
      [Les signatures incorrectes rencontrées pendant le développement ont produit des réponses 403. Après correction, les images ont été servies avec une réponse 200.],
      [La vérification HMAC a été observée dans ses états de rejet et d’acceptation.],

      [*Cache Nginx*],
      [Une première requête a produit un MISS, puis une requête identique un HIT.],
      [Une réponse déjà enregistrée peut être servie sans nouvelle transformation.],

      [*Négociation du format*],
      [Le navigateur annonçait la prise en charge d’AVIF et a reçu une réponse de type #raw("image/avif").],
      [La négociation de format fonctionne avec le navigateur testé.],

      [*Parcours des pages*],
      [Aucune autre image manquante n’a été constatée dans les pages explorées.],
      [Aucune régression visible n’a été relevée dans ce périmètre limité.],
    )
  },
  caption: [Synthèse de la validation fonctionnelle du PoC],
  kind: table,
)
-  *Affichage des images* : les images optimisées s'affichent correctement dans le navigateur sans erreur de rendu.
-  *Signature des URL* : les URL générées contiennent bien le token HMAC, confirmant que la logique de signature fonctionne à la volée. (@poc-validation-1, encadrés en vert)

#figure(
  image("../assets/figures/poc-validation-1.png"),
  caption:("Points de validation concernant les images et la signature des URL")
)<poc-validation-1>

-  *Cache nginx* : les requêtes répétées vers la même image optimisée sont servies depuis le cache (@poc-validation-2, encadré violet), réduisant la charge sur imgproxy.
- *Format optimal* : les images sont servies dans le format le plus efficace supporté par le navigateur, en l'occurence l'AVIF (@poc-validation-2, encadré bleu) dans ce cas, confirmant que la négociation de contenu fonctionne correctement.

#figure(
  image("../assets/figures/poc-validation-2.png"),
  caption:("Points de validation concernant le cache et le format des images")
)<poc-validation-2>


== Limites et pistes
#figure(
  {
    set text(size: 8.2pt)

    table(
      columns: (1.2fr, 2fr, 2fr),
      inset: 5pt,
      align: (left, left, left),

      table-header([Limite]),
      table-header([Portée du PoC]),
      table-header([Étape nécessaire]),

      [*Luxury Tribune et Next.js*],
      [La cible initiale n’a pas été intégrée.],
      [Concevoir et tester un point de signature exclusivement côté serveur.],

      [*Environnement*],
      [L’intégration Eldora a été testée uniquement en local.],
      [Réaliser un déploiement sur un environnement de test ou de préproduction.],

      [*Dimensionnement*],
      [Les 4 vCPU, 8 Go de RAM, 1 Go de cache et 30 jours de validité n’ont pas été dimensionnés.],
      [Effectuer des tests avec cache froid, cache chaud et requêtes concurrentes.],

      [*Disponibilité*],
      [Une seule instance est déployée et aucun repli à l’exécution n’est configuré.],
      [Définir une stratégie de cache périmé, de redondance et de repli vers la source.],

      [*Secrets et isolation*],
      [Les clés ont été versionnées et une paire commune était envisagée.],
      [Remplacer les clés, externaliser les secrets et définir une politique par projet.],

      [*Exploitation*],
      [Le PoC ne dispose pas de supervision ni de reprise automatique validée.],
      [Ajouter des health checks, des alertes et des politiques de redémarrage.],
    )
  },
  caption: [Mécanismes applicables au contrôle de l’utilisation du service],
  kind: table,
)

*Fallback en cas d'indisponibilité*.

Le code PHP génère une URL imgproxy, mais il ne télécharge pas lui-même l’image. Une erreur de traitement ou une indisponibilité survient seulement lorsque le navigateur demande cette URL. Un bloc #raw("try/catch") autour de la génération de l’URL ne peut donc pas détecter cette panne.
#figure(
  image("../assets/figures/fallback-fail.png"),
  caption:("Exemple d'échec de fallback vers l'image originale")
)<fallback-fail>

Plusieurs niveaux de continuité sont envisageables. Nginx pourrait servir une réponse périmée si proxy_cache_use_stale était configuré ; ce mécanisme n’est pas activé dans le PoC. servir une réponse périmée lorsqu’une image existe déjà dans le cache et que le service amont devient indisponible. imgproxy peut également renvoyer une image générique lorsqu’il ne parvient pas à récupérer ou à traiter une source. Ces mécanismes ne couvrent toutefois pas une image absente du cache pendant une panne complète. Un repli vers l’URL originale ou une seconde instance devrait alors être prévu explicitement.

La conservation des URL originales dans WordPress assure la réversibilité des données : désactiver l’intégration ne nécessite pas de restaurer ou de migrer le contenu. Cette propriété doit être distinguée du repli automatique lors d’une panne, qui n’est pas implémenté dans le PoC.


*Test de charge*

Le volume annuel de Luxury Tribune indique l’ordre de grandeur de l’utilisation, mais il ne permet pas de déterminer les pointes de trafic ni le nombre de transformations simultanées. Le test de charge devra distinguer un cache chaud, principalement composé de réponses #raw("HIT"), d’un cache froid provoquant plusieurs transformations concurrentes. Il devra mesurer les temps de réponse, le taux d’erreur ainsi que l’utilisation du processeur, de la mémoire et de l’espace de cache. Ces résultats permettront de vérifier le dimensionnement initial et de déterminer si plusieurs instances sont nécessaires.



*Monitoring et alertes*

imgproxy fournit un endpoint #raw("/health") qui peut être utilisé par Docker et par un système de supervision. Une mise en production devrait au minimum contrôler la disponibilité du service, le taux d’erreur, la latence, l’utilisation des ressources, l’espace occupé par le cache et l’expiration des certificats. Des politiques de redémarrage, des versions d’images Docker figées et la persistance de l’état du client ACME devront également être ajoutées. @ImgproxyHealthCheck

== Conclusion du PoC

La preuve de concept valide le déploiement d’imgproxy sur une VM, la protection des URL par HMAC, la mise en cache des réponses, la négociation du format et l’intégration dans un projet WordPress reposant sur Timber et Twig. Elle démontre également qu’une combinaison entre un helper explicite dans les templates et un filtre appliqué au contenu éditorial permet de couvrir les deux principales voies de rendu rencontrées sur Eldora.

Le résultat reste cependant limité à une validation fonctionnelle réalisée localement. L’intégration dans Luxury Tribune n’a pas abouti, le dimensionnement n’a pas été mesuré et les mécanismes nécessaires à une exploitation en production — gestion des secrets, supervision, reprise après panne et haute disponibilité — ne sont pas finalisés.

imgproxy peut donc être considéré comme techniquement validé pour une intégration WordPress comparable à celle d’Eldora, mais pas encore comme prêt pour une mise en production mutualisée. Le PoC réduit néanmoins l’incertitude technique en fournissant à Antistatique une infrastructure fonctionnelle et deux mécanismes d’intégration documentés pouvant servir de base à d’autres projets WordPress. La décision de poursuivre son adoption reste une décision distincte, qui appartient à l’agence.
