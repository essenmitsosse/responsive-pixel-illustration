import { Object } from './object.js'

/*jshint -W008 */
/* global Builder */
// COMIC --------------------------------------------------------------------------------
export const Comic = function (init) {
    var list = [],
        args = {},
        panels = this.IF(0.05) ? 1 : this.GR(3, 6),
        borderColor = (args.borderColor = new this.Color(
            this.IF() ? 1 : 0,
            this.IF(0.1) ? (this.IF(0.5) ? 2 : 3) : this.IF(0.5) ? 5 : 0,
        )),
        outerBorderColor =
            this.IF(0.9) &&
            borderColor.copy({
                brContrast: this.IF(0.8) ? 5 : 3,
                dontChange: this.IF(0.5),
            }),
        bigPanel = panels % 2 !== 0 && (this.IF(0.5) ? 0 : panels - 1),
        panelsCalc = bigPanel !== false ? panels + 1 : panels,
        i = 0,
        border = this.R(0.01, 0.04),
        gutter = this.R(0.02, 0.05),
        horRatio = this.R(1.1, 2),
        panel

    this.vL['fullSqu'] = { r: 1, max: { r: 1, height: true } }

    // BORDER
    this.vL['borderX'] = { r: border, useSize: 'fullSqu', min: 2 }
    this.vL['borderY'] = {
        r: border * horRatio,
        useSize: 'fullSqu',
        min: ['borderX', 1],
    }

    // IMAGE
    this.vL['imgSX'] = { add: [{ r: 1 }, this.mult(-2, 'borderX')] }
    this.vL['imgSY'] = [
        { r: 1, height: true },
        this.mult(this.GR(-3.5, -2), 'borderY'),
    ]

    this.vL['imgSqu'] = { a: 'imgSX', max: 'imgSY' }
    this.vL['imgSquBigger'] = { a: 'imgSX', min: 'imgSY' }

    this.vL['_panelWid'] = { r: 1 / panelsCalc, useSize: 'imgSX' }
    this.vL['_panelOvershot2'] = {
        add: ['imgSY', { r: this.R(-2.5, -1.5), useSize: '_panelWid' }],
        min: { a: 0 },
        max: 1,
    }
    this.vL['_panelOvershot2IF'] = { r: 10000000, useSize: '_panelOvershot2' }

    this.vL['_panelOvershot3'] = {
        add: ['imgSY', { r: -8, useSize: '_panelWid' }],
        min: { a: 0 },
        max: 1,
    }
    this.vL['_panelOvershot3IF'] =
        panels === 4
            ? { a: 0 }
            : { r: 10000000, useSize: '_panelOvershot3', min: { a: 0 } }

    this.vL['gutterX'] = {
        r: gutter,
        useSize: 'imgSqu',
        min: 3,
        max: ['borderX', -1],
    }
    this.vL['gutterY'] = {
        r: gutter * horRatio,
        useSize: 'imgSqu',
        min: ['gutterX', 1],
        max: ['borderY', -1],
    }
    ;(this.vL['gutterBorderS'] = {
        r: this.GR(-1, 1),
        useSize: 'gutterX',
        max: -1,
        min: { r: -0.5, useSize: 'gutterX', a: 0.5 },
    }),
        (this.vL['_effectiveImgSX'] = {
            max: { r: 3, useSize: 'imgSX' },
            add: [
                '_panelOvershot3IF',
                {
                    a: '_panelOvershot2IF',
                    min: 'imgSX',
                    max: { r: 2, useSize: 'imgSX' },
                },
            ],
        })

    this.vL['panelRestSX'] = [
        '_effectiveImgSX',
        this.mult(-1 * panelsCalc, 'gutterX'),
    ]
    this.vL['panelSX'] = this.mult(1 / panelsCalc, 'panelRestSX')

    this.vL['panelRest2SY'] = ['imgSY', this.mult(-1, 'gutterY')]
    this.vL['panelRest3SY'] = ['imgSY', this.mult(-2, 'gutterY')]
    this.vL['panelSY'] = {
        add: [
            {
                add: ['imgSY', this.mult(-1, '_panelOvershot2IF')],
                min: this.mult(0.5, 'panelRest2SY'),
            },
            this.mult(-1, '_panelOvershot3IF'),
        ],
        min: [this.mult(1 / 3, 'panelRest3SY')],
    }

    this.vL['panelSqu'] = { a: 'panelSX', max: 'panelSY' }

    this.vL['2rowX'] = {
        r: -1,
        useSize: '_panelOvershot2IF',
        add: ['_panelOvershot3IF'],
        min: [
            { r: -panelsCalc / 2, useSize: 'panelSX' },
            { r: -panelsCalc / 2, useSize: 'gutterX' },
        ],
        max: { a: 0 },
    }
    this.vL['2rowY'] = {
        a: '_panelOvershot2IF',
        add: [this.sub('_panelOvershot3IF')],
        max: ['panelSY', 'gutterY'],
        min: { a: 0 },
    }

    this.vL['3rowX'] = {
        r: -1,
        useSize: '_panelOvershot3IF',
        min: [
            { r: -panelsCalc / 3, useSize: 'panelSX' },
            { r: -panelsCalc / 3, useSize: 'gutterX' },
        ],
    }
    this.vL['3rowY'] = { a: '_panelOvershot3IF', max: ['panelSY', 'gutterY'] }

    this.vL['fullSX'] = [
        { r: panelsCalc, useSize: 'panelSX' },
        { r: panelsCalc - 1, useSize: 'gutterX' },
        {
            r: -1,
            useSize: '_panelOvershot2IF',
            add: ['_panelOvershot3IF'],
            min: [
                { r: -panelsCalc / 2, useSize: 'panelSX' },
                { r: -panelsCalc / 2, useSize: 'gutterX' },
            ],
        },
        {
            r: -1,
            useSize: '_panelOvershot3IF',
            min: [
                { r: (-2 * panelsCalc) / 3, useSize: 'panelSX' },
                { r: (-2 * panelsCalc) / 3, useSize: 'gutterX' },
            ],
        },
    ]

    if (bigPanel !== false) {
        this.vL['panelBigSX'] = [this.mult(2, 'panelSX'), 'gutterX']
    }

    args.panels = panels
    args.outerBorderColor = outerBorderColor

    panel = new this.basic.Panel(args)

    for (i = 0; i < panelsCalc; i += 1) {
        list.push(
            panel.draw({
                i: i,
                row2: panelsCalc / 2 <= i,
                row3a: panels / 3 <= i,
                row3b: (2 * panels) / 3 <= i,
                big: i === bigPanel,
            }),
        )

        if (i === bigPanel) {
            i += 1
        }

        this.basic.getNormalColor()
    }

    // // Debug Stuff
    // list.push({
    // 	sY:2,
    // 	sX:"_panelWid",
    // 	color:[255,0,0]
    // });

    // list.push({
    // 	y:2,
    // 	s:{ r:10, useSize:"_panelOvershot2" },
    // 	color:[0,255,0]
    // });

    // list.push({
    // 	y:12,
    // 	s:{ r:10, useSize:"_panelOvershot3" },
    // 	color:[0,150,0]
    // });

    return [
        {
            color: borderColor.get(),
        },
        {
            cX: true,
            sX: 'fullSX',
            mY: 'borderY',
            list: list,
        },
        init.cs === 'true' && this.basic.colorScheme(),
    ]
} // END Comic

