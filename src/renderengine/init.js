import getObjectEntries from '@/lib/getObjectEntries'
import getObjectFromEntries from '@/lib/getObjectFromEntries'
import listImage from '@/scripts/listImage'

import { Admin } from './admin.js'
import { PixelGraphics } from './info.js'

const getNumberDefaultToZero = (value) =>
  typeof value === 'number' ? value : 0

const doSetDocumentTitle = (imageName, queryString) => {
  let name = imageName

  // add resizeable to the title
  if (queryString.resizeable) {
    name += ' resizeable'
  }

  // Display the id for the Seedable Random Number Generator in the title;
  if (queryString.id) {
    name += ' (' + queryString.id + ')'
  }

  // Display the imageName as the title
  document.title = name
}

const getInfo = (options) => {
  const logs = {}

  let initString

  const d = document
  const body = d.getElementById('sliders')
  const info = d.createElement('div')

  let show = options.showInfos

  const swap = () => {
    if (body === null) {
      return
    }

    if ((show = !show)) {
      body.appendChild(info)
    } else {
      body.removeChild(info)
    }
  }

  const change = (name, value) => {
    logs[name] = value
  }

  info.setAttribute('id', 'infos')

  if (show && body !== null) {
    body.appendChild(info)
  }

  document.onkeydown = (event) => {
    if (event.ctrlKey && event.key.toLocaleLowerCase() === 'i') {
      event.preventDefault()

      swap()
    }
  }

  return {
    change,
    logInitTime: (initTime) => {
      initString = `<span class='init' style='width:${initTime * 5}px;'>${initTime}ms<br>Init</span>`
    },
    logRenderTime: (draw, fullDuration) => {
      const render = fullDuration - draw
      const string = []

      if (show) {
        change('Duration', fullDuration + 'ms')

        change('fps', Math.floor(1000 / fullDuration) + 'fps')

        change('Average-Time', 'false')

        getObjectEntries(logs).forEach(([key, value]) => {
          string.push(`<p><strong>${key}:</strong> ${value}</p>`)
        })

        string.push(
          `<p>${initString}<span class='drawing' style='width:${draw * 5}px;'>${draw}ms<br>Drawing</span><span style='width:${render * 5}px;'>${render}ms<br>Render</span></p>`,
        )

        info.innerHTML = string.join('')
      }
    },
  }
}

// // If there is a List of Canvases, cycle through the list
// InitPixel.prototype.createMultipleCanvases = function ( canvasDataList, div ) {
// 	var canvasList = [],
// 		length = canvasDataList.length,
// 		i = length;

// 	while ( i -- ) {
// 		canvasList.push( this.createSingleCanvas( canvasDataList[ i ], div ) );
// 	}

// 	return function ( renderer ) {
// 		var i;

// 		i = length;

// 		while ( i -- ) {
// 			renderer.debug = i === 0;
// 			canvasList[ i ]( renderer );
// 		}
// 	};
// };

/** Create a new Canvas, add it to the div and return it */
const createSingleCanvas = (canvasData, div) => {
  const canvas = document.createElement('canvas')

  let key

  if (canvasData) {
    for (key in canvasData) {
      canvas.style[key] = canvasData[key]
    }
  }

  div.appendChild(canvas)

  return (renderer) => new PixelGraphics(renderer).callback(canvas)
}

const loadScript = (callback, currentSlide) =>
  currentSlide.import().then((imageImport) => {
    callback(imageImport.default)
  })

const getQueryString = () => {
  const list = {}
  const vars = location.search.substring(1).split('&')

  let i = 0

  const l = vars.length

  let pair

  const convert = (value) => {
    if (value === 'true') {
      return true
    } else if (value === 'false') {
      return false
    }

    return Number.parseFloat(value)
  }

  while (i < l) {
    pair = vars[i].split('=')

    if (pair[0]) {
      list[pair[0]] = convert(pair[1])
    }

    i += 1
  }

  // if( !list.slide ) { list.slide = "0"; }
  // else { list.slide = list.slide.toString(); }
  // if( !list.id ) { list.id = 666; }

  return list
}

