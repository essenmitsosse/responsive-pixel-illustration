import { helper } from '@/renderengine/helper.js'

function zeus() {
  let zero = { a: 0 }
  let shadowColor = [255, 255, 255]
  let shadow = helper.darken(shadowColor, 0.7)
  let detail = helper.darken(shadowColor, 0.4)
  let eyes = [182, 0, 234]
  let frame = shadow(eyes)
  let red = [255, 0, 0]
  let backgroundColor = [31, 14, 63]
  let zeus = [240, 240, 240]
  let zeusShadow = shadow(zeus)
  let flesh = [190, 160, 160]
  let fleshShadow = shadow(flesh)
  let hair = zeusShadow
  let cloth = eyes
  let arm = [
    { sX: 'arm' },
    { sY: 'arm' },
    {
      s: 'arm',
      list: [
        {
          s: { r: 0.2, useSize: 'restSYSuper', max: { r: 1.2 } },
          fX: true,
          fY: true,
        },
      ],
    },
    {
      sX: 'arm',
      y: ['bicepsPos', 'biceps', 2],
      sY: {
        add: [
          { r: 1, otherDim: true },
          helper.sub('bicepsPos'),
          helper.sub('biceps'),
          -2,
        ],
        save: 'forearm',
      },
      mX: { r: -0.015, useSize: 'restSYSuper', min: -1 },
    },
    {
      sX: 'arm',
      y: { add: ['arm', 2], save: 'bicepsPos' },
      sY: { r: 0.4, save: 'biceps' },
      mX: { r: -0.02, useSize: 'restSYSuper', min: -1 },
    },
    {
      s: { r: 1.4, useSize: 'arm', max: { r: 1 } },
      fY: true,
      list: [{}],
    },
  ]
  let eye = [
    {
      tY: true,
      color: hair,
      sX: { r: 1, a: 2 },
      x: -1,
      sY: helper.mult(0.05, 'restSY', -1),
    },
    {
      sX: { r: 1, a: -1, min: 1 },
      sY: { r: 1, a: -1, min: 1 },
      y: { r: 0.5, useSize: 'restSX', a: -10, min: { a: 0 }, max: 1 },
    },
    {
      sX: { r: 1, a: -1 },
      sY: { r: 1, a: -1 },
      y: { r: 1, useSize: 'restSX', max: 1 },
      x: { r: 1, useSize: 'squary', max: 1 },
      fX: true,
      fY: true,
    },
  ]
  let beard = [
    {
      sX: {
        r: 0.5,
        a: -2,
        add: [helper.mult(0.01, 'restSYSuper')],
        max: { r: 0.5 },
      },
      x: 1,
      list: [
        {
          sY: 1,
          list: [
            {
              stripes: {
                change: {
                  r: 0.1,
                  useSize: 'restSYSuper',
                  max: helper.mult(0.1, 'headSY'),
                },
              },
              fY: true,
            },
          ],
        },
        { y: 1, stripes: { random: { r: 1 } } },
      ],
    },
  ]
  let beak = [{}, { fX: true, fY: true }, { fY: true }]
  let menLeg = [{}]
  let cowleg = [{}, { sY: { r: 1, otherDim: true }, fY: true, color: hair }]
  let beardSide = [
    {
      sY: { r: 0.3 },
      y: { r: 0.7 },
      stripes: {
        horizontal: true,
        random: { r: -0.5 },
        strip: 2,
        change: { r: -0.8 },
      },
      minX: 2,
      fX: true,
      fY: true,
    },
    {
      sY: { r: 0.7 },
      y: { r: 0.3 },
      stripes: {
        horizontal: true,
        random: { r: -0.5 },
        strip: 2,
        change: { r: -0.9 },
      },
      minX: 2,
      fX: true,
    },
  ]
  let chest = [
    { color: zeus },
    { sY: 1, fY: true },
    {
      color: flesh,
      x: { r: 0.2 },
      y: { r: 0.8 },
      sX: { r: 0.1 },
      sY: { r: 0.07, min: 1, otherDim: true },
    },
  ]
  let abs = [
    { sY: 1, sX: { r: 1, a: -1 }, fY: true },
    { sX: 1, sY: { r: 1, a: -1 }, fX: true },
  ]
  let teeth = [{ points: [{}, { fX: true }, { fY: true, x: { r: 0.5 } }] }]
  let border = [
    { minY: 3, list: [{ color: backgroundColor, y: 1, sY: 1, mX: 1 }] },
    {
      minY: 5,
      list: [{ color: backgroundColor, fY: true, sY: 1, y: 1 }],
    },
  ]

  let clothing = function (down) {
    return [
      {
        points: [
          { fX: true, x: { r: 0.2 } },
          { fX: true },
          { fX: true, fY: true },
          { fY: true },
          { x: { r: 0.5 }, y: { r: down ? 0.3 : 0.7 } },
        ],
      },
    ]
  }

  let renderList = [
    // IMAGE
    {
      m: 'borderSX',
      list: [
        // MOTIVE ZEUS
        {
          m: 'imgPadding',
          color: zeus,
          list: [
            {
              use: 'background',
              color: frame,
              chance: 0.01,
              s: 1,
            },
            {
              use: 'background',
              color: frame,
              chance: 0.01,
              s: 2,
              mask: true,
            },
            {
              save: 'background',
              fY: true,
              sY: [{ r: 1, height: true }, 'imgPadding'],
              mX: helper.sub('imgPadding'),
            },

            {
              fY: true,
              tY: true,
              sY: 1,
              color: detail(backgroundColor),
            },

            // BODY
            {
              sX: 'bodySX',
              sY: 'bodySY',
              x: 'bodyRight',
              y: 'bodyTop',
              fX: true,
              list: [
                // Body without Arms
                {
                  x: 'torsoLeft',
                  sX: 'torsoSX',
                  fX: true,
                  list: [
                    // SNAKE
                    {
                      sX: 'snakeGap',
                      minX: 3,
                      list: [
                        {
                          sX: 'torsoSX',
                          list: [
                            {
                              stripes: {
                                strip: 'snakePeriod',
                              },
                              id: 'torso',
                              fX: true,
                              list: [
                                {
                                  name: 'Dot',
                                  clear: true,
                                  x: 'snakeEdge',
                                },
                                {
                                  name: 'Dot',
                                  clear: true,
                                  x: 'halfPeriod',
                                },
                                {
                                  name: 'Dot',
                                  clear: true,
                                  fY: true,
                                },
                                {
                                  name: 'Dot',
                                  clear: true,
                                  fY: true,
                                  fX: true,
                                  x: ['halfPeriod', helper.sub('snake')],
                                },

                                {
                                  name: 'Dot',
                                  x: 'snake',
                                  y: 'snakeInnerEdge',
                                },
                                {
                                  name: 'Dot',
                                  x: 'snakeInnerEdge2',
                                  y: 'snakeInnerEdge',
                                },
                                {
                                  name: 'Dot',
                                  x: 'snakeInnerEdge',
                                  y: 'snakeInnerEdge',
                                  fX: true,
                                  fY: true,
                                },
                                {
                                  name: 'Dot',
                                  fY: true,
                                  fX: true,
                                  y: 'snakeInnerEdge',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },

                    {
                      sX: 'snakeGap',
                      list: [
                        {
                          sX: 'torsoSX',
                          list: [
                            {
                              stripes: {
                                strip: 'snakePeriod',
                                overflow: true,
                              },
                              id: 'torso',
                              fX: true,
                              list: [
                                {
                                  fY: true,
                                  fX: true,
                                  s: 'snakeGap',
                                  clear: true,
                                },
                                {
                                  x: 'snake',
                                  s: 'snakeGap',
                                  clear: true,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },

                    // TORSO
                    {
                      sY: 'torsoSY',
                      id: 'torso',
                      list: [
                        {},

                        // RIPS COW
                        {
                          color: zeusShadow,
                          sY: {
                            add: [
                              helper.mult(0.2, 'restSX'),
                              helper.mult(-0.6, 'restSXMega'),
                            ],
                            max: { r: 0.4 },
                          },
                          sX: {
                            add: [
                              helper.mult(1, 'restSX'),
                              helper.mult(-3, 'restSXMega'),
                            ],
                            max: { r: 0.4 },
                          },
                          x: { r: 0.2 },
                          y: { r: 0.2 },
                          fX: true,
                          list: [
                            {
                              stripes: {
                                strip: 1,
                                gap: {
                                  r: 0.1,
                                  a: 3,
                                  min: 2,
                                },
                                random: {
                                  r: -1,
                                },
                                change: {
                                  r: 1,
                                },
                              },
                            },
                          ],
                        },

                        // CHEST
                        {
                          color: zeusShadow,
                          sY: 'chestSize',
                          mX: {
                            r: -0.2,
                            useSize: 'restSYSuper',
                            a: 5,
                            min: { r: -0.05 },
                          },
                          list: [
                            {
                              sX: 'chest',
                              list: chest,
                            },
                            {
                              sX: {
                                r: 0.5,
                                a: -1,
                                save: 'chest',
                              },
                              fX: true,
                              rX: true,
                              list: chest,
                            },
                          ],
                        },

                        // RIPS
                        {
                          color: zeusShadow,
                          mX: { r: 0.02, min: 1 },
                          y: {
                            r: 0.2,
                            useSize: 'restSY',
                            max: { r: 0.35 },
                            save: 'chestSize',
                          },
                          sY: {
                            r: 0.4,
                            useSize: 'restSYSuper',
                            a: -5,
                            max: { r: 0.3 },
                          },
                          list: [
                            {
                              stripes: {
                                strip: 1,
                                gap: {
                                  r: 0.05,
                                  a: 1,
                                },
                                horizontal: true,
                              },
                              list: [
                                {
                                  sX: {
                                    r: 0.2,
                                  },
                                },
                                {
                                  sX: {
                                    r: 0.2,
                                  },
                                  fX: true,
                                },
                              ],
                            },
                          ],
                        },

                        // ABS
                        {
                          sY: {
                            r: 0.5,
                            useSize: 'restSYSuper',
                            max: { r: 0.6 },
                          },
                          sX: {
                            add: [helper.mult(1, 'restSY')],
                            max: { r: 0.6 },
                          },
                          cX: true,
                          y: { r: 0.4 },
                          list: [
                            {
                              color: zeusShadow,
                              stripes: {
                                horizontal: true,
                                gap: 1,
                                strip: [
                                  helper.mult(0.1, 'torsoSX'),
                                  helper.mult(0.1, 'torsoSY'),
                                ],
                              },
                              list: [
                                {
                                  sX: {
                                    r: 1,
                                    add: [helper.sub('abs'), -1],
                                  },
                                  fX: true,
                                  list: abs,
                                },
                                {
                                  sX: {
                                    r: 0.5,
                                    a: -1,
                                    save: 'abs',
                                  },
                                  list: abs,
                                },
                              ],
                            },
                          ],
                        },

                        // NECK
                        {
                          tY: true,
                          sY: 'shoulder',
                        },

                        // CLOTH
                        {
                          color: cloth,
                          y: helper.sub('shoulder'),
                          sY: [
                            {
                              r: 1,
                              otherDim: true,
                            },
                            {
                              r: 0.03,
                              useSize: 'restSYSuper',
                              save: 'shoulder',
                            },
                          ],
                          list: [
                            {
                              fX: true,
                              sX: {
                                r: 0.95,
                                useSize: 'restSYSuper',
                                max: {
                                  r: 1,
                                  otherDim: true,
                                },
                              },
                              fY: true,
                              sY: {
                                r: 1,
                                a: 1,
                              },
                              list: clothing(),
                            },
                          ],
                        },
                      ],
                    },

                    // LEGS
                    {
                      sY: 'legSY',
                      sX: {
                        a: 'legSX',
                        max: 'torsoSX',
                      },
                      fY: true,
                      list: [
                        { sX: 'leg', list: cowleg },
                        {
                          sX: 'leg',
                          x: {
                            r: 0.02,
                            add: ['leg', 1],
                          },
                          list: cowleg,
                        },
                        {
                          sX: 'leg',
                          x: { r: 0.1 },
                          fX: true,
                          list: cowleg,
                        },
                        {
                          sX: 'leg',
                          x: {
                            r: 0.12,
                            add: ['leg', 1],
                          },
                          fX: true,
                          list: cowleg,
                        },
                      ],
                    },

                    // HUMAN LEGS
                    {
                      sY: 'humanLegSY',
                      fY: true,
                      list: [
                        { sX: 'leg', list: menLeg },
                        {
                          sX: 'leg',
                          fX: true,
                          rX: true,
                          list: menLeg,
                        },
                        {
                          color: cloth,
                          sY: { r: 0.5 },
                          rotate: -90,
                          y: -1,
                          list: clothing(true),
                        },
                      ],
                    },

                    // WINGS
                    {
                      tY: true,
                      sY: {
                        add: ['birdTop', 'birdTop'],
                        max: 'bodyTop',
                      },
                      sX: { r: 0.8 },
                      x: { r: 0.1 },
                      list: [
                        {
                          x: { r: 0.1 },
                          color: hair,
                          fY: true,
                          sY: { r: 0.8 },
                          stripes: {
                            change: { r: 0.1 },
                            horizontal: true,
                          },
                        },

                        {
                          fX: true,
                          x: 'wingLeft',
                          stripes: {
                            random: { r: -0.2 },
                            strip: 2,
                            change: { r: -0.2 },
                            horizontal: true,
                          },
                          color: hair,
                        },
                        {
                          fX: true,
                          x: 'wingLeft',
                          sX: { r: 0.95 },
                          stripes: {
                            random: { r: -0.2 },
                            strip: 2,
                            change: { r: -0.5 },
                            horizontal: true,
                          },
                        },

                        {
                          fX: true,
                          sX: {
                            r: 0.4,
                            save: 'wingLeft',
                          },
                          list: [
                            {
                              stripes: {
                                horizontal: true,
                                change: {
                                  r: -1,
                                },
                              },
                              fY: true,
                            },
                          ],
                        },
                      ],
                    },

                    // TAIL
                    {
                      tX: true,
                      sX: 'tailSX',
                      sY: {
                        r: 1,
                        add: [
                          helper.mult(-1, 'restSX'),
                          helper.mult(-1, 'restSY'),
                        ],
                        min: {
                          add: ['arm', helper.mult(0.2, 'restSXMega')],
                          max: 'bodySY',
                        },
                        max: 'bodySY',
                        save: 'tailHeight',
                      },
                      list: [
                        // BULL Tail
                        {
                          sY: [1, helper.sub('tailStart')],
                          list: [
                            {
                              sX: {
                                add: ['tailHeight', -1],
                                min: 1,
                                max: ['tailSX', -1],
                              },
                              sY: {
                                r: 0.4,
                                useSize: 'restSX',
                                max: helper.mult(0.6, 'motiveSY'),
                              },
                              list: [
                                {},
                                {
                                  color: hair,
                                  fY: true,
                                  tY: true,
                                  mX: {
                                    a: -1,
                                  },
                                  sY: {
                                    r: 0.2,
                                    useSize: 'restSXSuper',
                                  },
                                  list: [
                                    {
                                      stripes: {
                                        random: {
                                          r: 1,
                                        },
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              sY: 'tailHeight',
                            },
                          ],
                        },

                        // BIRDS Tail
                        {
                          sY: {
                            max: {
                              r: 0.5,
                              a: -2,
                            },
                            add: [helper.mult(0.5, 'squarySuper')],
                            min: { a: 0 },
                            save: 'tailStart',
                          },
                          list: [
                            {
                              sY: 'tailHeight',
                              list: [
                                {
                                  points: [
                                    {},
                                    {
                                      fX: true,
                                      y: 'tailStart',
                                    },
                                    {
                                      fX: true,
                                      y: 'tailStart',
                                      fY: true,
                                    },
                                    {
                                      fY: true,
                                    },
                                  ],
                                },
                                {
                                  tX: true,
                                  sX: helper.mult(0.1, 'squarySuper'),
                                  list: [
                                    {
                                      fX: true,
                                      stripes: {
                                        strip: 2,
                                        random: {
                                          r: 1,
                                        },
                                        horizontal: true,
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
                  ],
                },

                // ARMS
                {
                  sY: 'armSY',
                  list: [
                    {
                      x: 'tailSX',
                      sX: 'armSX',
                      list: arm,
                    },
                    {
                      sX: 'armSX',
                      fX: true,
                      rX: true,
                      list: arm,
                    },
                  ],
                },
              ],
            },

            // HEAD
            {
              sX: 'headSX',
              sY: 'headSY',
              x: 'headRight',
              y: 'headTop',
              fX: true,
              id: 'head',
              list: [
                // TEETH
                {
                  tY: true,
                  fY: true,
                  y: 1,
                  sY: {
                    r: 0.2,
                    useSize: 'restSXMega',
                    max: ['headBottom', 1],
                  },
                  mX: { r: 0.15 },
                  color: hair,
                  list: [
                    {
                      sX: 'teeth',
                      rX: true,
                      list: teeth,
                    },
                    {
                      sX: { r: 0.2, save: 'teeth' },
                      fX: true,
                      list: teeth,
                    },

                    // TOUNGE
                    {
                      mX: { r: 0.3 },
                      color: flesh,
                      list: [
                        {
                          cX: true,
                          sX: 1,
                          sY: {
                            r: 1,
                            add: [helper.sub('toungeTip')],
                          },
                        },
                        {
                          fY: true,
                          sY: {
                            r: 0.8,
                            otherDim: true,
                            save: 'toungeTip',
                          },
                          list: [
                            {
                              weight: 1,
                              name: 'Line',
                              points: [
                                {
                                  fY: true,
                                },
                                {
                                  x: {
                                    r: 0.5,
                                  },
                                },
                                {
                                  fY: true,
                                  fX: true,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },

                // BEARD
                {
                  color: hair,
                  fY: true,
                  tY: true,
                  sY: 'beardLength',
                  list: [
                    {
                      y: [2, helper.sub('headSY')],
                      sY: ['headSY', helper.mult(0.6, 'beardLength')],
                      list: [
                        {
                          tX: true,
                          sX: 'beardWidth',
                          list: beardSide,
                        },
                        {
                          tX: true,
                          sX: 'beardWidth',
                          fX: true,
                          rX: true,
                          list: beardSide,
                        },
                      ],
                    },
                    {
                      y: -1,
                      stripes: {
                        random: { r: -0.5 },
                        strip: 2,
                      },
                    },
                  ],
                },

                // BEAK
                {
                  fX: true,
                  sX: 'beak',
                  cY: true,
                  sY: { r: 0.5 },
                  color: flesh,
                  list: [
                    { points: beak },
                    {
                      sY: { r: 0.4 },
                      y: 1,
                      tY: true,
                      fY: true,
                      rY: true,
                      list: [{ points: beak }],
                    },
                  ],
                },

                // EARS & HORNS
                {
                  sY: 'earLength',
                  list: [
                    {
                      mX: {
                        r: -1,
                        useSize: 'earLength',
                        min: helper.mult(-1, 'earLength'),
                      },
                      id: 'ears',
                      list: [
                        // EARS
                        {
                          mX: 2,
                          y: {
                            r: 0.2,
                            useSize: 'headSY',
                            a: -1,
                          },
                          sY: {
                            r: 0.1,
                            useSize: 'headSY',
                            min: 3,
                          },
                          list: [
                            {},
                            {
                              m: 1,
                              color: flesh,
                            },
                          ],
                        },

                        // HORNS
                        {
                          y: {
                            r: 0.1,
                            useSize: 'headSY',
                            a: -1,
                          },
                          sY: {
                            r: 0.08,
                            useSize: 'headSY',
                          },
                          id: 'horns',
                          color: hair,
                          list: [
                            {},
                            {
                              tY: true,
                              sX: {
                                r: 1,
                                otherDim: true,
                              },
                            },
                            {
                              tY: true,
                              fX: true,
                              sX: {
                                r: 1,
                                otherDim: true,
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },

                {
                  sX: { r: 1, add: [helper.sub('beak')] },
                  list: [
                    {
                      clear: true,
                      sY: 1,
                      sX: { r: 0.05 },
                      color: red,
                    },
                    {
                      clear: true,
                      sY: 1,
                      sX: { r: 0.05 },
                      fX: true,
                    },
                    {
                      clear: true,
                      sY: 1,
                      sX: { r: 0.1 },
                      fY: true,
                    },
                    {
                      clear: true,
                      sY: 1,
                      sX: { r: 0.1 },
                      fY: true,
                      fX: true,
                    },
                    {},
                  ],
                },

                // EYES
                {
                  color: eyes,
                  sY: { r: 0.15 },
                  y: { r: 0.3 },
                  cX: true,
                  sX: { save: 'eyeDist', r: 0.8 },
                  list: [
                    {
                      x: {
                        r: 1,
                        useSize: 'squarySuper',
                        max: helper.mult(0.45, 'eyeDist'),
                      },
                      sX: 'singleEye',
                      list: eye,
                    },
                    {
                      x: {
                        r: 1,
                        useSize: 'squarySuper',
                        max: helper.mult(0.45, 'eyeDist'),
                      },
                      sX: {
                        r: 1,
                        a: 1,
                        otherDim: true,
                        max: {
                          r: 0.5,
                          otherDim: true,
                          a: -1,
                        },
                        save: 'singleEye',
                      },
                      fX: true,
                      list: eye,
                      rX: true,
                    },
                  ],
                },

                // MOUTH
                {
                  sY: {
                    add: [
                      helper.mult(0.15, 'restSXSuper'),
                      helper.mult(-0.3, 'restSXMega'),
                      1,
                    ],
                  },
                  fY: true,
                  y: {
                    r: 0.3,
                    add: [helper.mult(-0.2, 'restSXSuper')],
                    min: zero,
                  },
                  mX: { r: 0.1 },
                  x: {
                    r: 0.1,
                    useSize: 'squarySuper',
                    max: { r: 0.1 },
                  },
                  color: flesh,
                  list: [
                    {},
                    {
                      color: fleshShadow,
                      m: { r: 0.07, a: 1 },
                      list: [
                        {
                          sX: 'noseHole',
                          fX: true,
                        },
                        {
                          sX: {
                            r: 0.3,
                            save: 'noseHole',
                          },
                        },
                      ],
                    },
                  ],
                },

                // HAIR
                {
                  sY: { r: 0.1, useSize: 'restSYSuper' },
                  color: hair,
                  list: [
                    {
                      stripes: {
                        strip: 2,
                        random: { r: -0.8 },
                      },
                    },
                  ],
                },

                // BEARD
                {
                  y: { r: 0.6 },
                  sY: helper.mult(0.2, 'restSYSuper'),
                  color: hair,
                  list: [{ list: beard }, { list: beard, rX: true }],
                },
              ],
            },
          ],
        },
        // END MOTIVE ZEUS
      ],
    },
    // END IMAGE

    // FRAME
    {
      color: frame,
      list: [
        { sY: 'borderSX' },
        { sY: 'borderSX', fY: true },
        { sX: 'borderSX' },
        { sX: 'borderSX', fX: true },

        { sY: 'borderSX', list: border },
        { sY: 'borderSX', rY: true, fY: true, list: border },
        { sX: 'borderSX', rotate: -90, list: border },
        { sX: 'borderSX', rotate: 90, fX: true, list: border },
      ],
    },

    // { sY:2, sX:"motiveSquBigger", color:[0,0,0] },
    // { sX:2, sY:"motiveSquBigger", color:[0,0,0] },

    // { sY:2, x:2, y:2, sX:"motiveSqu", color:[64,64,64] },
    // { sX:2, x:2, y:2, sY:"motiveSqu", color:[64,64,64] },

    // { sX:2, sY:"restSY", color:[255,0,0] },
    // { sX:2, sY:"restSYSuper", color:[128,0,0] },
    // { sX:2, sY:"restSYMega", color:[64,0,0] },

    // { sY:2, sX:"restSX", color:[0,255,0] },
    // { sY:2, sX:"restSXSuper", color:[0,128,0] },
    // { sY:2, sX:"restSXMega", color:[0,64,0] },

    // { sY:2, y:2, fromBottom:true, sX:"squary", color:[255,255,0] },
    // { sY:2, y:2, fromBottom:true, sX:"squarySuper", color:[160,160,0] },
  ]
  let imgDims = ['imgSX', 'imgSY']
  let motiveDims = ['motiveSX', 'motiveSY']
  let variableList = {
    width: { r: 1 },
    height: { r: 1, height: true },
    squ: { a: 'width', max: 'height' },

    borderSX: { r: 0.03, a: 1, useSize: 'squ', min: 1 },

    imgSX: ['width', helper.mult(-2, 'borderSX')],
    imgSY: ['height', helper.mult(-2, 'borderSX')],

    imgSqu: helper.getSmallerDim({ r: 1, useSize: imgDims }),

    imgPadding: helper.mult(0.1, 'imgSqu'),

    motiveSX: ['imgSX', helper.mult(-2, 'imgPadding')],
    motiveSY: ['imgSY', helper.mult(-2, 'imgPadding')],

    motiveSqu: helper.getSmallerDim({ r: 1, useSize: motiveDims }),
    motiveSquBigger: helper.getBiggerDim({ r: 1, useSize: motiveDims }),

    restSX: ['motiveSX', helper.sub('motiveSqu')],
    restSXSuper: {
      add: ['restSX', helper.mult(-0.5, 'motiveSqu')],
      min: { a: 0 },
    },
    restSXMega: {
      add: ['restSX', helper.mult(-1.5, 'motiveSqu')],
      min: { a: 0 },
    },

    restSY: ['motiveSY', helper.sub('motiveSqu')],
    restSYSuper: {
      add: ['restSY', helper.mult(-0.5, 'motiveSqu')],
      min: { a: 0 },
    },
    restSYMega: {
      add: ['restSY', helper.mult(-1.5, 'motiveSqu')],
      min: { a: 0 },
    },

    restSquBigger: helper.getBiggerDim({
      r: 1,
      useSize: ['restSX', 'restSY'],
    }),

    squary: {
      add: ['motiveSqu', helper.sub('restSquBigger')],
      min: { a: 0 },
    },
    squarySuper: {
      add: ['squary', helper.mult(-0.5, 'motiveSqu')],
      min: { a: 0 },
    },

    // EARS
    earLength: {
      add: [helper.mult(0.2, 'restSXSuper'), helper.mult(-0.4, 'restSXMega')],
      min: zero,
    },

    // HEAD
    headSX: {
      add: [
        helper.mult(0.2, 'motiveSqu'),
        helper.mult(0.15, 'squarySuper'),
        helper.mult(0.1, 'restSXMega'),
        4,
      ],
      max: 'motiveSX',
    },
    headSY: {
      add: [
        helper.mult(1.333, 'headSX'),
        helper.mult(-0.5, 'squarySuper'),
        helper.mult(0.3, 'restSXSuper'),
      ],
      max: ['motiveSY', helper.mult(-0.2, 'motiveSY')],
    },
    headRight: {
      add: [
        helper.mult(0.5, 'motiveSX'),
        helper.mult(-0.5, 'headSX'),
        {
          add: [helper.mult(-0.5, 'motiveSX'), helper.mult(0.5, 'restSY')],
          max: { a: 0 },
        },
      ],
      min: 'earLength',
    },
    headTop: helper.mult(1.5, 'squarySuper'),
    headBottom: ['motiveSY', helper.sub('headTop'), helper.sub('headSY')],

    beardLength: helper.mult(0.5, 'restSYSuper'),
    beardWidth: {
      r: 0.4,
      useSize: 'restSYSuper',
      a: -2,
      max: helper.mult(0.05, 'motiveSquBigger'),
    },

    beak: [helper.mult(0.2, 'squarySuper')],

    // BODY
    birdTop: helper.mult(0.8, 'squarySuper'),
    bodyRight: {
      add: ['headSX', helper.mult(-0.5, 'restSY')],
      min: 'earLength',
    },
    bodyTop: {
      add: [
        'headSY',
        helper.mult(0.4, 'squarySuper'),
        helper.mult(-1, 'restSX'),
        'birdTop',
      ],
      min: { a: 0 },
    },
    bodySX: ['motiveSX', helper.sub('bodyRight')],
    bodySY: { add: ['motiveSY', helper.sub('bodyTop')] },

    // LEGS
    legSY: {
      a: 'restSX',
      max: [
        helper.mult(-1.2, 'squarySuper'),
        helper.mult(0.5, 'motiveSY'),
        helper.mult(-2, 'restSXMega'),
      ],
      min: { a: 0 },
    },
    legSX: {
      r: 1,
      useSize: 'bodySX',
      add: [helper.mult(-0.1, 'restSXSuper')],
    },
    humanLegSY: {
      r: -0.5,
      useSize: 'squarySuper',
      a: 'restSY',
      max: [helper.mult(0.5, 'motiveSY')],
      min: zero,
    },

    // SNAKE BODY
    snakeGap: {
      add: [helper.mult(0.15, 'restSXMega')],
      max: helper.mult(0.7, 'bodySY'),
    },
    snake: { add: ['bodySY', helper.sub('snakeGap')] },
    halfPeriod: ['snakeGap', 'snake'],
    snakePeriod: helper.mult(2, 'halfPeriod'),
    snakeEdge: ['snake', -1],
    snakeInnerEdge: ['snakeGap', -1],
    snakeInnerEdge2: ['halfPeriod', -1],

    // ARM
    armSX: {
      add: [helper.mult(0.2, 'restSY')],
      max: helper.mult(0.2, 'bodySX'),
    },
    armSY: ['restSY', helper.mult(-1, 'squary')],
    arm: helper.mult(0.1, 'motiveSqu'),

    // LEG
    leg: helper.mult(0.02, 'motiveSquBigger'),

    // TORSO Y
    torsoSY: ['bodySY', helper.sub('legSY'), helper.sub('humanLegSY')],

    // TAIL
    tailSX: {
      add: [
        helper.mult(0.3, 'squarySuper'),
        helper.mult(0.1, 'restSX'),
        helper.mult(-0.5, 'restSXMega'),
      ],
      min: zero,
      max: 'torsoSY',
    },

    // TORSO X
    torsoSX: ['bodySX', helper.mult(-2, 'armSX'), helper.sub('tailSX')],
    torsoLeft: 'armSX',
  }

  return {
    renderList,
    variableList,
    background: backgroundColor,
  }
}

export default zeus
