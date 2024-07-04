import type { Size } from '../../types'

export const getWidth = (Dimension) =>
  class Width extends Dimension {
    constructor(args: Size) {
      super(true, true, args)
    }
  }

export type Width = ReturnType<typeof getWidth>
