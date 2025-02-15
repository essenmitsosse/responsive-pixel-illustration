import getHoverChangerStandard from '@/helper/getHoverChangerStandard'
import { getRandom } from '@/helper/getRandom'

import { Object } from './object'
import { Arm, Shield, ShoulderPad, Sword, Tool } from './person-arm'
import {
  Beard,
  Eye,
  Hair,
  Hat,
  Head,
  HeadBand,
  Helm,
  Horns,
  Mouth,
} from './person-head'
import { Belt, Leg, LowerBody, Skirt } from './person-lowerBody'
import { BasicBody, Logo, Person } from './person-main'
import {
  Buttons,
  Cape,
  Cleavage,
  Collar,
  Nipples,
  Strap,
  Stripes,
  Suspenders,
  UpperBody,
} from './person-upperBody'
import { Forrest, Tree, TreeFamily } from './tree'

export const Builder = function (init) {
  const initID = init.id ? init.id : Math.floor(Math.random() * 4294967296)
  const random = getRandom(initID)
  const linkList = []
  const hoverChangerStandard = getHoverChangerStandard()

  const pushLinkList = function (obj) {
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

const buildColors = function (info) {
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

const Color = function (nr, br) {
  this.nr = nr

  this.br = br
}

Color.prototype.copy = function (args) {
  args = args || {}

  const color = new this.Color(
    args.nr !== undefined ? args.nr : this.nr,
    this.br,
  )

  if (args.nextColor) {
    color.nextColor()
  } else if (args.prevColor) {
    color.prevColor()
  }

  if (args.brSet !== undefined) {
    color.brightnessSet(args.brSet)
  } else if (args.brAdd) {
    color.brightnessAdd(args.brAdd)
  } else if (args.brContrast) {
    color.brightnessContrast(args.brContrast, args.min, args.max)
  }

  if (args.min && color.br < args.min) {
    color.br = args.min
  }

  if (args.max && color.br > args.max) {
    color.br = args.max
  }

  if (args.dontChange) {
    color.dontChange = true
  }

  return color
}

Color.prototype.nextColor = function () {
  this.nr += 1

  if (this.nr > 2) {
    this.nr = 0
  }
}

Color.prototype.prevColor = function () {
  this.nr -= 1

  if (this.nr < 0) {
    this.nr = 2
  }
}

Color.prototype.brightnessAdd = function (add) {
  this.br += add

  if (this.br < 0) {
    this.br = 0
  } else if (this.br > 5) {
    this.br = 5
  }
}

Color.prototype.brightnessSet = function (set) {
  this.br = set

  if (this.br < 0) {
    this.br = 0
  } else if (this.br > 5) {
    this.br = 5
  }
}

Color.prototype.brightnessContrast = function (add, min, max) {
  min = min || 0

  max = max || 5

  if (add < 0) {
    this.br += this.br + add < min ? -add : add
  } else {
    this.br += this.br + add > max ? -add : add
  }

  if (this.br < min) {
    this.br = min
  } else if (this.br > max) {
    this.br = max
  }
}

Color.prototype.getNormal = function () {
  if (!this.finalColor) {
    return (this.finalColor = this.colors[this.nr][this.br] || [200, 0, 155])
  }

  return this.finalColor
}

Color.prototype.get = Color.prototype.getNormal

Color.prototype.getBr = function () {
  return this.br
}

Builder.prototype.Color = Color

Builder.prototype.buildColors = buildColors

Builder.prototype.Object = Object

Builder.prototype.Person = Person

Builder.prototype.BasicBody = BasicBody

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

Builder.prototype.LowerBody = LowerBody

Builder.prototype.Skirt = Skirt

Builder.prototype.Buttons = Buttons

Builder.prototype.Cape = Cape

Builder.prototype.Cleavage = Cleavage

Builder.prototype.Collar = Collar

Builder.prototype.Nipples = Nipples

Builder.prototype.Strap = Strap

Builder.prototype.Stripes = Stripes

Builder.prototype.Suspenders = Suspenders

Builder.prototype.UpperBody = UpperBody
