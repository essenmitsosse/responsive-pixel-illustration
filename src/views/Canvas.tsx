import { ReactNode, useEffect, useRef, useState } from 'react'
import {
  getRenderer,
  Redraw,
} from '../responsivePixel/PixelGraphics/getRenderer'

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
  const [redraw, setRedraw] = useState<{ redraw: Redraw } | null>(null)

  useEffect(() => {
    if (redraw === null) {
      return
    }

    redraw.redraw({
      sizeRelX: props.sizeRelX,
      sizeRelY: props.sizeRelY,
      pixelSize: props.pixelSize,
      sizeAbsXFull: props.sizeAbsXFull,
      sizeAbsYFull: props.sizeAbsYFull,
    })

    props.setIsDone !== undefined && props.setIsDone()
  }, [
    redraw,
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

    setRedraw({
      redraw: getRenderer({
        divCanvas: $canvas.current,
        pixelSize: props.pixelSize,
        imageFunction: props.imageFunction,
      }),
    })
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
