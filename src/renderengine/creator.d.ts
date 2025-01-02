import type { PixelArray } from './createPixelArray'
import type getPixelUnits from './getPixelUnits'

export declare module './creator' {
  export const DrawingTools: (pixelUnit: ReturnType<typeof getPixelUnits>) => {
    getObj: () => {
      create(args: { list: unknown }): {
        draw(): void
      }
    }

    init: (countW: number, countH: number) => PixelArray
  }
}
