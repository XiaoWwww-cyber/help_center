<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";

definePageMeta({ layout: false });

const { triggerClick } = useHeroClick();
const onHeroClick = () => {
  triggerClick();
};

const stats = ref([
  { label: "活跃用户", value: 1000, suffix: "+", prefix: "", current: 0 },
  { label: "文档数量", value: 100, suffix: "+", prefix: "", current: 0 },
  { label: "可用性", value: 99, suffix: "%", prefix: "", current: 0 },
]);

const features = [
  {
    title: "全面覆盖",
    desc: "覆盖各类使用场景",
    icon: "i-lucide-network",
    color: "text-blue-500",
  },
  {
    title: "实时更新",
    desc: "内容实时同步更新",
    icon: "i-lucide-upload-cloud",
    color: "text-green-500",
  },
  {
    title: "智能搜索",
    desc: "支持全文检索和分类查询",
    icon: "i-lucide-share-2",
    color: "text-purple-500",
  },
  {
    title: "多端适配",
    desc: "支持PC、平板、手机等多端访问",
    icon: "i-lucide-file-check",
    color: "text-orange-500",
  },
];

onMounted(() => {
  stats.value.forEach((stat) => {
    gsap.to(stat, {
      current: stat.value,
      duration: 2.5,
      ease: "power3.out",
      roundProps: "current",
    });
  });

  gsap.fromTo(
    ".hero-text-item",
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
  );

  gsap.fromTo(
    ".hero-cards-container",
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.7)" }
  );

  gsap.fromTo(
    ".hero-list-item",
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, delay: 0.8, ease: "power2.out" }
  );

  gsap.to(".text-reveal", {
    backgroundPosition: "0% 0",
    duration: 1.2,
    stagger: 0.25,
    delay: 1,
    ease: "power2.out",
  });
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <!-- Hero Section -->
    <section
      class="relative w-full bg-linear-to-br from-blue-900 via-blue-700 to-blue-800 text-white overflow-hidden pb-20 pt-20 lg:min-h-[90vh] flex flex-col justify-center"
      @click="onHeroClick"
    >
      <ClientOnly>
        <Hero3D />
      </ClientOnly>

      <div class="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div class="hero-text-item opacity-0 inline-block px-4 py-1 bg-blue-600/50 rounded-full border border-blue-400/30 text-sm font-medium mb-6 backdrop-blur-sm">
            开源项目 · 帮助中心模板
          </div>
          <h1 class="hero-text-item opacity-0 text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            帮助中心平台
          </h1>
          <ul class="hero-list text-sm text-blue-100 mb-8 max-w-xl space-y-3">
            <li class="hero-list-item flex items-start gap-2">
              <span class="text-blue-300 mt-1">●</span>
              <span class="text-reveal">基于 Nuxt 3 构建，支持 Markdown 文档、视频教程、全文搜索等功能</span>
            </li>
            <li class="hero-list-item flex items-start gap-2">
              <span class="text-blue-300 mt-1">●</span>
              <span class="text-reveal">现代化 UI 设计，响应式布局，支持多端访问</span>
            </li>
            <li class="hero-list-item flex items-start gap-2">
              <span class="text-blue-300 mt-1">●</span>
              <span class="text-reveal">轻量化架构，易于部署和定制，快速搭建企业帮助中心</span>
            </li>
            <li class="hero-list-item flex items-start gap-2">
              <span class="text-blue-300 mt-1">●</span>
              <span class="text-reveal">开箱即用，支持云存储集成，满足各类业务场景需求</span>
            </li>
          </ul>

          <div class="hero-text-item opacity-0 flex flex-wrap gap-4 mb-12">
            <NuxtLink
              to="/docs/help"
              class="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition transform hover:-translate-y-1 cursor-pointer inline-block"
            >
              立即体验
            </NuxtLink>
            <NuxtLink
              to="/docs/help"
              class="bg-transparent border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition cursor-pointer inline-block"
            >
              了解更多
            </NuxtLink>
          </div>

          <div class="hero-text-item opacity-0 grid grid-cols-3 gap-8 border-t border-white/20 pt-8">
            <div v-for="(stat, idx) in stats" :key="idx">
              <div class="text-3xl font-bold font-mono">
                {{ stat.prefix }}{{ Math.round(stat.current) }}{{ stat.suffix }}
              </div>
              <div class="text-blue-200 text-sm mt-1">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <div class="hero-cards-container opacity-0 hidden lg:flex justify-center items-center py-10">
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

<style scoped lang="scss">
.font-sans {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}

.text-reveal {
  display: inline;
  background: linear-gradient(90deg, rgb(191 219 254) 50%, transparent 50%);
  background-size: 200% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
}

.hero-list-item {
  opacity: 0;
}
</style>
