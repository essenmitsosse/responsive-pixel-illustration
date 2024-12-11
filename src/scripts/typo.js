import { getSmallerDim, mult, sub } from '@/renderengine/helper'

function typo() {
  const backgroundColor = [170, 190, 230]
  const font = [30, 30, 30]

  let letterCount = 0
  let spacingCount = 0

  const word = 'MAUTZN'
  const contrast = 0.4
  const serif = true
  const roundSerif = true
  const middleStemLength = 0.8
  const serifWidth = 0.6
  const getSerif = serif
    ? function (args) {
        args = args || {}

        return args.hor
          ? {
              sX: 'serifheight',
              sY: args.c ? 'serifCenterHorheight' : 'serifHorheight',
              cY: args.c,
              x: args.c
                ? {
                    r: 1 - middleStemLength,
                    a: 'serifheight',
                  }
                : undefined,
              fX: args.right,
              fY: args.bottom,
              tX: true,
              list: roundSerif
                ? args.c
                  ? [
                      {
                        sY: { r: 0 },
                        stripes: {
                          change: { r: 0.5 },
                        },
                        y: { r: 0.5 },
                      },
                      {
                        sY: { r: 0 },
                        stripes: {
                          change: { r: 0.5 },
                        },
                        y: { r: 0.5 },
                        fY: true,
                      },
                    ]
                  : [
                      {
                        fY: args.bottom,
                        sY: 'stemVert',
                      },
                      {
                        sY: { a: 0 },
                        stripes: {
                          change: { r: 1 },
                        },
                        fX: !args.right,
                        fY: args.bottom,
                      },
                    ]
                : [{}],
            }
          : {
              sX: args.half ? 'serifWidthHalf' : 'serifWidth',
              sY: 'serifheight',
              x: args.half || args.c ? { a: 0 } : 'serifOut',
              fX: args.right,
              fY: args.bottom,
              cX: args.c,
              list: args.half
                ? [
                    roundSerif
                      ? {
                          sX: 'stemHalf',
                          fX: true,
                          fY: !args.bottom,
                          stripes: {
                            horizontal: true,
                            change: 'serifPadding',
                          },
                        }
                      : {},
                  ]
                : roundSerif
                  ? [
                      args.onlyLeft && !args.right
                        ? undefined
                        : {
                            sX: 'stemHalf',
                            x: { r: 0.5 },
                            fY: !args.bottom,
                            stripes: {
                              horizontal: true,
                              change: 'serifPadding',
                            },
                          },
                      args.onlyLeft && args.right
                        ? undefined
                        : {
                            sX: 'stemHalf',
                            fX: true,
                            x: { r: 0.5 },
                            fY: !args.bottom,
                            stripes: {
                              horizontal: true,
                              change: 'serifPadding',
                            },
                          },
                    ]
                  : [
                      args.onlyLeft && !args.right
                        ? undefined
                        : {
                            sX: { r: 0.5 },
                            fX: true,
                          },
                      args.onlyLeft && args.right
                        ? undefined
                        : { sX: { r: 0.5 } },
                    ],
            }
      }
    : function () {
        return undefined
      }
  // letterCount * letterWidth + letterCount
  const getLetter = (function () {
    const Letters = new (function () {
      const vertStem = { sY: 'stemVert', cY: true }

      this.missing = {
        sX: 2,
        list: [
          {
            stripes: {
              gap: 1,
              strip: 'stemVert',
              horizontal: true,
            },
          },
        ],
      }

      this.space = {
        sX: 3,
        list: [],
      }

      this.A = {
        sX: 4,
        half: true,
        list: [
          {
            stripes: {
              horizontal: true,
              change: { r: -0.9 },
            },
            fY: true,
            fX: true,
            sX: { r: 1, a: 'stemNeg' },
            id: 'A',
            clear: true,
          },
          {
            stripes: {
              horizontal: true,
              change: { r: -0.9 },
            },
            fY: true,
            fX: true,
            id: 'A',
          },

          {
            sY: 'stemVert',
            y: { r: 0.6 },
            sX: { r: 0.5 },
            fX: true,
          },
          { x: -1, list: [getSerif({ bottom: true })] },
          {
            x: 1,
            list: [getSerif({ half: true, right: true })],
          },
        ],
      }

      this.C = {
        sX: 3,
        list: [
          { sX: 'stem' },
          { sY: 'stemVert' },
          { sY: 'stemVert', fY: true },
          getSerif({ right: true, hor: true }),
          getSerif({ right: true, bottom: true, hor: true }),
        ],
      }

      this.E = {
        sX: 2,
        list: [
          { sX: 'stem' },
          {
            sY: 'stemVert',
            cY: true,
            sX: { r: middleStemLength },
          },
          { sY: 'stemVert' },
          { sY: 'stemVert', fY: true },
          getSerif(),
          getSerif({ bottom: true }),
          getSerif({ bottom: true, right: true, hor: true }),
          getSerif({ right: true, hor: true }),
          getSerif({ c: true, right: true, hor: true }),
        ],
      }

      this.F = {
        sX: 2,
        list: [
          { sX: 'stem' },
          {
            sY: 'stemVert',
            cY: true,
            sX: { r: middleStemLength },
          },
          { sY: 'stemVert' },
          getSerif(),
          getSerif({ bottom: true }),
          getSerif({ right: true, hor: true }),
          getSerif({ c: true, right: true, hor: true }),
        ],
      }

      this.H = {
        sX: 3,
        half: true,
        list: [
          { sX: 'stem' },
          vertStem,
          getSerif(),
          getSerif({ bottom: true }),
        ],
      }

      this.I = {
        sX: 1,
        list: [
          { sX: 'stem', c: true },
          getSerif({ c: true }),
          getSerif({ bottom: true, c: true }),
        ],
      }

      this.J = {
        sX: 2,
        list: [
          { sX: 'stem', fX: true },
          { sX: 'stem', sY: { r: 0.2 }, fY: true },
          { sY: 'stemVert', fY: true },
          getSerif({ right: true }),
        ],
      }

      this.L = {
        sX: 2,
        list: [
          { sX: 'stem' },
          { sY: 'stemVert', fY: true },
          getSerif(),
          getSerif({ bottom: true }),
          getSerif({ bottom: true, right: true, hor: true }),
        ],
      }

      this.M = {
        sX: 4,
        list: [
          { sX: 'stem' },
          { sX: 'stem', fX: true },
          getSerif({ onlyLeft: true }),
          getSerif({ right: true, onlyLeft: true }),
          getSerif({ bottom: true }),
          getSerif({ bottom: true, right: true }),

          {
            sX: { r: 0.5 },
            stripes: { change: { r: -1 } },
            fY: true,
            id: 'M',
            clear: true,
          },
          {
            sX: { r: 0.5 },
            stripes: { change: { r: -1 } },
            fY: true,
            fX: true,
            id: 'M',
            clear: true,
          },
          {
            x: 'stem',
            sX: { r: 0.5 },
            stripes: { change: { r: -1 } },
            fY: true,
            id: 'M',
          },
          {
            x: 'stem',
            sX: { r: 0.5 },
            stripes: { change: { r: -1 } },
            fY: true,
            fX: true,
            id: 'M',
          },
        ],
      }

      this.N = {
        sX: 3,
        list: [
          { sX: 'stem' },
          getSerif({ onlyLeft: true }),
          getSerif({ bottom: true }),
          getSerif({ right: true }),
          {
            fY: true,
            fX: true,
            sY: { a: 0 },
            stripes: { change: { r: 1 } },
            id: 'N',
            clear: true,
          },
          {
            sX: 'stem',
            sY: { r: 0.5 },
            fY: true,
            fX: true,
            tX: true,
            clear: true,
            id: 'N',
          },
          {
            fY: true,
            fX: true,
            sY: { a: 0 },
            x: 'stemNeg',
            stripes: { change: { r: 1 } },
            id: 'N',
          },
          { sX: 'stem', fX: true, id: 'N' },
        ],
      }

      this.O = {
        sX: 3,
        list: [
          { sX: 'stem' },
          { sX: 'stem', fX: true },
          { sY: 'stemVert' },
          { sY: 'stemVert', fY: true },
        ],
      }

      this.T = {
        sX: 4,
        list: [
          { sX: 'stem', cX: true },
          { sY: 'stemVert' },
          getSerif({ hor: true }),
          getSerif({ right: true, hor: true }),
          getSerif({ bottom: true, c: true }),
        ],
      }

      this.U = {
        sX: 3,
        list: [
          { sX: 'stem' },
          { sX: 'stem', fX: true },
          { sY: 'stemVert', fY: true },
          getSerif(),
          getSerif({ right: true }),
        ],
      }

      this.Z = {
        sX: 3,
        list: [
          { sY: 'stemVert' },
          { sY: 'stemVert', fY: true },
          getSerif({ bottom: true, right: true, hor: true }),
          getSerif({ hor: true }),
          { clear: true, id: 'N', tY: true },
          {
            fY: true,
            sY: { a: 0 },
            x: 'stem',
            stripes: { change: { r: 1, a: 'stem' } },
            id: 'N',
            clear: true,
          },
          {
            fY: true,
            sY: { a: 0 },
            stripes: { change: { r: 1, a: 'stem' } },
            id: 'N',
          },
          serif ? { sY: 'stemVert', sX: { r: 0.6 }, c: true } : undefined,
        ],
      }
    })()

    return function (letter) {
      const thisLetter =
        Letters[letter] || (letter === ' ' ? Letters.space : Letters.missing)
      const letterObject = {
        sX: mult(thisLetter.sX, 'wordUnit'),
        x: [mult(letterCount, 'wordUnit'), mult(spacingCount, 'spacingUnit')],
        fX: true,
        list: thisLetter.half
          ? [
              { sX: { r: 0.5 }, list: thisLetter.list },
              {
                sX: { r: 0.5 },
                fX: true,
                rX: true,
                list: thisLetter.list,
              },
            ]
          : thisLetter.list,
      }

      letterCount += thisLetter.sX

      return letterObject
    }
  })()
  const letters = (function () {
    const list = []

    let l = word.length

    while (l--) {
      list.push(getLetter(word[l]))

      spacingCount += 1
    }

    spacingCount -= 1

    return list
  })()
  const renderList = [
    {
      mY: 'border',
      sX: [mult(letterCount, 'wordUnit'), mult(spacingCount, 'spacingUnit')],
      cX: true,
      color: font,
      list: letters,
    },
    // { gap:{a:0}, color:[255,255,0], change:{r:-1} },
  ]
  const variableList = {
    border: getSmallerDim({ r: 0.08 }),
    borderSide: { r: 0.04 },
    imgWidth: { r: 1, add: [mult(-2, 'borderSide', -spacingCount)] },
    imgheight: { r: 1, height: true, add: [mult(-2, 'border')] },
    wordUnit: mult(1 / (letterCount + spacingCount), 'imgWidth'),
    spaces: ['imgWidth', mult(-letterCount, 'wordUnit')],
    spacingUnit: {
      r: 1 / spacingCount,
      useSize: 'spaces',
      min: 2,
      max: ['wordUnit', -1],
    },
    stem: mult(0.8, 'wordUnit'),
    stemVert: { r: contrast, useSize: 'stem', min: 1 },
    stemHalf: mult(0.5, 'stem'),
    stemNeg: sub('stem'),
    serifPadding: { r: serifWidth, useSize: 'spacingUnit' },
    serifWidth: [mult(2, 'serifPadding'), 'stem'],
    serifWidthHalf: ['serifPadding', 'stemHalf'],
    serifheight: 'stemVert',
    serifOut: sub('serifPadding'),
    serifHorheight: {
      add: ['stemVert', 'serifPadding'],
      max: mult(0.4, 'imgheight'),
    },
    serifCenterHorheight: {
      add: ['stemVert', mult(2, 'serifPadding')],
      max: mult(0.5, 'imgheight'),
    },
  }

  return {
    renderList,
    background: backgroundColor,
    variableList,
  }
}

export default typo
