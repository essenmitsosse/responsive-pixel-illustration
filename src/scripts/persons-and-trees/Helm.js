import Horns from './Horn'

const Helm = function (args, state) {
  // Form & Sizes
  this.helmSY = state.IF(0.5) ? 1 : state.R(0.1, 1.5)

  this.nosePiece = state.IF(0.5)

  this.topDetail = state.IF(0.3)

  this.foreheadDetail = state.IF(0.3)

  this.bottomDetail = state.IF(0.3)

  this.sides = state.IF(0.8)

  this.full = this.sides && state.IF(0.1)

  this.foreheadDetailGap = state.GR(0, 3)

  this.foreheadDetailSX = state.GR(0, 3)

  this.foreheadDetailSY = state.R(0.1, 0.5)

  // Colors
  this.helmColor = (state.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: state.IF(0.8) ? -2 : 0,
  })

  this.helmDetailColor = this.helmColor.copy({ brContrast: -1 })

  // Assets
  this.horns = state.IF(0.1) && new Horns(args, state)
}
// END Helm

Helm.prototype.draw = function (args) {
  // if( args.calc ) {
  // 	args.hatDepthY = state.pushLinkList( );
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
