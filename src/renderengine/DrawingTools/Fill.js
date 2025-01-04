import Primitive from './Primitive'

class Fill extends Primitive {
  init(args) {
    this.use = args.use
  }

  // Prepare Size and Position Data for Basic Objects
  prepareSizeAndPos(args, reflectX, reflectY, rotate) {
    const width = (rotate ? args.sY : args.sX) || args.s
    const height = (rotate ? args.sX : args.sY) || args.s

    this.width = width ? this.state.pixelUnit.getWidth(width) : false

    this.height = height ? this.state.pixelUnit.getWidth(height) : false
  }

  draw() {
    if (this.use === undefined) {
      throw new Error('Unexpexted error: use is undefined')
    }

    if (this.getColorArray === undefined) {
      throw new Error('Unexpexted error: getColorArray is undefined')
    }

    const array = this.state.pixelSetter.getSave(this.use)

    if (array === false) {
      return
    }

    const { getColorArray } = this

    array.forEach(([x, y]) => getColorArray(x, y))
  }
}

export default Fill
