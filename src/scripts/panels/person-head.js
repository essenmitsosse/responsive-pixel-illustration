import { mult, sub } from '@/helper/helperDim'

import { Object } from './object'

// HEAD --------------------------------------------------------------------------------
export const Head = function (args) {
  const hairNext = this.IF(0.7)

  // Form & Sizes
  this.headSY = this.IF(0.01) ? this.R(0, 0.4) : this.R(0.1, 0.15)

  if (args.demo && args.head) {
    this.headSY = args.head
  }

  this.neckSY = this.R(0.05, 0.2)

  this.neckSX = this.R(0.4, 0.9)

  this.headSX = this.R(0.1, 0.7) * this.headSY

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

Head.prototype.draw = function (args) {
  if (args.calc) {
    this.vL['headMinSY' + args.nr] = {
      r: this.headSY,
      useSize: args.size,
      a: 1,
      min: 1,
    }

    this.vL['headMinSX' + args.nr] = {
      r: this.headSX,
      min: 1,
      useSize: args.size,
      a: 1.4,
    }

    this.vL['neckSX' + args.nr] = args.sideView
      ? {
          add: [
            { r: -1 + this.neckSX, useSize: 'headMinSX' + args.nr },
            'headMinSX' + args.nr,
          ],
          max: 'personSX' + args.nr,
          min: 1,
        }
      : {
          r: this.neckSX,
          useSize: 'headMinSX' + args.nr,
          max: 'personSX' + args.nr,
          min: 1,
        }

    this.vL['neckSY' + args.nr] = {
      r: this.headSY * this.neckSY,
      useSize: args.size,
      a: -1,
      min: { a: 0 },
    }
  }

  const list = {
    y: ['fullBodySY' + args.nr],
    fY: true,
    color: this.skinColor.get(),
    z: 100,
    list: [
      {
        cX: args.sideView,
        list: [
          // Neck
          {
            sY: ['neckSY' + args.nr, 2],
            y: -1,
            sX: 'neckSX' + args.nr,
            cX: args.sideView,
            fY: true,
          },

          // Head
          {
            sX: args.sideView ? 'headSX' + args.nr : 'lowerHeadSX' + args.nr,
            sY: 'headSY' + args.nr,
            fY: true,
            y: 'neckSY' + args.nr,
            cX: args.sideView,
            id: 'head' + args.nr,
            list: [
              // Upper Head
              {
                sX: 'headSX' + args.nr,
                sY: ['upperHeadSY' + args.nr, 1],
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
                sY: 'lowerHeadSY' + args.nr,
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
                sY: 'lowerHeadSY' + args.nr,
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
              this.mouth.draw(args, args.backView ? -500 : 50),

              // Eye Area
              this.eye.draw(args, args.backView ? -500 : 50),
            ],
          },
        ],
      },
    ],
  }

  if (args.calc) {
    this.vL['faceMaxSY' + args.nr] = [
      'mouthMaxSY' + args.nr,
      'eyeSY' + args.nr,
      'eyeFullMaxY' + args.nr,
    ]

    this.vL['foreheadSY' + args.nr] = {
      r: this.foreheadSY,
      useSize: 'headMinSY' + args.nr,
    }

    this.vL['upperHeadSY' + args.nr] = [
      'foreheadSY' + args.nr,
      'eyeSY' + args.nr,
      'eyeY' + args.nr,
    ]

    this.vL['headSX' + args.nr] = {
      add: ['eyeSX' + args.nr, 'eyeX' + args.nr],
      min: {
        r: args.sideView ? this.headSideSYFak : 1,
        useSize: 'headMinSX' + args.nr,
        min: ['mouthSX' + args.nr],
      },
    }

    this.vL['headMaxSY' + args.nr] = {
      add: ['mouthTopMaxY' + args.nr, 'upperHeadSY' + args.nr],
    }

    this.vL['headSY' + args.nr] = {
      add: ['mouthTopY' + args.nr, 'upperHeadSY' + args.nr],
      min: 'headMinSY' + args.nr,
    }

    this.vL['hairSX' + args.nr] = {
      add: ['headSX' + args.nr, !this.hair ? { a: 0 } : args.sideView ? 2 : 1],
      max: { r: 1.2, useSize: 'headSX' + args.nr },
    }

    this.vL['lowerHeadSY' + args.nr] = [
      'headSY' + args.nr,
      sub('upperHeadSY' + args.nr),
      1,
    ]

    this.vL['eyeOutX' + args.nr] = [
      'headSX' + args.nr,
      sub('eyeSX' + args.nr),
      sub('eyeX' + args.nr),
    ]

    this.vL['lowerHeadSX' + args.nr] = {
      r: this.lowerHeadSX,
      useSize: 'headSX' + args.nr,
      min: 'mouthSX' + args.nr,
    }
  }

  return list
}

// EYE --------------------------------------------------------------------------------
export const Eye = function (args) {
  // Form & Sizes
  this.eyeBrow = this.IF(0.7)

  this.monoBrow = this.eyeBrow && this.IF(0.05)

  this.eyeLidsBottom = this.IF(0.7)

  this.eyeLidsTop = this.IF(this.eyeBrow ? 0.3 : 0.7)

  this.eyeLids = this.eyeLidsBottom || this.eyeLidsTop

  this.eyeRoundTop = this.IF(0.5)

  this.eyeRoundBottom = this.IF(0.5)

  this.eyeSX = this.R(0.2, 0.4)

  this.eyeSY = this.R(0.2, 3)

  this.eyeX = this.R(0.1, 0.7) - this.eyeSX

  this.eyeY = this.R(-0.2, 0.3)

  this.highPupil = this.IF(0.1)

  this.glasses = this.IF(0.02)

  // Colors
  this.skinColor = args.skinColor

  this.skinShadowColor = args.skinShadowColor

  this.skinDetailColor = args.skinDetailColor

  this.hairColor = args.hairColor

  this.eyeColor = args.skinColor.copy({ brAdd: this.glasses ? 2 : 1 })

  this.pupilColor = this.glasses
    ? this.eyeColor.copy({ brAdd: -2 })
    : args.skinDetailColor

  this.glassesColor = args.skinColor.copy({
    nextColor: this.IF(0.5),
    brAdd: -2,
  })

  // Assets
}
// END Eye

Eye.prototype = new Object()

Eye.prototype.draw = function (args) {
  const thisEye = args.eye || {}
  const eyeSad = thisEye.lids === 'sad'
  const eyeAngry = eyeSad || thisEye.lids === 'angry'

  const eyeClosed =
    eyeAngry ||
    thisEye.lids === 'closed' ||
    thisEye.lids === 'sleepy' ||
    (args.right && thisEye.lids === 'wink')

  const eyeHalfClosed = !eyeClosed && thisEye.lids === 'halfClosed'
  const lookUp = thisEye.lookHor === 'up'
  const lookDown = thisEye.lookHor === 'down' || thisEye.lookHor === 'veryDown'
  const lookExtrem = lookUp || thisEye.lookHor === 'veryDown'
  const lookForward = !lookUp && !lookDown
  const lookSide = thisEye.lookVert
  const lookRight = thisEye.lookVert === 'right'

  const eyeBrowRaised =
    thisEye.brow === 'raised' || (args.right && thisEye.brow === 'sceptical')

  const eyeBrowLow =
    thisEye.brow === 'low' || (!args.right && thisEye.brow === 'sceptical')

  const eyeBrowSad =
    thisEye.brow === 'sad' || (args.right && thisEye.brow === 'superSceptical')

  const eyeBrowAngry =
    eyeBrowSad ||
    thisEye.brow === 'angry' ||
    (!args.right && thisEye.brow === 'superSceptical')

  if (args.calc) {
    this.vL['eyeFullSX' + args.nr] = {
      r: this.eyeSX,
      useSize: 'headMinSX' + args.nr,
      max: 'headMinSX' + args.nr,
    }

    this.vL['eyeSX' + args.nr] = {
      r: args.sideView ? 0.8 : 1,
      useSize: 'eyeFullSX' + args.nr,
      min: { r: 0.3, useSize: 'headMinSX' + args.nr, max: 1 },
    }

    this.vL['eyeSY' + args.nr] = {
      r: this.eyeSX * this.eyeSY,
      useSize: 'headMinSX' + args.nr,
      min: { r: 0.2, useSize: 'headMinSY' + args.nr, max: 1 },
      max: { r: 2, useSize: 'eyeSX' + args.nr, a: -1 },
    }

    this.vL['eyeX' + args.nr] = {
      r: this.eyeX,
      useSize: 'headMinSX' + args.nr,
      min: 1,
    }

    this.vL['eyeY' + args.nr] = {
      r: this.eyeY,
      useSize: 'headMinSY' + args.nr,
      min: { a: 0 },
    }

    this.vL['eyeFullY' + args.nr] = [
      'eyeY' + args.nr,
      'mouthTopY' + args.nr,
      0.1,
    ]

    this.vL['eyeFullMaxY' + args.nr] = [
      'eyeY' + args.nr,
      'mouthTopMaxY' + args.nr,
      0.1,
    ]

    this.vL['eyeBrowSY' + args.nr] = { r: 0.3, useSize: 'eyeSY' + args.nr }
  }

  return (
    !args.backView && {
      sX: 'eyeSX' + args.nr,
      sY: 'eyeSY' + args.nr,
      x: 'eyeX' + args.nr,
      y: 'eyeFullY' + args.nr,
      fY: true,
      id: 'eyes' + args.nr,
      color: (this.glasses ? this.pupilColor : this.skinShadowColor).get(),
      z: 0,
      list: [
        this.glasses && {
          color: this.glassesColor.get(),
          list: [
            // Rim
            { m: -1 },

            //Between Eyes
            { sY: 1, sX: 'eyeX' + args.nr, tX: true },

            // Ear Things
            { sY: 1, sX: 'eyeOutX' + args.nr, fX: true, tX: true },

            // Glasses
            { color: this.eyeColor.get() },
          ],
        },

        !eyeClosed
          ? {
              // Open Eyes
              list: [
                {
                  minY: 3,
                  minX: 3,
                  list: [
                    {
                      minX: 4,
                      list: [
                        !this.eyeLidsTop && {
                          name: 'Dot',
                          clear: true,
                        },
                        !this.eyeLidsBottom && {
                          name: 'Dot',
                          fY: true,
                          clear: true,
                        },
                      ],
                    },

                    !this.eyeLidsBottom && {
                      name: 'Dot',
                      fY: true,
                      fX: true,
                      clear: true,
                    },
                    !this.eyeLidsTop && {
                      name: 'Dot',
                      fX: true,
                      clear: true,
                    },
                  ],
                },

                {
                  sY: !this.glasses && eyeHalfClosed && 1,
                  y: !this.glasses && eyeHalfClosed && ['lowerLids' + args.nr],
                  fY: true,
                  list: [
                    { color: this.eyeColor.get() },

                    {
                      sX: {
                        r: 0.4,
                        max: ['eyeSX' + args.nr, -1],
                        min: 1,
                      },
                      sY: !this.highPupil && {
                        r: lookExtrem ? 0.5 : 0.6,
                        max: 'eyeSY' + args.nr,
                        min: 1,
                      },
                      color: this.pupilColor.get(),
                      fY: !lookUp,
                      rY: lookUp,
                      rX: lookSide && args.right === lookRight,
                      fX: lookSide && args.right === lookRight,
                      cY: lookForward,
                      id: 'pupil' + args.nr,
                      list: !this.highPupil && [
                        {
                          minX: 3,
                          minY: 3,
                          list: [
                            {
                              name: 'Dot',
                              clear: true,
                              fX: true,
                            },
                          ],
                        },
                        {
                          minX: 4,
                          minY: 4,
                          list: [
                            {
                              name: 'Dot',
                              clear: true,
                            },
                            lookForward && {
                              name: 'Dot',
                              clear: true,
                              fX: true,
                              fY: true,
                            },
                            lookForward && {
                              name: 'Dot',
                              clear: true,
                              fY: true,
                            },
                          ],
                        },
                        {},
                      ],
                    },
                  ],
                },

                // Half Closed
                !this.glasses &&
                  eyeHalfClosed && {
                    id: 'halfClosed' + args.nr,
                    list: [
                      {
                        sY: {
                          r: 1,
                          add: [sub('lowerLids' + args.nr), -1],
                        },
                      },
                      {
                        sY: {
                          r: 0.5,
                          max: { r: 1, a: -2 },
                          save: 'lowerLids' + args.nr,
                        },
                        fY: true,
                      },
                    ],
                  },

                // EyeLids Top
                !this.glasses &&
                  this.eyeLidsTop && {
                    minY: 3,
                    list: [
                      {
                        sY: { r: 1, a: -2, max: 1 },
                      },
                    ],
                  },

                // EyeLids Bottom
                !this.glasses &&
                  this.eyeLidsBottom && {
                    minY: 4,
                    list: [
                      {
                        sY: { r: 1, a: -2, max: 1 },
                        fY: true,
                      },
                    ],
                  },
              ],
            }
          : {
              // Closed Eyes
              fY: true,
              sY: 1,
              cY: thisEye.lids !== 'sleepy',
            },

        // Eye Brow
        this.eyeBrow && {
          sX: this.monoBrow
            ? ['eyeSX' + args.nr, 'eyeX' + args.nr]
            : {
                r: 1,
                a: 1,
                max: ['headSX' + args.nr, sub('eyeX' + args.nr)],
              },
          sY: eyeBrowAngry
            ? [
                'eyeBrowSY' + args.nr,
                { r: 0.2, useSize: 'eyeSY' + args.nr, max: 1 },
              ]
            : 'eyeBrowSY' + args.nr,
          y: eyeBrowRaised
            ? -1
            : eyeBrowLow
              ? {
                  r: 0.2,
                  useSize: 'eyeSX' + args.nr,
                  max: 1,
                }
              : undefined,
          minX: 2,
          fX: this.monoBrow,
          tY: true,
          id: 'eyeBrow' + args.nr,
          color: this.hairColor.get(),
          list: eyeBrowAngry && [
            {
              sX: { r: 0.5 },
              sY: 'eyeBrowSY' + args.nr,
              fY: eyeBrowSad,
              fX: true,
            },
            {
              sX: { r: 0.5 },
              sY: 'eyeBrowSY' + args.nr,
              fY: !eyeBrowSad,
            },

            // { a:eyeBrowSad ? -1 : 1, max:{r:.2} }
          ],
        },
      ],
    }
  )
}
// END Eye draw

// MOUTH --------------------------------------------------------------------------------
export const Mouth = function (args) {
  // Form & Sizes
  this.mouthSX = this.R(0.4, 0.6)

  this.mouthSY = this.R(0.2, 0.4)

  this.mouthY = this.R(0.1, 0.6)

  // Colors
  this.skinColor = args.skinColor

  this.skinDetailColor = args.skinDetailColor

  this.teethColor = this.skinColor.copy({ brAdd: 2 })

  this.teethShadowColor = this.teethColor.copy({ brAdd: -1 })

  // Assets
}
// END Mouth

Mouth.prototype = new Object()

Mouth.prototype.draw = function (args) {
  const thisMouth = args.mouth || {}
  const mouthWidth = thisMouth.width
  const mouthHeight = thisMouth.height
  const mouthForm = thisMouth.form
  const mouthD = mouthForm === 'D:'
  const mouthGrin = mouthD || mouthForm === 'grin'
  const mouthNarrow = mouthWidth === 'narrow'
  const mouthSlight = mouthHeight === 'slight'
  const mouthHalfOpen = mouthHeight === 'half'
  const mouthOpen = mouthSlight || mouthHalfOpen || mouthHeight === 'full'
  const mouthSmile = mouthGrin && !mouthOpen

  const teethFull =
    !mouthSlight && mouthOpen && !mouthNarrow && thisMouth.teeth === 'full'

  const teethTop =
    !mouthSlight &&
    ((mouthOpen && thisMouth.teeth === 'top') || thisMouth.teeth === 'both')

  const teethBottom =
    !mouthSlight &&
    ((mouthOpen && thisMouth.teeth === 'bottom') || thisMouth.teeth === 'both')

  if (args.calc) {
    this.vL['mouthSX' + args.nr] = {
      r: this.mouthSX * (args.sideView ? 0.7 : 1),
      a: 0.5,
      useSize: 'headMinSX' + args.nr,
      max: 'headMinSX' + args.nr,
    }

    this.vL['mouthMaxSY' + args.nr] = {
      r: this.mouthSY,
      useSize: 'headMinSY' + args.nr,
    }

    this.vL['mouthSY' + args.nr] =
      mouthSlight || mouthSmile
        ? { a: 2, max: 'mouthMaxSY' + args.nr }
        : mouthOpen
          ? mouthHalfOpen
            ? mult(0.5, 'mouthMaxSY' + args.nr)
            : 'mouthMaxSY' + args.nr
          : { a: 1, max: 'mouthMaxSY' + args.nr }

    this.vL['mouthY' + args.nr] = {
      r: this.mouthY,
      useSize: 'headMinSY' + args.nr,
    }

    this.vL['mouthTopMaxY' + args.nr] = [
      'mouthMaxSY' + args.nr,
      'mouthY' + args.nr,
    ]

    this.vL['mouthTopY' + args.nr] = ['mouthSY' + args.nr, 'mouthY' + args.nr]
  }

  return (
    !args.backView && {
      sX: {
        r: (mouthNarrow ? 0.4 : 1) * (thisMouth.smirk && args.right ? 0.4 : 1),
        useSize: 'mouthSX' + args.nr,
      },
      minX: 2,
      sY: 'mouthSY' + args.nr,
      y: 'mouthY' + args.nr,
      fY: true,
      id: 'mouth' + args.nr,
      z: 0,
      color: this.skinDetailColor.get(),
      list: mouthSmile
        ? [
            { sX: 1, sY: 1, fX: true, fY: mouthD },
            { sX: { r: 1, a: -1 }, sY: 1, fY: !mouthD },
          ]
        : mouthOpen && [
            (mouthD || mouthGrin) && {
              name: 'Dot',
              clear: true,
              fX: true,
              fY: mouthD,
            },

            {},

            teethFull && {
              sX: { r: 0.75, min: { r: 1, a: -2, min: 2 } },
              color: this.teethColor.get(),
              list: [
                {},
                {
                  sY: { r: 0.2, max: 1 },
                  cY: true,
                  color: this.teethShadowColor.get(),
                },
              ],
            },

            teethTop && { sY: 1, color: this.teethColor.get() },

            teethBottom && {
              sY: 1,
              fY: true,
              color: this.teethColor.get(),
            },
          ],
    }
  )
}
// END Mouth draw

// HAIR --------------------------------------------------------------------------------
export const Hair = function (args) {
  // Form & Sizes
  this.curly = args.headGear && this.IF()

  this.longHair = this.IF(0.1)

  this.hairSY = this.R(0.1, 1) * (this.longHair ? 3 : 1)

  this.hairSide = this.curly || this.IF(0.99)

  this.hairSideSY = 0.8

  this.hairAccuracy = this.R(0.1, 0.3)

  this.hairS = this.R(0.01, 0.1)

  this.detailSY = this.R(0, 0.25)

  this.detailChance = this.R(0, 0.5)

  // Colors
  this.hairColor = args.hairColor

  this.hairDetailColor = args.hairDetailColor

  // Assets
}
// END Hair

Hair.prototype = new Object()

Hair.prototype.draw = function (args) {
  const rightSide = args.sideView || !args.right
  const name = args.id + '_' + args.right + args.nr

  if (args.calc) {
    this.vL['hairS' + args.nr] = {
      r: this.hairS,
      useSize: 'headMinSY' + args.nr,
      min: 1,
    }

    this.vL['hairAccuracy' + args.nr] = {
      r: this.hairAccuracy * -1,
      useSize: 'headMinSY' + args.nr,
      max: { a: 0 },
    }

    this.vL['hairDetailSY' + args.nr] = {
      r: this.detailSY,
      useSize: 'headMinSY' + args.nr,
      min: 1,
    }
  }

  return {
    color: this.hairColor.get(),
    sX: 'hairSX' + args.nr,
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
            sY: {
              a: 'hairDetailSY' + args.nr,
              random: 'hairDetailSY' + args.nr,
            },
            mask: true,
          },
          // Front
          {
            use: 'hairFront' + name,
            color: this.hairDetailColor.get(),
            chance: this.detailChance,
            sY: {
              a: 'hairDetailSY' + args.nr,
              random: 'hairDetailSY' + args.nr,
            },
            mask: true,
          },
        ],
      },

      // Top
      {
        save: 'hairFront' + name,
        sX: 'headSX' + args.nr,
        cX: args.sideView,
        sY: 1,
      },

      {
        sY: { r: 1, a: -1 },
        y: 1,
        list: [
          // ForeHead
          rightSide && {
            sX: !args.sideView && {
              r: 2,
              useSize: 'hairSX' + args.nr,
              a: -1,
            },
            sY: { r: 0.5, useSize: 'foreheadSY' + args.nr, a: -1 },
            fX: true,
            save: 'hairFront' + name,
            list: [
              {
                stripes: {
                  random: 'hairAccuracy' + args.nr,
                  seed: args.id + (args.right ? 1 : 0),
                  strip: 'hairS' + args.nr,
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
              : { r: 2, useSize: 'hairSX' + args.nr, a: -1 },
            sY: {
              r: this.hairSY,
              useSize: 'headMinSY' + args.nr,
              min: 'hairSideSY' + args.nr,
              max: ['personRealMinSY' + args.nr, -2],
            },
            list: [
              {
                save: (args.backView ? 'hairFront' : 'hairBack') + name,
                color: [255, 0, 0],
                stripes: {
                  random: 'hairAccuracy' + args.nr,
                  seed: args.id + (args.right ? 1 : 0),
                  strip: 'hairS' + args.nr,
                },
              },
            ],
          },

          // Side Hair
          this.hairSide && {
            sX: {
              r: args.sideView ? 0.8 : 0.6,
              useSize: 'eyeOutX' + args.nr,
              max: {
                r: args.sideView ? 0.9 : 0.15,
                useSize: 'headSX' + args.nr,
              },
            },
            sY: {
              r: this.hairSideSY,
              useSize: 'upperHeadSY' + args.nr,
              save: 'hairSideSY' + args.nr,
            },
            x: 1,
            fX: true,
            save: 'hairFront' + name,
            // color:[0,0,255],
            stripes: {
              random: args.sideView && 'hairAccuracy' + args.nr,
              strip: args.sideView && 'hairS' + args.nr,
              change: !args.sideView && { r: -0.3 },
              seed: args.id + (args.right ? 1 : 0),
            },
          },
        ],
      },
    ],
  }
}
// END Hair draw

// BEARD --------------------------------------------------------------------------------
export const Beard = function (args) {
  // Form & Sizes
  this.threeOClok = this.IF(0.1)

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
  if (this.threeOClok) {
    this.skinShadowColor = args.skinShadowColor.copy({ min: 1 })
  }

  this.hairDetailColor = args.hairDetailColor

  // Assets
}
// END Beard

Beard.prototype = new Object()

Beard.prototype.draw = function (args) {
  if (args.calc) {
    this.vL['beardDetailSY' + args.nr] = {
      r: this.detailSY,
      useSize: 'headMinSY' + args.nr,
      min: 1,
    }
  }

  return {
    color: this.beardColor.get(),
    id: 'beard' + args.nr,
    z: args.backView && -100,
    list: [
      // 3 O’Clock Shadow
      this.threeOClok && {
        id: 'head' + args.nr,
        sY: 'mouthTopY' + args.nr,
        fY: true,
        color: this.skinShadowColor.get(),
      },

      // Beard Detail
      this.mainBeard && { use: 'beard' + args.nr },

      this.mainBeard && {
        use: 'beard' + args.nr,
        color: this.hairDetailColor.get(),
        chance: this.detailChance,
        sY: { a: 'beardDetailSY' + args.nr, random: 'beardDetailSY' + args.nr },
        mask: true,
      },

      // Mustach
      this.mustach && {
        sY: { r: 0.6, useSize: 'eyeY' + args.nr },
        sX: ['mouthSX' + args.nr, 1],
        fY: true,
        y: 'mouthTopY' + args.nr,
        x: this.mustachGap && 1,
        stripes: { horizontal: true, change: -1 },
      },

      // Goate
      this.goate && {
        sX: { r: 0.2 },
        sY: 'mouthTopY' + args.nr,
        fY: true,
        x: [
          'mouthSX' + args.nr,
          this.mustachGap
            ? { r: 0.1, useSize: 'headSX' + args.nr, max: 1 }
            : { a: 0 },
        ],
      },

      // Main Beard
      this.mainBeard && {
        fY: true,
        tY: true,
        id: 'beard' + args.nr,
        y: ['mouthY' + args.nr, -1],
        sY: { r: this.beardLength, useSize: 'headMaxSY' + args.nr },
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
// END Beard draw

// HAT --------------------------------------------------------------------------------
export const Hat = function (args) {
  // Form & Sizes
  this.hatSY = this.R(0, 1)

  this.smallHat = this.IF(0.05) && this.R(0.3, 1)

  this.getSmaller = this.IF()

  this.hatTopSX = this.getSmaller && this.R(-0.6, 1)

  this.roundHat = !this.getSmaller && this.IF(0.5)

  this.hatRim = this.IF(0.6)

  this.baseCap = this.hatRim && this.IF(0.1)

  this.thickRim = this.hatRim && this.IF(0.3)

  this.hatBand = this.IF(
    0.3 + (this.hatRim ? 0.3 : 0) + (this.baseCap ? -0.4 : 0),
  )

  this.dent = this.IF(
    0.2 + (this.hatRim ? 0.3 : 0) + (this.baseCap ? -0.49 : 0),
  )

  this.dentSX = this.dent && this.R(0, 0.5)

  this.hatDepthY = this.R(0.1, 1) * (this.smallHat || 1)

  this.hatRimSY = this.hatRim && this.R(1, 2)

  // Colors
  this.hatColor = args.hatColor

  this.hatBandColor =
    this.hatBand &&
    !this.baseCap &&
    (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
      brContrast: -1,
    })

  this.hatRimColor = this.IF(this.baseCap ? 0.8 : 0.1)
    ? this.hatColor.copy({ nextColor: true, brContrast: -2 })
    : this.hatColor

  // Assets
}
// END Hat

Hat.prototype = new Object()

Hat.prototype.draw = function (args) {
  // if( args.calc ) {
  // 	this.vL[ "hatDepthY"+nr ] = ;
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
      useSize: 'headMinSY' + args.nr,
      min: [
        {
          r: this.hatDepthY,
          useSize: 'foreheadSY' + args.nr,
          min: 1,
          save: 'hatDepthY' + args.nr,
        },
        1,
      ],
    },
    sX: this.smallHat
      ? { r: this.smallHat, useSize: 'hairSX' + args.nr }
      : 'hairSX' + args.nr,
    y: !this.smallHat && 'hatDepthY' + args.nr,
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
            ? { y: this.hatTopSX > 0 && 'hatDepthY' + args.nr, fY: true }
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
            y: this.hatTopSX > 0 && 'hatDepthY' + args.nr,
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
        sX:
          (!this.baseCap && { r: this.hatRimSY }) ||
          (args.sideView && { r: (this.hatRimSY - 1) / 2 + 1 }),
        cX: args.sideView && !this.baseCap,
        fX: args.sideView,
        fY: true,
        color: this.hatRimColor.get(),
      },
    ],
  }
}
// END Hat draw

