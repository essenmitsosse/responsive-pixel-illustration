import Primitive from './Primitive'

class Dot extends Primitive {
  draw() {
    if (this.args.getRealPosition === undefined) {
      throw new Error('Unexpected error: getRealPosition is undefined')
    }

    const pos = this.args.getRealPosition()

    this.getColorArray(pos.x, pos.y)
  }

  prepareSizeAndPos(args, reflectX, reflectY, rotate) {
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
