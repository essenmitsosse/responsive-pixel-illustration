import type { Move } from './BBObj'
import type { MoveOut } from './types'
import type { InputDynamicVariable } from '@/helper/typeSize'

export const moveOut = (
  args: Move,
  rotate: {
    position: number
  },
  linkedList: Array<InputDynamicVariable>,
): MoveOut => {
  // Takes arguments:
  //	sXBase, xBase,
  //	xAdd,
  //	XRel
  let diff: InputDynamicVariable

  const add: Array<InputDynamicVariable> = []

  const X: {
    add: ReadonlyArray<InputDynamicVariable>
    max?: InputDynamicVariable
    min?: InputDynamicVariable
  } = {
    add,
  }

  if (args.sXBase && args.xBase) {
    // Move out, relative to the Base
    linkedList.push(
      (diff = {
        add: [
          { r: 0.5, useSize: args.sXBase },
          { r: -0.5, useSize: args.sX },
        ],
      }),
    )

    add.push({
      r: rotate.position * args.xBase,

      /** Correct the 1 subtracted Pixel */
      a: args.xBase > 0 ? rotate.position * -1 : undefined,
      useSize: diff,
    })
  }

  if (args.xAdd) {
    // Move Center Point to correct center
    add.push(args.xAdd)
  }

  if (args.xRel) {
    // Move relative to the size of the object
    add.push({
      r: rotate.position * args.xRel,
      useSize: args.sX,
    })
  }

  if (args.max) {
    linkedList.push(args.max)

    X.max = args.max

    X.min = { r: -1, useSize: args.max }
  }

  linkedList.push(X)

  return X
}
