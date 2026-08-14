// introduction.typ
#import "../variables.typ": *

= Introduction

Ce rapport présente le Travail de Bachelor réalisé pendant dix semaines au sein d’Antistatique. Le mandat est né d’un besoin interne récurrent : disposer d’une manière commune de traiter et de livrer les images dans des projets reposant sur des technologies différentes. Ce document a été rédigé pour transformer ce besoin en une décision argumentée et pour fournir à l’agence une base sur laquelle poursuivre le travail.

Le sujet dépasse le choix d’un outil de redimensionnement. L’adoption d’un service partagé modifie la manière dont les projets sont intégrés, les responsabilités assumées par l’agence et les conditions dans lesquelles les développeurs travaillent. Le rapport examine donc à la fois l’architecture du service, ses performances, son coût, sa maintenance et son intégration. L’expérience développeur constitue le fil conducteur de cette analyse : une solution commune n’apporte un bénéfice durable que si elle réduit réellement le travail répété sans introduire une charge d’exploitation ou une complexité disproportionnée.

Le document remplit également une fonction de transmission. Il consigne les critères utilisés, les hypothèses formulées, les décisions prises, les difficultés rencontrées et les limites des résultats. Cette traçabilité doit permettre à une personne qui n’a pas participé au projet de comprendre la recommandation finale, d’en évaluer la portée et de reprendre l’expérimentation sans devoir reconstruire tout le raisonnement.

Le travail s’est déroulé en deux étapes complémentaires. Un benchmark compare d’abord trois familles d’architectures à travers Cloudinary, Cloudflare Images et imgproxy. Il met en évidence leurs compromis et fournit une aide structurée à la sélection de la solution. Une preuve de concept étudie ensuite imgproxy dans un cas concret, depuis son déploiement jusqu’à son intégration dans un projet existant.

La partie consacrée au contexte décrit la situation qui a fait apparaître ce besoin chez Antistatique et formule la problématique du travail. Le benchmark présente ensuite la méthode de comparaison, les mesures réalisées et la décision obtenue. La preuve de concept confronte cette décision à la réalité d’un projet et distingue les mécanismes validés des éléments qui restent à traiter. Enfin, la conclusion prend position sur la suite à donner au travail, propose une trajectoire d’adoption pour Antistatique et revient sur les principaux apprentissages personnels tirés de cette démarche.


la duplication de la logique d’optimisation ;
la dépendance aux fonctionnalités propres aux CMS et frameworks ;
la génération anticipée de variantes parfois inutilisées ;
la maintenance de configurations différentes ;
la difficulté à faire évoluer la stratégie d’image de façon centralisée.