import BBObj from './BBObj'

import type { StateTurnAround } from './BBObj'
import type { ColorRgb } from '@/helper/typeColor'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

class Nose extends BBObj {
  colorDark: ColorRgb
  constructor(args: { colorDark: ColorRgb }, state: StateTurnAround) {
    super(state)

    this.colorDark = args.colorDark
  }

  draw(_: unknown, front: boolean): ReadonlyArray<Tool> {
    return [
      {
        color: this.colorDark,
        sY: !front ? { r: 1, a: 1 } : undefined,
        fY: true,
      },
    ]
  }
}

export default Nose