Comic.prototype = new Object()
// Comic.prototype.draw = function () {
// }// END Comic draw

// PANEL --------------------------------------------------------------------------------
export const Panel = function (args) {
    // Forms & Sizes
    this.horizont = this.IF(0.6) ? this.R(0.1, 0.6) : this.R(0, 1)

    this.lightnessSwitched = this.IF(0.01 * args.panels)
    this.colorChangeGradual =
        !this.lightnessSwitched && this.IF(0.01 * args.panels)

    if (this.lightnessSwitched) {
        this.lightnessSwitchPanel = this.R(1, args.panels - 1)
        this.backWard = this.IF(0.5)
        this.newLightness = args.newLightness =
            args.newLightness || this.GR(1, 3) * (this.IF(0.7) ? -1 : 1)
    } else if (this.colorChangeGradual) {
        this.colorChangeStart = this.IF(0.5)
            ? 0
            : (this.IF(0.8) ? -1 : 1) * this.R(0, 4)

        this.colorChange =
            this.R(0, 0.5) *
            (this.colorChangeStart === 0
                ? this.IF(0.8)
                    ? -1
                    : 1
                : this.colorChangeStart > 0
                  ? -1
                  : 1)
    }

    this.clearSky = this.IF(0.5)

    this.sun = this.clearSky && this.IF(0.5)

    // Colors
    this.skyColor = args.skyColor = args.borderColor.copy({
        nextColor: this.IF(0.1),
        brSet: this.sun ? 4 : 5,
    })
    if (this.sun) {
        this.sunColor = this.starColor || this.skyColor.copy({ brSet: 5 })
    }

    this.outerBorderColor = args.outerBorderColor

    // Assets
    this.ground = new this.basic.Ground(args)

    this.actor1 = this.IF(0.99) && new this.basic.Actor(args)
    this.actor2 = this.IF(0.9) && new this.basic.Actor(args)
    this.actor3 = this.IF(0.1) && new this.basic.Actor(args)

    this.forrest = this.IF(0.4) && new this.basic.Forrest(args)
} // END Panel

