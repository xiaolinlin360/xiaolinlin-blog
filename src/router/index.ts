import { createRouter, createWebHistory } from 'vue-router'
import PagePlaceholder from '@/views/PagePlaceholder.vue'

// 五个页面先用同一个占位组件，后面一个一个替换成真页面
const routes = [
  { path: '/', name: '首页', component: PagePlaceholder },
  { path: '/blog', name: '博客', component: PagePlaceholder },
  { path: '/gallery', name: '图库', component: PagePlaceholder },
  { path: '/notes', name: '随笔', component: PagePlaceholder },
  { path: '/guestbook', name: '留言', component: PagePlaceholder },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 切页回到顶部
  scrollBehavior: () => ({ top: 0 }),
})

export default router
