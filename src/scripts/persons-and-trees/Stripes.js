const Stripes = function (args, state) {
  // Form & Sizes
  this.gap = state.R(0.05, 0.2)

  this.strip = state.R(0.05, 0.2)

  this.horizontal = state.IF(0.5)

  this.randomDots = state.IF(0.05)

  this.doted = !this.randomDots && state.IF(0.1)

  if (this.doted) {
    this.dotGap = state.R(0.05, 0.2)

    this.dotStrip = state.R(0.05, 0.2)
  }

  // Colors
  this.stripColor = (state.IF(0.5) ? args.secondColor : args.clothColor).copy({
    brSet: args.clothColor.getBr() - 1,
  })

  // Assets
}
// END Stripes

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
