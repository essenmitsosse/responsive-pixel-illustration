import { get1D } from './get1D'
import { getAxis } from './getAxis'
import { get2D } from './get2D'

export const getPixelUnits = () => {
  const old = []

  let updateList
  let calculateList
  const context = {}

  const oneD = get1D(context)
  const Axis = getAxis(oneD)
  const twoD = get2D(Axis)

  return {
    Position: twoD.Position,
    Dimensions: twoD.Dimensions,
    createSize: oneD.createSize,
    Width: oneD.Width,
    Height: oneD.Height,
    setList(args) {
      context.variableListLink = args.variableListLink
      context.variableListCreate = args.variableListCreate
      updateList = args.updateList
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
