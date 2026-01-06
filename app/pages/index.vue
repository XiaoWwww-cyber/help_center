<template>
  <div class="container">
    <div class="search-title">Hi，请问有什么可以帮您？</div>
    <Search />
    <span class="guide-title">入门指南</span>
    <div class="guide-card">
      <a
        class="guide-card-item"
        :href="toIntroHref"
        target="_blank"
        rel="noopener"
      >
        <div class="guide-card-item-title">认识平台</div>
        <div class="guide-card-item-desc">
          欢迎来到帮助中心！在这里，您可以全面了解平台的功能与服务，开启高效协同新体验。
        </div>
        <img class="guide-card-item-img" :src="getImg('image/renshi.png')" />
      </a>
      <a
        class="guide-card-item"
        :href="toUserRegisterHref"
        target="_blank"
        rel="noopener"
      >
        <div class="guide-card-item-title">新用户入门</div>
        <div class="guide-card-item-desc">快速上手平台核心功能</div>
        <img class="guide-card-item-img" :src="getImg('image/xinyonghu.png')" />
      </a>
      <a
        class="guide-card-item"
        :href="toVideoHref"
        target="_blank"
        rel="noopener"
      >
        <div class="guide-card-item-title">视频培训中心</div>
        <div class="guide-card-item-desc">专业的系统培训课程，助您快速掌握系统操作</div>
        <img class="guide-card-item-img" :src="getImg('image/shipin.png')" />
      </a>
    </div>
    <div class="role-row" ref="roleRow">
      <div
        v-for="(r, idx) in roles"
        :key="r.key"
        class="role-card"
        :class="[
          { active: currentKey === r.key },
          { left: idx === 0 },
          { right: idx === roles.length - 1 },
        ]"
        @mouseenter="handleMouseEnter(r.key)"
        @click="handleClick(r.key)"
      >
        <div class="role-card-inner">
          <template v-if="currentKey === r.key">
            <div class="role-detail">
              <div class="role-title">{{ r.name }}</div>
              <div class="role-desc">{{ r.desc }}</div>
              <div class="role-footer">
                <button class="role-cta" @click.stop="goToDoc">立即查看</button>
                <img class="role-avatar" :src="r.img" alt="avatar" />
              </div>
            </div>
          </template>
          <template v-else>
            <img class="role-icon" :src="r.img" alt="icon" />
            <div class="role-name">{{ r.name }}</div>
          </template>
        </div>
      </div>
    </div>
    <div class="wwww"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Search from "@/components/search.vue";
import { gsap } from "gsap";
import Flip from "gsap/Flip";

gsap.registerPlugin(Flip);

const router = useRouter();
const toIntroHref = router.resolve({ path: "/intro" }).href;
const toUserRegisterHref = router.resolve({ path: "/docs/help", query: { p: "/docs/user_manual/user_register" } }).href;
const toVideoHref = router.resolve({ path: "/video" }).href;

const baseURL = useRuntimeConfig().app.baseURL || "/";
const getImg = (path: string) => `${baseURL}${path}`;

const roles = [
  {
    key: "admin",
    name: "管理员",
    desc: "系统配置、用户管理、权限分配",
    img: getImg("image/jingying.png"),
    docPath: "/docs/user_manual/jyqy",
  },
  {
    key: "user",
    name: "普通用户",
    desc: "日常操作、数据查询、报表导出",
    img: getImg("image/shiyong.png"),
    docPath: "/docs/user_manual/yljg",
  },
  {
    key: "developer",
    name: "开发者",
    desc: "API对接、系统集成、二次开发",
    img: getImg("image/peisong.png"),
    docPath: "/docs/user_manual/jyqy",
  },
  {
    key: "operator",
    name: "运营人员",
    desc: "数据分析、运营报表、业务监控",
    img: getImg("image/jianguan.png"),
    docPath: "/docs/user_manual/user_register",
  },
];

const currentRole = computed(() => roles.find(r => r.key === currentKey.value));

const goToDoc = () => {
  if (currentRole.value?.docPath) {
    router.push({ path: "/docs/help", query: { p: currentRole.value.docPath } });
  }
};

const roleRow = ref<HTMLElement | null>(null);
const defaultKey = roles[0]?.key ?? "admin";
const currentKey = ref<string>(defaultKey);
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const handleMouseEnter = (key: string) => {
  if (!isMobile.value) {
    setHover(key);
  }
};

