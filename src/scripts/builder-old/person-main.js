import { Object } from "./object.js"
// PERSON --------------------------------------------------------------------------------
export const Person = function (args) {
    if (!args) {
        args = args || {}
    }
    // Assests
    this.basicBody = new this.basic.BasicBody(args)
    this.id = this.basic.objectCount += 1
} // END Person

Person.prototype = new Object()
Person.prototype.draw = function (args, z) {
    var nr = (args.nr = this.basic.objectCount += 1),
        backView = (args.backView = args.view === "backView"),
        sideView = (args.sideView = !backView && args.view ? true : false)

    args.id = this.id

    z || (z = this.basic.objectCount * 10000)

    this.vL["personHalfSX" + nr] = { r: 0.5, min: 5, useSize: args.size }

    return sideView
        ? [{ list: this.basicBody.draw(args, args.view === "rightView") }]
        : [
              {
                  sX: "personHalfSX" + nr,
                  rX: true,
                  list: this.basicBody.draw(args, !backView),
              },
              {
                  sX: "personHalfSX" + nr,
                  x: ["personHalfSX" + nr, -1],
                  list: this.basicBody.draw(args, backView),
              },
          ]
} // END Person draw

// BASICBODY --------------------------------------------------------------------------------
export const BasicBody = function (args) {
    var nextFirstColor = this.IF(0.5),
        nextSecondColor = this.IF(0.2),
        hues = [
            [0, 1, 2],
            [0, 2, 2],
            [0, 1, 1],
            [1, 0, 0],
            [2, 0, 1],
        ][this.GR(0, 4)]

    // Form & Sizes

    this.sY = this.IF() ? this.R(0.4, 1) : 1
    this.sX =
        (this.IF(0.1)
            ? this.R(0.3, 0.8)
            : this.IF(0.1)
              ? this.R(0.05, 0.15)
              : this.R(0.15, 0.3)) * this.sY

    this.lowerBodySY = this.IF(0.1) ? this.R(0.5, 0.9) : 0.7
    if (args.demo && args.hip) {
        this.lowerBodySY = args.hip
    }

    this.animal = args.animal = this.IF(0.02)

    // Color
    this.skinColor = args.skinColor = new this.Color(hues[0], this.GR(1, 4))

    this.firstColor = args.firstColor = args.skinColor.copy({
        nr: hues[1],
        brContrast: (this.IF(0.5) ? -1 : 1) * (this.IF(0.8) ? 1 : 2),
        min: this.IF() ? 0 : 1,
        max: 4,
    })

    this.secondColor = args.secondColor = args.skinColor.copy({
        nr: hues[2],
        brContrast: (this.IF(0.8) ? -1 : 1) * (hues[1] === hues[2] ? 1 : 2),
        max: 4,
    })

    this.skinShadowColor = args.skinShadowColor = args.skinColor.copy({
        brAdd: -1,
    })
    this.skinDetailColor = args.skinDetailColor = args.skinColor.copy({
        brAdd: -2,
    })

    this.groundShadowColor = args.groundShadowColor

    // console.log( args, this.skinColor, this.firstColor, this.secondColor );

    // Assets
    this.head = new this.basic.Head(args)
    this.upperBody = new this.basic.UpperBody(args)
    this.lowerBody = new this.basic.LowerBody(args)
} // END BasicBody
BasicBody.prototype = new Object()
BasicBody.prototype.draw = function (args, right) {
    var nr = args.nr,
        sideView = args.sideView,
        list,
        head

    args.right = right
    args.calc = args.backView !== right || sideView

    if (args.calc) {
        this.vL["personSX" + nr] = {
            r: this.sX,
            useSize: "personHalfSX" + nr,
            a: 2,
        }
        this.vL["personSY" + nr] = { r: this.sY, min: 5, useSize: args.size }
    }

    head = this.head.draw(args)

    if (args.calc) {
        this.vL["bodyRestSY" + nr] = {
            a: "personSY" + nr,
            max: [
                args.size,
                this.sub("headMaxSY" + nr),
                this.sub("neckSY" + nr),
            ],
        }

        this.vL["lowerBodySY" + nr] = {
            r: this.lowerBodySY,
            useSize: "bodyRestSY" + nr,
            min: 1,
        }
        this.vL["upperBodySY" + nr] = {
            add: ["bodyRestSY" + nr, this.sub("lowerBodySY" + nr)],
            min: 1,
        }

        this.vL["fullBodySY" + nr] = ["lowerBodySY" + nr, "upperBodySY" + nr]

        this.vL["personRealSX" + nr] = { a: "personSX" + nr }
        this.vL["personRealMaxSY" + nr] = [
            "fullBodySY" + nr,
            "headMaxSY" + nr,
            "neckSY" + nr,
        ]
        this.vL["personRealMinSY" + nr] = [
            "fullBodySY" + nr,
            "headMinSY" + nr,
            "neckSY" + nr,
        ]
    }

    return [
        {
            sY: "personSY" + nr,
            cX: sideView,
            fY: true,
            rX: sideView && args.right,
            list: [
                // Shadow
                {
                    color: this.groundShadowColor.get(),
                    fY: true,
                    tY: true,
                    cX: sideView,
                    y: 1,
                    sY: 2,
                    sX: "shoulderFullSX" + nr,
                    z: -1000,
                },

                // Upper Body
                this.upperBody.draw(args),

                // LowerBody
                this.lowerBody.draw(args),

                // Head & Neck
                head,
            ],
        },
    ]
} // END BasicBody draw

