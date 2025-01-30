const Horns = function (args, state) {
  // Form & Sizes
  this.hornsSX = state.R(0.05, 2)

  this.hornsSY = state.R(0.05, 0.3)

  this.hornsY = state.R(0.1, 0.25)

  this.hornsBendSY = state.R(0.1, 1)

  // Colors
  this.hornColor = state.IF() ? args.skinColor : args.hairColor

  // Assets
}
// END Horns

Horns.prototype.draw = function (args, z) {
  // if( args.calc ) {
  // 	args.hatDepthY = state.pushLinkList( );
  // }

  return {
    tX: !args.sideView || !this.ears,
    fX: true,
    z: z + (args.sideView ? 100 : 0),
    id: 'horns' + args.nr,
    color: this.hornColor.get(),
    sX: {
      r: this.hornsSX * (args.sideView ? 0.5 : 1),
      useSize: args.headSX,
      min: 1,
    },
    sY: { r: this.hornsSY, useSize: args.headMaxSY },
    x: args.sideView && {
      r: this.ears ? 0.3 : this.hornsSX * 0.3,
      useSize: args.headSX,
    },
    y: { r: this.hornsY, useSize: args.headMaxSY },
    list: [
      { name: 'Dot', clear: true, fX: true, fY: true },
      // bend
      {
        tY: true,
        fX: true,
        sX: { r: 1, a: -1, otherDim: true, min: 1 },
        sY: { r: this.hornsBendSY, otherDim: true },
        list: [{ name: 'Dot', clear: true, fX: true }, {}],
      },

      // Main Horn
      {},
    ],
  }
}

export default Horns
