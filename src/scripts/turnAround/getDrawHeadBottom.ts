import { colorBlack } from './colors'

import type { ColorRgb } from '@/helper/typeColor'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

const getDrawHeadBottom =
  (args: { colorDark: ColorRgb }) =>
  (_: unknown, front?: boolean): ReadonlyArray<Tool | undefined> => [
    { color: front ? undefined : args.colorDark },

    front
      ? {
          color: colorBlack,
          sX: { r: 0.6 },
          y: { r: 0.2, min: 1 },
          fY: true,
          fX: true,
          sY: 1,
        }
      : undefined,
  ]

export default getDrawHeadBottom
