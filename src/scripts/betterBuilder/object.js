export const BBObj = function () {}

// GET ROTATION
BBObj.prototype.calcRotation = function (rotate) {
  var realRotation = rotate - 45,
    rad,
    sin,
    cos,
    front

  if (realRotation > 180) {
    realRotation -= 360
  } else if (realRotation < -180) {
    realRotation += 360
  }

  if (rotate > 360) {
    rotate -= 360
  } else if (rotate < -360) {
    rotate += 360
  }

  rad = (realRotation * Math.PI) / 180

  sin = Math.sin(rad)

  cos = Math.cos(rad)

  front = Math.abs(Math.abs(rotate - 180) - 90) / 90

  return {
    FL: this.getRotation(realRotation),
    FR: this.getRotation(realRotation + 90),
    BL: this.getRotation(realRotation - 90),
    BR: this.getRotation(realRotation + 180),
    position: (sin + cos) / (Math.sin(Math.PI * 0.25) * 2),
    sin,
    cos,
    rotate,
    turnedAway: rotate > 90 && rotate < 270 ? -1 : 1,
    front,
    side: 1 - front,
  }
}

BBObj.prototype.calcRotation.prototype.getRotation = function (rotate) {
  if (rotate > 180) {
    rotate -= 360
  } else if (rotate < -180) {
    rotate += 360
  }

  return {
    real: (rotate = rotate / 90),
    abs: 1 - Math.abs(rotate),
  }
}

// Rotater
export const Rotater = function (args) {
  var drawer = args.drawer,
    rotate = args.rotate

  this.list = []

  this.ll.push(
    (this.sX = {
      r:
        1 +
        // Base Size (change for Front)
        (args.frontSX !== undefined ? rotate.front * (args.frontSX - 1) : 0),
      // + ( args.sideSX !== undefined ? rotate.side * ( args.sideSX - 1 ) : 0 ), 	// change for Side
      useSize: args.baseSX,
      odd: true,
    }),
  )

  if (args.side) {
    if (!args.side.sX) {
      args.side.sX = this.sX
    }

    this.x = this.moveOut(args.side, rotate)
  }

  if (args.sY) {
    this.ll.push((this.sY = args.sY))
  }

  if (args.y) {
    this.ll.push((this.y = args.y))
  }

  if (args.roundTop || args.roundBottom) {
    this.list.push({
      minX: 5,
      minY: 5,
      list: [
        args.roundTop && { name: 'Dot', clear: true },
        args.roundTop && { name: 'Dot', fX: true, clear: true },
        args.roundBottom && { name: 'Dot', fY: true, clear: true },
        args.roundBottom && {
          name: 'Dot',
          fX: true,
          fY: true,
          clear: true,
        },
      ],
    })
  }

  this.pusher(rotate.FL, drawer.draw(args, true, false))

  this.pusher(rotate.FR, drawer.draw(args, true, true), true)

  this.pusher(rotate.BR, drawer.draw(args, false, true))

  this.pusher(rotate.BL, drawer.draw(args, false, false), true)

  return {
    get: {
      sX: this.sX,
      sY: this.sY,
      fY: args.fY,
      tY: args.tY,
      x: this.x,
      y: args.y,
      id: args.id,
      cX: true,
      z:
        (args.z ? args.z * rotate.turnedAway : 0) + (args.zAbs ? args.zAbs : 0),
      list: this.list,
    },
    rotate,
    sX: this.sX,
    sY: this.sY,
    x: this.X,
    y: this.y,
  }
}

Rotater.prototype = new BBObj()

Rotater.prototype.pusher = function (rotate, list, reflect) {
  var front = rotate.abs > 0

  this.list.push({
    sX: { r: front ? rotate.abs : -rotate.abs },
    fX: rotate.real > 0,
    z: front ? 50 : -50,
    list,
    rX: reflect,
  })
}

BBObj.prototype.moveOut = function (args, rotate) {
  // Takes arguments:
  //	sXBase, xBase,
  //	xAdd,
  //	XRel

  var diff,
    add = [],
    X = {
      add,
    }

  if (args.sXBase && args.xBase) {
    // Move out, relative to the Base
    this.ll.push(
      (diff = {
        add: [
          { r: 0.5, useSize: args.sXBase },
          { r: -0.5, useSize: args.sX },
        ],
      }),
    )

    add.push({
      r: rotate.position * args.xBase,

      /** Correct the 1 subtracted Pixel */
      a: args.xBase > 0 && rotate.position * -1,
      useSize: diff,
    })
  }

  if (args.xAdd) {
    // Move Center Point to correct center
    add.push(args.xAdd)
  }

  if (args.xRel) {
    // Move relative to the size of the object
    add.push({
      r: rotate.position * args.xRel,
      useSize: args.sX,
    })
  }

  if (args.max) {
    this.ll.push((this.max = args.max))

    X.max = this.max

    X.min = { r: -1, useSize: this.max }
  }

  this.ll.push(X)

  return X
}

BBObj.prototype.mover = function (what, move) {
  var x

  move.sX = what.sX

  what.x = x = this.moveOut(move, what.rotate)

  what.get = this.merge(what.get, {
    x,
    y: move.y,
    z:
      (move.xRel
        ? move.xRel && move.xRel < 0
          ? -1
          : 1
        : move.xBase && move.xBase < 0
          ? -1
          : 1) *
      (move.z || 50) *
      what.rotate.turnedAway,
  })

  return what
}

BBObj.prototype.merge = function (what, args) {
  for (var attr in args) {
    what[attr] = args[attr]
  }

  return what
}

export const RotateInfo = function (rotate) {
  var s = { a: 5 }

  this.ll.push(s)

  return {
    color: this.black,
    s: [s, s, 1],
    x: { r: 0.02 },
    y: { r: 0.02 },
    rX: true,
    list: [
      { sX: 1, cX: true },
      { sY: 1, cY: true },
      {
        color: [150, 150, 150],
        c: true,
        s,
        list: [
          {},
          { sX: 1, color: this.c1 },
          { sY: 1, fY: true, color: this.c1D },
        ],
      },
      {
        s: 1,
        c: true,
        list: [
          {
            color: this.c2D,
            points: [
              {},
              {
                x: { useSize: s, r: rotate.sin },
                y: { useSize: s, r: rotate.cos },
              },
            ],
          },
        ],
      },
    ],
  }
}

RotateInfo.prototype = new BBObj()
