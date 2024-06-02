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
  createOsmBuildingsAsync,
  SampledPositionProperty,
  JulianDate,
  VelocityOrientationProperty,
  PathGraphics,
  TimeInterval,
  TimeIntervalCollection,
  Cartesian3,
} from 'cesium'
import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'
import planeData from '@/assets/json/plane.json'

import { CESIUM_TOKEN, TD_TOKEN } from '@/const'

const viewerDivRef = ref<HTMLDivElement>()

/** cesium Token */
Ion.defaultAccessToken = CESIUM_TOKEN

/** 默认矩形视角四轴的位置 */
// Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
//   89.5, // 西经
//   20.4, // 南纬
//   110.4, // 东经
//   61.2 // 北纬
// );

onMounted(async () => {
  const viewer = new Viewer(viewerDivRef.value as HTMLElement, {
    animation: false,
    // timeline: false,
    infoBox: false, // 信息提示框使用的 iframe 跨域报错
    geocoder: false, // 搜索框
    homeButton: false,
    sceneModePicker: false, // 控制查看起的显示模式
    baseLayerPicker: false, // 是否显示图层选择器
    navigationHelpButton: false, // 关闭帮助按钮
    terrainProvider: await createWorldTerrainAsync(),
    shouldAnimate: true,
  })

  // 隐藏 logo
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement
  creditContainer.style.display = 'none'

  // 添加3D建筑
  const tiles3d = await createOsmBuildingsAsync()
  const osmBuildings = viewer.scene.primitives.add(tiles3d)

  const positionProperty = new SampledPositionProperty()

  // 时间间隔 30秒
  const timeStepInSeconds = 30
  // 整个飞行花费的时间
  const totalSeconds = (planeData.length - 1) * timeStepInSeconds

  // 设置起点时间
  const time = new Date('2024-03-11T23:51:00Z')

  // cesium，默认使用的是儒略日的时间
  // 所以需要起点时间转换成儒略日的时间
  const startJulianDate = JulianDate.fromDate(time)
  // 设置终点时间
  const stopJulianDate = JulianDate.addSeconds(
    startJulianDate,
    totalSeconds,
    new JulianDate(),
  )

  // 将查看器的时间调整到起点和结束点的范围
  viewer.clock.startTime = startJulianDate.clone()
  viewer.clock.stopTime = stopJulianDate.clone()
  viewer.clock.currentTime = startJulianDate.clone()
  viewer.timeline.zoomTo(startJulianDate, stopJulianDate)

  planeData.forEach((dataPoint, i) => {
    // 当前点的时间
    const time = JulianDate.addSeconds(
      startJulianDate,
      i * timeStepInSeconds,
      new JulianDate(),
    )
    // 设置当前点的位置
    const position = Cartesian3.fromDegrees(
      dataPoint.longitude,
      dataPoint.latitude,
      dataPoint.height,
    )
    // 添加轨迹采样点
    positionProperty.addSample(time, position)

    // 添加点
    viewer.entities.add({
      position: position,
      point: {
        pixelSize: 10,
        color: Color.RED,
        outlineColor: Color.WHITE,
        outlineWidth: 2,
      },
    })
  })
  console.log(positionProperty)

  // 创建飞机
  const planeEntity = viewer.entities.add({
    availability: new TimeIntervalCollection([
      new TimeInterval({
        start: startJulianDate,
        stop: stopJulianDate,
      }),
    ]),
    name: '飞机',
    // 设置飞机的可用
    position: positionProperty,
    // VelocityOrientationProperty会自动根据采样点，计算出飞机的速度和方向
    orientation: new VelocityOrientationProperty(positionProperty),
    model: {
      uri: './model/Air.glb',
      // minimumPixelSize: 128,
      // maximumScale: 20000,
    },
    // 绘制轨迹线
    path: new PathGraphics({
      width: 5,
    }),
  })

  // 相机追踪运动的问题
  viewer.trackedEntity = planeEntity

  // 设置时间速率
  viewer.clock.multiplier = 60
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
