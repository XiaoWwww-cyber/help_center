<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const { triggerClick } = useHeroClick();
const activeIndex = ref(0);
const cards = [
  {
    id: 1,
    title: "内容统计",
    icon: "i-lucide-file-text",
    color: "from-violet-500 to-violet-600",
    type: "users",
  },
  {
    id: 2,
    title: "技术栈",
    icon: "i-lucide-layers",
    color: "from-indigo-500 to-indigo-600",
    type: "security",
  },
  {
    id: 3,
    title: "访问趋势",
    icon: "i-lucide-trending-up",
    color: "from-blue-500 to-blue-600",
    type: "chart",
  },
  {
    id: 4,
    title: "性能指标",
    icon: "i-lucide-gauge",
    color: "from-cyan-500 to-cyan-600",
    type: "analysis",
  },
];

// Chart animation data
const chartHeights = ref([40, 70, 45, 90, 60, 80, 50, 95]);
const liveCount = ref(0);

// Update chart heights randomly (in pixels, max 120px for h-32 container)
let chartTimer: any;
const updateChart = () => {
  chartHeights.value = chartHeights.value.map(() => 
    Math.floor(Math.random() * 80) + 20
  );
  liveCount.value = Math.floor(Math.random() * 50) + 10;
};

// Timer
let timer: any;
const startTimer = () => {
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % cards.length;
  }, 5000);
};
const stopTimer = () => clearInterval(timer);

onMounted(() => {
  startTimer();
  // Start chart animation
  chartTimer = setInterval(updateChart, 1500);
});
onUnmounted(() => {
  stopTimer();
  clearInterval(chartTimer);
});

const handleNext = (e: Event) => {
  e.stopPropagation();
  stopTimer();
  activeIndex.value = (activeIndex.value + 1) % cards.length;
  triggerClick();
  startTimer();
};

const getCardStyle = (index: number) => {
  const offset = (index - activeIndex.value + cards.length) % cards.length;

  if (offset === 0) {
    return {
      zIndex: 30,
      transform: "scale(1) translateY(0px) translateX(0px) rotate(0deg)",
      opacity: 1,
    };
  } else if (offset === 1) {
    return {
      zIndex: 20,
      transform: "scale(0.92) translateY(-25px) translateX(25px) rotate(3deg)",
      opacity: 0.7,
    };
  } else if (offset === 2) {
    return {
      zIndex: 10,
      transform: "scale(0.84) translateY(-50px) translateX(50px) rotate(6deg)",
      opacity: 0.4,
    };
  } else {
    return {
      zIndex: 0,
      transform: "scale(0.84) translateY(-50px) translateX(50px) rotate(6deg)",
      opacity: 0,
    };
  }
};
</script>

