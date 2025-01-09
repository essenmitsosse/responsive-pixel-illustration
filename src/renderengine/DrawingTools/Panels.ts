import Obj from './Obj'

import type { Location } from './createPixelArray'
import type { ArgsInit, Tool } from './Primitive'
import type {
  InputDynamicVariable,
  InputDynamicVariableBase,
} from '@/helper/typeSize'
import type { Height, Width } from '@/renderengine/getPixelUnits/Size'
import type { Link } from '@/scripts/listImage'

type PanelInput = {
  list: ReadonlyArray<Tool>
  sX?: InputDynamicVariableBase & Link
  sY?: InputDynamicVariableBase & Link
}

export type PanelPre = {
  dimensions?: Location
  drawer: Obj
  sX: InputDynamicVariable & Link
  sY: InputDynamicVariable & Link
}

type PanelSorted = PanelPre & {
  first: boolean
  last: boolean
  odd?: boolean
  size: number
  x?: number
  y?: number
}

type ArgsPanels = ArgsInit & {
  fluctuation?: number
  gutterX?: InputDynamicVariable
  gutterY?: InputDynamicVariable
  imgRatio?: { ratio: number }
  panels: Array<PanelInput>
}

class Panels extends Obj {
  gutterSX?: Width
  gutterSY?: Height
  imgRatio?: { ratio: number }
  listPanels?: ReadonlyArray<PanelPre>
  fluctuation?: number
  sX?: number
  sY?: number
  gutterX?: number
  gutterY?: number
  countX?: number
  countY?: number
  singleSX?: number
  singleSY?: number
  init(args: ArgsPanels): void {
    if (this.args === undefined) {
      throw new Error('Unexpected error: args is undefined')
    }

    const inherit = {}

    this.args.listPanels = args.panels.toReversed().map((current) => {
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

      return {
        drawer: new Obj(this.state, this.recordDrawingTools).create(
          { list: current.list },
          inherit,
        ),
        sX: current.sX,
        sY: current.sY,
      }
    })

    this.fluctuation = args.fluctuation || 0

    this.imgRatio = args.imgRatio
      ? typeof args.imgRatio === 'object'
        ? args.imgRatio
        : { ratio: args.imgRatio }
      : undefined

    if (args.gutterX) {
      this.gutterSX = this.state.pixelUnit.getWidth(args.gutterX)
    }

    if (args.gutterY) {
      this.gutterSY = this.state.pixelUnit.getWidth(args.gutterY)
    }
  }

  // Draws Object, consisting of other Objects and Primitives.
  draw(): void {
    if (this.dimensions === undefined) {
      throw new Error('Unexpected error: dimensions is undefined')
    }

    if (this.gutterSX === undefined) {
      throw new Error('Unexpected error: gutterSX is undefined')
    }

    if (this.gutterSY === undefined) {
      throw new Error('Unexpected error: gutterSY is undefined')
    }

    if (this.args === undefined) {
      throw new Error('Unexpected error: args is undefined')
    }

    this.dimensions = this.dimensions.calc()

    this.sX = this.dimensions.width

    this.sY = this.dimensions.height

    this.gutterX = this.gutterSX.getReal()

    this.gutterY = this.gutterSY.getReal()

    // Find best combination of rows/cols
    this.findBestRows()

    const panels = this.sortRows()

    // calculate the finale size of the panel
    this.calcPanelsSizes(panels)

    // Draw the content of the panels
    this.drawPanels(panels, this.args.mask)
  }

