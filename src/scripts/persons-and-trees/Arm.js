import { mult, sub } from '@/helper/helperDim'

import Object from './Object'

const Arm = function (args) {
  // Form & Sizes
  this.armSX = this.IF(0.8) ? 0.04 : this.R(0, 0.1)

  this.armSY = this.R(0.4, 0.6)

  if (args.demo && args.arm) {
    this.armSY = args.arm
  }

  this.upperArmSY = this.R(0.2, 0.8)

  this.sleeves = args.sleeves = !args.topless && this.IF(0.95)

  if (this.sleeves) {
    this.sleeveSY = this.R(0, 1)

    this.upperSleeveSY =
      this.upperArmSY > this.sleeveSY ? this.sleeveSY : 'full'

    this.lowerSleeveSY =
      this.upperArmSY > this.sleeveSY ? false : this.sleeveSY - this.upperArmSY

    this.fullUpper = this.upperSleeveSY === 'full'
  }

  this.vest = args.sleeves && this.IF()

  this.shirt = this.sleeves && args.shirt

  // Colors
  this.skinColor = args.skinColor

  this.shirtColor = args.shirtColor

  // Assets
  this.shoulderPad = this.IF(0.05) && new this.basic.ShoulderPad(args)

  this.toolLeft =
    (args.demo || this.IF(0.1)) &&
    (this.IF(0.5) ? new this.basic.Shield(args) : new this.basic.Sword(args))

  this.toolRight =
    !args.demo &&
    this.IF(0.1) &&
    (this.IF(0.5)
      ? new this.basic.Shield(args, true)
      : new this.basic.Sword(args, true))

  this.headGear = args.headGear
}
// END Arm

Arm.prototype = new Object()

