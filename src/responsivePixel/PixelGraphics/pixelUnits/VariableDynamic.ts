import { Variable } from './Variable'

export class VariableDynamic extends Variable {
  constructor(name) {
    super()
    this.name = name
    this.linkedP = []
    this.l = 0
  }

  set(value?: number) {
    this.linkedP.forEach((_, key) => {
      this.linkedP[key].abs = value
    })
  }
}
