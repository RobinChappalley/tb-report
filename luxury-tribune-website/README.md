# 🏡 Luxury Tribune Website

Luxury Tribune Website project is based on ⚛️ [React](https://reactjs.org/) and [Next](https://nextjs.org/). It uses 💄 [Emotion](https://emotion.sh/) and [Tailwind](https://tailwindcss.com/) for styling, and ✅ [Jest](https://jestjs.io/) for testing.

It is a headless website, the content comes from a Wordpress based website accessible [here](https://content.luxurytribune.com/wp/wp-admin/).

<p align="center">
  <strong>
    <a href="https://www.luxurytribune.com/">Website</a>
    •
    <a href="https://luxury-tribune-website-git-dev-antistatique.vercel.app/">Staging</a>
  </strong>
</p>

## Installation

First of all, you need to have the following tools installed globally on your environment:

- [📗 NodeJS **14**](https://nodejs.org/en/) - JavaScript runtime used to build and run the project
- [🐈 Yarn](https://yarnpkg.com/lang/en/) - Dependency manager built on top of the NPM registry

To install the project:

```bash
$ cp .env.sample .env
$ edit .env
$ yarn
```

## Usage

Those are the main commands to use:

### 💻 Development

```bash
# Start dev mode
$ yarn dev

# Start production mode
$ yarn build
$ yarn start

# Clean project (remove .next directory)
$ yarn clean
```

### 💄 Styles

Our style system is based on [TailwindCSS](https://tailwindcss.com/).:

```bash
# Generate base (preflight) styles
$ yarn tailwind:base

# Generate all Tailwind styles
$ yarn tailwind:build
```

*⚠️ If the configuration changes, you'll need to rebuild or restart the dev server.

### Deployement

Vercel handle the deployement on staging when a PR is merged on the dev branch, and deploy to production when a PR is merged in master.

## Specificities

### API calls

As it is a headless website, we get our data from the Wordpress backend website. We make calls with GraphQL to fetch data `/hooks/*`.

Similarly, we make calls to WooCommerce REST API to handle subscriptions. For this, we use the NEXTJS app router API routes (localised at `/app/api/*`).

### Content

Pages content comes both from the backend, but some of it is also hard-coded directly in the code.
You might need to update it at times.