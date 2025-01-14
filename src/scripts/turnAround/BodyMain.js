import BBObj from './BBObj'
import Chest from './Chest'
import LowerBody from './LowerBody'
import Rotater from './Rotator'

const BodyMain = function (args) {
  // Forms & Sizes
  this._sX = this.R(0.4, 1)

  this._chestSY = this.R(0.1, 0.3)

  this.chestSX = this.GR(-1, 1)

  this.torsoSide = this.R(0.5, 1.5)

  this.chestSideSX = this.R(0.8, 1.2)

  this.chestFrontSX = this.R(0.8, 1.2)

  // Colors
  this.color = args.color

  this.colorDark = args.colorDark

  // Assets
  this.chest = new Chest(args)

  this.lowerBody = new LowerBody(args)
}
// End BodyMain

BodyMain.prototype = new BBObj()

BodyMain.prototype.draw = function (args) {
  this.ll.push((this.sX = { r: this._sX, useSize: args.sY }))

  this.ll.push((this.chestSY = { r: this._chestSY, useSize: args.sY }))

  this.ll.push((this.lowerBodySY = [args.sY, { r: -1, useSize: this.chestSY }]))

  let lowerBody = new Rotater({
    drawer: this.lowerBody,
    id: 'lowerBody',
    rotate: args.rotate,
    baseSX: this.sX,
    sideSX: this.torsoSide,
    sY: this.lowerBodySY,
    fY: true,
    z: 20,
  }).result

  const chest = new Rotater({
    drawer: this.chest,
    id: 'chest',
    rotate: args.rotate,
    baseSX: this.sX,
    sideSX: this.chestSideSX,
    frontSX: this.chestFrontSX,
    sY: this.chestSY,
    z: 40,
  }).result

  lowerBody = this.mover(lowerBody, {
    xRel: 0,
    max: { a: 2 },
  })

  return {
    get: {
      sY: args.sY,
      fY: args.fY,
      z: args.z,
      list: [chest.get, lowerBody.get],
    },
    chest,
    lowerBody,
  }
}

export default BodyMain
