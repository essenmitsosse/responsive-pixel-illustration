import { mult, sub } from '@/renderengine/helper'

import { Object } from './object.js'

// ARM --------------------------------------------------------------------------------
export const Arm = function (args) {
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
    new (this.IF(0.5) ? this.basic.Shield : this.basic.Sword)(args)

  this.toolRight =
    !args.demo &&
    this.IF(0.1) &&
    new (this.IF(0.5) ? this.basic.Shield : this.basic.Sword)(args, true)

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
    this.vL['armSX' + args.nr] = {
      r: this.armSX,
      useSize: 'personHalfSX' + args.nr,
      min: 1,
    }

    this.vL['armSY' + args.nr] = {
      r: this.armSY,
      useSize: 'fullBodySY' + args.nr,
    }

    this.vL['shoulderSX' + args.nr] = ['armSX' + args.nr]

    this.vL['shoulderSY' + args.nr] = {
      r: 1,
      useSize: 'armSX' + args.nr,
      min: 1,
      max: 'chestSY' + args.nr,
    }

    this.vL['shoulderFullSX' + args.nr] = [
      mult(args.sideView ? 2 : 1, 'shoulderSX' + args.nr),
      'chestSX' + args.nr,
    ]

    this.vL['handSX' + args.nr] = {
      add: ['armSX' + args.nr, 1],
      min: 1,
      max: { r: 0.1, useSize: 'personHalfSX' + args.nr },
    }

    this.vL['handHalfNegSX' + args.nr] = {
      r: -0.5,
      useSize: 'handSX' + args.nr,
    }

    this.vL['upperArmSY' + args.nr] = {
      r: this.upperArmSY,
      useSize: 'armSY' + args.nr,
    }

    this.vL['lowerArmSY' + args.nr] = [
      'armSY' + args.nr,
      sub('upperArmSY' + args.nr),
    ]

    if (this.sleeves) {
      if (!this.fullUpper) {
        this.vL['upperSleeveSY' + args.nr] = {
          r: this.upperSleeveSY,
          useSize: 'armSY' + args.nr,
        }
      } else {
        this.vL['lowerSleeveSY' + args.nr] = {
          r: this.lowerSleeveSY,
          useSize: 'armSY' + args.nr,
        }
      }
    }
  }

  this.vL['armHalfSX' + nrName] = {
    r: renderFromRight ? 0.49 : 0.51,
    useSize: 'armSX' + args.nr,
    max: {
      r: 0.22,
      useSize: 'upperBodySX' + args.nr,
      a: renderFromRight ? -1 : 0,
    },
  }

  this.vL['upperArmX' + nrName] = {
    r: Math.sin(shoulderAngle),
    useSize: 'upperArmSY' + args.nr,
  }

  this.vL['upperArmY' + nrName] = {
    r: Math.cos(shoulderAngle),
    useSize: 'upperArmSY' + args.nr,
  }

  this.vL['lowerArmX' + nrName] = {
    r: Math.sin(armAngle),
    useSize: 'lowerArmSY' + args.nr,
  }

  this.vL['lowerArmY' + nrName] = {
    r: Math.cos(armAngle),
    useSize: 'lowerArmSY' + args.nr,
  }

  if (this.sleeves) {
    if (!this.fullUpper) {
      this.vL['upperSleeveX' + nrName] = {
        r: Math.sin(shoulderAngle),
        useSize: 'upperSleeveSY' + args.nr,
      }

      this.vL['upperSleeveY' + nrName] = {
        r: Math.cos(shoulderAngle),
        useSize: 'upperSleeveSY' + args.nr,
      }
    } else {
      this.vL['lowerSleeveX' + nrName] = {
        r: Math.sin(armAngle),
        useSize: 'lowerSleeveSY' + args.nr,
      }

      this.vL['lowerSleeveY' + nrName] = {
        r: Math.cos(armAngle),
        useSize: 'lowerSleeveSY' + args.nr,
      }
    }
  }

  return {
    sX: 'shoulderSX' + args.nr,
    sY: 'armSY' + args.nr,
    tX: true,
    fX: !behind,
    rX: behind,
    id: 'shoulder' + nrName,
    color: this.vest
      ? this.shirtColor.get()
      : !this.sleeves && this.skinColor.get(),
    z: 1000,
    list: [
      // Shoulder
      {
        sX: 'shoulderSX' + args.nr,
        sY: 'shoulderSY' + args.nr,
        z: upperZ,
      },

      this.shoulderPad && this.shoulderPad.draw(args, 10),

      // // Turn Checkers
      // { 	s:5, z:1000000, color:args.right ? [0,255,0] : [255,0,0], tX:true, fX:true, list:[ {},
      // 		{
      // 			s:1,
      // 			color:[0,0,0],
      // 			fY:fullAngle < 90 && fullAngle > -90,
      // 			fX:fullAngle > 0,
      // 			cX:( fullAngle < 22.5 && fullAngle > -22.5 ) || ( fullAngle > 157.5 || fullAngle < -157.5 ),
      // 			cY:( fullAngle > 67.5 && fullAngle < 112.5 ) || ( fullAngle < -67.5 && fullAngle > -112.5 )
      // 		}
      // ]},
      // { 	s:5, x:5, z:1000000, color:args.right ? [0,150,0] : [150,0,0], tX:true, fX:true,
      // 	rotate: ( fullAngle > 45 ?
      // 		fullAngle < 135 ?
      // 			-90
      // 			: -180
      // 		: fullAngle < -45 ?
      // 			fullAngle > -135 ?
      // 				90
      // 				: 180
      // 			: 0 ) * ( renderFromRight ? -1 : 1 ),
      // 	list:[
      // 		{},
      // 		{
      // 			fY:true,
      // 			cX:true,
      // 			s:1,
      // 			color:[0,0,0],
      // 		}
      // ]},

      {
        fX: true,
        x: {
          add: [sub('armHalfSX' + nrName)],
          a: renderFromRight && -1,
        },
        y: [mult(0.49, 'armSX' + args.nr)],
        list: [
          // Upper Arm
          {
            list: [
              {
                z: upperZ,
                weight: 'armSX' + args.nr,
                points: [
                  {},
                  {
                    x: 'upperArmX' + nrName,
                    y: 'upperArmY' + nrName,
                  },
                ],
              },
            ],
          },

          // // Upper Sleeve
          // this.sleeves && !this.fullUpper && {
          // 	z:upperZ,
          // 	weight:"armSX"+nr,
          // 	color:[255,0,0],
          // 	points:[
          // 		{ },
          // 		{ x:"upperSleeveX"+nrName, y:"upperSleeveY"+nrName }
          // 	]
          // },

          // Lower Arm
          {
            x: 'upperArmX' + nrName,
            y: 'upperArmY' + nrName,
            z: 800,
            list: [
              {
                weight: 'armSX' + args.nr,
                points: [
                  {},
                  {
                    x: 'lowerArmX' + nrName,
                    y: 'lowerArmY' + nrName,
                  },
                ],
              },

              // Shirt
              this.shirt && {
                s: { a: 'handSX' + args.nr },
                minX: 2,
                x: [
                  'lowerArmX' + nrName,
                  renderFromRight ? 'handHalfNegSX' + args.nr : { a: 0 },
                ],
                y: ['lowerArmY' + nrName],
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
                s: 'handSX' + args.nr,
                x: ['lowerArmX' + nrName, 'handHalfNegSX' + args.nr],
                y: ['lowerArmY' + nrName, 'handHalfNegSX' + args.nr],
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
                          useSize: 'personHalfSX' + args.nr,
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
// END Arm draw

// SHOULDER PAD --------------------------------------------------------------------------------
export const ShoulderPad = function (args) {
  // Form & Sizes
  this.X = this.R(-1, 0)

  this.Y = this.R(-1, 0.5)

  this.SX = this.R(0.1, 0.4)

  this.SY = this.R(1, 3)

  this.roundTop = this.IF(0.5)

  this.roundBottom = this.IF()

  this.roundInner = this.IF(0.3)

  this.border = this.IF(0.5)

  this.deko = this.IF(0.2)

  this.topDetail = this.IF(0.2)

  if (this.topDetail) {
    this.topDetailStrip = this.IF(0.2)

    this.topDetailX = !this.topDetailStrip && this.R(0, 1)

    this.topDetailSY = this.R(0, 1)
  }

  // Colors
  this.shoulderPadColor = this.IF()
    ? args.clothColor
    : this.IF()
      ? args.secondColor.copy({ brContrast: 1, max: 4 })
      : args.clothColor.copy({ brContrast: -1, max: 4 })

  this.shoulderPadDetailColor = this.IF()
    ? args.clothColor
    : this.IF()
      ? args.secondColor.copy({ brContrast: 2, max: 4 })
      : this.shoulderPadColor.copy({ brContrast: -1, max: 4 })

  if (this.deko || this.topDetail) {
    this.dekoColor = (
      this.IF(0.5) ? this.shoulderPadColor : args.secondColor
    ).copy({ brContrast: 2, max: 4 })

    this.dekoShadowColor = this.dekoColor.copy({
      brContrast: -1,
      max: 4,
    })
  }

  // Assets
}
// END ShoulderPad

ShoulderPad.prototype = new Object()

ShoulderPad.prototype.draw = function (args, z) {
  return {
    sX: {
      r: this.SX,
      useSize: 'personHalfSX' + args.nr,
      min: 'armSX' + args.nr,
      save: 'shoulderPadSX' + args.nr,
    },
    sY: {
      r: this.SY,
      useSize: 'armSX' + args.nr,
      min: { r: 0.2, useSize: 'shoulderPadSX' + args.nr },
    },
    y: { r: this.Y, useSize: 'armSX' + args.nr, max: { a: 0 } },
    x: { r: this.X, useSize: 'trapSX' + args.nr },
    id: 'shoulderPad' + args.nr,
    z,
    color: this.shoulderPadColor.get(),
    // rX:sideView && args.right,
    list: [
      this.roundInner && { name: 'Dot', clear: true },
      this.roundTop && { name: 'Dot', clear: true, fX: true },
      this.roundBottom && {
        name: 'Dot',
        clear: true,
        fX: true,
        fY: true,
      },

      this.deko && {
        fY: true,
        tY: true,
        color: this.dekoColor.get(),
        sX: { r: 1, a: -1 },
        list: [
          {
            color: this.dekoShadowColor.get(),
          },
          {
            stripes: {
              gap: 1,
              random: 1,
            },
          },
        ],
      },

      // Main
      {},

      // Top Detail
      this.topDetail && {
        color: this.dekoColor.get(),
        tY: true,
        cX: this.topDetailStrip,
        fX: !this.topDetailStrip,
        sX: this.topDetailStrip
          ? { r: 1, a: -2 }
          : { r: 0.2, min: 1, save: 'shoulderPadDetailSX' + args.nr },
        sY: { r: this.topDetailSY },
        x: !this.topDetailStrip && {
          r: this.topDetailX,
          max: [
            'shoulderPadSX' + args.nr,
            sub('shoulderPadDetailSX' + args.nr),
          ],
        },
        y: 1,
        list: this.topDetailStrip
          ? [
              {
                stripes: {
                  gap: { r: 0.1, min: 1 },
                },
              },
            ]
          : [
              { name: 'Dot', clear: true },
              { name: 'Dot', fX: true, clear: true },
              {},
            ],
      },

      // Border
      this.border && {
        fY: true,
        sY: 1,
        color: this.shoulderPadDetailColor.get(),
      },
    ],
  }
}
// END ShoulderPad draw

// TOOL --------------------------------------------------------------------------------
export const Tool = function () {
  // Form & Sizes
  // Assets
}
// END Tool

Tool.prototype = new Object()

Tool.prototype.draw = function (args) {
  return {
    s: 'armSX' + args.nr,
    fY: true,
    // rX:sideView && args.right,
    list: [
      // { cX:true, sX:{r:1.5, useSize:"personHalfSX"+nr}, color:[0,0,255], list:[
      // 	{},
      // 	{ color:[50,100,200], s:3, cY:true, fX:true }
      // ]}
    ],
  }
}
// END Tool draw

// SWORD --------------------------------------------------------------------------------
export const Sword = function (args, right) {
  // Form & Sizes
  this.rightSide = right

  this.bladeSY = this.R(0, 1.5)

  this.bladeSX = this.IF(0.1) ? this.R(0, 0.4) : this.R(0, 0.2)

  this.handleSX = this.R(0, 0.5)

  this.handleOtherSX = this.handleSX / 2 + this.R(-0.25, 0.25)

  this.noKnife = this.IF(0.5)

  this.crossGuard = this.IF(1.5)

  this.notRound = this.IF()

  this.bend = !this.notRound && this.IF()

  this.middleStrip = this.IF(0.5)

  // Color
  this.hiltColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: -1,
  })

  this.bladeColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: 1,
    max: 4,
  })

  this.bladeLightColor = this.bladeColor.copy({ brContrast: 1 })

  this.bladeShadowColor = this.bladeColor.copy({ brContrast: -1 })

  // Assets
}
// END Sword

Sword.prototype = new Object()

Sword.prototype.draw = function (args, z) {
  const name = this.rightSide ? 'right' : 'left'
  const nrName = name + args.nr

  this.vL['handleSY' + nrName] = { add: ['handSX' + args.nr, -2], min: 1 }

  this.vL['bladeSX' + nrName] = {
    r: this.bladeSY,
    useSize: 'personHalfSX' + args.nr,
    min: { r: 3, useSize: 'armSX' + args.nr },
  }

  this.vL['bladeSY' + nrName] = {
    r: this.bladeSX,
    useSize: 'personHalfSX' + args.nr,
    min: 'handleSY' + nrName,
  }

  this.vL['handleSX' + nrName] = {
    r: this.handleSX,
    useSize: 'personHalfSX' + args.nr,
  }

  this.vL['handleOtherSX' + nrName] = {
    r: this.handleOtherSX,
    useSize: 'personHalfSX' + args.nr,
    min: ['handSX' + args.nr, 1],
  }

  return {
    sY: 'handleSY' + nrName,
    z,
    cY: true,
    color: this.hiltColor.get(),
    id: 'tool' + nrName,
    list: [
      {
        sX: 'bladeSX' + nrName,
        sY: 'bladeSY' + nrName,
        cY: this.noKnife,
        x: 'handleSX' + nrName,
        color: this.bladeColor.get(),
        list: [
          !this.notRound && {
            sX: 3,
            minX: 3,
            fX: true,
            list: [
              !this.bend && { sY: 1, clear: true },
              { sY: 1, clear: true, fY: true },
            ],
          },
          !this.notRound && {
            minX: 3,
            mY: 1,
            sX: 1,
            fX: true,
            list: [
              !this.bend && { sY: 1, clear: true },
              { sY: 1, clear: true, fY: true },
            ],
          },

          {},
          this.middleStrip && {
            sY: { r: 0.25, max: 2 },
            mX: 1,
            cY: this.noKnife,
            color: this.bladeLightColor.get(),
            list: [
              { sY: { r: 1, max: 1 }, fY: true },
              {
                sY: { r: 1, max: 1 },
                color: this.bladeShadowColor.get(),
              },
            ],
          },
        ],
      },

      {
        sX: 'handleSX' + nrName,
      },
      {
        sX: 'handleOtherSX' + nrName,
        fX: true,
      },

      // Cross Guard
      this.crossGuard && {
        x: 'handleSX' + nrName,
        sX: 1,
        sY: { r: this.noKnife ? 1.2 : 1, useSize: 'bladeSY' + nrName },
        cY: this.noKnife,
      },
    ],
  }
}
// END Sword draw

// SHIELD --------------------------------------------------------------------------------
export const Shield = function (args, right) {
  // Form & Sizes
  this.name = right ? 'right' : 'left'

  this.shieldSX = this.IF() ? this.R(0.4, 0.8) : this.R(0, 0.4)

  this.shieldSY = this.IF() ? this.R(0.4, 0.8) : this.R(0, 0.4)

  if (this.IF()) {
    this.stripesGap = this.R(0.01, 0.2)

    this.stripesStrip = this.R(0.01, 0.2)
  }

  this.roundTop = this.IF(0.5)

  this.roundBottom = this.IF(0.5)

  // Colors
  this.shieldColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: this.IF() ? 1 : -1,
  })

  this.shieldShadowColor = this.shieldColor.copy({ brContrast: -1 })

  // Assets
  if (this.IF(1.1)) {
    this.logo = new this.basic.Logo(
      args,
      right,
      true,
      this.IF(0.1)
        ? this.shieldColor.copy({ nextColor: true, brContrast: 3 })
        : this.shieldShadowColor,
    )
  }
}
// END Shield

Shield.prototype = new Object()

Shield.prototype.draw = function (args, z) {
  const nrName = this.name + args.nr
  const logo = [this.logo.draw(args, z + 805)]

  this.vL['shieldSX' + nrName] = {
    r: this.shieldSX,
    useSize: 'personHalfSX' + args.nr,
    min: 1,
  }

  this.vL['shieldSY' + nrName] = {
    r: this.shieldSY,
    useSize: 'personHalfSX' + args.nr,
    min: 1,
  }

  return {
    color: this.shieldColor.get(),
    z: z + 800,
    sX: 'shieldSX' + nrName,
    sY: 'shieldSY' + nrName,
    cX: true,
    cY: true,
    id: 'shield' + nrName,
    list: [
      (this.roundTop || this.roundBottom) && {
        minY: 3,
        clear: true,
        list: [
          this.roundTop && { name: 'Dot' },
          this.roundTop && { name: 'Dot', fX: true },

          this.roundBottom && { name: 'Dot', fY: true },
          this.roundBottom && { name: 'Dot', fY: true, fX: true },
        ],
      },

      {},
      this.stripesGap && {
        color: this.shieldShadowColor.get(),
        stripes: {
          gap: { r: this.stripesGap },
          strip: { r: this.stripesStrip },
        },
      },

      logo && {
        sX: { r: 0.5 },
        rX: true,
        list: logo,
      },
      logo && {
        sX: { r: 0.5 },
        fX: true,
        list: logo,
      },
    ],
  }
}
// END Shield draw
