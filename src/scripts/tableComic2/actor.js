// BEGINN Actor /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Actor = function (args) {
  if (!args) {
    args = {}
  }

  // Forms & Sizes
  this.ratio = args.ratio || 0.25

  this.main = args.main

  this.headScaling = args.headScaling || 1

  this.headSY_ = 0.25

  this.headRelSY_ = this.rFl(0.6, 1.3)

  this.sizeMap = {
    map: 'actor-size',
    min: this.main ? 0.5 : 1.5,
    max: this.main ? 1.5 : 0.5,
  }

  // Colors
  this.colors = {
    color1: this.getColorShades(args.firstColor || [200, 150, 80]),
    color2: this.getColorShades(args.secondColor || [255, 0, 0]),
    skinColor: this.getColorShades(args.color || [0, 255, 0]),
  }

  // Assets
  this.head = new this.basic.Head({
    actor: this,
  })

  this.body = new this.basic.Body({
    info: args.body || {},
    actor: this,
  })

  this.arm = new this.basic.Arm({
    info: args.arm || {},
    actor: this,
  })
}

Actor.prototype.getSize = function (args) {
  var sY = (this.maxSize = this.pushLinkList({
    r: 1,
    useSize: args.stageSY,
    max: args.stageSY,
  }))

  // calculates this.sX & this.sY
  this.getSizeWithRatio({
    sX: args.stageSX,
    sY,
  })

  // this.getSizeWithSizeXY( {

  // } );

  // HeadSize
  this.headSY = this.pushLinkList({ r: this.headSY_, useSize: this.sY })

  this.headSY = this.pushLinkList({ r: 1, useSize: this.headSY })

  this.bodySY = this.pushLinkList({
    add: [this.sY, { r: -1, useSize: this.headSY }],
  })

  this.pushRelativeStandardAutomatic({
    maxSize: this.sizeMap,
    headSY: this.headScaling,
  })
}

Actor.prototype.getSizeFromHead = function (args) {
  var mapper = this.headScaling,
    map,
    min,
    change,
    ratio = this.ratio,
    headSY_ = this.headSY_

  // calculates this.sX & this.headSY
  this.getSizeWithRatio({
    sX: args.stageSX,
    sY: args.stageSY,
    sXName: 'sX',
    sYName: 'headSY',
    ratio: ratio / headSY_,
  })

  this.bodySY = this.pushLinkList({
    r: (1 - headSY_) / headSY_,
    useSize: this.headSY,
  })

  this.sY = this.pushLinkList([this.bodySY, this.headSY])

  if (mapper.map) {
    map = mapper.map

    min = mapper.min

    change = mapper.max - min

    this.changersRelativeCustomList.push([
      this.sX,
      function (args) {
        if (args[map] !== undefined) {
          return ratio / (headSY_ * (args[map] * change + min))
        }
      },
    ])

    this.changersRelativeCustomList.push([
      this.headSY,
      function (args) {
        if (args[map] !== undefined) {
          return (headSY_ * (args[map] * change + min)) / ratio
        }
      },
    ])

    this.changersRelativeCustomList.push([
      this.bodySY,
      function (args) {
        var headSY

        if (args[map] !== undefined) {
          headSY = headSY_ * (args[map] * change + min)

          return (1 - headSY) / headSY
        }
      },
    ])
  }
}

Actor.prototype.getBetterPosX = function (rel) {
  var add = []

  if (!this.isRotated) {
    add.push(this.getPosX(rel))
  } else {
    add.push(this.x, this.square, { r: -1 + rel, useSize: this.sY })
  }

  return this.pushLinkList({ add })
}

Actor.prototype.getBetterPosY = function (rel) {
  var add = [{ r: -1, useSize: this.y }]

  if (!this.isRotated) {
    add.push(
      {
        r: -1 * rel,
        useSize: this.pushLinkList({ add: [this.sY, this.baseShift] }),
      },
      this.baseShift,
    )
  } else {
    add.push(this.pushLinkList({ r: -rel, useSize: this.sX }))
  }

  return this.pushLinkList({ add })
}

