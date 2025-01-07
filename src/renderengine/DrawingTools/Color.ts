import type { ColorRgb } from '@/helper/typeColor'

type LayerColor = { c: ColorRgb; id: string | undefined; zInd: number }

class Color {
  s: ReadonlyArray<LayerColor> = []
  constructor() {}

  draw(c: ColorRgb, zInd: number, id?: string): void {
    const oldZInd = this.s.at(-1)?.zInd ?? 0

    if (this.s.length === 0 || oldZInd < zInd) {
      this.s = [...this.s, { id, c, zInd }]

      return
    }

    if (oldZInd !== zInd) {
      const indexFirstZIndHigher = this.s.findIndex((save) => save.zInd >= zInd)

      this.s = this.s.toSpliced(indexFirstZIndHigher, 0, { id, c, zInd })
    }
  }

  clear(id?: string): void {
    this.s = this.s.filter((save) => save.id !== id)
  }

  pop(): LayerColor | undefined {
    const last = this.s.at(-1)

    if (last) {
      this.s = this.s.toSpliced(-1)
    }

    return last
  }
}

export default Color
