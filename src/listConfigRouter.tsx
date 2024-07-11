import type { RouteObject } from 'react-router-dom'
import type { ImageFunction } from './responsivePixel/PixelGraphics/types'
import Image from './views/Image'

export type LoaderDataPixel = {
  promiseImageFunction: Promise<ImageFunction>
  idImage?: string
}

const makeGetImageFunction = async (idImage: string) =>
  (await import(`./responsivePixel/images/${idImage}.ts`)).default

const loaderIdImage = (args: { params: { idImage?: string } }) => {
  const idImage = args.params.idImage ?? 'tantalos'
  return { idImage }
}

const loaderImage = async (args: {
  params: { idImage?: string }
}): Promise<LoaderDataPixel> => {
  const idImage = args.params.idImage ?? 'tantalos'
  return {
    promiseImageFunction: makeGetImageFunction(idImage),
    idImage: loaderIdImage(args).idImage,
  }
}

const listConfigRouter: Array<RouteObject> = [
  {
    index: true,
    element: <Image />,
    loader: loaderImage,
  },
  {
    path: ':idImage',
    element: <Image />,
    loader: loaderImage,
  },
]

export default listConfigRouter
