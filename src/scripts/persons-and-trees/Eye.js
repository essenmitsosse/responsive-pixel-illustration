import { sub } from '@/helper/helperDim'

const Eye = function (args, state) {
  this.state = state

  // Form & Sizes
  this.eyeBrow = state.IF(0.7)

  this.monoBrow = this.eyeBrow && state.IF(0.05)

  this.eyeLidsBottom = state.IF(0.7)

  this.eyeLidsTop = state.IF(this.eyeBrow ? 0.3 : 0.7)

  this.eyeLids = this.eyeLidsBottom || this.eyeLidsTop

  this.eyeRoundTop = state.IF(0.5)

  this.eyeRoundBottom = state.IF(0.5)

  this.eyeSX = state.R(0.2, 0.4)

  this.eyeSY = state.R(0.2, 3)

  this.eyeX = state.R(0.1, 0.7) - this.eyeSX

  this.eyeY = state.R(-0.2, 0.3)

  this.highPupil = state.IF(0.1)

  this.glasses = state.IF(0.02)

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
    nextColor: state.IF(0.5),
    brAdd: -2,
  })

  // Assets
}
// END Eye

Eye.prototype.getSizes = function (args) {
  if (args.calc) {
    args.eyeFullSX = this.state.pushLinkList({
      r: this.eyeSX,
      useSize: args.headMinSX,
      max: args.headMinSX,
    })

    args.eyeSX = this.state.pushLinkList({
      r: args.sideView ? 0.8 : 1,
      useSize: args.eyeFullSX,
      min: { r: 0.3, useSize: args.headMinSX, max: 1 },
    })

    args.eyeSY = this.state.pushLinkList({
      r: this.eyeSX * this.eyeSY,
      useSize: args.headMinSX,
      min: { r: 0.2, useSize: args.headMinSY, max: 1 },
      max: { r: 2, useSize: args.eyeSX, a: -1 },
    })

    args.eyeX = this.state.pushLinkList({
      r: this.eyeX,
      useSize: args.headMinSX,
      min: 1,
    })

    args.eyeY = this.state.pushLinkList({
      r: this.eyeY,
      useSize: args.headMinSY,
      min: { a: 0 },
    })

    args.eyeFullY = this.state.pushLinkList([args.eyeY, args.mouthTopY, 0.1])

    args.eyeFullMaxY = this.state.pushLinkList([
      args.eyeY,
      args.mouthTopMaxY,
      0.1,
    ])

    args.eyeBrowSY = this.state.pushLinkList({ r: 0.3, useSize: args.eyeSY })
  }
}

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

  return (
    !args.backView && {
      sX: args.eyeSX,
      sY: args.eyeSY,
      x: args.eyeX,
      y: args.eyeFullY,
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
            { sY: 1, sX: args.eyeX, tX: true },

            // Ear Things
            { sY: 1, sX: args.eyeOutX, fX: true, tX: true },

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
                  y: !this.glasses && eyeHalfClosed && [args.lowerLids],
                  fY: true,
                  list: [
                    { color: this.eyeColor.get() },

                    {
                      sX: {
                        r: 0.4,
                        max: [args.eyeSX, -1],
                        min: 1,
                      },
                      sY: !this.highPupil && {
                        r: lookExtrem ? 0.5 : 0.6,
                        max: args.eyeSY,
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
                          add: [sub(args.lowerLids), -1],
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
            ? [args.eyeSX, args.eyeX]
            : {
                r: 1,
                a: 1,
                max: [args.headSX, sub(args.eyeX)],
              },
          sY: eyeBrowAngry
            ? [args.eyeBrowSY, { r: 0.2, useSize: args.eyeSY, max: 1 }]
            : args.eyeBrowSY,
          y: eyeBrowRaised
            ? -1
            : eyeBrowLow
              ? { r: 0.2, useSize: args.eyeSX, max: 1 }
              : undefined,
          minX: 2,
          fX: this.monoBrow,
          tY: true,
          id: 'eyeBrow' + args.nr,
          color: this.hairColor.get(),
          list: eyeBrowAngry && [
            {
              sX: { r: 0.5 },
              sY: args.eyeBrowSY,
              fY: eyeBrowSad,
              fX: true,
            },
            { sX: { r: 0.5 }, sY: args.eyeBrowSY, fY: !eyeBrowSad },

            // { a: eyeBrowSad ? -1: 1, max: { r: 0.2} }
          ],
        },
      ],
    }
  )
}

export default Eye
