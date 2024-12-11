export const Admin = function (args) {
  var body = args.body

  this.pixel = args.pixel

  this.getClicker = this.getClickerGetter(this.pixel)

  this.showcase = args.showcase

  this.admin = args.admin

  // Setup Basic Showcase/Admin Layout
  body.setAttribute('class', (body.getAttribute('class') || '') + ' showcase')

  this.mainAdmin = document.createElement('div')

  // Setup sidebar div
  this.sideBarDiv = document.createElement('div')

  this.sideBarInnerDiv = document.createElement('div')

  this.sideBarDiv.setAttribute('id', 'sidebar')

  this.sideBarInnerDiv.setAttribute('class', 'inner')

  this.sideBarDiv.appendChild(this.sideBarInnerDiv)

  this.mainAdmin.appendChild(this.sideBarDiv)

  if (this.showcase || this.admin) {
    this.setupSlides(args.slides)
  }

  // Setup sidebar content
  this.setupBasicControls(args.hasRandom)

  this.setupSlider()

  body.appendChild(this.mainAdmin)

  this.mainAdmin.setAttribute('id', 'mainAdmin')
}

Admin.prototype.setupSlides = function (slides) {
  var currentSlide = this.pixel.queryString.slide * 1 || 0,
    l = slides.length,
    count = 0,
    sideBarContentUl = new this.List({
      id: 'slides',
      container: this.sideBarInnerDiv,
    })

  while (count < l) {
    sideBarContentUl.addMessage(
      '<strong>' + this.getSlideName(slides[count]) + '</strong>',
      count === currentSlide ? 'current slideLink' : 'slideLink',
      this.getClicker(count),
    )

    count += 1
  }
}

Admin.prototype.getClickerGetter = function (pixel) {
  return function getClicker(nr) {
    var p = pixel

    return function () {
      p.changeForceRedraw({ slide: nr })
    }
  }
}

Admin.prototype.setupSlider = function () {
  var slidersDiv = new this.List({
      id: 'sliders',
      container: this.sideBarInnerDiv,
    }),
    slidersDivList = slidersDiv.list,
    sliderObject = {},
    sliderValues = {},
    hasSliders = false,
    getSliderControl = this.getSliderControlGetter(),
    body = document.getElementsByTagName('body')[0],
    getBasicWrapper = function (objects, name, labelName) {
      var wrap = document.createElement('li'),
        innerWrap = document.createElement('div'),
        l = objects.length,
        count = 0,
        label

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
    },
    activateSliders = function () {
      if (!hasSliders) {
        hasSliders = true

        body.className = [body.className, 'withSliders'].join(' ')
      }
    }

  this.pixel.sliderObject = sliderObject

  this.pixel.sliderValues = sliderValues

  this.pixel.createSlider = {
    slider: function createSlider(args) {
      var slider = document.createElement('input'),
        span = document.createElement('span'),
        // dataList = document.createElement( "datalist" ),
        // option1, option2,
        // sliderId = "slider-" + args.valueName,
        key

      activateSliders()

      slider.setAttribute('type', 'range')

      for (key in args.input) {
        slider.setAttribute(key, args.input[key])
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

    number: function createButton(args) {
      var input = document.createElement('input'),
        key

      input.setAttribute('type', 'number')

      for (key in args.input) {
        input.setAttribute(key, args.input[key])
      }

      getBasicWrapper([input], 'slider', args.niceName)

      sliderObject[args.valueName] = getSliderControl.number(input, args)

      sliderValues[args.valueName] = args.defaultValue
    },

    title: function createTitle(args) {
      var title = document.createElement('h2'),
        wrap = document.createElement('li')

      title.innerHTML = args.title

      wrap.setAttribute('class', 'title')

      wrap.appendChild(title)

      slidersDivList.appendChild(wrap)
    },
  }
}

Admin.prototype.getSliderControlGetter = function () {
  var pixel = this.pixel,
    lastSliderParent,
    lastValueName

  return {
    slider: function getSliderControl(slider, span, args) {
      var value,
        parentNode = slider.parentNode.parentNode,
        valueName = args.valueName,
        min = args.input.min,
        max = args.input.max,
        diff = max - min,
        outputMap = args.output || { min: 0, max: 1 },
        outputMin = outputMap.min,
        outputFactor = (outputMap.max - outputMin) / diff,
        updateInfoSpan = function () {
          span.innerHTML = Math.round(value * 10) / 10

          span.setAttribute(
            'style',
            'left: ' + (((value - min) / diff) * 100 - 10) + '%;',
          )
        },
        update = function (setValue, single) {
          var obj = {}

          // If update is received with a sepcific value (e.g. from server), than just update the visual slider
          if (typeof setValue === 'number') {
            // obj[ valueName ] = setValue;
            value = slider.value = (setValue - outputMin) / outputFactor + min

            if (single) {
              if (lastValueName !== valueName && lastSliderParent) {
                lastSliderParent.setAttribute('style', '')
              }

              lastValueName = valueName

              lastSliderParent = parentNode
            }

            updateInfoSpan()

            return

            // else update the object
          } else if (value !== slider.value * 1) {
            value = slider.value * 1

            updateInfoSpan()

            obj[valueName] = (value - min) * outputFactor + outputMin

            pixel.sliderChange(obj)
          }
        }

      slider.addEventListener('mousemove', update, false)

      slider.addEventListener('touchmove', update, false)

      slider.addEventListener('click', update, false)

      return update
    },

    number: function getButtonControl(number, args) {
      var value,
        valueName = args.valueName,
        update = function (setValue, dontForce) {
          var obj = {}

          if (typeof setValue === 'number') {
            value = number.value = setValue
          } else if (value !== number.value * 1) {
            value = number.value * 1

            obj[valueName] = value

            if (!dontForce && args.forceRedraw) {
              pixel.changeForceRedraw(obj)
            } else {
              pixel.sliderChange(obj)
            }
          }
        }

      number.addEventListener('click', update, false)

      number.addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
          update()
        }
      })

      return update
    },
  }
}

