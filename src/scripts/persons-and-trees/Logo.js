import { sub } from '@/helper/helperDim'

import Object from './Object'

const Logo = function (args, right, symetrical, logoColor) {
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

export default Logo
