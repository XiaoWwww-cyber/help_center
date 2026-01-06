<template>
  <div class="hc-wrap">
    <!-- 移动端菜单按钮 -->
    <button class="mobile-menu-btn" @click="sidebarOpen = true">
      <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
    </button>

    <!-- 移动端侧边栏遮罩 -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="sidebar-overlay"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- 左侧边栏 -->
    <aside class="hc-left" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <span class="sidebar-title">文档目录</span>
        <button class="sidebar-close" @click="sidebarOpen = false">
          <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
        </button>
      </div>
      <!-- 新增：侧边栏顶部固定区域（如搜索） -->
      <div v-if="$slots['sidebar-top']" class="sidebar-top">
        <slot name="sidebar-top" />
      </div>
      <div class="sidebar-content">
        <slot name="sidebar" />
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="hc-main">
      <slot />
    </main>

    <!-- 右侧目录 -->
    <aside class="hc-right">
      <slot name="toc" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const sidebarOpen = ref(false);
const route = useRoute();

// 路由变化时关闭侧边栏
watch(
  () => route.path,
  () => {
    sidebarOpen.value = false;
  }
);

// 阻止滚动穿透
watch(sidebarOpen, (open) => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>

<style scoped lang="scss">
$breakpoint-tablet: 1024px;
$breakpoint-mobile: 768px;

.hc-wrap {
  display: grid;
  background-color: #f5f7fb;
  grid-template-columns: 240px minmax(0, 1fr) 280px;
  gap: 16px;
  align-items: start;
  height: calc(100vh - 90px);

  @media (max-width: $breakpoint-tablet) {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: calc(100vh - 90px);
  }
}

// 移动端菜单按钮
.mobile-menu-btn {
  display: none;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: $breakpoint-mobile) {
    display: flex;
  }
}

// 遮罩层
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  backdrop-filter: blur(2px);

  @media (max-width: $breakpoint-mobile) {
    display: block;
  }
}

// 左侧边栏
.hc-left {
  position: sticky;
  top: 0;
  height: 100%;
  overflow: hidden;
  padding: 12px;
  border-right: 1px solid #eee;
  background: #fff;
  display: flex;
  flex-direction: column;

  @media (max-width: $breakpoint-mobile) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    max-width: 80vw;
    z-index: 300;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    border-right: none;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);

    &.open {
      transform: translateX(0);
    }
  }
}

.sidebar-header {
  display: none;

  @media (max-width: $breakpoint-mobile) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 12px;
    border-bottom: 1px solid #eee;
    margin: -12px -12px 12px;
  }
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #171a1d;
}

.sidebar-top {
  padding: 0;
  border-bottom: 1px solid #eee;
  z-index: 10;
}

.sidebar-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  transition: background 0.2s;

  &:hover {
    background: #eee;
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

// 右侧目录
.hc-right {
  position: sticky;
  top: 0;
  height: 100%;
  overflow: hidden;
  padding: 0; // 移除内边距，让 DocToc 自行控制
  border-left: 1px solid #f1f5f9; // 使用更淡的颜色
  background: #fff;

  @media (max-width: $breakpoint-tablet) {
    display: none;
  }
}

// 主内容区
.hc-main {
  min-height: 60vh;
  padding: 8px 16px;
  height: 100%;
  overflow-y: auto;

  @media (max-width: $breakpoint-mobile) {
    padding: 16px;
  }
}

// 遮罩过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
