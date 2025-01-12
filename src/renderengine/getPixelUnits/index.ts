import getIsUnknownObject from '@/lib/getIsUnknownObject'

import { Dimensions, PosX, PosY } from './Position'
import { Height, Width } from './Size'

import type { ParameterDimension } from './Position'
import type { State } from './State'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { DynamicVariable } from '@/renderengine/Variable'

type DataDimensionContext = {
  height: number
  posX?: number
  posY?: number
  width: number
}

export type Position = (
  args: {
    center?: boolean
    centerX?: boolean
    centerY?: boolean
    fX?: boolean
    fY?: boolean
    toLeft?: boolean
    toTop?: boolean
    x?: InputDynamicVariable
    y?: InputDynamicVariable
  },
  reflectX: boolean,
  reflectY: boolean,
  rotate: boolean,
) => () => { x: number; y: number }

const getPixelUnits = (): {
  Position: Position
  createSize: (
    args: InputDynamicVariable & { height?: boolean },
  ) => Height | Width
  getDimensions: (
    args: ParameterDimension,
    fromRight: boolean,
    fromBottom: boolean,
    rotate: boolean,
  ) => Dimensions
  getHeight: (args: InputDynamicVariable) => Height
  getWidth: (args: InputDynamicVariable) => Width
  init: (dimensions: DataDimensionContext) => void
  linkList: (
    calc: (dimensions: { height: number; width: number }) => void,
  ) => void
  pop: () => void
  push: (dimensions: DataDimensionContext) => void
  setList: (
    listLink: (name: string, vari: { abs?: number | string }) => void,
    listCreate: (name: string) => DynamicVariable,
    updater: () => void,
  ) => void
} => {
  const old: Array<DataDimensionContext> = []

  const state: State = {
    variableListLink: null,
    variableListCreate: null,
    updateList: null,
    calculateList: null,
    dimensionWidth: null,
    dimensionHeight: null,
    addX: null,
    addY: null,
  }

  const createSize = function (
    args: InputDynamicVariable & { height?: boolean },
  ): Height | Width {
    if (args === undefined) {
      throw new Error('Unexpected Error: args is not defined')
    }

    return getIsUnknownObject(args) && args.height
      ? new Height(args, state)
      : new Width(args, state)
  }

  const oneDSet = (dimensions: DataDimensionContext): void => {
    const x = dimensions.posX || 0
    const y = dimensions.posY || 0

    state.addX = x

    state.addY = y

    state.dimensionWidth = dimensions.width

    state.dimensionHeight = dimensions.height
  }

  const Position: Position = (args, reflectX, reflectY, rotate) => {
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
    getDimensions: (args, fromRight, fromBottom, rotate): Dimensions =>
      new Dimensions(args, fromRight, fromBottom, rotate, state),
    createSize,
    getWidth: (args): Width => new Width(args, state),
    getHeight: (args): Height => new Height(args, state),
    setList: (
      listLink: (name: string, vari: { abs?: number | string }) => void,
      listCreate: (name: string) => DynamicVariable,
      updater: () => void,
    ): void => {
      state.variableListLink = listLink

      state.variableListCreate = listCreate

      state.updateList = updater
    },
    linkList: (calc): void => {
      state.calculateList = calc
    },
    init: (dimensions): void => {
      oneDSet(dimensions)

      if (state.calculateList) {
        state.calculateList(dimensions)
      }

      if (state.updateList) {
        state.updateList()
      }
    },
    pop: (): void => {
      const o = old[old.length - 2]

      if (o) {
        oneDSet(o)

        old.pop()
      }
    },
    push: (dimensions): void => {
      oneDSet(dimensions)

      old.push(dimensions)
    },
  }
}

export default getPixelUnits
