import type { PixelArray } from './createPixelArray'
import type getPixelUnits from './getPixelUnits'

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
