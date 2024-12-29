import { getNumberDefaultToZero } from '@/lib/getNumberDefaultToZero'
import getListAdmin from '@/renderengine/getListAdmin'

import type { InitPixel } from './InitPixel'
import type { DataSlider, SliderArgs } from '@/helper/typeSlider'
import type { DataImage } from '@/scripts/listImage'

const getClickerGetter = (pixel: InitPixel) => (nr: number) => (): void => {
  pixel.changeForceRedraw({ slide: nr })
}

const getSlideName = (current: { name: string; niceName?: string }): string =>
  current.niceName || current.name

class Admin {
  pixel: InitPixel
  getClicker: (nr: number) => () => void
  mainAdmin: HTMLDivElement
  sideBarDiv: HTMLDivElement
  sideBarInnerDiv: HTMLDivElement
  constructor(args: {
    body: HTMLBodyElement
    hasRandom: boolean
    pixel: InitPixel
    slides: ReadonlyArray<DataImage>
  }) {
    this.pixel = args.pixel

    this.getClicker = getClickerGetter(this.pixel)

    // Setup Basic Showcase/Admin Layout
    args.body.setAttribute(
      'class',
      (args.body.getAttribute('class') || '') + ' showcase',
    )

    this.mainAdmin = document.createElement('div')

    // Setup sidebar div
    this.sideBarDiv = document.createElement('div')

    this.sideBarInnerDiv = document.createElement('div')

    this.sideBarDiv.setAttribute('id', 'sidebar')

    this.sideBarInnerDiv.setAttribute('class', 'inner')

    this.sideBarDiv.appendChild(this.sideBarInnerDiv)

    this.mainAdmin.appendChild(this.sideBarDiv)

    this.setupSlides(args.slides)

    // Setup sidebar content
    this.setupBasicControls(args.hasRandom)

    this.setupSlider()

    args.body.appendChild(this.mainAdmin)

    this.mainAdmin.setAttribute('id', 'mainAdmin')
  }

  setupSlides(slides: ReadonlyArray<DataImage>): void {
    const currentSlide = getNumberDefaultToZero(this.pixel.queryString.slide)
    const l = slides.length

    let count = 0

    const sideBarContentUl = getListAdmin({
      id: 'slides',
      container: this.sideBarInnerDiv,
    })

    while (count < l) {
      sideBarContentUl.addMessage(
        '<strong>' + getSlideName(slides[count]) + '</strong>',
        count === currentSlide ? 'current slideLink' : 'slideLink',
        this.getClicker(count),
      )

      count += 1
    }
  }

  setupSlider(): void {
    const slidersDiv = getListAdmin({
      id: 'sliders',
      container: this.sideBarInnerDiv,
    })

    const slidersDivList = slidersDiv.list

    const sliderObject: Record<
      string,
      (setValue: boolean | number | undefined, dontForce?: boolean) => void
    > = {}

    const sliderValues: Record<string, number> = {}

    let hasSliders = false

    const getSliderControl = this.getSliderControlGetter()
    const [body] = document.getElementsByTagName('body')

    const getBasicWrapper = (
      objects: ReadonlyArray<HTMLElement>,
      name: string,
      labelName: string,
    ): void => {
      const wrap = document.createElement('li')
      const innerWrap = document.createElement('div')
      const l = objects.length

      let count = 0
      let label

      wrap.setAttribute('class', 'input ' + name)

      innerWrap.setAttribute('class', 'sliderWrap')

      if (labelName) {
        label = document.createElement('label')

        label.innerHTML = labelName

        wrap.appendChild(label)
      }

      while (count < l) {
        innerWrap.appendChild(objects[count])

        count += 1
      }

      wrap.appendChild(innerWrap)

      slidersDivList.appendChild(wrap)
    }

    const activateSliders = (): void => {
      if (!hasSliders) {
        hasSliders = true

        body.className = [body.className, 'withSliders'].join(' ')
      }
    }

    this.pixel.sliderObject = sliderObject

    this.pixel.sliderValues = sliderValues

    this.pixel.createSlider = {
      slider: (args): void => {
        const slider = document.createElement('input')
        const span = document.createElement('span')

        // dataList = document.createElement( "datalist" ),
        // option1, option2,
        // sliderId = "slider-" + args.valueName,
        let key: keyof DataSlider

        activateSliders()

        slider.setAttribute('type', 'range')

        for (key in args.input) {
          slider.setAttribute(key, `${args.input[key]}`)
        }

        if (!args.dontShow) {
          getBasicWrapper([slider, span], 'slider', args.niceName)

          sliderObject[args.valueName] = getSliderControl.slider(
            slider,
            span,
            args,
          )
        }

        sliderValues[args.valueName] = args.defaultValue
      },

      number: (args): void => {
        const input = document.createElement('input')

        let key: keyof DataSlider

        input.setAttribute('type', 'number')

        for (key in args.input) {
          input.setAttribute(key, `${args.input[key]}`)
        }

        getBasicWrapper([input], 'slider', args.niceName)

        sliderObject[args.valueName] = getSliderControl.number(input, args)

        sliderValues[args.valueName] = args.defaultValue
      },

      title: (args): void => {
        const title = document.createElement('h2')
        const wrap = document.createElement('li')

        title.innerHTML = args.title

        wrap.setAttribute('class', 'title')

        wrap.appendChild(title)

        slidersDivList.appendChild(wrap)
      },
    }
  }

