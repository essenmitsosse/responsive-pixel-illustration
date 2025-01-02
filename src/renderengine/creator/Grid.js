import Obj from './Obj'

class Grid extends Obj {
  getName = 'Grid'

  list = [
    {
      stripes: { gap: 1 },
      list: [{ stripes: { gap: 1, horizontal: true } }],
    },
  ]
}

export default Grid
