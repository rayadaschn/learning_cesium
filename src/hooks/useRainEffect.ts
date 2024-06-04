import { onMounted, onUnmounted, ref } from 'vue'
import * as Cesium from 'cesium'

type Options = {
  tiltAngle?: number // 倾斜角度，负数向右，正数向左
  rainSize?: number // 雨滴大小
  rainSpeed?: number // 雨滴速度
}

export function useRainEffect(viewer: Cesium.Viewer, options: Options = {}) {
  const tiltAngle = ref(options.tiltAngle ?? -0.6)
  const rainSize = ref(options.rainSize ?? 0.3)
  const rainSpeed = ref(options.rainSpeed ?? 60.0)
  let rainStage: Cesium.PostProcessStage | null = null

  // 下雨:片元着色器
  const getRainShader = () => `
    uniform sampler2D colorTexture;
    in vec2 v_textureCoordinates;
    uniform float tiltAngle;
    uniform float rainSize;
    uniform float rainSpeed;
    float hash(float x) {
        return fract(sin(x * 133.3) * 13.13);
    }
    out vec4 fragColor;
    void main(void) {
        float time = czm_frameNumber / rainSpeed;
        vec2 resolution = czm_viewport.zw;
        vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
        vec3 c = vec3(.6, .7, .8);
        float a = tiltAngle;
        float si = sin(a), co = cos(a);
        uv *= mat2(co, -si, si, co);
        uv *= length(uv + vec2(0, 4.9)) * rainSize + 1.;
        float v = 1. - sin(hash(floor(uv.x * 100.)) * 2.);
        float b = clamp(abs(sin(20. * time * v + uv.y * (5. / (2. + v)))) - .95, 0., 1.) * 20.;
        c *= v * b;
        fragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(c, 1), .5);
    }
  `

  const init = () => {
    if (!viewer) throw new Error('No viewer object!')

    rainStage = new Cesium.PostProcessStage({
      name: 'czm_rain',
      fragmentShader: getRainShader(), // 片元着色器
      uniforms: {
        tiltAngle: () => tiltAngle.value,
        rainSize: () => rainSize.value,
        rainSpeed: () => rainSpeed.value,
      },
    })

    viewer.scene.postProcessStages.add(rainStage)
  }

  const destroy = () => {
    if (!viewer || !rainStage) return
    viewer.scene.postProcessStages.remove(rainStage)
    if (!rainStage.isDestroyed()) {
      rainStage.destroy()
    }
  }

  const show = (visible: boolean) => {
    if (rainStage) {
      rainStage.enabled = visible
    }
  }

  onMounted(init)
  onUnmounted(destroy)

  return {
    tiltAngle,
    rainSize,
    rainSpeed,
    show,
  }
}
