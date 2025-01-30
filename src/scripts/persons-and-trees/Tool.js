import Object from './Object'

const Tool = function () {
  // Form & Sizes
  // Assets
}
// END Tool

Tool.prototype = new Object()

Tool.prototype.draw = function (args) {
  return {
    s: args.armSX,
    fY: true,
    // rX: sideView && args.right,
    list: [
      // { cX: true, sX: { r:1.5, useSize: args.personHalfSX }, color: [0,0,255], list: [
      // 	{},
      // 	{ color: [50,100,200], s:3, cY: true, fX: true }
      // ]}
    ],
  }
}

export default Tool
