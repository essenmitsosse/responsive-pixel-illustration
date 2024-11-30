import { helper } from '../../renderengine/helper.js'
import { BBObj, Rotater, RotateInfo } from './object.js'
import { PersonMain, BodyMain } from './person-main.js'
import { Chest } from './person-upperBody.js'
import { LowerBody } from './person-lowerBody.js'
import { Head, HeadTop, HeadBottom, Nose, Neck } from './person-head.js'

export const BB = function (init) {
  var args = {},
    ObjProto = BB.prototype.Obj.prototype,
    random = helper.random(init.id || Math.floor(Math.random() * 4294967296))

  for (var attr in init) {
    args[attr] = init[attr]
  }

  args.rotate = args.rotate * 1

  ObjProto.rotate = args.rotate

  ObjProto.basic = this
  ObjProto.basicArgs = args
  ObjProto.ll = this.ll = []

  ObjProto.white = [200, 200, 200]
  ObjProto.black = [20, 20, 20]

  ObjProto.c1 = [200, 20, 20]
  ObjProto.c2 = [20, 200, 20]
  ObjProto.c3 = [20, 0, 200]
  ObjProto.c4 = [200, 200, 20]
  ObjProto.c5 = [20, 200, 200]
  ObjProto.c6 = [200, 20, 200]

  ObjProto.c1D = [150, 20, 20]
  ObjProto.c2D = [20, 150, 20]
  ObjProto.c3D = [20, 0, 150]
  ObjProto.c4D = [150, 150, 20]
  ObjProto.c5D = [20, 150, 150]
  ObjProto.c6D = [150, 20, 150]

  ObjProto.IF = random.getIf
  ObjProto.GR = random.getRandom
  ObjProto.R = random.getRandomFloat
}

BB.prototype.Obj = BBObj

// OVERVIEW
BB.prototype.Overview = function (init) {
  var list = [],
    rotations = [],
    rows = init.rows || 2,
    vari = init.vari || 3,
    reps = Math.round(rows / vari / 0.55),
    cols = reps === 0 ? vari : vari * reps,
    i = 0,
    j = 0,
    k = 0,
    inner = init.inner * 1 || 0.8

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
    rotations.push(new this.calcRotation((this.rotate || 0) + (180 / vari) * i))
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

  list.push(new this.basic.RotateInfo(rotations[0]))

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
