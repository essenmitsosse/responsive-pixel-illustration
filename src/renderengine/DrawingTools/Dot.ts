import Pixel from './Pixel'

import type { Position } from '@/renderengine/getPixelUnits'

export type ArgsPrepareDot = Parameters<Position>[0]

class Dot extends Pixel {
  getRealPosition?: () => { x: number; y: number }

  draw(): void {
    if (this.getRealPosition === undefined) {
      throw new Error('Unexpected error: getRealPosition is undefined')
    }

    if (this.getColorArray === undefined) {
      throw new Error('Unexpected error: getColorArray is undefined')
    }

    const pos = this.getRealPosition()

    this.getColorArray(pos.x, pos.y)
  }

  prepareSizeAndPos(
    args: ArgsPrepareDot,
    reflectX: Parameters<typeof this.state.pixelUnit.Position>[1],
    reflectY: Parameters<typeof this.state.pixelUnit.Position>[2],
    rotate: Parameters<typeof this.state.pixelUnit.Position>[3],
  ): void {
    this.getRealPosition = this.state.pixelUnit.Position(
      args,
      reflectX,
      reflectY,
      rotate,
    )
  }
}

export default Dot
