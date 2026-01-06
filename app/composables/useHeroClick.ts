// 全局点击事件
const clickCount = ref(0)

export function useHeroClick() {
  const triggerClick = () => {
    clickCount.value++
  }

  return {
    clickCount,
    triggerClick,
  }
}
