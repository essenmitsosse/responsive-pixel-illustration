import type { Location, PixelArray } from './createPixelArray'
import type { ColorRgb } from '@/helper/typeColor'

const getPixelSetter = (): {
  getMask: (name: string) => Array<Array<boolean>> | false
  getSave: (name: string) => Array<[number, number]> | false
  setArray: (newArray: PixelArray) => void
  setColorArray: (
    color: ColorRgb | undefined,
    clear: boolean | undefined,
    zInd: number,
    id: string | undefined,
    save: string | undefined,
  ) => ((x: number, y: number) => void) | undefined
  setColorArrayRect: (
    color: ColorRgb | undefined,
    clear: boolean | undefined,
    zInd: number,
    id: string | undefined,
    save: string | undefined,
  ) => ((args: Location) => void) | undefined
  setColorMask: (dimensions: Location, push?: boolean) => Location
} => {
  let colorArray: PixelArray

  const formSave: Record<
    string,
    { mask: Array<Array<boolean>>; save: Array<[number, number]> }
  > = {}

  const getSet =
    (
      color: ColorRgb,
      zInd: number,
      id?: string,
    ): (() => (x: number, y: number) => void) =>
    () =>
      colorArray.getSet(color, zInd, id)

  const getClear =
    (id?: string): (() => (x: number, y: number) => void) =>
    () =>
      colorArray.getClear(id)

  const getSetRect =
    (
      color: ColorRgb,
      zInd: number,
      id?: string,
    ): (() => (args: Location) => void) =>
    () =>
      colorArray.getSetForRect(color, zInd, id)

  const getClearRect =
    (id?: string): (() => (args: Location) => void) =>
    () =>
      colorArray.getClearForRect(id)

  const getSaver =
    (name: string): (() => (x: number, y: number) => void) =>
    () => {
      const thisSave = formSave[name]
        ? formSave[name]
        : (formSave[name] = { save: [], mask: [] })

      return (x: number, y: number): void => {
        thisSave.save.push([x, y])

        if (!thisSave.mask[x]) {
          thisSave.mask[x] = []
        }

        thisSave.mask[x][y] = true
      }
    }

  const getSaverForRect =
    (name: string): (() => (args: Location) => void) =>
    () => {
      const thisSave = formSave[name]
        ? formSave[name]
        : (formSave[name] = { save: [], mask: [] })

      return colorArray.getSaveForRect(thisSave.save, thisSave.mask)
    }

  const getClearSave = (): (() => () => void) => () => (): void => {}

  const getClearSaveRect =
    (name: string): (() => (args: Location) => void) =>
    () => {
      const thisSave = formSave[name]

      let save: Array<[number, number]> | undefined
      let mask: Array<Array<boolean>> | undefined

      if (thisSave) {
        save = thisSave.save

        mask = thisSave.mask

        return colorArray.getClearSaveForRect(save, mask)
      }

      return (): void => {}
    }

  const getColorMask = (dimensions: Location, push?: boolean): Location =>
    colorArray.setMask(dimensions, push)

  return {
    setArray: (newArray: PixelArray): void => {
      let key: string

      for (key in formSave) {
        formSave[key] = { save: [], mask: [] }
      }

      colorArray = newArray
    },

    setColorArray: (
      color,
      clear,
      zInd,
      id,
      save,
    ): (() => (x: number, y: number) => void) | undefined =>
      clear
        ? save
          ? getClearSave()
          : getClear(id)
        : color
          ? getSet(color, zInd, id)
          : save
            ? getSaver(save)
            : undefined,

    setColorArrayRect: (
      color,
      clear,
      zInd,
      id,
      save,
    ): (() => (args: Location) => void) | undefined =>
      clear
        ? save
          ? getClearSaveRect(save)
          : getClearRect(id)
        : color
          ? getSetRect(color, zInd, id)
          : save
            ? getSaverForRect(save)
            : undefined,

    setColorMask: getColorMask,

    getSave: (name) => (formSave[name] ? formSave[name].save : false),

    getMask: (name) => (formSave[name] ? formSave[name].mask : false),
  }
}

export default getPixelSetter
