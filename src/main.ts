import { createApp } from 'vue'
import './style/style.scss'
// if you just want to import css
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'markstream-vue/index.css'
import App from './App.vue'
import router from './router/index'
import pinia from './stores/index'

createApp(App).use(router).use(pinia).mount('#app')
