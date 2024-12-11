import { helper } from '@/renderengine/helper.js'

function brothers() {
  var help = helper,
    getSmallerDim = help.getSmallerDim,
    getBiggerDim = help.getBiggerDim,
    mult = help.mult,
    sub = help.sub,
    shadowColor = [255, 255, 255],
    shadow = help.darken(shadowColor, 0.7),
    shadowSoft = help.darken(shadowColor, 0.9),
    darkenColor = help.darken(shadowColor, 0.4),
    lighten = help.lighten(shadowColor, 0.3),
    lightenSoft = help.lighten(shadowColor, 0.1),
    c3 = [0, 0, 255],
    zBackground = [200, 150, 255],
    zSkin = shadow(zBackground),
    zSkinShadow = shadow(zSkin),
    zHair = lighten(zBackground),
    zCloth = darkenColor(zBackground),
    flash = [255, 220, 180],
    hBasic = [210, 100, 20],
    hSkin = shadow(hBasic),
    hHair = lighten(hBasic),
    hCloth = darkenColor(hBasic),
    hBackground = hBasic,
    pBasic = [116, 150, 150],
    pSkin = shadow(pBasic),
    pHair = lighten(pBasic),
    pCloth = darkenColor(pBasic),
    pBackground = pBasic,
    borderDetail = shadow(zCloth),
    backgroundColor = darkenColor(borderDetail),
    flashForm = [
      {
        points: [
          { y: { r: 0.4 } },
          { x: { r: 0.15 } },
          { x: { r: 0.4 }, y: { r: 0.5 } },
          { x: { r: 0.4 }, y: { r: 0.2 } },
          { x: { r: 1 }, y: { r: 1 } },
          { x: { r: 0.45 }, y: { r: 0.6 } },
          { x: { r: 0.45 }, y: { r: 1 } },
        ],
      },
    ],
    beard = function (hair, center) {
      var beardSideHeight = { r: 0.6, a: -1 },
        beardSideWidth = center ? 0.4 : 0.2,
        beardInner = [
          {
            stripes: {
              horizontal: true,
              change: { r: -0.9 },
              strip: 2,
              random: 'beardSmallDetail',
            },
            fY: true,
          },
        ],
        beardOuter = [
          {
            stripes: {
              horizontal: true,
              change: { r: -0.9 },
              strip: 2,
              random: 'beardDetail',
            },
            fY: true,
          },
        ]

      return {
        list: [
          // BEARD
          // Bottom
          {
            fY: true,
            tY: true,
            tX: true,
            color: hair,
            sX: ['leftSide', { r: center ? 0.5 : 0.1, save: 'leftBottom' }],
            x: 'leftBottom',
            list: [
              {
                stripes: {
                  horizontal: true,
                  change: { r: center ? -1 : -0.2 },
                  strip: 2,
                  random: 'beardDetail',
                },
                fX: true,
              },
            ],
          },
          {
            fY: true,
            fX: true,
            tY: true,
            tX: true,
            color: hair,
            sX: ['rightSide', { r: center ? 0.5 : 0.9, save: 'rightBottom' }],
            x: 'rightBottom',
            list: [
              {
                stripes: {
                  horizontal: true,
                  change: { r: -1 },
                  strip: 2,
                  random: 'beardDetail',
                },
              },
            ],
          },

          // Left
          {
            fY: true,
            sX: { r: center ? beardSideWidth : 0.1 },
            sY: beardSideHeight,
            color: hair,
            list: beardInner,
          },
          {
            fY: true,
            tX: true,
            sX: center
              ? { a: 'rightSide', save: 'leftSide' }
              : { r: 0.1, save: 'leftSide' },
            color: hair,
            rX: true,
            list: beardOuter,
          },
          // to side

          // Right
          {
            fX: true,
            fY: true,
            sX: { r: center ? beardSideWidth : 0.3 },
            sY: center ? beardSideHeight : { r: 1 },
            color: hair,
            rX: true,
            list: beardInner,
          },
          {
            fX: true,
            fY: true,
            tX: true,
            sX: { r: 0.1, save: 'rightSide' },
            color: hair,
            list: beardOuter,
          },
          // to side

          // HAIR
          {
            sX: { r: 1 },
            list: [
              {
                sY: { r: 0.1 },
                color: hair,
                stripes: {
                  random: 'beardDetail',
                  strip: 2,
                  overflow: true,
                },
              },
              {
                sY: { r: 0.05 },
                tY: true,
                color: hair,
                list: [
                  {
                    fY: true,
                    stripes: {
                      random: 'beardSmallDetail',
                      strip: 2,
                      overflow: true,
                    },
                  },
                ],
              },
            ],
          },
        ],
      }
    },
    mustach = function (hades) {
      var mustachHalf = [
        {
          sY: { r: 0.5 },
          y: { r: 0.5 },
          fY: true,
          stripes: { change: { r: -0.5 } },
        },
        {
          y: { r: 0.5 },
          sY: { r: 0.5 },
          stripes: { random: 'beardSmallDetail', strip: 2 },
        },
      ]

      return [
        { sX: 'mustachHalf', fX: true, list: mustachHalf },
        {
          sX: { r: hades ? 0.5 : 0.45, save: 'mustachHalf' },
          rX: true,
          list: mustachHalf,
        },
      ]
    },
    eyes = function (color, hair, hades) {
      var eye = [
        { mX: 2, x: 1 },
        { mY: 1, sY: { min: 3 } },
        {
          tY: true,
          color: hair,
          mX: -1,
          sY: 1,
          y: hades ? 1 : 0,
          list: [{ stripes: { random: 'beardSmallDetail' }, fY: true }],
        },
        {
          fY: true,
          tY: true,
          sY: { r: 0.15, max: 1 },
          y: -1,
          sX: { r: 0.8 },
        },
      ]

      return {
        color,
        sY: { r: hades ? 0.15 : 0.1, a: 1 },
        list: [
          { sX: 'eye', list: eye },
          {
            sX: { r: hades ? 0.4 : 0.3, save: 'eye' },
            fX: true,
            rX: true,
            list: eye,
          },
        ],
      }
    },
    getOthers = function (posei, skin, hair, cloth, background) {
      var clothShadow = !posei ? cloth : shadow(cloth),
        skinShadow = shadow(skin),
        clothDetail = [
          {
            weight: 1,
            points: [
              { fX: true },
              { y: { r: 4, otherDim: true } },
              { y: { r: 7, otherDim: true }, x: { r: -1 } },
              { y: { r: 15, otherDim: true }, x: { r: -2 } },
            ],
          },
        ],
        rightShoulder = { r: -0.3 },
        headRatio = posei ? 1.2 : 0.8,
        leftShoulder = { r: -1, useSize: 'torsoSY' }

      return [
        { color: background },
        posei
          ? {
              use: 'background',
              sX: { r: 0.1 },
              chance: 0.02,
              color: shadowSoft(background),
              mask: true,
            }
          : undefined,
        posei
          ? {
              use: 'background',
              s: 2,
              chance: 0.02,
              color: lightenSoft(background),
              mask: true,
            }
          : {
              use: 'background',
              sY: { r: 0.2 },
              chance: 0.4,
              color: shadowSoft(background),
              mask: true,
            },
        { save: 'background' },

        // TORSO
        {
          color: posei ? cloth : shadow(cloth),
          sX: { r: 2.5, useSize: 'headSY', save: 'torsoSX' },
          sY: {
            add: ['oSY', sub('headSY'), sub('oHeadTop')],
            save: 'torsoSY',
          },
          fY: true,
          fX: true,
          list: [
            {
              sX: 'torsoLeft',
              list: [
                {
                  fY: true,
                  fX: true,
                  stripes: { change: leftShoulder },
                },
                {
                  fY: true,
                  fX: true,
                  stripes: {
                    change: leftShoulder,
                    strip: 'oClotherDetail',
                    cut: true,
                  },
                  color: clothShadow,
                  list: clothDetail,
                },
              ],
            },

            {
              x: {
                add: ['torsoSX', sub('headSX'), sub('headRight')],
                debug: true,
                save: 'torsoLeft',
              },
              sX: 'headSX',
              fY: true,
              list: [
                {},
                {
                  color: clothShadow,
                  fY: true,
                  stripes: {
                    strip: 'oClotherDetail',
                    cut: true,
                  },
                  list: clothDetail,
                },
              ],
            },

            {
              sX: ['borderSmall', 'headRight'],
              x: sub('borderSmall'),
              fX: true,
              list: [
                {
                  fY: true,
                  stripes: { change: rightShoulder },
                },
                {
                  fY: true,
                  sY: { r: 1, add: [sub('oClotherDetail')] },
                  stripes: {
                    change: rightShoulder,
                    strip: 'oClotherDetail',
                    cut: true,
                  },
                  color: clothShadow,
                  list: clothDetail,
                },
              ],
            },
          ],
        },

        // TRI/DUODENT
        {
          color: skin,
          sX: ['oSX', sub('headSX'), sub('headRight')],
          mX: { r: 0.1, useSize: 'oSY' },
          x: { r: -0.01 },
          minX: 5,
          fY: true,
          sY: { r: 0.5 },
          list: [
            {
              sX: { r: 1, max: { r: 0.5, otherDim: true } },
              cX: true,
              list: [
                {
                  tY: true,
                  sY: { r: 0.6 },
                  list: [
                    { fY: true, sY: 'staff' },
                    { sX: 'staff' },
                    { sX: 'staff', fX: true },
                    posei ? { sX: 'staff', cX: true } : undefined,
                  ],
                },
                {
                  cX: true,
                  sX: { r: 0.08, min: 1, save: 'staff' },
                  fY: true,
                },
              ],
            },
          ],
        },

        // HEAD
        {
          sX: {
            r: 0.6,
            useSize: 'oSX',
            max: { r: 0.45 / headRatio, useSize: 'oSY' },
            save: 'headSX',
          },
          sY: { r: headRatio, useSize: 'headSX', save: 'headSY' },
          fX: true,
          x: {
            add: [mult(0.3, 'oSX'), mult(-0.3, 'headSX')],
            save: 'headRight',
          },
          y: 'oHeadTop',
          list: [
            {},

            // FACE
            {
              mX: { r: 0.15 },
              x: { r: -0.07 },
              list: [
                {
                  y: { r: posei ? 0.3 : 0.32 },
                  sY: { r: 0.55 },
                  list: [
                    eyes(skinShadow, hair, posei),

                    // MUSTACH
                    {
                      color: skinShadow,
                      fY: true,
                      tY: true,
                      mX: { r: 0.2 },
                      sY: 1,
                    },
                    {
                      color: hair,
                      x: { r: -0.05 },
                      sY: { r: posei ? 0.3 : 0.2 },
                      fY: true,
                      mX: posei ? undefined : { r: 0.1 },
                      list: mustach(posei),
                    },

                    // NOSE
                    {
                      mX: { r: posei ? 0.3 : 0.4 },
                      x: -1,
                      y: { r: 0.2 },
                      sY: { r: 0.7 },
                      color: skinShadow,
                      list: [
                        {
                          color: skin,
                          fY: true,
                          sY: { r: 0.5 },
                        },
                        {
                          fY: true,
                          sY: 'noseBottom',
                          list: [
                            {},
                            {
                              name: 'Dot',
                              fX: true,
                              fY: true,
                              color: hair,
                            },
                          ],
                        },
                        {
                          fY: true,
                          sY: {
                            r: posei ? 0.6 : 0.4,
                          },
                          sX: { r: 0.6 },
                          y: {
                            r: 0.15,
                            save: 'noseBottom',
                          },
                          list: [
                            {
                              stripes: {
                                horizontal: true,
                                change: {
                                  r: -0.5,
                                },
                              },
                              fX: true,
                              fY: true,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },

                {
                  fY: true,
                  sY: 1,
                  color: hair,
                  stripes: { random: 'beardSmallDetail' },
                },
              ],
            },

            // BEARD
            beard(hair),

            // EAR
            posei
              ? {
                  tX: true,
                  fX: true,
                  sX: { r: 0.1 },
                  sY: { r: 0.2 },
                  y: { r: 0.4 },
                  list: [{ mY: 1 }, { sX: { r: 1, a: -1 } }],
                }
              : undefined,
          ],
        },

        // { fX:true, tX:true, color:backgroundColor, sX:["borderSmall",1] }
      ]
    },
    hair = [
      {
        stripes: {
          change: { r: -1 },
          random: 'beardDetail',
          strip: 2,
          horizontal: true,
        },
        fX: true,
        fY: true,
      },
    ],
    outerStrip = {
      gap: 'gap',
      strip: 'strip',
      horizontal: true,
      overflow: true,
    },
    detailBorder = [
      {},
      { color: backgroundColor, mY: 1, sX: 1, fX: true },
      { color: backgroundColor, mY: 1, sX: 'detail' },
    ],
    outerBorder = [
      { color: backgroundColor },
      { sX: 'borderOutline', x: 'borderMargin' },
      { sX: 'borderOutline', x: 'borderMargin', fX: true },
      {
        sX: 'borderInline',
        x: 'borderInner',
        stripes: outerStrip,
        list: detailBorder,
      },
      {
        sX: 'borderInline',
        x: 'borderInner',
        fX: true,
        rX: true,
        y: 'strip',
        stripes: outerStrip,
        list: detailBorder,
      },
    ],
    borderSmall = [
      { color: backgroundColor },
      { sX: 'borderSmallOutline', x: 'borderSmallMargin' },
      {
        sX: 'borderSmallInline',
        x: 'borderSmallInner',
        stripes: outerStrip,
        list: detailBorder,
      },
    ],
    borderSmallCenter = [
      { color: backgroundColor },
      {
        sX: 'borderSmallInline',
        x: 'borderSmallInner',
        stripes: outerStrip,
        list: detailBorder,
      },
      { sX: 'borderSmallOutline', x: 'borderSmallMargin' },
      { sX: 'borderSmallOutline', x: 'borderSmallMargin', fX: true },
    ],
    edgeSmallOuter = [
      { color: backgroundColor },
      { sX: 'borderSmallOutline', x: 'borderSmallMargin' },
      {
        sY: 'borderSmallOutline',
        sX: ['borderSmallMargin', 'borderSmallInner'],
        y: 'borderSmallMargin',
        fX: true,
      },
    ],
    edgeSmallInner = [
      { sX: 'borderSmallOutline', x: 'borderSmallMargin', fX: true },
      {
        sY: 'borderSmallOutline',
        sX: 'borderSmallMargin',
        y: 'borderSmallMargin',
        fX: true,
      },
    ],
    edgeSmallCenter = [
      {
        sX: 'borderSmallOutline',
        sY: 'borderSmallMargin',
        x: 'borderSmallMargin',
        fY: true,
      },
      {
        sX: 'borderSmallOutline',
        sY: 'borderSmallMargin',
        x: 'borderSmallMargin',
        fY: true,
        fX: true,
      },
    ],
    edgeWide = function (center) {
      return [
        { color: backgroundColor },
        { sY: 'borderSmallOutline', y: 'borderSmallMargin', fY: true },
        { sY: 'borderSmallOutline', y: 'borderSmallMargin' },
        {
          mY: 'borderMargin',
          mX: 'borderSmallMargin',
          list: [{}, { m: 1, color: backgroundColor }],
        },
        {
          sX: 'borderSmallOutline',
          sY: 'borderMargin',
          x: 'borderSmallMargin',
          fY: true,
        },
        center
          ? {
              sX: 'borderSmallOutline',
              sY: 'borderMargin',
              x: 'borderSmallMargin',
              fY: true,
              fX: true,
            }
          : undefined,
      ]
    },
    edgeBig = [
      { color: backgroundColor },
      {
        color: borderDetail,
        sX: 'borderOutline',
        x: 'borderMargin',
        y: 'borderMargin',
      },
      {
        color: borderDetail,
        sY: 'borderOutline',
        y: 'borderMargin',
        x: 'borderMargin',
      },
      {
        color: borderDetail,
        sX: 'borderOutline',
        sY: ['borderMargin', 'borderOutline'],
        x: 'borderMargin',
        fX: true,
        fY: true,
      },
      {
        color: borderDetail,
        sY: 'borderOutline',
        sX: ['borderMargin', 'borderOutline'],
        y: 'borderMargin',
        fX: true,
        fY: true,
      },
      {
        weight: 'borderOutline',
        points: [
          { x: 'borderMargin', y: 'borderMargin' },
          {
            x: 'borderMargin',
            y: 'borderMargin',
            fX: true,
            fY: true,
          },
        ],
      },
    ],
    areaStrip = { strip: 'strip', gap: 1, horizontal: true },
    areaPiece = function (who) {
      var hades = who === 'hades'

      return [
        {},
        { m: 'borderOutline', color: backgroundColor },
        {
          m: 'borderInner',
          stripes: { strip: mult(2, 'strip'), overflow: true },
          list: [
            { sX: 'strip', stripes: areaStrip },
            {
              sX: 'strip',
              y: 1,
              sY: { r: 1, add: [sub('gap')] },
              stripes: areaStrip,
              fX: true,
            },
          ],
        },
        {
          color: backgroundColor,
          fX: true,
          sX: 1,
          x: 'borderOutline',
          mY: 'borderOutline',
        },
        who === 'zeus'
          ? {
              mX: { r: 0.2 },
              mY: { r: 0.2 },
              minY: 7,
              list: flashForm,
              color: backgroundColor,
            }
          : {
              x: 'borderInner',
              minY: 10,
              mY: { r: 0.2 },
              sX: { r: 0.5, save: 'staffLength' },
              color: backgroundColor,
              list: [
                {
                  mY: { r: hades ? 0.1 : 0 },
                  list: [
                    {
                      fX: true,
                      sX: 'staff',
                      list: [
                        {},
                        {
                          fX: true,
                          tX: true,
                          sY: 'staff',
                          sX: 'tipLength',
                        },
                        {
                          fX: true,
                          tX: true,
                          sY: 'staff',
                          fY: true,
                          sX: {
                            r: 0.6,
                            useSize: 'staffLength',
                            save: 'tipLength',
                          },
                        },
                      ],
                    },
                    {
                      sY: {
                        r: 0.1,
                        useSize: 'staffLength',
                        save: 'staff',
                      },
                      sX: { r: hades ? 1 : 1.5 },
                      cY: true,
                    },
                  ],
                },
              ],
            },
      ]
    },
    sideBorder = [
      {
        sX: 'border',
        sY: 'borderSmall',
        list: edgeWide(),
        rotate: 90,
        rX: true,
        tX: true,
      },
      {
        sX: 'border',
        sY: 'borderSmall',
        list: edgeWide(),
        rotate: -90,
        tX: true,
        fX: true,
      },
    ],
    oSideBorder = [
      {
        s: 'borderSmall',
        tX: true,
        fX: true,
        rX: true,
        list: edgeSmallInner,
      },
    ],
    renderList = [
      // MAIN IMAGE
      {
        m: 'border',
        list: [
          // ZEUS
          {
            sX: 'zSX',
            sY: 'zSY',
            cX: true,
            color: zSkin,
            list: [
              { color: zBackground },
              {
                use: 'background',
                chance: 0.005,
                color: flash,
                mask: true,
              },
              { save: 'background' },

              {
                s: {
                  add: [mult(0.5, 'zSX'), mult(-0.5, 'zHeadSX')],
                  max: ['zSY', sub('zHeadBottom')],
                },
                m: mult(0.08, 'zSquare'),
                y: { r: -0.05 },
                x: { r: -0.008 },
                color: flash,
                list: flashForm,
              },

              // HAIR
              {
                sX: 'zHeadSX',
                sY: 'zHeadSY',
                cX: true,
                y: 'zHeadTop',
                list: [
                  {
                    color: zHair,
                    fY: true,
                    sY: { r: 0.8 },
                    list: [
                      {
                        tX: true,
                        sX: 'hair',
                        list: hair,
                      },
                      {
                        fX: true,
                        tX: true,
                        rX: true,
                        sX: { r: 0.4, save: 'hair' },
                        list: hair,
                      },
                    ],
                  },
                ],
              },

              // TORSO
              {
                sX: { r: 3, useSize: 'zHeadSY' },
                sY: 'zHeadBottom',
                fY: true,
                cX: true,
                list: [
                  {
                    sX: { r: 0.5 },
                    stripes: { change: 'shoulderChange' },
                    fY: true,
                  },
                  {
                    sX: { r: 0.5 },
                    fX: true,
                    stripes: {
                      change: {
                        r: 0.5,
                        save: 'shoulderChange',
                      },
                    },
                    fY: true,
                  },
                  {
                    use: 'chest',
                    chance: 0.1,
                    sY: 2,
                    color: zSkinShadow,
                  },
                  {
                    save: 'chest',
                    mX: { r: 0.1 },
                    y: { r: 0.1 },
                  },
                  {
                    color: zCloth,
                    fX: true,
                    fY: true,
                    x: { r: 0.06 },
                    sX: { r: 0.2 },
                    sY: { r: 1.2 },
                    stripes: {
                      strip: { r: 0.05 },
                      change: { r: 0.2 },
                    },
                  },
                ],
              },

              // HEAD
              {
                sX: 'zHeadSX',
                sY: 'zHeadSY',
                cX: true,
                y: 'zHeadTop',
                list: [
                  {},

                  {
                    color: zSkinShadow,
                    fY: true,
                    sY: { r: 0.4 },
                  },
                  beard(zHair, true),
                  {
                    fY: true,
                    sY: { r: 0.25 },
                    color: zHair,
                    stripes: {
                      random: 'beardDetail',
                      strip: 2,
                    },
                  },

                  // FACE
                  {
                    mX: { r: 0.1 },
                    y: { r: 0.3 },
                    sY: { r: 0.45 },
                    list: [
                      {
                        mX: { r: 0.1 },
                        list: [eyes(zSkinShadow, zHair)],
                      },
                      {
                        color: zHair,
                        sY: { r: 0.4 },
                        y: { r: 0.1 },
                        fY: true,
                        list: mustach(true),
                      },
                      {
                        mX: { r: 0.3 },
                        sY: { r: 0.65 },
                        list: [
                          {
                            fY: true,
                            sY: { r: 0.4 },
                            color: zSkinShadow,
                            mX: { r: 0.2 },
                          },
                          {
                            fY: true,
                            sY: { r: 0.2 },
                            id: 'noseW',
                            list: [
                              {
                                name: 'Dot',
                                fY: true,
                                clear: true,
                              },
                              {
                                name: 'Dot',
                                fX: true,
                                fY: true,
                                clear: true,
                              },
                              {
                                color: zSkinShadow,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              // { tY:true, fY:true, color:backgroundColor },
              // { tX:true, color:backgroundColor, sX:"border" },
              // { tX:true, fX:true, color:backgroundColor, sX:"border" },
            ],
          },
          // END ZEUS

          // OTHERS
          {
            color: c3,
            fY: true,
            sY: 'oSYboth',
            list: [
              // HADES
              {
                sX: 'oSX',
                sY: 'oSY',
                color: hSkin,
                list: getOthers(false, hSkin, hHair, hCloth, hBackground),
              },
              // END HADES

              // POSEIDON
              {
                sX: 'oSX',
                sY: 'oSY',
                fX: true,
                fY: true,
                color: pSkin,
                rX: true,
                list: getOthers(true, pSkin, pHair, pCloth, pBackground),
              },
              // END POSEIDON
            ],
          },
          // END OTHERS
        ],
      },

      // FRAMES
      {
        color: borderDetail,
        list: [
          // BELOW HADES
          {
            sY: 'borderSmall',
            y: 'centerBorder',
            fY: true,
            mX: 'border',
            rotate: 90,
            list: borderSmall,
          },

          // BELOW ZEUS
          {
            sY: 'borderSmall',
            sX: 'zSX',
            y: ['border', 'zSY'],
            cX: true,
            rotate: 90,
            rX: true,
            rY: true,
            list: borderSmall,
          },

          {
            sY: 'switchLayout',
            list: [
              // BELOW ZEUS
              {
                list: areaPiece('zeus'),
                sX: 'zSX',
                sY: ['motiveSY', sub('zSY'), sub('borderSmall')],
                fY: true,
                y: 'border',
                cX: true,
              },

              // ABOVE OTHERS
              {
                list: borderSmall,
                rotate: 90,
                sX: 'oSX',
                sY: 'borderSmall',
                y: 'aboveBorder',
                x: 'border',
              },
              {
                list: borderSmall,
                rotate: 90,
                rY: true,
                sX: 'oSX',
                sY: 'borderSmall',
                fX: true,
                y: {
                  add: ['border', 'aboveOther'],
                  save: 'aboveBorder',
                },
                x: 'border',
              },

              {
                list: areaPiece('hades'),
                sX: 'oSX',
                sY: 'aboveOther',
                y: 'border',
                x: 'border',
              },
              {
                list: areaPiece('poseidon'),
                rX: true,
                sX: 'oSX',
                sY: 'aboveOther',
                fX: true,
                y: 'border',
                x: 'border',
              },
            ],
          },

          // LEFT / RIGHT
          { sX: 'border', mY: 'border', list: outerBorder },
          {
            sX: 'border',
            fX: true,
            mY: 'border',
            rX: true,
            list: outerBorder,
          },

          // TOP / BOTTOM
          {
            sY: 'border',
            fY: true,
            mX: 'border',
            rotate: -90,
            list: outerBorder,
          },
          {
            sY: 'border',
            mX: 'border',
            rotate: 90,
            rX: true,
            list: outerBorder,
          },

          // BETWEEN OTHERS
          {
            list: borderSmallCenter,
            sX: 'borderSmall',
            sY: 'between',
            fY: true,
            cX: true,
            y: 'border',
          },

          // OTHERS SIDE
          {
            list: borderSmall,
            sX: 'borderSmall',
            sY: { a: 'switch', max: 'motiveSY' },
            y: 'border',
            x: ['border', 'oSX'],
          },
          {
            list: borderSmall,
            sX: 'borderSmall',
            sY: { a: 'switch', max: 'motiveSY' },
            y: 'border',
            rX: true,
            x: ['border', 'oSX'],
            fX: true,
          },

          // EDGES
          // Below Zeus
          {
            sY: 'borderSmall',
            sX: 'zSX',
            y: ['border', 'zSY'],
            rY: true,
            cX: true,
            list: [
              {
                sY: 'switch',
                list: [
                  {
                    s: 'borderSmall',
                    list: edgeSmallOuter,
                    tX: true,
                  },
                  {
                    s: 'borderSmall',
                    list: edgeSmallOuter,
                    rX: true,
                    tX: true,
                    fX: true,
                  },
                ],
              },
              {
                sY: ['borderSmall', sub('switch')],
                list: sideBorder,
              },
            ],
          },

          {
            sY: {
              a: 'switch',
              max: { r: 1 },
              save: 'switchLayout',
            },
            list: [
              // above Others
              {
                sX: 'oSX',
                sY: 'borderSmall',
                y: 'aboveBorder',
                x: 'border',
                list: oSideBorder,
              },
              {
                sX: 'oSX',
                sY: 'borderSmall',
                fX: true,
                y: {
                  add: ['border', 'aboveOther'],
                  save: 'aboveBorder',
                },
                x: 'border',
                rX: true,
                list: oSideBorder,
              },

              // Zeus Edges
              {
                sX: 'borderSmall',
                sY: 'border',
                x: ['border', 'oSX'],
                list: edgeWide(),
              },
              {
                sX: 'borderSmall',
                sY: 'border',
                x: ['border', 'oSX'],
                rX: true,
                fX: true,
                list: edgeWide(),
              },
              {
                sX: 'borderSmall',
                sY: 'border',
                x: ['border', 'oSX'],
                rY: true,
                fY: true,
                list: edgeWide(),
              },
              {
                sX: 'borderSmall',
                sY: 'border',
                x: ['border', 'oSX'],
                rX: true,
                rY: true,
                fY: true,
                fX: true,
                list: edgeWide(),
              },
            ],
          },

          { s: 'border', list: edgeBig },
          { s: 'border', list: edgeBig, rX: true, fX: true },
          { s: 'border', list: edgeBig, rY: true, fY: true },
          {
            s: 'border',
            list: edgeBig,
            rX: true,
            rY: true,
            fX: true,
            fY: true,
          },

          // Betwenn Others
          {
            sX: 'borderSmall',
            sY: {
              add: ['oSY', sub('switch'), sub('switch2')],
              save: 'between',
            },
            fY: true,
            cX: true,
            y: 'border',
            list: [
              {
                tY: true,
                sY: 'borderSmall',
                list: edgeSmallCenter,
              },
              {
                tY: true,
                fY: true,
                sY: 'border',
                list: edgeWide(true),
                rY: true,
              },
            ],
          },

          // below Hades
          {
            sY: { a: 'switch2', max: 'borderSmall' },
            y: 'centerBorder',
            fY: true,
            mX: 'border',
            list: sideBorder,
          },
        ],
      },

      // { sY:2, x:2, y:2, sX:"motiveSqu", color:[64,64,64] },
      // { sX:2, x:2, y:2, sY:"motiveSqu", color:[64,64,64] },

      // { sX:2, sY:"restSYdelay", color:[120,0,0] },
      // { sY:2, sX:"restSXdelay", color:[0,120,0] },

      // { sX:2, sY:"restSY", color:[255,0,0] },
      // { sY:2, sX:"restSX", color:[0,255,0] },

      // { s:{a:"switch", max:5} , color:c5, fX:true, fY:true },
      // { s:{a:"switch2", max:5} , color:c5, fX:true, fY:true },
    ],
    headRatio = 1.33,
    variableList = {
      fullRect: { r: 1, max: { r: 1, height: true } },

      // BORDER
      border: mult(0.05, 'fullRect'),
      borderSub: sub('border'),
      borderSmall: mult(0.02, 'fullRect', 1),
      borderSmallSub: sub('borderSmall'),

      // MOTIVE
      motiveSX: { add: [{ r: 1 }, mult(-2, 'border')] },
      motiveSY: [{ r: 1, height: true }, mult(-2, 'border')],

      motiveSqu: getSmallerDim({
        r: 1,
        useSize: ['motiveSX', 'motiveSY'],
      }),
      motiveSquBigger: getBiggerDim({
        r: 1,
        useSize: ['motiveSX', 'motiveSY'],
      }),

      restSX: ['motiveSX', sub('motiveSqu')],
      restSY: ['motiveSY', sub('motiveSqu')],

      restSXSuper: {
        add: ['restSX', mult(-0.2, 'motiveSqu')],
        min: { a: 0 },
      },
      switch: mult(1000, 'restSXSuper'),

      restSYSuper: {
        add: ['restSY', mult(-1.5, 'motiveSqu')],
        min: { a: 0 },
      },
      switch2: mult(1000, 'restSYSuper'),

      // MAINFRAMES
      zMX: {
        a: 'switch',
        max: [mult(0.32, 'motiveSX'), mult(-0.05, 'restSX')],
      },
      zSYHor: {
        add: [mult(0.6, 'motiveSY'), mult(0.5, 'restSX'), 'switch2'],
        max: 'motiveSY',
      },
      zSX: { add: ['motiveSX', mult(-2, 'zMX')] },
      zSY: {
        a: 'switch',
        max: 'zSYHor',
        min: [
          mult(0.5, 'motiveSY'),
          mult(0.2, 'restSY'),
          mult(-0.3, 'restSYSuper'),
        ],
      },
      zSquare: getSmallerDim({ r: 1, useSize: ['zSX', 'zSY'] }),
      zSquareBigger: getBiggerDim({ r: 1, useSize: ['zSX', 'zSY'] }),

      oBothSX: {
        add: [
          'motiveSX',
          {
            add: [sub('switch')],
            min: [sub('zSX'), 'borderSmallSub'],
          },
          'borderSmallSub',
        ],
      },
      oSYHor: {
        add: [mult(0.6, 'motiveSY'), mult(0.5, 'restSX'), 'switch2'],
        max: 'motiveSY',
      },
      oSYboth: {
        add: ['motiveSY', sub('zSY'), 'borderSmallSub', 'switch'],
        max: 'oSYHor',
      },
      oSYwithoutBorder: ['oSYboth', 'borderSmallSub'],

      oSX: {
        r: 0.5,
        useSize: 'oBothSX',
        a: 'switch2',
        max: 'motiveSX',
      },
      oSY: {
        add: [sub('switch2'), 'oSYboth'],
        min: mult(0.5, 'oSYwithoutBorder'),
        max: 'oSYboth',
      },

      oSquare: getSmallerDim({ r: 1, useSize: ['oSX', 'oSY'] }),
      oSquareBigger: getBiggerDim({ r: 1, useSize: ['oSX', 'oSY'] }),

      centerBorder: { a: 'switch2', max: ['border', 'oSY'] },
      aboveOther: {
        a: 'switch',
        max: ['motiveSY', sub('oSY'), sub('borderSmall')],
      },

      // ZEUS
      // Head
      zHeadSX: getSmallerDim({
        r: 0.8,
        r2: 0.6 / headRatio,
        useSize: ['zSX', 'zSY'],
      }),
      zHeadSY: mult(headRatio, 'zHeadSX'),
      zHeadRestSX: ['zSY', sub('zHeadSY')],
      zHeadTop: [mult(0.2, 'zHeadRestSX')],
      zHeadBottom: ['zSY', sub('zHeadSY'), sub('zHeadTop')],

      // OTHERS
      // Head
      oHeadTop: mult(0.1, 'oSquare'),
      beardDetail: 2,
      beardSmallDetail: 1,

      // Torso
      oClotherDetail: {
        r: 0.08,
        a: 2,
        useSize: 'oSquare',
        max: { r: 0.5 },
      },

      // BORDER
      borderMargin: 1,
      borderOutline: 1,
      borderGap: 1,
      borderInner: ['borderMargin', 'borderOutline'],
      borderInlineBoth: ['border', mult(-2, 'borderInner'), sub('borderGap')],
      borderInline: mult(0.5, 'borderInlineBoth'),
      strip: { add: ['borderInline', 1], min: 1 },
      gap: { add: ['borderInline', -1], min: 1 },
      detail: ['strip', -3],

      borderSmallOutline: 1,
      borderSmallMargin: 1,
      borderSmallInner: ['borderSmallMargin', 'borderSmallOutline'],
      borderSmallInline: [
        'borderSmall',
        sub('borderSmallInner'),
        sub('borderSmallMargin'),
      ],
    }

  return {
    renderList,
    variableList,
    background: backgroundColor,
  }
}

export default brothers
