import getObjectEntries from '@/lib/getObjectEntries'
import getObjectValues from '@/lib/getObjectValues'

import getInfo from './getInfo'
import getPixelUnits from './getPixelUnits'
import getRenderer from './getRenderer'
import { DynamicVariable, Variable } from './Variable'

import type { Info } from './getInfo'
import type { Height, Width } from './getPixelUnits/Size'
import type { InitPixel } from './InitPixel'
import type {
  DataImage,
  ImageContent,
  Link,
  Query,
  RecordVariable,
} from '@/scripts/listImage'

const startTime = Date.now()

export type RenderObject = {
  imageFunction: ImageContent
  init: InitPixel
  pixelSize: number
  queryString: Query
  showInfos: boolean
  slide: DataImage
  sliderObject?: Record<
    string,
    (value: Query[keyof Query], first?: boolean) => void
  >
  sliderValues?: Record<string, number>
}

type Redraw = (
  args: Query & {
    dontHighlight?: boolean
    height?: number
    width?: number
  },
) => void

type Resize = (height?: number, width?: number) => void

const getRedraw =
  (options: RenderObject, resize: (w?: number, h?: number) => void): Redraw =>
  (args) => {
    if (options.sliderObject) {
      getObjectEntries(options.sliderObject).forEach(
        ([key, callback], index) => {
          callback(args[key], index === 0 && !args.dontHighlight)
        },
      )
    }

    options.init.addToQueryString(args, true)

    if (options.imageFunction.listDoHover) {
      options.imageFunction.listDoHover.forEach((hover) => hover(args))
    }

    resize(args.width, args.height)
  }

type LinkPreparedBase = {
  autoUpdate?: boolean
  calculated?: boolean
  getLinkedVariable?: () => number
  main?: boolean
  real?: number
  s?: Height | Width
}

export type LinkPrepared =
  | (Link & LinkPreparedBase)
  | (LinkPreparedBase & ReadonlyArray<LinkPrepared>)

type LinkListPrepared = ReadonlyArray<LinkPrepared>

// Prepare
const doAddVariable = (
  vl: LinkListPrepared,
  pixelUnits: ReturnType<typeof getPixelUnits>,
): void => {
  const getLinkedVariable = (args: LinkPrepared) => (): number => {
    if (args.calculated && typeof args.real === 'number') {
      return args.real
    }

    args.calculated = true

    // TODO: Remove this check
    if (args.s === undefined) {
      throw new Error(
        "Unexpected error: `s` isn't defined, which should never happen.",
      )
    }

    return (args.real = args.s.getReal())
  }

  vl.forEach((current) => {
    if (Array.isArray(current) === false && current.s) {
      return
    }

    if (!current.autoUpdate) {
      current.autoUpdate = false

      current.s = pixelUnits.createSize(current)
    } else {
      current.calculated = true
    }

    current.getLinkedVariable = getLinkedVariable(current)
  })
}

const getCalculate =
  (vl: LinkListPrepared) =>
  (dimensions: { height: number; width: number }): void =>
    vl.forEach((current) => {
      if (current.main) {
        current.calculated = true

        current.real =
          dimensions['height' in current && current.height ? 'height' : 'width']
      } else {
        current.calculated = current.autoUpdate
      }
    })

