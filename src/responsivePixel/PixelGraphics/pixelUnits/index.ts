import { get1D, OneD } from './get1D'
import { getAxis } from './getAxis'
import { get2D } from './get2D'
import type { ImageFunction, Size, Variable as VariableType } from '../types'
import { Variable } from '../Variable'

const getLinkedVariable = (variable: Size) => () => {
  if (!variable.calculated) {
    /* eslint-disable-next-line no-param-reassign */
    variable.calculated = true
    /* eslint-disable-next-line no-param-reassign */
    variable.real = variable.s.getReal()
  }
  return variable.real
}

const prepareVariableList = (variableListInput, variableList, oneD: OneD) => {
  Object.entries(variableListInput).forEach(([key, value]) => {
    variableList[key] = new Variable(value, key, oneD)
  })
}

const prepareLinkList = (linkList: ReadonlyArray<Size>, oneD: OneD) => {
  linkList.forEach((current) => {
    if (!current.s) {
      if (!current.autoUpdate) {
        /* eslint-disable-next-line no-param-reassign */
        current.autoUpdate = false
        /* eslint-disable-next-line no-param-reassign */
        current.s = oneD.createSize(current)
      } else {
        /* eslint-disable-next-line no-param-reassign */
        current.calculated = true
      }
      /* eslint-disable-next-line no-param-reassign */
      current.getLinkedVariable = getLinkedVariable(current)
    }
  })
}

const updateLinkList = (linkList: ReadonlyArray<Size>, dimensions) => {
  linkList.forEach((current) => {
    if (current.main) {
      /* eslint-disable-next-line no-param-reassign */
      current.calculated = true
      /* eslint-disable-next-line no-param-reassign */
      current.real = dimensions[current.height ? 'height' : 'width']
    } else {
      /* eslint-disable-next-line no-param-reassign */
      current.calculated = current.autoUpdate
    }
  })
}

const updateVariableList = (variableList: Record<string, VariableType>) => {
  Object.values(variableList).forEach((value) => {
    value.set()
  })
}

export const getPixelUnits = (args: { imageFunction: ImageFunction }) => {
  const variableList = {}
  const oneD = get1D(variableList)
  const Axis = getAxis(oneD)
  const twoD = get2D(Axis)

  if (args.imageFunction.variableList) {
    prepareVariableList(args.imageFunction.variableList, variableList, oneD)
  }

  if (args.imageFunction.linkList) {
    prepareLinkList(args.imageFunction.linkList, oneD)
  }

  const old = []

  return {
    Position: twoD.Position,
    Dimensions: twoD.Dimensions,
    createSize: oneD.createSize,
    Width: oneD.Width,
    Height: oneD.Height,
    init(dimensions) {
      oneD.set(dimensions)
      Axis.set(dimensions)
      if (args.imageFunction.linkList) {
        updateLinkList(args.imageFunction.linkList, dimensions)
      }
      if (args.imageFunction.variableList) {
        updateVariableList(variableList)
      }
    },
    pop() {
      const o = old[old.length - 2]
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

export type PixelUnit = ReturnType<typeof getPixelUnits>
