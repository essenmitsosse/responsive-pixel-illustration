import { sub } from '@/helper/helperDim'

import Object from './Object'

const Head = function (args) {
  const hairNext = this.IF(0.7)

  // Form & Sizes
  this.headSY = this.IF(0.01) ? this.R(0, 0.4) : this.R(0.1, 0.15)

  if (args.demo && args.head) {
    this.headSY = args.head
  }

  this.neckSY = this.R(0.05, 0.2)

  this.neckSX = this.R(0.4, 0.9)

  this.headSX = this.R(0.1, 0.7)

  this.headSideSYFak = this.R(1.6, 2.4)

  this.lowerHeadSX = (this.IF(0.5) && this.R(0.8, 1.2)) || 1

  this.foreheadSY = this.R(0.1, 0.75)

  // Colors
  this.skinColor = args.skinColor

  this.skinShadowColor = args.skinShadowColor

  this.skinDetailColor = args.skinDetailColor

  this.hairColor = args.hairColor =
    args.animal || this.IF(0.1)
      ? args.skinColor.copy({
          brContrast: (this.IF(0.5) ? 2 : 1) * (this.IF(0.5) ? -1 : 1),
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
    this.IF(0.5) ? args.firstColor : args.secondColor
  ).copy({
    brAdd: this.IF(0.5) ? 0 : this.IF(0.7) ? -2 : 1,
  })

  // Assets
  this.eye = new this.basic.Eye(args)

  this.mouth = new this.basic.Mouth(args)

  this.beard = this.IF() && new this.basic.Beard(args)

  this.headGear = args.headGear =
    (args.demo || this.IF(0.3)) &&
    new (this.IF(0.01)
      ? this.basic.Horns
      : this.IF(0.2)
        ? this.basic.Helm
        : this.IF(0.1)
          ? this.basic.HeadBand
          : this.basic.Hat)(args)

  this.hair = this.IF(0.9) && new this.basic.Hair(args)
}
// END Head

Head.prototype = new Object()

Head.prototype.getSizes = function (args) {
  if (args.calc) {
    args.headBaseSY = this.pushLinkList({ r: 1, useSize: args.size })

    args.headMinSY = this.pushLinkList({
      r: this.headSY,
      useSize: args.headBaseSY,
      a: 1,
      min: 1,
    })

    args.headMinSX = this.pushLinkList({
      r: this.headSX,
      min: 1,
      useSize: args.headMinSY,
      a: 1.4,
    })

    args.neckSX = this.pushLinkList(
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

    args.neckSY = this.pushLinkList({
      r: this.headSY * this.neckSY,
      useSize: args.size,
      a: -1,
      min: { a: 0 },
    })

    this.hoverChangerStandard.push({
      min: 0.3,
      max: 1.7,
      map: 'head-size',
      variable: args.headBaseSY,
    })
  }

  this.mouthDrawn = this.mouth.draw(args, args.backView ? -500 : 50)

  this.eye.getSizes(args)

  if (args.calc) {
    args.faceMaxSY = this.pushLinkList({
      add: [args.mouthMaxSY, args.eyeSY, args.eyeFullMaxY],
    })

    args.foreheadSY = this.pushLinkList({
      r: this.foreheadSY,
      useSize: args.headMinSY,
    })

    args.upperHeadSY = this.pushLinkList({
      add: [args.foreheadSY, args.eyeSY, args.eyeY],
    })

    args.headSX = this.pushLinkList({
      add: [args.eyeSX, args.eyeX],
      min: {
        r: args.sideView ? this.headSideSYFak : 1,
        useSize: args.headMinSX,
        min: [args.mouthSX],
      },
    })

    args.headMaxSY = this.pushLinkList({
      add: [args.mouthTopMaxY, args.upperHeadSY],
    })

    args.headSY = this.pushLinkList({
      add: [args.mouthTopY, args.upperHeadSY],
      min: args.headMinSY,
    })

    args.hairSX = this.pushLinkList({
      add: [args.headSX, !this.hair ? { a: 0 } : args.sideView ? 2 : 1],
      max: { r: 1.2, useSize: args.headSX },
    })

    args.lowerHeadSY = this.pushLinkList({
      add: [args.headSY, sub(args.upperHeadSY), 1],
    })

    args.eyeOutX = this.pushLinkList({
      add: [args.headSX, sub(args.eyeSX), sub(args.eyeX)],
    })

    args.lowerHeadSX = this.pushLinkList({
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
