<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps<{
  links: any[];
}>();

const activeId = ref("");

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    activeId.value = id;
  }
}

// 滚动监听逻辑
let observer: IntersectionObserver | null = null;

function setupObserver() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver(
    (entries) => {
      // 找到第一个进入视图的元素，或者正在视图中的元素
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        activeId.value = visibleEntry.target.id;
      }
    },
    {
      rootMargin: "-80px 0px -80% 0px", // 调整触发区域
      threshold: [0, 1],
    }
  );

  props.links.forEach((link) => {
    const el = document.getElementById(link.id);
    if (el) observer?.observe(el);
  });
}

onMounted(() => {
  setupObserver();
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

// 当 links 变化时（切换文档），重新建立观察
watch(() => props.links, () => {
  setTimeout(setupObserver, 300); // 等待 DOM 更新
}, { deep: true });
</script>

<template>
  <div class="hc-toc-container">
    <div class="hc-toc-header">
      <UIcon name="i-heroicons-list-bullet" class="toc-icon" />
      <span>目录大纲</span>
    </div>
    
    <nav class="hc-toc-nav">
      <div class="hc-toc-indicator" />
      <ul class="hc-toc-list">
        <li 
          v-for="item in links" 
          :key="item.id" 
          :class="[
            'toc-item', 
            'toc-depth-' + item.depth,
            { active: activeId === item.id }
          ]"
        >
          <a 
            :href="'#' + item.id" 
            @click.prevent="scrollTo(item.id)"
            class="toc-link"
            :title="item.text"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.hc-toc-container {
  padding: 24px 16px; // 增加间距
  height: 100%;
  display: flex;
  flex-direction: column;
}

.hc-toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #171a1d;
  margin-bottom: 16px;
  padding-left: 8px;

  .toc-icon {
    width: 18px;
    height: 18px;
    color: #64748b;
  }
}

.hc-toc-nav {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.hc-toc-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #f1f5f9;
  border-radius: 2px;
}

.hc-toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  scrollbar-width: none; // 隐藏滚动条
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.toc-item {
  position: relative;
  margin: 4px 0;
  transition: all 0.2s ease;

  // 激活状态的指示条
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 0;
    background-color: #3b82f6;
    border-radius: 2px;
    transition: height 0.2s ease;
    z-index: 2;
  }

  &.active {
    &::before {
      height: 70%;
    }

    .toc-link {
      color: #3b82f6;
      font-weight: 500;
      background-color: rgba(59, 130, 246, 0.05);
    }
  }
}

.toc-link {
  display: block;
  padding: 6px 12px;
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #1e293b;
    background-color: #f8fafc;
  }
}

.toc-depth-1 {
  .toc-link { padding-left: 12px; }
}

.toc-depth-2 {
  .toc-link { padding-left: 24px; font-size: 12.5px; }
}

.toc-depth-3 {
  .toc-link { padding-left: 36px; font-size: 12px; }
}
</style>
