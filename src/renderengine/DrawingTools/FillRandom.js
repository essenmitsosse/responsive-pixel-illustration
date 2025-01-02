import Fill from './Fill'

class FillRandom extends Fill {
  getName = 'Random Fill'

  init(args) {
    const width = this.rotate ? args.sY : args.sX
    const height = this.rotate ? args.sX : args.sY

    this.use = args.use

    this.chance = args.chance || 0.5

    this.random = this.state.seed.get(args.seed)

    this.mask = args.mask

    if (height && height.random) {
      this.heightRandom = this.state.pixelUnit.createSize(height.random)
    }

    if (width && width.random) {
      this.widthRandom = this.state.pixelUnit.createSize(width.random)
    }

    if (args.size && args.size.random) {
      this.sizeRandom = this.state.pixelUnit.createSize(args.size.random)
    }
  }

  draw() {
    const width = this.width ? this.width.getReal() : 1
    const height = this.height ? this.height.getReal() : 1
    const sizeRandom = this.sizeRandom ? this.sizeRandom.getReal() + 1 : false

    const heightRandom = this.heightRandom
      ? this.heightRandom.getReal() + 1
      : false

    const widthRandom = this.widthRandom
      ? this.widthRandom.getReal() + 1
      : false

    const color = this.getColorArray()
    const array = this.state.pixelSetter.getSave(this.use)
    const l = array ? array.length : 0

    let count = Math.floor(
      l *
        (this.chance /
          ((width + (widthRandom || sizeRandom || 0) / 2) *
            (height + (heightRandom || sizeRandom || 0) / 2))),
    )

    const mask = this.mask ? this.state.pixelSetter.getMask(this.use) : false
    const dontCheck = !mask
    const random = this.random().one

    let current
    let currentX
    let currentY
    let finalX
    let finalMaskX
    let odd = true
    let w
    let h
    let realHeight
    let randSize = 0
    let randWidth = 0
    let randHeight = 0

    if (count === Infinity) {
      return
    } else if (
      count < Infinity &&
      (width > 1 ||
        height > 1 ||
        heightRandom > 0 ||
        widthRandom > 0 ||
        sizeRandom > 0)
    ) {
      while (count-- > 0) {
        w =
          width +
          (randWidth =
            (widthRandom ? Math.floor(widthRandom * random()) : 0) +
            (randSize = sizeRandom ? Math.floor(sizeRandom * random()) : 0))

        realHeight =
          height +
          (randHeight =
            (heightRandom ? Math.floor(heightRandom * random()) : 0) + randSize)

        odd = !odd

        currentX =
          (current = array[Math.floor(random() * l)])[0] -
          (odd ? width + randWidth : 0)

        currentY = current[1] - (odd ? height + randHeight : 0)

        while (w--) {
          finalX = currentX + w

          if (dontCheck || (finalMaskX = mask[finalX])) {
            h = realHeight

            while (h--) {
              if (dontCheck || finalMaskX[currentY + h]) {
                color(finalX, currentY + h)
              }
            }
          }
        }
      }
    } else {
      while (count-- > 0) {
        color((current = array[Math.floor(random() * l)])[0], current[1])
      }
    }
  }
}

export default FillRandom
