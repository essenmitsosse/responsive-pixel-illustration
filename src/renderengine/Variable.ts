import type getPixelUnits from './getPixelUnits'
import type { Height, Width } from './getPixelUnits/Size'
import type { InputDynamicVariable } from '@/helper/typeSize'

class BaseVariable {
  linkedP: Array<{ abs?: unknown }> = []
  l = 0
  name: string
  constructor(name: string) {
    this.name = name
  }

  link(p: { abs?: number | string }): void {
    this.linkedP.push(p)

    this.l += 1
  }
}

export class Variable extends BaseVariable {
  vari?: Height | Width
  linkedP: Array<InputDynamicVariable & { abs?: number | string }> = []

  constructor(
    args: InputDynamicVariable,
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

  link(p: { abs?: number | string }): void {
    this.linkedP.push(p)

    this.l += 1
  }
}

export class DynamicVariable extends BaseVariable {
  linkedP: Array<{ abs?: unknown }> = []

  set(value?: unknown): void {
    let { l } = this

    while (l--) {
      this.linkedP[l].abs = value
    }
  }
}
