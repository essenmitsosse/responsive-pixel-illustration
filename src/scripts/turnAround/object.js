const getRotation = (rotate) => {
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

export class BBObj {
  // GET ROTATION
  calcRotation(rotate) {
    let realRotation = rotate - 45

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

    const rad = (realRotation * Math.PI) / 180
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    const front = Math.abs(Math.abs(rotate - 180) - 90) / 90

    return {
      FL: getRotation(realRotation),
      FR: getRotation(realRotation + 90),
      BL: getRotation(realRotation - 90),
      BR: getRotation(realRotation + 180),
      position: (sin + cos) / (Math.sin(Math.PI * 0.25) * 2),
      sin,
      cos,
      rotate,
      turnedAway: rotate > 90 && rotate < 270 ? -1 : 1,
      front,
      side: 1 - front,
    }
  }
  moveOut(args, rotate) {
    // Takes arguments:
    //	sXBase, xBase,
    //	xAdd,
    //	XRel

    let diff

    const add = []

    const X = {
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

  mover(what, move) {
    let x

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

  merge(what, args) {
    for (const attr in args) {
      what[attr] = args[attr]
    }

    return what
  }
}

// Rotater
export class Rotater extends BBObj {
  constructor(args) {
    super()

    this.list = []

    this.ll.push(
      (this.sX = {
        r:
          1 +
          // Base Size (change for Front)
          (args.frontSX !== undefined
            ? args.rotate.front * (args.frontSX - 1)
            : 0),
        // + ( args.sideSX !== undefined ? rotate.side * ( args.sideSX - 1 ) : 0 ), 	// change for Side
        useSize: args.baseSX,
        odd: true,
      }),
    )

    if (args.side) {
      if (!args.side.sX) {
        args.side.sX = this.sX
      }

      this.x = this.moveOut(args.side, args.rotate)
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

    this.pusher(args.rotate.FL, args.drawer.draw(args, true, false))

    this.pusher(args.rotate.FR, args.drawer.draw(args, true, true), true)

    this.pusher(args.rotate.BR, args.drawer.draw(args, false, true))

    this.pusher(args.rotate.BL, args.drawer.draw(args, false, false), true)

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
          (args.z ? args.z * args.rotate.turnedAway : 0) +
          (args.zAbs ? args.zAbs : 0),
        list: this.list,
      },
      rotate: args.rotate,
      sX: this.sX,
      sY: this.sY,
      x: this.X,
      y: this.y,
    }
  }

  pusher(rotate, list, reflect) {
    const front = rotate.abs > 0

    this.list.push({
      sX: { r: front ? rotate.abs : -rotate.abs },
      fX: rotate.real > 0,
      z: front ? 50 : -50,
      list,
      rX: reflect,
    })
  }
}

export class RotateInfo extends BBObj {
  constructor(rotate) {
    super()

    const s = { a: 5 }

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
}
