import Obj from './Obj'

class RoundRect extends Obj {
  list = [
    // { mY:1 },
    // { mX:1, height: {a:1} },
    // { mX:1, height: {a:1}, fromBottom:true },
    {
      minX: 3,
      minY: 4,
      list: [
        { name: 'Dot', clear: true },
        { name: 'Dot', fX: true, clear: true },
        { name: 'Dot', fY: true, clear: true },
        { name: 'Dot', fX: true, fY: true, clear: true },
      ],
    },
    {
      minX: 4,
      minY: 3,
      list: [
        { name: 'Dot', clear: true },
        { name: 'Dot', fX: true, clear: true },
        { name: 'Dot', fY: true, clear: true },
        { name: 'Dot', fX: true, fY: true, clear: true },
      ],
    },
    {},
  ]
}

export default RoundRect
