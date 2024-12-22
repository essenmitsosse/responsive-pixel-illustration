import type { getPixelUnits } from './pixel'

class BaseVariable {
  linkedP: Array<unknown | { abs?: unknown }> = []
  l = 0
  name: string
  constructor(name: string) {
    this.name = name
  }

  link(p: unknown): void {
    this.linkedP.push(p)

    this.l += 1
  }
}

export class Variable extends BaseVariable {
  vari?: { getReal: () => unknown }
  linkedP: Array<{ abs?: unknown }> = []

  constructor(
    args: unknown,
    name: string,
    pixelUnits: ReturnType<typeof getPixelUnits>,
  ) {
    super(name)

    if (args) {
      this.vari = pixelUnits.createSize(args)
    }
  }

  set(): void {
    let { l } = this

    if (this.vari === undefined) {
      throw new Error('Unexpected Error: Variable is not defined')
    }

    const value = this.vari.getReal()

    while (l--) {
      this.linkedP[l].abs = value
    }
  }

  link(p: { abs?: unknown }): void {
    this.linkedP.push(p)

    this.l += 1
  }
}

export class DynamicVariable extends BaseVariable {
  linkedP: Array<{ abs?: unknown }> = []

  set(value: unknown): void {
    let { l } = this

    while (l--) {
      this.linkedP[l].abs = value
    }
  }
}
