import { mult } from '@/helper/helperDim'

import Object from './Object'

const Mouth = function (args) {
  // Form & Sizes
  this.mouthSX = this.R(0.4, 0.6)

  this.mouthSY = this.R(0.2, 0.4)

  this.mouthY = this.R(0.1, 0.6)

  // Colors
  this.skinColor = args.skinColor

  this.skinDetailColor = args.skinDetailColor

  this.teethColor = this.skinColor.copy({ brAdd: 2 })

  this.teethShadowColor = this.teethColor.copy({ brAdd: -1 })

  // Assets
}
// END Mouth

Mouth.prototype = new Object()

Mouth.prototype.draw = function (args) {
  const thisMouth = args.mouth || {}
  const mouthWidth = thisMouth.width
  const mouthHeight = thisMouth.height
  const mouthForm = thisMouth.form
  const mouthD = mouthForm === 'D: '
  const mouthGrin = mouthD || mouthForm === 'grin'
  const mouthNarrow = mouthWidth === 'narrow'
  const mouthSlight = mouthHeight === 'slight'
  const mouthHalfOpen = mouthHeight === 'half'
  const mouthOpen = mouthSlight || mouthHalfOpen || mouthHeight === 'full'
  const mouthSmile = mouthGrin && !mouthOpen

  const teethFull =
    !mouthSlight && mouthOpen && !mouthNarrow && thisMouth.teeth === 'full'

  const teethTop =
    !mouthSlight &&
    ((mouthOpen && thisMouth.teeth === 'top') || thisMouth.teeth === 'both')

  const teethBottom =
    !mouthSlight &&
    ((mouthOpen && thisMouth.teeth === 'bottom') || thisMouth.teeth === 'both')

  if (args.calc) {
    args.mouthSX = this.pushLinkList({
      r: this.mouthSX * (args.sideView ? 0.7 : 1),
      a: 0.5,
      useSize: args.headMinSX,
      max: args.headMinSX,
    })

    args.mouthMaxSY = this.pushLinkList({
      r: this.mouthSY,
      useSize: args.headMinSY,
    })

    args.mouthSY = this.pushLinkList(
      mouthSlight || mouthSmile
        ? { a: 2, max: args.mouthMaxSY }
        : mouthOpen
          ? mouthHalfOpen
            ? mult(0.5, args.mouthMaxSY)
            : args.mouthMaxSY
          : { a: 1, max: args.mouthMaxSY },
    )

    args.mouthY = this.pushLinkList({
      r: this.mouthY,
      useSize: args.headMinSY,
    })

    args.mouthTopMaxY = this.pushLinkList({
      add: [args.mouthMaxSY, args.mouthY],
    })

    args.mouthTopY = this.pushLinkList({
      add: [args.mouthSY, args.mouthY],
    })
  }

  return (
    !args.backView && {
      sX: {
        r: (mouthNarrow ? 0.4 : 1) * (thisMouth.smirk && args.right ? 0.4 : 1),
        useSize: args.mouthSX,
      },
      minX: 2,
      sY: args.mouthSY,
      y: args.mouthY,
      fY: true,
      id: 'mouth' + args.nr,
      z: 0,
      color: this.skinDetailColor.get(),
      list: mouthSmile
        ? [
            { sX: 1, sY: 1, fX: true, fY: mouthD },
            { sX: { r: 1, a: -1 }, sY: 1, fY: !mouthD },
          ]
        : mouthOpen && [
            (mouthD || mouthGrin) && {
              name: 'Dot',
              clear: true,
              fX: true,
              fY: mouthD,
            },

            {},

            teethFull && {
              sX: { r: 0.75, min: { r: 1, a: -2, min: 2 } },
              color: this.teethColor.get(),
              list: [
                {},
                {
                  sY: { r: 0.2, max: 1 },
                  cY: true,
                  color: this.teethShadowColor.get(),
                },
              ],
            },

            teethTop && { sY: 1, color: this.teethColor.get() },

            teethBottom && {
              sY: 1,
              fY: true,
              color: this.teethColor.get(),
            },
          ],
    }
  )
}

export default Mouth
