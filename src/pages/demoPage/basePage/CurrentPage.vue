<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  WebMapTileServiceImageryProvider,
  Ion,
  Camera,
  Viewer,
  Rectangle,
  createWorldTerrainAsync,
  CesiumTerrainProvider,
  Cartesian3,
  Math as CesiumMath,
  createOsmBuildingsAsync,
  Color,
  LabelStyle,
  Cartesian2,
  HorizontalOrigin,
  VerticalOrigin,
  DistanceDisplayCondition,
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

/** 天地图矢量路径图 */
const imageryVectorProvider = new WebMapTileServiceImageryProvider({
  url: `http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TD_TOKEN}`,
  layer: 'tdtBasicLayer',
  style: 'default',
  format: 'image/jpeg',
  tileMatrixSetID: 'GoogleMapsCompatible',
})

/** 天地图影像图 */
const imageryProvider = new WebMapTileServiceImageryProvider({
  url: `http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TD_TOKEN}`,
  layer: 'tdtBasicLayer',
  style: 'default',
  format: 'image/jpeg',
  tileMatrixSetID: 'GoogleMapsCompatible',
})

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
    // terrainProvider: await createWorldTerrainAsync({
    //   requestVertexNormals: true,
    //   requestWaterMask: true,
    // }),
  })

  // 隐藏 logo
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement
  creditContainer.style.display = 'none'

  // 添加图层
  viewer.imageryLayers.addImageryProvider(imageryVectorProvider)

  // 叠加图层
  const layer = viewer.imageryLayers.addImageryProvider(imageryProvider)
  layer.alpha = 0.5

  // 利用 setview 瞬间到达指定位置，视角: 此处为天安门
  const position = Cartesian3.fromDegrees(116.39, 39.85, 2000)
  viewer.camera.setView({
    // 指定相机位置
    destination: position,
    // 指定相机视角
    orientation: {
      // 指定相机的朝向,偏航角
      heading: CesiumMath.toRadians(0),
      // 指定相机的俯仰角,0度是竖直向上,-90度是向下
      pitch: CesiumMath.toRadians(-20),
      // 指定相机的滚转角,翻滚角
      roll: 0,
    },
  })

  // flyto: 让相机飞往某个地方
  // viewer.camera.flyTo({
  //   destination: position,
  //   orientation: {
  //     heading: CesiumMath.toRadians(0),
  //     pitch: CesiumMath.toRadians(-20),
  //     roll: 0,
  //   },
  // });

  /** 增加按键移动 */
  document.addEventListener('keydown', function (event) {
    // 获取相机离地面的高度
    const height = viewer.camera.positionCartographic.height
    const moveRate = height / 100 // 依据高度进行偏移
    switch (event.key) {
      case 'ArrowUp':
        // 处理向上按键的逻辑
        console.log('向上键被按下')
        viewer.camera.moveForward(moveRate)
        break
      case 'ArrowDown':
        // 处理向下按键的逻辑
        console.log('向下键被按下')
        viewer.camera.moveBackward(moveRate)
        break
      case 'ArrowLeft':
        // 处理向左按键的逻辑
        console.log('向左键被按下')
        viewer.camera.moveLeft(moveRate)
        break
      case 'ArrowRight':
        // 处理向右按键的逻辑
        console.log('向右键被按下')
        viewer.camera.moveRight(moveRate)
        break
      default:
        // 其他按键
        break
    }
  })

  // 添加3D建筑, 注意这里也是异步渲染
  const osmBuildings = viewer.scene.primitives.add(
    await createOsmBuildingsAsync(), // 自带渲染
  )

  // 添加文字和广告牌
  const label = viewer.entities.add({
    position: Cartesian3.fromDegrees(116.3904, 39.906, 20),
    label: {
      text: ' 天安门',
      font: '24px sans-serif',
      fillColor: Color.WHITE,
      outlineColor: Color.BLACK,
      outlineWidth: 4,
      // FILL填充文字，OUTLINE勾勒标签，FILL_AND_OUTLINE填充文字和勾勒标签
      style: LabelStyle.FILL_AND_OUTLINE,
      // 设置文字的偏移量
      pixelOffset: new Cartesian2(0, -24),
      // 设置文字的显示位置,LEFT /RIGHT /CENTER
      horizontalOrigin: HorizontalOrigin.CENTER,
      // 设置文字的显示位置
      verticalOrigin: VerticalOrigin.BOTTOM,
    },
  })

  // 添加3D模型
  const airplane = viewer.entities.add({
    name: 'Airplane',
    position: Cartesian3.fromDegrees(116.3904, 39.906, 1500),
    model: {
      uri: './model/Air.glb', // 静态文件加载
      // 设置飞机的最小像素
      minimumPixelSize: 128,
      // 设置飞机的轮廓
      silhouetteSize: 1,
      // 设置轮廓的颜色
      silhouetteColor: Color.WHITE,
      // 设置相机距离模型多远的距离显示
      distanceDisplayCondition: new DistanceDisplayCondition(0, 200000),
    },
  })
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
