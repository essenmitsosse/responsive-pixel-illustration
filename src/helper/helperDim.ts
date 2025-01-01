type MinMax = {
  a?: number
  otherDim: boolean
  r: number
  useSize?: string
}

type Dim = {
  a?: number
  max?: MinMax
  min?: MinMax
  r: number
  useSize?: string
}

export const getSmallerDim = (x: {
  a?: number
  getBiggerDim?: boolean
  r: number
  r2?: number
  useSize?: [string, string]
}): Dim => {
  const o: Dim = { r: x.r }

  const max: MinMax = {
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

  if (x.r !== undefined && x.r >= 0 && !x.getBiggerDim) {
    o.max = max
  } else {
    o.min = max
  }

  return o
}

export const getBiggerDim = (x: {
  r: number
  useSize?: [string, string]
}): Dim => getSmallerDim({ ...x, getBiggerDim: true })

export const mult = <TR, TUse, TA>(
  r: TR,
  use: TUse,
  a: TA,
): {
  a: TA
  r: TR
  useSize: TUse
} => ({ r, useSize: use, a })

export const sub = <TUse>(use: TUse): { r: number; useSize: TUse } => ({
  r: -1,
  useSize: use,
})
