import getIsUnknownObject from '@/lib/getIsUnknownObject'

import Fill from './Fill'

import type { Location } from './createPixelArray'
import type { ArgsInit, ArgsPrepare } from './Primitive'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Height, Width } from '@/renderengine/getPixelUnits/Size'

type ArgsInitFillRandom = {
  chance?: number
  mask?: (dimensions: Location, push?: boolean) => Location
  sX?: InputDynamicVariable
  sY?: InputDynamicVariable
  seed?: number
  size?: InputDynamicVariable
}

class FillRandom extends Fill {
  chance?: number
  random?: () => {
    count: (c: number) => number
    one: () => number
    seed: () => number
  }
  mask?: (dimensions: Location, push?: boolean) => Location
  heightRandom?: Height | Width
  widthRandom?: Height | Width
  sizeRandom?: Height | Width
  width?: Width | false
  height?: Height | false
  init(args: ArgsInit & ArgsInitFillRandom): void {
    const width = this.rotate ? args.sY : args.sX
    const height = this.rotate ? args.sX : args.sY

    this.use = args.use

    this.chance = args.chance || 0.5

    this.random = this.state.seed.get(args.seed)

    this.mask = args.mask

    if (getIsUnknownObject(height) && height.random) {
      this.heightRandom = this.state.pixelUnit.createSize(height.random)
    }

    if (getIsUnknownObject(width) && width.random) {
      this.widthRandom = this.state.pixelUnit.createSize(width.random)
    }

    if (getIsUnknownObject(args.size) && args.size.random) {
      this.sizeRandom = this.state.pixelUnit.createSize(args.size.random)
    }
  }

  // Prepare Size and Position Data for Basic Objects
  prepareSizeAndPos(
    args: ArgsPrepare,
    _: boolean,
    __: boolean,
    rotate: boolean,
  ): void {
    const width = (rotate ? args.sY : args.sX) || args.s
    const height = (rotate ? args.sX : args.sY) || args.s

    this.width = width ? this.state.pixelUnit.getWidth(width) : false

    this.height = height ? this.state.pixelUnit.getWidth(height) : false
  }

  draw(): void {
    if (this.use === undefined) {
      throw new Error('unexpected Error: use is undefined')
    }

    if (this.chance === undefined) {
      throw new Error('unexpected Error: chance is undefined')
    }

    if (this.random === undefined) {
      throw new Error('unexpected Error: random is undefined')
    }

    if (this.getColorArray === undefined) {
      throw new Error('unexpected Error: getColorArray is undefined')
    }

    const width = this.width ? this.width.getReal() : 1
    const height = this.height ? this.height.getReal() : 1
    const sizeRandom = this.sizeRandom ? this.sizeRandom.getReal() + 1 : false

    const heightRandom = this.heightRandom
      ? this.heightRandom.getReal() + 1
      : false

    const widthRandom = this.widthRandom
      ? this.widthRandom.getReal() + 1
      : false

    const array = this.state.pixelSetter.getSave(this.use)
    const l = array ? array.length : 0

    let count = Math.floor(
      l *
        (this.chance /
          ((width + (widthRandom || sizeRandom || 0) / 2) *
            (height + (heightRandom || sizeRandom || 0) / 2))),
    )

    const mask = this.mask ? this.state.pixelSetter.getMask(this.use) : false
    const dontCheck = mask === false
    const random = this.random().one

    let current
    let odd = true
    let randSize = 0
    let randWidth = 0
    let randHeight = 0

    if (count === Infinity || array === false) {
      return
    } else if (
      count < Infinity &&
      (width > 1 ||
        height > 1 ||
        (typeof heightRandom === 'number' && heightRandom > 0) ||
        (typeof widthRandom === 'number' && widthRandom > 0) ||
        (typeof sizeRandom === 'number' && sizeRandom > 0))
    ) {
      while (count-- > 0) {
        let w =
          width +
          (randWidth =
            (widthRandom ? Math.floor(widthRandom * random()) : 0) +
            (randSize = sizeRandom ? Math.floor(sizeRandom * random()) : 0))

        const realHeight =
          height +
          (randHeight =
            (heightRandom ? Math.floor(heightRandom * random()) : 0) + randSize)

        odd = !odd

        const currentX =
          (current = array[Math.floor(random() * l)])[0] -
          (odd ? width + randWidth : 0)

        const currentY = current[1] - (odd ? height + randHeight : 0)

        while (w--) {
          const finalX = currentX + w
          const finalMaskX = dontCheck === false && mask[finalX]

          if (dontCheck || finalMaskX) {
            let h = realHeight

            while (h--) {
              if (dontCheck || (finalMaskX && finalMaskX[currentY + h])) {
                this.getColorArray(finalX, currentY + h)
              }
            }
          }
        }
      }
    } else {
      while (count-- > 0) {
        this.getColorArray(
          (current = array[Math.floor(random() * l)])[0],
          current[1],
        )
      }
    }
  }
}

export default FillRandom
