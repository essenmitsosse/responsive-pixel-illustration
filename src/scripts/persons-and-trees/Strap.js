import { mult, sub } from '@/helper/helperDim'

import Object from './Object'

const Strap = function (args) {
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

Strap.prototype = new Object()

Strap.prototype.draw = function (args, z) {
  if (args.calc) {
    args.strapTickness = this.pushLinkList({
      r: this.thickness,
      useSize: args.personSY,
      min: 1,
    })
  }

  return (
    (args.sideView || args.right) && {
      rX: args.sideView && !args.right,
      id: 'strap' + args.nr,
      list: [
        {
          tY: true,
          tX: true,
          clear: true,
          sY: args.strapTickness,
          mX: sub(args.strapTickness),
        },
        {
          z,
          weight: args.strapTickness,
          color: this.strapColor.get(),
          points: [
            {
              fX: true,
              fY: true,
              x: mult(0.5, args.strapTickness),
            },
            {
              fX: true,
              x: {
                r: args.sideView ? 1 : 2,
                useSize: args.personSX,
                add: [mult(-0.5, args.strapTickness), -2],
              },
            },
          ],
        },
      ],
    }
  )
}

export default Strap
