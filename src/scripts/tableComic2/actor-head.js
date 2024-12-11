// BEGINN Head /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Head = function (args) {
  this.actor = this.parent = args.actor

  // Forms and Sizes
  this.eyeAreaBaseSX_ = 0.5

  this.eyeAreaRelSX_ = this.rFl(0.7, 1.4)

  this.eyeAreaBaseSY_ = 0.5

  this.eyeAreaRelSY_ = this.rFl(0.7, 1.5)

  this.mouthAreaBaseSX_ = 0.7

  this.mouthAreaRelSX_ = this.rFl(0.7, 1.4)

  this.baseSX_ = args.baseSX_ || 0.8

  this.relSX_ = this.rFl(0.4, 1.2 / this.baseSX_)

  // Colors
  this.color = this.actor.colors.skinColor

  // Assets
  this.eyes = new this.basic.Eyes({
    actor: this.actor,
    color: this.color,
  })

  this.mouth = new this.basic.Mouth({
    actor: this.actor,
    color: this.color,
  })

  this.hair =
    this.rIf(0.8) &&
    new this.basic.Hair({
      actor: this.actor,
      color: this.actor.colors,
    })

  this.hat =
    !args.noHat &&
    this.rIf(0.6) &&
    new this.basic.Hat({
      actor: this.actor,
      color: this.actor.colors,
    })
}

Head.prototype.getBetterPosX = function (rel) {
  const add = [this.actor.getBetterPosX(0), this.x]

  if (!this.rotate) {
    add.push(this.actor.sX, { r: -1 + rel, useSize: this.sX })
  } else {
    add.push({ r: rel, useSize: this.sY })
  }

  return this.pushLinkList({ add })
}

Head.prototype.getBetterPosY = function (rel) {
  const add = []

  if (!this.rotate) {
    add.push(
      this.actor.getBetterPosY(1),
      this.pushLinkList({ r: 1 - rel, useSize: this.sY }),
    )
  } else {
    add.push(
      this.actor.getBetterPosY(0),
      { r: -1, useSize: this.actor.sX },
      { r: 1 - rel, useSize: this.sX },
    )
  }

  return this.pushLinkList({ add })
}

