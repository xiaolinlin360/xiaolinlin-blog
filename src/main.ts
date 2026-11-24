import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 字体：拉丁文用 Outfit，中文用霞鹜文楷，代码用 JetBrains Mono（都是本地打包，不走外网）
import '@fontsource-variable/outfit'
import 'lxgw-wenkai-screen-webfont/lxgwwenkaiscreen.css'
import '@fontsource/jetbrains-mono/400.css'

import App from './App.vue'
import router from './router'
import './style/style.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
