import { getRandom } from '../../../responsivePixel/helperPixelGraphics'

const comicConfig = {
  maxPanels: 15,
}

export const Comic = function Comic(init) {
  const random = getRandom(init.id)
  const rFl = random.getRandomFloat
  const rInt = random.getRandom
  const rIf = random.getIf
  let height
  let square
  let margin
  // panelSquare,
  let gutterX = rFl(0.002, 0.01)
  let gutterY = rFl(1.5, 5) * gutterX
  const linkList = [
    { main: true },
    (height = { main: true, height: true }),
    (square = { r: 1, max: { r: 1 } }),
    (margin = { r: rFl(0.01, 0.05), min: 1, useSize: square }),
    { r: 1, add: [{ r: -2, useSize: margin }] },
    { r: 1, height: true, add: [{ r: -2, useSize: margin }] },
    // panelSquare = { r:1, useSize:sX, max:{ r:1, useSize:sY } },
    (gutterX = { r: gutterX, useSize: square, min: 1 }),
    (gutterY = { r: gutterY, useSize: square, min: [gutterX, 1] }),
    { r: 0.5, useSize: height },
  ]
  let comic
  const backgroundColor = [rInt(150, 255), rInt(150, 255), rInt(150, 255)]

  // Assign global Functions to all Comic Constructors
  ;(function (comicPrototype, comicConfig, global) {
    let current
    for (const key in comicPrototype) {
      current = comicPrototype[key].prototype

      current.rIf = rIf
      current.rInt = rInt
      current.rFl = rFl
      current.linkList = linkList
      current.config = comicConfig
      current.global = global
      current.copy = comicPrototype.copy
    }
  })(Comic.prototype, comicConfig, {})

  comic = {
    renderList: [
      // Background Grid
      // {
      // 	name:"Grid",
      // 	color:[backgroundColor[0]*0.8,backgroundColor[1]*0.8,backgroundColor[2]*0.8],
      // },
      {
        m: margin,
        list: [
          // // Comic Area
          // {
          // 	color:[backgroundColor[0]*0.5,backgroundColor[1]*0.5,backgroundColor[2]*0.8]
          // },
          {
            // mask:true,
            gutterX,
            gutterY,
            imgRatio: rFl(0.5, 1.5),
            fluctuation: rFl(0, 0.4),
            panels: new this.Strip({
              panels: init.panels,
              backgroundColor,
              debug: init.debug,
            }),
          },
        ],
      },
    ],
    linkList,
    background: backgroundColor,
  }

  if (init.debug === 'true') {
    window.track()
  }

  return comic
}

Comic.prototype.copy = function copy(args) {
  for (const key in args) {
    this[key] = args[key]
  }
}

