<script setup>
import RainEffect from '@/utils/cesiumCtrl/rain.js'
import { useCesiumStore } from '@/store/modules/cesium'
import { onUnmounted } from 'vue'

const CesiumStore = useCesiumStore()
const instance = new RainEffect(CesiumStore.viewer, {
  tiltAngle: -0.2, //倾斜角度
  rainSize: 1.0, // 雨大小
  rainSpeed: 120.0, // 雨速
})

const hide = () => {
  instance.show(false)
}
const start = () => {
  instance.show(true)
}
onUnmounted(() => {
  instance.destroy()
})
</script>
<template>
  <div class="container">
    <el-button type="primary" @click="start">开始</el-button>
    <el-button type="primary" @click="hide">停止</el-button>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}
</style>
