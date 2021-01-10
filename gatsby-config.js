module.exports = {
  siteMetadata: {
    title: "CheZona",
    siteUrl: "https://www.chezona.it",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "258354107",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
  ],
};
