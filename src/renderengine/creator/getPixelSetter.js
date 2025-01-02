const getPixelSetter = () => {
  let colorArray

  const formSave = {}
  const getSet = (color, zInd, id) => () => colorArray.getSet(color, zInd, id)
  const getClear = (id) => () => colorArray.getClear(id)

  const getSetForRect = (color, zInd, id) => () =>
    colorArray.getSetForRect(color, zInd, id)

  const getClearForRect = (id) => () => colorArray.getClearForRect(id)

  const getSave = (name, isRect) => () => {
    const thisSave = formSave[name] ? formSave[name] : (formSave[name] = {})
    const save = thisSave.save ? thisSave.save : (thisSave.save = [])
    const mask = thisSave.mask ? thisSave.mask : (thisSave.mask = [])

    return isRect
      ? colorArray.getSaveForRect(save, mask)
      : (x, y) => {
          save.push([x, y])

          if (!mask[x]) {
            mask[x] = []
          }

          mask[x][y] = true
        }
  }

  const getClearSave = (name, isRect) => () => {
    const thisSave = formSave[name]

    let save
    let mask

    if (thisSave) {
      save = thisSave.save

      mask = thisSave.mask

      return isRect ? colorArray.getClearSaveForRect(save, mask) : () => {}
    }
  }

  const getColorMask = (dimensions, push) =>
    colorArray.setMask(dimensions, push)

  return {
    setArray: (newArray) => {
      let key

      for (key in formSave) {
        formSave[key] = {}
      }

      colorArray = newArray
    },

    setColorArray: (color, clear, zInd, id, isRect, save) =>
      clear
        ? isRect
          ? save
            ? getClearSave(save, isRect)
            : getClearForRect(id)
          : save
            ? getClearSave(save, isRect)
            : getClear(id)
        : color
          ? isRect
            ? getSetForRect(color, zInd, id)
            : getSet(color, zInd, id)
          : save
            ? getSave(save, isRect)
            : undefined,

    setColorMask: getColorMask,

    getSave: (name) => (formSave[name] ? formSave[name].save : false),

    getMask: (name) => (formSave[name] ? formSave[name].mask : false),
  }
}

export default getPixelSetter
