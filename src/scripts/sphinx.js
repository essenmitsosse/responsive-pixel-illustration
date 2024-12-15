import {
  getBiggerDim,
  getSmallerDim,
  mult,
  sub,
} from '@/renderengine/helper/helper'

function sphinx() {
  const c1 = [255, 0, 0]
  const g1 = [0, 0, 0]
  const g2 = [85, 85, 85]
  const g3 = [170, 170, 170]
  const g4 = [255, 255, 255]
  const backgroundColor = g1
  const eye = [
    {
      minX: 3,
      minY: 4,
      list: [
        { name: 'Dot', clear: true },
        { name: 'Dot', fX: true, clear: true },
        { name: 'Dot', fY: true, clear: true },
        { name: 'Dot', fX: true, fY: true, clear: true },
      ],
    },
    {
      minX: 4,
      minY: 3,
      list: [
        { name: 'Dot', clear: true },
        { name: 'Dot', fX: true, clear: true },
        { name: 'Dot', fY: true, clear: true },
        { name: 'Dot', fX: true, fY: true, clear: true },
      ],
    },
    {},
    {
      sY: { r: 0.3, max: 1 },
      sX: { r: 1, a: 1 },
      color: g1,
      id: 'eyebrow',
    },
  ]
  const arm = [
    {
      weight: 'pArmWeight',
      points: [{}, { x: { r: 0.35 }, y: { r: 0.5 } }, { fX: true, fY: true }],
    },
  ]
  const shadow = [
    { fY: true, x: { r: 0.1 } },
    { y: { r: 0.5 } },
    { x: { r: 0.1 }, y: -1 },

    { fX: true, x: { r: 0.1 }, y: -1 },
    { fX: true, y: { r: 0.5 } },
    { fX: true, fY: true, x: { r: 0.1 } },
  ]
  const renderList = [
    // MAIN IMAGE
    {
      m: 'border',
      list: [
        // BACKGROUND
        { color: g3 },
        { use: 'background', color: g3 },
        {
          use: 'background',
          color: g4,
          chance: 0.02,
          sX: { a: 2, random: { r: 0.06 } },
          mask: true,
        },
        { save: 'background', sY: { r: 0.8 }, fY: true },

        // GROUND
        { use: 'ground', color: g2 },
        {
          use: 'ground',
          chance: 0.02,
          sX: { a: 1, random: 10 },
          sY: 1,
          color: g1,
        },
        {
          fY: true,
          sY: 'groundSY',
          save: 'ground',
          list: [
            {
              points: [
                { y: { r: -0.15 } },
                { x: { r: 0.4 } },
                { x: { r: 0.7 }, y: { r: -0.1 } },
                { y: { r: -0.2 }, fX: true },
                { fX: true, fY: true },
                { fY: true },
              ],
            },
          ],
        },

        //CLOUDS
        {
          color: g4,
          sY: { r: 0.01, a: 1 },
          sX: { r: 0.3 },
          y: ['groundSY', mult(0.3, 'skySY')],
          fY: true,
          stripes: { strip: 3, random: mult(0.02, 'skySY') },
        },
        {
          color: g4,
          sY: { r: 0.05, a: 1 },
          sX: { r: 0.1 },
          y: ['groundSY', mult(0.3, 'skySY')],
          fY: true,
          stripes: { strip: 3, random: mult(0.02, 'skySY') },
        },

        {
          color: g4,
          sY: { r: 0.02, a: 1 },
          y: ['groundSY', mult(0.05, 'skySY')],
          fY: true,
          stripes: { strip: 3, random: mult(0.02, 'skySY') },
        },
        {
          color: g4,
          sY: { r: 0.1, a: 1 },
          sX: { r: 0.6 },
          fX: true,
          y: ['groundSY', mult(0.05, 'skySY')],
          fY: true,
          stripes: { strip: 3, random: mult(0.1, 'skySY') },
        },

        {
          color: g4,
          sY: { r: 0.4, a: 1 },
          sX: { r: 0.3 },
          fX: true,
          y: ['groundSY', mult(0.05, 'skySY')],
          fY: true,
          stripes: { strip: 3, random: mult(0.1, 'skySY') },
        },

        // CONTENT
        {
          m: 'margin',
          list: [
            // SPHINX
            {
              sX: 'sSX',
              sY: 'sSY',
              list: [
                // { color:c3 },

                // HAIR
                {
                  sX: 'sHairSX',
                  sY: 'sHairSY',
                  color: g1,
                  fX: true,
                  list: [
                    {
                      color: g2,
                      points: [
                        { y: 'sBodyTop' },
                        { fX: true },
                        {
                          fY: true,
                          fX: true,
                          x: 'sBodyRight',
                        },
                      ],
                    },
                  ],
                },

                // TAIL
                {
                  color: g1,
                  sX: 'sTailSX',
                  sY: { r: 0.5 },
                  fY: true,
                  list: [
                    // Tail Head
                    {
                      color: g1,
                      x: 'tailHead',
                      y: 1,
                      sX: {
                        r: 0.4,
                        max: {
                          r: 0.3,
                          otherDim: true,
                        },
                        save: 'tailHeadSize',
                      },
                      sY: {
                        r: 0.8,
                        useSize: 'tailHeadSize',
                        min: 1,
                      },
                      tX: true,
                      tY: true,
                      id: 'tailHead',
                      list: [
                        {
                          sY: { r: 0.2 },
                          color: c1,
                          sX: { r: 0.6 },
                          y: { r: 0.6 },
                          clear: true,
                        },
                        {
                          sX: 1,
                          sY: { r: 0.15, max: 1 },
                          clear: true,
                        },
                        {
                          sX: 1,
                          sY: { r: 0.15, max: 1 },
                          clear: true,
                          fY: true,
                        },
                        {},
                        {
                          color: g4,
                          sX: 1,
                          sY: { r: 0.15, max: 1 },
                          y: 1,
                          x: { r: 0.7 },
                        },
                      ],
                    },

                    // Tail
                    {
                      weight: {
                        r: 0.15,
                        max: {
                          r: 0.12,
                          otherDim: true,
                        },
                        min: 1,
                        save: 'tailWeight',
                      },
                      points: [
                        {
                          x: {
                            r: 0.6,
                            save: 'tailHead',
                          },
                        },
                        {
                          x: { r: 0.75 },
                          y: { r: 0.1 },
                        },

                        {
                          x: { r: 0.8 },
                          y: { r: 0.3 },
                        },

                        {
                          x: { r: 0.7 },
                          y: { r: 0.37 },
                        },
                        {
                          x: { r: 0.5 },
                          y: { r: 0.45 },
                        },
                        {
                          x: { r: 0.1 },
                          y: { r: 0.55 },
                        },

                        {
                          y: { r: 0.6 },
                          x: {
                            r: 0.5,
                            useSize: 'tailWeight',
                            save: 'halfTailWeight',
                          },
                        },

                        {
                          x: { r: 0.05 },
                          y: { r: 0.7 },
                        },
                        {
                          x: { r: 0.3 },
                          y: { r: 0.85 },
                        },
                        {
                          x: { r: 0.6 },
                          y: { r: 0.95 },
                        },
                        {
                          x: { r: -0.2 },
                          fX: true,
                          fY: true,
                          y: 'halfTailWeight',
                        },
                      ],
                    },
                  ],
                },

                // BODY
                {
                  sX: 'sBodySX',
                  sY: 'sBodySY',
                  x: 'sTailSX',
                  color: g2,
                  fY: true,
                  list: [
                    // Drop Shadow
                    {
                      color: g1,
                      sY: 'feetSY',
                      y: -1,
                      fY: true,
                      list: [{ points: shadow }],
                    },

                    // Front Leg Behind
                    {
                      color: g1,
                      sX: { r: 0.2 },
                      fX: true,
                      sY: { r: 0.8 },
                      list: [
                        {
                          sX: 'frontLegSX',
                          sY: { r: 0.7 },
                          list: [
                            {
                              sY: { r: 0.8 },
                              fY: true,
                            },
                          ],
                        },
                        {
                          y: { r: 0.7 },
                          sY: 'frontLegSX',
                        },
                        {
                          y: { r: 0.7 },
                          fX: true,
                          sX: 'frontLegSX',
                          sY: { r: 0.3 },
                          list: [
                            { sY: { r: 0.9 } },
                            {
                              stripes: {
                                gap: 1,
                                strip: {
                                  r: 0.2,
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },

                    { use: 'body' },
                    {
                      use: 'body',
                      color: g1,
                      chance: 0.02,
                      sY: {
                        a: 'pointSize',
                        random: 'pointSize',
                      },
                      mask: true,
                    },

                    // { color:c2 },
                    // Body
                    {
                      save: 'body',
                      points: [
                        { fY: true, x: { r: 0.1 } },

                        { fY: true, y: { r: 0.1 } },
                        {
                          x: { r: 0.03 },
                          y: { r: 0.7 },
                        },
                        {
                          x: { r: 0.1 },
                          y: { r: 0.5 },
                        },
                        {
                          x: { r: 0.2 },
                          y: { r: 0.3 },
                        },
                        {
                          x: { r: 0.4 },
                          y: { r: 0.12 },
                        },
                        {
                          fX: true,
                          x: 'hairOvershotSX',
                        },

                        { fX: true },
                        {
                          fX: true,
                          y: 'hairOvershotSY',
                        },
                        {
                          fY: true,
                          x: { r: 0.7 },
                          y: { r: 0.4 },
                        },
                        { fY: true, x: { r: 0.5 } },
                      ],
                    },

                    // Lisa kann die ganz gut leiden. Die ein Jahr unter ihr.
                    // Rips
                    {
                      color: g1,
                      x: { r: 0.2 },
                      sX: { r: 0.4 },
                      sY: { r: 0.3 },
                      y: { r: 0.4 },
                      fY: true,
                      stripes: {
                        gap: { r: 0.02, a: 3 },
                        change: { r: -0.2 },
                        random: { r: -0.2 },
                      },
                      fX: true,
                    },

                    // Body Shadow
                    {
                      color: g1,
                      points: [
                        { fY: true, x: { r: 0.3 } },

                        {
                          x: { r: 0.2 },
                          y: { r: 0.6 },
                        },
                        {
                          x: { r: 0.35 },
                          y: { r: 0.59 },
                        },
                        {
                          x: { r: 0.5 },
                          y: { r: 0.62 },
                        },
                        {
                          x: { r: 0.5 },
                          y: { r: 0.63 },
                        },
                        {
                          x: { r: 0.7 },
                          y: { r: 0.5 },
                        },
                        {
                          x: { r: 0.8 },
                          y: { r: 0.4 },
                        },

                        {
                          fX: true,
                          y: 'hairOvershotSY',
                        },
                        {
                          fY: true,
                          x: { r: 0.7 },
                          y: { r: 0.4 },
                        },
                        { fY: true, x: { r: 0.5 } },
                      ],
                    },

                    { use: 'backLeg' },
                    {
                      use: 'backLeg',
                      color: g1,
                      chance: 0.02,
                      sY: {
                        a: 'pointSize',
                        random: 'pointSize',
                      },
                      mask: true,
                    },

                    // Back Leg
                    {
                      save: 'backLeg',
                      fY: true,
                      sX: { r: 0.5 },
                      sY: { r: 0.4 },
                      x: { r: 0.15 },
                      list: [
                        {
                          points: [
                            { y: -1 },
                            {
                              x: { r: 0.5 },
                              y: { r: 0.1 },
                            },
                            {
                              fX: true,
                              y: { r: 0.4 },
                              x: { r: 0.1 },
                            },
                            {
                              fX: true,
                              y: { r: 0.7 },
                            },
                            {
                              fX: true,
                              fY: true,
                              x: { r: 0.2 },
                            },
                            { fY: true },
                          ],
                        },
                      ],
                    },
                    {
                      fY: true,
                      sY: 'feetSY',
                      sX: ['sBodySX', sub('frontLegSX'), sub('frontLegX'), -1],
                      list: [
                        {
                          fX: true,
                          sX: { r: 0.7 },
                          list: [
                            {},
                            {
                              color: g1,
                              fX: true,
                              fY: true,
                              sX: { r: 0.1 },
                              sY: { r: 0.6 },
                              stripes: {
                                gap: 1,
                              },
                            },
                          ],
                        },
                      ],
                    },

                    // Front Leg Front
                    {
                      fX: true,
                      sX: {
                        r: 0.12,
                        save: 'frontLegSX',
                        min: 1,
                      },
                      x: {
                        r: 0.15,
                        save: 'frontLegX',
                      },
                      list: [
                        {
                          sY: { r: 0.8 },
                          fY: true,
                        },
                        {
                          sY: 'feetSY',
                          sX: { r: 1.7 },
                          fY: true,
                          list: [
                            {},
                            {
                              color: g1,
                              fX: true,
                              fY: true,
                              sX: { r: 0.3 },
                              sY: { r: 0.6 },
                              stripes: {
                                gap: 1,
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                // END Body

                // HAIR
                {
                  sX: 'sHairSX',
                  sY: 'sHairSY',
                  color: g1,
                  fX: true,
                  list: [
                    // { color:c1 },
                    {
                      points: [
                        { y: 'sBodyTop' },
                        {
                          fX: true,
                          x: 'sHeadSX',
                          y: -1,
                        },
                        { fX: true, y: -1 },
                        {
                          fX: true,
                          y: [mult(1.2, 'sHeadSY'), 'sHeadTop'],
                        },
                        {
                          fY: true,
                          fX: true,
                          x: 'sBodyRight',
                        },
                        {
                          x: { r: 0.4 },
                          y: {
                            r: 0.2,
                            a: 'sBodyTop',
                          },
                        },
                      ],
                    },
                  ],
                },

                // HEAD
                {
                  sX: 'sHeadSX',
                  sY: 'sHeadSY',
                  x: { r: 0.01 },
                  y: 'sHeadTop',
                  color: g2,
                  fX: true,
                  list: [
                    {
                      points: [
                        { y: -1, fX: true },
                        { y: { r: 0.5 }, fX: true },
                        {
                          x: { r: 0.15 },
                          y: { r: 0.6 },
                          fX: true,
                        },
                        {
                          x: 'sHeadRight',
                          fX: true,
                          fY: true,
                        },

                        {
                          x: 'sHeadLeft',
                          fY: true,
                        },
                        {
                          x: { r: 0.2 },
                          y: { r: 0.6 },
                        },
                        { y: { r: 0.5 } },
                        { y: -1 },
                      ],
                    },

                    {
                      minY: 4,
                      list: [
                        {
                          list: eye,
                          sX: { r: 0.24 },
                          sY: {
                            r: 0.25,
                            otherDim: true,
                          },
                          id: 'eye',
                          y: { r: 0.2 },
                          x: { r: 0.2 },
                          color: g4,
                        },
                        {
                          list: eye,
                          sX: { r: 0.24 },
                          sY: {
                            r: 0.25,
                            otherDim: true,
                          },
                          id: 'eye',
                          y: { r: 0.2 },
                          x: { r: 0.1 },
                          color: g4,
                          fX: true,
                          rX: true,
                        },

                        {
                          color: g1,
                          fY: true,
                          x: 'sHeadLeft',
                          y: { r: 0.15, min: 1 },
                          sY: { r: 0.08, a: 1 },
                          sX: ['sHeadSX', sub('sHeadLeft'), sub('sHeadRight')],
                          list: [
                            {
                              mX: { r: 0.15 },
                              list: [
                                {},
                                {
                                  sY: {
                                    r: 0.2,
                                    max: 1,
                                  },
                                  color: g3,
                                },
                                // { sX:{ r:.2, max:1 }, x:1, sY:{r:.5 }, color:g3 },
                                // { sX:{ r:.2, max:1 }, x:1, sY:{r:.5 }, fX:true, color:g3 }
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                // END Head

                // WINGS
                {
                  sX: 'sWingSX',
                  sY: 'sWingSY',
                  color: g1,
                  list: [
                    {
                      sX: { r: 0.87 },
                      list: [
                        {
                          fX: true,
                          stripes: {
                            horizontal: true,
                            strip: { r: 0.2 },
                            gap: {
                              r: 0.05,
                              max: 1,
                            },
                            change: { r: -0.1 },
                            random: 2,
                            cut: true,
                          },
                          list: [
                            {
                              sX: {
                                r: 1,
                                min: 1,
                              },
                              list: [
                                {
                                  points: [
                                    {
                                      x: {
                                        r: 1,
                                        otherDim: true,
                                        max: {
                                          r: 0.5,
                                        },
                                      },
                                      y: -1,
                                    },
                                    {
                                      fX: true,
                                      y: -1,
                                    },
                                    {
                                      fX: true,
                                      fY: true,
                                    },
                                    {
                                      x: {
                                        r: 1,
                                        otherDim: true,
                                        max: {
                                          r: 0.5,
                                        },
                                      },
                                      fY: true,
                                    },
                                    {
                                      y: {
                                        r: 0.5,
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      fX: true,
                      sY: {
                        r: 1,
                        add: [mult(0.05, 'motiveSqu')],
                      },
                      sX: { r: 0.2 },
                      list: [
                        {
                          points: [
                            {
                              y: -1,
                              x: { r: -1 },
                            },
                            {
                              x: { r: 0.7 },
                              y: { r: 0.1 },
                            },
                            {
                              fX: true,
                              y: { r: 0.25 },
                            },
                            {
                              fX: true,
                              y: { r: 0.3 },
                            },
                            {
                              x: { r: 0.6 },
                              y: { r: 0.6 },
                            },
                            {
                              x: { r: 0.7 },
                              fY: true,
                            },
                            { y: 'sWingSY' },
                          ],
                        },
                      ],
                    },
                  ],
                },
                // END WINGS
              ],
            },
            // END Sphinx

            // Person
            {
              sX: 'pSX',
              sY: 'pSY',
              y: 'bottomSY',
              color: g3,
              fX: true,
              fY: true,
              list: [
                // SHADOW
                {
                  color: g1,
                  sY: { r: 0.05 },
                  cX: true,
                  sX: { r: 0.8 },
                  fY: true,
                  list: [{ points: shadow }],
                },

                // LEGS
                {
                  sY: ['pSY', sub('pUpperbodySY')],
                  fY: true,
                  color: g1,
                  list: [
                    {
                      sX: {
                        add: [{ r: 1 }, mult(-2, 'pTorsoLeft')],
                      },
                      x: 'pTorsoLeft',
                      list: [
                        { sX: { r: 0.3, min: 1 } },
                        {
                          sX: { r: 0.3, min: 1 },
                          fX: true,
                        },
                        {
                          sY: { r: 0.15 },
                          list: [
                            {},
                            {
                              y: { r: 0.2 },
                              sY: { r: 0.1 },
                              color: g2,
                              stripes: {
                                gap: 1,
                                strip: {
                                  r: 0.2,
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },

                // UPPER BODY
                {
                  sY: 'pUpperbodySY',
                  list: [
                    // HEAD
                    {
                      sX: 'pHeadS',
                      sY: 'pHeadS',
                      cX: true,
                      x: {
                        a: 'pMoveTorso',
                        max: [mult(0.5, 'pSX'), sub('pHeadS')],
                      },
                      id: 'pHead',
                      list: [
                        {
                          sY: 1,
                          sX: 'headEdgeTop',
                          clear: true,
                        },
                        {
                          sY: 1,
                          sX: {
                            r: 0.1,
                            save: 'headEdgeTop',
                          },
                          clear: true,
                          fX: true,
                        },
                        {
                          sY: 1,
                          sX: 'headEdgeBottom',
                          clear: true,
                          fY: true,
                        },
                        {
                          sY: 1,
                          sX: {
                            r: 0.06,
                            save: 'headEdgeBottom',
                          },
                          clear: true,
                          fX: true,
                          fY: true,
                        },
                        { color: g1 },
                        {
                          sX: { r: 0.8, a: -1 },
                          sY: { r: 0.8, a: -1 },
                          fY: true,
                        },
                        {
                          color: g1,
                          sY: { r: 0.2, a: -1 },
                          y: { r: 0.4 },
                          sX: { r: 0.45 },
                          x: { r: 0.1 },
                          list: [
                            {
                              sX: {
                                r: 1,
                                otherDim: true,
                              },
                            },
                            {
                              sX: {
                                r: 1,
                                otherDim: true,
                              },
                              fX: true,
                            },
                          ],
                        },
                      ],
                    },

                    // TORSO
                    {
                      sY: 'pTorsoSY',
                      fY: true,
                      list: [
                        {
                          points: [
                            {
                              x: 'pShoulderLeft',
                              y: -1,
                            },
                            {
                              x: 'pShoulderRight',
                              fX: true,
                              y: -1,
                            },
                            {
                              x: 'pTorsoLeft',
                              fX: true,
                              fY: true,
                            },
                            {
                              x: 'pTorsoLeft',
                              fY: true,
                            },
                          ],
                        },
                      ],
                    },

                    // ARMS
                    {
                      tX: true,
                      tY: true,
                      y: ['pHeadS', 'pArmWeight'],
                      x: ['pShoulderLeft', 'pArmWeight'],
                      sX: 'pArmSX',
                      sY: 'pArmSY',
                      list: arm,
                    },
                    {
                      tX: true,
                      tY: true,
                      y: ['pHeadS', 'pArmWeight'],
                      x: ['pShoulderLeft', sub('pArmWeight'), -1, 'pTorsoSX'],
                      sX: mult(0.7, 'pArmSX'),
                      sY: mult(1.3, 'pArmSY'),
                      list: arm,
                    },
                  ],
                },
              ],
            },
            // END Person
          ],
        },
        // END content
      ],
    },
    // END Image
  ]
  const personRatio = 2.3
  const variableList = {
    fullRect: { r: 1, max: { r: 1, height: true } },

    // BORDER
    border: 2,

    // IMAGE
    imageSX: { add: [{ r: 1 }, mult(-2, 'border')] },
    imageSY: [{ r: 1, height: true }, mult(-2, 'border')],
    margin: 1,

    // MOTIVE
    motiveSX: { add: ['imageSX', mult(-2, 'margin')] },
    motiveSY: ['imageSY', mult(-2, 'margin')],

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

    restSquBigger: getBiggerDim({
      r: 1,
      useSize: ['restSX', 'restSY'],
    }),
    squary: {
      add: ['motiveSqu', sub('restSquBigger')],
      min: { a: 0 },
    },
    squarySuper: {
      add: ['squary', mult(-0.5, 'motiveSqu')],
      min: { a: 0 },
    },

    // GROUND
    groundSY: mult(0.2, 'motiveSqu'),
    skySY: ['motiveSY', sub('groundSY')],
    feetSY: mult(0.05, 'motiveSqu'),
    bottomSY: { add: ['groundSY', sub('feetSY'), -2], min: 1 },

    //PERSON
    pSX: {
      r: 0.3,
      useSize: 'motiveSX',
      max: { r: 0.5 / personRatio, useSize: 'motiveSY' },
    },
    pSY: mult(personRatio, 'pSX'),

    pTorsoSX: mult(0.6, 'pSX'),
    pTorsoLeft: [mult(0.5, 'pSX'), mult(-0.5, 'pTorsoSX')],
    pMoveTorso: mult(0.1, 'restSY'),
    pUpperbodySY: { r: 0.5, useSize: 'pSY' },
    pTorsoSY: { r: 0.75, useSize: 'pUpperbodySY' },
    pHeadS: ['pUpperbodySY', sub('pTorsoSY')],
    pShoulderLeft: {
      add: ['pTorsoLeft', 'pMoveTorso'],
      max: mult(2, 'pTorsoLeft'),
      min: 'pTorsoLeft',
    },
    pShoulderRight: {
      add: ['pTorsoLeft', sub('pMoveTorso')],
      min: { a: 0 },
      max: 'pTorsoLeft',
    },

    pArmSX: {
      add: [
        mult(1, 'pSX'),
        mult(-0.2, 'restSY'),
        mult(-0.15, 'squary'),
        mult(0.05, 'squarySuper'),
      ],
      min: 1,
    },
    pArmSY: {
      add: [
        mult(1, 'pSX'),
        mult(-0.2, 'restSX'),
        mult(-0.15, 'squary'),
        mult(0.05, 'squarySuper'),
      ],
      min: 1,
    },
    pArmWeight: { r: 0.12, useSize: 'pTorsoSX', min: 1 },

    //SPHINX
    sSX: mult(0.8, 'motiveSX'),
    sSY: ['motiveSY', sub('bottomSY')],

    psOvershotSX: [sub('motiveSX'), 'sSX', 'pSX'],

    sSquare: getSmallerDim({ r: 1, useSize: ['sSX', 'sSY'] }),
    sHeadTop: mult(0.05, 'sSquare'),
    sHeadSX: mult(0.1, 'sSquare'),
    sHeadSY: mult(0.15, 'sSquare'),
    sHeadLeft: mult(0.3, 'sHeadSX'),
    sHeadRight: mult(0.25, 'sHeadSX'),

    sTailSX: [mult(0.15, 'sSX'), mult(0.05, 'restSX')],
    sRightSX: {
      add: [mult(0.5, 'sHeadSX'), mult(0.15, 'restSX')],
      min: ['psOvershotSX', 1],
    },

    sBodySX: ['sSX', sub('sTailSX'), sub('sRightSX'), mult(-0.1, 'restSX')],
    sBodySY: ['sSY', mult(-0.5, 'sHeadSY'), mult(-0.3, 'restSY')],
    sBodyTop: ['sSY', sub('sBodySY')],
    sBodyRight: ['sSX', sub('sBodySX'), sub('sTailSX')],

    sHairSX: {
      r: 3,
      useSize: 'sHeadSX',
      min: mult(1.2, 'sBodyRight'),
    },
    sHairSY: {
      add: ['sBodyTop', mult(0.2, 'sBodySY')],
      min: ['sHeadTop', mult(2.5, 'sHeadSY')],
    },
    hairOvershotSX: ['sHairSX', sub('sBodyRight')],
    hairOvershotSY: [sub('sSY'), 'sBodySY', 'sHairSY'],

    sWingSX: ['sSX', sub('sHairSX'), -1],
    sWingSY: { r: 1.8, useSize: 'sBodyTop', min: 3 },

    pointSize: getSmallerDim({
      r: 0.02,
      useSize: ['sBodySX', 'sBodySY'],
    }),
  }

  return {
    renderList,
    variableList,
    background: backgroundColor,
  }
}

export default sphinx
