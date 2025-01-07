import type { ColorRgb } from '@/helper/typeColor'

type LayerColor = { c: ColorRgb; id: string | undefined; zInd: number }

class Color {
  s: Array<LayerColor> = []
  constructor() {}

  draw(c: ColorRgb, zInd: number, id?: string): void {
    const oldZInd = this.s.at(-1)?.zInd ?? 0

    if (this.s.length === 0 || oldZInd < zInd) {
      this.s.push({ id, c, zInd })

      return
    }

    if (oldZInd !== zInd) {
      const indexFirstZIndHigher = this.s.findIndex((save) => save.zInd >= zInd)

      this.s.splice(indexFirstZIndHigher, 0, { id, c, zInd })
    }
  }

  clear(id?: string): void {
    this.s = this.s
      .toReversed()
      .filter((save) => save.id !== id)
      .toReversed()
  }
}

export default Color
