import { helper } from '@/renderengine/helper.js'

function graien() {
  let background = [60, 120, 110]
  let bSS = 0.5
  let shadowAdd = 195
  let shadowColor = [
    background[0] * bSS + shadowAdd,
    background[1] * bSS + shadowAdd,
    background[2] * bSS + shadowAdd,
  ]
  let shadow = helper.darken(shadowColor, 0.7)
  let detail = helper.darken(shadowColor, 0.4)
  let grey = [204, 204, 204]
  let bread = [150, 130, 100]
  let breadDark = shadow(bread)
  let backgroundMedium = shadow(background)
  let backgroundDark = detail(background)
  let hair = [255, 255, 255]
  let graie1 = [227, 200, 190]
  let graie2 = [192, 176, 133]
  let graie3 = [232, 204, 151]
  let graie1Shadow = shadow(graie1)
  let graie1Detail = detail(graie1)
  let graie2Shadow = shadow(graie2)
  let graie2Detail = detail(graie2)
  let graie3Shadow = shadow(graie3)
  let graie3Detail = detail(graie3)
  let imgDifference = 0.05
  let linkList = []

  let linkListPush = function (obj) {
    linkList.push(obj)

    return obj
  }

  let sXMain = linkListPush({ main: true })
  let sYMain = linkListPush({ main: true, height: true })
  let fullSquare = linkListPush({ add: [sXMain], max: sYMain })
  let framePadding = linkListPush({ r: 0.02, useSize: fullSquare })
  let frameWidth = linkListPush({ r: 0.05, useSize: fullSquare })
  let graienPaddingX = linkListPush({
    r: imgDifference,
    useSize: sXMain,
    add: [1, { r: -imgDifference, useSize: sYMain }],
    min: 1,
  })
  let graienPaddingY = linkListPush({
    a: 1,
    r: imgDifference,
    useSize: sYMain,
    add: [1, { r: -imgDifference, useSize: sXMain }],
    min: 2,
  })
  let border = linkListPush([framePadding, frameWidth])
  let fullBorderX = linkListPush([border, graienPaddingX])
  let fullBorderY = linkListPush([border, graienPaddingY])
  let edgeOvershot = linkListPush({ r: 1, useSize: framePadding, a: -1 })
  let edgeOvershotNeg = linkListPush(helper.sub(edgeOvershot))
  let edgeSize = linkListPush([helper.mult(2, edgeOvershot), frameWidth])
  let imgWidth = linkListPush([sXMain, { useSize: fullBorderX, r: -2 }])
  let imgHeight = linkListPush([sYMain, { useSize: fullBorderY, r: -2 }])
  let backWidth = linkListPush([sXMain, { useSize: border, r: -2 }])
  let backHeight = linkListPush([sYMain, { useSize: border, r: -2 }])
  let backSquare = linkListPush(
    helper.getSmallerDim({ r: 1, useSize: [backWidth, backHeight] }),
  )
  let imgSquare = linkListPush(
    helper.getSmallerDim({ r: 1, useSize: [imgWidth, imgHeight] }),
  )
  let imgSquareBigger = linkListPush(
    helper.getBiggerDim({ r: 1, useSize: [imgWidth, imgHeight] }),
  )
  // BORDER DETAILS
  let borderMargin = linkListPush({ r: 0.1, useSize: border, min: 1 })
  let frameDetailSize = linkListPush({
    min: 1,
    add: [frameWidth, helper.mult(-2, borderMargin), -2],
  })
  // BACKGROUND
  let groundHeight = linkListPush(helper.mult(0.2, backHeight))
  let hillHeight = linkListPush({
    r: 0.05,
    useSize: backHeight,
    add: [helper.mult(0.1, backWidth)],
  })
  let hillDifference = linkListPush({ r: 0.4, useSize: backHeight })
  let hillWidth = linkListPush({
    r: 0.1,
    useSize: backWidth,
    add: [helper.mult(0.1, backSquare)],
  })
  let treeWidth = linkListPush({ a: 2 })
  let treeMinGap = linkListPush({
    r: 0.005,
    useSize: backWidth,
    add: [{ r: 0.02, useSize: backHeight }],
    min: 1,
  })
  let treeRandomGap = linkListPush(helper.mult(10, treeMinGap))
  let treeRandomGap2 = linkListPush(helper.mult(15, treeMinGap))
  let trunkWidth = linkListPush(helper.mult(3, treeMinGap))
  // BREAD
  /** Adds a little bit to each side of the bread to make it more rect ) */
  let breadAdd = linkListPush({ r: 0.05, a: 2, useSize: imgSquare })
  let breadWidth = linkListPush([
    breadAdd,
    { r: 0.08, min: 3, useSize: sXMain },
  ])
  let breadHeight = linkListPush([
    breadAdd,
    { r: 0.08, useSize: sYMain, min: 3 },
  ])
  let breadSquare = linkListPush(
    helper.getSmallerDim({ r: 1, useSize: [breadWidth, breadHeight] }),
  )
  let breadDetail = linkListPush({ r: 0.15, useSize: breadSquare })
  // FULL GRAIEN
  let graieHalfWidth = linkListPush(helper.mult(0.5, imgWidth))
  let graieHeight = linkListPush(imgHeight)
  let graieHalfHeight = linkListPush(helper.mult(0.5, imgHeight))
  // HAND
  let handWidth = linkListPush({ r: 0.08, useSize: imgSquare, min: 2 })
  let fingerLength = linkListPush(helper.mult(0.2, handWidth))
  let armWidth = linkListPush({ r: 0.05, useSize: imgSquare, a: -1, min: 1 })
  let armDetailLength = linkListPush(helper.mult(2.5, armWidth))
  let handArmDifference = linkListPush([handWidth, helper.sub(armWidth)])
  let handToBreadSub = linkListPush({ useSize: handWidth, r: -0.3 })
  let handToBread = linkListPush(helper.sub(handToBreadSub))
  let graieArmLengt = linkListPush([
    graieHalfWidth,
    helper.mult(-0.5, breadWidth, -1),
    handWidth,
    handToBreadSub,
  ])
  let graieArmLengtDown = linkListPush([
    graieHalfHeight,
    helper.mult(-0.5, breadHeight),
    handWidth,
    handToBreadSub,
  ])
  let armShadow = linkListPush({ r: 0.4, max: 1, useSize: armWidth })
  let subArmWidth = linkListPush([helper.sub(armWidth), 1])
  // LEG
  let legWidth = linkListPush({ r: 0.15, useSize: imgSquare, a: -1, min: 1 })
  let legLowerWidth = linkListPush({ r: 0.07, useSize: imgSquare, min: 1 })
  let legDetailWidth = linkListPush(helper.mult(0.5, legWidth))
  let footFrontLength = linkListPush({ r: 0.1, useSize: imgSquare, min: 1 })
  let footLength = linkListPush([footFrontLength, legLowerWidth, 1])
  let footWidth = linkListPush({ r: 0.08, useSize: imgSquare, min: 1 })
  let legBack = linkListPush({ r: 0.2, useSize: legLowerWidth, max: 1 })
  let moveFootBack = linkListPush(helper.sub(legBack))
  let toeSize = linkListPush({ r: 0.2, useSize: footWidth })
  let fingerSize = linkListPush({ add: [toeSize, -1], min: 1 })
  let subLegLowerWidth = linkListPush([helper.sub(legLowerWidth), 1])
  // GRAIE I
  let graie1ShoulderHeight = linkListPush(helper.mult(0.6, imgHeight))
  let graie1ToTop = linkListPush([imgHeight, helper.sub(graie1ShoulderHeight)])
  let graie1ToLeft = linkListPush([footWidth, { r: 0.01, useSize: imgWidth }])
  let graie1Width = linkListPush(
    helper.getSmallerDim({
      r: 0.15,
      r2: 0.6,
      useSize: [imgWidth, imgHeight],
    }),
  )
  let graie1LegHeight = linkListPush([legWidth, legLowerWidth, footFrontLength])
  let graie1TorsoHeight = linkListPush([
    graie1ShoulderHeight,
    helper.sub(graie1LegHeight),
  ])
  let graie1ArmHeight = linkListPush(helper.mult(0.3, imgHeight))
  let graie1BreadArmPos = linkListPush(graieHalfHeight)
  let graie1RightSide = linkListPush([graie1Width, graie1ToLeft])
  let graie1HeadSize = linkListPush(helper.mult(0.18, imgSquare))
  let graie1HeadHeight = linkListPush({
    add: [helper.mult(2, graie1HeadSize), helper.mult(-0.03, imgWidth)],
    min: 3,
    max: [graie1ToTop, -1],
  })
  let graie1HeadWidth = linkListPush({
    add: [graie1HeadSize, helper.mult(-0.02, imgHeight)],
    min: 2,
    max: graie1Width,
  })
  let graie1ShoulderWidth = linkListPush([
    graie1Width,
    helper.sub(graie1HeadWidth),
  ])
  let graie1HeadPos = linkListPush(helper.mult(0.3, graie1ShoulderWidth))
  let graie1HairLeftWidth = linkListPush({
    r: 0.25,
    min: 1,
    useSize: graie1HeadWidth,
  })
  let graie1FaceWidth = linkListPush([
    graie1HeadWidth,
    helper.sub(graie1HairLeftWidth),
  ])
  let graie1NosePos = linkListPush(helper.mult(0.5, graie1HeadHeight))
  // Eyes
  let minEyesWidth = linkListPush({ r: 0.8, useSize: graie1FaceWidth })
  let graie1eyeWidth = linkListPush({
    r: 0.3,
    useSize: minEyesWidth,
    min: 1,
    max: { r: 0.5, a: -1, useSize: graie1FaceWidth },
  })
  let graie1eyesWidth = linkListPush({
    add: [
      helper.mult(2, graie1eyeWidth),
      { r: 0.05, useSize: graie1FaceWidth, min: 0 },
      { r: 0.2, useSize: graie1FaceWidth, max: 1 },
    ],
    max: graie1FaceWidth,
    min: { r: 2, useSize: graie1eyeWidth, min: 3 },
  })
  let graie1faceRest = linkListPush([
    graie1FaceWidth,
    helper.sub(graie1eyesWidth),
  ])
  let graie1eyePosLeft = linkListPush({
    r: 0.5,
    useSize: graie1faceRest,
    min: 0,
  })
  let graie1eyeHeight = linkListPush({
    add: [graie1NosePos, { r: -0.1, useSize: graie1HeadHeight }],
    min: 1,
  })
  let graie1eyePosTop = linkListPush([
    graie1NosePos,
    helper.sub(graie1eyeHeight),
  ])
  let graie1NoseHeight = linkListPush(helper.mult(0.8, armWidth))
  let graie1MouthOuterPart = linkListPush({
    r: 0.1,
    useSize: graie1eyesWidth,
    min: 1,
  })
  let graie1MouthInnerPart = linkListPush(helper.mult(0.3, graie1eyesWidth))
  let graie1BreastWidth = linkListPush({ useSize: graie1Width, r: 0.3 })
  let graie1BreastMargin = linkListPush({
    useSize: graie1Width,
    r: 0.2,
    a: -1,
  })
  let graie1BreastShadow = linkListPush({
    useSize: graie1BreastWidth,
    r: 0.3,
    max: 1,
  })
  let graie1NippleHeight = linkListPush({
    useSize: graie1BreastWidth,
    r: 0.2,
    min: 2,
  })
  let graie1BreadArmLength = linkListPush([
    graie1ShoulderHeight,
    helper.mult(-0.52, graieHeight),
    armWidth,
  ])
  // GRAIE II
  let graie2ToLeft = linkListPush(
    helper.getSmallerDim({ r: 0.35, r2: 4, useSize: [imgWidth, imgHeight] }),
  )
  let graie2ToRight = linkListPush(helper.mult(0.3, imgWidth))
  let graie2Width = linkListPush([
    imgWidth,
    helper.sub(graie2ToLeft),
    helper.sub(graie2ToRight),
  ])
  let graie2BodyHeight = linkListPush(helper.mult(0.2, imgHeight))
  let graie2HeadHeight = linkListPush({ r: 0.8, useSize: graie2BodyHeight })
  let graie2HeadWidth = linkListPush({
    r: 1.5,
    useSize: graie2HeadHeight,
    max: { r: 0.5, useSize: graie2Width },
  })
  let graie2LegLength = linkListPush([helper.mult(0.32, graieHalfHeight)])
  let graie2ArmLength = linkListPush([
    imgHeight,
    helper.sub(graie1BreadArmPos),
    helper.sub(armWidth),
    -1,
  ])
  let graie2LegPos = linkListPush([
    helper.mult(0.05, graie2Width),
    helper.mult(-0.005, imgHeight),
    armWidth,
  ])
  let graie2graie1Dist = linkListPush([
    graie2ToLeft,
    helper.sub(graie1RightSide),
  ])
  let graie2ArmToArmWidth = linkListPush(helper.mult(0.5, graie2graie1Dist))
  let graie2HeadShadow = linkListPush({
    r: 0.15,
    useSize: graie2HeadHeight,
    max: 1,
  })
  let graie1LegLength = linkListPush([
    graie1Width,
    helper.mult(0.5, graie2graie1Dist),
    helper.mult(0.1, imgHeight),
  ])
  let graie1ArmRest = linkListPush([
    graie1RightSide,
    graie2ToRight,
    graie2LegPos,
    legLowerWidth,
    1,
  ])
  let graie1ArmLength = linkListPush([imgWidth, helper.mult(-1, graie1ArmRest)])
  // GRAIE III
  let graie3ShoulderHeight = linkListPush(helper.mult(0.75, imgHeight))
  let graie3ToTop = linkListPush([imgHeight, helper.sub(graie3ShoulderHeight)])
  let graie3GripPoint = linkListPush([
    graie2BodyHeight,
    helper.mult(0.05, imgHeight),
  ])
  let graie3ToRight = linkListPush(
    helper.getSmallerDim({ r: 0.1, r2: 0.5, useSize: [imgWidth, imgHeight] }),
  )
  let graie3Width = linkListPush(graie1Width)
  let graie3LegLength = linkListPush([
    graie2LegLength,
    helper.mult(0.2, imgHeight),
  ])
  let graie3LegHeight = linkListPush([graie3LegLength, footFrontLength])
  let graie3TorsoHeight = linkListPush([
    graie3ShoulderHeight,
    helper.sub(graie3LegHeight),
  ])
  let graie3lowerLegLength = linkListPush([
    graie3ToRight,
    graie3Width,
    helper.sub(legWidth),
  ])
  let graie3BehindLegLength = linkListPush([
    graie2ToRight,
    graie2LegPos,
    helper.mult(2, legLowerWidth),
    helper.sub(graie3ToRight),
    1,
  ])
  let graie3HeadHeight = linkListPush({
    add: [graie1HeadHeight, -1],
    max: [graie3ToTop, -1],
  })
  let graie3HeadWidth = linkListPush({ r: 1, useSize: graie3Width })
  let graie3NeckHeight = linkListPush({
    r: 0.6,
    useSize: graie3HeadHeight,
    add: [helper.mult(-0.1, graie3HeadWidth), 1],
  })
  let graie3FaceHeight = linkListPush([
    helper.sub(graie3NeckHeight),
    1,
    graie3HeadHeight,
  ])
  let graie3EarSize = linkListPush(helper.mult(0.3, graie3FaceHeight))
  let graie3EarPos = linkListPush(helper.mult(0.1, graie3FaceHeight))

  let graienValues = function (what, faktor, value) {
    helper.setValue(what, faktor * value * 2 + value * 0.2)
  }

  let hover = function (args) {
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

  let getShadow = function (nr) {
    return nr === 1 ? graie1Shadow : nr === 2 ? graie2Shadow : graie3Shadow
  }

  let getSkin = function (nr) {
    return nr === 1 ? graie1 : nr === 2 ? graie2 : graie3
  }

  let graie1Eye = [
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

  let breast = function (left) {
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

  let foot = function (hor, down, fX, nr) {
    let shadow = getShadow(nr)
    let withoutToes = { r: 1, add: [helper.sub(toeSize)] }
    let anklePos = { r: 0.5, useSize: legLowerWidth }
    let ankleSize = { r: 0.6, useSize: legLowerWidth }
    let ankleWidth = { r: 1, a: -1 }
    let ankleHeight = { r: 1, a: -2 }

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
            sX: [footFrontLength, helper.sub(toeSize)],
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

  let legStructure = (function () {
    let i = 0
    let s = { a: 0, random: legDetailWidth }
    let armSize = { a: 0, random: armDetailLength }

    return function (nr, hor, arm) {
      let shadow = getShadow(nr)

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
            minHeight: hor ? 3 : 0,
            minX: hor ? 0 : 3,
          },
        ],
      }
    }
  })()

  let armToLeft = function (nr, down) {
    let shadow = getShadow(nr)

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
            minHeight: 4,
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

  let skinPoint = function (nr, big, obj) {
    let shadow = getShadow(nr)
    let skin = getSkin(nr)

    if (!obj) {
      obj = {}
    }

    obj.list = [{ color: shadow }, { s: { r: 1, a: -2 }, color: skin, c: true }]

    obj.sY = big ? { r: 0.1, a: -1, max: 4 } : { r: 0.02, max: 1 }

    obj.sX = big ? { r: 0.1, a: -1, otherDim: true, max: 4 } : 1

    return obj
  }

  let graieEyes = function () {
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

  let graie3butt = [{}, { name: 'Dot', fY: true, color: graie3Shadow }]
  let borderVert = [
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
  let borderHor = [
    {},
    {
      stripes: { gap: 1, strip: frameDetailSize, horizontal: true },
      sX: frameDetailSize,
      color: backgroundDark,
      cX: true,
    },
  ]
  let bottomEdge = [
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
  let renderList = [
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
              sY: [
                backHeight,
                helper.sub(groundHeight),
                helper.sub(hillHeight),
              ],
              x: helper.mult(0.3, treeRandomGap),
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
              sY: [
                backHeight,
                helper.sub(groundHeight),
                helper.sub(hillHeight),
              ],
              x: helper.sub(treeWidth),
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
                              minHeight: 3,
                            },
                            {
                              fX: true,
                              tX: true,
                              mY: 2,
                              sX: 1,
                              x: -1,
                              list: graie3butt,
                              minHeight: 3,
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
                              sY: [graie3LegLength, helper.sub(legWidth)],
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
                          x: [graie3Width, helper.sub(legWidth)],
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
                      minHeight: [breadWidth, 1],
                      color: breadDark,
                      list: [
                        {
                          stripes: {
                            strip: breadDetail,
                            gap: breadDetail,
                          },
                          horizontal: true,
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
                              sX: helper.mult(0.2, graie1Width),
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
                                helper.mult(2, graie1BreastWidth),
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
                                striplengt: 1,
                                gap: 1,
                                horizontal: true,
                                random: {
                                  r: -0.2,
                                },
                              },
                              sX: helper.mult(0.2, graie1Width),
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
                                  helper.sub(armWidth),
                                  helper.sub(graie1BreastWidth),
                                  helper.sub(graie1BreastWidth),
                                  helper.sub(graie1BreastMargin),
                                ],
                              ],
                              x: [helper.sub(graie1ToLeft), armWidth],
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
                                    helper.mult(0.02, graie1HeadHeight),
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
                                          minHeight: 3,
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
                              x: helper.sub(graie1ToLeft),
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
                                add: [helper.sub(legWidth)],
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
                              minHeight: 4,
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
                              minHeight: 3,
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
                      sY: [imgHeight, helper.sub(graie2BodyHeight)],
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
                      sX: [graieArmLengt, helper.sub(graie2ToRight)],
                      sY: armWidth,
                      y: helper.mult(-0.5, armWidth),
                      rX: true,
                      fX: true,
                      list: armToLeft(2, true),
                    },
                    {
                      sX: armWidth,
                      sY: {
                        r: 1,
                        add: [helper.sub(graie2BodyHeight)],
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
                              list: graieEyes(2),
                            },
                            {
                              sX: { r: 0.4 },
                              list: graieEyes(2),
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
                                    add: [helper.sub(armWidth)],
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
                                      horizontal: true,
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
                                          list: graieEyes(3),
                                        },
                                        {
                                          sX: {
                                            r: 0.25,
                                          },
                                          fX: true,
                                          list: graieEyes(3),
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
                          sY: [graieArmLengtDown, helper.sub(graie3ToTop), -1],
                          sX: armWidth,
                          rotate: 90,
                          list: armToLeft(3),
                        },

                        // Arm to Graie 2
                        {
                          sX: armWidth,
                          sY: [
                            graie3ShoulderHeight,
                            helper.sub(graie3GripPoint),
                          ],
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
                            helper.mult(1, armWidth),
                            helper.mult(0.5, handArmDifference),
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

  // if( createSlider ) {
  // 	createSlider.title( { title: "Graien" } );
  // 	createSlider.slider( { niceName: "Dicke", 		valueName: "a",	defaultValue: 0.5, 	input: { min: 0, max: 1, step: 0.01 } } );
  // 	createSlider.slider( { niceName: "Kopfgröße",	valueName: "b",	defaultValue: 0.5, 	input: { min: 0, max: 1, step: 0.01 } } );

  // 	// createSlider.title( { title: "Farbe" } );
  // 	// createSlider.slider( { niceName: "Farbe 1", 	valueName: "c",	defaultValue: 1, 	input: { min: 0, max: 1, step: 0.01 } } );
  // 	// createSlider.slider( { niceName: "Farbe 2", 	valueName: "d",	defaultValue: 1, 	input: { min: 0, max: 1, step: 0.01 } } );
  // }

  return {
    renderList,
    background,
    linkList,
    hover,
    changeValueSetter() {
      helper.setValue = helper.setValueNew
    },
  }
}

export default graien
