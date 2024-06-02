import { Viewer } from 'cesium'
import { defineStore } from 'pinia'

export type CesiumState = {
  viewer: Viewer | null
}

export const useCesiumStore = defineStore({
  id: 'app-cesium',
  state: (): CesiumState => ({
    viewer: null, // 是否锁屏
  }),
  actions: {
    setCesium(payload: Viewer) {
      this.viewer = payload
    },
  },
  persist: false,
})