export class PixelGraphics {
  callback: () => {
    redraw: Redraw
    resize: Resize
  }
  pixelUnits: ReturnType<typeof getPixelUnits> = getPixelUnits()
  canvasSize?: [number, number, number]
  constructor(options: RenderObject, canvas: HTMLCanvasElement) {
    const that = this

    this.createVariableList(options.imageFunction.variableList)

    if (
      options.imageFunction.linkList &&
      Array.isArray(options.imageFunction.linkList) &&
      options.imageFunction.linkList.length > 0
    ) {
      doAddVariable(options.imageFunction.linkList, this.pixelUnits)

      this.pixelUnits.linkList(getCalculate(options.imageFunction.linkList))
    }

    const info = getInfo(options.queryString)

    this.callback = (): {
      redraw: Redraw
      resize: Resize
    } => {
      const finalRenderer = getRenderer(canvas, options, that)
      const resize = that.getResize(info, finalRenderer.resize)
      const redraw = getRedraw(options, resize)

      info.logInitTime(Date.now() - startTime)

      finalRenderer.rescaleWindow()

      redraw({
        ...options.sliderValues,
        ...options.queryString,
        dontHighlight: true,
      })

      window.onresize = (): void => {
        finalRenderer.rescaleWindow()

        resize()
      }

      // Make Canvas resizeable by mouse
      that.initUserInput(options, redraw, canvas, options.slide.unchangeable)

      return {
        resize,
        redraw,
      }
    }
  }

  getResize(
    info: Info,
    render: (width: number, height: number) => [number, number, number],
  ): Resize {
    const that = this

    let currentW: number
    let currentH: number
    let needsToResize = false
    let resizeBlock = false

    const resetResizeBlock = (): void => {
      resizeBlock = false

      if (needsToResize) {
        resize(currentW, currentH)
      }
    }

    const resize: Resize = (w, h) => {
      const time = Date.now()

      // Render the actual image. This takes very long!
      that.canvasSize = render(w || currentW, h || currentH)

      // Log Drawing Time and Full RenderTime
      info.logRenderTime(that.canvasSize[2], Date.now() - time)

      needsToResize = false
    }

    return (w, h) => {
      needsToResize = true

      if (!resizeBlock) {
        resizeBlock = true

        setTimeout(resetResizeBlock, 20)

        resize(w, h)
      }

      currentW = w || currentW

      currentH = h || currentH
    }
  }

  initUserInput(
    options: RenderObject,
    redraw: Redraw,
    canvas: HTMLCanvasElement,
    unchangeable?: boolean,
  ): void {
    const hasSomethingToHover = options.imageFunction.hover
    const that = this

    const changeImage = (
      event: MouseEvent | Touch,
      size?: Query[keyof Query],
    ): void => {
      if (that.canvasSize === undefined) {
        return
      }

      const x = ('x' in event ? event.x : event.clientX) / that.canvasSize[0]
      const y = ('y' in event ? event.y : event.clientY) / that.canvasSize[1]
      const alt = 'altKey' in event ? event.altKey : false

      redraw(
        size ? { width: x, height: y } : alt ? { c: x, d: y } : { a: x, b: y },
      )
    }

    const mouseMove = (event: MouseEvent | Touch, size?: boolean): void => {
      if (
        options.queryString.resizeable ||
        (!unchangeable && (size || hasSomethingToHover))
      ) {
        changeImage(event, size || options.queryString.resizeable)
      }
    }

    const touchMove = (event: TouchEvent): void => {
      event.preventDefault()

      const [touchFirst] = event.changedTouches

      if (touchFirst === undefined) {
        return
      }

      mouseMove(touchFirst, true)
    }

    canvas.addEventListener('mousemove', mouseMove, false)

    canvas.addEventListener('touchmove', touchMove, false)
  }

  createVariableList(vl: RecordVariable = {}): void {
    const that = this
    const newVL: Record<string, DynamicVariable | Variable> = {}

    let key

    const updater = (): void => {
      getObjectValues(newVL).forEach((variable) => variable.set())
    }

    const link = (name: string, vari: { abs?: number | string }): void => {
      if (newVL[name]) {
        newVL[name].link(vari)
      } else {
        newVL[name] = new DynamicVariable(name)

        newVL[name].link(vari)
      }
    }

    const creator = (name: string): DynamicVariable => {
      if (!newVL[name]) {
        newVL[name] = new DynamicVariable(name)
      }

      return newVL[name]
    }

    that.pixelUnits.setList(link, creator, updater)

    for (key in vl) {
      newVL[key] = new Variable(vl[key], key, that.pixelUnits)
    }
  }
}
