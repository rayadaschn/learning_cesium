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
  Cartesian3,
  GridMaterialProperty,
  Cartesian2,
  Material,
  EllipsoidSurfaceAppearance,
  Primitive,
  GeometryInstance,
  RectangleGeometry,
  ColorGeometryInstanceAttribute,
  GeoJsonDataSource,
  ColorMaterialProperty,
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

  // 加载geojson数据
  const dataGeo = GeoJsonDataSource.load(
    "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
    {
      stroke: Color.RED,
      fill: Color.SKYBLUE.withAlpha(0.5),
      strokeWidth: 4,
    }
  );

  dataGeo.then((dataSources) => {
    console.log(dataSources);
    viewer.dataSources.add(dataSources);

    const entities = dataSources.entities.values;
    entities.forEach((entity, i) => {
      entity.polygon!.material = new ColorMaterialProperty(
        Color.fromRandom({
          alpha: 1,
        })
      );
      entity.polygon!.outline = false; // 不显示多边形的边界
      const randomNum = Math.floor(Math.random() * 5);
      entity.polygon.extrudedHeight = 100000 * randomNum;
    });
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
