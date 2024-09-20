import { useParams } from 'react-router-dom'
import RenderPixel from './RenderPixel'
import type { ImageFunctionInput } from '../responsivePixel/PixelGraphics/types'
import { useEffect, useState } from 'react'

const Image = () => {
  const params = useParams()
  const [imageFunction, setImageFunction] = useState<ImageFunctionInput | null>(
    null,
  )
  const idImage = params.idImage ?? 'tantalos'

  useEffect(() => {
    setImageFunction(null)
    async function loadImage() {
      const imageFunction = (
        await import(`../responsivePixel/images/${idImage}`)
      ).default
      setImageFunction(imageFunction)
    }

    loadImage()
  }, [idImage])

  return <RenderPixel imageFunctionInput={imageFunction} idImage={idImage} />
}

export default Image
