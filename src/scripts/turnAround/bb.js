import { getRandom } from '@/helper/getRandom'

import { BBObj, RotateInfo, Rotater } from './object'
import { Head, HeadBottom, HeadTop, Neck, Nose } from './person-head'
import { LowerBody } from './person-lowerBody'
import { BodyMain, PersonMain } from './person-main'
import { Chest } from './person-upperBody'

export const BB = function (init) {
  const args = {}
  const ObjProto = BBObj.prototype
  const random = getRandom(init.id || Math.floor(Math.random() * 4294967296))

  for (const attr in init) {
    args[attr] = init[attr]
  }

  args.rotate = args.rotate * 1

  ObjProto.rotate = args.rotate

  ObjProto.basic = this

  ObjProto.basicArgs = args

  ObjProto.ll = this.ll = []

  ObjProto.IF = random.getIf

  ObjProto.GR = random.getRandom

  ObjProto.R = random.getRandomFloat
}

// OVERVIEW
BB.prototype.Overview = function (init) {
  const list = []
  const rotations = []
  const rows = init.rows || 2
  const vari = init.vari || 3
  const reps = Math.round(rows / vari / 0.55)
  const cols = reps === 0 ? vari : vari * reps

  let i = 0
  let j = 0
  let k = 0

  const inner = init.inner * 1 || 0.8

  this.counter = 1

  this.side = 'left'

  this.ll.push(
    (this.outerSX = { r: 1 / cols }),
    (this.outerSY = { r: 1 / rows, height: true }),
    (this.innerS = {
      r: inner,
      useSize: this.outerSX,
      max: { r: inner, useSize: this.outerSY },
      odd: true,
    }),
    // this.innerS = { r:2, a:-1, useSize:this.innerSHalf }
  )

  do {
    rotations.push(this.calcRotation((this.rotate || 0) + (180 / vari) * i))
  } while ((i += 1) < vari)

  do {
    j = 0

    do {
      i = 0

      this.entity = new this.basic[init.what || 'PersonMain']({})

      do {
        list.push({
          sX: this.outerSX,
          sY: this.outerSY,
          x: { r: i + k * vari, useSize: this.outerSX },
          y: { r: j, useSize: this.outerSY },
          fY: true,
          list: [
            {
              color: [(255 / rows) * j, (255 / vari) * i, 0],
              z: -Infinity,
            },
            {
              s: this.innerS,
              color: this.white,
              cX: true,
              fY: true,
              z: -Infinity,
            },
            this.entity.draw({
              sX: this.innerS,
              sY: this.innerS,
              rotate: rotations[i],
              nr: (this.counter += 1),
            }),
          ],
        })
      } while ((i += 1) < vari)
    } while ((j += 1) < rows)
  } while ((k += 1) < reps)

  list.push(new this.basic.RotateInfo(rotations[0]).result)

  return list
}

BB.prototype.Overview.prototype = new BBObj()

BB.prototype.PersonMain = PersonMain

BB.prototype.BodyMain = BodyMain

BB.prototype.Chest = Chest

BB.prototype.LowerBody = LowerBody

BB.prototype.Head = Head

BB.prototype.HeadTop = HeadTop

BB.prototype.HeadBottom = HeadBottom

BB.prototype.Nose = Nose

BB.prototype.Neck = Neck

BB.prototype.Rotater = Rotater

BB.prototype.RotateInfo = RotateInfo
