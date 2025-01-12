import Obj from './Obj'

import type { Tool } from './Primitive'

class Grid extends Obj {
  list: ReadonlyArray<Tool> = [
    {
      stripes: { gap: 1 },
      list: [{ stripes: { gap: 1, horizontal: true } }],
    },
  ]
}

export default Grid
