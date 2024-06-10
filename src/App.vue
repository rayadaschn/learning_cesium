<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Ion, Viewer } from 'cesium'
import { useCesiumStore } from '@/store/modules/cesium'
import { CESIUM_TOKEN } from '@/const'
import { useKeydown } from './hooks'

const CesiumStore = useCesiumStore()

const viewerDivRef = ref<HTMLDivElement>()

/** cesium Token */
Ion.defaultAccessToken = CESIUM_TOKEN

onMounted(() => {
  const viewer = new Viewer(viewerDivRef.value as HTMLElement, {
    // animation: false,
    // timeline: false,
    // infoBox: false, // 信息提示框使用的 iframe 跨域报错
    // geocoder: false, // 搜索框
    // homeButton: false,
    // sceneModePicker: false, // 控制查看起的显示模式
    // baseLayerPicker: false, // 是否显示图层选择器
    // navigationHelpButton: false, // 关闭帮助按钮
  })

  // 隐藏 logo
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement
  creditContainer.style.display = 'none'

  // 显示帧率
  viewer.scene.debugShowFramesPerSecond = true
  viewer.scene.globe.depthTestAgainstTerrain = true

  // 键盘控制
  useKeydown(viewer)

  CesiumStore.setCesium(viewer) // 全局注册视图
  console.log('🚀 ~ onMounted ~ viewer:', viewer)

  // 全局挂载调试
  const isDevelopment = import.meta.env.MODE === 'development'
  if (isDevelopment) {
    window.viewer = viewer
  }
})
</script>

<template>
  <el-container>
    <el-aside>
      <MenuCom />
    </el-aside>
    <el-container>
      <el-main>
        <div id="cesium-viewer" ref="viewerDivRef"></div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
#cesium-viewer {
  position: absolute;
  inset: 0;
}

.el-container {
  height: 100vh;
}

.el-main {
  padding: 0 !important;
  position: relative;
}

.el-aside {
  width: auto;
}
</style>
