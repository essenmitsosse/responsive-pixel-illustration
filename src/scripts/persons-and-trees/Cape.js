import { sub } from '@/helper/helperDim'

import Object from './Object'

const Cape = function (args) {
  // Form & Sizes
  this.capeFrontSY = this.R(0.1, 0.8)

  this.capeSY = this.R(0.3, 1)

  // Color
  this.capeColor = args.clothColor.copy({ nextColor: true, brContrast: -2 })

  // Assets
}
// END Cape

Cape.prototype = new Object()

Cape.prototype.draw = function (args) {
  if (args.calc) {
    args.capeFrontSY = this.pushLinkList({
      r: this.capeFrontSY,
      useSize: args.upperArmSY,
    })

    args.capeSY = this.pushLinkList({
      r: this.capeSY,
      useSize: args.fullBodySY,
      max: [args.fullBodySY, -1],
      min: args.capeFrontSY,
    })
  }

  return {
    z: args.backView ? 500 : -500,
    color: this.capeColor.get(),
    sX: args.shoulderFullSX,
    sY: args.capeSY,
    fX: args.sideView,
    x: args.sideView && sub(args.shoulderSX),
  }
}
// END Cape Back draw

Cape.prototype.drawFront = function (args) {
  return {
    color: this.capeColor.get(),
    sX: args.shoulderFullSX,
    x: args.sideView && sub(args.shoulderSX),
    sY: args.capeFrontSY,
  }
}

export default Cape
