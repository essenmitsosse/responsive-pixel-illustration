import type { InputDynamicVariable } from '@/helper/typeSize'
import type { State } from '@/renderengine/getPixelUnits/State'
import type { DynamicVariable } from '@/renderengine/Variable'

function getRealDistanceBasic(this: {
  abs?: number | string
  dim?: boolean
  rele?: number
  state: State
  useSize?: () => number
  useVari?: { abs?: number }
}): number {
  if (
    this.state.dimensionWidth === null ||
    this.state.dimensionHeight === null
  ) {
    throw new Error('Unexpected error: State has not been initialized')
  }

  if (this.abs === undefined) {
    throw new Error('Unexpected error: abs is undefined')
  }

  if (typeof this.abs === 'string') {
    throw new Error(
      "Unexpected error: abs is a string, which shouldn't happen in this path",
    )
  }

  if (this.rele === undefined) {
    throw new Error('Unexpected error: rele is undefined')
  }

  /**
   * TODO: Fix this hacky way to differentiate the two cases:
   *
   * - `useVari` is `undefined` (which is fine and is expressed by `abs` being
   *   `null`)
   * - `useVari` is defined, but `abs` is undefined (which should never happen and
   *   will throw)
   */
  const abs = this.useVari ? this.useVari.abs : null

  if (abs === undefined) {
    throw new Error('Unexpected error: useVari.abs is undefined')
  }

  return (
    this.rele *
      (abs !== null
        ? abs
        : this.useSize
          ? this.useSize()
          : this.dim
            ? this.state.dimensionWidth
            : this.state.dimensionHeight) +
    this.abs
  )
}

const getGetLengthCalculation = (x: number, y: number, state: State) => {
  const sizeX = new Width(x, state)
  const sizeY = new Width(y, state)

  return (): number =>
    Math.round(
      Math.sqrt(Math.pow(sizeX.getReal(), 2) + Math.pow(sizeY.getReal(), 2)),
    )
}