Head.prototype.draw = function (args) {
  const side = (args.info.body && args.info.body.side) || args.info.side || 0

  const sX = (this.sX = this.getSizeSwitch(
    { r: this.baseSX_, useSize: args.sX || args.stageSX },
    { r: this.relSX_ },
    { min: 4 },
    'actor-features',
    0,
  ))

  const sY = (this.sY = args.sY || args.stageSY)

  const eyeAreaSX = this.getSizeSwitch(
    { r: this.eyeAreaBaseSX_, useSize: sX },
    { r: this.eyeAreaRelSX_ },
    { min: 3, a: 1, max: sX, odd: true },
    'actor-features',
  )

  const eyeAreaSY = this.getSizeSwitch(
    { r: this.eyeAreaBaseSY_, useSize: sY },
    { r: this.eyeAreaRelSY_ },
    { min: 1 },
    'actor-features',
  )

  const eyeRestSX = this.pushLinkList([sX, { r: -1, useSize: eyeAreaSX }])

  const mouthAreaSX = this.getSizeSwitch(
    { r: this.mouthAreaBaseSX_, useSize: sX },
    { r: this.mouthAreaRelSX_ },
    { min: 1, odd: true },
    'actor-features',
  )

  const mouthAreaSY = this.pushLinkList({
    add: [sY, { r: -1, useSize: eyeAreaSY }, -2],
    min: 1,
  })

  const info = args.info || {}

  this.square = this.pushLinkList({ add: [sX], max: sY })

  this.rotate = this.actor.rotate

  this.side = this.pushLinkList({ r: 0, useSize: sX })

  // Check if there are hover changers and add them
  this.pushRelativeStandardAutomatic({
    side,
  })

  sY.odd = true

  return {
    sY: { add: [sY], min: 4 },
    sX,
    cX: true,
    color: this.color[0],
    x: (this.x = args.x),

    list: [
      // main skull
      {
        id: 'head',
        list: [
          {
            minX: 4,
            minY: 4,
            list: [
              { name: 'Dot', clear: true },
              { name: 'Dot', clear: true, fX: true },
              { name: 'Dot', clear: true, fY: true },
              { name: 'Dot', clear: true, fX: true, fY: true },
            ],
          },
          {},
          {
            color: this.color[1],
            list: [
              { sX: 1 },
              { sX: 1, fX: true },
              { sY: 1 },
              { sY: 1, fY: true },
            ],
          },
        ],
      },

      // Hair
      this.hair &&
        this.hair.draw({
          side: this.side,
          eyeRestSX,
          sY: eyeAreaSY,
        }),

      // Eyes
      this.eyes.draw({
        sX: eyeAreaSX,
        sY: eyeAreaSY,
        eyeRestSX,
        info: info.eyes,
        left: info.eyeLeft,
        right: info.eyeRight,
        side,
      }),

      // Mouth
      this.mouth.draw({
        sX: mouthAreaSX,
        sY: mouthAreaSY,
        headSX: sX,
        info: info.mouth,
        side,
      }),

      // Hat
      this.hat &&
        this.hat.draw({
          sY,
          sX,
          side: this.side,
        }),
    ],
  }
}
// END Head \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Eyes /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Eyes = function (args) {
  this.actor = args.actor

  // Forms & Sizes
  this.eyeBaseSX_ = 0.6

  this.eyeBaseSY_ = 0.6

  this.eyeSXRel_ = this.rFl(0.6, 1.5)

  this.eyeSYRel_ = this.rFl(0.5, 0.7)

  this.roundInner = true

  this.roundOuter = true

  this.eyeBrow = this.rIf(0.5)

  this.pupilSX_ = 1

  this.pupilSY_ = 1

  // Colors
  this.color = args.color

  // Assets
  this.eyeLeft = new this.basic.Eye({
    roundInner: this.roundInner,
    roundOuter: this.roundOuter,
    eyeBrow: this.eyeBrow,
    left: true,
    color: this.color,
    darkColor: this.darkColor,
    detailColor: this.detailColor,
    pupilSX_: this.pupilSX_,
    pupilSY_: this.pupilSY_,
    actor: this.actor,
  })

  this.eyeRight = new this.basic.Eye({
    roundInner: this.roundInner,
    roundOuter: this.roundOuter,
    eyeBrow: this.eyeBrow,
    color: this.color,
    darkColor: this.darkColor,
    detailColor: this.detailColor,
    pupilSX_: this.pupilSX_,
    pupilSY_: this.pupilSY_,
    actor: this.actor,
  })
}

Eyes.prototype.draw = function (args) {
  const maxEyesSX = this.pushLinkList([args.sX, -1])

  const maxEyesCombinedSX = this.getSizeSwitch(
    { r: this.eyeBaseSX_, useSize: maxEyesSX },
    { r: this.eyeSXRel_ },
    { a: 2, max: maxEyesSX, even: true },
    'actor-features',
  )

  const eyeSY = this.getSizeSwitch(
    { r: this.eyeBaseSY_, useSize: args.sY },
    { r: this.eyeSYRel_ },
    { min: 1 },
    'actor-features',
  )

  const square = this.pushLinkList({
    add: [{ r: 0.5, useSize: maxEyesCombinedSX }],
    max: eyeSY,
  })

  let eyeLeftSX
  let eyeRightSX
  let x

  this.side = this.pushLinkList({ r: 0, useSize: maxEyesCombinedSX })

  eyeLeftSX = this.pushLinkList({
    r: 0.5,
    useSize: maxEyesCombinedSX,
    add: [{ r: 0.5, useSize: this.side }],
  })

  eyeRightSX = this.pushLinkList([
    maxEyesCombinedSX,
    { r: -1, useSize: eyeLeftSX },
  ])

  this.sideRestSX = this.pushLinkList({ r: 0, useSize: args.eyeRestSX })

  x = this.pushLinkList({
    add: [
      { r: 0.5, useSize: args.eyeRestSX },
      { r: 0.5, useSize: this.sideRestSX },
    ],
  })

  // Check if there are hover changers and add them
  this.pushRelativeStandardAutomatic({
    side: args.side,
    sideRestSX: args.side,
  })

  return {
    x,
    // fX: side < 0,
    sX: args.sX,
    sY: args.sY,
    list: [
      this.eyeLeft.draw({
        sX: eyeLeftSX,
        sY: eyeSY,
        square,
        info: args.left || args.info,
        // away: side > 0 && side
      }),
      this.eyeRight.draw({
        sX: eyeRightSX,
        sY: eyeSY,
        square,
        info: args.right || args.info,
        // away: side < 0 && -side
      }),
    ],
  }
}
// END Eyes \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Eye /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Eye = function Eye(args) {
  this.actor = args.actor

  // Forms && Sizes
  this.left = args.left

  this.roundInner = args.roundInner

  this.roundOuter = args.roundOuter

  this.eyeBrow = args.eyeBrow

  this.pupilSX_ = args.pupilSX_

  this.pupilSY_ = args.pupilSY_

  // Colors
  this.color = args.color
}

