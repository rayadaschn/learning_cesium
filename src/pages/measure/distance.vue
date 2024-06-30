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

const { drawLineMeasureGraphics, drawAreaMeasureGraphics } =
  useMeasureTool(viewer)

const isLineDrawing = ref(false)
const onLineMeasure = () => {
  isLineDrawing.value = true
  const callback = (positions, polyObj) => {
    console.log('绘制完成', positions, polyObj)
    isLineDrawing.value = false
  }
  drawLineMeasureGraphics({ callback })
}

const isAreaDrawing = ref(false)
const onAreaMeasure = () => {
  isAreaDrawing.value = true
  const callback = (positions, polyObj) => {
    console.log('绘制完成', positions, polyObj)
    isAreaDrawing.value = false
  }
  drawAreaMeasureGraphics({ callback })
}
</script>

<template>
  <div class="container">
    <el-button type="primary" @click="onLineMeasure">
      {{ isLineDrawing ? '开始绘制' : '距离测量' }}
    </el-button>
    <el-button type="primary" @click="onAreaMeasure">
      {{ isAreaDrawing ? '开始绘制' : '空间面积' }}
    </el-button>
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
