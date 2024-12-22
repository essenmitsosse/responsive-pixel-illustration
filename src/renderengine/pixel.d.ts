export declare module './pixel' {
  declare const getPixelUnits: () => {
    Dimensions: unknown
    Height: unknown
    Position: unknown
    Width: unknown
    createSize: (args: unknown) => { getReal: () => unknown }
    init: (dimensions) => void
    linkList: (calc) => void
    pop: () => void
    push: (dimensions) => void
    setList: (listLink, listCreate, updater) => void
  }
}
