import { DrawingTools } from './creator.js'
import { getPixelUnits } from './pixel.js'
import { Renderer } from './renderer.js'

var startTime = Date.now()
export const PixelGraphics = function (options) {
  var that = this,
    pU = this.getPixelUnits() // Initialize PixelUnits with Variables

  this.pixelUnits = pU

  this.createVariableList(options.imageFunction.variableList || [])
  if (options.imageFunction.linkList) {
    this.prepareVariableList(options.imageFunction.linkList)
  }

  if (options.imageFunction.changeValueSetter) {
    options.imageFunction.changeValueSetter()
  }

  return function (canvas) {
    var info = options.info,
      isParent = options.queryString.parent,
      finalRenderer = new Renderer(canvas, info, options, that),
      rescaleWindow = finalRenderer.rescaleWindow,
      resize = that.getResize(options, info, finalRenderer.resize),
      redraw = that.getRedraw(options, resize, isParent)

    info.logInitTime(Date.now() - startTime)

    rescaleWindow()

    redraw(
      that.joinObjects(
        options.sliderValues,
        options.queryString,
        options.defaultValues,
        { dontHighlight: true },
      ),
    )

    window.onresize = function () {
      rescaleWindow()
      resize()
    }

    // Make Canvas resizeable by mouse
    that.initUserInput(options, redraw, canvas, options.slide.unchangeable)

    return {
      resize: resize,
      redraw: redraw,
    }
  }
}

PixelGraphics.prototype.getResize = function (options, info, render) {
  var that = this,
    currentW,
    currentH,
    needsToResize = false,
    resizeBlock = false,
    resetResizeBlock = function () {
      resizeBlock = false
      if (needsToResize) {
        resize(currentW, currentH)
      }
    },
    resize = function (w, h) {
      // var time = Date.now();

      // Render the actual image. This takes very long!
      that.canvasSize = render(w || currentW, h || currentH)

      // // Log Drawing Time and Full RenderTime
      // if( that.canvasSize ) {
      // 	info.logRenderTime(
      // 		that.canvasSize[ 2 ],
      // 		Date.now() - time
      // 	);
      // }

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

PixelGraphics.prototype.getRedraw = function redraw(options, resize) {
  var hoverEvent = options.imageFunction.hover,
    sliderObject = options.sliderObject

  return function redraw(args) {
    var key,
      first = !args.dontHighlight

    if (sliderObject) {
      for (key in args) {
        if (sliderObject[key]) {
          sliderObject[key](args[key], first)
          first = false
        }
      }
    }

    options.init.addToQueryString(args, true)

    if (hoverEvent) {
      hoverEvent(args)
    }
    resize(args.width, args.height)
  }
}

PixelGraphics.prototype.initUserInput = function (
  options,
  redraw,
  canvas,
  unchangeable,
) {
  var queryString = options.queryString,
    hasSomethingToHover = options.imageFunction.hover,
    that = this,
    changeImage = function changeImage(event, size) {
      var x = event.x || event.clientX,
        y = event.y || event.clientY,
        alt = event.altKey

      x /= that.canvasSize[0]
      y /= that.canvasSize[1]

      redraw(
        size ? { width: x, height: y } : alt ? { c: x, d: y } : { a: x, b: y },
      )
    },
    mouseMove = function (event, size) {
      if (
        queryString.resizeable ||
        (!unchangeable && (size || hasSomethingToHover))
      ) {
        changeImage(event, size || queryString.resizeable)
      }
    },
    touchMove = function (event) {
      event.preventDefault()
      mouseMove(event.changedTouches[0], true)
    }

  canvas.addEventListener('mousemove', mouseMove, false)
  canvas.addEventListener('touchmove', touchMove, false)

  if (!queryString.admin && queryString.tilt && window.DeviceOrientationEvent) {
    this.getOrientation(changeImage, redraw, options)
  }
}

PixelGraphics.prototype.getOrientation = function (
  changeImage,
  redraw,
  options,
) {
  var pause = function () {},
    lastX = 0,
    lastY = 0,
    lastZ = 0,
    // debug = this.getDebug(),

    tilt = function (event) {
      var changed = false,
        x = event.alpha,
        y = event.beta,
        z = event.gamma,
        obj = {}

      if ((x = Math.floor(x)) !== lastX) {
        lastX = x
        changed = true
      }
      if ((y = Math.floor(y)) !== lastY) {
        lastY = y
        changed = true
      }
      if ((z = Math.floor(z)) !== lastZ) {
        lastZ = z
        changed = true
      }

      if (changed) {
        if (x > 180) {
          x = 180 - x + 360
        } else {
          x = 180 - x
        }

        x = x / 360
        y = (y + 90) / 180
        z = (z + 180) / 360

        x = x + 0.25
        if (x > 1) {
          x = x - 1
        }
        if (x > 0.5) {
          x = (x - 0.5) * 2
        } else {
          x = (0.5 - x) * 2
        }

        z = z + 0.25
        if (z > 1) {
          z = z - 1
        }
        if (z > 0.5) {
          z = (z - 0.5) * 2
        } else {
          z = (0.5 - z) * 2
        }

        if (names[0]) {
          obj[names[0]] = z
        }
        if (names[1]) {
          obj[names[1]] = y
        }
        if (names[2]) {
          obj[names[2]] = x
        }

        redraw(obj)
        // debug( x, y, z, soften );
      }

      realTilt = pause

      setTimeout(resetTilt, 100)
    },
    resetTilt = function () {
      realTilt = tilt
    },
    realTilt = tilt,
    sliderValues = options.sliderValues,
    key,
    names = []

  for (key in sliderValues) {
    if (names.length < 4) {
      if (key !== 'width' && key !== 'height' && key !== 'panels') {
        names.push(key)
      }
    }
  }

  if (names.length > 0) {
    window.addEventListener('deviceorientation', realTilt, true)
  }
}

PixelGraphics.prototype.getDebug = function () {
  var info = document.createElement('div'),
    text = document.createElement('div'),
    center = document.createElement('div'),
    oriX = document.createElement('div'),
    oriY = document.createElement('div'),
    oriZ = document.createElement('div'),
    bonus = document.createElement('div')

  info.setAttribute('id', 'infoField')

  center.setAttribute('id', 'marker')
  center.setAttribute('class', 'center')
  info.appendChild(center)

  oriX.setAttribute('class', 'marker acc')
  oriX.innerHTML = 'x: rotation'
  info.appendChild(oriX)

  oriY.setAttribute('class', 'marker speed')
  oriY.innerHTML = 'y: back/forth'
  info.appendChild(oriY)

  oriZ.setAttribute('class', 'marker pos')
  oriZ.innerHTML = 'z: kippen'
  info.appendChild(oriZ)

  bonus.setAttribute('class', 'marker bonus')
  bonus.innerHTML = '.'
  info.appendChild(bonus)

  info.appendChild(text)
  text.innerHTML = 'init done.'

  document.getElementsByTagName('body')[0].appendChild(info)

  return function (x, y, z, a) {
    oriX.setAttribute('style', 'left:' + x * 100 + '%;')
    oriY.setAttribute('style', 'top:' + y * 100 + '%;')
    oriZ.setAttribute('style', 'left:' + z * 100 + '%; top:' + z * 100 + '%;')
    // bonus.setAttribute( "style", "left:" + Math.floor( test * 100 ) + "%;" );

    text.innerHTML =
      'X: ' +
      x +
      ';</br>' +
      'Y: ' +
      y +
      ';</br>' +
      'Z: ' +
      z +
      ';</br>' +
      'soften ' +
      a
  }
}

PixelGraphics.prototype.prepareVariableList = function (vl) {
  var pixelUnits = this.pixelUnits,
    vlLength = vl.length,
    calculate = function (dimensions) {
      var i = 0,
        vll = vlLength,
        current

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
      var i = 0,
        current,
        getLinkedVariable = function (args) {
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
            current.s = pixelUnits.createSize(current)
          } else {
            current.calculated = true
          }
          current.getLinkedVariable = getLinkedVariable(current)
        }
      } while ((i += 1) < vll)
    }

    doAddVariable(vl, vlLength)

    pixelUnits.linkList(calculate)
  }
}

