# 🚎 Eldora Website

[Eldora](https://eldora.ch/) is a 📰 [WordPress](https://wordpress.org/) website based 🪚 [Bedrock](https://roots.io/bedrock/).
It uses 🖨 [Gutenberg](https://github.com/WordPress/gutenberg) as editor.

It uses 🐳 [Docker](http://docker.com/) for running.

We deploy with 🎬 [Github Actions](https://github.com/features/actions) and 🚀 [Capistrano](https://capistranorb.com/).
We manage our dependencies with 🎶 [Composer](https://getcomposer.org/) and 🧶 [Bun](https://bun.sh/).

## 🔧 Prerequisites
* Node >= 18
* Bun
* PHP 8.2
* Composer 2
* Docker
* Docker Compose

## ⚙️ Installation

First of all, you need to have the following tools installed globally on your environment:

- [🥟 Bun](https://bun.sh/) - Dependency manager

To install the project:

1. Run composer and bun at the root of the project to install dependencies:

~~~bash
composer install
bun install
~~~

2. Setup your docker-compose.override.yml file and build the docker images:

~~~bash
docker compose up -d --build
~~~

3. Import the database from a backup file or using the following command to boostrap an empty wordpress database:

~~~bash
docker compose exec dev docker-as-wordpress bootstrap
docker compose exec dev wp user update admin --user_pass=admin --skip-email
~~~


## 🎨 Styles

Our style system is based on [TailwindCSS](https://tailwindcss.com/).

~~~bash
# Generate styles and watch for changes
bun run dev

# Generate styles for production
bun run build
~~~

## 🔢 Icons

We use [svg-sprite](https://www.npmjs.com/package/svg-sprite) for handling svg.

It means you need to run this command to generate a icons.svg file that contains all the svg.

~~~bash
bun run build:icons
~~~

## 🚔 Check WordPress coding standards.

You can read more about it in our [CONTRIBUTING section](./CONTRIBUTING.md).

## 🍱 Gutenberg Custom block

### Dev

~~~bash
# Build
bun run build

# Dev
bun run dev
~~~

## Authors

👤 **Antistatique**

Author and maintainers since 2025.

* Web: [antistatique.net](https://antistatique.net)
* X: [@antistatique](https://x.com/antistatique)
* Github: [@antistatique](https://github.com/antistatique)
