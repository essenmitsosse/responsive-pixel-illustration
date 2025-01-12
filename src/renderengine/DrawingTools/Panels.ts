import Obj from './Obj'

import type { Location } from './createPixelArray'
import type { Tool } from './Primitive'
import type {
  InputDynamicVariable,
  InputDynamicVariableBase,
} from '@/helper/typeSize'
import type { Height, Width } from '@/renderengine/getPixelUnits/Size'
import type { Link } from '@/scripts/listImage'

type PanelInput = {
  list: ReadonlyArray<Tool | false>
  sX?: InputDynamicVariableBase & Link
  sY?: InputDynamicVariableBase & Link
}

type PanelPre = {
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

export type ArgsInitPanels = {
  fluctuation?: number
  gutterX?: InputDynamicVariable
  gutterY?: InputDynamicVariable
  imgRatio?: { ratio: number }
  panels?: Array<PanelInput>
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
  init(args: ArgsInitPanels): void {
    if (args.panels === undefined) {
      throw new Error('Unexpected error: panels is undefined')
    }

    const inherit = {}

    this.listPanels = args.panels.toReversed().map((current) => {
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
    this.drawPanels(panels, this.mask)
  }

  findBestRows(): void {
    if (this.listPanels === undefined) {
      throw new Error('Unexpected error: listPanels is undefined')
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

    const l = this.listPanels.length

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
    if (this.listPanels === undefined) {
      throw new Error('Unexpected error: args.listPanels is undefined')
    }

    if (this.countX === undefined) {
      throw new Error('Unexpected error: countX is undefined')
    }

    if (this.countY === undefined) {
      throw new Error('Unexpected error: countY is undefined')
    }

    const priorites = [
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
      this.listPanels.length - 1,
      0,
    ]

    const panels: Array<PanelSorted> = this.listPanels
      .toReversed()
      .map((current) => ({
        drawer: current.drawer,
        first: false,
        last: false,
        size: 1,
        sX: current.sX,
        sY: current.sY,
      }))

    const total = this.countX * this.countY

    priorites
      .toReversed()
      .toSpliced(total - this.listPanels.length)
      .forEach((priority) => {
        panels[priority]!.size += 1
      })

    let j = this.countY
    let c = this.listPanels.length - 1
    let odd = true

    while (j--) {
      let i = this.countX

      odd = !odd

      while (true) {
        const current = panels[c]!

        i -= current.size

        if (i < 0) {
          break
        }

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

    let width = 0
    let height = this.singleSY
    let posX = 0
    let posY = 0

    const {
      singleSX,
      gutterX,
      gutterY,
      countY,
      sY,
      countX,
      sX,
      fluctuation,
      dimensions,
    } = this

    panels.forEach((currentPanel) => {
      if (currentPanel.x === undefined) {
        throw new Error('Unexpected error: x is undefined')
      }

      if (currentPanel.y === undefined) {
        throw new Error('Unexpected error: y is undefined')
      }

      if (currentPanel.first) {
        posX = currentPanel.x * (singleSX + gutterX)

        if (currentPanel.y > 0) {
          posY += height + gutterY

          if (currentPanel.y === countY - 1) {
            height = sY - posY
          }
        }
      } else {
        posX += width + gutterX
      }

      if (currentPanel.first && currentPanel.size === countX) {
        // If a single panel fills a whole row
        width = sX
      } else {
        if (currentPanel.last) {
          // last Panel is as wide as what’s left.
          width = sX - posX
        } else {
          // Calc PanelWidth and add to total.
          const currentWidth = currentPanel.first
            ? currentPanel.size +
              (currentPanel.odd ? -fluctuation : fluctuation)
            : currentPanel.size

          width = Math.round(
            currentWidth * singleSX + (currentWidth - 1) * gutterX,
          )
        }
      }

      // Update the linked sizes of the panel
      currentPanel.sX.real = width

      currentPanel.sY.real = height

      currentPanel.dimensions = {
        width,
        height,
        posX: posX + dimensions.posX,
        posY: posY + dimensions.posY,
      }
    })
  }

  drawPanels(
    panels: ReadonlyArray<PanelSorted>,
    mask: ((dimensions: Location, push?: boolean) => Location) | undefined,
  ): void {
    panels.forEach((currentPanel) => {
      if (currentPanel.dimensions === undefined) {
        throw new Error('Unexpected error: dimensions is undefined')
      }

      const oldMask = mask ? mask(currentPanel.dimensions) : undefined

      this.state.pixelUnit.push(currentPanel.dimensions)

      currentPanel.drawer.draw()

      this.state.pixelUnit.pop()

      if (mask) {
        if (oldMask === undefined) {
          throw new Error('Unexpected error: oldMask is undefined')
        }

        mask(oldMask)
      }
    })
  }
}

export default Panels
