/* global Builder */

// UPPER BODY --------------------------------------------------------------------------------
Builder.prototype.UpperBody = function (args) {
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
  ).copy({
    brSet: shirtColor === 4 ? 3 : shirtColor + 1,
    max: 4,
  })

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
} // END UpperBody
Builder.prototype.UpperBody.prototype = new Builder.prototype.Object()
Builder.prototype.UpperBody.prototype.draw = function (args) {
  const { nr } = args
  const { sideView } = args
  const { backView } = args

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
        add: [args.upperBodySY, this.sub(args.chestSY)],
      })
    }
    args.trapSX = this.pushLinkList({
      add: [args.chestSX, this.mult(sideView ? -2 : -1, args.neckSX)],
    })

    args.collarSX = this.pushLinkList(this.shirt ? 1 : { a: 0 })
  }

  return {
    sX: args.upperBodySX,
    sY: args.upperBodySY,
    y: args.lowerBodySY,
    cX: sideView,
    fY: true,
    color: this.clothColor.get(),
    id: `upperBody${nr}`,
    list: [
      !sideView &&
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
        cX: sideView,
        list: [
          {},

          // Collar
          this.collar && this.collar.draw(args, 6),

          // Arm
          this.arm.draw(args, args.right),

          // Arm SideView
          sideView && this.arm.draw(args, !args.right, true),

          // Cape
          this.cape && this.cape.draw(args),
          !backView && this.cape && this.cape.drawFront(args),
        ],
      },

      // Stomach
      this.chestWide && {
        sY: args.stomachSY,
        cX: sideView,
        fY: true,
      },

      this.stripes && this.stripes.draw(args),

      !backView &&
        this.breast && {
          color: this.clothShadowColor.get(),
          sY: 1,
          mX: { r: 0.2 },
          y: { r: 0.35 },
        },

      this.hanky &&
        !backView &&
        (sideView || !args.right) && {
          color: this.shirtColor.get(),
          sX: { r: sideView ? 0.2 : 0.3 },
          sY: { r: 0.1, max: 1 },
          y: { r: 0.2 },
          x: { r: 0.2, min: 1 },
          fX: !sideView || !args.right,
        },

      !backView && this.logo && this.logo.draw(args, 3),
      !backView && this.nipples && this.nipples.draw(args, 3),
      !backView && this.buttons && this.buttons.draw(args, 5),
      this.suspenders && this.suspenders.draw(args, 7),
      this.strap && this.strap.draw(args, 10),
    ],
  }
} // END UpperBody draw

// STRIPES --------------------------------------------------------------------------------
Builder.prototype.Stripes = function (args) {
  // Form & Sizes
  this.gap = this.R(0.05, 0.2)
  this.strip = this.R(0.05, 0.2)
  this.horizontal = this.IF(0.5)
  this.randomDots = this.IF(0.05)
  this.doted = !this.randomDots && this.IF(0.1)

  if (this.doted) {
    this.dotGap = this.R(0.05, 0.2)
    this.dotStrip = this.R(0.05, 0.2)
  }

  // Colors
  this.stripColor = (this.IF(0.5) ? args.secondColor : args.clothColor).copy({
    brSet: args.clothColor.getBr() - 1,
  })

  // Assets
} // END Stripes
Builder.prototype.Stripes.prototype = new Builder.prototype.Object()
Builder.prototype.Stripes.prototype.draw = function (args, z) {
  const { sideView } = args

  return (
    (sideView || !args.right) && {
      fX: true,
      z,
      sX: !sideView && { r: 2, useSize: args.upperBodySX, a: -1 },
      color: this.stripColor.get(),
      stripes: !this.dots && {
        gap: { r: this.gap, useSize: args.upperBodySY },
        strip: { r: this.strip, useSize: args.upperBodySY },
        horizontal: this.horizontal,
      },
      list: this.randomDots
        ? [
            {
              use: args.shirt,
              chance: 0.5,
              sX: { r: this.gap, useSize: args.upperBodySY },
              sY: { r: this.strip, useSize: args.upperBodySY },
              mask: true,
            },
            { save: args.shirt },
          ]
        : this.doted && [
            {
              stripes: !this.dots && {
                gap: {
                  r: this.dotGap,
                  useSize: args.upperBodySY,
                },
                strip: {
                  r: this.dotStrip,
                  useSize: args.upperBodySY,
                },
                horizontal: !this.horizontal,
              },
            },
          ],
    }
  )
} // END Stripes draw

