import type { Tool } from '@/renderengine/DrawingTools/Primitive'

const drawLowerBody = (
  _: unknown,
  front?: boolean,
  right?: boolean,
): ReadonlyArray<Tool> => [
  {
    color: [front ? 150 : 100, right ? 150 : 100, front || right ? 0 : 0],
  },
]

export default drawLowerBody
