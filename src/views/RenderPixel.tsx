import {
  useState,
  useRef,
  TouchEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import { recordImage, listPairImage } from './recordImage'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  getDimensionX,
  getDimensionY,
  getSizeX,
  getSizeY,
} from './getDimension'
import { ImageFunction } from '../responsivePixel/PixelGraphics/types'
import Canvas from './Canvas'

const recordStateImage = {
  LOADING: 'Image Loading …',
  RENDERING: 'Image Rendering …',
  DONE: '',
} as const

export default (props: {
  imageFunction: ImageFunction | null
  idImage?: string
}) => {
  const [sizeRelX, setSizeRelX] = useState(1)
  const [sizeRelY, setSizeRelY] = useState(1)
  const [sizePixel, setSizePixel] = useState(5)
  const [searchParams, setSearchParams] = useSearchParams()
  const isResizeable = searchParams.get('resizeable') !== 'false'
  const [boundingClientRectWrapper, setBoundingClientRectWrapper] =
    useState<DOMRect | null>(null)
  const [sizeAbsXFull, setSizeAbsXFull] = useState<number | null>(null)
  const [sizeAbsYFull, setSizeAbsYFull] = useState<number | null>(null)
  const [isDoneRendering, setIsDoneRendering] = useState<boolean>(true)

  const idStateFinal: keyof typeof recordStateImage =
    props.imageFunction === null
      ? 'LOADING'
      : isDoneRendering
        ? 'DONE'
        : 'RENDERING'

  const $wrapper = useRef<HTMLDivElement>(null)
  const quantityPixelMin = 50
  const quantityPixel = useMemo(() => {
    return Math.round((sizeAbsXFull ?? 1) / sizePixel)
  }, [sizeAbsXFull, sizePixel])

  const onDrag = (args: {
    isPassive: boolean
    event: MouseEvent | TouchEvent
  }) => {
    if (
      isResizeable === false ||
      ('touches' in args.event && args.event.touches.length > 1) ||
      boundingClientRectWrapper === null
    ) {
      return
    }

    /** We can't `preventDefault` on a touch event — this would throw an error */
    if (!args.isPassive) {
      args.event.preventDefault()
    }

    setSizeRelX(getDimensionX(args.event, boundingClientRectWrapper))
    setSizeRelY(getDimensionY(args.event, boundingClientRectWrapper))
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
    setSizeAbsXFull(getSizeX(boundingClientRectWrapper))
    setSizeAbsYFull(getSizeY(boundingClientRectWrapper))
  }, [boundingClientRectWrapper])

  const setQuantityPixel = (quantityPixel: number) => {
    setSizePixel((sizeAbsXFull ?? 1) / quantityPixel)
  }

  useEffect(() => {
    setIsDoneRendering(false)
    resize()
  }, [props.imageFunction])

  const navigate = useNavigate()
  const setIdImage = (idImageNew: string) => {
    navigate(`/${idImageNew}`)
  }

  const setIsResizeable = (isResizable: boolean) => {
    setSearchParams(isResizable ? {} : { resizeable: 'false' })
  }

  return (
    <div className="flex h-screen flex-col">
      <div
        className="relative h-full w-full"
        ref={$wrapper}
        onMouseMove={(event) => onDrag({ isPassive: false, event })}
        onTouchMove={(event) => onDrag({ isPassive: true, event })}
      >
        {props.imageFunction !== null &&
          sizeAbsXFull !== null &&
          sizeAbsYFull !== null && (
            <Canvas
              imageFunction={props.imageFunction}
              sizeAbsXFull={sizeAbsXFull}
              sizeAbsYFull={sizeAbsYFull}
              pixelSize={sizePixel}
              sizeRelX={sizeRelX}
              sizeRelY={sizeRelY}
              setIsDone={() => setIsDoneRendering(true)}
            />
          )}
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
          <span
            className="text-xs font-mono font-light opacity-50"
            data-test="image-state"
            data-image-state={idStateFinal}
            data-image={idStateFinal === 'DONE' ? props.idImage : undefined}
          >
            {recordStateImage[idStateFinal]}
          </span>
        </label>
        <label className="grid grid-rows-subgrid row-span-3">
          <span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
            Width
          </span>
          <div className="justify-center">
            <input
              className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300"
              value={sizeRelX}
              onInput={(event) =>
                setSizeRelX(parseFloat(event.currentTarget.value))
              }
              type="range"
              min="0"
              max="1"
              step="0.0001"
              data-test="input-size-x"
            />
          </div>
          <span className="text-xs font-mono font-light opacity-50">
            {Math.round(sizeRelX * 100)}%
          </span>
        </label>
        <label className="grid grid-rows-subgrid row-span-3">
          <span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
            Height
          </span>
          <div className="justify-center">
            <input
              className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300"
              value={sizeRelY}
              onInput={(event) =>
                setSizeRelY(parseFloat(event.currentTarget.value))
              }
              type="range"
              min="0"
              max="1"
              step="0.0001"
              data-test="input-size-y"
            />
          </div>
          <span className="text-xs font-mono font-light opacity-50">
            {Math.round(sizeRelY * 100)}%
          </span>
        </label>
        <label className="grid grid-rows-subgrid row-span-3">
          <span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
            Pixel Size
          </span>
          <div className="justify-center">
            <input
              className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300 "
              value={sizePixel}
              onInput={(event) =>
                setSizePixel(parseFloat(event.currentTarget.value))
              }
              type="range"
              min="2"
              max="30"
              step="1"
              data-test="input-size-pixel"
            />
          </div>
          <span className="text-xs font-mono font-light opacity-50">
            {Math.round(sizePixel)}px
          </span>
        </label>
        <label className="grid grid-rows-subgrid row-span-3">
          <span className="inline-block pb-2 text-xs font-bold uppercase tracking-wide">
            Pixel Count
          </span>
          <div className="justify-center">
            <input
              className="h-0.5 w-full appearance-none rounded bg-gray-700 dark:bg-gray-300"
              value={quantityPixel}
              onInput={(event) =>
                setQuantityPixel(parseFloat(event.currentTarget.value))
              }
              type="range"
              min={quantityPixelMin}
              max={sizeAbsXFull ?? 1}
              step="1"
              data-test="input-quantity-pixel"
            />
          </div>
          <span className="text-xs font-mono font-light opacity-50">
            {Math.round(quantityPixel)}px / {Math.round(sizeAbsXFull ?? 1)}px
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
