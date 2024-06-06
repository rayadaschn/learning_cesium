import { onMounted, onUnmounted, ref } from 'vue'
import * as Cesium from 'cesium'

type Option = {
  snowSize?: number
  snowSpeed?: number
}
export function useSnowEffect(viewer: Cesium.Viewer, option: Option) {
  const snowSize = ref(option.snowSize || 10)
  const snowSpeed = ref(option.snowSpeed || 10)
  let state: Cesium.PostProcessStage | null = null

  // 下雪: 片元着色器
  const getSnowShader = () => `
    uniform sampler2D colorTexture;
    in vec2 v_textureCoordinates;
    uniform float snowSpeed;
    uniform float snowSize;
    float snow(vec2 uv,float scale)
    {
      float time=czm_frameNumber/snowSpeed;
      float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;
      uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;
      uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
      p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);
      k=smoothstep(0.,k,sin(f.x+f.y)*snowSize);
      return k*w;
    }
    out vec4 fragColor;
    void main(void){
      vec2 resolution=czm_viewport.zw;
      vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
      vec3 finalColor=vec3(0);
      // float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));
      float c=0.;
      c+=snow(uv,30.)*.0;
      c+=snow(uv,20.)*.0;
      c+=snow(uv,15.)*.0;
      c+=snow(uv,10.);
      c+=snow(uv,8.);
      c+=snow(uv,6.);
      c+=snow(uv,5.);
      finalColor=(vec3(c));
      fragColor=mix(texture(colorTexture,v_textureCoordinates),vec4(finalColor,1),.5);
    }
  `

  const init = () => {
    if (!viewer) throw new Error('No viewer object!')

    state = new Cesium.PostProcessStage({
      fragmentShader: getSnowShader(),
      uniforms: {
        snowSize: snowSize.value,
        snowSpeed: snowSpeed.value,
      },
    })
    viewer.scene.postProcessStages.add(state)
  }

  const destroy = () => {
    if (!viewer || !state) return

    viewer.scene.postProcessStages.remove(state)
    if (!state.isDestroyed()) state.destroy()
    state = null
  }

  const show = (visible: boolean) => {
    if (state) {
      state.enabled = visible
    }
  }

  onMounted(init)
  onUnmounted(destroy)

  return {
    snowSize,
    snowSpeed,
    show,
  }
}
