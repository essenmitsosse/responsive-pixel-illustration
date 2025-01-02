import Obj from './Obj'

class Panels extends Obj {
  getName = 'Panels'

  init(args) {
    let l = args.panels.length

    const inherit = {}
    const newPanels = (this.args.list = [])

    let current

    while (l--) {
      current = args.panels[l]

      if (current.sX) {
        current.sX.autoUpdate = true
      } else {
        current.sX = {}
      }

      if (current.sY) {
        current.sY.autoUpdate = true
      } else {
        current.sY = {}
      }

      newPanels.push({
        drawer: new Obj(this.state, this.drawingTools).create(
          { list: current.list },
          inherit,
        ),
        sX: current.sX,
        sY: current.sY,
      })
    }

    this.fluctuation = args.fluctuation || 0

    this.imgRatio = args.imgRatio
      ? typeof args.imgRatio === 'object'
        ? args.imgRatio
        : { ratio: args.imgRatio }
      : 1

    if (args.gutterX) {
      this.gutterSX = this.state.pixelUnit.getWidth(args.gutterX)
    }

    if (args.gutterY) {
      this.gutterSY = this.state.pixelUnit.getWidth(args.gutterY)
    }
  }

  // Draws Object, consisting of other Objects and Primitives.
  draw() {
    let countX
    let countY

    this.dimensions = this.dimensions.calc()

    this.sX = this.dimensions.width

    this.sY = this.dimensions.height

    this.gutterX = this.gutterSX.getReal()

    this.gutterY = this.gutterSY.getReal()

    this.countX = countX

    this.countY = countY

    // Find best combination of rows/cols
    this.findBestRows(this.args.list)

    const panels = this.sortRows(this.args.list)

    // calculate the finale size of the panel
    this.calcPanelsSizes(panels)

    // Draw the content of the panels
    this.drawPanels(panels, this.args.mask)
  }

  findBestRows(list) {
    let y = 0
    let x

    const l = list.length

    let current

    const imgRatio = this.imgRatio.ratio

    let last = {
      lastSquarness: Infinity,
      lastRatioDiff: imgRatio,
    }

    while ((y += 1) <= l) {
      x = Math.round(l / y)

      /** Add one to X, if it wouldn’t be enough panels */
      if (x * y < l) {
        x += 1
      }

      if (x * y - x < l) {
        current = {
          x,
          y,
          singleSXWithGutter: Math.floor((this.sX + this.gutterX) / x),
          singleSYWithGutter: Math.floor((this.sY + this.gutterY) / y),
        }

        current.singleSX = current.singleSXWithGutter - this.gutterX

        current.singleSY = current.singleSYWithGutter - this.gutterY

        current.ratio = current.singleSXWithGutter / current.singleSYWithGutter

        current.ratioDiff = Math.abs(current.ratio - imgRatio)
        // current.squareness = Math.abs( 1 - current.ratio );

        if (
          last.ratioDiff < current.ratioDiff
          // && last.squareness < current.squareness
        ) {
          break
        }

        last = current
      }
    }

    this.countX = last.x

    this.countY = last.y

    this.singleSX = last.singleSX <= 1 ? 1 : last.singleSX

    this.singleSY = last.singleSY <= 1 ? 1 : last.singleSY
  }

  sortRows(list) {
    const panels = []

    let i
    let j

    const l = list.length

    let c = l - 1
    let total = this.countX * this.countY
    let odd = true

    const priorites = [
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
    ]

    let current

    i = l

    while (i--) {
      current = list[i]

      panels.push({
        drawer: current.drawer,
        first: false,
        last: false,
        size: 1,
        sX: current.sX,
        sY: current.sY,
      })
    }

    while (total > l) {
      total -= 1

      panels[priorites.pop()].size += 1
    }

    j = this.countY

    while (j--) {
      i = this.countX

      odd = !odd

      while ((i -= (current = panels[c]).size) >= 0) {
        current.x = i

        current.y = j

        if (i === 0) {
          current.first = true
        } else if (i === this.countX - current.size) {
          current.last = true
        } else if (c === 0) {
          current.first = true

          current.x = 1
        }

        current.odd = odd

        c -= 1

        if (c < 0) {
          break
        }
      }
    }

    return panels
  }

  calcPanelsSizes(panels) {
    let c = 0

    const l = panels.length

    let currentPanel
    let x
    let y
    let size
    let currentWidth
    let first
    let width = 0
    let height = this.singleSY
    let posX = 0
    let posY = 0

    do {
      currentPanel = panels[c]

      x = currentPanel.x

      y = currentPanel.y

      size = currentPanel.size

      first = currentPanel.first

      if (first) {
        posX = x * (this.singleSX + this.gutterX)

        if (y > 0) {
          posY += height + this.gutterY

          if (y === this.countY - 1) {
            height = this.sY - posY
          }
        }
      } else {
        posX += width + this.gutterX
      }

      if (first && size === this.countX) {
        // If a single panel fills a whole row
        width = this.sX
      } else {
        if (currentPanel.last) {
          // last Panel is as wide as what’s left.
          width = this.sX - posX
        } else {
          // Calc PanelWidth and add to total.
          if (first) {
            currentWidth =
              size + (currentPanel.odd ? -this.fluctuation : this.fluctuation)
          } else {
            currentWidth = size
          }

          width = Math.round(
            currentWidth * this.singleSX + (currentWidth - 1) * this.gutterX,
          )
        }
      }

      // Update the linked sizes of the panel
      currentPanel.sX.real = width

      currentPanel.sY.real = height

      currentPanel.dimensions = {
        width,
        height,
        posX: posX + this.dimensions.posX,
        posY: posY + this.dimensions.posY,
      }
    } while ((c += 1) < l)
  }

  drawPanels(panels, mask) {
    let currentPanel
    let currentDim
    let oldMask

    const l = panels.length

    let c = 0

    do {
      currentPanel = panels[c]

      currentDim = currentPanel.dimensions

      if (mask) {
        oldMask = mask(currentDim)
      }

      this.state.pixelUnit.push(currentDim)

      currentPanel.drawer.draw()

      this.state.pixelUnit.pop()

      if (mask) {
        mask(oldMask)
      }
    } while ((c += 1) < l)
  }
}

export default Panels
