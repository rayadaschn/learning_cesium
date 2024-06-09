import { onMounted, onBeforeUnmount, ref } from 'vue'
import {
  Cartesian3,
  Rectangle,
  Camera,
  Matrix4,
  EasingFunction,
  Viewer,
} from 'cesium'

type Options = {
  destination: Cartesian3 | Rectangle
  orientation?: {
    heading?: number
    pitch?: number
    roll?: number
  }
  duration?: number
  complete?: Camera.FlightCompleteCallback
  cancel?: Camera.FlightCancelledCallback
  endTransform?: Matrix4
  maximumHeight?: number
  pitchAdjustHeight?: number
  flyOverLongitude?: number
  flyOverLongitudeWeight?: number
  convert?: boolean
  easingFunction?: EasingFunction.Callback
}

export function useFlyTo(viewer: Viewer, options?: Options) {
  const initialOpt = ref<Options | null>(null)

  const init = () => {
    if (!viewer) throw new Error('No viewer object!')

    const initialPosition = viewer.camera.position.clone()
    const initialHeading = viewer.camera.heading
    const initialPitch = viewer.camera.pitch
    const initialRoll = viewer.camera.roll

    initialOpt.value = {
      destination: initialPosition,
      orientation: {
        heading: initialHeading,
        pitch: initialPitch,
        roll: initialRoll,
      },
      duration: 3,
    }

    console.log('Initial camera options saved:', initialOpt.value)
  }

  const flyTo = (opts?: Options) => {
    if (!viewer) throw new Error('No viewer object!')
    if (!initialOpt.value) throw new Error('No initial options!')

    const finalOptions = {
      ...initialOpt.value,
      ...options,
      ...opts,
    }
    viewer.camera.flyTo(finalOptions)
    console.log('Flying to:', finalOptions)
  }

  const goBack = () => {
    if (!viewer) throw new Error('No viewer object!')
    if (!initialOpt.value) throw new Error('No initial options!')

    viewer.camera.flyTo(initialOpt.value)
    console.log('Flying back to initial position:', initialOpt.value)
  }

  onMounted(init)

  onBeforeUnmount(() => {
    initialOpt.value = null
  })

  return { flyTo, goBack }
}
