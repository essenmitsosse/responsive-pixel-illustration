import Object from './Object'

const Stripes = function (args) {
  // Form & Sizes
  this.gap = this.R(0.05, 0.2)

  this.strip = this.R(0.05, 0.2)

  this.horizontal = this.IF(0.5)

  this.randomDots = this.IF(0.05)

  this.doted = !this.randomDots && this.IF(0.1)

  if (this.doted) {
    this.dotGap = this.R(0.05, 0.2)

    this.dotStrip = this.R(0.05, 0.2)
  }

  // Colors
  this.stripColor = (this.IF(0.5) ? args.secondColor : args.clothColor).copy({
    brSet: args.clothColor.getBr() - 1,
  })

  // Assets
}
// END Stripes

Stripes.prototype = new Object()

Stripes.prototype.draw = function (args, z) {
  return (
    (args.sideView || !args.right) && {
      fX: true,
      z,
      sX: !args.sideView && { r: 2, useSize: args.upperBodySX, a: -1 },
      color: this.stripColor.get(),
      stripes: !this.dots && {
        gap: { r: this.gap, useSize: args.upperBodySY },
        strip: { r: this.strip, useSize: args.upperBodySY },
        horizontal: this.horizontal,
      },
      list: this.randomDots
        ? [
            {
              use: args.shirt,
              chance: 0.5,
              sX: { r: this.gap, useSize: args.upperBodySY },
              sY: { r: this.strip, useSize: args.upperBodySY },
              mask: true,
            },
            { save: args.shirt },
          ]
        : this.doted && [
            {
              stripes: !this.dots && {
                gap: {
                  r: this.dotGap,
                  useSize: args.upperBodySY,
                },
                strip: {
                  r: this.dotStrip,
                  useSize: args.upperBodySY,
                },
                horizontal: !this.horizontal,
              },
            },
          ],
    }
  )
}

export default Stripes
