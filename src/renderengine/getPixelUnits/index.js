function getRealDistanceBasic() {
  return (
    this.rele *
      (this.useVari
        ? this.useVari.abs
        : this.useSize
          ? this.useSize()
          : this.dim
            ? this.state.dimensionWidth
            : this.state.dimensionHeight) +
    this.abs
  )
}

const getGetLengthCalculation = (x, y, state) => {
  x = new Width(x, state)

  y = new Width(y, state)

  return () =>
    Math.round(Math.sqrt(Math.pow(x.getReal(), 2) + Math.pow(y.getReal(), 2)))
}

class Dimension {
  state
  constructor(state) {
    this.state = state
  }
  /**
   * This can't be the `constructor`, because it relies on properties of the
   * final object and in case of sub classed instances (which is basically all
   * the instance that are going to be used) this wouldn't be set during the
   * `constructor` call, so after `super` has been called we need to explicitly
   * call `prepare`.
   */
  prepare(args, axis) {
    const objType = typeof args

    if (Array.isArray(args)) {
      // is Array

      this.createAdder(args, true)
    } else if (
      objType === 'object' &&
      'getLinkedVariable' in args &&
      args.getLinkedVariable
    ) {
      // Linked to Variable ( new style )
      this.realPartCalculation = args.getLinkedVariable
    } else if (objType === 'object' && 'getLength' in args && args.getLength) {
      this.realPartCalculation = getGetLengthCalculation(
        args.getLength[0],
        args.getLength[1],
        this.state,
      )
    } else if (objType === 'object') {
      // is Object
      this.debug = args.debug

      if ('a' in args && typeof args.a === 'string') {
        this.state.variableListLink(args.a, this)
      }

      if ('add' in args && args.add) {
        this.createAdder(args.add)
      }

      if ('useSize' in args && args.useSize) {
        if (typeof args.useSize === 'string') {
          this.state.variableListLink(args.useSize, (this.useVari = {}))
        } else if (args.useSize.getLinkedVariable) {
          this.useSize = args.useSize.getLinkedVariable
        } else {
          // errorAdd( "useSize must be a String" )
        }
      } else {
        this.dim =
          (!('height' in args) || !args.height) &&
          ('otherDim' in args && args.otherDim ? !axis : axis)
      }

      // Get gefaults and try to do quick version
      if (
        this.getDefaults(args.r, args.a) &&
        !('useSize' in args && args.useSize) &&
        !('add' in args && args.add)
      ) {
        this.realPartCalculation = this.getQuick
      } else {
        this.realPartCalculation =
          ('min' in args && args.min) || ('max' in args && args.max)
            ? this.getRealDistanceWithMaxMin(
                args.max,
                args.min,
                this.dim ? Width : Height,
              )
            : this.getRealDistance
      }

      if ('save' in args && args.save) {
        this.realPartCalculation = this.saveDistance(
          this.state.variableListCreate(args.save),
        )
      }

      if (('odd' in args && args.odd) || ('even' in args && args.even)) {
        this.realPartCalculation = this.odd(args.odd || false)
      }
    } else if (objType === 'number' && this.dimension) {
      // No calculation, just return Number
      this.simplify(args)
    } else if (objType === 'number') {
      this.abs = args

      this.rele = 0

      this.realPartCalculation = this.getRealDistance
    } else if (objType === 'string') {
      // Linked to Variable ( old style )
      this.state.variableListLink(args, this)

      this.rele = 0

      this.realPartCalculation = this.getRealDistance
    } else if (this.getDefaults()) {
      this.dim = axis

      this.realPartCalculation = this.getQuick
    } else {
      this.dim = axis
    }
  }

  saveDistance(saver) {
    this.getRealForSave = this.realPartCalculation

    return function () {
      const real = this.getRealForSave()

      saver.set(real)

      return real
    }
  }

