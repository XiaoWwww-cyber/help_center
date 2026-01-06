<template>
  <div class="video-player-container">
    <video
      :src="src"
      :poster="poster"
      controls
      preload="metadata"
      class="video-player"
    >
      您的浏览器不支持视频播放。
    </video>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string;
  poster?: string;
}>();
</script>

<style scoped>
.video-player-container {
  width: 100%;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f3f4f6; /* 浅灰色背景，避免加载前空白 */
}

.video-player {
  width: 100%;
  height: auto;
  display: block;
  max-height: 600px; /* 防止视频过高 */
}
</style>
