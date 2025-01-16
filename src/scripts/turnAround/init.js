import { getRandom } from '@/helper/getRandom'

import BBObj from './BBObj'
import Overview from './Overview'

const turnAround = (init) => {
  const random = getRandom(init.id || Math.floor(Math.random() * 4294967296))
  const ll = []

  BBObj.prototype.ll = ll

  BBObj.prototype.IF = random.getIf

  BBObj.prototype.GR = random.getRandom

  BBObj.prototype.R = random.getRandomFloat

  return {
    renderList: new Overview(init),
    linkList: ll,
    background: [160, 200, 200],
  }
}

export default turnAround
