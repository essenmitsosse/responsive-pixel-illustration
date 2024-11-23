import { BBObj, BBProto } from './bb'

// LOWER BODY  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
BBProto.LowerBody = function (args) {
  this.color = args.color
  this.colorDark = args.colorDark
} // End LowerBody

BBProto.LowerBody.prototype = new BBObj()
BBProto.LowerBody.prototype.draw = function (args, front, right) {
  return [
    {
      color: [front ? 150 : 100, right ? 150 : 100, front || right ? 0 : 0],
    },
  ]
} // End LowerBody Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
