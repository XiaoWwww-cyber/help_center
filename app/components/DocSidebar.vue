<script setup lang="ts">
import { watch, ref, nextTick, onMounted } from "vue";
import type { TreeItem } from "@nuxt/ui";

const props = defineProps<{
  items: TreeItem[];
  activePath?: string;
}>();

const emit = defineEmits(["select", "update:activePath"]);

// 展开状态 - 字符串数组
const expanded = ref<string[]>([]);

// 根据路径找到对应的 TreeItem
function findItemByPath(items: TreeItem[], targetPath: string): TreeItem | null {
  for (const item of items) {
    if (item.path === targetPath) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      const found = findItemByPath(item.children, targetPath);
      if (found) return found;
    }
  }
  return null;
}

// 根据路径找到所有需要展开的父节点 key
function findParentKeys(items: TreeItem[], targetPath: string, parentKeys: string[] = []): string[] | null {
  for (const item of items) {
    const currentKey = item.path || item.label;
    if (item.path === targetPath) {
      return parentKeys;
    }
    if (item.children && item.children.length > 0) {
      const result = findParentKeys(item.children, targetPath, [...parentKeys, currentKey]);
      if (result) return result;
    }
  }
  return null;
}

// 获取所有有 defaultExpanded 的节点 key
function getDefaultExpandedKeys(items: TreeItem[]): string[] {
  const keys: string[] = [];
  const walk = (nodes: TreeItem[]) => {
    nodes.forEach(node => {
      if (node.defaultExpanded) {
        keys.push(node.path || node.label);
      }
      if (node.children) walk(node.children);
    });
  };
  walk(items);
  return keys;
}

// 展开到指定路径
function expandToPath(path: string) {
  const parentKeys = findParentKeys(props.items, path);
  if (parentKeys) {
    const newExpanded = new Set([...expanded.value, ...parentKeys]);
    expanded.value = Array.from(newExpanded);
  }
}

// 初始化时展开默认节点
onMounted(() => {
  const defaultKeys = getDefaultExpandedKeys(props.items);
  if (defaultKeys.length) {
    expanded.value = [...new Set([...expanded.value, ...defaultKeys])];
  }
});

// 监听外部 activePath 变化（如搜索选中）
watch(() => props.activePath, (newPath) => {
  if (newPath) {
    nextTick(() => {
      expandToPath(newPath);
    });
  }
}, { immediate: true });

// 处理树节点选择 - UTree @select 事件签名: (e: SelectEvent, item: TreeItem)
function onTreeSelect(_e: any, item: TreeItem) {
  console.log('Tree select:', item);
  if (item && item.path) {
    // 只 emit select，让父组件决定是否更新 activePath
    emit("select", item.path);
  }
}

// 计算当前选中的 item
const selectedItem = ref<TreeItem | undefined>(undefined);

watch(() => props.activePath, (newPath) => {
  if (newPath) {
    selectedItem.value = findItemByPath(props.items, newPath) || undefined;
  } else {
    selectedItem.value = undefined;
  }
}, { immediate: true });
</script>

<template>
  <div class="doc-sidebar-container">
    <div class="doc-sidebar-header">
      <UIcon name="i-heroicons-folder-open" class="sidebar-icon" />
      <span>文档目录</span>
    </div>
    <nav class="doc-sidebar-nav">
      <UTree
        :model-value="selectedItem"
        v-model:expanded="expanded"
        :items="items"
        :get-key="(it) => it.path || it.label"
        color="primary"
        size="sm"
        class="doc-tree"
        @select="onTreeSelect"
      />
    </nav>
  </div>
</template>

<style>
.doc-sidebar-container {
  padding: 16px 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.doc-sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #171a1d;
  margin-bottom: 16px;
  padding-left: 8px;
}

.doc-sidebar-header .sidebar-icon {
  width: 18px;
  height: 18px;
  color: #64748b;
}

.doc-sidebar-nav {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
}

.doc-sidebar-nav::-webkit-scrollbar {
  display: none;
}

/* 树样式优化 */
.doc-tree,
.doc-tree * {
  cursor: pointer !important;
}

.doc-tree [role="treeitem"] > div {
  padding: 6px 12px !important;
  border-radius: 6px !important;
  margin: 2px 0 !important;
  transition: all 0.2s ease !important;
}

.doc-tree [role="treeitem"] > div:hover {
  background-color: #f8fafc !important;
}

.doc-tree [role="treeitem"][data-selected="true"] > div,
.doc-tree [role="treeitem"][aria-selected="true"] > div {
  background-color: rgba(59, 130, 246, 0.08) !important;
  color: #3b82f6 !important;
}

.doc-tree [role="treeitem"] span {
  font-size: 13px !important;
  color: #64748b !important;
  transition: color 0.2s ease !important;
}

.doc-tree [role="treeitem"]:hover span {
  color: #1e293b !important;
}

.doc-tree [role="treeitem"][data-selected="true"] span,
.doc-tree [role="treeitem"][aria-selected="true"] span {
  color: #3b82f6 !important;
  font-weight: 500 !important;
}
</style>
