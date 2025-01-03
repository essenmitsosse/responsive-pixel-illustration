import type { Location, PixelArray } from './createPixelArray'
import type { ColorRgb } from '@/helper/typeColor'

const getPixelSetter = (): {
  getMask: (name: string) => Array<Array<boolean>> | false
  getSave: (name: string) => Array<[number, number]> | false
  setArray: (newArray: PixelArray) => void
  setColorArray: (arg: {
    clear?: boolean
    color?: ColorRgb
    id?: string
    save?: string
    zInd?: number
  }) => ((x: number, y: number) => void) | undefined
  setColorArrayRect: (args: {
    clear?: boolean
    color?: ColorRgb
    id?: string
    save?: string
    zInd?: number
  }) => ((args: Location) => void) | undefined
  setColorMask: (dimensions: Location, push?: boolean) => Location
} => {
  let colorArray: PixelArray

  const formSave: Record<
    string,
    { mask: Array<Array<boolean>>; save: Array<[number, number]> }
  > = {}

  const getSet =
    (color: ColorRgb, zInd: number, id?: string) =>
    (x: number, y: number): void =>
      colorArray.getSet({ color, zInd, id, x, y })

  const getClear =
    (id?: string) =>
    (x: number, y: number): void =>
      colorArray.getClear({ id, x, y })

  const getSetRect =
    (color: ColorRgb, zInd: number, id?: string) =>
    (args: Location): void =>
      colorArray.getSetForRect(color, zInd, id, args)

  const getClearRect =
    (id?: string) =>
    (args: Location): void =>
      colorArray.getClearForRect(id, args)

  const getSaver =
    (name: string): ((x: number, y: number) => void) =>
    (x: number, y: number): void => {
      const thisSave = formSave[name]
        ? formSave[name]
        : (formSave[name] = { save: [], mask: [] })

      thisSave.save.push([x, y])

      if (!thisSave.mask[x]) {
        thisSave.mask[x] = []
      }

      thisSave.mask[x][y] = true
    }

  const getSaverForRect =
    (name: string): ((args: Location) => void) =>
    (args) => {
      const thisSave = formSave[name]
        ? formSave[name]
        : (formSave[name] = { save: [], mask: [] })

      return colorArray.getSaveForRect(thisSave.save, thisSave.mask, args)
    }

  const getClearSave = (): (() => void) => (): void => {}

  const getClearSaveRect = (name: string): ((args: Location) => void) => {
    const thisSave = formSave[name]

    return thisSave
      ? (args): void =>
          colorArray.getClearSaveForRect(thisSave.save, thisSave.mask, args)
      : (): void => {}
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

    setColorArray: (args): ((x: number, y: number) => void) | undefined =>
      args.clear
        ? args.save
          ? getClearSave()
          : getClear(args.id)
        : args.color
          ? getSet(args.color, args.zInd ?? 0, args.id)
          : args.save
            ? getSaver(args.save)
            : undefined,

    setColorArrayRect: (args): ((args: Location) => void) | undefined =>
      args.clear
        ? args.save
          ? getClearSaveRect(args.save)
          : getClearRect(args.id)
        : args.color
          ? getSetRect(args.color, args.zInd ?? 0, args.id)
          : args.save
            ? getSaverForRect(args.save)
            : undefined,

    setColorMask: getColorMask,

    getSave: (name) => (formSave[name] ? formSave[name].save : false),

    getMask: (name) => (formSave[name] ? formSave[name].mask : false),
  }
}

export default getPixelSetter
