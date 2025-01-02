import Primitive from './Primitive'

class Rect extends Primitive {
  isRect = true

  draw() {
    const dimensions = this.dimensions.calc()

    if (dimensions.checkMin()) {
      return
    }

    this.getColorArray()({
      posX: dimensions.posX,
      posY: dimensions.posY,
      width: dimensions.width,
      height: dimensions.height,
    })
  }
}

export default Rect
