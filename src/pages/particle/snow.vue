<script setup>
import { useSnowEffect } from '@/hooks'
import { useCesiumStore } from '@/store/modules/cesium'

const CesiumStore = useCesiumStore()
const { show } = useSnowEffect(CesiumStore.viewer, {
  snowSize: 0.02, // 雪花大小
  snowSpeed: 60.0, // 雪速
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
