import { colorBlack, recordColor } from './colors'

import type { Rotation } from './getOverview'
import type { StateTurnAround } from './types'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

const drawRotateInfo = (rotate: Rotation, state: StateTurnAround): Tool => {
  const s: InputDynamicVariable = { a: 5 }

  state.ll.push(s)

  return {
    color: colorBlack,
    s: [s, s, 1],
    x: { r: 0.02 },
    y: { r: 0.02 },
    rX: true,
    list: [
      { sX: 1, cX: true },
      { sY: 1, cY: true },
      {
        color: [150, 150, 150],
        c: true,
        s,
        list: [
          {},
          { sX: 1, color: recordColor.c1 },
          { sY: 1, fY: true, color: recordColor.c1D },
        ],
      },
      {
        s: 1,
        c: true,
        list: [
          {
            color: recordColor.c2D,
            points: [
              {},
              {
                x: { useSize: s, r: rotate.sin },
                y: { useSize: s, r: rotate.cos },
              },
            ],
          },
        ],
      },
    ],
  }
}

export default drawRotateInfo
