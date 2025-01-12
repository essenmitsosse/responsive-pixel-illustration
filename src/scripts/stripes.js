import getHoverChangerStandard from '@/helper/getHoverChangerStandard'

const stripes = (args, init, createSlider) => {
  const hoverChangerStandard = getHoverChangerStandard()
  const backgroundColor = [100, 100, 120]
  const linkList = []

  const linkListPush = function (obj) {
    linkList.push(obj)

    return obj
  }

  const white = [220, 220, 255]
  const red = [220, 50, 40]
  const count = 5
  const width = linkListPush({ main: true })
  const height = linkListPush({ main: true, height: true })

  const heightOvershot = linkListPush({
    add: [height, { r: -1, useSize: width }],
    min: { a: 0 },
  })

  const widthOvershot = linkListPush({
    add: [width, { r: -1, useSize: height }],
    min: { a: 0 },
  })

  const smallerSide = linkListPush({
    add: [width, -count],
    max: [height, -count],
  })

  const biggerSide = linkListPush({
    add: [width, -count],
    min: [height, -count],
  })

  const singleSY = linkListPush({ r: 1 / count, useSize: smallerSide })
  const stripMinSX = singleSY
  const stripRealRelSX = linkListPush({ r: 1, useSize: biggerSide })
  const stripRealSX = linkListPush({ add: [stripRealRelSX], min: stripMinSX })
  const redSX_ = 0.2
  const redSXrel = linkListPush({ r: redSX_, useSize: stripRealSX })
  const redSXabs = linkListPush({ r: redSX_, useSize: stripMinSX })
  const redSXmin = redSXabs

  const redSXminMaxDiff = linkListPush({
    a: 100,
    add: [{ add: [redSXrel, { r: -1, useSize: redSXmin }, -100], min: 0 }],
  })

  const redSXa = redSXrel
  const redSXb = linkListPush([redSXabs, redSXminMaxDiff])

  const versions = function () {
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

  const sizes = (function (count) {
    let i = 0

    const obj = {}

    while (i < count) {
      obj['s' + i] = stripRealSX

      i += 1
    }

    return obj
  })(count)

  const getSquares = function () {
    const list = []

    let i = 0

    const max = count

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

  const renderList = [
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

  hoverChangerStandard.push({
    min: 0,
    max: 1,
    map: 'master',
    variable: stripRealRelSX,
  })

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
    listDoHover: [hoverChangerStandard.doHover],
    recommendedPixelSize: 6,
  }
}

export default stripes
