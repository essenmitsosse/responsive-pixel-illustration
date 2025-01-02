import type getPixelUnits from './getPixelUnits'
import type { PixelArray } from './getRenderer'

export declare module './creator' {
  export const DrawingTools: (pixelUnit: ReturnType<typeof getPixelUnits>) => {
    Obj: {
      new (): {
        create(args: { list: unknown }): {
          draw(): void
        }
      }
    }

    init: (countW: number, countH: number, pixelArray: PixelArray) => void
  }
}
