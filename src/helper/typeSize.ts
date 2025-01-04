import type { Link } from '@/scripts/listImage'

export type SizeHover<T> = { r?: T; s: { rele?: T } }

export type InputDynamicVariableBase = {
  a?: number | string
  add?: ReadonlyArray<InputDynamicVariable>
  autoUpdate?: boolean
  debug?: unknown
  getBiggerDim?: boolean
  getLength?: [number, number]
  getLinkedVariable?: () => number
  height?: boolean
  max?: InputDynamicVariable
  min?: InputDynamicVariable
  odd?: boolean
  otherDim?: boolean
  r?: number
  r2?: number
  save?: string
  useSize?: InputDynamicVariableBase | string
}

export type InputDynamicVariable =
  | Array<InputDynamicVariable>
  | InputDynamicVariableBase
  | Link
  | number
  | string
  | undefined
