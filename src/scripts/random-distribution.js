import { getRandom } from '@/helper/helper'

function randomDistribution(init) {
  const random = getRandom(init.id)
  const backgroundColor = [0, 0, 0]
  const width = { main: true }
  const height = { main: true, height: true }
  const square = { r: 1, useSize: width, max: height }
  const biggerSquare = { r: 1, useSize: width, min: height }
  const linkList = [width, height, square, biggerSquare]
  const backgroundGrid = true
  const minSize = random.getRandomFloat(0, 0.8)
  const maxSize = random.getRandomFloat(minSize, 1)
  const minR = random.getRandom(0, 200)
  const maxR = random.getRandom(minR, 255)
  const minG = random.getRandom(0, 200)
  const maxG = random.getRandom(minG, 255)
  const minB = random.getRandom(0, 200)
  const maxB = random.getRandom(minB, 255)
  const renderList = (function () {
    const count = random.getRandom(5, 20)
    const s_ = 1 / (count - 1)

    let row = count
    let col
    let s

    const list = []
    const getSquare = function () {
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
