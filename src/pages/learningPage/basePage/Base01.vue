<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Ion, Camera, Viewer, Rectangle } from "cesium";
import "cesium/Build/CesiumUnminified/Widgets/widgets.css";
import { CESIUM_TOKEN } from "@/const";

const viewerDivRef = ref<HTMLDivElement>();

/** cesium Token */
Ion.defaultAccessToken = CESIUM_TOKEN;

/** 默认矩形视角四轴的位置 */
// Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
//   89.5, // 西经
//   20.4, // 南纬
//   110.4, // 东经
//   61.2 // 北纬
// );

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
  });

  // 隐藏 logo
  // const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement;
  // creditContainer.style.display = "none";

  console.log("🚀 ~ onMounted ~ viewer:", viewer);
});
</script>

<template>
  <div id="cesium-viewer" ref="viewerDivRef"></div>
</template>

<style scoped>
#cesium-viewer {
  width: 100%;
  height: 100%;
}
</style>
