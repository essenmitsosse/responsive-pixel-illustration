import Primitive from './Primitive'

import type { Tool } from './Primitive'

type LineSetter = (x: number, y: number) => void

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
      throw new Error(`Line with NaN found!, ${{ p0, p1 }}`)
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
  lineSetter?: () => LineSetter
  init(args: { closed?: boolean; weight: number }): void {
    if (args.closed) {
      if (this.args === undefined) {
        throw new Error('Unexpected error: args is undefined')
      }

      this.args.closed = true
    }

    this.lineSetter = this.getLineSetter(args.weight)
  }

  getLineSetter(weight: number): () => LineSetter {
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
    args: Tool,
    reflectX: boolean,
    reflectY: boolean,
    rotate: boolean,
  ): {
    LineCount: number
    points: Array<() => { x: number; y: number }>
  } {
    if (args.points === undefined) {
      throw new Error('Unexpected error: args.points is undefined')
    }

    const newPoints = []

    let l = args.points.length

    reflectX = (args.rX || false) !== reflectX

    reflectY = (args.rY || false) !== reflectY

    while (l--) {
      newPoints.push(
        this.state.pixelUnit.Position(
          args.points[l],
          reflectX,
          reflectY,
          rotate,
        ),
      )
    }

    return {
      points: newPoints,
      LineCount: newPoints.length - 1,
    }
  }

  draw(): void {
    if (this.args === undefined) {
      throw new Error('Unexpected error: args is undefined')
    }

    if (this.args.points === undefined) {
      throw new Error('Unexpected error: args.points is undefined')
    }

    if (this.lineSetter === undefined) {
      throw new Error('Unexpected error: lineSetter is undefined')
    }

    if (this.args.LineCount === undefined) {
      throw new Error('Unexpected error: args.LineCount is undefined')
    }

    // Draw all Lines
    const p = this.args.points

    let l = this.args.LineCount
    let nextPoint = p[l]()

    const firstPoint = this.args.closed ? nextPoint : false
    const drawLine = getDrawLine(this.lineSetter())

    while (l--) {
      nextPoint = drawLine(nextPoint, p[l]())
    }

    if (firstPoint) {
      drawLine(nextPoint, firstPoint)
    }
  }
}

export default Line
