import { BBObj } from './object.js'

// HEAD MAIN  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const Head = function (args) {
  this.color = args.color || [255, 0, 0]
  this.colorDark = args.colorDark || [150, 0, 0]

  this._sX = this.R(0.4, 1.8)
  this.headSideRatio = this.R(0.5, 1.5)

  this.headTopFrontSX = this.R(0.5, 1.5)
  this.headTopSideSX = this.headTopFrontSX + this.R(-0.2, 0.2)

  this.wideJaw = this.headSideRatio > this.headTopSideSX

  this.headTopX = (this.wideJaw ? -1 : 1) * this.R(0, 1)
  this.headTopSY = this.R(0.2, 0.8)

  this.headTop = new this.basic.HeadTop(args)
  this.headBottom = new this.basic.HeadBottom(args)
  this.nose = new this.basic.Nose(args)
} // End Head

Head.prototype = new BBObj()
Head.prototype.draw = function (args) {
  var rotate = args.rotate

  this.ll.push((this.sX = { r: this._sX, useSize: args.sY }))

  var headBottom = new this.basic.Rotater({
      drawer: this.headBottom,
      id: 'lowerHead',
      rotate: rotate,
      baseSX: this.sX,
      sideSX: this.headSideRatio,
      sY: { r: this.headTopSY, useSize: args.sY },
      fY: true,
      roundTop: true,
      roundBottom: true,
    }),
    headTop = new this.basic.Rotater({
      drawer: this.headTop,
      id: 'topHead',
      rotate: rotate,
      baseSX: this.sX,
      frontSX: this.headTopFrontSX,
      sideSX: this.headTopSideSX,
      sideBaseSX: headBottom.sX,
      sideX: this.headTopX,
      sY: { add: [{ r: -1, useSize: headBottom.sY }, args.sY, 2] },
      roundTop: true,
      roundBottom: true,
    }),
    nose = new this.basic.Rotater({
      drawer: this.nose,
      id: 'nose',
      rotate: rotate,
      baseSX: this.sX,
      frontSX: 0.1,
      sideSX: 0.5,
      sY: { a: 2 },
      y: [headTop.sY, -2],
      z: 500,
      side: {
        sXBase: (this.wideJaw ? headTop : headBottom).sX,
        xBase: 1,
        xRel: 1,
        xAdd: this.wideJaw && headTop.x,
      },
    })

  // this.ll.push(
  // 	sizes.headTopSY = { r:this.headTopSY, useSize:args.sY },
  // 	sizes.headBottomSY = [ { r:-1, useSize: sizes.headTopSY }, args.sY ]
  // );

  return {
    get: {
      color: this.color,
      sY: args.sY,
      list: [headTop.get, headBottom.get, nose.get],
    },
    headTop: headTop,
    headBottom: headBottom,
    nose: nose,
    sX: headBottom.sX,
    sY: args.sY,
    rotate: rotate,
  }
} // End Head Main Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// HEAD TOP - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const HeadTop = function (args) {
  this.color = args.color
  this.colorDark = args.colorDark

  this.eyeSYLeft = this.R(0.2, 0.9)
  this.eyeSYRight = this.IF(0.5)
    ? this.eyeSYLeft
    : this.eyeSYLeft + this.R(-0.1, 0.1)
} // End HeadTop

HeadTop.prototype = new BBObj()

HeadTop.prototype.draw = function (args, front, right) {
  return [
    { color: !front && this.colorDark },

    // HAIR TOP
    {
      color: this.black,
      sY: { r: 0.1 },
    },

    // HAIR SIDE
    {
      color: this.black,
      sX: front && { r: 0.2 },
      sY: { r: 0.9 },
      z: 5,
    },

    // EYE
    front && {
      color: this.white,
      sX: { r: 0.3, min: 1 },
      sY: {
        r: right ? this.eyeSYRight : this.eyeSYLeft,
        min: 1,
        max: { r: 1, a: -3 },
      },
      x: { r: 0.1, min: { a: 1, max: { r: 0.2 } } },
      y: { r: 0.1, min: 2 },
      fX: true,
      fY: true,
      z: 10,
      id: 'eye' + this.suffix,
      list: [
        {},
        {
          color: this.black,
          sX: { r: 0.6 },
          sY: { r: 0.7 },
          fX: true,
          fY: true,
        },
      ],
    },
  ]
} // End Head Top Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// HEAD BOTTOM - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const HeadBottom = function (args) {
  this.color = args.color
  this.colorDark = args.colorDark
} // End Head Bottom

HeadBottom.prototype = new BBObj()

HeadBottom.prototype.draw = function (args, front) {
  return [
    { color: !front && this.colorDark },

    // MOUTH
    front && {
      color: this.black,
      sX: { r: 0.6 },
      y: { r: 0.2, min: 1 },
      fY: true,
      fX: true,
      sY: 1,
    },

    // // BEARD
    // front && {
    // 	fY:true,
    // 	tY:true,
    // 	y:1,
    // 	z:100,
    // 	id:"beard",
    // 	color:this.black,
    // },
  ]
} // End Head Bottom Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// NOSE MAIN  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const Nose = function (args) {
  this.color = args.color
  this.colorDark = args.colorDark
} // End Nose

Nose.prototype = new BBObj()
Nose.prototype.draw = function (args, front) {
  return [
    {
      color: this.colorDark,
      sY: !front && { r: 1, a: 1 },
      fY: true,
    },
  ]
} // End Nose Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// NECK MAIN  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const Neck = function (args) {
  this.color = args.color
  this.colorDark = args.colorDark
} // End Neck

Neck.prototype = new BBObj()
Neck.prototype.draw = function () {
  return [
    {
      color: this.colorDark,
    },
  ]
} // End Neck Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
