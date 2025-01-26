import BBObj from './BBObj'

import type { Move, Rotation, StateTurnAround } from './BBObj'
import type { MoveOut, What } from './types'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

type ArgsRotater = {
  baseSX: InputDynamicVariable
  drawer: {
    draw: (
      args: Omit<ArgsRotater, 'drawer'>,
      isFront: boolean,
      isRight: boolean,
    ) => ReadonlyArray<Tool | undefined>
  }
  fY?: boolean
  frontSX?: number
  id: string
  rotate: Rotation
  roundBottom?: boolean
  roundTop?: boolean
  sY?: InputDynamicVariable
  side?: Move
  tY?: boolean
  y?: InputDynamicVariable
  z?: number
  zAbs?: number
}

// Rotater
class Rotater extends BBObj {
  declare list: Array<Tool>
  result: Omit<What, 'id' | 'list'>
  declare sX: InputDynamicVariable
  declare sY: InputDynamicVariable
  declare x: MoveOut
  declare X: InputDynamicVariable
  declare y: InputDynamicVariable

  constructor(args: ArgsRotater, state: StateTurnAround) {
    super(state)

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
    list: ReadonlyArray<Tool | undefined>,
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
