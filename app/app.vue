<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const layoutName = computed(() => {
  const meta: any = route.meta;
  if (meta?.layout === false) return null;
  return typeof meta?.layout === "string" ? meta.layout : "top-fixed";
});
</script>

<template>
  <template v-if="layoutName">
    <NuxtLayout :name="layoutName" title="帮助中心">
      <template #header>
        <div style="display: flex; align-items: center; gap: 12px">
          <img
            src="/favicon.ico"
            alt="logo"
            style="width: 24px; height: 24px"
          />
          <span>帮助中心</span>
        </div>
      </template>
      <NuxtPage />
    </NuxtLayout>
  </template>
  <template v-else>
    <NuxtPage />
  </template>
</template>
