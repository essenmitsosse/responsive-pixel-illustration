import { DrawingTools } from './creator'
import { getPixelUnits } from './pixel'
import { Renderer } from './renderer'

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

const joinObjects = function () {
  const l = arguments.length

  let count = 0

  const newObj = {}

  let key
  let currentObj

  while (count < l) {
    currentObj = arguments[count]

    for (key in currentObj) {
      newObj[key] = currentObj[key]
    }

    count += 1
  }

  return newObj
}

export const PixelGraphics = function (options) {
  const that = this
  // Initialize PixelUnits with Variables
  const pU = this.getPixelUnits()

  this.pixelUnits = pU

  this.createVariableList(options.imageFunction.variableList || [])

  if (options.imageFunction.linkList) {
    this.prepareVariableList(options.imageFunction.linkList)
  }

  this.callback = function (canvas) {
    const isParent = options.queryString.parent
    const finalRenderer = new Renderer(canvas, options.info, options, that)
    const resize = that.getResize(options, options.info, finalRenderer.resize)
    const redraw = getRedraw(options, resize, isParent)

    options.info.logInitTime(Date.now() - startTime)

    finalRenderer.rescaleWindow()

    redraw(
      joinObjects(options.sliderValues, options.queryString, {
        dontHighlight: true,
      }),
    )

    window.onresize = function () {
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

PixelGraphics.prototype.getResize = function (options, info, render) {
  const that = this

  let currentW
  let currentH
  let needsToResize = false
  let resizeBlock = false

  const resetResizeBlock = function () {
    resizeBlock = false

    if (needsToResize) {
      resize(currentW, currentH)
    }
  }

  const resize = function (w, h) {
    const time = Date.now()

    // Render the actual image. This takes very long!
    that.canvasSize = render(w || currentW, h || currentH)

    // Log Drawing Time and Full RenderTime
    if (that.canvasSize) {
      info.logRenderTime(that.canvasSize[2], Date.now() - time)
    }

    needsToResize = false
  }

  return function checkIfResizeShouldBeDone(w, h) {
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

PixelGraphics.prototype.initUserInput = function (
  options,
  redraw,
  canvas,
  unchangeable,
) {
  const hasSomethingToHover = options.imageFunction.hover
  const that = this

  const changeImage = function changeImage(event, size) {
    let x = event.x || event.clientX
    let y = event.y || event.clientY

    const alt = event.altKey

    x /= that.canvasSize[0]

    y /= that.canvasSize[1]

    redraw(
      size ? { width: x, height: y } : alt ? { c: x, d: y } : { a: x, b: y },
    )
  }

  const mouseMove = function (event, size) {
    if (
      options.queryString.resizeable ||
      (!unchangeable && (size || hasSomethingToHover))
    ) {
      changeImage(event, size || options.queryString.resizeable)
    }
  }

  const touchMove = function (event) {
    event.preventDefault()

    mouseMove(event.changedTouches[0], true)
  }

  canvas.addEventListener('mousemove', mouseMove, false)

  canvas.addEventListener('touchmove', touchMove, false)
}

PixelGraphics.prototype.prepareVariableList = function (vl) {
  const that = this
  const vlLength = vl.length

  const calculate = function (dimensions) {
    let i = 0

    const vll = vlLength

    let current

    do {
      current = vl[i]

      if (current.main) {
        current.calculated = true

        current.real = dimensions[current.height ? 'height' : 'width']
      } else {
        current.calculated = current.autoUpdate
      }
    } while ((i += 1) < vll)
  }

  if (vlLength > 0) {
    // Prepare
    function doAddVariable(vl, vll) {
      let i = 0
      let current

      const getLinkedVariable = function (args) {
        return function () {
          if (!args.calculated) {
            args.calculated = true

            return (args.real = args.s.getReal())
          } else {
            return args.real
          }
        }
      }

      do {
        current = vl[i]

        if (!current.s) {
          if (!current.autoUpdate) {
            current.autoUpdate = false

            current.s = that.pixelUnits.createSize(current)
          } else {
            current.calculated = true
          }

          current.getLinkedVariable = getLinkedVariable(current)
        }
      } while ((i += 1) < vll)
    }

    doAddVariable(vl, vlLength)

    that.pixelUnits.linkList(calculate)
  }
}

PixelGraphics.prototype.createVariableList = function (vl) {
  const that = this
  const newVL = {}

  let key

  const updater = function () {
    let key

    for (key in vl) {
      newVL[key].set()
    }
  }

  const link = function (name, vari) {
    if (newVL[name]) {
      newVL[name].link(vari)
    } else {
      newVL[name] = new DynamicVariable(name)

      newVL[name].link(vari)
    }
  }

  const creator = function (name) {
    if (!newVL[name]) {
      newVL[name] = new DynamicVariable(name)
    }

    return newVL[name]
  }

  const Variable = function (args, name) {
    if (args) {
      this.name = name

      this.vari = that.pixelUnits.createSize(args)

      this.linkedP = []

      this.l = 0
    }
  }

  const DynamicVariable = function (name) {
    this.name = name

    this.linkedP = []

    this.l = 0
  }

  Variable.prototype.set = function () {
    let { l } = this

    const value = this.vari.getReal()

    while (l--) {
      this.linkedP[l].abs = value
    }
  }

  Variable.prototype.link = function (p) {
    this.linkedP.push(p)

    this.l += 1
  }

  DynamicVariable.prototype = new Variable()

  DynamicVariable.prototype.set = function (value) {
    let { l } = this

    while (l--) {
      this.linkedP[l].abs = value
    }
  }

  that.pixelUnits.setList(link, creator, updater)

  for (key in vl) {
    newVL[key] = new Variable(vl[key], key)
  }
}

PixelGraphics.prototype.getPixelUnits = getPixelUnits

PixelGraphics.prototype.DrawingTools = DrawingTools
