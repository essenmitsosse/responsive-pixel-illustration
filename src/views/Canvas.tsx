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
}): ReactNode => {
  const $canvas = useRef<HTMLCanvasElement>(null)
  const [pixelGraphic, setPixelGraphic] = useState<PixelGraphics | null>(null)
  const [isRendered, setIsRenderedFirst] = useState<boolean>(false)

  useEffect(() => {
    if (pixelGraphic === null) {
      return
    }

    pixelGraphic.redraw({
      relSizeX: props.sizeRelX,
      relSizeY: props.sizeRelY,
      pixelSize: props.pixelSize,
      absSizeXFull: props.sizeAbsXFull,
      absSizeYFull: props.sizeAbsYFull,
    })

    if (isRendered === false) {
      setIsRenderedFirst(true)
    }
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
    setIsRenderedFirst(false)
  }, [$canvas, props.imageFunction])

  return (
    <>
      <canvas
        ref={$canvas}
        data-test="canvas"
        className="absolute h-full w-full"
      />
      {isRendered === false && <div className="absolute">Bild rendert ...</div>}
    </>
  )
}

export default Canvas
