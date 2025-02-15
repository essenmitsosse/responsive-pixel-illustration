import { getNumberDefaultToZero } from '@/lib/getNumberDefaultToZero'
import getObjectEntries from '@/lib/getObjectEntries'
import getObjectFromEntries from '@/lib/getObjectFromEntries'
import listImage from '@/scripts/listImage'

import Admin from './Admin'
import { PixelGraphics } from './PixelGraphics'

import type { RenderObject } from './PixelGraphics'
import type { CreateSlider } from '@/helper/typeSlider'
import type { DataImage, ImageFunction, Query } from '@/scripts/listImage'

const doSetDocumentTitle = (
  imageName: string,
  queryString: { id?: string; resizeable?: boolean },
): void => {
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
const createSingleCanvas = (div: HTMLElement) => {
  const canvas = document.createElement('canvas')

  div.appendChild(canvas)

  return (renderer: RenderObject): ReturnType<PixelGraphics['callback']> =>
    new PixelGraphics(renderer, canvas).callback()
}

const loadScript = (
  callback: (imageFunction: ImageFunction) => void,
  currentSlide: DataImage,
): Promise<void> =>
  currentSlide.import().then((imageImport) => {
    callback(imageImport.default)
  })

const convert = (value: string): Query[keyof Query] => {
  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  }

  const number = Number.parseFloat(value)

  if (!Number.isNaN(number)) {
    return number
  }

  return value
}

const getQueryString = (): Query =>
  getObjectFromEntries(
    location.search
      .substring(1)
      .split('&')
      .filter((variable) => variable !== '')
      .map((variable) => {
        const [key, value] = variable.split('=')

        if (key === undefined || value === undefined) {
          throw new Error(
            `Unexpected error: key or value are undefined in key-value pair from query string: "${variable}"`,
          )
        }

        return [key, convert(value)]
      }),
  )

/** Create the Callback Function, when the script is loaded */
const getCallback =
  (args: {
    context: InitPixel
    currentSlide: DataImage
    imageName: string
    queryString: Query
    rendererInit: (
      renderObject: RenderObject,
    ) => ReturnType<PixelGraphics['callback']>
  }) =>
  (ImageFunction: ImageFunction): void => {
    // if (args.context.createSlider) {
    // that.createSlider.title( { title: "Image Size" } );
    // that.createSlider.slider( { niceName: "Width", valueName: "width", defaultValue: 1, input: { min: 0, max: 1, step: 0.02 } } );
    // that.createSlider.slider( { niceName: "Height", 	 valueName: "height", defaultValue: 1, input: { min: 0, max: 1, step: 0.02 } } );
    // }

    const imageFunction = ImageFunction(
      args.queryString,
      args.currentSlide,
      args.context.createSlider,
    )

    const renderObject: RenderObject = {
      showInfos: false,
      slide: args.currentSlide,
      imageFunction,
      queryString: args.queryString,
      pixelSize:
        (getNumberDefaultToZero(args.queryString.p) ||
          args.currentSlide.p ||
          7) *
          1 +
        (getNumberDefaultToZero(args.queryString.pAdd) ||
          imageFunction.recommendedPixelSize ||
          0) *
          1,
      sliderObject: args.context.sliderObject,
      sliderValues: args.context.sliderValues,
      init: args.context,
    }

    args.context.renderer = args.rendererInit(renderObject)

    if (args.context.timerAnimation) {
      args.context.timerAnimation()
    }
  }

export class InitPixel {
  showcase?: boolean
  slides: typeof listImage
  queryString: Query
  timerAnimation?: () => void
  sliderObject?: Record<
    string,
    (value: Query[keyof Query], first?: boolean) => void
  >
  sliderValues?: Record<string, number>
  defaultValues?: Query
  createSlider?: CreateSlider
  renderer?: ReturnType<PixelGraphics['callback']>
  toggleResizabilityButton?: HTMLElement
  constructor(args: { div: HTMLElement; imageName?: string }) {
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
    /** Change for multiple Canvases */
    const canvasRenderer = createSingleCanvas(args.div)
    const [body] = document.getElementsByTagName('body')

    if (body === undefined) {
      throw new Error('Unexpected error: No body found')
    }

    if (currentSlide.resizeable) {
      this.queryString.resizeable = true
    }

    new Admin({
      body,
      slides: listImage,
      pixel: this,
      hasRandom: currentSlide.hasRandom || false,
    })

    const callback = getCallback({
      context: this,
      rendererInit: canvasRenderer,
      queryString: this.queryString,
      imageName,
      currentSlide,
    })

    loadScript(callback, currentSlide)

    doSetDocumentTitle(imageName, this.queryString)

    window.onkeydown = this.getShortcuts(this.queryString)

    if (currentSlide.timer || this.queryString.timer) {
      this.timerAnimation = this.getTimerAnimation()
    }
  }

  addToQueryString(newObj: Query, dontRefresh?: boolean): void {
    getObjectEntries(newObj).map(([key, value]) => {
      this.queryString[key] = value
    })

    if (!dontRefresh) {
      this.refresh()
    }
  }

  refresh(): void {
    location.search = getObjectEntries(this.queryString)
      .map(([key, value]) => {
        if (value === undefined) {
          return
        }

        return key + '=' + value
      })
      .join('&')
  }

  nextSlide(isNext: boolean): void {
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

  getNewId(): void {
    this.changeForceRedraw({
      id: Math.floor(Math.random() * Math.pow(2, 32)),
    })
  }

  sliderChange(obj: Query): void {
    if (this.renderer) {
      this.renderer.redraw(obj)
    }
  }

  changeForceRedraw(obj: { id?: number; slide?: number }): void {
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

  makeFullScreen(): void {
    this.toggleResizability(false)

    if (this.renderer) {
      this.renderer.redraw({ width: 1, height: 1 })
    }
  }

  setupToggleResizabilityLinkButton(button: HTMLElement): void {
    this.toggleResizabilityButton = button

    this.toggleResizability(this.queryString.resizeable ? true : false)
  }

  toggleResizability(value?: boolean): void {
    const resizeable = (this.queryString.resizeable =
      value === undefined ? !this.queryString.resizeable : value)

    if (this.toggleResizabilityButton) {
      this.toggleResizabilityButton.innerHTML =
        (resizeable ? 'scaleable' : 'not scaleable') +
        "<span class='shortcut'>CTRL+S</span>"
    }
  }

  getShortcuts(queryString: Query) {
    const that = this

    return (event: KeyboardEvent): void => {
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

  getTimerAnimation(): () => void {
    const that = this
    const fps = 20
    /* how often per second should the chance be checked */
    const waitTimer = fps * 0.5

    type Animation = {
      chance: number
      duration: number
      forward: boolean
      middleChance: number
      move: boolean
      pos: number
      step: number
      waitTimer: number
    }

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
      }).map(
        <TKey extends string>([key, value]: [
          TKey,
          { chance: number; duration: number },
        ]): [TKey, Animation] => [
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
        ],
      ),
    )

    const getFrame = (): void => {
      const renderObject: Query = {}

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
