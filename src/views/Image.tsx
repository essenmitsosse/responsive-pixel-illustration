import { useParams } from 'react-router-dom'
import RenderPixel from './RenderPixel'
import type { ImageFunction } from '../responsivePixel/PixelGraphics/types'
import { useEffect, useState } from 'react'

const Image = () => {
  const params = useParams()
  const [imageFunction, setImageFunction] = useState<ImageFunction | null>(null)
  const idImage = params.idImage ?? 'tantalos'

  useEffect(() => {
    setImageFunction(null)
    async function loadImage() {
      const imageFunction = (
        await import(`../responsivePixel/images/${idImage}.ts`)
      ).default
      setImageFunction(imageFunction)
    }

    loadImage()
  }, [idImage])

  return <RenderPixel imageFunction={imageFunction} idImage={idImage} />
}

export default Image
