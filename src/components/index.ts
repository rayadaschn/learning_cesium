import type { App, Component } from 'vue'
import { MenuCom } from './Menu/'

const Components: {
  [propName: string]: Component
} = {
  MenuCom,
}

console.log('🚀 ~ 注册全局组件:', Components)

export default {
  install: (app: App) => {
    Object.keys(Components).forEach((key) => {
      app.component(key, Components[key])
    })
  },
}
