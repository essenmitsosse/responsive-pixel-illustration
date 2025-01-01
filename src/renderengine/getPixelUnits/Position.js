import { DistanceX, DistanceY, Height, Width } from './Size'

class Axis {
  constructor(Size, Pos, args, state) {
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
  get getSize() {
    return this.realSize
  }
  get getPos() {
    return this.realPos
  }
  get getEnd() {
    return this.realPos + this.realSize
  }

  calc() {
    this.realSize =
      this.size.getReal() -
      (this.realMargin = this.margin ? this.margin.getReal() : 0) * 2

    this.realPos = this.calcPos()
  }

  getCalcPos = {
    normal() {
      return this.pos.getReal() + this.realMargin
    },
    toOther() {
      return this.pos.getReal() + this.realMargin - this.realSize
    },
    center() {
      return this.pos.getReal() + Math.floor((this.dim - this.realSize) / 2)
    },

    fromOther() {
      return this.pos.fromOtherSide(this.realSize) - this.realMargin
    },
    fromOtherToOther() {
      return this.pos.fromOtherSide(0) + this.realMargin
    },
    fromOtherCenter() {
      return (
        this.pos.fromOtherSide(this.realSize) -
        Math.floor((this.dim - this.realSize) / 2)
      )
    },
  }
}

class AxisX extends Axis {
  constructor(args, state) {
    super(Width, DistanceX, args, state)
  }

  get dim() {
    return this.state.dimensionWidth
  }
}

class AxisY extends Axis {
  constructor(args, state) {
    super(Height, DistanceY, args, state)
  }

  get dim() {
    return this.state.dimensionHeight
  }
}
class Pos extends Axis {
  constructor(Size, Distance, args, state) {
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

  calc() {
    return this.calcPos()
  }

  getCalcPos = {
    normal() {
      return this.pos.getReal()
    },
    toOther() {
      return this.pos.getReal() - 1
    },
    center() {
      return this.pos.getReal() + Math.floor(this.dim / 2)
    },

    fromOther() {
      return this.pos.fromOtherSide(1)
    },
    fromOtherToOther() {
      return this.pos.fromOtherSide(0)
    },
    fromOtherCenter() {
      return this.pos.fromOtherSide(1) - Math.floor(this.dim / 2)
    },
  }
}

export class PosX extends Pos {
  constructor(args, state) {
    super(Width, DistanceX, args, state)
  }

  get dim() {
    return this.state.dimensionWidth
  }
}

export class PosY extends Pos {
  constructor(args, state) {
    super(Height, DistanceY, args, state)
  }

  get dim() {
    return this.state.dimensionHeight
  }
}

export class Dimensions {
  constructor(args, fromRight, fromBottom, rotate, state) {
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

  get width() {
    return this.x.realSize
  }
  get height() {
    return this.y.realSize
  }
  get posX() {
    return this.x.realPos
  }
  get posY() {
    return this.y.realPos
  }
  get endX() {
    return this.x.realPos + this.x.realSize
  }
  get endY() {
    return this.y.realPos + this.y.realSize
  }

  calc() {
    this.x.calc()

    this.y.calc()

    return this
  }

  checkMin() {
    return (
      this.x.realSize < 1 ||
      (this.x.min && this.x.realSize < this.x.min.getReal()) ||
      this.y.realSize < 1 ||
      (this.y.min && this.y.realSize < this.y.min.getReal())
    )
  }
}
