import { mult } from '@/helper/helperDim'

import Object from './Object'

const BodyLower = function (args) {
  // Form & Sizes
  this.sideSYFak = this.R(0.6, 1.6)

  this.crotchSY = this.R(1, 3)

  this.wideHips = this.IF(0.05)

  this.pantless = args.pantless =
    args.animal || this.IF(args.skirt ? 0.4 : 0.01)

  // Colors
  this.pantsColor = args.pantsColor = this.pantless
    ? args.skinColor
    : args.secondColor

  // Assets
  this.leg = new this.basic.Leg(args)

  this.skirt = args.skirt =
    (args.demo || this.wideHips || this.IF(args.animal ? 0.05 : 0.15)) &&
    new this.basic.Skirt(args)

  if (!args.animal && this.IF(0.3)) {
    this.belt = new this.basic.Belt(args)
  }
}
// END BodyLower

BodyLower.prototype = new Object()

BodyLower.prototype.draw = function (args, z) {
  if (args.calc) {
    args.lowerBodySX = this.pushLinkList(args.personRealSX)
  }

  this.skirt = (!args.demo || args.skirt) && this.skirt

  const leg = {
    sY: this.skirt && args.feetRestSY,
    list: [
      // Check if Skirt is so long, that it covers all the feet
      this.leg.draw(args, z, args.right),
    ],
  }

  if (args.calc) {
    args.crotchSY = this.pushLinkList({
      r: this.crotchSY,
      useSize: args.legSX,
      max: mult(0.4, args.lowerBodySY),
      min: 1,
    })
  }

  const list = {
    sX: this.wideHips ? [args.lowerBodySX, 1] : args.lowerBodySX,
    sY: args.lowerBodySY,
    cX: args.sideView,
    fY: true,
    color: this.pantsColor.get(),
    z,
    list: [
      // Leg args.sideView
      args.sideView && this.leg.draw(args, z + 100, !args.right, true),

      // Crotch
      this.skirt
        ? this.skirt.draw(args, z + 110)
        : {
            sY: args.crotchSY,
            z: z + 110,
            cX: args.sideView,
          },

      // Leg
      leg,

      // Belt
      this.belt && this.belt.draw(args, z),
    ],
  }

  return list
}

export default BodyLower
