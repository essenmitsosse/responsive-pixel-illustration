class BaseVariable {
  linkedP = []
  l = 0
  constructor(name) {
    this.name = name
  }

  link(p) {
    this.linkedP.push(p)

    this.l += 1
  }
}

export class Variable extends BaseVariable {
  constructor(args, name, pixelUnits) {
    super(name)

    if (args) {
      this.vari = pixelUnits.createSize(args)
    }
  }

  set() {
    let { l } = this

    if (this.vari === undefined) {
      throw new Error('Unexpected Error: Variable is not defined')
    }

    const value = this.vari.getReal()

    while (l--) {
      this.linkedP[l].abs = value
    }
  }

  link(p) {
    this.linkedP.push(p)

    this.l += 1
  }
}

export class DynamicVariable extends BaseVariable {
  set(value) {
    let { l } = this

    while (l--) {
      this.linkedP[l].abs = value
    }
  }
}