Admin.prototype.setupBasicControls = function (hasRandom) {
  var sideBarContentDiv = new this.List({
      id: 'mainControls',
      container: this.sideBarInnerDiv,
    }),
    createButton = this.getButtonCreater(sideBarContentDiv)

  // if( this.showcase || this.admin ) {
  // 	createButton( { text: "◀", functionName: "nextSlide", args: false, className: "important slideControl narrow newrow" } );
  // 	createButton( { text: "▶︎︎", functionName: "nextSlide", args: true, className: "important slideControl narrow" } );
  // }

  // createButton( {
  // 	text : "",
  // 	functionName : "toggleResizability",
  // 	callback : "setupToggleResizabilityLinkButton",
  // 	args: undefined
  // });

  // createButton( { text: "Fullscreen <span class='shortcut'>CTRL+F</span>", functionName: "makeFullScreen", args: undefined } );
  if (hasRandom) {
    createButton({
      text: "Random Image <span class='shortcut'>CTRL+R</span>",
      functionName: 'getNewId',
      args: undefined,
    })
  }
}

Admin.prototype.getButtonCreater = function (div) {
  var pixel = this.pixel

  return function createButton(args) {
    var button = div.addMessage(
      args.text,
      'button' + (args.className ? ' ' + args.className : ''),
      (function (pixel) {
        return function () {
          pixel[args.functionName](args.args)
        }
      })(pixel),
    )

    if (args.callback) {
      pixel[args.callback](button)
    }
  }
}

Admin.prototype.getSlideName = function (current) {
  // var name = current.name,
  // 	add = [],
  // 	key;

  // for ( key in current ) {
  // 	if( current[ key ] === true ) {
  // 		add.push( key );
  // 	}
  // }

  // if( current.a !== undefined || current.b !== undefined ) {
  // 	add.push( current.a + "/" + current.b );
  // }

  // return name + ( add.length > 0 ? " (" + add.join( ", " ) + ") " : "" );

  return current.niceName || current.name
}

Admin.prototype.List = function List(args) {
  this.list = document.createElement(args.tagName || 'ul')

  if (args.atBeginning) {
    args.container.insertBefore(this.list, args.container.children[0])
  } else {
    args.container.appendChild(this.list)
  }

  this.list.setAttribute('id', args.id)
}

Admin.prototype.List.prototype.init = function (message) {
  this.list.innerHTML = message
}

Admin.prototype.List.prototype.addMessage = function (
  message,
  className,
  clickEvent,
) {
  var newMessage = document.createElement('li')

  newMessage.innerHTML = message

  if (className) {
    newMessage.setAttribute('class', className)
  }

  this.list.appendChild(newMessage)

  if (clickEvent) {
    newMessage.addEventListener('click', clickEvent)
  }

  return newMessage
}
