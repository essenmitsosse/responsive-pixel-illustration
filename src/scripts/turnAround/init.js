import { getRandom } from '@/helper/getRandom'
import { BBObj } from '@/scripts/turnAround/object'

import { Overview } from './Overview'

const turnAround = (init) => {
  const args = {
    ...init,
  }

  const random = getRandom(init.id || Math.floor(Math.random() * 4294967296))
  const ll = []

  args.rotate = args.rotate * 1

  BBObj.prototype.rotate = args.rotate

  BBObj.prototype.ll = ll

  BBObj.prototype.IF = random.getIf

  BBObj.prototype.GR = random.getRandom

  BBObj.prototype.R = random.getRandomFloat

  return {
    renderList: new Overview(init, 'Head'),
    linkList: ll,
    background: [160, 200, 200],
  }
}

export default turnAround
