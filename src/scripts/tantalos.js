import { helper } from '@/renderengine/helper.js'

function tantalos() {
  let water = [36, 44, 53]
  let waterLight = [74, 81, 88]
  let ground = [72, 71, 68]
  let groundDark = [65, 54, 57]
  let groundWater = [54, 58, 61]
  let tree = [100, 118, 64]
  let treeShadow = [90, 90, 53]
  let treeBackground = [49, 45, 35]
  let fruit = [123, 35, 35]
  let trunk = [82, 76, 68]
  let trunkShadow = [74, 58, 58]
  let skin = [193, 180, 163]
  let skinWater = [69, 74, 79]
  let skinShadow = [162, 146, 129]
  let borderColor = [111, 67, 29]
  let borderDetailColor = [123, 87, 35]
  let shorts = [139, 146, 154]
  let shortsWater = [60, 68, 77]
  // Variables
  let linkList = []

  let linkListPush = function (obj) {
    linkList.push(obj)

    return obj
  }

  let sXMain = linkListPush({ main: true })
  let sYMain = linkListPush({ main: true, height: true })
  let fullRect = linkListPush(linkListPush({ add: [sXMain], max: sYMain }))
  let borderSX = linkListPush({ r: 0.05, useSize: fullRect })
  let borderDetail = linkListPush({ r: 0.08, useSize: fullRect })
  let borderBottomDetail = linkListPush({ r: 0.06, useSize: fullRect })
  let borderBottomMargin = linkListPush([
    { r: 0.5 },
    { r: -0.5, useSize: borderDetail },
  ])
  let frameDetailSize = linkListPush({ add: [borderSX, -2], min: 1 })
  let motiveSX = linkListPush({
    add: [sXMain, { r: -2, useSize: borderSX }],
  })
  let motiveSY = linkListPush([sYMain, { r: -2, useSize: borderSX }])
  let motiveSqu = linkListPush(
    helper.getSmallerDim({ r: 1, useSize: [motiveSX, motiveSY] }),
  )
  let motiveSquBigger = linkListPush(
    helper.getBiggerDim({ r: 1, useSize: [motiveSX, motiveSY] }),
  )
  let overshotSX = linkListPush({
    add: [motiveSX, { r: -1, useSize: motiveSqu }],
  })
  let overshotSY = linkListPush({
    add: [motiveSY, { r: -1, useSize: motiveSqu }],
  })
  // Teiresias
  let centerX = linkListPush({
    r: 0.5,
    useSize: motiveSX,
    add: [{ r: 0.05, useSize: overshotSY }],
  })
  let centerY = linkListPush({
    r: 0.5,
    useSize: motiveSY,
    add: [{ r: -0.02, useSize: overshotSX }],
    min: 1,
  })
  let movementSY = linkListPush({
    add: [
      { r: 0.9, useSize: motiveSY },
      { r: -1, useSize: centerY },
      { r: 0.03, useSize: overshotSX },
      { r: -0.1, useSize: overshotSY },
    ],
  })
  let movementSX = linkListPush({
    add: [
      { r: 0.7, useSize: motiveSquBigger },
      { r: -1, useSize: overshotSY },
    ],
    min: { r: 0.2, useSize: movementSY, max: centerX },
    max: { r: 7, useSize: movementSY },
  })
  let movementL = linkListPush({ getLength: [movementSX, movementSY] })
  let perspectiveY = linkListPush({ r: 0.1, useSize: movementSY })
  let groundThickness = perspectiveY
  // General Sizes
  let handRel = 0.05
  let armRel = 0.2
  let torsoRel = 0.25
  let upperArmRel = handRel * 0.4

  let getBodyPartSize = function (rel, height, min) {
    return linkListPush({
      r: rel,
      useSize: height ? movementSY : movementSX,
      min: min ? 1 : undefined,
    })
  }

  let handSX_ = getBodyPartSize(handRel, false, true)
  let handSY_ = getBodyPartSize(handRel, true, true)
  let armSX = getBodyPartSize(armRel)
  let armSY = getBodyPartSize(armRel, true)
  let torsoSX = getBodyPartSize(torsoRel)
  let torsoSY = getBodyPartSize(torsoRel, true)
  let bodyWithoutLegsX = linkListPush([handSX_, armSX, torsoSX])
  let bodyWithoutLegsY = linkListPush([handSY_, armSY, torsoSY])
  let lowerBodySX = linkListPush({
    add: [movementSX, { r: -1, useSize: bodyWithoutLegsX }],
  })
  let lowerBodySY = linkListPush({
    add: [movementSY, { r: -1, useSize: bodyWithoutLegsY }],
  })
  let shoulderX = linkListPush([handSX_, armSX])
  let shoulderY = linkListPush([handSY_, armSY])
  let hipX_ = linkListPush({ add: [shoulderX, torsoSX] })
  let hipY = linkListPush({ add: [shoulderY, torsoSY] })
  // Hand
  let handRatio = 0.5
  let handSX = linkListPush({
    add: [handSX_],
    min: { r: handRatio, useSize: handSY_ },
  })
  let handSY = linkListPush({
    add: [handSY_],
    min: { r: handRatio, useSize: handSX_ },
  })
  // Arm
  let upperArmL = linkListPush({
    r: upperArmRel,
    useSize: movementL,
    min: 1,
  })
  let armL = linkListPush({ getLength: [armSX, armSY] })
  let armHandX = handSX
  let armHandY = linkListPush({ a: 0 })
  let armShoulderX = shoulderX
  let armShoulderY = linkListPush([shoulderY, { r: 0.5, useSize: upperArmL }])
  // armBentPos = 0.4,
  // armBent = -0.1,

  // armEllbowX_ = linkListPush( { add:[ armHandX, { r: armBentPos, useSize: armShoulderX } ] } ),
  // armEllbowY_ = linkListPush( { add:[ armHandY, { r: armBentPos, useSize: armShoulderY } ] } ),

  // armEllbowX = linkListPush( { add: [ armEllbowX_, { r: armBent, useSize: armEllbowY_ } ] } ),
  // armEllbowY = linkListPush( { add: [ armEllbowY_, { r: -armBent * 1.2, useSize: armEllbowX_ } ] } ),

  let foreArmS = linkListPush({ r: 0.008, useSize: movementL, min: 1 })
  let upperArmS = linkListPush({
    r: 1,
    useSize: foreArmS,
    max: [foreArmS, 1],
  })
  let arm2Y = linkListPush([shoulderY, upperArmS])
  let arm2SYMax1 = linkListPush({
    add: [armL, { r: 0.2, useSize: movementSY }],
  })
  let arm2SYMax2 = linkListPush({
    add: [movementSY, { r: -1, useSize: arm2Y }],
  })
  let arm2SY = linkListPush({ add: [arm2SYMax1], max: arm2SYMax2 })
  let arm2SX = linkListPush({ r: 0.2, useSize: arm2SYMax1 })
  let ellbowS = linkListPush({
    r: 1.5,
    useSize: upperArmS,
    max: [upperArmS, 2],
  })
  // ellbowSHalf = linkListPush( {r: -0.5, useSize: ellbowS } ),

  let legLowerS = foreArmS
  let legUpperS = upperArmS
  let kneeS = ellbowS
  // Shoulder
  let shoulderSXRel = 0.1
  let shoulderSYRel = shoulderSXRel * 0.5
  let shoulderSX = linkListPush({
    r: shoulderSXRel,
    useSize: movementL,
    min: 1,
  })
  let shoulderSY = linkListPush({
    r: shoulderSYRel,
    useSize: movementL,
    min: 1,
    max: { r: 0.2, useSize: movementSY },
  })
  let hipSXRel = 0.08
  let hipSX = linkListPush({ r: hipSXRel, useSize: movementL, min: 1 })
  let hipX = linkListPush({ add: [hipX_, { r: -1, useSize: hipSX }] })
  let torsoL = linkListPush({
    getLength: [
      linkListPush({ add: [{ r: -1, useSize: shoulderX, hipX }] }),
      linkListPush({ add: [{ r: -1, useSize: shoulderY, hipY }] }),
    ],
  })
  // Hip
  let hipSYRel = shoulderSXRel * 0.4
  let hipSY = linkListPush({
    r: hipSYRel,
    useSize: movementL,
    min: 1,
    max: { r: 0.15, useSize: movementSY },
  })
  // Legs
  let legL = linkListPush({
    r: 0.6,
    useSize: linkListPush({
      add: [
        linkListPush({ getLength: [lowerBodySX, lowerBodySY] }),
        { r: -1, useSize: hipSY },
      ],
    }),
  })
  let upperLeg = linkListPush({ r: 0.5, useSize: legL })
  let legSX = hipSX
  let legSY = linkListPush([
    movementSY,
    { r: -1, useSize: hipY },
    { r: -1, useSize: hipSY },
  ])
  let legX = hipX
  let legY = linkListPush([hipY, hipSY])
  // legFrontX = linkListPush( { r: -0.2, useSize: legSY } ),
  let legUpper1L = legSY
  let legLower1L = linkListPush({
    add: [legL, { r: -1, useSize: legSY }],
    min: { a: 0 },
    max: { r: 1.5, useSize: legUpper1L },
  })
  let legUpper2L = linkListPush({
    add: [{ r: 1.3, useSize: upperLeg }],
    max: linkListPush([
      legSY,
      { r: -1, useSize: perspectiveY },
      { r: -0.5, useSize: legUpperS },
    ]),
  })
  let legLower2L = linkListPush({
    add: [legL, { r: -0.8, useSize: legUpper2L }],
    min: { a: 0 },
    max: { r: 1.5, useSize: legUpper1L },
  })
  // knee1X = legFrontX,
  // knee1Y = { r: 0.5, useSize: legUpperS },
  // knee1Pos = { fX: true, fY: true, x: legFrontX, y: knee1Y },

  // Head
  let headSYRel = 0.3
  let headSXRel = headSYRel * 0.6
  let headSX = linkListPush({ r: headSXRel, useSize: torsoL })
  let headSY = linkListPush({ r: headSYRel, useSize: torsoL })
  let headX = linkListPush({
    add: [shoulderX, { r: 0.02, useSize: overshotSY }],
  })
  let headY = linkListPush({
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
  let eyeSY = linkListPush({ r: 0.2, min: 1, useSize: headSY })
  let eyesSX = linkListPush({ r: 0.6, min: 1, useSize: headSX })
  let eyeX = linkListPush({ r: 0.1, useSize: headSX })
  let eyeY = linkListPush({ r: 0.3, useSize: headSY })
  let eyeSX = linkListPush({ r: 0.5, a: -1 })
  let mouthSX = linkListPush({ r: 0.7, useSize: headSX })
  let mouthSY = linkListPush({
    r: 0.5,
    useSize: linkListPush([
      headSY,
      { r: -1, useSize: eyeY },
      { r: -1, useSize: eyeSY },
    ]),
    min: 1,
  })
  let mouthX = linkListPush({ a: 0 })
  let mouthY = linkListPush({
    r: 0.3,
    useSize: linkListPush([
      headSY,
      { r: -1, useSize: eyeY },
      { r: -1, useSize: eyeSY },
      { r: -1, useSize: mouthSY },
    ]),
  })
  // Fruit
  let fruitSXrel = 0.03
  let fruitSXBigRel = 0.01
  let fruitRatio = 1.8
  let fruitSYrel = fruitSXrel * fruitRatio
  let fruitSYBigRel = fruitSXBigRel * fruitRatio
  let fruitSX = linkListPush({
    r: fruitSXrel,
    min: 2,
    useSize: motiveSqu,
    add: [{ r: fruitSXBigRel, useSize: motiveSquBigger }],
    max: { r: 0.1, useSize: motiveSqu },
  })
  let fruitSY = linkListPush({
    r: fruitSYrel,
    min: 3,
    useSize: motiveSqu,
    add: [{ r: fruitSYBigRel, useSize: motiveSquBigger }],
    max: { r: 0.1 * 1.8, useSize: motiveSqu },
  })
  let fruitHandMaxX = linkListPush({
    add: [handSX, foreArmS, 1, { r: -0.1, useSize: overshotSY }],
    min: linkListPush({
      add: [-1, { r: 0.5, useSize: handSX }, { r: -0.5, useSize: fruitSX }],
    }),
  })
  let fruitHandMaxY = linkListPush({
    add: [handSY, foreArmS, 1, { r: -0.1, useSize: overshotSX }],
    min: linkListPush({
      add: [-1, { r: 0.5, useSize: handSY }, { r: -0.5, useSize: fruitSY }],
    }),
  })
  let fruitX = linkListPush({
    add: [centerX, { r: -1, useSize: handSX }, fruitHandMaxX],
  })
  let fruitY = linkListPush({
    add: [
      centerY,
      handSY,
      { r: -1, useSize: fruitSY },
      { r: -1, useSize: fruitHandMaxY },
    ],
  })
  // Island
  let shadowSY = linkListPush({
    add: [
      perspectiveY,
      { r: 2, useSize: legLowerS },
      { r: -0.05, useSize: overshotSY },
    ],
    min: 2,
  })
  let islandSX = linkListPush([movementSX, { r: -0.1, useSize: overshotSX }])
  let islandSY = linkListPush([shadowSY, { r: 1, useSize: groundThickness }])
  let islandX = linkListPush([centerX, { r: -1, useSize: movementSX }])
  let islandY = linkListPush([
    centerY,
    movementSY,
    { r: -1, useSize: shadowSY },
  ])
  let waterY = linkListPush([islandY, { r: -1, useSize: islandSY }])
  let waterSY = linkListPush([sYMain, { r: -1, useSize: waterY }])
  let mainTreeSX = linkListPush([sXMain, { r: -1, useSize: fruitX }, fruitSX])
  let mainTreeSY = fruitY
  let trunkSize = 0.02
  let trunkSizeBack = 0.015
  let trunkRatio = 0.5
  let trunkHor = linkListPush({ r: trunkSize, useSize: sXMain, a: 1 })
  let trunkVert = linkListPush({
    r: trunkSize * trunkRatio,
    useSize: sXMain,
    a: 1,
  })
  let trunkHorBack = linkListPush({
    r: trunkSizeBack,
    useSize: sXMain,
    a: 1,
  })
  let trunkVertBack = linkListPush({
    r: trunkSizeBack * trunkRatio,
    useSize: sXMain,
    a: 1,
  })
  // End Variables

  let leg = [
    // {color:c1},
    { sX: legUpperS },
    { fY: true, sY: legLowerS },
    { s: kneeS, fY: true, x: -1 },
  ]

  let teiresias = function (reflect) {
    let skinColor = reflect ? skinWater : skin
    let skinShadowColor = reflect ? skinWater : skinShadow
    let shortsColor = reflect ? shortsWater : shorts

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

  let trunkObj = function (shadowColor, hor, vert) {
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

  let mainImage = function () {
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

  let border = function () {
    let edgeDetail = [
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
    let borderEdgeTop = [
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
    let borderEdgeBottom = [
      { clear: true, sX: 1, sY: { r: 0.2, max: 1 }, fX: true },
      {},
      {
        m: 1,
        color: borderDetailColor,
        list: edgeDetail,
        rX: true,
      },
    ]
    let borderVertDetail = [
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
    let borderVert = [
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
    let borderHor = [
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

  let renderList = [
    // Image
    { list: mainImage() },
    border(),
  ]
  let backgroundColor = [31, 29, 29]

  return {
    renderList,
    linkList,
    background: backgroundColor,
  }
}

export default tantalos
