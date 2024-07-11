import { getObj } from './getObj'
import { Seed } from './Seed'
import { PixelSetter } from './PixelSetter'
import { getGetRandom } from './getGetRandom'
import { getPixelUnits } from './pixelUnits'
import { ImageFunction } from './types'
import { HandlerPixelArray } from 'src/responsivePixel/PixelGraphics/getHandlerPixelArray'

export const getDrawingTools = (imageFunction: ImageFunction) => {
  const seed = new Seed(getGetRandom())
  const pixelSetter = new PixelSetter()
  const pixelUnit = getPixelUnits(imageFunction)

  return {
    Obj: getObj(pixelSetter, seed, pixelUnit),
    init(width: number, height: number, handlerPixelArray: HandlerPixelArray) {
      pixelUnit.init({ width, height })
      pixelSetter.init(handlerPixelArray)
      seed.reset()
    },
  }
}
