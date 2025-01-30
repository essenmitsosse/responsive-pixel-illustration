import { sub } from '@/helper/helperDim'

import Object from './Object'

const Skirt = function (args) {
  // Form & Sizes
  this.skirtSY = this.R(0.3, 1.2)

  this.stripes = this.IF()

  if (this.stripes) {
    this.gap = this.R(-0.1, 0.2)

    this.strip = this.R(-0.1, 0.2)

    this.hor = this.IF(0.08)
  }

  // Colors
  this.skirtColor = args.skirtColor = this.IF()
    ? args.firstColor
    : args.secondColor.copy({ brContrast: 1, max: 4 })

  if (this.stripes) {
    this.stripeColor = this.skirtColor.copy({ brContrast: -1 })
  }

  // Assets
}
// END Skirt

Skirt.prototype = new Object()

Skirt.prototype.draw = function (args) {
  if (args.calc) {
    args.skirtSY = this.pushLinkList({
      r: this.skirtSY,
      useSize: args.lowerBodySY,
      min: 1,
      max: args.lowerBodySY,
    })

    args.feetRestSY = this.pushLinkList({
      add: [args.lowerBodySY, sub(args.skirtSY)],
    })
  }

  return (
    (args.sideView || !args.right) && {
      z: 50,
      cX: args.sideView,
      sX: !args.sideView && { r: 2, a: -1 },
      fX: true,
      sY: args.skirtSY,
      color: this.skirtColor.get(),
      list: this.stripes && [
        {},
        {
          color: this.stripeColor.get(),
          stripes: {
            horizontal: this.hor,
            gap: { r: this.gap, min: 1 },
            strip: { r: this.strip, min: 1 },
          },
        },
      ],
    }
  )
}

export default Skirt
