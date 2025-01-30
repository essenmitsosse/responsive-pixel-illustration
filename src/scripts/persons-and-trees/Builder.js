import getHoverChangerStandard from '@/helper/getHoverChangerStandard'
import { getRandom } from '@/helper/getRandom'

import Arm from './Arm'
import Beard from './Beard'
import Belt from './Belt'
import BodyBasic from './BodyBasic'
import BodyLower from './BodyLower'
import BodyUpper from './BodyUpper'
import Buttons from './Buttons'
import Cape from './Cape'
import Cleavage from './Cleavage'
import Collar from './Collar'
import Color from './Color'
import Eye from './Eye'
import Forrest from './Forrest'
import Hair from './Hair'
import Hat from './Hat'
import Head from './Head'
import HeadBand from './HeadBand'
import Helm from './Helm'
import Horns from './Horn'
import Leg from './Leg'
import Logo from './Logo'
import Mouth from './Mouth'
import Nipples from './Nipples'
import Object from './Object'
import Person from './Person'
import Shield from './Shield'
import ShoulderPad from './ShoulderPad'
import Skirt from './Skirt'
import Strap from './Strap'
import Stripes from './Stripes'
import Suspenders from './Suspenders'
import Sword from './Sword'
import Tool from './Tool'
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

  this.Color.prototype.colors = this.buildColors(this.colorInfo)

  this.Color.prototype.Color = this.Color

  this.backgroundColor = new this.Color(this.IF() ? 1 : 0, 5)

  this.backgroundShadowColor = this.backgroundColor.copy({ brAdd: -1 })

  this.objectCount = 0

  this.Object.prototype.IF = this.IF

  this.Object.prototype.GR = this.GR

  this.Object.prototype.R = this.R

  this.Object.prototype.colorGen = this.colorGen

  this.Object.prototype.Color = this.Color

  this.Object.prototype.basic = this

  this.Object.prototype.pushLinkList = pushLinkList

  this.Object.prototype.hoverChangerStandard = hoverChangerStandard

  return {
    Person: this.Person,
    Tree: this.Tree,
    TreeFamily: this.TreeFamily,
    basic: this,
    linkList,
    pushLinkList,
    backgroundColor: this.backgroundColor,
    backgroundColorDark: this.backgroundColor.copy({
      nextColor: true,
      brSet: 0,
    }),
    Color: this.Color,
    colorInfo: this.colorInfo,
    colorScheme: this.colorScheme,
    hoverChangerStandard,
  }
}

function buildColors(info) {
  const rInt = this.R

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

Builder.prototype.Color = Color

Builder.prototype.buildColors = buildColors

Builder.prototype.Object = Object

Builder.prototype.Person = Person

Builder.prototype.BasicBody = BodyBasic

Builder.prototype.Logo = Logo

Builder.prototype.TreeFamily = TreeFamily

Builder.prototype.Forrest = Forrest

Builder.prototype.Tree = Tree

Builder.prototype.Arm = Arm

Builder.prototype.Shield = Shield

Builder.prototype.ShoulderPad = ShoulderPad

Builder.prototype.Sword = Sword

Builder.prototype.Tool = Tool

Builder.prototype.Beard = Beard

Builder.prototype.Eye = Eye

Builder.prototype.Hair = Hair

Builder.prototype.Hat = Hat

Builder.prototype.Head = Head

Builder.prototype.HeadBand = HeadBand

Builder.prototype.Helm = Helm

Builder.prototype.Horns = Horns

Builder.prototype.Mouth = Mouth

Builder.prototype.Belt = Belt

Builder.prototype.Leg = Leg

Builder.prototype.LowerBody = BodyLower

Builder.prototype.Skirt = Skirt

Builder.prototype.Buttons = Buttons

Builder.prototype.Cape = Cape

Builder.prototype.Cleavage = Cleavage

Builder.prototype.Collar = Collar

Builder.prototype.Nipples = Nipples

Builder.prototype.Strap = Strap

Builder.prototype.Stripes = Stripes

Builder.prototype.Suspenders = Suspenders

Builder.prototype.UpperBody = BodyUpper

export default Builder
