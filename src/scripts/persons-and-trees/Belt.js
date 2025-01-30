const Belt = function (args, state) {
  // Form & Sizes
  this.beltSY = state.R(0.1, 0.7)

  this.buckle = state.IF(0.5)

  this.buckleSX = state.R(-0.3, 1)

  this.strips = state.IF(0.3)

  // Colors
  this.beltColor = args.beltColor || args.pantsColor.copy({ brContrast: -1 })

  if (this.buckle) {
    this.buckleColor = this.beltColor.copy({
      brContrast: state.IF(0.5) ? -1 : 2,
    })
  }

  if (this.strips) {
    this.pantsColor = args.skirt ? args.skirtColor : args.pantsColor
  }

  // Assets
}
// END Belt

Belt.prototype.draw = function (args, z) {
  return {
    z: z + 115,
    sY: {
      r: this.beltSY,
      useSize: args.crotchSY,
      a: 1,
      max: { r: 1.4, useSize: args.legSX, max: [args.crotchSY, -1] },
    },
    color: this.beltColor.get(),
    list: [
      {},
      this.strips && {
        color: this.pantsColor.get(),
        sX: { r: 0.13, max: 2 },
        x: { r: 0.3 },
        fX: true,
      },
      !args.backView &&
        this.buckle && {
          color: this.buckleColor.get(),
          sX: {
            r: this.buckleSX * (args.sideView ? 0.5 : 1),
            min: {
              r: 1,
              otherDim: true,
              max: { r: 0.8, a: -1, otherDim: true },
            },
          },
        },
    ],
  }
}

export default Belt
