import BBObj from './BBObj'
import { colorWhite } from './colors'
import PersonMain from './PersonMain'
import RotateInfo from './RotatorInfo'

import type { Rotate, Rotation, StateTurnAround } from './BBObj'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

const getRotation = (rotate: number): Rotate => {
  if (rotate > 180) {
    rotate -= 360
  } else if (rotate < -180) {
    rotate += 360
  }

  return {
    real: (rotate = rotate / 90),
    abs: 1 - Math.abs(rotate),
  }
}

const calcRotation = (rotate: number): Rotation => {
  let realRotation = rotate - 45

  if (realRotation > 180) {
    realRotation -= 360
  } else if (realRotation < -180) {
    realRotation += 360
  }

  if (rotate > 360) {
    rotate -= 360
  } else if (rotate < -360) {
    rotate += 360
  }

  const rad = (realRotation * Math.PI) / 180
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  const front = Math.abs(Math.abs(rotate - 180) - 90) / 90

  return {
    FL: getRotation(realRotation),
    FR: getRotation(realRotation + 90),
    BL: getRotation(realRotation - 90),
    BR: getRotation(realRotation + 180),
    position: (sin + cos) / (Math.sin(Math.PI * 0.25) * 2),
    sin,
    cos,
    rotate,
    turnedAway: rotate > 90 && rotate < 270 ? -1 : 1,
    front,
    side: 1 - front,
  }
}

// OVERVIEW
class Overview extends BBObj {
  declare counter: number
  declare side: string
  declare outerSX: InputDynamicVariable
  declare outerSY: InputDynamicVariable
  declare innerS: InputDynamicVariable
  declare entity: PersonMain
  declare result: ReadonlyArray<Tool>
  // eslint-disable-next-line constructor-super -- false negative
  constructor(
    init: {
      inner?: number
      rotate?: number
      rows?: number
      vari?: number
    },
    state: StateTurnAround,
  ) {
    super(state)

    const list: Array<Tool> = []
    const rotations: Array<Rotation> = []
    const rows = init.rows || 2
    const vari = init.vari || 3
    const reps = Math.round(rows / vari / 0.55)
    const cols = reps === 0 ? vari : vari * reps

    let i = 0
    let j = 0
    let k = 0

    const inner = init.inner ? init.inner : 0.8

    this.counter = 1

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
      rotations.push(calcRotation((init.rotate || 0) + (180 / vari) * i))
    } while ((i += 1) < vari)

    do {
      j = 0

      do {
        i = 0

        this.entity = new PersonMain(state)

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
                color: colorWhite,
                cX: true,
                fY: true,
                z: -Infinity,
              },
              this.entity.draw({
                sX: this.innerS,
                sY: this.innerS,
                rotate: rotations[i]!,
              }),
            ],
          })
        } while ((i += 1) < vari)
      } while ((j += 1) < rows)
    } while ((k += 1) < reps)

    list.push(new RotateInfo(rotations[0]!, state).result)

    this.result = list
  }
}

export default Overview
