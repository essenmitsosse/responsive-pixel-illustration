import BBObj from './BBObj'

import type { MoveOut, What } from './types'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

type ArgsRotater = {
  baseSX: InputDynamicVariable
  drawer: {
    draw: (args: ArgsRotater, a: boolean, b: boolean) => ReadonlyArray<Tool>
  }
  fY: boolean
  frontSX?: number
  id: number
  rotate: {
    BL: { abs: number; real: number }
    BR: { abs: number; real: number }
    FL: { abs: number; real: number }
    FR: { abs: number; real: number }
    front: number
    position: number
    turnedAway: number
  }
  roundBottom: boolean
  roundTop: boolean
  sY?: InputDynamicVariable
  side?: {
    sX: InputDynamicVariable
  }
  tY: InputDynamicVariable
  y: InputDynamicVariable
  z?: number
  zAbs?: number
}

// Rotater
class Rotater extends BBObj {
  declare list: Array<Tool>
  result: Omit<What, 'cX' | 'fY' | 'id' | 'list' | 'tY'>
  declare sX: InputDynamicVariable
  declare sY: InputDynamicVariable
  declare x: MoveOut
  declare X: InputDynamicVariable
  declare y: InputDynamicVariable

  constructor(args: ArgsRotater) {
    super()

    if (this.ll === undefined) {
      throw new Error('Unexpected error: ll is undefined')
    }

    this.list = []

    this.ll.push(
      (this.sX = {
        r:
          1 +
          // Base Size (change for Front)
          (args.frontSX !== undefined
            ? args.rotate.front * (args.frontSX - 1)
            : 0),
        // + ( args.sideSX !== undefined ? rotate.side * ( args.sideSX - 1 ) : 0 ), 	// change for Side
        useSize: args.baseSX,
        odd: true,
      }),
    )

    if (args.side) {
      if (!args.side.sX) {
        args.side.sX = this.sX
      }

      this.x = this.moveOut(args.side, args.rotate)
    }

    if (args.sY) {
      this.ll.push((this.sY = args.sY))
    }

    if (args.y) {
      this.ll.push((this.y = args.y))
    }

    if (args.roundTop || args.roundBottom) {
      this.list.push({
        minX: 5,
        minY: 5,
        list: [
          args.roundTop && { name: 'Dot', clear: true },
          args.roundTop && { name: 'Dot', fX: true, clear: true },
          args.roundBottom && { name: 'Dot', fY: true, clear: true },
          args.roundBottom && {
            name: 'Dot',
            fX: true,
            fY: true,
            clear: true,
          },
        ],
      })
    }

    this.pusher(args.rotate.FL, args.drawer.draw(args, true, false))

    this.pusher(args.rotate.FR, args.drawer.draw(args, true, true), true)

    this.pusher(args.rotate.BR, args.drawer.draw(args, false, true))

    this.pusher(args.rotate.BL, args.drawer.draw(args, false, false), true)

    this.result = {
      get: {
        sX: this.sX,
        sY: this.sY,
        fY: args.fY,
        tY: args.tY,
        x: this.x,
        y: args.y,
        id: args.id,
        cX: true,
        z:
          (args.z ? args.z * args.rotate.turnedAway : 0) +
          (args.zAbs ? args.zAbs : 0),
        list: this.list,
      },
      rotate: args.rotate,
      sX: this.sX,
      sY: this.sY,
      x: this.X,
      y: this.y,
    }
  }

  pusher(
    rotate: { abs: number; real: number },
    list: ReadonlyArray<Tool>,
    reflect?: boolean,
  ): void {
    const front = rotate.abs > 0

    this.list.push({
      sX: { r: front ? rotate.abs : -rotate.abs },
      fX: rotate.real > 0,
      z: front ? 50 : -50,
      list,
      rX: reflect,
    })
  }
}

export default Rotater
