export declare module './getRenderer' {
  declare const getRenderer: (
    canvas: HTMLCanvasElement,
    options: unknown,
    pixelStarter: unknown,
  ) => {
    rescaleWindow: () => void
    resize: (width: number, height: number) => [number, number, number]
  }

  export default getRenderer
}
