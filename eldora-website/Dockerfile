# syntax=docker/dockerfile:1.7-labs
FROM antistatique/php:8.2-wordpress

ARG composer_token=
ARG user=www-data
ARG group=${user}

ENV COMPOSER_HOME=/var/www

RUN set -eux; \
  \
  if [ "${group}" != "www-data" ]; then \
    groupadd user --gid ${group}; \
  fi; \
  \
  if [ "${user}" != "www-data" ]; then \
    useradd user --uid ${user} --gid ${group} --groups www-data --no-create-home --shell /bin/bash; \
  fi; \
  \
  chown -R $user:$group . /var/backups

USER $user:$group

ADD --chown=${user}:${group} ./composer.json ./composer.lock ./
ADD --chown=${user}:${group} ./web/app/themes/eldora-theme/composer.json ./web/app/themes/eldora-theme/composer.json
COPY --chown=${user}:${group} --parents ./web/app/custom-plugins/*/composer.json ./
RUN set -eux; \
  \
  if [ -n "$composer_token" ]; then \
    echo $composer_token; \
    composer config --global --auth http-basic.repo.packagist.com antistatique $composer_token; \
  fi; \
  composer install --prefer-dist --no-autoloader --no-scripts --no-progress --no-suggest --no-interaction; \
  composer clear-cache

COPY --chown=${user}:${group} . ./

RUN set -eux; \
  \
  composer install --prefer-dist --no-progress --no-suggest --no-interaction