  getSliderControlGetter(): {
    number: (
      number: HTMLInputElement,
      args: {
        forceRedraw?: boolean
        valueName: string
      },
    ) => (setValue: boolean | number | undefined, dontForce?: boolean) => void
    slider: (
      slider: HTMLInputElement,
      span: HTMLSpanElement,
      args: SliderArgs,
    ) => (setValue: boolean | number | undefined, dontForce?: boolean) => void
  } {
    let lastSliderParent: ParentNode | null | undefined
    let lastValueName: string

    const that = this

    return {
      slider: (
        slider,
        span,
        args,
      ): ((
        setValue: boolean | number | undefined,
        single?: boolean,
      ) => void) => {
        let value: number

        const diff = args.input.max - args.input.min
        const outputMap = args.output || { min: 0, max: 1 }
        const outputMin = outputMap.min
        const outputFactor = (outputMap.max - outputMin) / diff

        const updateInfoSpan = (): void => {
          span.innerHTML = `${Math.round(value * 10) / 10}`

          span.setAttribute(
            'style',
            'left: ' + (((value - args.input.min) / diff) * 100 - 10) + '%;',
          )
        }

        const update = (
          setValue?: MouseEvent | TouchEvent | boolean | number,
          single?: boolean,
        ): void => {
          const obj: Record<string, number> = {}

          // If update is received with a sepcific value (e.g. from server), than just update the visual slider
          if (typeof setValue === 'number') {
            // obj[ valueName ] = setValue;
            value = (setValue - outputMin) / outputFactor + args.input.min

            slider.value = `${value}`

            if (single) {
              if (
                lastValueName !== args.valueName &&
                lastSliderParent instanceof HTMLElement
              ) {
                lastSliderParent.setAttribute('style', '')
              }

              lastValueName = args.valueName

              lastSliderParent = slider.parentNode?.parentNode
            }

            updateInfoSpan()

            return

            // else update the object
          } else if (value !== getNumberDefaultToZero(slider.value)) {
            value = getNumberDefaultToZero(slider.value)

            updateInfoSpan()

            obj[args.valueName] =
              (value - args.input.min) * outputFactor + outputMin

            that.pixel.sliderChange(obj)
          }
        }

        slider.addEventListener('mousemove', update, false)

        slider.addEventListener('touchmove', update, false)

        slider.addEventListener('click', update, false)

        return update
      },

      number: (
        number,
        args,
      ): ((
        setValue: boolean | number | undefined,
        dontForce?: boolean,
      ) => void) => {
        let value: number

        const update = (
          setValue?: MouseEvent | boolean | number,
          dontForce?: MouseEvent | boolean,
        ): void => {
          const obj: Record<string, number> = {}

          if (typeof setValue === 'number') {
            number.value = `${setValue}`

            value = setValue
          } else if (value !== getNumberDefaultToZero(number.value)) {
            value = getNumberDefaultToZero(number.value)

            obj[args.valueName] = value

            if (!dontForce && args.forceRedraw) {
              that.pixel.changeForceRedraw(obj)
            } else {
              that.pixel.sliderChange(obj)
            }
          }
        }

        number.addEventListener('click', update, false)

        number.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
            update()
          }
        })

        return update
      },
    }
  }

  setupBasicControls(hasRandom: boolean): void {
    const sideBarContentDiv = getListAdmin({
      id: 'mainControls',
      container: this.sideBarInnerDiv,
    })

    const createButton = this.getButtonCreater(sideBarContentDiv)

    // if( this.showcase ) {
    // 	createButton( { text: "◀", callbackButton: pixel => pixel.nextSlide(false), className: "important slideControl narrow newrow" } );
    // 	createButton( { text: "▶︎︎", callbackButton: pixel => pixel.nextSlide(true), className: "important slideControl narrow" } );
    // }

    // createButton( {
    // 	text : "",
    // 	callbackButton: pixel => pixel.toggleResizability(),
    // 	callback : "setupToggleResizabilityLinkButton",
    // });

    // createButton( { text: "Fullscreen <span class='shortcut'>CTRL+F</span>", functionName: "makeFullScreen", args: undefined } );
    if (hasRandom) {
      createButton({
        text: "Random Image <span class='shortcut'>CTRL+R</span>",
        callbackButton: (pixel) => pixel.getNewId(),
      })
    }
  }

  getButtonCreater(div: ReturnType<typeof getListAdmin>) {
    const that = this

    return (args: {
      callback?: KeysMatching<InitPixel, (value: HTMLElement) => void>
      callbackButton: (pixel: InitPixel) => void
      className?: string
      text: string
    }): void => {
      const button = div.addMessage(
        args.text,
        'button' + (args.className ? ' ' + args.className : ''),
        () => args.callbackButton(that.pixel),
      )

      if (args.callback) {
        that.pixel[args.callback](button)
      }
    }
  }
}

type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]

export default Admin
