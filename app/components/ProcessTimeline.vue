<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProcessStepCard from "./ProcessStepCard.vue";
import procurementJSON from "@/assets/lottie/procurement.json";
import deliveryJSON from "@/assets/lottie/delivery.json";
import verifyJSON from "@/assets/lottie/verify.json";
import inventoryJSON from "@/assets/lottie/Inventory.json";
import doctorJSON from "@/assets/lottie/doctor.json";
import uploadJSON from "@/assets/lottie/upload.json";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: 1,
    title: "规划",
    subtitle: "内容规划",
    description: "梳理帮助文档结构，规划内容分类，确定文档大纲",
    icon: "i-lucide-shopping-cart",
    color: "#3b82f6",
    lottieData: procurementJSON,
  },
  {
    id: 2,
    title: "编写",
    subtitle: "文档编写",
    description: "使用 Markdown 编写文档，支持代码高亮、图片、表格等丰富格式",
    icon: "i-lucide-truck",
    color: "#10b981",
    lottieData: deliveryJSON,
  },
  {
    id: 3,
    title: "审核",
    subtitle: "内容审核",
    description: "审核文档内容准确性，确保信息完整、表述清晰",
    icon: "i-lucide-clipboard-check",
    color: "#8b5cf6",
    lottieData: verifyJSON,
  },
  {
    id: 4,
    title: "发布",
    subtitle: "文档发布",
    description: "一键发布文档，自动生成目录和导航",
    icon: "i-lucide-warehouse",
    color: "#f97316",
    lottieData: inventoryJSON,
  },
  {
    id: 5,
    title: "维护",
    subtitle: "持续维护",
    description: "根据用户反馈持续更新文档，保持内容时效性",
    icon: "i-lucide-pill",
    color: "#ef4444",
    lottieData: doctorJSON,
  },
  {
    id: 6,
    title: "分析",
    subtitle: "数据分析",
    description: "分析用户访问数据，优化文档结构和内容",
    icon: "i-lucide-file-text",
    color: "#3b82f6",
    lottieData: uploadJSON,
  },
];

const containerRef = ref<HTMLElement | null>(null);
const activeStep = ref(0);

onMounted(() => {
  if (!containerRef.value) return;

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const step = Math.floor(progress * steps.length);
      const clamped = Math.min(Math.max(step, 0), steps.length - 1);
      if (clamped !== activeStep.value) {
        activeStep.value = clamped;
      }
    },
  });

  gsap.fromTo(
    ".timeline-header",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: { trigger: ".timeline-section", start: "top 80%" },
    }
  );
});
</script>

<template>
  <div ref="containerRef" class="timeline-section relative bg-slate-50 py-24">
    <div class="container mx-auto px-4 md:px-6">
      <div class="timeline-header text-center max-w-3xl mx-auto mb-20 opacity-0">
        <h2 class="text-4xl font-bold text-slate-900 mb-6 tracking-tight">文档管理流程</h2>
        <p class="text-xl text-slate-600 leading-relaxed">
          从规划到发布，覆盖文档生命周期的每一个关键环节，实现
          <span class="relative inline-block px-2 mx-1">
            <span class="absolute inset-0 bg-blue-100 -skew-x-6 rounded-sm"></span>
            <span class="relative text-blue-700 font-bold">"内容完整、结构清晰、持续更新"</span>
          </span>
          的文档管理。
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-12">
        <div class="hidden lg:flex lg:w-1/2 sticky top-24 h-[calc(100vh-6rem)] items-center justify-center">
          <div class="relative w-full aspect-square max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-8 flex items-center justify-center">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 -z-10" />
            <div class="w-full h-full relative">
              <div
                v-for="(step, index) in steps"
                :key="step.id"
                class="absolute inset-0 transition-opacity duration-500 ease-in-out flex flex-col items-center justify-center p-8"
                :class="activeStep === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
              >
                <div class="w-full h-64 mb-6">
                  <ClientOnly>
                    <Lottie v-if="activeStep === index" :data="step.lottieData" :height="300" :width="300" :loop="true" :autoplay="true" />
                  </ClientOnly>
                </div>
                <div class="text-center transition-all duration-500" :class="activeStep === index ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'">
                  <h3 class="text-2xl font-bold" :style="{ color: step.color }">{{ step.subtitle }}</h3>
                  <p class="text-slate-400 mt-2">全流程节点 {{ step.id }}/6</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/2 pt-12 pb-24">
          <ProcessStepCard v-for="(step, index) in steps" :key="step.id" :step="step" :isActive="activeStep === index" />
        </div>
      </div>
    </div>
  </div>
</template>
