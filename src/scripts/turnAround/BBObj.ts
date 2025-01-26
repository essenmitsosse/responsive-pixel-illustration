import { moveOut } from './moveOut'

import type { What } from './types'
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

  mover(
    what: Omit<What, 'id' | 'list'>,
    move: Move,
  ): Omit<What, 'id' | 'list'> {
    let x

    move.sX = what.sX

    what.x = x = moveOut(move, what.rotate, this.ll)

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
