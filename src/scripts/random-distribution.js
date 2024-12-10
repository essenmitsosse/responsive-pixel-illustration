import { helper } from '@/renderengine/helper.js'

function randomDistribution(init) {
  var help = helper,
    random = help.random(init.id),
    rInt = random.getRandom,
    rFl = random.getRandomFloat,
    backgroundColor = [0, 0, 0],
    width = { main: true },
    height = { main: true, height: true },
    square = { r: 1, useSize: width, max: height },
    biggerSquare = { r: 1, useSize: width, min: height },
    linkList = [width, height, square, biggerSquare],
    renderList,
    backgroundGrid = true,
    minSize = rFl(0, 0.8),
    maxSize = rFl(minSize, 1),
    minR = rInt(0, 200),
    maxR = rInt(minR, 255),
    minG = rInt(0, 200),
    maxG = rInt(minG, 255),
    minB = rInt(0, 200),
    maxB = rInt(minB, 255)

  renderList = (function () {
    console.log(random)
    var count = rInt(5, 20),
      s_ = 1 / (count - 1),
      row = count,
      col,
      s,
      list = [],
      getSquare = function () {
        var innerS

        linkList.push(
          (innerS = {
            r: rFl(minSize, maxSize),
            useSize: s,
            odd: true,
            test: true,
          }),
        )

        list.push({
          s: [s, -1],
          color: [rFl(minR, maxR), rFl(minG, maxG), rFl(minB, maxB)],
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
    renderList: renderList,
    linkList: linkList,
    background: backgroundColor,
  }
}

export default randomDistribution
