<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const pinRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);

const roles = [
  {
    title: "内容编辑",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "i-lucide-edit",
    responsibilities: ["文档内容编写", "内容审核校对", "文档结构优化"],
    dataUpload: [
      "Markdown 文档",
      "图片素材",
      "视频资源",
    ],
    workflow: [
      "规划文档结构",
      "编写文档内容",
      "上传图片视频",
      "发布审核上线",
    ],
  },
  {
    title: "系统管理员",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: "i-lucide-shield",
    responsibilities: [
      "系统配置管理",
      "用户权限分配",
      "数据备份维护",
    ],
    dataUpload: ["系统配置", "用户数据", "操作日志"],
    workflow: [
      "配置系统参数",
      "管理用户权限",
      "监控系统状态",
      "定期数据备份",
    ],
  },
  {
    title: "开发者",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: "i-lucide-code",
    responsibilities: [
      "功能定制开发",
      "主题样式调整",
      "插件扩展集成",
    ],
    dataUpload: [
      "代码文件",
      "配置文件",
      "静态资源",
    ],
    workflow: [
      "克隆项目代码",
      "安装依赖环境",
      "开发定制功能",
      "测试部署上线",
    ],
  },
  {
    title: "普通用户",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "i-lucide-user",
    responsibilities: ["浏览帮助文档", "观看视频教程", "搜索问题答案"],
    dataUpload: ["搜索记录", "浏览历史"],
    workflow: ["访问帮助中心", "搜索相关内容", "阅读文档教程", "解决使用问题"],
  },
];

let st: ScrollTrigger | null = null;

onMounted(() => {
  if (!sectionRef.value || !pinRef.value || !trackRef.value) return;

  const setup = () => {
    if (window.innerWidth < 1024) {
      if (st) { st.kill(); st = null; }
      gsap.set(trackRef.value, { x: 0 });
      return;
    }

    const scrollLen = Math.max(
      (trackRef.value!.scrollWidth || 0) - (pinRef.value!.offsetWidth || 0), 0
    );

    if (st) st.kill();
    st = ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: "top top",
      end: "+=3000",
      scrub: true,
      pin: pinRef.value!,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.to(trackRef.value!, { x: -scrollLen * self.progress, ease: "none", overwrite: true });
      },
    });
  };

  setup();
  window.addEventListener("resize", () => { setup(); ScrollTrigger.refresh(); });
});

onBeforeUnmount(() => { if (st) st.kill(); });
</script>

<template>
  <section ref="sectionRef" class="relative bg-white">
    <div ref="pinRef" class="h-screen overflow-hidden sticky top-0">
      <div class="h-full flex items-center">
        <div ref="trackRef" class="flex gap-8 px-12 md:px-24 w-max items-center">
          <!-- Intro Card -->
          <div class="w-[80vw] md:w-[600px] h-[70vh] flex flex-col justify-center shrink-0">
            <div class="inline-block bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full border shadow-sm mb-8 w-fit">
              <span class="text-blue-600 font-bold flex items-center justify-center gap-2">
                <UIcon name="i-lucide-activity" class="w-4 h-4" />
                使用指南
              </span>
            </div>
            <h2 class="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              了解各角色<br />的使用指南
            </h2>
            <p class="text-xl text-slate-500 max-w-xl mb-8 leading-relaxed">
              深度解析内容编辑、系统管理员、开发者等各角色的使用场景、操作权限以及标准化工作流程。
              <br /><br />
              向右滑动，查看全部角色详情。
            </p>
            <div class="flex items-center gap-2 text-blue-600 animate-pulse">
              <span class="text-lg font-bold">开始浏览</span>
              <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
            </div>
          </div>

          <!-- Role Cards -->
          <div
            v-for="(role, i) in roles"
            :key="i"
            class="relative w-[85vw] md:w-[680px] h-[70vh] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col shrink-0"
          >
            <div :class="['p-8 bg-opacity-30 border-b flex items-center gap-6', role.color]">
              <div class="p-4 bg-white rounded-2xl shadow-sm">
                <UIcon :name="role.icon" class="w-10 h-10" />
              </div>
              <h3 class="text-3xl font-bold text-slate-900">{{ role.title }}</h3>
            </div>

            <div class="p-8 grid md:grid-cols-2 gap-8 overflow-y-auto flex-grow">
              <div class="space-y-8">
                <div>
                  <h4 class="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                    <UIcon name="i-lucide-check-circle-2" class="w-5 h-5 text-blue-500" />
                    角色职责
                  </h4>
                  <ul class="space-y-3">
                    <li v-for="(r, j) in role.responsibilities" :key="j" class="flex items-start text-slate-600">
                      <span class="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 mr-2 shrink-0"></span>
                      {{ r }}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 class="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                    <UIcon name="i-lucide-upload-cloud" class="w-5 h-5 text-green-500" />
                    数据权限
                  </h4>
                  <ul class="space-y-3">
                    <li v-for="(d, k) in role.dataUpload" :key="k" class="flex items-start text-slate-600">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-300 mt-2 mr-2 shrink-0"></span>
                      {{ d }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="bg-slate-50 rounded-2xl p-6">
                <h4 class="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
                  <UIcon name="i-lucide-activity" class="w-5 h-5 text-purple-500" />
                  操作流程
                </h4>
                <div class="space-y-6 relative">
                  <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                  <div v-for="(w, l) in role.workflow" :key="l" class="relative pl-10">
                    <div class="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-600 z-10">
                      {{ l + 1 }}
                    </div>
                    <p class="text-slate-700 font-medium pt-1">{{ w }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sticky { position: sticky; }
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-y-auto::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 3px; }
</style>
