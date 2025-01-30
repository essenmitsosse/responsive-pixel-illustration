import { mult, sub } from '@/helper/helperDim'

const Cleavage = function (args, state) {
  this.state = state

  // Form & Sizes
  this.sleeveless = !args.sleeves && state.IF(0.5)

  this.strapSX = this.sleeveless && state.R(-1, 0)

  this.strapSY = this.sleeveless && state.R(0.05, 0.3)

  this.cleavage = !this.sleeveless || state.IF(0.5)

  this.cleavageSX = this.cleavage ? this.cleavage && state.R(1, 2) : 1

  this.cleavageSY = this.cleavage && state.R(0.05, 0.3)

  // Colors
  this.skinColor = args.skinColor

  // Assets
}
// END Cleavage

Cleavage.prototype.draw = function (args, z) {
  if (args.calc) {
    args.cleavageSX = this.state.pushLinkList({
      r: this.cleavageSX,
      useSize: args.neckSX,
      max: [args.chestSX, -2],
    })

    args.cleavageX = this.state.pushLinkList(
      args.sideView
        ? [
            mult(0.5, args.chestSX),
            mult(-0.5, args.cleavageSX),
            sub(args.collarSX),
          ]
        : [args.chestSX, mult(-1, args.cleavageSX)],
    )

    if (this.sleeveless) {
      if (args.sideView) {
        args.cleavageRightX = this.state.pushLinkList({
          add: [args.chestSX, sub(args.cleavageX), sub(args.cleavageSX)],
        })
      }

      args.strapSX = this.state.pushLinkList({
        r: this.strapSX,
        useSize: args.cleavageX,
        max: -1,
      })
    }
  }

  return {
    list: [
      args.sideView &&
        this.sleeveless && {
          color: this.skinColor.get(),
          sX: [args.cleavageRightX, args.strapSX],
          sY: args.sleevelessSY,
        },
      this.sleeveless && {
        color: this.skinColor.get(),
        sX: [args.cleavageX, args.strapSX],
        sY: {
          r: this.strapSY,
          add: [args.shoulderSY],
          save: args.sleevelessSY,
        },
        fX: true,
      },
      this.cleavage && {
        z,
        color: this.skinColor.get(),
        sY: { r: this.cleavageSY },
        x: args.sideView && args.cleavageX,
        sX: args.cleavageSX,
        fX: args.sideView,
      },
    ],
  }
}

export default Cleavage
