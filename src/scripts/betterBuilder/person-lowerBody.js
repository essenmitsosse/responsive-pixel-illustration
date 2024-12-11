import { BBObj } from './object.js'

// LOWER BODY  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const LowerBody = function (args) {
  this.color = args.color

  this.colorDark = args.colorDark
}
// End LowerBody

LowerBody.prototype = new BBObj()

LowerBody.prototype.draw = function (args, front, right) {
  return [
    {
      color: [front ? 150 : 100, right ? 150 : 100, front || right ? 0 : 0],
    },
  ]
}
// End LowerBody Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
