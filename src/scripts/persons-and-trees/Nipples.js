import Object from './Object'

const Nipples = function (args) {
  // Form & Sizes
  this.nippleSize = this.R(0.01, 0.3)

  this.nipplePos = this.R(0.15, 0.4)

  // Colors
  this.nippleColor = args.skinShadowColor

  // Assets
}
// END Nipples

Nipples.prototype = new Object()

Nipples.prototype.draw = function (args, z) {
  if (args.calc) {
    args.nippleS = this.pushLinkList({
      r: this.nippleSize,
      useSize: args.chestSX,
    })
  }

  return {
    color: this.nippleColor.get(),
    s: args.nippleS,
    y: { r: this.nipplePos, min: 1 },
    x: { r: 0.2, min: 1 },
    fX: !args.sideView,
    z,
  }
}

export default Nipples
