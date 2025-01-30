import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'
import type { InputDynamicLink } from '@/scripts/listImage'

export type GetTool = {
  get: Tool
}

export type DataRotation = {
  rotate: {
    position: number
    turnedAway: number
  }
}

export type DataSize = {
  sX: InputDynamicVariable
  sY: InputDynamicVariable
}

export type DataPos = {
  x?: InputDynamicVariable
  y?: InputDynamicVariable
  z?: number
}

export type StateTurnAround = {
  ll: Array<InputDynamicLink>
  GR(min: number, max: number): number
  IF(chance?: number): boolean
  R(min: number, max: number): number
}
