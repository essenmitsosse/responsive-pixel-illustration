import type { ColorRgb } from '@/helper/typeColor'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

class Neck {
  declare colorDark: ColorRgb
  constructor(args: { colorDark: ColorRgb }) {
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
