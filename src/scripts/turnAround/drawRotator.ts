import { moveOut } from './moveOut'

import type { Move, MoveOut, Rotation, StateTurnAround, What } from './types'
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

const getTool = (
  rotate: { abs: number; real: number },
  list: ReadonlyArray<Tool | undefined>,
  reflect?: boolean,
): Tool => {
  const front = rotate.abs > 0

  return {
    sX: { r: front ? rotate.abs : -rotate.abs },
    fX: rotate.real > 0,
    z: front ? 50 : -50,
    list,
    rX: reflect,
  }
}

const drawRotator = (args: ArgsRotater, state: StateTurnAround): What => {
  const list: Array<Tool> = []

  const sX: InputDynamicVariable = {
    r:
      1 +
      // Base Size (change for Front)
      (args.frontSX !== undefined ? args.rotate.front * (args.frontSX - 1) : 0),
    // + ( args.sideSX !== undefined ? rotate.side * ( args.sideSX - 1 ) : 0 ), 	// change for Side
    useSize: args.baseSX,
    odd: true,
  }

  state.ll.push(sX)

  let x: MoveOut | undefined = undefined

  if (args.side) {
    if (!args.side.sX) {
      args.side.sX = sX
    }

    x = moveOut(args.side, args.rotate, state.ll)
  }

  if (args.sY) {
    state.ll.push(args.sY)
  }

  if (args.y) {
    state.ll.push(args.y)
  }

  if (args.roundTop || args.roundBottom) {
    list.push({
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

  list.push(getTool(args.rotate.FL, args.drawer.draw(args, true, false)))

  list.push(getTool(args.rotate.FR, args.drawer.draw(args, true, true), true))

  list.push(getTool(args.rotate.BR, args.drawer.draw(args, false, true)))

  list.push(getTool(args.rotate.BL, args.drawer.draw(args, false, false), true))

  return {
    get: {
      sX,
      sY: args.sY,
      fY: args.fY,
      tY: args.tY,
      x,
      y: args.y,
      id: args.id,
      cX: true,
      z:
        (args.z ? args.z * args.rotate.turnedAway : 0) +
        (args.zAbs ? args.zAbs : 0),
      list,
    },
    rotate: args.rotate,
    sX,
    sY: args.sY,
    y: args.y,
  }
}

export default drawRotator
