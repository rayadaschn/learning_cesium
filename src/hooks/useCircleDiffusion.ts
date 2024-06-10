import { ref, onUnmounted } from 'vue'
import * as Cesium from 'cesium'

// 圆扩散选项的接口
interface CircleDiffusionOptions {
  position: [number, number, number] // 扫描中心位置，经度、纬度、高度
  scanColor: string // 扫描颜色（CSS 颜色字符串）
  maxRadius: number // 扫描最大半径（单位：米）
  duration: number // 扫描持续时间（单位：毫秒）
}

/** 圆扩散方法 */
export function useCircleDiffusion(viewer: Cesium.Viewer) {
  // 存储当前激活的扫描效果
  const activeStages = ref<Cesium.PostProcessStage[]>([])

  /**
   * 添加新的扫描效果
   * @param CircleDiffusionOptions 包含扫描效果的参数
   */
  const add = ({
    position,
    scanColor,
    maxRadius,
    duration,
  }: CircleDiffusionOptions) => {
    // 创建新的扫描效果并添加到 activeStages 中
    activeStages.value.push(
      createCircleScan(position, scanColor, maxRadius, duration),
    )
  }

  // 清除所有扫描效果
  const clear = () => {
    activeStages.value.forEach((stage) => {
      // 从场景中移除每个扫描效果
      viewer.scene.postProcessStages.remove(stage)
    })
    // 清空 activeStages 数组
    activeStages.value = []
  }

  /**
   * 创建新的扫描效果
   * @param position 扫描中心位置，经度、纬度、高度
   * @param scanColor 扫描颜色（CSS 颜色字符串）
   * @param maxRadius 扫描最大半径（单位：米）
   * @param duration 扫描持续时间（单位：毫秒）
   * @returns 创建的扫描效果
   */
  const createCircleScan = (
    position: [number, number, number],
    scanColor: string,
    maxRadius: number,
    duration: number,
  ): Cesium.PostProcessStage => {
    // 将经纬度和高度转换为 Cesium 的 Cartographic 坐标
    const cartographicCenter = new Cesium.Cartographic(
      Cesium.Math.toRadians(position[0]), // 经度转换为弧度
      Cesium.Math.toRadians(position[1]), // 纬度转换为弧度
      position[2], // 高度
    )

    // 将 CSS 颜色字符串转换为 Cesium 颜色对象
    const color = Cesium.Color.fromCssColorString(scanColor)

    // 添加圆形扫描阶段
    return addCircleScanStage(cartographicCenter, maxRadius, color, duration)
  }

  /**
   * 添加圆形扫描阶段: 创建并配置一个 PostProcessStage 对象，其中包含用于实现扫描效果的自定义片段着色器和动态更新的 uniform 变量
   * @param center 圆心坐标（Cartographic 坐标）
   * @param radius 扫描最大半径（单位：米）
   * @param color 扫描颜色（Cesium Color 对象）
   * @param duration 扫描持续时间（单位：毫秒）
   * @returns 创建的扫描阶段
   */
  const addCircleScanStage = (
    center: Cesium.Cartographic,
    radius: number,
    color: Cesium.Color,
    duration: number,
  ): Cesium.PostProcessStage => {
    // 将 Cartographic 坐标转换为 Cartesian 坐标
    const cartesianCenter = Cesium.Cartographic.toCartesian(center)
    const cartesian4Center = new Cesium.Cartesian4(
      cartesianCenter.x,
      cartesianCenter.y,
      cartesianCenter.z,
      1,
    )

    // 创建一个略微提升的中心点，以确保扫描效果可见
    const elevatedCenter = new Cesium.Cartographic(
      center.longitude,
      center.latitude,
      center.height + 500, // 提升 500 米
    )
    const cartesianElevatedCenter =
      Cesium.Cartographic.toCartesian(elevatedCenter)
    const cartesian4ElevatedCenter = new Cesium.Cartesian4(
      cartesianElevatedCenter.x,
      cartesianElevatedCenter.y,
      cartesianElevatedCenter.z,
      1,
    )

    // 获取当前时间作为扫描效果的开始时间
    const startTime = Date.now()
    // 创建用于临时存储的变量
    const scratchCartesian4Center = new Cesium.Cartesian4()
    const scratchCartesian4ElevatedCenter = new Cesium.Cartesian4()
    const scratchNormal = new Cesium.Cartesian3()

    // 创建扫描阶段
    const scanStage = new Cesium.PostProcessStage({
      fragmentShader: getScanShader(), // 获取扫描效果的片段着色器代码
      uniforms: {
        // 扫描中心的坐标（视点坐标系）
        u_scanCenterEC: () => {
          return Cesium.Matrix4.multiplyByVector(
            viewer.camera.viewMatrix,
            cartesian4Center,
            scratchCartesian4Center,
          )
        },
        // 扫描平面的法线向量（视点坐标系）
        u_scanPlaneNormalEC: () => {
          const center = Cesium.Matrix4.multiplyByVector(
            viewer.camera.viewMatrix,
            cartesian4Center,
            scratchCartesian4Center,
          )
          const elevatedCenter = Cesium.Matrix4.multiplyByVector(
            viewer.camera.viewMatrix,
            cartesian4ElevatedCenter,
            scratchCartesian4ElevatedCenter,
          )

          // 计算并归一化法线向量
          Cesium.Cartesian3.subtract(elevatedCenter, center, scratchNormal)
          Cesium.Cartesian3.normalize(scratchNormal, scratchNormal)

          return scratchNormal
        },
        // 扫描半径，随着时间变化
        u_radius: () => {
          // 计算当前扫描半径
          return (radius * ((Date.now() - startTime) % duration)) / duration
        },
        // 扫描颜色
        u_scanColor: color,
      },
    })

    // 将扫描阶段添加到场景的后处理阶段中
    viewer.scene.postProcessStages.add(scanStage)
    return scanStage // 返回创建的扫描阶段
  }

  // 获取扫描效果的片段着色器代码
  const getScanShader = (): string => {
    const shader = `
      uniform sampler2D colorTexture; // 场景的颜色纹理
      uniform sampler2D depthTexture; // 场景的深度纹理
      in vec2 v_textureCoordinates; // 纹理坐标
      uniform vec4 u_scanCenterEC; // 扫描中心（视点坐标系）
      uniform vec3 u_scanPlaneNormalEC; // 扫描平面的法线（视点坐标系）
      uniform float u_radius; // 扫描半径
      uniform vec4 u_scanColor; // 扫描颜色
      out vec4 fragColor; // 输出的颜色

      // 将纹理坐标转换为视点坐标
      vec4 toEye(vec2 uv, float depth) {
        vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0)); // 将纹理坐标转换为剪裁坐标
        vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0); // 将剪裁坐标转换为视点坐标
        posInCamera /= posInCamera.w; // 透视除法
        return posInCamera; // 返回视点坐标
      }

      // 将点投影到平面上
      vec3 pointProjectOnPlane(vec3 planeNormal, vec3 planeOrigin, vec3 point) {
        vec3 v01 = point - planeOrigin; // 计算从平面原点到点的向量
        float d = dot(planeNormal, v01); // 计算点到平面的距离
        return (point - planeNormal * d); // 返回投影点
      }

      // 获取深度值
      float getDepth(vec4 depth) {
        float z_window = czm_unpackDepth(depth); // 解压深度值
        z_window = czm_reverseLogDepth(z_window); // 反转深度值
        float near = czm_depthRange.near; // 获取近裁剪面距离
        float far = czm_depthRange.far; // 获取远裁剪面距离
        return (2.0 * z_window - near - far) / (far - near); // 计算深度
      }

      void main() {
        fragColor = texture(colorTexture, v_textureCoordinates); // 获取当前像素的颜色
        float depth = getDepth(texture(depthTexture, v_textureCoordinates)); // 获取当前像素的深度
        vec4 viewPos = toEye(v_textureCoordinates, depth); // 将纹理坐标转换为视点坐标
        vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC,
        u_scanCenterEC.xyz, viewPos.xyz); // 将视点坐标投影到扫描平面上
        float distance = length(prjOnPlane - u_scanCenterEC.xyz); // 计算投影点到扫描中心的距离
        if (distance < u_radius) { // 如果距离小于扫描半径
          float intensity = 1.0 - abs(u_radius - distance) / u_radius; // 计算扫描强度
          intensity = pow(intensity, 18.0); // 增强扫描效果
          fragColor = mix(fragColor, u_scanColor, intensity); // 混合颜色
        }
        fragColor.a /= 2.0; // 调整透明度
      }
    `
    return shader // 返回着色器代码
  }

  // 组件卸载时清除所有扫描效果
  onUnmounted(() => {
    clear()
  })

  return {
    add,
    clear,
  }
}
