import { AxisX, AxisY, Dimensions, PosX, PosY } from './Position'
import { Height, Width } from './Size'

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
