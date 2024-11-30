import { helper } from '../renderengine/helper.js'

export default function () {
  var help = helper,
    getSmallerDim = help.getSmallerDim,
    getBiggerDim = help.getBiggerDim,
    mult = help.mult,
    sub = help.sub,
    shadowColor = [255, 255, 255],
    shadow = help.darken(shadowColor, 0.7),
    detail = help.darken(shadowColor, 0.4),
    lighten = help.lighten(shadowColor, 0.3),
    c1 = [255, 0, 0],
    c2 = [0, 255, 0],
    c3 = [0, 0, 255],
    c4 = [255, 255, 0],
    c5 = [255, 0, 255],
    c6 = [255, 255, 255],
    c7 = [0, 0, 0],
    c8 = [128, 128, 128],
    c9 = [64, 64, 64],
    wood = [155, 114, 70],
    wood1 = [143, 92, 57],
    wood2 = [177, 124, 62],
    wood3 = [130, 99, 64],
    wood4 = [171, 129, 85],
    woodDark = [60, 51, 45],
    holes = [64, 37, 19],
    sail = [208, 202, 202],
    string = [171, 177, 190],
    oar = [131, 93, 39],
    paddle = [219, 216, 211],
    ram = [149, 136, 100],
    slaveSkin = [162, 142, 128],
    slaveCloth = [65, 71, 79],
    spear = [151, 176, 175],
    spearTip = [137, 137, 137],
    argoCloth = [108, 50, 50],
    argoSkin = [200, 172, 151],
    argoHelm = [161, 133, 88],
    water = [26, 59, 120],
    water1 = [0, 36, 102],
    water2 = [9, 22, 71],
    foam = [245, 249, 255],
    backgroundColor = [165, 239, 255],
    cloud = [198, 245, 255],
    mast = function (center, fromRight) {
      return {
        sX: 'mastSX',
        color: wood1,
        cX: center,
        fX: fromRight,
        minY: 20,
        list: [
          {
            cX: true,
            sY: { r: 0.85 },
            sX: 'sail',
            color: sail,
            list: [
              {
                points: [
                  { x: { r: 0.3 }, y: { r: 0.15 } }, // Upper Left Tip
                  { x: { r: 0.65 }, y: { r: 0.13 } },
                  { x: { r: 0.85 }, y: { r: 0.07 } },
                  { x: { r: 0.95 } }, // Upper Right Tip

                  { y: { r: 0.4 }, fX: true },
                  { y: { r: 0.6 }, x: { r: 0.95 } },

                  { y: { r: 0.9 }, x: { r: 0.8 } },
                  { fY: true, x: { r: 0.6 } }, // Lower Right Tip

                  { y: { r: 0.8 }, x: { r: 0.8 } },

                  { y: { r: 0.85 }, x: { r: 0.3 } },

                  { fY: true },
                  { y: { r: 0.8 }, x: { r: 0.18 } },
                  { y: { r: 0.7 }, x: { r: 0.2 } },
                  { y: { r: 0.3 }, x: { r: 0.29 } },
                ],
              },
              {
                color: wood1,
                weight: 1,
                points: [
                  { x: { r: 0.3 }, y: { r: 0.15 } },
                  { x: { r: 0.65 }, y: { r: 0.13 } },
                  { x: { r: 0.85 }, y: { r: 0.07 } },
                  { x: { r: 0.95 } },
                ],
              },
            ],
          },
          {
            cX: true,
            color: string,
            sX: {
              r: 0.2,
              add: [mult(0.4, 'motiveSY')],
              max: { r: 1.3, max: 'innerShipSX' },
              otherDim: true,
              save: 'sail',
            },
            list: [
              { points: [{ x: { r: 0.5 } }, { fY: true }] },
              {
                points: [{ x: { r: 0.3 }, y: { r: 0.15 } }, { fY: true }],
              },
              {
                points: [{ x: { r: 0.95 } }, { x: { r: 0.3 }, fY: true }],
              },
              {
                points: [
                  { y: { r: 0.85 }, x: { r: 0.6 } },
                  { x: { r: 0.3 }, fY: true },
                ],
              },
            ],
          },
          {},
        ],
      }
    },
    fullOar = [
      { color: oar, weight: 1, points: [{ fY: true }, { fX: true }] },
      { color: paddle, s: 2, fY: true, tY: true, tX: true },
      { color: paddle, s: 2, fY: true, tY: true, tX: true, x: -1, y: -1 },
      { color: paddle, s: 2, fY: true, tY: true, tX: true, x: -2, y: -2 },
    ],
    faceSlop = [{ weight: 3, points: [{}, { fX: true, fY: true }] }],
    eye = [
      {},
      { x: { r: 0.5 } },
      { y: { r: 0.5 }, fX: true },
      { fY: true, fX: true },
      { fY: true, x: { r: 0.3 }, y: { r: 0.3 } },
    ],
    cloudShape = [
      {
        points: [
          { x: { r: 0.5 } },
          { x: { r: 0.4 }, y: { r: 0.4 } },
          { fY: true },
          { fX: true, fY: true },
        ],
      },
      {
        sX: { r: 0.5 },
        sY: { a: 1 },
        fY: true,
        stripes: {
          change: { r: 0.8 },
          random: { r: 0.05 },
          strip: { a: 1, random: 2 },
        },
      },
      {
        sX: { r: 0.5 },
        sY: { a: 1 },
        fY: true,
        fX: true,
        stripes: {
          change: { r: 1 },
          random: { r: 0.05 },
          strip: { a: 1, random: 2 },
        },
      },
    ],
    renderList = [
      // { s:10, color:wood, list:[
      // 	{},
      // 	{ m:2, list:[
      // 		{ color:wood1, s:3 },
      // 		{ color:wood2, s:3, fX:true },
      // 		{ color:wood3, s:3, fY:true },
      // 		{ color:wood4, s:3, fX:true, fY:true },
      // 		{ fY:true, sY:1, color:woodDark },
      // 	]}
      // ] },

      {
        color: cloud,
        sX: { r: 0.5, a: 10 },
        sY: { r: 0.1, a: 20 },
        x: 5,
        y: { r: 0.6, a: -20 },
        list: cloudShape,
      },
      {
        color: cloud,
        sX: { r: 0.5, a: 10 },
        sY: { r: 0.5, a: -30 },
        x: { r: -0.2 },
        fY: true,
        y: 90,
        list: cloudShape,
      },
      {
        color: cloud,
        sX: { r: 0.4, a: -5 },
        sY: { r: 0.2, a: 10 },
        y: { r: 0.3, a: 5 },
        x: { r: 0.1 },
        fX: true,
        list: cloudShape,
      },
      {
        color: cloud,
        sX: { r: 0.4, a: -5 },
        sY: { r: 0.2, a: 10 },
        y: { r: 0.2, a: -5 },
        x: { r: -0.2, a: 5 },
        fX: true,
        list: cloudShape,
      },

      // WATER

      {
        fY: true,
        sY: 'waterSY',
        color: water,
        list: [
          {},
          {
            stripes: { horizontal: true, random: sub('backSX') },
            fX: true,
            list: [
              {
                stripes: {
                  gap: {
                    add: ['waterGapLength', 1],
                    save: 'waterGapLength',
                  },
                  strip: {
                    add: ['waterLength', mult(-0.012, 'motiveSX')],
                    save: 'waterLength',
                    random: 'backSX',
                  },
                },
                list: [{ color: water2 }, { sX: { r: 0.4 }, color: water1 }],
              },
            ],
          },
          {
            fX: true,
            sX: 2,
            stripes: {
              horizontal: true,
              random: mult(0.5, 'frontSX'),
            },
            color: water,
          },
        ],
      },

      {
        sX: { a: 0, save: 'waterGapLength' },
        sY: { r: 0.2, useSize: 'motiveSX', save: 'waterLength' },
      },

      // BOAT
      {
        sX: 'boatSX',
        cX: true,
        fY: true,
        y: 'waterSY',
        sY: 'boatSY',
        color: wood,
        list: [
          // BACK
          {
            sY: {
              add: [mult(2, 'boatSY'), mult(-1, 'deckSYreal')],
              save: 'backSY',
            },
            sX: 'backSX',
            fY: true,
            list: [
              {
                points: [
                  // Right
                  { y: 5, fX: true },
                  {
                    x: { r: 0.2 },
                    y: [mult(0.3, 'upperEnd'), 3],
                    fX: true,
                  },
                  {
                    x: { r: 0.3 },
                    y: [mult(0.5, 'upperEnd'), 3],
                    fX: true,
                  },
                  {
                    x: { r: 0.2 },
                    y: [mult(0.7, 'upperEnd'), 3],
                    fX: true,
                  },

                  {
                    fY: true,
                    fX: true,
                    y: ['boatSY', sub('deckSYreal')],
                  },
                  { fY: true, fX: true },

                  // Left
                  { y: { r: 0.85 }, x: { r: 0.5 } },
                  { y: { r: 0.7 }, x: { r: 0.2 } },
                  { y: { r: 0.6 }, x: { r: 0.08 } },
                  { y: { r: 0.5 } },

                  { y: { r: 0.4 }, x: { r: 0.08 } },
                  { y: { r: 0.3 }, x: { r: 0.2 } },
                  { y: { r: 0.2 }, x: { r: 0.4 } },
                  { fX: true },
                ],
              },
              {
                color: woodDark,
                weight: 1,
                points: [
                  // Right
                  { y: 5, fX: true },
                  {
                    x: { r: 0.2 },
                    y: [mult(0.3, 'upperEnd'), 3],
                    fX: true,
                  },
                  {
                    x: { r: 0.3 },
                    y: [mult(0.5, 'upperEnd'), 3],
                    fX: true,
                  },
                  {
                    x: { r: 0.2 },
                    y: [mult(0.7, 'upperEnd'), 3],
                    fX: true,
                  },

                  {
                    fY: true,
                    fX: true,
                    y: ['boatSY', sub('deckSYreal')],
                  },
                ],
              },
              { sX: 3, sY: 6, y: 1, fX: true, color: woodDark },
              {
                color: woodDark,
                fX: true,
                tX: true,
                sY: 6,
                sX: { r: 0.5 },
                list: [
                  {
                    weight: 1,
                    points: [{}, { y: { r: -0.2 }, fX: true }],
                  },
                  {
                    weight: 1,
                    points: [{ y: { r: 0.5 } }, { y: { r: 0.4 }, fX: true }],
                  },
                  { sY: 1, fY: true },
                  { sX: 1, x: { r: 0.5 } },
                ],
              },

              // Calc Tail
              {
                sX: { a: 0 },
                sY: {
                  add: ['backSY', sub('boatSY'), 'deckSYreal'],
                  save: 'upperEnd',
                },
              },
            ],
          },

          // FRONT
          {
            sX: 'frontSX',
            fX: true,
            fY: true,
            list: [
              {
                fY: true,
                sY: 'lowerTrunk',
                list: [
                  {
                    tY: true,
                    y: sub('deckSYreal'),
                    sY: mult(0.3, 'airSY'),
                    sX: 'ramFullSX',
                    list: [
                      {
                        points: [
                          { fX: true },
                          { fX: true, x: 2 },
                          {
                            y: { r: 0.5 },
                            fX: true,
                            x: 5,
                          },
                          {
                            fY: true,
                            x: ['overshot', -5],
                          },
                          { fY: true, x: 'overshot' },
                          {
                            y: { r: 0.5 },
                            fX: true,
                            x: 2,
                          },
                        ],
                      },
                    ],
                  },

                  // Upper Deck
                  {
                    tY: true,
                    y: sub('deckSYreal'),
                    sX: 'overshot',
                    sY: 4,
                    list: [
                      { sY: 1 },
                      { sY: 1, y: 2 },
                      {
                        sY: 1,
                        color: woodDark,
                        fY: true,
                      },
                      {
                        sY: 1,
                        y: 1,
                        stripes: { gap: 1 },
                      },
                    ],
                  },

                  // FACE
                  {
                    sX: 'ramFullSX',
                    sY: {
                      add: ['lowerTrunk', sub('ramSY')],
                      save: 'faceSY',
                    },
                    list: [
                      {
                        clear: true,
                        sX: { r: 2 },
                        id: 'face',
                        fY: true,
                        tY: true,
                      },
                      {
                        y: 1,
                        id: 'face',
                        fX: true,
                        list: [
                          {
                            stripes: { strip: 9 },
                            fY: true,
                            list: [
                              {
                                sX: 'ramFaceSlopSX',
                                fX: true,
                                color: wood1,
                                list: faceSlop,
                              },
                              {
                                sX: 'ramFaceSlopSX',
                                fX: true,
                                color: wood2,
                                x: 3,
                                list: faceSlop,
                              },
                              {
                                sX: 'ramFaceSlopSX',
                                fX: true,
                                color: wood3,
                                x: 6,
                                list: faceSlop,
                              },
                            ],
                          },
                        ],
                      },

                      {
                        color: woodDark,
                        minX: 5,
                        minY: 5,
                        sY: 'eye',
                        sX: {
                          r: 0.4,
                          max: {
                            r: 0.4,
                            otherDim: true,
                          },
                          save: 'eye',
                        },
                        x: { r: 0.4 },
                        fX: true,
                        y: { r: 0.4 },
                        list: [
                          {
                            color: sail,
                            points: eye,
                          },
                          {
                            weight: 1,
                            closed: true,
                            points: eye,
                          },
                          {
                            s: { r: 0.4 },
                            fX: true,
                            x: { r: 0.2 },
                            y: { r: 0.2 },
                            list: [
                              {
                                points: [
                                  {
                                    x: {
                                      r: 0.5,
                                    },
                                  },
                                  {
                                    y: {
                                      r: 0.5,
                                    },
                                  },
                                  {
                                    x: {
                                      r: 0.5,
                                    },
                                    fY: true,
                                  },
                                  {
                                    y: {
                                      r: 0.5,
                                    },
                                    fX: true,
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },

                      {
                        sX: 'ramUpperSX',
                        list: [
                          {
                            clear: true,
                            id: 'ship',
                            stripes: {
                              change: { r: -1 },
                            },
                            fY: true,
                            fX: true,
                          },
                        ],
                      },
                    ],
                  },

                  // RAM
                  {
                    x: sub('ramX'),
                    sX: {
                      r: 1,
                      add: [{ r: 0.2, save: 'ramX' }],
                    },
                    sY: { r: 0.2, save: 'ramSY' },
                    fY: true,
                    list: [
                      {
                        sX: {
                          r: 1,
                          add: [sub('ramTipSX')],
                        },
                        list: [
                          {},
                          {
                            fY: true,
                            sY: 1,
                            color: wood1,
                          },
                          {
                            fY: true,
                            sY: 1,
                            y: 1,
                            color: woodDark,
                          },
                        ],
                      },

                      {
                        fX: true,
                        sX: {
                          r: 0.25,
                          save: 'ramTipSX',
                        },
                        sY: { r: 1, a: 1 },
                        fY: true,
                        color: ram,
                        list: [
                          {
                            points: [
                              {},
                              { x: { r: 0.2 } },
                              {
                                x: { r: 0.4 },
                                y: { r: 0.3 },
                              },
                              {
                                x: { r: 0.6 },
                                y: { r: 0.3 },
                              },
                              {
                                x: { r: 0.8 },
                                y: { r: 0.2 },
                              },
                              {
                                fX: true,
                                y: { r: 0.2 },
                              },
                              {
                                fX: true,
                                fY: true,
                              },
                              { fY: true },
                            ],
                          },
                        ],
                      },

                      {
                        clear: true,
                        id: 'ship',
                        list: [
                          {
                            stripes: {
                              horizontal: true,
                              change: -5,
                            },
                            fY: true,
                            fX: true,
                          },
                        ],
                      },
                    ],
                  },

                  // Deck
                  {
                    tY: true,
                    sY: 'deckSYreal',
                    sX: 'ramUpperSX',
                    list: [
                      { sX: 7 },
                      {
                        sY: 1,
                        sX: 'overshot',
                        color: wood3,
                      },
                      {
                        points: [
                          {},
                          {
                            x: {
                              r: 1.5,
                              save: 'overshot',
                            },
                          },
                          { fX: true, fY: true },
                          { fY: true },
                        ],
                      },
                      { sY: 1, y: 1, fY: true },
                      {
                        sX: { r: 1, a: 2 },
                        sY: 1,
                        fY: true,
                        color: woodDark,
                      },
                      {
                        sX: { r: 1, a: 3 },
                        sY: 1,
                        y: 2,
                        fY: true,
                        color: woodDark,
                      },
                    ],
                  },

                  {
                    sY: { a: 0 },
                    sX: {
                      a: 'ramUpperSX',
                      save: 'overshot',
                    },
                  }, // reset
                ],
              },
            ],
          },

          // INNERSHIP
          {
            x: 'backSX',
            sX: 'innerShipSX',
            id: 'ship',
            list: [
              // HULK
              {
                fY: true,
                sY: {
                  add: ['boatSY', sub('deckSYreal')],
                  save: 'lowerTrunk',
                },
                sX: ['innerShipSX', 'ramUpperSX'],
                list: [
                  {},
                  {
                    stripes: {
                      horizontal: true,
                      strip: 2,
                      random: -20,
                    },
                    fX: true,
                    list: [
                      {
                        stripes: {
                          strip: { a: 5, random: 60 },
                        },
                        list: [
                          {},
                          {
                            sX: { r: 0.5 },
                            x: { r: 0.4 },
                            color: wood3,
                          },
                          {
                            x: { r: 0.3 },
                            sX: { r: 0.3 },
                            color: wood1,
                          },
                          {
                            sX: { r: 0.4 },
                            color: wood2,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              // MAST
              {
                sY: 'mastSY',
                tY: true,
                list: [
                  // FRONT MASTS
                  {
                    fX: true,
                    sX: mult(0.5, 'boatSX'),
                    list: [
                      {
                        sX: { r: 0.9 },
                        sY: { r: 0.95 },
                        fY: true,
                        stripes: {
                          strip: 80,
                          cut: true,
                          round: true,
                          change: { r: -0.2 },
                        },
                        list: [mast(false, true)],
                      },
                    ],
                  },

                  // BACK MASTS
                  {
                    sX: mult(0.5, 'boatSX'),
                    list: [
                      {
                        sX: { r: 0.7 },
                        sY: { r: 0.8 },
                        fX: true,
                        fY: true,
                        stripes: {
                          strip: 90,
                          cut: true,
                          round: true,
                          change: { r: -0.3 },
                        },
                        list: [, mast()],
                      },
                    ],
                  },
                  {
                    minY: 20,
                    list: [
                      {
                        weight: 1,
                        color: string,
                        points: [{ x: { r: 0.5 } }, { fX: true, fY: true }],
                      },
                      mast(true, false, true),
                      {
                        weight: 1,
                        color: string,
                        points: [{ x: { r: 0.5 } }, { fY: true }],
                      },
                    ],
                  },
                ],
              }, // END MAST

              // ARGONAUTS
              {
                color: argoCloth,
                tY: true,
                y: -1,
                sY: { a: 20, max: 'mastSY' },
                fX: true,
                x: 5,
                sX: { r: 0.3, a: -5 },
                list: [
                  {
                    stripes: {
                      strip: 2,
                      gap: { a: 0, random: 2 },
                      random: { a: -2 },
                    },
                    fY: true,
                    list: [
                      {
                        sX: 1,
                        minY: 14,
                        fX: true,
                        list: [{ color: spear }, { sY: 2, color: spearTip }],
                      },
                      {
                        sX: 2,
                        sY: 7,
                        fY: true,
                        list: [
                          {},
                          {
                            sY: { otherDim: true },
                            color: argoHelm,
                            list: [
                              {},
                              {
                                color: argoSkin,
                                fX: true,
                                fY: true,
                                s: { r: 0.5 },
                              },
                            ],
                          },
                          {
                            name: 'Dot',
                            color: argoSkin,
                            fX: true,
                            y: 3,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              // RAIL
              {
                tY: true,
                sY: 4,
                list: [
                  { sY: 1 },
                  {
                    sY: 1,
                    y: 1,
                    stripes: { gap: 1, strip: 1 },
                  },
                  { sY: 1, fY: true, y: 1 },
                  { sY: 1, color: woodDark, fY: true },
                ],
              }, // END RAIL

              // LOWER ROWERS
              {
                y: 'deckSYreal',
                sY: { r: 0.8, add: [sub('deckSYreal')] },
                stripes: {
                  strip: 10,
                  horizontal: true,
                  cut: true,
                  change: -15,
                },
                fX: true,
                list: [
                  {
                    stripes: { strip: 10, cut: true },
                    list: [
                      {
                        c: true,
                        s: 3,
                        list: [
                          { color: holes },
                          {
                            s: mult(0.4, 'boatSY'),
                            fY: true,
                            tY: true,
                            tX: true,
                            x: 2,
                            y: 1,
                            list: fullOar,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              {
                sY: 'deckSYreal',
                list: [
                  { sY: 1, fY: true, color: woodDark },
                  { sY: 1, y: 1, fY: true, color: wood },
                  { sY: 1, y: 2, fY: true, color: woodDark },

                  // ROWERS
                  {
                    sY: { r: 1, a: -3 },
                    x: 1,
                    sX: { r: 1, a: -1 },
                    stripes: { strip: 6, overflow: true },
                    list: [
                      { color: backgroundColor },
                      {
                        sX: 3,
                        list: [{}, { sY: 1, color: wood3 }],
                      },
                      {
                        sX: 3,
                        fX: true,
                        fY: true,
                        color: wood3,
                        list: [
                          {
                            sY: 2,
                            fY: true,
                            list: [
                              {
                                color: slaveCloth,
                              },
                              { sY: 1 },
                              { sX: 1, cX: true },
                            ],
                          },
                          {
                            y: 1,
                            sY: { r: 1, a: -1 },
                            sX: 1,
                            color: slaveCloth,
                            list: [
                              {},
                              {
                                sY: {
                                  otherDim: true,
                                },
                                color: slaveSkin,
                              },
                              {
                                s: mult(0.5, 'boatSY'),
                                fY: true,
                                tY: true,
                                tX: true,
                                y: 3,
                                x: 2,
                                list: fullOar,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              }, // END DECK
            ],
          }, // END INNER SHIP

          // TEST DECK
          {
            sY: 'deckSY',
            minY: ['deckTarget', -1],
            list: [{ sY: { save: 'deckSYreal' }, sX: { a: 0 } }],
          }, // END TEST DECK

          // RESET DECK
          { sY: { a: 0, save: 'deckSYreal' } },
        ],
      },

      {
        color: foam,
        sY: 1,
        fX: true,
        fY: true,
        y: 'waterSY',
        sX: 'frontSX',
        list: [
          {
            stripes: {
              gap: { a: 1, random: 10 },
              strip: { a: 0, random: 15 },
            },
          },
          {
            stripes: {
              gap: { a: 1, random: 10 },
              strip: { a: 0, random: 15 },
            },
            y: 2,
          },
          {
            stripes: {
              gap: { a: 1, random: 15 },
              strip: { a: 0, random: 3 },
            },
            sX: { r: 2 },
            fX: true,
            y: 4,
          },
          { y: 1, fX: true, sX: { r: 1.2 } },
        ],
      },
    ],
    variableList = {
      fullRect: { r: 1, max: { r: 1, height: true } },

      // BORDER
      border: { a: 0 },
      borderSub: sub('border'),

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

      gridY: {
        add: [
          { r: 0.04, useSize: 'motiveSqu' },
          { r: 0.04, useSize: 'motiveSquBigger' },
        ],
        min: 5,
      },
      gridYReal: ['gridY', -1],
      gridYNeg: sub('gridYReal'),
      gridX: { r: 2, useSize: 'gridY' },

      waterSY: { a: 20, max: mult(0.2, 'motiveSY'), min: 1 },
      airSY: ['motiveSY', sub('waterSY')],

      // BOAT
      boatSX: ['motiveSX', -2],
      boatSY: { r: 0.4, useSize: 'airSY', min: 1, max: ['airSY', -8] },
      deckTarget: 10,
      deckSY: { r: 0.75, useSize: 'boatSY', max: 'deckTarget' },

      mastSY: { add: ['airSY', sub('boatSY'), -1] },
      mastSX: 2,

      backSX: { r: 0.1, a: 5, useSize: 'boatSX' },
      frontSX: [
        { r: 0.2, a: 5, useSize: 'boatSX' },
        { r: 0.2, useSize: 'boatSY' },
      ],
      innerShipSX: ['boatSX', sub('frontSX'), sub('backSX')],

      ramFullSX: {
        r: 0.5,
        add: [mult(0.2, 'boatSY')],
        useSize: 'frontSX',
      },
      ramDiag: { r: 0.6, useSize: 'ramFullSX' },
      ramUpperSX: ['ramFullSX', sub('ramDiag')],
      ramFaceSlopSX: ['ramFullSX', sub('ramUpperSX')],
    }

  return {
    renderList: renderList,
    variableList: variableList,
    background: backgroundColor,
  }
}
