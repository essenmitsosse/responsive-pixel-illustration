import { getRandom } from '@/helper/getRandom'

import Overview from './Overview'

const turnAround = (init) => {
  const random = getRandom(init.id || Math.floor(Math.random() * 4294967296))
  const ll = []

  const state = {
    ll,
    IF: random.getIf,
    GR: random.getRandom,
    R: random.getRandomFloat,
  }

  return {
    renderList: new Overview(init, state).result,
    linkList: ll,
    background: [160, 200, 200],
  }
}

export default turnAround
