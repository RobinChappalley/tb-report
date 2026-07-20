const path = require("path");

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

module.exports = {
  webpack(config) {
    config.resolve = {
      ...config.resolve,
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  experimental: {
    modern: true,
    async redirects() {
      return [
        { source: "/index.html", destination: "/", permanent: true },
        { source: "/authors", destination: "/a-propos", permanent: true },
        { source: "/en/authors", destination: "/en/about", permanent: true },
        { source: "/authors/", destination: "/a-propos", permanent: true },
        { source: "/en/authors/", destination: "/en/about", permanent: true },
        { source: "/gift", destination: "/en/gift", permanent: true },
        { source: "/gift/", destination: "/en/gift", permanent: true },
      ];
    },
  },
  trailingSlash: false,
  images: {
    domains: [
      "localhost",
      "content-staging.luxurytribune.com",
      "content.luxurytribune.com",
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1640],
    imageSizes: [128, 256, 384],
  },
  async rewrites() {
    return [
      {
        // Intercepte la requête générée par src/client/client.js
        source: "/wp/graphql",
        // Transfère discrètement la requête vers le serveur de production
        destination: "https://content.luxurytribune.com/wp/graphql",
      },
    ];
  },
};