// BUTTONS --------------------------------------------------------------------------------
Builder.prototype.Buttons = function (args, color) {
  // Form & Sizes
  this.buttonSX = this.R(-0.2, 0.2)
  this.zipper = this.IF(0.1)
  this.buttonSY = !this.zipper && this.R(-0.1, 0.1)
  this.buttonGapSY = !this.zipper && this.R(-0.1, 0.1)

  // Colors
  this.buttonsColor = color.copy({ brContrast: -1 })

  // Assets
} // END Buttons
Builder.prototype.Buttons.prototype = new Builder.prototype.Object()
Builder.prototype.Buttons.prototype.draw = function (args, z) {
  const { sideView } = args

  return (
    !args.backView && {
      sX: { r: this.buttonSX, useSize: args.chestSX, min: 1 },
      fY: true,
      cX: sideView,
      color: this.buttonsColor.get(),
      z,
      // rX: sideView && args.right,
      list: !this.zipper && [
        {
          stripes: {
            gap: {
              r: this.buttonGapSY,
              useSize: args.upperBodySY,
              min: 1,
            },
            horizontal: true,
            strip: {
              r: this.buttonSY,
              useSize: args.upperBodySY,
              min: 1,
            },
          },
        },
      ],
    }
  )
} // END Buttons draw

// SUSPENDERS --------------------------------------------------------------------------------
Builder.prototype.Suspenders = function (args) {
  // Form & Sizes
  this.strapSX = this.R(-0.8, 0.5)
  this.strapX = this.R(0.5, 1)

  this.detail = this.IF(0.5)

  // Colors
  this.strapColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: -1,
  })
  if (this.detail) {
    this.detailColor = args.clothColor.copy({
      brContrast: this.IF(0.5) ? 1 : -1,
    })
  }

  // Assets
} // END Suspenders
Builder.prototype.Suspenders.prototype = new Builder.prototype.Object()
Builder.prototype.Suspenders.prototype.draw = function (args, z) {
  const { nr } = args
  const { sideView } = args
  const detail = this.detail && [
    {},
    {
      color: this.detailColor.get(),
      sY: { r: 1, otherDim: true },
      fY: true,
    },
  ]

  if (args.calc) {
    args.trapSX = this.pushLinkList({
      add: [args.upperBodySX, this.sub(args.neckSX)],
    })
  }

  return {
    z,
    color: this.strapColor.get(),
    id: `strap${nr}`,
    fX: true,
    list: [
      {
        sX: {
          r: this.strapSX * (sideView ? 0.5 : 1),
          useSize: args.trapSX,
          min: 1,
          save: args.strapSX,
        },
        x: {
          r: this.strapX * (sideView ? 0.5 : 1),
          useSize: args.trapSX,
          max: [args.trapSX, this.sub(args.strapSX)],
          min: { a: 0 },
        },
        fX: true,
        list: detail,
      },
      sideView && {
        sX: {
          r: this.strapSX * (sideView ? 0.5 : 1),
          useSize: args.trapSX,
          min: 1,
          save: args.strapSX,
        },
        x: {
          r: this.strapX * (sideView ? 0.5 : 1),
          useSize: args.trapSX,
          max: [args.trapSX, this.sub(args.strapSX)],
        },
        list: detail,
      },
    ],
  }
} // END Suspenders draw

