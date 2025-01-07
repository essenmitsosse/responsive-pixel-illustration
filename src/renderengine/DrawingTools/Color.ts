import type { ColorRgb } from '@/helper/typeColor'

type LayerColor = { c: ColorRgb; id: string | undefined; zInd: number }

class Color {
  s: Array<LayerColor> = []
  constructor() {}

  draw(c: ColorRgb, zInd: number, id?: string): void {
    let i = this.s.length - 1

    const { s } = this

    let oldZInd

    if (i === -1 || (oldZInd = s[i].zInd) < zInd) {
      s.push({ id, c, zInd })

      return
    }

    if (oldZInd !== zInd) {
      do {
        if (s[i].zInd < zInd) {
          break
        }
      } while (i--)

      s.splice(i + 1, 0, { id, c, zInd })
    }
  }

  clear(id?: string): void {
    while (this.s.length > 0 && this.s[this.s.length - 1].id === id) {
      this.s.pop()
    }
  }
}

export default Color
