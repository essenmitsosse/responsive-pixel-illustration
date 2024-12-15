export type SizeIn<TA, TUse> = {
  a: TA
  getBiggerDim: unknown
  r: number
  r2: number
  useSize: ReadonlyArray<TUse>
}

export type SizeOut<TA, TUse> = {
  a?: TA
  max?: Max
  min?: Max
  r: number
  useSize?: TUse
}

export type Max = {
  a?: unknown
  otherDim: boolean
  r: number
  useSize?: unknown
}