Eye.prototype.draw = function EyeDraw(args) {
  // sYNormal is the normal eye height, sY can be changed for smaller or bigger eyes, but is recommended to only be used for bigger eyes.
  // for closed eyes use openSY;
  // use eyeLidTopSY to change percentage of lower and upper eye;
  const sYNormal = this.pushLinkList({
    r: args.away ? 1 - args.away : 1,
    useSize: args.sY,
    min: 1,
    max: args.sY,
  })

  /*0_1+*/
  const sY = (this.sY = this.pushLinkList({
    r: 1,
    useSize: sYNormal,
    min: 1,
  }))

  /*0_1 */
  const openSY = (this.openSY = this.pushLinkList({
    r: 1,
    useSize: sY,
  }))

  const eyeLidsFullSY = this.pushLinkList([sY, { r: -1, useSize: openSY }])

  /*0_1 */
  const eyeLidTopSY = (this.eyeLidTopSY = this.pushLinkList({
    r: 0.55,
    useSize: eyeLidsFullSY,
  }))

  const eyeLidBottomSY = this.pushLinkList([
    eyeLidsFullSY,
    { r: -1, useSize: eyeLidTopSY },
  ])

  /*-1_1*/
  const eyeBrowMove = (this.eyeBrowMove = this.pushLinkList({
    r: 0,
    useSize: openSY,
  }))

  const eyeBrowInnerY = this.pushLinkList({
    r: -1,
    useSize: eyeBrowMove,
    min: { a: -1 },
    a: -1,
    add: [eyeLidTopSY],
  })

  const eyeBrowOuterY = this.pushLinkList({
    r: 1,
    useSize: eyeBrowMove,
    min: { a: -1 },
    a: -1,
    add: [eyeLidTopSY],
  })
  // square is used for getting the pupils size. Doesnt change when eyes get smaller
  // square =							this.pushLinkList( { add:[ sX, 1 ], max: [ sYNormal, 1 ], min:1 } ),

  /*0_1+*/
  const pupilS = (this.pupilS = this.pushLinkList({
    r: 1,
    useSize: args.square,
    a: -1,
  }))

  /*0_1 */
  const pupilSX = (this.pupilSX = this.pushLinkList({
    r: this.pupilSX_,
    useSize: pupilS,
    min: { r: 0.5, useSize: args.square, max: 2, min: 1 },
  }))

  /*0_1 */
  const pupilSY = (this.pupilSX = this.pushLinkList({
    r: this.pupilSY_,
    useSize: pupilS,
    min: { r: 0.5, useSize: args.square, max: 2, min: 1 },
  }))

  // pupilPosrel moves relative to the white, pupilPos moves relative to the pupil
  const pupilRestSX = this.pushLinkList({
    add: [args.sX, { r: -1, useSize: pupilSX }],
    min: 1,
  })

  const pupilRestSY = this.pushLinkList({
    add: [sY, { r: -1, useSize: pupilSY }],
    min: 1,
  })

  /*0_1+*/
  const pupilPosXrel = (this.pupilPosXrel = this.pushLinkList({
    r: 0,
    useSize: pupilRestSX,
  }))

  /*0_1+*/
  const pupilPosYrel = (this.pupilPosYrel = this.pushLinkList({
    r: 0,
    useSize: pupilRestSY,
  }))

  /*0_1+*/
  const pupilPosX = (this.pupilPosX = this.pushLinkList({
    r: 0,
    useSize: pupilSX,
    add: [pupilPosXrel],
  }))

  /*0_1+*/
  const pupilPosY = (this.pupilPosY = this.pushLinkList({
    r: 0,
    useSize: pupilSY,
    add: [pupilPosYrel],
  }))

  const eyeLidOvershot = this.pushLinkList({ r: 0.1, max: 1, useSize: args.sX })

  const rotate = this.actor.isRotated

  // if( args.info ) { args.info.sY = false; }
  this.pushRelativeStandardAutomatic(args.info)

  // this.pushRelativeStandardAutomatic( { pupilS: { map:"test", min:0, max:2 } } )

  return {
    sX: args.sX,
    sY,
    fY: true,
    rX: this.left,
    fX: !this.left,
    id: 'eye',
    list: [
      // Main Eye
      {
        color: [255, 255, 255],
        mask: true,
        list: [
          // White
          {},

          // Pupil
          {
            color: [0, 0, 0],
            sX: pupilSX,
            sY: pupilSY,
            fY: true,
            x: pupilPosX,
            y: pupilPosY,
            id: 'pupil',
            list: [
              {
                minX: 4,
                minY: 4,
                list: [
                  { name: 'Dot', clear: true, fX: true },
                  { name: 'Dot', clear: true },
                  {
                    name: 'Dot',
                    clear: true,
                    fX: true,
                    fY: true,
                  },
                  { name: 'Dot', clear: true, fY: true },
                ],
              },
              {},
            ],
          },
        ],
      },

      // EyeLid Top / Eyebrow Top
      {
        rX: true,
        mX: { r: -1, useSize: eyeLidOvershot },
        list: [
          {
            color: this.color[2],
            points: [
              { y: -1, fX: true },
              { y: -1 },
              {
                y: eyeBrowOuterY,
                x: [eyeLidOvershot, rotate && !this.left ? -1 : 0],
              },
              { y: eyeBrowOuterY, x: rotate && !this.left && -1 },
              {
                y: eyeBrowInnerY,
                fX: true,
                x: rotate && this.left && -1,
              },
              {
                y: eyeBrowInnerY,
                fX: true,
                x: [eyeLidOvershot, rotate && this.left ? -1 : 0],
              },
            ],
          },
          {
            color: this.color[3],
            weight: 1,
            z: 10,
            id: 'eyeLid',
            points: [{ y: eyeBrowOuterY }, { y: eyeBrowInnerY, fX: true }],
          },
        ],
      },

      // Eye Lid Bottom
      {
        sY: eyeLidBottomSY,
        fY: true,
        color: this.color[2],
      },

      // Corners
      {
        minX: 5,
        minY: 5,
        list: [
          this.roundInner && {
            name: 'Dot',
            color: this.color[0],
            fY: true,
          },
          this.roundOuter && {
            name: 'Dot',
            color: this.color[0],
            fY: true,
            fX: true,
          },
          this.roundInner && { name: 'Dot', color: this.color[0] },
          this.roundOuter && {
            name: 'Dot',
            color: this.color[0],
            fX: true,
          },
        ],
      },
    ],
  }
}
// END Eye \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Mouth /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Mouth = function Mouth(args) {
  // Colors
  this.color = args.color
}

