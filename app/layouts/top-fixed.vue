<script setup lang="ts">
const layoutProps = useAttrs();
</script>

<template>
  <div class="layout">
    <header class="layout-header">
      <div class="layout-header-inner">
        <slot name="header">
          <div class="layout-title">{{ layoutProps.title ?? "帮助中心" }}</div>
        </slot>
      </div>
    </header>
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
$breakpoint-tablet: 1024px;
$breakpoint-mobile: 768px;

.layout {
  min-height: calc(100vh - 60px);

  @media (max-width: $breakpoint-mobile) {
    min-height: calc(100vh - 56px);
  }
}

.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #e5e6eb;
  z-index: 1000;

  @media (max-width: $breakpoint-mobile) {
    height: 56px;
    padding: 0 16px;
  }
}

.layout-header-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
}

.layout-title {
  font-size: 18px;
  font-weight: 600;

  @media (max-width: $breakpoint-mobile) {
    font-size: 16px;
  }
}

.layout-main {
  padding-top: 61px;
  background: radial-gradient(
      136% 50% at -7% 46%,
      rgba(230, 245, 255, 0.72) 1%,
      rgba(230, 242, 255, 0.15) 100%
    ),
    radial-gradient(
      220% 113% at 50% 64%,
      rgba(173, 216, 255, 0.45) 0,
      hsla(0, 0%, 99%, 0) 99%
    ),
    radial-gradient(56% 17% at 112% 36%, #e8fdff 0, rgba(234, 239, 242, 0) 100%),
    radial-gradient(86% 15% at 104% 13%, #eaf6ff 0, rgba(234, 246, 255, 0) 100%),
    radial-gradient(31% 11% at 0 28%, #eaf5ff 1%, rgba(200, 230, 255, 0) 100%),
    radial-gradient(
      110% 65% at 97% -1%,
      rgba(160, 200, 255, 0.55) 1%,
      rgba(200, 230, 255, 0) 100%
    ),
    radial-gradient(199% 97% at -8% -2%, #cfe9ff 0, rgba(200, 230, 255, 0) 100%),
    linear-gradient(0deg, rgba(221, 236, 255, 0.12), rgba(221, 236, 255, 0.12)),
    #fff;

  @media (max-width: $breakpoint-mobile) {
    padding-top: 57px;
  }
}
</style>
