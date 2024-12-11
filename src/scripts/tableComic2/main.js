import { helper } from '@/renderengine/helper.js'

import { Chair, Emotion, Glass, Table } from './accessoir.js'
import { Arm } from './actor-arm.js'
import { Eye, Eyes, Hair, Hat, Head, Mouth } from './actor-head.js'
import { Legs } from './actor-legs.js'
import { Actor, Body, Torso } from './actor.js'
import { Background, Floor, Stage } from './stage.js'
import { Panel, Strip } from './strip.js'
import { getCombiner, getFace, getStrip, getStripInfo } from './tablecomic-1.js'
import {
  RenderObjectContainer,
  getActors,
  getAnimation,
  getColorScheme,
  getStory,
  getTableComic,
} from './tablecomic-2.js'

// BEGINN TableComic /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const TableComic = function (init, slide, createSlider) {
  let sX
  let sY
  let square
  let margin
  let doubleMargin
  let innerSX
  let innerSY
  let innerSquare
  let innerSquareBig
  let innerSquareAverage
  let controlerX
  let controlerY

  const random = helper.random(init.id)
  const rFl = random.getRandomFloat
  const rInt = random.getRandom
  const rIf = random.getIf
  const debug = init.debug || slide.debug
  const hover = helper.getHoverChangers()
  const faceVersion = init.faceVersion || slide.faceVersion
  const linkList = [
    (sX = { main: true }),
    (sY = { main: true, height: true }),
    (square = { add: [sX], max: sY }),
    (margin = { r: 0.08, a: -3, useSize: square, min: 1 }),
    (doubleMargin = { r: -2, useSize: margin }),
    (innerSX = { add: [sX, doubleMargin] }),
    (innerSY = [sY, doubleMargin]),
    (innerSquare = { add: [innerSX], max: innerSY }),
    (innerSquareBig = { add: [innerSX], min: innerSY }),

    (innerSquareAverage = innerSquareBig),

    { r: 0.015, useSize: square, min: 1 },
    { r: 0.01, useSize: square, min: 1 },

    (controlerX = { r: 0, useSize: sX }),
    (controlerY = { r: 0, useSize: sY }),
  ]

  hover.list.push(
    { change: 1, min: 0, map: 'a', variable: controlerX },
    { change: 1, min: 0, map: 'b', variable: controlerY },
  )

  // Assign global Functions to all Comic Constructors
  function assignFunctionToComicConstructor(comicPrototype) {
    let current

    for (const key in comicPrototype) {
      current = comicPrototype[key].prototype

      current.rIf = rIf

      current.rInt = rInt

      current.rFl = rFl

      current.linkList = linkList

      current.pushLinkList = helper.getLinkListPusher(linkList)

      current.pushRelativeStandardAutomatic =
        hover.pushRelativeStandardAutomatic

      current.changersRelativeCustomList = hover.changersRelativeCustomList

      current.pushRelativeStandard = hover.pushRelativeStandard

      current.changersCustomList = hover.changersCustomList

      current.colorList = hover.pushColorStandard

      current.getSizeWithRatio = comicPrototype.getSizeWithRatio

      current.getRelativePosition = comicPrototype.getRelativePosition

      current.getPosition = comicPrototype.getPosition

      if (!current.getFocus) {
        current.getFocus = comicPrototype.getFocus
      }

      current.getObject = comicPrototype.getObject

      current.getPosX = comicPrototype.getPosX

      current.getPosY = comicPrototype.getPosY

      current.getSizeSwitch = comicPrototype.getSizeSwitch

      current.multiplyColor = helper.multiplyColor

      current.getColorShades = comicPrototype.getColorShades

      current.debug = debug
    }
  }

  assignFunctionToComicConstructor(TableComic.prototype)

  // !!!! REMOVE ONE OF THEM !!!!!
  this.stripInfo = faceVersion
    ? new this.getFace()
    : init.altVersion
      ? this.getStrip()
      : new this.getTableComic(init)

  this.paperColor = this.stripInfo.paperColor || [255, 255, 255]

  const renderList = [
    {
      c: true,
      sX: innerSX,
      sY: innerSY,
      color: [255, 0, 0],
      list: [
        new this.Strip({
          sX: innerSX,
          sY: innerSY,
          square: innerSquare,
          squareBig: innerSquareBig,
          squareAverage: innerSquareAverage,
          paperColor: this.paperColor,
          stripInfo: this.stripInfo,
        }),
      ],
    },

    // // Controller
    // {
    // 	fY: true,
    // 	color: [150,30,30],
    // 	sX: 1,
    // 	sY: controlerSY,
    // 	x: controlerX,
    // 	z: 1000,
    // 	list: controler
    // },
    // {
    // 	fX: true,
    // 	color: [150,30,30],
    // 	sX: controlerSY,
    // 	sY: 1,
    // 	y: controlerY,
    // 	z: 1000,
    // 	rotate: -90,
    // 	list: controler
    // }
  ]

  if (createSlider) {
    if (faceVersion) {
      createSlider.slider({
        niceName: 'A',
        valueName: 'a',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'B',
        valueName: 'b',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'C',
        valueName: 'c',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'D',
        valueName: 'd',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'E',
        valueName: 'e',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'F',
        valueName: 'f',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'G',
        valueName: 'g',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'H',
        valueName: 'h',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'I',
        valueName: 'i',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'J',
        valueName: 'j',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'K',
        valueName: 'k',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'L',
        valueName: 'l',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'M',
        valueName: 'm',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'N',
        valueName: 'n',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'Side',
        valueName: 'side',
        defaultValue: 0.5,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'Kamera',
        valueName: 'camera',
        defaultValue: 0,
        input: { min: 0, max: 1, step: 0.02 },
      })
    } else {
      createSlider.title({ title: 'Layout' })

      createSlider.number({
        niceName: 'Panel Count',
        valueName: 'panels',
        defaultValue: 3,
        input: { min: 1, max: 20, step: 1 },
        forceRedraw: true,
      })

      createSlider.slider({
        niceName: 'Image Ration',
        valueName: 'imgRatio',
        defaultValue: 1,
        input: { min: 0.01, max: 4, step: 0.01 },
        output: { min: 0.01, max: 4 },
      })

      createSlider.slider({
        niceName: 'Gutter Width',
        valueName: 'gutter-width',
        defaultValue: 0.25,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'Gutter Height',
        valueName: 'gutter-height',
        defaultValue: 0.25,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.title({ title: 'Content' })

      createSlider.slider({
        niceName: 'Story Beginn',
        valueName: 'a',
        defaultValue: 0,
        input: { min: -1, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'Story End',
        valueName: 'b',
        defaultValue: 0,
        input: { min: -1, max: 1, step: 0.02 },
      })

      createSlider.title({ title: 'Camera' })

      createSlider.slider({
        niceName: 'Camera',
        valueName: 'camera',
        defaultValue: 0,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'Camera Alternative',
        valueName: 'altCamera',
        defaultValue: 0,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.title({ title: 'Actors' })

      createSlider.slider({
        niceName: 'Actors Size',
        valueName: 'actor-size',
        defaultValue: 0.5,
        input: { min: -1, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'Actors Color',
        valueName: 'actor-color',
        defaultValue: 0,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'Actors Proportion',
        valueName: 'actor-features',
        defaultValue: 0,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'Actors Cloth',
        valueName: 'actor-accessoirs',
        defaultValue: 0,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'Emotions',
        valueName: 'emotions',
        defaultValue: 0,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.title({ title: 'Environment' })

      createSlider.slider({
        niceName: 'Background',
        valueName: 'set',
        defaultValue: 0,
        input: { min: 0, max: 1, step: 0.02 },
      })

      createSlider.slider({
        niceName: 'Props',
        valueName: 'props',
        defaultValue: 0,
        input: { min: 0, max: 1, step: 0.02 },
      })
    }
  }

  return {
    renderList,
    linkList,
    background: this.paperColor,
    hover: hover.hover,
    changeValueSetter: hover.ready,
    recommendedPixelSize: 3,
  }
}

TableComic.prototype.getSizeWithRatio = function (args) {
  const ratio = args.ratio || this.ratio

  let sX
  let sY

  if (ratio > 1) {
    sX = this.pushLinkList({ r: ratio, useSize: args.sY, max: args.sX })

    sY = this.pushLinkList({ r: 1 / ratio, useSize: sX })
  } else {
    sY = this.pushLinkList({
      r: 1 / ratio,
      useSize: args.sX,
      max: args.sY,
    })

    sX = this.pushLinkList({ r: ratio, useSize: sY })
  }

  this[args.sXName || 'sX'] = sX

  this[args.sYName || 'sY'] = sY
}

// TableComic.prototype.getSizeWithSizeXY = function ( args ) {
// 	var sX_ = args.sX_ || this.sX_,
// 		sY_ = args.sY_ || this.sY_;

// 	if( sX)
// };

TableComic.prototype.getSizeSwitch = function (
  baseSize,
  maxSize,
  finalSize,
  link,
  defaultPoint,
) {
  baseSize = this.pushLinkList(baseSize)

  maxSize = this.pushLinkList(maxSize)

  if (!maxSize.useSize) {
    maxSize.useSize = baseSize
  }

  this.difference = this.pushLinkList({
    r: defaultPoint === undefined ? 1 : defaultPoint,
    useSize: this.pushLinkList({
      add: [maxSize, { r: -1, useSize: baseSize }],
    }),
  })

  this.pushRelativeStandard(0, 1, link, this.difference)

  finalSize.add = [baseSize, this.difference]

  return this.pushLinkList(finalSize)
}

TableComic.prototype.getRelativePosition = function (obj, pos) {
  return this.pushLinkList({
    r: pos,
    useSize: this.pushLinkList([
      obj.isRotated ? obj.sY : obj.sX,
      { r: -1, useSize: this.isRotated ? this.sY : this.sX },
    ]),
  })
}

TableComic.prototype.getPosition = function (args) {
  const info = args.info || {}

  let obj

  this.square = this.pushLinkList({ add: [this.sX], max: this.sY })

  this.rotation = info.rotate

  this.isRotated = this.rotation && Math.abs(this.rotation) === 90

  this.zInd = info.z

  this.x = false

  this.y = false

  if (info.pos) {
    if (typeof info.pos === 'number') {
      this.x = this.getRelativePosition(args.stageSX, info.pos)
    } else if (typeof info.pos === 'object') {
      obj = info.pos.obj

      this.x = this.pushLinkList({
        add: [obj.x, this.getRelativePosition(obj, info.pos.posX || 0)],
      })

      if (this.isRotated) {
        this.x.add.push(this.sY, { r: -1, useSize: this.sX })
      }

      if (obj.isRotated) {
        this.x.add.push(obj.sX, { r: -1, useSize: obj.sY })
      }
    }

    this.y = this.pushLinkList({
      add: [
        obj.y,
        {
          r: info.pos.posY || 0,
          useSize: obj.isRotated ? obj.sX : obj.sY,
        },
      ],
    })
  }
}

TableComic.prototype.getObject = function (object) {
  return {
    x: this.x,
    y: this.y,
    s: this.square,
    fY: !this.zoomToHead,
    color: this.color,
    rotate: this.rotation,
    z: this.zInd,
    list: [
      {
        sX: this.sX,
        sY: this.sY,
        fY: !this.zoomToHead,
        fX: this.rotation > 0,
        rX: this.reflect,
        list: object,
      },
    ],
  }
}

TableComic.prototype.getFocus = function (zoomSX, zoomSY, focus) {
  const x = this.pushLinkList({
    add: [
      { r: 0.5, useSize: zoomSX },
      // normalize pan
      { r: -1, useSize: this.x },
      // pos,
      { r: -focus.posX, useSize: this.sX },
      // relative to Head
    ],
  })
  const y = this.pushLinkList({
    add: [
      { r: 0.5, useSize: zoomSY },
      // normalize pan
      { r: -1, useSize: this.y },
      // pos,
      { r: -focus.posY, useSize: this.sY },
      // size
    ],
  })

  return {
    x,
    y,
  }
}

TableComic.prototype.getPosX = function (rel) {
  return this.pushLinkList({
    add: [this.x, { r: rel, useSize: this.sX }],
  })
}

TableComic.prototype.getPosY = function (rel) {
  return this.pushLinkList({
    add: [
      { r: -1, useSize: this.y },
      { r: -1 * rel, useSize: this.sY },
    ],
  })
}

TableComic.prototype.getColorShades = function (color) {
  let c0
  let c1
  let c2
  let c3

  if (color.max) {
    this.colorList.push({
      map: color.map,
      min: color.min,
      max: color.max,
      color: (c0 = []),
    })

    this.colorList.push({
      map: color.map,
      min: this.multiplyColor(color.min, 0.9),
      max: this.multiplyColor(color.max, 0.9),
      color: (c1 = []),
    })

    this.colorList.push({
      map: color.map,
      min: this.multiplyColor(color.min, 0.7),
      max: this.multiplyColor(color.max, 0.7),
      color: (c2 = []),
    })

    this.colorList.push({
      map: color.map,
      min: this.multiplyColor(color.min, 0.5),
      max: this.multiplyColor(color.max, 0.5),
      color: (c3 = []),
    })

    return [c0, c1, c2, c3]
  } else {
    return [
      color,
      this.multiplyColor(color, 0.9),
      this.multiplyColor(color, 0.7),
      this.multiplyColor(color, 0.5),
    ]
  }
}

TableComic.prototype.Chair = Chair

TableComic.prototype.Emotion = Emotion

TableComic.prototype.Glass = Glass

TableComic.prototype.Table = Table

TableComic.prototype.Arm = Arm

TableComic.prototype.Eye = Eye

TableComic.prototype.Eyes = Eyes

TableComic.prototype.Hair = Hair

TableComic.prototype.Hat = Hat

TableComic.prototype.Head = Head

TableComic.prototype.Mouth = Mouth

TableComic.prototype.Legs = Legs

TableComic.prototype.Actor = Actor

TableComic.prototype.Body = Body

TableComic.prototype.Torso = Torso

TableComic.prototype.Stage = Stage

TableComic.prototype.Background = Background

TableComic.prototype.Floor = Floor

TableComic.prototype.Strip = Strip

TableComic.prototype.Panel = Panel

TableComic.prototype.getCombiner = getCombiner

TableComic.prototype.getFace = getFace

TableComic.prototype.getStrip = getStrip

TableComic.prototype.getStripInfo = getStripInfo

TableComic.prototype.RenderObjectContainer = RenderObjectContainer

TableComic.prototype.getActors = getActors

TableComic.prototype.getAnimation = getAnimation

TableComic.prototype.getColorScheme = getColorScheme

TableComic.prototype.getStory = getStory

TableComic.prototype.getTableComic = getTableComic
