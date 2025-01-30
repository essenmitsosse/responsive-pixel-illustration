const Buttons = function (args, state, color) {
  // Form & Sizes
  this.buttonSX = state.R(-0.2, 0.2)

  this.zipper = state.IF(0.1)

  this.buttonSY = !this.zipper && state.R(-0.1, 0.1)

  this.buttonGapSY = !this.zipper && state.R(-0.1, 0.1)

  // Colors
  this.buttonsColor = color.copy({ brContrast: -1 })

  // Assets
}
// END Buttons

Buttons.prototype.draw = function (args, z) {
  return (
    !args.backView && {
      sX: { r: this.buttonSX, useSize: args.chestSX, min: 1 },
      fY: true,
      cX: args.sideView,
      color: this.buttonsColor.get(),
      z,
      // rX: args.sideView && args.right,
      list: !this.zipper && [
        {
          stripes: {
            gap: {
              r: this.buttonGapSY,
              useSize: args.upperBodySY,
              min: 1,
            },
            horizontal: true,
            strip: {
              r: this.buttonSY,
              useSize: args.upperBodySY,
              min: 1,
            },
          },
        },
      ],
    }
  )
}

export default Buttons
