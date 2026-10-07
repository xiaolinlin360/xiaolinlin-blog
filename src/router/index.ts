import { createRouter, createWebHashHistory } from 'vue-router'

import AboutView from '../views/HelloWorld.vue'
import IndexView from '../views/IndexView.vue'
import OverviewView from '@/views/overview.vue'

const routes = [
  {
    path: '/',
    component: IndexView,
    redirect: '/files',
    children: [
      {
        path: '/files',
        name: 'Files',
        component: OverviewView,
      },
      // {
      //   path: '/blog',
      //   name: 'Blog',
      //   component: () => import('../views/BlogView.vue'),
      // },
      // {
      //   path: '/gallery',
      //   name: 'Gallery',
      //   component: () => import('../views/GalleryView.vue'),
      // },
      // {
      //   path: '/notes',
      //   name: 'Notes',
      //   component: () => import('../views/NotesView.vue'),
      // },
      // {
      //   path: '/resources',
      //   name: 'Resources',
      //   component: () => import('../views/ResourcesView.vue'),
      // },
      // {
      //   path: '/settings',
      //   name: 'Settings',
      //   component: () => import('../views/SettingsView.vue'),
      // },
    ],
  },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
