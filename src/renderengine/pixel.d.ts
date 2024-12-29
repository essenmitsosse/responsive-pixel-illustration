import type { InputDynamicVariableBase } from '@/helper/typeSize'
import type { DynamicVariable } from '@/renderengine/Variable'

export declare module './pixel' {
  declare const getPixelUnits: () => {
    Dimensions: unknown
    Height: unknown
    Position: unknown
    Width: unknown
    createSize: (args: unknown) => { getReal: () => number }
    init: (dimensions) => void
    linkList: (calc) => void
    pop: () => void
    push: (dimensions) => void
    setList: (
      listLink: (name: string, vari: InputDynamicVariableBase) => void,
      listCreate: (name: string) => DynamicVariable,
      updater: () => void,
    ) => void
  }
}