Panel.prototype = new Object()
Panel.prototype.draw = function (args) {
    var nr = args.i,
        closeUp = this.IF(0.1),
        wideShot = !closeUp && this.IF(0.2),
        superWideShot = !closeUp && !wideShot && this.IF(0.1),
        actionBackground =
            this.IF(0.01 + (closeUp ? 0.3 : 0) + (wideShot ? 0.05 : 0)) &&
            this.skyColor.copy({ nextColor: true, brSet: this.GR(0, 5) }),
        actors,
        stars,
        darkness

    this.finalSkyColor = this.skyColor

    if (this.colorChangeGradual || this.lightnessSwitched) {
        if (this.lightnessSwitched) {
            darkness =
                this.lightnessSwitchPanel >= nr
                    ? !this.backWard
                        ? this.newLightness
                        : 0
                    : this.backWard
                      ? this.newLightness
                      : 0
        } else {
            darkness = Math.round(this.colorChangeStart + this.colorChange * nr)
            if (darkness < -3) {
                darkness = -3
            }
        }

        if (darkness === -1) {
            // Dusk
            this.finalSkyColor = this.skyColor.copy({
                brSet: 3,
                dontChange: true,
                nextColor: true,
            })
        } else if (darkness < -1) {
            // Night
            this.finalSkyColor = this.skyColor.copy({
                brSet: 1,
                dontChange: true,
            })
            stars = darkness < -2 && this.clearSky
            if (stars) {
                this.starColor = this.finalSkyColor.copy({
                    brSet: 3,
                    nextColor: true,
                    dontChange: true,
                })
            }
        }
    } else {
        darkness = 0
    }

    args.groundShadowColor = this.groundShadowColor

    this.vL['thingS' + nr] = this.mult(
        closeUp ? 2 : wideShot ? 0.5 : superWideShot ? 0.2 : 1,
        'panelSqu',
    )
    this.vL['horizont' + nr] = {
        r:
            this.horizont *
            (closeUp ? 0.6 : wideShot ? 1.25 : superWideShot ? 1.5 : 1),
        useSize: 'panelSY',
    }

    // Less Color Change on Actors
    if (darkness !== 0) {
        this.basic.getDark(darkness < -2 ? -2 : darkness > 2 ? 2 : darkness)
    }

    actors = {
        cX: true,
        fY: true,
        sY: 'thingS' + nr,
        sX: this.mult(1.5, 'thingS' + nr),
        x: { r: this.IF(0.5) ? 0.2 : -0.2, useSize: 'thingS' + nr },
        y:
            wideShot || superWideShot
                ? { r: 0.5, useSize: 'horizont' + nr }
                : { r: closeUp ? -0.5 : -0.1, useSize: 'thingS' + nr },
        list: [
            this.actor1 && {
                s: 'thingS' + nr,
                cY: true,
                color: [100, 0, 0],
                z: 10000000,
                list: this.actor1.draw(args, 100000, 'thingS' + nr),
            },
            this.actor2 && {
                s: 'thingS' + nr,
                fX: true,
                cY: true,
                color: [100, 0, 0],
                z: 20000000,
                list: this.actor2.draw(args, 200000, 'thingS' + nr),
            },
            this.actor3 && {
                s: 'thingS' + nr,
                cX: true,
                cY: true,
                color: [100, 0, 0],
                z: 30000000,
                list: this.actor3.draw(args, 300000, 'thingS' + nr),
            },
        ],
    }

    if (darkness !== 0) {
        this.basic.getDark(darkness)
    }

    args.nr = nr

    return {
        list: [
            this.outerBorderColor && {
                sX: args.big ? 'panelBigSX' : 'panelSX',
                sY: 'panelSY',
                m: 'gutterBorderS',
                x: [
                    this.mult(args.i, 'panelSX'),
                    this.mult(args.i, 'gutterX'),
                    args.row2 ? '2rowX' : { a: 0 },
                    args.row3a ? '3rowX' : { a: 0 },
                    args.row3b ? '3rowX' : { a: 0 },
                ],
                y: [
                    this.mult(args.row2 ? 1 : 0, '2rowY'),
                    this.mult(args.row3a ? 1 : 0, '3rowY'),
                    this.mult(args.row3b ? 1 : 0, '3rowY'),
                ],
                color: this.outerBorderColor.get(),
            },
            {
                sX: args.big ? 'panelBigSX' : 'panelSX',
                sY: 'panelSY',
                x: [
                    this.mult(args.i, 'panelSX'),
                    this.mult(args.i, 'gutterX'),
                    args.row2 ? '2rowX' : { a: 0 },
                    args.row3a ? '3rowX' : { a: 0 },
                    args.row3b ? '3rowX' : { a: 0 },
                ],
                y: [
                    this.mult(args.row2 ? 1 : 0, '2rowY'),
                    this.mult(args.row3a ? 1 : 0, '3rowY'),
                    this.mult(args.row3b ? 1 : 0, '3rowY'),
                ],
                mask: true,
                list: [
                    // Sky
                    stars && {
                        use: 'sky' + nr,
                        color: this.finalSkyColor.get(),
                    },

                    // Stars
                    stars && {
                        use: 'sky' + nr,
                        chance: 0.01,
                        seed: 1201,
                        color: this.starColor.get(),
                    },

                    // Actual Sky
                    {
                        color: this.finalSkyColor.get(),
                        save: stars && 'sky' + nr,
                    },

                    // Sun
                    this.sun &&
                        (wideShot || superWideShot) && {
                            s: { r: 0.1, useSize: 'panelSY' },
                            x: { r: 0.2 },
                            y: { r: 0.2 },
                            color: this.sunColor.get(),
                        },

                    // Ground
                    this.ground && this.ground.draw(args, 5000),

                    // Forrest
                    this.forrest && {
                        y: 'horizont' + nr,
                        s: 'thingS' + nr,
                        fY: true,
                        cX: true,
                        list: this.forrest.draw(args, 10000, 'thingS' + nr),
                    },

                    actionBackground && {
                        color: actionBackground.get(),
                        z: 50000,
                    },

                    actors,
                ],
            },
        ],
    }
} // END Panel draw

