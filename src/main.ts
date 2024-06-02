import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import pinia from './store/index'
import router from './router'
import registerGlobComp from './components'

// element默认主题
import 'element-plus/dist/index.css'
// 公共样式，包含自定义暗黑模式，element重置样式
import '@/styles/index.scss'

const app = createApp(App)

/** 导入全部Element-icon */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(registerGlobComp) // 注册全局组件

app.use(ElementPlus)

app.use(pinia)

app.use(router)

app.mount('#app')
