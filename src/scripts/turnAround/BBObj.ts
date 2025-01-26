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

class BBObj {
  declare ll: Array<InputDynamicVariable>

  declare state: StateTurnAround

  constructor(state: StateTurnAround) {
    this.state = state

    this.ll = state.ll
  }
}

export default BBObj
