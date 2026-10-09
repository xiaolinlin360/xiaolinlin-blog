import { createRouter, createWebHashHistory } from 'vue-router'

import AboutView from '../views/HelloWorld.vue'
import IndexView from '../views/IndexView.vue'
import OverviewView from '@/views/overview.vue'
import FilesView from '@/views/FilesView.vue'
import GalleryView from '@/views/GalleryView.vue'
import NotesView from '@/views/NotesView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import SettingsView from '@/views/SettingsView.vue'
import BlogView from '@/views/BlogView.vue'
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
