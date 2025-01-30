const Hat = function (args, state) {
  // Form & Sizes
  this.hatSY = state.R(0, 1)

  this.smallHat = state.IF(0.05) && state.R(0.3, 1)

  this.getSmaller = state.IF()

  this.hatTopSX = this.getSmaller && state.R(-0.6, 1)

  this.roundHat = !this.getSmaller && state.IF(0.5)

  this.hatRim = state.IF(0.6)

  this.baseCap = this.hatRim && state.IF(0.1)

  this.thickRim = this.hatRim && state.IF(0.3)

  this.hatBand = state.IF(
    0.3 + (this.hatRim ? 0.3 : 0) + (this.baseCap ? -0.4 : 0),
  )

  this.dent = state.IF(
    0.2 + (this.hatRim ? 0.3 : 0) + (this.baseCap ? -0.49 : 0),
  )

  this.dentSX = this.dent && state.R(0, 0.5)

  this.hatDepthY = state.R(0.1, 1) * (this.smallHat || 1)

  this.hatRimSY = this.hatRim && state.R(1, 2)

  // Colors
  this.hatColor = args.hatColor

  this.hatBandColor =
    this.hatBand &&
    !this.baseCap &&
    (state.IF(0.5) ? args.firstColor : args.secondColor).copy({
      brContrast: -1,
    })

  this.hatRimColor = state.IF(this.baseCap ? 0.8 : 0.1)
    ? this.hatColor.copy({ nextColor: true, brContrast: -2 })
    : this.hatColor

  // Assets
}
// END Hat

Hat.prototype.draw = function (args) {
  // if( args.calc ) {
  // 	args.hatDepthY = state.pushLinkList( );
  // }

  return {
    color: this.hatColor.get(),
    tY: true,
    id: 'hat' + args.nr,
    z: 500,
    cX: args.sideView,
    fX: args.sideView,
    sY: {
      r: this.hatSY,
      useSize: args.headMinSY,
      min: [
        {
          r: this.hatDepthY,
          useSize: args.foreheadSY,
          min: 1,
          save: 'hatDepthY' + args.nr,
        },
        1,
      ],
    },
    sX: this.smallHat
      ? { r: this.smallHat, useSize: args.hairSX }
      : args.hairSX,
    y: !this.smallHat && args.hatDepthY,
    list: [
      // Dent
      !args.sideView &&
        this.dent && {
          sX: { r: this.dentSX * (this.hatTopSX || 1), min: 1 },
          clear: true,
          sY: 1,
        },

      // Rounding
      this.roundHat && { name: 'Dot', clear: true, fX: true },
      this.roundHat && args.sideView && { name: 'Dot', clear: true },

      // Hat Band
      this.hatBand &&
        (args.sideView || !this.baseCap) && {
          z: 10,
          sY: { r: 0.3, min: 2 },
          sX: this.baseCap && { r: 0.2 },
          fX: true,
          fY: true,
          clear: this.baseCap,
          color: this.hatBandColor && this.hatBandColor.get(),
        },

      this.getSmaller && { id: 'hair' + args.nr, clear: true },

      // Main Hat
      {
        points: this.getSmaller && [
          args.sideView
            ? { y: this.hatTopSX > 0 && args.hatDepthY, fY: true }
            : { y: -1 },
          args.sideView
            ? {
                x: { r: this.hatTopSX * (args.sideView ? 0.5 : 1) },
                y: -1,
              }
            : { y: -1 },
          {
            x: { r: this.hatTopSX * (args.sideView ? 0.5 : 1) },
            fX: true,
            y: -1,
          },
          {
            y: this.hatTopSX > 0 && args.hatDepthY,
            fY: true,
            fX: true,
          },
          { fY: true, fX: true },
          { fY: true },
        ],
      },

      // Rim
      this.hatRim && {
        id: 'hatRim' + args.nr,
        z: 20,
        sY: { a: this.thickRim ? 2 : 1, save: 'hatRim' + args.nr },
        sX: !this.baseCap
          ? { r: this.hatRimSY }
          : args.sideView
            ? { r: (this.hatRimSY - 1) / 2 + 1 }
            : undefined,
        cX: args.sideView && !this.baseCap,
        fX: args.sideView,
        fY: true,
        color: this.hatRimColor.get(),
      },
    ],
  }
}

export default Hat
