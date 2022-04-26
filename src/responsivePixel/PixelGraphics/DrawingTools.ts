import { getObj } from './getObj'
import { Seed } from './Seed'
import { PixelSetter } from './PixelSetter'
import { getGetRandom } from './getGetRandom'
import { getPixelUnits } from './pixelUnits'
import { ImageFunction } from './types'

export const getDrawingTools = (imageFunction: ImageFunction) => {
  const seed = new Seed(getGetRandom())
  const pixelSetter = new PixelSetter()
  const pixelUnit = getPixelUnits(imageFunction)

  return {
    Obj: getObj(pixelSetter, seed, pixelUnit),
    init(width, height, pixelArray) {
      pixelUnit.init({
        width,
        height,
      })
      pixelSetter.init(pixelArray)
      seed.reset()
    },
  }
}
