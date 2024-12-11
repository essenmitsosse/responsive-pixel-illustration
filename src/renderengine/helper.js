import getIsUnknownObject from '@/lib/getIsUnknownObject'
import getObjectKeys from '@/lib/getObjectKeys'

class Helper {
  constructor() {}

  getSmallerDim(x) {
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

  getBiggerDim(x) {
    x.getBiggerDim = true

    return this.getSmallerDim(x)
  }

  mult(r, use, a) {
    return { r, useSize: use, a }
  }

  sub(use) {
    return { r: -1, useSize: use }
  }

  margin(full, margin, min) {
    return { add: [full, { r: -2, useSize: margin }], min }
  }

  darken(darken, strength) {
    let l = darken.length

    const finalDarken = []

    strength /= 255

    while (l--) {
      finalDarken[l] = darken[l] * strength
    }

    return function (color, copy) {
      let l = color.length

      const newColor = copy || []

      while (l--) {
        newColor[l] = Math.floor(color[l] * finalDarken[l])
      }

      return newColor
    }
  }

  lighten(lighten, strength) {
    let l = lighten.length

    const finaleLighten = []

    while (l--) {
      finaleLighten[l] = lighten[l] * strength
    }

    return function (color) {
      let l = color.length

      const newColor = []

      let thisC

      while (l--) {
        newColor[l] = (thisC = color[l] + finaleLighten[l]) > 255 ? 255 : thisC
      }

      return newColor
    }
  }

  addC(add) {
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

  lessSat(color, s) {
    const total = ((color[0] + color[1] + color[2]) * (1 - s)) / 3

    return [color[0] * s + total, color[1] * s + total, color[2] * s + total]
  }

  getBrightness(color) {
    let l = color.length
    let b = 0

    while (l--) {
      b += color[l]
    }

    return b / 3
  }

  colorAdd(rgb, add) {
    return [rgb[0] + add, rgb[1] + add, rgb[2] + add]
  }

  multiplyColor(rgb, factor) {
    return [rgb[0] * factor, rgb[1] * factor, rgb[2] * factor]
  }

  getLinkListPusher(linkList) {
    return function (link) {
      linkList.push(link)

      return link
    }
  }

  setValue(what, value) {
    what.r = value
  }

  setValueNew(what, value) {
    what.s.rele = value
  }

  getHoverChangers() {
    const that = this
    const changersRelativeStandardList = []
    const changersRelativeCustomList = []
    const changersColorStandardList = []
    const changersCustomList = []
    const pushRelativeStandard = (min, max, map, variable) => {
      changersRelativeStandardList.push({
        change: max - min,
        min,
        map,
        variable,
      })
    }
    const changeColor = (value, map) => {
      const [maxR, maxG, maxB] = map.max
      const [minR, minG, minB] = map.min
      const valueNeg = 1 - value

      map.color[0] = minR * valueNeg + maxR * value

      map.color[1] = minG * valueNeg + maxG * value

      map.color[2] = minB * valueNeg + maxB * value
    }

    return {
      list: changersRelativeStandardList,
      changersRelativeCustomList,
      changersCustomList,
      pushColorStandard: changersColorStandardList,

      pushRelativeStandard,

      // Takes an object, where the keys have the names of dimensions from the object which called it
      // This dimension "r" is linked to the variables max, min and can be changed by what is defined by map
      pushRelativeStandardAutomatic(info) {
        if (info) {
          getObjectKeys(info).forEach((key) => {
            let currentSize = this[key]

            if (currentSize) {
              // Assignment
              const currentInfo = info[key]

              if (getIsUnknownObject(currentInfo)) {
                if (currentInfo.map !== undefined) {
                  pushRelativeStandard(
                    currentInfo.min,
                    currentInfo.max,
                    currentInfo.map,
                    currentSize,
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
          })
        }
      },

      hover(args) {
        const changersRelativeStandard = changersRelativeStandardList
        const changersRelativeCustom = changersRelativeCustomList
        const changersColorStandard = changersColorStandardList
        const changersCustom = changersCustomList

        let l
        let current
        let currentValue
        let key
        let somethingToChange = false

        for (key in args) {
          if (key !== 'width' && key !== 'height') {
            somethingToChange = true
            break
          }
        }

        if (somethingToChange) {
          // Change the RELATIVE VALUE of the variable, by the STANDARD map scheme
          if ((l = changersRelativeStandard.length)) {
            while (l--) {
              current = changersRelativeStandard[l]

              if (args[current.map] !== undefined) {
                that.setValue(
                  current.variable,
                  current.min + current.change * args[current.map],
                )
              }
            }
          }

          // Change the RELATIVE VALUE of the variable, by a CUSTOM map scheme
          if ((l = changersRelativeCustom.length)) {
            while (l--) {
              current = changersRelativeCustom[l]

              if ((currentValue = current[1](args)) !== undefined) {
                that.setValue(current[0], currentValue)
              }
            }
          }

          // Change a COLOR, by a STANDARD map scheme
          if ((l = changersColorStandard.length)) {
            while (l--) {
              current = changersColorStandard[l]

              if (args[current.map] !== undefined) {
                changeColor(args[current.map], current)
              }
            }
          }

          // Execute a CUSTOM FUNCTION
          if ((l = changersCustom.length)) {
            while (l--) {
              changersCustom[l](args)
            }
          }

          // TODO: Set Color after adding;
        }
      },

      ready() {
        that.setValue = that.setValueNew
      },
    }
  }

  getRandomInt(i) {
    return Math.floor(Math.random() * i)
  }

  random(seed) {
    const denom = Math.pow(2, 31)
    const a = 11
    const b = 19
    const c = 8

    // x = Math.pow( seed, 3 ) + 88675123 || 88675123,
    let x = seed || Math.floor(Math.random() * 4294967296)
    let t = x ^ (x << a)

    const getFloat = () => {
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
}

export const helper = new Helper()
