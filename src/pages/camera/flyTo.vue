<template>
  <div class="container">
    <el-button type="primary" @click="flyTo">开始飞行</el-button>
    <el-button type="primary" @click="goBack">返回</el-button>
  </div>
</template>

<script setup>
import { useCesiumStore } from '@/store/modules/cesium'
import { useFlyTo } from '@/hooks'
import * as Cesium from 'cesium'

const CesiumStore = useCesiumStore()

// 设置目标位置: 杭州
const targetPosition = Cesium.Cartesian3.fromDegrees(
  120.153576,
  30.287459,
  30000,
)

const options = {
  destination: targetPosition,
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-90),
    roll: 0,
  },
  duration: 5,
}

const { flyTo, goBack } = useFlyTo(CesiumStore.viewer, options)
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}
</style>
