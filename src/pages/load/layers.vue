<script setup>
import { useCesiumStore } from '@/store/modules/cesium'
import { WebMapTileServiceImageryProvider } from 'cesium'
import { useLayerManager } from '@/hooks'
import { TD_TOKEN } from '@/const'

const CesiumStore = useCesiumStore()
const viewer = CesiumStore.viewer

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

const { addLayer, removeLayerById, raiseLayerToTop, lowerLayerToBottom } =
  useLayerManager(viewer)

viewer.imageryLayers.addImageryProvider(imageryVectorProvider)

/** 叠加图层 */
const handleAddLayer = () => {
  addLayer('TDT_IMG', imageryProvider, 0.5)
}

/** 图层下移 */
const handleMoveBottomLayer = () => {
  lowerLayerToBottom('TDT_IMG')
}

/** 图层上移 */
const handleMoveTopLayer = () => {
  raiseLayerToTop('TDT_IMG')
}

/** 删除图层 */
const handleRemoveLayer = () => {
  removeLayerById('TDT_IMG')
}
</script>

<template>
  <div class="container">
    <el-button type="primary" @click="handleAddLayer">叠加图层</el-button>
    <el-button type="primary" @click="handleMoveBottomLayer">
      图层下移
    </el-button>
    <el-button type="primary" @click="handleMoveTopLayer">图层上移</el-button>
    <el-button type="primary" @click="handleRemoveLayer">删除图层</el-button>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}
</style>
