import Primitive from './Primitive'

class Rect extends Primitive {
  setColorArray(args) {
    this.getColorArrayRect = this.state.pixelSetter.setColorArrayRect(args)
  }

  draw() {
    if (this.dimensions === undefined) {
      throw new Error('Unexpected error: dimensions is undefined')
    }

    const dimensions = this.dimensions.calc()

    if (dimensions.checkMin()) {
      return
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
