import { sub } from '@/helper/helperDim'

import Beard from './Beard'
import Eye from './Eye'
import Hair from './Hair'
import Hat from './Hat'
import HeadBand from './HeadBand'
import Helm from './Helm'
import Horns from './Horn'
import Mouth from './Mouth'

const Head = function (args, state) {
  this.state = state

  const hairNext = state.IF(0.7)

  // Form & Sizes
  this.headSY = state.IF(0.01) ? state.R(0, 0.4) : state.R(0.1, 0.15)

  if (args.demo && args.head) {
    this.headSY = args.head
  }

  this.neckSY = state.R(0.05, 0.2)

  this.neckSX = state.R(0.4, 0.9)

  this.headSX = state.R(0.1, 0.7)

  this.headSideSYFak = state.R(1.6, 2.4)

  this.lowerHeadSX = (state.IF(0.5) && state.R(0.8, 1.2)) || 1

  this.foreheadSY = state.R(0.1, 0.75)

  // Colors
  this.skinColor = args.skinColor

  this.skinShadowColor = args.skinShadowColor

  this.skinDetailColor = args.skinDetailColor

  this.hairColor = args.hairColor =
    args.animal || state.IF(0.1)
      ? args.skinColor.copy({
          brContrast: (state.IF(0.5) ? 2 : 1) * (state.IF(0.5) ? -1 : 1),
        })
      : args.skinColor.copy({
          nextColor: hairNext,
          prevColor: !hairNext,
          brContrast: -2,
        })

  this.hairDetailColor = args.hairDetailColor = args.hairColor.copy({
    brContrast: -1,
  })

  this.hatColor = args.hatColor = (
    state.IF(0.5) ? args.firstColor : args.secondColor
  ).copy({
    brAdd: state.IF(0.5) ? 0 : state.IF(0.7) ? -2 : 1,
  })

  // Assets
  this.eye = new Eye(args, state)

  this.mouth = new Mouth(args, state)

  this.beard = state.IF() && new Beard(args, state)

  this.headGear = args.headGear =
    (args.demo || state.IF(0.3)) &&
    new (state.IF(0.01)
      ? Horns
      : state.IF(0.2)
        ? Helm
        : state.IF(0.1)
          ? HeadBand
          : Hat)(args, state)

  this.hair = state.IF(0.9) && new Hair(args, state)
}
// END Head

Head.prototype.getSizes = function (args) {
  if (args.calc) {
    args.headBaseSY = this.state.pushLinkList({ r: 1, useSize: args.size })

    args.headMinSY = this.state.pushLinkList({
      r: this.headSY,
      useSize: args.headBaseSY,
      a: 1,
      min: 1,
    })

    args.headMinSX = this.state.pushLinkList({
      r: this.headSX,
      min: 1,
      useSize: args.headMinSY,
      a: 1.4,
    })

    args.neckSX = this.state.pushLinkList(
      args.sideView
        ? {
            add: [
              { r: -1 + this.neckSX, useSize: args.headMinSX },
              args.headMinSX,
            ],
            max: args.personSX,
            min: 1,
          }
        : {
            r: this.neckSX,
            useSize: args.headMinSX,
            max: args.personSX,
            min: 1,
          },
    )

    args.neckSY = this.state.pushLinkList({
      r: this.headSY * this.neckSY,
      useSize: args.size,
      a: -1,
      min: { a: 0 },
    })

    this.state.hoverChangerStandard.push({
      min: 0.3,
      max: 1.7,
      map: 'head-size',
      variable: args.headBaseSY,
    })
  }

  this.mouthDrawn = this.mouth.draw(args, args.backView ? -500 : 50)

  this.eye.getSizes(args)

  if (args.calc) {
    args.faceMaxSY = this.state.pushLinkList({
      add: [args.mouthMaxSY, args.eyeSY, args.eyeFullMaxY],
    })

    args.foreheadSY = this.state.pushLinkList({
      r: this.foreheadSY,
      useSize: args.headMinSY,
    })

    args.upperHeadSY = this.state.pushLinkList({
      add: [args.foreheadSY, args.eyeSY, args.eyeY],
    })

    args.headSX = this.state.pushLinkList({
      add: [args.eyeSX, args.eyeX],
      min: {
        r: args.sideView ? this.headSideSYFak : 1,
        useSize: args.headMinSX,
        min: [args.mouthSX],
      },
    })

    args.headMaxSY = this.state.pushLinkList({
      add: [args.mouthTopMaxY, args.upperHeadSY],
    })

    args.headSY = this.state.pushLinkList({
      add: [args.mouthTopY, args.upperHeadSY],
      min: args.headMinSY,
    })

    args.hairSX = this.state.pushLinkList({
      add: [args.headSX, !this.hair ? { a: 0 } : args.sideView ? 2 : 1],
      max: { r: 1.2, useSize: args.headSX },
    })

    args.lowerHeadSY = this.state.pushLinkList({
      add: [args.headSY, sub(args.upperHeadSY), 1],
    })

    args.eyeOutX = this.state.pushLinkList({
      add: [args.headSX, sub(args.eyeSX), sub(args.eyeX)],
    })

    args.lowerHeadSX = this.state.pushLinkList({
      r: this.lowerHeadSX,
      useSize: args.headSX,
      min: args.mouthSX,
    })
  }
}

Head.prototype.draw = function (args) {
  const list = {
    y: args.fullBodySY,
    fY: true,
    color: this.skinColor.get(),
    z: 100,
    list: [
      {
        cX: args.sideView,
        list: [
          // Neck
          {
            sY: [args.neckSY, 2],
            y: -1,
            sX: args.neckSX,
            cX: args.sideView,
            fY: true,
          },

          // Head
          {
            sX: args.sideView ? args.headSX : args.lowerHeadSX,
            sY: args.headSY,
            fY: true,
            y: args.neckSY,
            cX: args.sideView,
            id: 'head' + args.nr,
            list: [
              // Upper Head
              {
                sX: args.headSX,
                sY: [args.upperHeadSY, 1],
                id: 'upperHead' + args.nr,
                list: [
                  // Horns
                  this.horns && this.horns.draw(args),

                  // Hair
                  this.hair && this.hair.draw(args),

                  // Head Gear
                  (!args.demo || args.hat) &&
                    !args.hatDown &&
                    this.headGear &&
                    this.headGear.draw(args),

                  {
                    minX: 4,
                    minY: 4,
                    list: [
                      {
                        name: 'Dot',
                        clear: true,
                        fX: true,
                        fY: true,
                      },
                      {
                        name: 'Dot',
                        clear: true,
                        fX: true,
                      },
                      args.sideView && {
                        name: 'Dot',
                        clear: true,
                      },
                    ],
                  },

                  {},
                ],
              },

              // Round Bottom
              {
                fY: true,
                sY: args.lowerHeadSY,
                minY: 4,
                minX: 3,
                list: [
                  {
                    name: 'Dot',
                    fY: true,
                    clear: true,
                    fX: true,
                  },
                  args.sideView && {
                    name: 'Dot',
                    fY: true,
                    clear: true,
                  },
                ],
              },

              // Lower Head
              {
                sY: args.lowerHeadSY,
                fY: true,
                list: [
                  { name: 'Dot', clear: true, fX: true },
                  {},

                  // Beard
                  this.beard && this.beard.draw(args),
                ],
              },

              // Face
              // Mouth
              this.mouthDrawn ||
                this.mouth.draw(args, args.backView ? -500 : 50),

              // Eye Area
              this.eye.draw(args, args.backView ? -500 : 50),
            ],
          },
        ],
      },
    ],
  }

  return list
}

export default Head
