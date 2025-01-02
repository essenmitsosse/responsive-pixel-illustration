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
    isRect: boolean | undefined,
    save: string | undefined,
  ) =>
    | (() => void)
    | ((args: Location) => void)
    | ((x: number, y: number) => void)
    | void
  setColorMask: (dimensions: Location, push?: boolean) => Location
} => {
  let colorArray: PixelArray

  const formSave: Record<
    string,
    { mask: Array<Array<boolean>>; save: Array<[number, number]> }
  > = {}

  const getSet =
    (color: ColorRgb, zInd: number, id?: string) =>
    (): ReturnType<PixelArray['getSet']> =>
      colorArray.getSet(color, zInd, id)

  const getClear = (id?: string) => (): ReturnType<PixelArray['getClear']> =>
    colorArray.getClear(id)

  const getSetForRect =
    (color: ColorRgb, zInd: number, id?: string) =>
    (): ReturnType<PixelArray['getSetForRect']> =>
      colorArray.getSetForRect(color, zInd, id)

  const getClearForRect =
    (id?: string) => (): ReturnType<PixelArray['getClearForRect']> =>
      colorArray.getClearForRect(id)

  const getSave =
    <TIsRect extends boolean>(name: string, isRect?: TIsRect) =>
    (): ((args: Location) => void) | ((x: number, y: number) => void) => {
      const thisSave = formSave[name]
        ? formSave[name]
        : (formSave[name] = { save: [], mask: [] })

      return isRect
        ? colorArray.getSaveForRect(thisSave.save, thisSave.mask)
        : (x: number, y: number): void => {
            thisSave.save.push([x, y])

            if (!thisSave.mask[x]) {
              thisSave.mask[x] = []
            }

            thisSave.mask[x][y] = true
          }
    }

  const getClearSave =
    (name: string, isRect?: boolean) => (): ((args: Location) => void) => {
      const thisSave = formSave[name]

      let save: Array<[number, number]> | undefined
      let mask: Array<Array<boolean>> | undefined

      if (thisSave) {
        save = thisSave.save

        mask = thisSave.mask

        return isRect
          ? colorArray.getClearSaveForRect(save, mask)
          : (): void => {}
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

    /**
     * TODO: That type is a mess and there should be a better way to handle the
     * return type of this function
     */
    setColorArray: (
      color,
      clear,
      zInd,
      id,
      isRect,
      save,
    ):
      | (() => (() => void) | ((args: Location) => void) | void)
      | (() => ((args: Location) => void) | ((x: number, y: number) => void))
      | undefined =>
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
