// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@collectivo/collectivo", "@collectivo/memberships"],
  i18n: {
    langDir: "./lang",
    locales: [
      { code: "en", file: "en.json" },
      { code: "de", file: "de.json" },
    ],
  },
  modules: ["@nuxt/test-utils/module"],
});