const handleClick = (key: string) => {
  if (isMobile.value) {
    if (currentKey.value !== key) {
      setHover(key);
    }
  }
};

const setHover = async (key: string) => {
  const container = roleRow.value;
  const state = container
    ? Flip.getState(container.querySelectorAll(".role-card"))
    : null;
  currentKey.value = key;
  await nextTick();
  if (state && !isMobile.value) {
    Flip.from(state, {
      duration: 0.5,
      ease: "power3.out",
      absolute: true,
      nested: true,
      scale: true,
      simple: true,
    });
  }
  animateActiveContent(container);
};

function animateActiveContent(container: HTMLElement | null) {
  const active = container?.querySelector<HTMLElement>(".role-card.active");
  if (!active) return;
  const title = active.querySelector<HTMLElement>(".role-title");
  const desc = active.querySelector<HTMLElement>(".role-desc");
  const footer = active.querySelector<HTMLElement>(".role-footer");
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  if (title)
    tl.fromTo(
      title,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.25 },
      0.06
    );
  if (desc)
    tl.fromTo(
      desc,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.25 },
      0.1
    );
  if (footer)
    tl.fromTo(
      footer,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.25 },
      0.14
    );
}
</script>

<style scoped lang="scss">
$breakpoint-tablet: 1024px;
$breakpoint-mobile: 768px;

