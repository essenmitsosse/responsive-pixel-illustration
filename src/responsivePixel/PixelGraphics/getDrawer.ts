import { getPixelArray } from './getPixelArray'
import { getDrawingTools } from './DrawingTools'
import type { ImageFunction } from './types'

export const getDrawer = (imageFunction: ImageFunction) => {
  const drawingTool = getDrawingTools(imageFunction)
  const canvasTool = new drawingTool.Obj().create({
    list: imageFunction.renderList,
  })
  return (countW, countH) => {
    const pixelArray = getPixelArray(countW, countH)
    drawingTool.init(countW, countH, pixelArray)
    canvasTool.draw()
    return pixelArray
  }
}
