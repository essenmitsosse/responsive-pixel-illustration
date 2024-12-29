export declare module './renderer' {
  class Renderer {
    constructor(
      canvas: HTMLCanvasElement,
      info: {
        change: (name: string, value: string) => void
        logInitTime: (initTime: number) => void
        logRenderTime: (draw: number, fullDuration: number) => void
      },
      options: unknown,
      pixelStarter: unknown,
    ): unknown

    resize(width: number, height: number): [number, number, number]

    rescaleWindow(): void
  }
}
