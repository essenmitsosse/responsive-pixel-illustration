import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

export type MoveOut = {
  add: ReadonlyArray<InputDynamicVariable>
  max?: InputDynamicVariable
  min?: InputDynamicVariable
}

export type What = {
  cX?: boolean
  fY?: boolean
  get: Tool
  id: string
  list: ReadonlyArray<Tool>
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
