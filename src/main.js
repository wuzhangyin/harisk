import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { addCacheClearListeners, clearBrowserCache } from './utils/cacheUtils'

const app = createApp(App)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 初始化缓存清理功能
addCacheClearListeners()

// 开发环境下每次启动都清理缓存
if (import.meta.env.DEV) {
  clearBrowserCache()
  console.log('开发环境：缓存已清理')
}

app.mount('#app')
