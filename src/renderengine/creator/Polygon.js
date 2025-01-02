import Line from './Line'

const getLineEdgeGetter = function (edgeList) {
  let i = -1

  return function (p0, p1) {
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

const getDrawRow = function (set) {
  return function (p0, p1) {
    do {
      set(p0.x0, p1.y)
    } while ((p0.x0 += 1) <= p1.x1)
  }
}

const sortFunction = function (a, b) {
  const n = b.y - a.y

  if (n !== 0) {
    return n
  }

  return b.x0 - a.x0
}

class Polygon extends Line {
  getName = 'Polygon'

  draw() {
    // Draw all Lines
    const edgeList = []
    const colorArraySet = this.getColorArray()
    const drawRow = getDrawRow(colorArraySet)
    const getLineEdge = getLineEdgeGetter(edgeList)
    const p = this.args.points

    let l = this.args.LineCount
    let nextPoint = p[l](true)

    const firstPoint = nextPoint

    while (l--) {
      nextPoint = getLineEdge(nextPoint, p[l](true))
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