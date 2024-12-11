import { helper } from '@/renderengine/helper'

import { Actor, Comic, Ground, Panel } from './comic.js'
import { Object } from './object.js'
import { Arm, Shield, ShoulderPad, Sword, Tool } from './person-arm.js'
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
} from './person-head.js'
import { Belt, Leg, LowerBody, Skirt } from './person-lowerBody.js'
import { BasicBody, Logo, Person } from './person-main.js'
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
} from './person-upperBody.js'
import { Forrest, Tree, TreeFamily } from './tree.js'

export const Builder = function (init) {
  const initID = init.id ? init.id : Math.floor(Math.random() * 4294967296)
  const random = helper.random(initID)
  const joinVariableList = {}

  this.help = helper

  this.getSmallerDim = helper.getSmallerDim

  this.getBiggerDim = helper.getBiggerDim

  this.mult = helper.mult

  this.sub = helper.sub

  this.margin = helper.margin

  this.IF = random.getIf

  this.GR = random.getRandom

  this.R = random.getRandomFloat

  this.init = init

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

  this.Object.prototype.mult = this.mult

  this.Object.prototype.sub = this.sub

  this.Object.prototype.margin = this.margin

  this.Object.prototype.colorGen = this.colorGen

  this.Object.prototype.Color = this.Color

  this.Object.prototype.init = this.init

  this.Object.prototype.vL = joinVariableList

  this.Object.prototype.basic = this

  return {
    Person: this.Person,
    Tree: this.Tree,
    basic: this,
    joinVariableList,
    backgroundColor: this.backgroundColor,
    backgroundColorDark: this.backgroundColor.copy({
      nextColor: true,
      brSet: 0,
    }),
    Color: this.Color,
    colorInfo: this.colorInfo,
    colorScheme: this.colorScheme,
  }
}

const buildColors = function (info) {
  const that = this

  let i = info.colors

  const colors = []
  const createColor = function () {
    const r = that.R(0, 200)
    const g = that.R(0, 200)
    const b = that.R(0, 200)
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

Builder.prototype.getDark = function (darkness) {
  Color.prototype.get = function () {
    let br = this.dontChange ? this.br : this.br + darkness

    if (br < 0) {
      br = 0
    } else if (br > 5) {
      br = 5
    }

    return (this.finalColor = this.colors[this.nr][br] || [200, 0, 155])
  }
}

Builder.prototype.getNormalColor = function () {
  Color.prototype.get = Color.prototype.getNormal
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

Builder.prototype.Actor = Actor

Builder.prototype.Comic = Comic

Builder.prototype.Ground = Ground

Builder.prototype.Panel = Panel
