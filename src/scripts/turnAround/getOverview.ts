import { colorWhite } from './colors'
import drawRotateInfo from './drawRotateInfo'
import getDrawPersonMain from './getDrawPersonMain'

import type { Rotate, Rotation, StateTurnAround } from './types'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

const getRotation = (rotate: number): Rotate => {
  if (rotate > 180) {
    rotate -= 360
  } else if (rotate < -180) {
    rotate += 360
  }

  return {
    real: (rotate = rotate / 90),
    abs: 1 - Math.abs(rotate),
  }
}

const calcRotation = (rotate: number): Rotation => {
  let realRotation = rotate - 45

  if (realRotation > 180) {
    realRotation -= 360
  } else if (realRotation < -180) {
    realRotation += 360
  }

  if (rotate > 360) {
    rotate -= 360
  } else if (rotate < -360) {
    rotate += 360
  }

  const rad = (realRotation * Math.PI) / 180
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  const front = Math.abs(Math.abs(rotate - 180) - 90) / 90

  return {
    FL: getRotation(realRotation),
    FR: getRotation(realRotation + 90),
    BL: getRotation(realRotation - 90),
    BR: getRotation(realRotation + 180),
    position: (sin + cos) / (Math.sin(Math.PI * 0.25) * 2),
    sin,
    cos,
    rotate,
    turnedAway: rotate > 90 && rotate < 270 ? -1 : 1,
    front,
    side: 1 - front,
  }
}

const getOverview = (
  init: {
    inner?: number
    rotate?: number
    rows?: number
    vari?: number
  },
  state: StateTurnAround,
): ReadonlyArray<Tool> => {
  const rows = init.rows || 2
  const vari = init.vari || 3
  const reps = Math.round(rows / vari / 0.55)
  const cols = reps === 0 ? vari : vari * reps
  const inner = init.inner ? init.inner : 0.8
  const outerSX = { r: 1 / cols }
  const outerSY = { r: 1 / rows, height: true }

  const innerS = {
    r: inner,
    useSize: outerSX,
    max: { r: inner, useSize: outerSY },
    odd: true,
  }

  state.ll.push(outerSX, outerSY, innerS)

  const rotations: ReadonlyArray<Rotation> = new Array(vari)
    .fill(null)
    .map((_, index) => calcRotation((init.rotate || 0) + (180 / vari) * index))

  const list: ReadonlyArray<Tool> = new Array(reps).fill(null).flatMap(
    (_, k): ReadonlyArray<Tool> =>
      new Array(rows).fill(null).flatMap((_, j): ReadonlyArray<Tool> => {
        const personMainDraw = getDrawPersonMain(state)

        return rotations.map(
          (rotate, i): Tool => ({
            sX: outerSX,
            sY: outerSY,
            x: { r: i + k * vari, useSize: outerSX },
            y: { r: j, useSize: outerSY },
            fY: true,
            list: [
              {
                color: [(255 / rows) * j, (255 / vari) * i, 0],
                z: -Infinity,
              },
              {
                s: innerS,
                color: colorWhite,
                cX: true,
                fY: true,
                z: -Infinity,
              },
              personMainDraw({
                sX: innerS,
                sY: innerS,
                rotate,
              }),
            ],
          }),
        )
      }),
  )

  return [...list, drawRotateInfo(rotations[0]!, state)]
}

export default getOverview
