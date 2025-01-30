import { sub } from '@/helper/helperDim'

const ShoulderPad = function (args, state) {
  // Form & Sizes
  this.X = state.R(-1, 0)

  this.Y = state.R(-1, 0.5)

  this.SX = state.R(0.1, 0.4)

  this.SY = state.R(1, 3)

  this.roundTop = state.IF(0.5)

  this.roundBottom = state.IF()

  this.roundInner = state.IF(0.3)

  this.border = state.IF(0.5)

  this.deko = state.IF(0.2)

  this.topDetail = state.IF(0.2)

  if (this.topDetail) {
    this.topDetailStrip = state.IF(0.2)

    this.topDetailX = !this.topDetailStrip && state.R(0, 1)

    this.topDetailSY = state.R(0, 1)
  }

  // Colors
  this.shoulderPadColor = state.IF()
    ? args.clothColor
    : state.IF()
      ? args.secondColor.copy({ brContrast: 1, max: 4 })
      : args.clothColor.copy({ brContrast: -1, max: 4 })

  this.shoulderPadDetailColor = state.IF()
    ? args.clothColor
    : state.IF()
      ? args.secondColor.copy({ brContrast: 2, max: 4 })
      : this.shoulderPadColor.copy({ brContrast: -1, max: 4 })

  if (this.deko || this.topDetail) {
    this.dekoColor = (
      state.IF(0.5) ? this.shoulderPadColor : args.secondColor
    ).copy({ brContrast: 2, max: 4 })

    this.dekoShadowColor = this.dekoColor.copy({ brContrast: -1, max: 4 })
  }

  // Assets
}
// END ShoulderPad

ShoulderPad.prototype.draw = function (args, z) {
  return {
    sX: {
      r: this.SX,
      useSize: args.personHalfSX,
      min: args.armSX,
      save: args.shoulderPadSX,
    },
    sY: {
      r: this.SY,
      useSize: args.armSX,
      min: { r: 0.2, useSize: args.shoulderPadSX },
    },
    y: { r: this.Y, useSize: args.armSX, max: { a: 0 } },
    x: { r: this.X, useSize: args.trapSX },
    id: 'shoulderPad' + args.nr,
    z,
    color: this.shoulderPadColor.get(),
    // rX: sideView && args.right,
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
          : { r: 0.2, min: 1, save: args.shoulderPadDetailSX },
        sY: { r: this.topDetailSY },
        x: !this.topDetailStrip && {
          r: this.topDetailX,
          max: [args.shoulderPadSX, sub(args.shoulderPadDetailSX)],
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

export default ShoulderPad
