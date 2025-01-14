import { BB, Overview } from './bb'

const turnAround = (init) => {
  const bb = new BB(init)

  return {
    renderList: new Overview(init, 'Head'),
    linkList: bb.ll,
    background: bb.background || [160, 200, 200],
  }
}

export default turnAround