.container {
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: $breakpoint-tablet) {
    width: 100%;
  }

  @media (max-width: $breakpoint-mobile) {
    padding: 0 16px;
  }

  .search-title {
    color: #3d3d3d;
    font-size: 42px;
    font-weight: 500;
    padding: 80px 0 30px;

    @media (max-width: $breakpoint-tablet) {
      font-size: 32px;
      padding: 60px 0 24px;
    }

    @media (max-width: $breakpoint-mobile) {
      font-size: 24px;
      padding: 40px 0 20px;
    }
  }

  .guide-title {
    font-size: 30px;
    font-weight: 500;

    @media (max-width: $breakpoint-tablet) {
      font-size: 26px;
    }

    @media (max-width: $breakpoint-mobile) {
      font-size: 22px;
    }
  }

  .guide-card {
    margin-top: 60px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 24px;

    @media (max-width: $breakpoint-tablet) {
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 40px;
      gap: 20px;
    }

    @media (max-width: $breakpoint-mobile) {
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }

    .guide-card-item {
      flex: 1;
      min-width: 0;
      align-items: center;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 24px;
      cursor: pointer;
      display: flex;
      min-height: 310px;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px;
      background: #f4f3ff;
      transition: background-color 0.2s ease, box-shadow 0.2s ease;
      text-decoration: none;
      color: inherit;

      @media (max-width: $breakpoint-tablet) {
        flex: 0 0 calc(50% - 10px);
        min-height: 280px;
      }

      @media (max-width: $breakpoint-mobile) {
        flex: none;
        width: 100%;
        min-height: auto;
        padding: 20px;
        border-radius: 16px;
      }

      &:hover {
        background: #f2f5ff;
        box-shadow: 0 6px 16px 0 rgba(50, 73, 198, 0.02),
          0 8px 48px 0 rgba(50, 73, 198, 0.12);
      }
    }

    .guide-card-item-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;

      @media (max-width: $breakpoint-mobile) {
        font-size: 18px;
        margin-bottom: 12px;
      }
    }

    .guide-card-item-desc {
      color: rgba(23, 26, 29, 0.6);
      margin-bottom: 16px;
      flex: 1;

      @media (max-width: $breakpoint-mobile) {
        font-size: 14px;
        margin-bottom: 12px;
      }
    }

    .guide-card-item-img {
      height: 147px;
      width: 256px;
      max-width: 100%;
      border-style: none;
      vertical-align: middle;
      object-fit: cover;

      @media (max-width: $breakpoint-mobile) {
        height: auto;
        width: 100%;
        max-width: 200px;
      }
    }
  }

  .role-row {
    margin-top: 40px;
    display: flex;
    height: 180px;
    border-radius: 24px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 6px 16px 0 rgba(50, 73, 198, 0.02),
      0 8px 48px 0 rgba(50, 73, 198, 0.06);

    @media (max-width: $breakpoint-tablet) {
      height: 160px;
    }

    @media (max-width: $breakpoint-mobile) {
      flex-direction: column;
      height: auto;
      border-radius: 16px;
      margin-top: 24px;
    }
  }

  .role-card {
    flex: 1 1 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    transition: background-color 0.35s ease;
    position: relative;
    padding: 24px 0;
    height: 100%;
    overflow: hidden;
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);

    @media (max-width: $breakpoint-mobile) {
      padding: 16px;
      height: auto;
      min-height: 60px;

      &:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 1px;
      background: rgba(0, 0, 0, 0.06);
      pointer-events: none;
      z-index: 2;

      @media (max-width: $breakpoint-mobile) {
        display: none;
      }
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      opacity: 0;
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
      transition: opacity 0.35s ease;
      pointer-events: none;
      will-change: opacity;
      z-index: 0;
    }
  }

  .role-card.left {
    border-left: none;
    border-radius: 24px 0 0 24px;

    &::before {
      display: none;
    }

    &::after {
      border-radius: 24px 0 0 24px;
    }

    @media (max-width: $breakpoint-mobile) {
      border-radius: 16px 16px 0 0;

      &::after {
        border-radius: 16px 16px 0 0;
      }
    }
  }

  .role-card.right {
    border-radius: 0 24px 24px 0;

    &::after {
      border-radius: 0 24px 24px 0;
    }

    @media (max-width: $breakpoint-mobile) {
      border-radius: 0 0 16px 16px;

      &::after {
        border-radius: 0 0 16px 16px;
      }
    }
  }

  .role-card-inner {
    width: 100%;
    max-width: 520px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);
    position: relative;
    z-index: 1;

    @media (max-width: $breakpoint-mobile) {
      padding: 0;
      max-width: 100%;
    }
  }

  .role-detail {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #ffffff;
    transition: opacity 0.35s ease, transform 0.35s ease;
    will-change: transform, opacity;
    width: 100%;

    @media (max-width: $breakpoint-mobile) {
      gap: 8px;
    }
  }

  .role-title {
    font-size: 20px;
    font-weight: 600;
    text-align: left;

    @media (max-width: $breakpoint-mobile) {
      font-size: 16px;
    }
  }

  .role-desc {
    font-size: 14px;
    opacity: 0.9;
    max-width: 420px;
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: $breakpoint-mobile) {
      font-size: 13px;
      max-width: 100%;
      -webkit-line-clamp: 3;
      line-clamp: 3;
    }
  }

  .role-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;

    @media (max-width: $breakpoint-mobile) {
      margin-top: 8px;
    }
  }

  .role-cta {
    height: 36px;
    padding: 0 16px;
    border: none;
    border-radius: 18px;
    color: #ffffff;
    cursor: pointer;
    background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
    font-size: 14px;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    @media (max-width: $breakpoint-mobile) {
      height: 32px;
      padding: 0 14px;
      font-size: 13px;
    }
  }

  .role-avatar {
    width: 52px;
    height: 52px;
    border-radius: 12px;

    @media (max-width: $breakpoint-mobile) {
      width: 40px;
      height: 40px;
      border-radius: 8px;
    }
  }

  .role-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;

    @media (max-width: $breakpoint-mobile) {
      width: 36px;
      height: 36px;
      border-radius: 8px;
    }
  }

  .role-name {
    font-size: 16px;
    font-weight: 500;
    color: #171a1d;

    @media (max-width: $breakpoint-mobile) {
      font-size: 14px;
    }
  }

  .role-card.active {
    flex: 2.8 1 0;

    @media (max-width: $breakpoint-mobile) {
      flex: none;
    }

    &::after {
      opacity: 1;
    }
  }

  .role-card.active .role-detail {
    opacity: 1;
    transform: translateX(0);
  }

  .role-card:not(.active) .role-detail {
    opacity: 0;
    transform: translateX(-8px);
  }

  .role-card:not(.active) .role-card-inner {
    @media (max-width: $breakpoint-mobile) {
      flex-direction: row;
      justify-content: flex-start;
      gap: 12px;
    }
  }

  .wwww {
    margin-top: 60px;
    height: 30px;

    @media (max-width: $breakpoint-mobile) {
      margin-top: 32px;
      height: 20px;
    }
  }
}
</style>
