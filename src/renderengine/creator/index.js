import createPixelArray from './createPixelArray'
import Dot from './Dot'
import Fill from './Fill'
import FillRandom from './FillRandom'
import getPixelSetter from './getPixelSetter'
import getSeedHandler from './getSeedHandler'
import Line from './Line'
import Obj from './Obj'
import Polygon from './Polygon'
import Primitive from './Primitive'
import Rect from './Rect'
import Stripes from './Stripes'

class RoundRect extends Obj {
  getName = 'Rounded Rectangle'

  list = [
    // { mY:1 },
    // { mX:1, height: {a:1} },
    // { mX:1, height: {a:1}, fromBottom:true },
    {
      minX: 3,
      minY: 4,
      list: [
        { name: 'Dot', clear: true },
        { name: 'Dot', fX: true, clear: true },
        { name: 'Dot', fY: true, clear: true },
        { name: 'Dot', fX: true, fY: true, clear: true },
      ],
    },
    {
      minX: 4,
      minY: 3,
      list: [
        { name: 'Dot', clear: true },
        { name: 'Dot', fX: true, clear: true },
        { name: 'Dot', fY: true, clear: true },
        { name: 'Dot', fX: true, fY: true, clear: true },
      ],
    },
    {},
  ]
}

class Grid extends Obj {
  getName = 'Grid'

  list = [
    {
      stripes: { gap: 1 },
      list: [{ stripes: { gap: 1, horizontal: true } }],
    },
  ]
}

class Panels extends Obj {
  getName = 'Panels'

  init(args) {
    let l = args.panels.length

    const inherit = {}
    const newPanels = (this.args.list = [])

    let current

    while (l--) {
      current = args.panels[l]

      if (current.sX) {
        current.sX.autoUpdate = true
      } else {
        current.sX = {}
      }

      if (current.sY) {
        current.sY.autoUpdate = true
      } else {
        current.sY = {}
      }

      newPanels.push({
        drawer: new Obj(this.state, this.drawingTools).create(
          { list: current.list },
          inherit,
        ),
        sX: current.sX,
        sY: current.sY,
      })
    }

    this.fluctuation = args.fluctuation || 0

    this.imgRatio = args.imgRatio
      ? typeof args.imgRatio === 'object'
        ? args.imgRatio
        : { ratio: args.imgRatio }
      : 1

    if (args.gutterX) {
      this.gutterSX = this.state.pixelUnit.getWidth(args.gutterX)
    }

    if (args.gutterY) {
      this.gutterSY = this.state.pixelUnit.getWidth(args.gutterY)
    }
  }

  // Draws Object, consisting of other Objects and Primitives.
  draw() {
    let countX
    let countY

    this.dimensions = this.dimensions.calc()

    this.sX = this.dimensions.width

    this.sY = this.dimensions.height

    this.gutterX = this.gutterSX.getReal()

    this.gutterY = this.gutterSY.getReal()

    this.countX = countX

    this.countY = countY

    // Find best combination of rows/cols
    this.findBestRows(this.args.list)

    const panels = this.sortRows(this.args.list)

    // calculate the finale size of the panel
    this.calcPanelsSizes(panels)

    // Draw the content of the panels
    this.drawPanels(panels, this.args.mask)
  }

  findBestRows(list) {
    let y = 0
    let x

    const l = list.length

    let current

    const imgRatio = this.imgRatio.ratio

    let last = {
      lastSquarness: Infinity,
      lastRatioDiff: imgRatio,
    }

    while ((y += 1) <= l) {
      x = Math.round(l / y)

      /** Add one to X, if it wouldn’t be enough panels */
      if (x * y < l) {
        x += 1
      }

      if (x * y - x < l) {
        current = {
          x,
          y,
          singleSXWithGutter: Math.floor((this.sX + this.gutterX) / x),
          singleSYWithGutter: Math.floor((this.sY + this.gutterY) / y),
        }

        current.singleSX = current.singleSXWithGutter - this.gutterX

        current.singleSY = current.singleSYWithGutter - this.gutterY

        current.ratio = current.singleSXWithGutter / current.singleSYWithGutter

        current.ratioDiff = Math.abs(current.ratio - imgRatio)
        // current.squareness = Math.abs( 1 - current.ratio );

        if (
          last.ratioDiff < current.ratioDiff
          // && last.squareness < current.squareness
        ) {
          break
        }

        last = current
      }
    }

    this.countX = last.x

    this.countY = last.y

    this.singleSX = last.singleSX <= 1 ? 1 : last.singleSX

    this.singleSY = last.singleSY <= 1 ? 1 : last.singleSY
  }

