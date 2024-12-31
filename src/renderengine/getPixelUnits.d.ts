import type { InputDynamicVariable } from '@/helper/typeSize'
import type { DynamicVariable } from '@/renderengine/Variable'

export declare module './getPixelUnits' {
  const getPixelUnits: () => {
    Dimensions: unknown
    Height: unknown
    Position: unknown
    Width: unknown
    createSize: (args: InputDynamicVariable) => { getReal: () => number }
    init: (dimensions) => void
    linkList: (calc) => void
    pop: () => void
    push: (dimensions) => void
    setList: (
      listLink: (name: string, vari: { abs?: number }) => void,
      listCreate: (name: string) => DynamicVariable,
      updater: () => void,
    ) => void
  }

  export default getPixelUnits
}
