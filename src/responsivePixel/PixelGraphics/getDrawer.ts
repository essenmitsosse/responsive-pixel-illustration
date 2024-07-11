import { getHandlerPixelArray, HandlerPixelArray } from './getHandlerPixelArray'
import { DrawingTool, getDrawingTools } from './DrawingTools'
import type { ImageFunction } from './types'

export type Drawer = (countW: number, countH: number) => HandlerPixelArray

export const getDrawer = (imageFunction: ImageFunction): Drawer => {
  const drawingTool: DrawingTool = getDrawingTools(imageFunction)
  const canvasTool = new drawingTool.Obj().create({
    list: imageFunction.renderList,
  })

  return (countW: number, countH: number): HandlerPixelArray => {
    const handlerPixelArray = getHandlerPixelArray(countW, countH)
    drawingTool.init(countW, countH, handlerPixelArray)
    canvasTool.draw()
    return handlerPixelArray
  }
}
