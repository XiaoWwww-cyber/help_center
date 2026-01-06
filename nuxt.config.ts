// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  experimental: {
    payloadExtraction: false,
  },
  devtools: { enabled: true },
  app: {
    baseURL: "/help_center/",
    buildAssetsDir: "nuxt_assets",
  },
  modules: [
    "@nuxt/content",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/ui",
    "@tresjs/nuxt",
    "nuxt-lottie",
  ],
  css: ["~/assets/css/main.css"],
  content: {},
  image: {
    provider: "none",
  },
  ssr: true,
  nitro: {
    preset: "github-pages",
  },
  routeRules: {
    "/**": { prerender: true },
  },
});
