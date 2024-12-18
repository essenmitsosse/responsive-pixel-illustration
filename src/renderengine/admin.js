import { getNumberDefaultToZero } from '@/lib/getNumberDefaultToZero'
import getListAdmin from '@/renderengine/getListAdmin'

const getClickerGetter = (pixel) => (nr) => () => {
  pixel.changeForceRedraw({ slide: nr })
}

const getSlideName = (current) => current.niceName || current.name

export class Admin {
  constructor(args) {
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

  setupSlides(slides) {
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

  setupSlider() {
    const slidersDiv = getListAdmin({
      id: 'sliders',
      container: this.sideBarInnerDiv,
    })

    const slidersDivList = slidersDiv.list
    const sliderObject = {}
    const sliderValues = {}

    let hasSliders = false

    const getSliderControl = this.getSliderControlGetter()
    const [body] = document.getElementsByTagName('body')
    const getBasicWrapper = (objects, name, labelName) => {
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

    const activateSliders = () => {
      if (!hasSliders) {
        hasSliders = true

        body.className = [body.className, 'withSliders'].join(' ')
      }
    }

    this.pixel.sliderObject = sliderObject

    this.pixel.sliderValues = sliderValues

    this.pixel.createSlider = {
      slider: (args) => {
        const slider = document.createElement('input')
        const span = document.createElement('span')

        // dataList = document.createElement( "datalist" ),
        // option1, option2,
        // sliderId = "slider-" + args.valueName,
        let key

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

      number: (args) => {
        const input = document.createElement('input')

        let key

        input.setAttribute('type', 'number')

        for (key in args.input) {
          input.setAttribute(key, `${args.input[key]}`)
        }

        getBasicWrapper([input], 'slider', args.niceName)

        sliderObject[args.valueName] = getSliderControl.number(input, args)

        sliderValues[args.valueName] = args.defaultValue
      },

      title: (args) => {
        const title = document.createElement('h2')
        const wrap = document.createElement('li')

        title.innerHTML = args.title

        wrap.setAttribute('class', 'title')

        wrap.appendChild(title)

        slidersDivList.appendChild(wrap)
      },
    }
  }

  getSliderControlGetter() {
    let lastSliderParent
    let lastValueName

    const that = this

    return {
      slider: (slider, span, args) => {
        let value

        const diff = args.input.max - args.input.min
        const outputMap = args.output || { min: 0, max: 1 }
        const outputMin = outputMap.min
        const outputFactor = (outputMap.max - outputMin) / diff
        const updateInfoSpan = () => {
          span.innerHTML = `${Math.round(value * 10) / 10}`

          span.setAttribute(
            'style',
            'left: ' + (((value - args.input.min) / diff) * 100 - 10) + '%;',
          )
        }

        const update = (setValue, single) => {
          const obj = {}

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

              lastSliderParent = slider.parentNode.parentNode
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

      number: (number, args) => {
        let value

        const update = (setValue, dontForce) => {
          const obj = {}

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

  setupBasicControls(hasRandom) {
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

  getButtonCreater(div) {
    const that = this

    return (args) => {
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
