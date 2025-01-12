import Primitive from './Primitive'

import type getPixelSetter from './getPixelSetter'

class Pixel extends Primitive {
  getColorArray?: (x: number, y: number) => void
  setColorArray(
    args: Parameters<ReturnType<typeof getPixelSetter>['setColorArray']>[0],
  ): void {
    this.getColorArray = this.state.pixelSetter.setColorArray(args)
  }
}

export default Pixel
