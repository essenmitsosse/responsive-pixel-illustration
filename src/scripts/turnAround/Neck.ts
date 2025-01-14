import BBObj from './BBObj'

import type { StateTurnAround } from './BBObj'
import type { ColorRgb } from '@/helper/typeColor'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

class Neck extends BBObj {
  declare colorDark: ColorRgb
  constructor(args: { colorDark: ColorRgb }, state: StateTurnAround) {
    super(state)

    this.colorDark = args.colorDark
  }

  draw(): ReadonlyArray<Tool> {
    return [
      {
        color: this.colorDark,
      },
    ]
  }
}

export default Neck