  sortRows(list) {
    const panels = []

    let i
    let j

    const l = list.length

    let c = l - 1
    let total = this.countX * this.countY
    let odd = true

    const priorites = [
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
      l - 1,
      0,
    ]

    let current

    i = l

    while (i--) {
      current = list[i]

      panels.push({
        drawer: current.drawer,
        first: false,
        last: false,
        size: 1,
        sX: current.sX,
        sY: current.sY,
      })
    }

    while (total > l) {
      total -= 1

      panels[priorites.pop()].size += 1
    }

    j = this.countY

    while (j--) {
      i = this.countX

      odd = !odd

      while ((i -= (current = panels[c]).size) >= 0) {
        current.x = i

        current.y = j

        if (i === 0) {
          current.first = true
        } else if (i === this.countX - current.size) {
          current.last = true
        } else if (c === 0) {
          current.first = true

          current.x = 1
        }

        current.odd = odd

        c -= 1

        if (c < 0) {
          break
        }
      }
    }

    return panels
  }

  calcPanelsSizes(panels) {
    let c = 0

    const l = panels.length

    let currentPanel
    let x
    let y
    let size
    let currentWidth
    let first
    let width = 0
    let height = this.singleSY
    let posX = 0
    let posY = 0

    do {
      currentPanel = panels[c]

      x = currentPanel.x

      y = currentPanel.y

      size = currentPanel.size

      first = currentPanel.first

      if (first) {
        posX = x * (this.singleSX + this.gutterX)

        if (y > 0) {
          posY += height + this.gutterY

          if (y === this.countY - 1) {
            height = this.sY - posY
          }
        }
      } else {
        posX += width + this.gutterX
      }

      if (first && size === this.countX) {
        // If a single panel fills a whole row
        width = this.sX
      } else {
        if (currentPanel.last) {
          // last Panel is as wide as what’s left.
          width = this.sX - posX
        } else {
          // Calc PanelWidth and add to total.
          if (first) {
            currentWidth =
              size + (currentPanel.odd ? -this.fluctuation : this.fluctuation)
          } else {
            currentWidth = size
          }

          width = Math.round(
            currentWidth * this.singleSX + (currentWidth - 1) * this.gutterX,
          )
        }
      }

      // Update the linked sizes of the panel
      currentPanel.sX.real = width

      currentPanel.sY.real = height

      currentPanel.dimensions = {
        width,
        height,
        posX: posX + this.dimensions.posX,
        posY: posY + this.dimensions.posY,
      }
    } while ((c += 1) < l)
  }

  drawPanels(panels, mask) {
    let currentPanel
    let currentDim
    let oldMask

    const l = panels.length

    let c = 0

    do {
      currentPanel = panels[c]

      currentDim = currentPanel.dimensions

      if (mask) {
        oldMask = mask(currentDim)
      }

      this.state.pixelUnit.push(currentDim)

      currentPanel.drawer.draw()

      this.state.pixelUnit.pop()

      if (mask) {
        mask(oldMask)
      }
    } while ((c += 1) < l)
  }
}

class Arm extends Obj {
  getName = 'Arm'

