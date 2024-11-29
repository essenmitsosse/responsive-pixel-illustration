/* global TableComic */

// BEGINN Legs /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Legs = function Legs(args) {
    this.actor = args.actor

    // Forms & Sizes
    this.legSX_ = args.legSX || 0.2
    this.hipSY_ = args.hipSY || 0.2

    // Colors
    this.color = this.actor.colors.color2

    // Assets
    this.belt = this.rIf(0.5)
    this.beltSY_ = this.belt && 0.2

    this.skirt = this.rIf(0.6)
    this.skirtSY_ = this.skirt && this.rFl(0.4, 0.9)

    this.shoeSY_ = this.rFl(-0.5, 1)
}

Legs.prototype.getSize = function LegsGetSize(args) {
    this.legSX = this.pushLinkList({ r: this.legSX_, useSize: args.sX })
    this.hipSY = this.pushLinkList({
        r: this.hipSY_,
        useSize: args.sY,
        min: this.legSY,
    })
    this.legY = this.pushLinkList([this.hipSY, { r: -1, useSize: this.legSX }])
}

Legs.prototype.getBetterPosX = function (rel) {
    return this.pushLinkList({
        add: [this.actor.x, { r: rel, useSize: this.sX }],
    })
}

Legs.prototype.getBetterPosY = function (rel) {
    return this.pushLinkList({
        add: [
            { r: -1, useSize: this.actor.y },

            // hove to bottom of ass when sitting
            this.sitting ? { r: -1, useSize: this.sY } : 0,
            this.sitting ? this.hipSY : 0,

            { r: -1 * rel, useSize: this.sitting ? this.legSX : this.sY },
        ],
    })
}

Legs.prototype.draw = function LegsDraw(args) {
    var sitting = (this.sitting = args.info.sitting),
        bendLeg = sitting || args.info.bendLeg,
        leg

    this.sX = args.sX
    this.sY = args.sY

    this.legY = this.pushLinkList({
        add: [this.hipSY, { r: -1, useSize: this.legSX }],
    })

    this.fullLegSY = this.pushLinkList({
        add: [args.sY, { r: -1, useSize: this.hipSY }],
    })
    this.lowerLegSY = this.pushLinkList({ r: 1, useSize: this.fullLegSY })
    this.topLegSY = this.pushLinkList({
        add: [this.fullLegSY, { r: -1, useSize: this.lowerLegSY }],
    })

    this.side = this.pushLinkList({ r: 0, useSize: this.topLegSY })
    this.sideOther = this.pushLinkList({ r: -1, useSize: this.side })

    this.beltSY = this.pushLinkList({ r: 0, useSize: this.hipSY })
    this.skirtSY = this.pushLinkList({ r: 0, useSize: this.lowerLegSY })
    this.shoeSY = this.pushLinkList({ r: 1, useSize: this.lowerLegSY, min: 1 })

    this.pushRelativeStandardAutomatic({
        side: args.info.body && args.info.body.side,
        lowerLegSY: bendLeg && { map: "props", min: 1, max: 0.5 },
        beltSY: this.belt && {
            map: "actor-accessoirs",
            min: 0,
            max: this.beltSY_,
        },
        skirtSY: this.skirt && {
            map: "actor-accessoirs",
            min: 0,
            max: this.skirtSY_,
        },
        shoeSY: { map: "actor-accessoirs", min: 0, max: this.shoeSY_ },
    })

    leg = [
        {
            sX: this.legSX,
            // sY: this.fullLegSY,
            list: [
                {
                    // leg to left
                    sX: { add: [this.side, this.legSX], min: this.legSX },
                    list: [
                        {},
                        {
                            // leg to right
                            sX: {
                                add: [this.sideOther, this.legSX],
                                min: this.legSX,
                            },
                            fX: true,
                            list: [
                                // lowerLeg
                                {},
                                {
                                    sX: this.legSX,
                                    sY: [this.lowerLegSY, this.legSX],
                                    list: [
                                        {},
                                        {
                                            sY: this.shoeSY,
                                            color: this.color[3],
                                            fY: true,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ]

    return {
        sX: args.sX,
        sY: args.sY,
        fY: true,
        color: this.color[0],
        list: [
            {
                sY: this.hipSY,
                list: [
                    {},
                    { sX: 1 },
                    { sX: 1, fX: true },
                    { sY: 1, fY: true, mX: !bendLeg && this.legSX },
                    this.belt && {
                        color: this.color[3],
                        z: 1,
                        sY: this.beltSY,
                    },
                ],
            },
            {
                sY: this.hipSY,
                list: [
                    {
                        s: this.legSX,
                        z: this.actor.isRotated && -300,
                        fY: true,
                        list: leg,
                    },
                    {
                        s: this.legSX,
                        fX: true,
                        fY: true,
                        list: leg,
                    },
                ],
            },

            this.skirt && {
                color: this.color[2],
                list: [
                    { sY: { add: [this.hipSY], max: this.skirtSY } },
                    {
                        y: this.legY,
                        sY: [this.skirtSY, { r: -1, useSize: this.legY }],
                        x: this.side,
                    },
                ],
            },
        ],
    }
}
// END Legs \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
