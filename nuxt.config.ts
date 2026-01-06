// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    baseURL: "/", // 部署在子路径时修改此配置，如 "/help/"
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

  // Nuxt Image 静态配置 - 禁用 IPX 处理器
  image: {
    provider: "none",
  },

  // 静态部署配置
  ssr: true, // 禁用服务端渲染,生成纯静态站点

  nitro: {
    preset: "static", // 使用静态预设
  },
  routeRules: {
    // 对所有路由进行静态预渲染
    "/**": { prerender: true },
  },
});
