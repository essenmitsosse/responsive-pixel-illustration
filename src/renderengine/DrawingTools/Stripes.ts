import Obj from './Obj'

import type { Location } from './createPixelArray'
import type getPixelSetter from './getPixelSetter'
import type { InputDynamicVariableBase } from '@/helper/typeSize'
import type { Height, Width } from '@/renderengine/getPixelUnits/Size'

type GetDraw = (
  drawer: (args: Location) => void,
  fromOtherSide: boolean | undefined,
  stripWidth: number,
  endX: number,
  startY: number,
  endY: number,
  overflow: boolean | undefined,
) => (startX: number, currentHeightChange: number, randomWidth: number) => void

const drawerNormal: GetDraw =
  (drawer, fromOtherSide, stripWidth, endX, startY, endY, overflow) =>
  (startX, currentHeightChange, randomWidth) => {
    const end = startX + stripWidth + randomWidth
    const start = startY - (fromOtherSide ? currentHeightChange : 0)

    drawer({
      posX: startX,
      posY: start,
      width: (!overflow && end > endX ? endX : end) - startX,
      height: endY + (!fromOtherSide ? currentHeightChange : 0) - start,
    })
  }

const drawerHorizontal: GetDraw =
  (drawer, fromOtherSide, stripWidth, endY, startX, endX, overflow) =>
  (startY, currentHeightChange, randomWidth) => {
    const end = startY + stripWidth + randomWidth
    const start = startX - (fromOtherSide ? currentHeightChange : 0)

    drawer({
      posX: start,
      posY: startY,
      width: endX + (!fromOtherSide ? currentHeightChange : 0) - start,
      height: (!overflow && end > endY ? endY : end) - startY,
    })
  }

type Stripe = {
  change?: { height?: boolean }
  cut?: unknown
  fromStart?: unknown
  gap?: InputDynamicVariableBase
  horizontal?: boolean
  overflow?: boolean
  random?: InputDynamicVariableBase
  round?: unknown
  seed?: number
  strip?: InputDynamicVariableBase
}

export type InitStripes = {
  stripes?: Stripe
}

class Stripes extends Obj {
  isStripe = true
  getColorArrayStripe?: ((args: Location) => void) | undefined
  horizontal?: boolean
  stripWidth?: Height | Width
  gapWidth?: Height | Width
  stripWidthRandom?: Height | Width
  gapWidthRandom?: Height | Width
  lengthRandom?: Height | Width
  lengthChange?: Height | Width
  random?: () => {
    count: (c: number) => number
    one: () => number
    seed: () => number
  }
  cut?: unknown
  overflow?: boolean
  round?: unknown
  fromStart?: unknown
  fromOtherSide?: boolean
  getDraw?: GetDraw

  setColorArray(
    args: Parameters<ReturnType<typeof getPixelSetter>['setColorArrayRect']>[0],
  ): void {
    this.getColorArrayStripe = this.state.pixelSetter.setColorArrayRect(args)
  }

  init(args: InitStripes): void {
    super.init(args)

    if (args.stripes === undefined) {
      throw new Error('Unexpected error: stripes is undefined')
    }

    let random

    /** Width of a single Line */
    const horizontal = (this.horizontal =
      (this.rotate ? !args.stripes.horizontal : args.stripes.horizontal) ||
      false)

    const getDimension = horizontal
      ? this.state.pixelUnit.getHeight
      : this.state.pixelUnit.getWidth

    /** Width of a single Line */
    this.stripWidth = getDimension(args.stripes.strip || { a: 1 })

    /** Width of a single Line */
    this.gapWidth = getDimension(args.stripes.gap || { a: 0 })

    if (args.stripes.strip && args.stripes.strip.random) {
      this.stripWidthRandom = this.state.pixelUnit.createSize(
        args.stripes.strip.random,
      )

      random = true
    }

    if (args.stripes.gap && args.stripes.gap.random) {
      this.gapWidthRandom = this.state.pixelUnit.createSize(
        args.stripes.gap.random,
      )

      random = true
    }

    if (args.stripes.random) {
      if (typeof args.stripes.random === 'object') {
        args.stripes.random.height = !horizontal
      }

      this.lengthRandom = this.state.pixelUnit.createSize(args.stripes.random)

      random = true
    }

    if (args.stripes.change) {
      if (typeof args.stripes.change === 'object') {
        args.stripes.change.height = !horizontal
      }

      this.lengthChange = this.state.pixelUnit.createSize(args.stripes.change)

      random = true
    }

    if (random) {
      this.random = this.state.seed.get(args.stripes.seed)
    }

    this.cut = args.stripes.cut

    this.overflow = args.stripes.overflow

    this.round = args.stripes.round

    this.fromStart = args.stripes.fromStart

    this.fromOtherSide = horizontal ? this.fromBottom : this.fromRight

    this.getDraw = horizontal ? drawerHorizontal : drawerNormal
  }

