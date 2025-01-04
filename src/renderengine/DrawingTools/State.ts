import type getPixelSetter from './getPixelSetter'
import type getSeedHandler from './getSeedHandler'
import type getPixelUnits from '@/renderengine/getPixelUnits'

export type State = {
  pixelSetter: ReturnType<typeof getPixelSetter>
  pixelUnit: ReturnType<typeof getPixelUnits>
  seed: ReturnType<typeof getSeedHandler>
}
