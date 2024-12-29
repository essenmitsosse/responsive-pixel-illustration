import getInfo from '@/renderengine/getInfo'

import { DrawingTools } from './creator'
import { getPixelUnits } from './pixel'
import { Renderer } from './renderer'
import { DynamicVariable, Variable } from './Variable'

const startTime = Date.now()

const getRedraw = (options, resize) => (args) => {
  let key
  let first = !args.dontHighlight

  if (options.sliderObject) {
    for (key in args) {
      if (options.sliderObject[key]) {
        options.sliderObject[key](args[key], first)

        first = false
      }
    }
  }

  options.init.addToQueryString(args, true)

  if (options.imageFunction.listDoHover) {
    options.imageFunction.listDoHover.forEach((hover) => hover(args))
  }

  resize(args.width, args.height)
}

// Prepare
const doAddVariable = (vl, pixelUnits) => {
  const getLinkedVariable = (args) => () => {
    if (args.calculated) {
      return args.real
    }

    args.calculated = true

    // TODO: Remove this check, that shouldn't be necessary
    if (args.s === undefined) {
      throw new Error(
        "Unexpected error: `s` isn't defined, which should never happen.",
      )
    }

    return (args.real = args.s.getReal())
  }

  vl.forEach((current) => {
    if (current.s) {
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

const getCalculate = (vl) => (dimensions) =>
  vl.forEach((current) => {
    if (current.main) {
      current.calculated = true

      current.real = dimensions[current.height ? 'height' : 'width']
    } else {
      current.calculated = current.autoUpdate
    }
  })

export class PixelGraphics {
  constructor(options) {
    const that = this
    // Initialize PixelUnits with Variables
    const pU = this.getPixelUnits()

    this.pixelUnits = pU

    this.createVariableList(options.imageFunction.variableList)

    if (options.imageFunction.linkList) {
      this.prepareVariableList(options.imageFunction.linkList)
    }

    const info = getInfo(options.queryString)

    this.callback = function (canvas) {
      const finalRenderer = new Renderer(canvas, info, options, that)
      const resize = that.getResize(info, finalRenderer.resize)
      const redraw = getRedraw(options, resize)

      info.logInitTime(Date.now() - startTime)

      finalRenderer.rescaleWindow()

      redraw({
        ...options.sliderValues,
        ...options.queryString,
        dontHighlight: true,
      })

      window.onresize = () => {
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

  getResize(info, render) {
    const that = this

    let currentW
    let currentH
    let needsToResize = false
    let resizeBlock = false

    const resetResizeBlock = () => {
      resizeBlock = false

      if (needsToResize) {
        resize(currentW, currentH)
      }
    }

    const resize = (w, h) => {
      const time = Date.now()

      // Render the actual image. This takes very long!
      that.canvasSize = render(w || currentW, h || currentH)

      // Log Drawing Time and Full RenderTime
      if (that.canvasSize) {
        info.logRenderTime(that.canvasSize[2], Date.now() - time)
      }

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

  initUserInput(options, redraw, canvas, unchangeable) {
    const hasSomethingToHover = options.imageFunction.hover
    const that = this

    const changeImage = (event, size) => {
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

    const mouseMove = (event, size) => {
      if (
        options.queryString.resizeable ||
        (!unchangeable && (size || hasSomethingToHover))
      ) {
        changeImage(event, size || options.queryString.resizeable)
      }
    }

    const touchMove = (event) => {
      event.preventDefault()

      mouseMove(event.changedTouches[0], true)
    }

    canvas.addEventListener('mousemove', mouseMove, false)

    canvas.addEventListener('touchmove', touchMove, false)
  }

  prepareVariableList(vl) {
    if (vl.length === 0) {
      return
    }

    doAddVariable(vl, this.pixelUnits)

    this.pixelUnits.linkList(getCalculate(vl))
  }

  createVariableList(vl = {}) {
    const that = this
    const newVL = {}

    let key

    const updater = () => {
      let key

      for (key in vl) {
        newVL[key].set()
      }
    }

    const link = (name, vari) => {
      if (newVL[name]) {
        newVL[name].link(vari)
      } else {
        newVL[name] = new DynamicVariable(name)

        newVL[name].link(vari)
      }
    }

    const creator = (name) => {
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

  getPixelUnits = getPixelUnits

  DrawingTools = DrawingTools
}
