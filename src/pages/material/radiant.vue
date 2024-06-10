<script setup>
import { useCircleDiffusion } from '@/hooks'
import { useCesiumStore } from '@/store/modules/cesium'
import * as Cesium from 'cesium'

const CesiumStore = useCesiumStore()
const viewer = CesiumStore.viewer

const { add, clear } = useCircleDiffusion(viewer)

const startScan = () => {
  add({
    position: [120.153576, 30.287459, 30000],
    scanColor: 'rgba(0,255,0,1)',
    maxRadius: 1000,
    duration: 4000,
  })
}
onMounted(() => {
  // 设置相机位置
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(120.153576, 30.287459, 3000),
  })
})
</script>
<template>
  <div class="container">
    <el-button type="primary" @click="startScan">渲染</el-button>
    <el-button type="primary" @click="clear">清除</el-button>
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
