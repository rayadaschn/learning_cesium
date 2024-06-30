import * as Cesium from 'cesium'
import { ref, onMounted, onUnmounted } from 'vue'

export function useMeasureTool(viewer: Cesium.Viewer) {
  const drawLayer = ref<Cesium.CustomDataSource | null>(null)
  const viewerRef = ref<Cesium.Viewer>(viewer)

  onMounted(() => {
    if (viewer instanceof Cesium.Viewer) {
      drawLayer.value = new Cesium.CustomDataSource('measureLayer')
      viewerRef.value.dataSources.add(drawLayer.value)
    }
  })

  onUnmounted(() => {
    if (drawLayer.value && viewer) {
      viewerRef.value.dataSources.remove(drawLayer.value)
    }
  })

  /** 坐标转换 WGS84 转 笛卡尔 */
  const transformWGS84ToCartesian = (position: {
    longitude: number
    latitude: number
    altitude?: number
  }): Cesium.Cartesian3 => {
    const { longitude, latitude, altitude } = position
    return Cesium.Cartesian3.fromDegrees(
      longitude,
      latitude,
      altitude,
      Cesium.Ellipsoid.WGS84,
    )
  }

  /** 坐标转换: 笛卡尔 转 WGS84 */
  const transformCartesianToWGS84 = (
    cartesian: Cesium.Cartesian3,
  ): { longitude: number; latitude: number; altitude: number } => {
    const ellipsoid = Cesium.Ellipsoid.WGS84
    const cartographic = ellipsoid.cartesianToCartographic(cartesian)
    return {
      longitude: Cesium.Math.toDegrees(cartographic.longitude),
      latitude: Cesium.Math.toDegrees(cartographic.latitude),
      altitude: cartographic.height,
    }
  }

  /** 坐标转换: 笛卡尔 转 WGS84 数组形式 */
  const transformCartesianArrayToWGS84Array = (
    cartesianArr: Cesium.Cartesian3[],
  ): Array<{ longitude: number; latitude: number; altitude: number }> => {
    return cartesianArr.map((item) => transformCartesianToWGS84(item))
  }

  /** 坐标转换: WGS84 转 弧度坐标 */
  const transformWGS84ToCartographic = (position: {
    longitude: number
    latitude: number
    altitude?: number
  }): Cesium.Cartographic => {
    const { longitude, latitude, altitude } = position
    return Cesium.Cartographic.fromDegrees(longitude, latitude, altitude)
  }

  /** 拾取屏幕坐标系 转三维  */
  const getCartesian3FromPX = (px: Cesium.Cartesian2): Cesium.Cartesian3 => {
    const cartesian = viewerRef.value.scene.pickPosition(px)

    // 将 Cartesian3 转换为 Cartographic
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    // 增加高度偏移量
    cartographic.height += 20

    // 将 Cartographic 转换回 Cartesian3
    const adjustedPosition = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      cartographic.height,
    )

    return adjustedPosition
  }

  /** 获取 WGS84 坐标系下的距离 */
  const getPositionDistance = (
    positions: Array<{ longitude: number; latitude: number; altitude: number }>,
  ): string => {
    if (positions.length < 2) {
      return '0.000'
    }

    let distance = 0
    const geodesic = new Cesium.EllipsoidGeodesic()

    for (let i = 0; i < positions.length - 1; i++) {
      const point1cartographic = transformWGS84ToCartographic(positions[i])
      const point2cartographic = transformWGS84ToCartographic(positions[i + 1])

      geodesic.setEndPoints(point1cartographic, point2cartographic)
      let s = geodesic.surfaceDistance
      s = Math.sqrt(
        Math.pow(s, 2) +
          Math.pow(point2cartographic.height - point1cartographic.height, 2),
      )

      distance += s
    }
    return distance.toFixed(3)
  }

  /** 测距 */
  const drawLineMeasureGraphics = (options: any = {}) => {
    const { callback, width, material } = options
    const positions: Cesium.Cartesian3[] = []
    let lineObj: Cesium.Entity | undefined = undefined
    const handlers = new Cesium.ScreenSpaceEventHandler(
      viewerRef.value.scene.canvas,
    )

    /** 添加坐标点 */
    const addInfoPoint = (position: Cesium.Cartesian3) => {
      // 转换 Cartesian 数组到 WGS84 数组
      const wgs84Positions = transformCartesianArrayToWGS84Array(positions)
      const distance = getPositionDistance(wgs84Positions)
      const distanceKm = (Number(distance) / 1000).toFixed(3)
      const title =
        Number(distanceKm) > 1 ? `${distanceKm} 公里` : `${distance} 米`

      // 将 Cartesian3 转换为 Cartographic
      const cartographic = Cesium.Cartographic.fromCartesian(position)
      // 增加高度偏移量
      cartographic.height += 0.1 // 解决点比线高的问题

      // 将 Cartographic 转换回 Cartesian3
      const adjustedPosition = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height,
      )

      // 创建标签实体
      const labelEntity = new Cesium.Entity({
        position: adjustedPosition,
        point: {
          pixelSize: 8,
          outlineColor: Cesium.Color.BLUE,
          outlineWidth: 8,
        },
        label: {
          text: title,
          show: true,
          showBackground: true,
          backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0.5), // 半透明背景
          font: '14px monospace',
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(-20, -20), // left top
        },
      })

      // 将实体添加到绘制图层
      drawLayer.value?.entities.add(labelEntity)
    }

    // 左键
    handlers.setInputAction((movement: any) => {
      const cartesian = getCartesian3FromPX(movement.position)
      if (cartesian && cartesian.x) {
        if (positions.length === 0) {
          positions.push(cartesian.clone())
        }
        addInfoPoint(cartesian)
        positions.push(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 移动
    handlers.setInputAction((movement: any) => {
      const cartesian = getCartesian3FromPX(movement.endPosition)
      if (positions.length >= 2) {
        if (cartesian && cartesian.x) {
          positions.pop()
          positions.push(cartesian)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // 右键
    handlers.setInputAction((movement: any) => {
      handlers.destroy()
      const cartesian = getCartesian3FromPX(movement.position)
      addInfoPoint(cartesian)
      if (typeof callback === 'function') {
        callback(transformCartesianArrayToWGS84Array(positions), lineObj)
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    const lineEntity = new Cesium.Entity({
      polyline: {
        width: width ?? 10,
        material:
          material ||
          new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE),
        positions: new Cesium.CallbackProperty(() => positions, false),
      },
    })

    lineObj = drawLayer.value?.entities.add(lineEntity)
  }

  return {
    drawLineMeasureGraphics,
    transformWGS84ToCartesian,
  }
}
