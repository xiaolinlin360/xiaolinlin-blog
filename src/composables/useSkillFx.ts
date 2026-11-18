import { ref } from 'vue'

/** 全站共享：点一次 Skills 就 +1，右栏图标墙 watch 它，每变一次播一遍动画 */
export const skillClicks = ref(0)
