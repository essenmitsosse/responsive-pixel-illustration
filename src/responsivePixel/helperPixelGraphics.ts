import { ColorRgb, Size, SizeObject } from './PixelGraphics/types'

export const getSmallerDim = function (x) {
  const o = { r: x.r }
  const max = { r: x.r2 || x.r, otherDim: true }

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

export const getBiggerDim = function (x) {
  x.getBiggerDim = true
  return getSmallerDim(x)
}

export const mult = function (r: number, use: string, a?: number) {
  return { r, useSize: use, a }
}

export const sub = function (use) {
  return { r: -1, useSize: use }
}

export const margin = function (full, margin, min) {
  return { add: [full, { r: -2, useSize: margin }], min }
}

export const getDarken = function (darken, strength) {
  let l = darken.length
  const finalDarken = []

  strength /= 255

  while (l--) {
    finalDarken[l] = darken[l] * strength
  }

  return function (color: ColorRgb, copy?: ColorRgb) {
    let l = color.length
    const newColor: ColorRgb = copy || []

    while (l--) {
      newColor[l] = Math.floor(color[l] * finalDarken[l])
    }

    return newColor
  }
}

export const getLighten = function (lighten, strength) {
  let l = lighten.length
  const finaleLighten = []

  while (l--) {
    finaleLighten[l] = lighten[l] * strength
  }

  return function (color: ColorRgb): ColorRgb {
    let l = color.length
    const newColor = []
    let thisC

    while (l--) {
      newColor[l] = (thisC = color[l] + finaleLighten[l]) > 255 ? 255 : thisC
    }

    return newColor
  }
}

export const addC = function (add) {
  return function (color) {
    let l = color.length
    const newColor = []
    let thisC

    while (l--) {
      newColor[l] =
        (thisC = color[l] + add[l]) > 255 ? 255 : thisC < 0 ? 0 : thisC
    }

    return newColor
  }
}

export const lessSat = function (color, s) {
  const total = ((color[0] + color[1] + color[2]) * (1 - s)) / 3

  return [color[0] * s + total, color[1] * s + total, color[2] * s + total]
}

export const getBrightness = function (color) {
  let l = color.length
  let b = 0

  while (l--) {
    b += color[l]
  }

  return b / 3
}

export const colorAdd = function (rgb, add) {
  return [rgb[0] + add, rgb[1] + add, rgb[2] + add]
}

export const multiplyColor = function (rgb, factor) {
  return [rgb[0] * factor, rgb[1] * factor, rgb[2] * factor]
}

export const getLinkListPusher = function (linkList) {
  return function (link) {
    linkList.push(link)

    return link
  }
}

export const setValue = function (what, value) {
  what.r = value
}
export const setValueNew = function (what, value) {
  what.s.rele = value
}

export const getHoverChangers = function () {
  const changersRelativeStandardList: Array<SizeObject> = []
  const changersRelativeCustomList: Array<Size> = []
  const changersColorStandardList: Array<Size> = []
  const changersCustomList: Array<Size> = []

  const pushRelativeStandard = (
    min: number,
    max: number,
    map: unknown,
    variable: SizeObject,
  ) => {
    changersRelativeStandardList.push({
      change: max - min,
      min,
      map,
      variable,
    })
  }

  const changeColor = (
    value: number,
    map: { max: ColorRgb; min: ColorRgb; color: ColorRgb },
  ) => {
    const maxColor = map.max
    const minColor = map.min
    const maxR = maxColor[0]
    const maxG = maxColor[1]
    const maxB = maxColor[2]
    const minR = minColor[0]
    const minG = minColor[1]
    const minB = minColor[2]
    const { color } = map
    const valueNeg = 1 - value

    color[0] = minR * valueNeg + maxR * value
    color[1] = minG * valueNeg + maxG * value
    color[2] = minB * valueNeg + maxB * value
  }

  let setValueInner = setValue

  return {
    list: changersRelativeStandardList,
    changersRelativeCustomList,
    changersCustomList,
    pushColorStandard: changersColorStandardList,

    pushRelativeStandard,

    // Takes an object, where the keys have the names of dimensions from the object which called it
    // This dimension "r" is linked to the variables max, min and can be changed by what is defined by map
    pushRelativeStandardAutomatic(info?: Record<string, SizeObject>) {
      let key: string
      let currentInfo: Size | undefined
      let currentSize: Size | undefined

      if (info) {
        for (key in info) {
          if ((currentSize = this[key])) {
            // Assignment
            currentInfo = info[key]
            if (typeof currentInfo === 'object') {
              if (currentInfo.map !== undefined) {
                pushRelativeStandard(
                  currentInfo.min, // max
                  currentInfo.max, // min
                  currentInfo.map, // map
                  currentSize, // variable
                )
              } else {
                // Just assign the max or min value
                currentSize = currentInfo.max || currentInfo.min
              }
            } else {
              // Just assign the value
              currentSize.r = currentInfo
            }
          }
        }
      }
    },

    hover(args: Record<string, unknown>): void {
      let l: number
      let current: unknown
      let currentValue: unknown
      let key: unknown
      let somethingToChange = false

      for (key in args) {
        if (key !== 'width' && key !== 'height' && key !== 'isServer') {
          somethingToChange = true
          break
        }
      }

      if (somethingToChange) {
        // Change the RELATIVE VALUE of the variable, by the STANDARD map scheme
        if ((l = changersRelativeStandardList.length)) {
          while (l--) {
            current = changersRelativeStandardList[l]

            if (args[current.map] !== undefined) {
              setValueInner(
                current.variable,
                current.min + current.change * args[current.map],
              )
            }
          }
        }

        // Change the RELATIVE VALUE of the variable, by a CUSTOM map scheme
        if ((l = changersRelativeCustomList.length)) {
          while (l--) {
            current = changersRelativeCustomList[l]

            if ((currentValue = current[1](args)) !== undefined) {
              setValueInner(current[0], currentValue)
            }
          }
        }

        // Change a COLOR, by a STANDARD map scheme
        if ((l = changersColorStandardList.length)) {
          while (l--) {
            current = changersColorStandardList[l]
            if (args[current.map] !== undefined) {
              changeColor(args[current.map], current)
            }
          }
        }

        // Execute a CUSTOM FUNCTION
        if ((l = changersCustomList.length)) {
          while (l--) {
            changersCustomList[l](args)
          }
        }

        // TODO: Set Color after adding;
      }
    },

    ready() {
      setValueInner = setValueNew
    },
  }
}

export const getRandomInt = function (i) {
  return Math.floor(Math.random() * i)
}

export const getRandom = function (seed) {
  const denom = Math.pow(2, 31)
  const a = 11
  const b = 19
  const c = 8
  // x = Math.pow( seed, 3 ) + 88675123 || 88675123,
  let x = seed || Math.floor(Math.random() * 4294967296)
  let t = x ^ (x << a)

  const getFloat = function () {
    const t = x ^ (x << a)
    return (x = x ^ (x >> c) ^ (t ^ (t >> b))) / denom
  }

  x = x ^ (x >> c) ^ (t ^ (t >> b))

  t = x ^ (x << a)
  x = x ^ (x >> c) ^ (t ^ (t >> b))

  t = x ^ (x << a)
  x = x ^ (x >> c) ^ (t ^ (t >> b))

  return {
    getFloat,

    getIf(chance) {
      return (chance || 0.2) > getFloat()
    },

    getRandom(min, max) {
      return Math.floor((max - min + 1) * getFloat() + min)
    },

    getRandomFloat(min, max) {
      return (max - min) * getFloat() + min
    },
  }
}
