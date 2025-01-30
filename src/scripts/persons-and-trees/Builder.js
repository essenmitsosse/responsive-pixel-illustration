import getHoverChangerStandard from '@/helper/getHoverChangerStandard'
import { getRandom } from '@/helper/getRandom'

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

function buildColors(info, rInt) {
  let i = info.colors

  const colors = []

  const createColor = function () {
    const r = rInt(0, 200)
    const g = rInt(0, 200)
    const b = rInt(0, 200)

    const br = Math.sqrt(
      0.241 * Math.pow(r, 2) + 0.691 * Math.pow(g, 2) + 0.068 * Math.pow(b, 2),
    )

    const rgb = [r, g, b]
    const maxBr = 255 / info.steps
    const startPos = Math.floor(br / maxBr)
    const colorRange = []

    let i
    let fak

    colorRange[startPos] = rgb

    // DARKER COLORS
    i = startPos

    fak = 1 / (i + 1)

    while (i--) {
      colorRange[i] = [
        r * fak * (i + 1) + 0 * (1 - fak * (i + 1)),
        g * fak * (i + 1) + 0 * (1 - fak * (i + 1)),
        b * fak * (i + 1) + 0 * (1 - fak * (i + 1)),
      ]
    }

    // LIGHTER COLORS
    i = info.steps - startPos - 1

    fak = 1 / (i + 1)

    while (i--) {
      colorRange[startPos + i + 1] = [
        r * (1 - fak * (i + 1)) + 255 * fak * (i + 1),
        g * (1 - fak * (i + 1)) + 255 * fak * (i + 1),
        b * (1 - fak * (i + 1)) + 255 * fak * (i + 1),
      ]
    }

    colors.push(colorRange)
  }

  while (i--) {
    createColor()
  }

  return colors
}

export default Builder
