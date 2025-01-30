import Buttons from './Buttons'

const Collar = function (args, state) {
  // Form & Sizes
  this.collarSY = state.R(0.1, 0.5)

  this.open = state.IF(0.2)

  this.tie = state.IF()

  this.fullTie = this.open || state.IF()

  this.scarf = !this.tie && state.IF(0.05)

  // Colors
  if (this.tie) {
    this.tieColor = args.clothColor.copy({ brSet: 0 })
  }

  this.shirtColor = args.shirtColor

  // Assets
  if (this.open && state.IF(0.3)) {
    this.buttons = new Buttons(args, state, this.shirtColor)
  }
}
// END Collar

Collar.prototype.draw = function (args, z) {
  return {
    z: 10,
    color: this.shirtColor.get(),
    sX: this.scarf
      ? { add: [args.headSX], max: args.chestSX }
      : [args.neckSX, args.sideView ? 2 : 1],
    sY: { r: this.collarSY, max: args.backView && 1 },
    cX: args.sideView,
    fX: !this.scarf && args.sideView,
    list: [
      this.scarf && { ty: true, sY: 2, y: -1, z: z + 100 },
      { sY: { r: 1, max: 2 } },
      {
        minY: 4,
        points: [{ y: 1 }, { y: 1, fX: true }, { fY: true }],
      },
      !args.backView &&
        this.open && {
          sX: { r: 0.5, min: 1 },
          sY: args.upperBodySY,
        },

      this.buttons && {
        sX: { r: 0.5, min: 1 },
        sY: args.upperBodySY,
        list: [this.buttons.draw(args, z)],
      },

      !args.backView &&
        this.tie && {
          sX: { r: 0.25, min: 1 },
          sY: this.fullTie && [args.upperBodySY, -1],
          minY: 4,
          id: 'tie' + args.nr,
          color: this.tieColor.get(),
          list: [{ name: 'Dot', fY: true, fX: true, clear: true }, {}],
        },
    ],
  }
}

export default Collar
