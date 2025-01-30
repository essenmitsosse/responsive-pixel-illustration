const Hair = function (args, state) {
  this.state = state

  // Form & Sizes
  this.curly = args.headGear && state.IF()

  this.longHair = state.IF(0.1)

  this.hairSY = state.R(0.1, 1) * (this.longHair ? 3 : 1)

  this.hairSide = this.curly || state.IF(0.99)

  this.hairSideSY = 0.8

  this.hairAccuracy = state.R(0.1, 0.3)

  this.hairS = state.R(0.01, 0.1)

  this.detailSY = state.R(0, 0.25)

  this.detailChance = state.R(0, 0.5)

  // Colors
  this.hairColor = args.hairColor

  this.hairDetailColor = args.hairDetailColor

  // Assets
}
// END Hair

Hair.prototype.draw = function (args) {
  const rightSide = args.sideView || !args.right
  const name = args.id + '_' + args.right + args.nr

  if (args.calc) {
    args.hairS = this.state.pushLinkList({
      r: this.hairS,
      useSize: args.headMinSY,
      min: 1,
    })

    args.hairAccuracy = this.state.pushLinkList({
      r: this.hairAccuracy * -1,
      useSize: args.headMinSY,
      max: { a: 0 },
    })

    args.hairDetailSY = this.state.pushLinkList({
      r: this.detailSY,
      useSize: args.headMinSY,
      min: 1,
    })
  }

  return {
    color: this.hairColor.get(),
    sX: args.hairSX,
    cX: args.sideView,
    fX: args.sideView,
    z: 100,
    id: 'hair' + args.nr,
    list: [
      // Main Hair Front
      {
        use: 'hairFront' + name,
        cut: true,
      },

      // Main Hair Back
      {
        use: 'hairBack' + name,
        z: -1000,
        cut: true,
      },

      // Detail
      {
        minY: 6,
        list: [
          // Back
          {
            use: 'hairBack' + name,
            z: -1000,
            color: this.hairDetailColor.get(),
            chance: this.detailChance,
            sY: { a: args.hairDetailSY, random: args.hairDetailSY },
            mask: true,
          },
          // Front
          {
            use: 'hairFront' + name,
            color: this.hairDetailColor.get(),
            chance: this.detailChance,
            sY: { a: args.hairDetailSY, random: args.hairDetailSY },
            mask: true,
          },
        ],
      },

      // Top
      {
        save: 'hairFront' + name,
        sX: args.headSX,
        cX: args.sideView,
        sY: 1,
      },

      {
        sY: { r: 1, a: -1 },
        y: 1,
        list: [
          // ForeHead
          rightSide && {
            sX: !args.sideView && { r: 2, useSize: args.hairSX, a: -1 },
            sY: { r: 0.5, useSize: args.foreheadSY, a: -1 },
            fX: true,
            save: 'hairFront' + name,
            list: [
              {
                stripes: {
                  random: args.hairAccuracy,
                  seed: args.id + (args.right ? 1 : 0),
                  strip: args.hairS,
                },
              },
            ],
          },

          // Back Hair
          this.hairSide && {
            color: this.longHair ? [0, 100, 150] : [0, 130, 255],
            fX: true,
            sX: args.sideView
              ? { r: 0.5 }
              : { r: 2, useSize: args.hairSX, a: -1 },
            sY: {
              r: this.hairSY,
              useSize: args.headMinSY,
              min: args.hairSideSY,
              max: [args.personRealMinSY, -2],
            },
            list: [
              {
                save: (args.backView ? 'hairFront' : 'hairBack') + name,
                color: [255, 0, 0],
                stripes: {
                  random: args.hairAccuracy,
                  seed: args.id + (args.right ? 1 : 0),
                  strip: args.hairS,
                },
              },
            ],
          },

          // Side Hair
          this.hairSide && {
            sX: {
              r: args.sideView ? 0.8 : 0.6,
              useSize: args.eyeOutX,
              max: {
                r: args.sideView ? 0.9 : 0.15,
                useSize: args.headSX,
              },
            },
            sY: {
              r: this.hairSideSY,
              useSize: args.upperHeadSY,
              save: 'hairSideSY' + args.nr,
            },
            x: 1,
            fX: true,
            save: 'hairFront' + name,
            // color: [0,0,255],
            stripes: {
              random: args.sideView && args.hairAccuracy,
              strip: args.sideView && args.hairS,
              change: !args.sideView && { r: -0.3 },
              seed: args.id + (args.right ? 1 : 0),
            },
          },
        ],
      },
    ],
  }
}

export default Hair
