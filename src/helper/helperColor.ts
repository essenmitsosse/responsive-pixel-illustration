import type { ColorRgb } from './typeColor'

export const darken = (darken: ColorRgb, strength: number) => {
  strength /= 255

  const finalDarken: ColorRgb = [
    darken[0] * strength,
    darken[1] * strength,
    darken[2] * strength,
  ]

  return (color: ColorRgb, copy: ColorRgb = [0, 0, 0]): ColorRgb => {
    copy[0] = Math.floor(color[0] * finalDarken[0])

    copy[1] = Math.floor(color[1] * finalDarken[1])

    copy[2] = Math.floor(color[2] * finalDarken[1])

    return copy
  }
}

export const lighten = (lighten: ColorRgb, strength: number) => {
  const finaleLighten: ColorRgb = [
    lighten[0] * strength,
    lighten[1] * strength,
    lighten[2] * strength,
  ]

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
