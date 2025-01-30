import { sub } from '@/helper/helperDim'

const Logo = function (args, state, right, symetrical, logoColor) {
  const color = !logoColor && state.IF(0.5)

  this.name = symetrical ? (right ? 'right' : 'left') : 'chest'

  // Form & Sizes
  this.sX = state.R(0, 1)

  this.sY = state.R(0, 1)

  this.Y = state.R(0, 0.5)

  this.oneSide = !symetrical && state.IF(0.1)

  if (this.oneSide) {
    this.side = state.IF(0.5)
  }

  this.roundUp = state.IF(0.3)

  this.roundDown = state.IF(0.3)

  this.dentUp = state.IF(0.3)

  this.dentDown = state.IF(0.3)

  this.stripUp = state.IF(0.1)

  this.stripDown = state.IF(0.1)

  this.stripSide = state.IF(0.1)

  this.edgeUp = state.IF(0.2)

  this.edgeDown = state.IF(0.2)

  // Color
  this.logoColor =
    logoColor ||
    args.clothColor.copy({
      nextColor: color,
      brSet:
        args.clothColor.getBr() +
        (state.IF(0.5) ? -1 : 1) * (!color || state.IF(0.2) ? 2 : 1),
    })
  // Assets
}
// END Logo

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
