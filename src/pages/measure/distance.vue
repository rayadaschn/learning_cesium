<script setup>
import { useCesiumStore } from '@/store/modules/cesium'
import { useMeasureTool } from '@/hooks'
import { Cartesian3 } from 'cesium'

const CesiumStore = useCesiumStore()
const viewer = CesiumStore.viewer
// 设置目标位置: 杭州
viewer.camera.setView({
  destination: Cartesian3.fromDegrees(120.153576, 30.287459, 3000),
})

const { drawLineMeasureGraphics } = useMeasureTool(viewer)

const onLineMeasure = () => {
  drawLineMeasureGraphics()
}
</script>

<template>
  <div class="container">
    <el-button type="primary" @click="onLineMeasure">空间距离</el-button>
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
