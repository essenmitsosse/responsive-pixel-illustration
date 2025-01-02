import Arm from './Arm'
import createPixelArray from './createPixelArray'
import Dot from './Dot'
import Fill from './Fill'
import FillRandom from './FillRandom'
import getPixelSetter from './getPixelSetter'
import getSeedHandler from './getSeedHandler'
import Grid from './Grid'
import Line from './Line'
import Obj from './Obj'
import Panels from './Panels'
import Polygon from './Polygon'
import Primitive from './Primitive'
import Rect from './Rect'
import RoundRect from './RoundRect'
import Stripes from './Stripes'

export const DrawingTools = function (pixelUnit) {
  const seed = getSeedHandler()
  const pixelSetter = getPixelSetter()

  const state = {
    pixelUnit,
    seed,
    pixelSetter,
  }

  const drawingTools = {
    Primitive,
    Dot,
    Line,
    Polygon,
    Fill,
    FillRandom,
    Rect,
    Stripes,
    Obj,
    RoundRect,
    Grid,
    Panels,
    Arm,
  }

  const init = function (width, height) {
    pixelUnit.init({
      width,
      height,
    })

    const pixelArray = createPixelArray(width, height)

    pixelSetter.setArray(pixelArray)

    seed.reset()

    return pixelArray
  }

  return { init, getObj: () => new Obj(state, drawingTools) }
}
