import type { Link } from '@/scripts/listImage'

export type SizeHover<T> = { r?: T; s: { rele?: T } }

type InputDynamicVariableBase = {
  a?: number | string
  add?: ReadonlyArray<InputDynamicVariable>
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
