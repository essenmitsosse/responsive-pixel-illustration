import type { Tool } from '@/renderengine/DrawingTools/Primitive'

const drawChest = (
  _: unknown,
  front?: boolean,
  right?: boolean,
): ReadonlyArray<Tool> => [
  {
    color: [front ? 200 : 150, right ? 200 : 150, front || right ? 0 : 0],
  },
]

export default drawChest
