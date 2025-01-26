import BBObj from './BBObj'
import { colorBlack } from './colors'

import type { StateTurnAround } from './BBObj'
import type { ColorRgb } from '@/helper/typeColor'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

class HeadBottom extends BBObj {
  declare colorDark: ColorRgb

  constructor(args: { colorDark: ColorRgb }, state: StateTurnAround) {
    super(state)

    this.colorDark = args.colorDark
  }

  draw(_: unknown, front?: boolean): ReadonlyArray<Tool | undefined> {
    return [
      { color: front ? undefined : this.colorDark },

      // MOUTH
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

      // // BEARD
      // front && {
      // 	fY:true,
      // 	tY:true,
      // 	y:1,
      // 	z:100,
      // 	id:"beard",
      // 	color:this.black,
      // },
    ]
  }
}

export default HeadBottom
