import { sub } from '@/helper/helperDim'

import BodyLower from './BodyLower'
import BodyUpper from './BodyUpper'
import Color from './Color'
import Head from './Head'
import Object from './Object'

const BodyBasic = function (args) {
  // var nextFirstColor = this.IF(0.5),
  // 	nextSecondColor = this.IF(0.2),

  const hues = [
    [0, 1, 2],
    [0, 2, 2],
    [0, 1, 1],
    [1, 0, 0],
    [2, 0, 1],
  ][this.GR(0, 4)]

  // Form & Sizes

  this.sY = this.IF() ? this.R(0.4, 1) : 1

  this.sX =
    (this.IF(0.1)
      ? this.R(0.3, 0.8)
      : this.IF(0.1)
        ? this.R(0.05, 0.15)
        : this.R(0.15, 0.3)) * this.sY

  this.lowerBodySY = this.IF(0.1) ? this.R(0.5, 0.9) : 0.7

  this.animal = args.animal = this.IF(0.02)

  // Color
  this.skinColor = args.skinColor = new Color(hues[0], this.GR(1, 4))

  this.firstColor = args.firstColor = args.skinColor.copy({
    nr: hues[1],
    brContrast: (this.IF(0.5) ? -1 : 1) * (this.IF(0.8) ? 1 : 2),
    min: this.IF() ? 0 : 1,
    max: 4,
  })

  this.secondColor = args.secondColor = args.skinColor.copy({
    nr: hues[2],
    brContrast: (this.IF(0.8) ? -1 : 1) * (hues[1] === hues[2] ? 1 : 2),
    max: 4,
  })

  this.skinShadowColor = args.skinShadowColor = args.skinColor.copy({
    brAdd: -1,
  })

  this.skinDetailColor = args.skinDetailColor = args.skinColor.copy({
    brAdd: -2,
  })

  this.groundShadowColor = args.groundShadowColor

  // console.log( args, this.skinColor, this.firstColor, this.secondColor );

  // Assets
  this.head = new Head(args)

  this.upperBody = new BodyUpper(args)

  this.lowerBody = new BodyLower(args)
}
// END BasicBody

BodyBasic.prototype = new Object()

BodyBasic.prototype.draw = function (args, right) {
  args.right = right

  args.calc = args.backView !== right || args.sideView

  if (args.calc) {
    args.basicSX = this.pushLinkList({ r: 0, useSize: args.personHalfSX })

    args.personSX = this.pushLinkList({
      r: this.sX,
      useSize: args.basicSX,
      a: 2,
    })

    args.basicSY = this.pushLinkList({ r: 0, useSize: args.size })

    args.personSY = this.pushLinkList({
      r: this.sY,
      min: 5,
      useSize: args.basicSY,
    })

    // this.hoverChangerStandard.push({
    // 	min: 0.1,
    // 	max: 1,
    // 	map: 	1,
    // 	variable: 	args.personSY
    // });

    this.hoverChangerStandard.push({
      min: 0.3,
      max: 1.7,
      map: 'body-width',
      variable: args.basicSX,
    })

    this.hoverChangerStandard.push({
      min: 0.1,
      max: 1,
      map: 'body-height',
      variable: args.basicSY,
    })
  }

  this.head.getSizes(args)

  if (args.calc) {
    args.bodyRestSY = this.pushLinkList({
      add: [args.personSY],
      max: [args.size, sub(args.headMaxSY), sub(args.neckSY)],
    })

    args.lowerBodySY = this.pushLinkList({
      r: this.lowerBodySY,
      useSize: args.bodyRestSY,
      min: 1,
    })

    args.upperBodySY = this.pushLinkList({
      add: [args.bodyRestSY, sub(args.lowerBodySY)],
      min: 1,
    })

    args.fullBodySY = this.pushLinkList({
      add: [args.lowerBodySY, args.upperBodySY],
    })

    args.personRealSX = this.pushLinkList({ add: [args.personSX] })

    args.personRealMaxSY = this.pushLinkList({
      add: [args.fullBodySY, args.headMaxSY, args.neckSY],
    })

    args.personRealMinSY = this.pushLinkList({
      add: [args.fullBodySY, args.headMinSY, args.neckSY],
    })

    this.hoverChangerStandard.push({
      min: 0.1,
      max: 1,
      map: 'leg-length',
      variable: args.lowerBodySY,
    })
  }

  return [
    {
      sY: args.personSY,
      cX: args.sideView,
      fY: true,
      rX: args.sideView && args.right,
      color: [200, 0, 0],
      list: [
        // Upper Body
        this.upperBody.draw(args),

        // LowerBody
        this.lowerBody.draw(args),

        // Head & Neck
        this.head.draw(args),

        // Shadow
        {
          color: this.groundShadowColor.get(),
          fY: true,
          tY: true,
          cX: args.sideView,
          y: 1,
          sY: 2,
          sX: args.shoulderFullSX,
          z: -1000,
        },
      ],
    },
  ]
}

export default BodyBasic