// HELM --------------------------------------------------------------------------------
export const Helm = function (args) {
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
  // 	this.vL[ "hatDepthY"+nr ] = ;
  // }

  return {
    color: this.helmColor.get(),
    id: 'hat' + args.nr,
    z: 160,
    y: -1,
    cX: args.sideView,
    sY: [{ r: this.helmSY, useSize: 'headMaxSY' + args.nr }, 2],
    sX: 'hairSX' + args.nr,
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
          { sY: { r: 1, max: 'foreheadSY' + args.nr } },

          // Sides
          this.sides && {
            sX: { a: 'eyeOutX' + args.nr, min: 1 },
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
            y: ['foreheadSY' + args.nr, 'eyeSY' + args.nr, 1],
            sY: 'mouthTopMaxY' + args.nr,
          },

          // Nose Piece
          this.nosePiece && {
            z: 5,
            sX: {
              r: 0.2,
              useSize: 'headSX' + args.nr,
              max: 'eyeX' + args.nr,
              min: ['eyeX' + args.nr, -1],
            },
            sY: ['foreheadSY' + args.nr, 'eyeSY' + args.nr, 2],
          },

          args.backView && {},
        ],
      },

      this.foreheadDetail && {
        sY: {
          r: this.foreheadDetailSY,
          useSize: 'foreheadSY' + args.nr,
          min: 1,
          save: 'helmDetailSX' + args.nr,
        },
        y: {
          r: 0.7,
          a: -1,
          useSize: 'foreheadSY' + args.nr,
          min: { a: 0 },
          max: {
            r: -1.2,
            useSize: 'helmDetailSX' + args.nr,
            a: 'foreheadSY' + args.nr,
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
// END Helm draw

// HEADBAND --------------------------------------------------------------------------------
export const HeadBand = function (args) {
  // Form & Sizes

  // Colors
  this.headBandColor = args.hatColor

  // Assets
}
// END HeadBand

HeadBand.prototype = new Object()

HeadBand.prototype.draw = function (args, z) {
  return {
    z,
    sY: {
      r: 0.3,
      useSize: 'foreheadSY' + args.nr,
      min: 1,
      save: 'headBandSX' + args.nr,
    },
    sX: 'hairSX' + args.nr,
    cX: args.sideView,
    color: this.headBandColor.get(),
    y: {
      r: 0.5,
      useSize: 'foreheadSY' + args.nr,
      max: ['foreheadSY' + args.nr, sub('headBandSX' + args.nr)],
    },
  }
}
// END HeadBand draw

// HORNS --------------------------------------------------------------------------------
export const Horns = function (args) {
  // Form & Sizes
  this.hornsSX = this.R(0.05, 2)

  this.hornsSY = this.R(0.05, 0.3)

  this.hornsY = this.R(0.1, 0.25)

  this.hornsBendSY = this.R(0.1, 1)

  // Colors
  this.hornColor = this.IF() ? args.skinColor : args.hairColor

  // Assets
}
// END Horns

Horns.prototype = new Object()

Horns.prototype.draw = function (args, z) {
  // if( args.calc ) {
  // 	this.vL[ "hatDepthY"+nr ] = ;
  // }

  return {
    tX: !args.sideView || !this.ears,
    fX: true,
    z: z + (args.sideView ? 100 : 0),
    id: 'horns' + args.nr,
    color: this.hornColor.get(),
    sX: {
      r: this.hornsSX * (args.sideView ? 0.5 : 1),
      useSize: 'headSX' + args.nr,
      min: 1,
    },
    sY: { r: this.hornsSY, useSize: 'headMaxSY' + args.nr },
    x: args.sideView && {
      r: this.ears ? 0.3 : this.hornsSX * 0.3,
      useSize: 'headSX' + args.nr,
    },
    y: { r: this.hornsY, useSize: 'headMaxSY' + args.nr },
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
// END Horns draw