// BEGINN Strip /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
Comic.prototype.Strip = function Strip(args) {
  let panelCount = this.rInt(1, this.config.maxPanels) + 5
  const panels = []
  let sX
  let sY
  let smallesPanelSX
  let smallesPanelSY
  let smallesPanelSquare
  let borderS
  let subBorderS
  let stageSmallestMaxSX
  let stageSmallestMaxFullSY
  let stageSmallestMaxSY
  let stageSmallestMaxSquare
  let stageSmallestSX
  let stageSmallestSY
  let stageSmallestSquare
  let current

  let i = (panelCount = args.panels || panelCount)

  const world = new this.basic.World({
    backgroundColor: args.backgroundColor,
    panelCount,
  })

  const stageRatio = this.rIf(0.9) ? this.rFl(2.5, 4) : this.rFl(3, 6)

  let border
  let worldPrepared
  let finished

  while (i--) {
    sX = {}
    sY = {}

    panels[i] = { sX, sY }
    this.linkList.push(sX, sY)

    smallesPanelSX = { add: [sX], max: smallesPanelSX }
    smallesPanelSY = { add: [sY], max: smallesPanelSY }
  }

  this.linkList.push(
    smallesPanelSX,
    smallesPanelSY,
    (smallesPanelSquare = { add: [smallesPanelSX], max: smallesPanelSY }),
    (borderS = { r: 0.03, useSize: smallesPanelSquare }),
    (subBorderS = { r: -2, useSize: borderS }),
    // Find smalles Stage
    (stageSmallestMaxSX = [smallesPanelSX, subBorderS]),
    (stageSmallestMaxFullSY = [smallesPanelSY, subBorderS]),
    (stageSmallestMaxSY = {
      r: this.rFl(0.8, 1) && 1,
      useSize: stageSmallestMaxFullSY,
      a: -2,
    }),
    (stageSmallestMaxSquare = {
      add: [stageSmallestMaxSX],
      max: stageSmallestMaxSY,
    }),
    (stageSmallestSX = {
      r: stageRatio,
      useSize: stageSmallestMaxSquare,
      max: stageSmallestMaxSX,
    }),
    (stageSmallestSY = {
      r: 1 / stageRatio,
      useSize: stageSmallestSX,
      max: stageSmallestMaxSY,
    }),
    (stageSmallestSquare = {
      add: [stageSmallestSX],
      max: stageSmallestSY,
    }),
  )

  // Create Border and draw it immediately
  border = new this.basic.Border({
    worldBaseColor: world.foregroundBaseColor,
    noWorldBackground: world.noBackground,
    backgroundColor: args.backgroundColor,
    size: borderS,
  })

  i = 0
  do {
    worldPrepared = world.prepare({
      i,
    })

    // finished = worldPrepared.actorInfos.end;

    current = panels[i]

    this.linkList.push(
      (sX = [current.sX, subBorderS]),
      (sY = [current.sY, subBorderS]),
    )

    current.list = [
      // World
      {
        m: borderS,
        mask: true,
        list: world.draw({
          panel: current,
          i,
          first: i === 0,
          sX,
          sY,
          debug: args.debug,
          stageSmallestSX,
          stageSmallestSY,
          stageSmallestSquare,
        }),
      },

      // Borders
      border.draw(worldPrepared),
    ]
  } while ((i += 1) < panelCount && !finished)

  // delete remaining Panels
  while ((i += 1) < panelCount) {
    panels.pop()
  }

  panels[panels.length - 1].list.push({
    s: { r: 7, useSize: borderS, max: 25 },
    fX: true,
    fY: true,
    z: 110000,
    color: border.borderColor,
    id: 'theEnd',
    list: [
      border.edgeBottomBent &&
        border.edgeOuterBent && { name: 'Dot', clear: true },
      border.edgeBottomBent && {
        name: 'Dot',
        fX: true,
        fY: true,
        clear: true,
      },
      {},
      {
        m: borderS,
        color: [255, 255, 255],
        list: [
          { weight: 1, points: [{}, { fX: true, fY: true }] },
          { weight: 1, points: [{ fX: true }, { fY: true }] },
        ],
      },
    ],
  })

  return panels
} // END Strip \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Border /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
Comic.prototype.Border = function (args) {
  const borderDarkess = this.rFl(0.3, 0.5)
  let borderBaseColor

  // Forms & Sizes
  this.size = args.size
  this.linkList.push(
    (this.borderEdge = { r: 0.45, useSize: args.size, max: 1 }),
  )

  const hasBent = this.rIf(0.5)
  const allBents = hasBent && this.rIf(0.5)
  const innerAndOutterBent = (hasBent && allBents) || this.rIf(0.5)
  const topAndBottomBent = (hasBent && allBents) || this.rIf(0.5)

  this.edgeTop = !args.noWorldBackground
  this.open = this.edgeTop

  this.edgeOuterBent = !this.edgeTop || (hasBent && this.rIf(0.5))
  this.edgeInnerBent =
    (hasBent && this.edgeTop && innerAndOutterBent) || !this.edgeOuterBent

  this.edgeTopBent = hasBent && this.rIf(0.5)
  this.edgeBottomBent = (hasBent && topAndBottomBent) || !this.edgeTopBent

  // Colors
  borderBaseColor =
    !args.noWorldBackground && this.rIf(0.5)
      ? args.worldBaseColor
      : args.backgroundColor
  this.borderColor = [
    borderBaseColor[0] * borderDarkess,
    borderBaseColor[1] * borderDarkess,
    borderBaseColor[2] * borderDarkess,
  ]
}

Comic.prototype.Border.prototype.draw = function (args) {
  const list = []

  if (!args.hit) {
    // Edge outer Bent
    if (this.edgeOuterBent) {
      if (this.edgeTopBent) {
        list.push(
          { sX: 1, sY: this.borderEdge, clear: true },
          {
            sX: 1,
            sY: this.borderEdge,
            fX: true,
            clear: true,
          },
        )
      }

      if (this.edgeBottomBent) {
        list.push(
          {
            sX: 1,
            sY: this.borderEdge,
            fY: true,
            clear: true,
          },
          {
            sX: 1,
            sY: this.borderEdge,
            fX: true,
            fY: true,
            clear: true,
          },
        )
      }
    }

    // Edge Top
    if (this.edgeTop) {
      list.push({ sY: this.size })
    }

    list.push(
      { sX: this.size },
      { sX: this.size, fX: true },
      { sY: this.size, fY: true },
    )

    // Edge inner Bent
    if (this.edgeInnerBent) {
      if (this.edgeTopBent) {
        list.push(
          {
            x: this.size,
            y: this.size,
            sX: this.borderEdge,
            sY: 1,
          },
          {
            x: this.size,
            y: this.size,
            sX: this.borderEdge,
            sY: 1,
            fX: true,
          },
        )
      }

      if (this.edgeBottomBent) {
        list.push(
          {
            x: this.size,
            y: this.size,
            sX: this.borderEdge,
            sY: 1,
            fY: true,
          },
          {
            x: this.size,
            y: this.size,
            sX: this.borderEdge,
            sY: 1,
            fX: true,
            fY: true,
          },
        )
      }
    }

    return {
      id: 'border',
      color: this.borderColor,
      list,
      z: 100000,
    }
  }
} // END Border \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
