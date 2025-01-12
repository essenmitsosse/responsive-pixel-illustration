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
  main?: boolean
  max?: InputDynamicVariable
  min?: InputDynamicVariable
  odd?: boolean
  otherDim?: boolean
  r?: number
  r2?: number
  random?: InputDynamicVariable
  save?: string
  useSize?: InputDynamicVariable
}

export type InputDynamicVariable =
  | Array<InputDynamicVariable>
  | InputDynamicVariableBase
  | Link
  | number
  | string
  | undefined
