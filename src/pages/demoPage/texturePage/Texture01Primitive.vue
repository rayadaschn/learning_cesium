<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  WebMapTileServiceImageryProvider,
  Ion,
  Camera,
  Viewer,
  Color,
  Rectangle,
  createWorldTerrainAsync,
  Math as CesiumMath,
  createOsmBuildingsAsync,
  RectangleGeometry,
  PerInstanceColorAppearance,
  GeometryInstance,
  ColorGeometryInstanceAttribute,
  Primitive,
} from 'cesium'
import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'

import { CESIUM_TOKEN, TD_TOKEN } from '@/const'

const viewerDivRef = ref<HTMLDivElement>()

/** cesium Token */
Ion.defaultAccessToken = CESIUM_TOKEN

/** 默认矩形视角四轴的位置 */
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  89.5, // 西经
  20.4, // 南纬
  110.4, // 东经
  61.2, // 北纬
)

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
  })

  // 隐藏 logo
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement
  creditContainer.style.display = 'none'

  // 添加3D建筑
  const osmBuildings = viewer.scene.primitives.add(
    await createOsmBuildingsAsync(),
  )

  // 使用entity创建矩形
  const rectangle = viewer.entities.add({
    rectangle: {
      coordinates: Rectangle.fromDegrees(
        // 西边的经度
        90,
        // 南边维度
        20,
        // 东边经度
        110,
        // 北边维度
        30,
      ),
      material: Color.RED.withAlpha(0.5),
    },
  })

  // primivite 创建矩形
  // 01-创建几何体
  const rectGeometry = new RectangleGeometry({
    rectangle: Rectangle.fromDegrees(
      // 西边的经度
      115,
      // 南边维度
      20,
      // 东边经度
      135,
      // 北边维度
      30,
    ),
    // 距离表面高度
    height: 0,
    vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
  })

  // 02-创建几何体实例
  const instance = new GeometryInstance({
    geometry: rectGeometry,
    attributes: {
      color: ColorGeometryInstanceAttribute.fromColor(Color.RED.withAlpha(0.5)),
    },
  })

  // 03-设置外观
  const appearance = new PerInstanceColorAppearance({
    flat: true,
  })
  // 04-图元
  const primitive = new Primitive({
    geometryInstances: instance,
    appearance: appearance,
  })
  // 05-添加到viewer
  viewer.scene.primitives.add(primitive)
})
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
