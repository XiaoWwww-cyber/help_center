<template>
  <footer class="bg-blue-900 text-white py-12">
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-6 md:mb-0">
          <h2 class="text-2xl font-bold mb-2">帮助中心平台</h2>
          <p class="text-blue-300 text-sm">构建全链条、全流程的管理体系</p>
        </div>
        <div class="flex gap-6">
          <a href="#" class="hover:text-blue-300 transition">关于我们</a>
          <a href="#" class="hover:text-blue-300 transition">技术支持</a>
          <a href="#" class="hover:text-blue-300 transition">法律声明</a>
          <a href="#" class="hover:text-blue-300 transition">联系方式</a>
        </div>
      </div>
      <div class="border-t border-blue-800 mt-8 pt-8 text-center text-blue-400 text-sm">
        &copy; {{ new Date().getFullYear() }} Help Center Platform
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