/** Create the Callback Function, when the script is loaded */
const getCallback =
  (context, rendererInit, queryString, imageName, currentSlide, info) =>
  (ImageFunction) => {
    let imageFunction
    let renderObject

    if (ImageFunction) {
      if (context.createSlider) {
        // that.createSlider.title( { title: "Image Size" } );
        // that.createSlider.slider( { niceName: "Width", valueName: "width", defaultValue: 1, input: { min: 0, max: 1, step: 0.02 } } );
        // that.createSlider.slider( { niceName: "Height", 	 valueName: "height", defaultValue: 1, input: { min: 0, max: 1, step: 0.02 } } );
      }

      imageFunction = ImageFunction(
        queryString,
        currentSlide,
        context.createSlider,
      )

      renderObject = {
        showInfos: false,
        slide: currentSlide,
        imageFunction,
        queryString,
        pixelSize:
          (getNumberDefaultToZero(queryString.p) || currentSlide.p || 7) * 1 +
          (getNumberDefaultToZero(queryString.pAdd) ||
            imageFunction.recommendedPixelSize ||
            0) *
            1,
        sliderObject: context.sliderObject,
        sliderValues: context.sliderValues,
        info,
        init: context,
      }

      context.renderer = rendererInit(renderObject)

      if (context.timerAnimation) {
        context.timerAnimation()
      }
    } else {
      throw imageName + ' was loaded but is not a function!'
    }
  }

export class InitPixel {
  constructor(args) {
    this.queryString = getQueryString()

    const forceName = args.imageName || window.location.hash.substring(1)

    this.slides = listImage

    const currentSlide =
      !forceName &&
      listImage[
        typeof this.queryString.slide === 'number' ? this.queryString.slide : 0
      ]

    if (!currentSlide) {
      throw new Error('No current slide found')
    }

    const imageName = forceName || currentSlide.name || 'tantalos'
    const sliders = this.queryString.sliders || currentSlide.sliders
    /** Change for multiple Canvases */
    const canvasDataList = false
    const canvasRenderer = createSingleCanvas(canvasDataList, args.div)
    const [body] = document.getElementsByTagName('body')

    this.parent = this.queryString.admin || this.queryString.parent

    if (currentSlide.resizeable) {
      this.queryString.resizeable = true
    }

    new Admin({
      body,
      admin: this.queryString.admin,
      sliders,
      slides: listImage,
      pixel: this,
      hasRandom: currentSlide.hasRandom || false,
    })

    const callback = getCallback(
      this,
      canvasRenderer,
      this.queryString,
      imageName,
      currentSlide,
      getInfo(this.queryString),
    )

    loadScript(callback, currentSlide)

    doSetDocumentTitle(imageName, this.queryString)

    window.onkeydown = this.getShortcuts(this.queryString)

    if (currentSlide.timer || this.queryString.timer) {
      this.timerAnimation = this.getTimerAnimation(currentSlide.timer)
    }
  }

  addToQueryString(newObj, dontRefresh) {
    getObjectEntries(newObj).map(([key, value]) => {
      this.queryString[key] = value
    })

    if (!dontRefresh) {
      this.refresh()
    }
  }

  refresh() {
    location.search = getObjectEntries(this.queryString)
      .map(([key, value]) => {
        if (value === undefined) {
          return
        }

        return key + '=' + value
      })
      .join('&')
  }

  nextSlide(isNext) {
    let newSlide =
      getNumberDefaultToZero(this.queryString.slide) * 1 + (isNext ? 1 : -1)

    if (newSlide > this.slides.length - 1) {
      newSlide = this.slides.length - 1
    } else if (newSlide < 0) {
      newSlide = 0
    }

    this.queryString.slide = newSlide

    this.refresh()

    this.changeForceRedraw({ slide: this.queryString.slide })
  }

  getNewId(id) {
    this.changeForceRedraw({
      id: id || Math.floor(Math.random() * Math.pow(2, 32)),
    })
  }