// COLLAR --------------------------------------------------------------------------------
Builder.prototype.Collar = function (args) {
  // Form & Sizes
  this.collarSY = this.R(0.1, 0.5)
  this.open = this.IF(0.2)
  this.tie = this.IF()
  this.fullTie = this.open || this.IF()
  this.scarf = !this.tie && this.IF(0.05)

  // Colors
  if (this.tie) {
    this.tieColor = args.clothColor.copy({ brSet: 0 })
  }
  this.shirtColor = args.shirtColor

  // Assets
  if (this.open && this.IF(0.3)) {
    this.buttons = new this.basic.Buttons(args, this.shirtColor)
  }
} // END Collar
Builder.prototype.Collar.prototype = new Builder.prototype.Object()
Builder.prototype.Collar.prototype.draw = function (args, z) {
  const { nr } = args
  const { sideView } = args

  return {
    z: 10,
    color: this.shirtColor.get(),
    sX: this.scarf
      ? { add: [args.headSX], max: args.chestSX }
      : [args.neckSX, sideView ? 2 : 1],
    sY: { r: this.collarSY, max: args.backView && 1 },
    cX: sideView,
    fX: !this.scarf && sideView,
    list: [
      this.scarf && {
        ty: true,
        sY: 2,
        y: -1,
        z: z + 100,
      },
      { sY: { r: 1, max: 2 } },
      {
        minY: 4,
        points: [{ y: 1 }, { y: 1, fX: true }, { fY: true }],
      },
      !args.backView &&
        this.open && {
          sX: { r: 0.5, min: 1 },
          sY: args.upperBodySY,
        },

      this.buttons && {
        sX: { r: 0.5, min: 1 },
        sY: args.upperBodySY,
        list: [this.buttons.draw(args, z)],
      },

      !args.backView &&
        this.tie && {
          sX: { r: 0.25, min: 1 },
          sY: this.fullTie && [args.upperBodySY, -1],
          minY: 4,
          id: `tie${nr}`,
          color: this.tieColor.get(),
          list: [
            {
              name: 'Dot',
              fY: true,
              fX: true,
              clear: true,
            },
            {},
          ],
        },
    ],
  }
} // END Collar Shirt draw

// CLEAVAGE --------------------------------------------------------------------------------
Builder.prototype.Cleavage = function (args) {
  // Form & Sizes
  this.sleeveless = !args.sleeves && this.IF(0.5)
  this.strapSX = this.sleeveless && this.R(-1, 0)
  this.strapSY = this.sleeveless && this.R(0.05, 0.3)

  this.cleavage = !this.sleeveless || this.IF(0.5)
  this.cleavageSX = this.cleavage ? this.cleavage && this.R(1, 2) : 1
  this.cleavageSY = this.cleavage && this.R(0.05, 0.3)

  // Colors
  this.skinColor = args.skinColor

  // Assets
} // END Cleavage
Builder.prototype.Cleavage.prototype = new Builder.prototype.Object()

Builder.prototype.Cleavage.prototype.draw = function (args, z) {
  const { sideView } = args

  if (args.calc) {
    args.cleavageSX = this.pushLinkList({
      r: this.cleavageSX,
      useSize: args.neckSX,
      max: [args.chestSX, -2],
    })
    args.cleavageX = this.pushLinkList(
      sideView
        ? [
            this.mult(0.5, args.chestSX),
            this.mult(-0.5, args.cleavageSX),
            this.sub(args.collarSX),
          ]
        : [args.chestSX, this.mult(-1, args.cleavageSX)],
    )

    if (this.sleeveless) {
      if (sideView) {
        args.cleavageRightX = this.pushLinkList({
          add: [
            args.chestSX,
            this.sub(args.cleavageX),
            this.sub(args.cleavageSX),
          ],
        })
      }
      args.strapSX = this.pushLinkList({
        r: this.strapSX,
        useSize: args.cleavageX,
        max: -1,
      })
    }
  }

  return {
    list: [
      sideView &&
        this.sleeveless && {
          color: this.skinColor.get(),
          sX: [args.cleavageRightX, args.strapSX],
          sY: args.sleevelessSY,
        },
      this.sleeveless && {
        color: this.skinColor.get(),
        sX: [args.cleavageX, args.strapSX],
        sY: {
          r: this.strapSY,
          add: [args.shoulderSY],
          save: args.sleevelessSY,
        },
        fX: true,
      },
      this.cleavage && {
        z,
        color: this.skinColor.get(),
        sY: { r: this.cleavageSY },
        x: sideView && args.cleavageX,
        sX: args.cleavageSX,
        fX: sideView,
      },
    ],
  }
} // END Cleavage draw

