import type { ColorRgb } from './typeColor'

export const darken = (darken: ColorRgb, strength: number) => {
  let l = darken.length

  const finalDarken: Array<number> = []

  strength /= 255

  while (l--) {
    finalDarken[l] = darken[l] * strength
  }

  return (color: ColorRgb, copy?: ColorRgb): ColorRgb => {
    let l = color.length

    const newColor: ColorRgb = copy || [0, 0, 0]

    while (l--) {
      newColor[l] = Math.floor(color[l] * finalDarken[l])
    }

    return newColor
  }
}

export const lighten = (lighten: ColorRgb, strength: number) => {
  let l = lighten.length

  const finaleLighten: ColorRgb = [0, 0, 0]

  while (l--) {
    finaleLighten[l] = lighten[l] * strength
  }

  return (color: ColorRgb): ColorRgb => {
    let l = color.length

    const newColor: ColorRgb = [0, 0, 0]

    let thisC: number

    while (l--) {
      newColor[l] = (thisC = color[l] + finaleLighten[l]) > 255 ? 255 : thisC
    }

    return newColor
  }
}

export const multiplyColor = (rgb: ColorRgb, factor: number): ColorRgb => [
  rgb[0] * factor,
  rgb[1] * factor,
  rgb[2] * factor,
]
