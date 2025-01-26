import { getRandom } from '@/helper/getRandom'

import Overview from './Overview'

import type { StateTurnAround } from './BBObj'
import type { ImageFunction, InputDynamicLink } from '@/scripts/listImage'

const turnAround: ImageFunction = (init: {
  id?: number
  inner?: number
  rotate?: number
  rows?: number
  vari?: number
}) => {
  const random = getRandom(init.id || Math.floor(Math.random() * 4294967296))
  const ll: Array<InputDynamicLink> = []

  const state: StateTurnAround = {
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
