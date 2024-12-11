import { helper } from '@/renderengine/helper.js'

function randomDistribution(init) {
  let random = helper.random(init.id)
  let backgroundColor = [0, 0, 0]
  let width = { main: true }
  let height = { main: true, height: true }
  let square = { r: 1, useSize: width, max: height }
  let biggerSquare = { r: 1, useSize: width, min: height }
  let linkList = [width, height, square, biggerSquare]
  let renderList
  let backgroundGrid = true
  let minSize = random.getRandomFloat(0, 0.8)
  let maxSize = random.getRandomFloat(minSize, 1)
  let minR = random.getRandom(0, 200)
  let maxR = random.getRandom(minR, 255)
  let minG = random.getRandom(0, 200)
  let maxG = random.getRandom(minG, 255)
  let minB = random.getRandom(0, 200)
  let maxB = random.getRandom(minB, 255)

  renderList = (function () {
    let count = random.getRandom(5, 20)
    let s_ = 1 / (count - 1)
    let row = count
    let col
    let s
    let list = []

    let getSquare = function () {
      let innerS

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