Arm.prototype.draw = function (args, rightSide, behind) {
  const name = rightSide ? 'right' : 'left'
  const nrName = name + args.nr

  const renderFromRight = args.sideView
    ? rightSide
    : args.right !== args.backView

  const tool = rightSide ? this.toolRight : this.toolLeft
  const otherHand = !rightSide ? this.toolRight : this.toolLeft
  const finger = args.finger && args.finger[name]
  const shoulderAngle = ((args.shoulder && args.shoulder[name]) || 0) * Math.PI
  const armAngle = ((args.arm && args.arm[name]) || 0) * Math.PI + shoulderAngle

  let fullAngle = (armAngle / Math.PI) * 180

  const upperZ = shoulderAngle < 1.5 ? -150 : 0

  if (fullAngle > 180) {
    fullAngle -= 360
  } else if (fullAngle < -180) {
    fullAngle += 360
  }

  if (args.calc) {
    args.armSX = this.pushLinkList({
      r: this.armSX,
      useSize: args.personHalfSX,
      min: 1,
    })

    args.armBasicSY = this.pushLinkList({ r: 1, useSize: args.fullBodySY })

    args.armSY = this.pushLinkList({
      r: this.armSY,
      useSize: args.armBasicSY,
    })

    args.shoulderSX = this.pushLinkList([args.armSX])

    args.shoulderSY = this.pushLinkList({
      r: 1,
      useSize: args.armSX,
      min: 1,
      max: args.chestSY,
    })

    args.shoulderFullSX = this.pushLinkList([
      mult(args.sideView ? 2 : 1, args.shoulderSX),
      args.chestSX,
    ])

    args.handSX = this.pushLinkList({
      add: [args.armSX, 1],
      min: 1,
      max: { r: 0.1, useSize: args.personHalfSX },
    })

    args.handHalfNegSX = this.pushLinkList({
      r: -0.5,
      useSize: args.handSX,
    })

    args.upperArmSY = this.pushLinkList({
      r: this.upperArmSY,
      useSize: args.armSY,
    })

    args.lowerArmSY = this.pushLinkList([args.armSY, sub(args.upperArmSY)])

    if (this.sleeves) {
      if (!this.fullUpper) {
        args.upperSleeveSY = this.pushLinkList({
          r: this.upperSleeveSY,
          useSize: args.armSY,
        })
      } else {
        args.lowerSleeveSY = this.pushLinkList({
          r: this.lowerSleeveSY,
          useSize: args.armSY,
        })
      }
    }

    this.hoverChangerStandard.push({
      min: 0.3,
      max: 2.5,
      map: 'arm-length',
      variable: args.armBasicSY,
    })
  }

  args['armHalfSX' + nrName] = this.pushLinkList({
    r: renderFromRight ? 0.49 : 0.51,
    useSize: args.armSX,
    max: {
      r: 0.22,
      useSize: args.upperBodySX,
      a: renderFromRight ? -1 : 0,
    },
  })

  args['upperArmX' + nrName] = this.pushLinkList({
    r: Math.sin(shoulderAngle),
    useSize: args.upperArmSY,
  })

  args['upperArmY' + nrName] = this.pushLinkList({
    r: Math.cos(shoulderAngle),
    useSize: args.upperArmSY,
  })

  args['lowerArmX' + nrName] = this.pushLinkList({
    r: Math.sin(armAngle),
    useSize: args.lowerArmSY,
  })

  args['lowerArmY' + nrName] = this.pushLinkList({
    r: Math.cos(armAngle),
    useSize: args.lowerArmSY,
  })

  if (this.sleeves) {
    if (!this.fullUpper) {
      args['upperSleeveX' + nrName] = this.pushLinkList({
        r: Math.sin(shoulderAngle),
        useSize: args.upperSleeveSY,
      })

      args['upperSleeveY' + nrName] = this.pushLinkList({
        r: Math.cos(shoulderAngle),
        useSize: args.upperSleeveSY,
      })
    } else {
      args['lowerSleeveX' + nrName] = this.pushLinkList({
        r: Math.sin(armAngle),
        useSize: args.lowerSleeveSY,
      })

      args['lowerSleeveY' + nrName] = this.pushLinkList({
        r: Math.cos(armAngle),
        useSize: args.lowerSleeveSY,
      })
    }
  }

  return {
    sX: args.shoulderSX,
    sY: args.armSY,
    tX: true,
    fX: !behind,
    rX: behind,
    id: args['shoulder' + nrName],
    color: this.vest
      ? this.shirtColor.get()
      : !this.sleeves && this.skinColor.get(),
    z: 1000,
    list: [
      // Shoulder
      {
        sX: args.shoulderSX,
        sY: args.shoulderSY,
        z: upperZ,
      },

      this.shoulderPad && this.shoulderPad.draw(args, 10),

      // // Turn Checkers
      // { 	s:5, z:1000000, color: args.right ? [0,255,0]: [255,0,0], tX: true, fX: true, list: [ {},
      // 		{
      // 			s:1,
      // 			color: [0,0,0],
      // 			fY: fullAngle < 90 && fullAngle > -90,
      // 			fX: fullAngle > 0,
      // 			cX:( fullAngle < 22.5 && fullAngle > -22.5 ) || ( fullAngle > 157.5 || fullAngle < -157.5 ),
      // 			cY:( fullAngle > 67.5 && fullAngle < 112.5 ) || ( fullAngle < -67.5 && fullAngle > -112.5 )
      // 		}
      // ]},
      // { 	s:5, x:5, z:1000000, color: args.right ? [0,150,0]: [150,0,0], tX: true, fX: true,
      // 	rotate: ( fullAngle > 45 ?
      // 		fullAngle < 135 ?
      // 			-90
      // 			: -180
      // 		: fullAngle < -45 ?
      // 			fullAngle > -135 ?
      // 				90
      // 				: 180
      // 			: 0 ) * ( renderFromRight ? -1: 1 ),
      // 	list: [
      // 		{},
      // 		{
      // 			fY: true,
      // 			cX: true,
      // 			s:1,
      // 			color: [0,0,0],
      // 		}
      // ]},

      {
        fX: true,
        x: {
          add: [sub(args['armHalfSX' + nrName])],
          a: renderFromRight && -1,
        },
        y: [mult(0.49, args.armSX)],
        list: [
          // Upper Arm
          {
            list: [
              {
                z: upperZ,
                weight: args.armSX,
                points: [
                  {},
                  {
                    x: args['upperArmX' + nrName],
                    y: args['upperArmY' + nrName],
                  },
                ],
              },
            ],
          },

          // // Upper Sleeve
          // this.sleeves && !this.fullUpper && {
          // 	z: upperZ,
          // 	weight: args.armSX,
          // 	color: [255,0,0],
          // 	points: [
          // 		{ },
          // 		{ x: args[ "upperSleeveX"+nrName ], y: args[ "upperSleeveY"+nrName ] }
          // 	]
          // },

          // Lower Arm
          {
            x: args['upperArmX' + nrName],
            y: args['upperArmY' + nrName],
            z: 800,
            list: [
              {
                weight: args.armSX,
                points: [
                  {},
                  {
                    x: args['lowerArmX' + nrName],
                    y: args['lowerArmY' + nrName],
                  },
                ],
              },

              // Shirt
              this.shirt && {
                s: { add: [args.handSX] },
                minX: 2,
                x: [
                  args['lowerArmX' + nrName],
                  renderFromRight ? args.handHalfNegSX : { a: 0 },
                ],
                y: [args['lowerArmY' + nrName]],
                color: this.shirtColor.get(),
                list: [
                  {
                    fY: fullAngle < 90 && fullAngle > -90,
                    fX: fullAngle > 0,
                    x:
                      (fullAngle < 22.5 && fullAngle > -22.5) ||
                      fullAngle > 157.5 ||
                      fullAngle < -157.5
                        ? 0
                        : 1,
                    y:
                      (fullAngle > 67.5 && fullAngle < 112.5) ||
                      (fullAngle < -67.5 && fullAngle > -112.5)
                        ? 0
                        : 1,
                  },
                ],
              },

              // Hand
              {
                s: args.handSX,
                x: [args['lowerArmX' + nrName], args.handHalfNegSX],
                y: [args['lowerArmY' + nrName], args.handHalfNegSX],
                color: this.skinColor.get(),
                rX: fullAngle < 0,
                rotate:
                  (fullAngle > 45
                    ? fullAngle < 135
                      ? -90
                      : -180
                    : fullAngle < -45
                      ? fullAngle > -135
                        ? 90
                        : 180
                      : 0) * (renderFromRight ? -1 : 1),
                list: [
                  {},

                  // Finger
                  !tool &&
                    finger && {
                      sX: 1,
                      sY: {
                        r: 1.5,
                        a: 1,
                        max: {
                          r: 0.15,
                          useSize: args.personHalfSX,
                        },
                      },
                      fX: true,
                    },

                  // Tool
                  (!args.demo || args.tool) && tool && tool.draw(args, 100),

                  (rightSide || otherHand) &&
                    args.hatDown &&
                    !tool &&
                    this.headGear && {
                      rY: true,
                      list: [
                        this.headGear.draw(args, 100),
                        !args.sideView && {
                          tX: true,
                          rX: true,
                          x: 1,
                          list: [this.headGear.draw(args, 100)],
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

export default Arm
