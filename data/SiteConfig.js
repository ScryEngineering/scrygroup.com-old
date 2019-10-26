/* This exists to provide easier configuration for various bits of the site*/
module.exports = {
  defaultAuthorName: "Scry Engineering", // The default and fallback author ID used for blog posts without a defined author.
  siteUrl: "https://www.scrygroup.com",
  contentDir: process.env.CONTENT_DIR || ".",
  contactFormEndpoint: "https://contact-form-api.customprogrammingsolutions.com/"
};
