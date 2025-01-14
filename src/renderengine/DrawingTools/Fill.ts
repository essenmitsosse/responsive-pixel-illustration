import Pixel from './Pixel'

export type ArgsInitFill = {
  use?: string
}

class Fill extends Pixel {
  use?: string
  init(args: ArgsInitFill): void {
    super.init(args)

    this.use = args.use
  }

  draw(): void {
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
