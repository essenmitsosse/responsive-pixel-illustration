import type { ColorRgb } from '@/helper/typeColor'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

type Rotation = {
  abs: number
  real: number
}

const getRotation = (rotate: number): Rotation => {
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

type MoveOut = {
  add: ReadonlyArray<InputDynamicVariable>
  max?: InputDynamicVariable
  min?: InputDynamicVariable
}

type Move = {
  max?: InputDynamicVariable
  sX?: InputDynamicVariable
  sXBase?: InputDynamicVariable
  xAdd?: InputDynamicVariable
  xBase?: number
  xRel?: number
  y?: InputDynamicVariable
  z?: number
}

type What = {
  cX: boolean
  fY: boolean
  get: Omit<What, 'get' | 'rotate'>
  id: number
  list: ReadonlyArray<Tool>
  rotate: {
    position: number
    turnedAway: number
  }
  sX: InputDynamicVariable
  sY: InputDynamicVariable
  tY: InputDynamicVariable
  x?: InputDynamicVariable
  y?: InputDynamicVariable
  z?: number
}

export class BBObj {
  declare ll?: Array<InputDynamicVariable>
  declare max?: InputDynamicVariable
  white: ColorRgb = [200, 200, 200]
  black: ColorRgb = [20, 20, 20]
  c1: ColorRgb = [200, 20, 20]
  c2: ColorRgb = [20, 200, 20]
  c3: ColorRgb = [20, 0, 200]
  c4: ColorRgb = [200, 200, 20]
  c5: ColorRgb = [20, 200, 200]
  c6: ColorRgb = [200, 20, 200]
  c1D: ColorRgb = [150, 20, 20]
  c2D: ColorRgb = [20, 150, 20]
  c3D: ColorRgb = [20, 0, 150]
  c4D: ColorRgb = [150, 150, 20]
  c5D: ColorRgb = [20, 150, 150]
  c6D: ColorRgb = [150, 20, 150]
  // GET ROTATION
  calcRotation(rotate: number): {
    BL: Rotation
    BR: Rotation
    FL: Rotation
    FR: Rotation
    cos: number
    front: number
    position: number
    rotate: number
    side: number
    sin: number
    turnedAway: number
  } {
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
  moveOut(
    args: Move,
    rotate: {
      position: number
    },
  ): MoveOut {
    // Takes arguments:
    //	sXBase, xBase,
    //	xAdd,
    //	XRel

    let diff: InputDynamicVariable

    const add: Array<InputDynamicVariable> = []

    const X: {
      add: ReadonlyArray<InputDynamicVariable>
      max?: InputDynamicVariable
      min?: InputDynamicVariable
    } = {
      add,
    }

    if (this.ll === undefined) {
      throw new Error('Unexpected error: ll is undefined')
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
        a: args.xBase > 0 ? rotate.position * -1 : undefined,
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

  mover(what: What, move: Move): What {
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

  merge<T extends Pick<What, 'x' | 'y' | 'z'>>(
    what: T,
    args: {
      x: InputDynamicVariable
      y: InputDynamicVariable
      z: number
    },
  ): T {
    what.x = args.x

    what.y = args.y

    what.z = args.z

    return what
  }
}

type ArgsRotater = {
  baseSX: InputDynamicVariable
  drawer: {
    draw: (args: ArgsRotater, a: boolean, b: boolean) => ReadonlyArray<Tool>
  }
  fY: boolean
  frontSX?: number
  id: number
  rotate: {
    BL: { abs: number; real: number }
    BR: { abs: number; real: number }
    FL: { abs: number; real: number }
    FR: { abs: number; real: number }
    front: number
    position: number
    turnedAway: number
  }
  roundBottom: boolean
  roundTop: boolean
  sY?: InputDynamicVariable
  side?: {
    sX: InputDynamicVariable
  }
  tY: InputDynamicVariable
  y: InputDynamicVariable
  z?: number
  zAbs?: number
}

// Rotater
export class Rotater extends BBObj {
  declare list: Array<Tool>
  result: Omit<What, 'cX' | 'fY' | 'id' | 'list' | 'tY'>
  declare sX: InputDynamicVariable
  declare sY: InputDynamicVariable
  declare x: MoveOut
  declare X: InputDynamicVariable
  declare y: InputDynamicVariable

  constructor(args: ArgsRotater) {
    super()

    if (this.ll === undefined) {
      throw new Error('Unexpected error: ll is undefined')
    }

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

    this.result = {
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

  pusher(
    rotate: { abs: number; real: number },
    list: ReadonlyArray<Tool>,
    reflect?: boolean,
  ): void {
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
  declare result: Tool
  constructor(rotate: { cos: number; sin: number }) {
    super()

    if (this.ll === undefined) {
      throw new Error('Unexpected error: ll is undefined')
    }

    const s = { a: 5 }

    this.ll.push(s)

    this.result = {
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