Actor.prototype.getFocus = function (zoomSX, zoomSY, focus) {
  var x = this.pushLinkList({
      add: [
        { r: 0.5, useSize: zoomSX },
        // normalize pan
        { r: -1, useSize: this.x },
        // pos
      ],
    }),
    y = this.pushLinkList({
      add: [
        { r: 0.5, useSize: zoomSY },
        // normalize pan
        { r: -1, useSize: this.y },
        // pos
      ],
    })

  if (this.isRotated) {
    x.add.push({ r: -1, useSize: this.square }, this.sY, {
      r: -focus.posX,
      useSize: this.headSY,
    })

    y.add.push(
      { r: -focus.posY, useSize: this.square },
      { r: -1, useSize: this.lean },
    )
  } else {
    x.add.push(
      { r: -focus.posX, useSize: this.sX },
      // relative to Head
      { r: -1, useSize: this.lean },
    )

    y.add.push(
      { r: -1, useSize: this.sY },
      // size
      { r: 1 - focus.posY, useSize: this.headSY },
      // relative to Head
    )
  }

  return {
    x,
    y,
  }
}

Actor.prototype.draw = function (args) {
  var info = args.info

  this.zoomToHead = info.zoomToHead

  // Decide which size calculation method to use and use it.
  this[this.zoomToHead ? 'getSizeFromHead' : 'getSize'](args)

  // SX and headScaling have automatically been generated; add additional properties
  this.sX.min = 3

  this.sX.odd = true

  this.headSY.a = 1

  this.headSY.min = 4

  this.headSX = this.pushLinkList({ r: 1, useSize: this.sX })

  this.pushRelativeStandardAutomatic({
    headSX: this.headScaling,
  })

  // get x, y Position and rotiation
  this.getPosition(args)

  // Precalc the size of the body
  this.body.getSize({ sX: this.sX, sY: this.bodySY })

  // drag the actor deeper for sitting
  this.baseShift = this.pushLinkList(
    info.sitting
      ? [{ r: -1, useSize: this.body.legSY }, this.body.legs.hipSY]
      : { a: 0 },
  )

  this.baseShift = this.pushLinkList({ r: 1, useSize: this.baseShift })

  this.pushRelativeStandardAutomatic({
    baseShift: { map: 'props', min: 0, max: 1 },
  })

  this.y = this.pushLinkList({ add: [this.y, this.baseShift] })

  // Turn Body
  this.side = this.pushLinkList({ r: 0, useSize: this.sX })

  // Lean Body
  this.lean = this.pushLinkList({ r: 0, useSize: this.side })
  // this.torsoLean = this.pushLinkList( { r: 0.66, useSize: this.lean } );

  // Check if there are hover changers and add them
  this.pushRelativeStandardAutomatic(info.body)

  this.armRightInfo = info.armRight

  this.armLeftInfo = info.armLeft
  // this.sideInfo = info.body.side;

  return [
    (this.renderObject = this.getObject([
      this.debug && {
        list: [
          { color: [0, 20, 50], sX: 1 },
          { color: [0, 20, 50], sX: 1, fX: true },
          { color: [0, 20, 50], sY: 1 },
          { color: [0, 20, 50], sY: 1, fY: true },
        ],
      },

      // Body
      this.body.draw({
        sX: this.sX,
        sY: this.bodySY,
        lean: this.lean,
        info,
      }),

      // Head
      this.head.draw({
        sX: this.headSX,
        sY: this.headSY,
        x: this.lean,
        info,
      }),
    ])),
    this,
  ]
}