export class Dimension {
  abs?: number | string
  useVari?: { abs?: number }
  dim?: boolean
  state: State
  realPartCalculation?: () => number
  debug?: unknown
  adder?: Array<Height | Width>
  useSize?: () => number
  rele?: number
  getRealForSave?: () => number
  getRealForOdd?: () => number
  constructor(state: State) {
    this.state = state
  }
  /**
   * This can't be the `constructor`, because it relies on properties of the
   * final object and in case of sub classed instances (which is basically all
   * the instance that are going to be used) this wouldn't be set during the
   * `constructor` call, so after `super` has been called we need to explicitly
   * call `prepare`.
   */
  prepare(args: InputDynamicVariable, axis: boolean): void {
    if (
      this.state.variableListLink === null ||
      this.state.variableListCreate === null
    ) {
      throw new Error('Unexpected error: State has not been initialized')
    }

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
      this.debug = 'debug' in args ? args.debug : undefined

      if ('a' in args && typeof args.a === 'string') {
        this.state.variableListLink(args.a, this)
      }

      if ('add' in args && args.add) {
        this.createAdder(args.add)
      }

      if ('useSize' in args && args.useSize) {
        if (typeof args.useSize === 'string') {
          this.state.variableListLink(args.useSize, (this.useVari = {}))
        } else if (
          'getLinkedVariable' in args.useSize &&
          args.useSize.getLinkedVariable
        ) {
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
        this.getDefaults(args.r, 'a' in args ? args.a : undefined) &&
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
        this.realPartCalculation = this.odd('odd' in args && args.odd)
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

  saveDistance(saver: DynamicVariable) {
    this.getRealForSave = this.realPartCalculation

    return function (this: Dimension): number {
      if (this.getRealForSave === undefined) {
        throw new Error('Unexpected error: getRealForSave is undefined')
      }

      const real = this.getRealForSave()

      saver.set(real)

      return real
    }
  }

  odd(odd?: boolean) {
    this.getRealForOdd = this.realPartCalculation

    return function (this: Dimension): number {
      if (this.getRealForOdd === undefined) {
        throw new Error('Unexpected error: getRealForOdd is undefined')
      }

      const real = Math.round(this.getRealForOdd())

      return real === 0 ? 0 : (!(real % 2) === false) === odd ? real : real + 1
    }
  }

  getDefaults(r?: number, a?: number | string): boolean {
    if (r === undefined && a === undefined && this.adder === undefined) {
      this.rele = 1

      this.abs = 0

      return true
    } else {
      this.rele = r || 0

      this.abs = a || 0
    }

    return false
  }

  getQuick(): number {
    if (
      this.state.dimensionHeight === null ||
      this.state.dimensionWidth === null
    ) {
      throw new Error('Unexpected error: State has not been initialized')
    }

    if (this.rele === undefined) {
      throw new Error('Unexpected error: rele is undefined')
    }

    return (
      this.rele *
      (this.useSize
        ? this.useSize()
        : this.dim
          ? this.state.dimensionWidth
          : this.state.dimensionHeight)
    )
  }

  createAdder(
    add: ReadonlyArray<InputDynamicVariable>,
    onlyAdd?: boolean,
  ): void {
    let l = add.length

    this.adder = []

    const Size = this.dim ? Height : Width

    while (l--) {
      this.adder.push(new Size(add[l], this.state))
    }

    this[onlyAdd ? 'realPartCalculation' : 'getRealDistance'] = onlyAdd
      ? this.getRealDistanceWithCalcOnlyAdding
      : this.getRealDistanceWithCalc
  }

  getReal(): number {
    if (this.realPartCalculation === undefined) {
      throw new Error('Unexpected error: realPartCalculation is undefined')
    }

    return Math.round(this.realPartCalculation())
  }

  getRealUnrounded(): number {
    if (this.realPartCalculation === undefined) {
      throw new Error('Unexpected error: realPartCalculation is undefined')
    }

    return this.realPartCalculation()
  }

  getRealDistanceBasic = getRealDistanceBasic

  getRealDistance = getRealDistanceBasic

  getRealDistanceWithCalc(): number {
    if (this.adder === undefined) {
      throw new Error('Unexpected error: adder is undefined')
    }

    let add = 0
    let l = this.adder.length

    while (l--) {
      add += this.adder[l].getReal()
    }

    return this.getRealDistanceBasic() + add
  }

  getRealDistanceWithCalcOnlyAdding(): number {
    if (this.adder === undefined) {
      throw new Error('Unexpected error: adder is undefined')
    }

    let add = 0
    let l = this.adder.length

    while (l--) {
      add += this.adder[l].getReal()
    }

    return add
  }

  getRealDistanceWithMaxMin(
    max: InputDynamicVariable | undefined,
    min: InputDynamicVariable | undefined,
    Dim: { new (args: InputDynamicVariable, state: State): Height | Width },
  ): () => number {
    const dimMax = max && new Dim(max, this.state)
    const dimMin = min && new Dim(min, this.state)

    if (dimMax && dimMin) {
      return function (this: Dimension): number {
        let a

        const realMin = typeof dimMin === 'number' ? dimMin : dimMin.getReal()
        const realMax = typeof dimMax === 'number' ? dimMax : dimMax.getReal()

        return (a = this.getRealDistance()) > realMax
          ? realMax < realMin
            ? realMin
            : realMax
          : a < realMin
            ? realMin
            : a
      }
    }

    if (dimMax) {
      return function (this: Dimension): number {
        let a

        const realMax = typeof dimMax === 'number' ? dimMax : dimMax.getReal()

        return (a = this.getRealDistance()) > realMax ? realMax : a
      }
    }

    if (dimMin) {
      return function (this: Dimension): number {
        let a

        const realMin = typeof dimMin === 'number' ? dimMin : dimMin.getReal()

        return (a = this.getRealDistance()) < realMin ? realMin : a
      }
    }

    throw new Error('Unexpected error: max and min are both undefined')
  }

  getDim(): number | null {
    return this.dim ? this.state.dimensionWidth : this.state.dimensionHeight
  }

  dimension = true

  simplify(abs: number): void {
    this.getReal = (): number => abs
  }
}
class Distance extends Dimension {
  getDefaults(r?: number, a?: number | string): boolean {
    if (r === undefined && a === undefined) {
      this.rele = 0

      this.abs = 0

      return true
    } else {
      this.rele = r || 0

      this.abs = a || 0
    }

    return false
  }

  getQuick = (): 0 => 0

  dimension = false
}

export class Width extends Dimension {
  constructor(args: InputDynamicVariable, state: State) {
    super(state)

    this.prepare(args, true)
  }
}

export class Height extends Dimension {
  constructor(args: InputDynamicVariable, state: State) {
    super(state)

    this.prepare(args, false)
  }
}

export class DistanceX extends Distance {
  constructor(args: InputDynamicVariable, state: State) {
    super(state)

    this.prepare(args, true)
  }

  getReal(): number {
    if (this.realPartCalculation === undefined) {
      throw new Error('Unexpected error: realPartCalculation is undefined')
    }

    if (this.state.addX === null) {
      throw new Error('Unexpected error: State has not been initialized')
    }

    return Math.round(this.realPartCalculation() + this.state.addX)
  }

  fromOtherSide(size: number): number {
    if (this.realPartCalculation === undefined) {
      throw new Error('Unexpected error: realPartCalculation is undefined')
    }

    if (this.state.dimensionWidth === null || this.state.addX === null) {
      throw new Error('Unexpected error: State has not been initialized')
    }

    return (
      this.state.dimensionWidth +
      this.state.addX -
      Math.round(this.realPartCalculation() + size)
    )
  }
}

export class DistanceY extends Distance {
  constructor(args: InputDynamicVariable, state: State) {
    super(state)

    this.prepare(args, false)
  }

  getReal(): number {
    if (this.realPartCalculation === undefined) {
      throw new Error('Unexpected error: realPartCalculation is undefined')
    }

    if (this.state.addY === null) {
      throw new Error('Unexpected error: State has not been initialized')
    }

    return Math.round(this.realPartCalculation() + this.state.addY)
  }

  fromOtherSide(size: number): number {
    if (this.realPartCalculation === undefined) {
      throw new Error('Unexpected error: realPartCalculation is undefined')
    }

    if (this.state.dimensionHeight === null || this.state.addY === null) {
      throw new Error('Unexpected error: State has not been initialized')
    }

    return (
      this.state.dimensionHeight +
      this.state.addY -
      Math.round(this.realPartCalculation() + size)
    )
  }
}
