import Color from './Color'

import type { ColorRgb } from '@/helper/typeColor'

export type ColorArray = Array<Array<Color>>

const getPixelArray = (width: number, height: number): ColorArray =>
  new Array(width)
    .fill(null)
    .map(() => new Array(height).fill(null).map(() => new Color()))

export type Location = {
  height: number
  posX: number
  posY: number
  width: number
}

export type PixelArray = {
  get: ColorArray
  getClear: (args: { id?: string; x: number; y: number }) => void
  getClearForRect: (id: string | undefined, args: Location) => void
  getClearSaveForRect: (
    save: Array<[number, number]>,
    mask: Array<Array<boolean>>,
    args: Location,
  ) => void
  getSaveForRect: (
    save: Array<[number, number]>,
    mask: Array<Array<boolean>>,
    args: Location,
  ) => void
  getSet: (args: {
    color: ColorRgb
    id?: string
    x: number
    y: number
    zInd: number
  }) => void
  getSetForRect: (
    color: ColorRgb,
    zInd: number,
    id: string | undefined,
    args: Location,
  ) => void
  setMask: (dimensions: Location, push?: boolean) => Location
}

const createPixelArray = (
  canvasWidth: number,
  canvasHeight: number,
): PixelArray => {
  // Create PixelArray
  const pixelArray = getPixelArray(canvasWidth, canvasHeight)

  let minX = 0
  let minY = 0
  let maxX = canvasWidth
  let maxY = canvasHeight

  return {
    setMask: (dimensions, push): Location => {
      const old = {
        posX: minX,
        width: maxX - minX,
        posY: minY,
        height: maxY - minY,
      }

      // TODO: Dont check if its the old values;

      maxX = (minX = dimensions.posX) + dimensions.width

      maxY = (minY = dimensions.posY) + dimensions.height

      if (!maxX || maxX > canvasWidth) {
        maxX = canvasWidth
      }

      if (!maxY || maxY > canvasHeight) {
        maxY = canvasHeight
      }

      if (!minX || minX < 0) {
        minX = 0
      }

      if (!minY || minY < 0) {
        minY = 0
      }

      if (push) {
        if (maxX > old.posX + old.width) {
          maxX = old.posX + old.width
        }

        if (maxY > old.posY + old.height) {
          maxY = old.posY + old.height
        }

        if (minX < old.posX) {
          minX = old.posX
        }

        if (minY < old.posY) {
          minY = old.posY
        }
      }

      return old
    },

    getSet: (args): void => {
      if (args.x >= minX && args.x < maxX && args.y >= minY && args.y < maxY) {
        pixelArray[args.x]![args.y]!.draw(args.color, args.zInd, args.id)
      }
    },

    getClear: (args): void => {
      if (args.x >= minX && args.x < maxX && args.y >= minY && args.y < maxY) {
        pixelArray[args.x]![args.y]!.clear(args.id)
      }
    },

    getSetForRect: (color, zInd, id, args): void => {
      const endX = args.width + args.posX
      const endY = args.height + args.posY

      let sizeX = endX > maxX ? maxX : endX

      const sizeY_start = endY > maxY ? maxY : endY
      const startX = args.posX < minX ? minX : args.posX
      const startY = args.posY < minY ? minY : args.posY

      while ((sizeX -= 1) >= startX) {
        let sizeY = sizeY_start

        const row = pixelArray[sizeX]!

        while ((sizeY -= 1) >= startY) {
          row[sizeY]!.draw(color, zInd, id)
        }
      }
    },

    getClearForRect: (id, args): void => {
      const endX = args.width + args.posX
      const endY = args.height + args.posY

      let sizeX = endX > maxX ? maxX : endX

      const initSizeY = endY > maxY ? maxY : endY
      const startX = args.posX < minX ? minX : args.posX
      const startY = args.posY < minY ? minY : args.posY

      while ((sizeX -= 1) >= startX) {
        let sizeY = initSizeY

        const row = pixelArray[sizeX]!

        while ((sizeY -= 1) >= startY) {
          row[sizeY]!.clear(id)
        }
      }
    },

    getSaveForRect: (save, mask, args): void => {
      const endX = args.width + args.posX
      const endY = args.height + args.posY

      let sizeX = endX > canvasWidth ? canvasWidth : endX

      const initSizeY = endY > canvasHeight ? canvasHeight : endY
      const startX = args.posX < 0 ? 0 : args.posX
      const startY = args.posY < 0 ? 0 : args.posY
      const s = save

      while ((sizeX -= 1) >= startX) {
        let sizeY = initSizeY

        const col = mask[sizeX] || (mask[sizeX] = [])

        while ((sizeY -= 1) >= startY) {
          s.push([sizeX, sizeY])

          col[sizeY] = true
        }
      }
    },

    /** Return prepared Color-Array, with default Color; */
    getClearSaveForRect: (_, mask, args): void => {
      const endX = args.width + args.posX
      const endY = args.height + args.posY

      let sizeX = endX > canvasWidth ? canvasWidth : endX

      const initSizeY = endY > canvasHeight ? canvasHeight : endY
      const startX = args.posX < 0 ? 0 : args.posX
      const startY = args.posY < 0 ? 0 : args.posY

      while ((sizeX -= 1) >= startX) {
        let sizeY = initSizeY

        const col = mask[sizeX]

        if (col) {
          while ((sizeY -= 1) >= startY) {
            if (col[sizeY]) {
              col[sizeY] = false
            }
          }
        }
      }
    },

    get: pixelArray,
  }
}

export default createPixelArray
