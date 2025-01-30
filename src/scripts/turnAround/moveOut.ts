import type { InputDynamicVariable } from '@/helper/typeSize'

export type MoveOut = {
  add: ReadonlyArray<InputDynamicVariable>
  max?: InputDynamicVariable
  min?: InputDynamicVariable
}

export type Move = {
  max?: InputDynamicVariable
  sX?: InputDynamicVariable
  sXBase?: InputDynamicVariable
  xBase?: number
  xRel?: number
}

export const moveOut = (
  move: Move,
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

  if (move.sXBase && move.xBase) {
    // Move out, relative to the Base
    linkedList.push(
      (diff = {
        add: [
          { r: 0.5, useSize: move.sXBase },
          { r: -0.5, useSize: move.sX },
        ],
      }),
    )

    add.push({
      r: rotate.position * move.xBase,

      /** Correct the 1 subtracted Pixel */
      a: move.xBase > 0 ? rotate.position * -1 : undefined,
      useSize: diff,
    })
  }

  if (move.xRel) {
    // Move relative to the size of the object
    add.push({
      r: rotate.position * move.xRel,
      useSize: move.sX,
    })
  }

  if (move.max) {
    linkedList.push(move.max)

    X.max = move.max

    X.min = { r: -1, useSize: move.max }
  }

  linkedList.push(X)

  return X
}
