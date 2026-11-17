import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PagePlaceholder from '@/views/PagePlaceholder.vue'

// 首页已经做了，其余四个先用占位组件
const routes = [
  { path: '/', name: '首页', component: HomeView },
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
