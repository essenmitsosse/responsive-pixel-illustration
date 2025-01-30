import Object from './Object'

const Sword = function (args, right) {
  // Form & Sizes
  this.rightSide = right

  this.bladeSY = this.R(0, 1.5)

  this.bladeSX = this.IF(0.1) ? this.R(0, 0.4) : this.R(0, 0.2)

  this.handleSX = this.R(0, 0.5)

  this.handleOtherSX = this.handleSX / 2 + this.R(-0.25, 0.25)

  this.noKnife = this.IF(0.5)

  this.crossGuard = this.IF(1.5)

  this.notRound = this.IF()

  this.bend = !this.notRound && this.IF()

  this.middleStrip = this.IF(0.5)

  // Color
  this.hiltColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: -1,
  })

  this.bladeColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: 1,
    max: 4,
  })

  this.bladeLightColor = this.bladeColor.copy({ brContrast: 1 })

  this.bladeShadowColor = this.bladeColor.copy({ brContrast: -1 })

  // Assets
}
// END Sword

Sword.prototype = new Object()

Sword.prototype.draw = function (args, z) {
  const name = this.rightSide ? 'right' : 'left'
  const nrName = name + args.nr

  args['handleSY' + nrName] = this.pushLinkList({
    add: [args.handSX, -2],
    min: 1,
  })

  args['bladeSX' + nrName] = this.pushLinkList({
    r: this.bladeSY,
    useSize: args.personHalfSX,
    min: { r: 3, useSize: args.armSX },
  })

  args['bladeSY' + nrName] = this.pushLinkList({
    r: this.bladeSX,
    useSize: args.personHalfSX,
    min: args['handleSY' + nrName],
  })

  args['handleSX' + nrName] = this.pushLinkList({
    r: this.handleSX,
    useSize: args.personHalfSX,
  })

  args['handleOtherSX' + nrName] = this.pushLinkList({
    r: this.handleOtherSX,
    useSize: args.personHalfSX,
    min: [args.handSX, 1],
  })

  return {
    sY: args['handleSY' + nrName],
    z,
    cY: true,
    color: this.hiltColor.get(),
    id: args['tool' + nrName],
    list: [
      {
        sX: args['bladeSX' + nrName],
        sY: args['bladeSY' + nrName],
        cY: this.noKnife,
        x: args['handleSX' + nrName],
        color: this.bladeColor.get(),
        list: [
          !this.notRound && {
            sX: 3,
            minX: 3,
            fX: true,
            list: [
              !this.bend && { sY: 1, clear: true },
              { sY: 1, clear: true, fY: true },
            ],
          },
          !this.notRound && {
            minX: 3,
            mY: 1,
            sX: 1,
            fX: true,
            list: [
              !this.bend && { sY: 1, clear: true },
              { sY: 1, clear: true, fY: true },
            ],
          },

          {},
          this.middleStrip && {
            sY: { r: 0.25, max: 2 },
            mX: 1,
            cY: this.noKnife,
            color: this.bladeLightColor.get(),
            list: [
              { sY: { r: 1, max: 1 }, fY: true },
              {
                sY: { r: 1, max: 1 },
                color: this.bladeShadowColor.get(),
              },
            ],
          },
        ],
      },

      {
        sX: args['handleSX' + nrName],
      },
      {
        sX: args['handleOtherSX' + nrName],
        fX: true,
      },

      // Cross Guard
      this.crossGuard && {
        x: args['handleSX' + nrName],
        sX: 1,
        sY: {
          r: this.noKnife ? 1.2 : 1,
          useSize: args['bladeSY' + nrName],
        },
        cY: this.noKnife,
      },
    ],
  }
}

export default Sword