// ACTOR --------------------------------------------------------------------------------
export const Actor = function (args) {
    this.person = new this.basic.Person(args)
} // END Actor

Actor.prototype = new Object()
Actor.prototype.draw = function (args, z, size) {
    var eyeLookVert = ['', '', '', 'left', 'right'],
        eyeLookHor = [
            '',
            '',
            '',
            '',
            '',
            'up',
            'down',
            'up',
            'down',
            'verDown',
        ],
        eyeLids = [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            'halfClosed',
            'halfClosed',
            'halfClosed',
            'closed',
            'closed',
            'wink',
        ],
        eyeBrow = [
            '',
            '',
            '',
            'raised',
            'low',
            'sceptical',
            'superSceptical',
            'angry',
            'sad',
        ],
        mouthHeight = [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            'slight',
            'slight',
            'half',
            'full',
        ],
        mouthWid = ['', '', '', 'narrow'],
        mouthForm = ['', '', '', 'sceptical', 'grin', 'D:'],
        teethPos = ['', 'top', 'bottom', 'both', 'full'],
        legPos = ['', '', '', '', '', '', '', '', '', '', '', 'legRaise'],
        views = [
            '',
            '',
            '',
            '',
            '',
            '',
            'rightView',
            'leftView',
            'rightView',
            'leftView',
            'rightView',
            'leftView',
            'rightView',
            'leftView',
            'backView',
        ]

    args.size = size

    args.view = views[this.GR(0, views.length)]

    args.eye = {
        lookVert: eyeLookVert[this.GR(0, eyeLookVert.length)],
        lookHor: eyeLookHor[this.GR(0, eyeLookHor.length)],
        lids: eyeLids[this.GR(0, eyeLids.length)],
        brow: eyeBrow[this.GR(0, eyeBrow.length)],
    }

    args.mouth = {
        height: mouthHeight[this.GR(0, mouthHeight.length)],
        width: mouthWid[this.GR(0, mouthWid.length)],
        form: mouthForm[this.GR(0, mouthForm.length)],
        teeth: teethPos[this.GR(0, teethPos.length)],
        smirk: this.IF(0.08),
    }

    args.shoulder = {
        left: this.IF(0.7) && Math.pow(this.R(0, 1), 3),
        right: this.IF(0.7) && Math.pow(this.R(0, 1), 3),
    }

    args.arm = {
        left:
            args.shoulder.left > 0.55
                ? this.R(0.5)
                : this.IF(0.7)
                  ? this.R(-0.75, 0.75)
                  : this.R(-0.25, 0.25),
        right:
            args.shoulder.right > 0.55
                ? this.R(0.5)
                : this.IF(0.7)
                  ? this.R(-0.75, 0.75)
                  : this.R(-0.25, 0.25),
    }

    args.finger = {
        left: this.IF(0.1),
        right: this.IF(0.1),
    }

    args.leg = {}
    args.leg[this.IF(0.5) ? 'right' : 'left'] =
        legPos[this.GR(0, legPos.length)]

    args.hatDown = this.IF(0.02)

    return this.person.draw(args, z)
} // END Actor draw

// GROUND --------------------------------------------------------------------------------
export const Ground = function (args) {
    // Form & Sizes

    // Colors
    this.groundColor = args.groundColor = args.skyColor.copy({
        nextColor: this.IF(),
        brContrast: this.GR(1, 4),
    })
    this.groundShadowColor = args.groundShadowColor = this.groundColor.copy({
        brAdd: -1,
    })

    // Assets
} // END Ground
Ground.prototype = new Object()
Ground.prototype.draw = function (args, z) {
    var nr = args.nr

    return {
        color: this.groundColor.get(),
        fY: true,
        z: z,
        sY: 'horizont' + nr,
    }
} // END Ground draw
