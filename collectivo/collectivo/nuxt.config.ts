// https://nuxt.com/docs/api/configuration/nuxt-config
import pkg from "./package.json";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    collectivoVersion: pkg.version,
    apiToken: process.env.COLLECTIVO_API_TOKEN || "badToken",
    directusAdminEmail: process.env.DIRECTUS_ADMIN_EMAIL || "api@example.com",
    directusAdminPassword: process.env.DIRECTUS_ADMIN_PASSWORD || "d1r3ctu5",
    keycloakAdminClient: process.env.KEYCLOAK_ADMIN_CLIENT || "admin-cli",
    keycloakAdminSecret: process.env.KEYCLOAK_ADMIN_SECRET || "**********",
    emailFrom: process.env.EMAIL_FROM || "",
    emailSmtpHost: process.env.EMAIL_SMTP_HOST || "",
    emailSmtpPort: process.env.EMAIL_SMTP_PORT || "",
    emailSmtpUser: process.env.EMAIL_SMTP_USER || "",
    emailSmtpPassword: process.env.EMAIL_SMTP_PASSWORD || "",
    public: {
      debug: false,
      collectivoUrl: process.env.COLLECTIVO_URL || "http://localhost:3000",
      collectivoContactEmail:
        process.env.COLLECTIVO_CONTACT_EMAIL || "info@example.com",
      authService: process.env.COLLECTIVO_AUTH_SERVICE || "keycloak",
      keycloakUrl: process.env.KEYCLOAK_URL || "http://keycloak:8080",
      keycloakRealm: process.env.KEYCLOAK_REALM || "collectivo",
      keycloakClient: process.env.KEYCLOAK_NUXT_CLIENT || "nuxt",
      directusUrl: process.env.DIRECTUS_URL || "http://localhost:8055",
    },
  },
  colorMode: {
    preference: "light",
  },
  hooks: {},
  modules: ["@nuxt/ui", "@nuxtjs/i18n", "@nuxtjs/google-fonts", "@nuxt/eslint"],
  i18n: {
    lazy: false, // TODO: Lazy loading does not work with current switch
    strategy: "no_prefix",
    defaultLocale: "en",
    langDir: "./lang",
    locales: [
      { code: "en", file: "en.json" },
      { code: "de", file: "de.json" },
    ],
  },
  css: [join(currentDir, "./assets/css/main.css")],
  ui: {
    global: true,
    icons: ["heroicons"],
    safelistColors: ["primary", "green", "orange", "blue", "pink", "red"],
  },
  googleFonts: {
    download: true,
    families: {
      Urbanist: "100..900",
    },
  },
});