Mouth.prototype.draw = function MouthDraw(args) {
  const cutOff = (this.cutOff = this.pushLinkList({ r: 1, useSize: args.sX }))

  /*0_1 */
  const sX = (this.sX = this.pushLinkList({
    r: 1,
    useSize: args.sX,
    a: -2,
    min: 1,
  }))

  const finalSX = (this.finalSX = this.pushLinkList({
    add: [
      sX,
      {
        add: [
          { r: 0.25, useSize: cutOff, max: { a: 0 } },
          { r: -0.25, useSize: cutOff, max: { a: 0 } },
        ],
        max: { a: 0 },
      },
    ],
    min: 1,
  }))

  /*0_1 */
  const sY = (this.sY = this.pushLinkList({
    r: 0,
    useSize: args.sY,
    min: 1,
  }))

  const restSX = this.pushLinkList([args.headSX, { r: -1, useSize: finalSX }])

  const halfRestSX = this.pushLinkList({ r: 0.5, useSize: restSX })

  const restSY = this.pushLinkList([args.sY, { r: -1, useSize: sY }, -1])

  const sideRestSX = (this.sideRestSX = this.pushLinkList({
    r: 0,
    useSize: halfRestSX,
  }))

  /*0_1 */
  const x = (this.x = this.pushLinkList({
    add: [halfRestSX, sideRestSX],
    max: restSX,
  }))

  /*0_1 */
  const y = (this.y = this.pushLinkList({ r: 0.3, useSize: restSY }))

  const curveSX = (this.curveSX = this.pushLinkList({
    r: 0.3,
    useSize: finalSX,
  }))

  const curveSideSX = (this.curveSideSX = this.pushLinkList({
    r: 0,
    useSize: curveSX,
  }))

  const outerLeftSX = this.pushLinkList({ add: [curveSX, curveSideSX] })

  const outerRightSX = this.pushLinkList({
    add: [curveSX, { r: -1, useSize: curveSideSX }],
  })

  /*-1_1*/
  const curveSY = (this.curveSY = this.pushLinkList({
    r: 0,
    useSize: sY,
  }))

  const curveTopSY = this.pushLinkList({
    add: [{ r: -1, useSize: curveSY }],
    min: 0,
  })

  const curveBottomSY = this.pushLinkList({ add: [curveSY], min: 0 })

  const curveMax = this.pushLinkList([sY, -1])

  const teethTopMax = this.pushLinkList({ r: 0.55, useSize: sY })

  const teethBottomMax = this.pushLinkList([sY, { r: -1, useSize: teethTopMax }])

  /*0_1 */
  const teethTopSY = (this.teethTopSY = this.pushLinkList({
    r: 0,
    useSize: teethTopMax,
  }))

  /*0_1 */
  const teethBottomSY = (this.teethBottomSY = this.pushLinkList({
    r: 0,
    useSize: teethBottomMax,
  }))

  const smirkTop = this.pushLinkList({ r: 0.5, useSize: curveSY, max: 1 })

  const smirkBottom = this.pushLinkList({ r: -0.1, useSize: curveSY, max: 1 })

  let mouthOuter

  if (!args.info) {
    args.info = {}
  }

  // Assign the side value to the info, so it can be added to the changers.
  args.info.curveSideSX = args.info.cutOff = args.info.sideRestSX = args.side

  this.pushRelativeStandardAutomatic(args.info)

  return {
    sX: args.headSX,
    sY: args.sY,
    color: [0, 0, 100],
    fY: true,
    list: [
      {
        sX: finalSX,
        sY,
        x,
        y,
        list: [
          { sY: smirkTop, sX: 1, x: -1, tY: true },
          { sY: smirkTop, sX: 1, x: -1, tY: true, fX: true },

          { sY: smirkBottom, sX: 1, x: -1, tY: true, fY: true },
          {
            sY: smirkBottom,
            sX: 1,
            x: -1,
            tY: true,
            fY: true,
            fX: true,
          },

          // Outer Mouth Left
          {
            sX: outerLeftSX,
            rY: true,
            z: 1,
            list: (mouthOuter = [
              {
                sY: curveTopSY,
                minY: 2,
                clear: true,
                // color:[0,255,0],
                fY: true,
                stripes: {
                  change: { r: -1, useSize: curveTopSY },
                },
                list: [{ sY: { r: 1, max: curveMax }, fY: true }],
              },
              {
                sY: curveBottomSY,
                minY: 2,
                clear: true,
                // color:[0,255,0],
                stripes: {
                  change: { r: -1, useSize: curveBottomSY },
                },
                list: [{ sY: { r: 1, max: curveMax } }],
              },
            ]),
          },

          // Outer Mouth Right
          {
            sX: outerRightSX,
            rX: true,
            fX: true,
            rY: true,
            z: 1,
            list: mouthOuter,
          },

          // Inner Mouth
          {},

          {
            color: [255, 255, 255],
            mX: { r: 0.1 },
            sY: teethTopSY,
          },
          {
            color: [255, 255, 255],
            mX: { r: 0.15 },
            sY: teethBottomSY,
            fY: true,
          },
        ],
      },
    ],
  }
}
// END Mouth \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Hair /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Hair = function Hair() {
  // Forms & Sizes
  this.sY_ = 0.3

  // Colors
  this.color = [50, 30, 20]
}

