import { getPixelArray } from './getPixelArray'
import { getDrawingTools } from './DrawingTools'
import type { Render } from '../types'
import { PixelUnit } from '../pixelUnits'

export const getDrawer = (
  pixelUnit: PixelUnit,
  renderList: ReadonlyArray<Render>,
) => {
  const drawingTool = getDrawingTools(pixelUnit)
  const canvasTool = new drawingTool.Obj().create({ list: renderList })
  return (countW, countH) => {
    const pixelArray = getPixelArray(countW, countH)
    drawingTool.init(countW, countH, pixelArray)
    canvasTool.draw()
    return pixelArray
  }
}
