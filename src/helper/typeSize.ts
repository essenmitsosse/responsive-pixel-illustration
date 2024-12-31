export type SizeHover<T> = { r?: T; s: { rele?: T } }

type InputDynamicVariableBase = {
  a?: number | string
  add?: ReadonlyArray<InputDynamicVariable>
  getBiggerDim?: boolean
  getLength?: [number, number]
  getLinkedVariable?: () => number
  height?: boolean
  max?: InputDynamicVariable
  min?: InputDynamicVariable
  otherDim?: boolean
  r?: number
  r2?: number
  useSize?: InputDynamicVariableBase | string
}

export type InputDynamicVariable =
  | InputDynamicVariableBase
  | ReadonlyArray<InputDynamicVariable>
  | number
  | string
