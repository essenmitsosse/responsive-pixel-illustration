import { helper } from '@/renderengine/helper.js'

function tantalos() {
  var water = [36, 44, 53]
  var waterLight = [74, 81, 88]
  var ground = [72, 71, 68]
  var groundDark = [65, 54, 57]
  var groundWater = [54, 58, 61]
  var tree = [100, 118, 64]
  var treeShadow = [90, 90, 53]
  var treeBackground = [49, 45, 35]
  var fruit = [123, 35, 35]
  var trunk = [82, 76, 68]
  var trunkShadow = [74, 58, 58]
  var skin = [193, 180, 163]
  var skinWater = [69, 74, 79]
  var skinShadow = [162, 146, 129]
  var borderColor = [111, 67, 29]
  var borderDetailColor = [123, 87, 35]
  var shorts = [139, 146, 154]
  var shortsWater = [60, 68, 77]
  // Variables
  var linkList = []

  var linkListPush = function (obj) {
    linkList.push(obj)

    return obj
  }

  var sXMain = linkListPush({ main: true })
  var sYMain = linkListPush({ main: true, height: true })
  var fullRect = linkListPush(linkListPush({ add: [sXMain], max: sYMain }))
  var borderSX = linkListPush({ r: 0.05, useSize: fullRect })
  var borderDetail = linkListPush({ r: 0.08, useSize: fullRect })
  var borderBottomDetail = linkListPush({ r: 0.06, useSize: fullRect })
  var borderBottomMargin = linkListPush([
    { r: 0.5 },
    { r: -0.5, useSize: borderDetail },
  ])
  var frameDetailSize = linkListPush({ add: [borderSX, -2], min: 1 })
  var motiveSX = linkListPush({
    add: [sXMain, { r: -2, useSize: borderSX }],
  })
  var motiveSY = linkListPush([sYMain, { r: -2, useSize: borderSX }])
  var motiveSqu = linkListPush(
    helper.getSmallerDim({ r: 1, useSize: [motiveSX, motiveSY] }),
  )
  var motiveSquBigger = linkListPush(
    helper.getBiggerDim({ r: 1, useSize: [motiveSX, motiveSY] }),
  )
  var overshotSX = linkListPush({
    add: [motiveSX, { r: -1, useSize: motiveSqu }],
  })
  var overshotSY = linkListPush({
    add: [motiveSY, { r: -1, useSize: motiveSqu }],
  })
  // Teiresias
  var centerX = linkListPush({
    r: 0.5,
    useSize: motiveSX,
    add: [{ r: 0.05, useSize: overshotSY }],
  })
  var centerY = linkListPush({
    r: 0.5,
    useSize: motiveSY,
    add: [{ r: -0.02, useSize: overshotSX }],
    min: 1,
  })
  var movementSY = linkListPush({
    add: [
      { r: 0.9, useSize: motiveSY },
      { r: -1, useSize: centerY },
      { r: 0.03, useSize: overshotSX },
      { r: -0.1, useSize: overshotSY },
    ],
  })
  var movementSX = linkListPush({
    add: [
      { r: 0.7, useSize: motiveSquBigger },
      { r: -1, useSize: overshotSY },
    ],
    min: { r: 0.2, useSize: movementSY, max: centerX },
    max: { r: 7, useSize: movementSY },
  })
  var movementL = linkListPush({ getLength: [movementSX, movementSY] })
  var perspectiveY = linkListPush({ r: 0.1, useSize: movementSY })
  var groundThickness = perspectiveY
  // General Sizes
  var handRel = 0.05
  var armRel = 0.2
  var torsoRel = 0.25
  var upperArmRel = handRel * 0.4

  var getBodyPartSize = function (rel, height, min) {
    return linkListPush({
      r: rel,
      useSize: height ? movementSY : movementSX,
      min: min ? 1 : undefined,
    })
  }

  var handSX_ = getBodyPartSize(handRel, false, true)
  var handSY_ = getBodyPartSize(handRel, true, true)
  var armSX = getBodyPartSize(armRel)
  var armSY = getBodyPartSize(armRel, true)
  var torsoSX = getBodyPartSize(torsoRel)
  var torsoSY = getBodyPartSize(torsoRel, true)
  var bodyWithoutLegsX = linkListPush([handSX_, armSX, torsoSX])
  var bodyWithoutLegsY = linkListPush([handSY_, armSY, torsoSY])
  var lowerBodySX = linkListPush({
    add: [movementSX, { r: -1, useSize: bodyWithoutLegsX }],
  })
  var lowerBodySY = linkListPush({
    add: [movementSY, { r: -1, useSize: bodyWithoutLegsY }],
  })
  var shoulderX = linkListPush([handSX_, armSX])
  var shoulderY = linkListPush([handSY_, armSY])
  var hipX_ = linkListPush({ add: [shoulderX, torsoSX] })
  var hipY = linkListPush({ add: [shoulderY, torsoSY] })
  // Hand
  var handRatio = 0.5
  var handSX = linkListPush({
    add: [handSX_],
    min: { r: handRatio, useSize: handSY_ },
  })
  var handSY = linkListPush({
    add: [handSY_],
    min: { r: handRatio, useSize: handSX_ },
  })
  // Arm
  var upperArmL = linkListPush({
    r: upperArmRel,
    useSize: movementL,
    min: 1,
  })
  var armL = linkListPush({ getLength: [armSX, armSY] })
  var armHandX = handSX
  var armHandY = linkListPush({ a: 0 })
  var armShoulderX = shoulderX
  var armShoulderY = linkListPush([shoulderY, { r: 0.5, useSize: upperArmL }])
  // armBentPos = 0.4,
  // armBent = -0.1,

  // armEllbowX_ = linkListPush( { add:[ armHandX, { r: armBentPos, useSize: armShoulderX } ] } ),
  // armEllbowY_ = linkListPush( { add:[ armHandY, { r: armBentPos, useSize: armShoulderY } ] } ),

  // armEllbowX = linkListPush( { add: [ armEllbowX_, { r: armBent, useSize: armEllbowY_ } ] } ),
  // armEllbowY = linkListPush( { add: [ armEllbowY_, { r: -armBent * 1.2, useSize: armEllbowX_ } ] } ),

  var foreArmS = linkListPush({ r: 0.008, useSize: movementL, min: 1 })
  var upperArmS = linkListPush({
    r: 1,
    useSize: foreArmS,
    max: [foreArmS, 1],
  })
  var arm2Y = linkListPush([shoulderY, upperArmS])
  var arm2SYMax1 = linkListPush({
    add: [armL, { r: 0.2, useSize: movementSY }],
  })
  var arm2SYMax2 = linkListPush({
    add: [movementSY, { r: -1, useSize: arm2Y }],
  })
  var arm2SY = linkListPush({ add: [arm2SYMax1], max: arm2SYMax2 })
  var arm2SX = linkListPush({ r: 0.2, useSize: arm2SYMax1 })
  var ellbowS = linkListPush({
    r: 1.5,
    useSize: upperArmS,
    max: [upperArmS, 2],
  })
  // ellbowSHalf = linkListPush( {r: -0.5, useSize: ellbowS } ),

  var legLowerS = foreArmS
  var legUpperS = upperArmS
  var kneeS = ellbowS
  // Shoulder
  var shoulderSXRel = 0.1
  var shoulderSYRel = shoulderSXRel * 0.5
  var shoulderSX = linkListPush({
    r: shoulderSXRel,
    useSize: movementL,
    min: 1,
  })
  var shoulderSY = linkListPush({
    r: shoulderSYRel,
    useSize: movementL,
    min: 1,
    max: { r: 0.2, useSize: movementSY },
  })
  var torsoL = linkListPush({
    getLength: [
      linkListPush({ add: [{ r: -1, useSize: shoulderX, hipX }] }),
      linkListPush({ add: [{ r: -1, useSize: shoulderY, hipY }] }),
    ],
  })
  // Hip
  var hipSXRel = 0.08
  var hipSYRel = shoulderSXRel * 0.4
  var hipSX = linkListPush({ r: hipSXRel, useSize: movementL, min: 1 })
  var hipSY = linkListPush({
    r: hipSYRel,
    useSize: movementL,
    min: 1,
    max: { r: 0.15, useSize: movementSY },
  })
  var hipX = linkListPush({ add: [hipX_, { r: -1, useSize: hipSX }] })
  // Legs
  var legL = linkListPush({
    r: 0.6,
    useSize: linkListPush({
      add: [
        linkListPush({ getLength: [lowerBodySX, lowerBodySY] }),
        { r: -1, useSize: hipSY },
      ],
    }),
  })
  var upperLeg = linkListPush({ r: 0.5, useSize: legL })
  var legSX = hipSX
  var legSY = linkListPush([
    movementSY,
    { r: -1, useSize: hipY },
    { r: -1, useSize: hipSY },
  ])
  var legX = hipX
  var legY = linkListPush([hipY, hipSY])
  // legFrontX = linkListPush( { r: -0.2, useSize: legSY } ),
  var legUpper1L = legSY
  var legLower1L = linkListPush({
    add: [legL, { r: -1, useSize: legSY }],
    min: { a: 0 },
    max: { r: 1.5, useSize: legUpper1L },
  })
  var legUpper2L = linkListPush({
    add: [{ r: 1.3, useSize: upperLeg }],
    max: linkListPush([
      legSY,
      { r: -1, useSize: perspectiveY },
      { r: -0.5, useSize: legUpperS },
    ]),
  })
  var legLower2L = linkListPush({
    add: [legL, { r: -0.8, useSize: legUpper2L }],
    min: { a: 0 },
    max: { r: 1.5, useSize: legUpper1L },
  })
  // knee1X = legFrontX,
  // knee1Y = { r: 0.5, useSize: legUpperS },
  // knee1Pos = { fX: true, fY: true, x: legFrontX, y: knee1Y },

  // Head
  var headSYRel = 0.3
  var headSXRel = headSYRel * 0.6
  var headSX = linkListPush({ r: headSXRel, useSize: torsoL })
  var headSY = linkListPush({ r: headSYRel, useSize: torsoL })
  var headX = linkListPush({
    add: [shoulderX, { r: 0.02, useSize: overshotSY }],
  })
  var headY = linkListPush({
    add: [
      shoulderY,
      { r: -1, useSize: headSY },
      {
        r: 0.03,
        useSize: overshotSX,
        max: linkListPush({ r: 0.5, useSize: headSY }),
      },
    ],
  })
  var eyeSY = linkListPush({ r: 0.2, min: 1, useSize: headSY })
  var eyesSX = linkListPush({ r: 0.6, min: 1, useSize: headSX })
  var eyeX = linkListPush({ r: 0.1, useSize: headSX })
  var eyeY = linkListPush({ r: 0.3, useSize: headSY })
  var eyeSX = linkListPush({ r: 0.5, useSize: eyeSX, a: -1 })
  var mouthSX = linkListPush({ r: 0.7, useSize: headSX })
  var mouthSY = linkListPush({
    r: 0.5,
    useSize: linkListPush([
      headSY,
      { r: -1, useSize: eyeY },
      { r: -1, useSize: eyeSY },
    ]),
    min: 1,
  })
  var mouthX = linkListPush({ a: 0 })
  var mouthY = linkListPush({
    r: 0.3,
    useSize: linkListPush([
      headSY,
      { r: -1, useSize: eyeY },
      { r: -1, useSize: eyeSY },
      { r: -1, useSize: mouthSY },
    ]),
  })
  // Fruit
  var fruitSXrel = 0.03
  var fruitSXBigRel = 0.01
  var fruitRatio = 1.8
  var fruitSYrel = fruitSXrel * fruitRatio
  var fruitSYBigRel = fruitSXBigRel * fruitRatio
  var fruitSX = linkListPush({
    r: fruitSXrel,
    min: 2,
    useSize: motiveSqu,
    add: [{ r: fruitSXBigRel, useSize: motiveSquBigger }],
    max: { r: 0.1, useSize: motiveSqu },
  })
  var fruitSY = linkListPush({
    r: fruitSYrel,
    min: 3,
    useSize: motiveSqu,
    add: [{ r: fruitSYBigRel, useSize: motiveSquBigger }],
    max: { r: 0.1 * 1.8, useSize: motiveSqu },
  })
  var fruitHandMaxX = linkListPush({
    add: [handSX, foreArmS, 1, { r: -0.1, useSize: overshotSY }],
    min: linkListPush({
      add: [-1, { r: 0.5, useSize: handSX }, { r: -0.5, useSize: fruitSX }],
    }),
  })
  var fruitHandMaxY = linkListPush({
    add: [handSY, foreArmS, 1, { r: -0.1, useSize: overshotSX }],
    min: linkListPush({
      add: [-1, { r: 0.5, useSize: handSY }, { r: -0.5, useSize: fruitSY }],
    }),
  })
  var fruitX = linkListPush({
    add: [centerX, { r: -1, useSize: handSX }, fruitHandMaxX],
  })
  var fruitY = linkListPush({
    add: [
      centerY,
      handSY,
      { r: -1, useSize: fruitSY },
      { r: -1, useSize: fruitHandMaxY },
    ],
  })
  // Island
  var shadowSY = linkListPush({
    add: [
      perspectiveY,
      { r: 2, useSize: legLowerS },
      { r: -0.05, useSize: overshotSY },
    ],
    min: 2,
  })
  var islandSX = linkListPush([movementSX, { r: -0.1, useSize: overshotSX }])
  var islandSY = linkListPush([shadowSY, { r: 1, useSize: groundThickness }])
  var islandX = linkListPush([centerX, { r: -1, useSize: movementSX }])
  var islandY = linkListPush([
    centerY,
    movementSY,
    { r: -1, useSize: shadowSY },
  ])
  var waterY = linkListPush([islandY, { r: -1, useSize: islandSY }])
  var waterSY = linkListPush([sYMain, { r: -1, useSize: waterY }])
  var mainTreeSX = linkListPush([sXMain, { r: -1, useSize: fruitX }, fruitSX])
  var mainTreeSY = fruitY
  var trunkSize = 0.02
  var trunkSizeBack = 0.015
  var trunkRatio = 0.5
  var trunkHor = linkListPush({ r: trunkSize, useSize: sXMain, a: 1 })
  var trunkVert = linkListPush({
    r: trunkSize * trunkRatio,
    useSize: sXMain,
    a: 1,
  })
  var trunkHorBack = linkListPush({
    r: trunkSizeBack,
    useSize: sXMain,
    a: 1,
  })
  var trunkVertBack = linkListPush({
    r: trunkSizeBack * trunkRatio,
    useSize: sXMain,
    a: 1,
  })
  // End Variables

  var leg = [
    // {color:c1},
    { sX: legUpperS },
    { fY: true, sY: legLowerS },
    { s: kneeS, fY: true, x: -1 },
  ]

  var teiresias = function (reflect) {
    var skinColor = reflect ? skinWater : skin
    var skinShadowColor = reflect ? skinWater : skinShadow
    var shortsColor = reflect ? shortsWater : shorts

    return {
      color: skinColor,
      sX: movementSX,
      sY: movementSY,
      x: [centerX, { r: -1, useSize: movementSX }],
      y: reflect ? [centerY, movementSY] : [centerY],
      rX: true,
      rY: reflect,
      list: [
        // shadow
        {
          sY: shadowSY,
          sX: hipSX,
          mX: { r: -0.1 },
          x: hipX,
          color: groundDark,
          y: -1,
          fY: true,
        },

        // // body
        // { color: [200,200,200] },

        // // move
        // { sX: movementSX, sY: movementSY, color:c2, list: [
        // 	// { color:c1 },
        // 	{ weight: 1, points: [
        // 		{  },
        // 		{ fX: true, fY: true }
        // 	] }
        // ] },

        // hand
        { sX: handSX, sY: handSY },

        // Arm Back
        {
          x: [armHandX, { r: -1, useSize: foreArmS }],
          y: armHandY,
          sX: armShoulderX,
          sY: armShoulderY,
          list: [{ sX: foreArmS }, { fY: true, sY: upperArmS }],
        },

        // Lower Body
        {
          sX: hipSX,
          sY: [hipY, { r: -1, useSize: linkListPush([shoulderY, 1]) }],
          x: hipX,
          y: [shoulderY, 1],
          list: [{}, { sX: 1, color: skinShadowColor, fX: true }],
        },

        {
          y: [shoulderY, 1],
          x: [shoulderX, shoulderSX],
          sY: [shoulderSY, -1],
          sX: [
            hipSX,
            hipX,
            {
              r: -1,
              useSize: linkListPush([shoulderX, shoulderSX]),
            },
            -1,
          ],
          list: [
            {},
            {
              color: skinShadowColor,
              stripes: {
                gap: { r: 0.1 },
                change: { r: -0.1 },
              },
              sX: { r: 0.5 },
              mY: { r: 0.1, min: 1 },
            },
            {
              sY: 1,
              color: skinShadowColor,
              fY: true,
              sX: {
                r: 0.5,
                add: [{ r: -0.1, useSize: overshotSY }],
              },
            },
          ],
        },

        // hip
        {
          sX: hipSX,
          sY: [hipSY, 1],
          x: hipX,
          y: hipY,
          color: shortsColor,
        },

        // shoulder
        {
          sX: shoulderSX,
          sY: shoulderSY,
          x: shoulderX,
          y: shoulderY,
          id: 'shoulder',
          list: [
            {},
            {
              sY: { a: 1, r: -0.01, useSize: overshotSY },
              color: skinShadowColor,
              fY: true,
            },

            // Nipples
            {
              mX: { r: 0.1 },
              sY: { r: 0.15, useSize: shoulderSY, min: 1 },
              y: { r: 0.5, min: 1 },
              color: skinShadowColor,
              list: [
                { sX: { r: 0.25, useSize: shoulderSY } },
                {
                  sX: { r: 0.25, useSize: shoulderSY },
                  fX: true,
                },
              ],
            },
          ],
        },

        // leg
        {
          sX: legSX,
          sY: legSY,
          x: legX,
          y: legY,
          list: [
            { sY: legUpper2L, sX: legLower2L, list: leg },
            // Leg Front
            {
              tX: true,
              fX: true,
              sX: { add: [legLower1L], min: 1 },
              x: legUpperS,
              list: leg,
            },
          ],
        },

        // Arm Front
        {
          x: [shoulderX, shoulderSX],
          y: arm2Y,
          sX: arm2SX,
          sY: arm2SY,
          list: [
            { sX: upperArmS, sY: { r: 0.5 } },
            { sX: foreArmS, sY: { r: 0.5 }, fY: true },
          ],
        },

        // Head
        {
          sX: headSX,
          sY: headSY,
          x: headX,
          y: headY,
          list: [
            {},
            // Eyes
            {
              color: skinShadowColor,
              sX: eyesSX,
              sY: eyeSY,
              x: eyeX,
              y: eyeY,
              list: [{ sX: eyeSX }, { sX: eyeSX, fX: true }],
            },

            // Mouth
            {
              sX: mouthSX,
              sY: mouthSY,
              x: mouthX,
              y: mouthY,
              color: skinShadowColor,
              fY: true,
              cX: true,
            },

            { sY: 1, color: skinShadowColor, fY: true },
            { sX: 1, color: skinShadowColor, fX: true },
          ],
        },
      ],
    }
  }

  var trunkObj = function (shadowColor, hor, vert) {
    return [
      { fY: true, sY: hor },
      { sX: vert },
      {
        stripes: {
          gap: { a: 3, random: { r: 4, useSize: vert } },
          random: { r: 1 },
          strip: vert,
        },
        fY: true,
        list: [{}, { color: shadowColor, sY: { r: 0.9 } }],
      },
      { sY: 2, fY: true, color: shadowColor },
    ]
  }

  var mainImage = function () {
    return [
      // Background Tree
      {
        color: treeBackground,
        sY: { r: 0.6, useSize: waterY },
        stripes: {
          strip: { a: 2, random: 2 },
          change: { r: -0.5 },
          random: { r: -0.07 },
        },
      },
      {
        color: treeBackground,
        rX: true,
        sX: { r: 0.4 },
        sY: { r: 0.5, useSize: waterY },
        list: trunkObj(treeBackground, trunkHorBack, trunkVertBack),
      },
      {
        color: treeBackground,
        rX: true,
        sX: { r: 0.2 },
        sY: { r: 0.6, useSize: waterY },
        list: trunkObj(treeBackground, trunkHorBack, trunkVertBack),
      },

      // Water

      {
        color: water,
        sY: waterSY,
        y: waterY,
        list: [
          { use: 'water3' },
          {
            use: 'water3',
            color: waterLight,
            chance: 0.05,
            sY: 1,
            sX: { a: 4, random: 27 },
            mask: true,
          },
          { save: 'water3' },

          { use: 'water2' },
          {
            use: 'water2',
            color: waterLight,
            chance: 0.05,
            sY: 1,
            sX: { a: 2, random: 9 },
            mask: true,
          },
          { save: 'water2', sY: { r: 0.5 } },

          { use: 'water' },
          {
            use: 'water',
            color: waterLight,
            chance: 0.05,
            sY: 1,
            sX: { a: 1, random: 3 },
            mask: true,
          },
          { save: 'water', sY: { r: 0.2 } },
        ],
      },

      // fruit Trunk
      {
        color: trunk,
        sX: 1,
        sY: fruitY,
        x: [fruitX, { r: 0.5, useSize: fruitSX }],
      },

      // Main Trunk
      {
        color: trunk,
        fX: true,
        sX: { r: 0.8, useSize: mainTreeSX },
        sY: { r: 1.3, useSize: mainTreeSY },
        list: trunkObj(trunkShadow, trunkHor, trunkVert),
      },
      {
        color: trunk,
        fX: true,
        sX: { r: 0.5, useSize: mainTreeSX },
        sY: { r: 1.8, useSize: mainTreeSY },
        list: trunkObj(trunkShadow, trunkHor, trunkVert),
      },

      // Teiresias Reflection
      teiresias(true),

      // ground Reflection
      {
        color: groundWater,
        sX: islandSX,
        sY: { r: 1.2, useSize: islandSY },
        x: islandX,
        y: islandY,
      },

      // ground Real
      {
        color: ground,
        sX: islandSX,
        sY: islandSY,
        x: islandX,
        y: islandY,
        list: [
          {
            color: waterLight,
            mX: -3,
            mY: -2,
            list: [
              {
                sY: 1,
                fY: true,
                list: [{ sX: { r: 0.4 } }, { sX: { r: 0.3 }, fX: true }],
              },
              { fX: true, sX: 2, fY: true, sY: { r: 0.4 } },
              { sX: 2, cY: true, sY: { r: 0.4 } },
              {
                mX: -5,
                mY: -2,
                list: [
                  {
                    cX: true,
                    fY: true,
                    sX: { r: 0.5 },
                    sY: 1,
                  },
                  { fY: true, sX: { r: 0.2 }, sY: 1 },
                  { sX: 2, sY: { r: 0.4 }, fY: true },
                  {
                    sX: 2,
                    sY: { r: 0.4 },
                    fX: true,
                    cY: true,
                  },
                ],
              },
            ],
          },
          {},
        ],
      },

      // Teiresias Real
      teiresias(),

      // Main Tree
      { use: 'tree-main-background', color: treeShadow },
      { use: 'tree-main', color: tree },
      {
        use: 'tree-main',
        color: treeShadow,
        chance: 0.05,
        sY: { a: 3, random: 10 },
        mask: true,
      },
      {
        use: 'tree-main',
        color: fruit,
        chance: 0.06,
        sY: { r: 0.6, useSize: fruitSY },
        sX: { r: 0.6, useSize: fruitSX },
        z: 10,
      },
      {
        sX: mainTreeSX,
        sY: mainTreeSY,
        fX: true,
        list: [
          {
            id: 'tree-main',
            sY: { r: 0.8 },
            stripes: {
              strip: { a: 4, random: 4 },
              random: { r: -0.4 },
              change: { r: 0.6 },
            },
            list: [
              { save: 'tree-main', y: -1 },
              {
                fX: true,
                sX: 1,
                color: treeShadow,
                sY: { r: 0.2 },
                y: 1,
                fY: true,
              },
              { fY: true, sY: 1, mX: 1, color: treeShadow },
            ],
          },
          {
            id: 'tree-main-background',
            sY: { r: 0.9 },
            stripes: {
              strip: { a: 4, random: 4 },
              random: { r: -0.4 },
              change: { r: 0.6 },
            },
            list: [{ save: 'tree-main-background', y: -1 }],
          },
        ],
      },

      // fruit
      {
        color: fruit,
        sX: fruitSX,
        sY: fruitSY,
        x: fruitX,
        y: fruitY,
      },
    ]
  }

  var border = function () {
    var edgeDetail = [
      {},
      { sX: 1, sY: { r: 0.3, max: 1 }, color: borderColor },
      {
        sX: 1,
        sY: { r: 0.3, max: 1 },
        color: borderColor,
        fX: true,
      },
      {
        sX: 1,
        sY: { r: 0.3, max: 1 },
        color: borderColor,
        fY: true,
      },
    ]
    var borderEdgeTop = [
      {
        clear: true,
        sX: 1,
        sY: { r: 0.2, max: 1 },
        fX: true,
        fY: true,
      },
      {},
      {
        m: 1,
        color: borderDetailColor,
        list: [
          { s: { r: 0.7 }, list: edgeDetail },
          {
            s: { r: 0.3 },
            fX: true,
            fY: true,
            list: edgeDetail,
          },
        ],
      },
    ]
    var borderEdgeBottom = [
      { clear: true, sX: 1, sY: { r: 0.2, max: 1 }, fX: true },
      {},
      {
        m: 1,
        color: borderDetailColor,
        list: edgeDetail,
        rX: true,
      },
    ]
    var borderVertDetail = [
      {
        clear: true,
        sY: 1,
        sX: { r: 0.3, max: 1 },
        fX: true,
        fY: true,
      },
      {},
      {
        sX: { r: 1, a: -1, min: 1 },
        mY: 1,
        list: [
          { color: borderDetailColor },
          {
            sX: 1,
            sY: { r: 0.4, max: 1 },
            fX: true,
            fY: true,
          },
          { sX: 1, sY: { r: 0.4 }, x: 1 },
        ],
      },
    ]
    var borderVert = [
      {
        stripes: { strip: frameDetailSize },
        sX: { r: 0.5 },
        cY: true,
        list: borderVertDetail,
      },
      {
        stripes: { strip: frameDetailSize },
        sX: { r: 0.5 },
        rX: true,
        fX: true,
        cY: true,
        list: borderVertDetail,
      },
    ]
    var borderHor = [
      {
        stripes: { strip: frameDetailSize, horizontal: true },
        list: [
          {
            clear: true,
            sX: 1,
            sY: { r: 0.3, max: 1 },
            fX: true,
            fY: true,
          },
          {},
          {
            sY: { r: 1, a: -1, min: 1 },
            mX: 1,
            list: [
              { color: borderDetailColor },
              {
                sX: 1,
                sY: { r: 0.4, max: 1 },
                fX: true,
                fY: true,
              },
              { sX: 1, sY: { r: 0.8 }, x: 1 },
            ],
          },
        ],
      },
    ]

    return {
      color: borderColor,
      z: 10000,
      list: [
        { sY: borderSX, id: 'borderTop', list: borderVert },
        {
          sY: borderSX,
          id: 'borderBottom',
          fY: true,
          rY: true,
          list: borderVert,
        },
        { sX: borderSX, id: 'borderLeft', list: borderHor },
        {
          sX: borderSX,
          id: 'borderRight',
          fX: true,
          rX: true,
          list: borderHor,
        },

        { s: borderDetail, list: borderEdgeTop },
        {
          s: borderDetail,
          fX: true,
          rX: true,
          list: borderEdgeTop,
        },

        { s: borderBottomDetail, list: borderEdgeBottom, fY: true },
        {
          s: borderBottomDetail,
          list: borderEdgeBottom,
          fY: true,
          fX: true,
          rX: true,
        },

        {
          sY: borderBottomDetail,
          mX: borderBottomMargin,
          list: [{}, { m: 1, color: borderDetailColor }],
        },
        {
          sY: borderBottomDetail,
          mX: borderBottomMargin,
          fY: true,
          list: [
            {},
            {
              m: 1,
              color: borderDetailColor,
              list: [{ sX: 1 }, { sX: 1, fX: true }],
            },
          ],
        },
      ],
    }
  }

  var renderList = [
    // Image
    { list: mainImage() },
    border(),
  ]
  var backgroundColor = [31, 29, 29]

  return {
    renderList,
    linkList,
    background: backgroundColor,
  }
}

export default tantalos
