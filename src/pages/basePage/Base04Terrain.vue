<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  WebMapTileServiceImageryProvider,
  Ion,
  Camera,
  Viewer,
  Rectangle,
  createWorldTerrainAsync,
  CesiumTerrainProvider,
} from "cesium";
import "cesium/Build/CesiumUnminified/Widgets/widgets.css";

import { CESIUM_TOKEN, TD_TOKEN } from "@/const";

const viewerDivRef = ref<HTMLDivElement>();

/** cesium Token */
Ion.defaultAccessToken = CESIUM_TOKEN;

/** 默认矩形视角四轴的位置 */
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  89.5, // 西经
  20.4, // 南纬
  110.4, // 东经
  61.2 // 北纬
);

/** 天地图矢量路径图 */
const imageryVectorProvider = new WebMapTileServiceImageryProvider({
  url: `http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TD_TOKEN}`,
  layer: "tdtBasicLayer",
  style: "default",
  format: "image/jpeg",
  tileMatrixSetID: "GoogleMapsCompatible",
});

/** 天地图影像图 */
const imageryProvider = new WebMapTileServiceImageryProvider({
  url: `http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TD_TOKEN}`,
  layer: "tdtBasicLayer",
  style: "default",
  format: "image/jpeg",
  tileMatrixSetID: "GoogleMapsCompatible",
});

onMounted(async () => {
  const viewer = new Viewer(viewerDivRef.value as HTMLElement, {
    animation: false,
    timeline: false,
    infoBox: false, // 信息提示框使用的 iframe 跨域报错
    geocoder: false, // 搜索框
    homeButton: false,
    sceneModePicker: false, // 控制查看起的显示模式
    baseLayerPicker: false, // 是否显示图层选择器
    navigationHelpButton: false, // 关闭帮助按钮
    // 设置地形
    terrainProvider: await createWorldTerrainAsync({
      requestVertexNormals: true,
      requestWaterMask: true,
    }),
  });

  // 隐藏 logo
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement;
  creditContainer.style.display = "none";

  // 添加图层
  viewer.imageryLayers.addImageryProvider(imageryVectorProvider);

  // 叠加图层
  const layer = viewer.imageryLayers.addImageryProvider(imageryProvider);
  layer.alpha = 0.5;
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
