export const getPixelUnits = function () {
  var old = []
  var variableListLink
  var variableListCreate
  var updateList
  var calculateList
  var oneD = (function () {
    var createSize = function (args) {
      return args === undefined
        ? 0
        : args.height
          ? new Height(args)
          : new Width(args)
    }

    function Dimension() {}

    function Distance() {}

    function Width(args) {
      this.prepare(args)
    }

    function Height(args) {
      this.prepare(args)
    }

    function DistanceX(args) {
      this.prepare(args)
    }

    function DistanceY(args) {
      this.prepare(args)
    }

    // DIMENSIONS --- Width & Height

    Dimension.prototype.prepare = function (args) {
      var objType = typeof args

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
          this.realPartCalculation = this.getGetLengthCalculation(
            args.getLength[0],
            args.getLength[1],
          )

          return
        }

        this.debug = args.debug

        if (typeof args.a === 'string') {
          variableListLink(args.a, this)
        }

        if (args.add) {
          this.createAdder(args.add)
        }

        if (args.useSize) {
          if (typeof args.useSize === 'string') {
            variableListLink(args.useSize, (this.useVari = {}))
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
            variableListCreate(args.save),
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
          variableListLink(args, this)

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

    Dimension.prototype.saveDistance = function (saver) {
      this.getRealForSave = this.realPartCalculation

      return function () {
        var real = this.getRealForSave()

        saver.set(real)

        return real
      }
    }

    Dimension.prototype.odd = function (odd) {
      this.getRealForOdd = this.realPartCalculation

      return function () {
        var real = Math.round(this.getRealForOdd())

        return real === 0
          ? 0
          : (!(real % 2) === false) === odd
            ? real
            : real + 1
      }
    }

    Dimension.prototype.getDefaults = function (r, a) {
      if (r === undefined && a === undefined && this.adder === undefined) {
        this.rele = 1

        this.abs = 0

        return true
      } else {
        this.rele = r || 0

        this.abs = a || 0
      }
    }

    Dimension.prototype.getQuick = function () {
      return (
        this.rele *
        (this.useSize ? this.useSize() : this.dim ? this.width : this.height)
      )
    }

    Dimension.prototype.createAdder = function (add, onlyAdd) {
      var l = add.length
      var adder = (this.adder = [])
      var Size = this.dim ? Height : Width

      while (l--) {
        adder.push(new Size(add[l]))
      }

      this[onlyAdd ? 'realPartCalculation' : 'getRealDistance'] = onlyAdd
        ? this.getRealDistanceWithCalcOnlyAdding
        : this.getRealDistanceWithCalc
    }

    Dimension.prototype.getGetLengthCalculation = function (x, y) {
      x = new Width(x)

      y = new Width(y)

      return function () {
        return Math.round(
          Math.sqrt(Math.pow(x.getReal(), 2) + Math.pow(y.getReal(), 2)),
        )
      }
    }

    Dimension.prototype.getReal = (function () {
      return function () {
        return Math.round(this.realPartCalculation())
      }
    })()

    Dimension.prototype.getRealUnrounded = function () {
      return this.realPartCalculation()
    }

    Dimension.prototype.getRealDistanceBasic = function () {
      return (
        this.rele *
          (this.useVari
            ? this.useVari.abs
            : this.useSize
              ? this.useSize()
              : this.dim
                ? this.width
                : this.height) +
        this.abs
      )
    }

    Dimension.prototype.getRealDistance =
      Dimension.prototype.getRealDistanceBasic

    Dimension.prototype.getRealDistanceWithCalc = function () {
      var add = 0
      var l = this.adder.length

      while (l--) {
        add += this.adder[l].getReal()
      }

      return this.getRealDistanceBasic() + add
    }

    Dimension.prototype.getRealDistanceWithCalcOnlyAdding = function () {
      var add = 0
      var l = this.adder.length

      while (l--) {
        add += this.adder[l].getReal()
      }

      return add
    }

    Dimension.prototype.getRealDistanceWithMaxMin = function (max, min, Dim) {
      max = max && new Dim(max)

      min = min && new Dim(min)

      return max && min
        ? function () {
            var a
            var realMin = typeof min === 'number' ? min : min.getReal()
            var realMax = typeof max === 'number' ? max : max.getReal()

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
              var a
              var realMax = typeof max === 'number' ? max : max.getReal()

              return (a = this.getRealDistance()) > realMax ? realMax : a
            }
          : function () {
              var a
              var realMin = typeof min === 'number' ? min : min.getReal()

              return (a = this.getRealDistance()) < realMin ? realMin : a
            }
    }

    Dimension.prototype.getDim = function () {
      return this.dim ? this.width : this.height
    }

    Dimension.prototype.dimension = true

    Dimension.prototype.simplify = function (abs) {
      this.getReal = function () {
        return abs
      }
    }

    Width.prototype = new Dimension()

    Height.prototype = new Dimension()

    Width.prototype.axis = true

    Height.prototype.axis = false

    // DISTANCES --- PosX & PosY
    Distance.prototype = new Dimension()

    Distance.prototype.getDefaults = function (r, a) {
      if (r === undefined && a === undefined) {
        this.rele = 0

        this.abs = 0

        return true
      } else {
        this.rele = r || 0

        this.abs = a || 0
      }
    }

    Distance.prototype.getQuick = function () {
      return 0
    }

    Distance.prototype.dimension = false

    DistanceX.prototype = new Distance()

    DistanceY.prototype = new Distance()

    DistanceX.prototype.axis = true

    return {
      createSize,
      Width,
      Height,
      DistanceX,
      DistanceY,
      set(dimensions) {
        var x = dimensions.posX || 0
        var y = dimensions.posY || 0

        var getRealPos = function (add) {
          return add
            ? function () {
                return Math.round(this.realPartCalculation() + add)
              }
            : function () {
                return Math.round(this.realPartCalculation())
              }
        }

        var getFromOtherSide = function (add) {
          return add
            ? function (size) {
                return (
                  (this.axis ? dimensions.width : dimensions.height) +
                  add -
                  Math.round(this.realPartCalculation() + size)
                )
              }
            : function (size) {
                return (
                  (this.axis ? dimensions.width : dimensions.height) -
                  Math.round(this.realPartCalculation() + size)
                )
              }
        }

        DistanceX.prototype.getReal = getRealPos(x)

        DistanceY.prototype.getReal = getRealPos(y)

        DistanceX.prototype.fromOtherSide = getFromOtherSide(x)

        DistanceY.prototype.fromOtherSide = getFromOtherSide(y)

        Dimension.prototype.width = dimensions.width

        Dimension.prototype.height = dimensions.height
      },
    }
  })()
  var Axis = (function () {
    var D = oneD

    var createAxis = function (Size, Pos) {
      return function (args) {
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
    }

    var createPos = function (Pos) {
      return function (args) {
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
    }

    var Axis = function () {}

    var AxisX = createAxis(D.Width, D.DistanceX)
    var AxisY = createAxis(D.Height, D.DistanceY)

    var Pos = function () {}

    var PosX = createPos(D.DistanceX)
    var PosY = createPos(D.DistanceY)

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

    return {
      X: AxisX,
      Y: AxisY,
      PosX,
      PosY,
      set(dimensions) {
        AxisX.prototype.dim = PosX.prototype.dim = dimensions.width

        AxisY.prototype.dim = PosY.prototype.dim = dimensions.height
      },
    }
  })()
  var twoD = (function () {
    var A = Axis
    var XAxis = A.X
    var YAxis = A.Y

    var Position = function (args, reflectX, reflectY, rotate) {
      var fromRight = (args.fX || false) !== reflectX
      var fromBottom = (args.fY || false) !== reflectY
      var x = new A.PosX(
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
      var y = new A.PosY(
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

      return function () {
        return {
          x: x.calc(),
          y: y.calc(),
        }
      }
    }

    var Dimensions = function (args, fromRight, fromBottom, rotate) {
      if (args.sX === undefined) {
        args.sX = args.s
      }

      if (args.sY === undefined) {
        args.sY = args.s
      }

      this.x = new XAxis(
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

      this.y = new YAxis(
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
    }
  })()

  return {
    Position: twoD.Position,
    Dimensions: twoD.Dimensions,
    createSize: oneD.createSize,
    Width: oneD.Width,
    Height: oneD.Height,
    setList(listLink, listCreate, updater) {
      variableListLink = listLink

      variableListCreate = listCreate

      updateList = updater
    },
    linkList(calc) {
      calculateList = calc
    },
    init(dimensions) {
      oneD.set(dimensions)

      Axis.set(dimensions)

      if (calculateList) {
        calculateList(dimensions)
      }

      if (updateList) {
        updateList()
      }
    },
    pop() {
      var o = old[old.length - 2]

      if (o) {
        oneD.set(o)

        Axis.set(o)

        old.pop()
      }
    },
    push(dimensions) {
      oneD.set(dimensions)

      Axis.set(dimensions)

      old.push(dimensions)
    },
  }
}