// NIPPLES --------------------------------------------------------------------------------
Builder.prototype.Nipples = function (args) {
  // Form & Sizes
  this.nippleSize = this.R(0.01, 0.3)
  this.nipplePos = this.R(0.15, 0.4)

  // Colors
  this.nippleColor = args.skinShadowColor

  // Assets
} // END Nipples
Builder.prototype.Nipples.prototype = new Builder.prototype.Object()
Builder.prototype.Nipples.prototype.draw = function (args, z) {
  const { sideView } = args

  if (args.calc) {
    args.nippleS = this.pushLinkList({
      r: this.nippleSize,
      useSize: args.chestSX,
    })
  }

  return {
    color: this.nippleColor.get(),
    s: args.nippleS,
    y: { r: this.nipplePos, min: 1 },
    x: { r: 0.2, min: 1 },
    fX: !sideView,
    z,
  }
} // END Nipples draw

// CAPE --------------------------------------------------------------------------------
Builder.prototype.Cape = function (args) {
  // Form & Sizes
  this.capeFrontSY = this.R(0.1, 0.8)
  this.capeSY = this.R(0.3, 1)

  // Color
  this.capeColor = args.clothColor.copy({ nextColor: true, brContrast: -2 })

  // Assets
} // END Cape
Builder.prototype.Cape.prototype = new Builder.prototype.Object()

Builder.prototype.Cape.prototype.draw = function (args) {
  const { sideView } = args

  if (args.calc) {
    args.capeFrontSY = this.pushLinkList({
      r: this.capeFrontSY,
      useSize: args.upperArmSY,
    })
    args.capeSY = this.pushLinkList({
      r: this.capeSY,
      useSize: args.fullBodySY,
      max: [args.fullBodySY, -1],
      min: args.capeFrontSY,
    })
  }

  return {
    z: args.backView ? 500 : -500,
    color: this.capeColor.get(),
    sX: args.shoulderFullSX,
    sY: args.capeSY,
    fX: sideView,
    x: sideView && this.sub(args.shoulderSX),
  }
} // END Cape Back draw

Builder.prototype.Cape.prototype.drawFront = function (args) {
  const { sideView } = args

  return {
    color: this.capeColor.get(),
    sX: args.shoulderFullSX,
    x: sideView && this.sub(args.shoulderSX),
    sY: args.capeFrontSY,
  }
} // END Cape draw

// STRAP --------------------------------------------------------------------------------
Builder.prototype.Strap = function (args) {
  // Form & Sizes
  this.thickness = this.R(0.01, 0.05)

  // Color
  this.strapColor =
    args.beltColor ||
    (args.beltColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
      brContrast: this.IF() ? 2 : -2,
    }))

  // Assets
} // END Strap
Builder.prototype.Strap.prototype = new Builder.prototype.Object()

Builder.prototype.Strap.prototype.draw = function (args, z) {
  const { nr } = args
  const { sideView } = args

  if (args.calc) {
    args.strapTickness = this.pushLinkList({
      r: this.thickness,
      useSize: args.personSY,
      min: 1,
    })
  }

  return (
    (sideView || args.right) && {
      rX: sideView && !args.right,
      id: `strap${nr}`,
      list: [
        {
          tY: true,
          tX: true,
          clear: true,
          sY: args.strapTickness,
          mX: this.sub(args.strapTickness),
        },
        {
          z,
          weight: args.strapTickness,
          color: this.strapColor.get(),
          points: [
            {
              fX: true,
              fY: true,
              x: this.mult(0.5, args.strapTickness),
            },
            {
              fX: true,
              x: {
                r: sideView ? 1 : 2,
                useSize: args.personSX,
                add: [this.mult(-0.5, args.strapTickness), -2],
              },
            },
          ],
        },
      ],
    }
  )
} // END Strap Back draw
