/* global TableComic */
// BEGINN Background /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Background = function Background(args) {
  const floorFactor = 0.8
  const borderFactor = 1.1

  this.backgroundColor = args.backgroundColor || [100, 80, 30]
  this.floorColor = [
    this.backgroundColor[0] * floorFactor,
    this.backgroundColor[1] * floorFactor,
    this.backgroundColor[2] * floorFactor,
  ]
  this.borderColor = [
    this.backgroundColor[0] * borderFactor,
    this.backgroundColor[1] * borderFactor,
    this.backgroundColor[2] * borderFactor,
  ]

  this.floor = new this.basic.Floor({
    color: this.floorColor,
  })
}

TableComic.prototype.Background.prototype.draw = function BackgroundDraw(args) {
  const borderSY = this.pushLinkList({
    r: 0.05,
    min: 1,
    useSize: args.stageSY,
  })
  const borderFinalSY = (this.borerFinalSY = this.pushLinkList({
    r: 1,
    useSize: borderSY,
    min: 1,
  }))

  const stripeSX = this.pushLinkList({ r: 0.1, useSize: args.stageSX })
  const stripeFinalSX = (this.stripeFinalSX = this.pushLinkList({
    r: 1,
    useSize: stripeSX,
    min: 1,
  }))

  if (args.info) {
    this.addHoverChange({
      borerFinalSY: args.info.zoom,
      stripeFinalSX: args.info.zoom,
    })
  }

  return {
    list: [
      { color: this.backgroundColor },
      { color: this.borderColor, stripes: { gap: stripeFinalSX } },

      {
        sY: [args.panY, { r: 0.2, useSize: args.stageSX }],
        fY: true,
        list: [
          this.floor.draw({
            sY: borderFinalSY,
            horizontal: true,
          }),
          {
            color: this.borderColor,
            sY: borderFinalSY,
            tY: true,
          },
        ],
      },
    ],
  }
}
// END Background \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Floor /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Floor = function Floor(args) {
  const darkFactor = 0.9

  this.color = args.color
  this.darkColor = [
    this.color[0] * darkFactor,
    this.color[1] * darkFactor,
    this.color[2] * darkFactor,
  ]
}

TableComic.prototype.Floor.prototype.draw = function FloorDraw(args) {
  if (args.horizontal) {
    return {
      color: this.color,
      list: [
        {},
        {
          color: this.darkColor,
          stripes: {
            horizontal: true,
            center: true,
            gap: args.sY || { r: 0.2, useSize: args.stageSY },
          },
        },
      ],
    }
  }
  const stripes = {
    center: true,
    strip: args.sY || { r: 0.22, useSize: args.stageSX },
    mask: true,
  }
  const list = [{ sX: 1 }]

  return {
    color: this.color,
    list: [
      {},
      {
        color: this.darkColor,
        list: [
          // Center
          {
            sX: args.stageSX,
            x: args.panX,
            stripes,
            list,
          },

          // Left
          {
            sX: args.panX,
            list: [{ stripes, fX: true, list }],
          },

          // Right
          {
            sX: args.panX,
            fX: true,
            list: [{ stripes, list }],
          },
        ],
      },
    ],
  }
}
// END Floor \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Stage /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Stage = function Stage(args) {
  this.show = args.show

  // // Stage always has to be at 0 because it has nothing to be relative to. Use panX/panY to move camera.
  this.x = this.pushLinkList({ a: 0 })
  this.y = this.pushLinkList({ a: 0 })
}

TableComic.prototype.Stage.prototype.draw = function StageDraw(args) {
  return (
    this.show && {
      sX: args.stageSX,
      sY: args.stageSY,
      color: [255, 255, 255],
      list: [
        // Stage
        { color: [150, 150, 150] },

        // Stage Square
        {
          s: args.square,
          fY: true,
          list: [
            { color: [120, 120, 120] },
            { weight: 1, points: [{}, { fX: true, fY: true }] },
            { weight: 1, points: [{ fX: true }, { fY: true }] },
          ],
        },
        {
          s: args.square,
          fY: true,
          fX: true,
          rX: true,
          list: [
            { weight: 1, points: [{}, { fX: true, fY: true }] },
            { weight: 1, points: [{ fX: true }, { fY: true }] },
          ],
        },

        { sY: 1 },
        { sY: 1, fY: true },
        { sX: 1 },
        { sX: 1, fX: true },
      ],
    }
  )
}
// END Stage \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