  init(args) {
    let hand

    this.targetX = args.targetX

    this.targetY = args.targetY

    this.endX = args.endX

    this.endY = args.endY

    this.jointX = args.jointX

    this.jointY = args.jointY

    this.length = args.length

    this.flip = args.flip

    this.maxStraight = args.maxStraight || 1

    this.ratio = args.ratio || 0.5

    this.ellbow = args.ellbow

    this.endX.autoUpdate = true

    this.endY.autoUpdate = true

    this.jointX.autoUpdate = true

    this.jointY.autoUpdate = true

    // Upper Arm
    this.upperArm = new Line(this.state).create({
      weight: args.upperArmWeight || args.weight,
      color: args.upperArmColor || args.color,
      points: [{}, { x: this.jointX, y: this.jointY }],
      z: this.args.zInd,
    })

    if (args.upperArmLightColor) {
      this.upperArmInner = new Line(this.state).create({
        weight: [args.upperArmWeight || args.weight, -2],
        color: args.upperArmLightColor,
        points: [{}, { x: this.jointX, y: this.jointY }],
        z: this.args.zInd,
      })
    }

    // Lower Arm
    this.lowerArm = new Line(this.state).create({
      weight: args.lowerArmWeight || args.weight,
      color: args.lowerArmColor || args.color,
      points: [
        { x: this.jointX, y: this.jointY },
        { x: this.endX, y: this.endY },
      ],
      z: this.args.zInd,
    })

    if (args.lowerArmLightColor) {
      this.lowerArmInner = new Line(this.state).create({
        weight: [args.lowerArmWeight || args.weight, -2],
        color: args.lowerArmLightColor,
        points: [
          { x: this.jointX, y: this.jointY },
          { x: this.endX, y: this.endY },
        ],
        z: this.args.zInd,
      })
    }

    if (args.debug) {
      this.showDebug = true
      // this.debug = new drawingTool.Rect().create({
      // 	x: this.targetX,
      // 	y: this.targetY,
      // 	s:1,
      // 	color: [255,0,0],
      // 	z: Infinity
      // });

      this.debugLowerArm = new Line(this.state).create({
        weight: 1,
        color: [80, 0, 0],
        points: [
          { x: this.endX, y: this.endY },
          { x: this.jointX, y: this.jointY },
        ],
        z: Infinity,
      })

      this.debugUpperArm = new Line(this.state).create({
        weight: 1,
        color: [125, 0, 0],
        points: [{ x: this.jointX, y: this.jointY }, {}],
        z: Infinity,
      })

      this.debugArmTarget = new Line(this.state).create({
        weight: 1,
        color: [0, 255, 255],
        points: [
          { x: this.endX, y: this.endY },
          { x: this.targetX, y: this.targetY },
        ],
        z: Infinity,
      })

      // this.debugEllbow = new drawingTool.Dot().create({
      // 	color:[0,150,0],
      // 	x: this.jointX,
      // 	y: this.jointY,
      // 	z: Infinity
      // });

      // this.debugEnd = new drawingTool.Dot().create({
      // 	color:[0,255,0],
      // 	x: this.endX,
      // 	y: this.endY,
      // 	z: Infinity
      // });
    }

    if ((hand = args.hand)) {
      this.handLength = new this.state.pixelUnit.createSize(
        args.hand.length || {
          r: 0.1,
          useSize: this.length,
          min: 1,
        },
      )

      this.handEndX = hand.endX

      this.handEndY = hand.endY

      this.handTargetX = hand.targetX

      this.handTargetY = hand.targetY

      this.handRelativeToArm = hand.toArm || this.ellbow

      this.handRelativeToDirection = hand.toDir

      this.hand = new Line(this.state).create({
        weight: hand.width || args.lowerArmWeight || args.weight,
        color: hand.color || args.lowerArmColor || args.color,
        points: [
          { x: this.endX, y: this.endY },
          { x: this.handEndX, y: this.handEndY },
        ],
        z: this.args.zInd,
      })

      if (this.showDebug) {
        // this.debugHandEnd = new drawingTool.Dot().create({
        // 	color:[0,0,255],
        // 	x: this.handEndX,
        // 	y: this.handEndY,
        // 	z: Infinity
        // });

        // this.debugHandTarget = new drawingTool.Dot().create({
        // 	color:[0,255,0],
        // 	x: [ this.handTargetX, this.endX ],
        // 	y: [ this.handTargetY, this.endY ],
        // 	z: Infinity
        // });

        this.debugHandTarget = new Line(this.state).create({
          weight: 1,
          color: [255, 255, 0],
          points: [
            { x: this.handEndX, y: this.handEndY },
            {
              x: [this.handTargetX, this.endX],
              y: [this.handTargetY, this.endY],
            },
          ],
          z: Infinity,
        })
      }
    }
  }

  draw() {
    const dimensions = this.dimensions.calc()

    this.fullLength = this.length.s.getReal()

    this.upperArmLength = this.fullLength * this.ratio

    this.lowerArmLength = this.fullLength - this.upperArmLength

    if (this.ellbow) {
      this.calculateFromEllbow()
    } else {
      this.calculateFromHand()
    }

    this.endX.calculated = true

    this.endY.calculated = true

    this.jointX.calculated = true

    this.jointY.calculated = true

    // draw
    this.state.pixelUnit.push(dimensions)

    // Hand
    if (this.hand) {
      this.drawHand()
    }

    // Debug
    if (this.showDebug) {
      if (this.debugEnd) {
        this.debugEnd.draw()
      }

      if (this.debugEllbow) {
        this.debugEllbow.draw()
      }

      if (this.debug) {
        this.debug.draw()
      }

      if (this.debugUpperArm) {
        this.debugUpperArm.draw()
      }

      if (this.debugLowerArm) {
        this.debugLowerArm.draw()
      }

      if (!this.ellbow && this.debugArmTarget) {
        this.debugArmTarget.draw()
      }
    }

    if (this.lowerArmInner) {
      this.lowerArmInner.draw()
    }

    if (this.upperArmInner) {
      this.upperArmInner.draw()
    }

    this.lowerArm.draw()

    this.upperArm.draw()

    this.state.pixelUnit.pop()
  }

