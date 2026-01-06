<template>
  <NuxtLayout name="doc">
    <template #sidebar-top>
      <div class="sidebar-header-search">
        <search 
          only-docs 
          compact 
          :allowed-paths="allowedPaths"
          placeholder="搜索文档..." 
          @select="onSearchSelect" 
        />
      </div>
    </template>

    <template #sidebar>
      <div class="sidebar-menu-wrapper">
        <DocSidebar :items="items" v-model:active-path="activePath" @select="onSelect" />
      </div>
    </template>

    <div v-if="doc" :key="activePath" class="hc-content">
      <ContentRenderer :value="doc" />
    </div>
    <div v-else-if="isLoading" class="hc-loading">加载中...</div>
    <div v-else class="hc-empty">未找到文档</div>

    <template #toc>
      <DocToc :links="tocLinks" />
    </template>
  </NuxtLayout>

  <div class="hc-divider" />
  <div class="hc-status">
    <span>当前文档：</span>
    <code>{{ activePath }}</code>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { docsMenuItems } from "@/config/docs-menu";

const route = useRoute();
const router = useRouter();
const items = ref(docsMenuItems);
const isLoading = ref(false);

// 提取菜单中所有有效的文档路径
const allowedPaths = computed(() => {
  const paths: string[] = [];
  const walk = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.path) paths.push(node.path);
      if (node.children) walk(node.children);
    });
  };
  walk(items.value);
  return paths;
});

const initialPath =
  typeof route.query.p === "string"
    ? route.query.p
    : items.value?.[0]?.children?.[0]?.path;
const activePath = ref(initialPath || "");

// --- 数据获取 ---
async function fetchDoc(path: string) {
  if (!path) return null;
  try {
    const p = path.endsWith("/") ? path.slice(0, -1) : path;
    let res = await queryCollection("docs").path(p).first();
    // 尝试备选路径
    if (!res) res = await queryCollection("docs").path(p + "/index").first();
    return res;
  } catch (e) {
    return null;
  }
}

const doc = ref<any>(null);

// --- TOC 逻辑 ---
const tocLinks = ref<any[]>([]);
let tocTimer: any = null;

function rebuildTocFromDom() {
  if (tocTimer) clearTimeout(tocTimer);
  tocTimer = setTimeout(() => {
    const root = document.querySelector(".hc-content");
    if (!root) return;

    const nodes = root.querySelectorAll("h1, h2, h3");
    if (nodes.length === 0) {
      // 如果还没渲染出来，再试一次
      if (tocTimer) clearTimeout(tocTimer);
      tocTimer = setTimeout(rebuildTocFromDom, 200);
      return;
    }

    const itemsList: any[] = [];
    nodes.forEach((h) => {
      const id = h.id || h.textContent?.trim().toLowerCase().replace(/\s+/g, "-") || "";
      if (!h.id) h.id = id;
      itemsList.push({ id, depth: Number(h.tagName.substring(1)), text: h.textContent || "" });
    });
    tocLinks.value = itemsList;
  }, 200); // 增加一点延迟确保 ContentRenderer 完成
}

// 监听 doc 变化更新 TOC
watch(doc, async (newVal: any) => {
  if (!newVal) {
    tocLinks.value = [];
    return;
  }
  
  // 优先使用文档自带的 TOC
  if (newVal.toc?.links?.length) {
    tocLinks.value = newVal.toc.links;
  } else {
    // 否则从 DOM 中构建
    await nextTick();
    rebuildTocFromDom();
  }
}, { immediate: true });

// --- 核心修复：手动切换逻辑 ---
async function onSelect(path: string) {
  console.log('onSelect called:', path, 'current:', activePath.value);
  
  // 如果路径相同且已有文档，则跳过
  if (activePath.value === path && doc.value) {
    console.log('Skip: same path and has doc');
    return;
  }

  // 1. 开启加载状态
  isLoading.value = true;
  doc.value = null;
  tocLinks.value = [];

  // 2. 更新路径
  activePath.value = path;
  router.replace({ query: { ...route.query, p: path } });
  
  // 3. 请求数据
  try {
    console.log('Fetching doc:', path);
    doc.value = await fetchDoc(path);
    console.log('Doc fetched:', doc.value ? 'success' : 'null');
  } finally {
    isLoading.value = false;
  }
  
  // 4. 数据加载完成且 loading 结束后，确保 TOC 出现
  await nextTick();
  if (!tocLinks.value.length) {
    rebuildTocFromDom();
  }
}

