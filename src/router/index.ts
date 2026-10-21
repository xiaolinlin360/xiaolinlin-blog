import { createRouter, createWebHashHistory } from 'vue-router'

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
  { path: '/about', component: AboutView },
  { path: '/login', component: LoginView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
