import { DistanceX, DistanceY, Height, Width } from './Size'

import type { Dimension } from './Size'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { State } from '@/renderengine/getPixelUnits/State'

type ArgsAxis = {
  center?: boolean
  fromOtherSide: boolean
  margin?: InputDynamicVariable
  min?: InputDynamicVariable
  pos?: InputDynamicVariable
  size?: InputDynamicVariable
  toOtherSide?: boolean
}

class Axis {
  state: State
  pos: DistanceX | DistanceY
  size: Height | Width
  realSize?: number
  realPos?: number
  realMargin?: number
  toOtherSide: boolean | undefined
  fromOtherSide: boolean
  center?: boolean
  margin: Dimension | false
  min?: Dimension | false
  calcPos: () => number
  constructor(
    Size: {
      new (args: InputDynamicVariable, state: State): Height | Width
    },
    Pos: {
      new (args: InputDynamicVariable, state: State): DistanceX | DistanceY
    },
    args: ArgsAxis,
    state: State,
  ) {
    this.state = state

    this.pos = new Pos(args.pos, this.state)

    this.size = new Size(args.size, this.state)

    this.margin = args.margin ? new Size(args.margin, this.state) : false

    this.toOtherSide = args.toOtherSide

    this.fromOtherSide = args.fromOtherSide

    this.center = args.center

    if (args.min) {
      this.min = new Size(args.min, this.state)
    }

    this.calcPos = this.center
      ? this.fromOtherSide
        ? this.getCalcPos.fromOtherCenter
        : this.getCalcPos.center
      : this.toOtherSide
        ? this.fromOtherSide
          ? this.getCalcPos.fromOtherToOther
          : this.getCalcPos.toOther
        : this.fromOtherSide
          ? this.getCalcPos.fromOther
          : this.getCalcPos.normal
  }
  get dim(): number | null {
    return null
  }
  get getSize(): number {
    if (this.realSize === undefined) {
      throw new Error('Unexpected error: realSize is not defined')
    }

    return this.realSize
  }
  get getPos(): number {
    if (this.realPos === undefined) {
      throw new Error('Unexpected error: realPos is not defined')
    }

    return this.realPos
  }
  get getEnd(): number {
    if (this.realSize === undefined) {
      throw new Error('Unexpected error: realSize is not defined')
    }

    if (this.realPos === undefined) {
      throw new Error('Unexpected error: realPos is not defined')
    }

    return this.realPos + this.realSize
  }

  calc(): void {
    this.realSize =
      this.size.getReal() -
      (this.realMargin = this.margin ? this.margin.getReal() : 0) * 2

    this.realPos = this.calcPos()
  }

  getCalcPos = {
    normal(this: Axis): number {
      if (this.realMargin === undefined) {
        throw new Error('Unexpected error: realMargin is not defined')
      }

      return this.pos.getReal() + this.realMargin
    },
    toOther(this: Axis): number {
      if (this.realMargin === undefined) {
        throw new Error('Unexpected error: realMargin is not defined')
      }

      if (this.realSize === undefined) {
        throw new Error('Unexpected error: realSize is not defined')
      }

      return this.pos.getReal() + this.realMargin - this.realSize
    },
    center(this: Axis): number {
      if (this.dim === null) {
        throw new Error('Unexpected error: dim is not set')
      }

      if (this.realSize === undefined) {
        throw new Error('Unexpected error: realSize is not defined')
      }

      return this.pos.getReal() + Math.floor((this.dim - this.realSize) / 2)
    },

    fromOther(this: Axis): number {
      if (this.realMargin === undefined) {
        throw new Error('Unexpected error: realMargin is not defined')
      }

      if (this.realSize === undefined) {
        throw new Error('Unexpected error: realSize is not defined')
      }

      return this.pos.fromOtherSide(this.realSize) - this.realMargin
    },
    fromOtherToOther(this: Axis): number {
      if (this.realMargin === undefined) {
        throw new Error('Unexpected error: realMargin is not defined')
      }

      return this.pos.fromOtherSide(0) + this.realMargin
    },
    fromOtherCenter(this: Axis): number {
      if (this.dim === null) {
        throw new Error('Unexpected error: dim is not set')
      }

      if (this.realSize === undefined) {
        throw new Error('Unexpected error: realSize is not defined')
      }

      return (
        this.pos.fromOtherSide(this.realSize) -
        Math.floor((this.dim - this.realSize) / 2)
      )
    },
  }
}

export class AxisX extends Axis {
  constructor(args: ArgsAxis, state: State) {
    super(Width, DistanceX, args, state)
  }

  get dim(): number | null {
    return this.state.dimensionWidth
  }
}

export class AxisY extends Axis {
  constructor(args: ArgsAxis, state: State) {
    super(Height, DistanceY, args, state)
  }

