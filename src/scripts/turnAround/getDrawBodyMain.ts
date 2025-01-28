import drawChest from './drawChest'
import drawRotator from './drawRotator'
import LowerBody from './LowerBody'
import { mover } from './mover'

import type { Rotation } from './getOverview'
import type { DataSize, GetTool, StateTurnAround } from './types'
import type { InputDynamicVariable } from '@/helper/typeSize'

const getDrawBodyMain = (state: StateTurnAround) => {
  const _sX = state.R(0.4, 1)
  const _chestSY = state.R(0.1, 0.3)
  const chestFrontSX = state.R(0.8, 1.2)
  const lowerBody = new LowerBody()

  return (args: {
    fY?: boolean
    rotate: Rotation
    sY: InputDynamicVariable
    z?: number
  }): GetTool & { chest: DataSize } => {
    const sX = { r: _sX, useSize: args.sY }
    const chestSY = { r: _chestSY, useSize: args.sY }
    const lowerBodySY = [args.sY, { r: -1, useSize: chestSY }]

    state.ll.push(sX)

    state.ll.push(chestSY)

    state.ll.push(lowerBodySY)

    const lowerBodyDrawn = drawRotator(
      {
        drawer: lowerBody,
        id: 'lowerBody',
        rotate: args.rotate,
        baseSX: sX,
        sY: lowerBodySY,
        fY: true,
        z: 20,
      },
      state,
    )

    const chestDrawn = drawRotator(
      {
        drawer: { draw: drawChest },
        id: 'chest',
        rotate: args.rotate,
        baseSX: sX,
        frontSX: chestFrontSX,
        sY: chestSY,
        z: 40,
      },
      state,
    )

    const lowerBodyMoved = mover(
      lowerBodyDrawn,
      {
        xRel: 0,
        max: { a: 2 },
      },
      state.ll,
    )

    return {
      get: {
        sY: args.sY,
        fY: args.fY,
        z: args.z,
        list: [chestDrawn.get, lowerBodyMoved.get],
      },
      chest: chestDrawn,
    }
  }
}

export default getDrawBodyMain
