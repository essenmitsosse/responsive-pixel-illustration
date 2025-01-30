import Logo from './Logo'
import Object from './Object'

const Shield = function (args, right) {
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
    this.logo = new Logo(
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

  args['shieldSX' + nrName] = this.pushLinkList({
    r: this.shieldSX,
    useSize: args.personHalfSX,
    min: 1,
  })

  args['shieldSY' + nrName] = this.pushLinkList({
    r: this.shieldSY,
    useSize: args.personHalfSX,
    min: 1,
  })

  return {
    color: this.shieldColor.get(),
    z: z + 800,
    sX: args['shieldSX' + nrName],
    sY: args['shieldSY' + nrName],
    cX: true,
    cY: true,
    id: args['shield' + nrName],
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

      {
        sX: { r: 0.5 },
        rX: true,
        list: logo,
      },
      {
        sX: { r: 0.5 },
        fX: true,
        list: logo,
      },
    ],
  }
}

export default Shield
