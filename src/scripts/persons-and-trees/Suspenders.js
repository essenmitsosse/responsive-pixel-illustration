import { sub } from '@/helper/helperDim'

import Object from './Object'

const Suspenders = function (args) {
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
    args.trapSX = this.pushLinkList({
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
