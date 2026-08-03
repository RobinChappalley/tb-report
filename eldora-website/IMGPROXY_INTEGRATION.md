# Integration imgproxy - Etat actuel

## Contexte

L'objectif etait d'integrer imgproxy dans le projet WordPress (`eldora-website`) pour proxifier les URLs d'images et servir des images optimisees via `IMGPROXYURL`.

Pendant l'integration, deux realites techniques ont ete identifiees :

- Une partie des images vient de templates Twig du theme.
- Une autre partie (notamment sur la home) vient du contenu Gutenberg (`post.content`) et de blocs custom (`eldora-blocks`) qui serialisent directement des URLs.

## Ce qui a ete modifie

### 1) Configuration d'environnement Docker

Variables ajoutees sur le service `dev` pour exposer imgproxy dans le conteneur PHP :

- `docker-compose.yml`
- `docker-compose.override.yml`

Variables utilisees :

- `IMGPROXYURL`
- `IMGPROXYKEY`
- `IMGPROXYSALT`

Le fichier `.env` contient les valeurs.

### 2) Theme - helper imgproxy + logs + rewriter global

Fichier principal modifie :

- `web/app/themes/eldora-theme/src/StarterSite.php`

Changements importants :

- Ajout de la fonction Twig `imgproxy` via `add_functions_to_twig()`.
- Ajout de `imgproxy_url($src, $ops = '')`.
- Ajout de logs de debug (`error_log`) pour diagnostiquer URL source, URL encodee et URL finale signee.
- Activation du logging PHP vers stderr dans le constructeur :
  - `ini_set('log_errors', '1')`
  - `ini_set('error_log', '/dev/stderr')`
- Ajout d'un filtre global `the_content` :
  - `proxy_content_images()`
  - Reecrit les attributs `src` et `srcset` du HTML rendu par Gutenberg.
- Ajout de helpers internes :
  - `maybe_proxy_url()`
  - `proxy_srcset()`

### 3) Templates Twig proxifies explicitement

Les templates Twig suivants appellent maintenant `imgproxy(...)` pour les images :

- `web/app/themes/eldora-theme/views/partials/hero-sectors.twig`
- `web/app/themes/eldora-theme/views/partials/pop-up.twig`
- `web/app/themes/eldora-theme/views/templates/archive-jobs.twig`
- `web/app/themes/eldora-theme/views/templates/archive-posts.twig`
- `web/app/themes/eldora-theme/views/templates/archive-publications-presses.twig`
- `web/app/themes/eldora-theme/views/templates/archive-recettes.twig`
- `web/app/themes/eldora-theme/views/templates/contact.twig`
- `web/app/themes/eldora-theme/views/templates/single-news.twig`

## Comment ca fonctionne aujourd'hui

## A) Cas Twig (theme)

Dans Twig, on appelle :

```twig
{{ imgproxy(url, 'rt:fit/q:75') }}
```

Puis `imgproxy_url()` :

1. Resolut la source en URL absolue si necessaire.
2. Encode la source en Base64 URL-safe.
3. Construit le path imgproxy avec options + source encodee.
4. Signe le path avec `IMGPROXYKEY`/`IMGPROXYSALT` si disponibles.
5. Sinon fallback en `/insecure/...`.

## B) Cas Gutenberg (`post.content`)

Le filtre `the_content` parse le HTML final et reecrit :

- `src`
- `srcset`

Regles actuelles de reecriture (via `maybe_proxy_url`) :

- Ignore `data:`, `blob:`, etc.
- Ignore les URLs deja sur `IMGPROXYURL`.
- Ignore certains chemins locaux theme/wp-includes.
- Ignore hosts locaux (`localhost`, `127.0.0.1`, `::1`, `*.local`).
- Proxifie les autres URLs distantes.

## Pourquoi cela a debloque la home

La home est rendue en grande partie via `post.content` (blocs Gutenberg), pas seulement via les partials Twig. Donc le filtre `the_content` est le point de couverture le plus large.

## Limites et points d'attention actuels

1. Le rewriter `the_content` cible actuellement tous les elements avec attribut `src` (pas uniquement `img`/`source`).
   - Risque : proxifier par erreur des `iframe`, scripts ou autres ressources non-image dans le contenu.

2. Les logs de debug sont verbeux (`error_log` dans `imgproxy_url`).
   - A conserver temporairement en dev uniquement.

3. Les images locales de dev (`localhost`) ne sont pas proxifiees (volontaire).
   - En production, les URLs image doivent etre resolvables publiquement par imgproxy.

4. Il reste des sources d'images possibles dans des blocs custom rendus en PHP/JS.
   - Le filtre global couvre deja `the_content`, mais il faut valider fonctionnellement page par page.

## Prochaines etapes recommandees pour la production

1. Durcir le filtre global pour ne reecrire que les balises image.
   - Restreindre la reecriture `src` aux tags `img` et `source`.

2. Passer en mode "logs minimaux".
   - Supprimer ou conditionner les `error_log` detailles.
   - Garder uniquement les erreurs critiques.

3. Valider la connectivite origine -> imgproxy.
   - Verifier que les URLs image backend sont accessibles depuis le serveur imgproxy.
   - Verifier les restrictions `IMGPROXY_ALLOWED_SOURCES` cote imgproxy si activees.

4. Verifier la signature en environnement final.
   - Cle/sel identiques entre app et service imgproxy.
   - Meme format de path signe.

5. Ajouter une phase de tests de non-regression.
   - Home, archives, pages single, pages ACF/options.
   - Verification de `srcset` mobile/desktop.

6. Mettre en cache au bon niveau.
   - CDN/proxy HTTP devant imgproxy.
   - TTL adaptes pour limiter le cout de transformation.

## Checklist de mise en production

- [ ] Variables `IMGPROXYURL/KEY/SALT` presentes dans l'env prod.
- [ ] imgproxy joignable depuis l'app et depuis les clients.
- [ ] URLs source accessibles par imgproxy (pas localhost).
- [ ] Filtre `the_content` restreint a `img`/`source`.
- [ ] Logs de debug reduits.
- [ ] Tests visuels + Network sur pages critiques.

## Commandes utiles (diagnostic)

```bash
# Logs du service WordPress
cd /Users/robinchappalley/code/bachelor-thesis/eldora-website
docker compose logs -f dev

# Verifier la config mergee de compose
docker compose config
```

## Resume

L'integration est fonctionnelle en dev avec deux couches :

- `imgproxy(...)` dans Twig (cas theme)
- reecriture globale `the_content` (cas Gutenberg/blocs)

Pour la production, il est surtout necessaire de :

- securiser/epurer la reecriture,
- reduire les logs,
- valider l'accessibilite des sources par imgproxy,
- finaliser les tests de non-regression.
