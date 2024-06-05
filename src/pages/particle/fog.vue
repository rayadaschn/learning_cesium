<script setup>
import { useFogEffect } from '@/hooks'
import { useCesiumStore } from '@/store/modules/cesium'
import { Color } from 'cesium'

const CesiumStore = useCesiumStore()
const { show } = useFogEffect(CesiumStore.viewer, {
  visibility: 0.2,
  fogColor: new Color(0.8, 0.8, 0.8, 0.3),
})

const hide = () => {
  show(false)
}
const start = () => {
  show(true)
}
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
