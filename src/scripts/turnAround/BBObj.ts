import type { MoveOut, What } from './types'
import type { ColorRgb } from '@/helper/typeColor'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { InputDynamicLink } from '@/scripts/listImage'

type Rotate = {
  abs: number
  real: number
}

export type Move = {
  max?: InputDynamicVariable
  sX?: InputDynamicVariable
  sXBase?: InputDynamicVariable
  xAdd?: InputDynamicVariable
  xBase?: number
  xRel?: number
  y?: InputDynamicVariable
  z?: number
}

const getRotation = (rotate: number): Rotate => {
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

export type StateTurnAround = {
  ll: Array<InputDynamicLink>
  rotate: number
  GR(min: number, max: number): number
  IF(chance?: number): boolean
  R(min: number, max: number): number
}

export type Rotation = {
  BL: Rotate
  BR: Rotate
  FL: Rotate
  FR: Rotate
  cos: number
  front: number
  position: number
  rotate: number
  side: number
  sin: number
  turnedAway: number
}
class BBObj {
  declare ll: Array<InputDynamicVariable>
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
  declare state: StateTurnAround

  constructor(state: StateTurnAround) {
    this.state = state

    this.ll = state.ll
  }

  // GET ROTATION
  calcRotation(rotate: number): Rotation {
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

  mover(
    what: Omit<What, 'id' | 'list'>,
    move: Move,
  ): Omit<What, 'id' | 'list'> {
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

export default BBObj
