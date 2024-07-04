'use strict'

import {
  ColorRgb,
  ImageFunction,
  Render,
  RenderObject,
  Size,
} from '../PixelGraphics/types'

const backgroundColor: ColorRgb = [100, 100, 120],
  linkList: Array<Size> = [],
  linkListPush = function (obj: Size) {
    linkList.push(obj)

    return obj
  },
  white: ColorRgb = [220, 220, 255],
  red: ColorRgb = [220, 50, 40],
  count = 5,
  width = linkListPush({ main: true }),
  height = linkListPush({ main: true, height: true }),
  heightOvershot = linkListPush({
    add: [height, { r: -1, useSize: width }],
    min: { a: 0 },
  }),
  widthOvershot = linkListPush({
    add: [width, { r: -1, useSize: height }],
    min: { a: 0 },
  }),
  smallerSide = linkListPush({
    add: [width, -count],
    max: [height, -count],
  }),
  biggerSide = linkListPush({
    add: [width, -count],
    min: [height, -count],
  }),
  stripMaxSX = linkListPush({ r: 1, useSize: biggerSide }),
  singleSY = linkListPush({ r: 1 / count, useSize: smallerSide }),
  innerSingleSY = linkListPush({ add: [singleSY, -2] }),
  stripSX_ = 0.2,
  stripSX = linkListPush({ r: 0.2, useSize: innerSingleSY }),
  whiteSX = linkListPush({
    add: [innerSingleSY, { r: -2, useSize: stripSX }],
  }),
  versions = function (size): [Render, Render, Render, Render, Render] {
    return [
      [
        { color: white },
        { color: red, sX: { r: stripSX_ } },
        { color: red, sX: { r: stripSX_ }, fX: true },
      ],
      [
        { color: white },
        { color: red, sX: stripSX },
        { color: red, sX: stripSX, fX: true },
      ],
      [{ color: red }, { color: white, sX: whiteSX, cX: true }],
      [
        { color: white },
        {
          stripes: { strip: [whiteSX, stripSX] },
          list: [{ sX: stripSX, color: red }],
        },
      ],
      [
        { color: [0, 255, 0] },
        {
          color: red,
          sX: { r: 0.3, min: { r: 4, useSize: innerSingleSY } },
        },
        {
          color: white,
          x: stripSX,
          sX: {
            add: [
              { r: 0.4, useSize: innerSingleSY },
              { r: 0.4, useSize: size },
              -20,
            ],
            min: whiteSX,
          },
        },
      ],
    ]
  },
  sizes = (function (count) {
    const obj: Record<`s${number}`, Size> = {}
    let i = 0

    while (i < count) {
      obj['s' + i] = linkListPush({
        r: 0,
        useSize: stripMaxSX,
        min: singleSY,
      })
      i += 1
    }

    return obj
  })(count),
  getSquares = (): ReadonlyArray<RenderObject> => {
    const list: Array<RenderObject> = [],
      max = count
    let i: 0 | 1 | 2 | 3 | 4 | 5 = 0

    while (i < max) {
      const foo = versions(sizes['s' + i])
      list.push({
        sY: [singleSY, -1],
        sX: sizes['s' + i],
        y: { r: i, useSize: singleSY, a: 1 },
        x: 1,
        list: [{ color: [50, 50, 60] }, { m: 1, mask: true, list: foo[i] }],
      })
      i += 1
    }

    return list
  },
  renderList: ReadonlyArray<Render> = [
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
      list: getSquares(),
    },
    {
      sX: { add: [{ r: 10000, useSize: widthOvershot }], max: width },
      sY: {
        add: [{ r: 10000, useSize: widthOvershot }],
        max: height,
      },
      color: [255, 0, 0],
      list: getSquares(),
    },
  ]

const image: ImageFunction = {
  renderList: renderList,
  background: backgroundColor,
  linkList: linkList,
}

export default image
