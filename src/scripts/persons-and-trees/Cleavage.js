import { mult, sub } from '@/helper/helperDim'

import Object from './Object'

const Cleavage = function (args) {
  // Form & Sizes
  this.sleeveless = !args.sleeves && this.IF(0.5)

  this.strapSX = this.sleeveless && this.R(-1, 0)

  this.strapSY = this.sleeveless && this.R(0.05, 0.3)

  this.cleavage = !this.sleeveless || this.IF(0.5)

  this.cleavageSX = this.cleavage ? this.cleavage && this.R(1, 2) : 1

  this.cleavageSY = this.cleavage && this.R(0.05, 0.3)

  // Colors
  this.skinColor = args.skinColor

  // Assets
}
// END Cleavage

Cleavage.prototype = new Object()

Cleavage.prototype.draw = function (args, z) {
  if (args.calc) {
    args.cleavageSX = this.pushLinkList({
      r: this.cleavageSX,
      useSize: args.neckSX,
      max: [args.chestSX, -2],
    })

    args.cleavageX = this.pushLinkList(
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
        args.cleavageRightX = this.pushLinkList({
          add: [args.chestSX, sub(args.cleavageX), sub(args.cleavageSX)],
        })
      }

      args.strapSX = this.pushLinkList({
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
