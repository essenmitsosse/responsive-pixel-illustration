import getHoverChangerStandard from '@/helper/getHoverChangerStandard'
import { getRandom } from '@/helper/getRandom'

import buildColors from './buildColors'
import Color from './Color'
import Object from './Object'
import Person from './Person'
import Tree from './Tree'
import TreeFamily from './TreeFamily'

const Builder = function (init) {
  const initID = init.id ? init.id : Math.floor(Math.random() * 4294967296)
  const random = getRandom(initID)
  const linkList = []
  const hoverChangerStandard = getHoverChangerStandard()

  const pushLinkList = (obj) => {
    linkList.push(obj)

    return obj
  }

  this.IF = random.getIf

  this.GR = random.getRandom

  this.R = random.getRandomFloat

  this.colorInfo = {
    colors: 3,
    steps: 6,
  }

  Color.prototype.colors = buildColors(this.colorInfo, this.R)

  this.backgroundColor = new Color(this.IF() ? 1 : 0, 5)

  this.objectCount = 0

  Object.prototype.IF = this.IF

  Object.prototype.GR = this.GR

  Object.prototype.R = this.R

  Object.prototype.basic = this

  Object.prototype.pushLinkList = pushLinkList

  Object.prototype.hoverChangerStandard = hoverChangerStandard

  return {
    Person,
    Tree,
    TreeFamily,
    basic: this,
    linkList,
    pushLinkList,
    backgroundColor: this.backgroundColor,
    backgroundColorDark: this.backgroundColor.copy({
      nextColor: true,
      brSet: 0,
    }),
    Color,
    colorInfo: this.colorInfo,
    colorScheme: this.colorScheme,
    hoverChangerStandard,
  }
}

export default Builder
