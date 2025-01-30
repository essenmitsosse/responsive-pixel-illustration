import { mult, sub } from '@/helper/helperDim'

const Strap = function (args, state) {
  this.state = state

  // Form & Sizes
  this.thickness = state.R(0.01, 0.05)

  // Color
  this.strapColor =
    args.beltColor ||
    (args.beltColor = (state.IF(0.5) ? args.firstColor : args.secondColor).copy(
      {
        brContrast: state.IF() ? 2 : -2,
      },
    ))

  // Assets
}

Strap.prototype.draw = function (args, z) {
  if (args.calc) {
    args.strapTickness = this.state.pushLinkList({
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
