const getPixelUnits = () => {
  const old = []

  const state = {
    variableListLink: null,
    variableListCreate: null,
    updateList: null,
    calculateList: null,
    dimensionWidth: null,
    dimensionHeight: null,
  }

  const createSize = function (args) {
    return args === undefined
      ? 0
      : args.height
        ? new Height(args)
        : new Width(args)
  }

  function getRealDistanceBasic() {
    return (
      this.rele *
        (this.useVari
          ? this.useVari.abs
          : this.useSize
            ? this.useSize()
            : this.dim
              ? state.dimensionWidth
              : state.dimensionHeight) +
      this.abs
    )
  }

  const getGetLengthCalculation = (x, y) => {
    x = new Width(x)

    y = new Width(y)

    return () =>
      Math.round(Math.sqrt(Math.pow(x.getReal(), 2) + Math.pow(y.getReal(), 2)))
  }

  class Dimension {
    prepare(args) {
      const objType = typeof args

      if (objType === 'object') {
        // is Object

        if (args.constructor === Array) {
          // is Array

          this.createAdder(args, true)

          return
        } else if (args.getLinkedVariable) {
          // Linked to Variable ( new style )
          this.realPartCalculation = args.getLinkedVariable

          return
        } else if (args.getLength) {
          this.realPartCalculation = getGetLengthCalculation(
            args.getLength[0],
            args.getLength[1],
          )

          return
        }

        this.debug = args.debug

        if (typeof args.a === 'string') {
          state.variableListLink(args.a, this)
        }

        if (args.add) {
          this.createAdder(args.add)
        }

        if (args.useSize) {
          if (typeof args.useSize === 'string') {
            state.variableListLink(args.useSize, (this.useVari = {}))
          } else if (args.useSize.getLinkedVariable) {
            this.useSize = args.useSize.getLinkedVariable
          } else {
            // errorAdd( "useSize must be a String" )
          }
        } else {
          this.dim = !args.height && (args.otherDim ? !this.axis : this.axis)
        }

        // Get gefaults and try to do quick version
        if (this.getDefaults(args.r, args.a) && !args.useSize && !args.add) {
          this.realPartCalculation = this.getQuick
        } else {
          this.realPartCalculation =
            args.min || args.max
              ? this.getRealDistanceWithMaxMin(
                  args.max,
                  args.min,
                  this.dim ? Width : Height,
                )
              : this.getRealDistance
        }

        if (args.save) {
          this.realPartCalculation = this.saveDistance(
            state.variableListCreate(args.save),
          )
        }

        if (args.odd || args.even) {
          this.realPartCalculation = this.odd(args.odd || false)
        }
      } else {
        // Short Hand Variables

        if (objType === 'number') {
          if (this.dimension) {
            // No calculation, just return Number
            this.simplify(args)

            return
          } else {
            this.abs = args

            this.rele = 0
          }
        } else if (objType === 'string') {
          // Linked to Variable ( old style )
          state.variableListLink(args, this)

          this.rele = 0

          this.realPartCalculation = this.getRealDistance

          return
        } else {
          this.dim = this.axis

          if (this.getDefaults()) {
            this.realPartCalculation = this.getQuick

            return
          }
        }

        this.realPartCalculation = this.getRealDistance
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

        return real === 0
          ? 0
          : (!(real % 2) === false) === odd
            ? real
            : real + 1
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
            ? state.dimensionWidth
            : state.dimensionHeight)
      )
    }

    createAdder(add, onlyAdd) {
      let l = add.length

      const adder = (this.adder = [])
      const Size = this.dim ? Height : Width

      while (l--) {
        adder.push(new Size(add[l]))
      }

      this[onlyAdd ? 'realPartCalculation' : 'getRealDistance'] = onlyAdd
        ? this.getRealDistanceWithCalcOnlyAdding
        : this.getRealDistanceWithCalc
    }

    getReal = function () {
      return Math.round(this.realPartCalculation())
    }

    getRealUnrounded = function () {
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

    getRealDistanceWithCalcOnlyAdding = function () {
      let add = 0
      let l = this.adder.length

      while (l--) {
        add += this.adder[l].getReal()
      }

      return add
    }

    getRealDistanceWithMaxMin = (max, min, Dim) => {
      max = max && new Dim(max)

      min = min && new Dim(min)

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
      return this.dim ? state.dimensionWidth : state.dimensionHeight
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
    constructor(args) {
      super(args)

      this.prepare(args)
    }

    axis = true
  }

  class Height extends Dimension {
    constructor(args) {
      super(args)

      this.prepare(args)
    }

    axis = false
  }

  function DistanceX(args) {
    this.prepare(args)
  }

  function DistanceY(args) {
    this.prepare(args)
  }

  DistanceX.prototype = new Distance()

  DistanceY.prototype = new Distance()

  DistanceX.prototype.axis = true

  const oneDSet = (dimensions) => {
    const x = dimensions.posX || 0
    const y = dimensions.posY || 0

    const getRealPos = (add) =>
      function () {
        return Math.round(this.realPartCalculation() + add)
      }

    const getFromOtherSide = (add) =>
      function (size) {
        return (
          (this.axis ? dimensions.width : dimensions.height) +
          add -
          Math.round(this.realPartCalculation() + size)
        )
      }

    DistanceX.prototype.getReal = getRealPos(x)

    DistanceY.prototype.getReal = getRealPos(y)

    DistanceX.prototype.fromOtherSide = getFromOtherSide(x)

    DistanceY.prototype.fromOtherSide = getFromOtherSide(y)

    state.dimensionWidth = dimensions.width

    state.dimensionHeight = dimensions.height
  }

  const createAxis = (Size, Pos) =>
    function (args) {
      this.pos = new Pos(args.pos)

      this.size = new Size(args.size)

      this.margin = args.margin ? new Size(args.margin) : false

      this.toOtherSide = args.toOtherSide

      this.fromOtherSide = args.fromOtherSide

      this.center = args.center

      if (args.min) {
        this.min = new Size(args.min)
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

  const createPos = (Pos) =>
    function (args) {
      this.pos = new Pos(args.pos)

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

  const Axis = function () {}
  const AxisX = createAxis(Width, DistanceX)
  const AxisY = createAxis(Height, DistanceY)
  const Pos = function () {}
  const PosX = createPos(DistanceX)
  const PosY = createPos(DistanceY)

  Axis.prototype = {
    get getSize() {
      return this.realSize
    },
    get getPos() {
      return this.realPos
    },
    get getEnd() {
      return this.realPos + this.realSize
    },
  }

  Axis.prototype.calc = function () {
    this.realSize =
      this.size.getReal() -
      (this.realMargin = this.margin ? this.margin.getReal() : 0) * 2

    this.realPos = this.calcPos()
  }

  Axis.prototype.getCalcPos = {
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

  AxisX.prototype = new Axis()

  AxisY.prototype = new Axis()

  Pos.prototype = new Axis()

  Pos.prototype.calc = function () {
    return this.calcPos()
  }

  Pos.prototype.getCalcPos = {
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

  PosX.prototype = new Pos()

  PosY.prototype = new Pos()

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
    )

    return () => ({
      x: x.calc(),
      y: y.calc(),
    })
  }

  const Dimensions = function (args, fromRight, fromBottom, rotate) {
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
    )
  }

  Dimensions.prototype = {
    get width() {
      return this.x.realSize
    },
    get height() {
      return this.y.realSize
    },
    get posX() {
      return this.x.realPos
    },
    get posY() {
      return this.y.realPos
    },
    get endX() {
      return this.x.realPos + this.x.realSize
    },
    get endY() {
      return this.y.realPos + this.y.realSize
    },
  }

  Dimensions.prototype.calc = function () {
    this.x.calc()

    this.y.calc()

    return this
  }

  Dimensions.prototype.checkMin = function () {
    return (
      this.x.realSize < 1 ||
      (this.x.min && this.x.realSize < this.x.min.getReal()) ||
      this.y.realSize < 1 ||
      (this.y.min && this.y.realSize < this.y.min.getReal())
    )
  }

  return {
    Position,
    Dimensions,
    createSize,
    Width,
    Height,
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
