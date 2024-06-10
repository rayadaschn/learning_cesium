// useLayerManager.ts
import { ref } from 'vue'
import * as Cesium from 'cesium'

interface LayerManager {
  getLayers: () => Cesium.ImageryLayer[]
  addLayer: (
    id: string,
    imageryProvider: Cesium.ImageryProvider,
  ) => Cesium.ImageryLayer
  removeLayerById: (id: string) => void
  raiseLayerToTop: (id: string) => void
  lowerLayerToBottom: (id: string) => void
}

export function useLayerManager(viewer: Cesium.Viewer): LayerManager {
  const layers = ref<Cesium.ImageryLayer[]>([])

  /** 返回当前所有图层 */
  const getLayers = () => {
    return layers.value
  }

  /** 添加图层 */
  const addLayer = (
    id: string,
    imageryProvider: Cesium.ImageryProvider,
    alpha?: number,
  ): Cesium.ImageryLayer => {
    const layer = viewer.imageryLayers.addImageryProvider(imageryProvider)
    layer.alpha = alpha ?? 1
    ;(layer as any).id = id
    layers.value.push(layer)
    return layer
  }

  /** 依据 Id 移除图层 */
  const removeLayerById = (id: string): void => {
    const layer = layers.value.find((layer) => (layer as any).id === id)
    if (layer) {
      viewer.imageryLayers.remove(layer)
      layers.value = layers.value.filter((l) => (l as any).id !== id)
    }
  }

  /** 图层上移 */
  const raiseLayerToTop = (id: string): void => {
    const layer = layers.value.find((layer) => (layer as any).id === id)
    if (layer) {
      viewer.imageryLayers.raiseToTop(layer)
    }
  }

  /** 图层下移 */
  const lowerLayerToBottom = (id: string): void => {
    const layer = layers.value.find((layer) => (layer as any).id === id)
    if (layer) {
      viewer.imageryLayers.lowerToBottom(layer)
    }
  }

  return {
    getLayers,
    addLayer,
    removeLayerById,
    raiseLayerToTop,
    lowerLayerToBottom,
  }
}