<template>
  <div
    class="relative w-full max-w-md aspect-[4/5] md:aspect-square mx-auto perspective-1000 group cursor-pointer"
    @click="handleNext"
  >
    <div class="absolute inset-0 flex items-center justify-center">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="absolute w-full h-80 md:h-96 rounded-3xl p-6 shadow-2xl border border-white/20 backdrop-blur-xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        :class="[`bg-gradient-to-br ${card.color}`]"
        :style="getCardStyle(index)"
      >
        <!-- Glass Reflection -->
        <div
          class="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-b from-white/10 to-transparent rotate-45 pointer-events-none"
        ></div>

        <!-- Content -->
        <div class="relative z-10 h-full flex flex-col">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-2xl font-bold text-white tracking-wide">
                {{ card.title }}
              </h3>
              <div class="h-1 w-12 bg-white/40 rounded-full mt-2"></div>
            </div>
            <div
              class="p-3 bg-white/20 rounded-2xl text-white backdrop-blur-md shadow-inner"
            >
              <UIcon :name="card.icon" class="w-7 h-7" />
            </div>
          </div>

          <div class="flex-grow">
            <!-- Card Specific Content -->
            <div
              v-if="card.type === 'chart'"
              class="flex flex-col h-full justify-end"
            >
              <!-- 实时数据指示器 -->
              <div class="flex items-center gap-2 mb-3">
                <span class="live-dot w-2 h-2 bg-green-400 rounded-full"></span>
                <span class="text-xs text-blue-100/80">实时数据更新中</span>
                <span class="text-xs text-green-300 font-mono">+{{ liveCount }}</span>
              </div>
              <div class="flex gap-2 items-end h-32 px-2">
                <div
                  v-for="(h, i) in chartHeights"
                  :key="i"
                  class="flex-1 flex items-end group"
                >
                  <div
                    class="w-full bg-white/40 rounded-t transition-all duration-500 ease-out group-hover:bg-white/60 shadow-lg"
                    :style="{ height: `${h}px` }"
                  ></div>
                </div>
              </div>
              <div
                class="mt-4 flex justify-between text-xs text-blue-100/70 font-mono"
              >
                <span>00:00</span>
                <span>12:00</span>
                <span>24:00</span>
              </div>
            </div>

            <div
              v-else-if="card.type === 'security'"
              class="flex flex-col h-full justify-center gap-4 px-2"
            >
              <div
                class="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/10"
              >
                <div
                  class="p-2 bg-green-400/20 rounded-lg text-green-300 flex items-center justify-center"
                >
                  <UIcon name="i-lucide-hexagon" class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-sm font-bold text-white">Nuxt 4</div>
                  <div class="text-xs text-indigo-200">Vue 3 + Vite</div>
                </div>
              </div>
              <div
                class="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/10"
              >
                <div
                  class="p-2 bg-blue-400/20 rounded-lg text-blue-300 flex items-center justify-center"
                >
                  <UIcon name="i-lucide-palette" class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-sm font-bold text-white">Nuxt UI</div>
                  <div class="text-xs text-indigo-200">TailwindCSS</div>
                </div>
              </div>
            </div>

            <div
              v-else-if="card.type === 'users'"
              class="flex flex-col h-full justify-center items-center relative"
            >
              <div
                class="absolute inset-0 flex items-center justify-center opacity-30"
              >
                <UIcon name="i-lucide-book-open" class="w-40 h-40" />
              </div>
              <div class="grid grid-cols-2 gap-4 w-full z-10">
                <div
                  v-for="(role, i) in [
                    '文档数量',
                    '视频教程',
                    '分类目录',
                    '代码示例',
                  ]"
                  :key="i"
                  class="bg-white/10 backdrop-blur-md p-3 rounded-lg text-center border border-white/10"
                >
                  <div class="text-lg font-bold text-white mb-1">
                    {{ ["50", "20", "10", "30"][i] }}+
                  </div>
                  <div class="text-xs text-violet-200">{{ role }}</div>
                </div>
              </div>
            </div>

            <div
              v-else-if="card.type === 'analysis'"
              class="flex flex-col h-full justify-center px-2"
            >
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-xs text-cyan-100 mb-1">
                    <span>Lighthouse 评分</span>
                    <span>95+</span>
                  </div>
                  <div
                    class="h-2 w-full bg-white/20 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-cyan-300 w-[95%] rounded-full shadow-[0_0_10px_rgba(103,232,249,0.5)]"
                    ></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs text-cyan-100 mb-1">
                    <span>首屏加载</span>
                    <span>&lt; 1s</span>
                  </div>
                  <div
                    class="h-2 w-full bg-white/20 rounded-full overflow-hidden"
                  >
                    <div class="h-full bg-green-400 w-[90%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs text-cyan-100 mb-1">
                    <span>SEO 友好</span>
                    <span>100%</span>
                  </div>
                  <div
                    class="h-2 w-full bg-white/20 rounded-full overflow-hidden"
                  >
                    <div class="h-full bg-yellow-400 w-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Click hint -->
    <div class="absolute -bottom-12 left-0 right-0 text-center">
      <p class="text-white/50 text-sm animate-pulse">点击卡片切换视图</p>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

/* Live indicator pulse */
.live-dot {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}
</style>
