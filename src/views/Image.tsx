import { useLoaderData } from 'react-router-dom'
import RenderPixel from './RenderPixel'
import type { LoaderDataPixel } from '../listConfigRouter'
import type { ImageFunction } from 'src/responsivePixel/PixelGraphics/types'
import { useEffect, useState } from 'react'

export default () => {
  const data = useLoaderData() as LoaderDataPixel
  const [imageFunction, setImageFunction] = useState<ImageFunction | null>(null)

  useEffect(() => {
    setImageFunction(null)
    async function loadImage() {
      const imageFunction = await data.promiseImageFunction
      setImageFunction(imageFunction)
    }

    loadImage()
  }, [data.promiseImageFunction])

  return <RenderPixel imageFunction={imageFunction} idImage={data.idImage} />
}
