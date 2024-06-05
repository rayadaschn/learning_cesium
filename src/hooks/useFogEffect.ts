import { onMounted, onUnmounted, ref } from 'vue'
import * as Cesium from 'cesium'

type Options = {
  visibility?: number // 能见度
  fogColor?: Cesium.Color // 雨滴大小
}

/**
 * @description: 大雾效果
 * @param {Cesium} viewer
 * @param {Options} options
 * @return {*}
 */
export function useFogEffect(viewer: Cesium.Viewer, options: Options = {}) {
  const visibility = ref(options.visibility ?? -0.6)
  const fogColor = ref(options.fogColor ?? new Cesium.Color(0.8, 0.8, 0.8, 0.5))
  let stage: Cesium.PostProcessStage | null = null

  // 大雾:片元着色器
  const getFogShader = () => `
    uniform sampler2D colorTexture;
    uniform sampler2D depthTexture;
    uniform float visibility;
    uniform vec4 fogColor;
    in vec2 v_textureCoordinates; 
    out vec4 fragColor;
    void main(void) 
    { 
      vec4 origcolor = texture(colorTexture, v_textureCoordinates); 
      float depth = czm_readDepth(depthTexture, v_textureCoordinates); 
      vec4 depthcolor = texture(depthTexture, v_textureCoordinates); 
      float f = visibility * (depthcolor.r - 0.3) / 0.2; 
      if (f < 0.0) f = 0.0; 
      else if (f > 1.0) f = 1.0; 
      fragColor = mix(origcolor, fogColor, f); 
    }
  `

  const init = () => {
    if (!viewer) throw new Error('No viewer object!')

    stage = new Cesium.PostProcessStage({
      name: 'czm_fog',
      fragmentShader: getFogShader(), // 片元着色器
      uniforms: {
        visibility: () => visibility.value,
        fogColor: () => fogColor.value,
      },
    })

    viewer.scene.postProcessStages.add(stage)
  }

  const destroy = () => {
    if (!viewer || !stage) return
    viewer.scene.postProcessStages.remove(stage)
    if (!stage.isDestroyed()) {
      stage.destroy()
    }
  }

  const show = (visible: boolean) => {
    if (stage) {
      stage.enabled = visible
    }
  }

  onMounted(init)
  onUnmounted(destroy)

  return {
    visibility,
    fogColor,
    show,
  }
}
