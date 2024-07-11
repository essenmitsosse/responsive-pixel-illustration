import type { ColorRgb } from './types'

export class Color {
  public s: Array<{
    c: ColorRgb
    zInd: number
    id: string
  }>

  constructor() {
    this.s = []
  }

  draw(c: ColorRgb, zInd: number, id: string) {
    let i = this.s.length - 1

    if (this.s.length === 0 || this.s[i].zInd < zInd) {
      this.s.push({ id, c, zInd })
    } else if (this.s[i].zInd !== zInd) {
      do {
        if (this.s[i].zInd < zInd) {
          break
        }
        i -= 1
      } while (i > 0)
      this.s.splice(i + 1, 0, { id, c, zInd })
    }
  }

  clear(id: string) {
    const { s } = this
    while (s.length > 0 && s[s.length - 1].id === id) {
      this.s.pop()
    }
  }
}
