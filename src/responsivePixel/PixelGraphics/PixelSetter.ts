import { HandlerPixelArray } from 'src/responsivePixel/PixelGraphics/getHandlerPixelArray'

export class PixelSetter {
  private handlePixelArray: HandlerPixelArray
  private forms: Record<string, any>

  constructor() {
    this.forms = {}
    this.handlePixelArray = {}
    this.init(this.handlePixelArray)
  }

  init(handlerPixelArray: HandlerPixelArray) {
    let key

    for (key in this.forms) {
      this.forms[key] = []
    }

    this.handlePixelArray = handlerPixelArray
  }

  getSet(color, zInd, id) {
    return () => this.handlePixelArray.getSet(color, zInd, id)
  }
  getClear(id) {
    return () => this.handlePixelArray.getClear(id)
  }
  getSetForRect(color, zInd, id) {
    return () => this.handlePixelArray.getSetForRect(color, zInd, id)
  }
  getClearForRect(id) {
    return () => this.handlePixelArray.getClearForRect(id)
  }
  getSetSave(name, isRect) {
    return () => {
      const thisSave = this.forms[name]
        ? this.forms[name]
        : (this.forms[name] = {})
      const save = thisSave.save ? thisSave.save : (thisSave.save = [])
      const mask = thisSave.mask ? thisSave.mask : (thisSave.mask = [])

      return isRect
        ? this.handlePixelArray.getSaveForRect(save, mask)
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
          ? this.handlePixelArray.getClearSaveForRect(
              thisSave.save,
              thisSave.mask,
            )
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
    return this.handlePixelArray.setMask(dimensions, push)
  }

  getSave(name) {
    return this.forms[name] ? this.forms[name].save : false
  }

  getMask(name) {
    return this.forms[name] ? this.forms[name].mask : false
  }
}
