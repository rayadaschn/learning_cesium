<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  WebMapTileServiceImageryProvider,
  Ion,
  Camera,
  Viewer,
  Color,
  Rectangle,
  createWorldTerrainAsync,
  KmlDataSource,
  CzmlDataSource,
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
    terrainProvider: await createWorldTerrainAsync(),
  });

  // 隐藏 logo
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement;
  creditContainer.style.display = "none";

  // 加载 自定义 czml数据
  const czml = [
    {
      id: "document",
      name: "CZML Point - Time Dynamic",
      version: "1.0",
    },
    {
      id: "point",
      // 物体在什么时间范围可用
      availability: "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
      position: {
        // 设置物体的起始时间
        epoch: "2012-08-04T16:00:00Z",
        // 设置了四个维度，1维是时间，2维是经度，3维是纬度，4维是高度
        cartographicDegrees: [
          0, -70, 20, 150000, 100, -80, 44, 150000, 200, -90, 18, 150000, 300,
          -98, 52, 150000,
        ],
      },
      point: {
        color: {
          rgba: [255, 255, 255, 128],
        },
        outlineColor: {
          rgba: [255, 0, 0, 128],
        },
        outlineWidth: 3,
        pixelSize: 15,
      },
    },
  ];

  const promiseData = CzmlDataSource.load(czml);
  promiseData.then((dataSource) => {
    console.log(dataSource);
    viewer.dataSources.add(dataSource);
    viewer.flyTo(dataSource);
  });
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
