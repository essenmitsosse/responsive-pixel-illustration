import { moveOut } from './moveOut'

import type { Move } from './moveOut'
import type { DataPos, DataRotation, DataSize, GetTool } from './types'
import type { InputDynamicVariable } from '@/helper/typeSize'

const merge = (
  what: DataPos,
  args: {
    x: InputDynamicVariable
    y: InputDynamicVariable
    z: number
  },
): DataPos => {
  what.x = args.x

  what.y = args.y

  what.z = args.z

  return what
}

export const mover = (
  what: DataRotation & Pick<DataSize, 'sX'> & { get: DataPos },
  move: Move & {
    y?: InputDynamicVariable
    z?: number
  },
  linkedList: Array<InputDynamicVariable>,
): GetTool => {
  move.sX = what.sX

  const x = moveOut(move, what.rotate, linkedList)

  return {
    get: merge(what.get, {
      x,
      y: move.y,
      z:
        (move.xRel
          ? move.xRel && move.xRel < 0
            ? -1
            : 1
          : move.xBase && move.xBase < 0
            ? -1
            : 1) *
        (move.z || 50) *
        what.rotate.turnedAway,
    }),
  }
}
