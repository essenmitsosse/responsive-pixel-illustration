import Line from './Line'

type EdgeList = Array<{ x0: number; x1?: number; y: number }>

const getLineEdgeGetter = (edgeList: EdgeList) => {
  let i = -1

  return (
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
    let first

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

    // if( y0 === y1 ) { // Skip if horizontal Line
    // 	edgeList[ i += 1 ] = { x0: x0, x1:x0, y: y0 };
    // 	edgeList[ i += 1 ] = { x0: x1, x1:x1, y: y0 };
    // 	return p1;
    // }

    const dx = Math.abs(x1 - x0)
    const dy = -Math.abs(y1 - y0)
    const sy = y0 < y1 ? 1 : -1

    err = dx + dy

    e2 = 2 * err

    first = sy === -1

    const last = !first

    if (first) {
      edgeList[(i += 1)] = { x0, y: y0 }
    }

    while (true) {
      if (x0 === x1 && y0 === y1) {
        // Add List Point and Break
        if (last) {
          edgeList[i].x1 = x0
        } else {
          i -= 1

          edgeList.pop()
        }

        return p1
      }

      if (e2 < dx) {
        if (first) {
          edgeList[i].x1 = x0
        } else {
          first = true
        }

        edgeList[(i += 1)] = {
          x0: x0 + (dx ? 1 : 0),
          y: (y0 += sy),
        }

        err += dx

        e2 = 2 * err
      } else if (e2 > dy) {
        err += dy

        x0 += 1

        e2 = 2 * err
      }
    }
  }
}

const getDrawRow =
  (set: (x: number, y: number) => void) =>
  (p0: { x0: number; y: number }, p1: { x1?: number; y: number }): void => {
    if (p1.x1 === undefined) {
      throw new Error('Unexpected error: edgeList[l].x1 is undefined')
    }

    do {
      set(p0.x0, p1.y)
    } while ((p0.x0 += 1) <= p1.x1)
  }

const sortFunction = (
  a: { x0: number; y: number },
  b: { x0: number; y: number },
): number => {
  const n = b.y - a.y

  if (n !== 0) {
    return n
  }

  return b.x0 - a.x0
}

class Polygon extends Line {
  draw(): void {
    if (this.points === undefined) {
      throw new Error('Unexpected error: args.points is undefined')
    }

    if (this.lineCount === undefined) {
      throw new Error('Unexpected error: args.LineCount is undefined')
    }

    if (this.getColorArray === undefined) {
      throw new Error('Unexpected error: getColorArray is undefined')
    }

    // Draw all Lines
    const edgeList: EdgeList = []
    const drawRow = getDrawRow(this.getColorArray)
    const getLineEdge = getLineEdgeGetter(edgeList)

    let l = this.lineCount
    let nextPoint = this.points[l]()

    const firstPoint = nextPoint

    while (l--) {
      nextPoint = getLineEdge(nextPoint, this.points[l]())
    }

    //  Close the Polygon
    getLineEdge(nextPoint, firstPoint)

    l = edgeList.sort(sortFunction).length

    while ((l -= 2) >= 0) {
      drawRow(edgeList[l + 1], edgeList[l])
    }
  }
}

export default Polygon
