import Primitive from './Primitive'

import type { ArgsPrepare } from './Primitive'
import type { InputDynamicVariable } from '@/helper/typeSize'

type LineSetter = (x: number, y: number) => void

export type ArgsInitLine = {
  closed?: boolean
  weight?: InputDynamicVariable
}

const getDrawLine =
  (set: LineSetter) =>
  (
    p0: { x: number; y: number },
    p1: { x: number; y: number },
  ): { x: number; y: number } => {
    // Draw a single Lines
    let x0
    let y0
    let x1
    let y1
    let err
    let e2

    if (isNaN(p0.x) || isNaN(p0.y) || isNaN(p1.x) || isNaN(p1.y)) {
      throw new Error(`Line with NaN found!, ${JSON.stringify({ p0, p1 })}`)
    }

    if (p0.x > p1.x) {
      x1 = p0.x

      y1 = p0.y

      x0 = p1.x

      y0 = p1.y
    } else {
      x0 = p0.x

      y0 = p0.y

      x1 = p1.x

      y1 = p1.y
    }

    const dx = Math.abs(x1 - x0)
    const dy = -Math.abs(y1 - y0)
    const sy = y0 < y1 ? 1 : -1

    err = dx + dy

    while (true) {
      set(x0, y0)

      if (x0 === x1 && y0 === y1) {
        return p1
      }

      e2 = 2 * err

      if (e2 > dy) {
        err += dy

        x0 += 1
      }

      if (e2 < dx) {
        err += dx

        y0 += sy
      }
    }
  }

class Line extends Primitive {
  closed?: boolean
  lineSetter?: () => LineSetter
  points?: Array<() => { x: number; y: number }>

  init(args: ArgsInitLine): void {
    if (args.closed) {
      this.closed = true
    }

    this.lineSetter = this.getLineSetter(args.weight)
  }

  getLineSetter(weight?: InputDynamicVariable): () => LineSetter {
    const w = weight ? this.state.pixelUnit.createSize(weight) : null

    return w
      ? function (this: Line) {
          const thisW = w.getReal()
          const first = -Math.round(thisW / 2)
          const second = Math.round(thisW + first)
          const that = this

          return (x, y) => {
            if (that.getColorArray === undefined) {
              throw new Error('Unexpected error: getColorArray is undefined')
            }

            let i = first
            let j

            while ((i += 1) <= second) {
              j = first

              while ((j += 1) <= second) {
                that.getColorArray(x + i, y + j)
              }
            }
          }
        }
      : (): ((x: number, y: number) => void) => {
          if (this.getColorArray === undefined) {
            throw new Error('Unexpected error: getColorArray is undefined')
          }

          return this.getColorArray
        }
  }

  prepareSizeAndPos(
    args: ArgsPrepare,
    reflectX: boolean,
    reflectY: boolean,
    rotate: boolean,
  ): void {
    if (args.points === undefined) {
      throw new Error('Unexpected error: args.points is undefined')
    }

    reflectX = (args.rX || false) !== reflectX

    reflectY = (args.rY || false) !== reflectY

    const newPoints = args.points
      .toReversed()
      .map((point) =>
        this.state.pixelUnit.Position(point, reflectX, reflectY, rotate),
      )

    this.points = newPoints
  }

  draw(): void {
    if (this.args === undefined) {
      throw new Error('Unexpected error: args is undefined')
    }

    if (this.points === undefined) {
      throw new Error('Unexpected error: args.points is undefined')
    }

    if (this.lineSetter === undefined) {
      throw new Error('Unexpected error: lineSetter is undefined')
    }

    // Draw all Lines

    const drawLine = getDrawLine(this.lineSetter())
    // Draw all Lines
    const pointsCalculated = this.points.toReversed().map((point) => point())

    pointsCalculated.forEach((point, index, pointsReversed) => {
      if (index === 0) {
        return
      }

      drawLine(pointsReversed[index - 1]!, point)
    })

    if (this.closed) {
      drawLine(pointsCalculated.at(0)!, pointsCalculated.at(-1)!)
    }
  }
}

export default Line
