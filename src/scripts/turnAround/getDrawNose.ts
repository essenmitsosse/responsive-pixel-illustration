import type { ColorRgb } from '@/helper/typeColor'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

const getDrawNose =
  (args: { colorDark: ColorRgb }) =>
  (_: unknown, front: boolean): ReadonlyArray<Tool> => [
    {
      color: args.colorDark,
      sY: !front ? { r: 1, a: 1 } : undefined,
      fY: true,
    },
  ]

export default getDrawNose