function onSearchSelect(item: any) {
  if (item.type === 'doc' && item.path) {
    onSelect(item.path);
  }
}

// 监听路由参数变化，支持外部跳转（如搜索）
watch(
  () => route.query.p,
  (newP) => {
    if (typeof newP === "string" && newP !== activePath.value) {
      onSelect(newP);
    }
  }
);

onMounted(async () => {
  // 初始加载文档
  if (activePath.value) {
    isLoading.value = true;
    try {
      doc.value = await fetchDoc(activePath.value);
    } finally {
      isLoading.value = false;
    }
  }
  rebuildTocFromDom();
});
onUnmounted(() => { if (tocTimer) clearTimeout(tocTimer); });
</script>
<style scoped>
  /* 文档内容区样式 */
  .hc-content {
    max-width: 860px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }
  
  .hc-content :deep(h1) { 
    font-size: 28px; 
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .hc-content :deep(h2) { 
    font-size: 22px; 
    font-weight: 600;
    color: #2563eb;
    margin-top: 32px;
    margin-bottom: 16px;
  }
  
  .hc-content :deep(h3) { 
    font-size: 18px; 
    font-weight: 600;
    color: #3b82f6;
    margin-top: 24px;
    margin-bottom: 12px;
  }
  
  .hc-content :deep(p) {
    font-size: 15px;
    line-height: 1.75;
    color: #475569;
    margin-bottom: 16px;
  }
  
  .hc-content :deep(ul),
  .hc-content :deep(ol) {
    padding-left: 24px;
    margin-bottom: 16px;
  }
  
  .hc-content :deep(li) {
    font-size: 15px;
    line-height: 1.75;
    color: #475569;
    margin-bottom: 8px;
  }
  
  .hc-content :deep(a) {
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .hc-content :deep(a:hover) {
    color: #2563eb;
    text-decoration: underline;
  }
  
  .hc-content :deep(img) { 
    max-width: 100%; 
    height: auto; 
    border-radius: 8px;
    margin: 16px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .hc-content :deep(table) { 
    display: block; 
    max-width: 100%; 
    overflow-x: auto;
    border-collapse: collapse;
    margin: 16px 0;
  }
  
  .hc-content :deep(th),
  .hc-content :deep(td) {
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    text-align: left;
  }
  
  .hc-content :deep(th) {
    background: #f8fafc;
    font-weight: 600;
    color: #1e293b;
  }
  
  .hc-content :deep(pre) { 
    max-width: 100%; 
    overflow: auto;
    background: #1e293b;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
  }
  
  .hc-content :deep(code) { 
    font-family: 'Fira Code', 'Monaco', monospace;
    font-size: 14px;
  }
  
  .hc-content :deep(p code),
  .hc-content :deep(li code) {
    background: #f1f5f9;
    color: #e11d48;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
  }
  
  .hc-content :deep(blockquote) {
    border-left: 4px solid #3b82f6;
    background: #f8fafc;
    padding: 16px 20px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
  }
  
  .hc-content :deep(blockquote p) {
    margin-bottom: 0;
    color: #64748b;
  }
  
  .hc-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #64748b;
    font-size: 14px;
  }
  
  .hc-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #94a3b8;
    font-size: 14px;
  }
  
  .hc-divider { 
    height: 1px; 
    background: transparent; 
  }
  
  .hc-status { 
    margin-top: 8px; 
    font-size: 12px; 
    color: #94a3b8;
    text-align: center;
  }

  /* 侧边栏搜索样式 */
  .sidebar-header-search {
    padding: 12px;
    background: #fff;
  }
  
  .sidebar-menu-wrapper {
    padding: 0;
  }
</style>