PixelGraphics.prototype.createVariableList = function (vl) {
  var pixelUnits = this.pixelUnits,
    newVL = {},
    key,
    updater = function () {
      var key

      for (key in vl) {
        newVL[key].set()
      }
    },
    link = function (name, vari) {
      if (newVL[name]) {
        newVL[name].link(vari)
      } else {
        newVL[name] = new DynamicVariable(name)
        newVL[name].link(vari)
      }
    },
    creator = function (name) {
      if (!newVL[name]) {
        newVL[name] = new DynamicVariable(name)
      }

      return newVL[name]
    },
    Variable = function (args, name) {
      if (args) {
        this.name = name
        this.vari = pixelUnits.createSize(args)
        this.linkedP = []
        this.l = 0
      }
    },
    DynamicVariable = function (name) {
      this.name = name
      this.linkedP = []
      this.l = 0
    }

  Variable.prototype.set = function () {
    var value,
      l = this.l

    value = this.vari.getReal()

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
    var l = this.l

    while (l--) {
      this.linkedP[l].abs = value
    }
  }

  pixelUnits.setList(link, creator, updater)

  for (key in vl) {
    newVL[key] = new Variable(vl[key], key)
  }
}

PixelGraphics.prototype.globalResizer = (function () {
  var allCanvases = [],
    resize = function () {
      var l = allCanvases.length

      while (l--) {
        allCanvases[l]()
      }
    }

  window.onresize = resize

  return function (pixelGraphicResizer) {
    allCanvases.push(pixelGraphicResizer)
  }
})()

PixelGraphics.prototype.getRandom = (function () {
  var m = 2147483647,
    a = 16807,
    c = 17,
    z = 3,
    i = 0

  return function (seed) {
    var thisZ = seed || z

    return {
      one: function () {
        return (thisZ = (a * thisZ + c) % m) / m
      },
      count: function (c) {
        return Math.floor(((thisZ = (a * thisZ + c) % m) / m) * c)
      },
      seed: function () {
        return (thisZ = (a * thisZ + c) % m) + (i += 1)
      },
    }
  }
})()

PixelGraphics.prototype.joinObjects = function () {
  var l = arguments.length,
    count = 0,
    newObj = {},
    key,
    currentObj

  while (count < l) {
    currentObj = arguments[count]

    for (key in currentObj) {
      newObj[key] = currentObj[key]
    }

    count += 1
  }

  return newObj
}

PixelGraphics.prototype.getPixelUnits = getPixelUnits
PixelGraphics.prototype.DrawingTools = DrawingTools
