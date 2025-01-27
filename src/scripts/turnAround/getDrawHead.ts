import drawRotator from './drawRotator'
import HeadBottom from './HeadBottom'
import HeadTop from './HeadTop'
import Nose from './Nose'

import type { Rotation } from './getOverview'
import type { DataRotation, DataSize, GetTool, StateTurnAround } from './types'
import type { ColorRgb } from '@/helper/typeColor'
import type { InputDynamicVariable } from '@/helper/typeSize'

type ArgsHead = {
  color: ColorRgb
  colorDark: ColorRgb
}

const getDrawHead = (args: ArgsHead, state: StateTurnAround) => {
  const _sX = state.R(0.4, 1.8)
  const headSideRatio = state.R(0.5, 1.5)
  const headTopFrontSX = state.R(0.5, 1.5)
  const headTopSideSX = headTopFrontSX + state.R(-0.2, 0.2)
  const wideJaw = headSideRatio > headTopSideSX
  const headTopSY = state.R(0.2, 0.8)
  const headTop = new HeadTop(args, state)
  const headBottom = new HeadBottom(args)
  const nose = new Nose(args)

  return (argsDraw: {
    rotate: Rotation
    sX?: InputDynamicVariable
    sY?: InputDynamicVariable
  }): DataRotation & DataSize & GetTool => {
    const sX = { r: _sX, useSize: argsDraw.sY }

    state.ll.push(sX)

    const headBottomRotated = drawRotator(
      {
        drawer: headBottom,
        id: 'lowerHead',
        rotate: argsDraw.rotate,
        baseSX: sX,
        sY: { r: headTopSY, useSize: argsDraw.sY },
        fY: true,
        roundTop: true,
        roundBottom: true,
      },
      state,
    )

    const headTopRotated = drawRotator(
      {
        drawer: headTop,
        id: 'topHead',
        rotate: argsDraw.rotate,
        baseSX: sX,
        frontSX: headTopFrontSX,
        sY: { add: [{ r: -1, useSize: headBottomRotated.sY }, argsDraw.sY, 2] },
        roundTop: true,
        roundBottom: true,
      },
      state,
    )

    const noseRotated = drawRotator(
      {
        drawer: nose,
        id: 'nose',
        rotate: argsDraw.rotate,
        baseSX: sX,
        frontSX: 0.1,
        sY: { a: 2 },
        y: [headTopRotated.sY, -2],
        z: 500,
        side: {
          sXBase: (wideJaw ? headTopRotated : headBottomRotated).sX,
          xBase: 1,
          xRel: 1,
        },
      },
      state,
    )

    return {
      get: {
        color: args.color,
        sY: argsDraw.sY,
        list: [headTopRotated.get, headBottomRotated.get, noseRotated.get],
      },
      sX: headBottomRotated.sX,
      sY: argsDraw.sY,
      rotate: argsDraw.rotate,
    }
  }
}

export default getDrawHead
