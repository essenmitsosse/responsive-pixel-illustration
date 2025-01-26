import BBObj from './BBObj'

import type { Tool } from '@/renderengine/DrawingTools/Primitive'

// LOWER BODY  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class LowerBody extends BBObj {
  draw(_: unknown, front?: boolean, right?: boolean): ReadonlyArray<Tool> {
    return [
      {
        color: [front ? 150 : 100, right ? 150 : 100, front || right ? 0 : 0],
      },
    ]
  }
}

export default LowerBody
