import type getPixelUnits from './getPixelUnits'
import type { PixelArray } from './getRenderer'

export declare module './creator' {
  class DrawingTools {
    constructor(pixelUnit: ReturnType<typeof getPixelUnits>)

    init(countW: number, countH: number, pixelArray: PixelArray): void

    Obj: {
      new (): {
        create(args: { list: unknown }): {
          draw(): void
        }
      }
    }
  }
}
