import Color from '@/renderengine/Color'

import type { ColorRgb } from '@/helper/typeColor'

export type ColorArray = Array<Array<Color>>

const getPixelArray = (width: number, height: number): ColorArray => {
  let countH

  const colorArray: ColorArray = []

  while (width--) {
    countH = height

    colorArray[width] = []

    while (countH--) {
      colorArray[width][countH] = new Color()
    }
  }

  return colorArray
}

type Location = { height: number; posX: number; posY: number; width: number }

export type PixelArray = {
  get: ColorArray
  getClear: (id: string) => (x: number, y: number) => void
  getClearForRect: (id: string) => (args: Location) => void
  getClearSaveForRect: (
    save: Array<[number, number]>,
    mask: Array<Array<boolean>>,
  ) => (args: Location) => void
  getSaveForRect: (
    save: Array<[number, number]>,
    mask: Array<Array<boolean>>,
  ) => (args: Location) => void
  getSet: (
    color: ColorRgb,
    zInd: number,
    id: string,
  ) => (x: number, y: number) => void
  getSetForRect: (
    color: ColorRgb,
    zInd: number,
    id: string,
  ) => (args: Location) => void
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

    getSet: (color, zInd, id) => (x, y) => {
      if (x >= minX && x < maxX && y >= minY && y < maxY) {
        pixelArray[x][y].draw(color, zInd, id)
      }
    },

    getClear: (id) => (x, y) => {
      if (x >= minX && x < maxX && y >= minY && y < maxY) {
        pixelArray[x][y].clear(id)
      }
    },

    getSetForRect: (color, zInd, id) => {
      // Set Color for Rectangle for better Performance
      const pA = pixelArray

      return (args) => {
        const endX = args.width + args.posX
        const endY = args.height + args.posY

        let sizeX = endX > maxX ? maxX : endX
        let sizeY

        const sizeY_start = endY > maxY ? maxY : endY
        const startX = args.posX < minX ? minX : args.posX
        const startY = args.posY < minY ? minY : args.posY

        let row

        while ((sizeX -= 1) >= startX) {
          sizeY = sizeY_start

          row = pA[sizeX]

          while ((sizeY -= 1) >= startY) {
            row[sizeY].draw(color, zInd, id)
          }
        }
      }
    },

    getClearForRect: (id) => {
      const pA = pixelArray

      return (args) => {
        const endX = args.width + args.posX
        const endY = args.height + args.posY

        let sizeX = endX > maxX ? maxX : endX
        let sizeY

        const initSizeY = endY > maxY ? maxY : endY
        const startX = args.posX < minX ? minX : args.posX
        const startY = args.posY < minY ? minY : args.posY

        let row

        while ((sizeX -= 1) >= startX) {
          sizeY = initSizeY

          row = pA[sizeX]

          while ((sizeY -= 1) >= startY) {
            row[sizeY].clear(id)
          }
        }
      }
    },

    getSaveForRect: (save, mask) => (args) => {
      const endX = args.width + args.posX
      const endY = args.height + args.posY

      let sizeX = endX > canvasWidth ? canvasWidth : endX
      let sizeY

      const initSizeY = endY > canvasHeight ? canvasHeight : endY
      const startX = args.posX < 0 ? 0 : args.posX
      const startY = args.posY < 0 ? 0 : args.posY
      const s = save

      let col: Array<boolean>

      while ((sizeX -= 1) >= startX) {
        sizeY = initSizeY

        col = mask[sizeX] || (mask[sizeX] = [])

        while ((sizeY -= 1) >= startY) {
          s.push([sizeX, sizeY])

          col[sizeY] = true
        }
      }
    },

    /** Return prepared Color-Array, with default Color; */
    getClearSaveForRect: (_, mask) => (args) => {
      const endX = args.width + args.posX
      const endY = args.height + args.posY

      let sizeX = endX > canvasWidth ? canvasWidth : endX
      let sizeY

      const initSizeY = endY > canvasHeight ? canvasHeight : endY
      const startX = args.posX < 0 ? 0 : args.posX
      const startY = args.posY < 0 ? 0 : args.posY

      let col

      while ((sizeX -= 1) >= startX) {
        sizeY = initSizeY

        if ((col = mask[sizeX])) {
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
