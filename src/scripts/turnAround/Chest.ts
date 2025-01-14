import BBObj from './BBObj'

import type { Tool } from '@/renderengine/DrawingTools/Primitive'

class Chest extends BBObj {
  draw(_: unknown, front?: boolean, right?: boolean): ReadonlyArray<Tool> {
    return [
      {
        color: [front ? 200 : 150, right ? 200 : 150, front || right ? 0 : 0],
      },
    ]
  }
}

export default Chest
