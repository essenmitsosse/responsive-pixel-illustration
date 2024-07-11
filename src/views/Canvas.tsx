import { ReactNode, useEffect, useRef, useState } from 'react'
import { PixelGraphics } from '../responsivePixel/PixelGraphics'
import { ImageFunction } from '../responsivePixel/PixelGraphics/types'

const Canvas = (props: {
  sizeRelX: number
  sizeRelY: number
  pixelSize: number
  sizeAbsXFull: number
  sizeAbsYFull: number
  imageFunction: ImageFunction
  setIsDone?: () => void
}): ReactNode => {
  const $canvas = useRef<HTMLCanvasElement>(null)
  const [pixelGraphic, setPixelGraphic] = useState<PixelGraphics | null>(null)

  useEffect(() => {
    if (pixelGraphic === null) {
      return
    }

    pixelGraphic.redraw({
      sizeRelX: props.sizeRelX,
      sizeRelY: props.sizeRelY,
      pixelSize: props.pixelSize,
      sizeAbsXFull: props.sizeAbsXFull,
      sizeAbsYFull: props.sizeAbsYFull,
    })

    props.setIsDone !== undefined && props.setIsDone()
  }, [
    pixelGraphic,
    props.sizeAbsXFull,
    props.sizeAbsYFull,
    props.sizeRelX,
    props.sizeRelY,
    props.pixelSize,
  ])

  useEffect(() => {
    if ($canvas.current === null) {
      return
    }

    setPixelGraphic(
      new PixelGraphics({
        divCanvas: $canvas.current,
        pixelSize: props.pixelSize,
        imageFunction: props.imageFunction,
      }),
    )
  }, [$canvas, props.imageFunction])

  return (
    <>
      <canvas
        ref={$canvas}
        data-test="canvas"
        className="absolute h-full w-full"
      />
    </>
  )
}

export default Canvas
