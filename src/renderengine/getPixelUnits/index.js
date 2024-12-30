import { DistanceX, DistanceY, Height, Width } from './Size'

class Axis {
  state
  constructor(state) {
    this.state = state
  }
  prepare(Size, Pos, args) {
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
    super(state)

    this.prepare(Width, DistanceX, args)
  }
}
class AxisY extends Axis {
  constructor(args, state) {
    super(state)

    this.prepare(Height, DistanceY, args)
  }
}

class Pos extends Axis {
  prepare(Distance, args) {
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

class PosX extends Pos {
  constructor(args, state) {
    super(state)

    this.prepare(DistanceX, args)
  }
}
class PosY extends Pos {
  constructor(args, state) {
    super(state)

    this.prepare(DistanceY, args)
  }
}

class Dimensions {
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

const getPixelUnits = () => {
  const old = []

  const state = {
    variableListLink: null,
    variableListCreate: null,
    updateList: null,
    calculateList: null,
    dimensionWidth: null,
    dimensionHeight: null,
    addX: null,
    addY: null,
  }

  const createSize = function (args) {
    return args === undefined
      ? 0
      : args.height
        ? new Height(args, state)
        : new Width(args, state)
  }

  const oneDSet = (dimensions) => {
    const x = dimensions.posX || 0
    const y = dimensions.posY || 0

    state.addX = x

    state.addY = y

    state.dimensionWidth = dimensions.width

    state.dimensionHeight = dimensions.height
  }

  const setAxis = (dimensions) => {
    AxisX.prototype.dim = PosX.prototype.dim = dimensions.width

    AxisY.prototype.dim = PosY.prototype.dim = dimensions.height
  }

  const Position = function (args, reflectX, reflectY, rotate) {
    const fromRight = (args.fX || false) !== reflectX
    const fromBottom = (args.fY || false) !== reflectY

    const x = new PosX(
      rotate
        ? {
            pos: args.y,
            fromOtherSide: !fromBottom,
            toOtherSide: args.toTop,
            center: args.centerX || args.center,
          }
        : {
            pos: args.x,
            fromOtherSide: fromRight,
            toOtherSide: args.toLeft,
            center: args.centerY || args.center,
          },
      state,
    )

    const y = new PosY(
      rotate
        ? {
            pos: args.x,
            fromOtherSide: fromRight,
            toOtherSide: args.toLeft,
            center: args.centerX || args.center,
          }
        : {
            pos: args.y,
            fromOtherSide: fromBottom,
            toOtherSide: args.toTop,
            center: args.centerY || args.center,
          },
      state,
    )

    return () => ({
      x: x.calc(),
      y: y.calc(),
    })
  }

  return {
    Position,
    getDimensions: (args, fromRight, fromBottom, rotate) =>
      new Dimensions(args, fromRight, fromBottom, rotate, state),
    createSize,
    getWidth: (args) => new Width(args, state),
    getHeight: (args) => new Height(args, state),
    setList: (listLink, listCreate, updater) => {
      state.variableListLink = listLink

      state.variableListCreate = listCreate

      state.updateList = updater
    },
    linkList: (calc) => {
      state.calculateList = calc
    },
    init: (dimensions) => {
      oneDSet(dimensions)

      setAxis(dimensions)

      if (state.calculateList) {
        state.calculateList(dimensions)
      }

      if (state.updateList) {
        state.updateList()
      }
    },
    pop: () => {
      const o = old[old.length - 2]

      if (o) {
        oneDSet(o)

        setAxis(o)

        old.pop()
      }
    },
    push: (dimensions) => {
      oneDSet(dimensions)

      setAxis(dimensions)

      old.push(dimensions)
    },
  }
}

export default getPixelUnits