  get dim(): number | null {
    return this.state.dimensionHeight
  }
}
class Pos extends Axis {
  constructor(
    Size: {
      new (args: InputDynamicVariable, state: State): Height | Width
    },
    Distance: {
      new (args: InputDynamicVariable, state: State): DistanceX | DistanceY
    },
    args: ArgsAxis,
    state: State,
  ) {
    super(Size, Distance, args, state)

    this.pos = new Distance(args.pos, this.state)

    this.toOtherSide = args.toOtherSide

    this.fromOtherSide = args.fromOtherSide

    this.center = args.center

    this.calcPos = this.center
      ? this.fromOtherSide
        ? this.getCalcPos.fromOtherCenter
        : this.getCalcPos.center
      : this.toOtherSide
        ? this.fromOtherSide
          ? this.getCalcPos.fromOtherToOther
          : this.getCalcPos.toOther
        : this.fromOtherSide
          ? this.getCalcPos.fromOther
          : this.getCalcPos.normal
  }

  calc(): number {
    return this.calcPos()
  }

  getCalcPos = {
    normal(this: Axis): number {
      return this.pos.getReal()
    },
    toOther(this: Axis): number {
      return this.pos.getReal() - 1
    },
    center(this: Axis): number {
      if (this.dim === null) {
        throw new Error('Unexpected error: dim is not set')
      }

      return this.pos.getReal() + Math.floor(this.dim / 2)
    },

    fromOther(this: Axis): number {
      return this.pos.fromOtherSide(1)
    },
    fromOtherToOther(this: Axis): number {
      return this.pos.fromOtherSide(0)
    },
    fromOtherCenter(this: Axis): number {
      if (this.dim === null) {
        throw new Error('Unexpected error: dim is not set')
      }

      return this.pos.fromOtherSide(1) - Math.floor(this.dim / 2)
    },
  }
}

export class PosX extends Pos {
  constructor(args: ArgsAxis, state: State) {
    super(Width, DistanceX, args, state)
  }

  get dim(): number | null {
    return this.state.dimensionWidth
  }
}

export class PosY extends Pos {
  constructor(args: ArgsAxis, state: State) {
    super(Height, DistanceY, args, state)
  }

  get dim(): number | null {
    return this.state.dimensionHeight
  }
}

export class Dimensions {
  x: AxisX
  y: AxisY
  constructor(
    args: {
      c?: boolean
      cX?: boolean
      cY?: boolean
      m?: number
      mX?: number
      mY?: number
      minX?: number
      minY?: number
      s?: number
      sX?: number
      sY?: number
      tX?: boolean
      tY?: boolean
      x?: InputDynamicVariable
      y?: InputDynamicVariable
    },
    fromRight: boolean,
    fromBottom: boolean,
    rotate: boolean,
    state: State,
  ) {
    if (args.sX === undefined) {
      args.sX = args.s
    }

    if (args.sY === undefined) {
      args.sY = args.s
    }

    this.x = new AxisX(
      rotate
        ? {
            size: args.sY,
            pos: args.y,
            margin: args.mY || args.m,
            fromOtherSide: fromRight,
            toOtherSide: args.tY,
            min: args.minY,
            center: args.cY || args.c,
          }
        : {
            size: args.sX,
            pos: args.x,
            margin: args.mX || args.m,
            fromOtherSide: fromRight,
            toOtherSide: args.tX,
            min: args.minX,
            center: args.cX || args.c,
          },
      state,
    )

    this.y = new AxisY(
      rotate
        ? {
            size: args.sX,
            pos: args.x,
            margin: args.mX || args.m,
            fromOtherSide: fromBottom,
            toOtherSide: args.tX,
            min: args.minX,
            center: args.cX || args.c,
          }
        : {
            size: args.sY,
            pos: args.y,
            margin: args.mY || args.m,
            fromOtherSide: fromBottom,
            toOtherSide: args.tY,
            min: args.minY,
            center: args.cY || args.c,
          },
      state,
    )
  }

  get width(): number {
    return this.x.getSize
  }
  get height(): number {
    return this.y.getSize
  }
  get posX(): number {
    return this.x.getPos
  }
  get posY(): number {
    return this.y.getPos
  }
  get endX(): number {
    return this.x.getEnd
  }
  get endY(): number {
    return this.y.getEnd
  }

  calc(): Dimensions {
    this.x.calc()

    this.y.calc()

    return this
  }

  checkMin(): boolean {
    if (this.x.realSize === undefined) {
      throw new Error('Unexpected error: realSize on x is not defined')
    }

    if (this.y.realSize === undefined) {
      throw new Error('Unexpected error: realSize on yC is not defined')
    }

    return (
      this.x.realSize < 1 ||
      (this.x.min !== undefined &&
        this.x.min !== false &&
        this.x.realSize < this.x.min.getReal()) ||
      this.y.realSize < 1 ||
      (this.y.min !== undefined &&
        this.y.min !== false &&
        this.y.realSize < this.y.min.getReal())
    )
  }
}

export type ParameterDimension = ConstructorParameters<typeof Dimensions>[0]
