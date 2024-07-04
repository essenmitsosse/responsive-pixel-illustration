// BEGINN TableComic /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
var TableComic = (window.renderer = function (init) {
  let sX
  let sY
  let square
  let margin
  let doubleMargin
  let innerSX
  let innerSY
  let innerSquare
  let controlerSX
  let controlerSY
  let controlerX
  let controlerY
  const { helper } = window
  const random = helper.random(init.id)
  const rFl = random.getRandomFloat
  const rInt = random.getRandom
  const rIf = random.getIf

  const hover = helper.getHoverChangers()

  const linkList = [
    (sX = { main: true }),
    (sY = { main: true, height: true }),
    (square = { add: [sX], max: sY }),
    (margin = {
      r: 0.08,
      a: -3,
      useSize: square,
      min: 1,
    }),
    (doubleMargin = { r: -2, useSize: margin }),
    (innerSX = { add: [sX, doubleMargin] }),
    (innerSY = [sY, doubleMargin]),
    (innerSquare = { add: [innerSX], max: innerSY }),
    (controlerSX = { r: 0.015, useSize: square, min: 1 }),
    (controlerSY = { r: 0.01, useSize: square, min: 1 }),
    (controlerX = { r: 0, useSize: sX }),
    (controlerY = { r: 0, useSize: sY }),
  ]

  const controler = [
    {
      sX: controlerSX,
      cX: true,
      list: [
        {
          minX: 3,

          list: [
            { name: 'Dot', clear: true },
            { name: 'Dot', clear: true, fX: true },
          ],
        },
        {
          sX: controlerSX,
        },
      ],
    },
  ]

  let renderList

  hover.list.push(
    {
      change: 1,
      min: 0,
      map: 0,
      variable: controlerX,
    },
    {
      change: 1,
      min: 0,
      map: 1,
      variable: controlerY,
    },
  )

  // Assign global Functions to all Comic Constructors
  ;(function (comicPrototype) {
    let current
    const { addHoverChange } = hover
    const { functionList } = hover
    const { colorList } = hover

    for (const key in comicPrototype) {
      current = comicPrototype[key].prototype

      current.rIf = rIf
      current.rInt = rInt
      current.rFl = rFl
      current.linkList = linkList
      current.pushLinkList = window.helper.getLinkListPusher(linkList)
      current.addHoverChange = addHoverChange
      current.functionList = functionList
      current.colorList = colorList

      current.getSizeWithRatio = comicPrototype.getSizeWithRatio
      current.getRelativePosition = comicPrototype.getRelativePosition
      current.getPosition = comicPrototype.getPosition
      current.getObject = comicPrototype.getObject
    }
  })(TableComic.prototype)

  this.stripInfo = this.getStrip()
  this.paperColor = this.stripInfo.paperColor || [255, 255, 255]

  renderList = [
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
          paperColor: this.paperColor,
          stripInfo: this.stripInfo,
        }),
      ],
    },

    // Controller
    {
      fY: true,
      color: [150, 30, 30],
      sX: 1,
      sY: controlerSY,
      x: controlerX,
      z: 1000,
      list: controler,
    },
    {
      fX: true,
      color: [150, 30, 30],
      sX: controlerSY,
      sY: 1,
      y: controlerY,
      z: 1000,
      rotate: -90,
      list: controler,
    },
  ]

  return {
    renderList,
    linkList,
    background: this.paperColor,
    hover: hover.hover,
    changeValueSetter: hover.ready,
    recommendedPixelSize: 3,
  }
})

TableComic.prototype.getSizeWithRatio = function (
  sX,
  sY,
  sXName,
  sYName,
  ratio,
) {
  ratio = ratio || this.ratio
  sXName = sXName || 'sX'
  sYName = sYName || 'sY'

  if (ratio > 1) {
    this[sXName] = this.pushLinkList({ r: ratio, useSize: sY, max: sX })
    this[sYName] = this.pushLinkList({
      r: 1 / ratio,
      useSize: this[sXName],
    })
  } else {
    this[sYName] = this.pushLinkList({
      r: 1 / ratio,
      useSize: sX,
      max: sY,
    })
    this[sXName] = this.pushLinkList({ r: ratio, useSize: this[sYName] })
  }
}

TableComic.prototype.getRelativePosition = function (baseSX, pos) {
  return this.pushLinkList({
    r: pos,
    useSize: this.pushLinkList([baseSX, { r: -1, useSize: this.sX }]),
  })
}

TableComic.prototype.getPosition = function (args) {
  const info = args.info || {}
  let obj
  let rotate

  this.square = this.pushLinkList({ add: [this.sX], max: this.sY })
  this.rotation = info.rotate
  this.zInd = info.z

  this.x = false
  this.y = false
  if (info.pos) {
    if (typeof info.pos === 'number') {
      this.x = this.getRelativePosition(args.stageSX, info.pos)
    } else if (typeof info.pos === 'object') {
      obj = info.pos.obj
      rotate = obj.rotation && Math.abs(obj.rotation) === 90

      this.x = this.pushLinkList([
        obj.x,
        this.getRelativePosition(rotate ? obj.sY : obj.sX, info.pos.posX || 0),
      ])
      this.y = this.pushLinkList({
        r: info.pos.posY || 0,
        useSize: rotate ? obj.sX : obj.sY,
      })
    }
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
