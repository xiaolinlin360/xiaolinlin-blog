import { useDark } from '@vueuse/core'

/**
 * 全站只留一份深浅色状态。
 * 顶栏的按钮和首页里的卡片都 import 这里，
 * 谁也别自己再 useDark() 一份 —— 那样各读各的，按了按钮另一个不会动。
 */
export const isDark = useDark({
  valueDark: 'dark',
  // 手动切亮色时给 html 加 .light，
  // 才能盖掉 style.scss 里「跟随系统深色」那条 :root:not(.light) 规则
  valueLight: 'light',
})

/**
 * 切换深浅色。
 * 切换的这 0.35s 里给 <html> 挂个 .theme-transition，
 * 让背景/文字/边框颜色一起渐变过去，切完立刻摘掉，
 * 免得平时 hover 也被拖慢 0.35s。
 */
export const toggleDark = () => {
  const root = document.documentElement
  root.classList.add('theme-transition')
  isDark.value = !isDark.value
  window.setTimeout(() => root.classList.remove('theme-transition'), 350)
}
