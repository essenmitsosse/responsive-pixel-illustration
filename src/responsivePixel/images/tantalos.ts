import { getSmallerDim, getBiggerDim } from '../helperPixelGraphics'
import {
  ColorRgb,
  ImageFunction,
  Render,
  RenderObject,
  Size,
  SizeObject,
} from '../PixelGraphics/types'

const water: ColorRgb = [36, 44, 53],
  waterLight: ColorRgb = [74, 81, 88],
  ground: ColorRgb = [72, 71, 68],
  groundDark: ColorRgb = [65, 54, 57],
  groundWater: ColorRgb = [54, 58, 61],
  tree: ColorRgb = [100, 118, 64],
  treeShadow: ColorRgb = [90, 90, 53],
  treeBackground: ColorRgb = [49, 45, 35],
  fruit: ColorRgb = [123, 35, 35],
  trunk: ColorRgb = [82, 76, 68],
  trunkShadow: ColorRgb = [74, 58, 58],
  skin: ColorRgb = [193, 180, 163],
  skinWater: ColorRgb = [69, 74, 79],
  skinShadow: ColorRgb = [162, 146, 129],
  borderColor: ColorRgb = [111, 67, 29],
  borderDetailColor: ColorRgb = [123, 87, 35],
  shorts: ColorRgb = [139, 146, 154],
  shortsWater: ColorRgb = [60, 68, 77],
  // Variables
  linkList: Array<Size | ReadonlyArray<Size>> = [],
  linkListPush = <TSize extends Size | ReadonlyArray<Size>>(
    obj: TSize,
  ): TSize => {
    linkList.push(obj)
    return obj
  },
  sXMain: Size = linkListPush({ main: true }),
  sYMain: Size = linkListPush({ main: true, height: true }),
  fullRect: Size = linkListPush(linkListPush({ add: [sXMain], max: sYMain })),
  borderSX: Size = linkListPush({ r: 0.05, useSize: fullRect }),
  borderDetail: Size = linkListPush({ r: 0.08, useSize: fullRect }),
  borderBottomDetail: Size = linkListPush({ r: 0.06, useSize: fullRect }),
  borderBottomMargin: ReadonlyArray<Size> = linkListPush([
    { r: 0.5 },
    { r: -0.5, useSize: borderDetail },
  ]),
  frameDetailSize: Size = linkListPush({ add: [borderSX, -2], min: 1 }),
  motiveSX: Size = linkListPush({
    add: [sXMain, { r: -2, useSize: borderSX }],
  }),
  motiveSY: ReadonlyArray<Size> = linkListPush([
    sYMain,
    { r: -2, useSize: borderSX },
  ]),
  motiveSqu: Size = linkListPush(
    getSmallerDim({ r: 1, useSize: [motiveSX, motiveSY] }),
  ),
  motiveSquBigger: Size = linkListPush(
    getBiggerDim({ r: 1, useSize: [motiveSX, motiveSY] }),
  ),
  overshotSX: Size = linkListPush({
    add: [motiveSX, { r: -1, useSize: motiveSqu }],
  }),
  overshotSY: Size = linkListPush({
    add: [...motiveSY, { r: -1, useSize: motiveSqu }],
  }),
  // Teiresias
  centerX: Size = linkListPush({
    r: 0.5,
    useSize: motiveSX,
    add: [{ r: 0.05, useSize: overshotSY }],
  }),
  centerY: Size = linkListPush({
    r: 0.5,
    useSize: motiveSY,
    add: [{ r: -0.02, useSize: overshotSX }],
    min: 1,
  }),
  movementSY: Size = linkListPush({
    add: [
      { r: 0.9, useSize: motiveSY },
      { r: -1, useSize: centerY },
      { r: 0.03, useSize: overshotSX },
      { r: -0.1, useSize: overshotSY },
    ],
  }),
  movementSX: Size = linkListPush({
    add: [
      { r: 0.7, useSize: motiveSquBigger },
      { r: -1, useSize: overshotSY },
    ],
    min: { r: 0.2, useSize: movementSY, max: centerX },
    max: { r: 7, useSize: movementSY },
  }),
  movementL: Size = linkListPush({
    getLength: [movementSX, movementSY],
  }),
  perspectiveY: Size = linkListPush({ r: 0.1, useSize: movementSY }),
  groundThickness = perspectiveY,
  // General Sizes
  handRel = 0.05,
  armRel = 0.2,
  torsoRel = 0.25,
  upperArmRel = handRel * 0.4,
  getBodyPartSize = (rel: number, height?: boolean, min?: boolean): Size => {
    return linkListPush({
      r: rel,
      useSize: height ? movementSY : movementSX,
      min: min ? 1 : undefined,
    })
  },
  handSX_ = getBodyPartSize(handRel, false, true),
  handSY_ = getBodyPartSize(handRel, true, true),
  armSX = getBodyPartSize(armRel),
  armSY = getBodyPartSize(armRel, true),
  torsoSX = getBodyPartSize(torsoRel),
  torsoSY = getBodyPartSize(torsoRel, true),
  bodyWithoutLegsX: ReadonlyArray<Size> = linkListPush([
    handSX_,
    armSX,
    torsoSX,
  ]),
  bodyWithoutLegsY: ReadonlyArray<Size> = linkListPush([
    handSY_,
    armSY,
    torsoSY,
  ]),
  lowerBodySX: Size = linkListPush({
    add: [movementSX, { r: -1, useSize: bodyWithoutLegsX }],
  }),
  lowerBodySY: Size = linkListPush({
    add: [movementSY, { r: -1, useSize: bodyWithoutLegsY }],
  }),
  shoulderX: ReadonlyArray<Size> = linkListPush([handSX_, armSX]),
  shoulderY: ReadonlyArray<Size> = linkListPush([handSY_, armSY]),
  hipX_: Size = linkListPush({ add: [...shoulderX, torsoSX] }),
  hipY: Size = linkListPush({ add: [...shoulderY, torsoSY] }),
  // Hand
  handRatio = 0.5,
  handSX: Size = linkListPush({
    add: [handSX_],
    min: { r: handRatio, useSize: handSY_ },
  }),
  handSY: Size = linkListPush({
    add: [handSY_],
    min: { r: handRatio, useSize: handSX_ },
  }),
  // Arm
  upperArmL: Size = linkListPush({
    r: upperArmRel,
    useSize: movementL,
    min: 1,
  }),
  armL: Size = linkListPush({ getLength: [armSX, armSY] }),
  armHandX = handSX,
  armHandY: Size = linkListPush({ a: 0 }),
  armShoulderX = shoulderX,
  armShoulderY: ReadonlyArray<Size> = linkListPush([
    ...shoulderY,
    { r: 0.5, useSize: upperArmL },
  ]),
  // armBentPos = 0.4,
  // armBent = -0.1,

  // armEllbowX_: Size = linkListPush( { add:[ armHandX, { r: armBentPos, useSize: armShoulderX } ] } ),
  // armEllbowY_: Size = linkListPush( { add:[ armHandY, { r: armBentPos, useSize: armShoulderY } ] } ),

  // armEllbowX: Size = linkListPush( { add: [ armEllbowX_, { r: armBent, useSize: armEllbowY_ } ] } ),
  // armEllbowY: Size = linkListPush( { add: [ armEllbowY_, { r: -armBent * 1.2, useSize: armEllbowX_ } ] } ),

  foreArmS: Size = linkListPush({ r: 0.008, useSize: movementL, min: 1 }),
  upperArmS: Size = linkListPush({
    r: 1,
    useSize: foreArmS,
    max: [foreArmS, 1],
  }),
  arm2Y: ReadonlyArray<Size> = linkListPush([...shoulderY, upperArmS]),
  arm2SYMax1: Size = linkListPush({
    add: [armL, { r: 0.2, useSize: movementSY }],
  }),
  arm2SYMax2: Size = linkListPush({
    add: [movementSY, { r: -1, useSize: arm2Y }],
  }),
  arm2SY: Size = linkListPush({ add: [arm2SYMax1], max: arm2SYMax2 }),
  arm2SX: Size = linkListPush({ r: 0.2, useSize: arm2SYMax1 }),
  ellbowS: Size = linkListPush({
    r: 1.5,
    useSize: upperArmS,
    max: [upperArmS, 2],
  }),
  // ellbowSHalf: Size = linkListPush( {r: -0.5, useSize: ellbowS } ),

  legLowerS = foreArmS,
  legUpperS = upperArmS,
  kneeS = ellbowS,
  // Shoulder
  shoulderSXRel = 0.1,
  shoulderSYRel = shoulderSXRel * 0.5,
  shoulderSX: Size = linkListPush({
    r: shoulderSXRel,
    useSize: movementL,
    min: 1,
  }),
  shoulderSY: Size = linkListPush({
    r: shoulderSYRel,
    useSize: movementL,
    min: 1,
    max: { r: 0.2, useSize: movementSY },
  }),
  // Hip
  hipSXRel = 0.08,
  hipSYRel = shoulderSXRel * 0.4,
  hipSX: Size = linkListPush({ r: hipSXRel, useSize: movementL, min: 1 }),
  hipSY: Size = linkListPush({
    r: hipSYRel,
    useSize: movementL,
    min: 1,
    max: { r: 0.15, useSize: movementSY },
  }),
  hipX: Size = linkListPush({ add: [hipX_, { r: -1, useSize: hipSX }] }),
  torsoL: Size = linkListPush({
    getLength: [
      linkListPush({ add: [{ r: -1, useSize: shoulderX, hipX }] }),
      linkListPush({ add: [{ r: -1, useSize: shoulderY, hipY }] }),
    ],
  }),
  // Legs
  legL: Size = linkListPush({
    r: 0.6,
    useSize: linkListPush({
      add: [
        linkListPush({ getLength: [lowerBodySX, lowerBodySY] }),
        { r: -1, useSize: hipSY },
      ],
    }),
  }),
  upperLeg: Size = linkListPush({ r: 0.5, useSize: legL }),
  legSX = hipSX,
  legSY: ReadonlyArray<Size> = linkListPush([
    movementSY,
    { r: -1, useSize: hipY },
    { r: -1, useSize: hipSY },
  ]),
  legX = hipX,
  legY: ReadonlyArray<Size> = linkListPush([hipY, hipSY]),
  // legFrontX: Size = linkListPush( { r: -0.2, useSize: legSY } ),
  legUpper1L = legSY,
  legLower1L: Size = linkListPush({
    add: [legL, { r: -1, useSize: legSY }],
    min: { a: 0 },
    max: { r: 1.5, useSize: legUpper1L },
  }),
  legUpper2L: Size = linkListPush({
    add: [{ r: 1.3, useSize: upperLeg }],
    max: linkListPush([
      ...legSY,
      { r: -1, useSize: perspectiveY },
      { r: -0.5, useSize: legUpperS },
    ]),
  }),
  legLower2L: Size = linkListPush({
    add: [legL, { r: -0.8, useSize: legUpper2L }],
    min: { a: 0 },
    max: { r: 1.5, useSize: legUpper1L },
  }),
  // knee1X = legFrontX,
  // knee1Y = { r: 0.5, useSize: legUpperS },
  // knee1Pos = { fX: true, fY: true, x: legFrontX, y: knee1Y },

  //Feet
  // Head
  headSYRel = 0.3,
  headSXRel = headSYRel * 0.6,
  headSX: Size = linkListPush({ r: headSXRel, useSize: torsoL }),
  headSY: Size = linkListPush({ r: headSYRel, useSize: torsoL }),
  headX: Size = linkListPush({
    add: [...shoulderX, { r: 0.02, useSize: overshotSY }],
  }),
  headY: Size = linkListPush({
    add: [
      ...shoulderY,
      { r: -1, useSize: headSY },
      {
        r: 0.03,
        useSize: overshotSX,
        max: linkListPush({ r: 0.5, useSize: headSY }),
      },
    ],
  }),
  eyeSY: Size = linkListPush({ r: 0.2, min: 1, useSize: headSY }),
  eyesSX: Size = linkListPush({ r: 0.6, min: 1, useSize: headSX }),
  eyeX: Size = linkListPush({ r: 0.1, useSize: headSX }),
  eyeY: Size = linkListPush({ r: 0.3, useSize: headSY }),
  eyeSX: Size = linkListPush({ r: 0.5, useSize: eyesSX, a: -1 }),
  mouthSX: Size = linkListPush({ r: 0.7, useSize: headSX }),
  mouthSY: Size = linkListPush({
    r: 0.5,
    useSize: linkListPush([
      headSY,
      { r: -1, useSize: eyeY },
      { r: -1, useSize: eyeSY },
    ]),
    min: 1,
  }),
  mouthX: Size = linkListPush({ a: 0 }),
  mouthY: Size = linkListPush({
    r: 0.3,
    useSize: linkListPush([
      headSY,
      { r: -1, useSize: eyeY },
      { r: -1, useSize: eyeSY },
      { r: -1, useSize: mouthSY },
    ]),
  }),
  // Fruit
  fruitSXrel = 0.03,
  fruitSXBigRel = 0.01,
  fruitRatio = 1.8,
  fruitSYrel = fruitSXrel * fruitRatio,
  fruitSYBigRel = fruitSXBigRel * fruitRatio,
  fruitSX: Size = linkListPush({
    r: fruitSXrel,
    min: 2,
    useSize: motiveSqu,
    add: [{ r: fruitSXBigRel, useSize: motiveSquBigger }],
    max: { r: 0.1, useSize: motiveSqu },
  }),
  fruitSY: Size = linkListPush({
    r: fruitSYrel,
    min: 3,
    useSize: motiveSqu,
    add: [{ r: fruitSYBigRel, useSize: motiveSquBigger }],
    max: { r: 0.1 * 1.8, useSize: motiveSqu },
  }),
  fruitHandMaxX: Size = linkListPush({
    add: [handSX, foreArmS, 1, { r: -0.1, useSize: overshotSY }],
    min: linkListPush({
      add: [-1, { r: 0.5, useSize: handSX }, { r: -0.5, useSize: fruitSX }],
    }),
  }),
  fruitHandMaxY: Size = linkListPush({
    add: [handSY, foreArmS, 1, { r: -0.1, useSize: overshotSX }],
    min: linkListPush({
      add: [-1, { r: 0.5, useSize: handSY }, { r: -0.5, useSize: fruitSY }],
    }),
  }),
  fruitX: Size = linkListPush({
    add: [centerX, { r: -1, useSize: handSX }, fruitHandMaxX],
  }),
  fruitY: Size = linkListPush({
    add: [
      centerY,
      handSY,
      { r: -1, useSize: fruitSY },
      { r: -1, useSize: fruitHandMaxY },
    ],
  }),
  // Island
  shadowSY: Size = linkListPush({
    add: [
      perspectiveY,
      { r: 2, useSize: legLowerS },
      { r: -0.05, useSize: overshotSY },
    ],
    min: 2,
  }),
  islandSX: ReadonlyArray<Size> = linkListPush([
    movementSX,
    { r: -0.1, useSize: overshotSX },
  ]),
  islandSY: ReadonlyArray<Size> = linkListPush([
    shadowSY,
    { r: 1, useSize: groundThickness },
  ]),
  islandX: ReadonlyArray<Size> = linkListPush([
    centerX,
    { r: -1, useSize: movementSX },
  ]),
  islandY: ReadonlyArray<Size> = linkListPush([
    centerY,
    movementSY,
    { r: -1, useSize: shadowSY },
  ]),
  waterY: ReadonlyArray<Size> = linkListPush([
    ...islandY,
    { r: -1, useSize: islandSY },
  ]),
  waterSY: ReadonlyArray<Size> = linkListPush([
    sYMain,
    { r: -1, useSize: waterY },
  ]),
  mainTreeSX: ReadonlyArray<Size> = linkListPush([
    sXMain,
    { r: -1, useSize: fruitX },
    fruitSX,
  ]),
  mainTreeSY = fruitY,
  trunkSize = 0.02,
  trunkSizeBack = 0.015,
  trunkRatio = 0.5,
  trunkHor: Size = linkListPush({ r: trunkSize, useSize: sXMain, a: 1 }),
  trunkVert: Size = linkListPush({
    r: trunkSize * trunkRatio,
    useSize: sXMain,
    a: 1,
  }),
  trunkHorBack: Size = linkListPush({
    r: trunkSizeBack,
    useSize: sXMain,
    a: 1,
  }),
  trunkVertBack: Size = linkListPush({
    r: trunkSizeBack * trunkRatio,
    useSize: sXMain,
    a: 1,
  }),
  // End Variables

  leg = [
    // {color:c1},
    { sX: legUpperS },
    { fY: true, sY: legLowerS },
    { s: kneeS, fY: true, x: -1 },
  ],
  teiresias = (reflect?: boolean): RenderObject => {
    const skinColor = reflect ? skinWater : skin,
      skinShadowColor = reflect ? skinWater : skinShadow,
      shortsColor = reflect ? shortsWater : shorts

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
          sY: [hipY, { r: -1, useSize: linkListPush([...shoulderY, 1]) }],
          x: hipX,
          y: [...shoulderY, 1],
          list: [{}, { sX: 1, color: skinShadowColor, fX: true }],
        },

        {
          y: [...shoulderY, 1],
          x: [...shoulderX, shoulderSX],
          sY: [shoulderSY, -1],
          sX: [
            hipSX,
            hipX,
            {
              r: -1,
              useSize: linkListPush([...shoulderX, shoulderSX]),
            },
            -1,
          ],
          list: [
            {},
            {
              color: skinShadowColor,
              stripes: { gap: { r: 0.1 }, change: { r: -0.1 } },
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
          x: [...shoulderX, shoulderSX],
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
  },
  trunkObj = (
    shadowColor: ColorRgb,
    hor: SizeObject,
    vert: SizeObject,
  ): Render => {
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
  },
  mainImage = (): Render => {
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
      { color: fruit, sX: fruitSX, sY: fruitSY, x: fruitX, y: fruitY },
    ]
  },
  border = (): Render => {
    const edgeDetail = [
        {},
        { sX: 1, sY: { r: 0.3, max: 1 }, color: borderColor },
        { sX: 1, sY: { r: 0.3, max: 1 }, color: borderColor, fX: true },
        { sX: 1, sY: { r: 0.3, max: 1 }, color: borderColor, fY: true },
      ],
      borderEdgeTop = [
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
            { s: { r: 0.3 }, fX: true, fY: true, list: edgeDetail },
          ],
        },
      ],
      borderEdgeBottom = [
        { clear: true, sX: 1, sY: { r: 0.2, max: 1 }, fX: true },
        {},
        { m: 1, color: borderDetailColor, list: edgeDetail, rX: true },
      ],
      borderVertDetail = [
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
            { sX: 1, sY: { r: 0.4, max: 1 }, fX: true, fY: true },
            { sX: 1, sY: { r: 0.4 }, x: 1 },
          ],
        },
      ],
      borderVert = [
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
      ],
      borderHor = [
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
        { s: borderDetail, fX: true, rX: true, list: borderEdgeTop },

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
  },
  renderList: ReadonlyArray<Render> = [
    // Image
    { list: mainImage() },
    border(),
  ],
  backgroundColor: ColorRgb = [31, 29, 29]

const image: ImageFunction = {
  renderList: renderList,
  linkList: linkList,
  background: backgroundColor,
}

export default image
