import { Object } from './object.js'

// UPPER BODY --------------------------------------------------------------------------------
export const UpperBody = function (args) {
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
      this.collar = new (this.IF() ? this.basic.Cleavage : this.basic.Collar)(
        args,
      )
    }

    if (this.IF(0.3)) {
      this.buttons = new this.basic.Buttons(args, this.clothColor)
    }
  }

  if (this.IF(0.1)) {
    this.logo = new this.basic.Logo(args)
  }
}
// END UpperBody

UpperBody.prototype = new Object()

UpperBody.prototype.draw = function (args) {
  if (args.calc) {
    this.vL['upperBodySX' + args.nr] = 'personRealSX' + args.nr

    this.vL['chestSX' + args.nr] = {
      r: this.chestSX,
      useSize: 'upperBodySX' + args.nr,
      min: 1,
      max: ['upperBodySX' + args.nr, 1],
    }

    this.vL['chestSY' + args.nr] = {
      r: this.chestSY,
      useSize: 'upperBodySY' + args.nr,
      min: 1,
    }

    if (this.chestWide) {
      this.vL['stomachSY' + args.nr] = [
        'upperBodySY' + args.nr,
        this.sub('chestSY' + args.nr),
      ]
    }

    this.vL['trapSX' + args.nr] = [
      'chestSX' + args.nr,
      this.mult(args.sideView ? -2 : -1, 'neckSX' + args.nr),
    ]

    this.vL['collarSX' + args.nr] = this.shirt ? 1 : { a: 0 }
  }

  return {
    sX: 'upperBodySX' + args.nr,
    sY: 'upperBodySY' + args.nr,
    y: 'lowerBodySY' + args.nr,
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
        sX: 'chestSX' + args.nr,
        sY: 'chestSY' + args.nr,
        cX: args.sideView,
        list: [
          {},

          // Collar
          this.collar && this.collar.draw(args, 6),

          // Arm
          this.arm.draw(args, args.right),

          // Arm SideView
          args.sideView && this.arm.draw(args, !args.right, true),

          // Cape
          this.cape && this.cape.draw(args),
          !args.backView && this.cape && this.cape.drawFront(args),
        ],
      },

      // Stomach
      this.chestWide && {
        sY: 'stomachSY' + args.nr,
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
// END UpperBody draw

// STRIPES --------------------------------------------------------------------------------
export const Stripes = function (args) {
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
}
// END Stripes

Stripes.prototype = new Object()

Stripes.prototype.draw = function (args, z) {
  return (
    (args.sideView || !args.right) && {
      fX: true,
      z,
      sX: !args.sideView && { r: 2, useSize: 'upperBodySX' + args.nr, a: -1 },
      color: this.stripColor.get(),
      stripes: !this.dots && {
        gap: { r: this.gap, useSize: 'upperBodySY' + args.nr },
        strip: { r: this.strip, useSize: 'upperBodySY' + args.nr },
        horizontal: this.horizontal,
      },
      list: this.randomDots
        ? [
            {
              use: 'shirt' + args.nr,
              chance: 0.5,
              sX: { r: this.gap, useSize: 'upperBodySY' + args.nr },
              sY: { r: this.strip, useSize: 'upperBodySY' + args.nr },
              mask: true,
            },
            { save: 'shirt' + args.nr },
          ]
        : this.doted && [
            {
              stripes: !this.dots && {
                gap: {
                  r: this.dotGap,
                  useSize: 'upperBodySY' + args.nr,
                },
                strip: {
                  r: this.dotStrip,
                  useSize: 'upperBodySY' + args.nr,
                },
                horizontal: !this.horizontal,
              },
            },
          ],
    }
  )
}
// END Stripes draw

// BUTTONS --------------------------------------------------------------------------------
export const Buttons = function (args, color) {
  // Form & Sizes
  this.buttonSX = this.R(-0.2, 0.2)

  this.zipper = this.IF(0.1)

  this.buttonSY = !this.zipper && this.R(-0.1, 0.1)

  this.buttonGapSY = !this.zipper && this.R(-0.1, 0.1)

  // Colors
  this.buttonsColor = color.copy({ brContrast: -1 })

  // Assets
}
// END Buttons

Buttons.prototype = new Object()

Buttons.prototype.draw = function (args, z) {
  return (
    !args.backView && {
      sX: { r: this.buttonSX, useSize: 'chestSX' + args.nr, min: 1 },
      fY: true,
      cX: args.sideView,
      color: this.buttonsColor.get(),
      z,
      // rX:sideView && args.right,
      list: !this.zipper && [
        {
          stripes: {
            gap: {
              r: this.buttonGapSY,
              useSize: 'upperBodySY' + args.nr,
              min: 1,
            },
            horizontal: true,
            strip: {
              r: this.buttonSY,
              useSize: 'upperBodySY' + args.nr,
              min: 1,
            },
          },
        },
      ],
    }
  )
}
// END Buttons draw

// SUSPENDERS --------------------------------------------------------------------------------
export const Suspenders = function (args) {
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
}
// END Suspenders

Suspenders.prototype = new Object()

Suspenders.prototype.draw = function (args, z) {
  const detail = this.detail && [
    {},
    {
      color: this.detailColor.get(),
      sY: { r: 1, otherDim: true },
      fY: true,
    },
  ]

  if (args.calc) {
    this.vL['trapSX' + args.nr] = [
      'upperBodySX' + args.nr,
      this.sub('neckSX' + args.nr),
    ]
  }

  return {
    z,
    color: this.strapColor.get(),
    id: 'strap' + args.nr,
    fX: true,
    list: [
      {
        sX: {
          r: this.strapSX * (args.sideView ? 0.5 : 1),
          useSize: 'trapSX' + args.nr,
          min: 1,
          save: 'strapSX' + args.nr,
        },
        x: {
          r: this.strapX * (args.sideView ? 0.5 : 1),
          useSize: 'trapSX' + args.nr,
          max: ['trapSX' + args.nr, this.sub('strapSX' + args.nr)],
          min: { a: 0 },
        },
        fX: true,
        list: detail,
      },
      args.sideView && {
        sX: {
          r: this.strapSX * (args.sideView ? 0.5 : 1),
          useSize: 'trapSX' + args.nr,
          min: 1,
          save: 'strapSX' + args.nr,
        },
        x: {
          r: this.strapX * (args.sideView ? 0.5 : 1),
          useSize: 'trapSX' + args.nr,
          max: ['trapSX' + args.nr, this.sub('strapSX' + args.nr)],
        },
        list: detail,
      },
    ],
  }
}
// END Suspenders draw

// COLLAR --------------------------------------------------------------------------------
export const Collar = function (args) {
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
}
// END Collar

Collar.prototype = new Object()

Collar.prototype.draw = function (args, z) {
  return {
    z: 10,
    color: this.shirtColor.get(),
    sX: this.scarf
      ? { a: 'headSX' + args.nr, max: 'chestSX' + args.nr }
      : ['neckSX' + args.nr, args.sideView ? 2 : 1],
    sY: { r: this.collarSY, max: args.backView && 1 },
    cX: args.sideView,
    fX: !this.scarf && args.sideView,
    list: [
      this.scarf && { ty: true, sY: 2, y: -1, z: z + 100 },
      { sY: { r: 1, max: 2 } },
      {
        minY: 4,
        points: [{ y: 1 }, { y: 1, fX: true }, { fY: true }],
      },
      !args.backView &&
        this.open && {
          sX: { r: 0.5, min: 1 },
          sY: 'upperBodySY' + args.nr,
        },

      this.buttons && {
        sX: { r: 0.5, min: 1 },
        sY: 'upperBodySY' + args.nr,
        list: [this.buttons.draw(args, z)],
      },

      !args.backView &&
        this.tie && {
          sX: { r: 0.25, min: 1 },
          sY: this.fullTie && ['upperBodySY' + args.nr, -1],
          minY: 4,
          id: 'tie' + args.nr,
          color: this.tieColor.get(),
          list: [{ name: 'Dot', fY: true, fX: true, clear: true }, {}],
        },
    ],
  }
}
// END Collar Shirt draw

// CLEAVAGE --------------------------------------------------------------------------------
export const Cleavage = function (args) {
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
}
// END Cleavage

Cleavage.prototype = new Object()

Cleavage.prototype.draw = function (args, z) {
  if (args.calc) {
    this.vL['cleavageSX' + args.nr] = {
      r: this.cleavageSX,
      useSize: 'neckSX' + args.nr,
      max: ['chestSX' + args.nr, -2],
    }

    this.vL['cleavageX' + args.nr] = args.sideView
      ? [
          this.mult(0.5, 'chestSX' + args.nr),
          this.mult(-0.5, 'cleavageSX' + args.nr),
          this.sub('collarSX' + args.nr),
        ]
      : ['chestSX' + args.nr, this.mult(-1, 'cleavageSX' + args.nr)]

    if (this.sleeveless && args.sideView) {
      this.vL['cleavageRightX' + args.nr] = [
        'chestSX' + args.nr,
        this.sub('cleavageX' + args.nr),
        this.sub('cleavageSX' + args.nr),
      ]

      this.vL['strapSX' + args.nr] = {
        r: this.strapSX,
        useSize: 'cleavageX' + args.nr,
        max: -1,
      }
    }
  }

  return {
    list: [
      args.sideView &&
        this.sleeveless && {
          color: this.skinColor.get(),
          sX: ['cleavageRightX' + args.nr, 'strapSX' + args.nr],
          sY: 'sleevelessSY' + args.nr,
        },
      this.sleeveless && {
        color: this.skinColor.get(),
        sX: ['cleavageX' + args.nr, 'strapSX' + args.nr],
        sY: {
          r: this.strapSY,
          a: 'shoulderSY' + args.nr,
          save: 'sleevelessSY' + args.nr,
        },
        fX: true,
      },
      this.cleavage && {
        z,
        color: this.skinColor.get(),
        sY: { r: this.cleavageSY },
        x: args.sideView && 'cleavageX' + args.nr,
        sX: 'cleavageSX' + args.nr,
        fX: args.sideView,
      },
    ],
  }
}
// END Cleavage draw

// NIPPLES --------------------------------------------------------------------------------
export const Nipples = function (args) {
  // Form & Sizes
  this.nippleSize = this.R(0.01, 0.3)

  this.nipplePos = this.R(0.15, 0.4)

  // Colors
  this.nippleColor = args.skinShadowColor

  // Assets
}
// END Nipples

Nipples.prototype = new Object()

Nipples.prototype.draw = function (args, z) {
  if (args.calc) {
    this.vL['nippleS' + args.nr] = {
      r: this.nippleSize,
      useSize: 'chestSX' + args.nr,
    }
  }

  return {
    color: this.nippleColor.get(),
    s: 'nippleS' + args.nr,
    y: { r: this.nipplePos, min: 1 },
    x: { r: 0.2, min: 1 },
    fX: !args.sideView,
    z,
  }
}
// END Nipples draw

// CAPE --------------------------------------------------------------------------------
export const Cape = function (args) {
  // Form & Sizes
  this.capeFrontSY = this.R(0.1, 0.8)

  this.capeSY = this.R(0.3, 1)

  // Color
  this.capeColor = args.clothColor.copy({ nextColor: true, brContrast: -2 })

  // Assets
}
// END Cape

Cape.prototype = new Object()

Cape.prototype.draw = function (args) {
  if (args.calc) {
    this.vL['capeFrontSY' + args.nr] = {
      r: this.capeFrontSY,
      useSize: 'upperArmSY' + args.nr,
    }

    this.vL['capeSY' + args.nr] = {
      r: this.capeSY,
      useSize: 'fullBodySY' + args.nr,
      max: ['fullBodySY' + args.nr, -1],
      min: 'capeFrontSY' + args.nr,
    }
  }

  return {
    z: args.backView ? 500 : -500,
    color: this.capeColor.get(),
    sX: 'shoulderFullSX' + args.nr,
    sY: 'capeSY' + args.nr,
    fX: args.sideView,
    x: args.sideView && this.sub('shoulderSX' + args.nr),
  }
}
// END Cape Back draw

Cape.prototype.drawFront = function (args) {
  return {
    color: this.capeColor.get(),
    sX: 'shoulderFullSX' + args.nr,
    x: args.sideView && this.sub('shoulderSX' + args.nr),
    sY: 'capeFrontSY' + args.nr,
  }
}
// END Cape draw

// STRAP --------------------------------------------------------------------------------
export const Strap = function (args) {
  // Form & Sizes
  this.thickness = this.R(0.01, 0.05)

  // Color
  this.strapColor =
    args.beltColor ||
    (args.beltColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
      brContrast: this.IF() ? 2 : -2,
    }))

  // Assets
}
// END Strap

Strap.prototype = new Object()

Strap.prototype.draw = function (args, z) {
  if (args.calc) {
    this.vL['strapTickness' + args.nr] = {
      r: this.thickness,
      useSize: 'personSY' + args.nr,
      min: 1,
    }
  }

  return (
    (args.sideView || args.right) && {
      id: 'strap' + args.nr,
      rX: args.sideView && !args.right,
      list: [
        {
          tY: true,
          tX: true,
          clear: true,
          sY: 'strapTickness' + args.nr,
          mX: this.sub('strapTickness' + args.nr),
        },
        {
          z,
          weight: 'strapTickness' + args.nr,
          color: this.strapColor.get(),
          points: [
            {
              fX: true,
              fY: true,
              x: this.mult(0.5, 'strapTickness' + args.nr),
            },
            {
              fX: true,
              x: {
                r: args.sideView ? 1 : 2,
                useSize: 'personSX' + args.nr,
                add: [this.mult(-0.5, 'strapTickness' + args.nr), -2],
              },
            },
          ],
        },
      ],
    }
  )
}
// END Strap Back draw
