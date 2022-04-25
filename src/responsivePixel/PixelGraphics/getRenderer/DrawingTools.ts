import { getObj } from './getObj'
import { Seed } from './Seed'
import { PixelSetter } from './PixelSetter'
import { getGetRandom } from '../getGetRandom'
import { PixelUnit } from '../pixelUnits'

export const getDrawingTools = (pixelUnit: PixelUnit) => {
  const seed = new Seed(getGetRandom())
  const pixelSetter = new PixelSetter()

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
