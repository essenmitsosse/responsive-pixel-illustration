import Obj from './Obj'

class Grid extends Obj {
  list = [
    {
      stripes: { gap: 1 },
      list: [{ stripes: { gap: 1, horizontal: true } }],
    },
  ]
}

export default Grid
