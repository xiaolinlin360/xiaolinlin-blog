import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'

import AboutView from '../views/HelloWorld.vue'
import IndexView from '../views/IndexView.vue'
import OverviewView from '@/views/IndexView/Overview.vue'
import FilesView from '@/views/IndexView/FilesView.vue'
import GalleryView from '@/views/IndexView/GalleryView.vue'
import NotesView from '@/views/IndexView/NotesView.vue'
import ResourcesView from '@/views/IndexView/ResourcesView.vue'
import SettingsView from '@/views/IndexView/SettingsView.vue'
import BlogView from '@/views/IndexView/BlogView.vue'
import LoginView from '@/views/login.vue'

const routes = [
  {
    path: '/',
    component: IndexView,
    redirect: '/OverviewView',
    // 挂在父路由上，7 个子路由通过 matched 链自动继承（见下面守卫）
    meta: { requiresAuth: true },
    children: [
      {
        path: '/OverviewView',
        name: 'OverviewView',
        component: OverviewView,
      },
      {
        path: '/files',
        name: 'Files',
        component: FilesView,
      },
      {
        path: '/blog',
        name: 'Blog',
        component: BlogView,
      },
      {
        path: '/gallery',
        name: 'Gallery',
        component: GalleryView,
      },
      {
        path: '/notes',
        name: 'Notes',
        component: NotesView,
      },
      {
        path: '/resources',
        name: 'Resources',
        component: ResourcesView,
      },
      {
        path: '/settings',
        name: 'Settings',
        component: SettingsView,
      },
    ],
  },
  { path: '/about', component: AboutView }, // 公开
  { path: '/login', name: 'Login', component: LoginView }, // 公开
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

/**
 * 全局守卫：后台所有页面都要登录。
 *
 * 为什么用 to.matched.some(...) 而不是直接读 to.meta.requiresAuth：
 * 父路由上挂一次 requiresAuth，所有子路由就都受保护，
 * 以后往 children 里加页面不需要再记得补 meta。
 */
router.beforeEach((to) => {
  const userStore = useUserStore()
  const isLoggedIn = Boolean(userStore.token)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // 没登录要进后台 → 去登录页，并记住原本想去哪
  if (requiresAuth && !isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 已经登录还点去登录页 → 直接回首页，避免重复登录
  if (to.path === '/login' && isLoggedIn) {
    return { path: '/OverviewView' }
  }

  return true
})

export default router
