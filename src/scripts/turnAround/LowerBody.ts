import type { Tool } from '@/renderengine/DrawingTools/Primitive'

// LOWER BODY  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class LowerBody {
  draw(_: unknown, front?: boolean, right?: boolean): ReadonlyArray<Tool> {
    return [
      {
        color: [front ? 150 : 100, right ? 150 : 100, front || right ? 0 : 0],
      },
    ]
  }
}

export default LowerBody
