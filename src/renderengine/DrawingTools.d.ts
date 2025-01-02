import type { PixelArray } from './DrawingTools/createPixelArray'
import type getPixelUnits from './getPixelUnits'

export declare module './DrawingTools' {
  export const DrawingTools: (pixelUnit: ReturnType<typeof getPixelUnits>) => {
    getObj: () => {
      create(args: { list: unknown }): {
        draw(): void
      }
    }

    init: (countW: number, countH: number) => PixelArray
  }
}
