// BEGINN Table /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Table = function Table(args) {
  if (!args) {
    args = {}
  }
  // Forms and Sizes
  this.sX_ = args.sX || 0.6
  this.sY_ = args.sY || 0.6

  // Colors
  this.color = args.color || [200, 200, 200]
  this.colorDetail = args.colorDetail || [225, 210, 225]
}

Table.prototype.draw = function TableDraw(args) {
  this.sX = this.pushLinkList({ r: this.sX_, useSize: args.stageSX })
  this.sY = this.pushLinkList({ r: this.sY_, useSize: args.stageSY })

  this.topSY = this.pushLinkList({
    r: 0.1 * this.sY_,
    useSize: args.stageSY,
    max: this.sY,
    min: 1,
  })
  this.legSX = this.pushLinkList({ r: 0.1, useSize: this.sX })
  this.footSX = this.pushLinkList({ r: 0.35, useSize: this.sX })

  this.pushRelativeStandardAutomatic({
    sY: { map: 'props', min: 0, max: this.sY_ },
  })

  this.getPosition(args)

  return this.getObject([
    // Table Foot
    {
      sX: this.footSX,
      cX: true,
      sY: {
        r: 0.05 * this.sY_,
        useSize: args.stageSY,
        max: this.sY,
        min: 1,
      },
      fY: true,
    },

    // Table Leg
    {
      sX: this.legSX,
      cX: true,
    },

    {
      sY: this.topSY,
      color: this.colorDetail,
    },

    // Table Top
    {
      sY: [this.topSY, -1],
      list: [
        {},
        {
          sY: { r: 0.2, useSize: this.topSY, min: 1 },
          color: this.colorDetail,
        },
      ],
    },
  ])
}

Table.prototype.getPosition = function TableGetPosition(id) {
  return {
    x: id === 0 ? this.x : this.pushLinkList([this.x, this.sX]),
    y: this.sY,
  }
}
// END Table \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Chair /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Chair = function Chair(args) {
  if (!args) {
    args = {}
  }
  // Forms and Sizes
  this.sX_ = args.sX || 0.25
  this.sY_ = args.sY || 0.32

  this.reflect = args.toLeft

  // Colors
  this.color = args.color || [200, 200, 200]
  this.colorDetail = args.colorDetail || [180, 180, 180]
}

Chair.prototype.draw = function ChairDraw(args) {
  this.sX = this.pushLinkList({ r: this.sX_, useSize: args.stageSX })
  this.sY = this.pushLinkList({ r: this.sY_, useSize: args.stageSY })

  this.verticalElement = this.pushLinkList({ r: 0.1, useSize: this.sX })
  this.horizontalElement = this.pushLinkList({
    r: 0.15,
    useSize: this.sX,
    max: this.sY,
  })
  this.legDistance = this.pushLinkList({ r: 0.3, useSize: this.sX })
  this.backSY = this.pushLinkList({ r: 2, useSize: this.sY })

  this.pushRelativeStandardAutomatic({
    sY: { map: 'props', min: 0, max: this.sY_ },
  })

  this.getPosition(args)

  return this.getObject([
    // Front Leg
    {
      sX: this.verticalElement,
      fX: true,
    },
    {
      sX: this.verticalElement,
      fX: true,
      x: this.legDistance,
    },

    // Back Leg Back
    {
      fY: true,
      sY: this.backSY,
      sX: this.verticalElement,
      tX: true,
      x: this.legDistance,
    },

    // Backrest
    {
      sX: [this.legDistance, -1],
      y: [this.backSY, -1],
      fY: true,
      tY: true,
      sY: { r: 0.5 },
      color: this.colorDetail,
    },

    // Seat
    {
      sY: this.horizontalElement,
      list: [{}, { color: this.colorDetail, sY: { r: 0.2, min: 1 } }],
    },

    // Back Leg Front
    {
      fY: true,
      sY: this.backSY,
      sX: this.verticalElement,
      tX: true,
    },
  ])
}
// END Chair \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Glass /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Glass = function Glass(args) {
  if (!args) {
    args = {}
  }
  // Forms & Sizes
  this.sX_ = 0.1
  this.sY_ = 0.15

  // Colors
  this.color = args.color || [100, 100, 255]
  this.glassColor = [255, 255, 255]
  this.mixColor = [
    this.color[0] * 0.5 + this.glassColor[0] * 0.5,
    this.color[1] * 0.5 + this.glassColor[1] * 0.5,
    this.color[2] * 0.5 + this.glassColor[2] * 0.5,
  ]
}

Glass.prototype.draw = function GlassDraw(args) {
  var normalGlass

  this.sX = this.pushLinkList({ r: this.sX_, useSize: args.square, min: 1 })
  this.sY = this.pushLinkList({ r: this.sY_, useSize: args.square })

  this.pushRelativeStandardAutomatic({
    sY: { map: 'props', min: 0, max: this.sY_ },
  })

  this.level = this.pushLinkList({ r: 0, useSize: this.sY })

  this.getPosition(args)
  this.pushRelativeStandardAutomatic(args.info)

  normalGlass = [
    { sY: { r: 0.08, min: 1, useSize: this.sY }, fY: true },
    { sX: 1 },
    { sX: 1, fX: true },
  ]

  return this.getObject([
    // normal Glass
    { color: this.glassColor, list: normalGlass },

    // filling
    {
      sY: this.level,
      fY: true,
      list: [
        { color: this.color },
        { color: this.mixColor, list: normalGlass },
      ],
    },
  ])
}
// END Glass \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Emotion /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Emotion = function Emotion(args) {
  if (!args) {
    args = {}
  }
  this.color = args.color || [220, 220, 220]
  this.heartColor = [-1, -1, -1]

  this.colorList.push({
    map: 'a',
    min: [120, 120, 120],
    max: [200, 100, 100],
    color: this.heartColor,
  })
}

