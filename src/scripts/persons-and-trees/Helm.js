import Object from './Object'

const Helm = function (args) {
  // Form & Sizes
  this.helmSY = this.IF(0.5) ? 1 : this.R(0.1, 1.5)

  this.nosePiece = this.IF(0.5)

  this.topDetail = this.IF(0.3)

  this.foreheadDetail = this.IF(0.3)

  this.bottomDetail = this.IF(0.3)

  this.sides = this.IF(0.8)

  this.full = this.sides && this.IF(0.1)

  this.foreheadDetailGap = this.GR(0, 3)

  this.foreheadDetailSX = this.GR(0, 3)

  this.foreheadDetailSY = this.R(0.1, 0.5)

  // Colors
  this.helmColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: this.IF(0.8) ? -2 : 0,
  })

  this.helmDetailColor = this.helmColor.copy({ brContrast: -1 })

  // Assets
  this.horns = this.IF(0.1) && new this.basic.Horns(args)
}
// END Helm

Helm.prototype = new Object()

Helm.prototype.draw = function (args) {
  // if( args.calc ) {
  // 	args.hatDepthY = this.pushLinkList( );
  // }

  return {
    color: this.helmColor.get(),
    id: 'hat' + args.nr,
    z: 160,
    y: -1,
    cX: args.sideView,
    sY: [{ r: this.helmSY, useSize: args.headMaxSY }, 2],
    sX: args.hairSX,
    list: [
      {
        list: [
          !args.sideView &&
            this.sides && {
              color: !args.backView && this.helmDetailColor.get(),
              z: -1000,
            },

          // Horns
          this.horns && this.horns.draw(args),

          // Top Detail
          this.topDetail && {
            tY: true,
            sX: { r: 0.2, min: 1 },
            sY: 1,
            cX: args.sideView,
            color: this.helmDetailColor.get(),
          },

          // Top Part
          { sY: { r: 1, max: args.foreheadSY } },

          // Sides
          this.sides && {
            sX: { a: args.eyeOutX, min: 1 },
            fX: true,
            list: this.bottomDetail && [
              {},
              {
                fY: true,
                y: 1,
                sY: 2,
                color: this.helmDetailColor.get(),
              },
            ],
          },

          // Full
          this.full && {
            y: [args.foreheadSY, args.eyeSY, 1],
            sY: args.mouthTopMaxY,
          },

          // Nose Piece
          this.nosePiece && {
            z: 5,
            sX: {
              r: 0.2,
              useSize: args.headSX,
              max: args.eyeX,
              min: [args.eyeX, -1],
            },
            sY: [args.foreheadSY, args.eyeSY, 2],
          },

          args.backView && {},
        ],
      },

      this.foreheadDetail && {
        sY: {
          r: this.foreheadDetailSY,
          useSize: args.foreheadSY,
          min: 1,
          save: 'helmDetailSX' + args.nr,
        },
        y: {
          r: 0.7,
          a: -1,
          useSize: args.foreheadSY,
          min: { a: 0 },
          max: {
            r: -1.2,
            useSize: args.helmDetailSX,
            a: args.foreheadSY,
          },
        },
        color: this.helmDetailColor.get(),
        stripes: {
          gap: this.foreheadDetailGap,
          strip: this.foreheadDetailSX,
        },
      },
    ],
  }
}

export default Helm
