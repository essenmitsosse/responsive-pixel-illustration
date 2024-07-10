import './RenderPixel.css'
import {
  useState,
  useRef,
  TouchEvent,
  MouseEvent,
  useEffect,
  useMemo,
} from 'react'
import { recordImage, listPairImage } from './recordImage'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  getDimensionX,
  getDimensionY,
  getSizeX,
  getSizeY,
} from './getDimension'
import { PixelGraphics } from '../responsivePixel/PixelGraphics'
import { ImageFunction } from '../responsivePixel/PixelGraphics/types'

export default (props: { idImage: string }) => {
  const [relSizeX, setRelSizeX] = useState(1)
  const [relSizeY, setRelSizeY] = useState(1)
  const [pixelSize, setPixelSize] = useState(5)
  const [searchParams, setSearchParams] = useSearchParams()
  const isResizeable = searchParams.get('resizeable') !== 'false'
  const [pixelGraphic, setPixelGraphic] = useState<PixelGraphics | null>(null)
  const [boundingClientRectWrapper, setBoundingClientRectWrapper] =
    useState<DOMRect | null>(null)
  const [imageFunction, setImageFunction] = useState<ImageFunction | null>(null)
  const [absSizeXFull, setAbsSizeXFull] = useState<number | null>(null)
  const [absSizeYFull, setAbsSizeYFull] = useState<number | null>(null)
  const [isReady, setIsReady] = useState(false)
  const $canvas = useRef<HTMLCanvasElement>(null)
  const $wrapper = useRef<HTMLDivElement>(null)
  const pixelCountMin = 50
  const pixelCount = useMemo(() => {
    return Math.round((absSizeXFull ?? 1) / pixelSize)
  }, [absSizeXFull, pixelSize])

  const onDrag = (event: MouseEvent | TouchEvent) => {
    if (
      isResizeable === false ||
      ('touches' in event && event.touches.length > 1) ||
      boundingClientRectWrapper === null
    ) {
      return
    }
    event.preventDefault()

    setRelSizeX(getDimensionX(event, boundingClientRectWrapper))
    setRelSizeY(getDimensionY(event, boundingClientRectWrapper))
  }

  const resize = () => {
    if ($wrapper.current === null) return
    setBoundingClientRectWrapper($wrapper.current.getBoundingClientRect())
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  })

  useEffect(() => {
    if (boundingClientRectWrapper === null) return
    setAbsSizeXFull(getSizeX(boundingClientRectWrapper))
    setAbsSizeYFull(getSizeY(boundingClientRectWrapper))
  }, [boundingClientRectWrapper])

  useEffect(() => {
    if (
      pixelGraphic === null ||
      absSizeXFull === null ||
      absSizeYFull === null
    ) {
      return
    }
    pixelGraphic.redraw({
      relSizeX: relSizeX,
      relSizeY: relSizeY,
      pixelSize: pixelSize,
      absSizeXFull: absSizeXFull,
      absSizeYFull: absSizeYFull,
    })
  }, [pixelGraphic, absSizeXFull, absSizeYFull, relSizeX, relSizeY, pixelSize])

  useEffect(() => {
    if ($canvas.current === null || imageFunction === null) {
      return
    }
    resize()
    setPixelGraphic(
      new PixelGraphics({
        divCanvas: $canvas.current,
        pixelSize: pixelSize,
        imageFunction: imageFunction,
      }),
    )
    setIsReady(true)
  }, [$canvas, imageFunction])

  const setPixelCount = (pixelCount) => {
    setPixelSize((absSizeXFull ?? 1) / pixelCount)
  }

  useEffect(() => {
    recordImage[props.idImage]
      .getImage()
      .then((imageFunctionExport) =>
        setImageFunction(imageFunctionExport.default),
      )
  }, [props.idImage])

  const navigate = useNavigate()
  const setIdImage = (idImageNew: string) => {
    navigate(`/${idImageNew}`)
  }

  const setIsResizeable = (isResizable: boolean) => {
    setSearchParams(isResizable ? {} : { resizeable: 'false' })
  }

  return (
    <div className="flex h-screen flex-col">
      {isReady ? null : 'Bild lädt ...'}
      <div
        className="relative h-full w-full"
        ref={$wrapper}
        onMouseMove={onDrag}
        onTouchMove={onDrag}
      >
        <canvas
          ref={$canvas}
          className="absolute h-full w-full"
          data-test="canvas"
        />
      </div>
      <form className="grid w-full grid-cols-3 lg:grid-cols-6 grid-rows-[repeat(3,min-content)] gap-x-4 gap-y-2 p-4">
        <label className="grid grid-rows-subgrid row-span-3">
          <span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
            Select Image
          </span>
          <div className="relative">
            <select
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-1 px-4 pr-8  focus:border-gray-800 focus:outline-none dark:border-gray-600 dark:bg-gray-700 focus:dark:border-gray-300"
              value={props.idImage}
              onChange={(event) => setIdImage(event.currentTarget.value)}
              data-test="input-id-image"
            >
              {listPairImage.map(([id, image]) => (
                <option value={id} key={id}>
                  {image.niceName}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label className="grid grid-rows-subgrid row-span-3">
          <span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
            Width
          </span>
          <div className="justify-center">
            <input
              className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300"
              value={relSizeX}
              onInput={(event) =>
                setRelSizeX(parseFloat(event.currentTarget.value))
              }
              type="range"
              min="0"
              max="1"
              step="0.0001"
              data-test="input-size-x"
            />
          </div>
          <span className="text-xs font-mono font-light opacity-50">
            {Math.round(relSizeX * 100)}%
          </span>
        </label>
        <label className="grid grid-rows-subgrid row-span-3">
          <span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
            Height
          </span>
          <div className="justify-center">
            <input
              className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300"
              value={relSizeY}
              onInput={(event) =>
                setRelSizeY(parseFloat(event.currentTarget.value))
              }
              type="range"
              min="0"
              max="1"
              step="0.0001"
              data-test="input-size-y"
            />
          </div>
          <span className="text-xs font-mono font-light opacity-50">
            {Math.round(relSizeY * 100)}%
          </span>
        </label>
        <label className="grid grid-rows-subgrid row-span-3">
          <span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
            Pixel Size
          </span>
          <div className="justify-center">
            <input
              className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300 "
              value={pixelSize}
              onInput={(event) =>
                setPixelSize(parseFloat(event.currentTarget.value))
              }
              type="range"
              min="2"
              max="30"
              step="1"
              data-test="input-size-pixel"
            />
          </div>
          <span className="text-xs font-mono font-light opacity-50">
            {Math.round(pixelSize)}px
          </span>
        </label>
        <label className="grid grid-rows-subgrid row-span-3">
          <span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
            Pixel Count
          </span>
          <div className="justify-center">
            <input
              className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300"
              value={pixelCount}
              onInput={(event) =>
                setPixelCount(parseFloat(event.currentTarget.value))
              }
              type="range"
              min={pixelCountMin}
              max={absSizeXFull ?? 1}
              step="1"
              data-test="input-quantity-pixel"
            />
          </div>
          <span className="text-xs font-mono font-light opacity-50">
            {Math.round(pixelCount)}px / {Math.round(absSizeXFull ?? 1)}px
          </span>
        </label>
        <label className="grid grid-rows-subgrid row-span-3">
          <span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
            Resize on Hover
          </span>
          <div className="justify-center">
            <input
              className="form-checkbox mt-2 block h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 bg-gray-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
              checked={isResizeable}
              onChange={() => setIsResizeable(!isResizeable)}
              type="checkbox"
              data-test="input-is-resizeable"
            />
          </div>
        </label>
      </form>
    </div>
  )
}
