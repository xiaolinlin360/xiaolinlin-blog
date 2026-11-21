import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '@/views/HomeView.vue'
// import ArticleView from '@/views/ArticleView.vue'
// import PagePlaceholder from '@/views/PagePlaceholder.vue'

// 首页和博客做了，其余先用占位组件
const routes = [
  // ① 访问根路径 / 时直接重定向到 /blog
  { path: '/', redirect: '/blog' },

  // ② 全部改为懒加载
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/HomeView.vue'),
    // component: () => import('@/views/BlogView.vue'),
    meta: { title: '博客' },
  },
  {
    // 列表页：/article，分类筛选走 ?top=xxx
    path: '/article',
    name: 'article',
    component: () => import('@/views/ArticleView.vue'),
    meta: { title: '文章' },
  },
  {
    // 详情页：/article/<uuid>，跟列表用 query 区分开，不会打架
    path: '/article/:uuid',
    name: 'article-detail',
    component: () => import('@/views/ArticleDetailView.vue'),
    meta: { title: '文章详情' },
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('@/views/PagePlaceholder.vue'),
    meta: { title: '图库' },
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('@/views/PagePlaceholder.vue'),
    meta: { title: '随笔' },
  },
  {
    path: '/guestbook',
    name: 'guestbook',
    component: () => import('@/views/PagePlaceholder.vue'),
    meta: { title: '留言' },
  },

  // ③ 兜底 404（可选，强烈建议）
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'not-found',
  //   component: () => import('@/views/NotFound.vue'),
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 切页回到顶部
  scrollBehavior: () => ({ top: 0 }),
})

export default router
