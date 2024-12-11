import { helper } from '@/renderengine/helper.js'

function randomDistribution(init) {
  var random = helper.random(init.id),
    backgroundColor = [0, 0, 0],
    width = { main: true },
    height = { main: true, height: true },
    square = { r: 1, useSize: width, max: height },
    biggerSquare = { r: 1, useSize: width, min: height },
    linkList = [width, height, square, biggerSquare],
    renderList,
    backgroundGrid = true,
    minSize = random.getRandomFloat(0, 0.8),
    maxSize = random.getRandomFloat(minSize, 1),
    minR = random.getRandom(0, 200),
    maxR = random.getRandom(minR, 255),
    minG = random.getRandom(0, 200),
    maxG = random.getRandom(minG, 255),
    minB = random.getRandom(0, 200),
    maxB = random.getRandom(minB, 255)

  renderList = (function () {
    var count = random.getRandom(5, 20),
      s_ = 1 / (count - 1),
      row = count,
      col,
      s,
      list = [],
      getSquare = function () {
        var innerS

        linkList.push(
          (innerS = {
            r: random.getRandomFloat(minSize, maxSize),
            useSize: s,
            odd: true,
            test: true,
          }),
        )

        list.push({
          s: [s, -1],
          color: [
            random.getRandomFloat(minR, maxR),
            random.getRandomFloat(minG, maxG),
            random.getRandomFloat(minB, maxB),
          ],
          x: { r: row, useSize: s },
          y: { r: col, useSize: s },
          list: [
            {
              c: true,
              s: innerS,
            },
          ],
        })
      }

    linkList.push((s = { r: s_, useSize: biggerSquare, odd: true }))

    // Background Grid
    if (backgroundGrid) {
      list.push({
        stripes: { gap: 1 },
        list: [
          {
            color: [50, 50, 50],
            stripes: { gap: 1, horizontal: true },
          },
        ],
      })
    }

    while (row--) {
      col = count

      while (col--) {
        getSquare()
      }
    }

    return list
  })()

  return {
    renderList,
    linkList,
    background: backgroundColor,
  }
}

export default randomDistribution
