import { getRenderPixelToImage } from './getRenderPixelToImage'
import { getDrawer } from './getDrawer'
import type { PixelGraphics } from '..'
import type { ImageFunction } from '../types'

export type Redraw = (args: {
  absSizeXFull: number
  absSizeYFull: number
  pixelSize: number
  relSizeX: number
  relSizeY: number
}) => [number, number]

export const getRenderer = (
  options: {
    divCanvas: HTMLCanvasElement
    pixelSize: number
    imageFunction: ImageFunction
  },
  pixelGraphics: PixelGraphics,
): Redraw => {
  const context = options.divCanvas.getContext('2d')
  const virtualCanvas = document.createElement('canvas')
  const virtualContext = virtualCanvas.getContext('2d')

  const drawer = getDrawer(pixelGraphics, options.imageFunction.renderList)
  const renderPixelToImage = getRenderPixelToImage(
    options.imageFunction.background,
  )

  if (context === null) {
    throw new Error('Couldn`t find context is passed canvas')
  }
  if (virtualContext === null) {
    throw new Error('Couldn`t find virtual context')
  }

  return (args) => {
    const countXFull = args.absSizeXFull / args.pixelSize
    const countYFull = args.absSizeYFull / args.pixelSize
    const countX = Math.round(Math.min(1, args.relSizeX || 1) * countXFull)
    const countY = Math.round(Math.min(1, args.relSizeY || 1) * countYFull)
    const image =
      countX && countY && virtualContext.createImageData(countX, countY)
    let drawing
    const missingX = countXFull - countX
    const missingY = countYFull - countY

    if (image && countX > 0 && countY > 0) {
      // Resize Canvas to new Windows-Size
      virtualCanvas.width = countX
      virtualCanvas.height = countY

      /* eslint-disable-next-line no-param-reassign */
      options.divCanvas.width = args.absSizeXFull
      /* eslint-disable-next-line no-param-reassign */
      options.divCanvas.height = args.absSizeYFull

      // Disable Anti-Alaising
      context.imageSmoothingEnabled = false

      // Render the Image Data to the Pixel Array
      drawing = drawer(countX, countY).get

      // Render the Pixel Array to the Image
      renderPixelToImage(countX, countY, drawing, image.data)

      // Place Image on the Context
      virtualContext.putImageData(image, 0, 0)

      // Draw and upscale Context on Canvas
      context.drawImage(
        virtualCanvas,
        Math.round(missingX / 2) * args.pixelSize,
        Math.round(missingY / 2) * args.pixelSize,
        countX * args.pixelSize,
        countY * args.pixelSize,
      )
    }

    return [args.absSizeXFull, args.absSizeYFull]
  }
}
