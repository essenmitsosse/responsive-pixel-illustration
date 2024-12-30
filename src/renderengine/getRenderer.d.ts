export declare module './getRenderer' {
  declare const getRenderer: (
    canvas: HTMLCanvasElement,
    info: {
      change: (name: string, value: string) => void
      logInitTime: (initTime: number) => void
      logRenderTime: (draw: number, fullDuration: number) => void
    },
    options: unknown,
    pixelStarter: unknown,
  ) => {
    rescaleWindow: () => void
    resize: (width: number, height: number) => [number, number, number]
  }

  export default getRenderer
}
