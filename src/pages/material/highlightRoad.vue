<script setup>
import { useCesiumStore } from '@/store/modules/cesium'
import rodeData from '@/assets/json/qdRoad_less.geojson?raw'
import * as Cesium from 'cesium'
import { ref, onMounted } from 'vue'

const CesiumStore = useCesiumStore()
const viewer = CesiumStore.viewer
const isBlinking = ref(false) // 用于控制闪烁状态
const lineWidth = ref(5) // 线条宽度
const entities = ref([]) // 存储所有实体

/**
 * @description: 创建闪烁材质的函数
 * @param {Cesium.Color} startColor 起始颜色，闪烁的颜色之一。
 * @param {Cesium.Color} endColor 结束颜色，闪烁的另一种颜色。
 * @param {number} duration 闪烁周期，以毫秒为单位。
 * @param {number} offset 时间偏移量，用于调整闪烁的相位。
 * @return {Cesium.ColorMaterialProperty} 指定颜色属性的对象
 */
function createBlinkingMaterial(startColor, endColor, duration, offset) {
  return new Cesium.ColorMaterialProperty(
    // 动态计算属性，其值随时间变化而变化
    new Cesium.CallbackProperty((time, result) => {
      if (!isBlinking.value) {
        return Cesium.Color.lerp(startColor, endColor, 0.5, result) // 如果暂停，则保持在中间状态
      }
      // 计算当前时间的偏移量，以实现闪烁效果: 将 Cesium.JulianDate 转换为 JavaScript 日期对象，获取时间戳，加上偏移量并对持续时间取模，计算出一个归一化的时间 t，在 [0, 1) 范围内循环。
      const t =
        ((Cesium.JulianDate.toDate(time).getTime() + offset) % duration) /
        duration

      // 根据时间计算颜色的渐变, lerp 线性插值
      const color = Cesium.Color.lerp(
        startColor, // 起始颜色
        endColor, // 结束颜色
        Math.abs(Math.sin(t * Math.PI * 2)), // 计算正弦值，用于控制颜色渐变，颜色变化更加自然和平滑, 正弦函数的周期性特性确保颜色变化可以无限循环，避免在循环结束时出现突变。
        result, // 结果颜色, 用于存储结果的 Cesium.Color 对象。如果未提供，将创建并返回一个新的 Cesium.Color 对象。
      )
      return color
    }, false), // false 表示非恒定
  )
}

onMounted(() => {
  // 加载 geoJson 数据
  const geoPromise = new Cesium.GeoJsonDataSource.load(JSON.parse(rodeData), {
    clampToGround: true,
  })

  geoPromise.then((dataSource) => {
    viewer.dataSources.add(dataSource)
    viewer.flyTo(dataSource)

    entities.value = dataSource.entities.values
    const duration = 1000 // 1秒闪烁周期
    const startColor = Cesium.Color.RED.withAlpha(0.8)
    const endColor = Cesium.Color.GREEN.withAlpha(0.5)

    for (let i = 0; i < entities.value.length; i++) {
      const entity = entities.value[i]
      const offset = Math.random() * duration // 随机偏移时间
      entity.polyline.material = createBlinkingMaterial(
        startColor,
        endColor,
        duration,
        offset,
      )
      entity.polyline.width = new Cesium.ConstantProperty(lineWidth.value) // 设置线条宽度
    }
  })
})

const toggleBlinking = () => {
  isBlinking.value = !isBlinking.value
}

const increaseLineWidth = () => {
  lineWidth.value += 2
  entities.value.forEach((entity) => {
    entity.polyline.width = new Cesium.ConstantProperty(lineWidth.value)
  })
}
</script>

<template>
  <div class="container">
    <el-button type="primary" @click="toggleBlinking">
      {{ isBlinking ? '暂停闪烁' : '开始闪烁' }}
    </el-button>
    <el-button type="primary" @click="increaseLineWidth">
      增加道路宽度
    </el-button>
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