Emotion.prototype.draw = function EmotionDraw(args) {
  if (!args.info.pos) {
    return
  }
  var actor = args.info.pos.obj

  if (!actor) {
    return
  }

  this.sY = this.sX = actor.head ? actor.head.square : 0

  this.innerS = this.pushLinkList({ r: 0.3, useSize: this.sX, a: 5 })
  if (args.info.size) {
    this.innerS = this.pushLinkList({
      r: args.info.size,
      useSize: this.innerS,
    })
  }
  this.innerS = this.pushLinkList({ r: 1, useSize: this.innerS })

  this.pushRelativeStandardAutomatic({
    innerS: { map: 'emotions', min: 0, max: 1 },
  })

  this.getPosition(args)

  if (actor.head) {
    this.x = this.pushLinkList({
      add: [
        this.x,
        actor.lean,
        { r: -0.5, useSize: actor.head.sX },
        { r: 0.5, useSize: actor.sX },
        -1,
      ],
    })
  }

  if (args.info.heart) {
    this.cloudBottomY = this.pushLinkList({ r: 0.6, useSize: this.innerS })
    this.cloudLeftX = this.pushLinkList({ r: 0, useSize: this.innerS })

    if (args.info.thunder) {
      this.thunderSY = this.pushLinkList({ r: 0, useSize: this.innerS })
    }

    this.pushRelativeStandardAutomatic({
      cloudBottomY: { map: 'a', min: 0.0001, max: 0.6 },
      cloudLeftX: { map: 'a', min: -0.5, max: 0 },
      thunderSY: { map: 'a', min: 1, max: -4 },
    })
  }

  return this.getObject([
    {
      color: args.info.heart ? this.heartColor : this.color,
      rX: args.info.right,
      fY: true,
      s: this.innerS,
      minX: 4,
      list: args.info.heart
        ? [
            {
              x: { r: -1.2, useSize: this.innerS },
              y: { r: -0.2, useSize: actor.head.sY },
              s: this.innerS,
              fX: true,
              fY: true,
              list: [
                args.info.thunder && {
                  color: [255, 255, 255],
                  tY: true,
                  fY: true,
                  y: { r: 0.2 },
                  sY: this.thunderSY,
                  list: [
                    {
                      weight: 1,
                      points: [
                        { x: { r: 0.5 } },
                        {
                          x: { r: 0.65 },
                          y: { r: 0.4 },
                        },
                        {
                          x: { r: 0.35 },
                          y: { r: 0.6 },
                        },
                        { x: { r: 0.5 }, fY: true },
                      ],
                    },
                  ],
                },

                {
                  points: [
                    // Top
                    { y: -1 },
                    { x: { r: 0.1 }, y: -1 },
                    { x: { r: 0.5 }, y: { r: 0.5, a: -1 } },
                    { x: { r: 0.1 }, y: -1, fX: true },
                    { y: -1, fX: true },

                    // Bottom
                    {
                      y: {
                        add: [this.cloudBottomY],
                        min: 2,
                      },
                      x: this.cloudLeftX,
                      fY: true,
                      fX: true,
                    },

                    { x: { r: 0.5 }, fY: true },

                    {
                      y: this.cloudBottomY,
                      x: this.cloudLeftX,
                      fY: true,
                    },
                  ],
                },

                {
                  sY: { r: 0.8 },
                  mX: { r: 0.05, otherDim: true, a: 1 },
                  fY: true,
                },

                // Outside
                {
                  sY: { r: 0.6 },
                  sX: { r: 0.4, min: 2 },
                  x: {
                    r: 0.2,
                    useSize: this.cloudSX,
                    max: { a: 0 },
                  },
                },
                {
                  sY: { r: 0.6 },
                  sX: { r: 0.4, min: 2 },
                  x: {
                    r: 0.4,
                    useSize: this.cloudSX,
                    max: { a: 0 },
                  },
                  fX: true,
                },

                // Bottom
                {
                  mX: { r: 0.3 },
                  fY: true,
                  tY: true,
                  sY: { r: 0.1, min: 1 },
                  x: {
                    r: 0.4,
                    useSize: this.cloudSX,
                    max: { a: 0 },
                  },
                },

                // Cloud
                { mX: this.cloudSX, mY: { r: 0.1, min: 1 } },
              ],
            },
          ]
        : [
            {
              s: this.innerS,
              fX: true,
              fY: true,
              x: { r: -1, useSize: this.innerS },
              list: [
                {
                  weight: 1,
                  points: [{ fY: true }, { fX: true }],
                },
                {
                  weight: 1,
                  points: [
                    {
                      fY: true,
                      y: { r: 0.2 },
                      x: { r: -0.6 },
                    },
                    { fX: true, x: { r: 1 } },
                  ],
                },
                {
                  weight: 1,
                  points: [
                    {
                      fY: true,
                      x: { r: 0.2 },
                      y: { r: -0.2 },
                    },
                    { fX: true, y: { r: 0.5 } },
                  ],
                },
              ],
            },
          ],
    },
  ])
}
// END Emotion \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
