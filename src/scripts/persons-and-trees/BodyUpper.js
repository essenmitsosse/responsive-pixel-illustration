import { mult, sub } from '@/helper/helperDim'

import Object from './Object'

const BodyUpper = function (args) {
  const shirtColor = args.firstColor.getBr()

  // Form & Sizes
  this.thickShoulder = (this.IF() && this.R(1.5, 4)) || 1.5

  this.chestWide = this.IF(0.05)

  this.chestSX = (this.chestWide && this.R(1, 1.3)) || 1

  this.chestSY = (this.chestWide && this.R(0.3, 0.8)) || 1

  this.chestStartSY = (this.chestWide && this.R(0.1, 0.5)) || 0

  this.topless = args.topless = args.animal || this.IF(0.02)

  this.waist = !this.chestWide && this.IF(0.05)

  this.breast = this.IF(0.05)

  this.hanky = !this.topless && this.IF(0.02)

  // Colors
  this.clothColor = args.clothColor = args.topless
    ? args.skinColor
    : args.firstColor

  this.clothShadowColor = this.clothColor.copy({ brAdd: -1 })

  this.skinColor = args.skinColor

  this.shirtColor = args.shirtColor = (
    this.IF(0.5) ? args.secondColor : args.clothColor
  ).copy({ brSet: shirtColor === 4 ? 3 : shirtColor + 1, max: 4 })

  // Assets
  this.arm = new this.basic.Arm(args)

  if (this.IF(0.05)) {
    this.cape = new this.basic.Cape(args)
  }

  if (this.topless && this.IF(0.8)) {
    this.nipples = new this.basic.Nipples(args)
  }

  if (!args.animal) {
    if (this.IF(0.07)) {
      this.suspenders = new this.basic.Suspenders(args)
    }

    if (this.IF(0.02)) {
      this.strap = new this.basic.Strap(args)
    }
  }

  if (!this.topless) {
    if (!this.breast && !this.chestWide && this.IF(0.05)) {
      this.stripes = new this.basic.Stripes(args)
    }

    if (this.IF(0.4)) {
      this.collar = this.IF()
        ? new this.basic.Cleavage(args)
        : new this.basic.Collar(args)
    }

    if (this.IF(0.3)) {
      this.buttons = new this.basic.Buttons(args, this.clothColor)
    }
  }

  if (this.IF(0.1)) {
    this.logo = new this.basic.Logo(args)
  }
}
// END BodyUpper

BodyUpper.prototype = new Object()

BodyUpper.prototype.draw = function (args) {
  if (args.calc) {
    args.upperBodySX = this.pushLinkList(args.personRealSX)

    args.chestSX = this.pushLinkList({
      r: this.chestSX,
      useSize: args.upperBodySX,
      min: 1,
      max: [args.upperBodySX, 1],
    })

    args.chestSY = this.pushLinkList({
      r: this.chestSY,
      useSize: args.upperBodySY,
      min: 1,
    })

    if (this.chestWide) {
      args.stomachSY = this.pushLinkList({
        add: [args.upperBodySY, sub(args.chestSY)],
      })
    }

    args.trapSX = this.pushLinkList({
      add: [args.chestSX, mult(args.sideView ? -2 : -1, args.neckSX)],
    })

    args.collarSX = this.pushLinkList(this.shirt ? 1 : { a: 0 })
  }

  return {
    sX: args.upperBodySX,
    sY: args.upperBodySY,
    y: args.lowerBodySY,
    cX: args.sideView,
    fY: true,
    color: this.clothColor.get(),
    id: 'upperBody' + args.nr,
    list: [
      !args.sideView &&
        this.waist && {
          clear: true,
          sX: { r: 0.2, max: 1 },
          fX: true,
          sY: { r: 0.3 },
          y: { r: 0.5 },
          minY: 3,
        },
      // Chest
      {
        sX: args.chestSX,
        sY: args.chestSY,
        cX: args.sideView,
        list: [
          {},

          // Collar
          this.collar && this.collar.draw(args, 6),

          // Arm
          this.arm.draw(args, args.right),

          // Arm args.sideView
          args.sideView && this.arm.draw(args, !args.right, true),

          // Cape
          this.cape && this.cape.draw(args),
          !args.backView && this.cape && this.cape.drawFront(args),
        ],
      },

      // Stomach
      this.chestWide && {
        sY: args.stomachSY,
        cX: args.sideView,
        fY: true,
      },

      this.stripes && this.stripes.draw(args),

      !args.backView &&
        this.breast && {
          color: this.clothShadowColor.get(),
          sY: 1,
          mX: { r: 0.2 },
          y: { r: 0.35 },
        },

      this.hanky &&
        !args.backView &&
        (args.sideView || !args.right) && {
          color: this.shirtColor.get(),
          sX: { r: args.sideView ? 0.2 : 0.3 },
          sY: { r: 0.1, max: 1 },
          y: { r: 0.2 },
          x: { r: 0.2, min: 1 },
          fX: !args.sideView || !args.right,
        },

      !args.backView && this.logo && this.logo.draw(args, 3),
      !args.backView && this.nipples && this.nipples.draw(args, 3),
      !args.backView && this.buttons && this.buttons.draw(args, 5),
      this.suspenders && this.suspenders.draw(args, 7),
      this.strap && this.strap.draw(args, 10),
    ],
  }
}

export default BodyUpper
