import type { ColorRgb } from '@/helper/typeColor'
import type { DoHover } from '@/helper/typeHover'

const changeColor = (
  value: number,
  map: { color: ColorRgb; max: ColorRgb; min: ColorRgb },
): void => {
  const [maxR, maxG, maxB] = map.max
  const [minR, minG, minB] = map.min
  const valueNeg = 1 - value

  map.color[0] = minR * valueNeg + maxR * value

  map.color[1] = minG * valueNeg + maxG * value

  map.color[2] = minB * valueNeg + maxB * value
}
const getHoverChangerColor = (): {
  doHover: DoHover
  push: (args: {
    color: ColorRgb
    map: string
    max: ColorRgb
    min: ColorRgb
  }) => void
} => {
  const listColorStandard: Array<{
    color: ColorRgb
    map: string
    max: ColorRgb
    min: ColorRgb
  }> = []

  return {
    push: listColorStandard.push.bind(listColorStandard),

    doHover: (args: Record<string, number>): void => {
      listColorStandard.forEach((current) => {
        if (args[current.map] === undefined) {
          return
        }

        changeColor(args[current.map], current)
      })
    },
  }
}

export default getHoverChangerColor
