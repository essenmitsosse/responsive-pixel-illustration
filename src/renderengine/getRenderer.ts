import { getDrawingTools } from './DrawingTools'

import type { ColorArray, PixelArray } from './DrawingTools/createPixelArray'
import type { Tool } from './DrawingTools/Primitive'
import type { PixelGraphics, RenderObject } from './PixelGraphics'
import type { ColorRgb } from '@/helper/typeColor'

const getDrawer = (
  pixelStarter: PixelGraphics,
  renderList: ReadonlyArray<Tool | false>,
) => {
  // Initialize the drawingTool
  const pixelUnit = pixelStarter.pixelUnits
  const drawingTool = getDrawingTools(pixelUnit)
  const canvasTool = drawingTool.getObj().create({ list: renderList })

  return (countW: number, countH: number): PixelArray => {
    const pixelArray = drawingTool.init(countW, countH)

    canvasTool.draw()

    return pixelArray
  }
}

const getRenderPixelToImage =
  (backgroundColor: ColorRgb) =>
  (
    pixelW: number,
    pixelH: number,
    pixelArray: ColorArray,
    imageData: Uint8ClampedArray<ArrayBufferLike>,
  ): Uint8ClampedArray<ArrayBufferLike> => {
    let pW = pixelW
    let w4 = pW * 4

    const wFull = w4
    const pHSave = pixelH
    const fullSave = w4 * pHSave

    let i

    const pA = pixelArray
    const defaultRed = backgroundColor && backgroundColor[0]
    const defaultGreen = backgroundColor && backgroundColor[1]
    const defaultBlue = backgroundColor && backgroundColor[2]

    while (pW--) {
      w4 -= 4

      let pH = pHSave
      let full = fullSave

      const row = pA[pW]

      while (pH--) {
        const pixel = row[pH].pop()

        if (pixel) {
          imageData[(i = w4 + (full -= wFull))] = pixel.c[0]

          imageData[(i += 1)] = pixel.c[1]

          imageData[(i += 1)] = pixel.c[2]

          imageData[(i += 1)] = 255
        } else if (backgroundColor) {
          imageData[(i = w4 + (full -= wFull))] = defaultRed

          imageData[(i += 1)] = defaultGreen

          imageData[(i += 1)] = defaultBlue

          imageData[(i += 1)] = 255
        } else {
          imageData[(i = w4 + (full -= wFull) + 3)] = 0
        }
      }
    }

    return imageData
  }

const getRenderer = (
  canvas: HTMLCanvasElement,
  options: RenderObject,
  pixelStarter: PixelGraphics,
): {
  rescaleWindow: () => void
  resize: (width: number, height: number) => [number, number, number]
} => {
  // Render Engine to convert basic image into absolute Pixels
  const context = canvas.getContext('2d')

  if (context === null) {
    throw new Error('Canvas context is null')
  }

  const virtualCanvas = document.createElement('canvas')
  const virtualContext = virtualCanvas.getContext('2d')

  if (virtualContext === null) {
    throw new Error('Canvas context is null')
  }

  let w: number
  let h: number

  const drawer = getDrawer(pixelStarter, options.imageFunction.renderList)

  const renderPixelToImage = getRenderPixelToImage(
    // TODO: Remove casting here
    options.imageFunction.background as ColorRgb,
  )

  return {
    rescaleWindow: (): void => {
      w = canvas.offsetWidth

      h = canvas.offsetHeight
    },

    resize: (widthFactor, heightFactor): [number, number, number] => {
      const countW = Math.round(((widthFactor || 1) * w) / options.pixelSize)
      const countH = Math.round(((heightFactor || 1) * h) / options.pixelSize)

      const image =
        countW && countH && virtualContext.createImageData(countW, countH)

      let drawing
      let time = -1

      if (image && countW > 0 && countH > 0) {
        // Resize Canvas to new Windows-Size
        virtualCanvas.width = countW

        virtualCanvas.height = countH

        canvas.width = w

        canvas.height = h

        // Disable Anti-Alaising
        context.imageSmoothingEnabled = false

        // Render the Image Data to the Pixel Array
        time = Date.now()

        drawing = drawer(countW, countH).get

        time = Date.now() - time

        // Render the Pixel Array to the Image
        renderPixelToImage(countW, countH, drawing, image.data)

        // Place Image on the Context
        virtualContext.putImageData(image, 0, 0)

        // Draw and upscale Context on Canvas
        context.drawImage(
          virtualCanvas,
          0,
          0,
          countW * options.pixelSize,
          countH * options.pixelSize,
        )

        // // Log some general Infos for debugging
        // info.change( "Dimensions", w + "px &times; " + h + "px (" + countW + "px &times; " + countH + "px)" );
        // info.change( "Pixel Count", Math.floor ( ( w * h ) / 1000 ) + "kpx ("+ Math.floor( ( countW * countH ) / 1000 ) + "kpx)" );
        // info.change( "Pixel-Size", realPixelSize + " px" );
      }

      return [w, h, time]
    },
  }
}

export default getRenderer
