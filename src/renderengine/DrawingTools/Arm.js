import Rect from '@/renderengine/DrawingTools/Rect'

import Dot from './Dot'
import Line from './Line'
import Obj from './Obj'

class Arm extends Obj {
  init(args) {
    if (this.args === undefined) {
      throw new Error('Unexpected error: args is undefined')
    }

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

    if (this.targetX === undefined) {
      throw new Error('Unexpected error: targetX is undefined')
    }

    if (this.targetY === undefined) {
      throw new Error('Unexpected error: targetY is undefined')
    }

    if (this.endX === undefined) {
      throw new Error('Unexpected error: endX is undefined')
    }

    if (this.endY === undefined) {
      throw new Error('Unexpected error: endY is undefined')
    }

    if (this.jointX === undefined) {
      throw new Error('Unexpected error: jointX is undefined')
    }

    if (this.jointY === undefined) {
      throw new Error('Unexpected error: jointY is undefined')
    }

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

      this.debug = new Rect(this.state).create({
        x: this.targetX,
        y: this.targetY,
        s: 1,
        color: [255, 0, 0],
        z: Infinity,
      })

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

      this.debugEllbow = new Dot(this.state).create({
        color: [0, 150, 0],
        x: this.jointX,
        y: this.jointY,
        z: Infinity,
      })

      this.debugEnd = new Dot(this.state).create({
        color: [0, 255, 0],
        x: this.endX,
        y: this.endY,
        z: Infinity,
      })
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
        this.debugHandEnd = new Dot(this.state).create({
          color: [0, 0, 255],
          x: this.handEndX,
          y: this.handEndY,
          z: Infinity,
        })

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

export default Arm
