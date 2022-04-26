export class PixelSetter {
  private colorArray: Array<any>
  private forms: Record<string, any>

  constructor() {
    this.forms = {}
    this.colorArray = []
    this.init(this.colorArray)
  }

  init(newArray) {
    let key

    for (key in this.forms) {
      this.forms[key] = []
    }

    this.colorArray = newArray
  }

  getSet(color, zInd, id) {
    return () => this.colorArray.getSet(color, zInd, id)
  }
  getClear(id) {
    return () => this.colorArray.getClear(id)
  }
  getSetForRect(color, zInd, id) {
    return () => this.colorArray.getSetForRect(color, zInd, id)
  }
  getClearForRect(id) {
    return () => this.colorArray.getClearForRect(id)
  }
  getSetSave(name, isRect) {
    return () => {
      const thisSave = this.forms[name]
        ? this.forms[name]
        : (this.forms[name] = {})
      const save = thisSave.save ? thisSave.save : (thisSave.save = [])
      const mask = thisSave.mask ? thisSave.mask : (thisSave.mask = [])

      return isRect
        ? this.colorArray.getSaveForRect(save, mask)
        : function (x, y) {
            save.push([x, y])

            if (!mask[x]) {
              mask[x] = []
            }
            mask[x][y] = true
          }
    }
  }

  getClearSave(name, isRect) {
    return () => {
      const thisSave = this.forms[name]

      if (thisSave) {
        return isRect
          ? this.colorArray.getClearSaveForRect(thisSave.save, thisSave.mask)
          : () => {}
      }
    }
  }

  setColorArray(color, clear, zInd, id, isRect, save) {
    return clear
      ? isRect
        ? save
          ? this.getClearSave(save, isRect)
          : this.getClearForRect(id)
        : save
          ? this.getClearSave(save, isRect)
          : this.getClear(id)
      : color
        ? isRect
          ? this.getSetForRect(color, zInd, id)
          : this.getSet(color, zInd, id)
        : save
          ? this.getSetSave(save, isRect)
          : undefined
  }

  setColorMask(dimensions, push) {
    return this.colorArray.setMask(dimensions, push)
  }

  getSave(name) {
    return this.forms[name] ? this.forms[name].save : false
  }

  getMask(name) {
    return this.forms[name] ? this.forms[name].mask : false
  }
}
