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

  // 设置材质
  const material = new GridMaterialProperty({
    color: Color.YELLOW,
    cellAlpha: 0.2, // 单元格的透明度
    lineCount: new Cartesian2(4, 4),
    lineThickness: new Cartesian2(4.0, 4.0), // 网格线的粗细
  });

  const rectangle = viewer.entities.add({
    id: "entityRect",
    // 设置矩形实体的形状和外观参数
    rectangle: {
      coordinates: Rectangle.fromDegrees(90, 20, 110, 30),
      material,
    },
  });

  // 其它类型
  // 创建几何体
  const rectGeometry = new RectangleGeometry({
    rectangle: Rectangle.fromDegrees(115, 20, 135, 30),
    height: 0, // 距离表面高度
    vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  });

  // 创建几何体实例, 相当于给定了几何体的具体位置、颜色等属性
  const instance = new GeometryInstance({
    id: "redRect",
    geometry: rectGeometry,
    attributes: {
      color: ColorGeometryInstanceAttribute.fromColor(Color.RED.withAlpha(0.5)),
    },
  });

  // 图片材质
  const imgMaterial = Material.fromType("Water", {
    baseWaterColor: Color.AQUA.withAlpha(0.8),
    distortion: 0.25,
    normalMap: "./Assets/Textures/waterNormals.jpg",
  });

  // 假定几何体与地球椭球体平行，就可以在计算大量顶点属性的时候节省内存
  const appearance = new EllipsoidSurfaceAppearance({
    material: imgMaterial,
    aboveGround: false,
    translucent: true,
  });

  // 图元
  const primitive = new Primitive({
    geometryInstances: [instance],
    appearance: appearance,
    show: true,
  });

  // 添加到viewer
  viewer.scene.primitives.add(primitive);
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
