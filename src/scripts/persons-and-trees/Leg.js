import { sub } from '@/helper/helperDim'

const Leg = function (args, state) {
  this.state = state

  this.legSX = state.IF(0.1) ? state.R(0.05, 0.5) : 0.05

  this.bootsSY = state.IF() && state.R(0.2, 1)

  this.thights = state.IF() && state.R(1, 1.5) * this.legSX

  this.calves = state.IF() && state.R(1, 1.5) * this.legSX

  this.bootsSXBig = !this.calves && state.IF() && state.GR(1, 2)

  this.bareFoot = state.IF(args.animal ? 0.8 : 0.05)

  this.legsIn = state.IF(args.skirt ? 0.8 : 0.2)

  // Colors
  this.shoeColor = this.bareFoot
    ? args.skinColor
    : args.pantsColor.copy({ prevColor: state.IF(), brContrast: -2 })

  // Assets
}
// END Leg

Leg.prototype.draw = function (args, z, rightSide, behind) {
  const legPos = args.leg && args.leg[rightSide ? 'right' : 'left']
  const hipBend = legPos === 'legHigh'
  const legBend = hipBend || legPos === 'kneeBend'
  const legRaise = !hipBend && !legBend && legPos === 'legRaise'

  if (args.calc) {
    args.legSX = this.state.pushLinkList({
      r: this.legSX,
      useSize: args.personHalfSX,
      max: [args.lowerBodySX, this.legsIn ? -2 : -1],
      min: 1,
    })

    args.upperLegSY = this.state.pushLinkList({
      r: 0.5,
      useSize: args.lowerBodySY,
    })

    args.lowerLegSY = this.state.pushLinkList({
      add: [args.lowerBodySY, sub(args.upperLegSY)],
    })

    args.shoeSY = this.state.pushLinkList(
      this.bootsSY
        ? { r: this.bootsSY, useSize: args.lowerLegSY, min: 1 }
        : { r: 0.8, useSize: args.legSX, min: 1 },
    )

    args.legMaxSX = this.state.pushLinkList({
      r: args.sideView ? 0.8 : 1,
      useSize: args.lowerBodySX,
      a: -2,
      max: [args.legSX, 2],
      min: args.legSX,
    })

    args.thighsSX = this.state.pushLinkList({
      useSize: args.personHalfSX,
      r: this.thights || 1,
      max: args.legMaxSX,
      min: 1,
    })

    args.calvesSX = this.state.pushLinkList({
      useSize: args.personHalfSX,
      r: this.calves || 1,
      max: args.legMaxSX,
      min: 1,
    })

    args.legFullSX = this.state.pushLinkList({
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
