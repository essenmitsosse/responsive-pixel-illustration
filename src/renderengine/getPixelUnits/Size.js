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
  const sizeX = new Width(x, state)
  const sizeY = new Width(y, state)

  return () =>
    Math.round(
      Math.sqrt(Math.pow(sizeX.getReal(), 2) + Math.pow(sizeY.getReal(), 2)),
    )
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
    if (Array.isArray(args)) {
      // is Array
      this.createAdder(args, true)
    } else if (
      typeof args === 'object' &&
      'getLinkedVariable' in args &&
      args.getLinkedVariable
    ) {
      // Linked to Variable ( new style )
      this.realPartCalculation = args.getLinkedVariable
    } else if (
      typeof args === 'object' &&
      'getLength' in args &&
      args.getLength
    ) {
      this.realPartCalculation = getGetLengthCalculation(
        args.getLength[0],
        args.getLength[1],
        this.state,
      )
    } else if (typeof args === 'object') {
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
    } else if (typeof args === 'number' && this.dimension) {
      // No calculation, just return Number
      this.simplify(args)
    } else if (typeof args === 'number') {
      this.abs = args

      this.rele = 0

      this.realPartCalculation = this.getRealDistance
    } else if (typeof args === 'string') {
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

export class Width extends Dimension {
  constructor(args, state) {
    super(state)

    this.prepare(args, true)
  }
}

export class Height extends Dimension {
  constructor(args, state) {
    super(state)

    this.prepare(args, false)
  }
}

export class DistanceX extends Distance {
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

export class DistanceY extends Distance {
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
