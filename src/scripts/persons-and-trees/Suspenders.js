import { sub } from '@/helper/helperDim'

const Suspenders = function (args, state) {
  this.state = state

  // Form & Sizes
  this.strapSX = state.R(-0.8, 0.5)

  this.strapX = state.R(0.5, 1)

  this.detail = state.IF(0.5)

  // Colors
  this.strapColor = (state.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: -1,
  })

  if (this.detail) {
    this.detailColor = args.clothColor.copy({
      brContrast: state.IF(0.5) ? 1 : -1,
    })
  }

  // Assets
}
// END Suspenders

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
    args.trapSX = this.state.pushLinkList({
      add: [args.upperBodySX, sub(args.neckSX)],
    })
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
          useSize: args.trapSX,
          min: 1,
          save: args.strapSX,
        },
        x: {
          r: this.strapX * (args.sideView ? 0.5 : 1),
          useSize: args.trapSX,
          max: [args.trapSX, sub(args.strapSX)],
          min: { a: 0 },
        },
        fX: true,
        list: detail,
      },
      args.sideView && {
        sX: {
          r: this.strapSX * (args.sideView ? 0.5 : 1),
          useSize: args.trapSX,
          min: 1,
          save: args.strapSX,
        },
        x: {
          r: this.strapX * (args.sideView ? 0.5 : 1),
          useSize: args.trapSX,
          max: [args.trapSX, sub(args.strapSX)],
        },
        list: detail,
      },
    ],
  }
}

export default Suspenders
