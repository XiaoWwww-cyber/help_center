<script setup lang="ts">
import { onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OverviewCard from "./OverviewCard.vue";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "平台优势",
    description: [
      "开箱即用：基于 Nuxt 4 构建，快速部署上线",
      "高度可定制：灵活的配置选项，满足不同需求",
      "响应式设计：完美适配桌面端和移动端",
    ],
    icon: "i-lucide-shield-check",
    color: "blue" as const,
  },
  {
    title: "核心特色",
    description: [
      "Markdown 文档支持，编写简单高效",
      "视频教程中心，多媒体内容展示",
      "全文搜索功能，快速定位所需内容",
    ],
    icon: "i-lucide-scan-barcode",
    color: "green" as const,
  },
  {
    title: "核心功能",
    description: [
      "文档管理：分类清晰的文档结构",
      "视频培训：支持视频教程播放",
      "智能搜索：全文检索快速查找",
      "多端适配：PC、平板、手机全覆盖",
    ],
    icon: "i-lucide-zap",
    color: "purple" as const,
  },
];

onMounted(() => {
  // Animate header
  gsap.fromTo(
    ".overview-header",
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: ".overview-section",
        start: "top 80%",
      },
    }
  );

  // Animate cards
  gsap.fromTo(
    ".overview-card",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".overview-cards-grid",
        start: "top 80%",
      },
    }
  );
});
</script>

<template>
  <section class="overview-section relative py-24 overflow-hidden bg-white">
    <!-- Background Decor -->
    <svg
      class="absolute inset-0 -z-10 h-full w-full stroke-slate-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="40"
          height="40"
          x="50%"
          y="-1"
          patternUnits="userSpaceOnUse"
        >
          <path d="M.5 40V.5H40" fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        stroke-width="0"
        fill="url(#grid-pattern)"
      />
    </svg>
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"
    />

    <div class="container mx-auto px-6 max-w-7xl">
      <div
        class="overview-header text-center max-w-3xl mx-auto mb-16 opacity-0"
      >
        <h2 class="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
          平台概述
        </h2>
        <p class="text-xl text-slate-600 leading-relaxed">
          基于<span class="relative inline-block px-1 mx-0.5"><span class="absolute inset-0 bg-blue-100 -skew-x-6 rounded-sm"></span><span class="relative text-blue-700 font-bold">Nuxt 4</span></span>构建的现代化帮助中心模板，支持<span class="relative inline-block px-1 mx-0.5"><span class="absolute inset-0 bg-blue-100 -skew-x-6 rounded-sm"></span><span class="relative text-blue-700 font-bold">Markdown</span></span>文档编写，提供<span class="relative inline-block px-1 mx-0.5"><span class="absolute inset-0 bg-blue-100 -skew-x-6 rounded-sm"></span><span class="relative text-blue-700 font-bold">视频教程、全文搜索</span></span>等功能，帮助企业快速搭建<span class="relative inline-block px-1 mx-0.5"><span class="absolute inset-0 bg-blue-100 -skew-x-6 rounded-sm"></span><span class="relative text-blue-700 font-bold">专业帮助中心</span></span>。
        </p>
      </div>

      <div class="overview-cards-grid grid md:grid-cols-3 gap-8">
        <div
          v-for="(feature, idx) in features"
          :key="idx"
          class="overview-card opacity-0"
        >
          <OverviewCard :feature="feature" :index="idx" />
        </div>
      </div>
    </div>
  </section>
</template>
