import { helper as helperGlobal } from '@/renderengine/helper.js'

function letter(args, init, createSlider) {
  var helper = helperGlobal,
    hover = helper.getHoverChangers(),
    pushChanger = hover.pushRelativeStandard,
    backgroundColor = [200, 200, 240],
    linkList = [],
    linkListPush = function (obj) {
      linkList.push(obj)

      return obj
    },
    width = linkListPush({ main: true }),
    height = linkListPush({ main: true, height: true }),
    halfHeight = { r: 0.5, useSize: height, a: -1 },
    halfWidth = { r: 0.5, useSize: width, a: -1 },
    square = linkListPush({
      add: [{ add: [width], max: height }],
      max: { add: [halfWidth], min: halfHeight },
    }),
    letterSquareMax = linkListPush({ r: 1, useSize: square }),
    letterSquare = linkListPush({ r: 1, useSize: letterSquareMax }),
    innerLetterSquare = linkListPush({ add: [letterSquare, -2] }),
    heightOvershot = linkListPush({
      add: [height, { r: -1, useSize: width }],
      min: { a: 0 },
    }),
    widthOvershot = linkListPush({
      add: [width, { r: -1, useSize: height }],
      min: { a: 0 },
    }),
    letter2PosX = linkListPush({
      r: 1000,
      useSize: widthOvershot,
      max: letterSquareMax,
    }),
    letter2PosY = linkListPush({
      r: 1000,
      useSize: heightOvershot,
      max: letterSquareMax,
    }),
    serifeSX_ = 0.48,
    stammSX_ = 0.27,
    stammX_ = (serifeSX_ - stammSX_) / 2,
    serifeSY_ = 0.03,
    barSY_ = 0.06,
    serifeSX = linkListPush({ r: 0.5, useSize: innerLetterSquare, a: -1 }),
    stammX = linkListPush({ r: 0.25, useSize: serifeSX }),
    stammSX = linkListPush({
      add: [serifeSX, { r: -2, useSize: stammX }],
      min: 1,
    }),
    serifeSY = linkListPush({
      r: serifeSY_,
      useSize: innerLetterSquare,
      min: 1,
    }),
    getLetter = function (args) {
      return {
        x: args.x,
        y: args.y,
        color: [40, 40, 20],
        s: letterSquare,
        list: [
          { color: [180, 180, 220] },
          {
            stripes: { strip: 2 },
            list: [
              {
                stripes: { strip: 2, horizontal: true },
                list: [
                  { name: 'Dot', color: [160, 160, 200] },
                  {
                    name: 'Dot',
                    color: [160, 160, 200],
                    fX: true,
                    fY: true,
                  },
                ],
              },
            ],
          },
          {
            color: [150, 150, 190],
            list: [
              { sX: 1 },
              { sX: 1, fX: true },
              { sY: 1 },
              { sY: 1, fY: true },
            ],
          },
          {
            s: innerLetterSquare,
            c: true,
            list: args.letter,
          },
        ],
      }
    },
    renderList = [
      getLetter({
        letter: [
          // Stämme
          { sX: { r: stammSX_ }, x: { r: stammX_ } },
          { sX: { r: stammSX_ }, x: { r: 1 - stammX_ - stammSX_ } },

          // Serifen
          { sX: { r: serifeSX_ }, sY: { r: serifeSY_ } },
          {
            sX: { r: serifeSX_ },
            sY: { r: serifeSY_ },
            y: { r: 1 - serifeSY_ },
          },
          {
            sX: { r: serifeSX_ },
            x: { r: 1 - serifeSX_ },
            sY: { r: serifeSY_ },
          },
          {
            sX: { r: serifeSX_ },
            x: { r: 1 - serifeSX_ },
            sY: { r: serifeSY_ },
            y: { r: 1 - serifeSY_ },
          },

          // Bar
          {
            sX: { r: 1 - 2 * stammX_ - 0.5 * stammSX_ },
            sY: { r: barSY_ },
            x: { r: stammX_ },
            y: { r: (1 - barSY_) / 2 },
          },
        ],
      }),

      init.both &&
        getLetter({
          x: letter2PosX,
          y: letter2PosY,
          letter: [
            // Stämme
            { sX: stammSX, x: stammX },
            { sX: stammSX, x: stammX, fX: true },

            // Serifen
            { sX: serifeSX, sY: serifeSY },
            { sX: serifeSX, sY: serifeSY, fY: true },
            { sX: serifeSX, fX: true, sY: serifeSY },
            { sX: serifeSX, fX: true, sY: serifeSY, fY: true },

            // Bar
            {
              sX: [innerLetterSquare, { r: -2, useSize: stammX }],
              sY: { r: barSY_, min: 1 },
              c: true,
            },
          ],
        }),
    ]

  pushChanger(0, 1, 'letterS', letterSquare)

  if (createSlider) {
    createSlider.slider({
      niceName: 'Buchstaben Größe',
      valueName: 'letterS',
      defaultValue: 1,
      input: { min: 0, max: 1, step: 0.01 },
    })
  }

  // console.log( serifeSX_ );

  return {
    renderList,
    background: backgroundColor,
    linkList,
    hover: hover.hover,
    changeValueSetter: hover.ready,
    recommendedPixelSize: 16,
  }
}

export default letter
