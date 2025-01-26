import BBObj from './BBObj'
import { colorBlack, recordColor } from './colors'

import type { Rotation, StateTurnAround } from './types'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

class RotateInfo extends BBObj {
  declare result: Tool
  constructor(rotate: Rotation, state: StateTurnAround) {
    super(state)

    const s = { a: 5 }

    this.ll.push(s)

    this.result = {
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
}

export default RotateInfo