  findBestRows(): void {
    if (this.args === undefined) {
      throw new Error('Unexpected error: args is undefined')
    }

    if (this.args.listPanels === undefined) {
      throw new Error('Unexpected error: args.listPanels is undefined')
    }

    if (this.imgRatio === undefined) {
      throw new Error('Unexpected error: imgRatio is undefined')
    }

    if (this.sX === undefined) {
      throw new Error('Unexpected error: sX is undefined')
    }

    if (this.sY === undefined) {
      throw new Error('Unexpected error: sY is undefined')
    }

    if (this.gutterX === undefined) {
      throw new Error('Unexpected error: gutterX is undefined')
    }

    if (this.gutterY === undefined) {
      throw new Error('Unexpected error: gutterY is undefined')
    }

    let y = 0
    let x

    const l = this.args.listPanels.length

    type Data = {
      ratio: number
      ratioDiff: number
      singleSX: number
      singleSXWithGutter: number
      singleSY: number
      singleSYWithGutter: number
      x: number
      y: number
    }

    const imgRatio = this.imgRatio.ratio

    let last: Data | undefined = undefined

    while ((y += 1) <= l) {
      x = Math.round(l / y)

      /** Add one to X, if it wouldn’t be enough panels */
      if (x * y < l) {
        x += 1
      }

      if (x * y - x < l) {
        const singleSXWithGutter = Math.floor((this.sX + this.gutterX) / x)
        const singleSYWithGutter = Math.floor((this.sY + this.gutterY) / y)
        const ratio = singleSXWithGutter / singleSYWithGutter

        const current: Data = {
          x,
          y,
          singleSXWithGutter,
          singleSYWithGutter,
          singleSX: singleSXWithGutter - this.gutterX,
          singleSY: singleSYWithGutter - this.gutterY,
          ratio,
          ratioDiff: Math.abs(ratio - imgRatio),
        }

        if (
          last &&
          last.ratioDiff < current.ratioDiff
          // && last.squareness < current.squareness
        ) {
          break
        }

        last = current
      }
    }

    if (last === undefined) {
      return
    }

    this.countX = last.x

    this.countY = last.y

    this.singleSX = last.singleSX <= 1 ? 1 : last.singleSX

    this.singleSY = last.singleSY <= 1 ? 1 : last.singleSY
  }

  sortRows(): ReadonlyArray<PanelSorted> {
    if (this.args === undefined) {
      throw new Error('Unexpected error: args is undefined')
    }

    if (this.args.listPanels === undefined) {
      throw new Error('Unexpected error: args.listPanels is undefined')
    }

    if (this.countX === undefined) {
      throw new Error('Unexpected error: countX is undefined')
    }

    if (this.countY === undefined) {
      throw new Error('Unexpected error: countY is undefined')
    }

    let i
    let j

    const l = this.args.listPanels.length

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

    const panels: Array<PanelSorted> = this.args.listPanels
      .toReversed()
      .map((current) => ({
        drawer: current.drawer,
        first: false,
        last: false,
        size: 1,
        sX: current.sX,
        sY: current.sY,
      }))

    while (total > l) {
      total -= 1

      const priority = priorites.pop()

      if (priority === undefined) {
        throw new Error('Unexpected error: no more priorities')
      }

      panels[priority].size += 1
    }

    j = this.countY

    while (j--) {
      i = this.countX

      odd = !odd

      let current

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

  calcPanelsSizes(panels: ReadonlyArray<PanelSorted>): void {
    if (this.singleSX === undefined) {
      throw new Error('Unexpected error: singleSX is undefined')
    }

    if (this.singleSY === undefined) {
      throw new Error('Unexpected error: singleSY is undefined')
    }

    if (this.countX === undefined) {
      throw new Error('Unexpected error: countX is undefined')
    }

    if (this.countY === undefined) {
      throw new Error('Unexpected error: countY is undefined')
    }

    if (this.fluctuation === undefined) {
      throw new Error('Unexpected error: fluctuation is undefined')
    }

    if (this.sX === undefined) {
      throw new Error('Unexpected error: sX is undefined')
    }

    if (this.sY === undefined) {
      throw new Error('Unexpected error: sY is undefined')
    }

    if (this.gutterX === undefined) {
      throw new Error('Unexpected error: gutterX is undefined')
    }

    if (this.gutterY === undefined) {
      throw new Error('Unexpected error: gutterY is undefined')
    }

    if (this.dimensions === undefined) {
      throw new Error('Unexpected error: dimensions is undefined')
    }

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

      if (x === undefined) {
        throw new Error('Unexpected error: x is undefined')
      }

      if (y === undefined) {
        throw new Error('Unexpected error: y is undefined')
      }

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

      if (currentPanel === undefined) {
        throw new Error('Unexpected error: currentPanel is undefined')
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

  drawPanels(
    panels: ReadonlyArray<PanelSorted>,
    mask: ((dimensions: Location, push?: boolean) => Location) | undefined,
  ): void {
    let currentPanel
    let currentDim: Location | undefined
    let oldMask: Location | undefined = undefined

    const l = panels.length

    let c = 0

    do {
      currentPanel = panels[c]

      currentDim = currentPanel.dimensions

      if (currentDim === undefined) {
        throw new Error('Unexpected error: dimensions is undefined')
      }

      if (mask) {
        oldMask = mask(currentDim)
      }

      this.state.pixelUnit.push(currentDim)

      currentPanel.drawer.draw()

      this.state.pixelUnit.pop()

      if (mask) {
        if (oldMask === undefined) {
          throw new Error('Unexpected error: oldMask is undefined')
        }

        mask(oldMask)
      }
    } while ((c += 1) < l)
  }
}

export default Panels
