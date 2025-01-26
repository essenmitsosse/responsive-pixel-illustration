import type { ColorRgb } from '@/helper/typeColor'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

class Nose {
  colorDark: ColorRgb
  constructor(args: { colorDark: ColorRgb }) {
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
