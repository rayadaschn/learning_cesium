<script setup>
import { useCesiumStore } from '@/store/modules/cesium'
import * as Cesium from 'cesium'

const CesiumStore = useCesiumStore()

// 记录初始位置
const initialPosition = CesiumStore.viewer.camera.position.clone()
const initialHeading = CesiumStore.viewer.camera.heading // 默认方向为正北，正角度为向东旋转，即水平旋转，也叫偏航角。
const initialPitch = CesiumStore.viewer.camera.pitch // 默认角度为-90，即朝向地面，正角度在平面之上，负角度为平面下，即上下旋转，也叫俯仰角。
const initialRoll = CesiumStore.viewer.camera.roll // 默认旋转角度为0，左右旋转，正角度向右，负角度向左，也叫翻滚角

// 设置目标位置: 杭州
const targetPosition = Cesium.Cartesian3.fromDegrees(
  120.153576,
  30.287459,
  30000,
)

// 设置目标方向
const targetHeading = Cesium.Math.toRadians(0.0)
const targetPitch = Cesium.Math.toRadians(-90)
const targetRoll = 0

// 设置动画参数
const duration = 5 // 动画持续时间（秒）

// 开始飞行
const startFlyTo = () => {
  CesiumStore.viewer.camera.flyTo({
    destination: targetPosition,
    orientation: {
      heading: targetHeading,
      pitch: targetPitch,
      roll: targetRoll,
    },
    duration: duration,
  })
}

// 返回
const backToInitialPosition = () => {
  CesiumStore.viewer.camera.flyTo({
    destination: initialPosition,
    orientation: {
      heading: initialHeading,
      pitch: initialPitch,
      roll: initialRoll,
    },
    duration: duration,
  })
}
</script>

<template>
  <div class="container">
    <el-button type="primary" @click="startFlyTo">开始飞行</el-button>
    <el-button type="primary" @click="backToInitialPosition">返回</el-button>
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