Hair.prototype.draw = function HairDraw(args) {
  this.sY = this.pushLinkList({ r: this.sY_, useSize: args.sY })

  this.pushRelativeStandardAutomatic({
    sY: { map: 'actor-accessoirs', min: 0, max: this.sY_ },
  })

  return {
    color: this.color,
    sY: this.sY,
    list: [
      {
        stripes: {
          strip: 1,
          random: { r: -0.3, useSize: this.sY },
        },
      },
      {
        sY: { r: 2 },
        sX: {
          r: 0.3,
          useSize: args.eyeRestSX,
          add: [{ add: [args.side], max: { a: 0 } }],
        },
        stripes: {
          strip: 1,
          random: { r: -0.3, useSize: this.sY },
        },
      },
      {
        sY: { r: 2 },
        sX: {
          r: 0.3,
          useSize: args.eyeRestSX,
          add: [{ r: -1, useSize: args.side, max: { a: 0 } }],
        },
        fX: true,
        stripes: {
          strip: 1,
          random: { r: -0.3, useSize: this.sY },
        },
      },
    ],
  }
}
// END Hair \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Hat /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Hat = function Hat(args) {
  this.actor = args.actor

  this.rim = this.rIf(0.7)

  this.baseCap = this.rim && this.rIf(0.5)

  // Forms & Sizes
  this.sY_ = 0.1

  this.topSY_ = this.rim ? this.rFl(0.1, 0.4) : 0

  this.colorScheme = this.rIf(0.5)
    ? this.actor.colors.color1
    : this.actor.colors.color2

  this.color = this.colorScheme[2]

  this.detailColor = this.colorScheme[3]
}

Hat.prototype.draw = function HatDraw(args) {
  this.sY = this.pushLinkList({ r: 0, useSize: args.sY })

  this.topSY = this.pushLinkList({ r: 0, useSize: args.sY })

  this.pushRelativeStandardAutomatic({
    sY: { map: 'actor-accessoirs', min: 0, max: this.sY_ },
    topSY: { map: 'actor-accessoirs', min: 0, max: this.topSY_ },
  })

  return {
    sY: [this.sY, this.topSY],
    y: { r: -1, useSize: this.topSY },
    color: this.color,
    z: 100,
    list: [
      {},

      this.rim && {
        color: this.detailColor,
        sY: 1,
        fY: true,
        sX: this.baseCap && {
          r: 1,
          max: { r: 1 },
          add: [
            { r: -0.5, useSize: args.side, max: { a: 0 } },
            { r: 0.5, useSize: args.side, max: { a: 0 } },
          ],
        },
        mX: !this.baseCap && { r: -0.3 },
        x: this.baseCap && args.side,
      },
    ],
  }
}
// END Hat \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
