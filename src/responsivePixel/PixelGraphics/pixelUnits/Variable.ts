import { OneD } from './get1D'
export class Variable {
  constructor(args, name, oneD: OneD) {
    if (args) {
      this.name = name
      this.vari = oneD.createSize(args)
      this.linkedP = []
    }
  }

  set() {
    const value = this.vari.getReal()
    this.linkedP.forEach((_, key) => {
      this.linkedP[key].abs = value
    })
  }

  link(p) {
    this.linkedP.push(p)
  }
}
