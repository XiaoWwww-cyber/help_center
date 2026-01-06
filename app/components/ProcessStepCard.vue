<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  step: {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
  };
  isActive: boolean;
}>();

const cardClass = computed(() => {
  return props.isActive
    ? "bg-white border-blue-200 shadow-xl scale-100 opacity-100 translate-x-0"
    : "bg-slate-50 border-transparent shadow-none scale-95 opacity-40 translate-x-5";
});
</script>

<template>
  <div
    class="relative p-8 rounded-2xl border transition-all duration-300 mb-24 min-h-[300px] flex flex-col justify-center transform"
    :class="cardClass"
  >
    <div
      class="w-12 h-12 rounded-full flex items-center justify-center mb-6 text-white shadow-md"
      :style="{ backgroundColor: step.color }"
    >
      <UIcon :name="step.icon" class="w-6 h-6" />
    </div>
    <div class="flex items-center gap-3 mb-2">
      <span class="text-sm font-bold tracking-wider uppercase text-slate-400">
        Step 0{{ step.id }}
      </span>
    </div>
    <h3 class="text-2xl font-bold text-slate-900 mb-2">{{ step.title }}</h3>
    <h4 class="text-lg font-medium text-blue-600 mb-4">{{ step.subtitle }}</h4>
    <p class="text-slate-600 leading-relaxed text-lg">{{ step.description }}</p>
  </div>
</template>
