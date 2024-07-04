import type { OneD } from '../get1D'
import { createAxis } from './createAxis'
import { createPos } from './createPos'

export const getAxis = (oneD: OneD) => {
  const AxisX = createAxis(oneD.Width, oneD.DistanceX)
  const AxisY = createAxis(oneD.Height, oneD.DistanceY)
  const PosX = createPos(oneD.DistanceX)
  const PosY = createPos(oneD.DistanceY)

  return {
    X: AxisX,
    Y: AxisY,
    PosX,
    PosY,
    set(dimensions) {
      PosX.prototype.dim = dimensions.width
      PosY.prototype.dim = dimensions.height
      AxisX.prototype.dim = dimensions.width
      AxisY.prototype.dim = dimensions.height
    },
  }
}
