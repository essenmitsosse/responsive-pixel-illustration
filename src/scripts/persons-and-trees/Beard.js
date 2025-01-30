import Object from './Object'

const Beard = function (args) {
  // Form & Sizes
  this.threeOClockShadow = this.IF(0.1)

  this.mainBeard = this.IF(0.5)

  this.mustach = !this.mainBeard || this.IF(0.8)

  this.goate = this.mustach && this.IF(this.mainBeard ? 0.8 : 0.05)

  this.mustachGap = this.mustach && this.IF(0.5)

  this.beardColor = args.hairColor

  this.chinBard = this.IF(0.05)

  this.beardLength = this.R(0.2, 1.5)

  this.detailSY = this.R(0, 0.25)

  this.detailChance = this.R(0, 0.5)

  // Color
  if (this.threeOClockShadow) {
    this.skinShadowColor = args.skinShadowColor.copy({ min: 1 })
  }

  this.hairDetailColor = args.hairDetailColor

  // Assets
}
// END Beard

Beard.prototype = new Object()

Beard.prototype.draw = function (args) {
  if (args.calc) {
    args.beardDetailSY = this.pushLinkList({
      r: this.detailSY,
      useSize: args.headMinSY,
      min: 1,
    })
  }

  return {
    color: this.beardColor.get(),
    id: 'beard' + args.nr,
    z: args.backView && -100,
    list: [
      // 3 O’Clock Shadow
      this.threeOClockShadow && {
        id: 'head' + args.nr,
        sY: args.mouthTopY,
        fY: true,
        color: this.skinShadowColor.get(),
      },

      // Beard Detail
      this.mainBeard && { use: 'beard' + args.nr },

      this.mainBeard && {
        use: 'beard' + args.nr,
        color: this.hairDetailColor.get(),
        chance: this.detailChance,
        sY: { a: args.beardDetailSY, random: args.beardDetailSY },
        mask: true,
      },

      // Mustach
      this.mustach && {
        sY: { r: 0.6, useSize: args.eyeY },
        sX: [args.mouthSX, 1],
        fY: true,
        y: args.mouthTopY,
        x: this.mustachGap && 1,
        stripes: { horizontal: true, change: -1 },
      },

      // Goate
      this.goate && {
        sX: { r: 0.2 },
        sY: args.mouthTopY,
        fY: true,
        x: [
          args.mouthSX,
          this.mustachGap ? { r: 0.1, useSize: args.headSX, max: 1 } : { a: 0 },
        ],
      },

      // Main Beard
      this.mainBeard && {
        fY: true,
        tY: true,
        id: 'beard' + args.nr,
        y: [args.mouthY, -1],
        sY: { r: this.beardLength, useSize: args.headMaxSY },
        sX: { r: (args.sideView ? 0.5 : 1) * (this.chinBard ? 0.5 : 1) },
        list: [
          {
            y: -1,
            sY: 2,
          },

          {
            stripes: {
              change: { r: -0.5 },
              random: { r: -0.3, a: 2, max: { a: 0 } },
              seed: args.id + (args.right ? 1 : 0) * 2,
            },
            save: 'beard' + args.nr,
          },
        ],
      },
    ],
  }
}

export default Beard
