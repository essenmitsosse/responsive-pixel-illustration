import createPixelArray from './createPixelArray'
import getPixelSetter from './getPixelSetter'
import getSeedHandler from './getSeedHandler'
import Obj from './Obj'
import recordDrawingTools from './recordDrawingTools'

import type { PixelArray } from './createPixelArray'
import type getPixelUnits from '@/renderengine/getPixelUnits'

export const getDrawingTools = (
  pixelUnit: ReturnType<typeof getPixelUnits>,
): {
  getObj: () => Obj
  init: (width: number, height: number) => PixelArray
} => {
  const seed = getSeedHandler()
  const pixelSetter = getPixelSetter()

  const state = {
    pixelUnit,
    seed,
    pixelSetter,
  }

  const init = (width: number, height: number): PixelArray => {
    pixelUnit.init({
      width,
      height,
    })

    const pixelArray = createPixelArray(width, height)

    pixelSetter.setArray(pixelArray)

    seed.reset()

    return pixelArray
  }

  return { init, getObj: (): Obj => new Obj(state, recordDrawingTools) }
}