  draw(): void {
    if (this.dimensions === undefined) {
      throw new Error('Unexpected error: dimensions is undefined')
    }

    if (this.stripWidth === undefined) {
      throw new Error('Unexpected error: stripWidth is undefined')
    }

    if (this.gapWidth === undefined) {
      throw new Error('Unexpected error: gapWidth is undefined')
    }

    if (this.getDraw === undefined) {
      throw new Error('Unexpected error: getDraw is undefined')
    }

    const dimensions = this.dimensions.calc()

    if (dimensions.checkMin()) {
      return
    }

    let stripWidth = this.stripWidth.getReal()
    let gapWidth = this.gapWidth.getReal()

    const size = this.horizontal ? dimensions.height : dimensions.width

    let singleSX = gapWidth + stripWidth

    if (this.round) {
      const ratio = singleSX / stripWidth

      singleSX = Math.floor(size / Math.floor(size / singleSX))

      stripWidth = Math.round(singleSX / ratio)

      gapWidth = singleSX - stripWidth
    }

    const lengthChange = this.lengthChange ? this.lengthChange.getReal() : 0

    const lengthChangeStep =
      (lengthChange /
        (this.horizontal ? dimensions.height : dimensions.width)) *
      (this.fromOtherSide ? -1 : 1)

    let totalHeightChange = Math.round(
      this.fromOtherSide ? -lengthChangeStep : 0,
    )

    const startX =
      dimensions.posX -
      (this.horizontal && this.fromRight && this.fromBottom ? lengthChange : 0)

    const startY =
      dimensions.posY -
      (!this.horizontal && this.fromRight && this.fromBottom ? lengthChange : 0)

    const width =
      dimensions.width +
      (this.horizontal && !this.fromRight && this.fromBottom
        ? lengthChange
        : 0) +
      (this.horizontal && this.fromRight && this.fromBottom ? lengthChange : 0)

    const height =
      dimensions.height +
      (!this.horizontal && this.fromRight && !this.fromBottom
        ? lengthChange
        : 0) +
      (!this.horizontal && this.fromRight && this.fromBottom ? lengthChange : 0)

    const endX = startX + width
    const endY = startY + height

    let start =
      (this.horizontal ? startY : startX) +
      (this.fromOtherSide && !this.fromStart
        ? Math.round((this.horizontal ? height : width) % singleSX) -
          (this.overflow ? singleSX : 0)
        : 0)

    const end = this.horizontal ? endY : endX
    const random = this.random ? this.random().one : false

    const stripWidthRandom = this.stripWidthRandom
      ? this.stripWidthRandom.getReal() + 1
      : 0

    const gapWidthRandom = this.gapWidthRandom
      ? this.gapWidthRandom.getReal() + 1
      : 0

    const lengthRandom = this.lengthRandom ? this.lengthRandom.getReal() : 0

    let randomWidth
    let totalWidth

    const drawer = this.listTool
      ? this.state.pixelUnit.push
      : this.getColorArrayStripe
        ? this.getColorArrayStripe
        : false

    if (drawer === false) {
      throw new Error('Unexpected error: drawer is false')
    }

    const draw = this.getDraw(
      drawer,
      /** From Other Side? */
      this.horizontal ? this.fromRight : this.fromBottom,
      stripWidth,
      end,
      this.horizontal ? startX : startY,
      this.horizontal ? endX : endY,
      this.overflow,
    )

    do {
      totalWidth =
        singleSX +
        (randomWidth =
          stripWidthRandom && random
            ? Math.floor(stripWidthRandom * random())
            : 0) +
        (gapWidthRandom && random ? Math.floor(gapWidthRandom * random()) : 0)

      if (totalWidth < 1) {
        totalWidth = 1
      }

      if (!this.cut || start + totalWidth <= end) {
        draw(
          start,
          (lengthRandom !== 0 && random
            ? Math.round(lengthRandom * random())
            : 0) +
            (lengthChangeStep
              ? Math.round((totalHeightChange += lengthChangeStep * totalWidth))
              : 0),
          randomWidth,
        )

        if (this.listTool) {
          this.listTool.forEach((tool) => tool.draw())

          this.state.pixelUnit.pop()
        }
      }
    } while ((start += totalWidth) < end)
  }
}

export default Stripes
