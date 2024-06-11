<script setup>
import { useCesiumStore } from '@/store/modules/cesium'
// import rodeData from '@/assets/json/qdRoad_less.geojson?raw'
// import spriteLine from '@/assets/images/spriteline.png'
import * as Cesium from 'cesium'
import { ref, onMounted } from 'vue'

const CesiumStore = useCesiumStore()
const viewer = CesiumStore.viewer
const isBlinking = ref(false) // 用于控制闪烁状态

onMounted(() => {
  viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({})
})
</script>

<template>
  <div class="container">
    <el-button type="primary" @click="toggleBlinking">
      {{ isBlinking ? '暂停穿梭' : '开始穿梭' }}
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
