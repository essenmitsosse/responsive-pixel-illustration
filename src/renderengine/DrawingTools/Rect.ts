import Primitive from './Primitive'

import type { Location } from './createPixelArray'

class Rect extends Primitive {
  getColorArrayRect?: (() => (args: Location) => void) | undefined
  setColorArray(
    args: Parameters<typeof this.state.pixelSetter.setColorArrayRect>[0],
  ): void {
    this.getColorArrayRect = this.state.pixelSetter.setColorArrayRect(args)
  }

  draw(): void {
    if (this.dimensions === undefined) {
      throw new Error('Unexpected error: dimensions is undefined')
    }

    const dimensions = this.dimensions.calc()

    if (dimensions.checkMin()) {
      return
    }

    if (this.getColorArrayRect === undefined) {
      throw new Error('Unexpected error: getColorArrayRect is undefined')
    }

    this.getColorArrayRect()({
      posX: dimensions.posX,
      posY: dimensions.posY,
      width: dimensions.width,
      height: dimensions.height,
    })
  }
}

export default Rect
