import { createApp } from 'vue'
import './style/style.scss'
// if you just want to import css
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'markstream-vue/index.css'
import App from './App.vue'
import pinia from './stores/index'
import router from './router/index'

// 顺序很重要：pinia 必须先于 router 安装。
// 路由守卫里会调用 useUserStore()，那一刻 Pinia 必须已经挂到 app 上，
// 否则会抛 "getActivePinia() was called but there was no active Pinia"。
createApp(App).use(pinia).use(router).mount('#app')