  sliderChange(obj) {
    if (this.renderer) {
      this.renderer.redraw(obj)
    }
  }

  changeForceRedraw(obj) {
    if (obj.slide && obj.slide !== this.queryString.slide && this.showcase) {
      this.queryString = {
        showcase: true,
        id: this.queryString.id,
        slide: obj.slide,
      }

      this.refresh()
    } else {
      this.addToQueryString(obj)
    }
  }

  makeFullScreen() {
    this.toggleResizability(false)

    if (this.renderer) {
      this.renderer.redraw({ width: 1, height: 1 })
    }
  }

  setupToggleResizabilityLinkButton(button) {
    this.toggleResizabilityButton = button

    this.toggleResizability(this.queryString.resizeable ? true : false)
  }

  toggleResizability(value) {
    const resizeable = (this.queryString.resizeable =
      value === undefined ? !this.queryString.resizeable : value)

    if (this.toggleResizabilityButton) {
      this.toggleResizabilityButton.innerHTML =
        (resizeable ? 'scaleable' : 'not scaleable') +
        "<span class='shortcut'>CTRL+S</span>"
    }
  }

  getShortcuts(queryString) {
    const that = this

    return (event) => {
      if (event.ctrlKey) {
        if (event.key.toLocaleLowerCase() === 'r') {
          event.preventDefault()

          // CTRL + R // new id
          that.getNewId()
        } else if (event.key.toLocaleLowerCase() === 's') {
          event.preventDefault()

          // CTRL + S // toggle scalability
          that.toggleResizability()
        } else if (event.key.toLocaleLowerCase() === 'f') {
          event.preventDefault()
          // CTRL + F // make Fullscreen

          that.makeFullScreen()
        } else if (event.key.toLocaleLowerCase() === 'c') {
          event.preventDefault()
          // CTRL + C // toggle Color sheme

          queryString.cs = queryString.cs !== true ? true : undefined

          that.refresh()
        } else if (event.key.toLocaleLowerCase() === 'd') {
          event.preventDefault()
          // CTRL + D // toggle debugging

          queryString.debug = queryString.debug !== true ? true : undefined

          that.refresh()
        } else if (event.key === ']') {
          event.preventDefault()

          // CTRL + "+" // zoom In
          if (!queryString.p) {
            queryString.p = 5
          }

          queryString.p = getNumberDefaultToZero(queryString.p) * 1 + 1

          that.refresh()
        } else if (event.key === '[') {
          event.preventDefault()

          // CTRL + "-" // zoom Out
          if (!queryString.p) {
            queryString.p = 5
          }

          queryString.p = getNumberDefaultToZero(queryString.p) * 1 - 1

          if (queryString.p < 1) {
            queryString.p = 1
          }

          that.refresh()
        }
      } else if (event.metaKey) {
        if (event.key === 'ArrowUp') {
          event.preventDefault()

          // Arrow Keys Up/Down // Add Rows
          if (!queryString.panels) {
            queryString.panels = 1
          }

          queryString.panels =
            getNumberDefaultToZero(queryString.panels) * 1 + 1

          that.refresh()
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()

          if (!queryString.panels) {
            queryString.panels = 1
          }

          queryString.panels =
            getNumberDefaultToZero(queryString.panels) * 1 - 1

          if (queryString.panels < 1) {
            queryString.panels = 1
          }

          that.refresh()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()

          // Arrow Keys Left/Right // Next / Prev Image
          that.nextSlide(true)
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()

          that.nextSlide(false)
        }
      }
      // else if ( event.shiftKey ) {
      // 	if ( keyCode === 49 ) { q.p = 11; that.refresh(); }
      // Number Keys 1 — 9 // Set resolution
      // 	else if ( keyCode === 222 ) { q.p = 12; that.refresh(); }
      // 	else if ( keyCode === 51 ) { q.p = 13; that.refresh(); }
      // 	else if ( keyCode === 52 ) { q.p = 14; that.refresh(); }
      // 	else if ( keyCode === 53 ) { q.p = 15; that.refresh(); }
      // 	else if ( keyCode === 54 ) { q.p = 16; that.refresh(); }
      // 	else if ( keyCode === 191 ) { q.p = 17; that.refresh(); }
      // 	else if ( keyCode === 56 ) { q.p = 18; that.refresh(); }
      // 	else if ( keyCode === 57 ) { q.p = 19; that.refresh(); }
      // 	else if ( keyCode === 187 ) { q.p = 20; that.refresh(); }
      // }

      // else if( !event.metaKey ) {
      // 	if ( keyCode === 49 ) { q.p = 1; that.refresh(); }
      // Number Keys 1 — 9 // Set resolution
      // 	else if ( keyCode === 50 ) { q.p = 2; that.refresh(); }
      // 	else if ( keyCode === 51 ) { q.p = 3; that.refresh(); }
      // 	else if ( keyCode === 52 ) { q.p = 4; that.refresh(); }
      // 	else if ( keyCode === 53 ) { q.p = 5; that.refresh(); }
      // 	else if ( keyCode === 54 ) { q.p = 6; that.refresh(); }
      // 	else if ( keyCode === 55 ) { q.p = 7; that.refresh(); }
      // 	else if ( keyCode === 56 ) { q.p = 8; that.refresh(); }
      // 	else if ( keyCode === 57 ) { q.p = 9; that.refresh(); }
      // 	else if ( keyCode === 48 ) { q.p = 10; that.refresh(); }
      // }
    }
  }

