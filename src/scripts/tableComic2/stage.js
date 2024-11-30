/* global TableComic */
// BEGINN Background /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Background = function Background(args) {
  var floorFactor = 0.8,
    borderFactor = 0.9

  this.blank = args.blank

  this.backgroundColor = args.backgroundColor || [180, 190, 200]
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

Background.prototype.draw = function BackgroundDraw(args) {
  var borderSY = this.pushLinkList({
      r: 0.05,
      min: 1,
      useSize: args.stageSY,
    }),
    borderFinalSY = (this.borderFinalSY = this.pushLinkList({
      r: 1,
      useSize: borderSY,
    })),
    stripeSX = this.pushLinkList({ r: 0.1, useSize: args.stageSX }),
    stripeFinalSX = (this.stripeFinalSX = this.pushLinkList({
      r: 1,
      useSize: stripeSX,
      min: 1,
    })),
    floorY = this.pushLinkList({
      add: [args.panY, { r: 0.2, useSize: args.stageSX }],
    })

  this.backgroundSY = this.pushLinkList({ r: 1, useSize: args.fullSY })
  this.floorSY = this.pushLinkList({ r: 1, useSize: floorY })

  this.pushRelativeStandardAutomatic({
    backgroundSY: { map: 'set', min: 0, max: 1 },
    borderFinalSY: { map: 'set', min: 0, max: 1 },
    floorSY: { map: 'set', min: 0, max: 1 },
  })

  this.borderFinalSY = this.pushLinkList({
    r: 1,
    useSize: this.borderFinalSY,
    min: 1,
  })

  if (args.info) {
    this.pushRelativeStandardAutomatic({
      borderFinalSY: args.info.zoom,
      stripeFinalSX: args.info.zoom,
    })
  }

  return {
    z: -100000,
    color: this.borderColor,
    list: !this.blank && [
      {},

      // Wall stripes
      {
        color: this.backgroundColor,
        stripes: { gap: 1, strip: stripeFinalSX },
        sY: this.backgroundSY,
      },

      // Floor
      {
        sY: this.floorSY,
        y: floorY,
        tY: true,
        fY: true,
        list: [
          // Floor planks
          this.floor.draw({
            sY: borderFinalSY,
            horizontal: true,
          }),

          // Border
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
export const Floor = function Floor(args) {
  var darkFactor = 0.9

  this.color = args.color
  this.darkColor = [
    this.color[0] * darkFactor,
    this.color[1] * darkFactor,
    this.color[2] * darkFactor,
  ]
}

Floor.prototype.draw = function FloorDraw(args) {
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
  } else {
    var stripes = {
        center: true,
        strip: args.sY || { r: 0.22, useSize: args.stageSX },
        mask: true,
      },
      list = [{ sX: 1 }]

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
              stripes: stripes,
              list: list,
            },

            // Left
            {
              sX: args.panX,
              list: [{ stripes: stripes, fX: true, list: list }],
            },

            // Right
            {
              sX: args.panX,
              fX: true,
              list: [{ stripes: stripes, list: list }],
            },
          ],
        },
      ],
    }
  }
}
// END Floor \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Stage /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Stage = function Stage(args) {
  if (!args) {
    args = {}
  }

  this.show = args.show

  // // Stage always has to be at 0 because it has nothing to be relative to. Use panX/panY to move camera.
  this.x = this.pushLinkList({ a: 0 })
  this.y = this.pushLinkList({ a: 0 })
}

Stage.prototype.draw = function StageDraw(args) {
  this.sX = args.stageSX
  this.sY = args.stageSY

  return (
    this.debug && {
      sX: this.sX,
      sY: this.sY,
      color: [255, 255, 255],
      z: -100000,
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
