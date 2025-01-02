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
    const color = this.getColorArray()
    const array = this.state.pixelSetter.getSave(this.use)

    let l = array ? array.length - 1 : -1
    let current

    while (l >= 0) {
      color((current = array[l--])[0], current[1])
    }
  }
}

export default Fill