  calculateFromEllbow() {
    const jointY = this.targetY.s.getReal()

    if (this.upperArmLength >= Math.abs(jointY)) {
      // if ellbow can reach

      this.jointX.real = Math.sqrt(
        Math.pow(this.upperArmLength, 2) - Math.pow(jointY, 2),
      )

      this.jointY.real = this.endY.real = jointY

      this.endX.real = this.jointX.real
    } else {
      // if ellbow can’t reach, let it hang down
      this.jointX.real = 0

      this.jointY.real = this.upperArmLength

      this.endY.real = this.upperArmLength + this.lowerArmLength

      if (this.lowerArmLength > jointY - this.upperArmLength) {
        // if hand can reach
        this.endX.real =
          this.upperArmLength +
          Math.sqrt(
            Math.pow(this.lowerArmLength, 2) -
              Math.pow(jointY - this.upperArmLength, 2),
          )
      } else {
        // if hand can’t reach, let it hang down
        this.endX.real = 0
      }
    }

    // - this.lowerArmLength;

    this.straightAngle = 0.5
  }

  calculateFromHand() {
    let x = this.targetX.s.getReal()
    let y = this.targetY.s.getReal()
    let fullDistance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    let lengthToDistanceRatio
    let innerAngle

    // - - - - Calculate End Point
    this.fullLength *= this.maxStraight

    if (fullDistance > 0) {
      lengthToDistanceRatio = this.fullLength / fullDistance

      if (lengthToDistanceRatio < 1) {
        x *= lengthToDistanceRatio

        y *= lengthToDistanceRatio

        fullDistance *= lengthToDistanceRatio
      }

      if (this.upperArmLength - this.lowerArmLength > fullDistance) {
        lengthToDistanceRatio =
          (this.upperArmLength - this.lowerArmLength) / fullDistance

        x *= lengthToDistanceRatio

        y *= lengthToDistanceRatio

        fullDistance *= lengthToDistanceRatio
      }
    }

    this.endX.real = Math.round(x)

    this.endY.real = Math.round(y)

    // - - - - Calculate Joints

    // get the angle of the straight line relative to zero
    this.straightAngle = Math.acos(y / fullDistance)

    if (x < 1) {
      this.straightAngle *= -1
    }

    // get the angle of the upper Arm relative to the straight line
    innerAngle = Math.acos(
      (Math.pow(this.upperArmLength, 2) +
        Math.pow(fullDistance - 0.001, 2) -
        Math.pow(this.lowerArmLength, 2)) /
        (2 * this.upperArmLength * fullDistance),
    )

    // decide direction of ellbow
    if (this.flip) {
      innerAngle *= -1
    }

    // get the angle of the upper arm triangle
    const upperArmAngle = this.straightAngle + innerAngle

    // get one sides of the upper arm triangle
    this.jointX.real = Math.round(this.upperArmLength * Math.sin(upperArmAngle))

    this.jointY.real = Math.round(this.upperArmLength * Math.cos(upperArmAngle))

    if (isNaN(this.jointX.real)) {
      this.jointX.real = 0
    }

    if (isNaN(this.jointY.real)) {
      this.jointY.real = 0
    }

    this.x = x
  }

  drawHand() {
    const endX = this.endX.real
    const endY = this.endY.real
    const targetX = this.handTargetX.s.getReal()
    const targetY = this.handTargetY.s.getReal()
    const length = this.handLength.getReal()
    const distance = Math.sqrt(Math.pow(targetX, 2) + Math.pow(targetY, 2))
    const ratio = length / (distance || 0.1)

    this.handEndX.real = endX + targetX * ratio

    this.handEndY.real = endY + targetY * ratio

    this.handEndX.calculated = true

    this.handEndY.calculated = true

    this.hand.draw()

    if (this.showDebug) {
      if (this.debugHandEnd) {
        this.debugHandEnd.draw()
      }

      // this.debugHandTarget.draw();
      if (this.debugHandTarget) {
        this.debugHandTarget.draw()
      }
    }
  }
}

export const DrawingTools = function (pixelUnit) {
  const seed = getSeedHandler()
  const pixelSetter = getPixelSetter()

  const state = {
    pixelUnit,
    seed,
    pixelSetter,
  }

  const drawingTools = {
    Primitive,
    Dot,
    Line,
    Polygon,
    Fill,
    FillRandom,
    Rect,
    Stripes,
    Obj,
    RoundRect,
    Grid,
    Panels,
    Arm,
  }

  const init = function (width, height) {
    pixelUnit.init({
      width,
      height,
    })

    const pixelArray = createPixelArray(width, height)

    pixelSetter.setArray(pixelArray)

    seed.reset()

    return pixelArray
  }

  return { init, getObj: () => new Obj(state, drawingTools) }
}
