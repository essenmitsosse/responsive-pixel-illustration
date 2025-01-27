import { moveOut } from './moveOut'

import type { Move, What } from './types'
import type { InputDynamicVariable } from '@/helper/typeSize'

const merge = <T extends Pick<What, 'x' | 'y' | 'z'>>(
  what: T,
  args: {
    x: InputDynamicVariable
    y: InputDynamicVariable
    z: number
  },
): T => {
  what.x = args.x

  what.y = args.y

  what.z = args.z

  return what
}

export const mover = (
  what: What,
  move: Move,
  linkedList: Array<InputDynamicVariable>,
): Pick<What, 'get'> => {
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
