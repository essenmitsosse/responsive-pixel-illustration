import BBObj from './BBObj'
import BodyMain from './BodyMain'
import Chest from './Chest'
import Head from './Head'
import HeadBottom from './HeadBottom'
import HeadTop from './HeadTop'
import LowerBody from './LowerBody'
import Neck from './Neck'
import Nose from './Nose'
import PersonMain from './PersonMain'
import Rotater from './Rotator'
import RotateInfo from './RotatorInfo'

const recordObj = {
  PersonMain,
  BodyMain,
  Chest,
  LowerBody,
  Head,
  HeadTop,
  HeadBottom,
  Nose,
  Neck,
  Rotater,
  RotateInfo,
}

// OVERVIEW
class Overview extends BBObj {
  constructor(init) {
    super()

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

        this.entity = new recordObj[init.what || 'PersonMain']({})

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

    list.push(new RotateInfo(rotations[0]).result)

    return list
  }
}

export default Overview