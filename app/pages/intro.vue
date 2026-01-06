<script setup lang="ts">
definePageMeta({ layout: false });

const features = [
  { title: "Markdown 驱动", desc: "基于文件的内容管理", icon: "i-lucide-file-text", color: "text-blue-500" },
  { title: "全文搜索", desc: "快速定位所需内容", icon: "i-lucide-search", color: "text-green-500" },
  { title: "响应式设计", desc: "适配各种屏幕尺寸", icon: "i-lucide-monitor-smartphone", color: "text-purple-500" },
  { title: "易于部署", desc: "支持多种托管平台", icon: "i-lucide-rocket", color: "text-orange-500" },
];
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <!-- Hero Section -->
    <section class="relative w-full bg-linear-to-br from-blue-900 via-blue-700 to-blue-800 text-white overflow-hidden pb-20 pt-20 lg:min-h-[90vh] flex flex-col justify-center">
      <ClientOnly>
        <Hero3D />
      </ClientOnly>

      <div class="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div class="inline-block px-4 py-1 bg-blue-600/50 rounded-full border border-blue-400/30 text-sm font-medium mb-6 backdrop-blur-sm">
            开源项目 · 帮助中心模板
          </div>
          <h1 class="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            帮助中心平台
          </h1>
          <ul class="text-sm text-blue-100 mb-8 max-w-xl space-y-3">
            <li class="flex items-start gap-2">
              <span class="text-blue-300 mt-1">●</span>
              <span>基于 Nuxt 4 构建，支持 Markdown 文档、视频教程、全文搜索等功能</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-300 mt-1">●</span>
              <span>现代化 UI 设计，响应式布局，支持多端访问</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-300 mt-1">●</span>
              <span>轻量化架构，易于部署和定制</span>
            </li>
          </ul>

          <div class="flex flex-wrap gap-4">
            <NuxtLink
              to="/docs/help"
              class="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition transform hover:-translate-y-1"
            >
              立即体验
            </NuxtLink>
            <NuxtLink
              to="/docs/help"
              class="bg-transparent border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition"
            >
              了解更多
            </NuxtLink>
          </div>
        </div>

        <div class="hidden lg:flex justify-center items-center py-10">
          <HeroCards />
        </div>
      </div>
    </section>

    <OverviewSection />
    <ProcessTimeline />

    <div class="container mx-auto px-6 pb-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-1 max-w-5xl mx-auto">
        <div v-for="(item, i) in features" :key="i" class="flex flex-col items-center text-center p-4">
          <UIcon :name="item.icon" :class="['w-10 h-10 mb-3', item.color]" />
          <h4 class="font-bold mb-1">{{ item.title }}</h4>
          <p class="text-xs text-slate-500">{{ item.desc }}</p>
        </div>
      </div>
    </div>

    <RoleSection />
    <AppFooter />
  </div>
</template>

<style scoped>
.font-sans {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>