Actor.prototype.finishRendering = function () {
  this.renderObject.list[0].list.push({
    y: this.headSY,
    list: [
      // Right Arm
      this.arm.draw({
        right: true,
        torsoSY: this.body.torso.sY,
        torsoSX: this.body.torso.sX,
        x: this.lean,
        info: this.armRightInfo,
      }),

      // Left Arm
      this.arm.draw({
        right: false,
        torsoSY: this.body.torso.sY,
        torsoSX: this.body.torso.sX,
        x: this.lean,
        info: this.armLeftInfo,
      }),
    ],
  })
}
// END Actor \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Body /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Body = function Body(args) {
  this.actor = args.actor

  // Forms & Sizes
  this.legBaseSY_ = 0.7

  this.legRelSY_ = this.rFl(0.5, (1 / this.legBaseSY_) * 0.9)

  // Assets
  this.torso = new this.basic.Torso({
    info: args.info.torso || {},
    actor: this.actor,
  })

  this.legs = new this.basic.Legs({
    actor: this.actor,
  })
}

Body.prototype.getSize = function BodyGetSize(args) {
  this.legSY = this.getSizeSwitch(
    { r: this.legBaseSY_, useSize: args.sY },
    { r: this.legRelSY_ },
    {},
    'actor-features',
  )

  this.torsoSY = this.pushLinkList({
    add: [args.sY, { r: -1, useSize: this.legSY }],
  })

  this.legs.getSize({
    sX: args.sX,
    sY: this.legSY,
  })

  this.torso.getSize({
    sX: args.sX,
    sY: this.torsoSY,
  })
}

Body.prototype.draw = function BodyDraw(args) {
  this.sY = args.sY

  this.sX = args.sX

  return {
    sY: args.sY,
    fY: true,
    list: [
      this.torso.draw({
        sX: args.sX,
        sY: this.torsoSY,
        info: args.info,
        lean: args.lean,
      }),

      this.legs.draw({
        sX: args.sX,
        sY: this.legSY,
        info: args.info,
        side: args.side,
      }),
    ],
  }
}
// END Body \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Torso /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Torso = function Torso(args) {
  this.actor = args.actor

  // Colors
  this.color = this.actor.colors.color1

  // Assests
  this.zipper = this.rIf(0.5)

  this.zipperSY = this.rIf(0.6) ? 1 : this.rFl(0, 1)
}

Torso.prototype.getSize = function TorsoDraw(args) {
  this.x = this.pushLinkList({ r: 0.2, useSize: args.sX })
}

Torso.prototype.draw = function TorsoDraw(args) {
  this.sX = args.sX

  this.sY = args.sY

  this.center = this.pushLinkList({ r: 0.5, useSize: this.sX, a: -1 })

  if (this.zipper) {
    this.zipperY = this.pushLinkList({ r: 0.5, useSize: this.sY })

    this.leanWay = this.pushLinkList({ r: 0.5, useSize: args.lean })

    this.pushRelativeStandardAutomatic({
      zipperY: { map: 'actor-accessoirs', min: 0, max: this.zipperSY },
      leanWay: { map: 'actor-accessoirs', min: this.zipperSY, max: 0 },
    })
  }

  this.upperTorsoSY = this.pushLinkList({ r: 0.5, useSize: args.sY, min: 1 })

  this.lowerTorsoSY = this.pushLinkList({
    add: [args.sY, { r: -1, useSize: this.upperTorsoSY }, 1],
    min: 1,
  })

  return {
    color: this.color[0],
    sX: this.sX,
    sY: this.sY,
    // fX: true,
    list: [
      {
        fY: true,
        stripes: { horizontal: true, change: args.lean },
        list: [
          {
            sX: this.sX,
            fX: true,
            list: [
              {},
              { sX: 1, color: this.color[1] },
              { sX: 1, fX: true, color: this.color[1] },
            ],
          },
        ],
      },

      // Zipper
      this.zipper && {
        weight: 1,
        color: this.color[3],
        points: [
          { x: [args.lean, this.center] },
          { x: [this.center, this.leanWay], y: this.zipperY },
        ],
      },

      {
        sY: 1,
        x: args.lean,
        color: this.color[1],
      },
    ],
  }
}
// END Torso \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
