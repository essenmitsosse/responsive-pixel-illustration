import { getHoverChangers } from '../../responsivePixel/helperPixelGraphics'
import {
  ColorRgb,
  ImageFunction,
  ImageFunctionGetter,
  Render,
  RenderObject,
  Size,
} from 'src/responsivePixel/PixelGraphics/types'

const imageGetter: ImageFunctionGetter = {
  getImageFunction: (args, init, createSlider): ImageFunction => {
    const hover = getHoverChangers()

    const backgroundColor: ColorRgb = [100, 100, 120]

    const linkList: Array<Size> = []

    const linkListPush = <T extends Size | ReadonlyArray<Size>>(obj: T): T => {
      if (Array.isArray(obj)) {
        linkList.push(...obj)
      } else {
        linkList.push(obj as Size)
      }

      return obj
    }

    const white: ColorRgb = [220, 220, 255]
    const red: ColorRgb = [220, 50, 40]

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
    const innerSingleSY = linkListPush({ add: [singleSY, -2] })

    const stripMinSX = singleSY
    const stripMaxSX = biggerSide
    const stripRealRelSX = linkListPush({ r: 1, useSize: biggerSide })
    const stripRealSX = linkListPush({
      add: [stripRealRelSX],
      min: stripMinSX,
    })

    const redSX_ = 0.2

    const redSXrel = linkListPush({ r: redSX_, useSize: stripRealSX })
    const redSXabs = linkListPush({ r: redSX_, useSize: stripMinSX })

    const redSXmin = redSXabs
    const redSXmax = linkListPush({ r: redSX_, useSize: stripMaxSX })

    const redSXminMaxDiff = linkListPush({
      a: 100,
      add: [{ add: [redSXrel, { r: -1, useSize: redSXmin }, -100], min: 0 }],
    })

    const redSXa = redSXrel
    const redSXb = linkListPush([redSXabs, redSXminMaxDiff])

    const versions = function (size?: Size): ReadonlyArray<RenderObject> {
      return [
        { color: white },
        { color: red, sX: redSXa },
        { color: red, sX: redSXa, fX: true },
        { color: white },
        { color: red, sX: redSXb },
        { color: red, sX: redSXb, fX: true },

        // [
        // 	{ color: red }
        // 	{ color: white, sX: whiteSX, cX: true }
        // ]
        // [
        // 	{ color: white }
        // 	{
        // 		stripes: { strip: [ whiteSX, stripSX ] }
        // 		list: [
        // 			{ sX: stripSX, color: red }
        // 		]
        // 	}
        // ]
        // [
        // 	{ color: [ 0,255,0] }
        // 	{ color: red, sX: { r: 0.3, min: { r: 4, useSize: innerSingleSY } } }
        // 	{ color: white, x: stripSX, sX: { add: [ { r: 0.4, useSize: innerSingleSY }, { r: 0.4, useSize: size }, -20 ], min: whiteSX } }
        // ]
      ]
    }

    const sizes = (function (count) {
      let i = 0
      const obj: Record<string, Size> = {}

      while (i < count) {
        obj['s' + i] = stripRealSX
        i += 1
      }

      return obj
    })(count)

    const getSquares = function (): ReadonlyArray<RenderObject> {
      const list: Array<RenderObject> = []
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

    const renderList: ReadonlyArray<Render> = [
      {
        sX: { add: [{ r: 10000, useSize: heightOvershot }], max: width },
        sY: { add: [{ r: 10000, useSize: heightOvershot }], max: height },
        color: [0, 255, 255],
        rotate: 90,
        rY: true,
        list: getSquares(),
      },
      {
        sX: { add: [{ r: 10000, useSize: widthOvershot }], max: width },
        sY: { add: [{ r: 10000, useSize: widthOvershot }], max: height },
        color: [255, 0, 0],
        list: getSquares(),
      },
    ]

    hover.pushRelativeStandard(0, 1, 'master', stripRealRelSX)
    if (createSlider) {
      createSlider.slider({
        niceName: 'Steifen Master',
        valueName: 'master',
        defaultValue: 1,
        input: { min: 0, max: 1, step: 0.01 },
      })
    }

    const imageFunction: ImageFunction = {
      renderList: renderList,
      background: backgroundColor,
      linkList: linkList,
      hover: hover.hover,
      changeValueSetter: hover.ready,
      recommendedPixelSize: 6,
    }

    return imageFunction
  },
}

export default imageGetter
