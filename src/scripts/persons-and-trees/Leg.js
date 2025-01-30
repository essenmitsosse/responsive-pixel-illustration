import { sub } from '@/helper/helperDim'

import Object from './Object'

const Leg = function (args) {
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
      add: [args.lowerBodySY, sub(args.upperLegSY)],
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

export default Leg
