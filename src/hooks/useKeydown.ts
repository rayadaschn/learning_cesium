import { onUnmounted } from 'vue'
import * as Cesium from 'cesium'

/**
 * @description: 监听键盘事件，控制相机移动
 * @param {Cesium.Viewer} viewer
 * @param {number} moveRate 相机移动速度，默认为相机高度的1/100
 * @return {*}
 */
export function useKeydown(viewer: Cesium.Viewer, moveRate?: number) {
  const handleKeyDown = (event: KeyboardEvent) => {
    const height = viewer.camera.positionCartographic.height
    const effectiveMoveRate = moveRate ?? height / 100
    console.log('Key pressed:', event.key) // 添加调试信息
    switch (event.key) {
      case 'ArrowUp':
        console.log('🚀 ~ handleKeyDown ~ 向上键被按下:')
        viewer.camera.moveForward(effectiveMoveRate)
        break
      case 'ArrowDown':
        console.log('🚀 ~ handleKeyDown ~ 向下键被按下:')
        viewer.camera.moveBackward(effectiveMoveRate)
        break
      case 'ArrowLeft':
        console.log('🚀 ~ handleKeyDown ~ 向左键被按下:')
        viewer.camera.moveLeft(effectiveMoveRate)
        break
      case 'ArrowRight':
        console.log('🚀 ~ handleKeyDown ~ 向右键被按下:')
        viewer.camera.moveRight(effectiveMoveRate)
        break
      default:
        break
    }
  }

  // 调用此方法时, 已处于 onMounted 状态, 直接监听绑定，并只需在卸载时注销即可
  document.addEventListener('keydown', handleKeyDown)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}