  odd(odd) {
    this.getRealForOdd = this.realPartCalculation

    return function () {
      const real = Math.round(this.getRealForOdd())

      return real === 0 ? 0 : (!(real % 2) === false) === odd ? real : real + 1
    }
  }

  getDefaults(r, a) {
    if (r === undefined && a === undefined && this.adder === undefined) {
      this.rele = 1

      this.abs = 0

      return true
    } else {
      this.rele = r || 0

      this.abs = a || 0
    }
  }

  getQuick() {
    return (
      this.rele *
      (this.useSize
        ? this.useSize()
        : this.dim
          ? this.state.dimensionWidth
          : this.state.dimensionHeight)
    )
  }

  createAdder(add, onlyAdd) {
    let l = add.length

    const adder = (this.adder = [])
    const Size = this.dim ? Height : Width

    while (l--) {
      adder.push(new Size(add[l], this.state))
    }

    this[onlyAdd ? 'realPartCalculation' : 'getRealDistance'] = onlyAdd
      ? this.getRealDistanceWithCalcOnlyAdding
      : this.getRealDistanceWithCalc
  }

  getReal() {
    return Math.round(this.realPartCalculation())
  }

  getRealUnrounded() {
    return this.realPartCalculation()
  }

  getRealDistanceBasic = getRealDistanceBasic

  getRealDistance = getRealDistanceBasic

  getRealDistanceWithCalc() {
    let add = 0
    let l = this.adder.length

    while (l--) {
      add += this.adder[l].getReal()
    }

    return this.getRealDistanceBasic() + add
  }

  getRealDistanceWithCalcOnlyAdding() {
    let add = 0
    let l = this.adder.length

    while (l--) {
      add += this.adder[l].getReal()
    }

    return add
  }

  getRealDistanceWithMaxMin(max, min, Dim) {
    max = max && new Dim(max, this.state)

    min = min && new Dim(min, this.state)

    return max && min
      ? function () {
          let a

          const realMin = typeof min === 'number' ? min : min.getReal()
          const realMax = typeof max === 'number' ? max : max.getReal()

          return (a = this.getRealDistance()) > realMax
            ? realMax < realMin
              ? realMin
              : realMax
            : a < realMin
              ? realMin
              : a
        }
      : max
        ? function () {
            let a

            const realMax = typeof max === 'number' ? max : max.getReal()

            return (a = this.getRealDistance()) > realMax ? realMax : a
          }
        : function () {
            let a

            const realMin = typeof min === 'number' ? min : min.getReal()

            return (a = this.getRealDistance()) < realMin ? realMin : a
          }
  }

  getDim() {
    return this.dim ? this.state.dimensionWidth : this.state.dimensionHeight
  }

  dimension = true

  simplify(abs) {
    this.getReal = () => abs
  }
}

class Distance extends Dimension {
  getDefaults(r, a) {
    if (r === undefined && a === undefined) {
      this.rele = 0

      this.abs = 0

      return true
    } else {
      this.rele = r || 0

      this.abs = a || 0
    }
  }

  getQuick = () => 0

  dimension = false
}

class Width extends Dimension {
  constructor(args, state) {
    super(state)

    this.prepare(args, true)
  }
}

class Height extends Dimension {
  constructor(args, state) {
    super(state)

    this.prepare(args, false)
  }
}

class DistanceX extends Distance {
  constructor(args, state) {
    super(state)

    this.prepare(args, true)
  }

  getReal() {
    return Math.round(this.realPartCalculation() + this.state.addX)
  }

  fromOtherSide(size) {
    return (
      this.state.dimensionWidth +
      this.state.addX -
      Math.round(this.realPartCalculation() + size)
    )
  }
}

class DistanceY extends Distance {
  constructor(args, state) {
    super(state)

    this.prepare(args, false)
  }

  getReal() {
    return Math.round(this.realPartCalculation() + this.state.addY)
  }

  fromOtherSide(size) {
    return (
      this.state.dimensionHeight +
      this.state.addY -
      Math.round(this.realPartCalculation() + size)
    )
  }
}

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
