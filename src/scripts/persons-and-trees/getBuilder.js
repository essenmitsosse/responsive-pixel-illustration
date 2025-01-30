import getHoverChangerStandard from '@/helper/getHoverChangerStandard'
import { getRandom } from '@/helper/getRandom'

import buildColors from './buildColors'
import Color from './Color'
import Object from './Object'
import Person from './Person'
import Tree from './Tree'
import TreeFamily from './TreeFamily'

const getBuilder = (init) => {
  const initID = init.id ? init.id : Math.floor(Math.random() * 4294967296)
  const random = getRandom(initID)
  const linkList = []
  const hoverChangerStandard = getHoverChangerStandard()

  const pushLinkList = (obj) => {
    linkList.push(obj)

    return obj
  }

  const IF = random.getIf
  const GR = random.getRandom
  const R = random.getRandomFloat

  const colorInfo = {
    colors: 3,
    steps: 6,
  }

  Color.prototype.colors = buildColors(colorInfo, R)

  const backgroundColor = new Color(IF() ? 1 : 0, 5)

  Object.prototype.IF = IF

  Object.prototype.GR = GR

  Object.prototype.R = R

  Object.prototype.basic = { objectCount: 0 }

  Object.prototype.pushLinkList = pushLinkList

  Object.prototype.hoverChangerStandard = hoverChangerStandard

  return {
    IF,
    GR,
    R,
    Person,
    Tree,
    TreeFamily,
    linkList,
    pushLinkList,
    backgroundColor,
    backgroundColorDark: backgroundColor.copy({
      nextColor: true,
      brSet: 0,
    }),
    Color,
    colorInfo,
    hoverChangerStandard,
  }
}

export default getBuilder
