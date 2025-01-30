import Object from './Object'

const Buttons = function (args, color) {
  // Form & Sizes
  this.buttonSX = this.R(-0.2, 0.2)

  this.zipper = this.IF(0.1)

  this.buttonSY = !this.zipper && this.R(-0.1, 0.1)

  this.buttonGapSY = !this.zipper && this.R(-0.1, 0.1)

  // Colors
  this.buttonsColor = color.copy({ brContrast: -1 })

  // Assets
}
// END Buttons

Buttons.prototype = new Object()

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
