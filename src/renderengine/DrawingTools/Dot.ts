import Primitive from './Primitive'

import type { ArgsCreate } from './Primitive'

class Dot extends Primitive {
  draw(): void {
    if (this.args === undefined) {
      throw new Error('Unexpected error: args is undefined')
    }

    if (this.args.getRealPosition === undefined) {
      throw new Error('Unexpected error: getRealPosition is undefined')
    }

    if (this.getColorArray === undefined) {
      throw new Error('Unexpected error: getColorArray is undefined')
    }

    const pos = this.args.getRealPosition()

    this.getColorArray(pos.x, pos.y)
  }

  prepareSizeAndPos(
    args: ArgsCreate,
    reflectX: Parameters<typeof this.state.pixelUnit.Position>[1],
    reflectY: Parameters<typeof this.state.pixelUnit.Position>[2],
    rotate: Parameters<typeof this.state.pixelUnit.Position>[3],
  ): {
    getRealPosition: () => { x: number; y: number }
  } {
    return {
      getRealPosition: this.state.pixelUnit.Position(
        args,
        reflectX,
        reflectY,
        rotate,
      ),
    }
  }
}

export default Dot
