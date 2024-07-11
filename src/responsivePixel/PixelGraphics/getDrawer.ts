import { getHandlerPixelArray } from './getHandlerPixelArray'
import { getDrawingTools } from './DrawingTools'
import type { ImageFunction, PixelArray } from './types'

export const getDrawer = (imageFunction: ImageFunction) => {
  const drawingTool = getDrawingTools(imageFunction)
  const canvasTool = new drawingTool.Obj().create({
    list: imageFunction.renderList,
  })
  return (countW: number, countH: number): PixelArray => {
    const handlerPixelArray = getHandlerPixelArray(countW, countH)
    drawingTool.init(countW, countH, handlerPixelArray)
    canvasTool.draw()
    return handlerPixelArray
  }
}
