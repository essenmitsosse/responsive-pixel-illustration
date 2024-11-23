import { useParams } from 'react-router-dom'
import RenderPixel from './RenderPixel'
import type { ImageFunctionInput } from '../responsivePixel/PixelGraphics/types'
import { useEffect, useState } from 'react'

const Image = () => {
  const params = useParams()
  const [imageFunction, setImageFunction] = useState<
    ImageFunctionInput | null | string
  >(null)
  const idImage = params.idImage ?? 'tantalos'

  useEffect(() => {
    setImageFunction(null)
    async function loadImage() {
      import(
        /**
         * Disable warning about this dynamic import not having a file format.
         * This is due to the fact, that some file are imported directly, while
         * some are imported via a folders index file */

        /* @vite-ignore */
        `../responsivePixel/images/${idImage}`
      )
        .catch((error) => {
          setImageFunction(`${error}`)
        })
        .then((imageFunction) => setImageFunction(imageFunction.default))
    }

    loadImage()
  }, [idImage])

  if (typeof imageFunction === 'string') {
    return (
      <>
        Error while loading:
        <br />
        {imageFunction}
      </>
    )
  }

  return <RenderPixel imageFunctionInput={imageFunction} idImage={idImage} />
}

export default Image
