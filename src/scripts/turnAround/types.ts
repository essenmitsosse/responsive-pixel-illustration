import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'
import type { InputDynamicLink } from '@/scripts/listImage'

export type MoveOut = {
  add: ReadonlyArray<InputDynamicVariable>
  max?: InputDynamicVariable
  min?: InputDynamicVariable
}

export type GetTool = {
  get: Tool
}

export type What = {
  cX?: boolean
  fY?: boolean
  rotate: {
    position: number
    turnedAway: number
  }
  sX?: InputDynamicVariable
  sY?: InputDynamicVariable
  tY?: boolean
  x?: InputDynamicVariable
  y?: InputDynamicVariable
  z?: number
}

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
