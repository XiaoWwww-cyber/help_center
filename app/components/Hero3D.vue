<script setup lang="ts">
// Logic has been moved to Hero3DScene.vue to ensure useLoop is called within TresCanvas context
</script>

<template>
  <div class="absolute inset-0 z-0 opacity-60 pointer-events-none">
    <TresCanvas alpha>
      <TresPerspectiveCamera :position="[0, 0, 5]" :fov="60" />
      <TresAmbientLight :intensity="0.5" />
      <Hero3DScene />
    </TresCanvas>
  </div>
</template>
