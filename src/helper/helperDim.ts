import type { InputDynamicVariable, InputDynamicVariableBase } from './typeSize'

export const getSmallerDim = (x: {
  a?: number
  getBiggerDim?: boolean
  r: number
  r2?: number
  useSize?: [InputDynamicVariable, InputDynamicVariable]
}): InputDynamicVariableBase => {
  const o: InputDynamicVariableBase = { r: x.r }

  const max: InputDynamicVariable = {
    r: x.r2 || x.r,
    otherDim: true,
  }

  if (x.a) {
    o.a = x.a

    max.a = x.a
  }

  if (x.useSize) {
    o.useSize = x.useSize[0]

    max.useSize = x.useSize[1] || x.useSize[0]
  }

  if (x.r >= 0 && !x.getBiggerDim) {
    o.max = max
  } else {
    o.min = max
  }

  return o
}

export const getBiggerDim = (x: {
  r: number
  useSize?: [InputDynamicVariable, InputDynamicVariable]
}): InputDynamicVariableBase => getSmallerDim({ ...x, getBiggerDim: true })

export const mult = (
  r: InputDynamicVariableBase['r'],
  use: InputDynamicVariableBase['useSize'],
  a?: InputDynamicVariableBase['a'],
): InputDynamicVariableBase => ({ r, useSize: use, a })

export const sub = (
  use: InputDynamicVariableBase['useSize'],
): InputDynamicVariableBase => ({
  r: -1,
  useSize: use,
})
