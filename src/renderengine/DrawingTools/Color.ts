import type { ColorRgb } from '@/helper/typeColor'

type LayerColor = { c: ColorRgb; id: string | undefined; zInd: number }

class Color {
  s: Array<LayerColor> = []
  constructor() {}

  draw(c: ColorRgb, zInd: number, id?: string): void {
    const { s } = this
    const oldZInd = s.at(-1)?.zInd ?? 0

    if (this.s.length === 0 || oldZInd < zInd) {
      s.push({ id, c, zInd })

      return
    }

    if (oldZInd !== zInd) {
      const indexFirstZIndHigher = s.findIndex((save) => save.zInd >= zInd)

      s.splice(indexFirstZIndHigher, 0, { id, c, zInd })
    }
  }

  clear(id?: string): void {
    while (this.s.length > 0 && this.s[this.s.length - 1].id === id) {
      this.s.pop()
    }
  }
}

export default Color
