import type { MoveOut, What } from './types'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { InputDynamicLink } from '@/scripts/listImage'

export type Rotate = {
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

export type StateTurnAround = {
  ll: Array<InputDynamicLink>
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

const merge = <T extends Pick<What, 'x' | 'y' | 'z'>>(
  what: T,
  args: {
    x: InputDynamicVariable
    y: InputDynamicVariable
    z: number
  },
): T => {
  what.x = args.x

  what.y = args.y

  what.z = args.z

  return what
}

class BBObj {
  declare ll: Array<InputDynamicVariable>

  declare state: StateTurnAround

  constructor(state: StateTurnAround) {
    this.state = state

    this.ll = state.ll
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
      this.ll.push(args.max)

      X.max = args.max

      X.min = { r: -1, useSize: args.max }
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

    what.get = merge(what.get, {
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
}

export default BBObj
