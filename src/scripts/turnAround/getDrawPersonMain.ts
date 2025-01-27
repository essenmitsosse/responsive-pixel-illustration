import BodyMain from './BodyMain'
import { recordColor } from './colors'
import getDrawHead from './getDrawHead'
import { mover } from './mover'

import type { Rotation, StateTurnAround } from './types'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

const getDrawPersonMain = (state: StateTurnAround) => {
  const _headSY = state.R(0.1, 0.4)
  const color = state.GR(1, 6) as 1 | 2 | 3 | 4 | 5 | 6

  const argsNew = {
    color: recordColor[`c${color}`],
    colorDark: recordColor[`c${color}D`],
  }

  const drawHead = getDrawHead(argsNew, state)
  const bodyMain = new BodyMain(argsNew, state)

  return (args: {
    rotate: Rotation
    sX: InputDynamicVariable
    sY: InputDynamicVariable
  }): Tool => {
    const headSY: InputDynamicVariable = { r: _headSY, useSize: args.sY }
    const neckSY: InputDynamicVariable = { a: 5 }

    const bodySY = [
      args.sY,
      { r: -1, useSize: headSY },
      { r: -1, useSize: neckSY },
      1,
    ]

    state.ll.push(headSY)

    state.ll.push(neckSY)

    state.ll.push(bodySY)

    const head = drawHead({
      sY: headSY,
      rotate: args.rotate,
    })

    const bodyMainDrawn = bodyMain.draw({
      sY: bodySY,
      rotate: args.rotate,
      fY: true,
    })

    const neckSX = {
      r: 0.5,
      useSize: head.sX,
      max: { r: 0.5, useSize: bodyMainDrawn.chest.sX },
    }

    state.ll.push(neckSX)

    const headXSide = 1

    const headFinal = mover(
      head,
      {
        sXBase: bodyMainDrawn.chest.sX,
        xBase: headXSide,
        xRel: headXSide,
        xAdd: bodyMainDrawn.chest.x,
        y: 5,
        z: 100,
      },
      state.ll,
    )

    return {
      color: argsNew.color,
      sY: args.sY,
      sX: args.sX,
      cX: true,
      fY: true,
      list: [headFinal.get, bodyMainDrawn.get],
    }
  }
}

export default getDrawPersonMain
