import BBObj from './BBObj'

const Nose = function (args) {
  this.color = args.color

  this.colorDark = args.colorDark
}
// End Nose

Nose.prototype = new BBObj()

Nose.prototype.draw = function (args, front) {
  return [
    {
      color: this.colorDark,
      sY: !front && { r: 1, a: 1 },
      fY: true,
    },
  ]
}

export default Nose
