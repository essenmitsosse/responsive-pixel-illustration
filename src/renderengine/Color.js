class Color {
  constructor() {
    this.s = []
  }

  draw(c, zInd, id) {
    let i = this.s.length - 1

    const { s } = this

    let oldZInd

    if (i === -1 || (oldZInd = s[i].zInd) < zInd) {
      s.push({ id, c, zInd })
    } else {
      if (oldZInd !== zInd) {
        do {
          if (s[i].zInd < zInd) {
            break
          }
        } while (i--)

        s.splice(i + 1, 0, { id, c, zInd })
      }
    }
  }

  clear(id) {
    while (this.s.length > 0 && this.s[this.s.length - 1].id === id) {
      this.s.pop()
    }
  }
}

export default Color
