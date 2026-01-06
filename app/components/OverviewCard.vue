<script setup lang="ts">
import { ref, computed } from "vue";
import { gsap } from "gsap";

const props = defineProps<{
  feature: {
    title: string;
    description: string[];
    icon: string;
    color: "blue" | "green" | "purple";
  };
  index: number;
}>();

const cardRef = ref<HTMLElement | null>(null);
const spotlightX = ref(-1000);
const spotlightY = ref(-1000);
const rotateX = ref(0);
const rotateY = ref(0);
const opacity = ref(0); // For spotlight opacity

// Color mapping
const colorMap = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    border: "group-hover:border-blue-500/50",
    spotlight: "59, 130, 246",
  },
  green: {
    bg: "bg-emerald-500",
    text: "text-emerald-600",
    border: "group-hover:border-emerald-500/50",
    spotlight: "16, 185, 129",
  },
  purple: {
    bg: "bg-violet-500",
    text: "text-violet-600",
    border: "group-hover:border-violet-500/50",
    spotlight: "139, 92, 246",
  },
};

const theme = computed(() => colorMap[props.feature.color]);

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;

  const rect = cardRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Spotlight position
  spotlightX.value = x;
  spotlightY.value = y;
  opacity.value = 1;

  // Tilt calculation
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateXValue = ((y - centerY) / centerY) * -10; // Max -10 to 10 degrees
  const rotateYValue = ((x - centerX) / centerX) * 10;

  // Smooth transition using GSAP
  gsap.to(rotateX, { value: rotateXValue, duration: 0.5, ease: "power2.out" });
  gsap.to(rotateY, { value: rotateYValue, duration: 0.5, ease: "power2.out" });
};

const handleMouseLeave = () => {
  opacity.value = 0;
  // Reset rotation
  gsap.to(rotateX, { value: 0, duration: 0.5, ease: "power2.out" });
  gsap.to(rotateY, { value: 0, duration: 0.5, ease: "power2.out" });
};
</script>

<template>
  <div
    ref="cardRef"
    class="group relative h-full rounded-2xl bg-slate-50 border border-slate-200 shadow-sm transition-colors duration-300"
    :class="theme.border"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    :style="{
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transformStyle: 'preserve-3d',
    }"
  >
    <!-- Spotlight Effect Overlay -->
    <div
      class="pointer-events-none absolute -inset-px rounded-2xl transition duration-300"
      :style="{
        opacity: opacity,
        background: `radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, rgba(${theme.spotlight}, 0.10), transparent 80%)`,
      }"
    />

    <div
      class="relative h-full p-8 flex flex-col z-10"
      style="transform: translateZ(0)"
    >
      <!-- Floating Icon -->
      <div
        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner bg-white/80 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
        :class="theme.text"
        style="transform: translateZ(30px)"
      >
        <UIcon :name="feature.icon" class="w-8 h-8" />
      </div>

      <h3
        class="text-2xl font-bold text-slate-900 mb-6 group-hover:text-brand-600 transition-colors"
        style="transform: translateZ(20px)"
      >
        {{ feature.title }}
      </h3>

      <div class="space-y-4 flex-grow" style="transform: translateZ(10px)">
        <div
          v-for="(desc, i) in feature.description"
          :key="i"
          class="flex items-start gap-3 p-3 rounded-lg bg-white/50 group-hover:bg-white/80 transition-colors border border-transparent group-hover:border-slate-100"
        >
          <UIcon
            name="i-lucide-check-circle-2"
            class="w-5 h-5 flex-shrink-0 mt-0.5"
            :class="theme.text"
          />
          <p class="text-slate-600 text-sm leading-relaxed">{{ desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
