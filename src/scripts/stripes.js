import { helper as helperGlobal } from '@/renderengine/helper.js'

function stripes(args, init, createSlider) {
  let helper = helperGlobal
  let hover = helper.getHoverChangers()
  let pushChanger = hover.pushRelativeStandard
  let backgroundColor = [100, 100, 120]
  let linkList = []

  let linkListPush = function (obj) {
    linkList.push(obj)

    return obj
  }

  let white = [220, 220, 255]
  let red = [220, 50, 40]
  let count = 5
  let width = linkListPush({ main: true })
  let height = linkListPush({ main: true, height: true })
  let heightOvershot = linkListPush({
    add: [height, { r: -1, useSize: width }],
    min: { a: 0 },
  })
  let widthOvershot = linkListPush({
    add: [width, { r: -1, useSize: height }],
    min: { a: 0 },
  })
  let smallerSide = linkListPush({
    add: [width, -count],
    max: [height, -count],
  })
  let biggerSide = linkListPush({
    add: [width, -count],
    min: [height, -count],
  })
  let singleSY = linkListPush({ r: 1 / count, useSize: smallerSide })
  let stripMinSX = singleSY
  let stripRealRelSX = linkListPush({ r: 1, useSize: biggerSide })
  let stripRealSX = linkListPush({ add: [stripRealRelSX], min: stripMinSX })
  let redSX_ = 0.2
  let redSXrel = linkListPush({ r: redSX_, useSize: stripRealSX })
  let redSXabs = linkListPush({ r: redSX_, useSize: stripMinSX })
  let redSXmin = redSXabs
  let redSXminMaxDiff = linkListPush({
    a: 100,
    add: [{ add: [redSXrel, { r: -1, useSize: redSXmin }, -100], min: 0 }],
  })
  let redSXa = redSXrel
  let redSXb = linkListPush([redSXabs, redSXminMaxDiff])

  let versions = function () {
    return [
      [
        { color: white },
        { color: red, sX: redSXa },
        { color: red, sX: redSXa, fX: true },
      ],
      [
        { color: white },
        { color: red, sX: redSXb },
        { color: red, sX: redSXb, fX: true },
      ],
      // [
      // 	{ color: red },
      // 	{ color: white, sX: whiteSX, cX: true }
      // ],
      // [
      // 	{ color: white },
      // 	{
      // 		stripes: { strip: [ whiteSX, stripSX ] },
      // 		list: [
      // 			{ sX: stripSX, color: red },
      // 		]
      // 	}
      // ],
      // [
      // 	{ color: [ 0,255,0] },
      // 	{ color: red, sX: { r: 0.3, min: { r: 4, useSize: innerSingleSY } } },
      // 	{ color: white, x: stripSX, sX: { add: [ { r: 0.4, useSize: innerSingleSY }, { r: 0.4, useSize: size }, -20 ], min: whiteSX } }
      // ],
    ]
  }

  let sizes = (function (count) {
    let i = 0
    let obj = {}

    while (i < count) {
      obj['s' + i] = stripRealSX

      i += 1
    }

    return obj
  })(count)

  let getSquares = function () {
    let list = []
    let i = 0
    let max = count

    while (i < max) {
      list.push({
        sY: [singleSY, -1],
        sX: sizes['s' + i],
        y: { r: i, useSize: singleSY, a: 1 },
        x: 1,
        list: [
          { color: [50, 50, 60] },
          { m: 1, mask: true, list: versions(sizes['s' + i])[i] },
        ],
      })

      i += 1
    }

    return list
  }

  let renderList = [
    {
      sX: {
        add: [{ r: 10000, useSize: heightOvershot }],
        max: width,
      },
      sY: {
        add: [{ r: 10000, useSize: heightOvershot }],
        max: height,
      },
      color: [0, 255, 255],
      rotate: 90,
      rY: true,
      list: getSquares({ horizontal: true }),
    },
    {
      sX: { add: [{ r: 10000, useSize: widthOvershot }], max: width },
      sY: {
        add: [{ r: 10000, useSize: widthOvershot }],
        max: height,
      },
      color: [255, 0, 0],
      list: getSquares({ horizontal: false }),
    },
  ]

  // pushChanger(
  // 	0,
  // 	1,
  // 	"letterS",
  // 	letterSquare
  // );

  pushChanger(0, 1, 'master', stripRealRelSX)

  if (createSlider) {
    createSlider.slider({
      niceName: 'Steifen Master',
      valueName: 'master',
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
    recommendedPixelSize: 6,
  }
}

export default stripes