// LOGO --------------------------------------------------------------------------------
export const Logo = function (args, right, symetrical, logoColor) {
    var color = !logoColor && this.IF(0.5)

    this.name = symetrical ? (right ? "right" : "left") : "chest"

    // Form & Sizes
    this.sX = this.R(0, 1)
    this.sY = this.R(0, 1)
    this.Y = this.R(0, 0.5)

    this.oneSide = !symetrical && this.IF(0.1)
    this.oneSide && (this.side = this.IF(0.5))

    this.roundUp = this.IF(0.3)
    this.roundDown = this.IF(0.3)
    this.dentUp = this.IF(0.3)
    this.dentDown = this.IF(0.3)
    this.stripUp = this.IF(0.1)
    this.stripDown = this.IF(0.1)
    this.stripSide = this.IF(0.1)
    this.edgeUp = this.IF(0.2)
    this.edgeDown = this.IF(0.2)

    // Color
    this.logoColor =
        logoColor ||
        args.clothColor.copy({
            nextColor: color,
            brSet:
                args.clothColor.getBr() +
                (this.IF(0.5) ? -1 : 1) * (!color || this.IF(0.2) ? 2 : 1),
        })
    // Assets
} // END Logo
Logo.prototype = new Object()

Logo.prototype.draw = function (args) {
    var nr = args.nr,
        nrName = nr + this.name,
        sideView = args.sideView

    return (
        (!this.oneSide || args.right === this.side) && {
            sX: { r: this.sX },
            sY: {
                r: this.sY,
                save: "logoSY" + nrName,
                max: { r: 1, save: "logoMaxSY" + nrName },
            },
            y: {
                r: this.Y,
                max: ["logoSY" + nrName, this.sub("logoSY" + nrName)],
            },
            cX: args.oneSide || sideView,
            color: this.logoColor.get(),
            id: "logo" + nrName,
            z: 50,
            list: [
                this.roundUp && { fX: true, name: "Dot", clear: true },
                this.roundDown && {
                    fX: true,
                    name: "Dot",
                    fY: true,
                    clear: true,
                },
                this.dentUp && { name: "Dot", clear: true },
                this.dentDown && { name: "Dot", fY: true, clear: true },
                this.stripUp && { sY: 1, y: 1, clear: true },
                this.stripDown && { sY: 1, y: 1, fY: true, clear: true },
                this.stripSide && { sX: 1, x: 1, fX: true, clear: true },
                this.edgeUp && { sX: { r: 0.4 }, sY: { r: 0.4 }, clear: true },
                this.edgeDown && {
                    sX: { r: 0.4 },
                    sY: { r: 0.4 },
                    fY: true,
                    fX: true,
                    clear: true,
                },
                {},
            ],
        }
    )
} // END Logo Back draw