  getTimerAnimation() {
    const that = this
    const fps = 20
    /* how often per second should the chance be checked */
    const waitTimer = fps * 0.5
    const animations = getObjectFromEntries(
      getObjectEntries({
        camera: { duration: 6, chance: 0.1 },
        side: { duration: 3, chance: 0.3 },
        a: { duration: 2, chance: 0.3 },
        b: { duration: 2, chance: 0.3 },
        c: { duration: 2, chance: 0.3 },
        // eye open
        d: { duration: 2, chance: 0.1 },
        // eye open
        e: { duration: 2, chance: 0.1 },
        f: { duration: 2, chance: 0.3 },
        g: { duration: 2, chance: 0.3 },
        h: { duration: 2, chance: 0.3 },
        k: { duration: 2, chance: 0.3 },
        l: { duration: 2, chance: 0.3 },
        m: { duration: 2, chance: 0.3 },
        n: { duration: 2, chance: 0.3 },
      }).map(([key, value]) => [
        key,
        {
          ...value,
          chance: (waitTimer * value.chance) / fps,
          middleChance: waitTimer / (fps * value.duration),
          step: 1 / (fps * value.duration),
          pos: 0,
          forward: true,
          move: true,
          waitTimer: 0,
        },
      ]),
    )

    const getFrame = () => {
      const renderObject = {}

      getObjectEntries(animations).forEach(([key, value]) => {
        const current = { ...value }

        if (current.move) {
          current.pos += current.step * (current.forward ? 1 : -1)

          if (current.pos > 1) {
            current.pos = 1

            current.move = false

            current.forward = false
          } else if (current.pos < 0) {
            current.pos = 0

            current.move = false

            current.forward = true
          }

          // randomly stopp in the middle
          if (current.waitTimer > 0) {
            current.waitTimer -= 1
          } else {
            current.waitTimer = waitTimer

            if (current.middleChance > Math.random()) {
              current.forward = !current.forward

              current.move = false
            }
          }

          renderObject[key] = current.pos
        } else {
          if (current.waitTimer > 0) {
            current.waitTimer -= 1
          } else {
            current.waitTimer = waitTimer

            if (current.chance > Math.random()) {
              current.move = true
            }
          }
        }

        animations[key] = current
      })

      // console.log( animations.camera.pos );

      setTimeout(getFrame, 1000 / fps)

      if (that.renderer) {
        that.renderer.redraw(renderObject)
      }
    }

    return getFrame
  }
}
