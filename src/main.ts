import { createApp } from 'vue'
import './style/style.scss'
// if you just want to import css
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
