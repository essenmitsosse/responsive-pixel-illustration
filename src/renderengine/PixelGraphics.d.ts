export declare module './PixelGraphics' {
  class PixelGraphics {
    constructor(renderer: unknown)

    callback(canvas: HTMLCanvasElement): {
      redraw: (renderObject: Record<string, unknown>) => void
      resize: () => void
    }
  }
}
