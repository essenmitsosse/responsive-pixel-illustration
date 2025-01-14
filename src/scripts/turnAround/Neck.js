import BBObj from './BBObj'

const Neck = function (args) {
  this.color = args.color

  this.colorDark = args.colorDark
}
// End Neck

Neck.prototype = new BBObj()

Neck.prototype.draw = function () {
  return [
    {
      color: this.colorDark,
    },
  ]
}

export default Neck
