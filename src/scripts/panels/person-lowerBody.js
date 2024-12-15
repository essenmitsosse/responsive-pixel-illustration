import { mult, sub } from '@/renderengine/helper/helper'

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
  if (args.calc) {
    this.vL['lowerBodySX' + args.nr] = 'personRealSX' + args.nr
  }

  this.skirt = (!args.demo || args.skirt) && this.skirt

  const list = {
    sX: this.wideHips ? ['lowerBodySX' + args.nr, 1] : 'lowerBodySX' + args.nr,
    sY: 'lowerBodySY' + args.nr,
    cX: args.sideView,
    fY: true,
    color: this.pantsColor.get(),
    z,
    list: [
      // Leg SideView
      args.sideView && this.leg.draw(args, z + 100, !args.right, true),

      // Crotch
      this.skirt
        ? this.skirt.draw(args, z + 110)
        : {
            sY: 'crotchSY' + args.nr,
            z: z + 110,
            cX: args.sideView,
          },

      // Leg
      {
        sY: this.skirt && 'feetRestSY' + args.nr,
        list: [
          // Check if Skirt is so long, that it covers all the feet
          this.leg.draw(args, z, args.right),
        ],
      },

      // Belt
      this.belt && this.belt.draw(args, z),
    ],
  }

  if (args.calc) {
    this.vL['crotchSY' + args.nr] = {
      r: this.crotchSY,
      useSize: 'legSX' + args.nr,
      max: mult(0.4, 'lowerBodySY' + args.nr),
      min: 1,
    }
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
      useSize: 'crotchSY' + args.nr,
      a: 1,
      max: {
        r: 1.4,
        useSize: 'legSX' + args.nr,
        max: ['crotchSY' + args.nr, -1],
      },
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
    this.vL['skirtSY' + args.nr] = {
      r: this.skirtSY,
      useSize: 'lowerBodySY' + args.nr,
      min: 1,
      max: 'lowerBodySY' + args.nr,
    }

    this.vL['feetRestSY' + args.nr] = [
      'lowerBodySY' + args.nr,
      sub('skirtSY' + args.nr),
    ]
  }

  return (
    (args.sideView || !args.right) && {
      z: 50,
      cX: args.sideView,
      sX: !args.sideView && { r: 2, a: -1 },
      fX: true,
      sY: 'skirtSY' + args.nr,
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
  const legPos = args.leg && args.leg[rightSide ? 'right' : 'left']
  const hipBend = legPos === 'legHigh'
  const legBend = hipBend || legPos === 'kneeBend'
  const legRaise = !hipBend && !legBend && legPos === 'legRaise'

  if (args.calc) {
    this.vL['legSX' + args.nr] = {
      r: this.legSX,
      useSize: 'personHalfSX' + args.nr,
      max: ['lowerBodySX' + args.nr, this.legsIn ? -2 : -1],
      min: 1,
    }

    this.vL['upperLegSY' + args.nr] = {
      r: 0.5,
      useSize: 'lowerBodySY' + args.nr,
    }

    this.vL['lowerLegSY' + args.nr] = [
      'lowerBodySY' + args.nr,
      sub('upperLegSY' + args.nr),
    ]

    this.vL['shoeSY' + args.nr] = this.bootsSY
      ? { r: this.bootsSY, useSize: 'lowerLegSY' + args.nr, min: 1 }
      : { r: 0.8, useSize: 'legSX' + args.nr, min: 1 }

    this.vL['legMaxSX' + args.nr] = {
      r: args.sideView ? 0.8 : 1,
      useSize: 'lowerBodySX' + args.nr,
      a: -2,
      max: ['legSX' + args.nr, 2],
      min: 'legSX' + args.nr,
    }

    this.vL['thighsSX' + args.nr] = {
      useSize: 'personHalfSX' + args.nr,
      r: this.thights || 1,
      max: 'legMaxSX' + args.nr,
      min: 1,
    }

    this.vL['calvesSX' + args.nr] = {
      useSize: 'personHalfSX' + args.nr,
      r: this.calves || 1,
      max: 'legMaxSX' + args.nr,
      min: 1,
    }

    this.vL['legFullSX' + args.nr] = {
      a: 'thighsSX' + args.nr,
      min: 'calvesSX' + args.nr,
    }
  }

  return {
    s: 'legSX' + args.nr,
    fX: !behind,
    x: !args.sideView && this.legsIn && { r: 0.3, max: 1 },
    z,
    rY:
      hipBend && (args.backView || (args.sideView && args.right === rightSide)),
    rX:
      (!hipBend && args.sideView) ||
      (hipBend &&
        (args.backView || (args.sideView && !args.right === rightSide))),
    rotate: hipBend && (rightSide ? 90 : -90),
    // y:["crotchSY"+nr],
    list: [
      {
        sY: 'upperLegSY' + args.nr,
        list: [
          {
            sX: 'legFullSX' + args.nr,
            fX: !args.sideView || args.right !== rightSide,

            list: [
              // Thigh
              { cX: true, sX: 'thighsSX' + args.nr, fX: true },

              // Calve
              {
                sX: 'calvesSX' + args.nr,
                sY: 'legSX' + args.nr,
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
                    sY: 'lowerLegSY' + args.nr,
                    y: legRaise && {
                      r: -0.1,
                      useSize: 'lowerBodySY' + args.nr,
                    },
                    list: [
                      {},

                      // Feet
                      {
                        sY: 'shoeSY' + args.nr,
                        sX: !this.bareFoot &&
                          this.bootsSXBig && {
                            r: 1,
                            a: this.bootsSXBig,
                            max: {
                              r: 0.5,
                              useSize: 'personHalfSX' + args.nr,
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
                              useSize: 'legSX' + args.nr,
                              min: 1,
                            },
                            sX: {
                              r: 1,
                              a: 1,
                              max: {
                                r: 0.15,
                                useSize: 'personHalfSX' + args.nr,
                                max: ['calvesSX' + args.nr, 1],
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
