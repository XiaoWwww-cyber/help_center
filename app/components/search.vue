<template>
  <div class="search-container" :class="{ 'is-compact': compact }" ref="searchContainer">
    <div class="search" :class="{ 'compact': compact }">
      <UIcon name="i-heroicons-magnifying-glass" class="search-icon" />
      <input
        class="search-input"
        v-model="value"
        :placeholder="placeholder"
        @input="onInput"
        @focus="onFocus"
      />
      <div v-if="loading" class="search-loading">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin w-5 h-5 text-gray-400" />
      </div>
    </div>

    <div v-if="showResults && (results.length > 0 || value)" class="search-results">
      <div v-if="results.length > 0" class="results-list">
        <div
          v-for="item in results"
          :key="item.type === 'video' ? `video-${item.tab}-${item.title}` : item.path"
          class="result-item"
          @click="navigateTo(item)"
        >
          <div class="result-header">
            <span v-if="item.type === 'video'" class="result-badge">🎥 视频</span>
            <span v-else class="result-badge doc-badge">📄 文档</span>
            <span v-if="item.category" class="result-category">{{ item.category }}</span>
          </div>
          <div class="result-title" v-html="highlight(item.title)"></div>
          <div class="result-desc" v-html="highlight(item.snippet || item.description)"></div>
        </div>
      </div>
      <div v-else-if="value" class="no-results">未找到相关文档</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import Fuse from "fuse.js";
import { extractTextFromAst } from "~/utils/content";
import { docsMenuItems } from "@/config/docs-menu";
import { videoData } from "@/config/video-data";

const props = withDefaults(defineProps<{
  placeholder?: string;
  compact?: boolean;
  onlyDocs?: boolean;
  allowedPaths?: string[];
}>(), {
  placeholder: "请输入搜索内容",
  compact: false,
  onlyDocs: false,
  allowedPaths: undefined
});

const emit = defineEmits(["select"]);

const router = useRouter();
const value = ref("");
const results = ref<any[]>([]);
const showResults = ref(false);
const loading = ref(false);
let fuse: Fuse<any> | null = null;
let allDocs: any[] = [];

function getMenuPaths(items: any[]): string[] {
  const paths: string[] = [];
  const walk = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.path) paths.push(node.path);
      if (node.children) walk(node.children);
    });
  };
  walk(items);
  return paths;
}

async function initSearchIndex() {
  try {
    const docs = await queryCollection("docs").all();
    const menuPaths = getMenuPaths(docsMenuItems);
    const filterPaths = props.allowedPaths || menuPaths;
    const filteredDocs = docs.filter(doc => filterPaths.includes(doc.path));

    allDocs = filteredDocs.map((doc) => ({
      ...doc,
      type: 'doc',
      content: extractTextFromAst(doc.body),
    }));

    const allItems = props.onlyDocs ? allDocs : [...allDocs, ...videoData];

    fuse = new Fuse(allItems, {
      keys: [
        { name: "title", weight: 0.7 },
        { name: "description", weight: 0.2 },
        { name: "content", weight: 0.1 },
        { name: "category", weight: 0.15 },
      ],
      includeMatches: true,
      threshold: 0.3,
      ignoreLocation: true,
    });
  } catch (e) {
    console.error("Failed to index docs", e);
  }
}

const searchContainer = ref<HTMLElement | null>(null);
const handleClickOutside = (event: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    showResults.value = false;
  }
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await initSearchIndex();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch(() => [props.onlyDocs, props.allowedPaths], async () => {
  await initSearchIndex();
});

const onFocus = () => {
  showResults.value = true;
  if (value.value) performSearch();
};

const onInput = () => {
  showResults.value = true;
  performSearch();
};

const performSearch = () => {
  if (!value.value.trim()) {
    results.value = [];
    return;
  }

  if (!fuse) return;

  const searchResults = fuse.search(value.value);

  results.value = searchResults
    .map((result) => {
      const item = result.item;
      
      if (item.type === 'video') {
        return {
          type: 'video',
          tab: item.tab,
          category: item.category,
          title: item.title,
          description: item.description,
          snippet: item.description,
        };
      }
      
      let snippet = item.description;
      const contentMatch = result.matches?.find((m) => m.key === "content");
      if (contentMatch?.value && contentMatch.indices?.length > 0) {
        const indices = contentMatch.indices[0];
        if (indices?.length >= 2) {
          const start = Math.max(0, indices[0] - 20);
          const end = Math.min(contentMatch.value.length, indices[1] + 50);
          snippet = "..." + contentMatch.value.substring(start, end) + "...";
        }
      }

      return {
        type: 'doc',
        path: item.path,
        title: item.title,
        description: item.description,
        snippet: snippet,
      };
    })
    .slice(0, 8);
};

const highlight = (text: string) => {
  if (!text || !value.value) return text || "";
  const regex = new RegExp(`(${value.value})`, "gi");
  return text.replace(regex, '<span class="text-primary-500 font-bold">$1</span>');
};

const navigateTo = (item: any) => {
  if (item.type === 'video') {
    const routeUrl = router.resolve({ path: '/video', query: { search: value.value } });
    window.open(routeUrl.href, "_blank");
  } else {
    emit("select", item);
    router.push({ path: "/docs/help", query: { p: item.path } });
  }
  showResults.value = false;
  value.value = "";
};
</script>

<style scoped lang="scss">
$breakpoint-mobile: 768px;

.search-container {
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;

  &.is-compact {
    max-width: 100%;
    margin: 0;
  }
}

.search {
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 0 16px 0 rgba(0, 23, 52, 0.1);
  display: flex;
  height: 44px;
  padding: 0 12px;
  border: 1px solid transparent;
  transition: all 0.2s;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &.compact {
    height: 36px;
    border-radius: 8px;
    box-shadow: none;
    border: 1px solid #e2e8f0;
  }

  .search-icon {
    width: 18px;
    height: 18px;
    color: #64748b;
  }

  .search-input {
    border: 0;
    outline: none;
    background: transparent;
    color: #171a1d;
    font-size: 14px;
    padding: 4px 11px;
    width: 100%;
  }
}

.search-results {
  position: absolute;
  top: 52px;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
}

.result-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;

  &:last-child { border-bottom: none; }
  &:hover { background-color: #f5f7fb; }

  .result-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .result-badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 4px;
    background: linear-gradient(135deg, #4a90e2, #3249c6);
    color: #fff;
    font-weight: 600;
  }

  .doc-badge {
    background: linear-gradient(135deg, #6aa8ff, #4a90e2);
  }

  .result-category {
    font-size: 11px;
    color: #888;
  }

  .result-title {
    font-size: 14px;
    font-weight: 600;
    color: #171a1d;
    margin-bottom: 4px;
  }

  .result-desc {
    font-size: 12px;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.no-results {
  padding: 16px;
  text-align: center;
  color: #888;
}
</style>
