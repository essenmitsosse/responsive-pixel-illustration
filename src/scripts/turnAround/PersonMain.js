import BBObj from './BBObj'
import BodyMain from './BodyMain'
import Head from './Head'
import Neck from './Neck'

const PersonMain = function (args) {
  // Sizes and Forms
  this._headSY = this.R(0.1, 0.4)

  // Colors
  const color = this.GR(1, 6)

  this.color = args.color = this['c' + color]

  this.colorDark = args.colorDark = this['c' + color + 'D']

  // Assets
  this.head = new Head(args)

  this.neck = new Neck(args)

  this.bodyMain = new BodyMain(args)
}
// End PersonMain

PersonMain.prototype = new BBObj()

PersonMain.prototype.draw = function (args) {
  this.ll.push((this.headSY = { r: this._headSY, useSize: args.sY }))

  this.ll.push((this.neckSY = { a: 5 }))

  this.ll.push(
    (this.bodySY = [
      args.sY,
      { r: -1, useSize: this.headSY },
      { r: -1, useSize: this.neckSY },
      1,
    ]),
  )

  let head = this.head.draw({
    sY: this.headSY,
    rotate: args.rotate,
  })

  const bodyMain = this.bodyMain.draw({
    sX: args.sX,
    sY: this.bodySY,
    rotate: args.rotate,
    fY: true,
  })

  this.ll.push(
    (this.neckSX = {
      r: 0.5,
      useSize: head.sX,
      max: { r: 0.5, useSize: bodyMain.chest.sX },
    }),
  )

  this.headXSide = 1

  head = this.mover(head, {
    sXBase: bodyMain.chest.sX,
    xBase: this.headXSide,
    xRel: this.headXSide,
    xAdd: bodyMain.chest.x,
    y: 5,
    z: 100,
  })

  return {
    color: this.color,
    sY: args.sY,
    sX: args.sX,
    cX: true,
    fY: true,
    list: [head.get, bodyMain.get],
  }
}

export default PersonMain
