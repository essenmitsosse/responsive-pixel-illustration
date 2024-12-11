import { BB } from './bb.js'

function betterBuilder(init) {
  const bb = new BB(init)

  return {
    renderList: new bb.Overview(init, 'Head'),
    linkList: bb.ll,
    background: bb.background || [160, 200, 200],
  }
}

export default betterBuilder
