import { sub } from '@/helper/helper'

import { Object } from './object.js'

// PERSON --------------------------------------------------------------------------------
export const Person = function (args) {
  if (!args) {
    args = args || {}
  }

  // Assests
  this.basicBody = new this.basic.BasicBody(args)

  this.id = this.basic.objectCount += 1
}
// END Person

Person.prototype = new Object()

Person.prototype.draw = function (args, z) {
  args.nr = this.basic.objectCount += 1

  const backView = (args.backView = args.view === 'backView')
  const sideView = (args.sideView = !backView && args.view ? true : false)

  args.id = this.id

  if (!z) {
    z = this.basic.objectCount * 10000
  }

  args.personHalfSX = this.pushLinkList({
    r: 0.5,
    min: 5,
    useSize: args.size,
  })

  return sideView
    ? [{ list: this.basicBody.draw(args, args.view === 'rightView') }]
    : [
        {
          sX: args.personHalfSX,
          rX: true,
          list: this.basicBody.draw(args, !backView),
        },
        {
          sX: args.personHalfSX,
          x: [args.personHalfSX, -1],
          list: this.basicBody.draw(args, backView),
        },
      ]
}
// END Person draw

// BASICBODY --------------------------------------------------------------------------------
export const BasicBody = function (args) {
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
  this.skinColor = args.skinColor = new this.Color(hues[0], this.GR(1, 4))

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
  this.head = new this.basic.Head(args)

  this.upperBody = new this.basic.UpperBody(args)

  this.lowerBody = new this.basic.LowerBody(args)
}
// END BasicBody

BasicBody.prototype = new Object()

BasicBody.prototype.draw = function (args, right) {
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
// END BasicBody draw

// LOGO --------------------------------------------------------------------------------
export const Logo = function (args, right, symetrical, logoColor) {
  const color = !logoColor && this.IF(0.5)

  this.name = symetrical ? (right ? 'right' : 'left') : 'chest'

  // Form & Sizes
  this.sX = this.R(0, 1)

  this.sY = this.R(0, 1)

  this.Y = this.R(0, 0.5)

  this.oneSide = !symetrical && this.IF(0.1)

  if (this.oneSide) {
    this.side = this.IF(0.5)
  }

  this.roundUp = this.IF(0.3)

  this.roundDown = this.IF(0.3)

  this.dentUp = this.IF(0.3)

  this.dentDown = this.IF(0.3)

  this.stripUp = this.IF(0.1)

  this.stripDown = this.IF(0.1)

  this.stripSide = this.IF(0.1)

  this.edgeUp = this.IF(0.2)

  this.edgeDown = this.IF(0.2)

  // Color
  this.logoColor =
    logoColor ||
    args.clothColor.copy({
      nextColor: color,
      brSet:
        args.clothColor.getBr() +
        (this.IF(0.5) ? -1 : 1) * (!color || this.IF(0.2) ? 2 : 1),
    })
  // Assets
}
// END Logo

Logo.prototype = new Object()

Logo.prototype.draw = function (args) {
  const { nr } = args
  const nrName = nr + this.name
  const { sideView } = args

  return (
    (!this.oneSide || args.right === this.side) && {
      sX: { r: this.sX },
      sY: {
        r: this.sY,
        save: args['logoSY' + nrName],
        max: { r: 1, save: args['logoMaxSY' + nrName] },
      },
      y: {
        r: this.Y,
        max: [args['logoSY' + nrName], sub(args['logoSY' + nrName])],
      },
      cX: args.oneSide || sideView,
      color: this.logoColor.get(),
      id: args['logo' + nrName],
      z: 50,
      list: [
        this.roundUp && { fX: true, name: 'Dot', clear: true },
        this.roundDown && {
          fX: true,
          name: 'Dot',
          fY: true,
          clear: true,
        },
        this.dentUp && { name: 'Dot', clear: true },
        this.dentDown && { name: 'Dot', fY: true, clear: true },
        this.stripUp && { sY: 1, y: 1, clear: true },
        this.stripDown && { sY: 1, y: 1, fY: true, clear: true },
        this.stripSide && { sX: 1, x: 1, fX: true, clear: true },
        this.edgeUp && { sX: { r: 0.4 }, sY: { r: 0.4 }, clear: true },
        this.edgeDown && {
          sX: { r: 0.4 },
          sY: { r: 0.4 },
          fY: true,
          fX: true,
          clear: true,
        },
        {},
      ],
    }
  )
}
// END Logo Back draw
