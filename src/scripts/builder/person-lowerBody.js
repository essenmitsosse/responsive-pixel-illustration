import { Object } from './object.js'

// LOWER BODY --------------------------------------------------------------------------------
export const LowerBody = function (args) {
  // Form & Sizes
  this.sideSYFak = this.R(0.6, 1.6)

  this.crotchSY = this.R(1, 3)

  this.wideHips = this.IF(0.05)

  this.pantless = args.pantless =
    args.animal || this.IF(this.skirt ? 0.4 : 0.01)

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
// END LowerBody

LowerBody.prototype = new Object()

LowerBody.prototype.draw = function (args, z) {
  var list
  var leg

  if (args.calc) {
    args.lowerBodySX = this.pushLinkList(args.personRealSX)
  }

  this.skirt = (!args.demo || args.skirt) && this.skirt

  leg = {
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
      max: this.mult(0.4, args.lowerBodySY),
      min: 1,
    })
  }

  list = {
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
// END LowerBody draw

// Belt --------------------------------------------------------------------------------
export const Belt = function (args) {
  // Form & Sizes
  this.beltSY = this.R(0.1, 0.7)

  this.buckle = this.IF(0.5)

  this.buckleSX = this.R(-0.3, 1)

  this.strips = this.IF(0.3)

  // Colors
  this.beltColor = args.beltColor || args.pantsColor.copy({ brContrast: -1 })

  if (this.buckle) {
    this.buckleColor = this.beltColor.copy({
      brContrast: this.IF(0.5) ? -1 : 2,
    })
  }

  if (this.strips) {
    this.pantsColor = args.skirt ? args.skirtColor : args.pantsColor
  }

  // Assets
}
// END Belt

Belt.prototype = new Object()

Belt.prototype.draw = function (args, z) {
  return {
    z: z + 115,
    sY: {
      r: this.beltSY,
      useSize: args.crotchSY,
      a: 1,
      max: { r: 1.4, useSize: args.legSX, max: [args.crotchSY, -1] },
    },
    color: this.beltColor.get(),
    list: [
      {},
      this.strips && {
        color: this.pantsColor.get(),
        sX: { r: 0.13, max: 2 },
        x: { r: 0.3 },
        fX: true,
      },
      !args.backView &&
        this.buckle && {
          color: this.buckleColor.get(),
          sX: {
            r: this.buckleSX * (args.sideView ? 0.5 : 1),
            min: {
              r: 1,
              otherDim: true,
              max: { r: 0.8, a: -1, otherDim: true },
            },
          },
        },
    ],
  }
}
// END Belt draw

// SKIRT --------------------------------------------------------------------------------
export const Skirt = function (args) {
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
      add: [args.lowerBodySY, this.sub(args.skirtSY)],
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
// END Skirt draw

// LEG --------------------------------------------------------------------------------
export const Leg = function (args) {
  // Form & Sizes

  this.legSX = this.IF(0.1) ? this.R(0.05, 0.5) : 0.05

  this.bootsSY = this.IF() && this.R(0.2, 1)

  this.thights = this.IF() && this.R(1, 1.5) * this.legSX

  this.calves = this.IF() && this.R(1, 1.5) * this.legSX

  this.bootsSXBig = !this.calves && this.IF() && this.GR(1, 2)

  this.bareFoot = this.IF(args.animal ? 0.8 : 0.05)

  this.legsIn = this.IF(args.skirt ? 0.8 : 0.2)

  // Colors
  this.shoeColor = this.bareFoot
    ? args.skinColor
    : args.pantsColor.copy({ prevColor: this.IF(), brContrast: -2 })

  // Assets
}
// END Leg

Leg.prototype = new Object()

Leg.prototype.draw = function (args, z, rightSide, behind) {
  var legPos = args.leg && args.leg[rightSide ? 'right' : 'left']
  var hipBend = legPos === 'legHigh'
  var legBend = hipBend || legPos === 'kneeBend'
  var legRaise = !hipBend && !legBend && legPos === 'legRaise'

  if (args.calc) {
    args.legSX = this.pushLinkList({
      r: this.legSX,
      useSize: args.personHalfSX,
      max: [args.lowerBodySX, this.legsIn ? -2 : -1],
      min: 1,
    })

    args.upperLegSY = this.pushLinkList({
      r: 0.5,
      useSize: args.lowerBodySY,
    })

    args.lowerLegSY = this.pushLinkList({
      add: [args.lowerBodySY, this.sub(args.upperLegSY)],
    })

    args.shoeSY = this.pushLinkList(
      this.bootsSY
        ? { r: this.bootsSY, useSize: args.lowerLegSY, min: 1 }
        : { r: 0.8, useSize: args.legSX, min: 1 },
    )

    args.legMaxSX = this.pushLinkList({
      r: args.sideView ? 0.8 : 1,
      useSize: args.lowerBodySX,
      a: -2,
      max: [args.legSX, 2],
      min: args.legSX,
    })

    args.thighsSX = this.pushLinkList({
      useSize: args.personHalfSX,
      r: this.thights || 1,
      max: args.legMaxSX,
      min: 1,
    })

    args.calvesSX = this.pushLinkList({
      useSize: args.personHalfSX,
      r: this.calves || 1,
      max: args.legMaxSX,
      min: 1,
    })

    args.legFullSX = this.pushLinkList({
      add: [args.thighsSX],
      min: args.calvesSX,
    })
  }

  return {
    s: args.legSX,
    fX: !behind,
    x: !args.sideView && this.legsIn && { r: 0.3, max: 1 },
    z,
    rY:
      hipBend && (args.backView || (args.sideView && args.right === rightSide)),
    rX:
      (!hipBend && args.sideView) ||
      (hipBend &&
        (args.backView || (args.sideView && args.right !== rightSide))),
    rotate: hipBend && (rightSide ? 90 : -90),
    // y: [ args.crotchSY ],
    list: [
      {
        sY: args.upperLegSY,
        list: [
          {
            sX: args.legFullSX,
            fX: !args.sideView || args.right !== rightSide,

            list: [
              // Thigh
              { cX: true, sX: args.thighsSX, fX: true },

              // Calve
              {
                sX: args.calvesSX,
                sY: args.legSX,
                tY: true,
                fY: true,
                cX: true,
                rY:
                  legBend &&
                  (args.backView ||
                    (args.sideView && args.right === rightSide)),
                rX:
                  legBend &&
                  (args.backView ||
                    (args.sideView && args.right === rightSide)),
                rotate: legBend && (rightSide ? -90 : 90),
                list: [
                  {
                    sY: args.lowerLegSY,
                    y: legRaise && {
                      r: -0.1,
                      useSize: args.lowerBodySY,
                    },
                    list: [
                      {},

                      // Feet
                      {
                        sY: args.shoeSY,
                        sX: !this.bareFoot &&
                          this.bootsSXBig && {
                            r: 1,
                            a: this.bootsSXBig,
                            max: {
                              r: 0.5,
                              useSize: args.personHalfSX,
                            },
                          },
                        cX: true,
                        fX: true,
                        tX: true,
                        fY: true,
                        color: this.shoeColor.get(),
                        list: [
                          {},

                          !this.bareFoot && {
                            sY: {
                              r: 0.2,
                              useSize: args.legSX,
                              min: 1,
                            },
                            sX: {
                              r: 1,
                              a: 1,
                              max: {
                                r: 0.15,
                                useSize: args.personHalfSX,
                                max: [args.calvesSX, 1],
                              },
                            },
                            fY: true,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}
// END Leg draw
