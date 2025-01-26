import BBObj from './BBObj'

import type { Rotation, StateTurnAround } from './BBObj'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

class RotateInfo extends BBObj {
  declare result: Tool
  constructor(rotate: Rotation, state: StateTurnAround) {
    super(state)

    const s = { a: 5 }

    this.ll.push(s)

    this.result = {
      color: this.black,
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
            { sX: 1, color: this.c1 },
            { sY: 1, fY: true, color: this.c1D },
          ],
        },
        {
          s: 1,
          c: true,
          list: [
            {
              color: this.c2D,
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
