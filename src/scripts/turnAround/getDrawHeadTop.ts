import { colorBlack, colorWhite } from './colors'

import type { StateTurnAround } from './types'
import type { ColorRgb } from '@/helper/typeColor'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

type ArgsHeadTop = {
  colorDark: ColorRgb
}

const getDrawHeadTop = (args: ArgsHeadTop, state: StateTurnAround) => {
  const eyeSYLeft = state.R(0.2, 0.9)
  const eyeSYRight = state.IF(0.5) ? eyeSYLeft : eyeSYLeft + state.R(-0.1, 0.1)

  return (
    _: unknown,
    front?: boolean,
    right?: boolean,
  ): ReadonlyArray<Tool | undefined> => [
    { color: front ? undefined : args.colorDark },

    // HAIR TOP
    {
      color: colorBlack,
      sY: { r: 0.1 },
    },

    // HAIR SIDE
    {
      color: colorBlack,
      sX: front ? { r: 0.2 } : undefined,
      sY: { r: 0.9 },
      z: 5,
    },

    // EYE
    front
      ? {
          color: colorWhite,
          sX: { r: 0.3, min: 1 },
          sY: {
            r: right ? eyeSYRight : eyeSYLeft,
            min: 1,
            max: { r: 1, a: -3 },
          },
          x: { r: 0.1, min: { a: 1, max: { r: 0.2 } } },
          y: { r: 0.1, min: 2 },
          fX: true,
          fY: true,
          z: 10,
          id: 'eye',
          list: [
            {},
            {
              color: colorBlack,
              sX: { r: 0.6 },
              sY: { r: 0.7 },
              fX: true,
              fY: true,
            },
          ],
        }
      : undefined,
  ]
}

export default getDrawHeadTop
