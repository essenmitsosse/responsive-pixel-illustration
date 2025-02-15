import { darken } from '@/helper/helperColor'
import { getBiggerDim, getSmallerDim, mult, sub } from '@/helper/helperDim'
import setValue from '@/helper/setValue'

import type { ImageFunction, InputDynamicLink } from './listImage'
import type { ColorRgb } from '@/helper/typeColor'
import type {
  InputDynamicVariable,
  InputDynamicVariableBase,
} from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'
import type { LinkPrepared } from '@/renderengine/PixelGraphics'

const graien: ImageFunction = (_, __, createSlider) => {
  const background: ColorRgb = [60, 120, 110]
  const bSS = 0.5
  const shadowAdd = 195

  const shadowColor: ColorRgb = [
    background[0] * bSS + shadowAdd,
    background[1] * bSS + shadowAdd,
    background[2] * bSS + shadowAdd,
  ]

  const shadow = darken(shadowColor, 0.7)
  const detail = darken(shadowColor, 0.4)
  const grey: ColorRgb = [204, 204, 204]
  const bread: ColorRgb = [150, 130, 100]
  const breadDark = shadow(bread)
  const backgroundMedium = shadow(background)
  const backgroundDark = detail(background)
  const hair: ColorRgb = [255, 255, 255]
  const graie1: ColorRgb = [227, 200, 190]
  const graie2: ColorRgb = [192, 176, 133]
  const graie3: ColorRgb = [232, 204, 151]

  let graie1Shadow = shadow(graie1)
  let graie1Detail = detail(graie1)
  let graie2Shadow = shadow(graie2)
  let graie2Detail = detail(graie2)
  let graie3Shadow = shadow(graie3)
  let graie3Detail = detail(graie3)

  const imgDifference = 0.05
  const linkList: Array<InputDynamicLink> = []

  const linkListPush = function <T extends InputDynamicLink>(obj: T): T {
    linkList.push(obj)

    return obj
  }

  const sXMain = linkListPush({ main: true })
  const sYMain = linkListPush({ main: true, height: true })
  const fullSquare = linkListPush({ add: [sXMain], max: sYMain })
  const framePadding = linkListPush({ r: 0.02, useSize: fullSquare })
  const frameWidth = linkListPush({ r: 0.05, useSize: fullSquare })

  const graienPaddingX = linkListPush({
    r: imgDifference,
    useSize: sXMain,
    add: [1, { r: -imgDifference, useSize: sYMain }],
    min: 1,
  })

  const graienPaddingY = linkListPush({
    a: 1,
    r: imgDifference,
    useSize: sYMain,
    add: [1, { r: -imgDifference, useSize: sXMain }],
    min: 2,
  })

  const border = linkListPush([framePadding, frameWidth])
  const fullBorderX = linkListPush([border, graienPaddingX])
  const fullBorderY = linkListPush([border, graienPaddingY])
  const edgeOvershot = linkListPush({ r: 1, useSize: framePadding, a: -1 })
  const edgeOvershotNeg = linkListPush(sub(edgeOvershot))
  const edgeSize = linkListPush([mult(2, edgeOvershot), frameWidth])
  const imgWidth = linkListPush([sXMain, { useSize: fullBorderX, r: -2 }])
  const imgHeight = linkListPush([sYMain, { useSize: fullBorderY, r: -2 }])
  const backWidth = linkListPush([sXMain, { useSize: border, r: -2 }])
  const backHeight = linkListPush([sYMain, { useSize: border, r: -2 }])

  const backSquare = linkListPush(
    getSmallerDim({ r: 1, useSize: [backWidth, backHeight] }),
  )

  const imgSquare = linkListPush(
    getSmallerDim({ r: 1, useSize: [imgWidth, imgHeight] }),
  )

  const imgSquareBigger = linkListPush(
    getBiggerDim({ r: 1, useSize: [imgWidth, imgHeight] }),
  )

  // BORDER DETAILS
  const borderMargin = linkListPush({ r: 0.1, useSize: border, min: 1 })

  const frameDetailSize = linkListPush({
    min: 1,
    add: [frameWidth, mult(-2, borderMargin), -2],
  })

  // BACKGROUND
  const groundHeight = linkListPush(mult(0.2, backHeight))

  const hillHeight = linkListPush({
    r: 0.05,
    useSize: backHeight,
    add: [mult(0.1, backWidth)],
  })

  const hillDifference = linkListPush({ r: 0.4, useSize: backHeight })

  const hillWidth = linkListPush({
    r: 0.1,
    useSize: backWidth,
    add: [mult(0.1, backSquare)],
  })

  const treeWidth = linkListPush({ a: 2 })

  const treeMinGap = linkListPush({
    r: 0.005,
    useSize: backWidth,
    add: [{ r: 0.02, useSize: backHeight }],
    min: 1,
  })

  const treeRandomGap = linkListPush(mult(10, treeMinGap))
  const treeRandomGap2 = linkListPush(mult(15, treeMinGap))
  const trunkWidth = linkListPush(mult(3, treeMinGap))
  // BREAD
  /** Adds a little bit to each side of the bread to make it more rect ) */
  const breadAdd = linkListPush({ r: 0.05, a: 2, useSize: imgSquare })

  const breadWidth = linkListPush([
    breadAdd,
    { r: 0.08, min: 3, useSize: sXMain },
  ])

  const breadHeight = linkListPush([
    breadAdd,
    { r: 0.08, useSize: sYMain, min: 3 },
  ])

  const breadSquare = linkListPush(
    getSmallerDim({ r: 1, useSize: [breadWidth, breadHeight] }),
  )

  const breadDetail = linkListPush({ r: 0.15, useSize: breadSquare })
  // FULL GRAIEN
  const graieHalfWidth = linkListPush(mult(0.5, imgWidth))
  const graieHeight = linkListPush(imgHeight)
  const graieHalfHeight = linkListPush(mult(0.5, imgHeight))
  // HAND
  const handWidth = linkListPush({ r: 0.08, useSize: imgSquare, min: 2 })
  const fingerLength = linkListPush(mult(0.2, handWidth))
  const armWidth = linkListPush({ r: 0.05, useSize: imgSquare, a: -1, min: 1 })
  const armDetailLength = linkListPush(mult(2.5, armWidth))
  const handArmDifference = linkListPush([handWidth, sub(armWidth)])
  const handToBreadSub = linkListPush({ useSize: handWidth, r: -0.3 })
  const handToBread = linkListPush(sub(handToBreadSub))

  const graieArmLengt = linkListPush([
    graieHalfWidth,
    mult(-0.5, breadWidth, -1),
    handWidth,
    handToBreadSub,
  ])

  const graieArmLengtDown = linkListPush([
    graieHalfHeight,
    mult(-0.5, breadHeight),
    handWidth,
    handToBreadSub,
  ])

  const armShadow = linkListPush({ r: 0.4, max: 1, useSize: armWidth })
  const subArmWidth = linkListPush([sub(armWidth), 1])
  // LEG
  const legWidth = linkListPush({ r: 0.15, useSize: imgSquare, a: -1, min: 1 })
  const legLowerWidth = linkListPush({ r: 0.07, useSize: imgSquare, min: 1 })
  const legDetailWidth = linkListPush(mult(0.5, legWidth))
  const footFrontLength = linkListPush({ r: 0.1, useSize: imgSquare, min: 1 })
  const footLength = linkListPush([footFrontLength, legLowerWidth, 1])
  const footWidth = linkListPush({ r: 0.08, useSize: imgSquare, min: 1 })
  const legBack = linkListPush({ r: 0.2, useSize: legLowerWidth, max: 1 })
  const moveFootBack = linkListPush(sub(legBack))
  const toeSize = linkListPush({ r: 0.2, useSize: footWidth })
  const fingerSize = linkListPush({ add: [toeSize, -1], min: 1 })
  const subLegLowerWidth = linkListPush([sub(legLowerWidth), 1])
  // GRAIE I
  const graie1ShoulderHeight = linkListPush(mult(0.6, imgHeight))
  const graie1ToTop = linkListPush([imgHeight, sub(graie1ShoulderHeight)])
  const graie1ToLeft = linkListPush([footWidth, { r: 0.01, useSize: imgWidth }])

  const graie1Width = linkListPush(
    getSmallerDim({
      r: 0.15,
      r2: 0.6,
      useSize: [imgWidth, imgHeight],
    }),
  )

  const graie1LegHeight = linkListPush([
    legWidth,
    legLowerWidth,
    footFrontLength,
  ])

  const graie1TorsoHeight = linkListPush([
    graie1ShoulderHeight,
    sub(graie1LegHeight),
  ])

  const graie1ArmHeight = linkListPush(mult(0.3, imgHeight))
  const graie1BreadArmPos = linkListPush(graieHalfHeight)
  const graie1RightSide = linkListPush([graie1Width, graie1ToLeft])
  const graie1HeadSize = linkListPush(mult(0.18, imgSquare))

  const graie1HeadHeight = linkListPush({
    add: [mult(2, graie1HeadSize), mult(-0.03, imgWidth)],
    min: 3,
    max: [graie1ToTop, -1],
  })

  const graie1HeadWidth = linkListPush({
    add: [graie1HeadSize, mult(-0.02, imgHeight)],
    min: 2,
    max: graie1Width,
  })

  const graie1ShoulderWidth = linkListPush([graie1Width, sub(graie1HeadWidth)])
  const graie1HeadPos = linkListPush(mult(0.3, graie1ShoulderWidth))

  const graie1HairLeftWidth = linkListPush({
    r: 0.25,
    min: 1,
    useSize: graie1HeadWidth,
  })

  const graie1FaceWidth = linkListPush([
    graie1HeadWidth,
    sub(graie1HairLeftWidth),
  ])

  const graie1NosePos = linkListPush(mult(0.5, graie1HeadHeight))
  // Eyes
  const minEyesWidth = linkListPush({ r: 0.8, useSize: graie1FaceWidth })

  const graie1eyeWidth = linkListPush({
    r: 0.3,
    useSize: minEyesWidth,
    min: 1,
    max: { r: 0.5, a: -1, useSize: graie1FaceWidth },
  })

  const graie1eyesWidth = linkListPush({
    add: [
      mult(2, graie1eyeWidth),
      { r: 0.05, useSize: graie1FaceWidth, min: 0 },
      { r: 0.2, useSize: graie1FaceWidth, max: 1 },
    ],
    max: graie1FaceWidth,
    min: { r: 2, useSize: graie1eyeWidth, min: 3 },
  })

  const graie1faceRest = linkListPush([graie1FaceWidth, sub(graie1eyesWidth)])

  const graie1eyePosLeft = linkListPush({
    r: 0.5,
    useSize: graie1faceRest,
    min: 0,
  })

  const graie1eyeHeight = linkListPush({
    add: [graie1NosePos, { r: -0.1, useSize: graie1HeadHeight }],
    min: 1,
  })

  const graie1eyePosTop = linkListPush([graie1NosePos, sub(graie1eyeHeight)])
  const graie1NoseHeight = linkListPush(mult(0.8, armWidth))

  const graie1MouthOuterPart = linkListPush({
    r: 0.1,
    useSize: graie1eyesWidth,
    min: 1,
  })

  const graie1MouthInnerPart = linkListPush(mult(0.3, graie1eyesWidth))
  const graie1BreastWidth = linkListPush({ useSize: graie1Width, r: 0.3 })

  const graie1BreastMargin = linkListPush({
    useSize: graie1Width,
    r: 0.2,
    a: -1,
  })

  const graie1BreastShadow = linkListPush({
    useSize: graie1BreastWidth,
    r: 0.3,
    max: 1,
  })

  const graie1NippleHeight = linkListPush({
    useSize: graie1BreastWidth,
    r: 0.2,
    min: 2,
  })

  const graie1BreadArmLength = linkListPush([
    graie1ShoulderHeight,
    mult(-0.52, graieHeight),
    armWidth,
  ])

  // GRAIE II
  const graie2ToLeft = linkListPush(
    getSmallerDim({ r: 0.35, r2: 4, useSize: [imgWidth, imgHeight] }),
  )

  const graie2ToRight = linkListPush(mult(0.3, imgWidth))

  const graie2Width = linkListPush([
    imgWidth,
    sub(graie2ToLeft),
    sub(graie2ToRight),
  ])

  const graie2BodyHeight = linkListPush(mult(0.2, imgHeight))
  const graie2HeadHeight = linkListPush({ r: 0.8, useSize: graie2BodyHeight })

  const graie2HeadWidth = linkListPush({
    r: 1.5,
    useSize: graie2HeadHeight,
    max: { r: 0.5, useSize: graie2Width },
  })

  const graie2LegLength = linkListPush([mult(0.32, graieHalfHeight)])

  const graie2ArmLength = linkListPush([
    imgHeight,
    sub(graie1BreadArmPos),
    sub(armWidth),
    -1,
  ])

  const graie2LegPos = linkListPush([
    mult(0.05, graie2Width),
    mult(-0.005, imgHeight),
    armWidth,
  ])

  const graie2graie1Dist = linkListPush([graie2ToLeft, sub(graie1RightSide)])
  const graie2ArmToArmWidth = linkListPush(mult(0.5, graie2graie1Dist))

  const graie2HeadShadow = linkListPush({
    r: 0.15,
    useSize: graie2HeadHeight,
    max: 1,
  })

  const graie1LegLength = linkListPush([
    graie1Width,
    mult(0.5, graie2graie1Dist),
    mult(0.1, imgHeight),
  ])

  const graie1ArmRest = linkListPush([
    graie1RightSide,
    graie2ToRight,
    graie2LegPos,
    legLowerWidth,
    1,
  ])

  const graie1ArmLength = linkListPush([imgWidth, mult(-1, graie1ArmRest)])
  // GRAIE III
  const graie3ShoulderHeight = linkListPush(mult(0.75, imgHeight))
  const graie3ToTop = linkListPush([imgHeight, sub(graie3ShoulderHeight)])

  const graie3GripPoint = linkListPush([
    graie2BodyHeight,
    mult(0.05, imgHeight),
  ])

  const graie3ToRight = linkListPush(
    getSmallerDim({ r: 0.1, r2: 0.5, useSize: [imgWidth, imgHeight] }),
  )

  const graie3Width = linkListPush(graie1Width)
  const graie3LegLength = linkListPush([graie2LegLength, mult(0.2, imgHeight)])
  const graie3LegHeight = linkListPush([graie3LegLength, footFrontLength])

  const graie3TorsoHeight = linkListPush([
    graie3ShoulderHeight,
    sub(graie3LegHeight),
  ])

  const graie3lowerLegLength = linkListPush([
    graie3ToRight,
    graie3Width,
    sub(legWidth),
  ])

  const graie3BehindLegLength = linkListPush([
    graie2ToRight,
    graie2LegPos,
    mult(2, legLowerWidth),
    sub(graie3ToRight),
    1,
  ])

  const graie3HeadHeight = linkListPush({
    add: [graie1HeadHeight, -1],
    max: [graie3ToTop, -1],
  })

  const graie3HeadWidth = linkListPush({ r: 1, useSize: graie3Width })

  const graie3NeckHeight = linkListPush({
    r: 0.6,
    useSize: graie3HeadHeight,
    add: [mult(-0.1, graie3HeadWidth), 1],
  })

  const graie3FaceHeight = linkListPush([
    sub(graie3NeckHeight),
    1,
    graie3HeadHeight,
  ])

  const graie3EarSize = linkListPush(mult(0.3, graie3FaceHeight))
  const graie3EarPos = linkListPush(mult(0.1, graie3FaceHeight))

  const graienValues = function (
    what: InputDynamicVariableBase & LinkPrepared,
    faktor: number,
    value: number,
  ): void {
    setValue(what, faktor * value * 2 + value * 0.2)
  }

  const doHover = function (args: {
    a?: number
    b?: number
    c?: number
    d?: number
  }): void {
    if (args.a) {
      graienValues(handWidth, args.a, 0.07)

      graienValues(armWidth, args.a, 0.05)

      graienValues(legWidth, args.a, 0.15)

      graienValues(legLowerWidth, args.a, 0.07)
    }

    if (args.b) {
      graienValues(graie1HeadSize, args.b, 0.18)

      graienValues(graie2HeadHeight, args.b, 0.8)
    }

    if (args.c || args.d) {
      if (args.c) {
        graie1[0] = args.c * 227

        graie2[0] = args.c * 192

        graie3[0] = args.c * 232
      }

      if (args.d) {
        graie1[1] = args.d * 200

        graie2[1] = args.d * 176

        graie3[1] = args.d * 204
      }

      if (args.c && args.d) {
        graie1[2] = (0.5 + args.c * args.d * 0.5) * 190

        graie2[2] = (0.5 + args.c * args.d * 0.5) * 133

        graie3[2] = (0.5 + args.c * args.d * 0.5) * 152
      }

      graie1Shadow = shadow(graie1, graie1Shadow)

      graie1Detail = detail(graie1, graie1Detail)

      graie2Shadow = shadow(graie2, graie2Shadow)

      graie2Detail = detail(graie2, graie2Detail)

      graie3Shadow = shadow(graie3, graie3Shadow)

      graie3Detail = detail(graie3, graie3Detail)
    }
  }

  const getShadow = function (nr: 1 | 2 | 3): ColorRgb {
    return nr === 1 ? graie1Shadow : nr === 2 ? graie2Shadow : graie3Shadow
  }

  const getSkin = function (nr: 1 | 2 | 3): ColorRgb {
    return nr === 1 ? graie1 : nr === 2 ? graie2 : graie3
  }

  const graie1Eye: ReadonlyArray<Tool> = [
    {
      color: graie1Shadow,
      sY: { r: 0.05, max: 1 },
      fX: true,
      sX: { r: 1, a: 1 },
      y: { r: -0.1, a: 1, min: -1 },
    },
    // eyeBrow
    { fY: true, sY: { a: -2, r: 1, min: 1 } },
    { fX: true, sY: { a: -2, r: 1 }, y: 1, sX: { r: 0.7 } },
    { fX: true, sY: { a: -2, r: 1 }, sX: { r: 0.4 } },
  ]

  const breast = function (left?: boolean): ReadonlyArray<Tool | undefined> {
    return [
      {},
      {
        color: graie1Shadow,
        sY: { r: 0.3, max: 1, otherDim: true },
        tY: true,
        x: 1,
        sX: { r: 1, a: -2 },
        fY: true,
      },
      // shadow
      { color: graie1Shadow, sX: graie1BreastShadow },
      // shadow
      {
        color: graie1Detail,
        sX: { r: 0.4, min: 1 },
        sY: graie1NippleHeight,
        fY: true,
        fX: true,
        y: -1,
        cX: true,
      },
      // Nipples
      {
        fX: true,
        fY: true,
        color: graie1Shadow,
        sX: { r: 0.2, max: 1 },
        sY: left ? undefined : 1,
      },
      left
        ? undefined
        : {
            tX: true,
            sY: armShadow,
            color: graie1Shadow,
            sX: graie1BreastMargin,
          },
    ]
  }

  const foot = function (
    hor: boolean,
    down: boolean,
    fX: boolean,
    nr: 1 | 2 | 3,
  ): ReadonlyArray<Tool | undefined> {
    const shadow = getShadow(nr)
    const withoutToes: InputDynamicVariable = { r: 1, add: [sub(toeSize)] }
    const anklePos: InputDynamicVariable = { r: 0.5, useSize: legLowerWidth }
    const ankleSize: InputDynamicVariable = { r: 0.6, useSize: legLowerWidth }
    const ankleWidth: InputDynamicVariable = { r: 1, a: -1 }
    const ankleHeight: InputDynamicVariable = { r: 1, a: -2 }

    return [
      {
        sX: !hor ? withoutToes : undefined,
        sY: hor ? withoutToes : undefined,
        fY: !down,
      },
      !down ? { sY: armShadow, color: shadow, fY: true } : undefined,
      {
        stripes: { gap: 1, horizontal: !hor, strip: toeSize },
        sX: !hor ? toeSize : undefined,
        sY: hor ? toeSize : undefined,
        fX: true,
        fY: down,
      },
      hor && down
        ? {
            stripes: {
              gap: 1,
              horizontal: !hor,
              strip: toeSize,
            },
            color: shadow,
            sY: 1,
            fX: true,
            fY: down,
          }
        : undefined,
      {
        sX: armShadow,
        color: shadow,
        fY: true,
        sY: down && !fX ? [footFrontLength, 1] : undefined,
      },
      !hor
        ? {
            sY: armShadow,
            color: shadow,
            fY: true,
            fX: true,
            sX: [footFrontLength, sub(toeSize)],
            x: toeSize,
          }
        : undefined,
      !hor
        ? {
            stripes: {
              horizontal: true,
              strip: 1,
              gap: toeSize,
            },
            color: shadow,
            sX: toeSize,
            fX: true,
            y: [toeSize, -1],
          }
        : undefined,
      {
        minX: 3,
        sX: ankleSize,
        sY: ankleSize,
        cX: hor,
        cY: !hor,
        y: hor ? anklePos : undefined,
        x: !hor ? anklePos : undefined,
        fY: !down,
        list: [
          { color: shadow },
          {
            sX: hor ? ankleWidth : ankleHeight,
            cY: hor,
            cX: !hor,
            sY: !hor ? ankleWidth : ankleHeight,
            fY: !hor,
            fX: hor && fX,
          },
        ],
      },
    ]
  }

  const legStructure = (function () {
    let i = 0

    const s: InputDynamicVariable = { a: 0, random: legDetailWidth }
    const armSize: InputDynamicVariable = { a: 0, random: armDetailLength }

    return function (nr: 1 | 2 | 3, hor?: boolean, arm?: boolean): Tool {
      const shadow = getShadow(nr)

      hor = arm ? !hor : hor

      return {
        list: [
          {},
          {
            use: 'graieLeg' + i,
            chance: 0.1,
            mask: true,
            color: shadow,
            sX: hor ? (arm ? armSize : s) : undefined,
            sY: !hor ? (arm ? armSize : s) : undefined,
          },
          {
            save: 'graieLeg' + i++,
            minX: hor ? 0 : 3,
          },
        ],
      }
    }
  })()

  const armToLeft = function (
    nr: 1 | 2 | 3,
    down?: boolean,
  ): ReadonlyArray<Tool> {
    const shadow = getShadow(nr)

    return [
      legStructure(nr, false, true),
      { sY: armShadow, color: shadow, fY: true },
      {
        sX: handWidth,
        sY: handWidth,
        fX: true,
        cY: true,
        list: [
          {},
          {
            stripes: {
              strip: fingerSize,
              gap: 1,
              horizontal: true,
            },
            x: 1,
            fX: true,
            sX: 1,
            color: shadow,
          },
          {
            stripes: {
              strip: fingerSize,
              gap: 1,
              horizontal: true,
            },
            tX: true,
            fX: true,
            sX: fingerLength,
          },
          {
            sX: handToBread,
            sY: [handToBread, 2],
            tY: true,
            fY: down,
            rY: down,
            y: 1,
            list: [
              {
                closed: true,
                points: [{ fX: true }, { fY: true }, { fY: true, fX: true }],
              },
            ],
          },
          {
            sY: armShadow,
            color: shadow,
            fY: true,
            sX: down ? [handToBreadSub, { r: 1 }] : undefined,
            fX: true,
          },
        ],
      },
    ]
  }

  const skinPoint = function (nr: 1 | 2 | 3, big: boolean, obj?: Tool): Tool {
    const shadow = getShadow(nr)
    const skin = getSkin(nr)

    if (!obj) {
      obj = {}
    }

    obj.list = [{ color: shadow }, { s: { r: 1, a: -2 }, color: skin, c: true }]

    obj.sY = big ? { r: 0.1, a: -1, max: 4 } : { r: 0.02, max: 1 }

    obj.sX = big ? { r: 0.1, a: -1, otherDim: true, max: 4 } : 1

    return obj
  }

  const graieEyes = function (): ReadonlyArray<Tool> {
    return [
      { sY: { r: 1, a: -1, min: 1 }, sX: { r: 1, a: -1, min: 1 } },
      {
        sY: { r: 1, a: -1 },
        sX: { r: 1, a: -1 },
        fY: true,
        fX: true,
      },
    ]
  }

  const graie3butt: ReadonlyArray<Tool> = [
    {},
    { name: 'Dot', fY: true, color: graie3Shadow },
  ]

  const borderVert: ReadonlyArray<Tool> = [
    {},
    {
      stripes: { gap: 1, strip: frameDetailSize },
      sY: frameDetailSize,
      color: backgroundDark,
      sX: { r: 0.5 },
      cY: true,
    },
    {
      stripes: { gap: 1, strip: frameDetailSize },
      sY: frameDetailSize,
      color: backgroundDark,
      sX: { r: 0.5 },
      x: -1,
      fX: true,
      cY: true,
    },
  ]

  const borderHor: ReadonlyArray<Tool> = [
    {},
    {
      stripes: { gap: 1, strip: frameDetailSize, horizontal: true },
      sX: frameDetailSize,
      color: backgroundDark,
      cX: true,
    },
  ]

  const bottomEdge: ReadonlyArray<Tool> = [
    {},
    { color: backgroundDark, m: 1 },
    {
      fX: true,
      s: [edgeOvershot, 1],
      minX: 2,
      list: [
        {},
        {
          tX: true,
          tY: true,
          sX: frameDetailSize,
          y: 1,
          sY: { r: 1, a: 1 },
          list: [
            {},
            { y: 1, sX: 1, color: backgroundDark },
            { y: 1, sX: 1, fX: true, color: backgroundDark },
          ],
        },
        {
          fY: true,
          fX: true,
          tX: true,
          tY: true,
          sY: frameDetailSize,
          sX: { r: 1, a: 1 },
          x: 1,
          list: [
            {},
            { x: -1, sY: 1, color: backgroundDark },
            { x: -1, sY: 1, color: backgroundDark, fY: true },
          ],
        },
        { fY: true, tY: true, tX: true, s: { r: 3, a: -6 } },
      ],
    },
  ]

  const renderList: ReadonlyArray<Tool> = [
    // ---- FRAME ----------------
    {
      mX: framePadding,
      mY: framePadding,
      list: [
        // ---- IMAGE ----------------
        {
          mX: frameWidth,
          mY: frameWidth,
          list: [
            // Ground
            {
              sY: groundHeight,
              color: backgroundDark,
              fY: true,
            },

            // Hill
            {
              sY: hillHeight,
              y: groundHeight,
              color: backgroundMedium,
              fY: true,
              stripes: {
                strip: hillWidth,
                random: hillDifference,
              },
            },

            // Trees
            {
              sY: [backHeight, sub(groundHeight), sub(hillHeight)],
              x: mult(0.3, treeRandomGap),
              stripes: {
                strip: treeWidth,
                gap: {
                  random: treeRandomGap,
                  add: [treeMinGap],
                },
              },
              color: backgroundMedium,
              list: [
                {},
                {
                  sX: 1,
                  sY: { r: 0.3 },
                  stripes: {
                    gap: 1,
                    random: trunkWidth,
                    horizontal: true,
                  },
                },
                {
                  y: -1,
                  sX: 1,
                  sY: { r: 0.3 },
                  stripes: {
                    gap: 1,
                    random: trunkWidth,
                    horizontal: true,
                  },
                  fX: true,
                },
              ],
            },

            {
              sY: [backHeight, sub(groundHeight), sub(hillHeight)],
              x: sub(treeWidth),
              stripes: {
                strip: treeWidth,
                gap: {
                  random: treeRandomGap2,
                  add: [treeMinGap],
                },
              },
              color: backgroundMedium,
            },

            // ---- FOREGROUND ----------------
            {
              mX: graienPaddingX,
              mY: graienPaddingY,
              y: -1,
              list: [
                // ---- GRAIE I BACK ----------------

                // ---- GRAIE III BACK ----------------
                {
                  color: graie3,
                  sX: graieHalfWidth,
                  sY: graieHeight,
                  fX: true,
                  list: [
                    // Leg
                    {
                      sY: graie3LegHeight,
                      x: graie3ToRight,
                      fX: true,
                      fY: true,
                      list: [
                        // Leg bend
                        {
                          sX: graie3BehindLegLength,
                          sY: legWidth,
                          fX: true,
                          list: [
                            legStructure(3),
                            {
                              fX: true,
                              tX: true,
                              mY: 1,
                              sX: 1,
                              list: graie3butt,
                            },
                            {
                              fX: true,
                              tX: true,
                              mY: 2,
                              sX: 1,
                              x: -1,
                              list: graie3butt,
                            },
                            {
                              sY: armShadow,
                              color: graie3Shadow,
                              fY: true,
                              fX: true,
                              sX: [subLegLowerWidth, { r: 1 }],
                            },
                            {
                              sX: armShadow,
                              color: graie3Shadow,
                            },

                            {
                              sX: legLowerWidth,
                              sY: [graie3LegLength, sub(legWidth)],
                              fY: true,
                              tY: true,
                              list: [
                                legStructure(3, true),
                                {
                                  sX: armShadow,
                                  color: graie3Shadow,
                                },
                              ],
                            },
                          ],
                        },

                        // Leg kneeling
                        {
                          sY: graie3LegLength,
                          fX: true,
                          x: [graie3Width, sub(legWidth)],
                          list: [
                            {
                              sX: legWidth,
                              fX: true,
                              list: [
                                legStructure(3, true),
                                {
                                  sX: armShadow,
                                  color: graie3Shadow,
                                },
                              ],
                            },

                            {
                              sX: graie3lowerLegLength,
                              sY: legLowerWidth,
                              tX: true,
                              fX: true,
                              fY: true,
                              list: [
                                {
                                  sX: {
                                    r: 1,
                                    add: [legWidth],
                                  },
                                  fX: true,
                                  list: [
                                    legStructure(3),
                                    {
                                      sY: armShadow,
                                      color: graie3Shadow,
                                      fY: true,
                                    },
                                    {
                                      sX: armShadow,
                                      color: graie3Shadow,
                                      fY: true,
                                    },
                                  ],
                                },

                                // Foot
                                {
                                  sY: footLength,
                                  sX: footWidth,
                                  fX: true,
                                  y: moveFootBack,
                                  list: foot(true, true, false, 3),
                                },

                                // [
                                // 	{},
                                // 	{ sY: armShadow, color: graie3Shadow, fY: true },
                                // 	{ sX: armShadow, sY: footFrontLength, fY: true, color: graie3Shadow }
                                // ] }
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                // end graie III

                // ---- GRAIE II BACK ----------------
                {
                  color: graie2,
                  sX: graie2Width,
                  x: graie2ToLeft,
                  sY: graieHalfHeight,
                  fY: true,
                  list: [
                    // Bend Leg
                    {
                      sY: {
                        add: [graie2LegLength, graie2BodyHeight],
                        min: [graie1LegHeight, legLowerWidth, 1],
                      },
                      fY: true,
                      list: [
                        {
                          sX: legWidth,
                          list: [
                            // Upper Leg
                            legStructure(2, true),
                            {
                              sX: armShadow,
                              sY: {
                                r: 1,
                                add: [subLegLowerWidth],
                              },
                              fY: true,
                              color: graie2Shadow,
                            },
                          ],
                        },
                        {
                          sY: legLowerWidth,
                          sX: graie2ToLeft,
                          tX: true,
                          list: [
                            // Lower Leg
                            legStructure(2),
                            {
                              sY: armShadow,
                              sX: {
                                r: 1,
                                a: 1,
                              },
                              color: graie2Shadow,
                              fY: true,
                            },

                            // Foot
                            {
                              sY: footLength,
                              y: moveFootBack,
                              sX: footWidth,
                              fY: true,
                              list: foot(true, false, true, 2),
                            },

                            // [
                            // 	{},
                            // 	{ sX: armShadow, color: graie2Shadow },
                            // 	{ sY: armShadow, fY: true, color: graie2Shadow }
                            // ] }
                          ],
                        },
                      ],
                    },

                    // Body
                    {
                      sY: graie2BodyHeight,
                      fY: true,
                      list: [
                        {},
                        {
                          color: graie2Shadow,
                          sX: { r: 0.1 },
                          x: { r: 0.1 },
                          cY: true,
                          sY: { r: 0.1 },
                          fY: true,
                          stripes: {
                            random: { r: 0.2 },
                            gap: 1,
                          },
                        },
                        {
                          color: graie2Shadow,
                          sX: { r: 0.1 },
                          x: { r: 0.1 },
                          cY: true,
                          sY: { r: 0.1 },
                          stripes: {
                            random: { r: 0.2 },
                            gap: 1,
                          },
                        },
                        {
                          sX: armShadow,
                          y: armWidth,
                          fY: true,
                          color: graie2Shadow,
                        },
                        {
                          fY: true,
                          sY: armShadow,
                          color: graie2Shadow,
                        },
                        {
                          y: { r: 0.08 },
                          sY: { r: 0.1, max: 1 },
                          color: graie2Shadow,
                          x: { r: 0.2 },
                          sX: { r: 0.7 },
                        },
                        {
                          fY: true,
                          x: {
                            r: 0.2,
                            a: -1,
                            min: 1,
                          },
                          sX: { r: 0.55 },
                          sY: { r: 0.85, a: -2 },
                          y: 2,
                          list: [
                            {
                              color: graie2Shadow,
                              fX: true,
                              sX: { r: 0.7 },
                              stripes: {
                                horizontal: true,
                                gap: 1,
                                random: {
                                  r: -0.1,
                                },
                              },
                            },
                            {
                              fX: true,
                              sX: { r: 0.5 },
                              list: [
                                {},
                                {
                                  sX: armShadow,
                                  color: graie2Shadow,
                                },
                              ],
                            },
                            {
                              sY: { r: 0.6 },
                              list: [
                                {},
                                {
                                  sX: armShadow,
                                  color: graie2Shadow,
                                  x: -1,
                                  mY: 1,
                                },
                                {
                                  sY: armShadow,
                                  color: graie2Shadow,
                                },
                                {
                                  sY: armShadow,
                                  fY: true,
                                  sX: {
                                    r: 0.5,
                                  },
                                  color: graie2Shadow,
                                },
                                {
                                  color: graie2Detail,
                                  sY: {
                                    r: 0.3,
                                  },
                                  sX: {
                                    r: 0.25,
                                    otherDim: true,
                                  },
                                  tX: true,
                                  cY: true,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                // end graie II

                // ---- BREAD ---------------------------------------------------------------------------------------------------------------------------
                {
                  color: bread,
                  sX: breadWidth,
                  sY: breadHeight,
                  c: true,
                  list: [
                    {
                      name: 'RoundRect',
                      x: -1,
                      sX: { r: 1, a: 1 },
                      sY: { r: 1, a: 1 },
                      color: breadDark,
                    },
                    { name: 'RoundRect' },
                    {
                      minX: breadHeight,
                      color: breadDark,
                      list: [
                        {
                          stripes: {
                            strip: breadDetail,
                            gap: breadDetail,
                          },
                          m: breadDetail,
                        },
                      ],
                    },
                    {
                      color: breadDark,
                      list: [
                        {
                          stripes: {
                            strip: breadDetail,
                            gap: breadDetail,
                          },
                          m: breadDetail,
                        },
                      ],
                    },
                  ],
                },
                // end bread ------------------------------------------------------------------------------------------------------------------------

                // ---- GRAIE I Front ----------------
                {
                  color: graie1,
                  sX: graieHalfWidth,
                  sY: graieHeight,
                  list: [
                    // Upper Body
                    {
                      sY: graie1TorsoHeight,
                      y: graie1ToTop,
                      list: [
                        // Torso
                        {
                          sX: graie1Width,
                          x: graie1ToLeft,
                          list: [
                            // Chest
                            {
                              sX: {
                                r: 1,
                                a: -1,
                              },
                            },
                            {
                              sX: armShadow,
                              color: graie1Shadow,
                            },

                            {
                              color: graie1Shadow,
                              stripes: {
                                strip: 1,
                                gap: 1,
                                horizontal: true,
                                random: {
                                  r: -0.2,
                                },
                              },
                              sX: mult(0.2, graie1Width),
                              sY: {
                                r: 0.8,
                                max: {
                                  r: 2,
                                  a: 5,
                                  otherDim: true,
                                },
                              },
                              minX: 3,
                              x: [
                                mult(2, graie1BreastWidth),
                                graie1BreastMargin,
                              ],
                              fX: true,
                            },

                            // Left Breast
                            {
                              sX: graie1BreastWidth,
                              x: [graie1BreastWidth, graie1BreastMargin],
                              y: armWidth,
                              sY: { r: 0.8 },
                              fX: true,
                              list: breast(true),
                            },

                            // Right Breast
                            {
                              sX: graie1BreastWidth,
                              sY: { r: 0.65 },
                              y: armWidth,
                              fX: true,
                              list: breast(),
                            },
                            {
                              sY: armWidth,
                              sX: graie1BreastWidth,
                              fX: true,
                            },

                            {
                              color: graie1Shadow,
                              x: 2,
                              y: {
                                r: 0.65,
                                add: [armWidth, 2],
                              },
                              stripes: {
                                strip: 1,
                                gap: 1,
                                horizontal: true,
                                random: {
                                  r: -0.2,
                                },
                              },
                              sX: mult(0.2, graie1Width),
                              sY: {
                                r: 0.2,
                                max: 6,
                              },
                              minX: 3,
                              fX: true,
                            },

                            // Shoulder
                            {
                              sY: armWidth,
                              sX: [
                                graie1ToLeft,
                                [
                                  graie1Width,
                                  sub(armWidth),
                                  sub(graie1BreastWidth),
                                  sub(graie1BreastWidth),
                                  sub(graie1BreastMargin),
                                ],
                              ],
                              x: [sub(graie1ToLeft), armWidth],
                              list: [
                                legStructure(1, false, true),
                                {
                                  sY: armShadow,
                                  color: graie1Shadow,
                                  fY: true,
                                },
                              ],
                            },

                            // Arm to Leg
                            {
                              sX: armWidth,
                              sY: graie1ArmHeight,
                              tY: true,
                              fX: true,
                              list: [
                                legStructure(1, true, true),
                                {
                                  sX: armShadow,
                                  color: graie1Shadow,
                                },
                                {
                                  sY: armWidth,
                                  sX: graie1ArmLength,
                                  tX: true,
                                  fX: true,
                                  list: armToLeft(1),
                                },
                              ],
                            },

                            // Head
                            {
                              sX: graie1HeadWidth,
                              sY: graie1HeadHeight,
                              x: graie1HeadPos,
                              tY: true,
                              fX: true,
                              list: [
                                {
                                  color: hair,
                                  sY: {
                                    r: 1.3,
                                  },
                                  fX: true,
                                  sX: 1,
                                },
                                // Right Hair
                                {
                                  color: hair,
                                  sY: {
                                    r: 0.3,
                                  },
                                  y: {
                                    r: 0.15,
                                  },
                                  x: 1,
                                  fX: true,
                                  fY: true,
                                  tY: true,
                                  sX: {
                                    r: 0.05,
                                    max: 1,
                                  },
                                },

                                {},
                                skinPoint(1, false, {
                                  x: {
                                    r: 0.1,
                                  },
                                  y: {
                                    r: 0.2,
                                  },
                                  fX: true,
                                }),
                                // skin Point
                                skinPoint(1, true, {
                                  x: {
                                    r: 0.4,
                                  },
                                  y: {
                                    r: 0.1,
                                  },
                                  fY: true,
                                }),

                                {
                                  color: graie1Shadow,
                                  sY: 1,
                                  sX: 1,
                                  x: 1,
                                  y: {
                                    r: 0.15,
                                  },
                                  fX: true,
                                  fY: true,
                                },
                                // Chin Shadow
                                {
                                  color: graie1Shadow,
                                  sY: {
                                    r: 0.15,
                                  },
                                  y: {
                                    r: 0.15,
                                  },
                                  x: 2,
                                  fX: true,
                                  fY: true,
                                  tY: true,
                                  sX: 1,
                                },
                                {
                                  color: graie1Shadow,
                                  sY: 1,
                                  y: {
                                    r: 0.15,
                                    a: -2,
                                  },
                                  x: 3,
                                  fX: true,
                                  fY: true,
                                  tY: true,
                                  sX: {
                                    r: 0.3,
                                    a: -2,
                                  },
                                },
                                {
                                  color: graie1Shadow,
                                  sY: 1,
                                  y: {
                                    r: 0.15,
                                    a: -4,
                                  },
                                  x: 3,
                                  fX: true,
                                  fY: true,
                                  tY: true,
                                  sX: {
                                    r: 0.3,
                                    a: -2,
                                  },
                                },
                                {
                                  color: graie1Shadow,
                                  sY: 1,
                                  y: {
                                    r: 0.15,
                                    a: -6,
                                  },
                                  x: 4,
                                  fX: true,
                                  fY: true,
                                  tY: true,
                                  sX: {
                                    r: 0.2,
                                    a: -2,
                                  },
                                },

                                // Eyes
                                {
                                  sX: graie1eyesWidth,
                                  x: [graie1HairLeftWidth, graie1eyePosLeft],
                                  y: graie1eyePosTop,
                                  sY: graie1eyeHeight,
                                  list: [
                                    {
                                      color: graie1Detail,
                                      sX: graie1eyeWidth,
                                      list: graie1Eye,
                                    },
                                    {
                                      color: graie1Detail,
                                      sX: graie1eyeWidth,
                                      rX: true,
                                      fX: true,
                                      list: graie1Eye,
                                    },
                                    {
                                      minX: 7,
                                      list: [
                                        {
                                          sX: {
                                            r: 0.1,
                                            max: 1,
                                          },
                                          color: graie1Shadow,
                                          tX: true,
                                          x: {
                                            r: -0.2,
                                            a: 1,
                                          },
                                          fY: true,
                                          y: -1,
                                          sY: {
                                            r: 0.5,
                                          },
                                        },
                                        {
                                          sY: {
                                            r: 0.1,
                                            max: 1,
                                            otherDim: true,
                                          },
                                          sX: {
                                            r: 0.35,
                                          },
                                          color: graie1Shadow,
                                          x: {
                                            r: -0.2,
                                            a: 1,
                                          },
                                          fY: true,
                                          y: -1,
                                        },
                                        {
                                          sY: {
                                            r: 0.1,
                                            max: 1,
                                            otherDim: true,
                                          },
                                          sX: {
                                            r: 0.35,
                                          },
                                          color: graie1Shadow,
                                          x: {
                                            r: -0.2,
                                            a: 1,
                                          },
                                          fX: true,
                                          fY: true,
                                          y: -1,
                                        },
                                        {
                                          sX: {
                                            r: 0.05,
                                            max: 1,
                                          },
                                          color: graie1Shadow,
                                          tX: true,
                                          x: {
                                            r: -0.1,
                                            min: -1,
                                          },
                                          fY: true,
                                          fX: true,
                                          sY: {
                                            r: 0.3,
                                          },
                                        },
                                      ],
                                    },
                                  ],
                                },

                                // Mouth
                                {
                                  color: graie1Detail,
                                  x: [graie1HairLeftWidth, graie1eyePosLeft],
                                  sX: graie1eyesWidth,
                                  sY: armWidth,
                                  y: [
                                    graie1NosePos,
                                    graie1NoseHeight,
                                    mult(0.02, graie1HeadHeight),
                                  ],
                                  list: [
                                    {
                                      sX: graie1MouthOuterPart,
                                      fY: true,
                                      sY: {
                                        r: 0.8,
                                      },
                                    },
                                    {
                                      x: graie1MouthOuterPart,
                                      sX: graie1MouthInnerPart,
                                      sY: {
                                        r: 0.8,
                                      },
                                    },
                                    {
                                      mX: {
                                        r: 0.35,
                                      },
                                      sY: {
                                        r: 0.8,
                                      },
                                      fY: true,
                                    },
                                    {
                                      x: graie1MouthOuterPart,
                                      sX: graie1MouthInnerPart,
                                      sY: {
                                        r: 0.8,
                                      },
                                      fX: true,
                                    },
                                    {
                                      sX: graie1MouthOuterPart,
                                      fY: true,
                                      sY: {
                                        r: 0.8,
                                      },
                                      fX: true,
                                    },
                                  ],
                                },

                                {
                                  color: hair,
                                  sY: {
                                    r: 1.3,
                                  },
                                  fX: true,
                                  sX: {
                                    r: 0.05,
                                  },
                                },
                                // Right Hair

                                // Nose
                                {
                                  sY: graie1NoseHeight,
                                  sX: [
                                    graie1HeadWidth,
                                    {
                                      r: 0.15,
                                      useSize: imgWidth,
                                    },
                                  ],
                                  x: [
                                    graie1HairLeftWidth,
                                    graie1eyePosLeft,
                                    graie1eyeWidth,
                                  ],
                                  y: graie1NosePos,
                                  list: [
                                    {
                                      sX: 1,
                                      sY: {
                                        r: 1,
                                        a: -1,
                                      },
                                      fY: true,
                                      fX: true,
                                    },
                                    {
                                      sX: {
                                        r: 1,
                                        a: -1,
                                      },
                                      list: [
                                        {},
                                        {
                                          chance: 0.05,
                                          use: 'graie1Nose',
                                          color: graie1Shadow,
                                        },
                                        {
                                          save: 'graie1Nose',
                                        },
                                      ],
                                    },
                                    {
                                      color: graie1Shadow,
                                      fY: true,
                                      sY: {
                                        max: 1,
                                        r: 0.4,
                                      },
                                    },
                                    {
                                      color: graie1Shadow,
                                      sX: 1,
                                      sY: {
                                        r: 1,
                                        a: -1,
                                      },
                                      fY: true,
                                    },
                                  ],
                                },

                                // Hair
                                {
                                  color: hair,
                                  sY: 1,
                                  mX: 1,
                                  y: -1,
                                },
                                // TopHair

                                {
                                  color: hair,
                                  sY: {
                                    r: 1,
                                    add: [graie1BreadArmLength],
                                  },
                                  sX: graie1HairLeftWidth,
                                },
                                // Left Hair
                                {
                                  color: hair,
                                  sY: {
                                    r: 1,
                                    a: -1,
                                  },
                                  y: 1,
                                  sX: {
                                    r: 0.2,
                                  },
                                  tX: true,
                                  list: [
                                    {
                                      points: [
                                        {
                                          fX: true,
                                        },
                                        {
                                          fY: true,
                                        },
                                        {
                                          fY: true,
                                          fX: true,
                                        },
                                      ],
                                    },
                                  ],
                                },
                                // Hair behind Shoulder

                                {
                                  color: hair,
                                  sX: {
                                    r: 0.05,
                                    max: 1,
                                  },
                                  sY: {
                                    r: 0.2,
                                  },
                                  x: {
                                    r: 0.45,
                                  },
                                  y: -2,
                                },
                                // strand
                                {
                                  color: hair,
                                  sX: {
                                    r: 0.05,
                                    max: 1,
                                  },
                                  sY: {
                                    r: 0.07,
                                  },
                                  x: {
                                    r: 0.85,
                                  },
                                },
                                {
                                  color: hair,
                                  sY: {
                                    r: 0.05,
                                    max: 1,
                                  },
                                  sX: {
                                    r: 0.07,
                                  },
                                  y: {
                                    r: 0.3,
                                  },
                                  fX: true,
                                  tX: true,
                                },
                              ],
                            },

                            // Arm to Bread
                            {
                              sY: graie1BreadArmLength,
                              sX: armWidth,
                              x: sub(graie1ToLeft),
                              list: [
                                legStructure(1, true, true),
                                {
                                  list: armToLeft(1),
                                  sX: graieArmLengt,
                                  sY: armWidth,
                                  fY: true,
                                },
                                {
                                  sX: armShadow,
                                  color: graie1Shadow,
                                },
                              ],
                            },
                            // UpperArm
                          ],
                        },
                      ],
                    },

                    // Legs
                    {
                      sY: graie1LegHeight,
                      x: graie1ToLeft,
                      sX: graie1LegLength,
                      fY: true,
                      list: [
                        // Lower Leg
                        {
                          sX: { r: 0.95 },
                          fX: true,
                          list: [
                            {
                              y: legWidth,
                              sY: legLowerWidth,
                              list: [
                                legStructure(1),
                                {
                                  color: graie1Shadow,
                                  fY: true,
                                  sY: armShadow,
                                },
                              ],
                            },

                            // Foot
                            {
                              sY: footLength,
                              sX: footWidth,
                              fY: true,
                              list: foot(true, true, true, 1),
                            },
                          ],
                        },

                        {
                          sY: legWidth,
                          fX: true,
                          sX: { r: 1, a: 1 },
                          list: [
                            legStructure(1),
                            {
                              sY: armShadow,
                              color: graie1Shadow,
                              fY: true,
                              sX: {
                                r: 1,
                                add: [sub(legWidth)],
                              },
                            },
                            // Upper Leg Shadow

                            // Butt
                            {
                              sX: armShadow,
                              color: graie1Shadow,
                              sY: 1,
                            },
                            // Upper Butt Shadow
                            {
                              sX: 1,
                              sY: {
                                r: 1,
                                a: -2,
                              },
                              y: 1,
                              tX: true,
                              list: [
                                {},
                                {
                                  sX: armShadow,
                                  color: graie1Shadow,
                                },
                              ],
                            },

                            // Knee
                            {
                              sX: 1,
                              sY: { r: 0.6 },
                              cY: true,
                              tX: true,
                              fX: true,
                              list: [
                                {},
                                {
                                  color: graie1Shadow,
                                  fY: true,
                                  sY: armShadow,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                // end graie I front

                // ---- GRAIE II FRONT ----------------
                {
                  color: graie2,
                  sX: graie2Width,
                  x: graie2ToLeft,
                  sY: graieHalfHeight,
                  fY: true,
                  list: [
                    // Upright Leg
                    {
                      sY: [imgHeight, sub(graie2BodyHeight)],
                      sX: legLowerWidth,
                      x: graie2LegPos,
                      y: graie2BodyHeight,
                      fX: true,
                      fY: true,
                      list: [
                        legStructure(2, true),
                        {
                          sX: armShadow,
                          color: graie2Shadow,
                        },
                        {
                          sX: footLength,
                          sY: footWidth,
                          x: moveFootBack,
                          list: foot(false, true, true, 2),
                        },

                        // [
                        // 	{},
                        // 	{ color: graie2Shadow, sX: armShadow },
                        // 	{ color: graie2Shadow, sX: footFrontLength, sY: armShadow, fY: true, fX: true },
                        // ] },
                      ],
                    },

                    // Arm to Bread
                    {
                      sX: [graieArmLengt, sub(graie2ToRight)],
                      sY: armWidth,
                      y: mult(-0.5, armWidth),
                      rX: true,
                      fX: true,
                      list: armToLeft(2, true),
                    },
                    {
                      sX: armWidth,
                      sY: {
                        r: 1,
                        add: [sub(graie2BodyHeight)],
                      },
                      fX: true,
                      list: [
                        legStructure(2, true, true),
                        {
                          sX: armShadow,
                          color: graie2Shadow,
                        },
                      ],
                    },

                    // Arm to Arm
                    {
                      sY: armWidth,
                      sX: graie2ArmToArmWidth,
                      fY: true,
                      tX: true,
                      list: [
                        legStructure(2, false, true),
                        {
                          sY: graie2ArmLength,
                          sX: armWidth,
                          fY: true,
                          rY: true,
                          rotate: -90,
                          list: armToLeft(2),
                        },
                        {
                          fY: true,
                          sY: armShadow,
                          color: graie2Shadow,
                        },
                      ],
                    },

                    // Head
                    {
                      sY: graie2HeadHeight,
                      sX: graie2HeadWidth,
                      x: -1,
                      fX: true,
                      fY: true,
                      z: 10,
                      list: [
                        {},
                        {
                          sX: graie2HeadShadow,
                          mY: 1,
                          color: graie2Shadow,
                        },
                        {
                          sY: graie2HeadShadow,
                          mX: 1,
                          color: graie2Shadow,
                        },

                        // Nose
                        {
                          cX: true,
                          tY: true,
                          sX: { r: 0.3 },
                          y: 1,
                          sY: {
                            r: 0.25,
                            otherDim: true,
                          },
                          list: [
                            {},
                            {
                              chance: 0.2,
                              use: 'graie2Nose',
                              color: graie2Shadow,
                            },
                            {
                              save: 'graie2Nose',
                            },
                            {
                              sX: armShadow,
                              color: graie2Shadow,
                            },
                            {
                              sY: graie2HeadShadow,
                              color: graie2Shadow,
                            },
                          ],
                        },

                        // Eyes
                        {
                          color: graie2Detail,
                          y: 2,
                          sX: { r: 0.8 },
                          x: { r: 0.1, min: 1 },
                          sY: {
                            r: 0.15,
                            min: 1,
                            max: {
                              r: 0.21,
                              otherDim: true,
                            },
                          },
                          rY: true,
                          list: [
                            {
                              sX: { r: 0.4 },
                              list: graieEyes(),
                            },
                            {
                              sX: { r: 0.4 },
                              list: graieEyes(),
                              rX: true,
                              fX: true,
                            },
                          ],
                        },

                        {
                          sY: { r: 0.2, min: 1 },
                          sX: {
                            r: 0.15,
                            otherDim: true,
                          },
                          tX: true,
                          y: { r: 0.4 },
                          x: 1,
                          list: [
                            {},
                            {
                              color: graie2Shadow,
                              sY: {
                                r: 0.3,
                                max: 1,
                              },
                              fY: true,
                            },
                          ],
                        },
                        {
                          sY: { r: 0.2, min: 1 },
                          fX: true,
                          sX: {
                            r: 0.15,
                            otherDim: true,
                          },
                          tX: true,
                          y: { r: 0.4 },
                          x: 1,
                          list: [
                            {},
                            {
                              color: graie2Shadow,
                              sY: {
                                r: 0.3,
                                max: 1,
                              },
                              fY: true,
                            },
                          ],
                        },

                        // Folds
                        {
                          use: 'graie2Folds',
                          color: graie2Shadow,
                        },
                        {
                          use: 'graie2Folds',
                          chance: 0.5,
                        },
                        {
                          fY: true,
                          sX: { r: 1, a: -3 },
                          x: 2,
                          stripes: {
                            gap: 2,
                            horizontal: true,
                          },
                          color: graie2Shadow,
                          sY: { r: 0.3 },
                          y: { r: 0.4 },
                          save: 'graie2Folds',
                        },

                        // Hair
                        {
                          stripes: {
                            random: { r: 0.5 },
                          },
                          color: hair,
                          sY: { a: 1 },
                          fY: true,
                        },
                        {
                          color: hair,
                          sY: 1,
                          sX: { r: 2 },
                          cX: true,
                          fY: true,
                          tY: true,
                        },
                      ],
                    },
                  ],
                },
                // end graie II front

                // ---- GRAIE III FRONT ----------------
                {
                  color: graie3,
                  sX: graieHalfWidth,
                  sY: graieHeight,
                  fX: true,
                  list: [
                    // Body
                    {
                      color: graie3,
                      sY: graie3ShoulderHeight,
                      fY: true,
                      list: [
                        // Hair
                        {
                          sX: graie3HeadWidth,
                          sY: graie3HeadHeight,
                          x: [graie3ToRight, -1],
                          fX: true,
                          tY: true,
                          list: [
                            {
                              x: 1,
                              y: -1,
                              sY: { r: 2 },
                              color: hair,
                            },
                          ],
                        },

                        // Upper Arm
                        {
                          sY: armWidth,
                          list: [
                            legStructure(3, false, true),
                            {
                              sX: armShadow,
                              color: graie3Shadow,
                            },
                            {
                              sY: armShadow,
                              fY: true,
                              color: graie3Shadow,
                            },
                          ],
                        },

                        // Upper Body
                        {
                          sX: graie3Width,
                          x: graie3ToRight,
                          fX: true,
                          list: [
                            // Torso
                            {
                              sY: graie3TorsoHeight,
                              list: [
                                {},
                                {
                                  sX: armShadow,
                                  fY: true,
                                  sY: {
                                    r: 1,
                                    add: [subArmWidth],
                                  },
                                  color: graie3Shadow,
                                },

                                // Rips
                                {
                                  color: graie3Shadow,
                                  sX: {
                                    r: 0.2,
                                  },
                                  x: {
                                    r: 0.05,
                                    min: 2,
                                  },
                                  y: {
                                    r: 0.3,
                                  },
                                  sY: {
                                    r: 0.5,
                                  },
                                  stripes: {
                                    horizontal: true,
                                    gap: 1,
                                    random: {
                                      r: -0.3,
                                    },
                                  },
                                },

                                // Breast
                                {
                                  sY: {
                                    r: 0.9,
                                    add: [sub(armWidth)],
                                  },
                                  x: -1,
                                  y: armWidth,
                                  sX: {
                                    r: 1,
                                    a: 2,
                                  },
                                  list: [
                                    // Right
                                    {
                                      sX: {
                                        r: 0.4,
                                      },
                                      fX: true,
                                      list: [
                                        {},
                                        {
                                          sX: 1,
                                          color: graie3Shadow,
                                        },
                                        {
                                          sY: armShadow,
                                          color: graie3Shadow,
                                          fY: true,
                                          sX: {
                                            r: 1,
                                            a: -2,
                                          },
                                          x: 1,
                                          y: -1,
                                        },
                                        {
                                          color: graie3Detail,
                                          fY: true,
                                          tY: true,
                                          cX: true,
                                          s: 'graie3Breast',
                                        },
                                      ],
                                    },
                                    // Left
                                    {
                                      sX: {
                                        r: 0.3,
                                      },
                                      sY: {
                                        r: 0.6,
                                      },
                                      list: [
                                        {},
                                        {
                                          sX: armShadow,
                                          color: graie3Shadow,
                                        },
                                        {
                                          sX: armShadow,
                                          color: graie3Shadow,
                                          fX: true,
                                        },
                                        {
                                          fY: true,
                                          fX: true,
                                          y: -1,
                                          x: 1,
                                          sY: {
                                            r: 0.25,
                                            min: {
                                              r: 0.2,
                                              otherDim: true,
                                              min: 1,
                                            },
                                            max: {
                                              r: 0.8,
                                              otherDim: true,
                                            },
                                          },
                                          sX: {
                                            r: 1.5,
                                          },
                                          list: [
                                            {},
                                            {
                                              sY: armShadow,
                                              color: graie3Shadow,
                                              fY: true,
                                            },
                                            {
                                              color: graie3Detail,
                                              sY: 'graie3Breast',
                                              sX: {
                                                r: 0.7,
                                                otherDim: true,
                                                save: 'graie3Breast',
                                              },
                                              x: -1,
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },

                            // Head
                            {
                              sX: graie3HeadWidth,
                              sY: graie3HeadHeight,
                              x: 1,
                              tY: true,
                              list: [
                                // Neck
                                {
                                  sY: graie3NeckHeight,
                                  sX: {
                                    r: 0.3,
                                  },
                                  x: {
                                    r: 0.5,
                                  },
                                  fY: true,
                                  list: [
                                    {},
                                    {
                                      color: graie3Shadow,
                                      stripes: {
                                        gap: 1,
                                        random: {
                                          r: -0.3,
                                        },
                                      },
                                      sX: {
                                        r: 1,
                                      },
                                    },
                                  ],
                                },

                                // Face
                                {
                                  sY: graie3FaceHeight,
                                  list: [
                                    {},
                                    {
                                      color: graie3Shadow,
                                      sX: armShadow,
                                    },
                                    {
                                      color: graie3Shadow,
                                      sY: armShadow,
                                      fY: true,
                                    },

                                    // Ears
                                    {
                                      s: graie3EarSize,
                                      x: 1,
                                      y: graie3EarPos,
                                      tX: true,
                                      list: [
                                        {},
                                        {
                                          color: graie3Shadow,
                                          sX: armShadow,
                                        },
                                        {
                                          color: graie3Shadow,
                                          sY: armShadow,
                                          fY: true,
                                        },
                                      ],
                                    },
                                    {
                                      s: graie3EarSize,
                                      y: graie3EarPos,
                                      tX: true,
                                      fX: true,
                                      list: [
                                        {},
                                        {
                                          color: graie3Shadow,
                                          sY: armShadow,
                                          fY: true,
                                        },
                                      ],
                                    },

                                    // Mouth
                                    {
                                      color: graie3Detail,
                                      sY: {
                                        r: 0.4,
                                        a: -1,
                                        min: 1,
                                      },
                                      fY: true,
                                      y: {
                                        r: 0.2,
                                        min: 1,
                                      },
                                      mX: {
                                        r: 0.08,
                                        a: 1,
                                        min: 1,
                                      },
                                      list: [
                                        {
                                          mX: 1,
                                          sY: {
                                            r: 1,
                                            a: -1,
                                          },
                                        },
                                        {
                                          sY: {
                                            r: 1,
                                            a: -1,
                                          },
                                          fY: true,
                                          sX: {
                                            r: 0.15,
                                          },
                                        },
                                        {
                                          sY: {
                                            r: 1,
                                            a: -1,
                                          },
                                          fY: true,
                                          sX: {
                                            r: 0.15,
                                          },
                                          fX: true,
                                        },
                                      ],
                                    },

                                    // Nose
                                    {
                                      sY: {
                                        useSize: imgSquareBigger,
                                        r: 0.2,
                                        max: graieHalfHeight,
                                      },
                                      sX: {
                                        r: 0.4,
                                      },
                                      y: {
                                        r: 0.2,
                                      },
                                      cX: true,
                                      list: [
                                        {},
                                        {
                                          chance: 0.05,
                                          use: 'graie3Nose',
                                          color: graie3Shadow,
                                        },
                                        {
                                          save: 'graie3Nose',
                                        },
                                        {
                                          color: graie3Shadow,
                                          sX: {
                                            r: 0.2,
                                            max: 1,
                                          },
                                        },
                                        {
                                          color: graie3Shadow,
                                          sX: {
                                            r: 0.2,
                                            max: 1,
                                          },
                                          fX: true,
                                        },
                                        {
                                          color: graie3Shadow,
                                          sY: {
                                            r: 0.2,
                                            max: 1,
                                            otherDim: true,
                                          },
                                          fY: true,
                                          mX: 1,
                                          y: -1,
                                        },
                                        skinPoint(3, true, {
                                          fY: true,
                                          fX: true,
                                          y: {
                                            r: 0.1,
                                            min: 1,
                                          },
                                          x: {
                                            r: 0.1,
                                            min: 1,
                                          },
                                        }),
                                      ],
                                    },

                                    // Eyes
                                    {
                                      color: graie3Detail,
                                      sY: {
                                        r: 0.28,
                                        min: 1,
                                      },
                                      y: {
                                        r: 0.1,
                                        min: 1,
                                      },
                                      mX: {
                                        r: 0.08,
                                        min: 1,
                                      },
                                      list: [
                                        {
                                          sX: {
                                            r: 0.25,
                                          },
                                          list: graieEyes(),
                                        },
                                        {
                                          sX: {
                                            r: 0.25,
                                          },
                                          fX: true,
                                          list: graieEyes(),
                                          rX: true,
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },

                        // Arm to Bread
                        {
                          sY: [graieArmLengtDown, sub(graie3ToTop), -1],
                          sX: armWidth,
                          rotate: 90,
                          list: armToLeft(3),
                        },

                        // Arm to Graie 2
                        {
                          sX: armWidth,
                          sY: [graie3ShoulderHeight, sub(graie3GripPoint)],
                          fX: true,
                          list: [
                            legStructure(3, true, true),
                            {
                              sX: armShadow,
                              color: graie3Shadow,
                              fY: true,
                              sY: {
                                r: 1,
                                add: [subArmWidth],
                              },
                            },
                          ],
                        },

                        {
                          sX: [
                            graie2ToRight,
                            mult(1, armWidth),
                            mult(0.5, handArmDifference),
                          ],
                          sY: armWidth,
                          y: graie3GripPoint,
                          fY: true,
                          fX: true,
                          rX: true,
                          list: armToLeft(3),
                        },
                      ],
                    },
                  ],
                },
                // end graie III front
              ],
            },
            // end foreground
          ],
        },
        // end image
      ],
    },
    // end frame

    // ---- OUTER BLACK BORDER ----
    { color: grey, sY: framePadding },
    { color: grey, sY: framePadding, fY: true },
    { color: grey, sX: framePadding },
    { color: grey, sX: framePadding, fX: true },

    // PICTURE FRAME ----
    {
      mX: framePadding,
      mY: framePadding,
      list: [
        // Outline
        // --- Border
        { color: backgroundDark, sY: frameWidth },
        { color: backgroundDark, sY: frameWidth, fY: true },
        { color: backgroundDark, sX: frameWidth },
        { color: backgroundDark, sX: frameWidth, fX: true },
        // --- Edges
        {
          color: backgroundDark,
          s: edgeSize,
          x: edgeOvershotNeg,
          y: edgeOvershotNeg,
        },
        {
          color: backgroundDark,
          s: edgeSize,
          x: edgeOvershotNeg,
          y: edgeOvershotNeg,
          fX: true,
        },
        {
          color: backgroundDark,
          s: edgeSize,
          x: edgeOvershotNeg,
          y: edgeOvershotNeg,
          fY: true,
        },
        {
          color: backgroundDark,
          s: edgeSize,
          x: edgeOvershotNeg,
          y: edgeOvershotNeg,
          fX: true,
          fY: true,
        },
        // --- Center
        {
          color: backgroundDark,
          sY: edgeSize,
          y: edgeOvershotNeg,
          mX: { r: 0.48 },
        },
        {
          color: backgroundDark,
          sY: edgeSize,
          y: edgeOvershotNeg,
          mX: { r: 0.47 },
          fY: true,
        },

        // Filling
        // --- Border
        {
          color: backgroundMedium,
          sY: frameWidth,
          m: borderMargin,
          list: borderVert,
        },
        {
          color: backgroundMedium,
          sY: frameWidth,
          m: borderMargin,
          rY: true,
          fY: true,
          list: borderVert,
        },
        {
          color: backgroundMedium,
          sX: frameWidth,
          m: borderMargin,
          list: borderHor,
        },
        {
          color: backgroundMedium,
          sX: frameWidth,
          m: borderMargin,
          rX: true,
          fX: true,
          list: borderHor,
        },
        // --- Edges
        {
          color: backgroundMedium,
          s: edgeSize,
          x: edgeOvershotNeg,
          m: borderMargin,
          y: edgeOvershotNeg,
          list: [
            {},
            {
              m: 1,
              list: [
                { color: backgroundDark, mX: 1 },
                {
                  color: backgroundDark,
                  mY: { r: 0.15, max: 1 },
                },
                {
                  m: 1,
                  list: [
                    { color: background },
                    {
                      m: { r: 0.15 },
                      color: backgroundDark,
                      list: [{ mX: 1 }, { mY: 1 }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          color: backgroundMedium,
          s: edgeSize,
          x: edgeOvershotNeg,
          m: borderMargin,
          y: edgeOvershotNeg,
          fX: true,
          list: [
            {},
            {
              m: 1,
              list: [
                { color: backgroundDark },
                {
                  m: 1,
                  list: [
                    { color: background },
                    {
                      color: backgroundDark,
                      sY: { r: 0.4 },
                      fY: true,
                      mX: { r: 0.3 },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          color: backgroundMedium,
          s: edgeSize,
          x: edgeOvershotNeg,
          m: borderMargin,
          y: edgeOvershotNeg,
          fY: true,
          list: bottomEdge,
        },
        {
          color: backgroundMedium,
          s: edgeSize,
          x: edgeOvershotNeg,
          m: borderMargin,
          y: edgeOvershotNeg,
          fX: true,
          fY: true,
          rX: true,
          list: bottomEdge,
        },
        // --- Center
        {
          color: backgroundMedium,
          sY: edgeSize,
          y: edgeOvershotNeg,
          mY: borderMargin,
          mX: [{ r: 0.48 }, borderMargin],
          cX: true,
          list: [
            {},
            {
              color: backgroundDark,
              m: 1,
              list: [{ mX: 1 }, { mY: 1 }],
            },
          ],
        },
        {
          color: backgroundMedium,
          sY: edgeSize,
          mY: borderMargin,
          y: edgeOvershotNeg,
          mX: [{ r: 0.47 }, borderMargin],
          fY: true,
          cX: true,
          list: [
            {},
            {
              color: backgroundDark,
              m: 1,
              list: [
                { sY: 1, mX: 1 },
                { sY: 1, mX: 1, fY: true },
                { sX: 1, mY: 1 },
                { sX: 1, mY: 1, fX: true },
              ],
            },
          ],
        },
      ],
    },
  ]

  if (createSlider) {
    createSlider.title({ title: 'Graeae' })

    createSlider.slider({
      niceName: 'Thickness',
      valueName: 'a',
      defaultValue: 0.5,
      input: { min: 0, max: 1, step: 0.01 },
    })

    createSlider.slider({
      niceName: 'Headsize',
      valueName: 'b',
      defaultValue: 0.5,
      input: { min: 0, max: 1, step: 0.01 },
    })

    createSlider.title({ title: 'Colors' })

    createSlider.slider({
      niceName: 'Color 1',
      valueName: 'c',
      defaultValue: 1,
      input: { min: 0, max: 1, step: 0.01 },
    })

    createSlider.slider({
      niceName: 'Color 2',
      valueName: 'd',
      defaultValue: 1,
      input: { min: 0, max: 1, step: 0.01 },
    })
  }

  return {
    renderList,
    background,
    linkList,
    listDoHover: [doHover],
  }
}

export default graien
