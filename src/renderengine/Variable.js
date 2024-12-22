export function Variable(args, name, pixelUnits) {
  if (args) {
    this.name = name

    this.vari = pixelUnits.createSize(args)

    this.linkedP = []

    this.l = 0
  }
}

export function DynamicVariable(name) {
  this.name = name

  this.linkedP = []

  this.l = 0
}

Variable.prototype.set = function () {
  let { l } = this

  const value = this.vari.getReal()

  while (l--) {
    this.linkedP[l].abs = value
  }
}

Variable.prototype.link = function (p) {
  this.linkedP.push(p)

  this.l += 1
}

DynamicVariable.prototype = new Variable()

DynamicVariable.prototype.set = function (value) {
  let { l } = this

  while (l--) {
    this.linkedP[l].abs = value
  }
}
