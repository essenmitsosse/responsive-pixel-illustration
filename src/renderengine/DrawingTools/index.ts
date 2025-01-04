import createPixelArray from './createPixelArray'
import getPixelSetter from './getPixelSetter'
import getSeedHandler from './getSeedHandler'
import Obj from './Obj'
import recordDrawingTools from './recordDrawingTools'

export const DrawingTools = (pixelUnit) => {
  const seed = getSeedHandler()
  const pixelSetter = getPixelSetter()

  const state = {
    pixelUnit,
    seed,
    pixelSetter,
  }

  const init = (width, height) => {
    pixelUnit.init({
      width,
      height,
    })

    const pixelArray = createPixelArray(width, height)

    pixelSetter.setArray(pixelArray)

    seed.reset()

    return pixelArray
  }

  return { init, getObj: () => new Obj(state, recordDrawingTools) }
}
