import { sub } from '@/helper/helperDim'

import Object from './Object'

const HeadBand = function (args) {
  // Form & Sizes

  // Colors
  this.headBandColor = args.hatColor

  // Assets
}
// END HeadBand

HeadBand.prototype = new Object()

HeadBand.prototype.draw = function (args, z) {
  return {
    z,
    sY: {
      r: 0.3,
      useSize: args.foreheadSY,
      min: 1,
      save: 'headBandSX' + args.nr,
    },
    sX: args.hairSX,
    cX: args.sideView,
    color: this.headBandColor.get(),
    y: {
      r: 0.5,
      useSize: args.foreheadSY,
      max: [args.foreheadSY, sub(args.headBandSX)],
    },
  }
}

export default HeadBand
