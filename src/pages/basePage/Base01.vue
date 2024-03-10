<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  ArcGisMapServerImageryProvider,
  Camera,
  Viewer,
  Rectangle,
} from "cesium";
import "cesium/Build/CesiumUnminified/Widgets/widgets.css";

const viewerDivRef = ref<HTMLDivElement>();

/** 默认视角 */
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  75.0, // 东
  0.0, // 南
  140.0, // 西
  60.0 // 北
);

onMounted(() => {
  const viewer = new Viewer(viewerDivRef.value as HTMLElement, {
    animation: false,
    timeline: false,
    infoBox: false, // 信息提示框使用的 iframe 跨域报错
    // geocoder: false, // 搜索框
    // homeButton: false,
    // sceneModePicker: false, // 控制查看起的显示模式
    // baseLayerPicker: false, // 是否显示图层选择器
    navigationHelpButton: false, // 关闭帮助按钮
  });

  // 隐藏 logo
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement;
  creditContainer.style.display = "none";

  console.log(viewer);
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
