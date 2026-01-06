<template>
  <NuxtLayout name="top-fixed" title="视频培训中心">
    <div class="video-page">
      <div class="video-container">
        <div class="page-header">
          <h1 class="page-title">🎓 视频培训中心</h1>
          <p class="page-desc">视频培训课程，助您快速掌握系统操作</p>
        </div>

        <div class="search-wrapper">
          <div class="search-box">
            <input
              v-model="searchTerm"
              class="search-input"
              type="text"
              placeholder="搜索培训视频..."
              @input="handleSearch"
            />
            <UIcon name="i-heroicons-magnifying-glass" class="search-icon" />
          </div>
        </div>

        <div class="content-card">
          <template v-for="category in filteredCategories" :key="category.name">
            <div v-if="category.videos.length > 0" class="category-section">
              <div class="category-header">
                <span class="category-icon">{{ category.icon }}</span>
                <h2 class="category-title">{{ category.name }}</h2>
                <span class="video-count">{{ category.videos.length }} 个视频</span>
              </div>
              <div class="video-grid">
                <div
                  v-for="video in category.videos"
                  :key="video.id"
                  class="video-card"
                  @click="playVideo(video)"
                >
                  <div class="video-card-header">
                    <span class="video-icon">{{ video.icon || '▶️' }}</span>
                    <div class="video-info">
                      <h3 class="video-title" v-html="highlightText(video.title)"></h3>
                    </div>
                  </div>
                  <p class="video-desc" v-html="highlightText(video.description)"></p>
                </div>
              </div>
            </div>
          </template>

          <div v-if="noResults" class="no-results">
            <h3>😔 没有找到相关视频</h3>
            <p>请尝试使用其他关键词搜索</p>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <div v-if="showModal" class="video-modal" @click.self="closeModal">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">{{ currentVideo?.title }}</h2>
              <button class="close-btn" @click="closeModal">
                <UIcon name="i-heroicons-x-mark" class="close-icon" />
              </button>
            </div>
            <div class="modal-body">
              <div class="video-player-container">
                <video ref="videoPlayer" controls class="video-player">
                  <source :src="currentVideoUrl" type="video/mp4" />
                  您的浏览器不支持视频播放。
                </video>
              </div>
              <p class="modal-desc">{{ currentVideo?.description }}</p>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { videoCategories, VIDEO_BASE_URL, type VideoItem, type VideoCategory } from '@/config/video-data'

const categories = ref<VideoCategory[]>(videoCategories)

const searchTerm = ref('')
const showModal = ref(false)
const currentVideo = ref<VideoItem | null>(null)
const videoPlayer = ref<HTMLVideoElement | null>(null)

const currentVideoUrl = computed(() => {
  if (!currentVideo.value) return ''
  return VIDEO_BASE_URL + encodeURIComponent(currentVideo.value.fileName)
})

const filteredCategories = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  if (!term) return categories.value

  return categories.value
    .map((category) => ({
      ...category,
      videos: category.videos.filter(
        (video) =>
          video.title.toLowerCase().includes(term) ||
          video.description.toLowerCase().includes(term)
      ),
    }))
    .filter((category) => category.videos.length > 0)
})

const noResults = computed(() => {
  return searchTerm.value.trim() && filteredCategories.value.length === 0
})

const highlightText = (text: string) => {
  const term = searchTerm.value.trim()
  if (!term) return text
  const regex = new RegExp(`(${term})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

const handleSearch = () => {}

const playVideo = async (video: VideoItem) => {
  currentVideo.value = video
  showModal.value = true
  document.body.style.overflow = 'hidden'

  await nextTick()
  if (videoPlayer.value) {
    videoPlayer.value.load()
    videoPlayer.value.play().catch((error) => {
      console.error('视频播放失败:', error)
    })
  }
}

const closeModal = () => {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.currentTime = 0
  }
  showModal.value = false
  currentVideo.value = null
  document.body.style.overflow = 'auto'
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showModal.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped lang="scss">
$breakpoint-mobile: 768px;

.video-page {
  min-height: calc(100vh - 60px);
  padding-bottom: 60px;
}

.video-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  padding: 48px 0 32px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3d3d3d;
  margin-bottom: 12px;
}

.page-desc {
  font-size: 1.1rem;
  color: #666;
}

.search-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 14px 50px 14px 20px;
  font-size: 16px;
  border: none;
  border-radius: 25px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  outline: none;

  &:focus {
    box-shadow: 0 6px 30px rgba(50, 73, 198, 0.15);
  }
}

.search-icon {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 20px;
}

.content-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}

.category-section {
  margin-bottom: 40px;
  &:last-child { margin-bottom: 0; }
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
  gap: 8px;
}

.category-icon { font-size: 24px; }

.category-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.video-count {
  background: linear-gradient(135deg, #4a90e2, #3249c6);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.video-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px 0 rgba(50, 73, 198, 0.12);
    border-color: rgba(50, 73, 198, 0.15);
    background: #f2f5ff;
  }
}

.video-card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 12px;
}

.video-icon { font-size: 22px; }

.video-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.video-desc {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #888;

  h3 { font-size: 1.4rem; margin-bottom: 8px; }
  p { font-size: 1rem; }
}

.video-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  padding: 20px;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #4a90e2, #3249c6);
  color: #fff;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;

  &:hover { background: rgba(255, 255, 255, 0.25); }
}

.close-icon { font-size: 20px; }

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.video-player-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: #000;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 16px;
}

.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-desc {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

:deep(.search-highlight) {
  background: linear-gradient(120deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  font-weight: 600;
  padding: 2px 4px;
  border-radius: 3px;
}
</style>
