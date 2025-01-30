import { sub } from '@/helper/helperDim'

const Skirt = function (args, state) {
  this.state = state

  // Form & Sizes
  this.skirtSY = state.R(0.3, 1.2)

  this.stripes = state.IF()

  if (this.stripes) {
    this.gap = state.R(-0.1, 0.2)

    this.strip = state.R(-0.1, 0.2)

    this.hor = state.IF(0.08)
  }

  // Colors
  this.skirtColor = args.skirtColor = state.IF()
    ? args.firstColor
    : args.secondColor.copy({ brContrast: 1, max: 4 })

  if (this.stripes) {
    this.stripeColor = this.skirtColor.copy({ brContrast: -1 })
  }

  // Assets
}
// END Skirt

Skirt.prototype.draw = function (args) {
  if (args.calc) {
    args.skirtSY = this.state.pushLinkList({
      r: this.skirtSY,
      useSize: args.lowerBodySY,
      min: 1,
      max: args.lowerBodySY,
    })

    args.feetRestSY = this.state.pushLinkList({
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
